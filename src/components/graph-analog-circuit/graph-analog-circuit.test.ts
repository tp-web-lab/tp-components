import { afterEach, describe, expect, it } from 'vitest';
import type { TpGraphDocument } from '../graph-editor/graph-editor.js';
import {
  simulateAnalogCircuit,
  TpGraphAnalogCircuit,
  validateAnalogCircuit,
} from './graph-analog-circuit.js';

const RC_CIRCUIT: TpGraphDocument = {
  version: 1,
  title: 'RC filter',
  nodes: [
    { id: 'source', type: 'analog-voltage-source', x: 80, y: 120, data: { voltage: 5 } },
    { id: 'resistor', type: 'analog-resistor', x: 200, y: 80, data: { resistance: 1000 } },
    { id: 'capacitor', type: 'analog-capacitor', x: 320, y: 140, data: { capacitance: 0.00001 } },
    { id: 'ground', type: 'analog-ground', x: 200, y: 220 },
  ],
  edges: [
    { id: 'w1', source: 'source', sourcePort: 'east', target: 'resistor', targetPort: 'west' },
    { id: 'w2', source: 'resistor', sourcePort: 'east', target: 'capacitor', targetPort: 'west', data: { measurements: [{ id: 'm-vout', position: 0.5, label: 'Vout' }] } },
    { id: 'w3', source: 'capacitor', sourcePort: 'east', target: 'ground', targetPort: 'north' },
    { id: 'w4', source: 'ground', sourcePort: 'north', target: 'source', targetPort: 'west' },
  ],
};

