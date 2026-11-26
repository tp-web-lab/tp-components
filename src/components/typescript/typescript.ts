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
 * @credit TypeScript https://www.typescriptlang.org/
 * @summary TypeScript transpilation and language services.
 */
// tp-docgen:dependencies:end

/** @module components/typescript */
import { version as typescriptVersion } from "typescript/package.json";
import { javascriptEngineDescription } from "../interpreter/javascript-engine-info.js";
import { TpTraceableInterpreter } from "../interpreter/traceable-interpreter.js";
import { createTypescriptEngine } from "./typescript-engine.js";
/**
 * The custom `<tp-typescript>` element provides an interactive TypeScript interpreter.
 *
 * @summary Provides an interactive TypeScript interpreter.
 * @tagname tp-typescript
 * @keyboard {Shift+Enter} Reload changed source, then execute the current query from its input field.
 * @attr {boolean} tracer = false - Enables tracing the current source and query in a drawer initially 75% wide.
 * @attr {string} src = "" - External TypeScript source; takes precedence over value and an inline script.
 * @attr {string} value = "" - Initial program, evaluated when the session starts or resets.
 * @attr {string} query = "" - Initial command, restored by Reset.
 * @attr {string} filename = "program.ts" - Source filename displayed in the toolbar and editor.
 * @keyboard {Enter} Reload changed source, then execute the current query from its input field.
 * @keyboard {ArrowUp / ArrowDown} Recalls previous commands.
 * @attr {"default" | "lite" | "simple"} mode = "default" - Presentation mode: default and lite show the normal interface; simple opens the editor and hides the header, welcome information and query action buttons.
 * @example
 * <tp-typescript query="square(7)">
 *   <script type="tp/typescript">
 *     function square(x: number): number {
 *       return x * x;
 *     }
 *   </script>
 * </tp-typescript>
 */
export class TpTypescript extends TpTraceableInterpreter {
	protected readonly language = "typescript";
	protected readonly languageName = "TypeScript";
	protected readonly extension = "ts";
	protected async loadTracer(): Promise<void> {
		await import("../typescript-tracer/typescript-tracer.js");
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

	protected override get engineDescription(): string {
		return `TypeScript ${typescriptVersion} → ${javascriptEngineDescription()}`;
	}

	protected createEngine(
		write: (text: string) => void,
		host: HTMLElement = this,
	) {
		return createTypescriptEngine(host, write);
	}
}
if (!customElements.get("tp-typescript"))
	customElements.define("tp-typescript", TpTypescript);
declare global {
	interface HTMLElementTagNameMap {
		"tp-typescript": TpTypescript;
	}
}
