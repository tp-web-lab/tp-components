/**
 * @module components/graph-nfa
 * @summary Interactive nondeterministic finite automaton generated from a regular expression.
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
import style from './graph-nfa.css?inline';

export const TP_NFA_STATE = 'nfa-state';
export const TP_NFA_TRANSITION = 'nfa-transition';
export const TP_NFA_EPSILON = 'ε';

type RegexNode =
  | { kind: 'symbol'; value: string }
  | { kind: 'epsilon' }
  | { kind: 'concat'; left: RegexNode; right: RegexNode }
  | { kind: 'alternate'; left: RegexNode; right: RegexNode }
  | { kind: 'star'; child: RegexNode }
  | { kind: 'plus'; child: RegexNode }
  | { kind: 'optional'; child: RegexNode };

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

class RegexParser {
  private position = 0;
  public constructor(private readonly source: string) {}

  public parse(): RegexNode {
    const result = this.alternation();
    if (this.position !== this.source.length) throw new TypeError(`Unexpected "${this.source[this.position]}" at ${this.position}.`);
    return result;
  }

  private alternation(): RegexNode {
    let node = this.concatenation();
    while (this.peek() === '|') {
      this.position += 1;
      node = { kind: 'alternate', left: node, right: this.concatenation() };
    }
    return node;
  }

  private concatenation(): RegexNode {
    const nodes: RegexNode[] = [];
    while (this.position < this.source.length && this.peek() !== ')' && this.peek() !== '|') nodes.push(this.repetition());
    if (nodes.length === 0) return { kind: 'epsilon' };
    return nodes.slice(1).reduce<RegexNode>((left, right) => ({ kind: 'concat', left, right }), nodes[0] as RegexNode);
  }

  private repetition(): RegexNode {
    let node = this.atom();
    while (this.peek() === '*' || this.peek() === '+' || this.peek() === '?') {
      const operator = this.peek();
      this.position += 1;
      node = operator === '*' ? { kind: 'star', child: node }
        : operator === '+' ? { kind: 'plus', child: node }
          : { kind: 'optional', child: node };
    }
    return node;
  }

  private atom(): RegexNode {
    const character = this.peek();
    if (character === undefined) return { kind: 'epsilon' };
    if (character === '(') {
      this.position += 1;
      const node = this.alternation();
      if (this.peek() !== ')') throw new TypeError(`Missing closing parenthesis at ${this.position}.`);
      this.position += 1;
      return node;
    }
    if (character === '\\') {
      this.position += 1;
      const escaped = this.peek();
      if (escaped === undefined) throw new TypeError('A regular expression cannot end with an escape character.');
      this.position += 1;
      return { kind: 'symbol', value: escaped };
    }
    if ('|)*+?'.includes(character)) throw new TypeError(`Unexpected "${character}" at ${this.position}.`);
    this.position += 1;
    return { kind: 'symbol', value: character };
  }

  private peek(): string | undefined { return this.source[this.position]; }
}

interface ThompsonFragment { start: number; end: number }

export function regexToNfa(source: string): TpGraphDocument {
  const ast = new RegexParser(source).parse();
  let stateCounter = 0;
  let edgeCounter = 0;
  const edges: TpGraphEdge[] = [];
  const state = (): number => stateCounter++;
  const edge = (from: number, to: number, label: string): void => {
    edgeCounter += 1;
    edges.push({
      id: `transition-${edgeCounter}`, type: TP_NFA_TRANSITION,
      source: `q${from}`, target: `q${to}`, label, direction: 'forward',
    });
  };
  const compile = (node: RegexNode): ThompsonFragment => {
    if (node.kind === 'symbol' || node.kind === 'epsilon') {
      const start = state();
      const end = state();
      edge(start, end, node.kind === 'epsilon' ? TP_NFA_EPSILON : node.value);
      return { start, end };
    }
    if (node.kind === 'concat') {
      const left = compile(node.left);
      const right = compile(node.right);
      edge(left.end, right.start, TP_NFA_EPSILON);
      return { start: left.start, end: right.end };
    }
    if (node.kind === 'alternate') {
      const start = state();
      const left = compile(node.left);
      const right = compile(node.right);
      const end = state();
      edge(start, left.start, TP_NFA_EPSILON);
      edge(start, right.start, TP_NFA_EPSILON);
      edge(left.end, end, TP_NFA_EPSILON);
      edge(right.end, end, TP_NFA_EPSILON);
      return { start, end };
    }
    if (node.kind === 'star' || node.kind === 'optional') {
      const start = state();
      const child = compile(node.child);
      const end = state();
      edge(start, child.start, TP_NFA_EPSILON);
      edge(start, end, TP_NFA_EPSILON);
      edge(child.end, end, TP_NFA_EPSILON);
      if (node.kind === 'star') edge(child.end, child.start, TP_NFA_EPSILON);
      return { start, end };
    }
    const child = compile(node.child);
    edge(child.end, child.start, TP_NFA_EPSILON);
    return child;
  };
  const fragment = compile(ast);
  const nodes: TpGraphNode[] = Array.from({ length: stateCounter }, (_, index) => ({
    id: `q${index}`, type: TP_NFA_STATE,
    x: 100 + index % 6 * 135, y: 120 + Math.floor(index / 6) * 150,
    label: `q${index}`,
    data: { initial: index === fragment.start, accepting: index === fragment.end },
  }));
  return { version: 1, title: `NFA for ${source}`, nodes, edges, data: { regex: source } };
}

export function validateNfaGraph(graph: Readonly<TpGraphDocument>): void {
  const states = new Set(graph.nodes.filter((node) => node.type === TP_NFA_STATE).map((node) => node.id));
  for (const node of graph.nodes) {
    if (node.type !== TP_NFA_STATE && node.type !== TP_GRAPH_COMMENT) throw new TypeError(`Unsupported NFA node type: ${node.type}`);
  }
  for (const edge of graph.edges) {
    if (edge.source !== undefined && edge.target !== undefined && (!states.has(edge.source) || !states.has(edge.target))) {
      throw new TypeError(`Transition "${edge.id}" must connect two NFA states.`);
    }
    if (edge.type !== undefined && edge.type !== TP_NFA_TRANSITION) throw new TypeError(`Unsupported NFA edge type: ${edge.type}`);
    if (edge.direction !== undefined && edge.direction !== 'forward') throw new TypeError('NFA transitions must be forward.');
  }
}

function epsilonClosure(graph: Readonly<TpGraphDocument>, input: Iterable<string>): Set<string> {
  const closure = new Set(input);
  const pending = [...closure];
  while (pending.length > 0) {
    const stateId = pending.pop();
    for (const edge of graph.edges) {
      if (edge.source !== stateId || edge.target === undefined || edge.label !== TP_NFA_EPSILON || closure.has(edge.target)) continue;
      closure.add(edge.target);
      pending.push(edge.target);
    }
  }
  return closure;
}

export function createNfaStep(
  graph: Readonly<TpGraphDocument>, activeStates: Iterable<string>, symbol: string, duration = 500,
): { activeStates: string[]; transition: TpGraphTransition } {
  validateNfaGraph(graph);
  const current = epsilonClosure(graph, activeStates);
  const traversed = graph.edges.filter((edge) => edge.source !== undefined && current.has(edge.source)
    && edge.target !== undefined && edge.label === symbol);
  const next = epsilonClosure(graph, traversed.flatMap((edge) => edge.target ? [edge.target] : []));
  const nodes: NonNullable<TpGraphTransition['nodes']> = {};
  for (const node of graph.nodes) nodes[node.id] = { state: { ...(node.state ?? {}), active: next.has(node.id) } };
  const edges: NonNullable<TpGraphTransition['edges']> = {};
  for (const edge of graph.edges) edges[edge.id] = { state: { ...(edge.state ?? {}), active: traversed.includes(edge) } };
  return { activeStates: [...next], transition: { nodes, edges, duration } };
}

/**
 * @summary Edits, generates, and simulates nondeterministic finite automata.
 * @tagname tp-graph-nfa
 * @example
 * <tp-graph-nfa></tp-graph-nfa>
 */
