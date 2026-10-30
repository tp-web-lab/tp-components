/** @module components/graph-geometry @summary Dynamic ruler and compass constructions. */
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
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
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
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @tp-dependency tp-save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
// tp-docgen:dependencies:end
import {
	chooseSaveTarget,
	saveBlob,
	type TpSaveTarget,
} from "../../utilities/save-file.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import type { TpButton } from "../button/button.js";
import { choosePlaygroundFile } from "../playground/playground-local-file.js";
import { renameGeometry } from "./geometry.js";
import { GEOMETRY_SHORTCUTS } from "./geometry-actions.js";
import "../callout/callout.js";
import "../theme/theme.js";
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../textfield/textfield.js";
import "../code-editor/code-editor.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import type { TpTextfield } from "../textfield/textfield.js";
import {
	dependencies,
	distance,
	evaluateGeometry,
	type GeometryObject,
	type GeometryPoint,
	type GeometryResult,
	geometrySourceLabel,
	intersections,
	isLinear,
	MEDIATRIX_CONSTRUCTION,
	parameterAt,
	parseGeometry,
	serializeGeometry,
	withGeometryLabel,
} from "./geometry.js";
import style from "./graph-geometry.css?inline";
import "../save-image/save-image.js";
import "../dropdown/dropdown.js";
import "../radio-list/radio-list.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import type { TpRadioList } from "../radio-list/radio-list.js";
import {
	GEOMETRY_COLORS,
	GEOMETRY_STYLES,
	GEOMETRY_TRANSFORMATIONS,
	type GeometryStroke,
	type GeometryTransformation,
} from "./geometry.js";

export type {
	GeometryObject,
	GeometryPoint,
	GeometryResult,
	GeometryValue,
} from "./geometry.js";
export {
	evaluateGeometry,
	geometrySourceLabel,
	MEDIATRIX_CONSTRUCTION,
	parseGeometry,
	serializeGeometry,
	withGeometryLabel,
} from "./geometry.js";

const escapeHtml = (text: string): string =>
	text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
const TOOLS = {
	move: "Move",
	pan: "Pan view",
	point: "Point",
	on: "Point on object",
	segment: "Segment",
	line: "Line",
	fixedSegment: "Segment · length",
	ray: "Ray",
	vector: "Vector",
	sector: "Angular sector",
	comment: "Comment",
	length: "Measure length",
	area: "Measure area",
	angle: "Measure angle",
	circle: "Circle · radius",
	through: "Circle · through point",
	arc: "Arc",
	intersection: "Intersection",
};
const TOOL_GROUPS: (keyof typeof TOOLS)[][] = [
	["move", "pan"],
	["point", "on", "intersection"],
	["line", "ray", "segment", "fixedSegment", "vector", "sector"],
	["circle", "through", "arc"],
	["length", "area", "angle"],
	["comment"],
];
const BUILT_IN_TOOLS = {
	midpoint: "Midpoint",
	perpendicular: "Perpendicular",
	parallel: "Parallel",
	perpendicularBisector: "Perpendicular bisector · direct",
	bisector: "Angle bisector",
	tangent: "Tangents",
	polygon: "Polygon",
	regularPolygon: "Regular polygon",
	axialSymmetry: "Axial symmetry",
	centralSymmetry: "Central symmetry",
	homothety: "Homothety",
	rotation: "Rotation",
	translation: "Translation",
};
const BUILT_IN_TOOL_GROUPS: (keyof typeof BUILT_IN_TOOLS)[][] = [
	[
		"midpoint",
		"perpendicular",
		"parallel",
		"perpendicularBisector",
		"bisector",
		"tangent",
	],
	["polygon", "regularPolygon"],
	["axialSymmetry", "centralSymmetry"],
	["homothety", "rotation", "translation"],
];
type Tool = keyof typeof TOOLS | keyof typeof BUILT_IN_TOOLS;
const HINTS: Record<Tool, string> = {
	length:
		"Select two points, or a segment, vector, circle, arc, polygon or sector. Closed shapes show their perimeter.",
	area: "Select a circle, polygon or angular sector to measure its area.",
	angle:
		"Select two sides with a common vertex or intersection, or three points (vertex second). Two sides show an arc and value, or a square for a right angle.",
	axialSymmetry:
		"Select the object to copy, then a line, segment, ray or vector as the reflection axis.",
	centralSymmetry: "Select the object to copy, then the centre point.",
	homothety:
		"Set Ratio (nonzero), select the object to copy, then the centre point.",
	rotation:
		"Set Rotation angle (°), select the object to copy, then the centre point. Positive angles turn counterclockwise.",
	translation:
		"Select the object to copy, then a vector giving the displacement.",
	polygon:
		"Click to create vertices or select existing points. Click the first vertex or Finish polygon after at least three vertices. Escape cancels.",
	regularPolygon:
		"Set Sides (3–360), then click or select two consecutive vertices. The polygon turns counterclockwise from the first edge.",
	pan: "Drag anywhere to move the whole figure. Scroll in either direction; arrow keys pan the view.",
	move: "Drag points, names or comments to move them. Drag empty space to move the view. Scroll to pan; Shift+scroll pans horizontally.",
	point: "Click the drawing to place a free point.",
	on: "Click a line, segment, ray, vector, circle or arc to place a point attached to it.",
	segment: "Select two existing points.",
	line: "Select two existing points.",
	fixedSegment:
		"Enter a positive length, then select the origin and a point giving its direction. The endpoint stays at the chosen length.",
	ray: "Select the origin, then a point giving the ray direction.",
	vector: "Select the starting point, then the endpoint.",
	sector:
		"Set start/end angles, then select a circle to draw its angular sector.",
	comment:
		"Enter comment text, then click anywhere. Clicking a point attaches the comment to it. Move comments with Select / Move.",
	midpoint: "Select a segment to construct its midpoint.",
	perpendicular: "Select a point, then a line, segment, ray or vector.",
	parallel: "Select a point, then a line, segment, ray or vector.",
	perpendicularBisector:
		"Select a segment to construct its perpendicular bisector directly.",
	bisector:
		"Select three points: first arm, vertex, second arm. The internal angle bisector follows them.",
	tangent:
		"Select a point, then a circle. Creates two tangents outside, one on the circle, none inside.",
	circle: "Enter a positive radius or distance(A, B), then select the centre.",
	through: "Select the centre, then a point on the circle.",
	arc: "Set start/end angles, then select a circle. Its outline will be hidden; its dependencies remain.",
	intersection: "Select two lines, segments, rays, vectors, circles or arcs.",
};
/**
 * @summary Constructs dynamic figures with a graduated ruler and compass.
 * @tagname tp-graph-geometry
 * @cssprop --tp-plot-height Height of the normal drawing including its top and bottom controls; other panels remain outside.
 * @attr {string} src = "" - URL of a text file containing construction commands.
 * @attr {string} label = "" - Title displayed above the drawing.
 * @attr {boolean} canvas-only = false - Shows the interactive drawing with its action palette and view controls, with a source toggle and without the object list.
 * @attr {boolean} built-in = false - Offers direct midpoint, perpendicular, parallel, perpendicular bisector, angle bisector, tangent, polygon and transformation tools.
 * @attr {boolean} grid = false - Shows a light grid without axes or graduations.
 * @attr {boolean} readonly = false - Prevents changes to the construction.
 * @event tp-geometry-change Fired after a construction change; detail contains source and undefined object names.
 * @eventdetail tp-geometry-change { source: string; undefined: string[] }
 * @event tp-geometry-error Fired when a file cannot be loaded or source cannot be parsed; detail contains message.
 * @eventdetail tp-geometry-error { message: string }
 * @accessibility Uses library buttons, fields and a code editor with native keyboard controls.
 * @accessibility Provides an object list as an alternative to pointer selection and announces undefined constructions.
 * @accessibilityresponsibility Provide a textual explanation of the figure when its visual relationships are needed to understand the lesson.
 * @keyboard {Arrow keys} Moves the selected point or measurement label, or pans in Pan view; Shift reduces the step.
 * @keyboard {Delete} Removes the selected object and its dependents as one undoable action.
 * @keyboard {F1} Opens the action palette.
 * @keyboard {Z} Enlarges or restores the interactive drawing.
 * @keyboard {Escape} Cancels pending construction input and returns to Move.
 * @keyboard {F2} Opens the inline name field for the selected object.
 * @example
 * <tp-graph-geometry></tp-graph-geometry>
 */
