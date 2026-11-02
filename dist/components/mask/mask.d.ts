/**
 * @module components/mask
 * @summary Replaces an anchored element with a message while active.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
export declare class TpMask extends TpBase {
    private target;
    private boundAnchor;
    private origin;
    private observer;
    private moving;
    private queued;
    static get observedAttributes(): string[];
    get anchor(): string;
    set anchor(value: string);
    get active(): boolean;
    set active(value: boolean);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private schedule;
    private resolve;
    private sync;
    private release;
    private restorePosition;
}
