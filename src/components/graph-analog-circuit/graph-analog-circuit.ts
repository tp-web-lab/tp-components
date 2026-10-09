/**
 * @module components/graph-analog-circuit
 * @summary Interactive analog-circuit editor and transient simulator.
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
  type TpGraphEdgeRouting,
  type TpGraphNode,
  type TpGraphPoint,
  type TpGraphPort,
} from '../graph-editor/graph-editor.js';
import '../markdown/markdown.js';
import style from './graph-analog-circuit.css?inline';

export const TP_ANALOG_RESISTOR = 'analog-resistor';
export const TP_ANALOG_CAPACITOR = 'analog-capacitor';
export const TP_ANALOG_INDUCTOR = 'analog-inductor';
export const TP_ANALOG_DIODE = 'analog-diode';
export const TP_ANALOG_LED = 'analog-led';
export const TP_ANALOG_LAMP = 'analog-lamp';
export const TP_ANALOG_MOTOR = 'analog-motor';
export const TP_ANALOG_RHEOSTAT = 'analog-rheostat';
export const TP_ANALOG_POTENTIOMETER = 'analog-potentiometer';
export const TP_ANALOG_TRANSISTOR = 'analog-transistor';
export const TP_ANALOG_TRANSISTOR_NPN = 'analog-transistor-npn';
export const TP_ANALOG_TRANSISTOR_PNP = 'analog-transistor-pnp';
export const TP_ANALOG_OP_AMP = 'analog-op-amp';
export const TP_ANALOG_VOLTAGE_SOURCE = 'analog-voltage-source';
export const TP_ANALOG_CURRENT_SOURCE = 'analog-current-source';
export const TP_ANALOG_GROUND = 'analog-ground';
export const TP_ANALOG_HUB = 'analog-hub';
export const TP_ANALOG_SWITCH = 'analog-switch';
export const TP_ANALOG_PROBE = 'analog-probe';
export const TP_ANALOG_SCOPE = 'analog-oscilloscope';
export const TP_ANALOG_WIRE = 'analog-wire';

const ANALOG_TYPES = [TP_ANALOG_RESISTOR, TP_ANALOG_CAPACITOR, TP_ANALOG_INDUCTOR, TP_ANALOG_DIODE, TP_ANALOG_LED, TP_ANALOG_LAMP, TP_ANALOG_MOTOR, TP_ANALOG_RHEOSTAT, TP_ANALOG_POTENTIOMETER,
  TP_ANALOG_TRANSISTOR, TP_ANALOG_TRANSISTOR_NPN, TP_ANALOG_TRANSISTOR_PNP, TP_ANALOG_OP_AMP, TP_ANALOG_VOLTAGE_SOURCE, TP_ANALOG_CURRENT_SOURCE,
  TP_ANALOG_GROUND, TP_ANALOG_HUB, TP_ANALOG_SWITCH, TP_ANALOG_PROBE, TP_ANALOG_SCOPE] as const;

export interface TpAnalogSample { time: number; values: Readonly<Record<string, number>> }
export interface TpAnalogSimulation { samples: readonly TpAnalogSample[]; duration: number; step: number }
export type TpAnalogMeasurementMode = 'voltage' | 'current';
const SI_PREFIXES: readonly Readonly<{ symbol: string; scale: number }>[] = [{ symbol: 'p', scale: 1e-12 }, { symbol: 'n', scale: 1e-9 }, { symbol: 'µ', scale: 1e-6 }, { symbol: 'm', scale: 1e-3 }, { symbol: '', scale: 1 }, { symbol: 'k', scale: 1e3 }, { symbol: 'M', scale: 1e6 }, { symbol: 'G', scale: 1e9 }];

function escapeXml(value: string): string { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
function numberData(node: Readonly<TpGraphNode>, key: string, fallback: number): number { const value = node.data?.[key]; return typeof value === 'number' && Number.isFinite(value) ? value : fallback; }
function label(node: Readonly<TpGraphNode>, fallback: string): string { return escapeXml(node.label ?? fallback); }
type QuarterAngle = 0 | 90 | 180 | 270;
function componentAngle(node: Readonly<TpGraphNode>): QuarterAngle { const value = node.data?.angle; return value === 90 || value === 180 || value === 270 ? value : node.data?.orientation === 'vertical' ? 90 : 0; }
function componentLabel(node: Readonly<TpGraphNode>, fallback: string, horizontalY: number, verticalX: number): string { return componentAngle(node) % 180 === 90 ? `<text class="tp-graph-label" x="${verticalX}" y="0" text-anchor="start" dominant-baseline="central">${label(node, fallback)}</text>` : `<text class="tp-graph-label" text-anchor="middle" y="${horizontalY}">${label(node, fallback)}</text>`; }
function oriented(content: string, node: Readonly<TpGraphNode>): string { const angle = componentAngle(node); return `<g class="tp-analog-symbol"${angle === 0 ? '' : ` transform="rotate(${angle})"`}>${content}</g>`; }
function rotatePoint(point: Readonly<TpGraphPoint>, angle: QuarterAngle): TpGraphPoint { if (angle === 90) return { x: -point.y, y: point.x }; if (angle === 180) return { x: -point.x, y: -point.y }; if (angle === 270) return { x: point.y, y: -point.x }; return { ...point }; }
function rotatePort(port: TpGraphPort, angle: QuarterAngle): TpGraphPort { const ports: readonly TpGraphPort[] = ['north', 'east', 'south', 'west']; return ports[(ports.indexOf(port) + angle / 90) % 4] as TpGraphPort; }
function passiveSymbol(node: Readonly<TpGraphNode>, selected: boolean, kind: string, fallback: string): string {
  const symbols: Readonly<Record<string, string>> = {
    resistor: '<path d="M-36,0H-22 M22,0H36"/><rect x="-22" y="-9" width="44" height="18"/>',
    capacitor: '<path d="M-36,0H-5 M5,0H36 M-5,-18V18 M5,-18V18"/>',
    inductor: '<path d="M-36,0H-24 M24,0H36 M-24,0a6,8 0 0 1 12,0a6,8 0 0 1 12,0a6,8 0 0 1 12,0a6,8 0 0 1 12,0"/>',
    diode: '<path d="M-36,0H-13 M13,0H36 M-13,-14L13,0L-13,14Z M13,-16V16"/>',
    led: '<path d="M-36,0H-13 M13,0H36 M-13,-14L13,0L-13,14Z M13,-16V16 M8,-17L20,-29 M15,-29H20V-24 M15,-10L27,-22 M22,-22H27V-17"/>',
    lamp: '<path d="M-36,0H-22 M22,0H36"/><circle r="22"/><path d="M-15,-15L15,15 M15,-15L-15,15"/>',
    rheostat: '<path d="M-36,0H-22 M22,0H36"/><rect x="-22" y="-9" width="44" height="18"/><path d="M-14,20L15,-18 M13.5,-7.8L15,-18L5.6,-13.9"/>',
    potentiometer: '<path d="M-36,0H-22 M22,0H36"/><rect x="-22" y="-9" width="44" height="18"/><path d="M0,-36V-9 M-6,-16L0,-9L6,-16"/>',
  };
  return `<rect x="-38" y="-22" width="76" height="44" class="tp-graph-shape tp-analog-hit${selected ? ' is-selected' : ''}"/>${oriented(symbols[kind] ?? '', node)}${componentLabel(node, fallback, 34, 30)}`;
}
function motorSymbol(node: Readonly<TpGraphNode>, selected: boolean): string {
  return `<rect x="-38" y="-24" width="76" height="48" class="tp-graph-shape tp-analog-hit${selected ? ' is-selected' : ''}"/>${oriented('<path d="M-36,0H-22 M22,0H36"/><circle r="22"/>', node)}<text class="tp-analog-internal-letter" text-anchor="middle" dominant-baseline="central">M</text>${componentLabel(node, 'Motor', 36, 30)}`;
}
function source(node: Readonly<TpGraphNode>, selected: boolean, current = false): string {
  const waveform = node.data?.waveform;
  const dc = !current && waveform !== 'square' && waveform !== 'sine';
  const symbol = dc ? '<circle r="22"/><path d="M-36,0H-5 M5,0H36 M-5,-8V8 M5,-14V14"/>' : '<path d="M-36,0H-22 M22,0H36"/><circle r="22"/>';
  const glyph = current ? '<path d="M0,12V-12 M-6,-6L0,-12L6,-6"/>' : waveform === 'square' ? '<path d="M-13,8V-8H0V8H13"/>' : waveform === 'sine' ? '<path d="M-12,0C-8,-10,-4,-10,0,0S8,10,12,0"/>' : '';
  return `<rect x="-38" y="-24" width="76" height="48" class="tp-graph-shape tp-analog-hit${selected ? ' is-selected' : ''}"/>${oriented(symbol, node)}${glyph ? `<g class="tp-analog-symbol tp-analog-readable-glyph">${glyph}</g>` : ''}${componentLabel(node, current ? 'I' : 'V', 36, 30)}`;
}
function switchSymbol(node: Readonly<TpGraphNode>, selected: boolean): string {
  const closed = node.data?.closed === true;
  return `<rect x="-38" y="-22" width="76" height="44" class="tp-graph-shape tp-analog-hit${selected ? ' is-selected' : ''}"/>${oriented(`<path d="M-36,0H-20 M20,0H36"/><circle cx="-20" r="3"/><circle cx="20" r="3"/><path d="M-17,${closed ? 0 : -2}L17,${closed ? 0 : -15}"/>`, node)}${componentLabel(node, 'Switch', 34, 30)}`;
}
function activeSymbol(node: Readonly<TpGraphNode>, selected: boolean, opAmp: boolean, transistorKind: 'npn' | 'pnp' = 'npn'): string {
  const transistorArrow = transistorKind === 'pnp' ? 'M6,17L17.2,16.5L13.1,25.6Z' : 'M24,25L12.8,25.5L16.9,16.4Z';
  const content = opAmp
    ? '<path d="M-30,-25V25L30,0Z M-42,-14H-30 M-42,14H-30 M30,0H42"/>'
    : `<circle r="25"/><path d="M-38,0H-10 M-10,-16V16 M-10,-10L24,-25 M-10,10L24,25"/><path class="tp-analog-transistor-arrow" d="${transistorArrow}"/>`;
  const angle = componentAngle(node); const plusPosition = rotatePoint({ x: -23, y: -14 }, angle); const minusPosition = rotatePoint({ x: -23, y: 14 }, angle);
  const glyphs = opAmp ? `<g class="tp-analog-symbol tp-analog-readable-glyph" transform="translate(${plusPosition.x} ${plusPosition.y})"><path d="M-3,0H3 M0,-3V3"/></g><g class="tp-analog-symbol tp-analog-readable-glyph" transform="translate(${minusPosition.x} ${minusPosition.y})"><path d="M-3,0H3"/></g>` : '';
  return `<rect x="-44" y="-32" width="88" height="64" class="tp-graph-shape tp-analog-hit${selected ? ' is-selected' : ''}"/>${oriented(content, node)}${glyphs}${componentLabel(node, opAmp ? 'Op amp' : transistorKind.toUpperCase(), 44, 36)}`;
}
function ground(node: Readonly<TpGraphNode>, selected: boolean): string {
  return `<rect x="-24" y="-24" width="48" height="48" class="tp-graph-shape tp-analog-ground-hit${selected ? ' is-selected' : ''}"/>
    <path class="tp-analog-ground-symbol" d="M0,-24V-4 M-22,-4H22 M-14,5H14 M-6,14H6"/>
    <text class="tp-graph-label" text-anchor="middle" y="32">${label(node, 'GND')}</text>`;
}
function hub(node: Readonly<TpGraphNode>, selected: boolean): string {
  return `<rect x="-28" y="-28" width="56" height="56" rx="5" class="tp-graph-shape tp-analog-hub${selected ? ' is-selected' : ''}"/>
    <circle r="5" class="tp-analog-hub-junction"/>
    <text class="tp-graph-label" text-anchor="middle" y="44">${label(node, 'Hub')}</text>`;
}
function twoTerminalPorts(node: Readonly<TpGraphNode>): Partial<Record<TpGraphPort, TpGraphPoint>> { const angle = componentAngle(node); const first = rotatePort('west', angle); const second = rotatePort('east', angle); return { [first]: rotatePoint({ x: -36, y: 0 }, angle), [second]: rotatePoint({ x: 36, y: 0 }, angle) }; }
function activePorts(node: Readonly<TpGraphNode>): Partial<Record<TpGraphPort, TpGraphPoint>> { const angle = componentAngle(node); const result: Partial<Record<TpGraphPort, TpGraphPoint>> = {}; const base: readonly [TpGraphPort, TpGraphPoint][] = [['north', { x: -30, y: -14 }], ['south', { x: -30, y: 14 }], ['east', { x: 42, y: 0 }]]; for (const [port, point] of base) result[rotatePort(port, angle)] = rotatePoint(point, angle); return result; }
function transistorPorts(node: Readonly<TpGraphNode>): Partial<Record<TpGraphPort, TpGraphPoint>> { const angle = componentAngle(node); const result: Partial<Record<TpGraphPort, TpGraphPoint>> = {}; const base: readonly [TpGraphPort, TpGraphPoint][] = [['west', { x: -38, y: 0 }], ['north', { x: 24, y: -25 }], ['south', { x: 24, y: 25 }]]; for (const [port, point] of base) result[rotatePort(port, angle)] = rotatePoint(point, angle); return result; }
function potentiometerPorts(node: Readonly<TpGraphNode>): Partial<Record<TpGraphPort, TpGraphPoint>> { const ports = twoTerminalPorts(node); const angle = componentAngle(node); ports[rotatePort('north', angle)] = rotatePoint({ x: 0, y: -36 }, angle); return ports; }
function terminalPorts(node: Readonly<TpGraphNode>): readonly [TpGraphPort, TpGraphPort] { const angle = componentAngle(node); return [rotatePort('west', angle), rotatePort('east', angle)]; }
class UnionFind {
  private readonly parent = new Map<string, string>();
  public find(value: string): string { const parent = this.parent.get(value); if (!parent) { this.parent.set(value, value); return value; } if (parent === value) return value; const root = this.find(parent); this.parent.set(value, root); return root; }
  public join(left: string, right: string): void { const a = this.find(left); const b = this.find(right); if (a !== b) this.parent.set(a, b); }
}

function terminal(nodeId: string, port: string | undefined): string { return `${nodeId}:${port ?? 'west'}`; }
function solve(matrix: number[][], vector: number[]): number[] {
  const size = vector.length; const a = matrix.map((row, index) => [...row, vector[index] ?? 0]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column; for (let row = column + 1; row < size; row += 1) if (Math.abs(a[row]?.[column] ?? 0) > Math.abs(a[pivot]?.[column] ?? 0)) pivot = row;
    if (Math.abs(a[pivot]?.[column] ?? 0) < 1e-12) continue;
    [a[column], a[pivot]] = [a[pivot] as number[], a[column] as number[]];
    const scale = a[column]?.[column] ?? 1; for (let item = column; item <= size; item += 1) (a[column] as number[])[item] = ((a[column] as number[])[item] ?? 0) / scale;
    for (let row = 0; row < size; row += 1) { if (row === column) continue; const factor = a[row]?.[column] ?? 0; for (let item = column; item <= size; item += 1) (a[row] as number[])[item] = ((a[row] as number[])[item] ?? 0) - factor * ((a[column] as number[])[item] ?? 0); }
  }
  return a.map((row) => row[size] ?? 0);
}

export function validateAnalogCircuit(graph: Readonly<TpGraphDocument>): void {
  const ids = new Set(graph.nodes.map((node) => node.id));
  for (const node of graph.nodes) if (node.type !== TP_GRAPH_COMMENT && !(ANALOG_TYPES as readonly string[]).includes(node.type)) throw new TypeError(`Unsupported analog component: ${node.type}`);
  for (const edge of graph.edges) {
    if (!edge.source || !edge.target || !ids.has(edge.source) || !ids.has(edge.target)) throw new TypeError(`Wire "${edge.id}" must connect two components.`);
    if (edge.source === edge.target) throw new TypeError('Self-links are not allowed in analog circuits.');
    if (edge.type !== undefined && edge.type !== TP_ANALOG_WIRE) throw new TypeError(`Unsupported analog link: ${edge.type}`);
    if (edge.direction !== undefined && edge.direction !== 'none') throw new TypeError('Analog wires cannot have arrows.');
  }
}

export function simulateAnalogCircuit(graph: Readonly<TpGraphDocument>, duration = 0.02, step = 0.0002, measurementMode: TpAnalogMeasurementMode = 'voltage'): TpAnalogSimulation {
  validateAnalogCircuit(graph); if (!(duration > 0) || !(step > 0)) throw new TypeError('Duration and step must be positive.');
  const union = new UnionFind();
  for (const node of graph.nodes.filter((candidate) => candidate.type === TP_ANALOG_HUB)) {
    for (const port of ['east', 'south', 'west']) union.join(terminal(node.id, 'north'), terminal(node.id, port));
  }
  for (const edge of graph.edges) union.join(terminal(edge.source as string, edge.sourcePort), terminal(edge.target as string, edge.targetPort));
  const grounds = graph.nodes.filter((node) => node.type === TP_ANALOG_GROUND).map((node) => union.find(terminal(node.id, 'north')));
  if (grounds.length === 0) throw new TypeError('The circuit needs a ground reference.');
  const groundRoot = grounds[0] as string;
  const conductive = graph.nodes.filter((node) => ![TP_ANALOG_GROUND, TP_ANALOG_HUB, TP_ANALOG_PROBE, TP_ANALOG_SCOPE, TP_GRAPH_COMMENT].includes(node.type));
  const roots = new Set<string>(); for (const node of conductive) { const [first, second] = terminalPorts(node); roots.add(union.find(terminal(node.id, first))); roots.add(union.find(terminal(node.id, second))); if (node.type === TP_ANALOG_POTENTIOMETER) roots.add(union.find(terminal(node.id, rotatePort('north', componentAngle(node))))); if (node.type === TP_ANALOG_OP_AMP || node.type === TP_ANALOG_TRANSISTOR || node.type === TP_ANALOG_TRANSISTOR_NPN || node.type === TP_ANALOG_TRANSISTOR_PNP) { const ports = node.type === TP_ANALOG_OP_AMP ? activePorts(node) : transistorPorts(node); for (const port of Object.keys(ports) as TpGraphPort[]) roots.add(union.find(terminal(node.id, port))); } }
  roots.delete(groundRoot); const rootList = [...roots]; const indices = new Map(rootList.map((root, index) => [root, index]));
  const sources = conductive.filter((node) => node.type === TP_ANALOG_VOLTAGE_SOURCE); const size = rootList.length + sources.length;
  const previousVoltages = new Map<string, number>(); const previousCurrents = new Map<string, number>(); const samples: TpAnalogSample[] = [];
  const nodeIndex = (node: TpGraphNode, endpoint: 0 | 1): number | undefined => indices.get(union.find(terminal(node.id, terminalPorts(node)[endpoint])));
  const portIndex = (node: TpGraphNode, port: TpGraphPort): number | undefined => indices.get(union.find(terminal(node.id, port)));
  const stampConductance = (a: number[][], left: number | undefined, right: number | undefined, conductance: number): void => { if (left !== undefined) a[left]![left]! += conductance; if (right !== undefined) a[right]![right]! += conductance; if (left !== undefined && right !== undefined) { a[left]![right]! -= conductance; a[right]![left]! -= conductance; } };
  const stampCurrent = (z: number[], left: number | undefined, right: number | undefined, current: number): void => { if (left !== undefined) z[left]! -= current; if (right !== undefined) z[right]! += current; };
  for (let time = 0; time <= duration + step / 2; time += step) {
    const a = Array.from({ length: size }, () => Array<number>(size).fill(0)); const z = Array<number>(size).fill(0);
    for (const node of conductive) {
      const left = nodeIndex(node, 0); const right = nodeIndex(node, 1);
      if (node.type === TP_ANALOG_POTENTIOMETER) { const resistance = Math.max(1e-9, numberData(node, 'resistance', 10000)); const position = Math.min(0.999999, Math.max(0.000001, numberData(node, 'position', 0.5))); const wiper = portIndex(node, rotatePort('north', componentAngle(node))); stampConductance(a, left, wiper, 1 / (resistance * position)); stampConductance(a, wiper, right, 1 / (resistance * (1 - position))); }
      else if ([TP_ANALOG_RESISTOR, TP_ANALOG_LAMP, TP_ANALOG_MOTOR, TP_ANALOG_RHEOSTAT].includes(node.type)) stampConductance(a, left, right, 1 / Math.max(1e-9, numberData(node, 'resistance', 1000)));
      else if (node.type === TP_ANALOG_CAPACITOR) { const g = Math.max(0, numberData(node, 'capacitance', 0.000001)) / step; stampConductance(a, left, right, g); stampCurrent(z, left, right, g * (previousVoltages.get(node.id) ?? 0)); }
      else if (node.type === TP_ANALOG_INDUCTOR) { const g = step / Math.max(1e-12, numberData(node, 'inductance', 0.001)); stampConductance(a, left, right, g); stampCurrent(z, left, right, previousCurrents.get(node.id) ?? 0); }
      else if (node.type === TP_ANALOG_CURRENT_SOURCE) stampCurrent(z, left, right, numberData(node, 'current', 0.001));
      else if (node.type === TP_ANALOG_DIODE || node.type === TP_ANALOG_LED) stampConductance(a, left, right, (previousVoltages.get(node.id) ?? 0) > numberData(node, 'forwardVoltage', node.type === TP_ANALOG_LED ? 1.8 : 0.6) ? 0.1 : 1e-9);
      else if (node.type === TP_ANALOG_SWITCH) stampConductance(a, left, right, node.data?.closed === true ? 1e9 : 1e-9);
    }
    for (const [sourceIndex, node] of sources.entries()) { const left = nodeIndex(node, 0); const right = nodeIndex(node, 1); const row = rootList.length + sourceIndex; if (left !== undefined) { a[left]![row]! -= 1; a[row]![left]! -= 1; } if (right !== undefined) { a[right]![row]! += 1; a[row]![right]! += 1; } const waveform = node.data?.waveform; const amplitude = numberData(node, 'voltage', 5); const frequency = numberData(node, 'frequency', 100); z[row] = waveform === 'square' ? (Math.sin(2 * Math.PI * frequency * time) >= 0 ? amplitude : 0) : waveform === 'sine' ? amplitude * Math.sin(2 * Math.PI * frequency * time) : amplitude; }
    const solution = solve(a, z); const voltageAt = (node: TpGraphNode, port: TpGraphPort): number => { const root = union.find(terminal(node.id, port)); return root === groundRoot ? 0 : solution[indices.get(root) ?? -1] ?? 0; };
    const componentCurrents = new Map<string, number>();
    for (const node of conductive) {
      const [first, second] = terminalPorts(node); const voltage = voltageAt(node, second) - voltageAt(node, first); const previousVoltage = previousVoltages.get(node.id) ?? 0; let current = 0;
      if ([TP_ANALOG_RESISTOR, TP_ANALOG_LAMP, TP_ANALOG_MOTOR, TP_ANALOG_RHEOSTAT].includes(node.type)) current = -voltage / Math.max(1e-9, numberData(node, 'resistance', 1000));
      else if (node.type === TP_ANALOG_CAPACITOR) current = numberData(node, 'capacitance', 0.000001) * (previousVoltage - voltage) / step;
      else if (node.type === TP_ANALOG_INDUCTOR) { current = (previousCurrents.get(node.id) ?? 0) - voltage * step / Math.max(1e-12, numberData(node, 'inductance', 0.001)); previousCurrents.set(node.id, current); }
      else if (node.type === TP_ANALOG_CURRENT_SOURCE) current = numberData(node, 'current', 0.001);
      else if (node.type === TP_ANALOG_DIODE || node.type === TP_ANALOG_LED) current = -voltage * (previousVoltage > numberData(node, 'forwardVoltage', node.type === TP_ANALOG_LED ? 1.8 : 0.6) ? 0.1 : 1e-9);
      else if (node.type === TP_ANALOG_SWITCH) current = -voltage * (node.data?.closed === true ? 1e9 : 1e-9);
      componentCurrents.set(node.id, current); previousVoltages.set(node.id, voltage);
    }
    for (const [sourceIndex, node] of sources.entries()) componentCurrents.set(node.id, -(solution[rootList.length + sourceIndex] ?? 0));
    const values: Record<string, number> = {};
    for (const edge of graph.edges) {
      const sourceNode = graph.nodes.find((node) => node.id === edge.source);
      if (!sourceNode) continue;
      const root = union.find(terminal(sourceNode.id, edge.sourcePort));
      let measured = root === groundRoot ? 0 : solution[indices.get(root) ?? -1] ?? 0;
      if (measurementMode === 'current') {
        const targetNode = graph.nodes.find((node) => node.id === edge.target); const sourceTerminals = terminalPorts(sourceNode); const targetTerminals = targetNode ? terminalPorts(targetNode) : null;
        const sourceCurrent = componentCurrents.get(sourceNode.id); const targetCurrent = targetNode ? componentCurrents.get(targetNode.id) : undefined;
        if (sourceCurrent !== undefined && edge.sourcePort === sourceTerminals[0]) measured = -sourceCurrent;
        else if (sourceCurrent !== undefined && edge.sourcePort === sourceTerminals[1]) measured = sourceCurrent;
        else if (targetCurrent !== undefined && edge.targetPort === targetTerminals?.[0]) measured = targetCurrent;
        else if (targetCurrent !== undefined && edge.targetPort === targetTerminals?.[1]) measured = -targetCurrent;
        else measured = 0;
      }
      for (const measurement of graphEdgeMeasurements(edge)) {
        if (measurement.label) values[measurement.label] = measured;
      }
    }
    for (const probeNode of graph.nodes.filter((node) => node.type === TP_ANALOG_PROBE || node.type === TP_ANALOG_SCOPE)) values[probeNode.label ?? probeNode.id] = voltageAt(probeNode, terminalPorts(probeNode)[0]);
    samples.push({ time, values });
  }
  return { samples, duration, step };
}

function renderOscilloscope(result: Readonly<TpAnalogSimulation>, verticalZoom: number, clipId: string, measurementMode: TpAnalogMeasurementMode): string {
  const names = Object.keys(result.samples[0]?.values ?? {});
  if (names.length === 0) return '<h3 class="tp-graph-results-header">Transient analysis</h3><div class="tp-graph-results-content">Drag named measurement points onto wires to add oscilloscope channels.</div>';
  const width = 800; const height = 260; const left = 62; const right = 18; const top = 18; const bottom = 42;
  const plotWidth = width - left - right; const plotHeight = height - top - bottom;
  const values = result.samples.flatMap((sample) => Object.values(sample.values));
  const automaticMinimum = Math.min(0, ...values); const automaticMaximum = Math.max(1, ...values); const automaticRange = automaticMaximum - automaticMinimum || 1;
  const center = (automaticMinimum + automaticMaximum) / 2; const range = automaticRange / verticalZoom;
  const maximum = center + range / 2;
  const x = (time: number): number => left + time / result.duration * plotWidth;
  const y = (value: number): number => top + (maximum - value) / range * plotHeight;
  const xTicks = Array.from({ length: 5 }, (_, index) => { const ratio = index / 4; const position = left + ratio * plotWidth; const milliseconds = result.duration * ratio * 1000; return `<path class="tp-analog-grid" d="M${position},${top}V${top + plotHeight}"/><text class="tp-analog-scale-label" x="${position}" y="${height - 20}" text-anchor="middle">${milliseconds.toFixed(milliseconds < 10 ? 1 : 0)}</text>`; }).join('');
  const yTicks = Array.from({ length: 5 }, (_, index) => { const ratio = index / 4; const position = top + ratio * plotHeight; const voltage = maximum - ratio * range; return `<path class="tp-analog-grid" d="M${left},${position}H${left + plotWidth}"/><text class="tp-analog-scale-label" x="${left - 8}" y="${position + 4}" text-anchor="end">${voltage.toFixed(2)}</text>`; }).join('');
  const traces = names.map((name, traceIndex) => `<polyline class="tp-analog-trace tp-analog-trace-${traceIndex % 4}" data-trace="${traceIndex}" clip-path="url(#${clipId})" points="${result.samples.map((sample) => `${x(sample.time)},${y(sample.values[name] ?? 0)}`).join(' ')}"/>`).join('');
  const unit = measurementMode === 'voltage' ? 'V' : 'A'; const quantity = measurementMode === 'voltage' ? 'Voltage' : 'Current';
  const legend = names.map((name, traceIndex) => `<span class="tp-analog-legend-item"><span class="tp-analog-legend-swatch tp-analog-trace-${traceIndex % 4}"></span>${escapeXml(name)} (${unit})</span>`).join('');
  const millisecondsPerDivision = result.duration * 1000 / 4; const unitsPerDivision = range / 4;
  return `<h3 class="tp-graph-results-header tp-analog-oscilloscope-header"><span>Oscilloscope</span><span class="tp-analog-calibration"><span class="tp-analog-calibration-divider" aria-hidden="true"></span><tp-button-group attached><button type="button" data-analog-mode="voltage" class="${measurementMode === 'voltage' ? 'is-active' : ''}" aria-label="Voltage measurement mode">V</button><button type="button" data-analog-mode="current" class="${measurementMode === 'current' ? 'is-active' : ''}" aria-label="Current measurement mode">A</button></tp-button-group><span class="tp-analog-calibration-divider" aria-hidden="true"></span><span class="tp-analog-calibration-group"><tp-icon-button size="xs" name="minus" label="Increase time per division" data-analog-calibration="time-out"></tp-icon-button><span class="tp-analog-calibration-value">${millisecondsPerDivision.toFixed(millisecondsPerDivision < 1 ? 2 : 1)} ms/div</span><tp-icon-button size="xs" name="plus" label="Decrease time per division" data-analog-calibration="time-in"></tp-icon-button></span><span class="tp-analog-calibration-divider" aria-hidden="true"></span><tp-icon-button size="xs" name="refresh" label="Reset oscilloscope calibration" data-analog-calibration="reset"></tp-icon-button><span class="tp-analog-calibration-divider" aria-hidden="true"></span><span class="tp-analog-calibration-group"><tp-icon-button size="xs" name="minus" label="Increase ${quantity.toLowerCase()} units per division" data-analog-calibration="voltage-out"></tp-icon-button><span class="tp-analog-calibration-value">${unitsPerDivision.toFixed(unitsPerDivision < 1 ? 3 : 1)} ${unit}/div</span><tp-icon-button size="xs" name="plus" label="Decrease ${quantity.toLowerCase()} units per division" data-analog-calibration="voltage-in"></tp-icon-button></span></span></h3><div class="tp-graph-results-content tp-analog-results"><div class="tp-analog-legend"><span class="tp-analog-legend-title">${quantity} channels:</span>${legend}</div><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${quantity} over time oscilloscope plot"><defs><clipPath id="${clipId}"><rect x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}"/></clipPath></defs>${xTicks}${yTicks}<path class="tp-analog-axis" d="M${left},${top}V${top + plotHeight}H${left + plotWidth}"/>${traces}<text class="tp-analog-axis-title" x="${left + plotWidth / 2}" y="${height - 3}" text-anchor="middle">Time (ms)</text><text class="tp-analog-axis-title" transform="translate(14 ${top + plotHeight / 2}) rotate(-90)" text-anchor="middle">${quantity} (${unit})</text></svg></div>`;
}

function renderCircuitEquations(graph: Readonly<TpGraphDocument>, step: number): string {
  const rows: string[] = [];
  const math = (latex: string): string => `<tp-markdown class="tp-analog-equation-math"><script type="tp/markdown">---\nextensions:\n  - math\n---\n:latexmath:\`${latex}\`</script></tp-markdown>`;
  const add = (node: Readonly<TpGraphNode>, latex: string): void => {
    rows.push(`<div class="tp-analog-equation"><strong>${label(node, node.id)}</strong>${math(latex)}</div>`);
  };
  for (const node of graph.nodes) {
    if ([TP_ANALOG_RESISTOR, TP_ANALOG_RHEOSTAT, TP_ANALOG_LAMP, TP_ANALOG_MOTOR].includes(node.type)) add(node, String.raw`u(t) = ${numberData(node, 'resistance', 1000)}\,i(t)`);
    else if (node.type === TP_ANALOG_CAPACITOR) add(node, String.raw`i(t) = ${numberData(node, 'capacitance', 0.000001)}\,\frac{du(t)}{dt}`);
    else if (node.type === TP_ANALOG_INDUCTOR) add(node, String.raw`u(t) = ${numberData(node, 'inductance', 0.001)}\,\frac{di(t)}{dt}`);
    else if (node.type === TP_ANALOG_CURRENT_SOURCE) add(node, String.raw`i(t) = ${numberData(node, 'current', 0.001)}\,\mathrm{A}`);
    else if (node.type === TP_ANALOG_VOLTAGE_SOURCE) {
      const amplitude = numberData(node, 'voltage', 5); const frequency = numberData(node, 'frequency', 100); const waveform = node.data?.waveform;
      add(node, waveform === 'sine' ? String.raw`u(t) = ${amplitude}\sin\!\left(2\pi\,${frequency}\,t\right)` : waveform === 'square' ? String.raw`u(t)=\begin{cases}${amplitude},&\sin\!\left(2\pi\,${frequency}\,t\right)\geq0\\0,&\text{otherwise}\end{cases}` : String.raw`u(t) = ${amplitude}\,\mathrm{V}`);
    } else if (node.type === TP_ANALOG_POTENTIOMETER) {
      const resistance = numberData(node, 'resistance', 10000); const position = numberData(node, 'position', 0.5);
      add(node, String.raw`R_1=${resistance}\times${position},\qquad R_2=${resistance}\left(1-${position}\right)`);
    } else if (node.type === TP_ANALOG_DIODE || node.type === TP_ANALOG_LED) add(node, String.raw`i(t)\approx0\quad\text{for}\quad u(t)<${numberData(node, 'forwardVoltage', node.type === TP_ANALOG_LED ? 1.8 : 0.6)}\,\mathrm{V}`);
    else if (node.type === TP_ANALOG_SWITCH) add(node, node.data?.closed === true ? String.raw`u(t)=0\quad\text{(closed switch)}` : String.raw`i(t)=0\quad\text{(open switch)}`);
  }
  const componentEquations = rows.length > 0 ? rows.join('') : '<p>No component equation is available.</p>';
  return `<section class="tp-analog-equations" aria-labelledby="tp-analog-equations-title"><h3 id="tp-analog-equations-title" class="tp-graph-results-header">Circuit equations</h3><div class="tp-graph-results-content"><div class="tp-analog-equation-laws"><span><strong>Kirchhoff current law</strong>${math(String.raw`\sum_k i_k(t)=0\quad\text{at each node}`)}</span><span><strong>Kirchhoff voltage law</strong>${math(String.raw`\sum_k u_k(t)=0\quad\text{around each loop}`)}</span><span><strong>Transient discretization</strong>${math(String.raw`\Delta t=${step}\,\mathrm{s}\quad\text{(backward Euler)}`)}</span></div><div class="tp-analog-equation-list">${componentEquations}</div></div></section>`;
}

/**
 * @summary Interactive analog-circuit editor and transient simulator.
 * @tagname tp-graph-analog-circuit
 * @example
 * <tp-graph-analog-circuit></tp-graph-analog-circuit>
 */
