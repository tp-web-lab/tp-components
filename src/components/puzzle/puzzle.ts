/** @module components/puzzle
 * @summary Image puzzle with draggable square, interlocking, triangular or hexagonal pieces.
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
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../button/button.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import type { TpButton } from "../button/button.js";
import { TpDropdown } from "../dropdown/dropdown.js";
import {
	type PuzzleLayout,
	type PuzzlePlacement,
	type PuzzleShape,
	puzzleContour,
	puzzleDestination,
	puzzleLayout,
	puzzlePath,
	puzzlePieceSolved,
	puzzleRotationStep,
	puzzleTarget,
} from "./geometry.js";
import style from "./puzzle.css?inline";

export type { PuzzlePlacement, PuzzleShape } from "./geometry.js";

const SVG = "http://www.w3.org/2000/svg";
let nextPuzzle = 0;
const copy = (state: readonly PuzzlePlacement[]) =>
	state.map((p) => ({ ...p }));
function svg<K extends keyof SVGElementTagNameMap>(
	tag: K,
	attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
	const node = document.createElementNS(SVG, tag);
	for (const [name, value] of Object.entries(attrs))
		node.setAttribute(name, String(value));
	return node;
}
/**
 * The custom `<tp-puzzle>` element provides an image puzzle with movable and rotatable pieces.
 *
 * @summary Provides an image puzzle with movable and rotatable pieces.
 * @tagname tp-puzzle
 * @attr {string} src = "" - Image URL (SVG, PNG, WebP or JPEG); overrides an initial img child. Changing it starts a new game.
 * @attr {number} pieces = 16 - Exact number of pieces, from 1 to 144. A factor grid is chosen to approximate the image aspect ratio.
 * @attr {"square" | "puzzle" | "triangle" | "hexagon"} shape = "puzzle" - Square, interlocking, equilateral triangle or regular hexagon pieces.
 * @attr {string} alt = "" - Description of the image; falls back to the initial img alternative text.
 * @attr {boolean} exact-orientation = false - Starts every piece upright instead of randomly rotated; changing it restarts the game.
 * @event tp-puzzle-load Emitted when the image is loaded and the pieces are ready.
 * @eventdetail tp-puzzle-load { pieces: number; rows: number; columns: number }
 * @event tp-puzzle-change Emitted after a placement, rotation, undo, redo or shuffle; placements are independent copies.
 * @eventdetail tp-puzzle-change { placements: PuzzlePlacement[]; solved: boolean }
 * @event tp-puzzle-complete Emitted when a move first completes the current arrangement.
 * @eventdetail tp-puzzle-complete { placements: PuzzlePlacement[]; solved: boolean }
 * @event tp-puzzle-error Emitted when the configuration or image cannot be loaded.
 * @eventdetail tp-puzzle-error { message: string }
 * @keyboard Arrow keys Move the selected piece; Shift increases the step.
 * @keyboard R / Shift+R Rotate the selected piece by ±90° for square/puzzle or ±60° for triangle/hexagon.
 * @keyboard ContextMenu / Shift+F10 Open the selected piece rotation menu.
 * @keyboard Escape Cancel a drag or close the rotation menu.
 * @keyboard Ctrl+Z / Ctrl+Shift+Z Undo / redo; Command is also supported.
 * @accessibility Pieces are labelled focusable SVG buttons. Keyboard movement and rotation are alternatives to dragging; progress is announced politely.
 * @accessibilityresponsibility Describe the source image with alt and offer an alternative activity when a visual spatial puzzle is not usable.
 * @see tp-tangram - Assemble a silhouette from seven geometric pieces.
 * @example
 * <tp-puzzle src="/docs/components/puzzle/examples/landscape.svg" pieces="12" alt="Mountain lake at sunrise"></tp-puzzle>
 */
