/**
 * @module components/typescript-viewer
 * @summary Compact TypeScript code viewer and runner.
 *
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-typescript-playground
 * @summary TypeScript playground component.
 */
// tp-docgen:dependencies:end
import "../typescript-playground/typescript-playground.js";
import { TpTypescriptPlayground } from "../typescript-playground/typescript-playground.js";

/**
 * @tagname tp-typescript-viewer
 * @summary Displays and runs one TypeScript example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or typescript source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @example
 * <tp-typescript-viewer></tp-typescript-viewer>
 */
export class TpTypescriptViewer extends TpTypescriptPlayground {
	protected override get viewerMode(): boolean {
		return true;
	}
}

if (!customElements.get("tp-typescript-viewer")) {
	customElements.define("tp-typescript-viewer", TpTypescriptViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-typescript-viewer": TpTypescriptViewer;
	}
}
