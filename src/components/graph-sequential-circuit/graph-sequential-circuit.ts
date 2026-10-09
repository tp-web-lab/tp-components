/**
 * @module components/graph-sequential-circuit
 * @summary Interactive synchronous sequential logic circuit editor and simulator.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-graph-logical-circuit
 * @summary Interactive combinational logic circuit editor and simulator.
 */
// tp-docgen:dependencies:end

import {
  evaluateLogicalCircuit,
  TpGraphLogicalCircuit,
  TP_LOGIC_HUB,
  TP_LOGIC_INPUT,
  TP_LOGIC_OUTPUT,
  type TpLogicGateRepresentation,
  validateLogicalCircuit,
} from '../graph-logical-circuit/graph-logical-circuit.js';
import {
  type TpGraphDocument,
  type TpGraphNode,
} from '../graph-editor/graph-editor.js';
import style from './graph-sequential-circuit.css?inline';

export const TP_LOGIC_CLOCK = 'logic-clock';
export const TP_LOGIC_D_FLIP_FLOP = 'logic-d-flip-flop';
export const TP_LOGIC_SR_LATCH = 'logic-sr-latch';
export const TP_LOGIC_D_LATCH = 'logic-d-latch';
export const TP_LOGIC_JK_FLIP_FLOP = 'logic-jk-flip-flop';
export const TP_LOGIC_T_FLIP_FLOP = 'logic-t-flip-flop';

const MEMORY_TYPES = [
  TP_LOGIC_D_FLIP_FLOP,
  TP_LOGIC_SR_LATCH,
  TP_LOGIC_D_LATCH,
  TP_LOGIC_JK_FLIP_FLOP,
  TP_LOGIC_T_FLIP_FLOP,
] as const;

interface SequentialSample {
  label: string;
  values: Record<string, boolean>;
}

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function memoryMarkup(node: Readonly<TpGraphNode>, selected: boolean, symbol: string, fallback: string): string {
  const value = node.state?.value === true;
  return `<rect x="-34" y="-28" width="68" height="56" class="tp-graph-shape tp-sequential-memory${selected ? ' is-selected' : ''}" />
    <text x="0" y="-5" class="tp-graph-label tp-sequential-symbol" text-anchor="middle">${symbol}</text>
    <text x="0" y="15" class="tp-graph-label" text-anchor="middle">${escapeXml(node.label ?? fallback)}</text>
    <text x="27" y="5" class="tp-graph-label tp-sequential-q" text-anchor="end">Q</text>
    <circle cx="26" cy="-18" r="4" class="tp-sequential-state ${value ? 'is-true' : 'is-false'}" />`;
}

function clockMarkup(node: Readonly<TpGraphNode>, selected: boolean): string {
  return `<circle r="22" class="tp-graph-shape tp-sequential-clock${selected ? ' is-selected' : ''}" />
    <path d="M-13 4H-5V-7H5V4H13" class="tp-sequential-clock-wave" />
    <text y="35" class="tp-graph-label" text-anchor="middle">${escapeXml(node.label ?? 'Clock')}</text>`;
}

function validateSequentialConnections(graph: Readonly<TpGraphDocument>): void {
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const isClockSignal = (nodeId: string, visited = new Set<string>()): boolean => {
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    const node = nodes.get(nodeId);
    if (node?.type === TP_LOGIC_CLOCK) return true;
    if (node?.type !== TP_LOGIC_HUB) return false;
    return graph.edges.some((edge) => edge.target === nodeId && edge.source !== undefined
      && isClockSignal(edge.source, visited));
  };
  const occupied = new Map<string, Set<string>>();
  for (const edge of graph.edges) {
    if (edge.target === undefined) continue;
    const target = nodes.get(edge.target);
    if (target?.type === TP_LOGIC_CLOCK) throw new TypeError('A clock cannot receive a wire.');
    if (!target || !(MEMORY_TYPES as readonly string[]).includes(target.type)) continue;
    if (edge.source === edge.target) throw new TypeError('A flip-flop cannot connect to itself.');
    if (edge.direction !== undefined && edge.direction !== 'forward') throw new TypeError('Sequential wires must be forward.');
    const validPorts = target.type === TP_LOGIC_SR_LATCH || target.type === TP_LOGIC_D_LATCH
      ? ['west', 'south'] : target.type === TP_LOGIC_T_FLIP_FLOP ? ['west', 'north'] : ['west', 'north', 'south'];
    if (!edge.targetPort || !validPorts.includes(edge.targetPort)) {
      throw new TypeError(`Invalid input port for ${target.type}.`);
    }
    const used = occupied.get(target.id) ?? new Set<string>();
    if (used.has(edge.targetPort)) throw new TypeError(`Flip-flop port ${edge.targetPort} is already connected.`);
    used.add(edge.targetPort);
    occupied.set(target.id, used);
    const clocked = target.type === TP_LOGIC_D_FLIP_FLOP
      || target.type === TP_LOGIC_JK_FLIP_FLOP || target.type === TP_LOGIC_T_FLIP_FLOP;
    if (clocked && edge.targetPort === 'north' && !isClockSignal(edge.source ?? '')) {
      throw new TypeError('The clock port must be connected to a clock, directly or through a hub.');
    }
  }
}

