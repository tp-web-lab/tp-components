/** @module components/prolog-tracer */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
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
 * @credit SWI-Prolog https://www.swi-prolog.org/
 * @summary Native debugger interception through the pinned swipl-wasm runtime.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { TpBase } from "../base/base.js";
import interpreterStyles from "../interpreter/interpreter.css?inline";
import styles from "./prolog-tracer.css?inline";
import { createTraceRuntime } from "./prolog-tracer-runtime.js";
import "../toolbar/toolbar.js";
import "../textfield/textfield.js";
import "../code-editor/code-editor.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import "../icon/icon.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";

/**
 * The custom `<tp-prolog-tracer>` element records and replays Prolog execution with the explored resolution tree and backtracking.
 *
 * @summary Records and replays Prolog execution with the explored resolution tree and backtracking.
 * @tagname tp-prolog-tracer
 * @attr {string} query = "" - Prolog goal whose resolution is recorded.
 * @attr {string} src = "" - Prolog source URL; loaded without executing the program.
 * @attr {string} trace = "" - Complete JSON recording URL; takes precedence over src and inline source without executing Prolog.
 * @attr {string} filename = "" - Display filename override; defaults to the source basename or program.pl.
 * @attr {string} value = "" - Prolog source used when src and trace are absent.
 * @example
 * <tp-prolog-tracer src="/docs/components/prolog-tracer/examples/family.pl" query="ancestor(ann, Who)."></tp-prolog-tracer>
 */
export class TpPrologTracer extends TpBase {
	private runtime?: ReturnType<typeof createTraceRuntime>;
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/prolog"],
		ignoreSelector: "[data-tp-prolog-tracer-generated]",
	});
	static get observedAttributes(): string[] {
		return ["src", "trace", "value", "filename", "query"];
	}
	/** Goal to resolve; the editable query field is used when recording. */
	get query(): string {
		return this.getAttribute("query") ?? "";
	}
	set query(value: string) {
		this.setAttribute("query", value);
	}
	/** Prolog source URL. */
	get src(): string {
		return this.getAttribute("src") ?? "";
	}
	set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Saved JSON recording URL, taking precedence over the source. */
	get trace(): string {
		return this.getAttribute("trace") ?? "";
	}
	set trace(value: string) {
		this.setAttribute("trace", value);
	}
	/** Inline Prolog source, when no source URL or trace URL is supplied. */
	get value(): string {
		return this.getAttribute("value") ?? "";
	}
	set value(value: string) {
		this.setAttribute("value", value);
	}
	/** Overrides the filename displayed in the toolbar. */
	get filename(): string {
		return this.getAttribute("filename") ?? "";
	}
	set filename(value: string) {
		this.setAttribute("filename", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-prolog-tracer-styles", styles);
		this.ensureGlobalStyle("tp-interpreter-style", interpreterStyles);
		this.source.capture();
		if (!this.runtime)
			this.runtime = createTraceRuntime(this, (init: RequestInit) =>
				this.source.read(init),
			);
		this.source.observe(() => {
			void this.refresh();
		});
		void this.refresh();
	}
	protected disconnectedCallback(): void {
		this.source.disconnect();
		this.runtime?.destroy();
		this.runtime = undefined;
	}
	protected attributeChangedCallback(name: string): void {
		if (name === "filename") this.runtime?.updateFilename();
		else if (this.isConnected) void this.refresh();
	}
	/** Reloads the trace or source according to attribute precedence. */
	async refresh(): Promise<void> {
		await this.runtime?.loadAttributes();
	}
	/** Shows or hides the Prolog editor without changing the recording. */
	toggleSource(): void {
		this.runtime?.toggleSource();
	}
	/** Records the current editor source in a fresh Prolog Worker. */
	record(): void {
		this.runtime?.record();
	}
	/** Terminates the current recording Worker. */
	stop(): void {
		this.runtime?.stop();
	}
	/** Opens Save as for the complete recording, including its original source. */
	async saveAs(): Promise<void> {
		await this.runtime?.saveAs();
	}
	/** Returns the complete versioned JSON recording as a string. */
	getCode(): string {
		return this.runtime?.getCode() ?? "";
	}
	/** Displays a zero-based event index; -1 restores the query root. */
	goTo(index: number): void {
		this.runtime?.goTo(index);
	}

	/** Restores the first displayed step. */
	firstStep(): void {
		this.runtime?.firstStep();
	}

	/** Displays the preceding step. */
	previousStep(): void {
		this.runtime?.previousStep();
	}

	/** Displays the following step. */
	nextStep(): void {
		this.runtime?.nextStep();
	}

	/** Displays the final recorded step. */
	lastStep(): void {
		this.runtime?.lastStep();
	}

	/** Opens the saved trace file chooser without starting the language engine. */
	loadTrace(): void {
		this.runtime?.loadTrace();
	}

	/** Expands or collapses the trace JSON panel. */
	toggleJson(): void {
		this.runtime?.toggleJson();
	}
}
if (!customElements.get("tp-prolog-tracer"))
	customElements.define("tp-prolog-tracer", TpPrologTracer);
declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog-tracer": TpPrologTracer;
	}
}
