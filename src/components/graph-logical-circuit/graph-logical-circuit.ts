/**
 * @module components/graph-logical-circuit
 * @summary Interactive combinational logic circuit editor and simulator.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
// tp-docgen:dependencies:end

import {
  graphEdgeMeasurements,
  TpGraphEditor,
  TP_GRAPH_COMMENT,
  type TpGraphDocument,
  type TpGraphEdge,
  type TpGraphEdgeDirection,
  type TpGraphNode,
  type TpGraphPoint,
  type TpGraphPort,
} from '../graph-editor/graph-editor.js';
import '../markdown/markdown.js';
import style from './graph-logical-circuit.css?inline';

export const TP_LOGIC_INPUT = 'logic-input';
export const TP_LOGIC_OUTPUT = 'logic-output';
export const TP_LOGIC_AND = 'logic-and';
export const TP_LOGIC_OR = 'logic-or';
export const TP_LOGIC_NOT = 'logic-not';
export const TP_LOGIC_XOR = 'logic-xor';
export const TP_LOGIC_NAND = 'logic-nand';
export const TP_LOGIC_NOR = 'logic-nor';
export const TP_LOGIC_HUB = 'logic-hub';
export const TP_LOGIC_AND_3 = 'logic-and-3';
export const TP_LOGIC_OR_3 = 'logic-or-3';
export const TP_LOGIC_XOR_3 = 'logic-xor-3';
export const TP_LOGIC_NAND_3 = 'logic-nand-3';
export const TP_LOGIC_NOR_3 = 'logic-nor-3';
export const TP_LOGIC_WIRE = 'logic-wire';

const THREE_INPUT_GATES = [TP_LOGIC_AND_3, TP_LOGIC_OR_3, TP_LOGIC_XOR_3, TP_LOGIC_NAND_3, TP_LOGIC_NOR_3] as const;
const LOGIC_GATES = [TP_LOGIC_AND, TP_LOGIC_OR, TP_LOGIC_NOT, TP_LOGIC_XOR, TP_LOGIC_NAND, TP_LOGIC_NOR, ...THREE_INPUT_GATES] as const;
const LOGIC_NODES = [TP_LOGIC_INPUT, TP_LOGIC_OUTPUT, TP_LOGIC_HUB, ...LOGIC_GATES] as const;

function baseGateType(type: string): string { return type.endsWith('-3') ? type.slice(0, -2) : type; }
function gateInputPorts(type: string): TpGraphPort[] {
  if (type === TP_LOGIC_NOT) return ['west'];
  if ((THREE_INPUT_GATES as readonly string[]).includes(type)) return ['north', 'west', 'south'];
  return ['north', 'south'];
}

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function logicValue(node: Readonly<TpGraphNode>): boolean { return node.state?.value === true; }

function normalizeLogicalPorts(graph: TpGraphDocument): TpGraphDocument {
  const result = structuredClone(graph);
  const nodes = new Map(result.nodes.map((node) => [node.id, node]));
  const usedInputs = new Map<string, Set<TpGraphPort>>();
  for (const edge of result.edges) {
    const source = edge.source === undefined ? undefined : nodes.get(edge.source);
    const target = edge.target === undefined ? undefined : nodes.get(edge.target);
    if (source?.type === TP_LOGIC_INPUT || source?.type === TP_LOGIC_HUB || (source && (LOGIC_GATES as readonly string[]).includes(source.type))) {
      edge.sourcePort ??= 'east';
    }
    if (!target) continue;
    if (target.type === TP_LOGIC_OUTPUT) edge.targetPort ??= 'west';
    else if ((LOGIC_GATES as readonly string[]).includes(target.type)) {
      const used = usedInputs.get(target.id) ?? new Set<TpGraphPort>();
      if (!edge.targetPort) edge.targetPort = gateInputPorts(target.type).find((port) => !used.has(port));
      if (edge.targetPort) used.add(edge.targetPort);
      usedInputs.set(target.id, used);
    }
  }
  return result;
}

function gateValue(type: string, inputs: readonly boolean[]): boolean {
  type = baseGateType(type);
  if (type === TP_LOGIC_NOT) return !(inputs[0] ?? false);
  if (type === TP_LOGIC_AND) return inputs.length > 0 && inputs.every(Boolean);
  if (type === TP_LOGIC_OR) return inputs.some(Boolean);
  if (type === TP_LOGIC_XOR) return inputs.filter(Boolean).length % 2 === 1;
  if (type === TP_LOGIC_NAND) return !(inputs.length > 0 && inputs.every(Boolean));
  if (type === TP_LOGIC_NOR) return !inputs.some(Boolean);
  return inputs[0] ?? false;
}

function latexIdentifier(value: string): string {
  const escaped = value.trim().replaceAll('\\', '\\backslash ')
    .replaceAll('{', '\\{').replaceAll('}', '\\}')
    .replaceAll('_', '\\_').replaceAll('#', '\\#')
    .replaceAll('%', '\\%').replaceAll('&', '\\&')
    .replaceAll('$', '\\$').replaceAll('^', '\\^{}')
    .replaceAll('~', '\\sim ').replaceAll('<', '\\lt ')
    .replaceAll('>', '\\gt ').replaceAll('`', '').replaceAll(' ', '\\ ');
  return `\\mathrm{${escaped || '?'}}`;
}

export interface TpLogicalEquation { outputId: string; output: string; latex: string }
export type TpLogicalEquationNotation = 'electronic' | 'mathematical';

export function getLogicalEquations(
  graph: Readonly<TpGraphDocument>,
  notation: TpLogicalEquationNotation = 'electronic',
): TpLogicalEquation[] {
  validateLogicalCircuit(graph);
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const memo = new Map<string, string>();
  const visiting = new Set<string>();
  const expression = (nodeId: string): string => {
    const cached = memo.get(nodeId);
    if (cached !== undefined) return cached;
    if (visiting.has(nodeId)) throw new TypeError('Logical equations require an acyclic circuit.');
    const node = nodes.get(nodeId);
    if (!node) return '0';
    if (node.type === TP_LOGIC_INPUT) return latexIdentifier(node.label ?? node.id);
    visiting.add(nodeId);
    const inputs = graph.edges.filter((edge) => edge.target === nodeId && edge.source !== undefined)
      .map((edge) => expression(edge.source as string));
    const baseType = baseGateType(node.type);
    const joined = (operator: string): string => `\\left(${inputs.join(` ${operator} `)}\\right)`;
    let result: string;
    const negated = (value: string): string => notation === 'electronic'
      ? `\\overline{${value}}` : `\\lnot ${value}`;
    if (node.type === TP_LOGIC_OUTPUT || node.type === TP_LOGIC_HUB) result = inputs[0] ?? '0';
    else if (baseType === TP_LOGIC_NOT) result = negated(inputs[0] ?? '0');
    else if (baseType === TP_LOGIC_AND) result = joined(notation === 'electronic' ? '\\cdot' : '\\land');
    else if (baseType === TP_LOGIC_OR) result = joined(notation === 'electronic' ? '+' : '\\lor');
    else if (baseType === TP_LOGIC_XOR) result = joined('\\oplus');
    else if (baseType === TP_LOGIC_NAND) result = negated(joined(notation === 'electronic' ? '\\cdot' : '\\land'));
    else if (baseType === TP_LOGIC_NOR) result = negated(joined(notation === 'electronic' ? '+' : '\\lor'));
    else result = inputs[0] ?? '0';
    visiting.delete(nodeId);
    memo.set(nodeId, result);
    return result;
  };
  return graph.nodes.filter((node) => node.type === TP_LOGIC_OUTPUT).map((output) => ({
    outputId: output.id,
    output: output.label ?? output.id,
    latex: `${latexIdentifier(output.label ?? output.id)} = ${expression(output.id)}`,
  }));
}

export function validateLogicalCircuit(graph: Readonly<TpGraphDocument>): void {
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  for (const node of graph.nodes) {
    if (node.type !== TP_GRAPH_COMMENT && !(LOGIC_NODES as readonly string[]).includes(node.type)) {
      throw new TypeError(`Unsupported logical-circuit node type: ${node.type}`);
    }
  }
  const incoming = new Map<string, number>();
  const occupiedInputPorts = new Map<string, Set<TpGraphPort>>();
  for (const edge of graph.edges) {
    if (edge.source === undefined || edge.target === undefined) continue;
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);
    if (!source || !target || source.type === TP_GRAPH_COMMENT || target.type === TP_GRAPH_COMMENT) {
      throw new TypeError(`Wire "${edge.id}" must connect two logical elements.`);
    }
    if (edge.source === edge.target) throw new TypeError('Self-links are not allowed in combinational circuits.');
    if (source.type === TP_LOGIC_OUTPUT) throw new TypeError('An output cannot be the source of a wire.');
    if (target.type === TP_LOGIC_INPUT) throw new TypeError('An input cannot be the target of a wire.');
    if (edge.type !== undefined && edge.type !== TP_LOGIC_WIRE) throw new TypeError(`Unsupported wire type: ${edge.type}`);
    if (edge.direction !== undefined && edge.direction !== 'forward') throw new TypeError('Logical wires must be forward.');
    incoming.set(target.id, (incoming.get(target.id) ?? 0) + 1);
    if (edge.targetPort && (LOGIC_GATES as readonly string[]).includes(target.type)) {
      const validPorts = gateInputPorts(target.type);
      if (!validPorts.includes(edge.targetPort)) throw new TypeError(`Invalid input port for ${target.type}: ${edge.targetPort}`);
      const occupied = occupiedInputPorts.get(target.id) ?? new Set<TpGraphPort>();
      if (occupied.has(edge.targetPort)) throw new TypeError(`Input port ${edge.targetPort} is already connected.`);
      occupied.add(edge.targetPort);
      occupiedInputPorts.set(target.id, occupied);
    }
  }
  for (const node of graph.nodes) {
    const count = incoming.get(node.id) ?? 0;
    if (node.type === TP_LOGIC_INPUT || node.type === TP_GRAPH_COMMENT) continue;
    const maximum = node.type === TP_LOGIC_NOT || node.type === TP_LOGIC_OUTPUT ? 1
      : (THREE_INPUT_GATES as readonly string[]).includes(node.type) ? 3
        : node.type === TP_LOGIC_HUB ? 4 : 2;
    if (count > maximum) {
      const label = node.type === TP_LOGIC_NOT ? 'NOT gates' : node.type === TP_LOGIC_OUTPUT ? 'Outputs' : 'This element';
      throw new TypeError(`${label} accept${label === 'This element' ? 's' : ''} only ${maximum} input wire${maximum === 1 ? '' : 's'}.`);
    }
  }
}

export function evaluateLogicalCircuit(graph: Readonly<TpGraphDocument>): TpGraphDocument {
  validateLogicalCircuit(graph);
  const result = structuredClone(graph);
  const nodes = new Map(result.nodes.map((node) => [node.id, node]));
  for (let iteration = 0; iteration < result.nodes.length; iteration += 1) {
    let changed = false;
    for (const node of result.nodes) {
      if (node.type === TP_LOGIC_INPUT || node.type === TP_GRAPH_COMMENT) continue;
      const inputEdges = result.edges.filter((edge) => edge.target === node.id && edge.source !== undefined);
      if (inputEdges.length === 0 && node.type === TP_LOGIC_OUTPUT) continue;
      const inputs = inputEdges.map((edge) => logicValue(nodes.get(edge.source as string) as TpGraphNode));
      const next = node.type === TP_LOGIC_OUTPUT || node.type === TP_LOGIC_HUB ? (inputs[0] ?? false) : gateValue(node.type, inputs);
      if (logicValue(node) !== next) changed = true;
      node.state = { ...(node.state ?? {}), value: next };
    }
    if (!changed) break;
  }
  for (const edge of result.edges) {
    const source = edge.source === undefined ? undefined : nodes.get(edge.source);
    edge.state = { ...(edge.state ?? {}), value: source ? logicValue(source) : false };
  }
  return result;
}

function terminalMarkup(node: Readonly<TpGraphNode>, selected: boolean, kind: 'input' | 'output'): string {
  const value = logicValue(node);
  const shape = kind === 'input'
    ? `<circle r="18" class="tp-graph-shape tp-logic-terminal tp-logic-input${selected ? ' is-selected' : ''} ${value ? 'is-true' : 'is-false'}" />`
    : `<rect x="-18" y="-18" width="36" height="36" class="tp-graph-shape tp-logic-terminal tp-logic-output${selected ? ' is-selected' : ''} ${value ? 'is-true' : 'is-false'}" />`;
  return `${shape}
    <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${escapeXml(node.label ?? kind)}</text>`;
}

function hubMarkup(node: Readonly<TpGraphNode>, selected: boolean): string {
  return `<rect x="-28" y="-20" width="56" height="40" class="tp-graph-shape tp-logic-hub${selected ? ' is-selected' : ''}" />
    <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${escapeXml(node.label ?? 'Hub')}</text>`;
}

export type TpLogicGateRepresentation = 'iso' | 'ansi';

function gateMarkup(
  node: Readonly<TpGraphNode>, selected: boolean, type: string,
  label: string, inverted = false, representation: TpLogicGateRepresentation = 'iso',
): string {
  const value = logicValue(node);
  const classes = `tp-graph-shape tp-logic-gate${selected ? ' is-selected' : ''} ${value ? 'is-true' : 'is-false'}`;
  if (representation === 'ansi') {
    const baseType = baseGateType(type);
    const isOr = baseType === TP_LOGIC_OR || baseType === TP_LOGIC_NOR || baseType === TP_LOGIC_XOR;
    const body = baseType === TP_LOGIC_NOT
      ? `<path d="M -30 -24 V 24 L 30 0 Z" class="${classes}" />`
      : isOr
        ? `<path d="M -24 -24 Q -8 0 -24 24 Q 10 24 30 0 Q 10 -24 -24 -24 Z" class="${classes}" />
          <path d="M -30 -20 H -20 M -30 20 H -20${baseType === TP_LOGIC_XOR ? ' M -29 -24 Q -13 0 -29 24' : ''}" class="tp-logic-gate-detail ${value ? 'is-true' : 'is-false'}" />`
        : `<path d="M -30 -24 H 6 A 24 24 0 0 1 6 24 H -30 Z" class="${classes}" />`;
    return `${body}${inverted ? '<circle cx="35" cy="0" r="5" class="tp-logic-inversion" />' : ''}`;
  }
  return `<rect x="-30" y="-24" width="60" height="48" class="${classes}" />
    ${inverted ? '<circle cx="35" cy="0" r="5" class="tp-logic-inversion" />' : ''}
    <text class="tp-graph-label tp-logic-gate-label" text-anchor="middle" dominant-baseline="central">${label}</text>`;
}

/**
 * @summary Edits and simulates combinational logic circuits.
 * @tagname tp-graph-logical-circuit
 * @accessibility Makes logical input and output terminals operable by pointer and keyboard.
 * @keyboard {Enter / Space} Toggles the focused input or output terminal.
 * @example
 * <tp-graph-logical-circuit></tp-graph-logical-circuit>
 */
