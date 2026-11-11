/**
 * @module components/graph-nfa
 * @summary Interactive nondeterministic finite automaton generated from a regular expression.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
import { type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, TpGraphEditor, type TpGraphNode, type TpGraphPoint, type TpGraphPort, type TpGraphTransition } from "../graph-editor/graph-editor.js";
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
 * The custom `<tp-graph-nfa>` element edits, generates, and simulates nondeterministic finite automata.
 *
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
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a NFA state or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Adds a forward transition between existing state IDs, using optional connection ports; returns the edge record. Unsupported types, directions or endpoints throw.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    get regex(): string;
    get word(): string;
    get activeStates(): string[];
    get accepted(): boolean;
    /**
     * @summary Builds an NFA from the regular-expression source and resets reading to the current word. Omitted source reuses the stored expression; invalid expressions throw.
     */
    generate(source?: string): void;
    /**
     * @summary Restarts reading word with the epsilon closure of the initial states and clears transition highlights; omitted word reuses the current input.
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
}
