/** @module components/checkers
 * @summary Interactive checkers positions and endgames with legal moves and random opponents.
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
	resetGameClock,
	updateGameHeader,
} from "../../utilities/game-header.js";
import { TpBase } from "../base/base.js";
import {
	CheckersGame,
	coordinates,
	type CheckersMove as Move,
	squareAt as numberedSquare,
	type Square,
} from "./checkers-model.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { registerTpIconLibrary } from "../icon/icon-registry.js";
import style from "./checkers.css?inline";
import {
	type CheckersPlayMode,
	type CheckersPosition,
	type CheckersSide,
	createPosition,
	DEFAULT_POSITION,
	isSquare,
} from "./checkers-model.js";
import king from "./king.svg?raw";
import man from "./man.svg?raw";

export type {
	CheckersMove,
	CheckersPiece,
	CheckersPlayMode,
	CheckersPosition,
	CheckersSide,
} from "./checkers-model.js";

const icons = { m: man, k: king };
registerTpIconLibrary("checkers", icons);
const names = { m: "man", k: "king" };
/**
 * The custom `<tp-checkers>` element displays international draughts positions and plays out endgames.
 *
 * @summary Displays international draughts positions and plays out endgames.
 * @tagname tp-checkers
 * @attr {string} position = "W:W31-50:B1-20" - Draughts FEN: side to move and numbered white/black piece lists. Prefix kings with K; ranges are accepted.
 * @attr {string} fen = "W:W31-50:B1-20" - Alias of position, synchronized after moves. Takes precedence on initial connection.
 * @attr {"black" | "white"} orientation = "white" - Side displayed at the bottom of the 10 by 10 board.
 * @attr {boolean} draggable-pieces = false - Enables human moves by dragging, clicking or keyboard.
 * @attr {boolean} draggablepieces = false - HTML-normalized alias of the JavaScript property draggablePieces.
 * @event tp-checkers-change Emitted after loading, playing or navigating a position.
 * @eventdetail tp-checkers-change { fen: string; position: string }
 * @event tp-checkers-move Emitted after a complete legal turn, including all captures and any promotion.
 * @eventdetail tp-checkers-move { from: string; to: string; path: string[]; captures: { square: string; color: string; type: string }[]; promotion: boolean; fen: string }
 * @event tp-checkers-end Emitted when a played move ends the game by a win or draw.
 * @eventdetail tp-checkers-end { fen: string; result: string }
 * @event tp-checkers-error Emitted for invalid positions or play parameters; the previous game remains unchanged.
 * @eventdetail tp-checkers-error { message: string }
 * @keyboard Arrow keys Move focus between playable squares in the displayed direction.
 * @keyboard Enter / Space Select a piece or play a complete move to a highlighted destination.
 * @keyboard Escape Cancel selection, dragging or a pending capture-path choice.
 * @accessibility Numbered square buttons support keyboard play; king icons, captured pieces and live game status have text alternatives.
 * @see tp-chess - Explore chess positions with the same playback controls.
 * @example
 * <tp-checkers position="W:W32,34,K46:B17,19,K5" draggable-pieces=""></tp-checkers>
 */
