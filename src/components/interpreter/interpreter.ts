import { getCodeFromScript } from "../../utilities/code.js";
import { claimInterpreterEngineNotice } from "../../utilities/interpreter-engine-notice.js";
import { TpBase } from "../base/base.js";
import {
	releaseInterpreterScope,
	scopedInterpreterEngine,
} from "./interpreter-scope.js";
import "../toolbar/toolbar.js";
import "../divider/divider.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";
import "../textfield/textfield.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import type { TpTextfield } from "../textfield/textfield.js";
import style from "./interpreter.css?inline";
import { readInterpreterSource } from "./interpreter-source.js";

export interface InterpreterEngine {
	readonly description?: string;
	execute(code: string): Promise<string>;
	dispose(): void;
}
let sequence = 0;
/** Shared light-DOM interface and lifecycle for imperative language interpreters. */
export abstract class TpInterpreter extends TpBase {
	protected abstract readonly language: string;
	protected abstract readonly languageName: string;
	protected abstract readonly extension: string;
	protected abstract createEngine(
		write: (text: string) => void,
		host?: HTMLElement,
	): Promise<InterpreterEngine>;
	private panel?: HTMLElement;
	private output?: HTMLElement;
	private input?: TpTextfield;
	private editor?: TpCodeEditor;
	private engine?: InterpreterEngine;
	private engineLabel?: Text;
	private busy = false;
	private modePending = false;
	private generation = 0;
	private editedSource?: string;
	private loadedSource?: string;
	private history: string[] = [];
	private cursor = 0;
	private draft = "";
	get value(): string {
		return (
			this.getAttribute("value") ??
			getCodeFromScript(this.language, this)?.value ??
			""
		);
	}
	set value(value: string) {
		this.setAttribute("value", value);
	}
	/** Returns the current program, including unsaved editor changes. */
	public async getSource(): Promise<string> {
		return (
			this.editor?.getValue() ??
			this.editedSource ??
			(await readInterpreterSource(this, this.language))
		);
	}
	get src(): string {
		return this.getAttribute("src") ?? "";
	}
	set src(value: string) {
		this.setAttribute("src", value);
	}
	get query(): string {
		return this.getAttribute("query") ?? "";
	}
	set query(value: string) {
		this.setAttribute("query", value);
	}
	get filename(): string {
		return (
			this.getAttribute("filename") ||
			this.src.split("/").pop()?.split(/[?#]/)[0] ||
			getCodeFromScript(this.language, this)?.filename ||
			`program.${this.extension}`
		);
	}
	set filename(value: string) {
		this.setAttribute("filename", value);
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
			":scope > .tp-interpreter-toolbar, :scope > .tp-interpreter-actions, [data-interpreter-greeting]",
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
		return ["filename", "src", "query", "mode"];
	}
	protected attributeChangedCallback(name: string): void {
		if (name === "mode") this.updateMode();
		if (name === "query" && this.input) this.input.value = this.query;
		const label = this.panel?.querySelector("[data-interpreter-filename]");
		if (label) label.textContent = this.filename;
		if (this.editor) this.editor.filename = this.filename;
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-interpreter-style", style);
		if (this.panel) return;
		if (!this.id) this.id = `tp-interpreter-${++sequence}`;
		this.panel = document.createElement("div");
		this.panel.dataset.tpGenerated = "";
		this.panel.className = "tp-interpreter-panel";
		this.panel.innerHTML = `<tp-toolbar class="tp-interpreter-toolbar">
   <span section="start" class="tp-interpreter-title"><tp-icon library="languages" name="file_type_${this.language}" size="1.5em"></tp-icon> ${this.languageName}</span>
   <span section="center" class="tp-interpreter-file" data-interpreter-filename></span>
   <tp-icon-button section="end" name="code" label="Edit source" data-command="edit" aria-expanded="false"></tp-icon-button>
   
   <tp-divider section="end" orientation="vertical" inline data-document-navbar-divider></tp-divider>
   <tp-color section="end"></tp-color><tp-theme section="end"></tp-theme><tp-fullscreen section="end"></tp-fullscreen>
  </tp-toolbar><div class="tp-interpreter-source" hidden></div>
  <div class="tp-interpreter-output" role="log" aria-live="polite" tabindex="0"></div>
  <div class="tp-interpreter-prompt"><span aria-hidden="true">&gt;</span><tp-textfield clearable copy-code autocomplete="off"></tp-textfield></div>
  <div class="tp-interpreter-actions"><tp-icon-button name="play" label="Run" data-command="run"></tp-icon-button><tp-icon-button name="delete-outline" label="Clear" data-command="clear"></tp-icon-button><tp-icon-button name="refresh" label="Reset" data-command="reset"></tp-icon-button></div>`;
		this.output =
			this.panel.querySelector<HTMLElement>(".tp-interpreter-output") ??
			undefined;
		this.output?.setAttribute("aria-label", `${this.languageName} transcript`);
		this.input =
			this.panel.querySelector<TpTextfield>("tp-textfield") ?? undefined;
		this.input?.setAttribute("aria-label", `${this.languageName} command`);
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
		for (const control of this.panel.querySelectorAll(
			"tp-color,tp-theme,tp-fullscreen",
		))
			control.setAttribute("anchor", `#${CSS.escape(this.id)}`);
		this.append(this.panel);
		this.attributeChangedCallback("filename");
		this.panel.addEventListener("click", (event) => {
			const command = (event.target as Element)
				.closest("[data-command]")
				?.getAttribute("data-command");
			if (command === "run") void this.run();
			if (command === "clear") this.clear();
			if (command === "reset") void this.reset();
			if (command === "edit") void this.toggleSource();
		});
		this.input?.addEventListener("keydown", (event) => {
			const key = event as KeyboardEvent;
			if (key.isComposing || this.busy || !this.input) return;
			if (key.key === "Enter") {
				key.preventDefault();
				if (key.repeat) return;
				const reload = !key.ctrlKey && !key.altKey && !key.metaKey;
				void this.runQuery(this.input.value, reload);
			}
			if (key.key === "ArrowUp" || key.key === "ArrowDown") {
				key.preventDefault();
				if (this.cursor === this.history.length) this.draft = this.input.value;
				this.cursor = Math.max(
					0,
					Math.min(
						this.history.length,
						this.cursor + (key.key === "ArrowUp" ? -1 : 1),
					),
				);
				this.input.value = this.history[this.cursor] ?? this.draft;
			}
		});
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
		this.greeting();
		this.updateMode();
		if (this.eagerEngine && this.mode !== "simple")
			void this.perform(async () => {
				await this.runtime();
			});
	}
	protected disconnectedCallback(): void {
		this.generation++;
		this.engine?.dispose();
		releaseInterpreterScope(this);
		this.engine = undefined;
	}
	protected get engineDescription(): string {
		return `browser ${this.languageName}`;
	}
	protected get eagerEngine(): boolean {
		return false;
	}
	private greeting(): void {
		this.engineLabel = undefined;
		if (this.mode === "simple") return;
		const greeting = document.createElement("span");
		greeting.dataset.interpreterGreeting = "";
		greeting.append(
			`${this.localName} - enter ${/^[aeiou]/i.test(this.languageName) ? "an" : "a"} ${this.languageName} expression or statement.\n`,
		);
		if (claimInterpreterEngineNotice(this, this.language)) {
			this.engineLabel = document.createTextNode(
				`Engine: ${this.engine?.description ?? this.engineDescription}\n`,
			);
			greeting.append(this.engineLabel);
		}
		this.output?.append(greeting);
	}

	private write(text: string): void {
		this.output?.append(document.createTextNode(text));
		if (this.output) this.output.scrollTop = this.output.scrollHeight;
	}
	private async runtime(): Promise<InterpreterEngine> {
		if (this.engine) return this.engine;
		const generation = this.generation;
		const source =
			this.editedSource ?? (await readInterpreterSource(this, this.language));
		const engine = await scopedInterpreterEngine(
			this,
			this.language,
			(text) => {
				if (generation === this.generation) this.write(text);
			},
			(write, host) => this.createEngine(write, host),
		);
		if (generation !== this.generation) {
			engine.dispose();
			throw new Error("Session closed");
		}
		if (engine.description && this.engineLabel)
			this.engineLabel.data = `Engine: ${engine.description}\n`;
		try {
			if (source.trim()) await engine.execute(source);
		} catch (error) {
			engine.dispose();
			throw error;
		}
		this.engine = engine;
		this.loadedSource = source;

		return engine;
	}
	private updateBusyControls(): void {
		if (this.input) this.input.disabled = this.busy;
		for (const button of this.panel?.querySelectorAll("[data-command]") ?? []) {
			button.toggleAttribute("disabled", this.busy);
		}
	}
	private async perform(action: () => Promise<void>): Promise<void> {
		if (this.busy) return;
		this.busy = true;
		this.setAttribute("aria-busy", "true");
		this.updateBusyControls();
		try {
			await action();
		} catch (error) {
			this.write(
				`ERROR: ${error instanceof Error ? error.message : String(error)}\n`,
			);
		} finally {
			this.busy = false;
			this.setAttribute("aria-busy", "false");
			this.updateBusyControls();
			if (this.modePending) {
				this.modePending = false;
				this.updateMode();
			}
		}
	}
	/** Reloads changed source, then executes a command, retaining its text. */
	async run(code = this.input?.value ?? this.query): Promise<void> {
		await this.runQuery(code, true);
	}

	private async runQuery(code: string, reload = false): Promise<void> {
		if (!code.trim()) return;
		await this.perform(async () => {
			if (reload) {
				const source =
					this.editor?.getValue() ??
					this.editedSource ??
					(await readInterpreterSource(this, this.language));
				if (!this.engine || source !== this.loadedSource) {
					const reloaded = this.loadedSource !== undefined;
					this.generation++;
					this.engine?.dispose();
					this.engine = undefined;
					this.editedSource = source;
					await this.runtime();
					if (reloaded) this.write("> Program reloaded.\n");
				}
			}
			this.history.push(code);
			this.cursor = this.history.length;
			this.draft = "";
			this.write(`> ${code}\n`);
			const result = await (await this.runtime()).execute(code);
			if (
				!this.hasAttribute("data-tp-notebook-interpreter") ||
				(result.trim() && result !== "undefined" && result !== "None")
			)
				this.write(`${result}\n`);
		});
	}
	/** Clears the transcript without changing variables or command history. */
	clear(): void {
		this.output?.replaceChildren();
	}
	/** Restores the authored source and initial command in a fresh session. */
	async reset(): Promise<void> {
		await this.perform(async () => {
			this.generation++;
			this.engine?.dispose();
			releaseInterpreterScope(this);
			this.engine = undefined;
			this.editedSource = undefined;
			this.history = [];
			this.cursor = 0;
			this.draft = "";
			this.clear();
			this.greeting();
			if (this.input) this.input.value = this.query;
			if (this.editor)
				this.editor.setValue(await readInterpreterSource(this, this.language));
			if (!this.hasAttribute("data-tp-notebook-interpreter"))
				await this.runtime();
		});
	}
	/** Opens or closes the source editor. */
	async toggleSource(): Promise<void> {
		await this.perform(async () => {
			const container = this.panel?.querySelector<HTMLElement>(
				".tp-interpreter-source",
			);
			if (!container) return;
			if (!this.editor) {
				const { TpCodeEditor } = await import("../code-editor/code-editor.js");
				this.editor = new TpCodeEditor();
				this.editor.language = this.language;
				this.editor.filename = this.filename;
				this.editor.value =
					this.editedSource ??
					(await readInterpreterSource(this, this.language));
				this.editor.toolbar = true;
				this.editor.lineNumbers = true;
				this.editor.wordWrap = true;
				container.append(this.editor);
			}
			container.hidden = this.mode === "simple" ? false : !container.hidden;
			this.panel
				?.querySelector('[data-command="edit"]')
				?.setAttribute("aria-expanded", String(!container.hidden));
		});
	}
	/** Applies edited source in a fresh session; Reset still restores the original document. */
	async applySource(): Promise<void> {
		if (!this.editor) return;
		await this.perform(async () => {
			this.generation++;
			this.engine?.dispose();
			this.engine = undefined;
			this.editedSource = this.editor?.getValue() ?? "";
			this.clear();
			this.greeting();
			await this.runtime();
			this.write(`Source applied: ${this.filename}\n`);
		});
	}
}
