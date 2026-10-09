/**
 * @module components/graph-editor
 * @summary Extensible interactive graph editor.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../fullscreen/fullscreen.js";
import "../color/color.js";
import "../theme/theme.js";
import "../dropdown/dropdown.js";
import "../accordion/accordion.js";
import "../button-group/button-group.js";
import "../save-image/save-image.js";
import "../code-editor/code-editor.js";
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
    ports?: Partial<Record<TpGraphPort, TpGraphPoint | ((node: Readonly<TpGraphNode>) => TpGraphPoint)>> | ((node: Readonly<TpGraphNode>) => Partial<Record<TpGraphPort, TpGraphPoint>>);
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
export type TpGraphSimulator = (graph: Readonly<TpGraphDocument>) => TpGraphTransition | Promise<TpGraphTransition>;
export declare const TP_GRAPH_COMMENT = "comment";
export declare const TP_GRAPH_MEASUREMENT = "measurement";
export declare const TP_GRAPH_HUB = "hub";
export type TpGraphCommentColor = "success" | "warning" | "info" | "danger" | "brand" | "neutral";
export declare function graphEdgeMeasurements(edge: Readonly<TpGraphEdge>): TpGraphMeasurement[];
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
export declare class TpGraphEditor extends TpBase {
    private static readonly styleId;
    private static editorCounter;
    private graphValue;
    private readonly palettes;
    private readonly simulators;
    private selectedId;
    private selectedIds;
    private selectionMode;
    private selectionDraft;
    private activeShapeType;
    private drag;
    private connectionDraft;
    private edgeReconnectDraft;
    private edgeBendDrag;
    private measurementDrag;
    private minimapDrag;
    private edgeDrag;
    private idCounter;
    private initialized;
    private initializationScheduled;
    private initializationObserver;
    private interactionBound;
    private initialGraphSourceSnapshot;
    private sourceFilename;
    private zoomValue;
    private commentPaletteColor;
    protected activeEdgeDirection: TpGraphEdgeDirection;
    private activeEdgeRouting;
    private activeEdgeElbows;
    private activeEdgeDeparture;
    private activeEdgeTurns;
    private paletteOpenIndexes;
    private pan;
    private viewportPixels;
    private viewportResizeObserver;
    private graphCodeEditor;
    private graphCodeEditorBound;
    private graphCodeVisible;
    private graphCodeInitialized;
    private pendingGraphCodeSource;
    private undoStack;
    private redoStack;
    private committedGraph;
    private clipboard;
    private pasteCount;
    private static readonly minimumZoom;
    private static readonly maximumZoom;
    private static readonly zoomFactor;
    static get observedAttributes(): string[];
    constructor();
    get value(): TpGraphDocument;
    set value(graph: TpGraphDocument);
    get readonly(): boolean;
    set readonly(value: boolean);
    get src(): string;
    set src(value: string);
    get portsVisible(): boolean;
    set portsVisible(value: boolean);
    get zoom(): number;
    set zoom(value: number);
    get message(): string;
    set message(value: string);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private scheduleInitialization;
    private initializeEditor;
    setGraph(graph: TpGraphDocument): void;
    copy(): boolean;
    cut(): boolean;
    paste(): string | null;
    undo(): boolean;
    redo(): boolean;
    registerPalette(palette: TpGraphPalette): void;
    unregisterPalette(id: string): void;
    registerSimulator(name: string, simulator: TpGraphSimulator): void;
    setZoom(value: number): void;
    zoomIn(): void;
    zoomOut(): void;
    resetZoom(): void;
    exportJson(pretty?: boolean): string;
    exportSvg(): string;
    private exportContentBounds;
    importJson(source: string): void;
    setElementLabel(id: string, label: string): void;
    setTitle(title: string): void;
    setCommentColor(id: string, color: TpGraphCommentColor): void;
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection, routing?: TpGraphEdgeRouting): TpGraphEdge;
    addMeasurement(edgeId: string, position?: number, label?: string): TpGraphMeasurement;
    moveMeasurement(id: string, position: number): void;
    reconnectEdge(edgeId: string, endpoint: "source" | "target", nodeId: string, port: TpGraphPort): TpGraphEdge;
    setEdgeDirection(edgeId: string, direction: TpGraphEdgeDirection): void;
    setEdgeRouting(edgeId: string, routing: TpGraphEdgeRouting): void;
    setEdgeOrthogonal(edgeId: string, elbows: 1 | 2 | 3, departure: "horizontal" | "vertical", turns?: "alternating" | "same"): void;
    protected validateConnection(source: string, target: string, _type: string): void;
    removeElement(id: string): void;
    step(simulatorName: string): Promise<void>;
    animateTransition(transition: TpGraphTransition): Promise<void>;
    private readInitialGraph;
    private readGraphSource;
    private validateGraph;
    private normalizeSelfLinks;
    private normalizeSelfLink;
    private render;
    private observeCanvasViewport;
    private ensureGraphCodeEditor;
    private writeGraphCode;
    private syncGraphCode;
    private applyGraphCode;
    private renderNode;
    private renderPortOverlay;
    private renderPaletteItem;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected graphWorldBounds(): Readonly<{
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }> | null;
    private renderPalettes;
    private renderMinimap;
    private renderSelectionDraft;
    private renderEdgePalette;
    private renderPaletteShape;
    private renderEdge;
    private edgePointAt;
    private edgePolyline;
    private edgePositionNear;
    private syncRenderedMeasurementPositions;
    private edgePath;
    private orthogonalLabelPoint;
    private selfLinkGeometry;
    private edgePoints;
    private bindEvents;
    protected renderToolbarActions(): string;
    protected renderResults(): string;
    protected bindExtensionEvents(): void;
    protected handlePaletteDrop(type: string, point: TpGraphPoint, target: Element | null): void;
    private bindCanvasInteraction;
    private onPointerDown;
    private onPointerMove;
    private svgPoint;
    private setPan;
    private startConnection;
    private finishEdgeReconnect;
    private cancelEdgeReconnect;
    private finishConnection;
    private cancelConnection;
    private openLabelEditor;
    private openTitleEditor;
    private downloadJson;
    private filenameFromSource;
    private jsonExportFilename;
    private select;
    protected selectMany(ids: readonly string[]): void;
    private finishAreaSelection;
    private deleteSelection;
    private changed;
    private restoreHistoryGraph;
    private node;
    private removeMeasurements;
    private measurement;
    private findShape;
    private nextId;
    private snap;
}
