/**
 * @module components/graph-editor
 * @summary Extensible interactive graph editor.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-accordion
 * @summary Accessible accordion component with keyboard navigation and ARIA mapping.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
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
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { getCodeFromScript } from "../../utilities/code.js";
import { TpBase } from "../base/base.js";
import style from "./graph-editor.css?inline";
import "../icon-button/icon-button.js";
import "../fullscreen/fullscreen.js";
import "../color/color.js";
import "../theme/theme.js";
import "../dropdown/dropdown.js";
import "../accordion/accordion.js";
import "../button-group/button-group.js";
import "../save-image/save-image.js";
import "../code-editor/code-editor.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import {
	formatGraphSchemaError,
	TpGraphDocumentSchema,
} from "./graph-schema.js";

export interface TpGraphPoint {
	x: number;
	y: number;
}

export interface TpGraphNode {
	id: string;
	type: string;
	x: number;
	y: number;
	label?: string;
	data?: Record<string, unknown>;
	state?: Record<string, unknown>;
}

export interface TpGraphEdge {
	id: string;
	source?: string;
	target?: string;
	sourcePoint?: TpGraphPoint;
	targetPoint?: TpGraphPoint;
	sourcePort?: TpGraphPort;
	targetPort?: TpGraphPort;
	type?: string;
	direction?: TpGraphEdgeDirection;
	routing?: TpGraphEdgeRouting;
	elbows?: 1 | 2 | 3;
	departure?: "horizontal" | "vertical";
	turns?: "alternating" | "same";
	bendX?: number;
	bendY?: number;
	label?: string;
	data?: Record<string, unknown>;
	state?: Record<string, unknown>;
}

export interface TpGraphMeasurement {
	id: string;
	label?: string;
	position: number;
}

export type TpGraphEdgeDirection = "none" | "forward" | "backward" | "both";
export type TpGraphEdgeRouting = "straight" | "orthogonal";

export interface TpGraphDocument {
	version: 1;
	title?: string;
	nodes: TpGraphNode[];
	edges: TpGraphEdge[];
	data?: Record<string, unknown>;
}

export interface TpGraphShape {
	type: string;
	label: string;
	description?: string;
	width?: number | ((node: Readonly<TpGraphNode>) => number);
	height?: number | ((node: Readonly<TpGraphNode>) => number);
	ports?:
		| Partial<
				Record<
					TpGraphPort,
					TpGraphPoint | ((node: Readonly<TpGraphNode>) => TpGraphPoint)
				>
		  >
		| ((
				node: Readonly<TpGraphNode>,
		  ) => Partial<Record<TpGraphPort, TpGraphPoint>>);
	render?: (node: Readonly<TpGraphNode>, selected: boolean) => string;
	createData?: () => Record<string, unknown>;
}

export type TpGraphPort = "north" | "east" | "south" | "west";

export interface TpGraphPalette {
	id: string;
	label: string;
	shapes: TpGraphShape[];
}

export interface TpGraphTransition {
	nodes?: Record<string, Partial<TpGraphNode>>;
	edges?: Record<string, Partial<TpGraphEdge>>;
	duration?: number;
}

export type TpGraphSimulator = (
	graph: Readonly<TpGraphDocument>,
) => TpGraphTransition | Promise<TpGraphTransition>;

const DEFAULT_GRAPH: TpGraphDocument = {
	version: 1,
	title: "",
	nodes: [],
	edges: [],
};
export const TP_GRAPH_COMMENT = "comment";
export const TP_GRAPH_MEASUREMENT = "measurement";
export const TP_GRAPH_HUB = "hub";
export type TpGraphCommentColor =
	| "success"
	| "warning"
	| "info"
	| "danger"
	| "brand"
	| "neutral";
const GRAPH_COMMENT_COLORS: readonly TpGraphCommentColor[] = [
	"success",
	"warning",
	"info",
	"danger",
	"brand",
	"neutral",
];

function graphCommentColor(value: unknown): TpGraphCommentColor {
	return typeof value === "string" &&
		GRAPH_COMMENT_COLORS.includes(value as TpGraphCommentColor)
		? (value as TpGraphCommentColor)
		: "neutral";
}

function graphCommentHeight(node: Readonly<TpGraphNode>): number {
	return graphCommentLines(node.label ?? "Comment").length * 17 + 16;
}

function graphCommentLines(value: string, maximumCharacters = 22): string[] {
	const lines: string[] = [];
	for (const paragraph of value.split("\n")) {
		const words = paragraph.split(/\s+/).filter(Boolean);
		if (words.length === 0) {
			lines.push("");
			continue;
		}
		let line = "";
		const wrappedWords: string[] = [];
		for (const word of words) {
			let remainder = word;
			while (remainder.length > maximumCharacters) {
				wrappedWords.push(remainder.slice(0, maximumCharacters));
				remainder = remainder.slice(maximumCharacters);
			}
			if (remainder !== "") wrappedWords.push(remainder);
		}
		for (const word of wrappedWords) {
			const candidate = line === "" ? word : `${line} ${word}`;
			if (candidate.length <= maximumCharacters) {
				line = candidate;
			} else {
				if (line !== "") lines.push(line);
				line = word;
			}
		}
		if (line !== "") lines.push(line);
	}
	return lines.length === 0 ? [""] : lines;
}

function cloneGraph(graph: TpGraphDocument): TpGraphDocument {
	return structuredClone(graph);
}

export function graphEdgeMeasurements(
	edge: Readonly<TpGraphEdge>,
): TpGraphMeasurement[] {
	const source = edge.data?.measurements;
	if (!Array.isArray(source)) return [];
	return source.flatMap((candidate) => {
		if (!candidate || typeof candidate !== "object") return [];
		const record = candidate as Record<string, unknown>;
		if (
			typeof record.id !== "string" ||
			typeof record.position !== "number" ||
			!Number.isFinite(record.position)
		)
			return [];
		return [
			{
				id: record.id,
				position: Math.min(1, Math.max(0, record.position)),
				...(typeof record.label === "string" && record.label.trim() !== ""
					? { label: record.label }
					: {}),
			},
		];
	});
}

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function defaultShape(node: Readonly<TpGraphNode>, selected: boolean): string {
	const label = escapeXml(node.label ?? node.type);
	return `<circle r="31" class="tp-graph-shape${selected ? " is-selected" : ""}" />
    <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${label}</text>`;
}

function shapeDimension(
	value: TpGraphShape["width"] | TpGraphShape["height"],
	node: Readonly<TpGraphNode>,
	fallback: number,
): number {
	return typeof value === "function" ? value(node) : (value ?? fallback);
}

function closestPort(
	node: Readonly<TpGraphNode>,
	toward: Readonly<TpGraphPoint>,
	shape?: Readonly<TpGraphShape>,
): TpGraphPort {
	if (shape?.ports) {
		const candidates = shapePortNames(shape, node);
		return candidates.reduce((best, candidate) => {
			const bestPoint = portPoint(node, best, shape);
			const candidatePoint = portPoint(node, candidate, shape);
			return Math.hypot(
				candidatePoint.x - toward.x,
				candidatePoint.y - toward.y,
			) < Math.hypot(bestPoint.x - toward.x, bestPoint.y - toward.y)
				? candidate
				: best;
		});
	}
	const dx = toward.x - node.x;
	const dy = toward.y - node.y;
	const halfWidth = Math.max(1, shapeDimension(shape?.width, node, 64) / 2);
	const halfHeight = Math.max(1, shapeDimension(shape?.height, node, 64) / 2);
	if (Math.abs(dx / halfWidth) >= Math.abs(dy / halfHeight))
		return dx >= 0 ? "east" : "west";
	return dy >= 0 ? "south" : "north";
}

const GRAPH_PORTS: readonly TpGraphPort[] = ["north", "east", "south", "west"];

function resolvedShapePorts(
	shape: Readonly<TpGraphShape> | undefined,
	node: Readonly<TpGraphNode>,
):
	| Partial<
			Record<
				TpGraphPort,
				TpGraphPoint | ((node: Readonly<TpGraphNode>) => TpGraphPoint)
			>
	  >
	| undefined {
	if (!shape?.ports) return undefined;
	return typeof shape.ports === "function" ? shape.ports(node) : shape.ports;
}

function shapePortNames(
	shape: Readonly<TpGraphShape> | undefined,
	node: Readonly<TpGraphNode>,
): TpGraphPort[] {
	if (!shape?.ports) return [...GRAPH_PORTS];
	const resolved = resolvedShapePorts(shape, node);
	const ports = GRAPH_PORTS.filter((port) => resolved?.[port] !== undefined);
	return ports.length > 0 ? ports : [...GRAPH_PORTS];
}

function portPoint(
	node: Readonly<TpGraphNode>,
	port: TpGraphPort,
	shape?: Readonly<TpGraphShape>,
): TpGraphPoint {
	const custom = resolvedShapePorts(shape, node)?.[port];
	if (custom !== undefined) {
		const point = typeof custom === "function" ? custom(node) : custom;
		return { x: node.x + point.x, y: node.y + point.y };
	}
	const halfWidth = shapeDimension(shape?.width, node, 64) / 2;
	const halfHeight = shapeDimension(shape?.height, node, 64) / 2;
	if (port === "north") return { x: node.x, y: node.y - halfHeight };
	if (port === "east") return { x: node.x + halfWidth, y: node.y };
	if (port === "south") return { x: node.x, y: node.y + halfHeight };
	return { x: node.x - halfWidth, y: node.y };
}

const GENERIC_PALETTE: TpGraphPalette = {
	id: "generic",
	label: "General",
	shapes: [
		{ type: "node", label: "Node", width: 64, height: 64 },
		{
			type: TP_GRAPH_HUB,
			label: "Hub",
			description: "Four-port connection hub",
			width: 32,
			height: 32,
			render: (
				node,
				selected,
			) => `<rect x="-16" y="-16" width="32" height="32" rx="4" class="tp-graph-shape tp-graph-hub${selected ? " is-selected" : ""}" />
        <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${escapeXml(node.label ?? "Hub")}</text>`,
		},
	],
};

const ANNOTATION_PALETTE: TpGraphPalette = {
	id: "annotations",
	label: "Annotations",
	shapes: [
		{
			type: TP_GRAPH_COMMENT,
			label: "Comment",
			description: "Free text area",
			width: 160,
			height: graphCommentHeight,
			createData: () => ({ color: "neutral" }),
			render: (node, selected) => {
				const lines = graphCommentLines(node.label ?? "Comment");
				const height = graphCommentHeight(node);
				const color = graphCommentColor(node.data?.color);
				return `<rect x="-80" y="${-height / 2}" width="160" height="${height}" rx="5" class="tp-graph-shape tp-graph-comment tp-graph-comment-${color}${selected ? " is-selected" : ""}" />
        <text class="tp-graph-label tp-graph-comment-label" x="-68" y="${-height / 2 + 17}">${lines.map((line, index) => `<tspan x="-68" dy="${index === 0 ? 0 : 17}">${escapeXml(line)}</tspan>`).join("")}</text>`;
			},
		},
		{
			type: TP_GRAPH_MEASUREMENT,
			label: "Measurement",
			description: "Named measurement point attached to a link",
			width: 18,
			height: 18,
			render: () =>
				'<rect x="-5" y="-5" width="10" height="10" class="tp-graph-measurement-shape" />',
		},
	],
};

/**
 * Canvas editor for directed graphs, with pluggable palettes and simulators.
 *
 * @summary Edits and animates domain-specific graphs.
 * @tagname tp-graph-editor
 * @attr {string} src = "" - URL of a tp/graph JSON document loaded at initialization.
 * @attr {boolean} readonly = false - Prevents graph editing while keeping navigation available.
 * @attr {boolean} grid = false - Displays and uses the snapping grid.
 * @attr {number} grid-size = 20 - Grid spacing in graph units.
 * @attr {boolean} ports-visible = false - Keeps attachment plots visible instead of showing them only on hover.
 * @attr {string} message = "" - Status message displayed by the graph editor.
 * @event tp-graph-change Fired after a user or API graph mutation.
 * @event tp-graph-selection-change Fired when the selection changes.
 * @event tp-graph-simulation-step Fired after a simulator step.
 * @example
 * <tp-graph-editor></tp-graph-editor>
 */
export class TpGraphEditor extends TpBase {
	private static readonly styleId = "tp-graph-editor-styles";
	private static editorCounter = 0;
	private graphValue = cloneGraph(DEFAULT_GRAPH);
	private readonly palettes = new Map<string, TpGraphPalette>();
	private readonly simulators = new Map<string, TpGraphSimulator>();
	private selectedId: string | null = null;
	private selectedIds = new Set<string>();
	private selectionMode = false;
	private selectionDraft: {
		start: TpGraphPoint;
		current: TpGraphPoint;
	} | null = null;
	private activeShapeType = "node";
	private drag: {
		id: string;
		offset: TpGraphPoint;
		startClient: TpGraphPoint;
		moved: boolean;
	} | null = null;
	private connectionDraft: {
		sourceId: string;
		sourcePort: TpGraphPort;
		direction: TpGraphEdgeDirection;
	} | null = null;
	private edgeReconnectDraft: {
		edgeId: string;
		endpoint: "source" | "target";
	} | null = null;
	private edgeBendDrag: { edgeId: string; axis: "x" | "y" } | null = null;
	private measurementDrag: { edgeId: string; measurementId: string } | null =
		null;
	private minimapDrag: {
		startClient: TpGraphPoint;
		startPan: TpGraphPoint;
	} | null = null;
	private edgeDrag: {
		edgeId: string;
		startClient: TpGraphPoint;
		pointer: TpGraphPoint;
		source: TpGraphPoint;
		target: TpGraphPoint;
		bendX?: number;
		bendY?: number;
		moved: boolean;
	} | null = null;
	private idCounter = 0;
	private initialized = false;
	private initializationScheduled = false;
	private initializationObserver: MutationObserver | null = null;
	private interactionBound = false;
	private initialGraphSourceSnapshot: string | null = null;
	private sourceFilename: string | null = null;
	private zoomValue = 1;
	private commentPaletteColor: TpGraphCommentColor = "neutral";
	protected activeEdgeDirection: TpGraphEdgeDirection = "forward";
	private activeEdgeRouting: TpGraphEdgeRouting = "straight";
	private activeEdgeElbows: 1 | 2 | 3 = 2;
	private activeEdgeDeparture: "horizontal" | "vertical" = "horizontal";
	private activeEdgeTurns: "alternating" | "same" = "alternating";
	private paletteOpenIndexes = "";
	private pan: TpGraphPoint = { x: 0, y: 0 };
	private viewportPixels: TpGraphPoint = { x: 800, y: 448 };
	private viewportResizeObserver: ResizeObserver | null = null;
	private graphCodeEditor: TpCodeEditor | null = null;
	private graphCodeEditorBound = false;
	private graphCodeVisible = false;
	private graphCodeInitialized = false;
	private pendingGraphCodeSource: string | null = null;
	private undoStack: TpGraphDocument[] = [];
	private redoStack: TpGraphDocument[] = [];
	private committedGraph = cloneGraph(DEFAULT_GRAPH);
	private clipboard: { nodes: TpGraphNode[]; edges: TpGraphEdge[] } | null =
		null;
	private pasteCount = 0;

	private static readonly minimumZoom = 0.25;
	private static readonly maximumZoom = 4;
	private static readonly zoomFactor = 1.2;

	public static get observedAttributes(): string[] {
		return ["readonly", "grid", "grid-size", "ports-visible", "message", "src"];
	}

	public constructor() {
		super();
		this.registerPalette(GENERIC_PALETTE);
		this.registerPalette(ANNOTATION_PALETTE);
	}

	public get value(): TpGraphDocument {
		return cloneGraph(this.graphValue);
	}
	public set value(graph: TpGraphDocument) {
		this.setGraph(graph);
	}