export class TpGraphNfa extends TpGraphEditor {
  private static readonly nfaStyleId = 'tp-graph-nfa-styles';
  private regexSource = 'ab(a|b)*';
  private inputWord = '';
  private inputPosition = 0;
  private activeStateIds = new Set<string>();
  private running = false;

  public constructor() {
    super();
    this.unregisterPalette('generic');
    this.registerPalette({
      id: 'nfa', label: 'Automaton',
      shapes: [{
        type: TP_NFA_STATE, label: 'State', description: 'NFA state', width: 64, height: 64,
        render: (node, selected) => `<circle r="31" class="tp-graph-shape tp-nfa-state${selected ? ' is-selected' : ''}${node.state?.active === true ? ' is-active' : ''}" />
          ${node.data?.accepting === true ? '<circle r="25" class="tp-nfa-accepting" />' : ''}
          ${node.data?.initial === true ? '<path class="tp-nfa-initial-arrow" d="M -52 0 L -34 0 M -40 -6 L -34 0 L -40 6" />' : ''}
          <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${escapeXml(node.label ?? 'State')}</text>`,
      }],
    });
    super.setGraph(regexToNfa(this.regexSource));
    this.reset();
  }

  protected override connectedCallback(): void { super.connectedCallback(); this.ensureGlobalStyle(TpGraphNfa.nfaStyleId, style); }
  public override setGraph(graph: TpGraphDocument): void {
    validateNfaGraph(graph);
    super.setGraph(graph);
    if (typeof graph.data?.regex === 'string') this.regexSource = graph.data.regex;
  }
  public override addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode {
    if (type !== TP_NFA_STATE && type !== TP_GRAPH_COMMENT) throw new TypeError(`Unsupported NFA node type: ${type}`);
    return super.addNode(type, point, label);
  }
  public override addEdge(
    source: string, target: string, type = TP_NFA_TRANSITION,
    sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = 'forward',
  ): TpGraphEdge {
    if (direction !== 'forward') throw new TypeError('NFA transitions must be forward.');
    return super.addEdge(source, target, type, sourcePort, targetPort, direction);
  }
  protected override edgeDirections(): readonly TpGraphEdgeDirection[] { return ['forward']; }
  protected override validateConnection(source: string, target: string, type: string): void {
    super.validateConnection(source, target, type);
    const graph = this.value;
    if (graph.nodes.find((node) => node.id === source)?.type !== TP_NFA_STATE
      || graph.nodes.find((node) => node.id === target)?.type !== TP_NFA_STATE) throw new TypeError('An NFA transition must connect two states.');
    if (type !== TP_NFA_TRANSITION) throw new TypeError(`Unsupported NFA edge type: ${type}`);
  }

