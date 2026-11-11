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
 * The custom `<tp-graph-editor>` element edits and animates domain-specific graphs.
 *
 * @summary Edits and animates domain-specific graphs.
 * @tagname tp-graph-editor
 * @attr {string} src = "" - URL of a tp/graph JSON document loaded at initialization.
 * @attr {boolean} readonly = false - Prevents graph editing while keeping navigation available.
 * @attr {boolean} grid = false - Displays and uses the snapping grid.
 * @attr {number} grid-size = 20 - Grid spacing in graph units.
 * @attr {boolean} ports-visible = false - Keeps attachment plots visible instead of showing them only on hover.
 * @attr {string} message = "" - Status message displayed by the graph editor.
 *
 *
 *
 * @example
 * <tp-graph-editor grid="" grid-size="20" message="Graph message area" src="/docs/components/graph-editor/examples/graph-example.json"></tp-graph-editor>
 *  @event tp-graph-change Emitted after a recorded graph mutation, JSON edit, undo or redo. reason identifies the operation and graph contains the resulting snapshot.
 * @eventdetail tp-graph-change { reason: string; graph: TpGraphDocument }
 * @event tp-graph-error Emitted when loading src or creating/reconnecting an edge fails. operation identifies the failed action; src is included only for load-src.
 * @eventdetail tp-graph-error { error: unknown; operation: "load-src" | "reconnect-edge" | "add-edge"; src?: string }
 * @event tp-graph-export Emitted after the graph export has been saved; graph contains the exported graph snapshot.
 * @eventdetail tp-graph-export { graph: TpGraphDocument }
 * @event tp-graph-import Emitted after importJSON validates and installs a graph; graph contains the imported snapshot.
 * @eventdetail tp-graph-import { graph: TpGraphDocument }
 * @event tp-graph-selection-change Emitted when the selection is synchronized. id is the primary selection or null, and ids lists all selected element identifiers.
 * @eventdetail tp-graph-selection-change { id: string | null; ids: string[] }
 * @event tp-graph-simulation-step Emitted after a registered simulator step and its transition animation complete; simulator is its registered name and graph is the resulting snapshot.
 * @eventdetail tp-graph-simulation-step { simulator: string; graph: TpGraphDocument }
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
    /**
     * @summary Validates and clones the supplied graph, clears selection and rerenders it. After initialization, a changed graph is recorded in undo history; invalid graphs throw before replacement.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Copies the selected graph elements and connecting edges into the editor-local clipboard. Returns false when nothing is selected; does not use the system clipboard.
     */
    copy(): boolean;
    /**
     * @summary Copies the selection into the editor-local clipboard, then removes it and connected edges as an undoable change. Returns false when readonly or nothing is selected.
     */
    cut(): boolean;
    /**
     * @summary Duplicates the editor-local clipboard with new IDs and an offset, then selects the copies. Returns the first pasted ID, or null when readonly or no clipboard content is available.
     */
    paste(): string | null;
    /**
     * @summary Restores the preceding graph snapshot and returns true; returns false when undo history is empty.
     */
    undo(): boolean;
    /**
     * @summary Restores the next undone graph snapshot and returns true; returns false when redo history is empty.
     */
    redo(): boolean;
    /**
     * @summary Registers or replaces a shape palette by its ID and refreshes the palette UI. Requires a nonempty ID and at least one shape.
     */
    registerPalette(palette: TpGraphPalette): void;
    /**
     * @summary Removes the palette with the supplied ID and selects a remaining shape if needed; does not remove existing graph nodes.
     */
    unregisterPalette(id: string): void;
    /**
     * @summary Registers or replaces the simulator function associated with name for subsequent step(name) calls.
     */
    registerSimulator(name: string, simulator: TpGraphSimulator): void;
    /**
     * @summary Sets a positive finite magnification factor, clamped to the supported zoom range. A value of 1 means 100%; invalid inputs throw TypeError.
     */
    setZoom(value: number): void;
    /**
     * @summary Increases magnification by the configured zoom factor, up to the supported maximum.
     */
    zoomIn(): void;
    /**
     * @summary Decreases magnification by the configured zoom factor, down to the supported minimum.
     */
    zoomOut(): void;
    /**
     * @summary Restores magnification to 1 (100%) without changing graph data.
     */
    resetZoom(): void;
    /**
     * @summary Returns the graph serialized as JSON; pretty uses two-space indentation, while false produces compact JSON.
     */
    exportJson(pretty?: boolean): string;
    /**
     * @summary Returns a standalone SVG of the graph with resolved styles and content bounds; throws when the canvas is not ready.
     */
    exportSvg(): string;
    private exportContentBounds;
    /**
     * @summary Parses and validates a JSON graph, replaces the current graph and emits tp-graph-import. Invalid JSON or graph data throws before replacement.
     */
    importJson(source: string): void;
    /**
     * @summary Sets the trimmed label of a node, edge or measurement by ID; empty clears the label. Throws for an unknown element.
     */
    setElementLabel(id: string, label: string): void;
    /**
     * @summary Trims and stores the graph title, then records an undoable change; an empty string removes visible title text.
     */
    setTitle(title: string): void;
    /**
     * @summary Changes the color of a comment node and records the change; throws for an unknown comment or unsupported color.
     */
    setCommentColor(id: string, color: TpGraphCommentColor): void;
    /**
     * @summary Adds a node of type at graph coordinates point, snapped to the grid. Uses label or the palette default, records the change and returns a detached copy of the node.
     */
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Connects existing source and target node IDs using the requested type, ports, direction and routing. Rejects invalid connections, records the change and returns a detached edge copy.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection, routing?: TpGraphEdgeRouting): TpGraphEdge;
    /**
     * @summary Adds a measurement marker to edgeId at a position clamped to 0..1 along the edge; returns its detached record. Throws for an unknown edge.
     */
    addMeasurement(edgeId: string, position?: number, label?: string): TpGraphMeasurement;
    /**
     * @summary Moves the marker identified by id to a relative edge position clamped to 0..1; throws when the marker is unknown.
     */
    moveMeasurement(id: string, position: number): void;
    /**
     * @summary Moves the source or target endpoint of edgeId to nodeId and port after connection validation; returns a detached copy of the updated edge.
     */
    reconnectEdge(edgeId: string, endpoint: "source" | "target", nodeId: string, port: TpGraphPort): TpGraphEdge;
    /**
     * @summary Changes an existing edge direction and the default for new edges; throws for an unknown edge or a direction unsupported by this editor.
     */
    setEdgeDirection(edgeId: string, direction: TpGraphEdgeDirection): void;
    /**
     * @summary Changes an existing edge routing mode and the default for new edges; throws for an unknown edge.
     */
    setEdgeRouting(edgeId: string, routing: TpGraphEdgeRouting): void;
    /**
     * @summary Uses orthogonal routing with 1, 2 or 3 elbows and a horizontal or vertical departure. The turns choice applies to two elbows; throws for an unknown edge.
     */
    setEdgeOrthogonal(edgeId: string, elbows: 1 | 2 | 3, departure: "horizontal" | "vertical", turns?: "alternating" | "same"): void;
    protected validateConnection(source: string, target: string, _type: string): void;
    /**
     * @summary Removes the node, edge or measurement identified by id; removing a node also removes its connected edges. Updates selection and records an undoable change.
     */
    removeElement(id: string): void;
    /**
     * @summary Runs the simulator registered as simulatorName on a graph snapshot, awaits its animated transition and emits tp-graph-simulation-step. Throws for an unknown simulator.
     */
    step(simulatorName: string): Promise<void>;
    /**
     * @summary Applies node and edge patches to existing IDs, animates their appearance for transition.duration milliseconds (300 by default), then records the change. Resolves after that duration.
     */
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
