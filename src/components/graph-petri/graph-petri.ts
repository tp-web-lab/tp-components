/**
 * @module components/graph-petri
 * @summary Interactive Petri-net editor and simulator.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
// tp-docgen:dependencies:end

import {
  TpGraphEditor,
  TP_GRAPH_COMMENT,
  type TpGraphDocument,
  type TpGraphEdge,
  type TpGraphEdgeDirection,
  type TpGraphNode,
  type TpGraphPoint,
  type TpGraphPort,
  type TpGraphTransition,
} from '../graph-editor/graph-editor.js';
import style from './graph-petri.css?inline';

export const TP_PETRI_PLACE = 'petri-place';
export const TP_PETRI_TRANSITION = 'petri-transition';
export const TP_PETRI_ARC = 'petri-arc';
export const TP_PETRI_TOKEN = 'petri-token';

function finiteInteger(value: unknown, fallback: number, minimum = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value >= minimum
    ? value
    : fallback;
}

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function getPetriTokens(node: Readonly<TpGraphNode>): number {
  return finiteInteger(node.state?.tokens, finiteInteger(node.data?.initialTokens, 0));
}

export function getPetriArcWeight(edge: Readonly<TpGraphEdge>): number {
  return finiteInteger(edge.data?.weight, 1, 1);
}

function getPlaceCapacity(node: Readonly<TpGraphNode>): number | null {
  const capacity = node.data?.capacity;
  return capacity === null || capacity === undefined ? null : finiteInteger(capacity, 0);
}

function petriNodes(graph: Readonly<TpGraphDocument>): Map<string, Readonly<TpGraphNode>> {
  return new Map(graph.nodes.map((node) => [node.id, node]));
}

function directedPetriEndpoints(edge: Readonly<TpGraphEdge>): { source: string; target: string } | null {
  if (edge.source === undefined || edge.target === undefined) return null;
  return edge.direction === 'backward'
    ? { source: edge.target, target: edge.source }
    : { source: edge.source, target: edge.target };
}

export function validatePetriGraph(graph: Readonly<TpGraphDocument>): void {
  const nodes = petriNodes(graph);
  for (const node of graph.nodes) {
    if (node.type === TP_GRAPH_COMMENT) continue;
    if (node.type !== TP_PETRI_PLACE && node.type !== TP_PETRI_TRANSITION) {
      throw new TypeError(`Unsupported Petri-net node type: ${node.type}`);
    }
    if (node.type === TP_PETRI_PLACE) {
      const explicitTokens = node.state?.tokens;
      const initialTokens = node.data?.initialTokens;
      if ((explicitTokens !== undefined && finiteInteger(explicitTokens, -1) < 0)
        || (initialTokens !== undefined && finiteInteger(initialTokens, -1) < 0)) {
        throw new TypeError(`Place "${node.id}" has an invalid marking.`);
      }
      const explicitCapacity = node.data?.capacity;
      if (explicitCapacity !== undefined && explicitCapacity !== null && finiteInteger(explicitCapacity, -1) < 0) {
        throw new TypeError(`Place "${node.id}" has an invalid capacity.`);
      }
      const capacity = getPlaceCapacity(node);
      if (capacity !== null && getPetriTokens(node) > capacity) {
        throw new TypeError(`Place "${node.id}" exceeds its capacity.`);
      }
    }
  }
  for (const edge of graph.edges) {
    if (edge.direction !== undefined && edge.direction !== 'forward' && edge.direction !== 'backward') {
      throw new TypeError(`Arc "${edge.id}" must be forward or backward.`);
    }
    if (edge.source === undefined || edge.target === undefined) continue;
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);
    if (!source || !target) throw new TypeError(`Arc "${edge.id}" has a missing endpoint.`);
    if ((source.type !== TP_PETRI_PLACE && source.type !== TP_PETRI_TRANSITION)
      || (target.type !== TP_PETRI_PLACE && target.type !== TP_PETRI_TRANSITION)
      || source.type === target.type) {
      throw new TypeError(`Arc "${edge.id}" must connect a place and a transition.`);
    }
    if (edge.type !== undefined && edge.type !== TP_PETRI_ARC) {
      throw new TypeError(`Unsupported Petri-net edge type: ${edge.type}`);
    }
    if (edge.data?.weight !== undefined && finiteInteger(edge.data.weight, 0, 1) < 1) {
      throw new TypeError(`Arc "${edge.id}" has an invalid weight.`);
    }
  }
}

function markingAfterFire(
  graph: Readonly<TpGraphDocument>,
  transitionId: string,
): Map<string, number> | null {
  const transition = graph.nodes.find((node) => node.id === transitionId);
  if (transition?.type !== TP_PETRI_TRANSITION) return null;
  const nodes = petriNodes(graph);
  const deltas = new Map<string, number>();
  for (const edge of graph.edges) {
    const endpoints = directedPetriEndpoints(edge);
    if (!endpoints) continue;
    if (endpoints.target === transitionId && nodes.get(endpoints.source)?.type === TP_PETRI_PLACE) {
      deltas.set(endpoints.source, (deltas.get(endpoints.source) ?? 0) - getPetriArcWeight(edge));
    }
    if (endpoints.source === transitionId && nodes.get(endpoints.target)?.type === TP_PETRI_PLACE) {
      deltas.set(endpoints.target, (deltas.get(endpoints.target) ?? 0) + getPetriArcWeight(edge));
    }
  }
  const result = new Map<string, number>();
  for (const [placeId, delta] of deltas) {
    const place = nodes.get(placeId);
    if (!place) return null;
    const tokens = getPetriTokens(place) + delta;
    const capacity = getPlaceCapacity(place);
    if (tokens < 0 || (capacity !== null && tokens > capacity)) return null;
    result.set(placeId, tokens);
  }
  return result;
}

export function getEnabledPetriTransitions(graph: Readonly<TpGraphDocument>): string[] {
  validatePetriGraph(graph);
  return graph.nodes
    .filter((node) => node.type === TP_PETRI_TRANSITION && markingAfterFire(graph, node.id) !== null)
    .map((node) => node.id);
}

export function createPetriFireTransition(
  graph: Readonly<TpGraphDocument>,
  transitionId: string,
  duration = 350,
): TpGraphTransition {
  validatePetriGraph(graph);
  const marking = markingAfterFire(graph, transitionId);
  if (marking === null) throw new Error(`Transition "${transitionId}" is not enabled.`);
  const nodes: NonNullable<TpGraphTransition['nodes']> = {};
  for (const [placeId, tokens] of marking) {
    const place = graph.nodes.find((node) => node.id === placeId);
    nodes[placeId] = { state: { ...(place?.state ?? {}), tokens } };
  }
  for (const transition of graph.nodes.filter((node) => node.type === TP_PETRI_TRANSITION)) {
    nodes[transition.id] = {
      state: { ...(transition.state ?? {}), fired: transition.id === transitionId },
    };
  }
  return { nodes, duration };
}

export interface TpPetriIncidenceMatrix {
  places: string[];
  transitions: string[];
  values: number[][];
}

export interface TpPetriReachabilityGraph {
  places: string[];
  markings: number[][];
  edges: Array<{ source: number; target: number; transition: string }>;
  truncated: boolean;
}

export function getPetriIncidenceMatrix(graph: Readonly<TpGraphDocument>): TpPetriIncidenceMatrix {
  validatePetriGraph(graph);
  const places = graph.nodes.filter((node) => node.type === TP_PETRI_PLACE).map((node) => node.id);
  const transitions = graph.nodes.filter((node) => node.type === TP_PETRI_TRANSITION).map((node) => node.id);
  const values = places.map((placeId) => transitions.map((transitionId) => {
    let value = 0;
    for (const edge of graph.edges) {
      const endpoints = directedPetriEndpoints(edge);
      if (!endpoints) continue;
      if (endpoints.source === placeId && endpoints.target === transitionId) value -= getPetriArcWeight(edge);
      if (endpoints.source === transitionId && endpoints.target === placeId) value += getPetriArcWeight(edge);
    }
    return value;
  }));
  return { places, transitions, values };
}

export function getPetriReachabilityGraph(
  graph: Readonly<TpGraphDocument>,
  maximumMarkings = 32,
): TpPetriReachabilityGraph {
  validatePetriGraph(graph);
  const places = graph.nodes.filter((node) => node.type === TP_PETRI_PLACE).map((node) => node.id);
  const transitions = graph.nodes.filter((node) => node.type === TP_PETRI_TRANSITION).map((node) => node.id);
  const initial = places.map((id) => getPetriTokens(graph.nodes.find((node) => node.id === id) as TpGraphNode));
  const markings = [initial];
  const indexes = new Map([[JSON.stringify(initial), 0]]);
  const edges: TpPetriReachabilityGraph['edges'] = [];
  let truncated = false;
  for (let source = 0; source < markings.length; source += 1) {
    const marking = markings[source];
    if (!marking) continue;
    const candidate = structuredClone(graph);
    for (const [index, placeId] of places.entries()) {
      const place = candidate.nodes.find((node) => node.id === placeId);
      if (place) place.state = { ...(place.state ?? {}), tokens: marking[index] ?? 0 };
    }
    for (const transition of transitions) {
      const fired = markingAfterFire(candidate, transition);
      if (fired === null) continue;
      const next = [...marking];
      for (const [placeId, tokens] of fired) {
        const index = places.indexOf(placeId);
        if (index >= 0) next[index] = tokens;
      }
      const key = JSON.stringify(next);
      let target = indexes.get(key);
      if (target === undefined) {
        if (markings.length >= maximumMarkings) {
          truncated = true;
          continue;
        }
        target = markings.length;
        indexes.set(key, target);
        markings.push(next);
      }
      edges.push({ source, target, transition });
    }
  }
  return { places, markings, edges, truncated };
}

function tokenMarkup(tokens: number): string {
  if (tokens === 0) return '';
  if (tokens > 5) return `<text class="tp-petri-token-count" text-anchor="middle" dominant-baseline="central">${tokens}</text>`;
  const positions: Array<[number, number]> = tokens === 1 ? [[0, 0]]
    : tokens === 2 ? [[-8, 0], [8, 0]]
      : tokens === 3 ? [[0, -9], [-8, 6], [8, 6]]
        : tokens === 4 ? [[-8, -8], [8, -8], [-8, 8], [8, 8]]
          : [[-9, -9], [9, -9], [0, 0], [-9, 9], [9, 9]];
  return positions.map(([x, y]) => `<circle class="tp-petri-token" cx="${x}" cy="${y}" r="4" />`).join('');
}

/**
 * Petri-net specialization of `<tp-graph-editor>`.
 *
 * @summary Edits and simulates place/transition Petri nets.
 * @tagname tp-graph-petri
 * @event tp-petri-fire Fired after a transition is fired.
 * @event tp-petri-reset Fired after the initial marking is restored.
 * @accessibility Exposes enabled transition controls as focusable buttons.
 * @keyboard {Enter / Space} Fires the focused enabled transition.
 * @example
 * <tp-graph-petri></tp-graph-petri>
 */