  public get regex(): string { return this.regexSource; }
  public get word(): string { return this.inputWord; }
  public get activeStates(): string[] { return [...this.activeStateIds]; }
  public get accepted(): boolean {
    return this.inputPosition === this.inputWord.length
      && this.value.nodes.some((node) => this.activeStateIds.has(node.id) && node.data?.accepting === true);
  }
  public generate(source = this.regexSource): void { this.regexSource = source; this.setGraph(regexToNfa(source)); this.reset(this.inputWord); }
  public reset(word = this.inputWord): void {
    this.inputWord = word;
    this.inputPosition = 0;
    const graph = this.value;
    const initial = graph.nodes.filter((node) => node.data?.initial === true).map((node) => node.id);
    this.activeStateIds = epsilonClosure(graph, initial);
    for (const node of graph.nodes) node.state = { ...(node.state ?? {}), active: this.activeStateIds.has(node.id) };
    for (const edge of graph.edges) edge.state = { ...(edge.state ?? {}), active: false };
    super.setGraph(graph);
  }
  public async readNext(duration = 500): Promise<boolean> {
    const symbol = this.inputWord[this.inputPosition];
    if (symbol === undefined || this.activeStateIds.size === 0) return false;
    const result = createNfaStep(this.value, this.activeStateIds, symbol, duration);
    this.inputPosition += 1;
    this.activeStateIds = new Set(result.activeStates);
    await this.animateTransition(result.transition);
    return true;
  }
  public async run(duration = 650): Promise<boolean> {
    if (this.running) return this.accepted;
    this.running = true;
    super.setGraph(this.value);
    try {
      while (this.inputPosition < this.inputWord.length && this.activeStateIds.size > 0) await this.readNext(duration);
      return this.accepted;
    } finally { this.running = false; super.setGraph(this.value); }
  }

