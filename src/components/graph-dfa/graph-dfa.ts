/**
 * @module components/graph-dfa
 * @summary Interactive deterministic finite automaton editor and simulator.
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
import style from './graph-dfa.css?inline';

export const TP_DFA_STATE = 'dfa-state';
export const TP_DFA_TRANSITION = 'dfa-transition';

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function transitionSymbols(edge: Readonly<TpGraphEdge>): string[] {
  return (edge.label ?? '').split(/[\s,]+/u).filter(Boolean);
}

function dfaAlphabet(graph: Readonly<TpGraphDocument>): string[] {
  const explicit = graph.data?.alphabet;
  if (Array.isArray(explicit)) {
    if (!explicit.every((symbol) => typeof symbol === 'string' && [...symbol].length === 1)) {
      throw new TypeError('The DFA alphabet must contain single-character strings.');
    }
    return [...new Set(explicit)];
  }
  return [...new Set(graph.edges.flatMap(transitionSymbols))].sort();
}

export function validateDfaGraph(graph: Readonly<TpGraphDocument>): void {
  const alphabet = dfaAlphabet(graph);
  const states = new Set<string>();
  let initialStates = 0;
  for (const node of graph.nodes) {
    if (node.type === TP_GRAPH_COMMENT) continue;
    if (node.type !== TP_DFA_STATE) throw new TypeError(`Unsupported DFA node type: ${node.type}`);
    states.add(node.id);
    if (node.data?.initial === true) initialStates += 1;
  }
  if (initialStates > 1) throw new TypeError('A DFA can have only one initial state.');
  const outgoing = new Set<string>();
  for (const edge of graph.edges) {
    if (edge.source === undefined || edge.target === undefined) continue;
    if (!states.has(edge.source) || !states.has(edge.target)) {
      throw new TypeError(`Transition "${edge.id}" must connect two DFA states.`);
    }
    if (edge.type !== undefined && edge.type !== TP_DFA_TRANSITION) {
      throw new TypeError(`Unsupported DFA edge type: ${edge.type}`);
    }
    if (edge.direction !== undefined && edge.direction !== 'forward') {
      throw new TypeError(`Transition "${edge.id}" must be forward.`);
    }
    for (const symbol of transitionSymbols(edge)) {
      const key = `${edge.source}\u0000${symbol}`;
      if (outgoing.has(key)) throw new TypeError(`State "${edge.source}" has several transitions for "${symbol}".`);
      outgoing.add(key);
    }
  }
  if (Array.isArray(graph.data?.alphabet)) {
    for (const stateId of states) {
      for (const symbol of alphabet) {
        if (!outgoing.has(`${stateId}\u0000${symbol}`)) {
          throw new TypeError(`State "${stateId}" has no transition for "${symbol}".`);
        }
      }
    }
  }
}

export function createDfaStep(
  graph: Readonly<TpGraphDocument>,
  stateId: string,
  symbol: string,
  duration = 300,
): { stateId: string | null; transition: TpGraphTransition } {
  validateDfaGraph(graph);
  const edge = graph.edges.find((candidate) => candidate.source === stateId
    && candidate.target !== undefined && transitionSymbols(candidate).includes(symbol));
  const nextStateId = edge?.target ?? null;
  const nodes: NonNullable<TpGraphTransition['nodes']> = {};
  for (const node of graph.nodes.filter((candidate) => candidate.type === TP_DFA_STATE)) {
    nodes[node.id] = { state: { ...(node.state ?? {}), active: node.id === nextStateId } };
  }
  const edges: NonNullable<TpGraphTransition['edges']> = {};
  for (const candidate of graph.edges) {
    edges[candidate.id] = { state: { ...(candidate.state ?? {}), active: candidate.id === edge?.id } };
  }
  return { stateId: nextStateId, transition: { nodes, edges, duration } };
}

/**
 * Deterministic finite automaton specialization of `<tp-graph-editor>`.
 *
 * @summary Edits and simulates deterministic finite automata.
 * @tagname tp-graph-dfa
 * @event tp-dfa-step Fired after one input symbol is consumed.
 * @event tp-dfa-reset Fired after the input and active state are reset.
 * @example
 * <tp-graph-dfa></tp-graph-dfa>
 */
