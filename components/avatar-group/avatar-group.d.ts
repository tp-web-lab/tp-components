/**
 * @module components/avatar-group
 * @summary Overlapping groups of avatars.
 */
/**
 * @tp-dependency tp-avatar
 * @summary Visual identity using an image, initials or an icon.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
import "../avatar/avatar.js";
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
export declare class TpAvatarGroup extends TpBase {
    /** Avatars whose private stacking property is managed by this group. */
    private readonly managed;
    /** Updates stacking after direct avatars are inserted, moved or removed. */
    private readonly observer;
    /** Attributes that affect layout. */
    static get observedAttributes(): string[];
    /** Nonnegative overlap length. Invalid values use the default.
     * @attr offset
     * @default "0.75rem"
     */
    get offset(): string;
    /** Sets the overlap length. */
    set offset(value: string);
    /** Stacking order without changing DOM order.
     * @attr order
     * @default "ltr"
     */
    get order(): TpAvatarGroupOrder;
    /** Sets the stacking order. */
    set order(value: TpAvatarGroupOrder);
    /** Layout axis.
     * @attr orientation
     * @default "horizontal"
     */
    get orientation(): TpAvatarGroupOrientation;
    /** Sets the layout axis. */
    set orientation(value: TpAvatarGroupOrientation);
    /** Installs styles and starts tracking direct avatars. */
    protected connectedCallback(): void;
    /** Stops observation and releases stacking styles when disconnected. */
    protected disconnectedCallback(): void;
    /** Reacts to connected attribute changes. */
    protected attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /** Applies layout without replacing, cloning or reordering author nodes. */
    private update;
}
declare global {
    /** Typed DOM creation and queries for avatar groups. */
    interface HTMLElementTagNameMap {
        "tp-avatar-group": TpAvatarGroup;
    }
}
