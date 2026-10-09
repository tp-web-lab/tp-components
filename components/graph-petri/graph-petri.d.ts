/**
 * @module components/graph-petri
 * @summary Interactive Petri-net editor and simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { TpGraphEditor, type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, type TpGraphNode, type TpGraphPoint, type TpGraphPort, type TpGraphTransition } from '../graph-editor/graph-editor.js';
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
 * Petri-net specialization of `<tp-graph-editor>`.
 *
 * @summary Edits and simulates place/transition Petri nets.
 * @tagname tp-graph-petri
 * @event tp-petri-fire Fired after a transition is fired.
 * @event tp-petri-reset Fired after the initial marking is restored.
 * @accessibility Exposes enabled transition controls as focusable buttons.
 * @keyboard {Enter / Space} Fires the focused enabled transition.
 * @example
 * <tp-graph-petri></tp-graph-petri>
 */
export declare class TpGraphPetri extends TpGraphEditor {
    private static readonly petriStyleId;
    constructor();
    protected connectedCallback(): void;
    setGraph(graph: TpGraphDocument): void;
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    addPlace(point: TpGraphPoint, label?: string, initialTokens?: number): TpGraphNode;
    addTransition(point: TpGraphPoint, label?: string): TpGraphNode;
    addTokens(placeId: string, count?: number, updateInitial?: boolean): void;
    addArc(source: string, target: string, weight?: number): TpGraphEdge;
    get enabledTransitions(): string[];
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    protected handlePaletteDrop(type: string, point: TpGraphPoint, target: Element | null): void;
    fire(transitionId: string, duration?: number): Promise<void>;
    fireNext(duration?: number): Promise<string | null>;
    resetMarking(): void;
    get marking(): Record<string, number>;
}
