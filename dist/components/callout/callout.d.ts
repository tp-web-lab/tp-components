/**
 * @module components/callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import { type TpVariantType } from "../base/base.types.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
/**
 * Highlighted contextual content block.
 * @summary Highlighted contextual content block.
 * @tagname tp-callout
 * @attr {string} variant = "neutral" - Visual variant (`success`, `danger`, `warning`, `info`, `neutral`, or `brand`).
 * @attr {string} heading = "" - Optional heading displayed above the content.
 * @attr {string} icon = "" - Optional icon displayed before the heading.
 * @attr {string} library = "" - Optional icon library used by `icon`.
 * @attr {boolean} closable = false - Shows a close button.
 * @attr {boolean} outlined = false - Removes the filled background.
 * @attr {string} title = "" - Native title text observed for authored callouts.
 * @method toast Displays the callout as a temporary toast notification in the top-right corner of the viewport.
 * @cssprop --tp-callout-accent Accent color. Default: `var(--tp-neutral-text-colorful)`.
 * @cssprop --tp-callout-background Background color. Default: `var(--tp-neutral-fill-softer)`.
 * @cssprop --tp-callout-foreground Text color. Default: `var(--tp-text-body)`.
 * @cssprop --tp-callout-border-color Border color. Default: `var(--tp-neutral-stroke-soft)`.
 * @cssprop --tp-callout-border-width Leading border width. Default: `4px`.
 * @cssprop --tp-callout-radius Border radius. Default: `0.75rem`.
 * @cssprop --tp-callout-padding-block Block padding. Default: `0.875rem`.
 * @cssprop --tp-callout-padding-inline Inline padding. Default: `1rem`.
 * @cssprop --tp-callout-heading-font-size Heading font size. Default: `1rem`.
 * @cssprop --tp-callout-heading-gap Gap below the heading. Default: `0.625rem`.
 * @example
 * <tp-callout variant="info" heading="Information">
 *  The workshop starts at 9:00.
 * </tp-callout>
 */
export declare class TpCallout extends TpBase {
    /**
     * @summary Component global style ID.
     * @internal
     */
    private static readonly calloutStyleId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private headingEl;
    /**
     * @summary Current toast timeout identifier.
     * @internal
     */
    private toastTimeoutId;
    /**
     * @summary Handles close button activation.
     * @internal
     */
    private readonly handleCloseClick;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary Visual variant.
     * @attr variant
     * @default neutral
     */
    get variant(): TpVariantType;
    /**
     * @summary Sets the visual variant.
     * @param value Visual variant.
     */
    set variant(value: TpVariantType);
    /**
     * @summary Backward-compatible alias for `heading`.
     */
    get title(): string;
    /**
     * @summary Sets the heading through the `title` alias.
     * @param value Heading text.
     */
    set title(value: string);
    /**
     * @summary Optional heading displayed above the content.
     * @attr heading
     * @default ""
     */
    get heading(): string;
    /**
     * @summary Sets the optional heading.
     * @param value Heading text.
     */
    set heading(value: string);
    /**
     * @summary Optional icon displayed before the heading.
     * @attr icon
     * @default ""
     */
    get icon(): string;
    /**
     * @summary Sets the optional icon.
     * @param value Icon name.
     */
    set icon(value: string);
    /**
     * @summary Optional icon library used by `icon`.
     * @attr library
     * @default ""
     */
    get library(): string;
    /**
     * @summary Sets the optional icon library.
     * @param value Icon library name.
     */
    set library(value: string);
    /**
     * @summary Whether the callout has a close button.
     * @attr closable
     * @default false
     */
    get closable(): boolean;
    /**
     * @summary Sets the close button visibility.
     * @param value Close button state.
     */
    set closable(value: boolean);
    /**
     * @summary Whether the callout is outlined.
     * @attr outlined
     * @default false
     */
    get outlined(): boolean;
    /**
     * @summary Sets the outlined state.
     * @param value Outlined state.
     */
    set outlined(value: boolean);
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @param name Parameter.
     * @param oldValue Parameter.
     * @param newValue Parameter.
     * @internal
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * @summary Cleans pending toast timers.
     * @internal
     */
    protected disconnectedCallback(): void;
    /**
     * Displays the callout as a temporary toast notification in the top-right
     * corner of the viewport.
     *
     * @summary Displays the callout as a toast.
     * @param delay Time in milliseconds before closing the toast.
     */
    toast(delay?: number): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private migrateNativeTitleAttribute;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureHeadingElement;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private updateCallout;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private syncHeading;
    /**
     * @summary Clears the active toast timeout.
     * @internal
     */
    private clearToastTimeout;
    /**
     * @summary Hides the callout.
     * @internal
     */
    private closeCallout;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-callout": TpCallout;
    }
}
