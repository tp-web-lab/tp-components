/**
 * @module components/avatar
 * @summary Visual identity using an image, initials or an icon.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { isTpSizeType, type TpSizeType } from "../base/base.types.js";
import "../icon/icon.js";
import style from "./avatar.css?inline";

/** Supported avatar shapes. */
export type TpAvatarShape = "circle" | "square";
/** Supported avatar sizes. */
export type TpAvatarSize = TpSizeType;

/**
 * @summary Displays an image, initials or an icon in a circle or square.
 * @tagname tp-avatar
 * @attr {string} src = "" - Image URL; falls back to initials or an icon if loading fails.
 * @attr {string} initials = "" - Initials displayed when no image is available.
 * @attr {string} icon = "user" - Fallback tp-icon name.
 * @attr {string} library = "tp" - Icon library.
 * @attr {string} label = "" - Accessible name; without a label the avatar is decorative.
 * @attr {TpAvatarShape} shape = "circle" - Avatar shape (`circle` or `square`).
 * @attr {TpSizeType} size = "m" - Avatar size (`xxs`, `xs`, `s`, `m`, `l`, `xl`, or `xxl`).
 * @accessibility A labelled avatar is exposed as an image; an unlabelled avatar is decorative and not keyboard-focusable.
 * @example
 * <tp-cluster>
 *   <tp-avatar src="/docs/medias/logos/logo-tp.svg" label="tp-components"></tp-avatar>
 *   <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
 *   <tp-avatar icon="user" shape="square" label="Guest"></tp-avatar>
 * </tp-cluster>
 */
export class TpAvatar extends TpBase {
	/** URL that failed to load; reset when src changes. */
	private failedSource: string | null = null;
	/** Declares attributes that update the visual identity. */
	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"src",
			"initials",
			"icon",
			"library",
			"label",
			"shape",
			"size",
		];
	}

	/** Image URL; falls back to initials or an icon if loading fails.
	 * @attr src
	 * @default ""
	 */
	public get src(): string {
		return this.getAttribute("src")?.trim() || "";
	}
	/** Sets src. */
	public set src(value: string) {
		this.setStringAttribute("src", value);
	}

	/** Initials displayed when no image is available.
	 * @attr initials
	 * @default ""
	 */
	public get initials(): string {
		return this.getAttribute("initials")?.trim() || "";
	}
	/** Sets initials. */
	public set initials(value: string) {
		this.setStringAttribute("initials", value);
	}

	/** Fallback tp-icon name.
	 * @attr icon
	 * @default "user"
	 */
	public get icon(): string {
		return this.getAttribute("icon")?.trim() || "user";
	}
	/** Sets icon. */
	public set icon(value: string) {
		this.setStringAttribute("icon", value);
	}

	/** Icon library.
	 * @attr library
	 * @default "tp"
	 */
	public get library(): string {
		return this.getAttribute("library")?.trim() || "tp";
	}
	/** Sets library. */
	public set library(value: string) {
		this.setStringAttribute("library", value);
	}

	/** Accessible name; without a label the avatar is decorative.
	 * @attr label
	 * @default ""
	 */
	public get label(): string {
		return this.getAttribute("label")?.trim() || "";
	}
	/** Sets label. */
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}

	/** Avatar shape (`circle` or `square`).
	 * @attr shape
	 * @default "circle"
	 */
	public get shape(): TpAvatarShape {
		return this.getAttribute("shape") === "square" ? "square" : "circle";
	}
	/** Sets shape. */
	public set shape(value: TpAvatarShape) {
		this.setStringAttribute("shape", value);
	}

	/** Avatar size using the seven shared library sizes.
	 * @attr size
	 * @default "m"
	 */
	public get size(): TpSizeType {
		const value = this.getAttribute("size");
		return value !== null && isTpSizeType(value) ? value : "m";
	}
	/** Sets size. */
	public set size(value: TpSizeType) {
		this.setStringAttribute("size", value);
	}

	/** Installs shared component styles and renders the identity. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-avatar-styles", style);
		this.render();
	}
	/** Updates connected avatars and allows retrying a changed image URL. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) return;
		if (name === "src") this.failedSource = null;
		if (this.isConnected) this.render();
	}
	/** Creates decorative visual content inside a labelled image wrapper. */
	private render(): void {
		this.dataset.shape = this.shape;
		this.dataset.size = this.size;
		const visual = document.createElement("span");
		visual.className = "tp-avatar-visual";
		if (this.label) {
			visual.setAttribute("role", "img");
			visual.setAttribute("aria-label", this.label);
		} else {
			visual.setAttribute("aria-hidden", "true");
		}
		const source = this.src;
		if (source && source !== this.failedSource) {
			const image = document.createElement("img");
			image.alt = "";
			image.src = source;
			image.addEventListener(
				"error",
				() => {
					// Ignore stale events from images replaced by an attribute update.
					if (image.parentElement !== visual || visual.parentElement !== this)
						return;
					this.failedSource = source;
					this.render();
				},
				{ once: true },
			);
			visual.append(image);
		} else if (this.initials) {
			const text = document.createElement("span");
			text.textContent = this.initials;
			visual.append(text);
		} else {
			const icon = document.createElement("tp-icon");
			icon.setAttribute("name", this.icon);
			icon.setAttribute("library", this.library);
			icon.setAttribute("size", "2em");
			icon.setAttribute("aria-hidden", "true");
			visual.append(icon);
		}
		this.replaceChildren(visual);
	}
}

// Registration is guarded so repeated imports cannot redefine the element.
if (!customElements.get("tp-avatar"))
	customElements.define("tp-avatar", TpAvatar);

declare global {
	/** Provides typed DOM creation and queries for the avatar element. */
	interface HTMLElementTagNameMap {
		"tp-avatar": TpAvatar;
	}
}
