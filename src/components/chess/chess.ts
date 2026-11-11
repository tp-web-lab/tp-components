/** @module components/chess
 * @summary Interactive chess positions and endgames with legal moves and random opponents.
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
/**
 * @credit chess.js https://github.com/jhlywa/chess.js
 * @summary Legal chess moves, FEN validation and game-end detection (BSD-2-Clause).
 */
// tp-docgen:dependencies:end

import { Chess, type Move, type Square } from "chess.js";
import {
	gameActivity,
	mountGameHeader,
	resetGameClock,
	updateGameHeader,
} from "../../utilities/game-header.js";
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
import { registerTpIconLibrary } from "../icon/icon-registry.js";
import bishop from "../icon/icons/chess/chess-bishop.svg?raw";
import king from "../icon/icons/chess/chess-king.svg?raw";
import knight from "../icon/icons/chess/chess-knight.svg?raw";
import pawn from "../icon/icons/chess/chess-pawn.svg?raw";
import queen from "../icon/icons/chess/chess-queen.svg?raw";
import rook from "../icon/icons/chess/chess-rook.svg?raw";
import style from "./chess.css?inline";
import {
	type ChessPlayMode,
	type ChessPosition,
	type ChessPromotion,
	type ChessSide,
	createPosition,
	DEFAULT_POSITION,
	isSquare,
} from "./chess-model.js";

export type {
	ChessPiece,
	ChessPlayMode,
	ChessPosition,
	ChessPromotion,
	ChessSide,
} from "./chess-model.js";

const icons = { k: king, q: queen, r: rook, b: bishop, n: knight, p: pawn };
registerTpIconLibrary("chess", icons);
const names = {
	k: "king",
	q: "queen",
	r: "rook",
	b: "bishop",
	n: "knight",
	p: "pawn",
};
/**
 * The custom `<tp-chess>` element displays chess positions and plays out endgames.
 *
 * @summary Displays chess positions and plays out endgames.
 * @tagname tp-chess
 * @attr {string} position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" - Piece placement or full FEN. Placement-only input defaults to White to move with no castling or en-passant rights.
 * @attr {string} fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" - Full six-field FEN, synchronized after every move. Takes precedence over position on initial connection.
 * @attr {"black" | "white"} orientation = "white" - Side displayed at the bottom of the board.
 * @attr {boolean} draggable-pieces = false - Enables human moves by dragging, clicking or keyboard. Also accepts the HTML spelling draggablePieces; the JavaScript property is draggablePieces.
 * @attr {boolean} draggablepieces = false - HTML-normalized alias of draggablePieces; use draggable-pieces for the canonical markup spelling.
 * @event tp-chess-change Emitted after an accepted position change or legal move.
 * @eventdetail tp-chess-change { fen: string; position: string }
 * @event tp-chess-move Emitted after a legal move, including castling, en passant and promotion.
 * @eventdetail tp-chess-move { from: string; to: string; san: string; promotion?: string; fen: string }
 * @event tp-chess-end Emitted after a move ends the game by checkmate or a draw.
 * @eventdetail tp-chess-end { fen: string; result: string }
 * @event tp-chess-error Emitted when a supplied position or play configuration is invalid; the previous position is preserved.
 * @eventdetail tp-chess-error { message: string }
 * @keyboard Arrow keys Move focus across the board in the displayed direction.
 * @keyboard Enter / Space Select a piece or move it to the focused square.
 * @keyboard Escape Cancel the selection, drag or promotion choice.
 * @accessibility Squares have coordinate and piece labels, a roving keyboard focus and visible legal-move indicators. Game status is announced politely.
 * @example
 * <tp-chess position="8/8/3k4/8/3PK3/8/8/8" draggable-pieces=""></tp-chess>
 */
