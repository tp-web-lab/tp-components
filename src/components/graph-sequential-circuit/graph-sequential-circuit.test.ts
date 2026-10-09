import { describe, expect, it, vi } from 'vitest';
import { TP_LOGIC_HUB, TP_LOGIC_INPUT, TP_LOGIC_OUTPUT } from '../graph-logical-circuit/graph-logical-circuit.js';
import type { TpGraphDocument } from '../graph-editor/graph-editor.js';
import {
  evaluateSequentialCombinational,
  TpGraphSequentialCircuit,
  TP_LOGIC_CLOCK,
  TP_LOGIC_D_LATCH,
  TP_LOGIC_D_FLIP_FLOP,
  TP_LOGIC_JK_FLIP_FLOP,
  TP_LOGIC_SR_LATCH,
  TP_LOGIC_T_FLIP_FLOP,
  validateSequentialCircuit,
} from './graph-sequential-circuit.js';

const REGISTER: TpGraphDocument = {
  version: 1,
  title: 'One-bit register',
  nodes: [
    { id: 'data', type: TP_LOGIC_INPUT, x: 80, y: 140, state: { value: true } },
    { id: 'clock', type: TP_LOGIC_CLOCK, x: 80, y: 240 },
    { id: 'dff', type: TP_LOGIC_D_FLIP_FLOP, x: 280, y: 140, data: { initial: false }, state: { value: false } },
    { id: 'q', type: TP_LOGIC_OUTPUT, x: 480, y: 140 },
  ],
  edges: [
    { id: 'data-d', type: 'logic-wire', source: 'data', sourcePort: 'east', target: 'dff', targetPort: 'west', direction: 'forward' },
    { id: 'clock-dff', type: 'logic-wire', source: 'clock', sourcePort: 'east', target: 'dff', targetPort: 'north', direction: 'forward' },
    { id: 'dff-q', type: 'logic-wire', source: 'dff', sourcePort: 'east', target: 'q', targetPort: 'west', direction: 'forward' },
  ],
};

