import { claimInterpreterEngineNotice } from "../../utilities/interpreter-engine-notice.js";
import { InterpreterTraceController } from "../interpreter/interpreter-trace-controller.js";
import { prologNotebookSource } from "./prolog-notebook-source.js";
/** @module components/prolog */
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
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
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
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
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
 * @credit SWI-Prolog WASM https://www.swi-prolog.org/
 * @summary Prolog execution in the browser.
 */
// tp-docgen:dependencies:end

import { getCodeFromScript } from "../../utilities/code.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import { readInterpreterSource } from "../interpreter/interpreter-source.js";
import "../toolbar/toolbar.js";
import "../divider/divider.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";
import "../textfield/textfield.js";
import "../dropdown/dropdown.js";
import "../menu/menu.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import { setupTpDropdownTriggers } from "../dropdown/dropdown-triggers.js";
import { createSwiplInformation } from "../prolog-playground/prolog-runtime.js";
import type { TpTextfield } from "../textfield/textfield.js";
import style from "./prolog.css?inline";
import { createPrologEngine, type PrologEngine } from "./prolog-engine.js";

let prologSequence = 0;
const prologLibraries = [
	["aggregate", "aggregate"],
	["apply", "apply"],
	["assoc", "assoc"],
	["clpfd", "clpfd"],
	["clpq", "clpq"],
	["clpr", "clpr"],
	["dcg/basics", "dcg_basics"],
	["dif", "dif"],
	["dom", "dom"],
	["lists", "lists"],
	["ordsets", "ordsets"],
	["pairs", "pairs"],
	["plunit", "plunit"],
	["random", "random"],
	["wasm", "wasm"],
	["when", "when"],
] as const;

/**
 * The custom `<tp-prolog>` element provides an interactive Prolog interpreter.
 *
 * @summary Provides an interactive Prolog interpreter.
 * @tagname tp-prolog
 * @keyboard {Shift+Enter} Reload changed source, then execute the current query from its input field.
 * @attr {string} src = "" - External Prolog source file; takes precedence over value and the inline script. Changes take effect on Reset.
 * @attr {boolean} tracer = false - Enables recording the current program and query in a drawer initially 75% wide.
 * @attr {string} query = "" - Initial query shown in the prompt and restored by Reset.
 * @attr {string} value = "" - Prolog program consulted when the interpreter starts or resets; takes precedence over an inline script.
 * @attr {string} filename = "program.pl" - Filename displayed in the toolbar and source editor; defaults to the src basename or the inline script filename when provided.
 * @keyboard {Enter} Reload changed source and submit the query, or accept the current solution when the prompt is empty.
 * @keyboard {ArrowUp / ArrowDown} Recalls previous queries.
 * @keyboard {Escape} Stops requesting further solutions.
 * @attr {"default" | "lite" | "simple"} mode = "default" - Presentation mode: default and lite show the normal interface; simple opens the editor and hides the header and welcome information while retaining all query actions.
 * @example
 * <tp-prolog>
 *   <script type="tp/prolog">
 *     color(red).
 *     color(green).
 *     color(blue).
 *   </script>
 * </tp-prolog>
 */
export class TpProlog extends TpBase {
	private readonly traceController = new InterpreterTraceController(this, {
		language: "prolog",
		languageName: "Prolog",
		loadTracer: async () => {
			await import("../prolog-tracer/prolog-tracer.js");
		},
		composeSource: (source) => source,
	});
	/** Shows the optional trace command. */
	get tracer(): boolean {
		return this.hasAttribute("tracer");
	}
	set tracer(value: boolean) {
		this.toggleAttribute("tracer", value);
	}
	/** Records the current program and query in a drawer initially 75% wide. */
	async openTrace(): Promise<void> {
		await this.traceController.openTrace();
	}
	protected disconnectedCallback(): void {
		this.traceController.cancelTrace();
	}

	private engine?: PrologEngine;
	private editor?: TpCodeEditor;
	private editedSource?: string;
	private loadedSource?: string;
	private fileSource?: { url: string; content: Promise<string> };
	private loading?: Promise<PrologEngine>;
	private output?: HTMLDivElement;
	private lastAnswer?: Text;
	private loadedLibraries = new Set<string>();
	private input?: TpTextfield;
	private panel?: HTMLDivElement;
	private busy = false;
	private modePending = false;
	private pending = false;
	private draining = false;
	private stopRequested = false;
	private history: string[] = [];
	private historyIndex = 0;
	private draft = "";
	private generation = 0;

