/** @module components/diff-code-editor */
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
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @credit CodeMirror https://codemirror.net/
 * @summary Code editing and language support.
 */
/**
 * @credit Lezer https://lezer.codemirror.net/
 * @summary Syntax tree highlighting.
 */
// tp-docgen:dependencies:end

import { MergeView } from "@codemirror/merge";
import type { Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import {
	getCodeFromScript,
	getLanguageFromFilename,
} from "../../utilities/code.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import { TpCodeEditor } from "../code-editor/code-editor.js";
import { loadLanguageSupport } from "../code-editor/language-support.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../divider/divider.js";
import "../color/color.js";
import "../theme/theme.js";
import "../fullscreen/fullscreen.js";
import style from "./diff-code-editor.css?inline";

export type TpDiffSide = "left" | "right";
type Source = { value: string; language: string; filename: string };
const sides: TpDiffSide[] = ["left", "right"];
let sequence = 0;
/**
 * The custom `<tp-diff-code-editor>` element compares and edits two source documents side by side.
 *
 * @summary Compares and edits two source documents side by side.
 * @tagname tp-diff-code-editor
 * @attr {string} src-left = "" - URL of the left source file.
 * @attr {string} src-right = "" - URL of the right source file.
 * @attr {string} value-left = "" - Left source text, used when src-left is absent.
 * @attr {string} value-right = "" - Right source text, used when src-right is absent.
 * @attr {string} language = "" - Language for both documents; otherwise inferred independently from filenames or script types.
 * @attr {string} filename-left = "" - Displayed and suggested save filename for the left document.
 * @attr {string} filename-right = "" - Displayed and suggested save filename for the right document.
 * @attr {boolean} readonly = false - Prevents editing and applying differences; saving remains available.
 * @attr {boolean} wrap = false - Wraps long lines in both editors.
 * @event tp-diff-code-editor-load Emitted after both sources have loaded.
 * @eventdetail tp-diff-code-editor-load { left: string; right: string }
 * @event tp-diff-code-editor-change Emitted when a document changes.
 * @eventdetail tp-diff-code-editor-change { side: "left" | "right"; value: string }
 * @event tp-diff-code-editor-error Emitted when loading or saving fails.
 * @eventdetail tp-diff-code-editor-error { message: string }
 * @see tp-code-editor - Edits a single source document.
 * @example
 * <tp-diff-code-editor>
 *   <dl>
 *     <dt>left</dt>
 *     <dd><script type="tp/javascript" filename="before.js">
 * const message = "Hello";
 * const count = 3;
 * const prefix = "Greeting:";
 * console.log(prefix, message, count);
 * console.log("Done");
 *     </script></dd>
 *     <dt>right</dt>
 *     <dd><script type="tp/javascript" filename="after.js">
 * const message = "Hello world";
 * const count = 3;
 * const prefix = "Greeting:";
 * console.log(prefix, message);
 * console.log("Done");
 *     </script></dd>
 *   </dl>
 * </tp-diff-code-editor>
 */
export class TpDiffCodeEditor extends TpBase {
	private merge: MergeView | null = null;
	private root: HTMLElement | null = null;
	private status: HTMLElement | null = null;
	private message: HTMLElement | null = null;
	private editors: Record<TpDiffSide, TpCodeEditor | null> = {
		left: null,
		right: null,
	};
	private observer: MutationObserver | null = null;
	private panelObserver: ResizeObserver | null = null;
	private panelFrame: number | null = null;
	private abort: AbortController | null = null;
	private revision = 0;
	private queued = false;
	private selected = -1;
	private activeSide: TpDiffSide = "left";
	private originals: Record<TpDiffSide, string> = { left: "", right: "" };
	private sources: Record<TpDiffSide, Source> = {
		left: { value: "", language: "plaintext", filename: "left.txt" },
		right: { value: "", language: "plaintext", filename: "right.txt" },
	};
	private initialized = false;
	private controls = new Map<string, HTMLElement>();
	static get observedAttributes(): string[] {
		return [
			"src-left",
			"src-right",
			"value-left",
			"value-right",
			"language",
			"filename-left",
			"filename-right",
			"readonly",
			"wrap",
		];
	}
	get readonly(): boolean {
		return this.hasAttribute("readonly");
	}
	set readonly(value: boolean) {
		this.toggleAttribute("readonly", value);
	}
	get wrap(): boolean {
		return this.hasAttribute("wrap");
	}
	set wrap(value: boolean) {
		this.toggleAttribute("wrap", value);
	}
	/** Number of currently differing blocks. */
	get differenceCount(): number {
		return this.merge?.chunks.length ?? 0;
	}
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-diff-code-editor-styles", style);
		this.ensureUI();
		this.observer = new MutationObserver((records) => {
			const list = this.querySelector(":scope > dl");
			if (
				records.some(
					(record) =>
						list?.contains(record.target) ||
						(record.target === this &&
							[...record.addedNodes, ...record.removedNodes].some(
								(node) => node instanceof Element && node.localName === "dl",
							)),
				)
			)
				this.scheduleRefresh();
		});
		this.observer.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["type", "filename"],
		});
		if (this.initialized) this.mount();
		else this.scheduleRefresh();
	}
	protected disconnectedCallback(): void {
		this.panelObserver?.disconnect();
		if (this.panelFrame !== null) cancelAnimationFrame(this.panelFrame);
		this.panelFrame = null;
		this.observer?.disconnect();
		this.observer = null;
		this.abort?.abort();
		this.revision++;
		this.removeAttribute("aria-busy");
		this.merge?.destroy();
		this.merge = null;
	}
	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) return;
		if (name === "readonly" || name === "wrap") {
			for (const side of sides) {
				const editor = this.editors[side];
				if (editor) {
					editor.readonly = this.readonly;
					editor.wordWrap = this.wrap;
				}
			}
			this.updateStatus();
		} else this.scheduleRefresh();
	}
	private scheduleRefresh(): void {
		if (this.queued) return;
		this.queued = true;
		queueMicrotask(() => {
			this.queued = false;
			if (this.isConnected) void this.refresh();
		});
	}
	private async read(side: TpDiffSide, signal: AbortSignal): Promise<Source> {
		const list = this.querySelector(":scope > dl");
		const term = [...(list?.children ?? [])].find(
			(el) =>
				el.localName === "dt" && el.textContent?.trim().toLowerCase() === side,
		);
		const dd =
			term?.nextElementSibling?.localName === "dd"
				? term.nextElementSibling
				: null;
		const script = dd ? getCodeFromScript(undefined, dd) : null;
		let value = script?.value ?? dd?.textContent ?? "";
		let filename =
			this.getAttribute(`filename-${side}`) ||
			script?.filename ||
			`${side}.txt`;
		let language = script?.language || getLanguageFromFilename(filename);
		if (this.hasAttribute(`value-${side}`))
			value = this.getAttribute(`value-${side}`) ?? "";
		const src = this.getAttribute(`src-${side}`)?.trim();
		if (src) {
			const url = resolveComponentSourceUrl(this, src);
			const response = await fetch(url, { signal });
			if (!response.ok)
				throw Error(`Could not load ${side} source (${response.status}).`);
			value = await response.text();
			filename =
				this.getAttribute(`filename-${side}`) ||
				decodeURIComponent(url.pathname.split("/").pop() || `${side}.txt`);
			language = getLanguageFromFilename(filename);
		}
		language = (this.getAttribute("language") || language || "plaintext")
			.trim()
			.toLowerCase();
		await loadLanguageSupport(language);
		return { value, filename, language };
	}
	/** Reload both declared sources and establish new reset originals. Errors are reported visibly and by event. */
	async refresh(): Promise<void> {
		const revision = ++this.revision;
		this.abort?.abort();
		const abort = new AbortController();
		this.abort = abort;
		this.setAttribute("aria-busy", "true");
		try {
			const [left, right] = await Promise.all([
				this.read("left", abort.signal),
				this.read("right", abort.signal),
			]);
			if (revision !== this.revision || !this.isConnected) return;
			this.sources = { left: left, right: right };
			this.originals = { left: left.value, right: right.value };
			this.initialized = true;
			if (this.message) this.message.textContent = "";
			this.mount();
			this.dispatchEvent(
				new CustomEvent("tp-diff-code-editor-load", {
					bubbles: true,
					detail: { left: left.value, right: right.value },
				}),
			);
		} catch (error) {
			if (revision === this.revision && !this.abort.signal.aborted)
				this.report(error);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
	private view(side: TpDiffSide): EditorView | null {
		return this.merge ? (side === "left" ? this.merge.a : this.merge.b) : null;
	}
	/** Return the current source, including unsaved edits. */
	getValue(side: TpDiffSide): string {
		return this.view(side)?.state.doc.toString() ?? this.sources[side].value;
	}
	/** Replace one document without changing its reset original. */
	setValue(side: TpDiffSide, value: string): void {
		this.sources[side].value = value;
		this.editors[side]?.setValue(value);
	}
	/** Restore the source loaded by the last refresh, on one side or both. */
	reset(side?: TpDiffSide): void {
		if (this.readonly) return;
		for (const target of side ? [side] : sides)
			this.setValue(target, this.originals[target]);
	}
	/** Select and reveal the next differing block, wrapping at the end. */
	nextDifference(): void {
		this.selectDifference(this.selected + 1);
	}
	/** Select and reveal the previous differing block, wrapping at the beginning. */
	previousDifference(): void {
		this.selectDifference(
			this.selected < 0 ? this.differenceCount - 1 : this.selected - 1,
		);
	}
	private selectDifference(index: number): void {
		const merge = this.merge;
		if (!merge?.chunks.length) return;
		this.selected = (index + merge.chunks.length) % merge.chunks.length;
		const chunk = merge.chunks[this.selected];
		if (!chunk) return;
		for (const [view, position] of [
			[merge.a, chunk.fromA],
			[merge.b, chunk.fromB],
		] as const) {
			const anchor = Math.min(position, view.state.doc.length);
			view.dispatch({
				selection: { anchor },
				effects: EditorView.scrollIntoView(anchor, { y: "center" }),
			});
		}
		this.view(this.activeSide)?.focus();
		this.updateStatus();
	}
	/** Copy the selected differing block from the specified side to the other document. */
	copyDifference(from: TpDiffSide): void {
		if (this.readonly || !this.merge) return;
		if (this.selected < 0) this.selectDifference(0);
		const chunk = this.merge.chunks[this.selected];
		if (!chunk) return;
		const source = this.view(from);
		const target = this.view(from === "left" ? "right" : "left");
		if (!source || !target) return;
		const a = from === "left";
		const start = a ? chunk.fromA : chunk.fromB,
			end = a ? chunk.toA : chunk.toB;
		const targetStart = a ? chunk.fromB : chunk.fromA,
			targetEnd = a ? chunk.toB : chunk.toA;
		// Match MergeView's virtual end-of-line convention, including insertions at EOF.
		let insert = source.state.sliceDoc(start, Math.max(start, end - 1));
		if (start !== end && targetEnd <= target.state.doc.length)
			insert += source.state.lineBreak;
		target.dispatch({
			changes: {
				from: Math.min(targetStart, target.state.doc.length),
				to: Math.min(targetEnd, target.state.doc.length),
				insert,
			},
			userEvent: "input.merge",
		});
	}
	/** Save one document with a user-selected filename. */
	async save(side: TpDiffSide): Promise<void> {
		try {
			await this.editors[side]?.saveAs();
		} catch (error) {
			this.report(error);
		}
	}

	private report(error: unknown): void {
		const message = error instanceof Error ? error.message : String(error);
		if (this.message) this.message.textContent = message;
		this.dispatchEvent(
			new CustomEvent("tp-diff-code-editor-error", {
				bubbles: true,
				detail: { message },
			}),
		);
	}
	private extensions(side: TpDiffSide): Extension[] {
		const editor = new TpCodeEditor();
		this.editors[side] = editor;
		editor.addEventListener("tp-code-editor-error", (event) => {
			this.report(
				new Error((event as CustomEvent<{ message: string }>).detail.message),
			);
		});
		editor.classList.add("tp-diff-editor-shell");
		return [
			editor.prepareMergeEditor({
				...this.sources[side],
				readonly: this.readonly,
				wrap: this.wrap,
			}),
			keymap.of([
				{
					key: "Alt-ArrowDown",
					run: () => {
						this.nextDifference();
						return true;
					},
				},
				{
					key: "Alt-ArrowUp",
					run: () => {
						this.previousDifference();
						return true;
					},
				},
			]),
			EditorView.contentAttributes.of({
				"aria-label": `${side === "left" ? "Left" : "Right"} source code`,
			}),
			EditorView.domEventHandlers({
				focus: () => {
					this.activeSide = side;
				},
			}),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					this.sources[side].value = update.state.doc.toString();
					queueMicrotask(() => this.updateStatus());
					this.dispatchEvent(
						new CustomEvent("tp-diff-code-editor-change", {
							bubbles: true,
							detail: { side, value: this.sources[side].value },
						}),
					);
				}
			}),
		];
	}

	private mount(): void {
		this.panelObserver?.disconnect();
		this.ensureUI();
		this.merge?.destroy();
		this.merge = null;
		const parent = this.root?.querySelector("[data-diff-editors]");
		if (!parent) return;
		parent.replaceChildren();
		this.merge = new MergeView({
			parent,
			a: { doc: this.sources.left.value, extensions: this.extensions("left") },
			b: {
				doc: this.sources.right.value,
				extensions: this.extensions("right"),
			},
			gutter: true,
			highlightChanges: true,
			diffConfig: { scanLimit: 1000, timeout: 100 },
		});
		this.selected = -1;
		for (const side of sides) {
			const editor = this.editors[side];
			const view = this.view(side);
			const parent = view?.dom.parentElement;
			if (editor && view && parent) {
				editor.attachMergeEditor(view);
				parent.append(editor);
			}
		}

		for (const list of this.querySelectorAll(":scope > dl"))
			list.setAttribute("hidden", "");
		this.alignPanels();
		if (typeof ResizeObserver !== "undefined") {
			this.panelObserver = new ResizeObserver(() => {
				if (this.panelFrame !== null) return;
				this.panelFrame = requestAnimationFrame(() => {
					this.panelFrame = null;
					this.alignPanels();
				});
			});
			for (const side of sides) {
				const panels = this.editors[side]?.querySelector(".cm-panels");
				if (panels) this.panelObserver.observe(panels);
			}
		}
		this.updateStatus();
	}
	private alignPanels(): void {
		const height = Math.ceil(
			Math.max(
				...sides.map(
					(side) =>
						this.editors[side]
							?.querySelector(".cm-panels")
							?.getBoundingClientRect().height ?? 0,
				),
			),
		);
		const value = `${height}px`;
		if (
			this.root &&
			this.root.style.getPropertyValue("--tp-diff-panel-height") !== value
		) {
			this.root.style.setProperty("--tp-diff-panel-height", value);
			this.merge?.a.requestMeasure();
			this.merge?.b.requestMeasure();
		}
	}
	private updateStatus(): void {
		const count = this.differenceCount;
		if (this.selected >= count) this.selected = count - 1;
		if (this.status)
			this.status.textContent = count
				? `${this.selected < 0 ? "" : `${this.selected + 1} / `}${count} difference${count === 1 ? "" : "s"}`
				: "No differences";
		for (const [name, control] of this.controls)
			control.toggleAttribute(
				"disabled",
				["previous", "next"].includes(name)
					? !count
					: ["copy-left", "copy-right"].includes(name)
						? this.readonly || !count
						: name === "reset"
							? this.readonly
							: false,
			);
	}
	private ensureUI(): void {
		if (this.root?.parentElement === this) return;
		this.controls.clear();
		const root = document.createElement("div");
		root.className = "tp-diff-root";
		this.root = root;
		root.innerHTML =
			'<div class="tp-diff-toolbar"><strong><tp-icon name="diff-code-editor" library="components" size="1.5em"></tp-icon> Diff code editor</strong><span class="tp-diff-status" role="status" aria-live="polite"></span><span class="tp-diff-actions"></span><tp-divider orientation="vertical" inline></tp-divider><tp-color></tp-color><tp-theme></tp-theme><tp-fullscreen></tp-fullscreen></div><div class="tp-diff-message" role="alert"></div><div data-diff-editors></div>';
		const actions = root.querySelector(".tp-diff-actions");
		if (!actions) return;
		if (!this.id) this.id = `tp-diff-code-editor-${++sequence}`;
		for (const control of root.querySelectorAll(
			"tp-color,tp-theme,tp-fullscreen",
		))
			control.setAttribute("anchor", `#${this.id}`);
		for (const [name, icon, label, action] of [
			[
				"previous",
				"previous",
				"Previous difference",
				() => this.previousDifference(),
			],
			["next", "next", "Next difference", () => this.nextDifference()],
			[
				"copy-left",
				"arrow-right",
				"Copy difference left to right",
				() => this.copyDifference("left"),
			],
			[
				"copy-right",
				"arrow-left",
				"Copy difference right to left",
				() => this.copyDifference("right"),
			],
			["reset", "refresh", "Reset both documents", () => this.reset()],
		] as const) {
			const button = document.createElement("tp-icon-button");
			button.setAttribute("name", icon);
			button.setAttribute("pill", "");
			button.setAttribute("outlined", "");
			button.setAttribute("label", label);
			button.setAttribute("title", label);
			button.setAttribute("variant", "brand");
			button.setAttribute("data-help-description", label);
			button.setAttribute("data-diff-action", name);
			button.addEventListener("click", () => {
				if (!button.hasAttribute("disabled")) action();
			});
			actions.append(button);
			this.controls.set(name, button);
		}
		this.status = root.querySelector(".tp-diff-status");
		this.message = root.querySelector(".tp-diff-message");
		this.append(root);
	}
}
if (!customElements.get("tp-diff-code-editor"))
	customElements.define("tp-diff-code-editor", TpDiffCodeEditor);
declare global {
	interface HTMLElementTagNameMap {
		"tp-diff-code-editor": TpDiffCodeEditor;
	}
}
