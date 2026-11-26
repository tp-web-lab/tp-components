/**
 * @module components/ocaml-viewer
 * @summary Compact OCaml code viewer and runner.
 *
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-ocaml-playground
 * @summary Edits and runs an OCaml project.
 */
// tp-docgen:dependencies:end

import "../ocaml-playground/ocaml-playground.js";
import { TpOCamlPlayground } from "../ocaml-playground/ocaml-playground.js";

/**
 * The custom `<tp-ocaml-viewer>` element displays and runs one OCaml example in a compact interface.
 *
 * @tagname tp-ocaml-viewer
 * @summary Displays and runs one OCaml example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or ocaml source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @keyboard {Shift+Enter} Run the current source.
 * @attr {"default" | "lite" | "simple"} mode = "default" - Viewer presentation: full controls, compact controls, or only source editor and rendered output.
 * @example
 * <tp-ocaml-viewer src="/docs/components/_shared/intro-projects/ocaml.json"></tp-ocaml-viewer>
 */
export class TpOCamlViewer extends TpOCamlPlayground {
	protected override get viewerMode(): boolean {
		return true;
	}
}

if (!customElements.get("tp-ocaml-viewer")) {
	customElements.define("tp-ocaml-viewer", TpOCamlViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml-viewer": TpOCamlViewer;
	}
}
