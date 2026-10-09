/**
 * @module components/javascript-viewer
 * @summary Compact JavaScript code viewer and runner.
 *
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-javascript-playground
 * @summary JavaScript playground component.
 */
// tp-docgen:dependencies:end
import "../javascript-playground/javascript-playground.js";
import { TpJavascriptPlayground } from "../javascript-playground/javascript-playground.js";

/**
 * Compact viewer for editing and running one JavaScript example.
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
 * <tp-javascript-viewer></tp-javascript-viewer>
 */
export class TpJavascriptViewer extends TpJavascriptPlayground {
	protected override get viewerMode(): boolean {
		return true;
	}
}

if (!customElements.get("tp-javascript-viewer")) {
	customElements.define("tp-javascript-viewer", TpJavascriptViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-viewer": TpJavascriptViewer;
	}
}
