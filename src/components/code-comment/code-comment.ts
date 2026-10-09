/** @module components/code-comment */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import "../code-editor/code-editor.js";
import "../icon/icon.js";
import "../callout/callout.js";
import style from "./code-comment.css?inline";

/**
 * @summary associates an ordered annotation list with numbered comments in a code editor.
 * @tagname tp-code-comment
 * @attr {string} for = "" - Exact ID, without #, of the tp-code-editor to annotate.
 * @attr {boolean} open = false - Show the explanation list; code markers and tooltips remain available when absent.
 * @accessibility Preserves the ordered-list semantics and names each code marker by its number.
 * @example
 * <tp-code-editor id="commented-function" language="typescript">
 *   <script type="tp/typescript">
 *     function f(x: number): number {
 *       if (x > 0) { return 2 * x; } // <1>
 *       else { return 4 * x; } // <2>
 *     }
 *   </script>
 * </tp-code-editor>
 * <tp-code-comment for="commented-function">
 *   <ol>
 *     <li>Positive values are doubled.</li>
 *     <li>Zero and negative values are multiplied by four.</li>
 *   </ol>
 * </tp-code-comment>
 */
export class TpCodeComment extends TpBase {
	/** Editor currently receiving this list's marker numbers. */
	private target: TpCodeEditor | null = null;
	/** Original ordered-list entries, never cloned or replaced. */
	private items: HTMLLIElement[] = [];
	/** Generated icons owned by this component. */
	private readonly icons = new Map<HTMLLIElement, HTMLElement>();
	/** Inline configuration warning; never inserted into the author list. */
	private status: HTMLElement | null = null;
	/** Tracks late editor insertion, ID changes and list edits without reacting to icon rendering. */
	private readonly observer = new MutationObserver(() => this.sync());
	/** Attributes affecting the editor association. */
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "for"];
	}
	/** Exact editor ID; this is not a CSS selector. */
	public get htmlFor(): string {
		return this.getAttribute("for") ?? "";
	}
	/** Changes the associated editor. */
	public set htmlFor(value: string) {
		this.setAttribute("for", value);
	}
	/** Whether the explanation list is visible, independently of editor tooltips. */
	public get open(): boolean {
		return this.hasAttribute("open");
	}
	/** Shows or hides the list without removing its content or editor association. */
	public set open(value: boolean) {
		this.toggleAttribute("open", value);
	}
	/** Installs shared styles and watches for declarative content and target changes. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-code-comment-style", style);
		this.sync(true);
		this.observer.observe(this.ownerDocument.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["id"],
		});
	}
	/** Rebinds when the author changes for. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (name === "for" && oldValue !== newValue && this.isConnected)
			this.sync(true);
	}
	/** Releases only this list's editor decorations and restores the author list. */
	public disconnectedCallback(): void {
		this.observer.disconnect();
		this.target?.setCodeCommentNumbers(this, []);
		this.target = null;
		for (const icon of this.icons.values()) icon.remove();
		this.icons.clear();
		this.items = [];
		this.status?.remove();
		this.status = null;
	}
	/** Resolves a possibly late editor and synchronizes only when entry identities change. */
	private sync(force = false): void {
		const candidate = this.htmlFor
			? this.ownerDocument.getElementById(this.htmlFor)
			: null;
		const target =
			candidate?.localName === "tp-code-editor" &&
			typeof (candidate as TpCodeEditor).setCodeCommentNumbers === "function"
				? (candidate as TpCodeEditor)
				: null;
		const list = this.querySelector<HTMLOListElement>(":scope > ol");
		const items = list
			? Array.from(list.children).filter(
					(item): item is HTMLLIElement => item instanceof HTMLLIElement,
				)
			: [];
		if (
			!force &&
			target === this.target &&
			items.length === this.items.length &&
			items.every((item, index) => item === this.items[index])
		)
			return;
		if (target !== this.target) this.target?.setCodeCommentNumbers(this, []);
		this.target = target;
		this.items = items;
		for (const [item, icon] of this.icons) {
			if (!items.includes(item)) {
				icon.remove();
				this.icons.delete(item);
			}
		}
		for (const [index, item] of items.entries()) {
			let icon = this.icons.get(item);
			if (!icon) {
				icon = document.createElement("tp-icon");
				icon.setAttribute("data-code-comment-number", "");
				icon.setAttribute("library", "numbers");
				icon.setAttribute("size", "1.25em");
				icon.setAttribute("aria-hidden", "true");
				this.icons.set(item, icon);
				item.prepend(icon);
			}
			icon.setAttribute("name", String(Math.min(index + 1, 99)));
			icon.hidden = index >= 99;
		}
		target?.setCodeCommentNumbers(
			this,
			items.slice(0, 99).map((_, index) => index + 1),
			new Map(items.slice(0, 99).map((item, index) => [index + 1, item])),
		);
		const message =
			!list || !items.length
				? "Provide an ordered list of code comments."
				: !target
					? `No tp-code-editor found with id "${this.htmlFor}".`
					: items.length > 99
						? "Numbered icons are available for comments 1 to 99."
						: "";
		if (message) {
			if (!this.status) {
				this.status = document.createElement("tp-callout");
				this.status.setAttribute("variant", "warning");
				this.status.setAttribute("role", "status");
				this.append(this.status);
			}
			this.status.textContent = message;
		} else {
			this.status?.remove();
			this.status = null;
		}
	}
}
if (!customElements.get("tp-code-comment"))
	customElements.define("tp-code-comment", TpCodeComment);
declare global {
	interface HTMLElementTagNameMap {
		"tp-code-comment": TpCodeComment;
	}
}