export class TpChess extends TpBase {
	public static get observedAttributes(): string[] {
		return [
			"position",
			"fen",
			"orientation",
			"draggable-pieces",
			"draggablepieces",
		];
	}
	private game = new Chess();
	private future: Move[] = [];
	private initialized = false;
	private reflecting = false;
	private initialFen = DEFAULT_POSITION;
	private board?: HTMLDivElement;
	private status?: HTMLParagraphElement;
	private sidebar?: HTMLElement;
	private promotionPanel?: HTMLDivElement;
	private selected?: Square;
	private highlighted = new Set<Square>();
	private focusSquare: Square = "a8";
	private pending?: { from: Square; to: Square };
	private mode: ChessPlayMode | null = null;
	private userSide: ChessSide = "white";
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
	/** Current piece-placement field. Assign a placement, full FEN or piece map through setPosition. */
	public get position(): string {
		return this.game.fen().split(" ")[0] ?? "";
	}
	public set position(value: string) {
		this.setPosition(value);
	}
	/** Full FEN, including side to move, rights and move counters. */
	public get fen(): string {
		return this.game.fen({ forceEnpassantSquare: true });
	}
	public set fen(value: string) {
		this.setPosition(value);
	}
	/** Side shown at the bottom; flipping does not change the side to move. */
	public get orientation(): ChessSide {
		return this.getAttribute("orientation") === "black" ? "black" : "white";
	}
	public set orientation(value: ChessSide) {
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
		this.ensureGlobalStyle("tp-chess-style", style);
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
	/** Loads the classical starting position, with all castling rights. Stops automatic play. */
	public start(): void {
		this.setPosition(DEFAULT_POSITION);
	}
	/** Loads a FEN or square-to-piece map atomically. Returns false and emits an error if invalid. Empty maps clear the board; other positions need both kings. */
	public setPosition(value: string | ChessPosition): boolean {
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
			this.emit("tp-chess-change", { fen: this.fen, position: this.position });
			return true;
		} catch (error) {
			this.initialized = true;
			this.sync();
			this.fail(error);
			return false;
		}
	}
	/** Restores the most recently loaded position, preserving its turn and rights. Stops automatic play. */
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
	/** Tests a legal move for the side to move. Promotion defaults to queen; no state is changed. */
	public legalMove(
		begin: string,
		end: string,
		promotion: ChessPromotion = "q",
	): boolean {
		return this.available(begin).some(
			(m) => m.to === end && (!m.promotion || m.promotion === promotion),
		);
	}
	/** Highlights and returns legal destination squares. Omit the square to clear highlights. */
	public highlightLegalMove(square?: string): Square[] {
		const targets = [
			...new Set(square ? this.available(square).map((m) => m.to) : []),
		];
		this.highlighted = new Set(targets);
		this.mark();
		return targets;
	}
	/** Plays a legal move, returning false for an illegal move or a finished game. Promotion defaults to queen. */
	public move(
		begin: string,
		end: string,
		promotion: ChessPromotion = "q",
	): boolean {
		if (!this.legalMove(begin, end, promotion)) return false;
		const move = this.game.move({ from: begin, to: end, promotion });
		const replay = this.future[0];
		if (
			replay?.from === move.from &&
			replay.to === move.to &&
			replay.promotion === move.promotion
		)
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
		this.emit("tp-chess-change", { fen, position: this.position });
		this.emit("tp-chess-move", {
			from: move.from,
			to: move.to,
			san: move.san,
			promotion: move.promotion,
			fen,
		});
		if (this.game.isGameOver()) {
			this.stop();
			this.emit("tp-chess-end", { fen, result: this.result() });
		} else this.schedule();
		return true;
	}
	/** Starts user/random or random/random play from the current position. The human is White by default, independently of orientation. Default delay is 2000 ms; accepts 100–60000 ms. */
	public play(
		mode: ChessPlayMode = "user/random",
		userSide: ChessSide = "white",
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
		this.emit("tp-chess-change", { fen: this.fen, position: this.position });
	}
	private advance(): boolean {
		const moves = this.available();
		const choice =
			this.future[0] ?? moves[Math.floor(Math.random() * moves.length)];
		return choice
			? this.move(
					choice.from,
					choice.to,
					choice.promotion as ChessPromotion | undefined,
				)
			: false;
	}

