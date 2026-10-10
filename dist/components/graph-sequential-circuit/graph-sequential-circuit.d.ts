/**
 * @module components/graph-sequential-circuit
 * @summary Interactive synchronous sequential logic circuit editor and simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-graph-logical-circuit
 * @summary Interactive combinational logic circuit editor and simulator.
 */
import { TpGraphLogicalCircuit } from '../graph-logical-circuit/graph-logical-circuit.js';
import { type TpGraphDocument } from '../graph-editor/graph-editor.js';
export declare const TP_LOGIC_CLOCK = "logic-clock";
export declare const TP_LOGIC_D_FLIP_FLOP = "logic-d-flip-flop";
export declare const TP_LOGIC_SR_LATCH = "logic-sr-latch";
export declare const TP_LOGIC_D_LATCH = "logic-d-latch";
export declare const TP_LOGIC_JK_FLIP_FLOP = "logic-jk-flip-flop";
export declare const TP_LOGIC_T_FLIP_FLOP = "logic-t-flip-flop";
export declare function validateSequentialCircuit(graph: Readonly<TpGraphDocument>): void;
export declare function evaluateSequentialCombinational(graph: Readonly<TpGraphDocument>): TpGraphDocument;
/**
 * @summary Edits and simulates synchronous sequential logic circuits.
 * @tagname tp-graph-sequential-circuit
 * @example
 * <tp-graph-sequential-circuit></tp-graph-sequential-circuit>
 */
export declare class TpGraphSequentialCircuit extends TpGraphLogicalCircuit {
    private static readonly sequentialStyleId;
    private timer;
    private timeline;
    constructor();
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected isSupportedLogicNode(type: string): boolean;
    protected validateLogicGraph(graph: Readonly<TpGraphDocument>): void;
    toggle(id: string, propagate?: boolean): boolean;
    evaluate(): void;
    clockStep(): void;
    resetSequentialState(): void;
    run(period?: number): void;
    stop(): void;
    get running(): boolean;
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    private renderRunState;
    private recordSample;
}
declare global {
    interface HTMLElementTagNameMap {
        'tp-graph-sequential-circuit': TpGraphSequentialCircuit;
    }
}
