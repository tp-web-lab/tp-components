/** @module components/wari
 * @summary Interactive Oware Abapa positions, sowing and endgames.
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
import "../button/button.js";
import "../icon-button/icon-button.js";
import style from "./wari.css?inline";
import {
	DEFAULT_POSITION,
	EMPTY_POSITION,
	WariGame,
	type WariMove,
	type WariPlayMode,
	type WariPosition,
	type WariSide,
} from "./wari-model.js";

export type {
	WariMove,
	WariPlayMode,
	WariPosition,
	WariSide,
} from "./wari-model.js";

const title = (side: WariSide) => (side === "south" ? "South" : "North");
/**
 * The custom `<tp-wari>` element displays Oware Abapa positions and plays out games and endgames.
 *
 * @summary Displays Oware Abapa positions and plays out games and endgames.
 * @tagname tp-wari
 * @attr {string} position = "S:4,4,4,4,4,4,4,4,4,4,4,4:0,0" - Side to move, twelve pit counts in sowing order, and South/North scores.
 * @attr {"south" | "north"} orientation = "south" - Side displayed at the bottom.
 * @attr {boolean} interactive = false - Enables human moves by clicking, tapping or keyboard.
 * @event tp-wari-change Emitted after loading, playing or navigating a position.
 * @eventdetail tp-wari-change { position: string; pits: number[]; scores: number[]; turn: string }
 * @event tp-wari-move Emitted after a complete sowing turn and its captures.
 * @eventdetail tp-wari-move { number: number; side: string; from: number; to: number; seeds: number; path: number[]; captures: { pit: number; seeds: number }[]; grandSlam: boolean; collected: number[]; before: string; after: string }
 * @event tp-wari-end Emitted when a played move ends the game.
 * @eventdetail tp-wari-end { position: string; result: string }
 * @event tp-wari-error Emitted for invalid positions or play parameters; the previous game remains unchanged.
 * @eventdetail tp-wari-error { message: string }
 * @keyboard Arrow keys Move focus between pits in the displayed direction.
 * @keyboard Enter / Space Sow the seeds of the focused legal pit when human input is enabled.
 * @accessibility Numbered pit buttons expose seed counts and legal moves; scores and game status have text alternatives.
 * @see tp-chess - Explore chess positions with the same playback controls.
 * @see tp-checkers - Explore international draughts positions with the same playback controls.
 * @example
 * <tp-wari interactive=""></tp-wari>
 */
