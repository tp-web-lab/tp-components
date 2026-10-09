/**
 * @module components/skeleton
 * @summary Static HTML structure previews.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./skeleton.css?inline";

/** Elements represented by a fixed visual pattern without inspecting their children. */
const leaves = new Set([
	"p",
	"ul",
	"ol",
	"dl",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"blockquote",
	"figure",
	"nav",
	"table",
]);

/**
 * @summary Renders selected HTML elements as fixed shaded skeleton patterns without executing the source.
 * @tagname tp-skeleton
 * @attr {string} src = "" - HTML source URL, taking precedence over value and inline scripts.
 * @attr {string} value = "" - HTML source string, taking precedence over an inline script.
 * @attr {string} label = "Content layout preview" - Accessible description of the skeleton.
 * @accessibility Exposes one labelled static image, hiding decorative shapes from assistive technology.
 * @example
 * <tp-skeleton label="Article layout preview">
 *   <script type="tp/html">
 *     <main>
 *       <nav>Home · Articles · About</nav>
 *       <h1>Building accessible interfaces</h1>
 *       <p>An introduction to the article.</p>
 *       <figure><img src="portrait.jpg" alt="Portrait"><figcaption>Caption</figcaption></figure>
 *       <h2>Key ideas</h2>
 *       <ul><li>Clear structure</li><li>Consistent interactions</li></ul>
 *       <table><tr><th>Feature</th><th>Status</th></tr><tr><td>Keyboard</td><td>Ready</td></tr></table>
 *       <blockquote>A useful quotation.</blockquote>
 *     </main>
 *   </script>
 * </tp-skeleton>
 */