export class TpGraphLogicalCircuit extends TpGraphEditor {
  private static readonly logicStyleId = 'tp-graph-logical-circuit-styles';
  private gateRepresentation: TpLogicGateRepresentation = 'iso';
  private logicalEquationNotation: TpLogicalEquationNotation = 'electronic';

  public constructor() {
    super();
    this.unregisterPalette('generic');
    const gatePorts = {
      north: { x: -30, y: -20 },
      south: { x: -30, y: 20 },
      east: { x: 30, y: 0 },
    } as const;
    const invertedGatePorts = {
      north: { x: -30, y: -20 },
      south: { x: -30, y: 20 },
      east: { x: 40, y: 0 },
    } as const;
    const threeInputPorts = {
      north: { x: -30, y: -20 }, west: { x: -30, y: 0 },
      south: { x: -30, y: 20 }, east: { x: 30, y: 0 },
    } as const;
    const singleInputPorts = {
      west: { x: -30, y: 0 },
      east: { x: 40, y: 0 },
    } as const;
    const gate = (type: string, label: string, symbol: string, inverted = false, threeInputs = false) => ({
      type, label, description: `${label} gate`, width: inverted ? 80 : 60, height: 48,
      ports: type === TP_LOGIC_NOT ? singleInputPorts
        : threeInputs ? { ...threeInputPorts, ...(inverted ? { east: { x: 40, y: 0 } } : {}) }
          : inverted ? invertedGatePorts : gatePorts,
      render: (node: Readonly<TpGraphNode>, selected: boolean) => gateMarkup(
        node, selected, type, symbol, inverted, this.gateRepresentation,
      ),
    });
    this.registerPalette({
      id: 'logic-io', label: 'Inputs / outputs', shapes: [
        { type: TP_LOGIC_INPUT, label: 'Input', description: 'Toggleable input', width: 36, height: 36, ports: { east: { x: 18, y: 0 } }, createData: () => ({ value: false }), render: (node, selected) => terminalMarkup(node, selected, 'input') },
        { type: TP_LOGIC_OUTPUT, label: 'Output', description: 'Toggleable output', width: 36, height: 36, ports: { west: { x: -18, y: 0 } }, createData: () => ({ value: false }), render: (node, selected) => terminalMarkup(node, selected, 'output') },
        { type: TP_LOGIC_HUB, label: 'Hub', description: 'Four-port hub', width: 56, height: 40, ports: { north: { x: 0, y: -20 }, east: { x: 28, y: 0 }, south: { x: 0, y: 20 }, west: { x: -28, y: 0 } }, render: hubMarkup },
      ],
    });
    this.registerPalette({ id: 'logic-1', label: '1 output / 1 input', shapes: [gate(TP_LOGIC_NOT, 'NOT', '1', true)] });
    this.registerPalette({ id: 'logic-2', label: '1 output / 2 inputs', shapes: [
      gate(TP_LOGIC_AND, 'AND', '&'), gate(TP_LOGIC_OR, 'OR', '≥1'), gate(TP_LOGIC_XOR, 'XOR', '=1'),
      gate(TP_LOGIC_NAND, 'NAND', '&', true), gate(TP_LOGIC_NOR, 'NOR', '≥1', true),
    ] });
    this.registerPalette({ id: 'logic-3', label: '1 output / 3 inputs', shapes: [
      gate(TP_LOGIC_AND_3, 'AND 3', '&', false, true), gate(TP_LOGIC_OR_3, 'OR 3', '≥1', false, true),
      gate(TP_LOGIC_XOR_3, 'XOR 3', '=1', false, true), gate(TP_LOGIC_NAND_3, 'NAND 3', '&', true, true),
      gate(TP_LOGIC_NOR_3, 'NOR 3', '≥1', true, true),
    ] });
    this.portsVisible = true;
  }

