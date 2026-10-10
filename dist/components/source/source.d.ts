/**
 * @module components/source
 * @summary Source repository link button.
 */
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
/**
 * `<tp-source>` displays a source repository button when a URL is available.
 *
 * @summary Source repository link button.
 * @tagname tp-source
 * @attr {string} url = "" - Source repository URL.
 * @example
 * <tp-source></tp-source>
 */
export declare class TpSource extends TpBase {
    static get observedAttributes(): string[];
    get url(): string;
    set url(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    private render;
    private handleButtonClick;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-source": TpSource;
    }
}