	public get readonly(): boolean {
		return this.hasAttribute("readonly");
	}
	public set readonly(value: boolean) {
		this.toggleAttribute("readonly", value);
	}
	public get src(): string {
		return this.getAttribute("src")?.trim() ?? "";
	}
	public set src(value: string) {
		if (value.trim() === "") this.removeAttribute("src");
		else this.setAttribute("src", value);
	}
	public get portsVisible(): boolean {
		return this.hasAttribute("ports-visible");
	}
	public set portsVisible(value: boolean) {
		this.toggleAttribute("ports-visible", value);
	}

	public get zoom(): number {
		return this.zoomValue;
	}
	public set zoom(value: number) {
		this.setZoom(value);
	}
	public get message(): string {
		return this.getAttribute("message") ?? "";
	}
	public set message(value: string) {
		if (value === "") this.removeAttribute("message");
		else this.setAttribute("message", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		if (this.id === "") {
			TpGraphEditor.editorCounter += 1;
			this.id = `tp-graph-editor-${TpGraphEditor.editorCounter}`;
		}
		this.ensureGlobalStyle(TpGraphEditor.styleId, style);
		this.scheduleInitialization();
	}

	public disconnectedCallback(): void {
		this.viewportResizeObserver?.disconnect();
		this.viewportResizeObserver = null;
	}

	protected attributeChangedCallback(): void {
		if (this.isConnected && this.initialized) this.render();
	}

	private scheduleInitialization(): void {
		if (this.initialized || this.initializationScheduled) return;
		this.initializationScheduled = true;
		if (this.src !== "" || getCodeFromScript("graph", this) !== null) {
			void this.initializeEditor();
			return;
		}
		this.initializationObserver = new MutationObserver(() => {
			if (getCodeFromScript("graph", this) !== null)
				void this.initializeEditor();
		});
		this.initializationObserver.observe(this, { childList: true });
		window.requestAnimationFrame(() => {
			void this.initializeEditor();
		});
	}

	private async initializeEditor(): Promise<void> {
		if (!this.isConnected || this.initialized) return;
		this.initializationObserver?.disconnect();
		this.initializationObserver = null;
		this.initializationScheduled = false;
		try {
			await this.readInitialGraph();
		} catch (error) {
			this.dispatchEvent(
				new CustomEvent("tp-graph-error", {
					bubbles: true,
					detail: { error, operation: "load-src", src: this.src },
				}),
			);
		}
		this.committedGraph = cloneGraph(this.graphValue);
		this.initialized = true;
		this.bindCanvasInteraction();
		this.render();
	}

	public setGraph(graph: TpGraphDocument): void {
		this.validateGraph(graph);
		const previous = cloneGraph(this.graphValue);
		this.graphValue = { ...cloneGraph(graph), title: graph.title ?? "" };
		this.normalizeSelfLinks();
		this.selectedId = null;
		this.selectedIds.clear();
		if (
			this.initialized &&
			JSON.stringify(previous) !== JSON.stringify(this.graphValue)
		) {
			this.undoStack.push(previous);
			this.redoStack = [];
		}
		this.committedGraph = cloneGraph(this.graphValue);
		if (this.isConnected) this.render();
	}

	public copy(): boolean {
		if (this.selectedIds.size === 0) return false;
		const nodeIds = new Set(
			this.graphValue.nodes
				.filter((node) => this.selectedIds.has(node.id))
				.map((node) => node.id),
		);
		const nodes = this.graphValue.nodes.filter((node) => nodeIds.has(node.id));
		const edges = this.graphValue.edges.filter(
			(edge) =>
				this.selectedIds.has(edge.id) ||
				(edge.source !== undefined &&
					edge.target !== undefined &&
					nodeIds.has(edge.source) &&
					nodeIds.has(edge.target)),
		);
		this.clipboard = {
			nodes: structuredClone(nodes),
			edges: structuredClone(edges),
		};
		this.pasteCount = 0;
		this.render();
		return true;
	}

	public cut(): boolean {
		if (this.readonly || !this.copy()) return false;
		const removedIds = new Set(this.selectedIds);
		this.graphValue.nodes = this.graphValue.nodes.filter(
			(node) => !removedIds.has(node.id),
		);
		this.graphValue.edges = this.graphValue.edges.filter(
			(edge) =>
				!removedIds.has(edge.id) &&
				(edge.source === undefined || !removedIds.has(edge.source)) &&
				(edge.target === undefined || !removedIds.has(edge.target)),
		);
		this.removeMeasurements(removedIds);
		this.select(null);
		this.changed("cut");
		return true;
	}

	public paste(): string | null {
		if (this.readonly || !this.clipboard) return null;
		this.pasteCount += 1;
		const offset = 24 * this.pasteCount;
		const idMap = new Map<string, string>();
		const pastedIds: string[] = [];
		for (const sourceNode of this.clipboard.nodes) {
			const node = structuredClone(sourceNode);
			node.id = this.nextId("node");
			idMap.set(sourceNode.id, node.id);
			node.x = this.snap(node.x + offset);
			node.y = this.snap(node.y + offset);
			this.graphValue.nodes.push(node);
			pastedIds.push(node.id);
		}
		for (const sourceEdge of this.clipboard.edges) {
			const edge = structuredClone(sourceEdge);
			const endpoints = this.edgePoints(sourceEdge);
			edge.id = this.nextId("edge");
			edge.source = sourceEdge.source
				? idMap.get(sourceEdge.source)
				: undefined;
			edge.target = sourceEdge.target
				? idMap.get(sourceEdge.target)
				: undefined;
			if (!edge.source && endpoints) {
				edge.sourcePort = undefined;
				edge.sourcePoint = {
					x: endpoints.start.x + offset,
					y: endpoints.start.y + offset,
				};
			}
			if (!edge.target && endpoints) {
				edge.targetPort = undefined;
				edge.targetPoint = {
					x: endpoints.end.x + offset,
					y: endpoints.end.y + offset,
				};
			}
			if (edge.bendX !== undefined) edge.bendX += offset;
			if (edge.bendY !== undefined) edge.bendY += offset;
			this.graphValue.edges.push(edge);
			pastedIds.push(edge.id);
		}
		this.selectMany(pastedIds);
		this.changed("paste");
		return pastedIds[0] ?? null;
	}

	public undo(): boolean {
		const graph = this.undoStack.pop();
		if (!graph) return false;
		this.redoStack.push(cloneGraph(this.graphValue));
		this.restoreHistoryGraph(graph, "undo");
		return true;
	}

	public redo(): boolean {
		const graph = this.redoStack.pop();
		if (!graph) return false;
		this.undoStack.push(cloneGraph(this.graphValue));
		this.restoreHistoryGraph(graph, "redo");
		return true;
	}

	public registerPalette(palette: TpGraphPalette): void {
		if (!palette.id || palette.shapes.length === 0)
			throw new TypeError("A palette needs an id and at least one shape.");
		this.palettes.set(palette.id, palette);
		if (this.activeShapeType === "")
			this.activeShapeType = palette.shapes[0]?.type ?? "";
		if (this.isConnected && this.initialized) this.render();
	}

	public unregisterPalette(id: string): void {
		const removed = this.palettes.get(id);
		this.palettes.delete(id);
		if (removed?.shapes.some((shape) => shape.type === this.activeShapeType)) {
			this.activeShapeType =
				[...this.palettes.values()][0]?.shapes[0]?.type ?? "";
		}
		if (this.isConnected && this.initialized) this.render();
	}

	public registerSimulator(name: string, simulator: TpGraphSimulator): void {
		this.simulators.set(name, simulator);
	}

	public setZoom(value: number): void {
		if (!Number.isFinite(value) || value <= 0)
			throw new TypeError("The zoom must be a positive finite number.");
		this.zoomValue = Math.min(
			TpGraphEditor.maximumZoom,
			Math.max(TpGraphEditor.minimumZoom, value),
		);
		if (this.isConnected && this.initialized) this.render();
	}

	public zoomIn(): void {
		this.setZoom(this.zoomValue * TpGraphEditor.zoomFactor);
	}

	public zoomOut(): void {
		this.setZoom(this.zoomValue / TpGraphEditor.zoomFactor);
	}

	public resetZoom(): void {
		this.setZoom(1);
	}

	public exportJson(pretty = true): string {
		return JSON.stringify(this.value, null, pretty ? 2 : 0);
	}

	public exportSvg(): string {
		const canvas = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
		if (!canvas) throw new Error("The graph canvas is not ready.");
		const clone = canvas.cloneNode(true) as SVGSVGElement;
		const contentBounds = this.exportContentBounds(canvas);
		const padding = 24;
		const titleHeight = this.graphValue.title ? 36 : 0;
		const width = Math.max(1, Math.ceil(contentBounds.width + padding * 2));
		const height = Math.max(
			1,
			Math.ceil(contentBounds.height + padding * 2 + titleHeight),
		);
		clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		clone.setAttribute("width", String(width));
		clone.setAttribute("height", String(height));
		clone.setAttribute("viewBox", `0 0 ${width} ${height}`);
		const originals = [canvas, ...canvas.querySelectorAll<SVGElement>("*")];
		const copies = [clone, ...clone.querySelectorAll<SVGElement>("*")];
		for (const [index, original] of originals.entries()) {
			const copy = copies[index];
			if (!copy) continue;
			const computed = getComputedStyle(original);
			for (const property of [
				"color",
				"fill",
				"stroke",
				"stroke-width",
				"stroke-dasharray",
				"opacity",
				"font",
				"font-family",
				"font-size",
				"font-weight",
				"dominant-baseline",
				"paint-order",
			]) {
				const computedValue = computed.getPropertyValue(property);
				const value =
					computedValue.trim().toLowerCase() === "currentcolor"
						? computed.getPropertyValue("color")
						: computedValue;
				if (value !== "") copy.style.setProperty(property, value);
			}
		}
		for (const label of clone.querySelectorAll<SVGTextElement>(
			".tp-graph-edge text",
		)) {
			label.style.setProperty("paint-order", "stroke fill");
			label.style.setProperty("stroke-linejoin", "round");
		}
		const cloneScene = clone.querySelector<SVGGElement>(".tp-graph-scene");
		cloneScene?.setAttribute(
			"transform",
			`translate(${padding - contentBounds.x} ${padding + titleHeight - contentBounds.y})`,
		);
		for (const element of clone.querySelectorAll(
			".tp-graph-port, .tp-graph-port-layer, .tp-graph-edge-handle, .tp-graph-edge-hit-area, .tp-petri-fire-control, .tp-graph-connection-draft, .tp-graph-selection-area, .tp-graph-selection-indicator",
		)) {
			element.remove();
		}
		const background = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"rect",
		);
		background.setAttribute("width", "100%");
		background.setAttribute("height", "100%");
		background.setAttribute(
			"fill",
			getComputedStyle(canvas).backgroundColor || "#fff",
		);
		clone.prepend(background);
		const styleElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"style",
		);
		styleElement.textContent =
			".tp-graph-shape{fill:#fff;stroke:#5268d8;stroke-width:2}.tp-graph-edge-line{fill:none;stroke:#657084;stroke-width:2}.tp-graph-label,.tp-graph-edge text{fill:#172033;font:13px system-ui,sans-serif}.tp-graph-comment-neutral{fill:#f3f4f6;stroke:#d1d5db}.tp-graph-comment-success{fill:#dcfce7;stroke:#86efac}.tp-graph-comment-warning{fill:#fef3c7;stroke:#fcd34d}.tp-graph-comment-info{fill:#dbeafe;stroke:#93c5fd}.tp-graph-comment-danger{fill:#fee2e2;stroke:#fca5a5}.tp-graph-comment-brand{fill:#e0e7ff;stroke:#a5b4fc}.tp-petri-transition{fill:#263248}.tp-petri-token,.tp-petri-token-count{fill:#172033}";
		clone.prepend(styleElement);
		if (this.graphValue.title) {
			const title = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"text",
			);
			title.setAttribute("x", "50%");
			title.setAttribute("y", "24");
			title.setAttribute("text-anchor", "middle");
			title.setAttribute("class", "tp-graph-label");
			title.textContent = this.graphValue.title;
			clone.append(title);
		}
		return new XMLSerializer().serializeToString(clone);
	}

	private exportContentBounds(canvas: SVGSVGElement): {
		x: number;
		y: number;
		width: number;
		height: number;
	} {
		const scene = canvas.querySelector<SVGGElement>(".tp-graph-scene");
		try {
			const bounds = scene?.getBBox();
			if (bounds && bounds.width > 0 && bounds.height > 0) {
				return {
					x: bounds.x,
					y: bounds.y,
					width: bounds.width,
					height: bounds.height,
				};
			}
		} catch {
			// Detached and test SVG implementations may not provide geometry APIs.
		}
		const points: TpGraphPoint[] = [];
		for (const node of this.graphValue.nodes) {
			const shape = this.findShape(node.type);
			const halfWidth = shapeDimension(shape?.width, node, 64) / 2 + 24;
			const halfHeight = shapeDimension(shape?.height, node, 64) / 2 + 24;
			points.push({ x: node.x - halfWidth, y: node.y - halfHeight });
			points.push({ x: node.x + halfWidth, y: node.y + halfHeight });
		}
		for (const edge of this.graphValue.edges) {
			const endpoints = this.edgePoints(edge);
			if (endpoints) points.push(endpoints.start, endpoints.end);
			if (edge.bendX !== undefined && endpoints)
				points.push(
					{ x: edge.bendX, y: endpoints.start.y },
					{ x: edge.bendX, y: endpoints.end.y },
				);
			if (edge.bendY !== undefined && endpoints)
				points.push(
					{ x: endpoints.start.x, y: edge.bendY },
					{ x: endpoints.end.x, y: edge.bendY },
				);
		}
		if (points.length === 0)
			return {
				x: 0,
				y: 0,
				width: this.viewportPixels.x,
				height: this.viewportPixels.y,
			};
		const minX = Math.min(...points.map((point) => point.x));
		const minY = Math.min(...points.map((point) => point.y));
		const maxX = Math.max(...points.map((point) => point.x));
		const maxY = Math.max(...points.map((point) => point.y));
		return {
			x: minX,
			y: minY,
			width: Math.max(1, maxX - minX),
			height: Math.max(1, maxY - minY),
		};
	}

	public importJson(source: string): void {
		const parsed: unknown = JSON.parse(source);
		this.validateGraph(parsed);
		this.setGraph(parsed);
		this.dispatchEvent(
			new CustomEvent("tp-graph-import", {
				bubbles: true,
				detail: { graph: this.value },
			}),
		);
	}

	public setElementLabel(id: string, label: string): void {
		const measurement = this.measurement(id);
		if (measurement) {
			const normalized = label.trim();
			measurement.measurement.label =
				normalized === "" ? undefined : normalized;
			measurement.edge.data = {
				...(measurement.edge.data ?? {}),
				measurements: measurement.measurements,
			};
			this.changed("label");
			return;
		}
		const element =
			this.node(id) ?? this.graphValue.edges.find((edge) => edge.id === id);
		if (!element) throw new TypeError(`Unknown graph element: ${id}`);
		const normalized = label.trim();
		if (normalized === "") element.label = undefined;
		else element.label = normalized;
		this.changed("label");
	}

	public setTitle(title: string): void {
		const normalized = title.trim();
		this.graphValue.title = normalized;
		this.changed("set-title");
	}

	public setCommentColor(id: string, color: TpGraphCommentColor): void {
		if (!GRAPH_COMMENT_COLORS.includes(color))
			throw new TypeError(`Unsupported comment color: ${color}`);
		const comment = this.node(id);
		if (!comment || comment.type !== TP_GRAPH_COMMENT)
			throw new TypeError(`Unknown graph comment: ${id}`);
		comment.data = { ...(comment.data ?? {}), color };
		this.changed("set-comment-color");
	}

	public addNode(
		type: string,
		point: TpGraphPoint,
		label?: string,
	): TpGraphNode {
		const shape = this.findShape(type);
		const node: TpGraphNode = {
			id: this.nextId("node"),
			type,
			x: this.snap(point.x),
			y: this.snap(point.y),
			label: label ?? shape?.label ?? type,
			data: shape?.createData?.(),
		};
		this.graphValue.nodes.push(node);
		this.changed("add-node");
		return structuredClone(node);
	}

	public addEdge(
		source: string,
		target: string,
		type = "edge",
		sourcePort?: TpGraphPort,
		targetPort?: TpGraphPort,
		direction: TpGraphEdgeDirection = this.activeEdgeDirection,
		routing: TpGraphEdgeRouting = this.activeEdgeRouting,
	): TpGraphEdge {
		this.validateConnection(source, target, type);
		const edge: TpGraphEdge = {
			id: this.nextId("edge"),
			source,
			target,
			type,
			sourcePort,
			targetPort,
			direction,
			routing,
			...(routing === "orthogonal"
				? {
						elbows: this.activeEdgeElbows,
						departure: this.activeEdgeDeparture,
						turns: this.activeEdgeTurns,
					}
				: {}),
		};
		this.normalizeSelfLink(edge);
		this.graphValue.edges.push(edge);
		this.changed("add-edge");
		return structuredClone(edge);
	}

	public addMeasurement(
		edgeId: string,
		position = 0.5,
		label?: string,
	): TpGraphMeasurement {
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === edgeId,
		);
		if (!edge) throw new TypeError(`Unknown graph edge: ${edgeId}`);
		const measurement: TpGraphMeasurement = {
			id: this.nextId("measurement"),
			position: Math.min(1, Math.max(0, position)),
			...(label?.trim() ? { label: label.trim() } : {}),
		};
		edge.data = {
			...(edge.data ?? {}),
			measurements: [...graphEdgeMeasurements(edge), measurement],
		};
		this.changed("add-measurement");
		return structuredClone(measurement);
	}

	public moveMeasurement(id: string, position: number): void {
		const found = this.measurement(id);
		if (!found) throw new TypeError(`Unknown graph measurement: ${id}`);
		found.measurement.position = Math.min(1, Math.max(0, position));
		found.edge.data = {
			...(found.edge.data ?? {}),
			measurements: found.measurements,
		};
		this.changed("move-measurement");
	}

	public reconnectEdge(
		edgeId: string,
		endpoint: "source" | "target",
		nodeId: string,
		port: TpGraphPort,
	): TpGraphEdge {
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === edgeId,
		);
		if (!edge) throw new TypeError(`Unknown graph edge: ${edgeId}`);
		const wasSelfLink =
			edge.source !== undefined && edge.source === edge.target;
		const source = endpoint === "source" ? nodeId : edge.source;
		const target = endpoint === "target" ? nodeId : edge.target;
		if (source !== undefined && target !== undefined) {
			this.validateConnection(source, target, edge.type ?? "edge");
		}
		if (endpoint === "source") {
			edge.source = nodeId;
			edge.sourcePort = port;
			edge.sourcePoint = undefined;
		} else {
			edge.target = nodeId;
			edge.targetPort = port;
			edge.targetPoint = undefined;
		}
		if (
			!wasSelfLink &&
			edge.source !== undefined &&
			edge.source === edge.target
		) {
			edge.sourcePort = undefined;
			edge.targetPort = undefined;
		}
		this.normalizeSelfLink(edge, endpoint);
		this.changed("reconnect-edge");
		return structuredClone(edge);
	}

	public setEdgeDirection(
		edgeId: string,
		direction: TpGraphEdgeDirection,
	): void {
		if (!this.edgeDirections().includes(direction)) {
			throw new TypeError(`Unsupported edge direction: ${direction}`);
		}
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === edgeId,
		);
		if (!edge) throw new TypeError(`Unknown graph edge: ${edgeId}`);
		edge.direction = direction;
		this.activeEdgeDirection = direction;
		this.changed("set-edge-direction");
	}

	public setEdgeRouting(edgeId: string, routing: TpGraphEdgeRouting): void {
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === edgeId,
		);
		if (!edge) throw new TypeError(`Unknown graph edge: ${edgeId}`);
		edge.routing = routing;
		this.activeEdgeRouting = routing;
		this.changed("set-edge-routing");
	}

	public setEdgeOrthogonal(
		edgeId: string,
		elbows: 1 | 2 | 3,
		departure: "horizontal" | "vertical",
		turns: "alternating" | "same" = "alternating",
	): void {
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === edgeId,
		);
		if (!edge) throw new TypeError(`Unknown graph edge: ${edgeId}`);
		edge.routing = "orthogonal";
		edge.elbows = elbows;
		edge.departure = departure;
		edge.turns = elbows === 2 ? turns : "alternating";
		this.activeEdgeRouting = "orthogonal";
		this.activeEdgeElbows = elbows;
		this.activeEdgeDeparture = departure;
		this.activeEdgeTurns = edge.turns;
		this.changed("set-edge-routing");
	}

	protected validateConnection(
		source: string,
		target: string,
		_type: string,
	): void {
		const sourceNode = this.node(source);
		if (!sourceNode || !this.node(target))
			throw new TypeError("Both edge endpoints must exist.");
		if (source === target && sourceNode.type === TP_GRAPH_HUB) {
			throw new TypeError("Self-links are not allowed on hubs.");
		}
	}

	public removeElement(id: string): void {
		this.graphValue.nodes = this.graphValue.nodes.filter(
			(node) => node.id !== id,
		);
		this.graphValue.edges = this.graphValue.edges.filter(
			(edge) => edge.id !== id && edge.source !== id && edge.target !== id,
		);
		this.removeMeasurements(new Set([id]));
		this.selectedIds.delete(id);
		if (this.selectedId === id) this.selectMany([...this.selectedIds]);
		this.changed("remove");
	}

	public async step(simulatorName: string): Promise<void> {
		const simulator = this.simulators.get(simulatorName);
		if (!simulator)
			throw new TypeError(`Unknown graph simulator: ${simulatorName}`);
		const transition = await simulator(this.value);
		await this.animateTransition(transition);
		this.dispatchEvent(
			new CustomEvent("tp-graph-simulation-step", {
				bubbles: true,
				detail: { simulator: simulatorName, graph: this.value },
			}),
		);
	}

	public async animateTransition(transition: TpGraphTransition): Promise<void> {
		for (const [id, patch] of Object.entries(transition.nodes ?? {})) {
			const node = this.node(id);
			if (node) Object.assign(node, patch, { id });
		}
		for (const [id, patch] of Object.entries(transition.edges ?? {})) {
			const edge = this.graphValue.edges.find((item) => item.id === id);
			if (edge) Object.assign(edge, patch, { id });
		}
		this.render();
		const duration = Math.max(0, transition.duration ?? 300);
		for (const element of this.querySelectorAll<SVGElement>(
			"[data-node-id], [data-edge-id]",
		)) {
			element.animate?.([{ opacity: 0.55 }, { opacity: 1 }], {
				duration,
				easing: "ease-out",
			});
		}
		if (duration > 0)
			await new Promise<void>((resolve) =>
				window.setTimeout(resolve, duration),
			);
		this.changed("simulation");
	}

	private async readInitialGraph(): Promise<void> {
		if (this.src !== "") {
			const response = await fetch(this.src);
			if (!response.ok)
				throw new Error(
					`Unable to load graph JSON (${response.status} ${response.statusText}).`,
				);
			const parsed: unknown = JSON.parse(await response.text());
			this.validateGraph(parsed);
			this.sourceFilename = this.filenameFromSource(this.src);
			this.setGraph(parsed);
			return;
		}
		const source = this.readGraphSource();
		if (source === "") return;
		const parsed: unknown = JSON.parse(source);
		this.validateGraph(parsed);
		this.setGraph(parsed);
	}

	private readGraphSource(): string {
		const script = getCodeFromScript("graph", this);
		if (script !== null) {
			const source = script.value;
			if (source.trim() !== "") this.initialGraphSourceSnapshot = source;
			return source;
		}
		return this.initialGraphSourceSnapshot ?? "";
	}

	private validateGraph(value: unknown): asserts value is TpGraphDocument {
		const result = TpGraphDocumentSchema.safeParse(value);
		if (!result.success) {
			throw new TypeError(
				`Invalid tp/graph document:\n${formatGraphSchemaError(result.error)}`,
			);
		}
	}

	private normalizeSelfLinks(): void {
		for (const edge of this.graphValue.edges) this.normalizeSelfLink(edge);
	}

	private normalizeSelfLink(
		edge: TpGraphEdge,
		movedEndpoint: "source" | "target" = "target",
	): void {
		if (edge.source === undefined || edge.source !== edge.target) return;
		const ports: readonly TpGraphPort[] = ["north", "east", "south", "west"];
		const adjacentPairs: readonly (readonly [TpGraphPort, TpGraphPort])[] = [
			["east", "north"],
			["south", "west"],
			["north", "west"],
			["east", "south"],
		];
		const adjacentPorts: Record<
			TpGraphPort,
			readonly [TpGraphPort, TpGraphPort]
		> = {
			north: ["west", "east"],
			east: ["north", "south"],
			south: ["east", "west"],
			west: ["south", "north"],
		};
		const load = new Map<TpGraphPort, number>(ports.map((port) => [port, 0]));
		const pairLoad = (first: TpGraphPort, second: TpGraphPort): number =>
			this.graphValue.edges.filter(
				(candidate) =>
					candidate.id !== edge.id &&
					candidate.source === edge.source &&
					candidate.target === edge.target &&
					((candidate.sourcePort === first &&
						candidate.targetPort === second) ||
						(candidate.sourcePort === second &&
							candidate.targetPort === first)),
			).length;
		for (const candidate of this.graphValue.edges) {
			if (
				candidate.id === edge.id ||
				candidate.source !== edge.source ||
				candidate.target !== edge.target
			)
				continue;
			if (candidate.sourcePort)
				load.set(
					candidate.sourcePort,
					(load.get(candidate.sourcePort) ?? 0) + 1,
				);
			if (candidate.targetPort)
				load.set(
					candidate.targetPort,
					(load.get(candidate.targetPort) ?? 0) + 1,
				);
		}
		if (!edge.sourcePort && !edge.targetPort) {
			const pair = adjacentPairs.reduce((best, candidate) => {
				const candidateLoad =
					(load.get(candidate[0]) ?? 0) + (load.get(candidate[1]) ?? 0);
				const bestLoad = (load.get(best[0]) ?? 0) + (load.get(best[1]) ?? 0);
				if (candidateLoad !== bestLoad)
					return candidateLoad < bestLoad ? candidate : best;
				return pairLoad(candidate[0], candidate[1]) < pairLoad(best[0], best[1])
					? candidate
					: best;
			});
			[edge.sourcePort, edge.targetPort] = pair;
		} else if (edge.sourcePort && !edge.targetPort) {
			const candidates = adjacentPorts[edge.sourcePort];
			edge.targetPort = candidates.reduce((best, candidate) => {
				const candidateLoad = load.get(candidate) ?? 0;
				const bestLoad = load.get(best) ?? 0;
				if (candidateLoad !== bestLoad)
					return candidateLoad < bestLoad ? candidate : best;
				return pairLoad(edge.sourcePort as TpGraphPort, candidate) <
					pairLoad(edge.sourcePort as TpGraphPort, best)
					? candidate
					: best;
			});
		} else if (!edge.sourcePort && edge.targetPort) {
			const candidates = adjacentPorts[edge.targetPort];
			edge.sourcePort = candidates.reduce((best, candidate) => {
				const candidateLoad = load.get(candidate) ?? 0;
				const bestLoad = load.get(best) ?? 0;
				if (candidateLoad !== bestLoad)
					return candidateLoad < bestLoad ? candidate : best;
				return pairLoad(candidate, edge.targetPort as TpGraphPort) <
					pairLoad(best, edge.targetPort as TpGraphPort)
					? candidate
					: best;
			});
		}
		if (
			!edge.sourcePort ||
			!edge.targetPort ||
			edge.sourcePort !== edge.targetPort
		)
			return;
		const nextPort: Record<TpGraphPort, TpGraphPort> = {
			north: "east",
			east: "south",
			south: "west",
			west: "north",
		};
		if (movedEndpoint === "source") edge.sourcePort = nextPort[edge.targetPort];
		else edge.targetPort = nextPort[edge.sourcePort];
	}

	private render(): void {
		const currentAccordion = this.querySelector(".tp-graph-palette-accordion");
		if (currentAccordion)
			this.paletteOpenIndexes =
				currentAccordion.getAttribute("open-indexes") ?? "";
		const currentColorPreset =
			this.querySelector("tp-color")?.getAttribute("preset") ?? "tp-default";
		const currentThemeMode =
			this.querySelector("tp-theme")?.getAttribute("mode");
		const themeMode =
			currentThemeMode === "light" || currentThemeMode === "dark"
				? currentThemeMode
				: "auto";
		const currentCanvas = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
		const currentBounds = currentCanvas?.getBoundingClientRect();
		if (currentBounds && currentBounds.width > 0 && currentBounds.height > 0) {
			this.viewportPixels = { x: currentBounds.width, y: currentBounds.height };
		}
		const palettes = [...this.palettes.values()];
		const specificToolbar = this.renderToolbarActions().replaceAll(
			"<tp-icon-button ",
			'<tp-icon-button size="xs" ',
		);
		const selectedComment =
			this.selectedId === null ? undefined : this.node(this.selectedId);
		const selectedCommentColor =
			selectedComment?.type === TP_GRAPH_COMMENT
				? graphCommentColor(selectedComment.data?.color)
				: null;
		const controllerAnchor =
			this.id === "" ? "" : ` anchor="#${escapeXml(CSS.escape(this.id))}"`;
		let interfaceElement = this.querySelector<HTMLElement>(
			":scope > .tp-graph-interface",
		);
		if (!interfaceElement) {
			this.innerHTML =
				'<div class="tp-graph-interface"></div><section class="tp-graph-results" hidden></section><section class="tp-graph-code" hidden><div class="tp-graph-code-header"><h3>Graph JSON</h3><tp-icon-button size="xs" name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-action="editor-toolbar"></tp-icon-button><tp-icon-button size="xs" name="sync" label="Synchronize graph and JSON" data-action="sync-json"></tp-icon-button></div><div class="tp-graph-code-editor-slot"></div><p class="tp-graph-code-status" role="status" aria-live="polite"></p></section>';
			interfaceElement = this.querySelector<HTMLElement>(
				":scope > .tp-graph-interface",
			);
		}
		if (!interfaceElement) return;
		interfaceElement.innerHTML = `<div class="tp-graph-editor-shell">
      <aside class="tp-graph-palette" aria-label="Shape palette">
        <div class="tp-graph-palette-controls" role="toolbar" aria-label="Palette sections">
          <tp-icon-button size="xs" name="arrow-expand-vertical" label="Expand all" data-action="palette-expand"></tp-icon-button>
          <tp-icon-button size="xs" name="arrow-collapse-vertical" label="Collapse all" data-action="palette-collapse"></tp-icon-button>
        </div>
        ${this.renderPalettes(palettes)}
        ${this.renderMinimap()}
      </aside>
      <div class="tp-graph-workspace">
        <div class="tp-graph-toolbar" role="toolbar" aria-label="Graph tools">
          <tp-icon-button size="xs" name="undo" label="Undo" data-action="undo" ${this.undoStack.length === 0 || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="redo" label="Redo" data-action="redo" ${this.redoStack.length === 0 || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="select" label="Select area" data-action="select-area" class="${this.selectionMode ? "is-active" : ""}" aria-pressed="${String(this.selectionMode)}"></tp-icon-button>
          <tp-icon-button size="xs" name="content-copy" label="Copy" data-action="copy" ${this.selectedIds.size === 0 ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="content-cut" label="Cut" data-action="cut" ${this.selectedIds.size === 0 || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="content-paste" label="Paste" data-action="paste" ${this.clipboard === null || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="text-short" label="Label" data-action="label" ${this.selectedId === null || this.readonly ? "disabled" : ""}></tp-icon-button>
          <span class="tp-graph-toolbar-separator" aria-hidden="true"></span>
          <tp-icon-button size="xs" name="format-title" label="Graph title" data-action="title" ${this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="magnify-minus-outline" label="Zoom out" data-action="zoom-out"></tp-icon-button>
          <tp-icon-button size="xs" name="magnify-plus-outline" label="Zoom in" data-action="zoom-in"></tp-icon-button>
          <tp-icon-button size="xs" name="grid" label="Show or hide grid" data-action="toggle-grid" aria-pressed="${String(this.hasAttribute("grid"))}"></tp-icon-button>
          <span class="tp-graph-toolbar-separator" aria-hidden="true"></span>
          <tp-icon-button size="xs" name="file-upload" label="Import JSON" data-action="import" ${this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="file-download" label="Export JSON" data-action="export"></tp-icon-button>
          <tp-save-image${controllerAnchor} name="image-download" filename="graph" size="xs"></tp-save-image>
          <tp-icon-button size="xs" name="language-json" label="Show or hide graph JSON" data-action="toggle-json" aria-pressed="${String(this.graphCodeVisible)}"></tp-icon-button>
          <input class="tp-graph-import-input" data-role="import" type="file" accept="application/json,.json" tabindex="-1" aria-hidden="true" />
          <label class="tp-graph-comment-color-label" ${selectedCommentColor === null ? "hidden" : ""}>Color <select data-action="comment-color" ${this.readonly ? "disabled" : ""}>${GRAPH_COMMENT_COLORS.map((color) => `<option value="${color}" ${color === (selectedCommentColor ?? "neutral") ? "selected" : ""}>${color}</option>`).join("")}</select></label>
          <span class="tp-graph-toolbar-spacer"></span>
          <tp-color${controllerAnchor} preset="${escapeXml(currentColorPreset)}" size="xs"></tp-color>
          <tp-theme${controllerAnchor} mode="${themeMode}" size="xs"></tp-theme>
          <tp-fullscreen${controllerAnchor} size="xs"></tp-fullscreen>
        </div>
        <div class="tp-graph-canvas-frame">
          ${this.graphValue.title ? `<h2 class="tp-graph-title">${escapeXml(this.graphValue.title)}</h2>` : ""}
          <svg class="tp-graph-canvas" tabindex="0" role="application" aria-label="Graph editor">
            <defs><marker id="tp-graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
            <g class="tp-graph-scene" transform="translate(${-this.pan.x * this.zoomValue} ${-this.pan.y * this.zoomValue}) scale(${this.zoomValue})">
              <g class="tp-graph-edges">${this.graphValue.edges.map((edge) => this.renderEdge(edge)).join("")}</g>
              <g class="tp-graph-nodes">${this.graphValue.nodes.map((node) => this.renderNode(node)).join("")}</g>
              <g class="tp-graph-port-layer">${this.graphValue.nodes.map((node) => this.renderPortOverlay(node)).join("")}</g>
              ${this.renderSelectionDraft()}
            </g>
          </svg>
        </div>
        <div class="tp-graph-specific-toolbar" role="toolbar" aria-label="Domain tools">
          ${specificToolbar}
          <span class="tp-graph-toolbar-spacer"></span>
          <span class="tp-graph-toolbar-message" role="status" aria-live="polite">${escapeXml(this.message)}</span>
        </div>
      </div>
    </div>`;
		const results = this.renderResults();
		const resultsSection = this.querySelector<HTMLElement>(
			":scope > .tp-graph-results",
		);
		if (resultsSection) {
			resultsSection.hidden = results === "";
			resultsSection.innerHTML = results;
		}
		const codeSection = this.querySelector<HTMLElement>(
			":scope > .tp-graph-code",
		);
		if (codeSection) codeSection.hidden = !this.graphCodeVisible;
		this.syncRenderedMeasurementPositions();
		this.setPan(this.pan.x, this.pan.y);
		this.ensureGraphCodeEditor();
		this.observeCanvasViewport();
		this.bindEvents();
	}

	private observeCanvasViewport(): void {
		if (typeof ResizeObserver === "undefined") return;
		const canvas = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
		if (!canvas) return;
		this.viewportResizeObserver?.disconnect();
		this.viewportResizeObserver = new ResizeObserver((entries) => {
			const bounds = entries[0]?.contentRect;
			if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;
			if (
				Math.abs(bounds.width - this.viewportPixels.x) < 0.5 &&
				Math.abs(bounds.height - this.viewportPixels.y) < 0.5
			)
				return;
			this.viewportPixels = { x: bounds.width, y: bounds.height };
			this.render();
		});
		this.viewportResizeObserver.observe(canvas);
	}

	private ensureGraphCodeEditor(): void {
		const slot = this.querySelector<HTMLElement>(
			":scope > .tp-graph-code .tp-graph-code-editor-slot",
		);
		if (!slot) return;
		if (!this.graphCodeEditor) {
			this.graphCodeEditor = document.createElement(
				"tp-code-editor",
			) as TpCodeEditor;
			this.graphCodeEditor.className = "tp-graph-json-editor";
			this.graphCodeEditor.setAttribute("language", "json");
			this.graphCodeEditor.setAttribute("line-numbers", "");
			this.graphCodeEditor.setAttribute("fold-gutter", "");
			this.graphCodeEditor.setAttribute("word-wrap", "");
			this.graphCodeEditor.setAttribute("aria-label", "Graph JSON");
		}
		this.graphCodeEditor.toggleAttribute("readonly", this.readonly);
		if (!this.graphCodeEditor.isConnected) slot.append(this.graphCodeEditor);
		if (!this.graphCodeInitialized) {
			this.writeGraphCode(this.exportJson());
			this.graphCodeInitialized = true;
		}
		if (!this.graphCodeEditorBound) {
			this.graphCodeEditorBound = true;
			this.graphCodeEditor.addEventListener("tp-code-editor-input", (event) => {
				if (this.readonly) return;
				const source = (event as CustomEvent<{ value: string }>).detail.value;
				this.pendingGraphCodeSource = source;
				this.graphCodeEditor?.setAttribute("data-dirty", "");
			});
			this.querySelector('[data-action="sync-json"]')?.addEventListener(
				"click",
				() => this.syncGraphCode(),
			);
		}
	}

	private writeGraphCode(source: string): void {
		if (!this.graphCodeEditor) return;
		const currentSource =
			typeof this.graphCodeEditor.getValue === "function"
				? this.graphCodeEditor.getValue()
				: (this.graphCodeEditor.getAttribute("value") ?? "");
		if (currentSource === source) return;
		if (typeof this.graphCodeEditor.setValue === "function")
			this.graphCodeEditor.setValue(source);
		else this.graphCodeEditor.setAttribute("value", source);
	}

	private syncGraphCode(): void {
		if (this.pendingGraphCodeSource !== null && !this.readonly) {
			this.applyGraphCode(this.pendingGraphCodeSource);
			return;
		}
		this.writeGraphCode(this.exportJson());
		this.graphCodeEditor?.removeAttribute("data-invalid");
		const status = this.querySelector<HTMLElement>(
			":scope > .tp-graph-code .tp-graph-code-status",
		);
		if (status) status.textContent = "";
	}

	private applyGraphCode(source: string): void {
		const status = this.querySelector<HTMLElement>(
			":scope > .tp-graph-code .tp-graph-code-status",
		);
		try {
			const parsed: unknown = JSON.parse(source);
			this.validateGraph(parsed);
			this.graphValue = { ...cloneGraph(parsed), title: parsed.title ?? "" };
			this.normalizeSelfLinks();
			this.selectedId = null;
			this.selectedIds.clear();
			this.render();
			this.pendingGraphCodeSource = null;
			this.graphCodeEditor?.removeAttribute("data-invalid");
			this.graphCodeEditor?.removeAttribute("data-dirty");
			if (status) status.textContent = "";
			this.dispatchEvent(
				new CustomEvent("tp-graph-change", {
					bubbles: true,
					detail: { reason: "edit-json", graph: this.value },
				}),
			);
		} catch (error) {
			this.graphCodeEditor?.setAttribute("data-invalid", "");
			if (status)
				status.textContent =
					error instanceof Error ? error.message : "Invalid graph JSON.";
		}
	}

	private renderNode(node: TpGraphNode): string {
		const shape = this.findShape(node.type);
		const nodeWidth = shapeDimension(shape?.width, node, 64);
		const nodeHeight = shapeDimension(shape?.height, node, 64);
		const ports = shapePortNames(shape, node);
		const portMarkup = ports
			.map((port) => {
				const point = portPoint({ ...node, x: 0, y: 0 }, port, shape);
				return `<rect class="tp-graph-port" data-port="${port}" x="${point.x - 4}" y="${point.y - 4}" width="8" height="8" />`;
			})
			.join("");
		const selected = this.selectedIds.has(node.id);
		return `<g data-node-id="${escapeXml(node.id)}" class="tp-graph-node${selected ? " is-selected" : ""}" transform="translate(${node.x} ${node.y})" tabindex="0" role="button" aria-label="${escapeXml(node.label ?? node.type)}">
      ${shape?.render?.(node, selected) ?? defaultShape(node, selected)}
      <rect class="tp-graph-selection-indicator" x="${-nodeWidth / 2 - 6}" y="${-nodeHeight / 2 - 6}" width="${nodeWidth + 12}" height="${nodeHeight + 12}" rx="7" aria-hidden="true"/>
      ${portMarkup}
    </g>`;
	}

	private renderPortOverlay(node: TpGraphNode): string {
		const shape = this.findShape(node.type);
		return shapePortNames(shape, node)
			.map((port) => {
				const point = portPoint(node, port, shape);
				return `<g class="tp-graph-port-overlay">
        <rect class="tp-graph-port-hit-area" data-port="${port}" data-port-node-id="${escapeXml(node.id)}" x="${point.x - 10}" y="${point.y - 10}" width="20" height="20" />
        <rect class="tp-graph-port-overlay-visual" x="${point.x - 4}" y="${point.y - 4}" width="8" height="8" />
      </g>`;
			})
			.join("");
	}

	private renderPaletteItem(shape: TpGraphShape): string {
		const buttonId =
			shape.type === TP_GRAPH_COMMENT
				? `${this.id || "detached"}-comment-palette`
				: "";
		const button = `<button type="button" ${buttonId === "" ? "" : `id="${escapeXml(buttonId)}"`} draggable="true" data-shape="${escapeXml(shape.type)}" class="${shape.type === this.activeShapeType ? "is-active" : ""}" title="Drag to canvas — ${escapeXml(shape.description ?? shape.label)}">${this.renderPaletteShape(shape)}<span>${escapeXml(shape.label)}</span></button>`;
		if (shape.type !== TP_GRAPH_COMMENT) return button;
		const dropdown = `<tp-dropdown class="tp-graph-comment-color-dropdown" anchor="#${escapeXml(CSS.escape(buttonId))}" placement="end" offset="4px" outside-click><ul class="tp-graph-comment-color-grid" role="menu" aria-label="Comment color">${GRAPH_COMMENT_COLORS.map((color) => `<li role="menuitem" tabindex="0" data-comment-palette-color="${color}" aria-label="${color}" title="${color}"><span class="tp-graph-comment-palette-swatch tp-graph-comment-swatch-${color}" aria-hidden="true"></span></li>`).join("")}</ul></tp-dropdown>`;
		return `<div class="tp-graph-palette-comment-control">${button}${dropdown}</div>`;
	}

	protected edgeDirections(): readonly TpGraphEdgeDirection[] {
		return ["none", "both", "forward", "backward"];
	}

	protected graphWorldBounds(): Readonly<{
		minX: number;
		minY: number;
		maxX: number;
		maxY: number;
	}> | null {
		return null;
	}

	private renderPalettes(palettes: readonly TpGraphPalette[]): string {
		const openIndexes =
			this.paletteOpenIndexes === ""
				? ""
				: ` open-indexes="${escapeXml(this.paletteOpenIndexes)}"`;
		return `<tp-accordion class="tp-graph-palette-accordion" multiple${openIndexes}><dl>${palettes.map((palette) => `<dt>${escapeXml(palette.label)}</dt><dd data-palette-id="${escapeXml(palette.id)}"><div class="tp-graph-palette-items">${palette.shapes.map((shape) => this.renderPaletteItem(shape)).join("")}</div></dd>`).join("")}${this.renderEdgePalette()}</dl></tp-accordion>`;
	}

	private renderMinimap(): string {
		const viewportWidth = this.viewportPixels.x / this.zoomValue;
		const viewportHeight = this.viewportPixels.y / this.zoomValue;
		const extents = this.graphValue.nodes.map((node) => {
			const shape = this.findShape(node.type);
			const halfWidth = shapeDimension(shape?.width, node, 64) / 2;
			const halfHeight = shapeDimension(shape?.height, node, 64) / 2;
			return {
				left: node.x - halfWidth,
				right: node.x + halfWidth,
				top: node.y - halfHeight,
				bottom: node.y + halfHeight,
			};
		});
		const worldBounds = this.graphWorldBounds();
		const padding = 40;
		const minX =
			Math.min(
				...extents.map((extent) => extent.left),
				worldBounds?.minX ?? 0,
				0,
			) - padding;
		const minY =
			Math.min(
				...extents.map((extent) => extent.top),
				worldBounds?.minY ?? 0,
				0,
			) - padding;
		const maxX =
			Math.max(
				...extents.map((extent) => extent.right),
				worldBounds?.maxX ?? viewportWidth,
				viewportWidth,
			) + padding;
		const maxY =
			Math.max(
				...extents.map((extent) => extent.bottom),
				worldBounds?.maxY ?? viewportHeight,
				viewportHeight,
			) + padding;
		const width = Math.max(1, maxX - minX);
		const height = Math.max(1, maxY - minY);
		const edges = this.graphValue.edges
			.map((edge) => {
				const points = this.edgePoints(edge);
				return points
					? `<path d="${this.edgePath(edge, points.start, points.end)}" />`
					: "";
			})
			.join("");
		const nodes = this.graphValue.nodes
			.map((node) => {
				const shape = this.findShape(node.type);
				const nodeWidth = shapeDimension(shape?.width, node, 64);
				const nodeHeight = shapeDimension(shape?.height, node, 64);
				return `<rect x="${node.x - nodeWidth / 2}" y="${node.y - nodeHeight / 2}" width="${nodeWidth}" height="${nodeHeight}" rx="3" />`;
			})
			.join("");
		return `<div class="tp-graph-minimap"><svg viewBox="${minX} ${minY} ${width} ${height}" data-minimap-min-x="${minX}" data-minimap-min-y="${minY}" data-minimap-width="${width}" data-minimap-height="${height}" role="img" aria-label="Graph overview">
      <g class="tp-graph-minimap-edges">${edges}</g>
      <g class="tp-graph-minimap-nodes">${nodes}</g>
      <rect class="tp-graph-minimap-viewport" data-minimap-viewport x="${this.pan.x}" y="${this.pan.y}" width="${viewportWidth}" height="${viewportHeight}" />
    </svg></div>`;
	}

	private renderSelectionDraft(): string {
		if (!this.selectionDraft) return "";
		const x = Math.min(
			this.selectionDraft.start.x,
			this.selectionDraft.current.x,
		);
		const y = Math.min(
			this.selectionDraft.start.y,
			this.selectionDraft.current.y,
		);
		const width = Math.abs(
			this.selectionDraft.current.x - this.selectionDraft.start.x,
		);
		const height = Math.abs(
			this.selectionDraft.current.y - this.selectionDraft.start.y,
		);
		return `<rect class="tp-graph-selection-area" x="${x}" y="${y}" width="${width}" height="${height}" aria-hidden="true" />`;
	}

	private renderEdgePalette(): string {
		const directions = this.edgeDirections();
		if (directions.length === 0) return "";
		const selectedEdge = this.graphValue.edges.find(
			(edge) => edge.id === this.selectedId,
		);
		const displayedDirection =
			selectedEdge?.direction ??
			(selectedEdge ? "forward" : this.activeEdgeDirection);
		const label: Record<TpGraphEdgeDirection, string> = {
			none: "No arrow",
			forward: "Forward",
			backward: "Backward",
			both: "Bidirectional",
		};
		const selectedRouting = selectedEdge?.routing ?? this.activeEdgeRouting;
		const selectedElbows = selectedEdge?.elbows ?? this.activeEdgeElbows;
		const selectedDeparture =
			selectedEdge?.departure ?? this.activeEdgeDeparture;
		const selectedTurns = selectedEdge?.turns ?? this.activeEdgeTurns;
		return `<dt>Links</dt><dd><div class="tp-graph-palette-items"><tp-button-group class="tp-graph-link-button-group tp-graph-direction-group" attached>${directions
			.map((direction) => {
				const markerStart =
					direction === "backward" || direction === "both"
						? ' marker-start="url(#tp-graph-palette-arrow)"'
						: "";
				const markerEnd =
					direction === "forward" || direction === "both"
						? ' marker-end="url(#tp-graph-palette-arrow)"'
						: "";
				return `<button type="button" data-edge-direction="${direction}" class="${direction === displayedDirection ? "is-active" : ""}" title="${label[direction]}" aria-label="${label[direction]}"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><defs><marker id="tp-graph-palette-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" /></marker></defs><path class="tp-graph-palette-edge" d="M5 16L47 16"${markerStart}${markerEnd} /></svg></button>`;
			})
			.join("")}</tp-button-group>
      <tp-button-group class="tp-graph-link-button-group tp-graph-routing-group" attached>
      <button type="button" data-edge-routing="straight" class="${selectedRouting === "straight" ? "is-active" : ""}" title="Straight" aria-label="Straight"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><path class="tp-graph-palette-edge" d="M5 24L47 8" /></svg></button>
      ${([1, 2, 3] as const)
				.flatMap((elbows) =>
					(["horizontal", "vertical"] as const).map((departure) => {
						const path =
							elbows === 1
								? departure === "horizontal"
									? "M5 24H47V8"
									: "M5 24V8H47"
								: elbows === 2
									? departure === "horizontal"
										? "M5 24H22V8H47"
										: "M5 24V16H47V8"
									: departure === "horizontal"
										? "M5 24H18V8H36V20H47"
										: "M5 24V16H25V8H47";
						const label = `${elbows} corner${elbows === 1 ? "" : "s"} · ${departure === "horizontal" ? "H" : "V"}`;
						const active =
							selectedRouting === "orthogonal" &&
							selectedElbows === elbows &&
							selectedDeparture === departure &&
							selectedTurns !== "same";
						return `<button type="button" data-edge-orthogonal data-edge-elbows="${elbows}" data-edge-departure="${departure}" data-edge-turns="alternating" class="${active ? "is-active" : ""}" title="${label}" aria-label="${label}"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><path class="tp-graph-palette-edge" d="${path}" /></svg></button>`;
					}),
				)
				.join("")}
      ${(["horizontal", "vertical"] as const)
				.map((departure) => {
					const path =
						departure === "horizontal" ? "M5 24H47V8H30" : "M5 24V4H47V16";
					const label = `2 corners · ${departure === "horizontal" ? "H" : "V"} same`;
					const active =
						selectedRouting === "orthogonal" &&
						selectedElbows === 2 &&
						selectedDeparture === departure &&
						selectedTurns === "same";
					return `<button type="button" data-edge-orthogonal data-edge-elbows="2" data-edge-departure="${departure}" data-edge-turns="same" class="${active ? "is-active" : ""}" title="${label}" aria-label="${label}"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><path class="tp-graph-palette-edge" d="${path}" /></svg></button>`;
				})
				.join("")}</tp-button-group></div></dd>`;
	}

	private renderPaletteShape(shape: TpGraphShape): string {
		const previewNode: TpGraphNode = {
			id: "preview",
			type: shape.type,
			x: 0,
			y: 0,
			label: "",
			data: shape.createData?.(),
		};
		if (shape.type === TP_GRAPH_COMMENT)
			previewNode.data = {
				...(previewNode.data ?? {}),
				color: this.commentPaletteColor,
			};
		const width = shapeDimension(shape.width, previewNode, 64);
		const height = shapeDimension(shape.height, previewNode, 64);
		const padding = 8;
		const content =
			shape.render?.(previewNode, false) ?? defaultShape(previewNode, false);
		return `<svg class="tp-graph-palette-preview" viewBox="${-width / 2 - padding} ${-height / 2 - padding} ${width + padding * 2} ${height + padding * 2}" aria-hidden="true" focusable="false"><g>${content}</g></svg>`;
	}

	private renderEdge(edge: TpGraphEdge): string {
		const points = this.edgePoints(edge);
		if (!points) return "";
		const { start, end } = points;
		const selected = this.selectedIds.has(edge.id) ? " is-selected" : "";
		const active = edge.state?.active === true ? " is-active" : "";
		const signal =
			edge.state?.value === true
				? " is-true"
				: edge.state?.value === false
					? " is-false"
					: "";
		const selfLink = this.selfLinkGeometry(edge, start, end);
		const labelPoint =
			selfLink?.labelPoint ??
			(edge.routing === "orthogonal"
				? this.orthogonalLabelPoint(edge, start, end)
				: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 8 });
		const path = selfLink?.path ?? this.edgePath(edge, start, end);
		const movableBends =
			edge.routing === "orthogonal" && (edge.elbows ?? 2) >= 2 && !selfLink;
		const departure = edge.departure ?? "horizontal";
		const sameTurns = edge.turns === "same";
		const defaultBendX = sameTurns
			? end.x >= start.x
				? Math.max(start.x, end.x) + 60
				: Math.min(start.x, end.x) - 60
			: (start.x + end.x) / 2;
		const defaultBendY = sameTurns
			? end.y >= start.y
				? Math.max(start.y, end.y) + 60
				: Math.min(start.y, end.y) - 60
			: (start.y + end.y) / 2;
		const bendX =
			movableBends && (departure === "horizontal" || edge.elbows === 3)
				? (edge.bendX ?? defaultBendX)
				: null;
		const bendY =
			movableBends && (departure === "vertical" || edge.elbows === 3)
				? (edge.bendY ?? defaultBendY)
				: null;
		const direction = edge.direction ?? "forward";
		const markerStart =
			direction === "backward" || direction === "both"
				? ' marker-start="url(#tp-graph-arrow)"'
				: "";
		const markerEnd =
			direction === "forward" || direction === "both"
				? ' marker-end="url(#tp-graph-arrow)"'
				: "";
		const measurements = graphEdgeMeasurements(edge)
			.map((measurement) => {
				const point = this.edgePointAt(edge, measurement.position);
				const measurementSelected = this.selectedIds.has(measurement.id)
					? " is-selected"
					: "";
				return `<g data-measurement-id="${escapeXml(measurement.id)}" data-measurement-edge-id="${escapeXml(edge.id)}" class="tp-graph-measurement${measurementSelected}" transform="translate(${point.x} ${point.y})" tabindex="0">
        <rect class="tp-graph-measurement-shape" x="-5" y="-5" width="10" height="10" />
        ${measurement.label ? `<text class="tp-graph-measurement-label" x="0" y="-10" text-anchor="middle">${escapeXml(measurement.label)}</text>` : ""}
      </g>`;
			})
			.join("");
		return `<g data-edge-id="${escapeXml(edge.id)}" class="tp-graph-edge${selected}${active}${signal}" tabindex="0">
      <path class="tp-graph-edge-hit-area" d="${path}" />
      <path class="tp-graph-edge-bridge" d="${path}" />
      <path class="tp-graph-edge-line" d="${path}"${markerStart}${markerEnd} />
      ${edge.label ? `<text x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="middle">${escapeXml(edge.label)}</text>` : ""}
      <circle class="tp-graph-edge-handle" data-edge-endpoint="source" cx="${start.x}" cy="${start.y}" r="6" />
      <circle class="tp-graph-edge-handle" data-edge-endpoint="target" cx="${end.x}" cy="${end.y}" r="6" />
      ${bendX === null ? "" : `<rect class="tp-graph-edge-handle tp-graph-edge-bend-handle" data-edge-bend data-edge-bend-axis="x" x="${bendX - 5}" y="${(start.y + end.y) / 2 - 8}" width="10" height="16" rx="2" />`}
      ${bendY === null ? "" : `<rect class="tp-graph-edge-handle tp-graph-edge-bend-handle is-horizontal" data-edge-bend data-edge-bend-axis="y" x="${(start.x + end.x) / 2 - 8}" y="${bendY - 5}" width="16" height="10" rx="2" />`}
      ${measurements}
    </g>`;
	}

	private edgePointAt(
		edge: Readonly<TpGraphEdge>,
		position: number,
	): TpGraphPoint {
		const points = this.edgePolyline(edge);
		if (points.length < 2) return points[0] ?? { x: 0, y: 0 };
		const lengths = points
			.slice(1)
			.map((point, index) =>
				Math.hypot(
					point.x - (points[index]?.x ?? 0),
					point.y - (points[index]?.y ?? 0),
				),
			);
		const total = lengths.reduce((sum, length) => sum + length, 0);
		let remaining = Math.min(1, Math.max(0, position)) * total;
		for (const [index, length] of lengths.entries()) {
			if (remaining <= length || index === lengths.length - 1) {
				const start = points[index] ?? points[0] ?? { x: 0, y: 0 };
				const end = points[index + 1] ?? start;
				const ratio = length === 0 ? 0 : remaining / length;
				return {
					x: start.x + (end.x - start.x) * ratio,
					y: start.y + (end.y - start.y) * ratio,
				};
			}
			remaining -= length;
		}
		return points.at(-1) ?? { x: 0, y: 0 };
	}

	private edgePolyline(edge: Readonly<TpGraphEdge>): TpGraphPoint[] {
		const endpoints = this.edgePoints(edge);
		if (!endpoints) return [];
		const { start, end } = endpoints;
		if (edge.routing !== "orthogonal") return [start, end];
		const departure = edge.departure ?? "horizontal";
		if ((edge.elbows ?? 2) === 1)
			return departure === "horizontal"
				? [start, { x: end.x, y: start.y }, end]
				: [start, { x: start.x, y: end.y }, end];
		if (edge.elbows === 3) {
			const x = edge.bendX ?? (start.x + end.x) / 2;
			const y = edge.bendY ?? (start.y + end.y) / 2;
			return departure === "vertical"
				? [start, { x: start.x, y }, { x, y }, { x, y: end.y }, end]
				: [start, { x, y: start.y }, { x, y }, { x: end.x, y }, end];
		}
		if (departure === "vertical") {
			const y =
				edge.bendY ??
				(edge.turns === "same"
					? end.y >= start.y
						? Math.max(start.y, end.y) + 60
						: Math.min(start.y, end.y) - 60
					: (start.y + end.y) / 2);
			return [start, { x: start.x, y }, { x: end.x, y }, end];
		}
		const x =
			edge.bendX ??
			(edge.turns === "same"
				? end.x >= start.x
					? Math.max(start.x, end.x) + 60
					: Math.min(start.x, end.x) - 60
				: (start.x + end.x) / 2);
		return [start, { x, y: start.y }, { x, y: end.y }, end];
	}

	private edgePositionNear(edgeId: string, point: TpGraphPoint): number {
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === edgeId,
		);
		if (!edge) return 0.5;
		const path = this.querySelector<SVGPathElement>(
			`[data-edge-id="${CSS.escape(edgeId)}"] .tp-graph-edge-line`,
		);
		if (
			path &&
			typeof path.getTotalLength === "function" &&
			typeof path.getPointAtLength === "function"
		) {
			const total = path.getTotalLength();
			let bestPosition = 0;
			let bestDistance = Number.POSITIVE_INFINITY;
			for (let index = 0; index <= 100; index += 1) {
				const position = index / 100;
				const candidate = path.getPointAtLength(position * total);
				const distance = Math.hypot(
					candidate.x - point.x,
					candidate.y - point.y,
				);
				if (distance < bestDistance) {
					bestDistance = distance;
					bestPosition = position;
				}
			}
			return bestPosition;
		}
		let bestPosition = 0;
		let bestDistance = Number.POSITIVE_INFINITY;
		for (let index = 0; index <= 100; index += 1) {
			const position = index / 100;
			const candidate = this.edgePointAt(edge, position);
			const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
			if (distance < bestDistance) {
				bestDistance = distance;
				bestPosition = position;
			}
		}
		return bestPosition;
	}

	private syncRenderedMeasurementPositions(): void {
		for (const edge of this.graphValue.edges) {
			const path = this.querySelector<SVGPathElement>(
				`[data-edge-id="${CSS.escape(edge.id)}"] .tp-graph-edge-line`,
			);
			if (
				!path ||
				typeof path.getTotalLength !== "function" ||
				typeof path.getPointAtLength !== "function"
			)
				continue;
			const total = path.getTotalLength();
			for (const measurement of graphEdgeMeasurements(edge)) {
				const point = path.getPointAtLength(measurement.position * total);
				this.querySelector<SVGGElement>(
					`[data-measurement-id="${CSS.escape(measurement.id)}"]`,
				)?.setAttribute("transform", `translate(${point.x} ${point.y})`);
			}
		}
	}

	private edgePath(
		edge: Readonly<TpGraphEdge>,
		start: TpGraphPoint,
		end: TpGraphPoint,
	): string {
		const selfLink = this.selfLinkGeometry(edge, start, end);
		if (selfLink) return selfLink.path;
		if (edge.source !== undefined && edge.target !== undefined) {
			if (edge.routing === "orthogonal") {
				const departure = edge.departure ?? "horizontal";
				if ((edge.elbows ?? 2) === 1) {
					return departure === "horizontal"
						? `M ${start.x} ${start.y} H ${end.x} V ${end.y}`
						: `M ${start.x} ${start.y} V ${end.y} H ${end.x}`;
				}
				if (edge.elbows === 3) {
					const middleX = edge.bendX ?? (start.x + end.x) / 2;
					const middleY = edge.bendY ?? (start.y + end.y) / 2;
					return departure === "vertical"
						? `M ${start.x} ${start.y} V ${middleY} H ${middleX} V ${end.y} H ${end.x}`
						: `M ${start.x} ${start.y} H ${middleX} V ${middleY} H ${end.x} V ${end.y}`;
				}
				if (departure === "vertical") {
					const middleY =
						edge.bendY ??
						(edge.turns === "same"
							? end.y >= start.y
								? Math.max(start.y, end.y) + 60
								: Math.min(start.y, end.y) - 60
							: (start.y + end.y) / 2);
					return `M ${start.x} ${start.y} V ${middleY} H ${end.x} V ${end.y}`;
				}
				const middleX =
					edge.bendX ??
					(edge.turns === "same"
						? end.x >= start.x
							? Math.max(start.x, end.x) + 60
							: Math.min(start.x, end.x) - 60
						: (start.x + end.x) / 2);
				return `M ${start.x} ${start.y} H ${middleX} V ${end.y} H ${end.x}`;
			}
			const siblings = this.graphValue.edges
				.filter(
					(candidate) =>
						candidate.source !== undefined &&
						candidate.target !== undefined &&
						((candidate.source === edge.source &&
							candidate.target === edge.target) ||
							(candidate.source === edge.target &&
								candidate.target === edge.source)),
				)
				.sort((first, second) => first.id.localeCompare(second.id));
			if (siblings.length > 1) {
				const index = siblings.findIndex(
					(candidate) => candidate.id === edge.id,
				);
				const offset = (index - (siblings.length - 1) / 2) * 28;
				const dx = end.x - start.x;
				const dy = end.y - start.y;
				const length = Math.max(1, Math.hypot(dx, dy));
				const controlX = (start.x + end.x) / 2 - (dy / length) * offset;
				const controlY = (start.y + end.y) / 2 + (dx / length) * offset;
				return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
			}
		}
		return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
	}

	private orthogonalLabelPoint(
		edge: Readonly<TpGraphEdge>,
		start: Readonly<TpGraphPoint>,
		end: Readonly<TpGraphPoint>,
	): TpGraphPoint {
		const departure = edge.departure ?? "horizontal";
		if ((edge.elbows ?? 2) === 1) {
			return {
				x: (start.x + end.x) / 2,
				y: (departure === "horizontal" ? start.y : end.y) - 8,
			};
		}
		if (edge.elbows === 3) {
			const middleX = edge.bendX ?? (start.x + end.x) / 2;
			const middleY = edge.bendY ?? (start.y + end.y) / 2;
			return departure === "vertical"
				? { x: (start.x + middleX) / 2, y: middleY - 8 }
				: { x: (middleX + end.x) / 2, y: middleY - 8 };
		}
		if (departure === "vertical") {
			const middleY =
				edge.bendY ??
				(edge.turns === "same"
					? end.y >= start.y
						? Math.max(start.y, end.y) + 60
						: Math.min(start.y, end.y) - 60
					: (start.y + end.y) / 2);
			return { x: (start.x + end.x) / 2, y: middleY - 8 };
		}
		const middleX =
			edge.bendX ??
			(edge.turns === "same"
				? end.x >= start.x
					? Math.max(start.x, end.x) + 60
					: Math.min(start.x, end.x) - 60
				: (start.x + end.x) / 2);
		const firstLength = Math.abs(middleX - start.x);
		const secondLength = Math.abs(end.x - middleX);
		return firstLength >= secondLength
			? { x: (start.x + middleX) / 2, y: start.y - 8 }
			: { x: (middleX + end.x) / 2, y: end.y - 8 };
	}

	private selfLinkGeometry(
		edge: Readonly<TpGraphEdge>,
		start: TpGraphPoint,
		end: TpGraphPoint,
	): { path: string; labelPoint: TpGraphPoint } | null {
		if (edge.source !== undefined && edge.source === edge.target) {
			const siblings = this.graphValue.edges
				.filter(
					(candidate) =>
						candidate.source === edge.source &&
						candidate.target === edge.target &&
						(candidate.sourcePort ?? "east") === (edge.sourcePort ?? "east") &&
						(candidate.targetPort ?? "north") === (edge.targetPort ?? "north"),
				)
				.sort((first, second) => first.id.localeCompare(second.id));
			const level = Math.max(
				0,
				siblings.findIndex((candidate) => candidate.id === edge.id),
			);
			const sourcePort = edge.sourcePort ?? "east";
			const targetPort = edge.targetPort ?? "north";
			const normal: Record<TpGraphPort, TpGraphPoint> = {
				north: { x: 0, y: -1 },
				east: { x: 1, y: 0 },
				south: { x: 0, y: 1 },
				west: { x: -1, y: 0 },
			};
			const minimumRadius = Math.hypot(end.x - start.x, end.y - start.y) / 2;
			const node = this.node(edge.source);
			const shape = node ? this.findShape(node.type) : undefined;
			const radiusGap = node
				? Math.max(
						18,
						Math.max(
							shapeDimension(shape?.width, node, 64),
							shapeDimension(shape?.height, node, 64),
						) * 0.3,
					)
				: 18;
			const radius = minimumRadius + radiusGap * (level + 1);
			const cross =
				normal[sourcePort].x * normal[targetPort].y -
				normal[sourcePort].y * normal[targetPort].x;
			const sweep = cross > 0 ? 1 : 0;
			const halfDx = (start.x - end.x) / 2;
			const halfDy = (start.y - end.y) / 2;
			const halfChordSquared = halfDx * halfDx + halfDy * halfDy;
			const coefficientSign = sweep === 1 ? -1 : 1;
			const coefficient =
				coefficientSign *
				Math.sqrt(
					Math.max(0, (radius * radius - halfChordSquared) / halfChordSquared),
				);
			const center = {
				x: (start.x + end.x) / 2 + coefficient * halfDy,
				y: (start.y + end.y) / 2 - coefficient * halfDx,
			};
			const labelDirection = node
				? { x: center.x - node.x, y: center.y - node.y }
				: { x: 0, y: -1 };
			const labelDirectionLength = Math.max(
				1,
				Math.hypot(labelDirection.x, labelDirection.y),
			);
			return {
				path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 ${sweep} ${end.x} ${end.y}`,
				labelPoint: {
					x:
						center.x + (labelDirection.x / labelDirectionLength) * (radius + 8),
					y:
						center.y + (labelDirection.y / labelDirectionLength) * (radius + 8),
				},
			};
		}
		return null;
	}

	private edgePoints(
		edge: Readonly<TpGraphEdge>,
	): { start: TpGraphPoint; end: TpGraphPoint } | null {
		const source =
			edge.source === undefined ? undefined : this.node(edge.source);
		const target =
			edge.target === undefined ? undefined : this.node(edge.target);
		const sourceToward = target ?? edge.targetPoint;
		const targetToward = source ?? edge.sourcePoint;
		const selfLink = source !== undefined && source === target;
		const start =
			source && sourceToward
				? portPoint(
						source,
						edge.sourcePort ??
							(selfLink
								? "east"
								: closestPort(
										source,
										sourceToward,
										this.findShape(source.type),
									)),
						this.findShape(source.type),
					)
				: edge.sourcePoint;
		const end =
			target && targetToward
				? portPoint(
						target,
						edge.targetPort ??
							(selfLink
								? "north"
								: closestPort(
										target,
										targetToward,
										this.findShape(target.type),
									)),
						this.findShape(target.type),
					)
				: edge.targetPoint;
		return start && end ? { start, end } : null;
	}

	private bindEvents(): void {
		for (const button of this.querySelectorAll<HTMLButtonElement>(
			"[data-edge-direction]",
		)) {
			button.addEventListener("click", () => {
				const direction = button.dataset.edgeDirection;
				if (
					direction === "none" ||
					direction === "forward" ||
					direction === "backward" ||
					direction === "both"
				) {
					const selectedEdge = this.graphValue.edges.find(
						(edge) => edge.id === this.selectedId,
					);
					if (selectedEdge) this.setEdgeDirection(selectedEdge.id, direction);
					else {
						this.activeEdgeDirection = direction;
						this.render();
					}
				}
			});
		}
		for (const button of this.querySelectorAll<HTMLButtonElement>(
			"[data-edge-routing]",
		)) {
			button.addEventListener("click", () => {
				const routing = button.dataset.edgeRouting;
				if (routing !== "straight" && routing !== "orthogonal") return;
				const selectedEdge = this.graphValue.edges.find(
					(edge) => edge.id === this.selectedId,
				);
				if (selectedEdge) this.setEdgeRouting(selectedEdge.id, routing);
				else {
					this.activeEdgeRouting = routing;
					this.render();
				}
			});
		}
		for (const button of this.querySelectorAll<HTMLButtonElement>(
			"[data-edge-orthogonal]",
		)) {
			button.addEventListener("click", () => {
				const elbows = Number(button.dataset.edgeElbows);
				const departure = button.dataset.edgeDeparture;
				const turns =
					button.dataset.edgeTurns === "same" ? "same" : "alternating";
				if (
					(elbows !== 1 && elbows !== 2 && elbows !== 3) ||
					(departure !== "horizontal" && departure !== "vertical")
				)
					return;
				const selectedEdge = this.graphValue.edges.find(
					(edge) => edge.id === this.selectedId,
				);
				if (selectedEdge)
					this.setEdgeOrthogonal(selectedEdge.id, elbows, departure, turns);
				else {
					this.activeEdgeRouting = "orthogonal";
					this.activeEdgeElbows = elbows;
					this.activeEdgeDeparture = departure;
					this.activeEdgeTurns = turns;
					this.render();
				}
			});
		}
		for (const button of this.querySelectorAll<HTMLButtonElement>(
			"[data-shape]",
		)) {
			button.addEventListener("click", () => {
				this.activeShapeType = button.dataset.shape ?? "node";
				if (this.activeShapeType === TP_GRAPH_COMMENT) {
					const dropdown = this.querySelector<
						HTMLElement & { toggle: () => void }
					>(".tp-graph-comment-color-dropdown");
					dropdown?.toggle();
				} else {
					this.render();
				}
			});
			button.addEventListener("dragstart", (event) => {
				const type = button.dataset.shape;
				if (!type || !event.dataTransfer) return;
				event.dataTransfer.effectAllowed = "copy";
				event.dataTransfer.setData("application/x-tp-graph-shape", type);
				event.dataTransfer.setData("text/plain", type);
			});
		}
		for (const item of this.querySelectorAll<HTMLElement>(
			"[data-comment-palette-color]",
		)) {
			const chooseColor = (): void => {
				this.commentPaletteColor = graphCommentColor(
					item.dataset.commentPaletteColor,
				);
				this.querySelector(".tp-graph-comment-color-dropdown")?.removeAttribute(
					"open",
				);
				this.render();
			};
			item.addEventListener("click", chooseColor);
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") chooseColor();
			});
		}
		this.querySelector('[data-action="select-area"]')?.addEventListener(
			"click",
			() => {
				this.selectionMode = !this.selectionMode;
				this.render();
			},
		);
		this.querySelector('[data-action="undo"]')?.addEventListener("click", () =>
			this.undo(),
		);
		this.querySelector('[data-action="redo"]')?.addEventListener("click", () =>
			this.redo(),
		);
		this.querySelector('[data-action="copy"]')?.addEventListener("click", () =>
			this.copy(),
		);
		this.querySelector('[data-action="cut"]')?.addEventListener("click", () =>
			this.cut(),
		);
		this.querySelector('[data-action="paste"]')?.addEventListener("click", () =>
			this.paste(),
		);
		this.querySelector('[data-action="label"]')?.addEventListener(
			"click",
			() => {
				if (this.selectedId) this.openLabelEditor(this.selectedId);
			},
		);
		this.querySelector('[data-action="title"]')?.addEventListener("click", () =>
			this.openTitleEditor(),
		);
		this.querySelector('[data-action="zoom-in"]')?.addEventListener(
			"click",
			() => this.zoomIn(),
		);
		this.querySelector('[data-action="zoom-out"]')?.addEventListener(
			"click",
			() => this.zoomOut(),
		);
		this.querySelector('[data-action="toggle-grid"]')?.addEventListener(
			"click",
			() => {
				this.toggleAttribute("grid");
			},
		);
		this.querySelector('[data-action="export"]')?.addEventListener(
			"click",
			() => {
				void this.downloadJson();
			},
		);
		this.querySelector('[data-action="palette-expand"]')?.addEventListener(
			"click",
			() => {
				const accordion = this.querySelector(".tp-graph-palette-accordion");
				const count = accordion?.querySelectorAll("dt").length ?? 0;
				this.paletteOpenIndexes = Array.from(
					{ length: count },
					(_, index) => index,
				).join(" ");
				if (this.paletteOpenIndexes === "")
					accordion?.removeAttribute("open-indexes");
				else accordion?.setAttribute("open-indexes", this.paletteOpenIndexes);
			},
		);
		this.querySelector('[data-action="palette-collapse"]')?.addEventListener(
			"click",
			() => {
				this.paletteOpenIndexes = "";
				this.querySelector(".tp-graph-palette-accordion")?.removeAttribute(
					"open-indexes",
				);
			},
		);
		this.querySelector('[data-action="toggle-json"]')?.addEventListener(
			"click",
			() => {
				this.graphCodeVisible = !this.graphCodeVisible;
				const codeSection = this.querySelector<HTMLElement>(
					":scope > .tp-graph-code",
				);
				if (codeSection) codeSection.hidden = !this.graphCodeVisible;
				this.querySelector('[data-action="toggle-json"]')?.setAttribute(
					"aria-pressed",
					String(this.graphCodeVisible),
				);
				if (this.graphCodeVisible) {
					if (this.pendingGraphCodeSource === null) {
						this.writeGraphCode(this.exportJson());
						this.graphCodeEditor?.removeAttribute("data-invalid");
						const status = this.querySelector<HTMLElement>(
							":scope > .tp-graph-code .tp-graph-code-status",
						);
						if (status) status.textContent = "";
					}
					this.graphCodeEditor?.focus();
				}
			},
		);
		this.querySelector('[data-action="editor-toolbar"]')?.addEventListener(
			"click",
			() => {
				if (this.graphCodeEditor === null) return;
				this.graphCodeEditor.toolbar = !this.graphCodeEditor.toolbar;
				this.querySelector('[data-action="editor-toolbar"]')?.setAttribute(
					"aria-pressed",
					String(this.graphCodeEditor.toolbar),
				);
			},
		);
		this.querySelector<HTMLSelectElement>(
			'[data-action="comment-color"]',
		)?.addEventListener("change", (event) => {
			if (this.selectedId && event.currentTarget instanceof HTMLSelectElement) {
				this.setCommentColor(
					this.selectedId,
					graphCommentColor(event.currentTarget.value),
				);
			}
		});
		const importInput = this.querySelector<HTMLInputElement>(
			'[data-role="import"]',
		);
		this.querySelector('[data-action="import"]')?.addEventListener(
			"click",
			() => importInput?.click(),
		);
		importInput?.addEventListener("change", () => {
			const file = importInput.files?.[0];
			if (file)
				void file.text().then((source) => {
					this.importJson(source);
					this.sourceFilename = file.name;
				});
		});
		const canvas = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
		const canvasFrame = this.querySelector<HTMLElement>(
			".tp-graph-canvas-frame",
		);
		canvasFrame?.addEventListener(
			"wheel",
			(event) => {
				const scale =
					event.deltaMode === WheelEvent.DOM_DELTA_LINE
						? 16
						: event.deltaMode === WheelEvent.DOM_DELTA_PAGE
							? this.viewportPixels.y
							: 1;
				const horizontal =
					event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
				const vertical =
					event.shiftKey && event.deltaX === 0 ? 0 : event.deltaY;
				if (
					this.setPan(
						this.pan.x + (horizontal * scale) / this.zoomValue,
						this.pan.y + (vertical * scale) / this.zoomValue,
					)
				) {
					event.preventDefault();
				}
			},
			{ passive: false },
		);
		canvas?.addEventListener("dragover", (event) => {
			if (this.readonly) return;
			event.preventDefault();
			if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
			canvas.classList.add("is-drop-target");
		});
		canvas?.addEventListener("dragleave", () =>
			canvas.classList.remove("is-drop-target"),
		);
		canvas?.addEventListener("drop", (event) => {
			canvas.classList.remove("is-drop-target");
			if (this.readonly || !event.dataTransfer) return;
			event.preventDefault();
			const type =
				event.dataTransfer.getData("application/x-tp-graph-shape") ||
				event.dataTransfer.getData("text/plain");
			if (this.findShape(type)) {
				const target = event.target instanceof Element ? event.target : null;
				this.handlePaletteDrop(type, this.svgPoint(event, canvas), target);
			}
		});
		this.bindExtensionEvents();
	}

	protected renderToolbarActions(): string {
		return "";
	}

	protected renderResults(): string {
		return "";
	}

	protected bindExtensionEvents(): void {}

	protected handlePaletteDrop(
		type: string,
		point: TpGraphPoint,
		target: Element | null,
	): void {
		if (type === TP_GRAPH_MEASUREMENT) {
			const edgeId =
				target?.closest<SVGGElement>("[data-edge-id]")?.dataset.edgeId;
			if (!edgeId) return;
			const measurement = this.addMeasurement(
				edgeId,
				this.edgePositionNear(edgeId, point),
			);
			this.select(measurement.id);
			queueMicrotask(() => this.openLabelEditor(measurement.id));
			return;
		}
		const node = this.addNode(type, point);
		if (type === TP_GRAPH_COMMENT)
			this.setCommentColor(node.id, this.commentPaletteColor);
	}

	private bindCanvasInteraction(): void {
		if (this.interactionBound) return;
		this.interactionBound = true;
		this.addEventListener("pointerdown", (event) => {
			const target = event.target instanceof Element ? event.target : null;
			if (target?.closest("[data-minimap-viewport]")) {
				this.minimapDrag = {
					startClient: { x: event.clientX, y: event.clientY },
					startPan: { ...this.pan },
				};
				event.preventDefault();
				return;
			}
			const svg = target?.closest<SVGSVGElement>(".tp-graph-canvas") ?? null;
			if (svg) this.onPointerDown(event, svg);
		});
		this.addEventListener("pointermove", (event) => {
			const svg = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
			if (svg) this.onPointerMove(event, svg);
		});
		const finishPointer = (event: PointerEvent): void => {
			if (this.measurementDrag) {
				if (event.type !== "pointercancel") this.changed("move-measurement");
				this.measurementDrag = null;
				return;
			}
			if (this.selectionDraft) {
				if (event.type !== "pointercancel") this.finishAreaSelection();
				else this.selectionDraft = null;
				this.render();
				return;
			}
			if (this.edgeBendDrag) {
				if (event.type !== "pointercancel") this.changed("move-edge-bend");
				this.edgeBendDrag = null;
				return;
			}
			if (this.minimapDrag) {
				this.minimapDrag = null;
				return;
			}
			if (this.edgeReconnectDraft) {
				if (event.type === "pointercancel") this.cancelEdgeReconnect();
				else this.finishEdgeReconnect(event);
				return;
			}
			if (this.connectionDraft) {
				this.finishConnection(event);
				return;
			}
			if (this.edgeDrag) {
				if (this.edgeDrag.moved) this.changed("move-edge");
				this.edgeDrag = null;
				return;
			}
			if (this.drag?.moved) this.changed("move-node");
			this.drag = null;
		};
		this.addEventListener("pointerup", finishPointer);
		this.addEventListener("pointercancel", finishPointer);
		this.addEventListener("dblclick", (event) => {
			if (this.readonly || this.querySelector(".tp-graph-label-editor")) return;
			const target = event.target instanceof Element ? event.target : null;
			const graphElement = target?.closest<SVGGElement>(
				"[data-node-id], [data-edge-id], [data-measurement-id]",
			);
			const id =
				graphElement?.dataset.measurementId ??
				graphElement?.dataset.nodeId ??
				graphElement?.dataset.edgeId ??
				this.selectedId;
			if (id) this.openLabelEditor(id);
		});
		this.addEventListener("click", (event) => {
			if (
				event.detail !== 2 ||
				this.readonly ||
				this.querySelector(".tp-graph-label-editor")
			)
				return;
			const target = event.target instanceof Element ? event.target : null;
			const graphElement = target?.closest<SVGGElement>(
				"[data-node-id], [data-edge-id], [data-measurement-id]",
			);
			const id =
				graphElement?.dataset.measurementId ??
				graphElement?.dataset.nodeId ??
				graphElement?.dataset.edgeId;
			if (id) this.openLabelEditor(id);
		});
		this.addEventListener("keydown", (event) => {
			const editing =
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement ||
				(event.target instanceof HTMLElement && event.target.isContentEditable);
			const shortcut = event.ctrlKey || event.metaKey;
			if (!editing && shortcut) {
				const key = event.key.toLowerCase();
				let handled = false;
				if (key === "c") handled = this.copy();
				else if (key === "x") handled = this.cut();
				else if (key === "v") handled = this.paste() !== null;
				else if (key === "z" && event.shiftKey) handled = this.redo();
				else if (key === "z") handled = this.undo();
				else if (key === "y") handled = this.redo();
				if (handled) event.preventDefault();
				return;
			}
			if (
				!editing &&
				(event.key === "Delete" ||
					event.key === "Del" ||
					event.key === "Backspace") &&
				this.selectedIds.size > 0 &&
				!this.readonly
			) {
				this.deleteSelection();
				return;
			}
			const arrowDeltas: Readonly<Record<string, TpGraphPoint>> = {
				ArrowLeft: { x: -1, y: 0 },
				ArrowRight: { x: 1, y: 0 },
				ArrowUp: { x: 0, y: -1 },
				ArrowDown: { x: 0, y: 1 },
			};
			const delta = arrowDeltas[event.key];
			if (!editing && delta && this.selectedIds.size > 0 && !this.readonly) {
				const step = event.shiftKey ? 10 : 1;
				let moved = false;
				for (const node of this.graphValue.nodes) {
					if (!this.selectedIds.has(node.id)) continue;
					node.x += delta.x * step;
					node.y += delta.y * step;
					moved = true;
				}
				if (moved) {
					event.preventDefault();
					this.changed("move-node-keyboard");
					this.querySelector<SVGSVGElement>(".tp-graph-canvas")?.focus({
						preventScroll: true,
					});
				}
			}
		});
	}

	private onPointerDown(event: PointerEvent, svg: SVGSVGElement): void {
		const target = event.target instanceof Element ? event.target : null;
		const measurementElement = target?.closest<SVGGElement>(
			"[data-measurement-id]",
		);
		const nodeElement = target?.closest<SVGGElement>("[data-node-id]");
		const portOverlay = target?.closest<SVGRectElement>("[data-port-node-id]");
		const edgeElement = target?.closest<SVGGElement>("[data-edge-id]");
		const edgeHandle = target?.closest<SVGCircleElement>(
			"[data-edge-endpoint]",
		);
		const bendHandle = target?.closest<SVGRectElement>("[data-edge-bend]");
		if (
			measurementElement?.dataset.measurementId &&
			measurementElement.dataset.measurementEdgeId
		) {
			svg.focus({ preventScroll: true });
			this.select(measurementElement.dataset.measurementId);
			if (!this.readonly)
				this.measurementDrag = {
					edgeId: measurementElement.dataset.measurementEdgeId,
					measurementId: measurementElement.dataset.measurementId,
				};
			event.preventDefault();
			return;
		}
		if (this.selectionMode && !nodeElement && !edgeElement && !portOverlay) {
			const point = this.svgPoint(event, svg);
			this.selectionDraft = { start: point, current: point };
			this.select(null);
			event.preventDefault();
			this.render();
			return;
		}
		if (edgeElement?.dataset.edgeId && bendHandle && !this.readonly) {
			this.select(edgeElement.dataset.edgeId);
			this.edgeBendDrag = {
				edgeId: edgeElement.dataset.edgeId,
				axis: bendHandle.dataset.edgeBendAxis === "y" ? "y" : "x",
			};
			return;
		}
		if (
			edgeElement?.dataset.edgeId &&
			edgeHandle?.dataset.edgeEndpoint &&
			!this.readonly
		) {
			const endpoint = edgeHandle.dataset.edgeEndpoint;
			if (endpoint === "source" || endpoint === "target") {
				this.select(edgeElement.dataset.edgeId);
				this.edgeReconnectDraft = {
					edgeId: edgeElement.dataset.edgeId,
					endpoint,
				};
				this.classList.add("is-reconnecting-edge");
				return;
			}
		}
		if (
			edgeElement?.dataset.edgeId &&
			target?.classList.contains("tp-graph-edge-hit-area")
		) {
			const id = edgeElement.dataset.edgeId;
			svg.focus({ preventScroll: true });
			this.select(id);
			if (!this.readonly) {
				const edge = this.graphValue.edges.find(
					(candidate) => candidate.id === id,
				);
				const points = edge ? this.edgePoints(edge) : null;
				if (edge && points) {
					const pointer = this.svgPoint(event, svg);
					this.edgeDrag = {
						edgeId: id,
						startClient: { x: event.clientX, y: event.clientY },
						pointer,
						source: points.start,
						target: points.end,
						bendX: edge.bendX,
						bendY: edge.bendY,
						moved: false,
					};
				}
			}
			return;
		}
		const nodeId =
			nodeElement?.dataset.nodeId ?? portOverlay?.dataset.portNodeId;
		if (nodeId) {
			const id = nodeId;
			svg.focus({ preventScroll: true });
			const port = target?.closest<SVGGraphicsElement>("[data-port]")?.dataset
				.port as TpGraphPort | undefined;
			if (port && !this.readonly) {
				this.startConnection(id, port);
				this.select(id);
				return;
			}
			const point = this.svgPoint(event, svg);
			this.select(id);
			if (!this.readonly) {
				const node = this.node(id);
				if (node) {
					this.drag = {
						id,
						offset: { x: point.x - node.x, y: point.y - node.y },
						startClient: { x: event.clientX, y: event.clientY },
						moved: false,
					};
				}
			}
			return;
		}
		if (edgeElement?.dataset.edgeId) {
			const id = edgeElement.dataset.edgeId;
			svg.focus({ preventScroll: true });
			this.select(id);
			return;
		}
		this.select(null);
	}

	private onPointerMove(event: PointerEvent, svg: SVGSVGElement): void {
		if (this.measurementDrag) {
			const found = this.measurement(this.measurementDrag.measurementId);
			if (found) {
				found.measurement.position = this.edgePositionNear(
					this.measurementDrag.edgeId,
					this.svgPoint(event, svg),
				);
				found.edge.data = {
					...(found.edge.data ?? {}),
					measurements: found.measurements,
				};
				this.render();
			}
			return;
		}
		if (this.selectionDraft) {
			this.selectionDraft.current = this.svgPoint(event, svg);
			this.render();
			return;
		}
		if (this.minimapDrag) {
			const minimap = this.querySelector<SVGSVGElement>(
				".tp-graph-minimap svg",
			);
			const bounds = minimap?.getBoundingClientRect();
			if (!minimap || !bounds || bounds.width <= 0 || bounds.height <= 0)
				return;
			const minX = Number(minimap.dataset.minimapMinX);
			const minY = Number(minimap.dataset.minimapMinY);
			const worldWidth = Number(minimap.dataset.minimapWidth);
			const worldHeight = Number(minimap.dataset.minimapHeight);
			const viewportWidth = this.viewportPixels.x / this.zoomValue;
			const viewportHeight = this.viewportPixels.y / this.zoomValue;
			const nextX =
				this.minimapDrag.startPan.x +
				((event.clientX - this.minimapDrag.startClient.x) * worldWidth) /
					bounds.width;
			const nextY =
				this.minimapDrag.startPan.y +
				((event.clientY - this.minimapDrag.startClient.y) * worldHeight) /
					bounds.height;
			this.setPan(
				Math.min(
					Math.max(nextX, minX),
					Math.max(minX, minX + worldWidth - viewportWidth),
				),
				Math.min(
					Math.max(nextY, minY),
					Math.max(minY, minY + worldHeight - viewportHeight),
				),
			);
			return;
		}
		if (this.edgeBendDrag) {
			const edge = this.graphValue.edges.find(
				(candidate) => candidate.id === this.edgeBendDrag?.edgeId,
			);
			if (edge?.routing === "orthogonal") {
				const point = this.svgPoint(event, svg);
				if (this.edgeBendDrag.axis === "x") edge.bendX = this.snap(point.x);
				else edge.bendY = this.snap(point.y);
				this.render();
			}
			return;
		}
		if (this.edgeReconnectDraft) {
			const point = this.svgPoint(event, svg);
			const edgeSelector = `[data-edge-id="${CSS.escape(this.edgeReconnectDraft.edgeId)}"]`;
			const line = this.querySelector<SVGPathElement>(
				`${edgeSelector} .tp-graph-edge-line`,
			);
			const handle = this.querySelector<SVGCircleElement>(
				`${edgeSelector} [data-edge-endpoint="${this.edgeReconnectDraft.endpoint}"]`,
			);
			const fixedHandle = this.querySelector<SVGCircleElement>(
				`${edgeSelector} [data-edge-endpoint="${this.edgeReconnectDraft.endpoint === "source" ? "target" : "source"}"]`,
			);
			const fixed = {
				x: Number(fixedHandle?.getAttribute("cx") ?? 0),
				y: Number(fixedHandle?.getAttribute("cy") ?? 0),
			};
			line?.setAttribute(
				"d",
				this.edgeReconnectDraft.endpoint === "source"
					? `M ${point.x} ${point.y} L ${fixed.x} ${fixed.y}`
					: `M ${fixed.x} ${fixed.y} L ${point.x} ${point.y}`,
			);
			handle?.setAttribute("cx", String(point.x));
			handle?.setAttribute("cy", String(point.y));
			return;
		}
		if (this.edgeDrag) {
			if (!this.edgeDrag.moved) {
				const distance = Math.hypot(
					event.clientX - this.edgeDrag.startClient.x,
					event.clientY - this.edgeDrag.startClient.y,
				);
				if (distance < 5) return;
				const edge = this.graphValue.edges.find(
					(candidate) => candidate.id === this.edgeDrag?.edgeId,
				);
				if (!edge) return;
				edge.source = undefined;
				edge.target = undefined;
				edge.sourcePort = undefined;
				edge.targetPort = undefined;
				this.edgeDrag.moved = true;
			}
			const pointer = this.svgPoint(event, svg);
			const dx = pointer.x - this.edgeDrag.pointer.x;
			const dy = pointer.y - this.edgeDrag.pointer.y;
			const start = {
				x: this.edgeDrag.source.x + dx,
				y: this.edgeDrag.source.y + dy,
			};
			const end = {
				x: this.edgeDrag.target.x + dx,
				y: this.edgeDrag.target.y + dy,
			};
			const edge = this.graphValue.edges.find(
				(candidate) => candidate.id === this.edgeDrag?.edgeId,
			);
			if (edge) {
				edge.sourcePoint = start;
				edge.targetPoint = end;
				if (this.edgeDrag.bendX !== undefined)
					edge.bendX = this.edgeDrag.bendX + dx;
				if (this.edgeDrag.bendY !== undefined)
					edge.bendY = this.edgeDrag.bendY + dy;
			}
			this.render();
			return;
		}
		if (this.connectionDraft) {
			const point = this.svgPoint(event, svg);
			const line = this.querySelector<SVGLineElement>(
				".tp-graph-connection-draft",
			);
			line?.setAttribute("x2", String(point.x));
			line?.setAttribute("y2", String(point.y));
			return;
		}
		if (!this.drag) return;
		const node = this.node(this.drag.id);
		if (!node) return;
		if (!this.drag.moved) {
			const distance = Math.hypot(
				event.clientX - this.drag.startClient.x,
				event.clientY - this.drag.startClient.y,
			);
			if (distance < 5) return;
		}
		const point = this.svgPoint(event, svg);
		this.drag.moved = true;
		node.x = this.snap(point.x - this.drag.offset.x);
		node.y = this.snap(point.y - this.drag.offset.y);
		this.render();
	}

	private svgPoint(
		event: Pick<MouseEvent, "clientX" | "clientY">,
		svg: SVGSVGElement,
	): TpGraphPoint {
		const rect = svg.getBoundingClientRect();
		return {
			x: this.pan.x + (event.clientX - rect.left) / this.zoomValue,
			y: this.pan.y + (event.clientY - rect.top) / this.zoomValue,
		};
	}

	private setPan(x: number, y: number): boolean {
		const minimap = this.querySelector<SVGSVGElement>(".tp-graph-minimap svg");
		const minX = Number(minimap?.dataset.minimapMinX ?? 0);
		const minY = Number(minimap?.dataset.minimapMinY ?? 0);
		const worldWidth = Number(
			minimap?.dataset.minimapWidth ?? this.viewportPixels.x / this.zoomValue,
		);
		const worldHeight = Number(
			minimap?.dataset.minimapHeight ?? this.viewportPixels.y / this.zoomValue,
		);
		const viewportWidth = this.viewportPixels.x / this.zoomValue;
		const viewportHeight = this.viewportPixels.y / this.zoomValue;
		const next = {
			x: Math.min(
				Math.max(x, minX),
				Math.max(minX, minX + worldWidth - viewportWidth),
			),
			y: Math.min(
				Math.max(y, minY),
				Math.max(minY, minY + worldHeight - viewportHeight),
			),
		};
		const changed =
			Math.abs(next.x - this.pan.x) >= 0.01 ||
			Math.abs(next.y - this.pan.y) >= 0.01;
		this.pan = next;
		this.querySelector<SVGGElement>(".tp-graph-scene")?.setAttribute(
			"transform",
			`translate(${-this.pan.x * this.zoomValue} ${-this.pan.y * this.zoomValue}) scale(${this.zoomValue})`,
		);
		const viewport = this.querySelector<SVGRectElement>(
			"[data-minimap-viewport]",
		);
		viewport?.setAttribute("x", String(this.pan.x));
		viewport?.setAttribute("y", String(this.pan.y));
		const canvas = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
		if (canvas)
			canvas.style.backgroundPosition = `${-this.pan.x * this.zoomValue}px ${-this.pan.y * this.zoomValue}px`;
		return changed;
	}

	private startConnection(sourceId: string, sourcePort: TpGraphPort): void {
		const source = this.node(sourceId);
		const scene = this.querySelector<SVGGElement>(".tp-graph-scene");
		if (!source || !scene) return;
		this.cancelConnection();
		this.connectionDraft = {
			sourceId,
			sourcePort,
			direction: this.activeEdgeDirection,
		};
		const point = portPoint(source, sourcePort, this.findShape(source.type));
		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.classList.add("tp-graph-connection-draft");
		line.setAttribute("x1", String(point.x));
		line.setAttribute("y1", String(point.y));
		line.setAttribute("x2", String(point.x));
		line.setAttribute("y2", String(point.y));
		line.setAttribute("marker-end", "url(#tp-graph-arrow)");
		scene.append(line);
		this.classList.add("is-connecting");
	}

	private finishEdgeReconnect(event: PointerEvent): void {
		const draft = this.edgeReconnectDraft;
		const target = event.target instanceof Element ? event.target : null;
		const pointedPort = target?.closest<SVGGraphicsElement>("[data-port]");
		const targetId =
			pointedPort?.closest<SVGGElement>("[data-node-id]")?.dataset.nodeId ??
			pointedPort?.getAttribute("data-port-node-id") ??
			undefined;
		const port = pointedPort?.dataset.port as TpGraphPort | undefined;
		if (!draft || !targetId || !port) {
			this.cancelEdgeReconnect();
			return;
		}
		const edge = this.graphValue.edges.find(
			(candidate) => candidate.id === draft.edgeId,
		);
		const fixedId = draft.endpoint === "source" ? edge?.target : edge?.source;
		const fixedPort =
			draft.endpoint === "source" ? edge?.targetPort : edge?.sourcePort;
		if (
			!edge ||
			!this.node(targetId) ||
			(targetId === fixedId && port === fixedPort)
		) {
			this.cancelEdgeReconnect();
			return;
		}
		this.edgeReconnectDraft = null;
		this.classList.remove("is-reconnecting-edge");
		try {
			this.reconnectEdge(edge.id, draft.endpoint, targetId, port);
		} catch (error) {
			this.render();
			this.dispatchEvent(
				new CustomEvent("tp-graph-error", {
					bubbles: true,
					detail: { error, operation: "reconnect-edge" },
				}),
			);
		}
	}

	private cancelEdgeReconnect(): void {
		this.edgeReconnectDraft = null;
		this.classList.remove("is-reconnecting-edge");
		this.render();
	}

	private finishConnection(event: PointerEvent): void {
		const draft = this.connectionDraft;
		const target = event.target instanceof Element ? event.target : null;
		const targetPort =
			target?.closest<SVGGraphicsElement>("[data-port]") ?? null;
		const targetId =
			targetPort?.closest<SVGGElement>("[data-node-id]")?.dataset.nodeId ??
			targetPort?.getAttribute("data-port-node-id") ??
			undefined;
		const targetPortName = targetPort?.dataset.port as TpGraphPort | undefined;
		this.cancelConnection();
		if (!draft || !targetPortName || !targetId) return;
		try {
			this.addEdge(
				draft.sourceId,
				targetId,
				undefined,
				draft.sourcePort,
				targetPortName,
				draft.direction,
			);
		} catch (error) {
			this.dispatchEvent(
				new CustomEvent("tp-graph-error", {
					bubbles: true,
					detail: { error, operation: "add-edge" },
				}),
			);
		}
	}

	private cancelConnection(): void {
		this.connectionDraft = null;
		this.querySelector(".tp-graph-connection-draft")?.remove();
		this.classList.remove("is-connecting");
	}

	private openLabelEditor(id: string): void {
		const foundMeasurement = this.measurement(id);
		const element =
			foundMeasurement?.measurement ??
			this.node(id) ??
			this.graphValue.edges.find((edge) => edge.id === id);
		if (!element) return;
		this.select(id);
		const workspace = this.querySelector<HTMLElement>(".tp-graph-workspace");
		const canvas = this.querySelector<SVGSVGElement>(".tp-graph-canvas");
		if (!workspace || !canvas) return;
		this.querySelector(".tp-graph-label-editor")?.remove();
		const input =
			this.node(id)?.type === TP_GRAPH_COMMENT
				? document.createElement("textarea")
				: document.createElement("input");
		input.className = "tp-graph-label-editor";
		if (input instanceof HTMLInputElement) input.type = "text";
		input.value = element.label ?? "";
		input.setAttribute("aria-label", "Element label");
		input.dataset.elementId = id;
		input.placeholder = "Label";
		const node = this.node(id);
		const edge = this.graphValue.edges.find((candidate) => candidate.id === id);
		const points = edge ? this.edgePoints(edge) : null;
		const graphPoint = foundMeasurement
			? this.edgePointAt(
					foundMeasurement.edge,
					foundMeasurement.measurement.position,
				)
			: node
				? { x: node.x, y: node.y }
				: {
						x: ((points?.start.x ?? 0) + (points?.end.x ?? 0)) / 2,
						y: ((points?.start.y ?? 0) + (points?.end.y ?? 0)) / 2,
					};
		const canvasRect = canvas.getBoundingClientRect();
		const workspaceRect = workspace.getBoundingClientRect();
		input.style.left = `${canvasRect.left - workspaceRect.left + (graphPoint.x - this.pan.x) * this.zoomValue}px`;
		input.style.top = `${canvasRect.top - workspaceRect.top + (graphPoint.y - this.pan.y) * this.zoomValue}px`;
		let finished = false;
		const finish = (save: boolean): void => {
			if (finished) return;
			finished = true;
			if (save) this.setElementLabel(id, input.value);
			input.remove();
		};
		input.addEventListener("keydown", (event) => {
			const keyboardEvent = event as KeyboardEvent;
			if (
				keyboardEvent.key === "Enter" &&
				(!(input instanceof HTMLTextAreaElement) ||
					keyboardEvent.ctrlKey ||
					keyboardEvent.metaKey)
			)
				finish(true);
			else if (keyboardEvent.key === "Escape") finish(false);
		});
		input.addEventListener("blur", () => finish(true));
		workspace.append(input);
		input.focus();
		input.select();
	}

	private openTitleEditor(): void {
		if (this.readonly) return;
		const workspace = this.querySelector<HTMLElement>(".tp-graph-workspace");
		if (!workspace) return;
		this.querySelector(".tp-graph-title-editor")?.remove();
		const input = document.createElement("input");
		input.className = "tp-graph-label-editor tp-graph-title-editor";
		input.type = "text";
		input.value = this.graphValue.title ?? "";
		input.placeholder = "Graph title";
		input.setAttribute("aria-label", "Graph title");
		input.style.left = "50%";
		input.style.top = "6.5rem";
		let finished = false;
		const finish = (save: boolean): void => {
			if (finished) return;
			finished = true;
			if (save) this.setTitle(input.value);
			input.remove();
		};
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter") finish(true);
			else if (event.key === "Escape") finish(false);
		});
		input.addEventListener("blur", () => finish(true));
		workspace.append(input);
		input.focus();
		input.select();
	}

	private async downloadJson(): Promise<void> {
		const target = await chooseSaveTarget({
			suggestedName: this.jsonExportFilename(),
			description: "Graph JSON",
			mimeType: "application/json",
			extension: ".json",
		});
		if (!target) return;
		const blob = new Blob([this.exportJson()], { type: "application/json" });
		await saveBlob(blob, target);
		this.dispatchEvent(
			new CustomEvent("tp-graph-export", {
				bubbles: true,
				detail: { graph: this.value },
			}),
		);
	}

	private filenameFromSource(source: string): string | null {
		try {
			const pathname = new URL(source, document.baseURI).pathname;
			const filename = decodeURIComponent(
				pathname.slice(pathname.lastIndexOf("/") + 1),
			);
			return filename === "" ? null : filename;
		} catch {
			return null;
		}
	}

	private jsonExportFilename(): string {
		if (this.sourceFilename)
			return this.sourceFilename.toLowerCase().endsWith(".json")
				? this.sourceFilename
				: `${this.sourceFilename}.json`;
		const graphType = this.localName.replace(/^tp-/, "") || "graph-editor";
		return `${graphType}.json`;
	}

	private select(id: string | null): void {
		this.selectMany(id === null ? [] : [id]);
	}

	protected selectMany(ids: readonly string[]): void {
		this.selectedIds = new Set(ids);
		this.selectedId = ids.length === 1 ? (ids[0] ?? null) : null;
		for (const element of this.querySelectorAll<SVGElement>(
			".tp-graph-node.is-selected, .tp-graph-edge.is-selected, .tp-graph-measurement.is-selected",
		)) {
			element.classList.remove("is-selected");
		}
		for (const shape of this.querySelectorAll<SVGElement>(
			".tp-graph-shape.is-selected",
		)) {
			shape.classList.remove("is-selected");
		}
		for (const id of ids) {
			const element = this.querySelector<SVGElement>(
				`[data-node-id="${CSS.escape(id)}"], [data-edge-id="${CSS.escape(id)}"], [data-measurement-id="${CSS.escape(id)}"]`,
			);
			element?.classList.add("is-selected");
			element
				?.querySelector<SVGElement>(".tp-graph-shape")
				?.classList.add("is-selected");
		}
		const labelButton = this.querySelector<HTMLButtonElement>(
			'[data-action="label"]',
		);
		if (labelButton)
			labelButton.disabled = this.selectedId === null || this.readonly;
		const copyButton = this.querySelector<HTMLButtonElement>(
			'[data-action="copy"]',
		);
		if (copyButton) copyButton.disabled = ids.length === 0;
		const cutButton = this.querySelector<HTMLButtonElement>(
			'[data-action="cut"]',
		);
		if (cutButton) cutButton.disabled = ids.length === 0 || this.readonly;
		const colorLabel = this.querySelector<HTMLElement>(
			".tp-graph-comment-color-label",
		);
		const colorSelect = this.querySelector<HTMLSelectElement>(
			'[data-action="comment-color"]',
		);
		const selectedComment =
			this.selectedId === null ? undefined : this.node(this.selectedId);
		const color =
			selectedComment?.type === TP_GRAPH_COMMENT
				? graphCommentColor(selectedComment.data?.color)
				: null;
		if (colorLabel) colorLabel.hidden = color === null;
		if (colorSelect && color !== null) colorSelect.value = color;
		this.dispatchEvent(
			new CustomEvent("tp-graph-selection-change", {
				bubbles: true,
				detail: { id: this.selectedId, ids: [...this.selectedIds] },
			}),
		);
		if (ids.length > 0)
			queueMicrotask(() =>
				this.querySelector<SVGSVGElement>(".tp-graph-canvas")?.focus({
					preventScroll: true,
				}),
			);
	}

	private finishAreaSelection(): void {
		if (!this.selectionDraft) return;
		const left = Math.min(
			this.selectionDraft.start.x,
			this.selectionDraft.current.x,
		);
		const right = Math.max(
			this.selectionDraft.start.x,
			this.selectionDraft.current.x,
		);
		const top = Math.min(
			this.selectionDraft.start.y,
			this.selectionDraft.current.y,
		);
		const bottom = Math.max(
			this.selectionDraft.start.y,
			this.selectionDraft.current.y,
		);
		const contains = (point: TpGraphPoint): boolean =>
			point.x >= left &&
			point.x <= right &&
			point.y >= top &&
			point.y <= bottom;
		const ids = this.graphValue.nodes
			.filter((node) => contains(node))
			.map((node) => node.id);
		for (const edge of this.graphValue.edges) {
			const points = this.edgePoints(edge);
			if (points && contains(points.start) && contains(points.end))
				ids.push(edge.id);
		}
		this.selectionDraft = null;
		this.selectMany(ids);
	}

	private deleteSelection(): void {
		const removedIds = new Set(this.selectedIds);
		this.graphValue.nodes = this.graphValue.nodes.filter(
			(node) => !removedIds.has(node.id),
		);
		this.graphValue.edges = this.graphValue.edges.filter(
			(edge) =>
				!removedIds.has(edge.id) &&
				(edge.source === undefined || !removedIds.has(edge.source)) &&
				(edge.target === undefined || !removedIds.has(edge.target)),
		);
		this.removeMeasurements(removedIds);
		this.select(null);
		this.changed("remove");
	}

	private changed(reason: string): void {
		if (
			JSON.stringify(this.committedGraph) !== JSON.stringify(this.graphValue)
		) {
			this.undoStack.push(cloneGraph(this.committedGraph));
			if (this.undoStack.length > 100) this.undoStack.shift();
			this.redoStack = [];
			this.committedGraph = cloneGraph(this.graphValue);
		}
		this.render();
		this.dispatchEvent(
			new CustomEvent("tp-graph-change", {
				bubbles: true,
				detail: { reason, graph: this.value },
			}),
		);
	}

	private restoreHistoryGraph(
		graph: TpGraphDocument,
		reason: "undo" | "redo",
	): void {
		this.graphValue = cloneGraph(graph);
		this.committedGraph = cloneGraph(graph);
		this.selectedId = null;
		this.selectedIds.clear();
		this.render();
		this.dispatchEvent(
			new CustomEvent("tp-graph-change", {
				bubbles: true,
				detail: { reason, graph: this.value },
			}),
		);
	}

	private node(id: string): TpGraphNode | undefined {
		return this.graphValue.nodes.find((node) => node.id === id);
	}
	private removeMeasurements(ids: ReadonlySet<string>): void {
		for (const edge of this.graphValue.edges) {
			const current = graphEdgeMeasurements(edge);
			const measurements = current.filter(
				(measurement) => !ids.has(measurement.id),
			);
			if (measurements.length !== current.length)
				edge.data = { ...(edge.data ?? {}), measurements };
		}
	}
	private measurement(id: string):
		| {
				edge: TpGraphEdge;
				measurements: TpGraphMeasurement[];
				measurement: TpGraphMeasurement;
		  }
		| undefined {
		for (const edge of this.graphValue.edges) {
			const measurements = graphEdgeMeasurements(edge);
			const measurement = measurements.find((candidate) => candidate.id === id);
			if (measurement) return { edge, measurements, measurement };
		}
		return undefined;
	}
	private findShape(type: string): TpGraphShape | undefined {
		for (const palette of this.palettes.values()) {
			const shape = palette.shapes.find((candidate) => candidate.type === type);
			if (shape) return shape;
		}
		return undefined;
	}
	private nextId(prefix: string): string {
		let id = "";
		do {
			this.idCounter += 1;
			id = `${prefix}-${this.idCounter}`;
		} while (
			this.graphValue.nodes.some((node) => node.id === id) ||
			this.graphValue.edges.some(
				(edge) =>
					edge.id === id ||
					graphEdgeMeasurements(edge).some(
						(measurement) => measurement.id === id,
					),
			)
		);
		return id;
	}
	private snap(value: number): number {
		if (!this.hasAttribute("grid")) return Math.round(value);
		const parsed = Number(this.getAttribute("grid-size"));
		const size = Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
		return Math.round(value / size) * size;
	}
}

if (!customElements.get("tp-graph-editor"))
	customElements.define("tp-graph-editor", TpGraphEditor);