export class TpGraphDfa extends TpGraphEditor {
  private static readonly dfaStyleId = 'tp-graph-dfa-styles';
  private inputWord = '';
  private inputPosition = 0;
  private activeStateId: string | null = null;
  private rejected = false;
  private invalidSymbol: string | null = null;
  private running = false;

  public constructor() {
    super();
    this.unregisterPalette('generic');
    this.registerPalette({
      id: 'dfa',
      label: 'Automaton',
      shapes: [
        { type: TP_DFA_STATE, label: 'State', description: 'DFA state', width: 64, height: 64 },
      ].map((shape) => ({
        ...shape,
        render: (node: Readonly<TpGraphNode>, selected: boolean) => {
          const initial = node.data?.initial === true;
          const accepting = node.data?.accepting === true;
          const active = node.state?.active === true;
          return `${initial ? '<path class="tp-dfa-initial-arrow" d="M -52 0 L -34 0 M -40 -6 L -34 0 L -40 6" />' : ''}
            <circle r="31" class="tp-graph-shape tp-dfa-state${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}" />
            ${accepting ? '<circle r="25" class="tp-dfa-accepting" />' : ''}
            <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${escapeXml(node.label ?? 'State')}</text>`;
        },
      })),
    });
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpGraphDfa.dfaStyleId, style);
  }

  public override setGraph(graph: TpGraphDocument): void {
    validateDfaGraph(graph);
    super.setGraph(graph);
    this.syncRuntimeFromGraph();
  }

  public override addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode {
    if (type !== TP_DFA_STATE && type !== TP_GRAPH_COMMENT) throw new TypeError(`Unsupported DFA node type: ${type}`);
    return super.addNode(type, point, label);
  }

  public override addEdge(
    source: string,
    target: string,
    type = TP_DFA_TRANSITION,
    sourcePort?: TpGraphPort,
    targetPort?: TpGraphPort,
    direction: TpGraphEdgeDirection = 'forward',
  ): TpGraphEdge {
    if (direction !== 'forward') throw new TypeError('DFA transitions must be forward.');
    return super.addEdge(source, target, type, sourcePort, targetPort, direction);
  }

  protected override edgeDirections(): readonly TpGraphEdgeDirection[] { return ['forward']; }

  protected override validateConnection(source: string, target: string, type: string): void {
    super.validateConnection(source, target, type);
    const graph = this.value;
    if (graph.nodes.find((node) => node.id === source)?.type !== TP_DFA_STATE
      || graph.nodes.find((node) => node.id === target)?.type !== TP_DFA_STATE) {
      throw new TypeError('A DFA transition must connect two states.');
    }
    if (type !== TP_DFA_TRANSITION) throw new TypeError(`Unsupported DFA edge type: ${type}`);
  }

  public get word(): string { return this.inputWord; }
  public set word(value: string) { this.reset(value); }
  public get position(): number { return this.inputPosition; }
  public get currentState(): string | null { return this.activeStateId; }
  public get alphabet(): string[] { return dfaAlphabet(this.value); }
  public get accepted(): boolean {
    if (this.rejected || this.inputPosition !== this.inputWord.length || this.activeStateId === null) return false;
    return this.value.nodes.find((node) => node.id === this.activeStateId)?.data?.accepting === true;
  }

  public reset(word = this.inputWord): void {
    this.inputWord = word;
    this.inputPosition = 0;
    this.rejected = false;
    this.invalidSymbol = null;
    const graph = this.value;
    this.activeStateId = graph.nodes.find((node) => node.type === TP_DFA_STATE && node.data?.initial === true)?.id ?? null;
    for (const node of graph.nodes) node.state = { ...(node.state ?? {}), active: node.id === this.activeStateId };
    for (const edge of graph.edges) edge.state = { ...(edge.state ?? {}), active: false };
    super.setGraph(graph);
    this.dispatchEvent(new CustomEvent('tp-dfa-reset', {
      bubbles: true, detail: { word: this.inputWord, stateId: this.activeStateId, graph: this.value },
    }));
  }

  public async readNext(duration = 300): Promise<boolean> {
    if (this.rejected || this.activeStateId === null || this.inputPosition >= this.inputWord.length) return false;
    const symbol = this.inputWord[this.inputPosition];
    if (symbol === undefined) return false;
    if (!this.alphabet.includes(symbol)) this.invalidSymbol = symbol;
    const result = createDfaStep(this.value, this.activeStateId, symbol, duration);
    this.inputPosition += 1;
    this.activeStateId = result.stateId;
    this.rejected = result.stateId === null;
    await this.animateTransition(result.transition);
    this.dispatchEvent(new CustomEvent('tp-dfa-step', {
      bubbles: true,
      detail: {
        symbol, position: this.inputPosition, stateId: this.activeStateId,
        accepted: this.accepted, rejected: this.rejected, graph: this.value,
      },
    }));
    return true;
  }

  public async run(duration = 600): Promise<boolean> {
    if (this.running) return this.accepted;
    this.running = true;
    super.setGraph(this.value);
    try {
      while (this.inputPosition < this.inputWord.length && !this.rejected) await this.readNext(duration);
      return this.accepted;
    } finally {
      this.running = false;
      super.setGraph(this.value);
    }
  }

  protected override renderResults(): string {
    const graph = this.value;
    const states = graph.nodes.filter((node) => node.type === TP_DFA_STATE);
    if (states.length === 0) return '';
    const alphabet = dfaAlphabet(graph);
    const headers = alphabet.map((symbol) => `<th scope="col">${escapeXml(symbol)}</th>`).join('');
    const rows = states.map((state) => {
      const marker = `${state.data?.initial === true ? '→' : ''}${state.data?.accepting === true ? '*' : ''}`;
      const cells = alphabet.map((symbol) => {
        const edge = graph.edges.find((candidate) => candidate.source === state.id
          && transitionSymbols(candidate).includes(symbol));
        const target = graph.nodes.find((node) => node.id === edge?.target);
        return `<td>${target ? escapeXml(target.label ?? target.id) : '—'}</td>`;
      }).join('');
      return `<tr><th scope="row">${marker}${escapeXml(state.label ?? state.id)}</th>${cells}</tr>`;
    }).join('');
    return `<h3 class="tp-graph-results-header">Transition table</h3><div class="tp-graph-results-content"><table><thead><tr><th scope="col">State</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  protected override renderToolbarActions(): string {
    const status = this.invalidSymbol !== null ? `Invalid symbol: ${escapeXml(this.invalidSymbol)}`
      : this.rejected ? 'Rejected'
        : this.inputPosition === this.inputWord.length ? (this.accepted ? 'Accepted' : 'Not accepted')
          : `${this.inputPosition}/${this.inputWord.length}`;
    const statusColor = this.invalidSymbol !== null || this.rejected
      || (this.inputPosition === this.inputWord.length && !this.accepted)
      ? ' danger'
      : this.accepted ? ' success' : '';
    const cannotRead = this.running || this.rejected || this.inputPosition >= this.inputWord.length;
    return `<tp-icon-button name="refresh" label="Reset word" data-dfa-action="reset"></tp-icon-button>
      <label class="tp-dfa-word-label">Word <input type="text" value="${escapeXml(this.inputWord)}" data-dfa-word aria-label="Input word" ${this.running ? 'disabled' : ''}/></label>
      <tp-icon-button name="play" label="Read next symbol" data-dfa-action="step" ${cannotRead ? 'disabled' : ''}></tp-icon-button>
      <tp-icon-button name="playlist-play" label="Run word" data-dfa-action="run" ${cannotRead ? 'disabled' : ''}></tp-icon-button>
      <span class="tp-dfa-status${statusColor}" aria-live="polite">${status}</span>`;
  }

  protected override bindExtensionEvents(): void {
    this.querySelector<HTMLInputElement>('[data-dfa-word]')?.addEventListener('change', (event) => {
      this.reset((event.currentTarget as HTMLInputElement).value);
    });
    this.querySelector('[data-dfa-action="step"]')?.addEventListener('click', () => { void this.readNext(); });
    this.querySelector('[data-dfa-action="run"]')?.addEventListener('click', () => { void this.run(); });
    this.querySelector('[data-dfa-action="reset"]')?.addEventListener('click', () => this.reset());
  }

  private syncRuntimeFromGraph(): void {
    const active = this.value.nodes.find((node) => node.type === TP_DFA_STATE && node.state?.active === true);
    this.activeStateId = active?.id
      ?? this.value.nodes.find((node) => node.type === TP_DFA_STATE && node.data?.initial === true)?.id
      ?? null;
  }
}

if (!customElements.get('tp-graph-dfa')) customElements.define('tp-graph-dfa', TpGraphDfa);
