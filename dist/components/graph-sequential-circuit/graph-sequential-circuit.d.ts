/**
 * @module components/graph-sequential-circuit
 * @summary Interactive synchronous sequential logic circuit editor and simulator.
 */
/**
 * @tp-dependency tp-graph-logical-circuit
 * @summary Interactive combinational logic circuit editor and simulator.
 */
import type { TpGraphDocument } from "../graph-editor/graph-editor.js";
import { TpGraphLogicalCircuit } from "../graph-logical-circuit/graph-logical-circuit.js";
export declare const TP_LOGIC_CLOCK = "logic-clock";
export declare const TP_LOGIC_D_FLIP_FLOP = "logic-d-flip-flop";
export declare const TP_LOGIC_SR_LATCH = "logic-sr-latch";
export declare const TP_LOGIC_D_LATCH = "logic-d-latch";
export declare const TP_LOGIC_JK_FLIP_FLOP = "logic-jk-flip-flop";
export declare const TP_LOGIC_T_FLIP_FLOP = "logic-t-flip-flop";
export declare function validateSequentialCircuit(graph: Readonly<TpGraphDocument>): void;
export declare function evaluateSequentialCombinational(graph: Readonly<TpGraphDocument>): TpGraphDocument;
/**
 * The custom `<tp-graph-sequential-circuit>` element edits and simulates synchronous sequential logic circuits.
 *
 * @summary Edits and simulates synchronous sequential logic circuits.
 * @tagname tp-graph-sequential-circuit
 * @example
 * <tp-graph-sequential-circuit id="sequential-counter" grid="" grid-size="20" message="Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes." src="/docs/components/graph-sequential-circuit/examples/two-bit-counter.json"></tp-graph-sequential-circuit>
 *  @event tp-logic-toggle Emitted after an input node is toggled; id identifies the input, value is its new Boolean level, and graph contains the resulting snapshot.
 * @eventdetail tp-logic-toggle { id: string; value: boolean; graph: TpGraphDocument }
 * @event tp-logic-evaluate Emitted after combinational outputs are recomputed without advancing the clock; graph contains the resulting snapshot.
 * @eventdetail tp-logic-evaluate { graph: TpGraphDocument }
 * @event tp-sequential-clock Emitted after a clock cycle has updated memory and settled combinational outputs. values maps memory-element IDs to their new Boolean states.
 * @eventdetail tp-sequential-clock { values: Record<string, boolean>; graph: TpGraphDocument }
 * @event tp-sequential-reset Emitted after memory elements return to their initial states and the timeline is cleared; graph contains the reset snapshot.
 * @eventdetail tp-sequential-reset { graph: TpGraphDocument }
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
    /**
     * @summary Inverts input or output id and returns its new Boolean value. Optionally propagates input changes through combinational logic and records a timeline sample; unsupported nodes throw.
     */
    toggle(id: string, propagate?: boolean): boolean;
    /**
     * @summary Recomputes combinational outputs without advancing the clock, records a timeline sample and emits tp-logic-evaluate.
     */
    evaluate(): void;
    /**
     * @summary Advances a clock cycle, updates memory elements and combinational outputs, and records the resulting timeline samples.
     */
    clockStep(): void;
    /**
     * @summary Restores memory elements to their initial Boolean states, clears the timeline, recomputes outputs and emits tp-sequential-reset.
     */
    resetSequentialState(): void;
    /**
     * @summary Starts repeated clock steps every period milliseconds, clamped to at least 100. Does nothing if already running; nonfinite periods use 700.
     */
    run(period?: number): void;
    /**
     * @summary Stops automatic clock stepping while preserving the current circuit state and timeline.
     */
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
        "tp-graph-sequential-circuit": TpGraphSequentialCircuit;
    }
}
