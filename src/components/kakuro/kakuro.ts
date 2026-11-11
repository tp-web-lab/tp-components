/** @module components/kakuro
 * @summary Interactive cross-sum puzzle with notes, history and assistance.
 */
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
 * @tp-dependency tp-chronometer
 * @summary Chronometer component with play, pause and stop controls.
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
 * @tp-dependency tp-drawer
 * @summary Drawer overlay component.
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
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
// tp-docgen:dependencies:end

import {
	gameActivity,
	mountGameHeader,
	updateGameHeader,
} from "../../utilities/game-header.js";
import { TpBase } from "../base/base.js";
import type { TpIconButton } from "../icon-button/icon-button.js";
import "../button/button.js";
import type { TpButton } from "../button/button.js";
import style from "./kakuro.css?inline";
import {
	type KakuroGrid,
	kakuroConflicts,
	parseKakuro,
	solveKakuro,
} from "./kakuro-model.js";

interface Snapshot {
	values: number[];
	notes: number[];
}
/**
 * The custom `<tp-kakuro>` element displays an interactive Kakuro puzzle.
 *
 * @summary Displays an interactive Kakuro puzzle.
 * @tagname tp-kakuro
 * @attr {string} puzzle = "" - Whitespace-separated cells in newline-separated rows: #, ., fixed digits or down/across clues. Overrides the initial list.
 * @event tp-kakuro-change Emitted after a move, assistance action, reset or history change.
 * @eventdetail tp-kakuro-change { values: number[][], complete: boolean }
 * @event tp-kakuro-complete Emitted when the player reaches a valid completed grid.
 * @eventdetail tp-kakuro-complete { values: number[][], complete: boolean }
 * @keyboard {Arrow keys} Moves to the next white cell in the chosen direction.
 * @keyboard {1–9} Enters a digit or toggles a pencil mark in Note mode.
 * @keyboard {Backspace / Delete / 0} Clears the selected editable cell.
 * @keyboard {Ctrl+Z / Ctrl+Y} Undoes or redoes a move; Command is also accepted.
 * @accessibility Cell labels include coordinates and across/down sums; status updates use a live region.
 * @cssprop [--tp-kakuro-cell-size=4rem] Maximum width of each square.
 * @tp-dependency tp-base - Shared component behavior.
 * @tp-dependency tp-button - Game action buttons.
 * @see tp-sudoku - Another numeric grid puzzle with pencil marks.
 * @see tp-crossword - A word-based across and down puzzle.
 * @example
 * <tp-kakuro>
 *   <ol>
 *     <li><code># 23/0 30/0 # # 27/0 12/0 16/0</code></li>
 *     <li><code>0/16 . . # 17/24 . . .</code></li>
 *     <li><code>0/17 . . 15/29 . . . .</code></li>
 *     <li><code>0/35 . . . . . 12/0 #</code></li>
 *     <li><code># 0/7 . . 7/8 . . 7/0</code></li>
 *     <li><code># 11/0 10/16 . . . . .</code></li>
 *     <li><code>0/21 . . . . 0/5 . .</code></li>
 *     <li><code>0/6 . . . # 0/3 . .</code></li>
 *   </ol>
 * </tp-kakuro>
 */
