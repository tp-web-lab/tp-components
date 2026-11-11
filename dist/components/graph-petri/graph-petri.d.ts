/**
 * @module components/graph-petri
 * @summary Interactive Petri-net editor and simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, TpGraphEditor, type TpGraphNode, type TpGraphPoint, type TpGraphPort, type TpGraphTransition } from "../graph-editor/graph-editor.js";
export declare const TP_PETRI_PLACE = "petri-place";
export declare const TP_PETRI_TRANSITION = "petri-transition";
export declare const TP_PETRI_ARC = "petri-arc";
export declare const TP_PETRI_TOKEN = "petri-token";
export declare function getPetriTokens(node: Readonly<TpGraphNode>): number;
export declare function getPetriArcWeight(edge: Readonly<TpGraphEdge>): number;
export declare function validatePetriGraph(graph: Readonly<TpGraphDocument>): void;
export declare function getEnabledPetriTransitions(graph: Readonly<TpGraphDocument>): string[];
export declare function createPetriFireTransition(graph: Readonly<TpGraphDocument>, transitionId: string, duration?: number): TpGraphTransition;
export interface TpPetriIncidenceMatrix {
    places: string[];
    transitions: string[];
    values: number[][];
}
export interface TpPetriReachabilityGraph {
    places: string[];
    markings: number[][];
    edges: Array<{
        source: number;
        target: number;
        transition: string;
    }>;
    truncated: boolean;
}
export declare function getPetriIncidenceMatrix(graph: Readonly<TpGraphDocument>): TpPetriIncidenceMatrix;
export declare function getPetriReachabilityGraph(graph: Readonly<TpGraphDocument>, maximumMarkings?: number): TpPetriReachabilityGraph;
/**
 * The custom `<tp-graph-petri>` element edits and simulates place/transition Petri nets.
 *
 * @summary Edits and simulates place/transition Petri nets.
 * @tagname tp-graph-petri
 *
 *
 * @accessibility Exposes enabled transition controls as focusable buttons.
 * @keyboard {Enter / Space} Fires the focused enabled transition.
 * @example
 * <tp-graph-petri id="petri-intro" grid="" grid-size="20" src="/docs/components/graph-petri/examples/petri-intro.json"></tp-graph-petri>
 *  @event tp-graph-change Emitted after adding a token, as well as for inherited graph mutations. reason identifies the operation and graph contains the resulting snapshot.
 * @eventdetail tp-graph-change { reason: string; graph: TpGraphDocument }
 * @event tp-graph-error Emitted if adding a token from the UI fails, or for an inherited graph loading or edge-editing failure. operation identifies the failed action.
 * @eventdetail tp-graph-error { error: unknown; operation: "add-token" | "load-src" | "reconnect-edge" | "add-edge"; src?: string }
 * @event tp-petri-fire Emitted after a transition fires and its animation finishes; marking maps each place ID to its remaining token count.
 * @eventdetail tp-petri-fire { transitionId: string; marking: Record<string, number>; graph: TpGraphDocument }
 * @event tp-petri-reset Emitted after the initial marking is restored; marking maps each place ID to its reset token count.
 * @eventdetail tp-petri-reset { marking: Record<string, number>; graph: TpGraphDocument }
 */
export declare class TpGraphPetri extends TpGraphEditor {
    private static readonly petriStyleId;
    constructor();
    protected connectedCallback(): void;
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a Petri arc between a place and a transition, returning its edge record. Only forward/backward directions and the Petri arc type are accepted; invalid connections throw.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    /**
     * @summary Adds a Petri place, transition or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Adds a place at graph coordinates point with the optional label and nonnegative integer initialTokens. Sets both current and initial marking and returns the node record.
     */
    addPlace(point: TpGraphPoint, label?: string, initialTokens?: number): TpGraphNode;
    /**
     * @summary Adds a Petri transition at graph coordinates point with label and returns its node record.
     */
    addTransition(point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Adds a positive integer count to placeId without exceeding its capacity. Also increases its initial marking unless updateInitial is false; invalid inputs throw.
     */
    addTokens(placeId: string, count?: number, updateInitial?: boolean): void;
    /**
     * @summary Adds an arc between source and target IDs with a positive integer weight; returns its stored edge record. Invalid weight or incompatible endpoints throw.
     */
    addArc(source: string, target: string, weight?: number): TpGraphEdge;
    get enabledTransitions(): string[];
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    protected handlePaletteDrop(type: string, point: TpGraphPoint, target: Element | null): void;
    /**
     * @summary Fires the enabled transition identified by transitionId, animates for duration milliseconds and emits tp-petri-fire. Resolves after animation; invalid or disabled transitions reject.
     */
    fire(transitionId: string, duration?: number): Promise<void>;
    /**
     * @summary Randomly chooses and fires an enabled transition with duration in milliseconds. Resolves to its ID, or null when no transition is enabled.
     */
    fireNext(duration?: number): Promise<string | null>;
    /**
     * @summary Restores each place to its initial token count, clears fired-transition highlights and emits tp-petri-reset.
     */
    resetMarking(): void;
    get marking(): Record<string, number>;
}