	/** Program consulted at startup; changes take effect on reset. */
	get value(): string {
		return (
			this.getAttribute("value") ??
			getCodeFromScript("prolog", this)?.value ??
			""
		);
	}
	set value(value: string) {
		this.setAttribute("value", value);
	}

	/** External Prolog file, resolved relative to the containing document. */
	/** Returns the current program, including unsaved editor changes. */
	public async getSource(): Promise<string> {
		return (
			this.editor?.getValue() ?? this.editedSource ?? (await this.readSource())
		);
	}
	get src(): string {
		return this.getAttribute("src") ?? "";
	}
	set src(value: string) {
		this.setAttribute("src", value);
	}
	private async readSource(): Promise<string> {
		if (!this.src.trim()) return this.value;
		const url = resolveComponentSourceUrl(this, this.src).href;
		if (this.fileSource?.url !== url) {
			const content = readInterpreterSource(this, "prolog").catch((error) => {
				if (this.fileSource?.url === url) this.fileSource = undefined;
				throw error;
			});
			this.fileSource = { url, content };
		}
		return this.fileSource.content;
	}
	/** Filename displayed in the toolbar and source editor. */
	get filename(): string {
		const explicit = this.getAttribute("filename");
		if (explicit) return explicit;
		if (this.src.trim()) {
			try {
				return decodeURIComponent(
					resolveComponentSourceUrl(this, this.src).pathname.split("/").pop() ||
						"program.pl",
				);
			} catch {
				return "program.pl";
			}
		}
		return getCodeFromScript("prolog", this)?.filename || "program.pl";
	}
	set filename(value: string) {
		this.setAttribute("filename", value);
	}
	/** Initial prompt query, restored by Reset. */
	get query(): string {
		return this.getAttribute("query") ?? "";
	}
	set query(value: string) {
		this.setAttribute("query", value);
	}
	/** Presentation mode; lite retains the default interpreter interface. */
	get mode(): "default" | "lite" | "simple" {
		const mode = this.getAttribute("mode");
		return mode === "lite" || mode === "simple" ? mode : "default";
	}
	set mode(value: "default" | "lite" | "simple") {
		this.setAttribute("mode", value);
	}
	private updateMode(): void {
		if (!this.panel) return;
		const simple = this.mode === "simple";
		for (const node of this.panel.querySelectorAll<HTMLElement>(
			":scope > .tp-interpreter-toolbar, [data-interpreter-greeting]",
		))
			node.hidden = simple;
		const source = this.panel.querySelector<HTMLElement>(
			".tp-interpreter-source",
		);
		if (simple && source?.hidden) {
			if (this.busy) this.modePending = true;
			else
				void this.toggleSource().catch((error) =>
					this.write(
						`ERROR: ${error instanceof Error ? error.message : String(error)}\n`,
					),
				);
		}
	}