function combinationalProjection(graph: Readonly<TpGraphDocument>): TpGraphDocument {
  const result: TpGraphDocument = structuredClone(graph);
  const memoryIds = new Set(result.nodes
    .filter((node) => node.type === TP_LOGIC_CLOCK || (MEMORY_TYPES as readonly string[]).includes(node.type))
    .map((node) => node.id));
  for (const node of result.nodes) {
    if (memoryIds.has(node.id)) node.type = TP_LOGIC_INPUT;
  }
  result.edges = result.edges.filter((edge) => edge.target === undefined || !memoryIds.has(edge.target));
  return result;
}

export function validateSequentialCircuit(graph: Readonly<TpGraphDocument>): void {
  validateSequentialConnections(graph);
  validateLogicalCircuit(combinationalProjection(graph));
}

export function evaluateSequentialCombinational(graph: Readonly<TpGraphDocument>): TpGraphDocument {
  validateSequentialCircuit(graph);
  const result = structuredClone(graph);
  const evaluated = evaluateLogicalCircuit(combinationalProjection(result));
  const evaluatedNodes = new Map(evaluated.nodes.map((node) => [node.id, node]));
  for (const node of result.nodes) {
    if (node.type !== TP_LOGIC_CLOCK && !(MEMORY_TYPES as readonly string[]).includes(node.type)) {
      node.state = structuredClone(evaluatedNodes.get(node.id)?.state ?? node.state);
    }
  }
  const inputValue = (target: string, port: string): boolean => {
    const edge = result.edges.find((candidate) => candidate.target === target && candidate.targetPort === port);
    return edge?.source !== undefined && evaluatedNodes.get(edge.source)?.state?.value === true;
  };
  for (const memory of result.nodes) {
    const current = memory.state?.value === true;
    let value = current;
    if (memory.type === TP_LOGIC_SR_LATCH) {
      const set = inputValue(memory.id, 'west');
      const reset = inputValue(memory.id, 'south');
      if (set !== reset) value = set;
      memory.state = { ...(memory.state ?? {}), value, invalid: set && reset };
    } else if (memory.type === TP_LOGIC_D_LATCH && inputValue(memory.id, 'south')) {
      value = inputValue(memory.id, 'west');
      memory.state = { ...(memory.state ?? {}), value };
    }
  }
  const reevaluated = evaluateLogicalCircuit(combinationalProjection(result));
  const reevaluatedNodes = new Map(reevaluated.nodes.map((node) => [node.id, node]));
  for (const node of result.nodes) {
    if (node.type !== TP_LOGIC_CLOCK && !(MEMORY_TYPES as readonly string[]).includes(node.type)) {
      node.state = structuredClone(reevaluatedNodes.get(node.id)?.state ?? node.state);
    }
  }
  const nodes = new Map(result.nodes.map((node) => [node.id, node]));
  for (const edge of result.edges) {
    const source = edge.source === undefined ? undefined : nodes.get(edge.source);
    edge.state = { ...(edge.state ?? {}), value: source?.state?.value === true };
  }
  return result;
}

