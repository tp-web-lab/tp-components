import { interpreterConsole } from "../interpreter/interpreter-console.js";
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
 * @credit LIPS https://lips.js.org/
 * @summary Scheme execution in JavaScript with its standard library.
 */
// tp-docgen:dependencies:end

/** @module components/scheme */
import { TpTraceableInterpreter } from "../interpreter/traceable-interpreter.js";
import { createSchemeSession } from "./scheme-runtime.js";
/**
 * The custom `<tp-scheme>` element provides an interactive Scheme interpreter.
 *
 * @summary Provides an interactive Scheme interpreter.
 * @tagname tp-scheme
 * @keyboard {Shift+Enter} Reload changed source, then execute the current query from its input field.
 * @attr {boolean} tracer = false - Enables tracing the current source and query in a drawer initially 75% wide.
 * @attr {string} src = "" - External Scheme source; takes precedence over value and an inline script.
 * @attr {string} value = "" - Initial program, evaluated when the session starts or resets.
 * @attr {string} query = "" - Initial command, restored by Reset.
 * @attr {string} filename = "program.scm" - Source filename displayed in the toolbar and editor.
 * @keyboard {Enter} Reload changed source, then execute the current query from its input field.
 * @keyboard {ArrowUp / ArrowDown} Recalls previous commands.
 * @attr {"default" | "lite" | "simple"} mode = "default" - Presentation mode: default and lite show the normal interface; simple opens the editor and hides the header, welcome information and query action buttons.
 * @example
 * <tp-scheme query="(square 7)">
 *   <script type="tp/scheme">
 *     (define (square x)
 *       (* x x))
 *   </script>
 * </tp-scheme>
 */
export class TpScheme extends TpTraceableInterpreter {
	protected readonly language = "scheme";
	protected readonly languageName = "Scheme";
	protected readonly extension = "scm";
	protected async loadTracer(): Promise<void> {
		await import("../scheme-tracer/scheme-tracer.js");
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
		return "Scheme · Loading LIPS…";
	}

	protected async createEngine(
		write: (text: string) => void,
		host: HTMLElement = this,
	) {
		const session = await createSchemeSession(host, write);
		session.set("console", interpreterConsole(write));
		return session;
	}
}
if (!customElements.get("tp-scheme"))
	customElements.define("tp-scheme", TpScheme);
declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme": TpScheme;
	}
}
