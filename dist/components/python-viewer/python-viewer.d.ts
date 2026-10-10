/**
 * @module components/python-viewer
 * @summary Compact Python code viewer and runner.
 *
 */
/**
 * @tp-dependency tp-python-playground
 * @summary Python playground component.
 */
import "../python-playground/python-playground.js";
import { TpPythonPlayground } from "../python-playground/python-playground.js";
/**
 * @tagname tp-python-viewer
 * @summary Displays and runs one Python example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or python source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @example
 * <tp-python-viewer></tp-python-viewer>
 */
export declare class TpPythonViewer extends TpPythonPlayground {
    protected get viewerMode(): boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-python-viewer": TpPythonViewer;
    }
}