export class TpWari extends TpBase {
	public static get observedAttributes(): string[] {
		return ["position", "orientation", "interactive"];
	}
	private game = new WariGame();
	private initialPosition = DEFAULT_POSITION;
	private future: WariMove[] = [];
	private initialized = false;
	private reflecting = false;
	private mode: WariPlayMode | null = null;
	private userSide: WariSide = "south";
	private delay = 2000;
	private timer?: ReturnType<typeof setTimeout>;
	private board?: HTMLDivElement;
	private sidebar?: HTMLElement;
	private status?: HTMLParagraphElement;
	private scoresPanel?: HTMLDivElement;
	private focusPit = 1;
	private highlighted = new Set<number>();
	private message = "";
	/** Serialized current position. Loading a position starts a new history. */
	public get position(): string {
		return this.game.position();
	}
	public set position(value: string) {
		this.setPosition(value);
	}
	/** Side displayed at the bottom; does not change the active side. */
	public get orientation(): WariSide {
		return this.getAttribute("orientation") === "north" ? "north" : "south";
	}
	public set orientation(value: WariSide) {
		this.setAttribute("orientation", value);
	}
	/** Enables clicking, tapping and keyboard play. API moves remain available when false. */
	public get interactive(): boolean {
		return this.hasAttribute("interactive");
	}
	public set interactive(value: boolean) {
		this.toggleAttribute("interactive", Boolean(value));
	}
	/** Independent South/North captured-seed totals, including any final collection. */
	public get scores(): [number, number] {
		return this.game.snapshot().scores;
	}
	/** Side whose turn it is. */
	public get turn(): WariSide {
		return this.game.turn();
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-wari-style", style);
		if (!this.initialized)
			this.setPosition(this.getAttribute("position") ?? DEFAULT_POSITION);
		this.build();
	}
	protected disconnectedCallback(): void {
		this.stop();
	}
	protected attributeChangedCallback(
		name: string,
		old: string | null,
		value: string | null,
	): void {
		if (old === value || this.reflecting || !this.initialized) return;
		if (name === "position") {
			this.setPosition(value ?? DEFAULT_POSITION);
			return;
		}
		if (!this.interactive && this.mode === "user/random") this.stop();
		this.render();
	}
	/** Loads the standard four-seeds-per-pit starting position. */
	public start(): void {
		this.setPosition(DEFAULT_POSITION);
	}
	/** Loads a serialized position or an object with twelve pits, two scores and a turn. Invalid input preserves the previous game. */
	public setPosition(value: string | WariPosition): boolean {
		try {
			const next = new WariGame(value);
			this.stop();
			this.game = next;
			this.future = [];
			resetGameClock(this);
			this.initialPosition = this.position;
			this.initialized = true;
			this.message = "";
			this.highlighted.clear();
			this.changed();
			return true;
		} catch (error) {
			this.initialized = true;
			this.sync();
			this.fail(error);
			return false;
		}
	}
	/** Restores the loaded exercise, clearing recorded moves. */
	public reset(): void {
		resetGameClock(this);
		this.setPosition(this.initialPosition);
	}
	/** Empties the board and scores and stops play. */
	public clear(): void {
		this.setPosition(EMPTY_POSITION);
	}
	/** Reverses the view without changing the active or human side. */
	public flip(): void {
		this.orientation = this.orientation === "south" ? "north" : "south";
	}
	/** Returns all playable pit numbers (1–12), including compulsory feeding restrictions. */
	public legalMoves(): number[] {
		return this.game.legalMoves();
	}
	/** Tests whether a pit can be sown without changing the position. */
	public legalMove(pit: number): boolean {
		return this.legalMoves().includes(pit);
	}
	/** Highlights and returns legal pits. Pass false to clear highlights. */
	public highlightLegalMove(show = true): number[] {
		const pits = show ? this.legalMoves() : [];
		this.highlighted = new Set(pits);
		this.mark();
		return pits;
	}
	/** Sows one pit and applies captures and end-of-game collection. Returns false for illegal input. */
	public move(pit: number): boolean {
		if (!this.legalMove(pit)) return false;
		const move = this.game.move(pit);
		if (this.future[0]?.from === pit) this.future.shift();
		else this.future = [];
		this.message = "";
		this.highlighted.clear();
		this.changed();
		this.emit("tp-wari-move", move);
		if (this.game.isGameOver()) {
			this.stop();
			this.emit("tp-wari-end", {
				position: this.position,
				result: this.game.result(),
			});
		} else this.schedule();
		return true;
	}
	/** Starts user/random or random/random play. Default delay is 2000 ms; allowed range is 100–60000 ms. */
	public play(
		mode: WariPlayMode = "user/random",
		userSide: WariSide = "south",
		delay = 2000,
	): boolean {
		if (
			!["user/random", "random/random"].includes(mode) ||
			!["south", "north"].includes(userSide) ||
			!Number.isFinite(delay) ||
			delay < 100 ||
			delay > 60000
		) {
			this.fail(
				Error(
					"Choose user/random or random/random, a south or north side, and a delay from 100 to 60000 ms.",
				),
			);
			return false;
		}
		if (this.game.isGameOver()) return false;
		this.stop();
		if (mode === "user/random") this.interactive = true;
		this.mode = mode;
		this.userSide = userSide;
		this.delay = delay;
		this.message = "";
		this.render();
		this.schedule();
		return true;
	}
	/** Stops automatic play while preserving the current board and recorded continuation. */
	public stop(): void {
		if (this.timer !== undefined) clearTimeout(this.timer);
		this.timer = undefined;
		this.mode = null;
		this.mark();
	}
	/** Pauses playback without discarding history. */
	public pause(): void {
		this.stop();
	}
	/** Returns to the loaded beginning, retaining recorded moves for replay. */
	public rewind(): void {
		this.stop();
		let m = this.game.undo();
		while (m) {
			this.future.unshift(m);
			m = this.game.undo();
		}
		this.navigated();
	}
	/** Undoes one complete turn, restoring seeds, scores and repetition state. */
	public previousMove(): boolean {
		this.stop();
		const m = this.game.undo();
		if (!m) return false;
		this.future.unshift(m);
		this.navigated();
		return true;
	}
	/** Replays one recorded move, or chooses one random legal move at the end of the recording. */
	public nextMove(): boolean {
		this.stop();
		return this.advance();
	}
	/** Replays the continuation and then plays randomly until the game ends or is paused. */
	public playToEnd(): boolean {
		return this.play("random/random", this.userSide, this.delay);
	}
	private advance(): boolean {
		const choices = this.legalMoves(),
			pit =
				this.future[0]?.from ??
				choices[Math.floor(Math.random() * choices.length)];
		return pit === undefined ? false : this.move(pit);
	}
	private navigated(): void {
		this.message = "";
		this.highlighted.clear();
		this.changed();
	}
	private sync(): void {
		this.reflecting = true;
		this.setAttribute("position", this.position);
		this.reflecting = false;
	}
	private changed(): void {
		this.sync();
		this.render();
		this.emit("tp-wari-change", {
			position: this.position,
			...this.game.snapshot(),
		});
	}
	private emit(name: string, detail: unknown): void {
		this.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
	}
	private fail(error: unknown): void {
		this.message = error instanceof Error ? error.message : String(error);
		this.mark();
		this.emit("tp-wari-error", { message: this.message });
	}
	private humanTurn(): boolean {
		return (
			this.interactive &&
			this.mode !== "random/random" &&
			(this.mode !== "user/random" || this.turn === this.userSide)
		);
	}
	private schedule(): void {
		if (this.timer !== undefined) clearTimeout(this.timer);
		this.timer = undefined;
		if (
			!this.isConnected ||
			!this.mode ||
			this.game.isGameOver() ||
			(this.mode === "user/random" && this.turn === this.userSide)
		)
			return;
		this.timer = setTimeout(() => {
			this.timer = undefined;
			if (!this.advance()) this.stop();
		}, this.delay);
	}
	private build(): void {
		const root = document.createElement("div");
		root.className = "tp-wari-ui";
		const toolbar = document.createElement("div");
		toolbar.className = "tp-wari-toolbar";
		toolbar.dataset.helpGroup = "Wari controls";
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
		for (const [id, label, run] of actions) {
			const b = document.createElement("tp-button");
			b.dataset.action = id;
			b.setAttribute("size", "s");
			b.textContent = label;
			b.addEventListener("click", run);
			toolbar.append(b);
		}
		const layout = document.createElement("div");
		layout.className = "tp-wari-layout";
		const column = document.createElement("div");
		column.className = "tp-wari-board-column";
		this.scoresPanel = document.createElement("div");
		this.scoresPanel.className = "tp-wari-scores";
		this.scoresPanel.setAttribute("aria-label", "Captured seeds");
		this.board = document.createElement("div");
		this.board.className = "tp-wari-board";
		this.board.dir = "ltr";
		this.board.setAttribute("role", "group");
		this.board.setAttribute("aria-label", "Awale board: twelve pits");
		this.board.addEventListener("keydown", this.key);
		this.status = document.createElement("p");
		this.status.className = "tp-wari-status";
		this.status.setAttribute("role", "status");
		const footer = document.createElement("div");
		footer.className = "tp-wari-footer";
		const playback = document.createElement("div");
		playback.className = "tp-wari-playback";
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
		for (const [id, icon, label, run] of controls) {
			const b = document.createElement("tp-icon-button");
			b.dataset.playback = id;
			b.setAttribute("name", icon);
			b.setAttribute("label", label);
			b.addEventListener("click", run);
			playback.append(b);
		}
		footer.append(this.status, playback);
		column.append(this.scoresPanel, this.board, footer);
		this.sidebar = document.createElement("aside");
		this.sidebar.className = "tp-wari-sidebar";
		this.sidebar.setAttribute("aria-label", "Last move and move history");
		layout.append(column, this.sidebar);
		root.append(toolbar, layout);
		this.replaceChildren(root);
		const header = document.createElement("div");
		toolbar.before(header);
		mountGameHeader(this, {
			name: "Wari",
			icon: "wari",
			target: header,
			reset: () => this.reset(),
			undo: () => this.previousMove(),
			redo: () => {
				if (this.future.length) this.nextMove();
			},
			canUndo: () => this.game.history().length > 0,
			canRedo: () => this.future.length > 0,
			help: () => [
				{ label: "Highlight legal pits", run: () => this.highlightLegalMove() },
				{ label: "Play one random legal move", run: () => this.nextMove() },
			],
		});
		this.render();
	}
	private order(): number[] {
		return this.orientation === "south"
			? [12, 11, 10, 9, 8, 7, 1, 2, 3, 4, 5, 6]
			: [6, 5, 4, 3, 2, 1, 7, 8, 9, 10, 11, 12];
	}
	private describe(move: WariMove): string {
		const captured = move.captures.reduce((n, p) => n + p.seeds, 0);
		return `${move.number}${move.side === "south" ? "." : "…"} ${title(move.side)}: ${move.from} → ${move.to}${captured ? ` (${captured} captured)` : ""}`;
	}
	private render(): void {
		if (!this.board || !this.sidebar || !this.scoresPanel) return;
		const focused = this.board.contains(document.activeElement),
			snapshot = this.game.snapshot(),
			history = this.game.history(),
			last = history.at(-1);
		this.board.replaceChildren();
		for (const pit of this.order()) {
			const count = snapshot.pits[pit - 1] ?? 0,
				side: WariSide = pit <= 6 ? "south" : "north";
			const b = document.createElement("button");
			b.type = "button";
			b.className = "tp-wari-pit";
			b.dataset.pit = String(pit);
			b.dataset.side = side;
			b.setAttribute("aria-label", `${title(side)} pit ${pit}: ${count} seeds`);
			if (last?.from === pit) b.dataset.lastFrom = "";
			if (last?.to === pit) b.dataset.lastTo = "";
			if (last?.captures.some((p) => p.pit === pit)) b.dataset.captured = "";
			const label = document.createElement("span");
			label.className = "tp-wari-pit-label";
			label.textContent = String(pit);
			const seeds = document.createElement("span");
			seeds.className = "tp-wari-seeds";
			seeds.setAttribute("aria-hidden", "true");
			for (let n = 0; n < Math.min(count, 12); n++) {
				const seed = document.createElement("span");
				seed.className = "tp-wari-seed";
				seeds.append(seed);
			}
			const total = document.createElement("strong");
			total.className = "tp-wari-count";
			total.textContent = String(count);
			b.append(label, seeds, total);
			b.addEventListener("click", () => {
				if (this.humanTurn()) {
					this.focusPit = pit;
					this.move(pit);
				}
			});
			b.addEventListener("focus", () => {
				this.focusPit = pit;
				this.mark();
			});
			this.board.append(b);
		}
		this.scoresPanel.replaceChildren();
		for (const side of [
			this.orientation === "south" ? "north" : "south",
			this.orientation,
		] as const) {
			const score = document.createElement("div");
			score.dataset.side = side;
			score.className = "tp-wari-score";
			score.textContent = `${title(side)}: ${snapshot.scores[side === "south" ? 0 : 1]} captured`;
			this.scoresPanel.append(score);
		}
		this.sidebar.replaceChildren();
		const heading = document.createElement("h3");
		heading.textContent = "Last move";
		const lastText = document.createElement("p");
		lastText.className = "tp-wari-last-move";
		lastText.textContent = last ? this.describe(last) : "No moves played yet.";
		this.sidebar.append(heading, lastText);
		if (last) {
			const detail = document.createElement("p");
			detail.className = "tp-wari-move-detail";
			detail.textContent = `${last.seeds} seeds sown.${last.grandSlam ? " Grand slam: capture cancelled to leave the opponent seeds." : ""}${last.collected.some((n) => n > 0) ? ` Final collection: South ${last.collected[0]}, North ${last.collected[1]}.` : ""}`;
			this.sidebar.append(detail);
		}
		const h = document.createElement("h3");
		h.textContent = "Move history";
		const list = document.createElement("ol");
		list.className = "tp-wari-history";
		for (const move of history) {
			const li = document.createElement("li");
			li.textContent = this.describe(move);
			list.append(li);
		}
		this.sidebar.append(h, list);
		list.scrollTop = list.scrollHeight;
		this.mark();
		if (focused)
			this.board
				.querySelector<HTMLButtonElement>(`[data-pit="${this.focusPit}"]`)
				?.focus();
	}
	private mark(): void {
		updateGameHeader(this);
		gameActivity(this, this.game.history().length > 0, this.game.isGameOver());
		const legal = this.legalMoves(),
			human = this.humanTurn();
		for (const b of this.board?.querySelectorAll<HTMLButtonElement>(
			"[data-pit]",
		) ?? []) {
			const n = Number(b.dataset.pit);
			b.tabIndex = n === this.focusPit ? 0 : -1;
			b.setAttribute("aria-disabled", String(!human || !legal.includes(n)));
			b.toggleAttribute(
				"data-legal",
				legal.includes(n) && (human || this.highlighted.has(n)),
			);
		}
		if (this.status)
			this.status.textContent =
				this.message ||
				`${this.game.result()}${this.mode ? (this.mode === "random/random" ? " Random vs random." : ` You play ${this.userSide}.`) : !this.interactive && !this.game.isGameOver() ? " Moves are locked." : ""}`;
		this.querySelector('tp-button[data-action="stop"]')?.toggleAttribute(
			"disabled",
			!this.mode,
		);
		const history = this.game.history().length,
			finished = this.game.isGameOver();
		for (const [id, disabled] of [
			["rewind", !history],
			["previous", !history],
			["step", finished],
			["play-all", finished || this.mode === "random/random"],
			["pause", !this.mode],
		] as const)
			this.querySelector(
				`tp-icon-button[data-playback="${id}"]`,
			)?.toggleAttribute("disabled", disabled);
	}
	private key = (event: KeyboardEvent): void => {
		const cell = (event.target as Element).closest<HTMLButtonElement>(
			"[data-pit]",
		);
		if (!cell) return;
		const order = this.order(),
			index = order.indexOf(Number(cell.dataset.pit)),
			r = Math.floor(index / 6),
			c = index % 6;
		const offsets: Record<string, [number, number]> = {
			ArrowLeft: [0, -1],
			ArrowRight: [0, 1],
			ArrowUp: [-1, 0],
			ArrowDown: [1, 0],
		};
		const offset = offsets[event.key];
		if (!offset) return;
		event.preventDefault();
		const rr = r + offset[0],
			cc = c + offset[1];
		if (rr < 0 || rr > 1 || cc < 0 || cc > 5) return;
		this.focusPit = order[rr * 6 + cc] ?? this.focusPit;
		this.mark();
		this.board
			?.querySelector<HTMLButtonElement>(`[data-pit="${this.focusPit}"]`)
			?.focus();
	};
}
if (!customElements.get("tp-wari")) customElements.define("tp-wari", TpWari);
declare global {
	interface HTMLElementTagNameMap {
		"tp-wari": TpWari;
	}
}