  protected override connectedCallback(): void { super.connectedCallback(); this.ensureGlobalStyle(TpGraphLogicalCircuit.logicStyleId, style); }
  protected isSupportedLogicNode(type: string): boolean {
    return type === TP_GRAPH_COMMENT || (LOGIC_NODES as readonly string[]).includes(type);
  }
  protected validateLogicGraph(graph: Readonly<TpGraphDocument>): void { validateLogicalCircuit(graph); }
  public override setGraph(graph: TpGraphDocument): void {
    const normalized = normalizeLogicalPorts(graph);
    this.validateLogicGraph(normalized);
    TpGraphEditor.prototype.setGraph.call(this, normalized);
  }
  public override addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode {
    if (!this.isSupportedLogicNode(type)) throw new TypeError(`Unsupported logical-circuit node type: ${type}`);
    return TpGraphEditor.prototype.addNode.call(this, type, point, label);
  }
  public override addEdge(
    source: string, target: string, type = TP_LOGIC_WIRE,
    sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = 'forward',
  ): TpGraphEdge {
    if (direction !== 'forward') throw new TypeError('Logical wires must be forward.');
    this.validateConnection(source, target, type);
    this.assertInputCapacity(target);
    const resolvedTargetPort = this.resolveInputPort(target, targetPort);
    return super.addEdge(source, target, type, sourcePort, resolvedTargetPort, direction);
  }
  public override reconnectEdge(
    edgeId: string, endpoint: 'source' | 'target', nodeId: string, port: TpGraphPort,
  ): TpGraphEdge {
    if (endpoint === 'target') this.assertInputCapacity(nodeId, edgeId);
    const resolvedPort = endpoint === 'target' ? (this.resolveInputPort(nodeId, port, edgeId) ?? port) : port;
    return super.reconnectEdge(edgeId, endpoint, nodeId, resolvedPort);
  }
  protected override edgeDirections(): readonly TpGraphEdgeDirection[] { return ['forward']; }
  protected override validateConnection(source: string, target: string, type: string): void {
    super.validateConnection(source, target, type);
    const graph = this.value;
    const sourceNode = graph.nodes.find((node) => node.id === source);
    const targetNode = graph.nodes.find((node) => node.id === target);
    if (!sourceNode || !targetNode || sourceNode.type === TP_GRAPH_COMMENT || targetNode.type === TP_GRAPH_COMMENT) throw new TypeError('A wire must connect two logical elements.');
    if (source === target) throw new TypeError('Self-links are not allowed in combinational circuits.');
    if (sourceNode.type === TP_LOGIC_OUTPUT) throw new TypeError('An output cannot be the source of a wire.');
    if (targetNode.type === TP_LOGIC_INPUT) throw new TypeError('An input cannot be the target of a wire.');
    if (type !== TP_LOGIC_WIRE) throw new TypeError(`Unsupported wire type: ${type}`);
  }

