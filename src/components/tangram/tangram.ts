/** @module components/tangram */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../button-group/button-group.js";
import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import "../dropdown/dropdown.js";
import {
	at,
	insideTarget,
	overlaps,
	PIECES,
	type Placement,
	type Point,
	parseSolution,
	polygon,
	SQUARE,
	solved,
	validate,
} from "./geometry.js";
import style from "./tangram.css?inline";

export type { Placement as TangramPlacement } from "./geometry.js";

const COLORS = [
	"#b84432",
	"#246c94",
	"#ba7b15",
	"#648237",
	"#925599",
	"#187f7c",
	"#b94574",
];
let tangramCount = 0;
const copy = (p: Placement[]): Placement[] => p.map((v) => ({ ...v }));
/**
 * @summary Seven-piece tangram with a life-size silhouette and collision-safe placement.
 * @tagname tp-tangram
 * @attr {string} src = "" - Text or JSON file containing the seven solution placements.
 * @attr {boolean} exact-orientation = false - Starts every piece in its solution orientation, including reflection; changing it restarts the puzzle.
 * @event tp-tangram-change Fired after an accepted edit; detail contains placements and solved.
 * @event tp-tangram-error Fired when loading a solution fails; detail contains message.
 * @keyboard Arrow keys Move the selected piece; Shift increases the step.
 * @keyboard R / Shift+R Rotate clockwise / counterclockwise by 45 degrees.
 * @keyboard F Flip the selected parallelogram.
 * @keyboard Ctrl+Z / Ctrl+Shift+Z Undo / redo (Command also supported).
 * @example
 * <tp-tangram></tp-tangram>
 */