	static get observedAttributes(): string[] {
		return ["filename", "src", "query", "mode", "tracer"];
	}
	protected attributeChangedCallback(name: string): void {
		if (name === "mode") this.updateMode();
		if (name === "mode" || name === "tracer")
			this.traceController.updateTraceCommand();
		this.updateFilename();
		if (name === "query" && this.input) this.input.value = this.query;
	}
	private updateFilename(): void {
		const label = this.panel?.querySelector<HTMLElement>(
			"[data-interpreter-filename]",
		);
		if (label) {
			label.textContent = this.filename;
			label.title = this.filename;
		}
		if (this.editor) this.editor.filename = this.filename;
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-prolog-style", style);
		if (this.panel) {
			this.traceController.updateTraceCommand();
			return;
		}
		this.panel = document.createElement("div");
		this.panel.dataset.tpGenerated = "";
		this.panel.className = "tp-interpreter-panel tp-prolog-panel";
		this.panel.innerHTML = `<tp-toolbar class="tp-interpreter-toolbar tp-prolog-toolbar">
        <span section="start" class="tp-interpreter-title tp-prolog-title"><tp-icon name="file_type_prolog" library="languages" size="1.5em" aria-hidden="true"></tp-icon> Prolog</span>
        <span section="center" class="tp-interpreter-file tp-prolog-file"><span data-interpreter-filename data-prolog-filename></span></span>
        <tp-icon-button section="end" data-prolog-edit name="code" label="Edit source" title="Edit source" pill outlined variant="brand" aria-expanded="false"></tp-icon-button><tp-divider section="end" orientation="vertical" inline data-document-navbar-divider></tp-divider><tp-color section="end"></tp-color><tp-theme section="end"></tp-theme><tp-fullscreen section="end"></tp-fullscreen>
      </tp-toolbar><div class="tp-interpreter-source tp-prolog-source" hidden><div data-prolog-editor></div></div><div class="tp-interpreter-output tp-prolog-output" role="log" aria-label="Prolog transcript" aria-live="polite" tabindex="0"></div>
      <div class="tp-interpreter-prompt tp-prolog-prompt"><span aria-hidden="true">?-</span><tp-textfield clearable copy-code aria-label="Prolog query" placeholder="Enter a Prolog query" autocomplete="off"></tp-textfield></div>
      <div class="tp-interpreter-actions tp-prolog-actions"><tp-icon-button name="play" data-action="run" label="Run" title="Run" pill outlined variant="brand"></tp-icon-button><tp-icon-button name="next" data-action="next" label="Next solution ;" title="Next solution ;" pill outlined variant="brand" disabled></tp-icon-button><tp-icon-button name="play-all" data-action="all" label="All solutions" title="All solutions" pill outlined variant="brand"></tp-icon-button><tp-icon-button name="check" data-action="accept" label="Accept ." title="Accept ." pill outlined variant="brand" disabled></tp-icon-button><tp-icon-button name="delete-outline" data-action="clear" label="Clear" title="Clear" pill outlined variant="brand"></tp-icon-button><tp-icon-button name="refresh" data-action="reset" label="Reset" title="Reset" pill outlined variant="brand"></tp-icon-button></div>`;
		this.output =
			this.panel.querySelector<HTMLDivElement>(".tp-interpreter-output") ??
			undefined;
		this.input =
			this.panel.querySelector<TpTextfield>("tp-textfield") ?? undefined;
		if (this.input) {
			if (
				this.hasAttribute("data-tp-notebook-interpreter") &&
				this.query.includes("\n")
			) {
				this.input.multiline = true;
				this.input.setAttribute("rows", "1");
			}
			this.input.value = this.query;
		}
		if (!this.id) this.id = `tp-prolog-${++prologSequence}`;
		for (const control of this.panel.querySelectorAll(
			"tp-color,tp-theme,tp-fullscreen",
		)) {
			control.setAttribute("anchor", `#${CSS.escape(this.id)}`);
		}
		this.updateFilename();
		const libraries = document.createElement("div");
		libraries.className = "tp-prolog-libraries";
		const menuId = `tp-prolog-libraries-${++prologSequence}`;
		libraries.innerHTML = `<tp-icon-button id="${menuId}-trigger" name="file_type_swiprolog" library="languages" label="Libraries" title="SWI-Prolog libraries" pill outlined variant="brand" data-prolog-libraries-trigger data-tp-dropdown-action="toggle" data-tp-dropdown-target="#${menuId}" aria-haspopup="menu" aria-expanded="false"></tp-icon-button>
		<tp-dropdown id="${menuId}" anchor="#${menuId}-trigger" placement="bottom" outside-click><tp-menu><ul aria-label="SWI-Prolog libraries">${prologLibraries.map(([name]) => `<li data-prolog-library="${name}" aria-label="${name}: not loaded"><tp-icon name="check" size="1em" aria-hidden="true"></tp-icon><span>${name}</span></li>`).join("")}</ul></tp-menu></tp-dropdown>`;
		this.panel.querySelector(".tp-interpreter-actions")?.append(libraries);
		libraries.addEventListener("tp-menu-item-select", (event) => {
			const item = (event as CustomEvent<{ item: HTMLElement }>).detail.item;
			const name = item.getAttribute("data-prolog-library");
			if (name && item.getAttribute("aria-disabled") !== "true")
				void this.loadLibrary(name);
		});
		this.append(this.panel);
		this.traceController.updateTraceCommand();
		setupTpDropdownTriggers(this.panel);
		this.controls();
		this.panel.addEventListener("click", (event) => {
			if ((event.target as Element).closest("tp-code-editor")) return;
			if ((event.target as Element).closest("[data-prolog-edit]"))
				void this.toggleSource().catch((error) =>
					this.write(
						`ERROR: ${error instanceof Error ? error.message : String(error)}\n`,
					),
				);
			const action = (event.target as Element)
				.closest("[data-action]")
				?.getAttribute("data-action");
			if (action === "run") void this.run(this.input?.value ?? "");
			if (action === "next") void this.next();
			if (action === "all") void this.all();
			if (action === "accept") void this.accept();
			if (action === "clear") this.clear();
			if (action === "reset") void this.reset();
		});
		this.panel.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && this.draining) {
				event.preventDefault();
				void this.accept();
			}
		});
		this.input?.addEventListener("keydown", (event) =>
			this.keydown(event as KeyboardEvent),
		);
		this.panel.addEventListener(
			"keydown",
			(event) => {
				if (
					event.key === "Enter" &&
					event.shiftKey &&
					!event.ctrlKey &&
					!event.altKey &&
					!event.metaKey &&
					!event.isComposing &&
					(event.target as Element).closest("tp-code-editor")
				) {
					event.preventDefault();
					event.stopPropagation();
					if (!event.repeat) void this.run();
				}
			},
			true,
		);
		this.writeGreeting();
		this.updateMode();
	}

	private writeGreeting(): void {
		if (this.mode === "simple") return;
		const greeting = document.createElement("span");
		greeting.dataset.interpreterGreeting = "";
		greeting.append("tp-prolog - enter a query ending with a full stop.\n");
		if (claimInterpreterEngineNotice(this, "prolog"))
			greeting.append(...createSwiplInformation().childNodes, "\n");
		this.output?.append(greeting);
	}

	private keydown(event: KeyboardEvent): void {
		if (event.key === "Escape" && this.draining) {
			event.preventDefault();
			void this.accept();
			return;
		}
		if (event.isComposing || !this.input || this.busy) return;
		if (event.key === "Enter") {
			event.preventDefault();
			if (event.repeat) return;
			const reload = !event.ctrlKey && !event.altKey && !event.metaKey;
			void this.runQuery(this.input.value, reload);
		}
		if (event.key === "Escape") {
			event.preventDefault();
			void this.accept();
		}
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault();
			if (this.historyIndex === this.history.length)
				this.draft = this.input.value;
			this.historyIndex = Math.max(
				0,
				Math.min(
					this.history.length,
					this.historyIndex + (event.key === "ArrowUp" ? -1 : 1),
				),
			);
			this.input.value = this.history[this.historyIndex] ?? this.draft;
		}
	}

	private write(text: string): Text {
		const node = document.createTextNode(text);
		this.output?.append(node);
		if (this.output) this.output.scrollTop = this.output.scrollHeight;
		return node;
	}
	private writeAnswerMarker(marker: ";" | "."): void {
		if (this.lastAnswer && this.lastAnswer.parentNode === this.output) {
			const text = this.lastAnswer.data.replace(/\n$/, "");
			if (marker !== "." || !text.endsWith("."))
				this.lastAnswer.data = `${text} ${marker}\n`;
		} else this.write(`${marker}\n`);
	}
	private updateLibraries(): void {
		this.panel
			?.querySelector("[data-prolog-libraries-trigger]")
			?.toggleAttribute("disabled", this.busy);
		for (const item of this.panel?.querySelectorAll<HTMLElement>(
			"[data-prolog-library]",
		) ?? []) {
			const name = item.dataset.prologLibrary ?? "";
			const loaded = this.loadedLibraries.has(name);
			const conflict =
				(name === "clpq" && this.loadedLibraries.has("clpr")) ||
				(name === "clpr" && this.loadedLibraries.has("clpq"));
			item.toggleAttribute("data-loaded", loaded);
			item.setAttribute(
				"aria-disabled",
				String(this.busy || loaded || conflict),
			);
			item.setAttribute(
				"aria-label",
				`${name}: ${loaded ? "loaded" : conflict ? "conflicts with the loaded constraint library" : "not loaded"}`,
			);
		}
	}
	private async syncLibraries(): Promise<void> {
		if (!this.engine) this.loadedLibraries.clear();
		else {
			const modules = prologLibraries
				.map(([name, module]) => `'${name}'-'${module}'`)
				.join(",");
			const rows = await this.engine.prolog.forEach(
				`member(Library-Module, [${modules}]), current_module(Module)`,
			);
			this.loadedLibraries = new Set(rows.map((row) => String(row.Library)));
		}
		this.updateLibraries();
	}
	/** Loads a supported SWI-Prolog library, as from the libraries dropdown. */
	async loadLibrary(name: string): Promise<void> {
		if (
			!prologLibraries.some(([library]) => library === name) ||
			this.loadedLibraries.has(name)
		)
			return;
		await this.perform(async () => {
			await this.closeQuery();
			const engine = await this.runtime();
			await this.syncLibraries();
			if (
				(name === "clpq" && this.loadedLibraries.has("clpr")) ||
				(name === "clpr" && this.loadedLibraries.has("clpq"))
			)
				throw new Error(
					"CLP(Q) and CLP(R) cannot be imported together. Reset before changing constraint libraries.",
				);
			this.write(`?- use_module(library('${name}')).\n`);
			const answers = await engine.prolog.forEach(
				`user:use_module(library('${name}'))`,
			);
			this.write(answers.length ? "true.\n" : "false.\n");
		});
	}
	private controls(): void {
		this.updateLibraries();
		this.setAttribute("aria-busy", String(this.busy));
		if (this.input) this.input.disabled = this.busy;
		for (const button of this.panel?.querySelectorAll(
			".tp-interpreter-actions > tp-icon-button",
		) ?? []) {
			const action = button.getAttribute("data-action");
			button.toggleAttribute(
				"disabled",
				(this.busy && !(action === "accept" && this.draining)) ||
					((action === "next" || action === "accept") && !this.pending),
			);
		}
	}
	private async runtime(): Promise<PrologEngine> {
		if (this.engine) return this.engine;
		this.loading ??= (async () => {
			const generation = this.generation;
			const source =
				this.editedSource ??
				prologNotebookSource(this, await this.readSource());
			const engine = await createPrologEngine((text) => {
				if (generation === this.generation) this.write(text);
			}, this.hasAttribute("data-tp-notebook-interpreter"));
			if (source.trim())
				await engine.prolog.load_string(
					source,
					`/${this.filename.replace(/^\/+/, "")}`,
				);
			this.engine = engine;
			this.loadedSource = source;
			return engine;
		})().catch((error) => {
			this.loading = undefined;
			throw error;
		});
		return this.loading;
	}
	private async closeQuery(): Promise<void> {
		if (this.pending && this.engine)
			await this.engine.prolog.forEach("engine_destroy(tp_repl)");
		this.pending = false;
		this.lastAnswer = undefined;
	}
	private async advance(): Promise<void> {
		if (!this.engine || !this.pending) return;
		const answers = await this.engine.prolog.forEach(
			"engine_next(tp_repl, Text)",
		);
		if (!answers.length) {
			this.write("false.\n");
			await this.closeQuery();
		} else this.lastAnswer = this.write(`${String(answers[0]?.Text)}\n`);
	}
	private async perform(action: () => Promise<void>): Promise<void> {
		if (this.busy) return;
		this.busy = true;
		this.controls();
		try {
			await action();
		} catch (error) {
			this.write(
				`ERROR: ${error instanceof Error ? error.message : String(error)}\n`,
			);
			try {
				await this.closeQuery();
			} catch {
				this.pending = false;
			}
		} finally {
			try {
				await this.syncLibraries();
			} catch {
				this.updateLibraries();
			}
			this.busy = false;
			this.controls();
			if (this.modePending) {
				this.modePending = false;
				this.updateMode();
			}
			this.input?.querySelector<HTMLInputElement>("input")?.focus();
		}
	}

	/** Shows or hides the editable Prolog source without changing the running session. */
	async toggleSource(): Promise<void> {
		const host = this.panel?.querySelector<HTMLElement>(
			".tp-interpreter-source",
		);
		if (!host) return;
		if (!this.editor) {
			const source = this.editedSource ?? (await this.readSource());
			const { TpCodeEditor } = await import("../code-editor/code-editor.js");
			if (!this.editor) {
				this.editor = new TpCodeEditor();
				this.editor.language = "prolog";
				this.editor.filename = this.filename;
				this.editor.value = source;
				this.editor.toolbar = true;
				this.editor.lineNumbers = true;
				this.editor.wordWrap = true;
				host.querySelector("[data-prolog-editor]")?.append(this.editor);
			}
		}
		host.hidden = this.mode === "simple" ? false : !host.hidden;
		this.controls();
		this.panel
			?.querySelector("[data-prolog-edit]")
			?.setAttribute("aria-expanded", String(!host.hidden));
	}
	/** Applies the editor source in a fresh session; Reset restores the authored program. */
	async applySource(): Promise<void> {
		if (!this.editor) return;
		await this.perform(async () => {
			await this.closeQuery();
			this.editedSource = this.editor?.getValue() ?? "";
			this.generation++;
			this.engine = undefined;
			this.loading = undefined;
			this.clear();
			await this.runtime();
			this.write(`Source applied: ${this.filename}\n`);
		});
	}

	/** Reloads changed source, then executes a query and displays its first answer. */
	async run(source = this.input?.value ?? this.query): Promise<void> {
		await this.runQuery(source, true);
	}

	private async runQuery(source: string, reload = false): Promise<void> {
		const query = source.trim().replace(/^\?-\s*/, "");
		if (query === ";") return this.next();
		if (!query || query === ".") return this.accept();
		await this.perform(async () => {
			await this.closeQuery();
			if (reload) {
				const current = prologNotebookSource(
					this,
					this.editor?.getValue() ?? (await this.readSource()),
				);
				if (!this.engine || current !== this.loadedSource) {
					const reloaded = this.loadedSource !== undefined;
					this.generation++;
					this.engine = undefined;
					this.loading = undefined;
					this.editedSource = current;
					await this.runtime();
					if (reloaded) this.write("> Program reloaded.\n");
				}
			}
			this.write(`?- ${query}\n`);
			this.history.push(query);
			this.historyIndex = this.history.length;
			this.draft = this.input?.value ?? "";
			const engine = await this.runtime();
			await engine.prolog.forEach(
				"engine_create(Text, (call_with_inference_limit(tp_runtime:run(Source, Text), 1000000, Limit), (Limit == inference_limit_exceeded -> throw(error(resource_error(inference_limit), tp_prolog)); true)), tp_repl)",
				{ Source: query },
			);
			this.pending = true;
			await this.advance();
		});
	}
	/** Requests the next answer without recomputing earlier solutions. */
	async next(): Promise<void> {
		await this.perform(async () => {
			if (this.pending) {
				this.writeAnswerMarker(";");
				await this.advance();
			}
		});
	}
	/** Displays remaining answers when the prompt is unchanged or empty; otherwise executes the entered query. */
	async all(): Promise<void> {
		if (this.busy) return;
		const source = this.input?.value.trim() ?? "";
		if (
			source &&
			(!this.pending || source.replace(/^\?-\s*/, "") !== this.history.at(-1))
		)
			await this.run(source);
		await this.perform(async () => {
			if (!this.pending) return;
			this.draining = true;
			this.stopRequested = false;
			this.controls();
			this.panel
				?.querySelector<HTMLButtonElement>('[data-action="accept"] button')
				?.focus();
			try {
				while (this.pending && !this.stopRequested) {
					this.writeAnswerMarker(";");
					await this.advance();
					if (this.pending)
						await new Promise<void>((resolve) => setTimeout(resolve, 0));
				}
				if (this.stopRequested && this.pending) {
					this.writeAnswerMarker(".");
					await this.closeQuery();
				}
			} finally {
				this.draining = false;
			}
		});
	}
	/** Accepts the current answer and closes its remaining choice points. */
	async accept(): Promise<void> {
		if (this.draining) {
			this.stopRequested = true;
			return;
		}
		await this.perform(async () => {
			if (this.pending) {
				this.writeAnswerMarker(".");
				await this.closeQuery();
			}
		});
	}
	/** Clears the transcript while retaining the program and query history. */
	clear(): void {
		this.lastAnswer = undefined;
		this.output?.replaceChildren();
	}
	/** Discards session changes and reloads the initial program in a fresh interpreter. */
	async reset(): Promise<void> {
		await this.perform(async () => {
			await this.closeQuery();
			this.generation++;
			this.editedSource = undefined;
			this.engine = undefined;
			this.loading = undefined;
			if (this.editor) this.editor.setValue(await this.readSource());
			this.history = [];
			this.historyIndex = 0;
			this.draft = "";
			if (this.input) this.input.value = this.query;
			this.clear();
			this.writeGreeting();
		});
	}
}
if (!customElements.get("tp-prolog"))
	customElements.define("tp-prolog", TpProlog);
declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog": TpProlog;
	}
}
