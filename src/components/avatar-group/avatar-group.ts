/**
 * @module components/avatar-group
 * @summary Overlapping groups of avatars.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-avatar
 * @summary Visual identity using an image, initials or an icon.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../avatar/avatar.js";
import style from "./avatar-group.css?inline";

/** Direction in which successive avatars cover earlier ones. */
export type TpAvatarGroupOrder = "ltr" | "rtl";
/** Axis along which avatars are arranged. */
export type TpAvatarGroupOrientation = "horizontal" | "vertical";

/**
 * @summary Groups tp-avatar elements with configurable overlap, stacking order and orientation.
 * @tagname tp-avatar-group
 * @attr {string} offset = "0.75rem" - Overlap between adjacent avatars as a nonnegative CSS length; zero disables overlap.
 * @attr {TpAvatarGroupOrder} order = "ltr" - Stacking order: ltr places later avatars in front; rtl places earlier avatars in front.
 * @attr {TpAvatarGroupOrientation} orientation = "horizontal" - Layout axis (horizontal or vertical).
 * @accessibility Preserves avatar labels and DOM reading order; the group adds no keyboard stop.
 * @example
 * <tp-avatar-group>
 *   <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
 *   <tp-avatar initials="GH" label="Grace Hopper"></tp-avatar>
 *   <tp-avatar initials="KT" label="Katherine Johnson"></tp-avatar>
 * </tp-avatar-group>
 */
export class TpAvatarGroup extends TpBase {
	/** Avatars whose private stacking property is managed by this group. */
	private readonly managed = new Set<HTMLElement>();
	/** Updates stacking after direct avatars are inserted, moved or removed. */
	private readonly observer = new MutationObserver(() => this.update());
	/** Attributes that affect layout. */
	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "offset", "order", "orientation"];
	}
	/** Nonnegative overlap length. Invalid values use the default.
	 * @attr offset
	 * @default "0.75rem"
	 */
	public get offset(): string {
		const value = this.getAttribute("offset")?.trim() ?? "";
		return /^(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|ch|ex|cap|lh|rlh|vw|vh|vi|vb|vmin|vmax|cm|mm|in|pt|pc))$/i.test(
			value,
		)
			? value
			: "0.75rem";
	}
	/** Sets the overlap length. */
	public set offset(value: string) {
		this.setStringAttribute("offset", value);
	}
	/** Stacking order without changing DOM order.
	 * @attr order
	 * @default "ltr"
	 */
	public get order(): TpAvatarGroupOrder {
		return this.getAttribute("order") === "rtl" ? "rtl" : "ltr";
	}
	/** Sets the stacking order. */
	public set order(value: TpAvatarGroupOrder) {
		this.setStringAttribute("order", value);
	}
	/** Layout axis.
	 * @attr orientation
	 * @default "horizontal"
	 */
	public get orientation(): TpAvatarGroupOrientation {
		return this.getAttribute("orientation") === "vertical"
			? "vertical"
			: "horizontal";
	}
	/** Sets the layout axis. */
	public set orientation(value: TpAvatarGroupOrientation) {
		this.setStringAttribute("orientation", value);
	}
	/** Installs styles and starts tracking direct avatars. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-avatar-group-styles", style);
		this.update();
		this.observer.observe(this, { childList: true });
	}
	/** Stops observation and releases stacking styles when disconnected. */
	protected disconnectedCallback(): void {
		this.observer.disconnect();
		this.managed.forEach((avatar) => {
			avatar.style.removeProperty("--tp-avatar-group-index");
		});
		this.managed.clear();
	}
	/** Reacts to connected attribute changes. */
	protected override attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue !== newValue && this.isConnected) this.update();
	}
	/** Applies layout without replacing, cloning or reordering author nodes. */
	private update(): void {
		this.dataset.orientation = this.orientation;
		this.style.setProperty("--tp-avatar-group-overlap", this.offset);
		const avatars = Array.from(this.children).filter(
			(child): child is HTMLElement =>
				child instanceof HTMLElement && child.localName === "tp-avatar",
		);
		this.managed.forEach((avatar) => {
			if (!avatars.includes(avatar)) {
				avatar.style.removeProperty("--tp-avatar-group-index");
				this.managed.delete(avatar);
			}
		});
		avatars.forEach((avatar, index) => {
			avatar.style.setProperty(
				"--tp-avatar-group-index",
				String(this.order === "ltr" ? index + 1 : avatars.length - index),
			);
			this.managed.add(avatar);
		});
	}
}

// Guard registration when the module is imported more than once.
if (!customElements.get("tp-avatar-group"))
	customElements.define("tp-avatar-group", TpAvatarGroup);

declare global {
	/** Typed DOM creation and queries for avatar groups. */
	interface HTMLElementTagNameMap {
		"tp-avatar-group": TpAvatarGroup;
	}
}
