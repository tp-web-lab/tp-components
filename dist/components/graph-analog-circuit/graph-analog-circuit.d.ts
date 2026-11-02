/**
 * @module components/graph-analog-circuit
 * @summary Interactive analog-circuit editor and transient simulator.
 */
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
import { type TpGraphDocument, type TpGraphEdge, type TpGraphEdgeDirection, type TpGraphEdgeRouting, TpGraphEditor, type TpGraphNode, type TpGraphPoint, type TpGraphPort } from "../graph-editor/graph-editor.js";
import "../markdown/markdown.js";
export declare const TP_ANALOG_RESISTOR = "analog-resistor";
export declare const TP_ANALOG_CAPACITOR = "analog-capacitor";
export declare const TP_ANALOG_INDUCTOR = "analog-inductor";
export declare const TP_ANALOG_DIODE = "analog-diode";
export declare const TP_ANALOG_LED = "analog-led";
export declare const TP_ANALOG_LAMP = "analog-lamp";
export declare const TP_ANALOG_MOTOR = "analog-motor";
export declare const TP_ANALOG_RHEOSTAT = "analog-rheostat";
export declare const TP_ANALOG_POTENTIOMETER = "analog-potentiometer";
export declare const TP_ANALOG_TRANSISTOR = "analog-transistor";
export declare const TP_ANALOG_TRANSISTOR_NPN = "analog-transistor-npn";
export declare const TP_ANALOG_TRANSISTOR_PNP = "analog-transistor-pnp";
export declare const TP_ANALOG_OP_AMP = "analog-op-amp";
export declare const TP_ANALOG_VOLTAGE_SOURCE = "analog-voltage-source";
export declare const TP_ANALOG_CURRENT_SOURCE = "analog-current-source";
export declare const TP_ANALOG_GROUND = "analog-ground";
export declare const TP_ANALOG_HUB = "analog-hub";
export declare const TP_ANALOG_SWITCH = "analog-switch";
export declare const TP_ANALOG_PROBE = "analog-probe";
export declare const TP_ANALOG_SCOPE = "analog-oscilloscope";
export declare const TP_ANALOG_WIRE = "analog-wire";
export interface TpAnalogSample {
    time: number;
    values: Readonly<Record<string, number>>;
}
export interface TpAnalogSimulation {
    samples: readonly TpAnalogSample[];
    duration: number;
    step: number;
}
export type TpAnalogMeasurementMode = "voltage" | "current";
export declare function validateAnalogCircuit(graph: Readonly<TpGraphDocument>): void;
export declare function simulateAnalogCircuit(graph: Readonly<TpGraphDocument>, duration?: number, step?: number, measurementMode?: TpAnalogMeasurementMode): TpAnalogSimulation;
/**
 * @summary Interactive analog-circuit editor and transient simulator.
 * @tagname tp-graph-analog-circuit
 * @example
 * <tp-graph-analog-circuit></tp-graph-analog-circuit>
 * @event tp-analog-simulate Emitted after transient simulation completes and updates the graph. samples contains time/value records keyed by measurement label or probe label/ID; time, duration and step are in seconds, with voltage in volts and current in amperes.
 * @eventdetail tp-analog-simulate { samples: readonly TpAnalogSample[]; duration: number; step: number }
 */
export declare class TpGraphAnalogCircuit extends TpGraphEditor {
    private static instanceCounter;
    private static readonly analogStyleId;
    private readonly analogInstanceId;
    private timeZoom;
    private voltageZoom;
    private measurementMode;
    private selectedAnalogId;
    constructor();
    protected connectedCallback(): void;
    /**
     * @summary Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph.
     */
    setGraph(graph: TpGraphDocument): void;
    /**
     * @summary Adds a supported analog component at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError.
     */
    addNode(type: string, point: TpGraphPoint, nodeLabel?: string): TpGraphNode;
    /**
     * @summary Adds a non-directional wire between distinct existing component IDs using the requested ports and routing; returns its edge record. Arrows, self-links and unsupported wire types throw.
     */
    addEdge(source: string, target: string, type?: string, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction?: TpGraphEdgeDirection, routing?: TpGraphEdgeRouting): TpGraphEdge;
    protected validateConnection(sourceId: string, targetId: string, type: string): void;
    /**
     * @summary Runs transient analysis with positive duration and time step in seconds (defaults: 0.02 and 0.0002), refreshes the graph and emits tp-analog-simulate. Returns sampled results; invalid circuits or timings throw.
     */
    simulate(duration?: number, step?: number): TpAnalogSimulation;
    /**
     * @summary Rotates the selected orientable component 90 degrees clockwise and rotates its connected ports. Does nothing when no eligible component is selected.
     */
    rotateSelected(): void;
    /**
     * @summary Toggles the selected analog switch between open and closed; does nothing when the selection is not a switch.
     */
    toggleSwitch(): void;
    protected edgeDirections(): readonly TpGraphEdgeDirection[];
    protected renderToolbarActions(): string;
    protected bindExtensionEvents(): void;
    protected renderResults(): string;
    private isOrientable;
    private valueSpec;
    private updateSelectedLabel;
    private displayScale;
    private updateSelectedValue;
    private updateSelectedUnit;
    private updatePotentiometerPosition;
    private updateVoltageSourceWaveform;
    private updateVoltageSourceFrequency;
    private updateAnalogControls;
}