export class TpGraphAnalogCircuit extends TpGraphEditor {
  private static instanceCounter = 0;
  private static readonly analogStyleId = 'tp-graph-analog-circuit-styles';
  private readonly analogInstanceId = ++TpGraphAnalogCircuit.instanceCounter;
  private timeZoom = 1;
  private voltageZoom = 1;
  private measurementMode: TpAnalogMeasurementMode = 'voltage';
  private selectedAnalogId: string | null = null;
  public constructor() {
    super(); this.unregisterPalette('generic'); this.activeEdgeDirection = 'none';
    const component = (type: string, name: string, kind: string, data: Record<string, unknown>) => ({ type, label: name, description: name, width: 76, height: 68, ports: twoTerminalPorts, createData: () => ({ angle: 0, ...data }), render: (node: Readonly<TpGraphNode>, selected: boolean) => passiveSymbol(node, selected, kind, name) });
    this.registerPalette({ id: 'analog-passive', label: 'Passive components', shapes: [component(TP_ANALOG_RESISTOR, 'Resistor', 'resistor', { resistance: 1000 }), component(TP_ANALOG_CAPACITOR, 'Capacitor', 'capacitor', { capacitance: 0.000001 }), component(TP_ANALOG_INDUCTOR, 'Inductor', 'inductor', { inductance: 0.001 }), component(TP_ANALOG_RHEOSTAT, 'Rheostat', 'rheostat', { resistance: 1000 }), { type: TP_ANALOG_POTENTIOMETER, label: 'Potentiometer', description: 'Three-terminal variable resistor', width: 76, height: 76, ports: potentiometerPorts, createData: () => ({ angle: 0, resistance: 10000, position: 0.5 }), render: (node, selected) => passiveSymbol(node, selected, 'potentiometer', 'Potentiometer') }] });
    this.registerPalette({ id: 'analog-loads', label: 'Loads / semiconductors', shapes: [component(TP_ANALOG_DIODE, 'Diode', 'diode', { forwardVoltage: 0.6 }), component(TP_ANALOG_LED, 'LED', 'led', { forwardVoltage: 1.8 }), component(TP_ANALOG_LAMP, 'Lamp', 'lamp', { resistance: 100 }), { type: TP_ANALOG_MOTOR, label: 'Motor', description: 'Simple resistive motor load', width: 76, height: 72, ports: twoTerminalPorts, createData: () => ({ angle: 0, resistance: 100 }), render: motorSymbol }] });
    this.registerPalette({ id: 'analog-active', label: 'Active components', shapes: [{ type: TP_ANALOG_TRANSISTOR_NPN, label: 'NPN transistor', description: 'NPN bipolar transistor', width: 88, height: 84, ports: transistorPorts, createData: () => ({ angle: 0, kind: 'npn' }), render: (node, selected) => activeSymbol(node, selected, false, 'npn') }, { type: TP_ANALOG_TRANSISTOR_PNP, label: 'PNP transistor', description: 'PNP bipolar transistor', width: 88, height: 84, ports: transistorPorts, createData: () => ({ angle: 0, kind: 'pnp' }), render: (node, selected) => activeSymbol(node, selected, false, 'pnp') }, { type: TP_ANALOG_OP_AMP, label: 'Op amp', description: 'Operational amplifier', width: 88, height: 84, ports: activePorts, createData: () => ({ angle: 0, gain: 100000 }), render: (node, selected) => activeSymbol(node, selected, true) }] });
    this.registerPalette({ id: 'analog-sources', label: 'Sources', shapes: [{ type: TP_ANALOG_VOLTAGE_SOURCE, label: 'Voltage source', description: 'Voltage generator', width: 76, height: 72, ports: twoTerminalPorts, createData: () => ({ angle: 0, voltage: 5, waveform: 'dc', frequency: 100 }), render: (node, selected) => source(node, selected) }, { type: TP_ANALOG_CURRENT_SOURCE, label: 'Current source', description: 'Current generator', width: 76, height: 72, ports: twoTerminalPorts, createData: () => ({ angle: 0, current: 0.001 }), render: (node, selected) => source(node, selected, true) }, { type: TP_ANALOG_GROUND, label: 'Ground', description: 'Reference potential', width: 48, height: 56, ports: { north: { x: 0, y: -24 } }, render: ground }] });
    this.registerPalette({ id: 'analog-connections', label: 'Connections', shapes: [{ type: TP_ANALOG_SWITCH, label: 'Switch', description: 'Open or closed switch', width: 76, height: 68, ports: twoTerminalPorts, createData: () => ({ angle: 0, closed: false }), render: switchSymbol }, { type: TP_ANALOG_HUB, label: 'Hub', description: 'Four-port electrical junction', width: 56, height: 72, ports: { north: { x: 0, y: -28 }, east: { x: 28, y: 0 }, south: { x: 0, y: 28 }, west: { x: -28, y: 0 } }, render: hub }] });
    this.portsVisible = true;
    this.addEventListener('tp-graph-selection-change', (event) => { this.selectedAnalogId = (event as CustomEvent<{ id: string | null }>).detail.id; this.updateAnalogControls(); });
  }
  protected override connectedCallback(): void { super.connectedCallback(); this.ensureGlobalStyle(TpGraphAnalogCircuit.analogStyleId, style); }
  public override setGraph(graph: TpGraphDocument): void {
    const selected = this.selectedAnalogId; validateAnalogCircuit(graph); super.setGraph(graph);
    if (selected && graph.nodes.some((node) => node.id === selected)) this.selectMany([selected]);
  }
  public override addNode(type: string, point: TpGraphPoint, nodeLabel?: string): TpGraphNode { if (!(ANALOG_TYPES as readonly string[]).includes(type)) throw new TypeError(`Unsupported analog component: ${type}`); return super.addNode(type, point, nodeLabel); }
  public override addEdge(source: string, target: string, type = TP_ANALOG_WIRE, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = 'none', routing: TpGraphEdgeRouting = 'straight'): TpGraphEdge {
    if (direction !== 'none') throw new TypeError('Analog wires cannot have arrows.');
    return super.addEdge(source, target, type, sourcePort, targetPort, direction, routing);
  }
  protected override validateConnection(sourceId: string, targetId: string, type: string): void {
    super.validateConnection(sourceId, targetId, type);
    if (sourceId === targetId) throw new TypeError('Self-links are not allowed in analog circuits.');
    if (type !== TP_ANALOG_WIRE && type !== 'edge') throw new TypeError(`Unsupported analog link: ${type}`);
  }
  public simulate(duration?: number, step?: number): TpAnalogSimulation { const result = simulateAnalogCircuit(this.value, duration, step); super.setGraph(this.value); this.dispatchEvent(new CustomEvent('tp-analog-simulate', { bubbles: true, detail: result })); return result; }
  public rotateSelected(): void {
    if (!this.selectedAnalogId) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (!node || !this.isOrientable(node)) return;
    const clockwise: Readonly<Record<TpGraphPort, TpGraphPort>> = { north: 'east', east: 'south', south: 'west', west: 'north' };
    const nextAngle = (componentAngle(node) + 90) % 360 as QuarterAngle;
    node.data = { ...(node.data ?? {}), angle: nextAngle, orientation: nextAngle % 180 === 0 ? 'horizontal' : 'vertical' };
    for (const edge of graph.edges) { if (edge.source === node.id && edge.sourcePort) edge.sourcePort = clockwise[edge.sourcePort]; if (edge.target === node.id && edge.targetPort) edge.targetPort = clockwise[edge.targetPort]; }
    this.setGraph(graph);
  }
  public toggleSwitch(): void {
    if (!this.selectedAnalogId) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (node?.type !== TP_ANALOG_SWITCH) return;
    node.data = { ...(node.data ?? {}), closed: node.data?.closed !== true }; this.setGraph(graph);
  }
  protected override edgeDirections(): readonly TpGraphEdgeDirection[] { return ['none']; }
  protected override renderToolbarActions(): string { return `<label class="tp-analog-parameter" hidden>Label <input type="text" data-analog-label disabled></label><label class="tp-analog-parameter" hidden>Value <input type="number" data-analog-value disabled><select data-analog-unit disabled>${SI_PREFIXES.map((prefix) => `<option value="${prefix.scale}">${prefix.symbol}</option>`).join('')}</select></label><label class="tp-analog-parameter" hidden>Wiper <input type="number" min="0" max="100" step="1" data-analog-position disabled><span>%</span></label><label class="tp-analog-parameter" hidden>Waveform <select data-analog-waveform disabled><option value="dc">DC</option><option value="sine">Sine</option><option value="square">Square</option></select></label><label class="tp-analog-parameter" hidden>Frequency <input type="number" min="0" step="1" data-analog-frequency disabled><span>Hz</span></label><tp-icon-button name="rotate-right" label="Rotate selected component" data-analog-action="rotate" disabled></tp-icon-button><tp-icon-button name="toggle-switch" label="Open or close selected switch" data-analog-action="switch" disabled></tp-icon-button><tp-icon-button name="play" label="Run transient analysis" data-analog-action="simulate"></tp-icon-button>`; }
  protected override bindExtensionEvents(): void {
    this.querySelector('[data-analog-action="simulate"]')?.addEventListener('click', () => this.simulate());
    this.querySelector('[data-analog-action="rotate"]')?.addEventListener('click', () => this.rotateSelected());
    this.querySelector('[data-analog-action="switch"]')?.addEventListener('click', () => this.toggleSwitch());
    this.querySelector<HTMLInputElement>('[data-analog-label]')?.addEventListener('change', (event) => this.updateSelectedLabel((event.currentTarget as HTMLInputElement).value));
    this.querySelector<HTMLInputElement>('[data-analog-value]')?.addEventListener('change', (event) => this.updateSelectedValue(Number((event.currentTarget as HTMLInputElement).value)));
    this.querySelector<HTMLSelectElement>('[data-analog-unit]')?.addEventListener('change', (event) => this.updateSelectedUnit(Number((event.currentTarget as HTMLSelectElement).value)));
    this.querySelector<HTMLInputElement>('[data-analog-position]')?.addEventListener('change', (event) => this.updatePotentiometerPosition(Number((event.currentTarget as HTMLInputElement).value)));
    this.querySelector<HTMLSelectElement>('[data-analog-waveform]')?.addEventListener('change', (event) => this.updateVoltageSourceWaveform((event.currentTarget as HTMLSelectElement).value));
    this.querySelector<HTMLInputElement>('[data-analog-frequency]')?.addEventListener('change', (event) => this.updateVoltageSourceFrequency(Number((event.currentTarget as HTMLInputElement).value)));
    for (const button of this.querySelectorAll<HTMLElement>('[data-analog-mode]')) button.addEventListener('click', () => { const mode = button.dataset.analogMode; if (mode === 'voltage' || mode === 'current') { this.measurementMode = mode; this.voltageZoom = 1; super.setGraph(this.value); } });
    for (const button of this.querySelectorAll<HTMLElement>('[data-analog-calibration]')) button.addEventListener('click', () => {
      const action = button.dataset.analogCalibration;
      if (action === 'reset') { this.timeZoom = 1; this.voltageZoom = 1; }
      else if (action === 'time-in') this.timeZoom = Math.min(16, this.timeZoom * 2);
      else if (action === 'time-out') this.timeZoom = Math.max(0.25, this.timeZoom / 2);
      else if (action === 'voltage-in') this.voltageZoom = Math.min(16, this.voltageZoom * 2);
      else if (action === 'voltage-out') this.voltageZoom = Math.max(0.25, this.voltageZoom / 2);
      super.setGraph(this.value);
    });
    this.updateAnalogControls();
  }
  protected override renderResults(): string {
    const step = 0.0002;
    try { return `<section class="tp-analog-panel tp-analog-oscilloscope-panel">${renderOscilloscope(simulateAnalogCircuit(this.value, 0.02 / this.timeZoom, step, this.measurementMode), this.voltageZoom, `tp-analog-plot-clip-${this.analogInstanceId}`, this.measurementMode)}</section>${renderCircuitEquations(this.value, step)}`; } catch (error) { return `<section class="tp-analog-panel tp-analog-oscilloscope-panel"><h3 class="tp-graph-results-header">Transient analysis</h3><div class="tp-graph-results-content tp-analog-error">${escapeXml(error instanceof Error ? error.message : 'Simulation failed.')}</div></section>${renderCircuitEquations(this.value, step)}`; }
  }
  private isOrientable(node: Readonly<TpGraphNode>): boolean { return ![TP_ANALOG_GROUND, TP_ANALOG_HUB, TP_GRAPH_COMMENT].includes(node.type); }
  private valueSpec(node: Readonly<TpGraphNode>): Readonly<{ key: string; fallback: number; step: number; unit: string }> | null {
    if ([TP_ANALOG_RESISTOR, TP_ANALOG_RHEOSTAT, TP_ANALOG_POTENTIOMETER, TP_ANALOG_LAMP, TP_ANALOG_MOTOR].includes(node.type)) return { key: 'resistance', fallback: 1000, step: 1, unit: 'Ω' };
    if (node.type === TP_ANALOG_CAPACITOR) return { key: 'capacitance', fallback: 0.000001, step: 0.000001, unit: 'F' };
    if (node.type === TP_ANALOG_INDUCTOR) return { key: 'inductance', fallback: 0.001, step: 0.001, unit: 'H' };
    if (node.type === TP_ANALOG_VOLTAGE_SOURCE) return { key: 'voltage', fallback: 5, step: 0.1, unit: 'V' };
    if (node.type === TP_ANALOG_CURRENT_SOURCE) return { key: 'current', fallback: 0.001, step: 0.001, unit: 'A' };
    if (node.type === TP_ANALOG_OP_AMP) return { key: 'gain', fallback: 100000, step: 1000, unit: '' };
    if (node.type === TP_ANALOG_DIODE || node.type === TP_ANALOG_LED) return { key: 'forwardVoltage', fallback: node.type === TP_ANALOG_LED ? 1.8 : 0.6, step: 0.1, unit: 'V' };
    return null;
  }
  private updateSelectedLabel(value: string): void { if (!this.selectedAnalogId) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (!node) return; node.label = value.trim(); this.setGraph(graph); }
  private displayScale(node: Readonly<TpGraphNode>, spec: Readonly<{ key: string; fallback: number }>): number { const stored = node.data?.displayScale; if (typeof stored === 'number' && SI_PREFIXES.some((prefix) => prefix.scale === stored)) return stored; const absolute = Math.abs(numberData(node, spec.key, spec.fallback)); if (absolute === 0) return 1; return [...SI_PREFIXES].reverse().find((prefix) => absolute >= prefix.scale)?.scale ?? 1e-12; }
  private updateSelectedValue(value: number): void { if (!this.selectedAnalogId || !Number.isFinite(value)) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (!node) return; const spec = this.valueSpec(node); if (!spec) return; const scale = this.displayScale(node, spec); node.data = { ...(node.data ?? {}), [spec.key]: Math.max(0, value * scale), displayScale: scale }; this.setGraph(graph); }
  private updateSelectedUnit(scale: number): void { if (!this.selectedAnalogId || !SI_PREFIXES.some((prefix) => prefix.scale === scale)) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (!node || !this.valueSpec(node)) return; node.data = { ...(node.data ?? {}), displayScale: scale }; this.setGraph(graph); }
  private updatePotentiometerPosition(percent: number): void { if (!this.selectedAnalogId || !Number.isFinite(percent)) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (node?.type !== TP_ANALOG_POTENTIOMETER) return; node.data = { ...(node.data ?? {}), position: Math.min(1, Math.max(0, percent / 100)) }; this.setGraph(graph); }
  private updateVoltageSourceWaveform(waveform: string): void { if (!this.selectedAnalogId || !['dc', 'sine', 'square'].includes(waveform)) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (node?.type !== TP_ANALOG_VOLTAGE_SOURCE) return; node.data = { ...(node.data ?? {}), waveform }; this.setGraph(graph); }
  private updateVoltageSourceFrequency(frequency: number): void { if (!this.selectedAnalogId || !Number.isFinite(frequency)) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedAnalogId); if (node?.type !== TP_ANALOG_VOLTAGE_SOURCE) return; node.data = { ...(node.data ?? {}), frequency: Math.max(0, frequency) }; this.setGraph(graph); }
  private updateAnalogControls(): void {
    const node = this.value.nodes.find((candidate) => candidate.id === this.selectedAnalogId);
    const labelInput = this.querySelector<HTMLInputElement>('[data-analog-label]'); if (labelInput) { labelInput.disabled = !node; labelInput.closest<HTMLElement>('.tp-analog-parameter')?.toggleAttribute('hidden', !node); labelInput.value = node?.label ?? ''; }
    const spec = node ? this.valueSpec(node) : null; const valueInput = this.querySelector<HTMLInputElement>('[data-analog-value]'); const unit = this.querySelector<HTMLSelectElement>('[data-analog-unit]'); if (valueInput) { valueInput.disabled = !spec; valueInput.closest<HTMLElement>('.tp-analog-parameter')?.toggleAttribute('hidden', !spec); if (node && spec) { const scale = this.displayScale(node, spec); valueInput.value = String(numberData(node, spec.key, spec.fallback) / scale); valueInput.step = String(spec.step / scale); if (unit) { unit.disabled = false; unit.value = String(scale); for (const option of unit.options) { const prefix = SI_PREFIXES.find((candidate) => candidate.scale === Number(option.value)); option.textContent = `${prefix?.symbol ?? ''}${spec.unit}`; } } } else if (unit) unit.disabled = true; }
    const voltageSource = node?.type === TP_ANALOG_VOLTAGE_SOURCE; const waveform = this.querySelector<HTMLSelectElement>('[data-analog-waveform]'); if (waveform) { waveform.disabled = !voltageSource; waveform.closest<HTMLElement>('.tp-analog-parameter')?.toggleAttribute('hidden', !voltageSource); waveform.value = voltageSource && typeof node.data?.waveform === 'string' ? node.data.waveform : 'dc'; }
    const potentiometer = node?.type === TP_ANALOG_POTENTIOMETER; const position = this.querySelector<HTMLInputElement>('[data-analog-position]'); if (position) { position.disabled = !potentiometer; position.closest<HTMLElement>('.tp-analog-parameter')?.toggleAttribute('hidden', !potentiometer); position.value = potentiometer ? String(numberData(node, 'position', 0.5) * 100) : '50'; }
    const frequencyVisible = voltageSource && waveform?.value !== 'dc'; const frequency = this.querySelector<HTMLInputElement>('[data-analog-frequency]'); if (frequency) { frequency.disabled = !frequencyVisible; frequency.closest<HTMLElement>('.tp-analog-parameter')?.toggleAttribute('hidden', !frequencyVisible); frequency.value = voltageSource ? String(numberData(node, 'frequency', 100)) : '100'; }
    const rotate = this.querySelector<HTMLElement>('[data-analog-action="rotate"]'); if (rotate) rotate.toggleAttribute('disabled', !node || !this.isOrientable(node));
    const toggle = this.querySelector<HTMLElement>('[data-analog-action="switch"]'); if (toggle) toggle.toggleAttribute('disabled', node?.type !== TP_ANALOG_SWITCH);
  }
}

if (!customElements.get('tp-graph-analog-circuit')) customElements.define('tp-graph-analog-circuit', TpGraphAnalogCircuit);
