/**
 * @module components/graph-dfa
 * @summary Interactive deterministic finite automaton editor and simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { TpGraphEditor, type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, type TpGraphNode, type TpGraphPoint, type TpGraphPort, type TpGraphTransition } from '../graph-editor/graph-editor.js';
export declare const TP_DFA_STATE = "dfa-state";
export declare const TP_DFA_TRANSITION = "dfa-transition";
export declare function validateDfaGraph(graph: Readonly<TpGraphDocument>): void;
export declare function createDfaStep(graph: Readonly<TpGraphDocument>, stateId: string, symbol: string, duration?: number): {
    stateId: string | null;
    transition: TpGraphTransition;
};
/**
 * Deterministic finite automaton specialization of `<tp-graph-editor>`.
 *
 * @summary Edits and simulates deterministic finite automata.
 * @tagname tp-graph-dfa
 * @event tp-dfa-step Fired after one input symbol is consumed.
 * @event tp-dfa-reset Fired after the input and active state are reset.
 * @example
 * <tp-graph-dfa></tp-graph-dfa>
 */
export declare class TpGraphDfa extends TpGraphEditor {
    private static readonly dfaStyleId;
    private inputWord;
    private inputPosition;
    private activeStateId;
    private rejected;
    private invalidSymbol;
    private running;
    constructor();
    protected connectedCallback(): void;
    setGraph(graph: TpGraphDocument): void;
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    get word(): string;
    set word(value: string);
    get position(): number;
    get currentState(): string | null;
    get alphabet(): string[];
    get accepted(): boolean;
    reset(word?: string): void;
    readNext(duration?: number): Promise<boolean>;
    run(duration?: number): Promise<boolean>;
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    private syncRuntimeFromGraph;
}