export class TpGraphPetri extends TpGraphEditor {
  private static readonly petriStyleId = 'tp-graph-petri-styles';

  public constructor() {
    super();
    this.unregisterPalette('generic');
    this.registerPalette({
      id: 'petri',
      label: 'Petri net',
      shapes: [
        {
          type: TP_PETRI_PLACE,
          label: 'Place',
          description: 'Place containing a marking',
          width: 62,
          height: 62,
          createData: () => ({ initialTokens: 0, capacity: null }),
          render: (node, selected) => `<circle r="31" class="tp-graph-shape tp-petri-place${selected ? ' is-selected' : ''}" />
            ${tokenMarkup(getPetriTokens(node))}
            <text class="tp-graph-label tp-petri-label" y="45" text-anchor="middle">${escapeXml(node.label ?? 'Place')}</text>`,
        },
        {
          type: TP_PETRI_TRANSITION,
          label: 'Transition',
          description: 'Petri-net transition',
          width: 24,
          height: 62,
          render: (node, selected) => `<rect x="-12" y="-31" width="24" height="62" rx="2" class="tp-graph-shape tp-petri-transition${selected ? ' is-selected' : ''}${node.state?.fired === true ? ' is-fired' : ''}" />
            <text class="tp-graph-label tp-petri-label" y="45" text-anchor="middle">${escapeXml(node.label ?? 'Transition')}</text>
            <g class="tp-petri-fire-control" data-petri-fire-transition="${escapeXml(node.id)}" aria-hidden="true">
              <circle cx="21" cy="-22" r="10" />
              <path d="M 18 -27 L 26 -22 L 18 -17 Z" />
            </g>`,
        },
        {
          type: TP_PETRI_TOKEN,
          label: 'Token',
          description: 'Drag onto a place to add a token',
          width: 20,
          height: 20,
          render: () => '<circle class="tp-petri-token tp-petri-token-preview" r="7" />',
        },
      ],
    });
    this.registerSimulator('petri', (graph) => {
      const transitionId = getEnabledPetriTransitions(graph)[0];
      return transitionId === undefined ? { duration: 0 } : createPetriFireTransition(graph, transitionId);
    });
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpGraphPetri.petriStyleId, style);
  }

  public override setGraph(graph: TpGraphDocument): void {
    validatePetriGraph(graph);
    super.setGraph(graph);
  }

  public override addEdge(
    source: string,
    target: string,
    type = TP_PETRI_ARC,
    sourcePort?: TpGraphPort,
    targetPort?: TpGraphPort,
    direction: TpGraphEdgeDirection = 'forward',
  ): TpGraphEdge {
    if (direction !== 'forward' && direction !== 'backward') {
      throw new TypeError(`Unsupported Petri arc direction: ${direction}`);
    }
    return super.addEdge(source, target, type, sourcePort, targetPort, direction);
  }

  protected override edgeDirections(): readonly TpGraphEdgeDirection[] { return ['forward', 'backward']; }

  protected override validateConnection(source: string, target: string, type: string): void {
    super.validateConnection(source, target, type);
    const graph = this.value;
    const sourceNode = graph.nodes.find((node) => node.id === source);
    const targetNode = graph.nodes.find((node) => node.id === target);
    if (!sourceNode || !targetNode) throw new TypeError('Both arc endpoints must exist.');
    if ((sourceNode.type !== TP_PETRI_PLACE && sourceNode.type !== TP_PETRI_TRANSITION)
      || (targetNode.type !== TP_PETRI_PLACE && targetNode.type !== TP_PETRI_TRANSITION)
      || sourceNode.type === targetNode.type) {
      throw new TypeError('A Petri arc must connect a place and a transition.');
    }
    if (type !== TP_PETRI_ARC) throw new TypeError(`Unsupported Petri-net edge type: ${type}`);
  }

  public override addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode {
    if (type !== TP_PETRI_PLACE && type !== TP_PETRI_TRANSITION && type !== TP_GRAPH_COMMENT) {
      throw new TypeError(`Unsupported Petri-net node type: ${type}`);
    }
    return super.addNode(type, point, label);
  }

  public addPlace(point: TpGraphPoint, label = 'Place', initialTokens = 0): TpGraphNode {
    if (finiteInteger(initialTokens, -1) < 0) {
      throw new TypeError('The initial marking must be a non-negative integer.');
    }
    const node = this.addNode(TP_PETRI_PLACE, point, label);
    const graph = this.value;
    const stored = graph.nodes.find((candidate) => candidate.id === node.id);
    if (stored) {
      const tokens = finiteInteger(initialTokens, 0);
      stored.data = { ...(stored.data ?? {}), initialTokens: tokens };
      stored.state = { ...(stored.state ?? {}), tokens };
      this.setGraph(graph);
    }
    return this.value.nodes.find((candidate) => candidate.id === node.id) ?? node;
  }

  public addTransition(point: TpGraphPoint, label = 'Transition'): TpGraphNode {
    return this.addNode(TP_PETRI_TRANSITION, point, label);
  }

  public addTokens(placeId: string, count = 1, updateInitial = true): void {
    if (finiteInteger(count, 0, 1) < 1) throw new TypeError('The token count must be a positive integer.');
    const graph = this.value;
    const place = graph.nodes.find((node) => node.id === placeId);
    if (!place || place.type !== TP_PETRI_PLACE) throw new TypeError('Tokens can only be added to a place.');
    const tokens = getPetriTokens(place) + count;
    const capacity = getPlaceCapacity(place);
    if (capacity !== null && tokens > capacity) throw new TypeError(`Place "${placeId}" exceeds its capacity.`);
    place.state = { ...(place.state ?? {}), tokens };
    if (updateInitial) {
      place.data = {
        ...(place.data ?? {}),
        initialTokens: finiteInteger(place.data?.initialTokens, getPetriTokens(place) - count) + count,
      };
    }
    this.setGraph(graph);
    this.dispatchEvent(new CustomEvent('tp-graph-change', {
      bubbles: true, detail: { reason: 'add-token', graph: this.value },
    }));
  }

  public addArc(source: string, target: string, weight = 1): TpGraphEdge {
    if (finiteInteger(weight, 0, 1) < 1) {
      throw new TypeError('The arc weight must be a positive integer.');
    }
    const arc = this.addEdge(source, target);
    const graph = this.value;
    const stored = graph.edges.find((candidate) => candidate.id === arc.id);
    if (stored) {
      const safeWeight = finiteInteger(weight, 1, 1);
      stored.data = { ...(stored.data ?? {}), weight: safeWeight };
      stored.label = safeWeight > 1 ? String(safeWeight) : undefined;
      this.setGraph(graph);
    }
    return this.value.edges.find((candidate) => candidate.id === arc.id) ?? arc;
  }

  public get enabledTransitions(): string[] {
    return getEnabledPetriTransitions(this.value);
  }

  protected override renderResults(): string {
    const graph = this.value;
    const incidence = getPetriIncidenceMatrix(graph);
    if (incidence.places.length === 0) return '';
    const nodeLabel = (id: string): string => {
      const node = graph.nodes.find((candidate) => candidate.id === id);
      return escapeXml(node?.label ?? id);
    };
    const incidenceHeaders = incidence.transitions.map((id) => `<th scope="col">${nodeLabel(id)}</th>`).join('');
    const incidenceRows = incidence.places.map((id, row) => `<tr><th scope="row">${nodeLabel(id)}</th>${(incidence.values[row] ?? [])
      .map((value) => `<td>${value > 0 ? '+' : ''}${value}</td>`).join('')}</tr>`).join('');
    const markingRows = incidence.places.map((id) => `<tr><th scope="row">${nodeLabel(id)}</th><td>${getPetriTokens(
      graph.nodes.find((node) => node.id === id) as TpGraphNode,
    )}</td></tr>`).join('');
    const reachability = getPetriReachabilityGraph(graph);
    const columns = 6;
    const cellWidth = 150;
    const cellHeight = 90;
    const graphWidth = Math.max(cellWidth, Math.min(columns, reachability.markings.length) * cellWidth);
    const graphHeight = Math.max(cellHeight, Math.ceil(reachability.markings.length / columns) * cellHeight);
    const position = (index: number): { x: number; y: number } => ({
      x: index % columns * cellWidth + cellWidth / 2,
      y: Math.floor(index / columns) * cellHeight + cellHeight / 2,
    });
    const graphEdges = reachability.edges.map((edge) => {
      const source = position(edge.source);
      const target = position(edge.target);
      const transition = graph.nodes.find((node) => node.id === edge.transition);
      if (edge.source === edge.target) {
        return `<path class="tp-graph-results-marking-edge" d="M${source.x - 18} ${source.y - 22}A25 25 0 1 1 ${source.x + 18} ${source.y - 22}" marker-end="url(#tp-petri-marking-arrow)" />
          <text class="tp-graph-results-wave-step" x="${source.x}" y="${source.y - 34}" text-anchor="middle">${escapeXml(transition?.label ?? edge.transition)}</text>`;
      }
      const middleX = (source.x + target.x) / 2;
      const middleY = (source.y + target.y) / 2;
      return `<path class="tp-graph-results-marking-edge" d="M${source.x} ${source.y}L${target.x} ${target.y}" marker-end="url(#tp-petri-marking-arrow)" />
        <text class="tp-graph-results-wave-step" x="${middleX}" y="${middleY - 5}" text-anchor="middle">${escapeXml(transition?.label ?? edge.transition)}</text>`;
    }).join('');
    const graphNodes = reachability.markings.map((marking, index) => {
      const point = position(index);
      return `<circle class="tp-graph-results-marking-node" cx="${point.x}" cy="${point.y}" r="27" />
        <text class="tp-graph-results-wave-label" x="${point.x}" y="${point.y - 4}" text-anchor="middle">M${index}</text>
        <text class="tp-graph-results-wave-step" x="${point.x}" y="${point.y + 12}" text-anchor="middle">(${marking.join(', ')})</text>`;
    }).join('');
    return `<h3 class="tp-graph-results-header">Petri net analysis</h3><div class="tp-graph-results-content tp-graph-petri-results">
      <section><h4>Incidence matrix</h4><table><thead><tr><th scope="col">Place / transition</th>${incidenceHeaders}</tr></thead><tbody>${incidenceRows}</tbody></table></section>
      <section><h4>Current marking</h4><table class="tp-graph-marking-vector"><thead><tr><th scope="col">Place</th><th scope="col">M</th></tr></thead><tbody>${markingRows}</tbody></table></section>
      <section class="tp-graph-marking-graph"><h4>Reachability graph${reachability.truncated ? ' (first 32 markings)' : ''}</h4><svg viewBox="0 0 ${graphWidth} ${graphHeight}" width="${graphWidth}" height="${graphHeight}" role="img" aria-label="Reachability graph"><defs><marker id="tp-petri-marking-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" /></marker></defs>${graphEdges}${graphNodes}</svg></section>
    </div>`;
  }

  protected override renderToolbarActions(): string {
    return `<tp-icon-button name="refresh" label="Reset marking" data-petri-action="reset"></tp-icon-button>
      <tp-icon-button name="play" label="Fire an enabled transition" data-petri-action="fire" ${this.enabledTransitions.length === 0 ? 'disabled' : ''}></tp-icon-button>`;
  }

  protected override bindExtensionEvents(): void {
    this.querySelector('[data-petri-action="fire"]')?.addEventListener('click', () => {
      void this.fireNext();
    });
    this.querySelector('[data-petri-action="reset"]')?.addEventListener('click', () => {
      this.resetMarking();
    });
    const enabled = new Set(this.enabledTransitions);
    for (const transition of this.querySelectorAll<SVGGElement>('[data-node-id]')) {
      const id = transition.dataset.nodeId;
      if (id && enabled.has(id)) {
        transition.classList.add('is-petri-enabled');
        transition.addEventListener('keydown', (event) => {
          if (event.target !== transition || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          event.stopPropagation();
          void this.fire(id);
        });
      }
    }
    for (const control of this.querySelectorAll<SVGGElement>('[data-petri-fire-transition]')) {
      const transitionId = control.dataset.petriFireTransition;
      if (!transitionId || !enabled.has(transitionId)) continue;
      control.addEventListener('click', (event) => {
        event.stopPropagation();
        void this.fire(transitionId);
      });
    }
  }

  protected override handlePaletteDrop(type: string, point: TpGraphPoint, target: Element | null): void {
    if (type !== TP_PETRI_TOKEN) {
      super.handlePaletteDrop(type, point, target);
      return;
    }
    const placeId = target?.closest<SVGGElement>('[data-node-id]')?.dataset.nodeId;
    if (!placeId) return;
    try {
      this.addTokens(placeId);
    } catch (error) {
      this.dispatchEvent(new CustomEvent('tp-graph-error', {
        bubbles: true, detail: { error, operation: 'add-token' },
      }));
    }
  }

  public async fire(transitionId: string, duration = 350): Promise<void> {
    await this.animateTransition(createPetriFireTransition(this.value, transitionId, duration));
    this.dispatchEvent(new CustomEvent('tp-petri-fire', {
      bubbles: true,
      detail: { transitionId, marking: this.marking, graph: this.value },
    }));
  }

  public async fireNext(duration = 350): Promise<string | null> {
    const enabled = this.enabledTransitions;
    if (enabled.length === 0) return null;
    const transitionId = enabled[Math.floor(Math.random() * enabled.length)];
    if (transitionId === undefined) return null;
    await this.fire(transitionId, duration);
    return transitionId;
  }

  public resetMarking(): void {
    const graph = this.value;
    for (const node of graph.nodes) {
      if (node.type === TP_PETRI_PLACE) {
        node.state = { ...(node.state ?? {}), tokens: finiteInteger(node.data?.initialTokens, 0) };
      } else if (node.type === TP_PETRI_TRANSITION) {
        node.state = { ...(node.state ?? {}), fired: false };
      }
    }
    this.setGraph(graph);
    this.dispatchEvent(new CustomEvent('tp-petri-reset', {
      bubbles: true, detail: { marking: this.marking, graph: this.value },
    }));
  }

  public get marking(): Record<string, number> {
    return Object.fromEntries(this.value.nodes
      .filter((node) => node.type === TP_PETRI_PLACE)
      .map((node) => [node.id, getPetriTokens(node)]));
  }
}

if (!customElements.get('tp-graph-petri')) customElements.define('tp-graph-petri', TpGraphPetri);
