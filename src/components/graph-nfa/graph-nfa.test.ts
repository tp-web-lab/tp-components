import { describe, expect, it, vi } from 'vitest';
import { createNfaStep, regexToNfa, TpGraphNfa, TP_NFA_EPSILON } from './graph-nfa.js';

describe('<tp-graph-nfa>', () => {
  it('builds a Thompson NFA containing epsilon transitions', () => {
    const graph = regexToNfa('ab(a|b)*');
    expect(graph.data?.regex).toBe('ab(a|b)*');
    expect(graph.edges.some((edge) => edge.label === TP_NFA_EPSILON)).toBe(true);
    expect(graph.nodes.filter((node) => node.data?.initial)).toHaveLength(1);
    expect(graph.nodes.filter((node) => node.data?.accepting)).toHaveLength(1);
  });

  it('tracks several active states and recognizes the example language', async () => {
    const editor = new TpGraphNfa();
    editor.generate('ab(a|b)*');
    editor.reset('abba');
    expect(await editor.run(0)).toBe(true);
    editor.reset('aaba');
    expect(await editor.run(0)).toBe(false);
  });

  it('computes a pure NFA step', () => {
    const graph = regexToNfa('a|a');
    const initial = graph.nodes.filter((node) => node.data?.initial).map((node) => node.id);
    const result = createNfaStep(graph, initial, 'a', 0);
    expect(result.activeStates.length).toBeGreaterThan(1);
  });

  it('renders regex generation and automatic-run controls', async () => {
    const editor = new TpGraphNfa();
    editor.value = regexToNfa('ab(a|b)*');
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-nfa-regex]')).not.toBeNull();
    expect(editor.querySelector('[data-nfa-action="generate"]')).not.toBeNull();
    expect(editor.querySelector('[data-nfa-action="run"]')?.getAttribute('name')).toBe('playlist-play');
    expect(editor.querySelector('[data-nfa-action="generate"]')?.nextElementSibling)
      .toBe(editor.querySelector('[data-nfa-regex]')?.parentElement);
    expect(editor.querySelector('[data-nfa-action="reset"]')?.nextElementSibling)
      .toBe(editor.querySelector('[data-nfa-word]')?.parentElement);
    expect(editor.querySelector('.tp-graph-results-header')?.textContent).toBe('Transition table');
    expect(editor.querySelector('.tp-graph-results thead')?.textContent).toContain(TP_NFA_EPSILON);
    const regex = editor.querySelector<HTMLInputElement>('[data-nfa-regex]');
    const word = editor.querySelector<HTMLInputElement>('[data-nfa-word]');
    if (regex) { regex.value = 'a*'; regex.dispatchEvent(new Event('change')); }
    if (word) { word.value = 'aa'; word.dispatchEvent(new Event('change')); }
    vi.spyOn(editor, 'readNext').mockResolvedValue(false);
    vi.spyOn(editor, 'run').mockResolvedValue(false);
    for (const action of ['generate', 'step', 'run', 'reset']) editor.querySelector<HTMLElement>(`[data-nfa-action="${action}"]`)?.click();
    expect(editor.regex).toBe('a*');
    expect(editor.word).toBe('aa');
    expect(editor.activeStates.length).toBeGreaterThan(0);
  });

  it('validates nodes and edges added through the public API', () => {
    const editor = new TpGraphNfa();
    expect(() => editor.addNode('unsupported', { x: 0, y: 0 })).toThrow('Unsupported NFA node');
    expect(() => editor.addEdge('missing', 'missing', undefined, undefined, undefined, 'backward')).toThrow('forward');
    expect(() => (editor as unknown as { validateConnection(source: string, target: string, type: string): void }).validateConnection('missing', 'missing', 'nfa-transition')).toThrow('endpoints');
  });
});