export class TpCheckers extends TpBase {
	public static get observedAttributes(): string[] {
		return [
			"position",
			"fen",
			"orientation",
			"draggable-pieces",
			"draggablepieces",
		];
	}
	private game = new CheckersGame();
	private future: Move[] = [];
	private initialized = false;
	private reflecting = false;
	private initialFen = DEFAULT_POSITION;
	private board?: HTMLDivElement;
	private status?: HTMLParagraphElement;
	private sidebar?: HTMLElement;
	private pathPanel?: HTMLDivElement;
	private selected?: Square;
	private highlighted = new Set<Square>();
	private focusSquare: Square = "1";
	private pending?: { from: Square; to: Square };
	private mode: CheckersPlayMode | null = null;
	private userSide: CheckersSide = "white";
	private timer?: ReturnType<typeof setTimeout>;
	private delay = 2000;
	private drag?: {
		from: Square;
		id: number;
		x: number;
		y: number;
		active: boolean;
	};
	private ghost?: HTMLElement;
	private suppressClick = false;
	private message = "";
	/** Current draughts FEN, including the side to move and numbered piece lists. */
	public get position(): string {
		return this.game.fen();
	}
	public set position(value: string) {
		this.setPosition(value);
	}
	/** Current draughts FEN; loading it begins a fresh history at move one. */
	public get fen(): string {
		return this.game.fen();
	}
	public set fen(value: string) {
		this.setPosition(value);
	}
	/** Side shown at the bottom; flipping does not change the side to move. */
	public get orientation(): CheckersSide {
		return this.getAttribute("orientation") === "black" ? "black" : "white";
	}
	public set orientation(value: CheckersSide) {
		this.setAttribute("orientation", value);
	}
	/** Enables mouse, touch and keyboard moves. API moves do not depend on this switch. */
	public get draggablePieces(): boolean {
		return (
			this.hasAttribute("draggable-pieces") ||
			this.hasAttribute("draggablepieces")
		);
	}
	public set draggablePieces(value: boolean) {
		this.removeAttribute("draggablepieces");
		this.toggleAttribute("draggable-pieces", Boolean(value));
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-checkers-style", style);
		if (!this.initialized)
			this.setPosition(
				this.getAttribute("fen") ??
					this.getAttribute("position") ??
					DEFAULT_POSITION,
			);
		this.build();
	}
	protected disconnectedCallback(): void {
		this.stop();
		this.cancelDrag();
	}
	protected attributeChangedCallback(
		name: string,
		old: string | null,
		value: string | null,
	): void {
		if (old === value || this.reflecting || !this.initialized) return;
		if (name === "position" || name === "fen") {
			this.setPosition(value ?? DEFAULT_POSITION);
			return;
		}
		this.cancelDrag();
		this.pending = undefined;
		this.selected = undefined;
		this.highlighted.clear();
		if (!this.draggablePieces && this.mode === "user/random") this.stop();
		this.render();
	}
	/** Loads the international starting position with twenty men per side. Stops automatic play. */
	public start(): void {
		this.setPosition(DEFAULT_POSITION);
	}
	/** Loads draughts FEN or a numbered piece map atomically. Returns false and emits an error if invalid; an empty map clears the board. */
	public setPosition(value: string | CheckersPosition): boolean {
		try {
			const next = createPosition(value);
			this.stop();
			this.cancelDrag();
			this.game = next;
			this.future = [];
			resetGameClock(this);
			this.initialized = true;
			this.initialFen = this.fen;
			this.selected = undefined;
			this.highlighted.clear();
			this.pending = undefined;
			this.message = "";
			this.sync();
			this.render();
			this.emit("tp-checkers-change", {
				fen: this.fen,
				position: this.position,
			});
			return true;
		} catch (error) {
			this.initialized = true;
			this.sync();
			this.fail(error);
			return false;
		}
	}
	/** Restores the most recently loaded position, preserving its side to move. Stops automatic play. */
	public reset(): void {
		resetGameClock(this);
		this.setPosition(this.initialFen);
	}
	/** Reverses the viewing orientation without changing the position or human side. */
	public flip(): void {
		this.orientation = this.orientation === "white" ? "black" : "white";
	}
	/** Removes all pieces and stops automatic play; the empty board cannot play moves. */
	public clear(): void {
		this.setPosition({});
	}
	/** Returns independent descriptions of all complete legal moves, optionally restricted to one origin. Paths include the origin and every landing square. */
	public legalMoves(square?: string | number): Move[] {
		return this.available(square === undefined ? undefined : String(square));
	}
	/** Tests a complete legal move. Supply a full path including origin if several capture routes share the same endpoint. */
	public legalMove(
		begin: string | number,
		end: string | number,
		path?: readonly (string | number)[],
	): boolean {
		const choices = this.available(String(begin)).filter(
			(m) =>
				m.to === String(end) &&
				(!path || m.path.join(",") === path.map(String).join(",")),
		);
		return choices.length === 1;
	}
	/** Highlights and returns legal destination squares. Omit the square to clear highlights. */
	public highlightLegalMove(square?: string | number): Square[] {
		const targets = [
			...new Set(square ? this.available(String(square)).map((m) => m.to) : []),
		];
		this.highlighted = new Set(targets);
		this.mark();
		return targets;
	}
	/** Plays one complete legal turn, including a whole capture sequence. Ambiguous endpoints require the full path; promotion is automatic. */
	public move(
		begin: string | number,
		end: string | number,
		path?: readonly (string | number)[],
	): boolean {
		if (!this.legalMove(begin, end, path)) return false;
		const move = this.game.move({
			from: String(begin),
			to: String(end),
			path: path?.map(String),
		});
		if (this.future[0]?.path.join(",") === move.path.join(","))
			this.future.shift();
		else this.future = [];

		this.message = "";
		this.selected = undefined;
		this.highlighted.clear();
		this.pending = undefined;
		this.cancelDrag();
		this.sync();
		this.render();
		const fen = this.fen;
		this.emit("tp-checkers-change", { fen, position: this.position });
		this.emit("tp-checkers-move", {
			from: move.from,
			to: move.to,
			path: [...move.path],
			captures: move.captures.map((p) => ({ ...p })),
			promotion: move.promotion,
			fen,
		});
		if (this.game.isGameOver()) {
			this.stop();
			this.emit("tp-checkers-end", { fen, result: this.result() });
		} else this.schedule();
		return true;
	}
	/** Starts user/random or random/random play from the current position. The human is White by default, independently of orientation. Default delay is 2000 ms; accepts 100–60000 ms. */
	public play(
		mode: CheckersPlayMode = "user/random",
		userSide: CheckersSide = "white",
		delay = 2000,
	): boolean {
		if (
			!["user/random", "random/random"].includes(mode) ||
			!["white", "black"].includes(userSide) ||
			!Number.isFinite(delay) ||
			delay < 100 ||
			delay > 60000
		) {
			this.fail(
				new Error(
					"Choose user/random or random/random, a white or black human side, and a delay from 100 to 60000 ms.",
				),
			);
			return false;
		}
		if (!this.playable() || this.game.isGameOver()) return false;
		this.stop();
		this.pending = undefined;
		this.selected = undefined;
		this.highlighted.clear();
		this.cancelDrag();
		if (mode === "user/random") this.draggablePieces = true;
		this.mode = mode;
		this.userSide = userSide;
		this.delay = delay;
		this.message = "";
		this.render();
		this.schedule();
		return true;
	}
	/** Stops the random opponent or autoplay. The current position remains on the board. */
	public stop(): void {
		if (this.timer !== undefined) clearTimeout(this.timer);
		this.timer = undefined;
		this.mode = null;
		this.updateStatus();
	}
	/** Returns to the loaded starting position while retaining played moves for replay. Pauses automatic play. */
	public rewind(): void {
		this.stop();
		let move = this.game.undo();
		while (move) {
			this.future.unshift(move);
			move = this.game.undo();
		}
		this.navigationChanged();
	}
	/** Undoes one half-move and keeps it available for replay. Returns false at the beginning. */
	public previousMove(): boolean {
		this.stop();
		const move = this.game.undo();
		if (!move) return false;
		this.future.unshift(move);
		this.navigationChanged();
		return true;
	}
	/** Replays the next recorded half-move, or plays one random legal move at the end of the recording. Pauses automatic play. */
	public nextMove(): boolean {
		this.stop();
		return this.advance();
	}
	/** Replays recorded moves and then continues with random legal moves until the game ends or is paused. */
	public playToEnd(): boolean {
		return this.play("random/random", this.userSide, this.delay);
	}
	/** Pauses playback without losing the current position or recorded moves. */
	public pause(): void {
		this.stop();
	}
	private navigationChanged(): void {
		this.cancelDrag();
		this.selected = undefined;
		this.pending = undefined;
		this.highlighted.clear();
		this.message = "";
		this.sync();
		this.render();
		this.emit("tp-checkers-change", { fen: this.fen, position: this.position });
	}
	private advance(): boolean {
		const moves = this.available();
		const choice =
			this.future[0] ?? moves[Math.floor(Math.random() * moves.length)];
		return choice ? this.move(choice.from, choice.to, choice.path) : false;
	}

