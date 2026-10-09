/**
 * @module components/avatar
 * @summary Visual identity using an image, initials or an icon.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType } from "../base/base.types.js";
import "../icon/icon.js";
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
 *   <tp-avatar src="/tp-components/docs/medias/logos/logo-tp.svg" label="tp-components"></tp-avatar>
 *   <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
 *   <tp-avatar icon="user" shape="square" label="Guest"></tp-avatar>
 * </tp-cluster>
 */
export declare class TpAvatar extends TpBase {
    /** URL that failed to load; reset when src changes. */
    private failedSource;
    /** Declares attributes that update the visual identity. */
    static get observedAttributes(): string[];
    /** Image URL; falls back to initials or an icon if loading fails.
     * @attr src
     * @default ""
     */
    get src(): string;
    /** Sets src. */
    set src(value: string);
    /** Initials displayed when no image is available.
     * @attr initials
     * @default ""
     */
    get initials(): string;
    /** Sets initials. */
    set initials(value: string);
    /** Fallback tp-icon name.
     * @attr icon
     * @default "user"
     */
    get icon(): string;
    /** Sets icon. */
    set icon(value: string);
    /** Icon library.
     * @attr library
     * @default "tp"
     */
    get library(): string;
    /** Sets library. */
    set library(value: string);
    /** Accessible name; without a label the avatar is decorative.
     * @attr label
     * @default ""
     */
    get label(): string;
    /** Sets label. */
    set label(value: string);
    /** Avatar shape (`circle` or `square`).
     * @attr shape
     * @default "circle"
     */
    get shape(): TpAvatarShape;
    /** Sets shape. */
    set shape(value: TpAvatarShape);
    /** Avatar size using the seven shared library sizes.
     * @attr size
     * @default "m"
     */
    get size(): TpSizeType;
    /** Sets size. */
    set size(value: TpSizeType);
    /** Installs shared component styles and renders the identity. */
    protected connectedCallback(): void;
    /** Updates connected avatars and allows retrying a changed image URL. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Creates decorative visual content inside a labelled image wrapper. */
    private render;
}
declare global {
    /** Provides typed DOM creation and queries for the avatar element. */
    interface HTMLElementTagNameMap {
        "tp-avatar": TpAvatar;
    }
}
