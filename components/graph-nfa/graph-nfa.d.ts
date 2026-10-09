/**
 * @module components/graph-nfa
 * @summary Interactive nondeterministic finite automaton generated from a regular expression.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { TpGraphEditor, type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, type TpGraphNode, type TpGraphPoint, type TpGraphPort, type TpGraphTransition } from '../graph-editor/graph-editor.js';
export declare const TP_NFA_STATE = "nfa-state";
export declare const TP_NFA_TRANSITION = "nfa-transition";
export declare const TP_NFA_EPSILON = "\u03B5";
export declare function regexToNfa(source: string): TpGraphDocument;
export declare function validateNfaGraph(graph: Readonly<TpGraphDocument>): void;
export declare function createNfaStep(graph: Readonly<TpGraphDocument>, activeStates: Iterable<string>, symbol: string, duration?: number): {
    activeStates: string[];
    transition: TpGraphTransition;
};
/**
 * @summary Edits, generates, and simulates nondeterministic finite automata.
 * @tagname tp-graph-nfa
 * @example
 * <tp-graph-nfa></tp-graph-nfa>
 */
export declare class TpGraphNfa extends TpGraphEditor {
    private static readonly nfaStyleId;
    private regexSource;
    private inputWord;
    private inputPosition;
    private activeStateIds;
    private running;
    constructor();
    protected connectedCallback(): void;
    setGraph(graph: TpGraphDocument): void;
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    get regex(): string;
    get word(): string;
    get activeStates(): string[];
    get accepted(): boolean;
    generate(source?: string): void;
    reset(word?: string): void;
    readNext(duration?: number): Promise<boolean>;
    run(duration?: number): Promise<boolean>;
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
}