  public toggle(id: string, propagate = true): boolean {
    const graph = this.value;
    const node = graph.nodes.find((candidate) => candidate.id === id);
    if (!node || (node.type !== TP_LOGIC_INPUT && node.type !== TP_LOGIC_OUTPUT)) throw new TypeError('Only inputs and outputs can be toggled.');
    const value = !logicValue(node);
    node.state = { ...(node.state ?? {}), value };
    this.setGraph(propagate && node.type === TP_LOGIC_INPUT ? evaluateLogicalCircuit(graph) : graph);
    this.dispatchEvent(new CustomEvent('tp-logic-toggle', { bubbles: true, detail: { id, value, graph: this.value } }));
    return value;
  }
  public evaluate(): void {
    this.setGraph(evaluateLogicalCircuit(this.value));
    this.dispatchEvent(new CustomEvent('tp-logic-evaluate', { bubbles: true, detail: { graph: this.value } }));
  }
  public get representation(): TpLogicGateRepresentation { return this.gateRepresentation; }
  public set representation(value: TpLogicGateRepresentation) {
    if (value !== 'iso' && value !== 'ansi') throw new TypeError(`Unsupported gate representation: ${value}`);
    this.gateRepresentation = value;
    super.setGraph(this.value);
  }
  public toggleRepresentation(): TpLogicGateRepresentation {
    this.representation = this.gateRepresentation === 'iso' ? 'ansi' : 'iso';
    return this.gateRepresentation;
  }
  public get equationNotation(): TpLogicalEquationNotation { return this.logicalEquationNotation; }
  public set equationNotation(value: TpLogicalEquationNotation) {
    if (value !== 'electronic' && value !== 'mathematical') throw new TypeError(`Unsupported logical equation notation: ${value}`);
    this.logicalEquationNotation = value;
    super.setGraph(this.value);
  }
  public toggleEquationNotation(): TpLogicalEquationNotation {
    this.equationNotation = this.logicalEquationNotation === 'electronic' ? 'mathematical' : 'electronic';
    return this.logicalEquationNotation;
  }
  protected override renderResults(): string {
    const inputs = this.value.nodes.filter((node) => node.type === TP_LOGIC_INPUT);
    const outputs = this.value.nodes.filter((node) => node.type === TP_LOGIC_OUTPUT);
    const measurements = this.value.edges.flatMap((edge) => graphEdgeMeasurements(edge)
      .filter((measurement) => measurement.label)
      .map((measurement) => ({ edgeId: edge.id, measurement })));
    if (inputs.length === 0 || outputs.length === 0) return '';
    if (inputs.length > 8) {
      return '<h3 class="tp-graph-results-header">Truth table</h3><div class="tp-graph-results-content">Truth tables are limited to 8 inputs.</div>';
    }
    try {
      const rows: string[] = [];
      const combinations = 2 ** inputs.length;
      const outputStart = inputs.length + measurements.length;
      const isGroupStart = (index: number): boolean => index === inputs.length || index === outputStart;
      for (let combination = 0; combination < combinations; combination += 1) {
        const graph = this.value;
        const values = inputs.map((_, index) => (combination & (1 << (inputs.length - index - 1))) !== 0);
        for (const [index, input] of inputs.entries()) {
          const node = graph.nodes.find((candidate) => candidate.id === input.id);
          if (node) node.state = { ...(node.state ?? {}), value: values[index] };
        }
        const evaluated = evaluateLogicalCircuit(graph);
        const cells = [...values,
          ...measurements.map(({ edgeId }) => evaluated.edges.find((edge) => edge.id === edgeId)?.state?.value === true),
          ...outputs.map((output) => evaluated.nodes
          .find((node) => node.id === output.id)?.state?.value === true)];
        rows.push(`<tr>${cells.map((value, index) => `<td${isGroupStart(index) ? ' class="tp-logic-truth-boundary"' : ''}>${value ? '1' : '0'}</td>`).join('')}</tr>`);
      }
      const headers = [
        ...inputs.map((node) => node.label ?? node.id),
        ...measurements.map(({ measurement }) => measurement.label ?? measurement.id),
        ...outputs.map((node) => node.label ?? node.id),
      ].map((label, index) => `<th scope="col"${isGroupStart(index) ? ' class="tp-logic-truth-boundary"' : ''}>${escapeXml(label)}</th>`).join('');
      const equations = getLogicalEquations(this.value, this.logicalEquationNotation).map((equation) => `<tp-markdown class="tp-logic-equation">
        <script type="tp/markdown">---
extensions:
  - math
---
:latexmath:\`${equation.latex}\`</script>
      </tp-markdown>`).join('');
      return `<div class="tp-logic-results-layout">
        <section><h3 class="tp-graph-results-header">Truth table</h3><div class="tp-graph-results-content"><table><thead><tr>${headers}</tr></thead><tbody>${rows.join('')}</tbody></table></div></section>
        <section><h3 class="tp-graph-results-header tp-logic-equations-header"><span>Logical equations</span><tp-icon-button size="xs" name="function" label="Use ${this.logicalEquationNotation === 'electronic' ? 'mathematical' : 'electronic'} notation" data-logic-action="equation-notation"></tp-icon-button></h3><div class="tp-graph-results-content tp-logic-equations">${equations}</div></section>
      </div>`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The truth table is unavailable.';
      return `<h3 class="tp-graph-results-header">Truth table</h3><div class="tp-graph-results-content">${escapeXml(message)}</div>`;
    }
  }
  protected override renderToolbarActions(): string {
    const next = this.gateRepresentation === 'iso' ? 'ANSI' : 'ISO';
    return `<tp-icon-button name="shapes" label="Use ${next} gate symbols" data-logic-action="representation"></tp-icon-button>
      <tp-icon-button name="play" label="Evaluate circuit" data-logic-action="evaluate"></tp-icon-button>`;
  }
  protected override bindExtensionEvents(): void {
    this.querySelector('[data-logic-action="evaluate"]')?.addEventListener('click', () => this.evaluate());
    this.querySelector('[data-logic-action="representation"]')?.addEventListener('click', () => this.toggleRepresentation());
    this.querySelector('[data-logic-action="equation-notation"]')?.addEventListener('click', () => this.toggleEquationNotation());
    for (const node of this.querySelectorAll<SVGGElement>('[data-node-id]')) {
      const id = node.dataset.nodeId;
      const model = this.value.nodes.find((candidate) => candidate.id === id);
      if (!id || (model?.type !== TP_LOGIC_INPUT && model?.type !== TP_LOGIC_OUTPUT)) continue;
      node.classList.add('is-toggleable');
      node.addEventListener('click', (event) => { event.stopPropagation(); this.toggle(id); });
      node.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        this.toggle(id);
      });
    }
  }

  private assertInputCapacity(targetId: string, ignoredEdgeId?: string): void {
    const graph = this.value;
    const target = graph.nodes.find((node) => node.id === targetId);
    if (!target || target.type === TP_LOGIC_INPUT || target.type === TP_GRAPH_COMMENT) return;
    const incomingCount = graph.edges.filter((edge) => edge.id !== ignoredEdgeId && edge.target === targetId).length;
    const maximum = target.type === TP_LOGIC_NOT || target.type === TP_LOGIC_OUTPUT ? 1
      : (THREE_INPUT_GATES as readonly string[]).includes(target.type) ? 3
        : target.type === TP_LOGIC_HUB ? 4 : 2;
    if (incomingCount >= maximum) {
      const message = target.type === TP_LOGIC_NOT ? 'NOT gates accept only one input wire.'
        : target.type === TP_LOGIC_OUTPUT ? 'Outputs accept only one input wire.'
          : `This gate accepts only ${maximum} input wires.`;
      throw new TypeError(message);
    }
  }

  private resolveInputPort(targetId: string, requested?: TpGraphPort, ignoredEdgeId?: string): TpGraphPort | undefined {
    const graph = this.value;
    const target = graph.nodes.find((node) => node.id === targetId);
    if (!target || !(LOGIC_GATES as readonly string[]).includes(target.type)) return requested;
    const used = new Set(graph.edges
      .filter((edge) => edge.id !== ignoredEdgeId && edge.target === targetId)
      .map((edge) => edge.targetPort)
      .filter((port): port is TpGraphPort => port !== undefined));
    const available = gateInputPorts(target.type);
    if (requested && available.includes(requested) && !used.has(requested)) return requested;
    return available.find((port) => !used.has(port)) ?? requested;
  }
}

if (!customElements.get('tp-graph-logical-circuit')) customElements.define('tp-graph-logical-circuit', TpGraphLogicalCircuit);
