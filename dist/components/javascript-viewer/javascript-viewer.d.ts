/**
 * @module components/javascript-viewer
 * @summary Compact JavaScript code viewer and runner.
 *
 */
/**
 * @tp-dependency tp-javascript-playground
 * @summary JavaScript playground component.
 */
import "../javascript-playground/javascript-playground.js";
import { TpJavascriptPlayground } from "../javascript-playground/javascript-playground.js";
/**
 * The custom `<tp-javascript-viewer>` element displays and runs one JavaScript example in a compact interface.
 *
 * @tagname tp-javascript-viewer
 * @summary Displays and runs one JavaScript example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or javascript source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @example
 * <tp-javascript-viewer src="/docs/components/_shared/intro-projects/javascript.json"></tp-javascript-viewer>
 */
export declare class TpJavascriptViewer extends TpJavascriptPlayground {
    protected get viewerMode(): boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-javascript-viewer": TpJavascriptViewer;
    }
}