	private emit(name: string, detail: unknown): void {
		this.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
	}
	private fail(error: unknown): void {
		this.message = error instanceof Error ? error.message : String(error);
		this.updateStatus();
		this.emit("tp-chess-error", { message: this.message });
	}
	private sync(): void {
		this.reflecting = true;
		this.setAttribute("position", this.position);
		this.setAttribute("fen", this.fen);
		this.reflecting = false;
	}
	private playable(): boolean {
		const pieces = this.game.board().flat();
		return (
			pieces.some((p) => p?.type === "k" && p.color === "w") &&
			pieces.some((p) => p?.type === "k" && p.color === "b")
		);
	}
	private available(square?: string): Move[] {
		if (
			!this.playable() ||
			this.game.isGameOver() ||
			(square !== undefined && !isSquare(square))
		)
			return [];
		return square && isSquare(square)
			? this.game.moves({ square, verbose: true })
			: this.game.moves({ verbose: true });
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
		if (!this.playable()) return "Empty board. Load a position to play.";
		if (this.game.isCheckmate())
			return `Checkmate. ${this.game.turn() === "w" ? "Black" : "White"} wins.`;
		if (this.game.isStalemate()) return "Draw by stalemate.";
		if (this.game.isInsufficientMaterial())
			return "Draw by insufficient material.";
		if (this.game.isThreefoldRepetition())
			return "Draw by threefold repetition.";
		if (this.game.isDrawByFiftyMoves()) return "Draw by the fifty-move rule.";
		return `${this.game.turn() === "w" ? "White" : "Black"} to move.${this.game.isCheck() ? " Check." : ""}`;
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
		root.className = "tp-chess-ui";
		const toolbar = document.createElement("div");
		toolbar.className = "tp-chess-toolbar";
		toolbar.dataset.helpGroup = "Chess controls";
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
		board.className = "tp-chess-board";
		board.setAttribute("role", "group");
		board.setAttribute("aria-label", "Chessboard");
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
		this.promotionPanel = document.createElement("div");
		this.promotionPanel.className = "tp-chess-promotion";
		this.promotionPanel.setAttribute("role", "group");
		this.promotionPanel.setAttribute("aria-label", "Choose promotion");
		this.promotionPanel.dataset.helpGroup = "Promotion";
		this.promotionPanel.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				this.pending = undefined;
				this.render();
				this.focusCell();
			}
		});
		this.status = document.createElement("p");
		this.status.className = "tp-chess-status";
		this.status.setAttribute("role", "status");
		this.status.setAttribute("aria-live", "polite");
		const layout = document.createElement("div");
		layout.className = "tp-chess-layout";
		this.sidebar = document.createElement("aside");
		this.sidebar.className = "tp-chess-sidebar";
		this.sidebar.setAttribute("aria-label", "Moves and captured pieces");
		const boardColumn = document.createElement("div");
		boardColumn.className = "tp-chess-board-column";
		layout.append(boardColumn, this.sidebar);
		const playback = document.createElement("div");
		playback.className = "tp-chess-playback";
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
		footer.className = "tp-chess-footer";
		footer.append(this.status, playback);
		boardColumn.append(board, this.promotionPanel, footer);
		root.append(toolbar, layout);
		this.replaceChildren(root);
		const header = document.createElement("div");
		toolbar.before(header);
		mountGameHeader(this, {
			name: "Chess",
			icon: "chess",
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
		const files = this.orientation === "white" ? "abcdefgh" : "hgfedcba";
		const ranks =
			this.orientation === "white"
				? [8, 7, 6, 5, 4, 3, 2, 1]
				: [1, 2, 3, 4, 5, 6, 7, 8];
		const fragment = document.createDocumentFragment();
		for (const rank of ranks)
			for (const file of files) {
				const square = `${file}${rank}` as Square;
				const cell = document.createElement("button");
				cell.type = "button";
				cell.dataset.square = square;
				cell.className = `tp-chess-square ${(file.charCodeAt(0) - 97 + rank) % 2 === 0 ? "light" : "dark"}`;
				const piece = this.game.get(square);
				cell.setAttribute(
					"aria-label",
					`${square}: ${piece ? `${piece.color === "w" ? "White" : "Black"} ${names[piece.type]}` : "empty"}`,
				);
				cell.tabIndex = square === this.focusSquare ? 0 : -1;
				if (piece) {
					const icon = document.createElement("tp-icon");
					icon.className = `tp-chess-piece ${piece.color === "w" ? "white" : "black"}`;
					icon.setAttribute("aria-hidden", "true");
					icon.setAttribute("library", "chess");
					icon.setAttribute("name", piece.type);
					cell.append(icon);
				}
				const coordinate = document.createElement("span");
				coordinate.className = "tp-chess-coordinate";
				coordinate.textContent = square;
				coordinate.setAttribute("aria-hidden", "true");
				cell.append(coordinate);
				fragment.append(cell);
			}
		this.board.replaceChildren(fragment);
		this.renderHistory();
		this.mark();
		this.renderPromotion();
		this.updateStatus();
		if (focused) this.focusCell();
	}
	private renderHistory(): void {
		if (!this.sidebar) return;
		const history = this.game.history({ verbose: true });
		const last = history.at(-1);
		this.sidebar.replaceChildren();
		const title = document.createElement("h3");
		title.textContent = "Last move";
		const summary = document.createElement("p");
		summary.className = "tp-chess-last-move";
		summary.setAttribute("aria-live", "polite");
		summary.textContent = last
			? this.describeMove(last)
			: "No moves played yet.";
		this.sidebar.append(title, summary);
		for (const color of ["w", "b"] as const) {
			const heading = document.createElement("h3");
			heading.textContent = `${color === "w" ? "White" : "Black"} pieces captured`;
			const pieces = document.createElement("div");
			pieces.className = "tp-chess-captured";
			pieces.dataset.color = color;
			for (const move of history) {
				if (!move.captured || move.color === color) continue;
				const icon = document.createElement("tp-icon");
				icon.className = `tp-chess-piece ${color === "w" ? "white" : "black"}`;
				icon.setAttribute("library", "chess");
				icon.setAttribute("name", move.captured);
				icon.setAttribute("role", "img");
				icon.setAttribute(
					"aria-label",
					`${color === "w" ? "White" : "Black"} ${names[move.captured]}`,
				);
				pieces.append(icon);
			}
			if (!pieces.childElementCount) pieces.textContent = "None";
			this.sidebar.append(heading, pieces);
		}
		const heading = document.createElement("h3");
		heading.textContent = "Move history";
		const list = document.createElement("ol");
		list.className = "tp-chess-history";
		for (const move of history) {
			const item = document.createElement("li");
			item.textContent = this.describeMove(move);
			list.append(item);
		}
		this.sidebar.append(heading, list);
		list.scrollTop = list.scrollHeight;
	}
	private describeMove(move: Move): string {
		return `${move.before.split(" ")[5]}${move.color === "w" ? "." : "…"} ${move.color === "w" ? "White" : "Black"} ${names[move.piece]}: ${move.from} → ${move.to}`;
	}

	private renderPromotion(): void {
		if (!this.promotionPanel) return;
		this.promotionPanel.replaceChildren();
		this.promotionPanel.hidden = !this.pending;
		if (!this.pending) return;
		const text = document.createElement("span");
		text.textContent = "Promote to:";
		this.promotionPanel.append(text);
		for (const promotion of ["q", "r", "b", "n"] as const) {
			const button = document.createElement("tp-button");
			button.textContent = names[promotion];
			button.setAttribute("size", "s");
			button.addEventListener("click", () => {
				const pending = this.pending;
				if (pending) {
					this.move(pending.from, pending.to, promotion);
					this.focusCell();
				}
			});
			this.promotionPanel.append(button);
		}
	}
	private mark(): void {
		const last = this.game.history({ verbose: true }).at(-1);
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
			this.selected !== square &&
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
		if (moves.some((m) => m.promotion)) {
			this.pending = { from, to };
			this.renderPromotion();
			this.promotionPanel?.querySelector("button")?.focus();
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
			this.renderPromotion();
			return;
		}
		const direction = {
			ArrowLeft: -1,
			ArrowRight: 1,
			ArrowUp: -8,
			ArrowDown: 8,
		}[event.key];
		if (direction !== undefined) {
			event.preventDefault();
			const cells = Array.from(
				this.board?.querySelectorAll<HTMLButtonElement>("[data-square]") ?? [],
			);
			const index = cells.findIndex((c) => c.dataset.square === square);
			const next = index + direction;
			if (
				next < 0 ||
				next >= 64 ||
				(Math.abs(direction) === 1 &&
					Math.floor(index / 8) !== Math.floor(next / 8))
			)
				return;
			cells[next]?.focus();
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
				this.ghost.classList.add("tp-chess-ghost");
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
if (!customElements.get("tp-chess")) customElements.define("tp-chess", TpChess);
declare global {
	interface HTMLElementTagNameMap {
		"tp-chess": TpChess;
	}
}
