/**
 * @module components/graph-dfa
 * @summary Interactive deterministic finite automaton editor and simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, TpGraphEditor, type TpGraphNode, type TpGraphPoint, type TpGraphPort, type TpGraphTransition } from "../graph-editor/graph-editor.js";
export declare const TP_DFA_STATE = "dfa-state";
export declare const TP_DFA_TRANSITION = "dfa-transition";
export declare function validateDfaGraph(graph: Readonly<TpGraphDocument>): void;
export declare function createDfaStep(graph: Readonly<TpGraphDocument>, stateId: string, symbol: string, duration?: number): {
    stateId: string | null;
    transition: TpGraphTransition;
};
/**
 * The custom `<tp-graph-dfa>` element edits and simulates deterministic finite automata.
 *
 * @summary Edits and simulates deterministic finite automata.
 * @tagname tp-graph-dfa
 *
 *
 * @example
 * <tp-graph-dfa id="dfa-starts-with-ab" grid="" grid-size="20" src="/docs/components/graph-dfa/examples/starts-with-ab.json"></tp-graph-dfa>
 *  @event tp-dfa-reset Emitted after the input word, consumed-symbol count and active state are reset. stateId is null when no initial state is available; graph is the resulting snapshot.
 * @eventdetail tp-dfa-reset { word: string; stateId: string | null; graph: TpGraphDocument }
 * @event tp-dfa-step Emitted after consuming one symbol and completing its transition animation. position is the number of consumed symbols; accepted and rejected describe the resulting state.
 * @eventdetail tp-dfa-step { symbol: string; position: number; stateId: string | null; accepted: boolean; rejected: boolean; graph: TpGraphDocument }
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
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a DFA state or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Adds a forward transition between existing state IDs, using optional connection ports; returns the edge record. Unsupported types, directions or endpoints throw.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    get word(): string;
    set word(value: string);
    get position(): number;
    get currentState(): string | null;
    get alphabet(): string[];
    get accepted(): boolean;
    /**
     * @summary Restarts reading word at the initial state and clears rejection and transition highlights; omitted word reuses the current input. Emits tp-dfa-reset.
     */
    reset(word?: string): void;
    /**
     * @summary Consumes and animates one input symbol using duration milliseconds. Resolves to true if a symbol was processed, not whether the word is accepted; false means no further step is possible.
     */
    readNext(duration?: number): Promise<boolean>;
    /**
     * @summary Processes remaining symbols with duration milliseconds per step, stopping at the end or rejection. Resolves to whether the complete word is accepted; does not reset the input first.
     */
    run(duration?: number): Promise<boolean>;
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    private syncRuntimeFromGraph;
}
