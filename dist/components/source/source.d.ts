/**
 * @module components/source
 * @summary Source repository link button.
 */
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-source>` element links to the project’s source repository.
 *
 * @summary Links to the project’s source repository.
 * @tagname tp-source
 * @attr {string} url = "" - Source repository URL.
 * @example
 * <tp-box>
 *   <p>Open the source repository for this library.</p>
 *   <tp-source url="https://github.com/tp-web-lab/tp-components"></tp-source>
 * </tp-box>
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