  protected override renderResults(): string {
    const graph = this.value;
    const states = graph.nodes.filter((node) => node.type === TP_NFA_STATE);
    if (states.length === 0) return '';
    const symbols = [...new Set(graph.edges
      .flatMap((edge) => (edge.label ?? '').split(/[\s,]+/u).filter(Boolean)))].sort((first, second) => {
      if (first === TP_NFA_EPSILON) return -1;
      if (second === TP_NFA_EPSILON) return 1;
      return first.localeCompare(second);
    });
    const headers = symbols.map((symbol) => `<th scope="col">${escapeXml(symbol)}</th>`).join('');
    const rows = states.map((state) => {
      const marker = `${state.data?.initial === true ? '→' : ''}${state.data?.accepting === true ? '*' : ''}`;
      const cells = symbols.map((symbol) => {
        const targets = graph.edges.filter((edge) => edge.source === state.id
          && (edge.label ?? '').split(/[\s,]+/u).includes(symbol))
          .flatMap((edge) => edge.target ? [edge.target] : [])
          .map((id) => graph.nodes.find((node) => node.id === id))
          .filter((node): node is TpGraphNode => node !== undefined)
          .map((node) => node.label ?? node.id);
        return `<td>${targets.length > 0 ? `{${targets.map(escapeXml).join(', ')}}` : '∅'}</td>`;
      }).join('');
      return `<tr><th scope="row">${marker}${escapeXml(state.label ?? state.id)}</th>${cells}</tr>`;
    }).join('');
    return `<h3 class="tp-graph-results-header">Transition table</h3><div class="tp-graph-results-content"><table><thead><tr><th scope="col">State</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  protected override renderToolbarActions(): string {
    const done = this.inputPosition === this.inputWord.length || this.activeStateIds.size === 0;
    const status = done ? (this.accepted ? 'Accepted' : 'Rejected') : `${this.inputPosition}/${this.inputWord.length}`;
    return `<tp-icon-button name="refresh" label="Generate NFA" data-nfa-action="generate" ${this.running ? 'disabled' : ''}></tp-icon-button>
      <label class="tp-nfa-field">Regex <input value="${escapeXml(this.regexSource)}" data-nfa-regex aria-label="Regular expression" ${this.running ? 'disabled' : ''}/></label>
      <tp-icon-button name="refresh" label="Reset word" data-nfa-action="reset"></tp-icon-button>
      <label class="tp-nfa-field">Word <input value="${escapeXml(this.inputWord)}" data-nfa-word aria-label="Input word" ${this.running ? 'disabled' : ''}/></label>
      <tp-icon-button name="play" label="Read next character" data-nfa-action="step" ${done || this.running ? 'disabled' : ''}></tp-icon-button>
      <tp-icon-button name="playlist-play" label="Run word" data-nfa-action="run" ${done || this.running ? 'disabled' : ''}></tp-icon-button>
      <span class="tp-nfa-status${done ? (this.accepted ? ' success' : ' danger') : ''}">${status}</span>`;
  }
  protected override bindExtensionEvents(): void {
    this.querySelector<HTMLInputElement>('[data-nfa-regex]')?.addEventListener('change', (event) => {
      this.regexSource = (event.currentTarget as HTMLInputElement).value;
    });
    this.querySelector<HTMLInputElement>('[data-nfa-word]')?.addEventListener('change', (event) => this.reset((event.currentTarget as HTMLInputElement).value));
    this.querySelector('[data-nfa-action="generate"]')?.addEventListener('click', () => this.generate());
    this.querySelector('[data-nfa-action="step"]')?.addEventListener('click', () => { void this.readNext(); });
    this.querySelector('[data-nfa-action="run"]')?.addEventListener('click', () => { void this.run(); });
    this.querySelector('[data-nfa-action="reset"]')?.addEventListener('click', () => this.reset());
  }
}

if (!customElements.get('tp-graph-nfa')) customElements.define('tp-graph-nfa', TpGraphNfa);
