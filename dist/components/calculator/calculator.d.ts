/** @module components/calculator */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import "../textfield/textfield.js";
/**
 * @summary Scientific calculator with an editable expression and degree/radian modes.
 * @tagname tp-calculator
 * @attr {"horizontal" | "vertical"} orientation = "horizontal" - Arrangement of the scientific and numeric keypads.
 * @event tp-calculator-result Emitted after a successful calculation.
 * @eventdetail tp-calculator-result { expression: string; result: number }
 * @keyboard {Enter / =} Evaluates the expression while its field is focused.
 * @keyboard {Escape} Clears the expression while its field is focused.
 * @example
 * <tp-calculator></tp-calculator>
 */
export declare class TpCalculator extends TpBase {
    private field;
    private status;
    private degreeButton;
    private orientationButton;
    private degrees;
    private start;
    private end;
    private evaluated;
    static get observedAttributes(): string[];
    /** Keypad arrangement. @attr orientation */
    get orientation(): "horizontal" | "vertical";
    set orientation(value: "horizontal" | "vertical");
    protected attributeChangedCallback(): void;
    private syncOrientation;
    protected connectedCallback(): void;
    private rememberSelection;
    private clearStatus;
    private write;
    private insert;
    private wrap;
    private backspace;
    private clear;
    private equals;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-calculator": TpCalculator;
    }
}