export class TpSkeleton extends TpBase {
	/** Shared source acquisition with src, value and script precedence. */
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/html", "tp/skeleton"],
	});
	/** Cancels source and iframe requests when rendering becomes obsolete. */
	private controller: AbortController | null = null;
	/** Monotonic render generation that prevents stale asynchronous updates. */
	private generation = 0;
	/** Source and accessible-name attributes. */
	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "src", "value", "label"];
	}
	/** HTML file URL.
	 * @attr src
	 * @default ""
	 */
	public get src(): string {
		return this.getAttribute("src")?.trim() ?? "";
	}
	/** Sets the HTML file URL. */
	public set src(value: string) {
		this.setStringAttribute("src", value);
	}
	/** Literal HTML source.
	 * @attr value
	 * @default ""
	 */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}
	/** Sets the literal HTML source. */
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}
	/** Accessible description.
	 * @attr label
	 * @default "Content layout preview"
	 */
	public get label(): string {
		return this.getAttribute("label")?.trim() || "Content layout preview";
	}
	/** Sets the accessible description. */
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}
	/** Installs styles and captures scripts even when parsed after connection. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-skeleton-styles", style);
		this.source.observe(() => {
			void this.render();
		});
		queueMicrotask(() => {
			if (this.isConnected) void this.render();
		});
	}
	/** Cancels pending work and stops observing author content. */
	protected disconnectedCallback(): void {
		this.source.disconnect();
		this.controller?.abort();
		this.generation += 1;
	}
	/** Refreshes source or label changes once connected. */
	protected override attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue !== newValue && this.isConnected) void this.render();
	}
	/** Builds an inert template: author nodes are never inserted into the live page. */
	private parse(html: string): DocumentFragment {
		const template = document.createElement("template");
		template.innerHTML = html;
		return template.content;
	}
	/** Creates one fixed visual pattern, independent of author text and descendants. */
	private pattern(tag: string): HTMLElement {
		const block = document.createElement("div");
		block.className = "tp-skeleton-block";
		block.dataset.kind = tag;
		const count =
			tag === "table"
				? 12
				: tag === "dl"
					? 4
					: tag === "figure"
						? 2
						: /^h[1-6]$/.test(tag)
							? 1
							: 3;
		Array.from({ length: count }).forEach(() => {
			const bar = document.createElement("span");
			bar.className = "tp-skeleton-bar";
			block.append(bar);
		});
		return block;
	}
	/** Walks only main and iframe containers; all other unselected subtrees are skipped. */
	private async walk(
		parent: ParentNode,
		base: string,
		signal: AbortSignal,
		depth = 0,
		visited = new Set<string>(),
	): Promise<DocumentFragment> {
		const output = document.createDocumentFragment();
		for (const element of Array.from(parent.children)) {
			if (signal.aborted) break;
			const tag = element.localName;
			if (leaves.has(tag)) {
				output.append(this.pattern(tag));
			} else if (tag === "main" && depth < 8) {
				const container = document.createElement("div");
				container.className = "tp-skeleton-main";
				container.dataset.kind = "main";
				container.append(
					await this.walk(element, base, signal, depth + 1, visited),
				);
				output.append(container);
			} else if (tag === "iframe") {
				const frame = document.createElement("div");
				frame.className = "tp-skeleton-frame";
				frame.dataset.kind = "iframe";
				if (depth < 8) {
					const nested = await this.frameSource(element, base, signal, visited);
					if (nested)
						frame.append(
							await this.walk(
								this.parse(nested.html),
								nested.base,
								signal,
								depth + 1,
								nested.visited,
							),
						);
				}
				if (!frame.childElementCount) frame.append(this.pattern("figure"));
				output.append(frame);
			}
		}
		return output;
	}
	/** Reads iframe HTML without creating a browsing context or executing its scripts. */
	private async frameSource(
		element: Element,
		base: string,
		signal: AbortSignal,
		visited: Set<string>,
	): Promise<{ html: string; base: string; visited: Set<string> } | null> {
		if (element.hasAttribute("srcdoc"))
			return { html: element.getAttribute("srcdoc") ?? "", base, visited };
		const src = element.getAttribute("src")?.trim();
		if (!src) return null;
		try {
			const url = new URL(src, base);
			url.hash = "";
			if (
				!["http:", "https:"].includes(url.protocol) ||
				url.origin !== new URL(this.ownerDocument.baseURI).origin ||
				visited.has(url.href)
			)
				return null;
			const response = await fetch(url.href, { signal, mode: "same-origin" });
			if (!response.ok) return null;
			return {
				html: await response.text(),
				base: response.url || url.href,
				visited: new Set([...visited, url.href]),
			};
		} catch {
			return null;
		}
	}
	/** Displays a readable status inside the same shaded rectangle as a heading. */
	private showMessage(message: string): void {
		const block = this.pattern("h1");
		block.classList.add("tp-skeleton-message");
		block.setAttribute("role", "status");
		const bar = block.firstElementChild;
		if (bar) bar.textContent = message;
		this.replaceChildren(block);
		this.setAttribute("data-rendered", "");
	}

	/** Resolves the source and atomically publishes only the latest completed preview. */
	private async render(): Promise<void> {
		const generation = ++this.generation;
		this.controller?.abort();
		const controller = new AbortController();
		this.controller = controller;
		this.removeAttribute("data-rendered");
		try {
			const html = await this.source.read({ signal: controller.signal });
			if (generation !== this.generation || !this.isConnected) return;
			if (html.trim() === "") {
				this.showMessage("No HTML source provided.");
				return;
			}
			const base = this.src
				? resolveComponentSourceUrl(this, this.src).href
				: getComponentSourceBaseUrl(this);
			const output = document.createElement("div");
			output.className = "tp-skeleton-output";
			output.setAttribute("role", "img");
			output.setAttribute("aria-label", this.label);
			const shapes = document.createElement("div");
			shapes.setAttribute("aria-hidden", "true");
			shapes.append(
				await this.walk(
					this.parse(html),
					base,
					controller.signal,
					0,
					new Set([base]),
				),
			);
			output.append(shapes);
			if (generation !== this.generation || !this.isConnected) return;
			if (!shapes.querySelector(".tp-skeleton-bar")) {
				this.showMessage("No supported HTML content found.");
				return;
			}
			this.replaceChildren(output);
			this.setAttribute("data-rendered", "");
		} catch (error) {
			if (generation !== this.generation || !this.isConnected) return;
			const reason = error instanceof Error ? error.message : String(error);
			this.showMessage(`Unable to load HTML. ${reason}`);
		}
	}
}

// Repeated imports must not redefine the custom element.
if (!customElements.get("tp-skeleton"))
	customElements.define("tp-skeleton", TpSkeleton);

declare global {
	/** Typed DOM creation and queries for skeleton previews. */
	interface HTMLElementTagNameMap {
		"tp-skeleton": TpSkeleton;
	}
}