export class TpPuzzle extends TpBase {
	public static get observedAttributes(): string[] {
		return ["src", "pieces", "shape", "alt", "exact-orientation"];
	}
	private readonly instance = `tp-puzzle-${++nextPuzzle}`;
	private fallbackSrc = "";
	private fallbackAlt = "";
	private captured = false;
	private generation = 0;
	private loadingImage?: HTMLImageElement;
	private imageUrl = "";
	private signature = "";
	private layout?: PuzzleLayout;
	private state: PuzzlePlacement[] = [];
	private past: PuzzlePlacement[][] = [];
	private future: PuzzlePlacement[][] = [];
	private selected = -1;
	private showingImage = false;
	private completed = false;
	private board?: SVGSVGElement;
	private imageGuide?: SVGImageElement;
	private statusNode?: HTMLElement;
	private menu?: TpDropdown;
	private anchor?: HTMLSpanElement;
	private nodes = new Map<number, SVGGElement>();
	private buttons = new Map<string, TpButton>();
	private drag?: {
		pointer: number;
		start: DOMPoint;
		before: PuzzlePlacement;
		preview: PuzzlePlacement;
		board: SVGSVGElement;
	};
	/** Image URL used to create the puzzle. */
	public get src(): string {
		return this.getAttribute("src") ?? this.fallbackSrc;
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Exact requested piece count. */
	public get pieces(): number {
		return Number(this.getAttribute("pieces") ?? 16);
	}
	public set pieces(value: number) {
		this.setAttribute("pieces", String(value));
	}
	/** Piece outline style. */
	public get shape(): PuzzleShape {
		const value = this.getAttribute("shape");
		return value === "square" || value === "triangle" || value === "hexagon"
			? value
			: "puzzle";
	}
	public set shape(value: PuzzleShape) {
		this.setAttribute("shape", value);
	}
	/** Text description of the image. */
	public get alt(): string {
		return this.getAttribute("alt") ?? this.fallbackAlt;
	}
	public set alt(value: string) {
		this.setAttribute("alt", value);
	}
	/** Whether shuffled pieces start upright. */
	public get exactOrientation(): boolean {
		return this.hasAttribute("exact-orientation");
	}
	public set exactOrientation(value: boolean) {
		this.toggleAttribute("exact-orientation", value);
	}
	/** Independent copies of the piece centers in SVG cell units and right-angle rotations. */
	public get placements(): PuzzlePlacement[] {
		return copy(this.state);
	}
	/** Whether every piece matches its image position and orientation. */
	public get isSolved(): boolean {
		const layout = this.layout;
		return (
			!!layout &&
			!!this.state.length &&
			this.state.every((p) => puzzlePieceSolved(p, layout))
		);
	}
	public get canUndo(): boolean {
		return !!this.past.length;
	}
	public get canRedo(): boolean {
		return !!this.future.length;
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-puzzle-styles", style);
		if (!this.captured) {
			const img = Array.from(this.children).find(
				(child) => child instanceof HTMLImageElement,
			);
			this.fallbackSrc = img?.getAttribute("src") ?? "";
			this.fallbackAlt = img?.getAttribute("alt") ?? "";
			this.captured = true;
		}
		if (!this.board || this.signature !== this.configuration()) this.load();
	}
	protected disconnectedCallback(): void {
		this.generation++;
		this.cancel();
		this.menu?.hide();
		this.clearImageHandlers();
	}
	protected attributeChangedCallback(
		name: string,
		old: string | null,
		value: string | null,
	): void {
		if (old === value || !this.isConnected || !this.captured) return;
		if (name === "alt" && this.board) {
			this.board.setAttribute(
				"aria-label",
				this.alt ? `Image puzzle: ${this.alt}` : "Image puzzle",
			);
			return;
		}
		this.load();
	}
	private configuration(): string {
		return JSON.stringify([
			this.src,
			this.pieces,
			this.getAttribute("shape"),
			this.exactOrientation,
		]);
	}
	private clearImageHandlers(): void {
		if (this.loadingImage) {
			this.loadingImage.onload = null;
			this.loadingImage.onerror = null;
			this.loadingImage = undefined;
		}
	}
	private load(): void {
		const token = ++this.generation;
		this.cancel();
		this.menu?.hide();
		this.clearImageHandlers();
		this.board = undefined;
		this.layout = undefined;
		this.state = [];
		this.nodes.clear();
		this.buttons.clear();
		this.past = [];
		this.future = [];
		this.replaceChildren();
		const status = document.createElement("p");
		status.setAttribute("role", "status");
		status.textContent = "Loading puzzle image…";
		this.append(status);
		this.statusNode = status;
		this.setAttribute("aria-busy", "true");
		try {
			puzzleLayout(this.pieces, 1);
			if (
				this.hasAttribute("shape") &&
				!["square", "puzzle", "triangle", "hexagon"].includes(
					this.getAttribute("shape") ?? "",
				)
			)
				throw new Error("shape must be square, puzzle, triangle or hexagon.");
			if (!this.src.trim())
				throw new Error("Provide an image with src or an img child.");
			const url = resolveComponentSourceUrl(this, this.src).href;
			const image = new Image();
			this.loadingImage = image;
			image.onload = () => {
				if (token !== this.generation || !this.isConnected) return;
				try {
					this.layout = puzzleLayout(
						this.pieces,
						image.naturalWidth / image.naturalHeight,
						this.shape,
					);
					this.imageUrl = url;
					this.signature = this.configuration();
					this.clearImageHandlers();
					this.removeAttribute("aria-busy");
					this.build();
					this.reset();
					this.dispatchEvent(
						new CustomEvent("tp-puzzle-load", {
							bubbles: true,
							detail: {
								pieces: this.pieces,
								rows: this.layout.rows,
								columns: this.layout.columns,
							},
						}),
					);
				} catch (error) {
					this.fail(error);
				}
			};
			image.onerror = () => {
				if (token === this.generation && this.isConnected)
					this.fail(
						new Error(
							"Unable to load the puzzle image. Check its URL and image format.",
						),
					);
			};
			image.src = url;
		} catch (error) {
			this.fail(error);
		}
	}
	private fail(error: unknown): void {
		this.clearImageHandlers();
		this.removeAttribute("aria-busy");
		const message = error instanceof Error ? error.message : String(error);
		if (this.statusNode) {
			this.statusNode.setAttribute("role", "alert");
			this.statusNode.textContent = message;
		}
		this.dispatchEvent(
			new CustomEvent("tp-puzzle-error", {
				bubbles: true,
				detail: { message },
			}),
		);
	}
	private build(): void {
		const layout = this.layout;
		if (!layout) return;
		const imageWidth = layout.cells.length
			? Math.max(layout.boardWidth, layout.boardHeight * layout.aspect)
			: layout.boardWidth;
		const imageHeight = layout.cells.length
			? imageWidth / layout.aspect
			: layout.boardHeight;
		const imageX = layout.targetX + (layout.boardWidth - imageWidth) / 2;
		const imageY = layout.targetY + (layout.boardHeight - imageHeight) / 2;
		const root = document.createElement("div");
		root.className = "tp-puzzle-ui";
		const toolbar = document.createElement("div");
		toolbar.className = "tp-puzzle-toolbar";
		toolbar.setAttribute("role", "group");
		toolbar.setAttribute("aria-label", "Puzzle controls");
		toolbar.dataset.helpGroup = "Puzzle controls";
		const controls: [string, string, () => void][] = [
			["reset", "Shuffle", () => this.reset()],
			["undo", "Undo", () => this.undo()],
			["redo", "Redo", () => this.redo()],
			[
				"left",
				`Rotate −${puzzleRotationStep(this.shape)}°`,
				() => this.rotate(-puzzleRotationStep(this.shape)),
			],
			[
				"right",
				`Rotate +${puzzleRotationStep(this.shape)}°`,
				() => this.rotate(puzzleRotationStep(this.shape)),
			],
			["image", "Show image", () => this.showImage(!this.showingImage)],
		];
		for (const [id, label, action] of controls) {
			const button = document.createElement("tp-button");
			button.dataset.action = id;
			button.textContent = label;
			button.setAttribute("size", "s");
			button.addEventListener("click", action);
			toolbar.append(button);
			this.buttons.set(id, button);
		}
		const hint = document.createElement("p");
		hint.className = "tp-puzzle-hint";
		hint.textContent =
			"Drag the pieces into the frame. Right-click a piece to rotate it, or use the rotation buttons.";
		const board = svg("svg", {
			viewBox: `0 0 ${layout.width} ${layout.height}`,
			role: "group",
			"aria-label": this.alt ? `Image puzzle: ${this.alt}` : "Image puzzle",
		});
		board.classList.add("tp-puzzle-board");
		board.setAttribute("direction", "ltr");
		this.board = board;
		const defs = svg("defs");
		board.append(defs);
		const contour = puzzleContour(layout);
		const boardClipId = `${this.instance}-board-clip`;
		const boardClip = svg("clipPath", {
			id: boardClipId,
			clipPathUnits: "userSpaceOnUse",
		});
		boardClip.append(svg("path", { d: contour }));
		defs.append(boardClip);
		const target = svg("path", {
			d: contour,
			class: "tp-puzzle-target",
			"aria-hidden": "true",
		});
		board.append(target);
		const guide = svg("image", {
			href: this.imageUrl,
			x: imageX,
			y: imageY,
			width: imageWidth,
			height: imageHeight,
			preserveAspectRatio: layout.cells.length
				? "xMidYMid slice"
				: "xMidYMid meet",
			"clip-path": `url(#${boardClipId})`,
			opacity: 0,
			"pointer-events": "none",
			"aria-hidden": "true",
		});
		this.imageGuide = guide;
		board.append(guide);
		for (let id = 0; id < this.pieces; id++) {
			const path = puzzlePath(id, layout, this.shape),
				clipId = `${this.instance}-clip-${id}`;
			const clip = svg("clipPath", {
				id: clipId,
				clipPathUnits: "userSpaceOnUse",
			});
			clip.append(svg("path", { d: path }));
			defs.append(clip);
			const group = svg("g", {
				"data-piece": id,
				tabindex: 0,
				role: "button",
				"aria-label": `Piece ${id + 1}. Move with arrow keys; rotate with R.`,
				"aria-haspopup": "menu",
				"aria-expanded": "false",
			});
			group.append(
				svg("path", { d: path, class: "tp-puzzle-piece-background" }),
				svg("image", {
					href: this.imageUrl,
					x: imageX - puzzleTarget(id, layout).x,
					y: imageY - puzzleTarget(id, layout).y,
					width: imageWidth,
					height: imageHeight,
					preserveAspectRatio: layout.cells.length
						? "xMidYMid slice"
						: "xMidYMid meet",
					"clip-path": `url(#${clipId})`,
					"pointer-events": "none",
				}),
				svg("path", {
					d: path,
					class: "tp-puzzle-outline",
					"pointer-events": "none",
				}),
			);
			this.nodes.set(id, group);
			board.append(group);
		}
		board.addEventListener("pointerdown", this.down);
		board.addEventListener("pointermove", this.move);
		board.addEventListener("pointerup", this.up);
		board.addEventListener("pointercancel", this.cancel);
		board.addEventListener("lostpointercapture", this.cancel);
		board.addEventListener("keydown", this.key);
		board.addEventListener("contextmenu", this.context);
		board.addEventListener("focusin", (event) => {
			const id = this.pieceId(event.target);
			if (id !== null) {
				this.selected = id;
				this.update();
			}
		});
		const anchor = document.createElement("span");
		anchor.id = `${this.instance}-anchor`;
		anchor.className = "tp-puzzle-menu-anchor";
		anchor.setAttribute("aria-hidden", "true");
		this.anchor = anchor;
		const menu = new TpDropdown();
		menu.setAttribute("anchor", `#${anchor.id}`);
		menu.setAttribute("placement", "bottom");
		menu.setAttribute("offset", "2px");
		menu.setAttribute("outside-click", "");
		menu.setAttribute("aria-label", "Rotate selected piece");
		const list = document.createElement("ul");
		for (const [angle, label] of [
			[
				puzzleRotationStep(this.shape),
				`Rotate +${puzzleRotationStep(this.shape)}°`,
			],
			[
				-puzzleRotationStep(this.shape),
				`Rotate −${puzzleRotationStep(this.shape)}°`,
			],
		] as const) {
			const item = document.createElement("li");
			item.textContent = label;
			item.dataset.angle = String(angle);
			list.append(item);
		}
		menu.append(list);
		this.menu = menu;
		menu.addEventListener("click", (event) => {
			const item =
				event.target instanceof Element
					? event.target.closest<HTMLElement>("[data-angle]")
					: null;
			if (!item) return;
			this.rotate(Number(item.dataset.angle));
			this.closeMenu(true);
		});
		menu.addEventListener("tp-dropdown-toggle", () => {
			for (const [id, node] of this.nodes)
				node.setAttribute(
					"aria-expanded",
					String(menu.open && id === this.selected),
				);
		});
		menu.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				this.closeMenu(true);
			}
		});
		const status = document.createElement("p");
		status.className = "tp-puzzle-status";
		status.setAttribute("role", "status");
		status.setAttribute("aria-live", "polite");
		this.statusNode = status;
		root.append(toolbar, hint, board, anchor, menu, status);
		this.replaceChildren(root);
	}
	/** Shuffles pieces into the tray and starts a fresh move history. */
	public reset(): void {
		const layout = this.layout;
		if (!layout) return;
		this.cancel();
		this.closeMenu();
		this.selected = -1;
		this.showingImage = false;
		const ids = Array.from({ length: this.pieces }, (_, i) => i);
		for (let i = ids.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const a = ids[i],
				b = ids[j];
			if (a !== undefined && b !== undefined) {
				ids[i] = b;
				ids[j] = a;
			}
		}
		this.state = Array.from({ length: this.pieces }, (_, id) => {
			const slot = ids.indexOf(id);
			return {
				id,
				x: 1.8 + (slot % layout.columns) * 1.6,
				y: layout.boardHeight + 3 + Math.floor(slot / layout.columns) * 1.6,
				angle: this.exactOrientation
					? 0
					: Math.floor(Math.random() * (360 / puzzleRotationStep(this.shape))) *
						puzzleRotationStep(this.shape),
			};
		});
		this.past = [];
		this.future = [];
		this.completed = false;
		this.changed();
	}
	/** Places a piece in SVG cell units; angles must be multiples of the shape’s rotation step (90° or 60°). Snaps near its solution and clamps to the board. */
	public place(id: number, x: number, y: number, angle?: number): boolean {
		return this.commit(id, x, y, angle);
	}
	private commit(
		id: number,
		x: number,
		y: number,
		angle?: number,
		snap = true,
	): boolean {
		this.cancel();
		const layout = this.layout,
			before = this.state.find((p) => p.id === id);
		if (!layout || !before) return false;
		const next = puzzleDestination(
			{ id, x, y, angle: angle ?? before.angle },
			layout,
			snap,
		);
		if (!next) return false;
		if (
			next.x === before.x &&
			next.y === before.y &&
			next.angle === before.angle
		)
			return true;
		this.past.push(copy(this.state));
		this.future = [];
		this.state = this.state.map((p) => (p.id === id ? next : p));
		this.changed();
		return true;
	}
	/** Restores the previous accepted move. */
	public undo(): void {
		this.cancel();
		this.closeMenu();
		const state = this.past.pop();
		if (!state) return;
		this.future.push(copy(this.state));
		this.state = state;
		this.changed();
	}
	/** Reapplies the most recently undone move. */
	public redo(): void {
		this.cancel();
		this.closeMenu();
		const state = this.future.pop();
		if (!state) return;
		this.past.push(copy(this.state));
		this.state = state;
		this.changed();
	}
	/** Displays or hides the reference image in the target frame without changing placements. */
	public showImage(show = true): void {
		this.showingImage = show;
		this.update();
	}
	private rotate(angle: number): void {
		const p = this.state.find((p) => p.id === this.selected);
		if (p) this.place(p.id, p.x, p.y, p.angle + angle);
	}
	private changed(): void {
		this.update();
		const solved = this.isSolved;
		const detail = { placements: this.placements, solved };
		this.dispatchEvent(
			new CustomEvent("tp-puzzle-change", { bubbles: true, detail }),
		);
		if (solved && !this.completed)
			this.dispatchEvent(
				new CustomEvent("tp-puzzle-complete", {
					bubbles: true,
					detail: { placements: this.placements, solved },
				}),
			);
		this.completed = solved;
	}
	private update(): void {
		const layout = this.layout;
		if (!layout) return;
		for (const p of this.state) {
			const node = this.nodes.get(p.id);
			node?.setAttribute(
				"transform",
				`translate(${p.x} ${p.y}) rotate(${p.angle})`,
			);
			node?.toggleAttribute("data-selected", p.id === this.selected);
			node?.toggleAttribute("data-placed", puzzlePieceSolved(p, layout));
			node?.setAttribute(
				"aria-description",
				`${p.angle} degrees${puzzlePieceSolved(p, layout) ? ", in place" : ""}`,
			);
		}
		this.imageGuide?.setAttribute("opacity", this.showingImage ? "0.6" : "0");
		for (const [id, disabled] of [
			["undo", !this.canUndo],
			["redo", !this.canRedo],
			["left", this.selected < 0],
			["right", this.selected < 0],
		] as const)
			this.buttons.get(id)?.toggleAttribute("disabled", disabled);
		this.buttons
			.get("image")
			?.querySelector("button")
			?.setAttribute("aria-pressed", String(this.showingImage));
		const count = this.state.filter((p) => puzzlePieceSolved(p, layout)).length;
		if (this.statusNode)
			this.statusNode.textContent = this.isSolved
				? "Puzzle completed!"
				: `${count} of ${this.state.length} pieces in place.`;
	}
	private pieceId(target: EventTarget | null): number | null {
		const element =
			target instanceof Element
				? target.closest<SVGElement>("[data-piece]")
				: null;
		const id = element?.dataset.piece;
		return id === undefined ? null : Number(id);
	}
	private point(event: PointerEvent, board: SVGSVGElement): DOMPoint | null {
		const matrix = board.getScreenCTM();
		return matrix
			? new DOMPoint(event.clientX, event.clientY).matrixTransform(
					matrix.inverse(),
				)
			: null;
	}
	private down = (event: PointerEvent): void => {
		if (event.button !== 0 || this.drag) return;
		const id = this.pieceId(event.target),
			p = this.state.find((p) => p.id === id),
			board = this.board;
		if (!p || !board) return;
		const start = this.point(event, board);
		if (!start) return;
		event.preventDefault();
		this.closeMenu();
		this.selected = p.id;
		const node = this.nodes.get(p.id);
		if (node) {
			board.append(node);
			node.focus({ preventScroll: true });
		}
		this.update();
		this.drag = {
			pointer: event.pointerId,
			start,
			before: { ...p },
			preview: { ...p },
			board,
		};
		board.setPointerCapture(event.pointerId);
	};
	private move = (event: PointerEvent): void => {
		const drag = this.drag,
			layout = this.layout;
		if (!drag || !layout || event.pointerId !== drag.pointer) return;
		const point = this.point(event, drag.board);
		if (!point) return;
		const preview = puzzleDestination(
			{
				...drag.before,
				x: drag.before.x + point.x - drag.start.x,
				y: drag.before.y + point.y - drag.start.y,
			},
			layout,
		);
		if (!preview) return;
		drag.preview = preview;
		this.nodes
			.get(preview.id)
			?.setAttribute(
				"transform",
				`translate(${preview.x} ${preview.y}) rotate(${preview.angle})`,
			);
	};
	private up = (event: PointerEvent): void => {
		if (!this.drag || event.pointerId !== this.drag.pointer) return;
		this.move(event);
		const p = this.drag.preview;
		this.cancel();
		this.place(p.id, p.x, p.y, p.angle);
	};
	private cancel = (): void => {
		const drag = this.drag;
		if (!drag) return;
		this.drag = undefined;
		if (drag.board.hasPointerCapture(drag.pointer))
			drag.board.releasePointerCapture(drag.pointer);
		this.update();
	};
	private openMenu(id: number, x: number, y: number): void {
		this.cancel();
		this.selected = id;
		this.update();
		if (!this.anchor || !this.menu) return;
		this.anchor.style.left = `${x}px`;
		this.anchor.style.top = `${y}px`;
		this.menu.show();
		this.menu.reposition();
		this.menu.querySelector<HTMLElement>("[role=menuitem]")?.focus();
	}
	private closeMenu(focus = false): void {
		this.menu?.hide();
		if (focus) this.nodes.get(this.selected)?.focus({ preventScroll: true });
	}
	private context = (event: MouseEvent): void => {
		const id = this.pieceId(event.target);
		if (id === null) return;
		event.preventDefault();
		this.openMenu(id, event.clientX, event.clientY);
	};
	private key = (event: KeyboardEvent): void => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
			event.preventDefault();
			event.shiftKey ? this.redo() : this.undo();
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			this.cancel();
			this.closeMenu(true);
			return;
		}
		const id = this.pieceId(event.target),
			p = this.state.find((p) => p.id === id);
		if (!p) return;
		if (
			event.key === "ContextMenu" ||
			(event.shiftKey && event.key === "F10")
		) {
			event.preventDefault();
			const matrix = this.board?.getScreenCTM();
			if (matrix) {
				const center = new DOMPoint(p.x, p.y).matrixTransform(matrix);
				this.openMenu(p.id, center.x, center.y);
			}
			return;
		}
		if (event.ctrlKey || event.altKey || event.metaKey) return;
		const step = event.shiftKey ? 0.25 : 0.05;
		let { x, y, angle } = p;
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
				angle += (event.shiftKey ? -1 : 1) * puzzleRotationStep(this.shape);
				break;
			default:
				return;
		}
		event.preventDefault();
		const target = this.layout ? puzzleTarget(p.id, this.layout) : undefined;
		// Magnetic snapping must not prevent keyboard users from leaving a solved position.
		const snap =
			!event.key.startsWith("Arrow") ||
			!target ||
			Math.hypot(x - target.x, y - target.y) <
				Math.hypot(p.x - target.x, p.y - target.y);
		this.commit(p.id, x, y, angle, snap);
	};
}
if (!customElements.get("tp-puzzle"))
	customElements.define("tp-puzzle", TpPuzzle);
declare global {
	interface HTMLElementTagNameMap {
		"tp-puzzle": TpPuzzle;
	}
}
