import { describe, expect, it, vi } from 'vitest';
import {
  createPetriFireTransition,
  getEnabledPetriTransitions,
  getPetriIncidenceMatrix,
  getPetriReachabilityGraph,
  TpGraphPetri,
  TP_PETRI_ARC,
  TP_PETRI_PLACE,
  TP_PETRI_TRANSITION,
} from './graph-petri.js';
import type { TpGraphDocument } from '../graph-editor/graph-editor.js';

const SIMPLE_NET: TpGraphDocument = {
  version: 1,
  nodes: [
    { id: 'p1', type: 'petri-place', x: 50, y: 50, data: { initialTokens: 1 }, state: { tokens: 1 } },
    { id: 't1', type: 'petri-transition', x: 150, y: 50 },
    { id: 'p2', type: 'petri-place', x: 250, y: 50, data: { initialTokens: 0 }, state: { tokens: 0 } },
  ],
  edges: [
    { id: 'a1', type: 'petri-arc', source: 'p1', target: 't1', data: { weight: 1 } },
    { id: 'a2', type: 'petri-arc', source: 't1', target: 'p2', data: { weight: 1 } },
  ],
};

describe('<tp-graph-petri>', () => {
  it('detects enabled transitions and computes their marking', () => {
    expect(getEnabledPetriTransitions(SIMPLE_NET)).toEqual(['t1']);
    const result = createPetriFireTransition(SIMPLE_NET, 't1', 0);
    expect(result.nodes?.p1?.state).toMatchObject({ tokens: 0 });
    expect(result.nodes?.p2?.state).toMatchObject({ tokens: 1 });
  });

  it('computes the incidence matrix and reachability graph', () => {
    expect(getPetriIncidenceMatrix(SIMPLE_NET)).toEqual({
      places: ['p1', 'p2'], transitions: ['t1'], values: [[-1], [1]],
    });
    const reachability = getPetriReachabilityGraph(SIMPLE_NET);
    expect(reachability.markings).toEqual([[1, 0], [0, 1]]);
    expect(reachability.edges).toEqual([{ source: 0, target: 1, transition: 't1' }]);
    expect(reachability.truncated).toBe(false);
  });

  it('fires and resets a transition', async () => {
    const editor = new TpGraphPetri();
    editor.value = SIMPLE_NET;
    document.body.append(editor);
    const listener = vi.fn();
    editor.addEventListener('tp-petri-fire', listener);
    await editor.fire('t1', 0);
    expect(editor.marking).toEqual({ p1: 0, p2: 1 });
    expect(editor.enabledTransitions).toEqual([]);
    expect(listener).toHaveBeenCalledOnce();
    editor.resetMarking();
    expect(editor.marking).toEqual({ p1: 1, p2: 0 });
    expect(editor.querySelector('[data-petri-action="fire"]')).not.toBeNull();
    expect(editor.querySelector('[data-petri-action="reset"]')).not.toBeNull();
    expect(editor.querySelector('[data-petri-action="reset"]')?.nextElementSibling)
      .toBe(editor.querySelector('[data-petri-action="fire"]'));
  });

  it('chooses fireNext randomly among all enabled transitions', async () => {
    const graph: TpGraphDocument = {
      version: 1,
      nodes: [
        { id: 'p1', type: 'petri-place', x: 0, y: 0, state: { tokens: 1 } },
        { id: 'p2', type: 'petri-place', x: 0, y: 100, state: { tokens: 1 } },
        { id: 't1', type: 'petri-transition', x: 100, y: 0 },
        { id: 't2', type: 'petri-transition', x: 100, y: 100 },
      ],
      edges: [
        { id: 'a1', source: 'p1', target: 't1', type: 'petri-arc' },
        { id: 'a2', source: 'p2', target: 't2', type: 'petri-arc' },
      ],
    };
    const editor = new TpGraphPetri();
    editor.value = graph;
    document.body.append(editor);
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(await editor.fireNext(0)).toBe('t2');
    random.mockRestore();
    expect(editor.marking).toMatchObject({ p1: 1, p2: 0 });
  });

  it('rejects arcs between nodes of the same kind', () => {
    const editor = new TpGraphPetri();
    const first = editor.addPlace({ x: 0, y: 0 });
    const second = editor.addPlace({ x: 100, y: 0 });
    expect(() => editor.addArc(first.id, second.id)).toThrow(TypeError);
    expect(() => editor.addNode('node', { x: 0, y: 0 })).toThrow(TypeError);
    expect(() => editor.addArc(first.id, 'missing', 0)).toThrow(TypeError);
  });

  it('applies Petri connection constraints when reconnecting an arc endpoint', () => {
    const editor = new TpGraphPetri();
    editor.value = {
      version: 1,
      nodes: [
        { id: 'p1', type: TP_PETRI_PLACE, x: 40, y: 40 },
        { id: 'p2', type: TP_PETRI_PLACE, x: 40, y: 140 },
        { id: 't1', type: TP_PETRI_TRANSITION, x: 180, y: 40 },
        { id: 't2', type: TP_PETRI_TRANSITION, x: 180, y: 140 },
      ],
      edges: [{ id: 'arc', type: TP_PETRI_ARC, source: 'p1', target: 't1' }],
    };
    expect(() => editor.reconnectEdge('arc', 'source', 't2', 'west')).toThrow(
      'A Petri arc must connect a place and a transition.',
    );
    expect(editor.value.edges[0]).toMatchObject({ source: 'p1', target: 't1' });
    expect(editor.reconnectEdge('arc', 'source', 'p2', 'east')).toMatchObject({
      source: 'p2', target: 't1', sourcePort: 'east',
    });
  });

  it('supports forward and backward arcs in both the palette and simulation', async () => {
    const graph: TpGraphDocument = {
      version: 1,
      nodes: [
        { id: 'p', type: TP_PETRI_PLACE, x: 40, y: 40, state: { tokens: 0 } },
        { id: 't', type: TP_PETRI_TRANSITION, x: 180, y: 40 },
      ],
      edges: [{
        id: 'backward-arc', type: TP_PETRI_ARC,
        source: 'p', target: 't', direction: 'backward',
      }],
    };
    expect(getEnabledPetriTransitions(graph)).toContain('t');
    expect(createPetriFireTransition(graph, 't', 0).nodes?.p?.state?.tokens).toBe(1);
    const editor = new TpGraphPetri();
    editor.value = graph;
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelectorAll('[data-edge-direction]')).toHaveLength(2);
    expect(editor.querySelector('[data-edge-direction="forward"]')).not.toBeNull();
    expect(editor.querySelector('[data-edge-direction="backward"]')).not.toBeNull();
    expect(() => editor.setEdgeDirection('backward-arc', 'both')).toThrow(
      'Unsupported edge direction: both',
    );
  });

  it('allows several input places on the same transition', () => {
    const editor = new TpGraphPetri();
    const first = editor.addPlace({ x: 0, y: 0 });
    const second = editor.addPlace({ x: 0, y: 100 });
    const transition = editor.addTransition({ x: 150, y: 50 }, 'Start');
    editor.addArc(first.id, transition.id);
    editor.addArc(second.id, transition.id);
    expect(editor.value.edges).toHaveLength(2);
    expect(editor.value.edges.every((edge) => edge.target === transition.id)).toBe(true);
  });

  it('keeps annotations separate from Petri nodes and shows a specific toolbar', async () => {
    const editor = new TpGraphPetri();
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const comment = editor.addNode('comment', { x: 100, y: 100 }, 'Note');
    const place = editor.addPlace({ x: 250, y: 100 });
    expect(comment.type).toBe('comment');
    expect(() => editor.addEdge(comment.id, place.id)).toThrow(TypeError);
    expect(editor.querySelector('.tp-graph-specific-toolbar [data-petri-action="fire"]')).not.toBeNull();
    expect(editor.querySelector('.tp-graph-workspace > .tp-graph-specific-toolbar')).not.toBeNull();
    expect(editor.querySelector('.tp-graph-canvas-frame .tp-graph-specific-toolbar')).toBeNull();
    expect(editor.querySelector('[data-shape="comment"]')).not.toBeNull();
  });

  it('adds a token by dropping the token palette item on a place', async () => {
    const editor = new TpGraphPetri();
    editor.value = SIMPLE_NET;
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const dataTransfer = {
      dropEffect: 'none', effectAllowed: 'copy', files: [], items: [], types: [],
      clearData: () => {},
      getData: (type: string) => type === 'application/x-tp-graph-shape' ? 'petri-token' : '',
      setData: () => {},
      setDragImage: () => {},
    } as unknown as DataTransfer;
    const drop = new MouseEvent('drop', { bubbles: true, cancelable: true, clientX: 50, clientY: 50 });
    Object.defineProperty(drop, 'dataTransfer', { value: dataTransfer });
    editor.querySelector('[data-node-id="p1"] .tp-graph-shape')?.dispatchEvent(drop);
    expect(editor.marking.p1).toBe(2);
    expect(editor.value.nodes.find((node) => node.id === 'p1')?.data?.initialTokens).toBe(2);
    expect(editor.querySelector('[data-shape="petri-token"]')).not.toBeNull();
    expect(editor.querySelector('[data-shape="petri-place"] .tp-graph-palette-preview .tp-petri-place')).not.toBeNull();
    expect(editor.querySelector('[data-shape="petri-transition"] .tp-graph-palette-preview .tp-petri-transition')).not.toBeNull();
    expect(editor.querySelector('[data-shape="petri-token"] .tp-graph-palette-preview .tp-petri-token')).not.toBeNull();
    editor.resetMarking();
    expect(editor.marking.p1).toBe(2);
  });

  it('honours arc weights and place capacities', () => {
    const graph = structuredClone(SIMPLE_NET);
    graph.edges[0]!.data = { weight: 2 };
    expect(getEnabledPetriTransitions(graph)).toEqual([]);
    graph.edges[0]!.data = { weight: 1 };
    graph.nodes[2]!.data = { capacity: 0 };
    expect(getEnabledPetriTransitions(graph)).toEqual([]);
  });

  it('initializes a Petri net from a tp/graph script', async () => {
    const editor = document.createElement('tp-graph-petri') as TpGraphPetri;
    editor.innerHTML = `<script type="tp/graph">
      ${JSON.stringify(SIMPLE_NET)}
    </script>`;
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.marking).toEqual({ p1: 1, p2: 0 });
    expect(editor.enabledTransitions).toEqual(['t1']);
    expect(editor.querySelectorAll('[data-node-id="p1"] .tp-graph-port')).toHaveLength(4);
    expect(editor.querySelectorAll('[data-node-id="t1"] .tp-graph-port')).toHaveLength(4);
    expect(editor.querySelector('[data-node-id="t1"]')?.classList.contains('is-petri-enabled')).toBe(true);
    expect(editor.querySelector('[data-petri-fire-transition="t1"]')).not.toBeNull();
    expect(editor.querySelector('.tp-graph-results-header')?.textContent).toBe('Petri net analysis');
    expect(editor.querySelector('.tp-graph-marking-vector')).not.toBeNull();
    expect(editor.querySelector('.tp-graph-marking-graph svg')).not.toBeNull();
  });

  it('fires an enabled transition with Enter or Space', async () => {
    const editor = new TpGraphPetri();
    editor.value = SIMPLE_NET;
    document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const fire = vi.spyOn(editor, 'fire').mockResolvedValue();
    const control = editor.querySelector(
      '[data-node-id="t1"]',
    ) as SVGGElement;

    expect(control.getAttribute('role')).toBe('button');
    expect(control.getAttribute('tabindex')).toBe('0');
    control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    control.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(fire).toHaveBeenCalledTimes(2);
    expect(fire).toHaveBeenNthCalledWith(1, 't1');
  });
});