export class TpTangram extends TpBase {
	private source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/tangram"],
	});
	private target = copy(SQUARE);
	private state: Placement[] = [];
	private history: Placement[][] = [];
	private cursor = 0;
	private selected = "large-1";
	private hasSelection = false;
	private resizeObserver?: ResizeObserver;
	private showing = false;
	private showingIncorrect = false;
	private revealedPiece: string | null = null;
	private readonly assistId = `tp-tangram-assist-${++tangramCount}`;
	private extent = 7;
	private viewExtent = 7;
	private token = 0;
	private abort?: AbortController;
	private ui?: HTMLDivElement;
	private drag?: {
		id: number;
		start: Point;
		before: Placement;
		svg: SVGSVGElement;
	};
	public static get observedAttributes(): string[] {
		return ["src", "exact-orientation"];
	}
	/** Whether initial orientations match the solution. Changing this restarts the game. */
	public get exactOrientation(): boolean {
		return this.hasAttribute("exact-orientation");
	}
	public set exactOrientation(value: boolean) {
		this.toggleAttribute("exact-orientation", value);
	}
	/** External solution URL. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-tangram-style", style);
		this.source.capture();
		if (!this.ui) {
			this.ui = document.createElement("div");
			this.ui.className = "tp-tangram-ui";
			this.append(this.ui);
			this.ui.addEventListener("click", this.handleClick);
			this.ui.addEventListener("keydown", this.key);
			this.ui.addEventListener("pointerdown", this.down);
			this.ui.addEventListener("pointermove", this.move);
			this.ui.addEventListener("pointerup", this.up);
			this.ui.addEventListener("pointercancel", this.cancel);
			this.ui.addEventListener("lostpointercapture", this.cancel);
			this.ui.addEventListener("focusin", (event) => {
				const id = (event.target as Element).getAttribute("data-piece");
				if (id) {
					this.selected = id;
					this.hasSelection = true;
					this.updateButtons();
				}
			});
		}
		if (typeof ResizeObserver !== "undefined") {
			this.resizeObserver = new ResizeObserver(() =>
				this.positionSelectionTools(),
			);
			this.resizeObserver.observe(this.ui);
		}
		this.source.observe(() => {
			void this.reload();
		});
		void this.reload();
	}
	protected disconnectedCallback(): void {
		this.token++;
		this.abort?.abort();
		this.source.disconnect();
		this.resizeObserver?.disconnect();
		this.cancel();
	}
	public attributeChangedCallback(
		name: string,
		old: string | null,
		value: string | null,
	): void {
		if (old === value || !this.isConnected || !this.ui) return;
		if (name === "exact-orientation") {
			if (this.state.length) this.reset();
		} else void this.reload();
	}
	private async reload(): Promise<void> {
		const token = ++this.token;
		this.abort?.abort();
		this.abort = new AbortController();
		try {
			const text = await this.source.read({ signal: this.abort.signal });
			if (token !== this.token) return;
			this.setSolution(text.trim() ? parseSolution(text) : SQUARE);
		} catch (error) {
			if (token !== this.token) return;
			if (!this.state.length) this.setSolution(SQUARE);
			const message = error instanceof Error ? error.message : String(error);
			this.status(message);
			this.dispatchEvent(
				new CustomEvent("tp-tangram-error", {
					bubbles: true,
					detail: { message },
				}),
			);
		}
	}
	/** Loads a validated solution; centers it and starts a fresh game. */
	public setSolution(solution: string | Placement[]): void {
		const next =
			typeof solution === "string" ? parseSolution(solution) : copy(solution);
		validate(next);
		this.token++;
		this.abort?.abort();
		this.cancel();
		const points = next.flatMap(polygon),
			xs = points.map((p) => p.x),
			ys = points.map((p) => p.y);
		const cx = (Math.min(...xs) + Math.max(...xs)) / 2,
			cy = (Math.min(...ys) + Math.max(...ys)) / 2;
		this.target = next.map((p) => ({ ...p, x: p.x - cx, y: p.y - cy }));
		this.extent = Math.max(
			7,
			Math.max(...xs) - Math.min(...xs) + 5,
			Math.max(...ys) - Math.min(...ys) + 5,
		);
		this.reset();
	}
	/** Current placements, returned as independent objects. */
	public get placements(): Placement[] {
		return copy(this.state);
	}
	public get isSolved(): boolean {
		return solved(this.state, this.target);
	}
	public get canUndo(): boolean {
		return this.cursor > 0;
	}
	public get canRedo(): boolean {
		return this.cursor < this.history.length - 1;
	}
	/** Restores the seven pieces around the target silhouette. */
	public reset(): void {
		this.cancel();
		const r = this.extent - 2;
		this.state = PIECES.map((p, i) => ({
			id: p.id,
			x: Math.cos((i * 2 * Math.PI) / 7) * r,
			y: Math.sin((i * 2 * Math.PI) / 7) * r,
			angle: this.exactOrientation
				? (this.target.find((q) => q.id === p.id)?.angle ?? 0)
				: 0,
			flipped: this.exactOrientation
				? (this.target.find((q) => q.id === p.id)?.flipped ?? false)
				: false,
		}));
		this.hasSelection = false;
		this.viewExtent = this.extent;
		this.showing = false;
		this.showingIncorrect = false;
		this.revealedPiece = null;
		this.history = [copy(this.state)];
		this.cursor = 0;
		this.render();
	}
	/** Attempts an absolute placement. Rejected placements leave history unchanged. */
	public place(
		id: string,
		x: number,
		y: number,
		angle?: number,
		flipped?: boolean,
	): boolean {
		const before = this.state.find((p) => p.id === id);
		if (!before) return false;
		const next = {
			...before,
			x,
			y,
			angle: angle ?? before.angle,
			flipped: flipped ?? before.flipped,
		};
		if (
			![x, y, next.angle].every(Number.isFinite) ||
			typeof next.flipped !== "boolean"
		)
			return false;
		if (this.state.some((p) => p.id !== id && overlaps(next, p))) {
			this.status("Placement refused: this piece overlaps another piece.");
			return false;
		}
		if (JSON.stringify(before) === JSON.stringify(next)) return true;
		this.state = this.state.map((p) => (p.id === id ? next : p));
		this.history.splice(this.cursor + 1);
		this.history.push(copy(this.state));
		this.cursor++;
		this.changed();
		return true;
	}
	public undo(): void {
		this.cancel();
		if (this.canUndo) {
			this.state = copy(at(this.history, --this.cursor));
			this.changed();
		}
	}
	public redo(): void {
		this.cancel();
		if (this.canRedo) {
			this.state = copy(at(this.history, ++this.cursor));
			this.changed();
		}
	}
	/** Shows an isolated solution preview; hiding it restores the unchanged playing pieces. */
	public showSolution(show = true): void {
		this.cancel();
		this.showing = show;
		this.revealedPiece = null;
		this.render();
	}
	/** Highlights pieces that are not entirely inside the target silhouette. */
	public showIncorrectPieces(show = true): void {
		this.cancel();
		this.showingIncorrect = show;
		this.showing = false;
		this.revealedPiece = null;
		this.render();
	}
	/** Returns incorrect pieces outside the silhouette in one undoable operation. */
	public clearIncorrectPieces(): void {
		this.cancel();
		this.showing = false;
		this.revealedPiece = null;
		this.showingIncorrect = false;
		const correct = this.state.filter((p) => insideTarget(p, this.target));
		if (correct.length === this.state.length) {
			this.render();
			return;
		}
		const parked = [...correct];
		this.state = this.state.map((p, i) => {
			if (correct.includes(p)) return p;
			let radius = this.extent - 2;
			let next: Placement;
			do {
				next = {
					...p,
					x: Math.cos((i * 2 * Math.PI) / 7) * radius,
					y: Math.sin((i * 2 * Math.PI) / 7) * radius,
				};
				radius += 2;
			} while ([...parked, ...this.target].some((q) => overlaps(next, q)));
			parked.push(next);
			return next;
		});
		this.showingIncorrect = false;
		if (
			JSON.stringify(this.state) !==
			JSON.stringify(at(this.history, this.cursor))
		) {
			this.history.splice(this.cursor + 1);
			this.history.push(copy(this.state));
			this.cursor++;
			this.changed();
		} else this.render();
	}
	/** Reveals the selected piece in the supplied dissection without moving it. */
	public showPiece(): void {
		this.cancel();
		if (!this.hasSelection) {
			this.status("Select a piece before asking to show it.");
			return;
		}
		this.showing = false;
		this.revealedPiece = this.selected;
		this.render();
		this.status(
			"Selected piece shown in the center using the supplied solution.",
		);
	}
	/** Toggles the browser fullscreen view. */
	public async fullscreen(): Promise<void> {
		try {
			if (document.fullscreenElement === this) await document.exitFullscreen();
			else await this.requestFullscreen();
		} catch {
			this.status(
				"Fullscreen is unavailable in this browser or embedding context.",
			);
		}
	}
	private changed(): void {
		this.render();
		this.dispatchEvent(
			new CustomEvent("tp-tangram-change", {
				bubbles: true,
				detail: { placements: this.placements, solved: this.isSolved },
			}),
		);
	}
	private status(text: string): void {
		const node = this.ui?.querySelector('[role="status"]');
		if (node) node.textContent = text;
	}
	private updateButtons(): void {
		this.ui
			?.querySelector('[data-assist="piece"]')
			?.setAttribute(
				"aria-disabled",
				String(this.showing || !this.hasSelection),
			);
		for (const button of this.ui?.querySelectorAll('[data-action="flip"]') ??
			[])
			button.toggleAttribute(
				"disabled",
				this.showing || this.selected !== "parallelogram",
			);
		for (const piece of this.ui?.querySelectorAll("[data-piece]") ?? [])
			piece.toggleAttribute(
				"data-selected",
				this.hasSelection && piece.getAttribute("data-piece") === this.selected,
			);
		this.positionSelectionTools();
	}
	private positionSelectionTools(): void {
		const tools = this.ui?.querySelector<HTMLElement>(
			".tp-tangram-selection-tools",
		);
		const board = this.ui?.querySelector<SVGSVGElement>(".tp-tangram-board");
		const piece = this.state.find((p) => p.id === this.selected);
		if (!tools || !board || !piece) return;
		tools.hidden = this.showing || !this.hasSelection || !!this.drag;
		if (tools.hidden) return;
		const bounds = board.getBoundingClientRect();
		const scale = Math.min(bounds.width, bounds.height) / (2 * this.viewExtent);
		const x = bounds.width / 2 + piece.x * scale;
		const y =
			bounds.height / 2 + Math.min(...polygon(piece).map((p) => p.y)) * scale;
		const width = tools.offsetWidth || 132,
			height = tools.offsetHeight || 44;
		tools.style.left = `${Math.max(4, Math.min(bounds.width - width - 4, x - width / 2))}px`;
		tools.style.top = `${Math.max(4, Math.min(bounds.height - height - 4, y - height - 8))}px`;
	}
	private iconButton(action: string, label: string, disabled = false): string {
		const icons: Record<string, string> = {
			undo: "undo",
			redo: "redo",
			left: "rotate-right",
			right: "rotate-right",
			flip: "card-flip",
			help: "help",
			reset: "refresh",
			fullscreen: "fullscreen",
		};
		return `<tp-icon-button ${action === "help" ? `id="${this.assistId}" aria-haspopup="menu"` : ""} data-action="${action}" name="${icons[action]}" label="${label}" ${disabled ? "disabled" : ""}></tp-icon-button>`;
	}
	private render(): void {
		if (!this.ui) return;
		// Expand the shared view instead of rejecting or hiding freely placed pieces.
		this.viewExtent = Math.max(
			this.viewExtent,
			...this.state
				.flatMap(polygon)
				.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y)) + 0.15),
		);
		const focus = this.ui.contains(document.activeElement)
			? (document.activeElement?.closest(
					"[data-piece],[data-action]",
				) as HTMLElement | null)
			: null;
		const focusId = focus?.dataset.piece,
			action = focus?.dataset.action;
		const localFocus = !!focus?.closest(".tp-tangram-selection-tools");
		const buttons: [string, string, boolean][] = [
			["undo", "Undo", !this.canUndo],
			["redo", "Redo", !this.canRedo],
			["left", "Rotate −45°", this.showing],
			["right", "Rotate +45°", this.showing],
			["flip", "Flip", this.selected !== "parallelogram"],
			["help", "Tangram assistance", false],
			["reset", "Restart", false],
			["fullscreen", "Fullscreen", false],
		];
		this.ui.innerHTML = `<div class="tp-tangram-heading"><div class="tp-tangram-title"><strong>Tangram</strong><span>7 pieces · 16 units of area</span></div><tp-button-group aria-label="Tangram controls">${buttons.map(([id, label, disabled]) => this.iconButton(id, label, disabled)).join("")}</tp-button-group></div><tp-dropdown class="tp-tangram-assist" anchor="#${this.assistId}" placement="bottom" outside-click><ul><li data-assist="incorrect">${this.showingIncorrect ? "Hide incorrect pieces" : "Show all incorrect pieces"}</li><li data-assist="clear">Clear the incorrect pieces</li><li data-assist="piece" aria-disabled="${this.showing || !this.hasSelection}">Show the piece</li><li data-assist="solution">${this.showing ? "Hide the solution" : "Show the solution"}</li></ul></tp-dropdown><p class="tp-tangram-hint">${this.showing ? "Solution preview — 7 pieces, each used once. Choose Hide the solution in the help menu to resume your game." : "Drag a piece. Rotate with the buttons or R; flip the parallelogram with F. Arrow keys move the focused piece."}</p><div class="tp-tangram-stage"><svg class="tp-tangram-board" viewBox="${-this.viewExtent} ${-this.viewExtent} ${2 * this.viewExtent} ${2 * this.viewExtent}" role="group" aria-label="Tangram puzzle board"> <g aria-hidden="true" class="tp-tangram-target" data-solution-preview="${this.showing}">${this.target.map((p) => `<polygon points="${this.points(p)}" fill="${this.showing || this.revealedPiece === p.id ? COLORS[PIECES.findIndex((piece) => piece.id === p.id)] : "#d6d5ce"}" ${this.showing || this.revealedPiece === p.id ? 'stroke="#fff" stroke-width="0.035"' : 'stroke="#d6d5ce" stroke-width="0.008"'}/>`).join("")}</g><g class="tp-tangram-playing-pieces" ${this.showing ? 'display="none" aria-hidden="true"' : ""}>${this.state.map((p, i) => `<polygon data-piece="${p.id}" ${this.showingIncorrect && !insideTarget(p, this.target) ? 'data-incorrect="true"' : ""} tabindex="${this.showing ? -1 : 0}" role="button" aria-label="${p.id}, move with arrow keys, rotate with R" points="${this.points(p)}" fill="${COLORS[i]}" stroke="#fff" stroke-width="0.035"/>`).join("")}</g></svg><div class="tp-tangram-selection-tools" role="group" aria-label="Selected piece controls" hidden>${this.iconButton("left", "Rotate selected piece −45°")}${this.iconButton("right", "Rotate selected piece +45°")}${this.iconButton("flip", "Flip selected piece", this.selected !== "parallelogram")}</div></div>${this.exactOrientation ? '<p class="tp-tangram-orientation">Exact orientation: all seven pieces start with their solution rotation and reflection. They remain freely movable and rotatable.</p>' : ""}<p role="status" aria-live="polite">${this.showing ? "Solution preview: seven pieces, each used once. Hide the solution to resume your unchanged game." : this.isSolved ? "Puzzle completed!" : this.showingIncorrect ? `${this.state.filter((p) => !insideTarget(p, this.target)).length} incorrect pieces highlighted.` : "Reproduce the central silhouette. Pieces may touch, but cannot overlap."}</p>`;
		const menu = this.ui.querySelector<TpDropdown>("tp-dropdown");
		menu?.addEventListener("click", (event) => {
			const item = (event.target as Element).closest<HTMLElement>(
				"[data-assist]",
			);
			if (!item || item.getAttribute("aria-disabled") === "true") return;
			menu.hide();
			switch (item.dataset.assist) {
				case "incorrect":
					this.showIncorrectPieces(!this.showingIncorrect);
					break;
				case "clear":
					this.clearIncorrectPieces();
					break;
				case "piece":
					this.showPiece();
					break;
				case "solution":
					this.showSolution(!this.showing);
					break;
			}
			this.ui
				?.querySelector<HTMLElement>('[data-action="help"] button')
				?.focus({ preventScroll: true });
		});
		menu?.addEventListener("tp-dropdown-toggle", () => {
			this.ui
				?.querySelector('[data-action="help"] button')
				?.setAttribute("aria-expanded", String(menu.open));
		});
		this.updateButtons();
		if (focusId)
			this.ui
				.querySelector<SVGElement>(`[data-piece="${focusId}"]`)
				?.focus({ preventScroll: true });
		else if (action)
			this.ui
				.querySelector<HTMLElement>(
					`${localFocus ? ".tp-tangram-selection-tools" : "tp-button-group"} [data-action="${action}"] button`,
				)
				?.focus({ preventScroll: true });
	}
	private points(p: Placement): string {
		return polygon(p)
			.map((v) => `${v.x},${v.y}`)
			.join(" ");
	}
	private handleClick = (event: Event): void => {
		const button = (event.target as Element).closest<HTMLElement>(
			"[data-action]",
		);
		if (!button || button.hasAttribute("disabled")) return;
		this.cancel();
		const p = this.state.find((p) => p.id === this.selected);
		if (!p) return;
		switch (button.dataset.action) {
			case "undo":
				this.undo();
				break;
			case "redo":
				this.redo();
				break;
			case "left":
				this.place(p.id, p.x, p.y, p.angle - 45);
				break;
			case "right":
				this.place(p.id, p.x, p.y, p.angle + 45);
				break;
			case "flip":
				if (p.id === "parallelogram")
					this.place(p.id, p.x, p.y, p.angle, !p.flipped);
				break;
			case "help":
				this.ui?.querySelector<TpDropdown>("tp-dropdown")?.toggle();
				break;
			case "reset":
				this.reset();
				break;
			case "fullscreen":
				void this.fullscreen();
		}
	};
	private key = (event: KeyboardEvent): void => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
			event.preventDefault();
			event.shiftKey ? this.redo() : this.undo();
			return;
		}
		if (event.key === "Escape") {
			this.cancel();
			return;
		}
		const id = (event.target as Element).getAttribute("data-piece");
		const p = this.state.find((p) => p.id === id);
		if (this.showing || !p || event.ctrlKey || event.metaKey || event.altKey)
			return;
		const step = event.shiftKey ? 0.5 : 0.05;
		let { x, y, angle, flipped } = p;
		switch (event.key) {
			case "ArrowLeft":
				x -= step;
				break;
			case "ArrowRight":
				x += step;
				break;
			case "ArrowUp":
				y -= step;
				break;
			case "ArrowDown":
				y += step;
				break;
			case "r":
			case "R":
				angle += event.shiftKey ? -45 : 45;
				break;
			case "f":
			case "F":
				if (p.id !== "parallelogram") return;
				flipped = !flipped;
				break;
			default:
				return;
		}
		event.preventDefault();
		this.cancel();
		this.place(p.id, x, y, angle, flipped);
	};
	private position(event: PointerEvent, svg: SVGSVGElement): Point | null {
		const matrix = svg.getScreenCTM();
		if (!matrix) return null;
		return new DOMPoint(event.clientX, event.clientY).matrixTransform(
			matrix.inverse(),
		);
	}
	private down = (event: PointerEvent): void => {
		if (this.showing || this.drag || event.button !== 0) return;
		const node = (event.target as Element).closest<SVGElement>("[data-piece]");
		const svg = node?.ownerSVGElement;
		const p = this.state.find((p) => p.id === node?.dataset.piece);
		if (!p || !svg) return;
		const start = this.position(event, svg);
		if (!start) return;
		event.preventDefault();
		this.selected = p.id;
		this.hasSelection = true;
		node?.focus({ preventScroll: true });
		this.updateButtons();
		this.drag = { id: event.pointerId, start, before: { ...p }, svg };
		svg.setPointerCapture(event.pointerId);
		this.positionSelectionTools();
	};
	private candidate(event: PointerEvent): Placement | null {
		if (!this.drag || event.pointerId !== this.drag.id) return null;
		const point = this.position(event, this.drag.svg);
		if (!point) return null;
		return {
			...this.drag.before,
			x: this.drag.before.x + point.x - this.drag.start.x,
			y: this.drag.before.y + point.y - this.drag.start.y,
		};
	}
	private move = (event: PointerEvent): void => {
		const p = this.candidate(event);
		if (!p) return;
		const node = this.ui?.querySelector(`[data-piece="${p.id}"]`);
		node?.setAttribute("points", this.points(p));
		node?.classList.toggle(
			"invalid",
			this.state.some((q) => q.id !== p.id && overlaps(p, q)),
		);
	};
	private up = (event: PointerEvent): void => {
		const p = this.candidate(event);
		if (!p) return;
		this.cancel();
		const anchors = [
			...this.target,
			...this.state.filter((q) => q.id !== p.id),
		].flatMap(polygon);
		let best = 0.18,
			dx = 0,
			dy = 0;
		for (const v of polygon(p))
			for (const a of anchors) {
				const distance = Math.hypot(a.x - v.x, a.y - v.y);
				if (distance < best) {
					best = distance;
					dx = a.x - v.x;
					dy = a.y - v.y;
				}
			}
		const snapped = { ...p, x: p.x + dx, y: p.y + dy };
		// Snapping must never turn a free placement into a refused overlap.
		const destination = this.state.some(
			(q) => q.id !== p.id && overlaps(snapped, q),
		)
			? p
			: snapped;
		this.place(p.id, destination.x, destination.y, p.angle, p.flipped);
	};
	private cancel = (): void => {
		const drag = this.drag;
		if (!drag) return;
		this.drag = undefined;
		if (drag.svg.hasPointerCapture(drag.id))
			drag.svg.releasePointerCapture(drag.id);
		const node = this.ui?.querySelector(`[data-piece="${drag.before.id}"]`);
		node?.setAttribute("points", this.points(drag.before));
		node?.classList.remove("invalid");
		this.positionSelectionTools();
	};
}
if (!customElements.get("tp-tangram"))
	customElements.define("tp-tangram", TpTangram);
declare global {
	interface HTMLElementTagNameMap {
		"tp-tangram": TpTangram;
	}
}