/**
 * @summary Edits and simulates synchronous sequential logic circuits.
 * @tagname tp-graph-sequential-circuit
 * @example
 * <tp-graph-sequential-circuit></tp-graph-sequential-circuit>
 */
export class TpGraphSequentialCircuit extends TpGraphLogicalCircuit {
  private static readonly sequentialStyleId = 'tp-graph-sequential-circuit-styles';
  private timer: number | null = null;
  private timeline: SequentialSample[] = [];

  public constructor() {
    super();
    this.registerPalette({
      id: 'logic-sequential', label: 'Sequential', shapes: [
        {
          type: TP_LOGIC_CLOCK, label: 'Clock', description: 'Rising-edge clock', width: 44, height: 44,
          ports: { east: { x: 22, y: 0 } }, createData: () => ({ period: 700 }), render: clockMarkup,
        },
        {
          type: TP_LOGIC_D_FLIP_FLOP, label: 'D flip-flop', description: 'Rising-edge D flip-flop', width: 68, height: 56,
          ports: {
            west: { x: -34, y: 0 },
            north: { x: 0, y: -28 },
            east: { x: 34, y: 0 },
            south: { x: 0, y: 28 },
          },
          createData: () => ({ initial: false, trigger: 'rising' }),
          render: (node, selected) => memoryMarkup(node, selected, 'D', 'DFF'),
        },
        {
          type: TP_LOGIC_SR_LATCH, label: 'SR latch', description: 'Level-sensitive SR latch', width: 68, height: 56,
          ports: { west: { x: -34, y: 0 }, east: { x: 34, y: 0 }, south: { x: 0, y: 28 } },
          createData: () => ({ initial: false }), render: (node, selected) => memoryMarkup(node, selected, 'SR', 'SR'),
        },
        {
          type: TP_LOGIC_D_LATCH, label: 'D latch', description: 'Enable-controlled D latch', width: 68, height: 56,
          ports: { west: { x: -34, y: 0 }, east: { x: 34, y: 0 }, south: { x: 0, y: 28 } },
          createData: () => ({ initial: false }), render: (node, selected) => memoryMarkup(node, selected, 'D', 'Latch'),
        },
        {
          type: TP_LOGIC_JK_FLIP_FLOP, label: 'JK flip-flop', description: 'Rising-edge JK flip-flop', width: 68, height: 56,
          ports: { west: { x: -34, y: 0 }, north: { x: 0, y: -28 }, east: { x: 34, y: 0 }, south: { x: 0, y: 28 } },
          createData: () => ({ initial: false, trigger: 'rising' }),
          render: (node, selected) => memoryMarkup(node, selected, 'JK', 'JK'),
        },
        {
          type: TP_LOGIC_T_FLIP_FLOP, label: 'T flip-flop', description: 'Rising-edge toggle flip-flop', width: 68, height: 56,
          ports: { west: { x: -34, y: 0 }, north: { x: 0, y: -28 }, east: { x: 34, y: 0 } },
          createData: () => ({ initial: false, trigger: 'rising' }),
          render: (node, selected) => memoryMarkup(node, selected, 'T', 'TFF'),
        },
      ],
    });
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpGraphSequentialCircuit.sequentialStyleId, style);
    if (this.timeline.length === 0) {
      this.recordSample(this.value, 'Initial', false);
      this.setGraph(this.value);
    }
  }

  public override disconnectedCallback(): void { this.stop(); super.disconnectedCallback(); }

  protected override isSupportedLogicNode(type: string): boolean {
    return type === TP_LOGIC_CLOCK || (MEMORY_TYPES as readonly string[]).includes(type) || super.isSupportedLogicNode(type);
  }

  protected override validateLogicGraph(graph: Readonly<TpGraphDocument>): void { validateSequentialCircuit(graph); }

  public override toggle(id: string, propagate = true): boolean {
    const graph = this.value;
    const node = graph.nodes.find((candidate) => candidate.id === id);
    if (!node || (node.type !== TP_LOGIC_INPUT && node.type !== TP_LOGIC_OUTPUT)) {
      throw new TypeError('Only inputs and outputs can be toggled.');
    }
    const value = node.state?.value !== true;
    node.state = { ...(node.state ?? {}), value };
    const result = propagate && node.type === TP_LOGIC_INPUT ? evaluateSequentialCombinational(graph) : graph;
    this.recordSample(result, node.label ?? node.id, false);
    this.setGraph(result);
    this.dispatchEvent(new CustomEvent('tp-logic-toggle', { bubbles: true, detail: { id, value, graph: this.value } }));
    return value;
  }

  public override evaluate(): void {
    const graph = evaluateSequentialCombinational(this.value);
    this.recordSample(graph, 'Evaluate', false);
    this.setGraph(graph);
    this.dispatchEvent(new CustomEvent('tp-logic-evaluate', { bubbles: true, detail: { graph: this.value } }));
  }

  public clockStep(): void {
    const lowGraph = this.value;
    for (const clock of lowGraph.nodes.filter((node) => node.type === TP_LOGIC_CLOCK)) {
      clock.state = { ...(clock.state ?? {}), value: false };
    }
    this.recordSample(lowGraph, 'Clock 0', false);
    const highGraph = structuredClone(lowGraph);
    for (const clock of highGraph.nodes.filter((node) => node.type === TP_LOGIC_CLOCK)) {
      clock.state = { ...(clock.state ?? {}), value: true };
    }
    const graph = evaluateSequentialCombinational(highGraph);
    const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
    const nextValues = new Map<string, boolean>();
    const inputValue = (target: string, port: string): boolean => {
      const input = graph.edges.find((edge) => edge.target === target && edge.targetPort === port);
      return input?.source !== undefined && nodes.get(input.source)?.state?.value === true;
    };
    for (const flipFlop of graph.nodes) {
      const current = flipFlop.state?.value === true;
      if (flipFlop.type === TP_LOGIC_D_FLIP_FLOP) nextValues.set(flipFlop.id, inputValue(flipFlop.id, 'west'));
      else if (flipFlop.type === TP_LOGIC_T_FLIP_FLOP) {
        nextValues.set(flipFlop.id, inputValue(flipFlop.id, 'west') ? !current : current);
      } else if (flipFlop.type === TP_LOGIC_JK_FLIP_FLOP) {
        const j = inputValue(flipFlop.id, 'west');
        const k = inputValue(flipFlop.id, 'south');
        nextValues.set(flipFlop.id, j && k ? !current : j ? true : k ? false : current);
      }
    }
    for (const [id, value] of nextValues) {
      const flipFlop = nodes.get(id);
      if (flipFlop) flipFlop.state = { ...(flipFlop.state ?? {}), value };
    }
    const result = evaluateSequentialCombinational(graph);
    this.recordSample(result, 'Clock ↑', true);
    for (const clock of result.nodes.filter((node) => node.type === TP_LOGIC_CLOCK)) {
      clock.state = { ...(clock.state ?? {}), value: false };
    }
    const settled = evaluateSequentialCombinational(result);
    this.recordSample(settled, 'Clock 0', false);
    this.setGraph(settled);
    this.dispatchEvent(new CustomEvent('tp-sequential-clock', {
      bubbles: true, detail: { values: Object.fromEntries(nextValues), graph: this.value },
    }));
  }

  public resetSequentialState(): void {
    const graph = this.value;
    for (const node of graph.nodes) {
      if ((MEMORY_TYPES as readonly string[]).includes(node.type)) {
        node.state = { ...(node.state ?? {}), value: node.data?.initial === true };
      }
    }
    const result = evaluateSequentialCombinational(graph);
    this.timeline = [];
    this.recordSample(result, 'Reset', false);
    this.setGraph(result);
    this.dispatchEvent(new CustomEvent('tp-sequential-reset', { bubbles: true, detail: { graph: this.value } }));
  }

  public run(period = 700): void {
    if (this.timer !== null) return;
    const safePeriod = Number.isFinite(period) ? Math.max(100, period) : 700;
    this.timer = window.setInterval(() => this.clockStep(), safePeriod);
    this.renderRunState();
  }

  public stop(): void {
    if (this.timer === null) return;
    window.clearInterval(this.timer);
    this.timer = null;
    this.renderRunState();
  }

  public get running(): boolean { return this.timer !== null; }

  protected override renderResults(): string {
    const samples = this.timeline ?? [];
    if (samples.length === 0) return '';
    const signals = this.value.nodes.filter((node) => node.type === TP_LOGIC_INPUT
      || node.type === TP_LOGIC_OUTPUT || node.type === TP_LOGIC_CLOCK
      || (MEMORY_TYPES as readonly string[]).includes(node.type));
    if (signals.length === 0) return '';
    const labelWidth = 90;
    const stepWidth = 54;
    const rowHeight = 30;
    const width = labelWidth + samples.length * stepWidth;
    const height = 24 + signals.length * rowHeight;
    const grid = samples.map((_, index) => {
      const x = labelWidth + index * stepWidth;
      return `<path class="tp-graph-results-wave-grid" d="M${x} 20V${height}" />
        <text class="tp-graph-results-wave-step" x="${x + stepWidth / 2}" y="13" text-anchor="middle">${escapeXml(samples[index]?.label ?? '')}</text>`;
    }).join('');
    const waves = signals.map((signal, row) => {
      const top = 24 + row * rowHeight;
      const high = top + 7;
      const low = top + 23;
      let path = `M ${labelWidth} ${samples[0]?.values[signal.id] === true ? high : low}`;
      for (let index = 0; index < samples.length; index += 1) {
        const x = labelWidth + (index + 1) * stepWidth;
        path += ` H ${x}`;
        const next = samples[index + 1];
        if (next) path += ` V ${next.values[signal.id] === true ? high : low}`;
      }
      return `<text class="tp-graph-results-wave-label" x="${labelWidth - 8}" y="${top + 18}" text-anchor="end">${escapeXml(signal.label ?? signal.id)}</text>
        <path class="tp-graph-results-wave" d="${path}" />`;
    }).join('');
    return `<h3 class="tp-graph-results-header">Timing diagram</h3><div class="tp-graph-results-content"><svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Circuit timing diagram">${grid}${waves}</svg></div>`;
  }

  protected override renderToolbarActions(): string {
    const next: TpLogicGateRepresentation = this.representation === 'iso' ? 'ansi' : 'iso';
    return `<tp-icon-button name="refresh" label="Reset sequential state" data-sequential-action="reset"></tp-icon-button>
      <tp-icon-button name="vector-square" label="Use ${next.toUpperCase()} gate symbols" data-sequential-action="representation"></tp-icon-button>
      <tp-icon-button name="stop" label="Stop clock" data-sequential-action="stop" ${this.running ? '' : 'disabled'}></tp-icon-button>
      <tp-icon-button name="playlist-play" label="Run clock" data-sequential-action="run" ${this.running ? 'disabled' : ''}></tp-icon-button>
      <tp-icon-button name="play" label="Clock step" data-sequential-action="step"></tp-icon-button>`;
  }

  protected override bindExtensionEvents(): void {
    super.bindExtensionEvents();
    this.querySelector('[data-sequential-action="reset"]')?.addEventListener('click', () => this.resetSequentialState());
    this.querySelector('[data-sequential-action="representation"]')?.addEventListener('click', () => this.toggleRepresentation());
    this.querySelector('[data-sequential-action="stop"]')?.addEventListener('click', () => this.stop());
    this.querySelector('[data-sequential-action="run"]')?.addEventListener('click', () => this.run());
    this.querySelector('[data-sequential-action="step"]')?.addEventListener('click', () => this.clockStep());
  }

  private renderRunState(): void {
    if (this.isConnected) this.setGraph(this.value);
  }

  private recordSample(graph: Readonly<TpGraphDocument>, label: string, clockHigh: boolean): void {
    const values: Record<string, boolean> = {};
    for (const node of graph.nodes) {
      values[node.id] = node.type === TP_LOGIC_CLOCK ? clockHigh : node.state?.value === true;
    }
    this.timeline.push({ label, values });
    if (this.timeline.length > 24) this.timeline.shift();
  }

}

if (!customElements.get('tp-graph-sequential-circuit')) {
  customElements.define('tp-graph-sequential-circuit', TpGraphSequentialCircuit);
}

declare global {
  interface HTMLElementTagNameMap { 'tp-graph-sequential-circuit': TpGraphSequentialCircuit }
}