export class TpKakuro extends TpBase {
	public static get observedAttributes(): string[] {
		return ["puzzle"];
	}
	private grid: KakuroGrid | undefined;
	private values: number[] = [];
	private notes: number[] = [];
	private initialSource: string | undefined;
	private undoStack: Snapshot[] = [];
	private redoStack: Snapshot[] = [];
	private noteMode = false;
	private showingErrors = false;
	private selected = -1;
	private completed = false;
	private inputs = new Map<number, HTMLInputElement>();
	private status: HTMLElement | undefined;
	private buttons = new Map<string, TpButton | TpIconButton>();
	/** Puzzle source; assigning it starts a new game. */
	public get puzzle(): string {
		return this.getAttribute("puzzle") ?? this.initialSource ?? "";
	}
	public set puzzle(value: string) {
		this.setAttribute("puzzle", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-kakuro-styles", style);
		if (this.initialSource === undefined) {
			const list = Array.from(this.children).find((child) =>
				child.matches("ol,ul"),
			);
			this.initialSource = list
				? Array.from(list.children)
						.filter((child) => child.tagName === "LI")
						.map((child) => child.textContent?.trim() ?? "")
						.join("\n")
				: "";
		}
		if (!this.grid) this.initialize();
	}
	protected attributeChangedCallback(): void {
		if (this.isConnected) this.initialize();
	}
	private initialize(): void {
		this.grid = undefined;
		this.inputs.clear();
		this.buttons.clear();
		this.status = undefined;
		this.undoStack = [];
		this.redoStack = [];
		this.selected = -1;
		this.completed = false;
		this.noteMode = false;
		this.showingErrors = false;
		try {
			this.grid = parseKakuro(this.puzzle);
			this.values = this.grid.cells.map((cell) => cell.given);
			this.notes = this.values.map(() => 0);
			this.render();
		} catch (error) {
			const message = document.createElement("p");
			message.setAttribute("role", "alert");
			message.textContent =
				error instanceof Error ? error.message : String(error);
			this.replaceChildren(message);
		}
	}
	private render(): void {
		const grid = this.grid;
		if (!grid) return;
		const wrapper = document.createElement("div");
		wrapper.className = "tp-kakuro-game";
		const toolbar = document.createElement("div");
		toolbar.className = "tp-kakuro-toolbar";
		toolbar.dataset.helpGroup = "Game controls";
		const actions: [string, string, () => void][] = [
			[
				"notes",
				"Game",
				() => {
					this.noteMode = !this.noteMode;
					this.update();
				},
			],
			["undo", "Undo", () => this.history(false)],
			["redo", "Redo", () => this.history(true)],
			[
				"check",
				"Check",
				() => {
					this.showingErrors = !this.showingErrors;
					this.update();
				},
			],
			["hint", "Reveal cell", () => this.assist(false)],
			["solve", "Reveal solution", () => this.assist(true)],
			[
				"reset",
				"Reset",
				() =>
					this.change(() => {
						this.values = grid.cells.map((cell) => cell.given);
						this.notes = this.values.map(() => 0);
						this.showingErrors = false;
					}),
			],
		];
		for (const [action, label, handler] of actions) {
			const button = document.createElement(
				["reset", "undo", "redo"].includes(action)
					? "tp-icon-button"
					: "tp-button",
			);
			button.setAttribute("name", action === "reset" ? "refresh" : action);
			button.setAttribute("label", label);
			if (action === "notes") {
				const text = document.createElement("span");
				text.setAttribute("data-kakuro-mode-label", "");
				text.textContent = label;
				button.append(text);
			} else button.textContent = label;
			button.setAttribute("size", "s");
			button.dataset.action = action;
			button.addEventListener("click", handler);
			toolbar.append(button);
			this.buttons.set(action, button);
		}
		const board = document.createElement("div");
		board.className = "tp-kakuro-grid";
		board.style.setProperty("--columns", String(grid.columns));
		board.setAttribute("role", "group");
		board.setAttribute("aria-label", "Kakuro grid");
		board.dir = "ltr";
		for (const [index, cell] of grid.cells.entries()) {
			const box = document.createElement("div");
			box.className = "tp-kakuro-cell";
			if (!cell.white) {
				box.classList.add("tp-kakuro-block");
				if (cell.down || cell.across) box.classList.add("tp-kakuro-clue");
				for (const direction of ["down", "across"] as const)
					if (cell[direction]) {
						const clue = document.createElement("span");
						clue.className = `tp-kakuro-${direction}`;
						clue.textContent = String(cell[direction]);
						clue.setAttribute("aria-hidden", "true");
						box.append(clue);
					}
				box.setAttribute("aria-hidden", "true");
			} else {
				const input = document.createElement("input");
				input.type = "text";
				input.inputMode = "numeric";
				input.autocomplete = "off";
				input.maxLength = 1;
				input.readOnly = !!cell.given;
				input.dataset.index = String(index);
				const sums = cell.runs
					.map((i) => `${grid.runs[i]?.direction} ${grid.runs[i]?.total}`)
					.join(", ");
				input.setAttribute(
					"aria-label",
					`Row ${cell.row + 1}, column ${cell.col + 1}; ${sums}${cell.given ? "; fixed digit" : ""}`,
				);
				input.addEventListener("focus", () => {
					this.selected = index;
					input.select();
					this.updateSelection();
				});
				input.addEventListener("keydown", (event) =>
					this.keydown(event, index),
				);
				input.addEventListener("input", () => {
					const text = input.value;
					if (/^[1-9]$/.test(text)) this.enter(index, Number(text));
					else if (!text || text === "0") this.enter(index, 0);
					else this.update();
				});
				const notes = document.createElement("span");
				notes.className = "tp-kakuro-notes";
				notes.setAttribute("aria-hidden", "true");
				for (let digit = 1; digit <= 9; digit++) {
					const mark = document.createElement("span");
					mark.dataset.digit = String(digit);
					notes.append(mark);
				}
				box.append(input, notes);
				this.inputs.set(index, input);
				if (cell.given) box.classList.add("tp-kakuro-given");
			}
			board.append(box);
		}
		const status = document.createElement("p");
		status.className = "tp-kakuro-status";
		status.setAttribute("role", "status");
		status.setAttribute("aria-live", "polite");
		this.status = status;
		const entryBoard = document.createElement("div");
		entryBoard.className = "tp-kakuro-entry-board";
		entryBoard.style.setProperty("--columns", String(grid.columns));
		entryBoard.append(toolbar, board);
		wrapper.append(entryBoard, status);
		this.replaceChildren(wrapper);
		const header = document.createElement("div");
		entryBoard.before(header);
		const reset = this.buttons.get("reset") as TpIconButton,
			undo = this.buttons.get("undo") as TpIconButton,
			redo = this.buttons.get("redo") as TpIconButton;
		mountGameHeader(this, {
			name: "Kakuro",
			icon: "kakuro",
			target: header,
			reset: () => {},
			undo: () => {},
			redo: () => {},
			controls: { reset, undo, redo },
			canUndo: () => this.undoStack.length > 0,
			canRedo: () => this.redoStack.length > 0,
			help: () =>
				["check", "hint", "solve"].map((id) => ({
					id,
					label: this.buttons.get(id)?.textContent ?? id,
					run: () => this.buttons.get(id)?.click(),
					disabled: () =>
						this.buttons.get(id)?.hasAttribute("disabled") ?? false,
				})),
		});
		for (const id of ["check", "hint", "solve"]) this.buttons.get(id)?.remove();
		this.update();
	}
	private updateSelection(): void {
		const grid = this.grid;
		const active = grid?.cells[this.selected];
		for (const [index, input] of this.inputs) {
			const related =
				grid?.cells[index]?.runs.some((run) => active?.runs.includes(run)) ??
				false;
			input.parentElement?.classList.toggle("tp-kakuro-related", related);
		}
	}
	private snapshot(): Snapshot {
		return { values: [...this.values], notes: [...this.notes] };
	}
	private change(action: () => void): void {
		const before = this.snapshot();
		action();
		if (
			before.values.every((v, i) => v === this.values[i]) &&
			before.notes.every((v, i) => v === this.notes[i])
		) {
			this.update();
			return;
		}
		this.undoStack.push(before);
		this.redoStack = [];
		this.update(true);
	}
	private enter(index: number, digit: number): void {
		if (this.grid?.cells[index]?.given) return;
		this.change(() => {
			if (this.noteMode && digit) {
				this.values[index] = 0;
				this.notes[index] = (this.notes[index] ?? 0) ^ (1 << (digit - 1));
			} else {
				this.values[index] = digit;
				this.notes[index] = 0;
			}
		});
	}
	private history(redo: boolean): void {
		const source = redo ? this.redoStack : this.undoStack;
		const state = source.pop();
		if (!state) return;
		(redo ? this.undoStack : this.redoStack).push(this.snapshot());
		this.values = state.values;
		this.notes = state.notes;
		this.update(true);
	}
	private assist(all: boolean): void {
		const grid = this.grid;
		if (!grid) return;
		const index =
			grid.cells[this.selected]?.white && !grid.cells[this.selected]?.given
				? this.selected
				: grid.cells.findIndex((cell, i) => cell.white && !this.values[i]);
		if (!all && index < 0) return;
		try {
			// Solve from the givens so assistance can also correct mistaken player entries.
			const solution = solveKakuro(
				grid,
				grid.cells.map((cell) => cell.given),
			);
			if (!solution) {
				if (this.status)
					this.status.textContent = "The clues have no solution.";
				return;
			}
			this.change(() => {
				if (all) {
					this.values = solution;
					this.notes = this.values.map(() => 0);
				} else {
					this.values[index] = solution[index] ?? 0;
					this.notes[index] = 0;
				}
			});
		} catch (error) {
			if (this.status)
				this.status.textContent =
					error instanceof Error ? error.message : String(error);
		}
	}
	private keydown(event: KeyboardEvent, index: number): void {
		if (event.ctrlKey || event.metaKey) {
			if (event.key.toLowerCase() === "z" || event.key.toLowerCase() === "y") {
				event.preventDefault();
				this.history(event.key.toLowerCase() === "y" || event.shiftKey);
			}
			return;
		}
		if (event.altKey) return;
		if (/^[1-9]$/.test(event.key)) {
			event.preventDefault();
			this.enter(index, Number(event.key));
			return;
		}
		if (["Backspace", "Delete", "0"].includes(event.key)) {
			event.preventDefault();
			this.enter(index, 0);
			return;
		}
		const offset: Record<string, [number, number]> = {
			ArrowLeft: [0, -1],
			ArrowRight: [0, 1],
			ArrowUp: [-1, 0],
			ArrowDown: [1, 0],
		};
		const move = offset[event.key],
			grid = this.grid,
			cell = grid?.cells[index];
		if (!move || !grid || !cell) return;
		event.preventDefault();
		let row = cell.row + move[0],
			col = cell.col + move[1];
		while (row >= 0 && col >= 0 && row < grid.rows && col < grid.columns) {
			const next = row * grid.columns + col;
			if (this.inputs.has(next)) {
				this.inputs.get(next)?.focus();
				return;
			}
			row += move[0];
			col += move[1];
		}
	}
	private update(emit = false): void {
		updateGameHeader(this);
		gameActivity(this, this.undoStack.length > 0, this.completed);
		const grid = this.grid;
		if (!grid) return;
		const conflicts = kakuroConflicts(grid, this.values);
		let empty = 0;
		for (const [index, input] of this.inputs) {
			const value = this.values[index] ?? 0;
			if (!value) empty++;
			input.value = value ? String(value) : "";
			input.setAttribute(
				"aria-invalid",
				String(this.showingErrors && conflicts.has(index)),
			);
			const marks = this.notes[index] ?? 0;
			input.setAttribute(
				"title",
				marks
					? `Notes: ${Array.from({ length: 9 }, (_, i) => i + 1)
							.filter((digit) => marks & (1 << (digit - 1)))
							.join(", ")}`
					: "",
			);
			input.setAttribute("aria-description", input.title);
			for (const mark of input.parentElement?.querySelectorAll<HTMLElement>(
				"[data-digit]",
			) ?? []) {
				const digit = Number(mark.dataset.digit);
				mark.textContent = marks & (1 << (digit - 1)) ? String(digit) : "";
			}
		}
		const complete = empty === 0 && conflicts.size === 0;
		if (this.status) this.status.dataset.success = String(complete);
		if (this.status)
			this.status.textContent = complete
				? "Solved! Every sum is correct."
				: `${empty} empty cells${this.showingErrors ? `; ${conflicts.size} cells in conflicting runs` : ""}. ${this.noteMode ? "Note" : "Game"} mode.`;
		this.buttons
			.get("undo")
			?.toggleAttribute("disabled", !this.undoStack.length);
		this.buttons
			.get("redo")
			?.toggleAttribute("disabled", !this.redoStack.length);
		const mode = this.buttons.get("notes");
		const modeLabel = this.noteMode ? "Note" : "Game";
		mode?.setAttribute("label", modeLabel);
		const modeText = mode?.querySelector("[data-kakuro-mode-label]");
		if (modeText) modeText.textContent = modeLabel;
		for (const [action, pressed] of [
			["notes", this.noteMode],
			["check", this.showingErrors],
		] as const) {
			const button = this.buttons.get(action);
			button
				?.querySelector("button")
				?.setAttribute("aria-pressed", String(pressed));
			button?.setAttribute("variant", pressed ? "brand" : "neutral");
		}
		if (emit) {
			const detail = {
				values: Array.from({ length: grid.rows }, (_, r) =>
					this.values.slice(r * grid.columns, (r + 1) * grid.columns),
				),
				complete,
			};
			this.dispatchEvent(
				new CustomEvent("tp-kakuro-change", { detail, bubbles: true }),
			);
			if (complete && !this.completed)
				this.dispatchEvent(
					new CustomEvent("tp-kakuro-complete", { detail, bubbles: true }),
				);
		}
		this.completed = complete;
		this.updateSelection();
	}
}
if (!customElements.get("tp-kakuro"))
	customElements.define("tp-kakuro", TpKakuro);
declare global {
	interface HTMLElementTagNameMap {
		"tp-kakuro": TpKakuro;
	}
}