	private emit(name: string, detail: unknown): void {
		this.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
	}
	private fail(error: unknown): void {
		this.message = error instanceof Error ? error.message : String(error);
		this.updateStatus();
		this.emit("tp-checkers-error", { message: this.message });
	}
	private sync(): void {
		this.reflecting = true;
		this.setAttribute("position", this.position);
		this.setAttribute("fen", this.fen);
		this.reflecting = false;
	}
	private playable(): boolean {
		return this.game.board().length > 0;
	}

	private available(square?: string): Move[] {
		if (
			!this.playable() ||
			this.game.isGameOver() ||
			(square !== undefined && !isSquare(square))
		)
			return [];
		return square && isSquare(square)
			? this.game.moves({ square })
			: this.game.moves();
	}
	private humanTurn(): boolean {
		return (
			this.draggablePieces &&
			!this.pending &&
			this.mode !== "random/random" &&
			(this.mode !== "user/random" ||
				this.game.turn() === (this.userSide === "white" ? "w" : "b"))
		);
	}
	private schedule(): void {
		if (this.timer !== undefined) clearTimeout(this.timer);
		this.timer = undefined;
		if (!this.isConnected || !this.mode || this.game.isGameOver()) return;
		if (
			this.mode === "user/random" &&
			this.game.turn() === (this.userSide === "white" ? "w" : "b")
		)
			return;
		this.timer = setTimeout(() => {
			this.timer = undefined;
			if (!this.advance()) this.stop();
		}, this.delay);
	}
	private result(): string {
		return this.game.result();
	}

