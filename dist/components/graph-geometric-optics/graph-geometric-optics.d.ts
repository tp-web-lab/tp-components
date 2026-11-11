/** @module components/graph-geometric-optics @summary Paraxial geometric-optics bench and ABCD simulator. */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
import { type TpGraphDocument, type TpGraphEdge, TpGraphEditor, type TpGraphNode, type TpGraphPoint } from "../graph-editor/graph-editor.js";
import "../markdown/markdown.js";
export declare const TP_OPTICS_SOURCE = "optics-source";
export declare const TP_OPTICS_POINT_SOURCE = "optics-point-source";
export declare const TP_OPTICS_CONVERGING_LENS = "optics-converging-lens";
export declare const TP_OPTICS_DIVERGING_LENS = "optics-diverging-lens";
export declare const TP_OPTICS_BICONVEX_LENS = "optics-biconvex-lens";
export declare const TP_OPTICS_BICONCAVE_LENS = "optics-biconcave-lens";
export declare const TP_OPTICS_SCREEN = "optics-screen";
export declare const TP_OPTICS_MEDIUM = "optics-medium";
export declare const TP_OPTICS_GRIN_MEDIUM = "optics-grin-medium";
export declare const TP_OPTICS_PLANE_INTERFACE = "optics-plane-interface";
export declare const TP_OPTICS_CURVED_INTERFACE = "optics-curved-interface";
export declare const TP_OPTICS_CONCAVE_INTERFACE = "optics-concave-interface";
export declare const TP_OPTICS_MIRROR = "optics-mirror";
export declare const TP_OPTICS_CONVEX_MIRROR = "optics-convex-mirror";
export declare const TP_OPTICS_CONCAVE_MIRROR = "optics-concave-mirror";
export type TpOpticsMatrix = readonly [number, number, number, number];
export interface TpOpticsMatrixStage {
    label: string;
    matrix: TpOpticsMatrix;
    cumulative: TpOpticsMatrix;
}
export interface TpOpticsAnalysis {
    axisY: number;
    sourceId: string;
    screenId: string | null;
    matrix: TpOpticsMatrix;
    stages: TpOpticsMatrixStage[];
    imageX: number | null;
    magnification: number | null;
    imageKind: "real" | "virtual" | "afocal";
    orientation: "upright" | "inverted" | "undefined";
}
export declare function validateGeometricOpticsGraph(graph: Readonly<TpGraphDocument>): void;
export declare function analyzeGeometricOptics(graph: Readonly<TpGraphDocument>): TpOpticsAnalysis;
/**
 * The custom `<tp-graph-geometric-optics>` element edits and simulates a paraxial geometric-optics bench.
 *
 * @summary Edits and simulates a paraxial geometric-optics bench.
 * @tagname tp-graph-geometric-optics
 * @event tp-optics-trace Emitted after trace recomputes the displayed ray paths; analysis contains the optical-system analysis and graph is the resulting snapshot.
 * @eventdetail tp-optics-trace { analysis: TpOpticsAnalysis; graph: TpGraphDocument }
 * @example
 * <tp-graph-geometric-optics id="optics-example" grid="" grid-size="20" message="Move the lens or screen and inspect the paraxial analysis." src="/docs/components/graph-geometric-optics/examples/converging-lens.json"></tp-graph-geometric-optics>
 */
export declare class TpGraphGeometricOptics extends TpGraphEditor {
    private static readonly opticsStyleId;
    private static instanceCounter;
    private readonly opticsInstanceId;
    private selectedOpticsId;
    constructor();
    protected connectedCallback(): void;
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a supported optical component at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Always throws TypeError: optical rays are computed from the scene and cannot be added as graph edges.
     */
    addEdge(): TpGraphEdge;
    protected edgeDirections(): readonly [];
    protected graphWorldBounds(): Readonly<{
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }>;
    /**
     * @summary Returns the ray-tracing analysis computed from the current optical scene without replacing the graph.
     */
    analyze(): TpOpticsAnalysis;
    /**
     * @summary Revalidates and redraws the current scene, then emits tp-optics-trace with its analysis and graph snapshot.
     */
    trace(): void;
    protected renderToolbarActions(): string;
    protected renderResults(): string;
    protected bindExtensionEvents(): void;
    private updateParameter;
    private updateCurvature;
    private updateMirrorShape;
    private updateGrinProfile;
    private updateObjectDirection;
    private updateGrinExpression;
    private validateGrinExpressionField;
    private updateControls;
    private opticalColorIndex;
    private traceRayPoints;
    private mountOpticsOverlay;
    private renderOverlay;
}