describe('<tp-graph-sequential-circuit>', () => {
  it('validates and evaluates the combinational part without changing memory', () => {
    validateSequentialCircuit(REGISTER);
    const graph = evaluateSequentialCombinational(REGISTER);
    expect(graph.nodes.find((node) => node.id === 'dff')?.state?.value).toBe(false);
    expect(graph.nodes.find((node) => node.id === 'q')?.state?.value).toBe(false);
    expect(graph.edges.find((edge) => edge.id === 'data-d')?.state?.value).toBe(true);
  });

  it('samples every D input on a clock step and resets the state', () => {
    const editor = new TpGraphSequentialCircuit();
    editor.value = REGISTER;
    const listener = vi.fn();
    editor.addEventListener('tp-sequential-clock', listener);
    editor.clockStep();
    expect(editor.value.nodes.find((node) => node.id === 'dff')?.state?.value).toBe(true);
    expect(editor.value.nodes.find((node) => node.id === 'q')?.state?.value).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    editor.resetSequentialState();
    expect(editor.value.nodes.find((node) => node.id === 'dff')?.state?.value).toBe(false);
  });

  it('requires a clock on the flip-flop clock port', () => {
    const invalid = structuredClone(REGISTER);
    const clockWire = invalid.edges.find((edge) => edge.id === 'clock-dff');
    if (clockWire) clockWire.source = 'data';
    expect(() => validateSequentialCircuit(invalid)).toThrow('clock port');
  });

  it('accepts one wire on the south auxiliary input', () => {
    const graph = structuredClone(REGISTER);
    graph.edges.push({
      id: 'aux-dff',
      type: 'logic-wire',
      source: 'data',
      sourcePort: 'east',
      target: 'dff',
      targetPort: 'south',
      direction: 'forward',
    });
    expect(() => validateSequentialCircuit(graph)).not.toThrow();
  });

  it('distributes a clock signal through a hub', () => {
    const graph = structuredClone(REGISTER);
    graph.nodes.push({ id: 'clock-hub', type: TP_LOGIC_HUB, x: 180, y: 240, label: 'CLK' });
    const clockWire = graph.edges.find((edge) => edge.id === 'clock-dff');
    if (clockWire) clockWire.target = 'clock-hub';
    graph.edges.push({
      id: 'hub-dff',
      type: 'logic-wire',
      source: 'clock-hub',
      sourcePort: 'east',
      target: 'dff',
      targetPort: 'north',
      direction: 'forward',
    });
    expect(() => validateSequentialCircuit(graph)).not.toThrow();
  });

  it('evaluates SR and D latches while enabled', () => {
    const graph: TpGraphDocument = {
      version: 1,
      nodes: [
        { id: 'high', type: TP_LOGIC_INPUT, x: 40, y: 40, state: { value: true } },
        { id: 'low', type: TP_LOGIC_INPUT, x: 40, y: 100, state: { value: false } },
        { id: 'sr', type: TP_LOGIC_SR_LATCH, x: 200, y: 60, state: { value: false } },
        { id: 'dl', type: TP_LOGIC_D_LATCH, x: 200, y: 160, state: { value: false } },
      ],
      edges: [
        { id: 'set', source: 'high', target: 'sr', targetPort: 'west', direction: 'forward' },
        { id: 'reset', source: 'low', target: 'sr', targetPort: 'south', direction: 'forward' },
        { id: 'data', source: 'high', target: 'dl', targetPort: 'west', direction: 'forward' },
        { id: 'enable', source: 'high', target: 'dl', targetPort: 'south', direction: 'forward' },
      ],
    };
    const evaluated = evaluateSequentialCombinational(graph);
    expect(evaluated.nodes.find((node) => node.id === 'sr')?.state?.value).toBe(true);
    expect(evaluated.nodes.find((node) => node.id === 'dl')?.state?.value).toBe(true);
  });

  it('applies JK and T truth tables on a clock step', () => {
    const editor = new TpGraphSequentialCircuit();
    const graph = structuredClone(REGISTER);
    const dff = graph.nodes.find((node) => node.id === 'dff');
    if (dff) dff.type = TP_LOGIC_JK_FLIP_FLOP;
    graph.nodes.push({ id: 'k', type: TP_LOGIC_INPUT, x: 80, y: 300, state: { value: true } });
    graph.edges.push({ id: 'k-jk', source: 'k', target: 'dff', targetPort: 'south', direction: 'forward' });
    editor.value = graph;
    editor.clockStep();
    expect(editor.value.nodes.find((node) => node.id === 'dff')?.state?.value).toBe(true);
    editor.clockStep();
    expect(editor.value.nodes.find((node) => node.id === 'dff')?.state?.value).toBe(false);

    const toggle = structuredClone(REGISTER);
    const memory = toggle.nodes.find((node) => node.id === 'dff');
    if (memory) memory.type = TP_LOGIC_T_FLIP_FLOP;
    editor.value = toggle;
    editor.clockStep();
    expect(editor.value.nodes.find((node) => node.id === 'dff')?.state?.value).toBe(true);
  });

  it('renders its palette and simulation toolbar', async () => {
    const editor = new TpGraphSequentialCircuit();
    editor.value = REGISTER;
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-shape="logic-clock"]')).not.toBeNull();
    expect(editor.querySelector('[data-shape="logic-d-flip-flop"]')).not.toBeNull();
    expect(editor.querySelector('[data-shape="logic-sr-latch"]')).not.toBeNull();
    expect(editor.querySelector('[data-shape="logic-d-latch"]')).not.toBeNull();
    expect(editor.querySelector('[data-shape="logic-jk-flip-flop"]')).not.toBeNull();
    expect(editor.querySelector('[data-shape="logic-t-flip-flop"]')).not.toBeNull();
    expect(editor.querySelector('[data-sequential-action="reset"]')).not.toBeNull();
    expect(editor.querySelector('[data-sequential-action="step"]')).not.toBeNull();
    expect(editor.querySelector('[data-node-id="dff"] .tp-sequential-memory')).not.toBeNull();
    expect(editor.querySelector('[data-node-id="dff"] [data-port="south"]')).not.toBeNull();
    expect(editor.querySelector('.tp-graph-results-header')?.textContent).toBe('Timing diagram');
    expect(editor.querySelector('.tp-graph-results svg')).not.toBeNull();
    editor.evaluate();
    expect(editor.toggle('data')).toBe(false);
    editor.run(100);
    expect(editor.running).toBe(true);
    editor.run(100);
    editor.stop();
    expect(editor.running).toBe(false);
    editor.stop();
    for (const action of ['reset', 'representation', 'run', 'stop', 'step']) {
      editor.querySelector<HTMLElement>(`[data-sequential-action="${action}"]`)?.click();
    }
    editor.stop();
    editor.remove();
  });

  it('drives level-sensitive latches and the timing diagram with the existing clock controls', () => {
    const editor = new TpGraphSequentialCircuit();
    editor.value = {
      version: 1,
      nodes: [
        { id: 'data', type: TP_LOGIC_INPUT, x: 80, y: 100, state: { value: true } },
        { id: 'clock', type: TP_LOGIC_CLOCK, x: 80, y: 220, state: { value: false } },
        { id: 'latch', type: TP_LOGIC_D_LATCH, x: 280, y: 100, state: { value: false } },
        { id: 'q', type: TP_LOGIC_OUTPUT, x: 460, y: 100, state: { value: false } },
      ],
      edges: [
        { id: 'data-latch', source: 'data', target: 'latch', targetPort: 'west', direction: 'forward' },
        { id: 'clock-latch', source: 'clock', target: 'latch', targetPort: 'south', direction: 'forward' },
        { id: 'latch-q', source: 'latch', target: 'q', targetPort: 'west', direction: 'forward' },
      ],
    };
    document.body.append(editor);
    editor.clockStep();
    expect(editor.value.nodes.find((node) => node.id === 'latch')?.state?.value).toBe(true);
    expect(editor.value.nodes.find((node) => node.id === 'q')?.state?.value).toBe(true);
    expect(editor.value.nodes.find((node) => node.id === 'clock')?.state?.value).toBe(false);
    expect(editor.querySelectorAll('.tp-graph-results-wave')[1]?.getAttribute('d')).toContain(' V ');
    expect(editor.querySelector('[data-sequential-action="stimulus"]')).toBeNull();
  });
});
