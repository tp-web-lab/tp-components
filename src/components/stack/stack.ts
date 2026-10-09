/**
 * @module components/stack
 * @summary Vertical stack layout component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./stack.css?inline";

/**
 * Internal counter used to generate a unique identifier per instance.
 */
let instanceCount = 0;

/**
 * Vertical stack layout component.
 *
 * Direct children are stacked vertically with a configurable gap. The gap can
 * optionally be applied recursively to all descendants, and one child can push
 * the following content to the opposite edge with `split-after`.
 *
 * @summary Stacks child elements vertically with an optional recursive gap and split point.
 * @tagname tp-stack
 *
 * @attr {boolean} recursive = false - Applies the stack gap recursively to descendant siblings instead of direct children only.
 * @attr {number} split-after = "" - One-based child index after which the stack inserts a flexible split. Absent by default: no flexible split (the splitAfter property returns null). Requires available height to separate the groups.
 *
 *
 * @cssprop --stack-gap Gap inserted between stacked items.
 * @example
 * ```html
 * <tp-stack>
 *   <tp-box>Step 1: Write a draft.</tp-box>
 *   <tp-box>Step 2: Review the content.</tp-box>
 *   <tp-box>Step 3: Publish the document.</tp-box>
 * </tp-stack>
 * ```
 */
export class TpStack extends TpBase {
	/**
	 * Identifier of the global stylesheet injected once for all stack instances.
	 *
	 * @summary Global style element identifier.
	 * @internal
	 */
	private static readonly styleId = "tp-stack-styles";

	/**
	 * Per-instance style element used to implement `split-after`.
	 *
	 * @summary Dynamic split style element.
	 * @internal
	 */
	private splitStyleEl: HTMLStyleElement | null = null;

	/**
	 * Unique identifier used to target this instance from the dynamic split style.
	 *
	 * @summary Unique stack instance identifier.
	 * @internal
	 */
	private instanceId: string | null = null;

	/**
	 * Attributes observed by `<tp-stack>`.
	 *
	 * @summary Observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["recursive", "split-after"];
	}

	/**
	 * Applies the stack gap recursively to descendant siblings.
	 *
	 * @attr recursive
	 */
	public get recursive(): boolean {
		return this.hasAttribute("recursive");
	}

	public set recursive(value: boolean) {
		if (value) {
			this.setAttribute("recursive", "");
			return;
		}

		this.removeAttribute("recursive");
	}

	/**
	 * One-based child index after which the stack inserts a flexible split.
	 *
	 * @attr split-after
	 */
	public get splitAfter(): number | null {
		const value = this.getAttribute("split-after");
		if (value === null) {
			return null;
		}

		const parsed = Number(value);
		if (!Number.isInteger(parsed) || parsed < 1) {
			return null;
		}

		return parsed;
	}

	public set splitAfter(value: number | null) {
		if (value === null) {
			this.removeAttribute("split-after");
			return;
		}

		this.setAttribute("split-after", String(value));
	}

	/**
	 * Initializes the stack instance.
	 *
	 * @summary Connects the stack to the document.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureInstanceId();
		this.updateSplitStyle();
	}

	/**
	 * Reacts to observed attribute changes.
	 *
	 * @summary Updates split rendering after attribute changes.
	 * @internal
	 */
	protected attributeChangedCallback(name: string): void {
		if (name === "split-after") {
			this.updateSplitStyle();
		}
	}

	/**
	 * Cleans up dynamic styles.
	 *
	 * @summary Disconnects the stack from the document.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.removeSplitStyle();
	}

	private ensureStyles(): void {
		if (document.getElementById(TpStack.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpStack.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	private ensureInstanceId(): void {
		if (this.instanceId !== null) {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-stack-${String(instanceCount)}`;
		this.setAttribute("data-tp-stack-id", this.instanceId);
	}

	private updateSplitStyle(): void {
		this.removeSplitStyle();

		const splitAfter = this.splitAfter;
		if (splitAfter === null) {
			return;
		}

		this.ensureInstanceId();

		const styleEl = document.createElement("style");
		styleEl.textContent = `tp-stack[data-tp-stack-id="${String(this.instanceId)}"] > :nth-child(${String(splitAfter)}) {margin-block-end: auto;}`;

		document.head.append(styleEl);
		this.splitStyleEl = styleEl;
	}

	private removeSplitStyle(): void {
		this.splitStyleEl?.remove();
		this.splitStyleEl = null;
	}
}

if (!customElements.get("tp-stack")) {
	customElements.define("tp-stack", TpStack);
}
