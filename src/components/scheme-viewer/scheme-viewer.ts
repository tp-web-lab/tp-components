/**
 * @module components/scheme-viewer
 * @summary Compact Scheme code viewer and runner.
 *
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-scheme-playground
 * @summary Edits and runs a Scheme project with LIPS.
 */
// tp-docgen:dependencies:end
import "../scheme-playground/scheme-playground.js";
import { TpSchemePlayground } from "../scheme-playground/scheme-playground.js";

/**
 * The custom `<tp-scheme-viewer>` element displays and runs one Scheme example in a compact interface.
 *
 * @tagname tp-scheme-viewer
 * @summary Displays and runs one Scheme example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or scheme source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @keyboard {Shift+Enter} Run the current source.
 * @attr {"default" | "lite" | "simple"} mode = "default" - Viewer presentation: full controls, compact controls, or only source editor and rendered output.
 * @example
 * <tp-scheme-viewer src="/docs/components/_shared/intro-projects/scheme.json"></tp-scheme-viewer>
 */
export class TpSchemeViewer extends TpSchemePlayground {
	protected override get viewerMode(): boolean {
		return true;
	}
}

if (!customElements.get("tp-scheme-viewer")) {
	customElements.define("tp-scheme-viewer", TpSchemeViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme-viewer": TpSchemeViewer;
	}
}
