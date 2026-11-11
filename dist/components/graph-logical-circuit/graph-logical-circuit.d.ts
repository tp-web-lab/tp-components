/**
 * @module components/graph-logical-circuit
 * @summary Interactive combinational logic circuit editor and simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
import { type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, TpGraphEditor, type TpGraphNode, type TpGraphPoint, type TpGraphPort } from "../graph-editor/graph-editor.js";
import "../markdown/markdown.js";
export declare const TP_LOGIC_INPUT = "logic-input";
export declare const TP_LOGIC_OUTPUT = "logic-output";
export declare const TP_LOGIC_AND = "logic-and";
export declare const TP_LOGIC_OR = "logic-or";
export declare const TP_LOGIC_NOT = "logic-not";
export declare const TP_LOGIC_XOR = "logic-xor";
export declare const TP_LOGIC_NAND = "logic-nand";
export declare const TP_LOGIC_NOR = "logic-nor";
export declare const TP_LOGIC_HUB = "logic-hub";
export declare const TP_LOGIC_AND_3 = "logic-and-3";
export declare const TP_LOGIC_OR_3 = "logic-or-3";
export declare const TP_LOGIC_XOR_3 = "logic-xor-3";
export declare const TP_LOGIC_NAND_3 = "logic-nand-3";
export declare const TP_LOGIC_NOR_3 = "logic-nor-3";
export declare const TP_LOGIC_WIRE = "logic-wire";
export interface TpLogicalEquation {
    outputId: string;
    output: string;
    latex: string;
}
export type TpLogicalEquationNotation = "electronic" | "mathematical";
export declare function getLogicalEquations(graph: Readonly<TpGraphDocument>, notation?: TpLogicalEquationNotation): TpLogicalEquation[];
export declare function validateLogicalCircuit(graph: Readonly<TpGraphDocument>): void;
export declare function evaluateLogicalCircuit(graph: Readonly<TpGraphDocument>): TpGraphDocument;
export type TpLogicGateRepresentation = "iso" | "ansi";
/**
 * The custom `<tp-graph-logical-circuit>` element edits and simulates combinational logic circuits.
 *
 * @summary Edits and simulates combinational logic circuits.
 * @tagname tp-graph-logical-circuit
 * @accessibility Makes logical input and output terminals operable by pointer and keyboard.
 * @keyboard {Enter / Space} Toggles the focused input or output terminal.
 * @example
 * <tp-graph-logical-circuit id="logic-example" grid="" grid-size="20" src="/docs/components/graph-logical-circuit/examples/xor.json"></tp-graph-logical-circuit>
 *  @event tp-logic-toggle Emitted after an input node is toggled; id identifies the input, value is its new Boolean level, and graph contains the resulting snapshot.
 * @eventdetail tp-logic-toggle { id: string; value: boolean; graph: TpGraphDocument }
 * @event tp-logic-evaluate Emitted after combinational outputs are recomputed; graph contains the resulting snapshot.
 * @eventdetail tp-logic-evaluate { graph: TpGraphDocument }
 */
export declare class TpGraphLogicalCircuit extends TpGraphEditor {
    private static readonly logicStyleId;
    private gateRepresentation;
    private logicalEquationNotation;
    constructor();
    protected connectedCallback(): void;
    protected isSupportedLogicNode(type: string): boolean;
    protected validateLogicGraph(graph: Readonly<TpGraphDocument>): void;
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a supported logic gate, input, output or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    /**
     * @summary Connects compatible logic nodes with a forward wire and returns its record. Validates input capacity and resolves the target input port; invalid connections throw.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    /**
     * @summary Reconnects an existing wire endpoint after checking logic compatibility and available input capacity; returns the updated edge record.
     */
    reconnectEdge(edgeId: string, endpoint: "source" | "target", nodeId: string, port: TpGraphPort): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    /**
     * @summary Inverts the Boolean state of input or output id and returns the new value. Input changes propagate through the circuit unless propagate is false; other node types throw.
     */
    toggle(id: string, propagate?: boolean): boolean;
    /**
     * @summary Recomputes combinational logic, replaces the displayed graph and emits tp-logic-evaluate.
     */
    evaluate(): void;
    get representation(): TpLogicGateRepresentation;
    set representation(value: TpLogicGateRepresentation);
    /**
     * @summary Switches gate symbols between iso and ansi, redraws the circuit and returns the selected representation.
     */
    toggleRepresentation(): TpLogicGateRepresentation;
    get equationNotation(): TpLogicalEquationNotation;
    set equationNotation(value: TpLogicalEquationNotation);
    /**
     * @summary Switches equations between electronic and mathematical notation, redraws results and returns the selected notation.
     */
    toggleEquationNotation(): TpLogicalEquationNotation;
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    private assertInputCapacity;
    private resolveInputPort;
}