export class TpGraphGeometry extends TpBase {
	private static nextId = 0;
	private readonly controlId = `tp-geometry-${++TpGraphGeometry.nextId}`;
	private objects: GeometryObject[] = [];
	private activeAnimation: string | null = null;
	private animationStep = 0;
	private result: GeometryResult = evaluateGeometry([]);
	private initialized = false;
	private sourceRequest: AbortController | null = null;
	private localFileRequest: AbortController | null = null;
	private sourceSaveTarget: TpSaveTarget | null = null;
	private sourceFileBusy = false;
	private objectListMarkup = "";
	private objectsPanelVisible: boolean | null = null;
	private tool: Tool = "move";
	private polygonDraft: GeometryObject[] = [];
	private pending: string[] = [];
	private selected: string | null = null;
	private undoStack: string[] = [];
	private redoStack: string[] = [];
	private scale = 36;
	private canvasHeight = 560;
	private canvasObserver: ResizeObserver | null = null;
	private center: GeometryPoint = { x: 0, y: 0 };
	private pan: {
		pointer: number;
		start: GeometryPoint;
		center: GeometryPoint;
	} | null = null;
	private suppressCanvasClick = false;
	private movingName = false;
	private pointerObject: string | null = null;
	private drag: {
		label?: boolean;
		id: string;
		before: string;
		pointer: number;
		grab?: GeometryPoint;
	} | null = null;
	public static get observedAttributes(): string[] {
		return ["readonly", "grid", "src", "built-in", "canvas-only", "label"];
	}
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		if (value) this.setAttribute("src", value);
		else this.removeAttribute("src");
	}
	public get value(): string {
		return withGeometryLabel(serializeGeometry(this.objects), this.label);
	}
	public set value(source: string) {
		this.setConstruction(source);
	}
	public get grid(): boolean {
		return this.hasAttribute("grid");
	}
	public set grid(value: boolean) {
		this.toggleAttribute("grid", value);
	}
	public get label(): string {
		return this.getAttribute("label") ?? "";
	}
	public set label(value: string) {
		this.setAttribute("label", value);
	}
	public get canvasOnly(): boolean {
		return this.hasAttribute("canvas-only");
	}
	public set canvasOnly(value: boolean) {
		this.toggleAttribute("canvas-only", value);
	}
	public get builtIn(): boolean {
		return this.hasAttribute("built-in");
	}
	public set builtIn(value: boolean) {
		this.toggleAttribute("built-in", value);
	}
	public get readonly(): boolean {
		return this.hasAttribute("readonly");
	}
	/** Returns a detached snapshot of computed objects and undefined-object diagnostics. */
	public analyze(): GeometryResult {
		return structuredClone(this.result);
	}
	/** Atomically replaces the construction; invalid source leaves the previous figure intact. */
	public setConstruction(source: string): void {
		const next = parseGeometry(source);
		this.querySelector("[data-inline-rename]")?.remove();
		const sourceLabel = geometrySourceLabel(source);
		const previous = this.value;
		this.objects = next;
		this.animationStep = 0;
		if (sourceLabel !== undefined) this.label = sourceLabel;
		this.initialized = true;
		if (previous !== this.value) {
			this.undoStack.push(previous);
			this.redoStack = [];
		}
		this.pending = [];
		this.polygonDraft = [];
		this.selected = null;
		this.movingName = false;
		this.recompute();
		this.syncSource(source);
		this.changed();
	}
	/** @summary Undoes one construction change. */
	public undo(): void {
		if (this.readonly) return;
		const source = this.undoStack.pop();
		if (source === undefined) return;
		this.redoStack.push(this.value);
		this.restore(source);
	}
	/** @summary Redoes one construction change. */
	public redo(): void {
		if (this.readonly) return;
		const source = this.redoStack.pop();
		if (source === undefined) return;
		this.undoStack.push(this.value);
		this.restore(source);
	}
	/** Removes an object and every construction depending on it, as one undoable action. */
	public removeObject(id: string): void {
		if (this.readonly) return;
		const removed = new Set([id]);
		let count: number;
		do {
			count = removed.size;
			for (const object of this.objects)
				if (dependencies(object.definition).some((ref) => removed.has(ref)))
					removed.add(object.id);
		} while (count !== removed.size);
		this.setConstruction(
			serializeGeometry(
				this.objects
					.filter((object) => !removed.has(object.id))
					.map((object) =>
						object.definition.kind === "animation"
							? {
									...object,
									definition: {
										...object.definition,
										steps: object.definition.steps
											.map((step) =>
												Array.isArray(step)
													? step.filter((id) => !removed.has(id))
													: removed.has(step)
														? []
														: step,
											)
											.filter(
												(step) => !Array.isArray(step) || step.length > 0,
											),
									},
								}
							: object,
					),
			),
		);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-graph-geometry-style", style);
		if (!this.initialized) {
			const source =
				this.querySelector('script[type="tp/geometry"]')?.textContent ??
				this.textContent ??
				"";
			try {
				this.objects = parseGeometry(
					this.src.trim() ? "" : source.trim() || MEDIATRIX_CONSTRUCTION,
				);
				if (!this.src.trim()) {
					const sourceLabel = geometrySourceLabel(source);
					if (sourceLabel !== undefined) this.label = sourceLabel;
				}
				this.initialized = true;
			} catch (error) {
				this.innerHTML = `<p role="alert">${escapeHtml(String(error))}</p>`;
				this.dispatchEvent(
					new CustomEvent("tp-geometry-error", {
						bubbles: true,
						detail: { message: String(error) },
					}),
				);
				return;
			}
		}
		this.render();
		this.recompute();
		this.syncSource();
		this.fitView();
		void this.loadSource();
	}
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) return;
		if (name === "label") {
			const title = this.querySelector<HTMLElement>("[data-figure-title]");
			if (title) {
				title.textContent = this.label;
				title.hidden = !this.label;
			}
			const editor = this.querySelector<TpCodeEditor>("tp-code-editor");
			if (editor) {
				try {
					editor.setValue(withGeometryLabel(editor.getValue(), this.label));
				} catch {
					/* Keep incomplete metadata editable until Play validates it. */
				}
			}
			return;
		}
		if (name === "src") {
			this.sourceSaveTarget = null;
			if (this.isConnected && this.initialized) void this.loadSource();
			return;
		}
		if (name === "grid") {
			if (this.isConnected) this.draw();
			return;
		}
		if (this.isConnected && this.initialized) {
			this.drag = null;
			this.pan = null;
			this.pending = [];
			this.polygonDraft = [];
			this.tool = "move";
			this.render();
			this.recompute();
			this.syncSource();
		}
	}
	/** @internal */
	public disconnectedCallback(): void {
		for (const viewport of this.paletteViewports) {
			viewport.removeEventListener("resize", this.constrainPalette);
			viewport.removeEventListener("scroll", this.constrainPalette, true);
		}
		this.paletteViewports.clear();
		window.removeEventListener("resize", this.constrainPalette);
		window.removeEventListener("scroll", this.constrainPalette, true);
		this.localFileRequest?.abort();
		this.canvasObserver?.disconnect();
		this.canvasObserver = null;
		this.sourceRequest?.abort();
		this.sourceRequest = null;
		this.drag = null;
		this.pan = null;
	}
	private async loadSource(): Promise<void> {
		this.sourceRequest?.abort();
		this.sourceRequest = null;
		const src = this.src.trim();
		if (!src) {
			this.report("");
			return;
		}
		const request = new AbortController();
		this.sourceRequest = request;
		this.report("Loading construction…");
		try {
			const response = await fetch(new URL(src, this.baseURI).href, {
				signal: request.signal,
			});
			if (!response.ok)
				throw new Error(`Cannot load construction: HTTP ${response.status}`);
			const source = await response.text();
			if (this.sourceRequest !== request || !this.isConnected) return;
			this.setConstruction(source);
			this.fitView();
			this.report("Construction loaded.");
		} catch (error) {
			if (this.sourceRequest !== request || request.signal.aborted) return;
			const message = String(error);
			this.report(message);
			this.dispatchEvent(
				new CustomEvent("tp-geometry-error", {
					bubbles: true,
					detail: { message },
				}),
			);
		} finally {
			if (this.sourceRequest === request) this.sourceRequest = null;
		}
	}

	private restore(source: string): void {
		this.objects = parseGeometry(source);
		this.animationStep = 0;
		this.label = geometrySourceLabel(source) ?? "";
		this.pending = [];
		this.polygonDraft = [];
		this.selected = null;
		this.movingName = false;
		this.recompute();
		this.syncSource();
		this.changed();
	}
	private recompute(): void {
		this.result = evaluateGeometry(this.objects);
		this.draw();
	}
	private changed(): void {
		this.dispatchEvent(
			new CustomEvent("tp-geometry-change", {
				bubbles: true,
				detail: {
					source: this.value,
					undefined: [...this.result.errors.keys()],
				},
			}),
		);
	}
	private syncSource(source = this.value): void {
		const editor = this.querySelector<TpCodeEditor>("tp-code-editor");
		if (editor) editor.setValue(source);
	}
	private async sourceFileAction(
		action: "load" | "save" | "save-as",
	): Promise<void> {
		if (this.sourceFileBusy || (action === "load" && this.readonly)) return;
		this.sourceFileBusy = true;
		this.syncSourceFileButtons();
		const previous = this.value;
		try {
			if (action === "load") {
				const controller = new AbortController();
				this.localFileRequest?.abort();
				this.localFileRequest = controller;
				const file = await choosePlaygroundFile(
					this,
					".txt,text/plain",
					controller.signal,
				);
				if (!file) return;
				const source = await file.text();
				if (
					controller.signal.aborted ||
					!this.isConnected ||
					this.readonly ||
					this.value !== previous
				)
					return;
				parseGeometry(source);
				this.sourceRequest?.abort();
				this.setConstruction(source);
				this.sourceSaveTarget = null;
				this.fitView();
				this.report(`Loaded ${file.name}.`);
			} else {
				let source =
					this.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ??
					this.value;
				const label = geometrySourceLabel(source) ?? this.label;
				source = withGeometryLabel(source, label);
				const slug =
					label
						.normalize("NFKD")
						.replace(/\p{M}/gu, "")
						.toLowerCase()
						.replace(/[^\p{L}\p{N}]+/gu, "-")
						.replace(/^-+|-+$/g, "") || "construction";
				const target =
					(action === "save" && this.sourceSaveTarget) ||
					(await chooseSaveTarget({
						suggestedName: `${slug}.txt`,
						description: "Geometry construction",
						mimeType: "text/plain",
						extension: ".txt",
					}));
				if (!target || !this.isConnected) return;
				await saveBlob(
					new Blob([source], { type: "text/plain;charset=utf-8" }),
					target,
				);
				this.sourceSaveTarget = target;
				this.report(`Saved ${target.filename}.`);
			}
		} catch (error) {
			this.report(
				`Unable to ${action === "load" ? "load" : "save"} construction: ${String(error)}`,
			);
		} finally {
			this.sourceFileBusy = false;
			this.syncSourceFileButtons();
		}
	}
	private syncSourceFileButtons(): void {
		for (const item of this.querySelectorAll<HTMLElement>(
			"[data-source-file]",
		)) {
			const disabled =
				this.sourceFileBusy ||
				(this.readonly && item.dataset.sourceFile === "load");
			item.toggleAttribute("disabled", disabled);
			item.setAttribute("aria-disabled", String(disabled));
		}
		this.syncButtonControls();
	}
	private field(name: string): string {
		return (
			this.querySelector<TpTextfield>(`[data-field="${name}"]`)?.value ?? ""
		);
	}
	private report(message: string): void {
		const status = this.querySelector("[data-status]");
		if (status) status.textContent = message;
	}
	private readonly onExportError = (event: Event): void => {
		this.report(
			`Image export failed: ${String((event as CustomEvent<{ error: unknown }>).detail.error)}`,
		);
	};
	private changeAppearance(stroke?: string, color?: string): void {
		if (this.readonly || !this.selected) return;
		const id = this.selected;
		const next = parseGeometry(this.value);
		const object = next.find((item) => item.id === id);
		if (!object) return;
		if (
			stroke !== undefined &&
			(GEOMETRY_STYLES as readonly string[]).includes(stroke)
		) {
			object.hidden = stroke === "hidden";
			if (stroke !== "hidden") object.stroke = stroke as GeometryStroke;
		}
		if (color !== undefined && (!color || GEOMETRY_COLORS.includes(color))) {
			if (color) object.color = color;
			else delete object.color;
		}
		this.setConstruction(serializeGeometry(next));
		this.selected = id;
		this.draw();
	}
	/** Exports the current view as a standalone SVG, with resolved colors and no editing controls. */
	public exportSvg(): string {
		const canvas = this.querySelector<SVGSVGElement>(
			"svg[data-geometry-canvas]",
		);
		if (!canvas) throw new Error("The construction is not ready.");
		const clone = canvas.cloneNode(true) as SVGSVGElement;
		clone
			.querySelectorAll(".shape-hit, .point-hit, [data-polygon-preview]")
			.forEach((element) => {
				element.remove();
			});
		clone.querySelectorAll(".is-selected").forEach((element) => {
			element.classList.remove("is-selected");
		});
		clone.style.cssText =
			"position:fixed;left:-10000px;visibility:hidden;pointer-events:none";
		(canvas.parentElement ?? this).append(clone);
		try {
			const properties = [
				"fill",
				"fill-opacity",
				"stroke",
				"stroke-width",
				"stroke-opacity",
				"stroke-dasharray",
				"stroke-linecap",
				"stroke-linejoin",
				"font-family",
				"font-size",
				"font-weight",
				"paint-order",
				"opacity",
			];
			for (const element of clone.querySelectorAll<SVGElement>("*")) {
				const computed = getComputedStyle(element);
				const values = properties.map((name) => [
					name,
					computed.getPropertyValue(name),
				]);
				for (const [name, value] of values)
					if (name && value) element.style.setProperty(name, value);
			}
			const background = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"rect",
			);
			background.setAttribute("width", "900");
			background.setAttribute("height", String(this.canvasHeight));
			background.setAttribute(
				"fill",
				getComputedStyle(canvas.parentElement ?? this).backgroundColor,
			);
			clone.prepend(background);
			for (const element of [clone, ...clone.querySelectorAll("*")]) {
				for (const attribute of [...element.attributes])
					if (
						attribute.name.startsWith("data-") ||
						attribute.name.startsWith("aria-") ||
						["class", "tabindex", "role", "id"].includes(attribute.name)
					)
						element.removeAttribute(attribute.name);
			}
			clone.removeAttribute("style");
			clone.setAttributeNS(
				"http://www.w3.org/2000/xmlns/",
				"xmlns",
				"http://www.w3.org/2000/svg",
			);
			clone.setAttribute("width", "900");
			clone.setAttribute("height", String(this.canvasHeight));
			return new XMLSerializer().serializeToString(clone);
		} finally {
			clone.remove();
		}
	}
	private name(prefix: string): string {
		let i = 1;
		let id = prefix;
		while ([...this.objects, ...this.polygonDraft].some((o) => o.id === id))
			id = `${prefix}${i++}`;
		return id;
	}
	private pointName(): string {
		return (
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
				.split("")
				.find(
					(id) =>
						![...this.objects, ...this.polygonDraft].some((o) => o.id === id),
				) ?? this.name("P")
		);
	}
	private appendConstruction(commands: string): void {
		this.setConstruction(`${this.value}\n${commands}`);
	}

	private toolGroups(): Tool[][] {
		return [...TOOL_GROUPS, ...(this.builtIn ? BUILT_IN_TOOL_GROUPS : [])];
	}
	private readonly paletteViewports = new Set<Window>();
	private readonly constrainPalette = (): void => {
		queueMicrotask(() => {
			const palette = this.querySelector<TpDropdown>("[data-tool-palette]");
			if (!palette?.open) return;
			let available = window.innerHeight - palette.getBoundingClientRect().top;
			let top = palette.getBoundingClientRect().top;
			let scale = 1;
			let viewport: Window = window;
			// Documentation previews may be taller than the visible parent viewport.
			try {
				while (viewport !== viewport.parent) {
					const frame = viewport.frameElement;
					if (!frame) break;
					const rect = frame.getBoundingClientRect();
					const factor =
						rect.height / Math.max(1, (frame as HTMLElement).offsetHeight);
					top = rect.top + top * factor;
					scale *= factor;
					viewport = viewport.parent;
					available = Math.min(available, (viewport.innerHeight - top) / scale);
					if (!this.paletteViewports.has(viewport)) {
						viewport.addEventListener("resize", this.constrainPalette);
						viewport.addEventListener("scroll", this.constrainPalette, true);
						this.paletteViewports.add(viewport);
					}
				}
			} catch {
				/* Cross-origin parents retain the local viewport constraint. */
			}
			const height = Math.max(
				48,
				Math.min(512, window.innerHeight * 0.65, available - 8),
			);
			palette.style.setProperty("--tp-geometry-palette-height", `${height}px`);
		});
	};
	private toolButton(id: string, label: string): string {
		const key = GEOMETRY_SHORTCUTS[id];
		return `<tp-icon-button library="geometry" name="${id}" label="${label}" title="${label} (${key})" aria-keyshortcuts="${key}" data-geometry-control data-tool="${id}" aria-pressed="${id === this.tool}"></tp-icon-button>`;
	}
	private actionButton(id: string, label: string, key: string): string {
		const sharedIcons: Record<string, string> = {
			palette: "keyboard-outline",
			zoom: "zoom-out",
			in: "plus",
			out: "minus",
			undo: "undo",
			redo: "redo",
		};
		const name = sharedIcons[id] ?? id;
		const library = id in sharedIcons ? "tp" : "geometry";
		return `<tp-icon-button id="${this.controlId}-${id}" library="${library}" name="${name}" label="${label}" title="${label} (${key})" aria-keyshortcuts="${key}" data-geometry-control data-action="${id}"></tp-icon-button>`;
	}
	private chooseTool(tool: Tool, focusCanvas = true): void {
		this.movingName = false;
		if (this.readonly && tool !== "pan") return;
		if (!(tool in TOOLS) && !this.builtIn) return;
		this.tool = tool;
		this.pending = [];
		this.polygonDraft = [];
		this.updateTool();
		if (focusCanvas)
			this.querySelector<SVGElement>("[data-geometry-canvas]")?.focus();
	}
	private shortcut(event: KeyboardEvent): void {
		const target = event.target;
		if (
			!(target instanceof Element) ||
			target.closest(
				'input, textarea, select, [contenteditable="true"], tp-code-editor, tp-dropdown, tp-theme',
			)
		)
			return;
		if (event.defaultPrevented || event.altKey) return;
		const key = event.key.toLowerCase();
		if (key === "f1" && target.closest(".tp-geometry-source")) {
			event.preventDefault();
			this.querySelector<HTMLElement>(
				'[data-action="source-toolbar"]',
			)?.click();
			return;
		}
		let action: string | undefined;
		if (event.ctrlKey || event.metaKey) {
			if (key === "z") action = event.shiftKey ? "redo" : "undo";
			else return;
		} else {
			const tool = Object.entries(GEOMETRY_SHORTCUTS).find(
				([, shortcut]) =>
					shortcut.toLowerCase() === `${event.shiftKey ? "shift+" : ""}${key}`,
			)?.[0];
			if (tool) {
				event.preventDefault();
				this.chooseTool(tool as Tool);
				return;
			}
			action = (
				{
					delete: "delete",
					f1: "palette",
					z: "zoom",
					f: "fit",
					g: "grid",
					"+": "in",
					"=": "in",
					"-": "out",
				} as Record<string, string>
			)[key];
		}
		if (action) {
			event.preventDefault();
			this.querySelector<HTMLElement>(`[data-action="${action}"]`)?.click();
		}
	}
	private toggleSourceView(): void {
		const board = this.querySelector(".tp-geometry-board");
		if (!board) return;
		const open = board.toggleAttribute("data-source-open");
		if (open && this.canvasOnly) this.objectsPanelVisible = false;
		this.syncPanelViews();
	}

	/** Updates visibility in place so editor text, selection and drawing survive switching. */
	private syncPanelViews(): void {
		const board = this.querySelector(".tp-geometry-board");
		const sourceOpen = board?.hasAttribute("data-source-open") ?? false;
		const objectsOpen = this.objectsPanelVisible ?? !this.canvasOnly;
		board?.toggleAttribute("data-objects-open", this.canvasOnly && objectsOpen);
		this.querySelector(".tp-geometry-workspace")?.toggleAttribute(
			"data-objects-hidden",
			this.canvasOnly || !objectsOpen,
		);
		const objects = this.querySelector<HTMLElement>(
			`#${this.controlId}-objects`,
		);
		if (objects) objects.hidden = !objectsOpen;
		const canvas = this.querySelector<HTMLElement>(".tp-geometry-canvas");
		if (canvas) canvas.hidden = this.canvasOnly && (sourceOpen || objectsOpen);
		const source = this.querySelector<HTMLElement>(".tp-geometry-source");
		if (source) source.hidden = !sourceOpen;
		const button = this.querySelector('[data-action="source-view"]');
		const label = sourceOpen
			? this.canvasOnly
				? "Show drawing"
				: "Hide construction source"
			: "Show construction source";
		button?.setAttribute("aria-pressed", String(sourceOpen));
		button?.setAttribute("label", label);
		button?.setAttribute("title", label);
		const toggle = this.querySelector('[data-action="objects-panel"]');
		toggle?.setAttribute("aria-expanded", String(objectsOpen));
		toggle
			?.querySelector("button")
			?.setAttribute("aria-expanded", String(objectsOpen));
		this.syncButtonControls();
	}
	private toggleZoom(): void {
		const dialog = this.querySelector<HTMLDialogElement>(".tp-geometry-dialog");
		const board = this.querySelector(".tp-geometry-board");
		if (!dialog || !board) return;
		if (dialog.open) {
			dialog.close();
			return;
		}
		dialog.append(board);
		dialog.showModal();
		const button = this.querySelector('[data-action="zoom"]');
		button?.setAttribute("name", "zoom-in");
		button?.setAttribute("label", "Close zoomed drawing");
		button?.setAttribute("title", "Close zoomed drawing (Z / Escape)");
		this.querySelector<SVGElement>("[data-geometry-canvas]")?.focus();
	}
	private restoreBoard(): void {
		const board = this.querySelector(".tp-geometry-board");
		if (board) this.querySelector(".tp-geometry-workspace")?.prepend(board);
		const button = this.querySelector<HTMLElement>('[data-action="zoom"]');
		button?.setAttribute("name", "zoom-out");
		button?.setAttribute("label", "Zoom drawing");
		button?.setAttribute("title", "Zoom drawing (Z)");
		button?.querySelector("button")?.focus();
	}
	private render(): void {
		const themeMode =
			this.querySelector(".tp-geometry-theme")?.getAttribute("mode") ?? "auto";
		this.objectListMarkup = "";
		this.setAttribute("data-geometry-export", this.controlId);
		this.innerHTML = `<div class="tp-geometry-header" data-help-group="Construction"><div><strong>Ruler & compass</strong><span>Geometric constructions</span></div><tp-button-group><tp-button type="button" outlined data-geometry-control data-action="clear">New construction</tp-button></tp-button-group></div>
      <tp-button-group class="tp-geometry-tools" data-help-group="Drawing tools" aria-label="Construction tools">${this.toolGroups()
				.map((group) =>
					group
						.map((id) =>
							this.toolButton(id, { ...TOOLS, ...BUILT_IN_TOOLS }[id]),
						)
						.join(""),
				)
				.join(
					'<tp-divider orientation="vertical"></tp-divider>',
				)}</tp-button-group>
      <div class="tp-geometry-parameters"><tp-textfield data-field="radius" label="Radius / length" value="5"></tp-textfield><tp-textfield data-field="start" label="Start angle (°)" value="20"></tp-textfield><tp-textfield data-field="end" label="End angle (°)" value="100"></tp-textfield><tp-textfield data-field="comment" label="Comment text" value="Comment"></tp-textfield>${this.builtIn ? `<tp-radio-list data-transform-mode label="Transformation" label-position="top" orientation="horizontal" value="1"><ul><li>Create a copy</li><li>Transform the object</li></ul></tp-radio-list><tp-textfield data-field="ratio" label="Ratio" value="2"></tp-textfield><tp-textfield data-field="rotation" label="Rotation angle (°)" value="90"></tp-textfield><tp-textfield data-field="sides" label="Sides" value="5" ${this.readonly ? "readonly" : ""}></tp-textfield><tp-button outlined data-geometry-control data-action="finish-polygon">Finish polygon</tp-button>` : ""}<span>Angles turn counterclockwise.</span></div>
      <tp-callout class="tp-geometry-hint" variant="info" outlined heading="${escapeHtml({ ...TOOLS, ...BUILT_IN_TOOLS }[this.tool])}" icon="${this.tool}" library="geometry"><span data-hint>${HINTS[this.tool]}</span></tp-callout>
      <div class="tp-geometry-workspace" ${(this.objectsPanelVisible ?? !this.canvasOnly) ? "" : "data-objects-hidden"}><div class="tp-geometry-board"><div class="tp-geometry-board-heading"><strong data-figure-title ${this.label ? "" : "hidden"}>${escapeHtml(this.label)}</strong><div class="tp-geometry-board-actions" data-help-group="Drawing controls — top right">${this.actionButton("palette", "Actions", "F1")}<tp-save-image anchor='[data-geometry-export="${this.controlId}"]' filename="geometry"></tp-save-image><tp-theme class="tp-geometry-theme" mode="${themeMode === "light" || themeMode === "dark" ? themeMode : "auto"}" anchor='[data-geometry-export="${this.controlId}"]'></tp-theme>${this.actionButton("zoom", "Zoom drawing", "Z")}</div></div><tp-dropdown data-tool-palette anchor="#${this.controlId}-palette" outside-click><ul>${this.toolGroups()
				.map((group) =>
					group
						.map(
							(id) =>
								`<li data-palette-tool="${id}" ${this.readonly && id !== "pan" ? 'aria-disabled="true"' : ""}><tp-icon library="geometry" name="${id}"></tp-icon><span>${{ ...TOOLS, ...BUILT_IN_TOOLS }[id]}</span><kbd>${GEOMETRY_SHORTCUTS[id]}</kbd></li>`,
						)
						.join(""),
				)
				.join(
					'<tp-divider orientation="horizontal"></tp-divider>',
				)}</ul></tp-dropdown><div class="tp-geometry-context"></div><div data-animation-controls data-help-group="Animation" role="group" aria-label="Step-by-step construction" hidden></div><div class="tp-geometry-canvas"><svg data-geometry-canvas viewBox="0 0 900 ${this.canvasHeight}" role="group" aria-label="Geometric construction. Drag empty space or scroll to pan. In Pan view, arrow keys move the view." tabindex="0"><g data-grid aria-hidden="true"></g><g data-drawing></g></svg></div><div class="tp-geometry-view" data-help-group="View controls — bottom right"><tp-icon-button library="tp" name="code" label="Show construction source" title="Show construction source" aria-pressed="false" data-geometry-control data-action="source-view"></tp-icon-button>${this.actionButton("undo", "Undo", "Ctrl+Z")}${this.actionButton("redo", "Redo", "Ctrl+Shift+Z")}${this.actionButton("out", "Zoom out", "-")}${this.actionButton("in", "Zoom in", "+")}${this.actionButton("fit", "Fit", "F")}${this.actionButton("grid", "Grid", "G")}<tp-icon-button library="tp" name="splitscreen-right" label="Construction objects" title="Construction objects" data-geometry-control data-action="objects-panel" aria-controls="${this.controlId}-objects" aria-expanded="${this.objectsPanelVisible ?? !this.canvasOnly}"></tp-icon-button></div></div>
      <aside id="${this.controlId}-objects" ${(this.objectsPanelVisible ?? !this.canvasOnly) ? "" : "hidden"} data-help-group="Construction objects"><h3>Construction objects</h3><p data-appearance-label>Select an object in Move mode to change its appearance.</p><div class="tp-geometry-appearance"><tp-button id="${this.controlId}-style" outlined data-geometry-control data-action="style-menu" aria-haspopup="menu"><span data-style-label>Style · solid</span></tp-button><tp-dropdown anchor="#${this.controlId}-style" outside-click data-style-menu><ul>${GEOMETRY_STYLES.map((value) => `<li data-stroke="${value}">${value}${value === "solid" ? " (default)" : ""}</li>`).join("")}</ul></tp-dropdown><tp-button id="${this.controlId}-color" outlined data-geometry-control data-action="color-menu" aria-haspopup="menu"><span data-color-label>Color · automatic</span></tp-button><tp-dropdown anchor="#${this.controlId}-color" outside-click data-color-menu><ul><li data-color="">Automatic</li>${GEOMETRY_COLORS.map((value) => `<li data-color="${value}"><span class="tp-geometry-swatch tp-${value}" aria-hidden="true"></span>${value}</li>`).join("")}</ul></tp-dropdown></div><div class="tp-geometry-object-editor"><tp-textfield data-object-name label="Object name"></tp-textfield><tp-button outlined data-geometry-control data-action="rename">Rename</tp-button><tp-button outlined data-geometry-control data-action="move-name" aria-pressed="false">Move name</tp-button><tp-button outlined data-geometry-control data-action="hide-name" aria-pressed="false">Hide name</tp-button><p>Drag a name in the drawing, or enable Move name and use the arrow keys.</p></div><div data-objects data-help-ignore></div><tp-button type="button" outlined data-geometry-control data-action="delete">Delete selected + dependents</tp-button><p>Free points move freely. Attached points slide on their support. Constructed points are calculated.</p></aside></div>
      <p data-status role="status" aria-live="polite"></p><section class="tp-geometry-source" aria-label="Construction source" data-help-group="Construction source"><div class="tp-geometry-source-toolbar"><div><tp-icon-button id="${this.controlId}-source-files" name="file-outline" label="Construction files (.txt)" title="Construction files (.txt)" aria-haspopup="menu" data-geometry-control data-action="source-files"></tp-icon-button><tp-dropdown anchor="#${this.controlId}-source-files" outside-click data-source-menu><ul><li data-source-file="load">Load (.txt)</li><li data-source-file="save">Save (.txt)</li><li data-source-file="save-as">Save as (.txt)</li></ul></tp-dropdown></div><div class="tp-geometry-source-actions"><tp-icon-button library="tp" name="keyboard-f1" label="F1 — Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-geometry-control data-action="source-toolbar"></tp-icon-button><tp-icon-button name="refresh" label="Reset source" title="Reset source to the displayed construction" data-geometry-control data-action="source-reset"></tp-icon-button><tp-icon-button name="play" label="Play" title="Play — Apply construction source" data-geometry-control data-action="apply"></tp-icon-button></div></div><tp-code-editor language="text" line-numbers ${this.readonly ? "readonly" : ""}></tp-code-editor></section><dialog class="tp-geometry-dialog" aria-label="Zoomed drawing"></dialog>`;

		// Keep legend descriptions concise and independent of tooltip/shortcut wording.
		const descriptions: Record<string, string> = {
			palette: "Palette of controls.",
			zoom: "Enlarge/restore the drawing.",
			undo: "Revert the last change.",
			redo: "Restore the last undone change.",
			in: "Increase the drawing scale.",
			out: "Decrease the drawing scale.",
			fit: "Fit the construction in the drawing area.",
			grid: "Hide/show the grid.",
			"objects-panel": "Hide/show construction objects.",
			clear: "Start an empty construction.",
			"source-view":
				"Show/hide the source below the drawing, or replace the drawing in canvas-only mode.",
			"style-menu": "Choose the selected object’s line style.",
			"color-menu": "Choose the selected object’s color.",
			rename: "Apply the edited object name.",
			"move-name": "Reposition the selected object’s label.",
			"hide-name": "Hide/show the selected object’s name.",
			delete: "Remove the selection and its dependent objects.",
			"source-files": "Load or save a construction file.",
			"source-toolbar": "Hide/show the editor toolbar.",
			"source-reset": "Restore the source of the displayed construction.",
			apply: "Apply the edited construction source.",
			"finish-polygon": "Close the polygon through its selected vertices.",
		};
		for (const control of this.querySelectorAll<HTMLElement>("[data-action]")) {
			const action = control.dataset.action ?? "";
			if (descriptions[action])
				control.dataset.helpDescription = descriptions[action];
			if (action === "undo" || action === "redo")
				control.dataset.helpGroup = "History — bottom right";
		}
		const toolDescriptions: Record<string, string> = {
			move: "Move points, names or comments.",
			pan: "Move the entire view.",
			point: "Create a point.",
			on: "Attach a point to an existing object.",
			intersection: "Create the intersections of two objects.",
			line: "Draw a line through two points.",
			segment: "Join two points.",
			fixedSegment: "Draw a segment of the specified length.",
			ray: "Draw from an origin in a specified direction.",
			vector: "Draw a directed segment.",
			sector: "Fill part of a circle between two radii.",
			circle: "Draw a circle with the specified radius.",
			through: "Draw a circle through a point.",
			arc: "Draw part of a circle.",
			length: "Display a distance, length or perimeter.",
			area: "Display an enclosed area.",
			angle: "Display the angle between two sides.",
			comment: "Add a text annotation.",
		};
		for (const control of this.querySelectorAll<HTMLElement>("[data-tool]")) {
			const tool = control.dataset.tool as Tool;
			control.dataset.helpDescription =
				toolDescriptions[tool] ?? HINTS[tool]?.split(/(?<=[.!?])\s/)[0] ?? "";
		}

		const source = this.querySelector(".tp-geometry-source");
		const footer = this.querySelector(".tp-geometry-view");
		if (source && footer) {
			if (this.canvasOnly) footer.before(source);
			else footer.after(source);
		}
		if (this.canvasOnly) {
			const objects = this.querySelector(`#${this.controlId}-objects`);
			if (objects && footer) footer.before(objects);
		}
		this.syncPanelViews();
		const context = this.querySelector(".tp-geometry-context");
		for (const selector of [".tp-geometry-hint", ".tp-geometry-parameters"]) {
			const node = this.querySelector(selector);
			if (node && context) context.append(node);
		}
		this.querySelector<HTMLDialogElement>(
			".tp-geometry-dialog",
		)?.addEventListener("close", () => this.restoreBoard());
		for (const item of this.querySelectorAll<HTMLElement>(
			"[data-palette-tool]",
		)) {
			const choose = () => {
				if (item.getAttribute("aria-disabled") === "true") return;
				this.chooseTool(item.dataset.paletteTool as Tool);
				this.querySelector<TpDropdown>("[data-tool-palette]")?.hide();
			};
			item.addEventListener("click", choose);
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					choose();
				}
			});
		}
		this.querySelector("[data-tool-palette]")?.addEventListener(
			"tp-dropdown-toggle",
			this.constrainPalette,
		);
		window.addEventListener("resize", this.constrainPalette);
		window.addEventListener("scroll", this.constrainPalette, true);
		this.onkeydown = (event) => this.shortcut(event);
		this.canvasObserver?.disconnect();
		const canvas = this.querySelector<HTMLElement>(".tp-geometry-canvas");
		if (canvas && typeof ResizeObserver !== "undefined") {
			this.canvasObserver = new ResizeObserver(() => {
				const rect = canvas.getBoundingClientRect();
				if (rect.width <= 0 || rect.height <= 0) return;
				const height = (900 * rect.height) / rect.width;
				if (Math.abs(height - this.canvasHeight) < 0.01) return;
				this.canvasHeight = height;
				this.querySelector("svg[data-geometry-canvas]")?.setAttribute(
					"viewBox",
					`0 0 900 ${height}`,
				);
				this.draw();
			});
			this.canvasObserver.observe(canvas);
		}
		if (this.readonly)
			for (const button of this.querySelectorAll<TpButton>(
				'[data-tool]:not([data-tool="pan"]), [data-action="example"], [data-action="clear"], [data-action="delete"], [data-action="apply"]',
			))
				button.disabled = true;
		this.querySelector(".tp-geometry-parameters")?.toggleAttribute(
			"hidden",
			this.readonly,
		);
		this.dataset.activeTool = this.tool;
		this.updateParameters();
		this.syncSourceFileButtons();
		this.addEventListener("tp-save-image-error", this.onExportError);
		for (const kind of ["style", "color"])
			this.querySelector(`[data-${kind}-menu]`)?.addEventListener(
				"tp-dropdown-toggle",
				() => {
					this.querySelector(`[data-action="${kind}-menu"]`)?.setAttribute(
						"aria-expanded",
						String(
							this.querySelector(`[data-${kind}-menu]`)?.hasAttribute("open"),
						),
					);
					this.syncButtonControls();
				},
			);
		for (const item of this.querySelectorAll<HTMLElement>(
			"[data-stroke], [data-color]",
		))
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					this.changeAppearance(item.dataset.stroke, item.dataset.color);
				}
			});
		for (const item of this.querySelectorAll<HTMLElement>(
			"[data-source-file]",
		)) {
			const activate = () => {
				if (item.getAttribute("aria-disabled") === "true") return;
				void this.sourceFileAction(
					item.dataset.sourceFile as "load" | "save" | "save-as",
				);
			};
			item.addEventListener("click", activate);
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					activate();
				}
			});
		}
		this.onclick = (event) => {
			const choice = (event.target as Element).closest<HTMLElement>(
				"[data-stroke], [data-color]",
			);
			if (choice && this.contains(choice)) {
				this.changeAppearance(choice.dataset.stroke, choice.dataset.color);
				return;
			}
			const button = (event.target as Element).closest<TpButton>(
				"tp-button[data-geometry-control], tp-icon-button[data-geometry-control]",
			);
			if (!button || button.disabled) return;

			if (
				button.dataset.tool &&
				(!this.readonly || button.dataset.tool === "pan")
			) {
				// Keep keyboard focus in the tool strip so Tab can reach the next tool.
				this.chooseTool(button.dataset.tool as Tool, false);
			}
			if (button.dataset.object) this.selectObject(button.dataset.object);
			const action = button.dataset.action;
			if (button.dataset.animation) {
				this.activeAnimation = button.dataset.animation;
				this.animationStep = 0;
				this.draw();
			}
			if (action?.startsWith("animation-")) {
				const animation = this.currentAnimation();
				if (animation?.definition.kind === "animation") {
					const count = animation.definition.steps.length;
					this.animationStep =
						action === "animation-start"
							? 0
							: action === "animation-end"
								? count
								: Math.max(
										0,
										Math.min(
											count,
											this.animationStep +
												(action === "animation-next" ? 1 : -1),
										),
									);
					this.querySelector("[data-inline-rename]")?.remove();
					this.draw();
				}
			}
			if (action === "rename" && !this.readonly && this.selected) {
				try {
					const name =
						this.querySelector<TpTextfield>(
							"[data-object-name]",
						)?.value.trim() ?? "";
					this.renameObject(this.selected, name);
				} catch (error) {
					this.report(String(error));
				}
			}
			if (action === "hide-name" && !this.readonly && this.selected) {
				const id = this.selected;
				const next = parseGeometry(this.value);
				const object = next.find((item) => item.id === id);
				if (object) {
					if (object.labelHidden) delete object.labelHidden;
					else object.labelHidden = true;
					this.setConstruction(serializeGeometry(next));
					this.selected = id;
					this.movingName = false;
					this.draw();
				}
			}
			if (action === "move-name" && !this.readonly && this.selected) {
				this.movingName = !this.movingName;
				this.tool = "move";
				this.updateTool();
				this.draw();
				this.querySelector<SVGSVGElement>("[data-geometry-canvas]")?.focus();
			}
			if (action === "source-view") this.toggleSourceView();
			if (action === "source-files")
				this.querySelector<TpDropdown>("[data-source-menu]")?.toggle();
			if (action === "source-toolbar") {
				const editor = this.querySelector<TpCodeEditor>("tp-code-editor");
				if (editor) editor.toolbar = !editor.toolbar;
			}
			if (action === "source-reset")
				this.querySelector<TpCodeEditor>("tp-code-editor")?.setValue(
					this.value,
				);

			if (action === "palette")
				this.querySelector<TpDropdown>("[data-tool-palette]")?.toggle();
			if (action === "zoom") this.toggleZoom();
			if (action === "style-menu" || action === "color-menu") {
				this.querySelector<TpDropdown>(
					action === "style-menu" ? "[data-style-menu]" : "[data-color-menu]",
				)?.toggle();
			}
			if (action === "in" || action === "out") {
				this.scale = Math.max(
					3,
					Math.min(300, this.scale * (action === "in" ? 1.25 : 0.8)),
				);
				this.draw();
			}
			if (action === "fit") this.fitView();
			if (action === "grid") this.grid = !this.grid;
			if (action === "objects-panel") {
				this.objectsPanelVisible = !(
					this.objectsPanelVisible ?? !this.canvasOnly
				);
				if (this.canvasOnly && this.objectsPanelVisible) {
					this.querySelector(".tp-geometry-board")?.removeAttribute(
						"data-source-open",
					);
				}
				this.syncPanelViews();
			}
			if (this.readonly) return;
			try {
				if (action === "undo") this.undo();
				if (action === "redo") this.redo();
				if (action === "delete" && this.selected)
					this.removeObject(this.selected);
				if (action === "example") {
					this.sourceSaveTarget = null;
					this.setConstruction(MEDIATRIX_CONSTRUCTION);
					this.fitView();
				}
				if (action === "finish-polygon") this.finishPolygon();
				if (action === "clear") {
					this.sourceSaveTarget = null;
					this.setConstruction("");
				}
				if (action === "apply") {
					this.setConstruction(
						this.querySelector<TpCodeEditor>("tp-code-editor")?.getValue() ??
							"",
					);
					this.fitView();
				}
			} catch (error) {
				this.report(String(error));
				this.dispatchEvent(
					new CustomEvent("tp-geometry-error", {
						bubbles: true,
						detail: { message: String(error) },
					}),
				);
			}
		};
		const svg = this.querySelector<SVGSVGElement>("svg[data-geometry-canvas]");
		if (!svg) return;
		svg.addEventListener("pointerdown", (event) => {
			if (this.drag || this.pan || event.button > 1) return;
			this.suppressCanvasClick = false;
			const id = (event.target as Element)
				.closest("[data-id]")
				?.getAttribute("data-id");
			this.pointerObject = id ?? null;
			if (
				event.button === 1 ||
				this.tool === "pan" ||
				(!id && this.tool === "move")
			) {
				this.pan = {
					pointer: event.pointerId,
					start: this.canvasPoint(event),
					center: { ...this.center },
				};
				this.suppressCanvasClick = true;
				svg.setPointerCapture?.(event.pointerId);
				svg.focus({ preventScroll: true });
				svg.classList.add("is-panning");
				event.preventDefault();
				return;
			}
			if (this.readonly || this.tool !== "move") return;
			const object = this.objects.find((o) => o.id === id);
			if (!object) return;
			const movingLabel =
				!!(event.target as Element).closest("[data-name-label]") ||
				(this.movingName && object.id === this.selected);
			this.selected = object.id;
			this.movingName = movingLabel;
			this.draw(true);
			if (
				object.definition.kind !== "point" &&
				object.definition.kind !== "on" &&
				object.definition.kind !== "measure" &&
				object.definition.kind !== "comment" &&
				!movingLabel
			)
				return;
			const label = this.result.values.get(object.id);
			const pointer = this.world(event);
			this.drag = {
				...(movingLabel
					? {
							grab: {
								x: this.namePosition(object).x - pointer.x,
								y: this.namePosition(object).y - pointer.y,
							},
						}
					: (object.definition.kind === "measure" ||
								object.definition.kind === "comment") &&
							label?.kind === "comment"
						? {
								grab: {
									x: label.point.x - pointer.x,
									y: label.point.y - pointer.y,
								},
							}
						: {}),
				label: movingLabel,
				id: object.id,
				before: this.value,
				pointer: event.pointerId,
			};
			svg.setPointerCapture?.(event.pointerId);
			svg.focus({ preventScroll: true });
			event.preventDefault();
		});
		svg.addEventListener("pointermove", (event) => {
			if (this.pan && event.pointerId === this.pan.pointer) {
				const p = this.canvasPoint(event);
				this.center = {
					x: this.pan.center.x - (p.x - this.pan.start.x) / this.scale,
					y: this.pan.center.y + (p.y - this.pan.start.y) / this.scale,
				};
				this.draw();
				return;
			}
			if (this.drag && event.pointerId === this.drag.pointer) {
				const p = this.world(event);
				const move = this.drag.label
					? this.moveName.bind(this)
					: this.movePoint.bind(this);
				move(this.drag.id, {
					x: p.x + (this.drag.grab?.x ?? 0),
					y: p.y + (this.drag.grab?.y ?? 0),
				});
			}
		});
		const finish = (event: PointerEvent): void => {
			if (this.pan && event.pointerId === this.pan.pointer) {
				const unchanged =
					this.center.x === this.pan.center.x &&
					this.center.y === this.pan.center.y;
				if (event.type === "pointercancel") this.center = this.pan.center;
				this.pan = null;
				svg.classList.remove("is-panning");
				this.draw(unchanged);
				return;
			}
			if (!this.drag || event.pointerId !== this.drag.pointer) return;
			const before = this.drag.before;
			this.drag = null;
			if (event.type === "pointercancel") {
				this.restore(before);
				return;
			}
			if (before !== this.value) {
				this.undoStack.push(before);
				this.redoStack = [];
				this.syncSource();
				this.changed();
				this.draw();
			}
		};
		svg.addEventListener("dblclick", (event) => {
			if (this.readonly || (this.tool !== "move" && this.tool !== "pan"))
				return;
			const id =
				(event.target as Element)
					.closest("[data-id]")
					?.getAttribute("data-id") ?? this.pointerObject;
			if (!id) return;
			event.preventDefault();
			this.editObjectName(id, this.canvasPoint(event));
		});
		svg.addEventListener("pointerup", finish);
		svg.addEventListener("pointercancel", finish);
		svg.addEventListener("click", (event) => {
			if (this.suppressCanvasClick) {
				this.suppressCanvasClick = false;
				return;
			}
			if (this.readonly || this.tool === "move" || this.tool === "pan") return;
			const id =
				(event.target as Element)
					.closest("[data-id]")
					?.getAttribute("data-id") ?? undefined;
			try {
				svg.focus({ preventScroll: true });
				this.useTool(id, this.world(event));
			} catch (error) {
				this.pending = [];
				this.polygonDraft = [];
				this.updateTool();
				this.report(String(error));
			}
		});
		svg.addEventListener(
			"wheel",
			(event) => {
				if (event.ctrlKey || event.metaKey || this.pan || this.drag) return;
				event.preventDefault();
				const rect = svg.getBoundingClientRect();
				let dx = event.deltaX;
				let dy = event.deltaY;
				if (event.shiftKey && dx === 0) {
					dx = dy;
					dy = 0;
				}
				const multiplierX =
					event.deltaMode === 1
						? 16
						: event.deltaMode === 2
							? rect.width || 900
							: 1;
				const multiplierY =
					event.deltaMode === 1
						? 16
						: event.deltaMode === 2
							? rect.height || this.canvasHeight
							: 1;
				const start = this.canvasPoint(event);
				const end = this.canvasPoint({
					clientX: event.clientX + dx * multiplierX,
					clientY: event.clientY + dy * multiplierY,
				});
				this.center.x += (end.x - start.x) / this.scale;
				this.center.y -= (end.y - start.y) / this.scale;
				this.draw();
			},
			{ passive: false },
		);
		svg.addEventListener("keydown", (event) => {
			if (event.key === "F2" && this.selected && !this.readonly) {
				event.preventDefault();
				this.editObjectName(this.selected);
				return;
			}
			if (event.key === "Enter" && this.tool === "polygon") {
				event.preventDefault();
				this.finishPolygon();
				return;
			}
			if (event.key === "Escape") {
				this.pending = [];
				this.polygonDraft = [];
				this.tool = "move";
				this.updateTool();
				return;
			}
			if (
				(this.tool === "pan" ||
					(this.canvasOnly && (!this.selected || this.readonly))) &&
				["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
			) {
				event.preventDefault();
				const step = (event.shiftKey ? 8 : 40) / this.scale;
				this.center.x +=
					event.key === "ArrowRight"
						? step
						: event.key === "ArrowLeft"
							? -step
							: 0;
				this.center.y +=
					event.key === "ArrowUp"
						? step
						: event.key === "ArrowDown"
							? -step
							: 0;
				this.draw();
				return;
			}
			if (
				this.readonly ||
				!this.selected ||
				!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
			)
				return;
			const object = this.objects.find((o) => o.id === this.selected);
			const actual = this.result.values.get(this.selected);
			const v =
				this.movingName && object
					? { kind: "point" as const, point: this.namePosition(object) }
					: actual;
			if (
				v?.kind !== "point" &&
				!(
					v?.kind === "comment" &&
					["measure", "comment"].includes(object?.definition.kind ?? "")
				)
			)
				return;
			event.preventDefault();
			const before = this.value;
			const step = event.shiftKey ? 0.02 : 0.2;
			const move = this.movingName
				? this.moveName.bind(this)
				: this.movePoint.bind(this);
			move(this.selected, {
				x:
					v.point.x +
					(event.key === "ArrowRight"
						? step
						: event.key === "ArrowLeft"
							? -step
							: 0),
				y:
					v.point.y +
					(event.key === "ArrowUp"
						? step
						: event.key === "ArrowDown"
							? -step
							: 0),
			});
			if (before !== this.value) {
				this.undoStack.push(before);
				this.redoStack = [];
				this.syncSource();
				this.changed();
				this.draw();
			}
		});
	}
	private syncButtonControls(): void {
		queueMicrotask(() => {
			if (!this.isConnected) return;
			for (const button of this.querySelectorAll<TpButton>(
				"tp-button[data-geometry-control], tp-icon-button[data-geometry-control]",
			)) {
				const native =
					button.querySelector<HTMLButtonElement>(":scope > button");
				if (!native) continue;
				// Explicitly include actions in sequential keyboard navigation.
				native.tabIndex = native.disabled ? -1 : 0;
				for (const name of [
					"aria-keyshortcuts",
					"aria-pressed",
					"aria-label",
					"aria-haspopup",
					"aria-expanded",
				]) {
					const value = button.getAttribute(name);
					if (name === "aria-label" && button.tagName === "TP-ICON-BUTTON")
						continue;
					if (value !== null) native.setAttribute(name, value);
					else native.removeAttribute(name);
				}
				const variant =
					button.getAttribute("aria-pressed") === "true" ? "brand" : "neutral";
				if (button.variant !== variant) button.variant = variant;
			}
		});
	}
	private updateParameters(): void {
		const visible: Record<string, boolean> = {
			radius: ["circle", "fixedSegment"].includes(this.tool),
			start: ["arc", "sector"].includes(this.tool),
			end: ["arc", "sector"].includes(this.tool),
			comment: this.tool === "comment",
			ratio: this.tool === "homothety",
			rotation: this.tool === "rotation",
			sides: this.tool === "regularPolygon",
		};
		for (const field of this.querySelectorAll<HTMLElement>(
			".tp-geometry-parameters [data-field]",
		))
			field.hidden = this.canvasOnly && !visible[field.dataset.field ?? ""];
		const mode = this.querySelector<HTMLElement>("[data-transform-mode]");
		if (mode)
			mode.hidden =
				this.canvasOnly &&
				![
					"axialSymmetry",
					"centralSymmetry",
					"homothety",
					"rotation",
					"translation",
				].includes(this.tool);
		const finish = this.querySelector<HTMLElement>(
			'[data-action="finish-polygon"]',
		);
		if (finish) finish.hidden = this.canvasOnly && this.tool !== "polygon";
		const note = this.querySelector<HTMLElement>(
			".tp-geometry-parameters > span",
		);
		if (note)
			note.hidden = this.canvasOnly && !["arc", "sector"].includes(this.tool);
	}
	private updateTool(): void {
		for (const button of this.querySelectorAll("[data-tool]")) {
			const active = (button as HTMLElement).dataset.tool === this.tool;
			button.setAttribute("aria-pressed", String(active));
			button.toggleAttribute("outlined", !active);
		}
		this.dataset.activeTool = this.tool;
		this.updateParameters();
		const callout = this.querySelector(".tp-geometry-hint");
		callout?.setAttribute(
			"heading",
			{ ...TOOLS, ...BUILT_IN_TOOLS }[this.tool],
		);
		callout?.setAttribute("icon", this.tool);
		const hint = this.querySelector("[data-hint]");
		if (hint) hint.textContent = HINTS[this.tool];
		this.report(
			this.pending.length
				? `Selected: ${this.pending.join(", ")}. Select the next object.`
				: "",
		);
		this.draw();
	}
	private renameObject(id: string, name: string): void {
		if (this.readonly) return;
		const next = renameGeometry(this.objects, id, name);
		if (this.activeAnimation === id) this.activeAnimation = name;
		this.setConstruction(serializeGeometry(next));
		this.selected = name;
		this.draw();
	}
	private editObjectName(id: string, position?: GeometryPoint): void {
		if (this.readonly || !this.objects.some((object) => object.id === id))
			return;
		const canvas = this.querySelector<HTMLElement>(".tp-geometry-canvas");
		if (!canvas) return;
		this.querySelector("[data-inline-rename]")?.remove();
		this.selected = id;
		this.draw();
		const panel = document.createElement("div");
		panel.setAttribute("data-inline-rename", "");
		const field = document.createElement("tp-textfield") as TpTextfield;
		field.label = "Object name";
		field.value = id;
		const hint = document.createElement("small");
		hint.textContent = "Enter to rename · Escape to cancel";
		const error = document.createElement("span");
		error.setAttribute("role", "alert");
		panel.append(field, hint, error);
		const object = this.objects.find((object) => object.id === id);
		if (!object) return;
		const name = this.namePosition(object);
		const p = position ?? {
			x: 450 + (name.x - this.center.x) * this.scale,
			y: 280 - (name.y - this.center.y) * this.scale,
		};
		panel.style.setProperty(
			"--rename-left",
			`${Math.max(0, Math.min(100, p.x / 9))}%`,
		);
		panel.style.top = `${Math.max(15, Math.min(85, (p.y / this.canvasHeight) * 100))}%`;
		const close = () => {
			panel.remove();
			this.querySelector<SVGSVGElement>("[data-geometry-canvas]")?.focus({
				preventScroll: true,
			});
		};
		panel.addEventListener("keydown", (event) => {
			event.stopPropagation();
			if (event.key === "Escape") {
				event.preventDefault();
				close();
			}
			if (event.key === "Enter") {
				event.preventDefault();
				try {
					this.renameObject(id, field.value.trim());
					close();
				} catch (reason) {
					error.textContent =
						reason instanceof Error ? reason.message : String(reason);
					field.focus();
				}
			}
		});
		panel.addEventListener("focusout", () => {
			queueMicrotask(() => {
				if (panel.isConnected && !panel.contains(document.activeElement))
					panel.remove();
			});
		});
		canvas.append(panel);
		field.focus({ preventScroll: true });
		field.select();
	}
	private selectObject(id: string): void {
		if (
			this.objects.find((object) => object.id === id)?.definition.kind ===
			"animation"
		) {
			this.activeAnimation = id;
			this.animationStep = 0;
			this.selected = id;
			this.draw();
			return;
		}
		if (this.tool === "move" || this.tool === "pan" || this.readonly) {
			this.selected = id;
			this.movingName = false;
			this.draw();
			this.querySelector<SVGSVGElement>("svg[data-geometry-canvas]")?.focus();
			return;
		}
		const value = this.result.values.get(id);
		const p =
			value?.kind === "point"
				? value.point
				: value?.kind === "circle" ||
						value?.kind === "arc" ||
						value?.kind === "sector"
					? { x: value.center.x + value.radius, y: value.center.y }
					: value && isLinear(value)
						? value.first
						: { x: 0, y: 0 };
		try {
			this.useTool(id, p);
		} catch (error) {
			this.pending = [];
			this.polygonDraft = [];
			this.updateTool();
			this.report(String(error));
		}
	}
	private finishPolygon(): void {
		if (
			this.readonly ||
			!this.builtIn ||
			this.tool !== "polygon" ||
			this.pending.length < 3
		)
			return;
		const commands = serializeGeometry(this.polygonDraft);
		this.appendConstruction(
			`${commands}\npolygon ${this.name("poly")} = polygon(${this.pending.join(", ")})`,
		);
		this.updateTool();
	}
	private polygonClick(id: string | undefined, p: GeometryPoint): void {
		if (!this.builtIn || this.readonly) return;
		const sides = Number(this.field("sides"));
		if (
			this.tool === "regularPolygon" &&
			(!Number.isInteger(sides) || sides < 3 || sides > 360)
		)
			throw new Error("Sides must be an integer from 3 to 360.");
		if (id && this.pending.includes(id)) {
			if (
				this.tool === "polygon" &&
				id === this.pending[0] &&
				this.pending.length >= 3
			)
				this.finishPolygon();
			else
				this.report(
					"Select a different vertex; closing needs at least three vertices.",
				);
			return;
		}
		if (id) {
			if (this.result.values.get(id)?.kind !== "point")
				throw new Error("Select a point or click empty space.");
		} else {
			id = this.pointName();
			this.polygonDraft.push({
				id,
				hidden: false,
				definition: { kind: "point", x: p.x, y: p.y },
			});
		}
		this.pending.push(id);
		if (this.tool === "regularPolygon" && this.pending.length === 2) {
			const commands = serializeGeometry(this.polygonDraft);
			this.appendConstruction(
				`${commands}\npolygon ${this.name("poly")} = regularPolygon(${this.pending.join(", ")}, sides=${sides})`,
			);
		}
		this.updateTool();
	}
	private useTool(id: string | undefined, p: GeometryPoint): void {
		if (this.tool === "polygon" || this.tool === "regularPolygon") {
			this.polygonClick(id, p);
			return;
		}
		const value = id ? this.result.values.get(id) : null;
		if (this.tool === "point") {
			this.appendConstruction(`point ${this.pointName()} = (${p.x}, ${p.y})`);
			return;
		}
		if (this.tool === "comment") {
			this.appendConstruction(
				`comment ${this.name("note")} = comment(${value?.kind === "point" ? id : `(${p.x}, ${p.y})`}, ${JSON.stringify(this.field("comment"))})`,
			);
			return;
		}
		if (!id || !value) throw new Error("Select an existing, defined object.");
		if (
			GEOMETRY_TRANSFORMATIONS.includes(this.tool as GeometryTransformation)
		) {
			if (!this.builtIn || this.readonly) return;
			if (!this.pending.length) {
				this.pending = [id];
				this.updateTool();
				return;
			}
			const original = this.objects.find((o) => o.id === this.pending[0]);
			const originalValue = original && this.result.values.get(original.id);
			if (!original || !originalValue)
				throw new Error("Select a defined object first.");
			const option =
				this.tool === "homothety"
					? `, ratio=${this.field("ratio")}`
					: this.tool === "rotation"
						? `, angle=${this.field("rotation")}deg`
						: "";
			const suffix = `${original.stroke ? ` style=${original.stroke}` : ""}${original.color ? ` color=${original.color}` : ""}`;
			const candidate = parseGeometry(
				`${this.value}\n${originalValue.kind} ${this.name(`${original.id}_image`)} = ${this.tool}(${original.id}, ${id}${option})${suffix}`,
			);
			const image = candidate[candidate.length - 1];
			if (image?.definition.kind !== "transform")
				throw new Error("Invalid transformation.");
			if (
				this.querySelector<TpRadioList>("[data-transform-mode]")?.value === "2"
			) {
				const next = structuredClone(this.objects);
				const target = next.find((o) => o.id === original.id);
				if (!target) return;
				target.definition = { ...image.definition, object: target.definition };
				// Keep the original name: existing dependents follow the transformed object.
				this.setConstruction(serializeGeometry(next));
			} else this.setConstruction(serializeGeometry(candidate));
			this.updateTool();
			return;
		}
		if (
			this.tool === "length" ||
			this.tool === "area" ||
			this.tool === "angle"
		) {
			if (this.tool === "angle" && isLinear(value)) {
				if (
					this.pending.length &&
					!isLinear(
						this.result.values.get(this.pending[0] ?? "") ?? {
							kind: "point",
							point: p,
						},
					)
				)
					throw new Error("Select another point, or restart with two sides.");
				if (this.pending.includes(id))
					throw new Error("Select two different sides.");
				this.pending.push(id);
				if (this.pending.length === 1) {
					this.updateTool();
					return;
				}
				this.appendConstruction(
					`comment ${this.name("measure")} = angle(${this.pending.join(", ")})`,
				);
				this.updateTool();
				return;
			}
			if (
				this.tool === "angle" &&
				this.pending.some(
					(ref) => this.result.values.get(ref)?.kind !== "point",
				)
			)
				throw new Error("Select another side.");
			const pointInput =
				this.tool === "angle" ||
				(this.tool === "length" &&
					(this.pending.length > 0 || value.kind === "point"));
			if (pointInput) {
				if (value.kind !== "point") throw new Error("Select a point.");
				if (this.pending.includes(id))
					throw new Error("Select a different point.");
				this.pending.push(id);
				if (this.pending.length < (this.tool === "angle" ? 3 : 2)) {
					this.updateTool();
					return;
				}
			}
			this.appendConstruction(
				`comment ${this.name("measure")} = ${this.tool}(${pointInput ? this.pending.join(", ") : id})`,
			);
			this.updateTool();
			return;
		}
		if (this.tool === "on") {
			const t = parameterAt(value, p);
			this.appendConstruction(
				`point ${this.pointName()} = on(${id}, ${isLinear(value) ? `t=${t}` : `angle=${(t * 180) / Math.PI}deg`})`,
			);
			return;
		}
		if (this.tool === "arc" || this.tool === "sector") {
			if (value.kind !== "circle") throw new Error("Select a circle.");
			const source = `${this.value}\n${this.tool} ${this.name(this.tool)} = ${this.tool}(${id}, start=${this.field("start")}deg, end=${this.field("end")}deg)`;
			const next = parseGeometry(source);
			const support = next.find((o) => o.id === id);
			if (support && this.tool === "arc") support.hidden = true;
			this.setConstruction(serializeGeometry(next));
			return;
		}
		if (this.tool === "circle") {
			if (value.kind !== "point") throw new Error("Select the centre point.");
			this.appendConstruction(
				`circle ${this.name("c")} = circle(${id}, ${this.field("radius")})`,
			);
			return;
		}

		if (this.tool === "midpoint" || this.tool === "perpendicularBisector") {
			if (value.kind !== "segment") throw new Error("Select a segment.");
			this.appendConstruction(
				`${this.tool === "midpoint" ? "point" : "line"} ${this.name(this.tool === "midpoint" ? "M" : "m")} = ${this.tool}(${id})`,
			);
			return;
		}
		if (
			this.tool === "parallel" ||
			this.tool === "perpendicular" ||
			this.tool === "tangent"
		) {
			if (!this.pending.length && value.kind !== "point")
				throw new Error("Select a point first.");
			if (
				this.pending.length &&
				(this.tool === "tangent" ? value.kind !== "circle" : !isLinear(value))
			)
				throw new Error(
					this.tool === "tangent"
						? "Select a circle."
						: "Select a linear support.",
				);
		} else if (this.tool === "intersection") {
			if (!isLinear(value) && value.kind !== "circle" && value.kind !== "arc")
				throw new Error("Select a line, segment, ray, vector, circle or arc.");
		} else if (value.kind !== "point") throw new Error("Select a point.");
		if (this.pending.includes(id))
			throw new Error("Select two different objects.");
		this.pending.push(id);
		if (this.pending.length < (this.tool === "bisector" ? 3 : 2)) {
			this.updateTool();
			return;
		}
		const [first = "", second = "", third = ""] = this.pending;
		this.pending = [];
		this.polygonDraft = [];
		if (
			this.tool === "line" ||
			this.tool === "segment" ||
			this.tool === "fixedSegment" ||
			this.tool === "ray" ||
			this.tool === "vector"
		) {
			const kind = this.tool === "fixedSegment" ? "segment" : this.tool;
			this.appendConstruction(
				`${kind} ${this.name(kind === "line" ? "d" : kind === "vector" ? "v" : kind === "ray" ? "r" : "s")} = ${kind}(${first}, ${second}${this.tool === "fixedSegment" ? `, length=${this.field("radius")}` : ""})`,
			);
		} else if (this.tool === "parallel" || this.tool === "perpendicular") {
			this.appendConstruction(
				`line ${this.name("d")} = ${this.tool}(${first}, ${second})`,
			);
		} else if (this.tool === "bisector") {
			this.appendConstruction(
				`line ${this.name("b")} = bisector(${first}, ${second}, ${third})`,
			);
		} else if (this.tool === "tangent") {
			const source = `${this.value}\nline ${this.name("t")} = tangent(${first}, ${second}, branch=0)`;
			const next = parseGeometry(source);
			const diagnostics = evaluateGeometry(next);
			const error = diagnostics.errors.get(this.name("t"));
			if (error) throw new Error(error);
			const p = this.result.values.get(first);
			const c = this.result.values.get(second);
			if (
				p?.kind === "point" &&
				c?.kind === "circle" &&
				distance(p.point, c.center) > c.radius + 1e-9
			) {
				let i = 1;
				while (next.some((o) => o.id === `t${i}`)) i++;
				next.push({
					id: `t${i}`,
					hidden: false,
					definition: {
						kind: "tangent",
						point: first,
						circle: second,
						branch: 1,
					},
				});
			}
			this.setConstruction(serializeGeometry(next));
		} else if (this.tool === "through")
			this.appendConstruction(
				`circle ${this.name("c")} = circle(${first}, through=${second})`,
			);
		else {
			const a = this.result.values.get(first);
			const b = this.result.values.get(second);
			if (!a || !b) return;
			const points = intersections(a, b);
			const branches = points
				.map((point, index) =>
					point &&
					!(index === 1 && points[0] && distance(point, points[0]) < 1e-9)
						? index
						: -1,
				)
				.filter((index) => index >= 0);
			if (!branches.length)
				throw new Error("These objects have no distinct intersection.");
			const next = [...this.objects];
			for (const branch of branches) {
				let i = 1;
				let name = "I";
				while (next.some((o) => o.id === name)) name = `I${i++}`;
				next.push({
					id: name,
					hidden: false,
					definition: { kind: "intersection", first, second, branch },
				});
			}
			this.setConstruction(serializeGeometry(next));
		}
		this.updateTool();
	}
	private canvasPoint(
		event: Pick<MouseEvent, "clientX" | "clientY">,
	): GeometryPoint {
		const svg = this.querySelector<SVGSVGElement>("svg[data-geometry-canvas]");
		const matrix = svg?.getScreenCTM?.();
		if (matrix && typeof DOMPoint !== "undefined") {
			const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
				matrix.inverse(),
			);
			return { x: p.x, y: p.y };
		}
		const rect = svg?.getBoundingClientRect();
		return {
			x: ((event.clientX - (rect?.left ?? 0)) * 900) / (rect?.width || 900),
			y:
				((event.clientY - (rect?.top ?? 0)) * this.canvasHeight) /
				(rect?.height || this.canvasHeight),
		};
	}
	private world(event: MouseEvent): GeometryPoint {
		const p = this.canvasPoint(event);
		return {
			x: (p.x - 450) / this.scale + this.center.x,
			y: (280 - p.y) / this.scale + this.center.y,
		};
	}
	private namePosition(object: GeometryObject, offset = true): GeometryPoint {
		const v = this.result.values.get(object.id);
		let p = { x: 0, y: 0 };
		if (v?.kind === "point" || v?.kind === "comment") p = v.point;
		else if (v && isLinear(v))
			p = { x: (v.first.x + v.second.x) / 2, y: (v.first.y + v.second.y) / 2 };
		else if (v?.kind === "polygon")
			p = {
				x: v.vertices.reduce((sum, p) => sum + p.x, 0) / v.vertices.length,
				y: v.vertices.reduce((sum, p) => sum + p.y, 0) / v.vertices.length,
			};
		else if (v?.kind === "arc" || v?.kind === "sector")
			p = {
				x: v.center.x + v.radius * Math.cos(v.start + v.sweep / 2),
				y: v.center.y + v.radius * Math.sin(v.start + v.sweep / 2),
			};
		else if (v && "center" in v)
			p = { x: v.center.x + v.radius, y: v.center.y };
		return offset
			? {
					x: p.x + (object.labelOffset?.x ?? 0) + 11 / this.scale,
					y: p.y + (object.labelOffset?.y ?? 0) + 10 / this.scale,
				}
			: p;
	}
	private moveName(id: string, p: GeometryPoint): void {
		const object = this.objects.find((o) => o.id === id);
		if (!object) return;
		const anchor = this.namePosition(object, false);
		object.labelOffset = {
			x: p.x - anchor.x - 11 / this.scale,
			y: p.y - anchor.y - 10 / this.scale,
		};
		this.recompute();
	}
	private movePoint(id: string, p: GeometryPoint): void {
		const d = this.objects.find((o) => o.id === id)?.definition;
		if (!d) return;
		if (d.kind === "point") {
			d.x = p.x;
			d.y = p.y;
		} else if (d.kind === "measure" || d.kind === "comment") {
			const current = this.result.values.get(id);
			if (current?.kind !== "comment") return;
			const x = (d.offset?.x ?? 0) + p.x - current.point.x;
			const y = (d.offset?.y ?? 0) + p.y - current.point.y;
			if (x || y) d.offset = { x, y };
			else delete d.offset;
		} else if (d.kind === "on") {
			const support = this.result.values.get(d.object);
			if (support) d.parameter = parameterAt(support, p);
		}
		this.recompute();
	}
	private fitView(): void {
		const points: GeometryPoint[] = [];
		for (const object of this.objects) {
			if (object.hidden) continue;
			const v = this.result.values.get(object.id);
			if (!v) continue;
			if (v.kind === "point" || v.kind === "comment") points.push(v.point);
			if (isLinear(v)) points.push(v.first, v.second);
			if (v.kind === "sector") points.push(v.center);
			if (v.kind === "polygon") points.push(...v.vertices);
			if (v.kind === "circle")
				points.push(
					{ x: v.center.x - v.radius, y: v.center.y - v.radius },
					{ x: v.center.x + v.radius, y: v.center.y + v.radius },
				);
			if (v.kind === "arc" || v.kind === "sector")
				for (let i = 0; i <= 32; i++)
					points.push({
						x: v.center.x + v.radius * Math.cos(v.start + (v.sweep * i) / 32),
						y: v.center.y + v.radius * Math.sin(v.start + (v.sweep * i) / 32),
					});
		}
		if (points.length) {
			const xs = points.map((p) => p.x);
			const ys = points.map((p) => p.y);
			const minX = Math.min(...xs);
			const maxX = Math.max(...xs);
			const minY = Math.min(...ys);
			const maxY = Math.max(...ys);
			this.center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
			this.scale = Math.max(
				3,
				Math.min(
					70,
					740 / Math.max(1, maxX - minX),
					430 / Math.max(1, maxY - minY),
				),
			);
		} else {
			this.scale = 36;
			this.center = { x: 0, y: 0 };
		}
		this.draw();
	}
	private currentAnimation(): GeometryObject | undefined {
		const animations = this.objects.filter(
			(object) => object.definition.kind === "animation",
		);
		const active =
			animations.find((object) => object.id === this.activeAnimation) ??
			animations[0];
		this.activeAnimation = active?.id ?? null;
		return active;
	}
	private syncAnimationControls(): Set<string> {
		const active = this.currentAnimation();
		const steps =
			active?.definition.kind === "animation" ? active.definition.steps : [];
		this.animationStep = Math.min(this.animationStep, steps.length);
		const controls = this.querySelector<HTMLElement>(
			"[data-animation-controls]",
		);
		if (controls) {
			controls.hidden = !active;
			const names = this.objects
				.filter((object) => object.definition.kind === "animation")
				.map((object) => object.id);
			const signature = JSON.stringify(names);
			if (controls.dataset.names !== signature) {
				controls.dataset.names = signature;
				controls.innerHTML = `${names.map((id) => `<tp-button outlined data-geometry-control data-animation="${id}">${id}</tp-button>`).join("")}<tp-icon-button name="chevron-left-first" label="Start animation" title="Start animation" data-geometry-control data-action="animation-start"></tp-icon-button><tp-icon-button name="chevron-left" label="Previous animation step" title="Previous animation step" data-geometry-control data-action="animation-previous"></tp-icon-button><span data-animation-status role="status" aria-live="polite"></span><tp-icon-button name="chevron-right" label="Next animation step" title="Next animation step" data-geometry-control data-action="animation-next"></tp-icon-button><tp-icon-button name="chevron-right-last" label="Show complete animation" title="Show complete animation" data-geometry-control data-action="animation-end"></tp-icon-button>`;
			}
			for (const button of controls.querySelectorAll<TpButton>(
				"[data-animation]",
			)) {
				button.setAttribute(
					"aria-pressed",
					String(button.dataset.animation === active?.id),
				);
				button.toggleAttribute(
					"outlined",
					button.dataset.animation !== active?.id,
				);
			}
			const status = controls.querySelector("[data-animation-status]");
			if (status)
				status.textContent = `${this.animationStep} / ${steps.length}`;
			for (const action of ["start", "previous", "next", "end"]) {
				const button = controls.querySelector<TpButton>(
					`[data-action="animation-${action}"]`,
				);
				if (button)
					button.disabled =
						action === "start" || action === "previous"
							? this.animationStep === 0
							: this.animationStep === steps.length;
			}
		}
		return new Set(steps.slice(this.animationStep).flat());
	}
	private draw(preserveShapes = false): void {
		const animationHidden = this.syncAnimationControls();
		const group = this.querySelector("[data-drawing]");
		if (!group) return;
		const x = (n: number): number => 450 + (n - this.center.x) * this.scale;
		const y = (n: number): number => 280 - (n - this.center.y) * this.scale;
		const shapes: string[] = [];
		const points: string[] = [];
		for (const object of this.objects) {
			const v = this.result.values.get(object.id);
			if (!v || object.hidden || animationHidden.has(object.id)) continue;
			const attributes = `data-id="${object.id}" class="tp-geometry-shape ${object.color ? `has-color tp-${object.color}` : ""} stroke-${object.stroke ?? "solid"} ${this.selected === object.id || this.pending.includes(object.id) ? "is-selected" : ""}"`;
			const name = this.namePosition(object);
			const nameLabel = object.labelHidden
				? ""
				: `<text data-name-label x="${x(name.x)}" y="${y(name.y)}">${object.id}</text>`;
			let shape = "";
			if (v.kind === "point") {
				points.push(
					`<g ${attributes}><circle class="point-hit" cx="${x(v.point.x)}" cy="${y(v.point.y)}" r="13"/><circle class="point ${object.definition.kind === "point" ? "free" : "dependent"}" cx="${x(v.point.x)}" cy="${y(v.point.y)}" r="5"/>${nameLabel}<title>${object.id} · ${object.definition.kind}</title></g>`,
				);
				continue;
			}
			if (isLinear(v)) {
				const length = distance(v.first, v.second);
				const factor =
					v.kind === "line" || v.kind === "ray"
						? ((2 * Math.max(900, this.canvasHeight)) / this.scale +
								distance(v.first, this.center)) /
							length
						: 0;
				const dx = v.second.x - v.first.x;
				const dy = v.second.y - v.first.y;
				shape = `<line x1="${x(v.first.x - dx * (v.kind === "line" ? factor : 0))}" y1="${y(v.first.y - dy * (v.kind === "line" ? factor : 0))}" x2="${x(v.second.x + dx * factor)}" y2="${y(v.second.y + dy * factor)}"/>`;
				if (v.kind === "vector") {
					const ux = dx / length,
						uy = -dy / length;
					const ex = x(v.second.x),
						ey = y(v.second.y);
					shape += `<path d="M ${ex - 12 * ux + 5 * uy} ${ey - 12 * uy - 5 * ux} L ${ex} ${ey} L ${ex - 12 * ux - 5 * uy} ${ey - 12 * uy + 5 * ux}"/>`;
				}
			} else if (v.kind === "polygon") {
				shape = `<polygon points="${v.vertices.map((p) => `${x(p.x)},${y(p.y)}`).join(" ")}"/>`;
			} else if (v.kind === "comment") {
				if (v.angleMark) {
					const mark = v.angleMark;
					const r = mark.right ? 16 : 30;
					const at = (angle: number, radius: number): GeometryPoint => ({
						x: x(mark.vertex.x) + Math.cos(angle) * radius,
						y: y(mark.vertex.y) - Math.sin(angle) * radius,
					});
					const a = at(mark.start, r),
						b = at(mark.start + mark.sweep, r);
					const corner = {
						x: a.x + b.x - x(mark.vertex.x),
						y: a.y + b.y - y(mark.vertex.y),
					};
					const path = mark.right
						? `M ${a.x} ${a.y} L ${corner.x} ${corner.y} L ${b.x} ${b.y}`
						: `M ${a.x} ${a.y} A ${r} ${r} 0 0 ${mark.sweep > 0 ? 0 : 1} ${b.x} ${b.y}`;
					const label = at(mark.start + mark.sweep / 2, 46);
					points.push(
						`<g ${attributes}><g class="shape-hit"><path d="${path}"/></g><g class="shape-ink"><path data-angle-mark="${mark.right ? "right" : "arc"}" d="${path}"/></g>${mark.right ? "" : `<text text-anchor="middle" dominant-baseline="middle" x="${label.x + (v.point.x - mark.vertex.x) * this.scale}" y="${label.y - (v.point.y - mark.vertex.y) * this.scale}">${escapeHtml(v.text)}</text>`}${object.labelOffset || (this.movingName && this.selected === object.id) ? nameLabel : ""}<title>${object.id}${mark.right ? " · Right angle" : ""}</title></g>`,
					);
					continue;
				}
				points.push(
					`<g ${attributes}><text x="${x(v.point.x) + 12}" y="${y(v.point.y) + 24}">${escapeHtml(v.text)}</text>${object.labelOffset || (this.movingName && this.selected === object.id) ? nameLabel : ""}<title>${object.id}</title></g>`,
				);
				continue;
			} else if (v.kind === "circle")
				shape = `<circle cx="${x(v.center.x)}" cy="${y(v.center.y)}" r="${v.radius * this.scale}"/>`;
			else if (v.kind === "arc" || v.kind === "sector") {
				const start = {
					x: v.center.x + v.radius * Math.cos(v.start),
					y: v.center.y + v.radius * Math.sin(v.start),
				};
				const end = {
					x: v.center.x + v.radius * Math.cos(v.start + v.sweep),
					y: v.center.y + v.radius * Math.sin(v.start + v.sweep),
				};
				shape = `<path d="${v.kind === "sector" ? `M ${x(v.center.x)} ${y(v.center.y)} L` : "M"} ${x(start.x)} ${y(start.y)} A ${v.radius * this.scale} ${v.radius * this.scale} 0 ${Math.abs(v.sweep) > Math.PI ? 1 : 0} ${v.sweep > 0 ? 0 : 1} ${x(end.x)} ${y(end.y)}${v.kind === "sector" ? " Z" : ""}"/>`;
			}
			shapes.push(
				`<g ${attributes}><g class="shape-hit">${shape}</g><g class="shape-ink ${v.kind}">${shape}</g>${nameLabel}<title>${object.id}</title></g>`,
			);
		}
		const draftPoints = this.pending
			.map((id) => {
				const draft = this.polygonDraft.find((o) => o.id === id)?.definition;
				const v = this.result.values.get(id);
				return draft?.kind === "point"
					? draft
					: v?.kind === "point"
						? v.point
						: null;
			})
			.filter((p): p is GeometryPoint => p !== null);
		const preview =
			this.tool === "polygon" || this.tool === "regularPolygon"
				? `<g data-polygon-preview><polyline class="tp-geometry-preview" points="${draftPoints.map((p) => `${x(p.x)},${y(p.y)}`).join(" ")}"/>${this.polygonDraft
						.map((o) => {
							const d = o.definition;
							return d.kind === "point"
								? `<g data-id="${o.id}" class="tp-geometry-shape"><circle class="point-hit" cx="${x(d.x)}" cy="${y(d.y)}" r="13"/><circle class="point" cx="${x(d.x)}" cy="${y(d.y)}" r="5"/><text x="${x(d.x) + 11}" y="${y(d.y) - 10}">${o.id}</text></g>`
								: "";
						})
						.join("")}</g>`
				: "";
		if (preserveShapes) {
			for (const shape of group.querySelectorAll<SVGElement>("[data-id]"))
				shape.classList.toggle(
					"is-selected",
					shape.dataset.id === this.selected ||
						this.pending.includes(shape.dataset.id ?? ""),
				);
		} else group.innerHTML = `${shapes.join("")}${points.join("")}${preview}`;
		const finish = this.querySelector<TpButton>(
			'[data-action="finish-polygon"]',
		);
		if (finish)
			finish.disabled =
				this.readonly || this.tool !== "polygon" || this.pending.length < 3;
		const grid = this.querySelector("[data-grid]");
		if (grid) {
			const step =
				this.scale * 10 ** Math.max(0, Math.ceil(Math.log10(18 / this.scale)));
			const commands: string[] = [];
			if (this.grid) {
				for (let px = ((x(0) % step) + step) % step; px <= 900; px += step)
					commands.push(`M ${px} 0 V ${this.canvasHeight}`);
				for (
					let py = ((y(0) % step) + step) % step;
					py <= this.canvasHeight;
					py += step
				)
					commands.push(`M 0 ${py} H 900`);
			}
			grid.innerHTML = commands.length
				? `<path d="${commands.join(" ")}"/>`
				: "";
		}
		this.querySelector('[data-action="grid"]')?.setAttribute(
			"aria-pressed",
			String(this.grid),
		);
		this.querySelector("[data-geometry-canvas]")?.classList.toggle(
			"pan-mode",
			this.tool === "pan",
		);
		const nameField = this.querySelector<TpTextfield>("[data-object-name]");
		if (nameField) {
			if (
				!nameField.contains(document.activeElement) &&
				document.activeElement !== nameField
			)
				nameField.value = this.selected ?? "";
			nameField.disabled = this.readonly || !this.selected;
		}
		for (const action of ["rename", "move-name", "hide-name"]) {
			const button = this.querySelector<TpButton>(`[data-action="${action}"]`);
			if (button)
				button.disabled =
					this.readonly ||
					!this.selected ||
					(action !== "rename" &&
						this.objects.find((o) => o.id === this.selected)?.definition
							.kind === "animation");
		}
		this.querySelector('[data-action="move-name"]')?.setAttribute(
			"aria-pressed",
			String(this.movingName),
		);
		this.querySelector('[data-action="move-name"]')?.toggleAttribute(
			"outlined",
			!this.movingName,
		);
		const list = this.querySelector("[data-objects]");
		if (list) {
			const markup =
				this.objects
					.map(
						(o) =>
							`<tp-button type="button" outlined data-geometry-control data-object="${o.id}" aria-pressed="${this.selected === o.id}" title="${escapeHtml(this.result.errors.get(o.id) ?? o.definition.kind)}"><b>${o.id}</b><span class="object-kind">${this.result.errors.has(o.id) ? "Undefined" : o.definition.kind}${o.hidden ? " · hidden" : ""}${o.labelHidden ? " · name hidden" : ""}</span></tp-button>`,
					)
					.join("") || "<p>Place your first point.</p>";
			if (markup !== this.objectListMarkup) {
				list.innerHTML = markup;
				this.objectListMarkup = markup;
			}
		}
		const selected = this.objects.find((object) => object.id === this.selected);
		const hideName = this.querySelector('[data-action="hide-name"]');
		hideName?.setAttribute("aria-pressed", String(!!selected?.labelHidden));
		hideName?.toggleAttribute("outlined", !selected?.labelHidden);
		const moveName = this.querySelector<TpButton>('[data-action="move-name"]');
		if (moveName)
			moveName.disabled =
				this.readonly ||
				!selected ||
				!!selected.labelHidden ||
				selected.definition.kind === "animation";
		for (const action of ["style", "color"] as const) {
			const button = this.querySelector<TpButton>(
				`[data-action="${action}-menu"]`,
			);
			if (button) {
				button.disabled =
					this.readonly ||
					!selected ||
					selected.definition.kind === "animation";
				const label = button.querySelector(`[data-${action}-label]`);
				if (label)
					label.textContent =
						action === "style"
							? `Style · ${selected?.hidden ? "hidden" : (selected?.stroke ?? "solid")}`
							: `Color · ${selected?.color ?? "automatic"}`;
				button.setAttribute(
					"aria-expanded",
					String(
						this.querySelector(`[data-${action}-menu]`)?.hasAttribute("open") ??
							false,
					),
				);
			}
		}
		const appearanceLabel = this.querySelector("[data-appearance-label]");
		if (appearanceLabel)
			appearanceLabel.textContent = selected
				? `Appearance of ${selected.id}`
				: "Select an object in Move mode to change its appearance.";
		this.syncButtonControls();
		for (const action of ["undo", "redo", "delete"]) {
			const button = this.querySelector<TpButton>(`[data-action="${action}"]`);
			if (button)
				button.disabled =
					this.readonly ||
					(action === "undo"
						? !this.undoStack.length
						: action === "redo"
							? !this.redoStack.length
							: !this.selected);
		}
		if (this.result.errors.size)
			this.report(
				[...this.result.errors]
					.map(([id, error]) => `${id}: ${error}`)
					.join(" "),
			);
		else if (!this.pending.length) this.report("");
	}
}
if (!customElements.get("tp-graph-geometry"))
	customElements.define("tp-graph-geometry", TpGraphGeometry);
