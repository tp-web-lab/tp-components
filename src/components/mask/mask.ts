/**
 * @module components/mask
 * @summary Replaces an anchored element with a message while active.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./mask.css?inline";

type TargetState = {
	owners: Set<TpMask>;
	display: string;
	priority: string;
	inert: boolean;
	ariaHidden: string | null;
};
const targets = new WeakMap<HTMLElement, TargetState>();

/**
 * Replaces an anchored element with its own content without destroying the target.
 * @tagname tp-mask
 * @attr {string} anchor = "" - CSS selector of the element to mask in the same document.
 * @attr {boolean} active = false - Hides the target and displays the mask content in its place.
 * @example
 * <tp-textfield id="mask-answer" label="Answer" value="Thursday" clearable></tp-textfield>
 * <tp-mask anchor="#mask-answer" active>The answer is hidden until the review.</tp-mask>
 * @accessibility An active mask hides its target with display:none, inert and aria-hidden, and moves focus to the replacement message if focus was inside the target.
 * @accessibility Restores the target's previous display, inert and aria-hidden state when the last mask releases it; the target and its existing controls are preserved.
 * @accessibilityresponsibility Provide a clear replacement message explaining why the content is unavailable and any available next action; label interactive controls placed in that message.
 */
export class TpMask extends TpBase {
	private target: HTMLElement | null = null;
	private boundAnchor = "";
	private origin: Comment | null = null;
	private observer: MutationObserver | null = null;
	private moving = false;
	private queued = false;

	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "anchor", "active"];
	}
	public get anchor(): string {
		return this.getAttribute("anchor") ?? "";
	}
	public set anchor(value: string) {
		this.setAttribute("anchor", value);
	}
	public get active(): boolean {
		return this.hasAttribute("active");
	}
	public set active(value: boolean) {
		this.toggleAttribute("active", value);
	}

	protected override connectedCallback(): void {
		if (this.moving) return;
		super.connectedCallback();
		this.ensureGlobalStyle("tp-mask-styles", style);
		const Observer =
			this.ownerDocument.defaultView?.MutationObserver ?? MutationObserver;
		this.observer = new Observer(() => this.schedule());
		this.observer.observe(this.ownerDocument, {
			childList: true,
			subtree: true,
			attributes: true,
		});
		this.sync();
	}
	public disconnectedCallback(): void {
		if (this.moving) return;
		this.observer?.disconnect();
		this.observer = null;
		this.release();
		this.origin?.remove();
		this.origin = null;
		this.removeAttribute("data-tp-mask-visible");
	}
	protected attributeChangedCallback(): void {
		if (this.isConnected && !this.moving) this.sync();
	}
	private schedule(): void {
		if (this.queued) return;
		this.queued = true;
		queueMicrotask(() => {
			this.queued = false;
			if (this.isConnected) this.sync();
		});
	}
	private resolve(): HTMLElement | null {
		if (!this.active || !this.anchor.trim()) return null;
		if (this.target?.isConnected && this.boundAnchor === this.anchor)
			return this.target;
		try {
			const candidate = this.ownerDocument.querySelector(this.anchor);
			if (
				!(candidate instanceof HTMLElement) ||
				candidate === this ||
				candidate.contains(this) ||
				this.contains(candidate) ||
				candidate === this.ownerDocument.body ||
				candidate === this.ownerDocument.documentElement
			)
				return null;
			return candidate;
		} catch {
			return null;
		}
	}
	private sync(): void {
		const next = this.resolve();
		if (next === this.target) return;
		this.release();
		if (!next) {
			this.restorePosition();
			this.removeAttribute("data-tp-mask-visible");
			return;
		}
		if (!this.origin) {
			this.origin = this.ownerDocument.createComment("tp-mask position");
			this.before(this.origin);
		}
		this.target = next;
		this.boundAnchor = this.anchor;
		let state = targets.get(next);
		if (!state) {
			state = {
				owners: new Set(),
				display: next.style.getPropertyValue("display"),
				priority: next.style.getPropertyPriority("display"),
				inert: next.hasAttribute("inert"),
				ariaHidden: next.getAttribute("aria-hidden"),
			};
			targets.set(next, state);
		}
		state.owners.add(this);
		const focused = this.ownerDocument.activeElement;
		if (focused instanceof HTMLElement && next.contains(focused))
			focused.blur();
		next.style.setProperty("display", "none", "important");
		next.setAttribute("inert", "");
		next.setAttribute("aria-hidden", "true");
		this.moving = true;
		try {
			next.before(this);
		} finally {
			this.moving = false;
		}
		this.setAttribute("data-tp-mask-visible", "");
		if (!this.hasAttribute("tabindex")) this.tabIndex = -1;
		if (focused instanceof HTMLElement && next.contains(focused))
			this.focus({ preventScroll: true });
	}
	private release(): void {
		const target = this.target;
		this.target = null;
		if (!target) return;
		const state = targets.get(target);
		if (!state) return;
		state.owners.delete(this);
		if (state.owners.size) return;
		if (state.display)
			target.style.setProperty("display", state.display, state.priority);
		else target.style.removeProperty("display");
		target.toggleAttribute("inert", state.inert);
		if (state.ariaHidden === null) target.removeAttribute("aria-hidden");
		else target.setAttribute("aria-hidden", state.ariaHidden);
		targets.delete(target);
	}
	private restorePosition(): void {
		if (!this.origin) return;
		this.moving = true;
		try {
			if (this.origin.isConnected) this.origin.after(this);
		} finally {
			this.moving = false;
		}
		this.origin.remove();
		this.origin = null;
	}
}
if (!customElements.get("tp-mask")) customElements.define("tp-mask", TpMask);
