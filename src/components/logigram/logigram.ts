/** @module components/logigram */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
// tp-docgen:dependencies:end

import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../checkbox-list/checkbox-list.js";
import style from "./logigram.css?inline";
import {
	type LogigramMark,
	LogigramModel,
	readLogigramLists,
} from "./logigram-model.js";

/**
 * @summary Solves logic-grid puzzles by matching items across categories using written clues.
 * @tagname tp-logigram
 * @attr {string} label = "Logigram" - Puzzle title.
 * @attr {string} src = "" - Markdown file containing Prompt, Categories, Clues and Solution definitions.
 * @attr {boolean} auto-exclude = false - Marks other cells in the same pair row and column as no after a yes.
 * @attr {boolean} disabled = false - Prevents playing and using game controls.
 * @event tp-logigram-change Emitted after a move, undo, redo or reset.
 * @eventdetail tp-logigram-change { value: number[] }
 * @event tp-logigram-check Emitted after checking the grid.
 * @eventdetail tp-logigram-check { correct: number; total: number; errors: number[]; complete: boolean }
 * @keyboard {Enter / Space} Cycles the focused cell through unknown, no and yes, or activates a control.
 * @keyboard {Arrow keys} Moves between cells in the same category pair.
 * @keyboard {Delete / Backspace} Clears the focused cell.
 * @example
 * <tp-logigram label="The reading club">
 *   <dl>
 *     <dt>Prompt</dt>
 *     <dd><p>Three readers chose different books and drinks. Find every match.</p></dd>
 *     <dt>Categories</dt>
 *     <dd>
 *   <ul>
 *     <li>Readers<ul><li>Ada</li><li>Ben</li><li>Cleo</li></ul></li>
 *     <li>Books<ul><li>Poetry</li><li>History</li><li>Science</li></ul></li>
 *     <li>Drinks<ul><li>Tea</li><li>Juice</li><li>Water</li></ul></li>
 *   </ul>
 *   </dd>
 *     <dt>Clues</dt>
 *     <dd>
 *   <ol>
 *     <li>Ada chose Poetry.</li>
 *     <li>The History reader drank Juice.</li>
 *     <li>Ben drank Water.</li>
 *     <li>Cleo did not choose Poetry.</li>
 *   </ol>
 *   </dd>
 *     <dt>Solution</dt>
 *     <dd>
 *   <ol>
 *     <li><ul><li>Ada</li><li>Poetry</li><li>Tea</li></ul></li>
 *     <li><ul><li>Ben</li><li>Science</li><li>Water</li></ul></li>
 *     <li><ul><li>Cleo</li><li>History</li><li>Juice</li></ul></li>
 *   </ol>
 * </dd>
 *   </dl>
 * </tp-logigram>
 */
