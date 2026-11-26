import { interpreterConsole } from "../interpreter/interpreter-console.js";
import { formatOCamlResults } from "../ocaml-playground/ocaml-execution-document.js";
/** @module components/ocaml */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit Alcotest https://github.com/mirage/alcotest
 * @summary Typed OCaml tests, compiled for the browser and loaded on demand.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Js_of_ocaml https://ocsigen.org/js_of_ocaml/
 * @summary OCaml toplevel compiled to JavaScript, including the standard library and browser bindings.
 */
// tp-docgen:dependencies:end

import { TpTraceableInterpreter } from "../interpreter/traceable-interpreter.js";
import { createOCamlSession, OCAML_RUNTIME_URL } from "./ocaml-runtime.js";
/**
 * The custom `<tp-ocaml>` element provides an interactive OCaml interpreter.
 *
 * @summary Provides an interactive OCaml interpreter.
 * @tagname tp-ocaml
 * @keyboard {Shift+Enter} Reload changed source, then execute the current query from its input field.
 * @attr {boolean} tracer = false - Enables tracing the current source and query in a drawer initially 75% wide.
 * @attr {string} src = "" - External OCaml source; takes precedence over value and an inline script.
 * @attr {string} value = "" - Initial program, evaluated when the session starts or resets.
 * @attr {string} query = "" - Initial command, restored by Reset.
 * @attr {string} filename = "program.ml" - Source filename displayed in the toolbar and editor.
 * @keyboard {Enter} Reload changed source, then execute the current query from its input field.
 * @keyboard {ArrowUp / ArrowDown} Recalls previous commands.
 * @attr {"default" | "lite" | "simple"} mode = "default" - Presentation mode: default and lite show the normal interface; simple opens the editor and hides the header, welcome information and query action buttons.
 * @example
 * <tp-ocaml query="square 7;;">
 *   <script type="tp/ocaml">
 *     let square x = x * x;;
 *   </script>
 * </tp-ocaml>
 */
export class TpOCaml extends TpTraceableInterpreter {
	protected readonly language = "ocaml";
	protected readonly languageName = "OCaml";
	protected readonly extension = "ml";
	protected async loadTracer(): Promise<void> {
		await import("../ocaml-tracer/ocaml-tracer.js");
	}
	protected override composeTraceSource(source: string, query: string): string {
		// A program may omit its final phrase separator; the query must remain
		// a separate toplevel phrase instead of becoming part of its last binding.
		return super.composeTraceSource(
			source.trim() ? `${source.trimEnd()}\n;;` : "",
			query,
		);
	}
	/** Opens the trace drawer when tracer is enabled. */
	override async openTrace(): Promise<void> {
		await super.openTrace();
	}
	/** Executes a command, or the current prompt when omitted. */
	override async run(code?: string): Promise<void> {
		await super.run(code);
	}
	/** Clears output while preserving variables and history. */
	override clear(): void {
		super.clear();
	}
	/** Restores the original source and command in a fresh session. */
	override async reset(): Promise<void> {
		await super.reset();
	}
	/** Shows or hides the editable source. */
	override async toggleSource(): Promise<void> {
		await super.toggleSource();
	}
	/** Starts a fresh session with the edited source. */
	override async applySource(): Promise<void> {
		await super.applySource();
	}

	protected override get eagerEngine(): boolean {
		return true;
	}
	protected override get engineDescription(): string {
		return "OCaml · Loading Js_of_ocaml…";
	}

	protected async createEngine(
		write: (text: string) => void,
		host: HTMLElement = this,
	) {
		const session = await createOCamlSession(
			host,
			write,
			OCAML_RUNTIME_URL,
			interpreterConsole(write),
		);
		return {
			...session,
			execute: async (code: string) => {
				const result = await session.execute(code);
				return this.hasAttribute("data-tp-notebook-interpreter")
					? formatOCamlResults(result)
					: result;
			},
		};
	}
}
if (!customElements.get("tp-ocaml")) customElements.define("tp-ocaml", TpOCaml);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml": TpOCaml;
	}
}