describe('TpGraphAnalogCircuit', () => {
  afterEach(() => { document.body.replaceChildren(); });

  it('simulates the charging voltage of an RC circuit', () => {
    const result = simulateAnalogCircuit(RC_CIRCUIT, 0.05, 0.001);
    expect(result.samples).toHaveLength(51);
    expect(result.samples[0]?.values.Vout).toBeGreaterThan(0);
    expect(result.samples.at(-1)?.values.Vout).toBeGreaterThan(4.9);
  });

  it('measures signed branch current in ammeter mode', () => {
    const result = simulateAnalogCircuit(RC_CIRCUIT, 0.05, 0.001, 'current');
    expect(result.samples[0]?.values.Vout).toBeGreaterThan(0.004);
    expect(Math.abs(result.samples.at(-1)?.values.Vout ?? 1)).toBeLessThan(0.0001);
  });

  it('requires a ground reference', () => {
    const graph = structuredClone(RC_CIRCUIT);
    graph.nodes = graph.nodes.filter((node) => node.type !== 'analog-ground');
    graph.edges = graph.edges.filter((edge) => edge.source !== 'ground' && edge.target !== 'ground');
    expect(() => simulateAnalogCircuit(graph)).toThrow('ground reference');
  });

  it('rejects self-links and arrowed wires', () => {
    const selfLinked = structuredClone(RC_CIRCUIT);
    selfLinked.edges.push({ id: 'loop', type: 'analog-wire', source: 'resistor', target: 'resistor', direction: 'none' });
    expect(() => validateAnalogCircuit(selfLinked)).toThrow('Self-links');
    const arrowed = structuredClone(RC_CIRCUIT);
    arrowed.edges[0]!.direction = 'forward';
    expect(() => validateAnalogCircuit(arrowed)).toThrow('cannot have arrows');
  });

  it('treats every hub port as the same electrical node', () => {
    const graph = structuredClone(RC_CIRCUIT);
    graph.nodes.push({ id: 'hub', type: 'analog-hub', x: 270, y: 80, label: 'J1' });
    const outputWire = graph.edges.find((edge) => edge.id === 'w2');
    if (outputWire) { outputWire.target = 'hub'; outputWire.targetPort = 'west'; }
    graph.edges.push({ id: 'hub-capacitor', source: 'hub', sourcePort: 'south', target: 'capacitor', targetPort: 'west' });
    const result = simulateAnalogCircuit(graph, 0.05, 0.001);
    expect(result.samples.at(-1)?.values.Vout).toBeGreaterThan(4.9);
  });

  it('opens and closes a switch in the simulated circuit', () => {
    const graph = structuredClone(RC_CIRCUIT);
    graph.nodes.push({ id: 'switch', type: 'analog-switch', x: 140, y: 80, label: 'S1', data: { orientation: 'horizontal', closed: false } });
    const sourceWire = graph.edges.find((edge) => edge.id === 'w1');
    if (sourceWire) { sourceWire.target = 'switch'; sourceWire.targetPort = 'west'; }
    graph.edges.push({ id: 'switch-resistor', type: 'analog-wire', source: 'switch', sourcePort: 'east', target: 'resistor', targetPort: 'west', direction: 'none' });
    expect(simulateAnalogCircuit(graph, 0.05, 0.001).samples.at(-1)?.values.Vout).toBeLessThan(0.01);
    const switchNode = graph.nodes.find((node) => node.id === 'switch');
    if (switchNode?.data) switchNode.data.closed = true;
    expect(simulateAnalogCircuit(graph, 0.05, 0.001).samples.at(-1)?.values.Vout).toBeGreaterThan(4.9);
  });

  it('renders an oscilloscope result panel', async () => {
    validateAnalogCircuit(RC_CIRCUIT);
    const editor = new TpGraphAnalogCircuit();
    editor.value = structuredClone(RC_CIRCUIT);
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-edge-direction="none"]')).not.toBeNull();
    expect(editor.querySelector('[data-edge-direction="forward"]')).toBeNull();
    for (const type of ['analog-lamp', 'analog-motor', 'analog-rheostat', 'analog-potentiometer', 'analog-led', 'analog-transistor-npn', 'analog-transistor-pnp']) expect(editor.querySelector(`[data-shape="${type}"]`)).not.toBeNull();
    expect(editor.querySelector('[aria-label="Voltage over time oscilloscope plot"]')).not.toBeNull();
    expect(editor.querySelector(':scope > .tp-graph-results > .tp-analog-oscilloscope-panel')).not.toBeNull();
    expect(editor.querySelector('.tp-analog-equations')?.textContent).toContain('Circuit equations');
    expect(editor.querySelector('.tp-analog-equations')?.textContent).toContain('Kirchhoff current law');
    expect(editor.querySelector('tp-markdown.tp-analog-equation-math')).not.toBeNull();
    expect(editor.textContent).toContain('Time (ms)');
    expect(editor.textContent).toContain('Voltage (V)');
    expect(editor.textContent).toContain('5.0 ms/div');
    expect(editor.querySelector('[data-analog-calibration="time-in"]')?.getAttribute('name')).toBe('plus');
    expect(editor.querySelector('[data-analog-calibration="time-out"]')?.getAttribute('name')).toBe('minus');
    expect(editor.querySelector('.tp-analog-calibration > .tp-analog-calibration-divider')).not.toBeNull();
    editor.querySelector<HTMLElement>('[data-analog-calibration="time-in"]')?.click();
    expect(editor.textContent).toContain('2.5 ms/div');
    editor.querySelector<HTMLElement>('[data-analog-mode="current"]')?.click();
    expect(editor.textContent).toContain('Current channels:');
    expect(editor.textContent).toContain('Current (A)');
  });

  it('edits voltage-source waveform and frequency from the lower toolbar', async () => {
    const editor = new TpGraphAnalogCircuit(); editor.value = structuredClone(RC_CIRCUIT); document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.querySelector<SVGElement>('[data-node-id="source"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 80, clientY: 120 }));
    const waveform = editor.querySelector<HTMLSelectElement>('[data-analog-waveform]'); expect(waveform?.hidden).not.toBe(true);
    if (waveform) { waveform.value = 'square'; waveform.dispatchEvent(new Event('change', { bubbles: true })); }
    const frequency = editor.querySelector<HTMLInputElement>('[data-analog-frequency]'); expect(frequency?.closest<HTMLElement>('.tp-analog-parameter')?.hidden).toBe(false);
    if (frequency) { frequency.value = '250'; frequency.dispatchEvent(new Event('change', { bubbles: true })); }
    expect(editor.value.nodes.find((node) => node.id === 'source')?.data).toMatchObject({ waveform: 'square', frequency: 250 });
    expect(editor.querySelector('[data-node-id="source"] .tp-analog-readable-glyph path')?.getAttribute('d')).toContain('V-8H0V8');
  });

  it('edits the potentiometer wiper position from the lower toolbar', async () => {
    const graph = structuredClone(RC_CIRCUIT); graph.nodes.push({ id: 'pot', type: 'analog-potentiometer', x: 220, y: 80, data: { resistance: 10000, position: 0.5 } });
    const editor = new TpGraphAnalogCircuit(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.querySelector<SVGGElement>('[data-node-id="pot"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 220, clientY: 80 }));
    const position = editor.querySelector<HTMLInputElement>('[data-analog-position]'); expect(position?.disabled).toBe(false);
    if (position) { position.value = '75'; position.dispatchEvent(new Event('change', { bubbles: true })); }
    expect(editor.value.nodes.find((node) => node.id === 'pot')?.data?.position).toBe(0.75);
  });

  it('uses opposite emitter arrows for NPN and PNP transistors', async () => {
    const graph = structuredClone(RC_CIRCUIT); graph.nodes.push({ id: 'npn', type: 'analog-transistor-npn', x: 500, y: 100, data: { kind: 'npn', angle: 0 } }, { id: 'pnp', type: 'analog-transistor-pnp', x: 500, y: 240, data: { kind: 'pnp', angle: 0 } });
    const editor = new TpGraphAnalogCircuit(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const npn = editor.querySelector('[data-node-id="npn"] .tp-analog-transistor-arrow')?.getAttribute('d'); const pnp = editor.querySelector('[data-node-id="pnp"] .tp-analog-transistor-arrow')?.getAttribute('d');
    expect(npn).not.toBe(pnp);
  });

  it('renders three rotatable terminals on a potentiometer', async () => {
    const graph = structuredClone(RC_CIRCUIT); graph.nodes.push({ id: 'pot', type: 'analog-potentiometer', x: 520, y: 220, data: { resistance: 10000, position: 0.5, angle: 0 } });
    const editor = new TpGraphAnalogCircuit(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelectorAll('[data-node-id="pot"] .tp-graph-port')).toHaveLength(3);
    editor.querySelector<SVGElement>('[data-node-id="pot"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 520, clientY: 220 }));
    editor.rotateSelected();
    expect(editor.value.nodes.find((node) => node.id === 'pot')?.data?.angle).toBe(90);
    expect(editor.querySelectorAll('[data-node-id="pot"] .tp-graph-port')).toHaveLength(3);
  });

  it('moves a selected analog component with the arrow keys', async () => {
    const editor = new TpGraphAnalogCircuit();
    editor.value = structuredClone(RC_CIRCUIT);
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.querySelector<SVGElement>('[data-node-id="resistor"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 80 }));
    await Promise.resolve();
    expect(document.activeElement).toBe(editor.querySelector('.tp-graph-canvas'));
    editor.querySelector('.tp-graph-canvas')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    editor.querySelector('.tp-graph-canvas')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true }));
    expect(editor.value.nodes.find((node) => node.id === 'resistor')).toMatchObject({ x: 201, y: 90 });
  });

  it('rotates a selected component and its attached ports', async () => {
    const editor = new TpGraphAnalogCircuit();
    editor.value = structuredClone(RC_CIRCUIT);
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.querySelector<SVGElement>('[data-node-id="resistor"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 80 }));
    editor.rotateSelected();
    const graph = editor.value;
    expect(graph.nodes.find((node) => node.id === 'resistor')?.data?.orientation).toBe('vertical');
    expect(graph.edges.find((edge) => edge.id === 'w1')?.targetPort).toBe('north');
    expect(graph.edges.find((edge) => edge.id === 'w2')?.sourcePort).toBe('south');
    expect(editor.querySelectorAll('[data-node-id="resistor"] .tp-graph-port')).toHaveLength(2);
    expect(editor.querySelector('[data-node-id="resistor"] .tp-graph-label')?.getAttribute('text-anchor')).toBe('start');
    editor.rotateSelected();
    expect(editor.value.nodes.find((node) => node.id === 'resistor')?.data?.angle).toBe(180);
    expect(editor.querySelector('[data-node-id="resistor"] .tp-graph-label')?.getAttribute('text-anchor')).toBe('middle');
    expect(editor.value.edges.find((edge) => edge.id === 'w1')?.targetPort).toBe('east');
    expect(editor.value.edges.find((edge) => edge.id === 'w2')?.sourcePort).toBe('west');
    editor.rotateSelected();
    expect(editor.value.nodes.find((node) => node.id === 'resistor')?.data?.angle).toBe(270);
    editor.rotateSelected();
    expect(editor.value.nodes.find((node) => node.id === 'resistor')?.data?.angle).toBe(0);
    expect(editor.value.edges.find((edge) => edge.id === 'w1')?.targetPort).toBe('west');
    expect(editor.value.edges.find((edge) => edge.id === 'w2')?.sourcePort).toBe('east');
  });

  it('rotates an isolated component and edits its label and value', async () => {
    const graph = structuredClone(RC_CIRCUIT);
    graph.nodes.push({ id: 'isolated', type: 'analog-resistor', x: 520, y: 240, label: 'R2', data: { resistance: 220, orientation: 'horizontal' } });
    const editor = new TpGraphAnalogCircuit(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.querySelector<SVGElement>('[data-node-id="isolated"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 520, clientY: 240 }));
    editor.rotateSelected();
    expect(editor.value.nodes.find((node) => node.id === 'isolated')?.data?.orientation).toBe('vertical');
    const labelInput = editor.querySelector<HTMLInputElement>('[data-analog-label]'); if (labelInput) { labelInput.value = 'Load'; labelInput.dispatchEvent(new Event('change', { bubbles: true })); }
    const valueInput = editor.querySelector<HTMLInputElement>('[data-analog-value]'); if (valueInput) { valueInput.value = '470'; valueInput.dispatchEvent(new Event('change', { bubbles: true })); }
    expect(editor.value.nodes.find((node) => node.id === 'isolated')).toMatchObject({ label: 'Load', data: { resistance: 470, orientation: 'vertical' } });
  });

  it('edits values with scalable SI units while storing base units', async () => {
    const editor = new TpGraphAnalogCircuit(); editor.value = structuredClone(RC_CIRCUIT); document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.querySelector<SVGElement>('[data-node-id="capacitor"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 320, clientY: 140 }));
    const unit = editor.querySelector<HTMLSelectElement>('[data-analog-unit]');
    expect(unit?.selectedOptions[0]?.textContent).toBe('µF');
    if (unit) { unit.value = '1e-12'; unit.dispatchEvent(new Event('change', { bubbles: true })); }
    const value = editor.querySelector<HTMLInputElement>('[data-analog-value]'); if (value) { value.value = '470'; value.dispatchEvent(new Event('change', { bubbles: true })); }
    expect(editor.value.nodes.find((node) => node.id === 'capacitor')?.data?.capacitance).toBeCloseTo(470e-12, 16);
  });

});