export class TpLogigram extends TpBase {
	private model: LogigramModel | null = null;
	private original: string | null = null;
	private revision = 0;
	private request: AbortController | null = null;
	private timer: ReturnType<typeof setTimeout> | undefined;
	private observer = new MutationObserver(() => this.schedule());
	private cells: HTMLButtonElement[] = [];
	private status: HTMLElement | null = null;
	private checked = false;
	private selectedCell: number | undefined;
	private selectedButton: HTMLButtonElement | undefined;
	private assistSelect: HTMLSelectElement | null = null;
	private selectionHint: HTMLParagraphElement | null = null;
	public static get observedAttributes(): string[] {
		return ["label", "src", "auto-exclude", "disabled"];
	}
	/** Puzzle title. @attr label */
	public get label(): string {
		return this.getAttribute("label") ?? "Logigram";
	}
	public set label(v: string) {
		this.setAttribute("label", v);
	}
	/** Markdown definition URL. @attr src */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(v: string) {
		this.setAttribute("src", v);
	}
	/** Exclude competing matches after a yes. @attr auto-exclude */
	public get autoExclude(): boolean {
		return this.hasAttribute("auto-exclude");
	}
	public set autoExclude(v: boolean) {
		this.toggleAttribute("auto-exclude", v);
	}
	/** Disable all game interactions. @attr disabled */
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	public set disabled(v: boolean) {
		this.toggleAttribute("disabled", v);
	}
	/** A copy of the pair-grid marks: 0 unknown, -1 no, 1 yes. */
	public get value(): LogigramMark[] {
		return this.model?.value ?? [];
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-logigram-styles", style);
		if (this.model) {
			this.update();
			return;
		}
		this.observer.observe(this, { childList: true, subtree: true });
		this.schedule();
	}
	public disconnectedCallback(): void {
		this.revision++;
		clearTimeout(this.timer);
		this.request?.abort();
		this.observer.disconnect();
	}
	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) return;
		if (name === "src") {
			this.model = null;
			this.schedule();
		} else if (name === "label") {
			const title = this.querySelector<HTMLElement>(
				".tp-logigram-puzzle-title",
			);
			if (title) {
				title.textContent = this.label;
				title.hidden = !this.label || this.label === "Logigram";
			}
		} else this.update();
	}
	private schedule(): void {
		clearTimeout(this.timer);
		this.revision++;
		this.request?.abort();
		this.timer = setTimeout(() => void this.load(), 0);
	}
	private async load(): Promise<void> {
		const revision = ++this.revision;
		this.request = new AbortController();
		this.observer.disconnect();
		this.original ??= this.innerHTML;
		this.setAttribute("aria-busy", "true");
		try {
			let html = this.original;
			if (this.src) {
				const response = await fetch(
					resolveComponentSourceUrl(this, this.src),
					{ signal: this.request.signal },
				);
				if (!response.ok)
					throw new Error(`Unable to load puzzle (${response.status}).`);
				const text = await response.text();
				const { renderMarkdownToHtml } = await import(
					"../markdown/markdown.js"
				);
				html = await renderMarkdownToHtml(text);
			}
			if (revision !== this.revision || !this.isConnected) return;
			const template = document.createElement("template");
			template.innerHTML = html;
			this.model = new LogigramModel(
				readLogigramLists(template.content, this.label),
			);
			this.checked = false;
			this.render();
		} catch (error) {
			if (revision !== this.revision || !this.isConnected) return;
			this.model = null;
			const alert = document.createElement("p");
			alert.setAttribute("role", "alert");
			alert.textContent =
				error instanceof Error ? error.message : String(error);
			this.replaceChildren(alert);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
	private move(index: number, mark: LogigramMark): void {
		if (this.disabled || !this.model) return;
		this.model.set(index, mark, this.autoExclude);
		this.changed();
	}
	private changed(): void {
		this.checked = false;
		this.update();
		this.dispatchEvent(
			new CustomEvent("tp-logigram-change", {
				bubbles: true,
				detail: { value: this.value },
			}),
		);
	}
	/** Clears the grid; the reset can be undone. */
	public reset(): void {
		if (this.disabled || !this.model) return;
		this.model.reset();
		this.changed();
	}
	/** Restores the preceding move, including automatic exclusions. */
	public undo(): void {
		if (this.disabled || !this.model) return;
		this.model.undo();
		this.changed();
	}
	/** Reapplies an undone move. */
	public redo(): void {
		if (this.disabled || !this.model) return;
		this.model.redo();
		this.changed();
	}
	/** Checks all marked cells and counts correct matches. Unknown negatives need not be filled. */
	public check(): ReturnType<LogigramModel["check"]> | null {
		if (this.disabled || !this.model) return null;
		this.checked = true;
		this.update();
		const result = this.model.check();
		this.dispatchEvent(
			new CustomEvent("tp-logigram-check", { bubbles: true, detail: result }),
		);
		return result;
	}
	private render(): void {
		const model = this.model;
		if (!model) return;
		this.replaceChildren();
		this.cells = [];
		this.selectedCell = undefined;
		this.selectedButton = undefined;
		const title = document.createElement("h3");
		title.className = "tp-logigram-title";
		title.textContent = "Logigram";
		const header = document.createElement("div");
		header.className = "tp-logigram-header";
		const puzzleTitle = document.createElement("p");
		puzzleTitle.className = "tp-logigram-puzzle-title";
		puzzleTitle.textContent = this.label;
		puzzleTitle.hidden = !this.label || this.label === "Logigram";
		const description = document.createElement("p");
		description.textContent = model.puzzle.description ?? "";
		const help = document.createElement("p");
		help.textContent =
			"Match each item with exactly one item in every other category. Click a cell: unknown → no (×) → yes (✓).";
		const clues = document.createElement("tp-checkbox-list");
		clues.setAttribute("label", "Clues");
		clues.setAttribute("label-position", "top");
		const list = document.createElement("ul");
		for (const clue of model.puzzle.clues) {
			const li = document.createElement("li");
			li.textContent = clue;
			list.append(li);
		}
		clues.append(list);
		const toolbar = document.createElement("div");
		toolbar.className = "tp-logigram-controls";
		for (const [name, label, run] of [
			["undo", "Undo", () => this.undo()],
			["redo", "Redo", () => this.redo()],
		] as const) {
			const button = document.createElement("tp-button");
			button.textContent = label;
			button.setAttribute("type", "button");
			button.dataset.action = name;
			button.addEventListener("click", run);
			toolbar.append(button);
		}
		const assist = document.createElement("select");
		assist.className = "tp-logigram-assist";
		assist.setAttribute("aria-label", "Assistance actions");
		for (const [value, label] of [
			["", "Assist…"],
			["reset-game", "Reset the game"],
			["show-incorrect", "Show all incorrect boxes"],
			["clear-incorrect", "Clear the incorrect boxes"],
			["show-cell", "Show the box"],
			["show-block", "Show the category pair"],
			["show-solution", "Show the solution"],
		]) {
			const option = document.createElement("option");
			option.value = value ?? "";
			option.textContent = label ?? "";
			assist.append(option);
		}
		assist.addEventListener("change", () => {
			const action = assist.value;
			assist.value = "";
			if (this.disabled || !this.model) return;
			if (action === "reset-game") this.reset();
			else if (action === "show-incorrect") this.check();
			else if (
				action === "clear-incorrect" ||
				action === "show-cell" ||
				action === "show-block" ||
				action === "show-solution"
			) {
				this.model.assist(action, this.selectedCell);
				this.changed();
				if (action === "show-solution") this.check();
			}
		});
		this.assistSelect = assist;
		toolbar.append(assist);
		this.selectionHint = document.createElement("p");
		this.selectionHint.className = "tp-logigram-selection-hint";
		this.selectionHint.setAttribute("role", "status");
		this.status = document.createElement("p");
		this.status.setAttribute("role", "status");
		this.status.setAttribute("aria-live", "polite");
		const grids = document.createElement("div");
		grids.className = "tp-logigram-grids";

		const categories = model.puzzle.categories;
		const size = categories[0]?.items.length ?? 0;
		const table = document.createElement("table");
		table.className = "tp-logigram-matrix";
		table.setAttribute("aria-label", "Category matching grid");
		const head = table.createTHead();
		const groups = head.insertRow();
		const corner = document.createElement("td");
		corner.colSpan = 2;
		corner.rowSpan = 2;
		corner.className = "tp-logigram-empty";
		groups.append(corner);
		for (const category of categories.slice(1)) {
			const th = document.createElement("th");
			th.scope = "colgroup";
			th.colSpan = size;
			th.textContent = category.name;
			th.className = "tp-logigram-category";
			groups.append(th);
		}
		const labels = head.insertRow();
		for (const category of categories.slice(1))
			for (const [col, item] of category.items.entries()) {
				const th = document.createElement("th");
				th.scope = "col";
				th.className = `tp-logigram-column${col === 0 ? " tp-logigram-group-start" : ""}`;
				const span = document.createElement("span");
				span.textContent = item;
				th.append(span);
				labels.append(th);
			}
		const rowCategories = [
			0,
			...categories
				.map((_, i) => i)
				.slice(2)
				.reverse(),
		];
		for (const leftIndex of rowCategories) {
			const left = categories[leftIndex];
			if (!left) continue;
			const body = table.createTBody();
			for (const [row, item] of left.items.entries()) {
				const tr = body.insertRow();
				if (row === 0) {
					const group = document.createElement("th");
					group.scope = "rowgroup";
					group.rowSpan = size;
					group.className = "tp-logigram-row-category";
					const span = document.createElement("span");
					span.textContent = left.name;
					group.append(span);
					tr.append(group);
				}
				const label = document.createElement("th");
				label.scope = "row";
				label.textContent = item;
				label.className = "tp-logigram-row-label";
				tr.append(label);
				for (let topIndex = 1; topIndex < categories.length; topIndex++) {
					if (leftIndex !== 0 && topIndex >= leftIndex) break;
					for (let col = 0; col < size; col++) {
						const transposed = leftIndex > topIndex;
						const index = model.cells.findIndex(
							(c) =>
								c.a === Math.min(leftIndex, topIndex) &&
								c.b === Math.max(leftIndex, topIndex) &&
								c.row === (transposed ? col : row) &&
								c.col === (transposed ? row : col),
						);
						const cell = tr.insertCell();
						if (col === 0) cell.classList.add("tp-logigram-group-start");
						const button = this.createCell(index, transposed);
						this.cells[index] = button;
						cell.append(button);
					}
				}
			}
		}
		grids.append(table);
		header.append(title, toolbar);
		this.append(
			header,
			this.selectionHint,
			puzzleTitle,
			description,
			help,
			clues,
			this.status,
			grids,
		);
		this.update();
	}
	private createCell(index: number, transposed: boolean): HTMLButtonElement {
		const model = this.model;
		const cell = model?.cells[index];
		if (!model || !cell) throw new Error("Missing grid cell.");
		const left = model.puzzle.categories[cell.a];
		const right = model.puzzle.categories[cell.b];
		const button = document.createElement("button");
		button.type = "button";
		button.dataset.label = `${left?.name}: ${left?.items[cell.row]}; ${right?.name}: ${right?.items[cell.col]}`;
		button.dataset.cell = String(index);
		button.addEventListener("focus", () => {
			this.selectedCell = index;
			this.updateAssistance();
		});
		button.addEventListener("pointerdown", () => {
			this.selectedCell = index;
			this.updateAssistance();
		});
		button.addEventListener("click", (e) => {
			this.selectedCell = index;
			this.updateAssistance();
			const current = this.model?.value[index] ?? 0;
			this.move(
				index,
				e.ctrlKey || e.metaKey
					? 0
					: current === 0
						? -1
						: current === -1
							? 1
							: 0,
			);
		});
		button.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			this.move(index, 1);
		});
		button.addEventListener("keydown", (e) => {
			if (e.key === "Delete" || e.key === "Backspace") {
				e.preventDefault();
				this.move(index, 0);
				return;
			}
			const dx = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
			const dy = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
			if (!dx && !dy) return;
			e.preventDefault();
			const row = cell.row + (transposed ? dx : dy);
			const col = cell.col + (transposed ? dy : dx);
			const target = model.cells.findIndex(
				(c) =>
					c.a === cell.a && c.b === cell.b && c.row === row && c.col === col,
			);
			this.cells[target]?.focus();
		});
		return button;
	}

	private updateAssistance(): void {
		if (!this.assistSelect) return;
		this.assistSelect.disabled = this.disabled;
		const selected =
			this.selectedCell === undefined
				? undefined
				: this.cells[this.selectedCell];
		this.selectedButton?.removeAttribute("data-selected");
		selected?.setAttribute("data-selected", "");
		this.selectedButton = selected;
		if (this.selectionHint)
			this.selectionHint.textContent = selected
				? `Selected box: ${selected.dataset.label}. Use Assist… → Show the box or Show the category pair.`
				: "Click a grid box or focus it with Tab to enable Assist… → Show the box and Show the category pair.";
		for (const option of this.assistSelect.options) {
			option.disabled =
				(option.value === "show-cell" || option.value === "show-block") &&
				this.selectedCell === undefined;
		}
	}

	private update(): void {
		const model = this.model;
		if (!model) return;
		this.updateAssistance();
		const values = model.value;
		const result = model.check();
		this.cells.forEach((button, i) => {
			const mark = values[i] ?? 0;
			button.textContent = mark === 1 ? "✓" : mark === -1 ? "×" : "·";
			button.dataset.mark = String(mark);
			button.disabled = this.disabled;
			button.setAttribute(
				"aria-label",
				`${button.dataset.label}: ${mark === 1 ? "yes" : mark === -1 ? "no" : "unknown"}`,
			);
			button.setAttribute(
				"aria-invalid",
				String(this.checked && result.errors.includes(i)),
			);
		});
		for (const control of this.querySelectorAll<HTMLElement>(
			"tp-button[data-action], tp-checkbox-list",
		)) {
			const action = control.dataset.action;
			control.toggleAttribute(
				"disabled",
				this.disabled ||
					(action === "undo" && !model.canUndo) ||
					(action === "redo" && !model.canRedo),
			);
		}
		if (this.status) {
			this.status.textContent = this.checked
				? result.complete
					? "Solved!"
					: `${result.correct} / ${result.total} correct matches; ${result.errors.length} incorrect marks. Keep using the clues.`
				: `${values.filter((v) => v === 1).length} / ${result.total} matches marked.`;
			this.status.dataset.success = String(this.checked && result.complete);
		}
	}
}
if (!customElements.get("tp-logigram"))
	customElements.define("tp-logigram", TpLogigram);
declare global {
	interface HTMLElementTagNameMap {
		"tp-logigram": TpLogigram;
	}
}
