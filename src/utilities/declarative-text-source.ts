import { dedent } from "./code.js";
import { resolveComponentSourceUrl } from "./source-url.js";

export type TpDeclarativeTextSourceOptions = {
	scriptTypes: readonly string[];
	textContentFallback?: boolean;
	/** Generated UI subtrees that must never become author content. */
	ignoreSelector?: string;
};

/**
 * Reads and preserves textual component content declared either in an inline
 * script or through `src`. The observer handles custom elements upgraded while
 * the HTML parser is still adding their children.
 */
export class TpDeclarativeTextSource {
	private snapshot: string | null = null;
	private onInlineSource: (() => void) | null = null;
	private readonly observer = new MutationObserver(() => {
		if (!this.capture()) return;
		this.observer.disconnect();
		this.onInlineSource?.();
	});

	public constructor(
		private readonly host: HTMLElement,
		private readonly options: TpDeclarativeTextSourceOptions,
	) {
		if (options.scriptTypes.some((type) => !type.startsWith("tp/"))) {
			throw new TypeError(
				'Declarative component script types must begin with "tp/".',
			);
		}
	}

	/** Starts watching for an inline script that the HTML parser may add later. */
	public observe(onInlineSource: () => void): void {
		this.onInlineSource = onInlineSource;
		if ((this.host.getAttribute("src") ?? "").trim() !== "") return;
		if ((this.host.getAttribute("value") ?? "").trim() !== "") return;
		if (this.capture()) return;
		this.observer.observe(this.host, {
			childList: true,
			characterData: true,
			subtree: true,
		});
	}

	/** Captures author content before the host replaces its light DOM. */
	public capture(): boolean {
		if (this.snapshot !== null) return true;
		const acceptedTypes = new Set(this.options.scriptTypes);
		const script = Array.from(this.host.querySelectorAll("script")).find(
			(candidate) =>
				acceptedTypes.has(candidate.type) &&
				(!this.options.ignoreSelector ||
					!candidate.closest(this.options.ignoreSelector)),
		);
		const inline =
			script?.textContent ??
			(this.options.textContentFallback === true ? this.authorText() : null);
		if (inline === null || inline.trim() === "") return false;
		this.snapshot = dedent(inline);
		return true;
	}

	/** Reads text while excluding explicitly marked generated controls and output. */
	private authorText(): string {
		const selector = this.options.ignoreSelector;
		if (!selector) return this.host.textContent ?? "";
		const walker = this.host.ownerDocument.createTreeWalker(
			this.host,
			NodeFilter.SHOW_TEXT,
		);
		let text = "";
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			if (!node.parentElement?.closest(selector))
				text += node.textContent ?? "";
		}
		return text;
	}

	/** Returns the preserved inline source, if one has been captured. */
	public get inlineSource(): string | null {
		this.capture();
		return this.snapshot;
	}

	/** Reads the host using the common `src`, `value`, script, text precedence. */
	public async read(init?: RequestInit): Promise<string> {
		const rawSrc = (this.host.getAttribute("src") ?? "").trim();
		if (rawSrc === "") {
			const value = this.host.getAttribute("value") ?? "";
			return value.trim() === "" ? (this.inlineSource ?? "") : value;
		}

		const sourceUrl = resolveComponentSourceUrl(this.host, rawSrc);
		const response = await fetch(sourceUrl.href, init);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch "${rawSrc}" (${String(response.status)})`,
			);
		}
		return await response.text();
	}

	public disconnect(): void {
		this.observer.disconnect();
		this.onInlineSource = null;
	}
}
