/**
 * @module components/stack
 * @summary Vertical stack layout component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
export declare class TpStack extends TpBase {
    /**
     * Identifier of the global stylesheet injected once for all stack instances.
     *
     * @summary Global style element identifier.
     * @internal
     */
    private static readonly styleId;
    /**
     * Per-instance style element used to implement `split-after`.
     *
     * @summary Dynamic split style element.
     * @internal
     */
    private splitStyleEl;
    /**
     * Unique identifier used to target this instance from the dynamic split style.
     *
     * @summary Unique stack instance identifier.
     * @internal
     */
    private instanceId;
    /**
     * Attributes observed by `<tp-stack>`.
     *
     * @summary Observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Applies the stack gap recursively to descendant siblings.
     *
     * @attr recursive
     */
    get recursive(): boolean;
    set recursive(value: boolean);
    /**
     * One-based child index after which the stack inserts a flexible split.
     *
     * @attr split-after
     */
    get splitAfter(): number | null;
    set splitAfter(value: number | null);
    /**
     * Initializes the stack instance.
     *
     * @summary Connects the stack to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Updates split rendering after attribute changes.
     * @internal
     */
    protected attributeChangedCallback(name: string): void;
    /**
     * Cleans up dynamic styles.
     *
     * @summary Disconnects the stack from the document.
     * @internal
     */
    disconnectedCallback(): void;
    private ensureStyles;
    private ensureInstanceId;
    private updateSplitStyle;
    private removeSplitStyle;
}
