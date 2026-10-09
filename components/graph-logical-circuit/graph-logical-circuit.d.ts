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
import { TpGraphEditor, type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, type TpGraphNode, type TpGraphPoint, type TpGraphPort } from '../graph-editor/graph-editor.js';
import '../markdown/markdown.js';
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
export type TpLogicalEquationNotation = 'electronic' | 'mathematical';
export declare function getLogicalEquations(graph: Readonly<TpGraphDocument>, notation?: TpLogicalEquationNotation): TpLogicalEquation[];
export declare function validateLogicalCircuit(graph: Readonly<TpGraphDocument>): void;
export declare function evaluateLogicalCircuit(graph: Readonly<TpGraphDocument>): TpGraphDocument;
export type TpLogicGateRepresentation = 'iso' | 'ansi';
/**
 * @summary Edits and simulates combinational logic circuits.
 * @tagname tp-graph-logical-circuit
 * @accessibility Makes logical input and output terminals operable by pointer and keyboard.
 * @keyboard {Enter / Space} Toggles the focused input or output terminal.
 * @example
 * <tp-graph-logical-circuit></tp-graph-logical-circuit>
 */
export declare class TpGraphLogicalCircuit extends TpGraphEditor {
    private static readonly logicStyleId;
    private gateRepresentation;
    private logicalEquationNotation;
    constructor();
    protected connectedCallback(): void;
    protected isSupportedLogicNode(type: string): boolean;
    protected validateLogicGraph(graph: Readonly<TpGraphDocument>): void;
    setGraph(graph: TpGraphDocument): void;
    addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode;
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection): TpGraphEdge;
    reconnectEdge(edgeId: string, endpoint: 'source' | 'target', nodeId: string, port: TpGraphPort): TpGraphEdge;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected validateConnection(source: string, target: string, type: string): void;
    toggle(id: string, propagate?: boolean): boolean;
    evaluate(): void;
    get representation(): TpLogicGateRepresentation;
    set representation(value: TpLogicGateRepresentation);
    toggleRepresentation(): TpLogicGateRepresentation;
    get equationNotation(): TpLogicalEquationNotation;
    set equationNotation(value: TpLogicalEquationNotation);
    toggleEquationNotation(): TpLogicalEquationNotation;
    protected renderResults(): string;
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    private assertInputCapacity;
    private resolveInputPort;
}
