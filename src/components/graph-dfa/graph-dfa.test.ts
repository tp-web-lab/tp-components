import { describe, expect, it, vi } from 'vitest';
import { createDfaStep, TpGraphDfa, TP_DFA_STATE, TP_DFA_TRANSITION, validateDfaGraph } from './graph-dfa.js';
import type { TpGraphDocument } from '../graph-editor/graph-editor.js';

const STARTS_WITH_AB: TpGraphDocument = {
  version: 1,
  data: { alphabet: ['a', 'b'] },
  nodes: [
    { id: 'q0', type: TP_DFA_STATE, x: 100, y: 100, data: { initial: true } },
    { id: 'q1', type: TP_DFA_STATE, x: 260, y: 100 },
    { id: 'q2', type: TP_DFA_STATE, x: 420, y: 100, data: { accepting: true } },
    { id: 'dead', type: TP_DFA_STATE, x: 260, y: 260 },
  ],
  edges: [
    { id: 'q0-a', type: TP_DFA_TRANSITION, source: 'q0', target: 'q1', label: 'a' },
    { id: 'q0-b', type: TP_DFA_TRANSITION, source: 'q0', target: 'dead', label: 'b' },
    { id: 'q1-b', type: TP_DFA_TRANSITION, source: 'q1', target: 'q2', label: 'b' },
    { id: 'q1-a', type: TP_DFA_TRANSITION, source: 'q1', target: 'dead', label: 'a' },
    { id: 'q2-a', type: TP_DFA_TRANSITION, source: 'q2', target: 'q2', label: 'a' },
    { id: 'q2-b', type: TP_DFA_TRANSITION, source: 'q2', target: 'q2', label: 'b' },
    { id: 'dead-a', type: TP_DFA_TRANSITION, source: 'dead', target: 'dead', label: 'a' },
    { id: 'dead-b', type: TP_DFA_TRANSITION, source: 'dead', target: 'dead', label: 'b' },
  ],
};

describe('<tp-graph-dfa>', () => {
  it('recognizes words over a and b that start with ab', async () => {
    const editor = new TpGraphDfa();
    editor.value = STARTS_WITH_AB;
    editor.reset('abba');
    expect(await editor.run(0)).toBe(true);
    editor.reset('aaba');
    expect(await editor.run(0)).toBe(false);
    editor.reset('ab');
    expect(await editor.run(0)).toBe(true);
  });

  it('computes one pure DFA step', () => {
    const result = createDfaStep(STARTS_WITH_AB, 'q0', 'a', 0);
    expect(result.stateId).toBe('q1');
    expect(result.transition.nodes?.q1?.state?.active).toBe(true);
    expect(result.transition.edges?.['q0-a']?.state?.active).toBe(true);
  });

  it('rejects nondeterministic transitions', () => {
    const graph = structuredClone(STARTS_WITH_AB);
    graph.edges.push({ id: 'duplicate', source: 'q0', target: 'q2', label: 'a' });
    expect(() => validateDfaGraph(graph)).toThrow('several transitions');
  });

  it('rejects a symbol outside the declared alphabet explicitly', async () => {
    const editor = new TpGraphDfa();
    editor.value = STARTS_WITH_AB;
    document.body.append(editor);
    editor.reset('ac');
    await editor.run(0);
    expect(editor.accepted).toBe(false);
    expect(editor.alphabet).toEqual(['a', 'b']);
    expect(editor.querySelector('.tp-dfa-status')?.textContent).toBe('Invalid symbol: c');
    expect(editor.querySelector('.tp-dfa-status')?.classList.contains('danger')).toBe(true);
  });

  it('uses success for an accepted word and danger for a rejected word', async () => {
    const editor = new TpGraphDfa();
    editor.value = STARTS_WITH_AB;
    document.body.append(editor);
    editor.reset('ab');
    await editor.run(0);
    expect(editor.querySelector('.tp-dfa-status')?.classList.contains('success')).toBe(true);
    editor.reset('aa');
    await editor.run(0);
    expect(editor.querySelector('.tp-dfa-status')?.classList.contains('danger')).toBe(true);
  });

  it('distributes the two self-links of each state over different ports', () => {
    const editor = new TpGraphDfa();
    editor.value = STARTS_WITH_AB;
    const q2 = editor.value.edges.filter((edge) => edge.source === 'q2' && edge.target === 'q2');
    const dead = editor.value.edges.filter((edge) => edge.source === 'dead' && edge.target === 'dead');
    expect(q2[0]).toMatchObject({ sourcePort: 'east', targetPort: 'north' });
    expect(q2[1]).toMatchObject({ sourcePort: 'south', targetPort: 'west' });
    expect(dead[0]).toMatchObject({ sourcePort: 'east', targetPort: 'north' });
    expect(dead[1]).toMatchObject({ sourcePort: 'south', targetPort: 'west' });
  });

  it('renders its palette and simulation toolbar', async () => {
    const editor = new TpGraphDfa();
    editor.value = STARTS_WITH_AB;
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-shape="dfa-state"]')).not.toBeNull();
    expect(editor.querySelector('[data-dfa-word]')).not.toBeNull();
    expect(editor.querySelector('[data-dfa-action="step"]')).not.toBeNull();
    expect(editor.querySelector('[data-dfa-action="run"]')?.getAttribute('name')).toBe('playlist-play');
    expect(editor.querySelector('[data-dfa-action="reset"]')?.nextElementSibling)
      .toBe(editor.querySelector('.tp-dfa-word-label'));
    expect(editor.querySelector('.tp-graph-results-header')?.textContent).toBe('Transition table');
    expect(editor.querySelectorAll('.tp-graph-results tbody tr')).toHaveLength(4);
    const listener = vi.fn();
    editor.addEventListener('tp-dfa-step', listener);
    editor.reset('a');
    await editor.readNext(0);
    expect(listener).toHaveBeenCalledOnce();
    expect(editor.querySelector('[data-edge-id="q0-a"]')?.classList.contains('is-active')).toBe(true);

    const word = editor.querySelector<HTMLInputElement>('[data-dfa-word]');
    if (word) { word.value = 'ab'; word.dispatchEvent(new Event('change')); }
    vi.spyOn(editor, 'readNext').mockResolvedValue(false);
    vi.spyOn(editor, 'run').mockResolvedValue(false);
    editor.querySelector<HTMLElement>('[data-dfa-action="step"]')?.click();
    editor.querySelector<HTMLElement>('[data-dfa-action="run"]')?.click();
    editor.querySelector<HTMLElement>('[data-dfa-action="reset"]')?.click();
    editor.word = 'a';
    expect(editor.word).toBe('a');
    expect(editor.position).toBe(0);
    expect(editor.currentState).toBe('q0');
  });

  it('validates nodes and edges added through the public API', () => {
    const editor = new TpGraphDfa();
    expect(() => editor.addNode('unsupported', { x: 0, y: 0 })).toThrow('Unsupported DFA node');
    expect(() => editor.addEdge('missing', 'missing', TP_DFA_TRANSITION, undefined, undefined, 'backward')).toThrow('forward');
    expect(() => (editor as unknown as { validateConnection(source: string, target: string, type: string): void }).validateConnection('missing', 'missing', TP_DFA_TRANSITION)).toThrow('endpoints');
  });
});