	private updateStatus(): void {
		updateGameHeader(this);
		gameActivity(this, this.game.history().length > 0, this.game.isGameOver());
		if (this.status)
			this.status.textContent =
				this.message ||
				`${this.result()}${this.mode ? (this.mode === "random/random" ? " Random vs random." : ` You play ${this.userSide}.`) : !this.draggablePieces ? " Moves are locked." : ""}`;
		const stop = this.querySelector('tp-button[data-action="stop"]');
		stop?.toggleAttribute("disabled", !this.mode);
		const history = this.game.history().length;
		const finished = !this.playable() || this.game.isGameOver();
		for (const [action, disabled] of [
			["rewind", !history],
			["previous", !history],
			["step", finished],
			["play-all", finished || this.mode === "random/random"],
			["pause", !this.mode],
		] as const)
			this.querySelector(
				`tp-icon-button[data-playback="${action}"]`,
			)?.toggleAttribute("disabled", disabled);
	}
	private build(): void {
		const root = document.createElement("div");
		root.className = "tp-checkers-ui";
		const toolbar = document.createElement("div");
		toolbar.className = "tp-checkers-toolbar";
		toolbar.dataset.helpGroup = "Checkers controls";
		const actions: [string, string, () => unknown][] = [
			["start", "Start", () => this.start()],
			["flip", "Flip", () => this.flip()],
			[
				"user",
				"Play vs random",
				() => this.play("user/random", this.orientation),
			],
			["random", "Random vs random", () => this.play("random/random")],
			["stop", "Stop", () => this.stop()],
			["clear", "Clear", () => this.clear()],
		];
		for (const [id, label, action] of actions) {
			const button = document.createElement("tp-button");
			button.dataset.action = id;
			button.setAttribute("size", "s");
			button.textContent = label;
			button.addEventListener("click", action);
			toolbar.append(button);
		}
		const board = document.createElement("div");
		board.className = "tp-checkers-board";
		board.setAttribute("role", "group");
		board.setAttribute("aria-label", "Checkersboard");
		board.setAttribute("dir", "ltr");
		board.addEventListener("click", (event) => {
			if (this.suppressClick && event.detail > 0) {
				this.suppressClick = false;
				return;
			}
			const square = this.squareAt(event.target);
			if (square) this.activate(square);
		});
		board.addEventListener("keydown", this.key);
		board.addEventListener("pointerdown", this.down);
		board.addEventListener("pointermove", this.pointerMove);
		board.addEventListener("pointerup", this.up);
		board.addEventListener("pointercancel", this.cancelDrag);
		board.addEventListener("lostpointercapture", this.cancelDrag);
		board.addEventListener("focusin", (event) => {
			const square = this.squareAt(event.target);
			if (square) {
				this.focusSquare = square;
				this.mark();
			}
		});
		this.board = board;
		this.pathPanel = document.createElement("div");
		this.pathPanel.className = "tp-checkers-paths";
		this.pathPanel.setAttribute("role", "group");
		this.pathPanel.setAttribute("aria-label", "Choose capture path");
		this.pathPanel.dataset.helpGroup = "Capture paths";
		this.pathPanel.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				this.pending = undefined;
				this.render();
				this.focusCell();
			}
		});
		this.status = document.createElement("p");
		this.status.className = "tp-checkers-status";
		this.status.setAttribute("role", "status");
		this.status.setAttribute("aria-live", "polite");
		const layout = document.createElement("div");
		layout.className = "tp-checkers-layout";
		this.sidebar = document.createElement("aside");
		this.sidebar.className = "tp-checkers-sidebar";
		this.sidebar.setAttribute("aria-label", "Moves and captured pieces");
		const boardColumn = document.createElement("div");
		boardColumn.className = "tp-checkers-board-column";
		layout.append(boardColumn, this.sidebar);
		const playback = document.createElement("div");
		playback.className = "tp-checkers-playback";
		playback.dataset.helpGroup = "Playback";
		playback.setAttribute("role", "group");
		playback.setAttribute("aria-label", "Playback controls");
		const controls: [string, string, string, () => unknown][] = [
			[
				"rewind",
				"chevron-left-first",
				"Back to beginning",
				() => this.rewind(),
			],
			["previous", "previous", "Previous move", () => this.previousMove()],
			["step", "next", "Play one move", () => this.nextMove()],
			["play-all", "play", "Play to end", () => this.playToEnd()],
			["pause", "pause", "Pause", () => this.pause()],
		];
		for (const [action, icon, label, run] of controls) {
			const button = document.createElement("tp-icon-button");
			button.dataset.playback = action;
			button.setAttribute("name", icon);
			button.setAttribute("label", label);
			button.addEventListener("click", run);
			playback.append(button);
		}
		const footer = document.createElement("div");
		footer.className = "tp-checkers-footer";
		footer.append(this.status, playback);
		boardColumn.append(board, this.pathPanel, footer);
		root.append(toolbar, layout);
		this.replaceChildren(root);
		const header = document.createElement("div");
		toolbar.before(header);
		mountGameHeader(this, {
			name: "Checkers",
			icon: "checkers",
			target: header,
			reset: () => this.reset(),
			undo: () => this.previousMove(),
			redo: () => {
				if (this.future.length) this.nextMove();
			},
			canUndo: () => this.game.history().length > 0,
			canRedo: () => this.future.length > 0,
			help: () => [
				{
					label: "Highlight all legal destinations",
					run: () => {
						this.highlighted = new Set(this.available().map((m) => m.to));
						this.mark();
					},
				},
				{ label: "Play one random legal move", run: () => this.nextMove() },
			],
		});
		this.render();
	}
	private render(): void {
		if (!this.board) return;
		const focused = this.board.contains(document.activeElement);
		const fragment = document.createDocumentFragment();
		for (let visualRow = 0; visualRow < 10; visualRow++)
			for (let visualCol = 0; visualCol < 10; visualCol++) {
				const row = this.orientation === "white" ? visualRow : 9 - visualRow,
					column = this.orientation === "white" ? visualCol : 9 - visualCol;
				const square = numberedSquare(row, column);
				if (!square) {
					const blank = document.createElement("span");
					blank.className = "tp-checkers-square light";
					blank.setAttribute("aria-hidden", "true");
					fragment.append(blank);
					continue;
				}
				const cell = document.createElement("button");
				cell.type = "button";
				cell.dataset.square = square;
				cell.className = "tp-checkers-square dark";

				const piece = this.game.get(square);
				cell.setAttribute(
					"aria-label",
					`${square}: ${piece ? `${piece.color === "w" ? "White" : "Black"} ${names[piece.type]}` : "empty"}`,
				);
				cell.tabIndex = square === this.focusSquare ? 0 : -1;
				if (piece) {
					const icon = document.createElement("tp-icon");
					icon.className = `tp-checkers-piece ${piece.color === "w" ? "white" : "black"}`;
					icon.setAttribute("aria-hidden", "true");
					icon.setAttribute("library", "checkers");
					icon.setAttribute("name", piece.type);
					cell.append(icon);
				}
				const coordinate = document.createElement("span");
				coordinate.className = "tp-checkers-coordinate";
				coordinate.textContent = square;
				coordinate.setAttribute("aria-hidden", "true");
				cell.append(coordinate);
				fragment.append(cell);
			}
		this.board.replaceChildren(fragment);
		this.renderHistory();
		this.mark();
		this.renderPaths();
		this.updateStatus();
		if (focused) this.focusCell();
	}
	private renderHistory(): void {
		if (!this.sidebar) return;
		const history = this.game.history();
		const last = history.at(-1);
		this.sidebar.replaceChildren();
		const title = document.createElement("h3");
		title.textContent = "Last move";
		const summary = document.createElement("p");
		summary.className = "tp-checkers-last-move";
		summary.setAttribute("aria-live", "polite");
		summary.textContent = last
			? this.describeMove(last)
			: "No moves played yet.";
		this.sidebar.append(title, summary);
		for (const color of ["w", "b"] as const) {
			const heading = document.createElement("h3");
			heading.textContent = `${color === "w" ? "White" : "Black"} pieces captured`;
			const pieces = document.createElement("div");
			pieces.className = "tp-checkers-captured";
			pieces.dataset.color = color;
			for (const move of history)
				for (const captured of move.captures) {
					if (captured.color !== color) continue;
					const icon = document.createElement("tp-icon");
					icon.className = `tp-checkers-piece ${color === "w" ? "white" : "black"}`;
					icon.setAttribute("library", "checkers");
					icon.setAttribute("name", captured.type);
					icon.setAttribute("role", "img");
					icon.setAttribute(
						"aria-label",
						`${color === "w" ? "White" : "Black"} ${names[captured.type]}`,
					);
					pieces.append(icon);
				}

			if (!pieces.childElementCount) pieces.textContent = "None";
			this.sidebar.append(heading, pieces);
		}
		const heading = document.createElement("h3");
		heading.textContent = "Move history";
		const list = document.createElement("ol");
		list.className = "tp-checkers-history";
		for (const move of history) {
			const item = document.createElement("li");
			item.textContent = this.describeMove(move);
			list.append(item);
		}
		this.sidebar.append(heading, list);
		list.scrollTop = list.scrollHeight;
	}
	private describeMove(move: Move): string {
		return `${move.number}${move.color === "w" ? "." : "…"} ${move.color === "w" ? "White" : "Black"} ${names[move.piece]}: ${move.path.join(" → ")}`;
	}

	private renderPaths(): void {
		if (!this.pathPanel) return;
		this.pathPanel.replaceChildren();
		this.pathPanel.hidden = !this.pending;
		if (!this.pending) return;
		const label = document.createElement("span");
		label.textContent = "Choose capture path:";
		this.pathPanel.append(label);
		for (const move of this.available(this.pending.from).filter(
			(m) => m.to === this.pending?.to,
		)) {
			const button = document.createElement("tp-button");
			button.textContent = move.path.join(" × ");
			button.setAttribute("size", "s");
			button.addEventListener("click", () => {
				this.focusSquare = move.to;
				this.move(move.from, move.to, move.path);
				this.focusCell();
			});
			this.pathPanel.append(button);
		}
	}

	private mark(): void {
		const last = this.game.history().at(-1);
		for (const cell of this.board?.querySelectorAll<HTMLButtonElement>(
			"[data-square]",
		) ?? []) {
			const square = cell.dataset.square as Square;
			cell.toggleAttribute("data-selected", square === this.selected);
			cell.toggleAttribute(
				"data-last-move",
				square === last?.from || square === last?.to,
			);
			cell.toggleAttribute("data-legal", this.highlighted.has(square));
			cell.setAttribute("aria-pressed", String(square === this.selected));
			cell.tabIndex = square === this.focusSquare ? 0 : -1;
		}
	}
	private squareAt(target: EventTarget | null): Square | undefined {
		if (!(target instanceof Element)) return;
		const node = target.closest<HTMLElement>("[data-square]");
		const square = node?.dataset.square;
		return node && this.board?.contains(node) && square && isSquare(square)
			? square
			: undefined;
	}
	private focusCell(): void {
		this.board
			?.querySelector<HTMLButtonElement>(`[data-square="${this.focusSquare}"]`)
			?.focus();
	}
	private activate(square: Square): void {
		if (!this.humanTurn()) return;
		if (
			this.selected &&
			this.available(this.selected).some((m) => m.to === square)
		) {
			this.humanMove(this.selected, square);
			return;
		}
		this.selected =
			this.selected === square
				? undefined
				: this.available(square).length
					? square
					: undefined;
		this.highlightLegalMove(this.selected);
	}
	private humanMove(from: Square, to: Square): void {
		const moves = this.available(from).filter((m) => m.to === to);
		if (!moves.length) return;
		if (moves.length > 1) {
			this.pending = { from, to };
			this.renderPaths();
			this.pathPanel?.querySelector("button")?.focus();
			return;
		}
		this.focusSquare = to;
		this.move(from, to);
	}
	private key = (event: KeyboardEvent): void => {
		const square = this.squareAt(event.target);
		if (!square) return;
		if (event.key === "Escape") {
			this.cancelDrag();
			this.selected = undefined;
			this.pending = undefined;
			this.highlightLegalMove();
			this.renderPaths();
			return;
		}
		const direction: Record<string, [number, number]> = {
			ArrowLeft: [0, -1],
			ArrowRight: [0, 1],
			ArrowUp: [-1, 0],
			ArrowDown: [1, 0],
		};
		const delta = direction[event.key];
		if (!delta) return;
		event.preventDefault();
		const sign = this.orientation === "white" ? 1 : -1;
		let [row, column] = coordinates(square);
		// Only the 50 dark squares receive focus; skip the intervening light square.
		row += delta[0] * sign * 2;
		column += delta[1] * sign * 2;
		const next = numberedSquare(row, column);
		if (next) {
			this.focusSquare = next;
			this.mark();
			this.focusCell();
		}
	};
	private down = (event: PointerEvent): void => {
		this.suppressClick = false;
		if (event.button !== 0 || !this.humanTurn()) return;
		const from = this.squareAt(event.target);
		if (!from || !this.available(from).length) return;
		this.suppressClick = false;
		this.drag = {
			from,
			id: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			active: false,
		};
		this.board?.setPointerCapture?.(event.pointerId);
	};
	private pointerMove = (event: PointerEvent): void => {
		const drag = this.drag;
		if (!drag || drag.id !== event.pointerId) return;
		if (
			!drag.active &&
			Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5
		)
			return;
		if (!drag.active) {
			drag.active = true;
			this.selected = drag.from;
			this.highlightLegalMove(drag.from);
			const cell = this.board?.querySelector(`[data-square="${drag.from}"]`);
			const icon = cell?.querySelector("tp-icon");
			if (icon) {
				this.ghost = icon.cloneNode(true) as HTMLElement;
				this.ghost.classList.add("tp-checkers-ghost");
				this.ghost.style.width = `${cell?.getBoundingClientRect().width ?? 48}px`;
				this.ghost.setAttribute("aria-hidden", "true");
				this.append(this.ghost);
			}
		}
		if (this.ghost) {
			this.ghost.style.left = `${event.clientX}px`;
			this.ghost.style.top = `${event.clientY}px`;
		}
	};
	private up = (event: PointerEvent): void => {
		const drag = this.drag;
		if (!drag || drag.id !== event.pointerId) return;
		const to = this.squareAt(
			document.elementFromPoint(event.clientX, event.clientY),
		);
		this.cancelDrag();
		this.suppressClick = true;
		if (drag.active) {
			if (to && this.humanTurn()) this.humanMove(drag.from, to);
		} else if (to === drag.from) this.activate(drag.from);
	};
	private cancelDrag = (): void => {
		const drag = this.drag;
		this.drag = undefined;
		this.ghost?.remove();
		this.ghost = undefined;
		if (drag && this.board?.hasPointerCapture?.(drag.id))
			this.board.releasePointerCapture(drag.id);
	};
}
if (!customElements.get("tp-checkers"))
	customElements.define("tp-checkers", TpCheckers);
declare global {
	interface HTMLElementTagNameMap {
		"tp-checkers": TpCheckers;
	}
}
