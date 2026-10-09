/**
 * @module components/graph-query-tree
 * @summary Relational query-tree editor with equivalent SQL generation.
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
} from '../graph-editor/graph-editor.js';
import style from './graph-query-tree.css?inline';

export const TP_QUERY_RELATION = 'query-relation';
export const TP_QUERY_SELECTION = 'query-selection';
export const TP_QUERY_PROJECTION = 'query-projection';
export const TP_QUERY_RENAME = 'query-rename';
export const TP_QUERY_AGGREGATION = 'query-aggregation';
export const TP_QUERY_SORT = 'query-sort';
export const TP_QUERY_JOIN = 'query-join';
export const TP_QUERY_PRODUCT = 'query-product';
export const TP_QUERY_UNION = 'query-union';
export const TP_QUERY_INTERSECTION = 'query-intersection';
export const TP_QUERY_DIFFERENCE = 'query-difference';
export const TP_QUERY_EDGE = 'query-edge';

const QUERY_TYPES = [TP_QUERY_RELATION, TP_QUERY_SELECTION, TP_QUERY_PROJECTION, TP_QUERY_RENAME, TP_QUERY_AGGREGATION, TP_QUERY_SORT, TP_QUERY_JOIN, TP_QUERY_PRODUCT, TP_QUERY_UNION, TP_QUERY_INTERSECTION, TP_QUERY_DIFFERENCE] as const;
const UNARY_TYPES = [TP_QUERY_SELECTION, TP_QUERY_PROJECTION, TP_QUERY_RENAME, TP_QUERY_AGGREGATION, TP_QUERY_SORT] as const;

function escapeXml(value: string): string { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
function stringData(node: Readonly<TpGraphNode>, key: string, fallback = ''): string { const value = node.data?.[key]; return typeof value === 'string' ? value : fallback; }
function arity(type: string): 0 | 1 | 2 { if (type === TP_QUERY_RELATION) return 0; if ((UNARY_TYPES as readonly string[]).includes(type)) return 1; return 2; }
function queryNodes(graph: Readonly<TpGraphDocument>): TpGraphNode[] { return graph.nodes.filter((node) => node.type !== TP_GRAPH_COMMENT); }

export function validateQueryTree(graph: Readonly<TpGraphDocument>): void {
  const nodes = new Map(queryNodes(graph).map((node) => [node.id, node]));
  for (const node of nodes.values()) if (!(QUERY_TYPES as readonly string[]).includes(node.type)) throw new TypeError(`Unsupported query-tree node type: ${node.type}`);
  const incoming = new Map<string, number>(); const outgoing = new Map<string, number>();
  for (const edge of graph.edges) {
    if (!edge.source || !edge.target || !nodes.has(edge.source) || !nodes.has(edge.target)) throw new TypeError(`Query edge "${edge.id}" must connect two query nodes.`);
    if (edge.source === edge.target) throw new TypeError('Query-tree self-links are not allowed.');
    if (edge.type !== undefined && edge.type !== TP_QUERY_EDGE) throw new TypeError(`Unsupported query-tree edge type: ${edge.type}`);
    if (edge.direction !== undefined && edge.direction !== 'forward') throw new TypeError('Query-tree edges must point from operands to operators.');
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1); outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + 1);
  }
  for (const node of nodes.values()) {
    if ((incoming.get(node.id) ?? 0) > arity(node.type)) throw new TypeError(`Operator "${node.label ?? node.id}" has too many operands.`);
    if ((outgoing.get(node.id) ?? 0) > 1) throw new TypeError(`Node "${node.label ?? node.id}" cannot feed several parents in a tree.`);
  }
  const visiting = new Set<string>(); const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visiting.has(id)) throw new TypeError('The query tree contains a cycle.');
    if (visited.has(id)) return;
    visiting.add(id);
    for (const edge of graph.edges.filter((candidate) => candidate.source === id && candidate.target)) visit(edge.target as string);
    visiting.delete(id); visited.add(id);
  };
  for (const id of nodes.keys()) visit(id);
}

function indent(sql: string): string { return sql.split('\n').map((line) => `  ${line}`).join('\n'); }
function childEdges(graph: Readonly<TpGraphDocument>, node: Readonly<TpGraphNode>): TpGraphEdge[] {
  const byId = new Map(graph.nodes.map((candidate) => [candidate.id, candidate]));
  return graph.edges.filter((edge) => edge.target === node.id && edge.source).sort((left, right) => (byId.get(left.source as string)?.x ?? 0) - (byId.get(right.source as string)?.x ?? 0));
}

export function queryTreeToSql(graph: Readonly<TpGraphDocument>): string {
  validateQueryTree(graph);
  const nodes = new Map(queryNodes(graph).map((node) => [node.id, node]));
  if (nodes.size === 0) throw new TypeError('Add a relation to generate SQL.');
  const parentIds = new Set(graph.edges.map((edge) => edge.source).filter((id): id is string => id !== undefined));
  const roots = [...nodes.values()].filter((node) => !parentIds.has(node.id));
  if (roots.length !== 1) throw new TypeError('A query tree must have exactly one root operator.');
  const compile = (node: Readonly<TpGraphNode>): string => {
    const edges = childEdges(graph, node); const expected = arity(node.type);
    if (edges.length !== expected) throw new TypeError(`Operator "${node.label ?? node.id}" expects ${expected} operand${expected === 1 ? '' : 's'}.`);
    const children = edges.map((edge) => nodes.get(edge.source as string)).filter((child): child is TpGraphNode => child !== undefined);
    if (node.type === TP_QUERY_RELATION) {
      const table = stringData(node, 'table', node.label ?? 'table').trim(); const alias = stringData(node, 'alias').trim();
      if (table === '') throw new TypeError(`Relation "${node.id}" needs a table name.`);
      return `SELECT *\nFROM ${table}${alias === '' ? '' : ` AS ${alias}`}`;
    }
    const nested = (child: Readonly<TpGraphNode>, alias: string): string => `(\n${indent(compile(child))}\n) AS ${alias}`;
    if (node.type === TP_QUERY_SELECTION) return `SELECT *\nFROM ${nested(children[0] as TpGraphNode, 'q')}\nWHERE ${stringData(node, 'condition', 'TRUE')}`;
    if (node.type === TP_QUERY_PROJECTION) return `SELECT ${stringData(node, 'columns', '*')}\nFROM ${nested(children[0] as TpGraphNode, 'q')}`;
    if (node.type === TP_QUERY_RENAME) return `SELECT *\nFROM ${nested(children[0] as TpGraphNode, stringData(node, 'alias', 'q'))}`;
    if (node.type === TP_QUERY_SORT) return `SELECT *\nFROM ${nested(children[0] as TpGraphNode, 'q')}\nORDER BY ${stringData(node, 'orderBy', '1')}`;
    if (node.type === TP_QUERY_AGGREGATION) {
      const groups = stringData(node, 'groupBy').trim(); const expressions = stringData(node, 'expressions', 'COUNT(*)');
      return `SELECT ${groups === '' ? expressions : `${groups}, ${expressions}`}\nFROM ${nested(children[0] as TpGraphNode, 'q')}${groups === '' ? '' : `\nGROUP BY ${groups}`}`;
    }
    const left = compile(children[0] as TpGraphNode); const right = compile(children[1] as TpGraphNode);
    if (node.type === TP_QUERY_JOIN) return `SELECT *\nFROM (\n${indent(left)}\n) AS l\n${stringData(node, 'joinType', 'INNER').toUpperCase()} JOIN (\n${indent(right)}\n) AS r\nON ${stringData(node, 'condition', 'TRUE')}`;
    if (node.type === TP_QUERY_PRODUCT) return `SELECT *\nFROM (\n${indent(left)}\n) AS l\nCROSS JOIN (\n${indent(right)}\n) AS r`;
    const operator = node.type === TP_QUERY_UNION ? 'UNION' : node.type === TP_QUERY_INTERSECTION ? 'INTERSECT' : 'EXCEPT';
    return `(\n${indent(left)}\n)\n${operator}\n(\n${indent(right)}\n)`;
  };
  return `${compile(roots[0] as TpGraphNode)};`;
}

function relationShape(node: Readonly<TpGraphNode>, selected: boolean): string {
  const table = stringData(node, 'table', node.label ?? 'Relation'); const alias = stringData(node, 'alias');
  return `<rect x="-58" y="-26" width="116" height="52" rx="4" class="tp-graph-shape tp-query-relation${selected ? ' is-selected' : ''}"/><text class="tp-query-symbol" text-anchor="middle" y="-3">${escapeXml(table)}</text>${alias === '' ? '' : `<text class="tp-query-detail" text-anchor="middle" y="16">AS ${escapeXml(alias)}</text>`}`;
}
function operatorShape(symbol: string, detailKey?: string, fallback = ''): (node: Readonly<TpGraphNode>, selected: boolean) => string {
  return (node, selected) => `<rect x="-60" y="-30" width="120" height="60" rx="26" class="tp-graph-shape tp-query-operator${selected ? ' is-selected' : ''}"/><text class="tp-query-symbol" text-anchor="middle" y="-5">${symbol}</text>${detailKey ? `<text class="tp-query-detail" text-anchor="middle" y="16">${escapeXml(stringData(node, detailKey, fallback))}</text>` : ''}`;
}

/**
 * Relational query-tree specialization of `<tp-graph-editor>`.
 * @summary Edits relational algebra trees and generates equivalent SQL.
 * @tagname tp-graph-query-tree
 * @example
 * <tp-graph-query-tree></tp-graph-query-tree>
 */
export class TpGraphQueryTree extends TpGraphEditor {
  private static readonly queryStyleId = 'tp-graph-query-tree-styles';
  private selectedQueryId: string | null = null;
  public constructor() {
    super(); this.unregisterPalette('generic'); this.activeEdgeDirection = 'forward';
    const unaryPorts = { north: { x: 0, y: -30 }, south: { x: 0, y: 30 } } as const;
    const binaryPorts = { north: { x: 0, y: -30 }, west: { x: -60, y: 0 }, east: { x: 60, y: 0 } } as const;
    this.registerPalette({ id: 'query-relations', label: 'Relations', shapes: [{ type: TP_QUERY_RELATION, label: 'Relation', description: 'Base table or view', width: 116, height: 52, ports: { north: { x: 0, y: -26 } }, createData: () => ({ table: 'table', alias: '' }), render: relationShape }] });
    this.registerPalette({ id: 'query-unary', label: 'Unary operators', shapes: [
      { type: TP_QUERY_SELECTION, label: 'Selection', description: 'Filter rows', width: 120, height: 60, ports: unaryPorts, createData: () => ({ condition: 'condition' }), render: operatorShape('σ', 'condition', 'condition') },
      { type: TP_QUERY_PROJECTION, label: 'Projection', description: 'Choose columns', width: 120, height: 60, ports: unaryPorts, createData: () => ({ columns: '*' }), render: operatorShape('π', 'columns', '*') },
      { type: TP_QUERY_RENAME, label: 'Rename', description: 'Rename a relation', width: 120, height: 60, ports: unaryPorts, createData: () => ({ alias: 'q' }), render: operatorShape('ρ', 'alias', 'q') },
      { type: TP_QUERY_AGGREGATION, label: 'Aggregation', description: 'Group and aggregate', width: 120, height: 60, ports: unaryPorts, createData: () => ({ groupBy: '', expressions: 'COUNT(*)' }), render: operatorShape('γ', 'expressions', 'COUNT(*)') },
      { type: TP_QUERY_SORT, label: 'Sort', description: 'Order rows', width: 120, height: 60, ports: unaryPorts, createData: () => ({ orderBy: 'column' }), render: operatorShape('τ', 'orderBy', 'column') },
    ] });
    this.registerPalette({ id: 'query-binary', label: 'Binary operators', shapes: [
      { type: TP_QUERY_JOIN, label: 'Join', description: 'Conditional join', width: 120, height: 60, ports: binaryPorts, createData: () => ({ condition: 'l.id = r.id', joinType: 'inner' }), render: operatorShape('⋈', 'condition', 'condition') },
      { type: TP_QUERY_PRODUCT, label: 'Product', description: 'Cartesian product', width: 120, height: 60, ports: binaryPorts, render: operatorShape('×') },
      { type: TP_QUERY_UNION, label: 'Union', description: 'Set union', width: 120, height: 60, ports: binaryPorts, render: operatorShape('∪') },
      { type: TP_QUERY_INTERSECTION, label: 'Intersection', description: 'Set intersection', width: 120, height: 60, ports: binaryPorts, render: operatorShape('∩') },
      { type: TP_QUERY_DIFFERENCE, label: 'Difference', description: 'Set difference', width: 120, height: 60, ports: binaryPorts, render: operatorShape('−') },
    ] });
    this.addEventListener('tp-graph-selection-change', (event) => { this.selectedQueryId = (event as CustomEvent<{ id: string | null }>).detail.id; this.updateQueryControls(); });
  }
  protected override connectedCallback(): void { super.connectedCallback(); this.ensureGlobalStyle(TpGraphQueryTree.queryStyleId, style); }
  public override setGraph(graph: TpGraphDocument): void { const selected = this.selectedQueryId; validateQueryTree(graph); super.setGraph(graph); if (selected && graph.nodes.some((node) => node.id === selected)) this.selectMany([selected]); }
  public override addNode(type: string, point: TpGraphPoint, nodeLabel?: string): TpGraphNode { if (type !== TP_GRAPH_COMMENT && !(QUERY_TYPES as readonly string[]).includes(type)) throw new TypeError(`Unsupported query-tree node type: ${type}`); return super.addNode(type, point, nodeLabel); }
  public override addEdge(source: string, target: string, type = TP_QUERY_EDGE, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = 'forward'): TpGraphEdge { if (direction !== 'forward') throw new TypeError('Query-tree edges must be forward.'); return super.addEdge(source, target, type, sourcePort, targetPort, direction); }
  public toSql(): string { return queryTreeToSql(this.value); }
  protected override edgeDirections(): readonly TpGraphEdgeDirection[] { return ['forward']; }
  protected override validateConnection(source: string, target: string, type: string): void {
    super.validateConnection(source, target, type); const graph = this.value; const sourceNode = graph.nodes.find((node) => node.id === source); const targetNode = graph.nodes.find((node) => node.id === target);
    if (!sourceNode || !targetNode || sourceNode.type === TP_GRAPH_COMMENT || targetNode.type === TP_GRAPH_COMMENT) throw new TypeError('Query edges must connect query nodes.');
    if (type !== TP_QUERY_EDGE && type !== 'edge') throw new TypeError(`Unsupported query-tree edge type: ${type}`);
    if (targetNode.type === TP_QUERY_RELATION) throw new TypeError('A relation cannot receive an operand.');
    if (graph.edges.some((edge) => edge.source === source)) throw new TypeError('A query-tree node can have only one parent.');
    if (graph.edges.filter((edge) => edge.target === target).length >= arity(targetNode.type)) throw new TypeError('This operator already has all its operands.');
  }
  protected override renderToolbarActions(): string { return `<label class="tp-query-parameter" hidden>Table <input type="text" data-query-table disabled></label><label class="tp-query-parameter" hidden>Alias <input type="text" data-query-alias disabled></label><label class="tp-query-parameter tp-query-expression" hidden>Expression <input type="text" data-query-expression disabled></label><label class="tp-query-parameter" hidden>Group by <input type="text" data-query-group disabled></label><label class="tp-query-parameter" hidden>Join <select data-query-join disabled><option value="inner">Inner</option><option value="left">Left</option><option value="right">Right</option><option value="full">Full</option></select></label>`; }
  protected override bindExtensionEvents(): void {
    this.querySelector<HTMLInputElement>('[data-query-table]')?.addEventListener('change', (event) => this.updateSelectedData('table', (event.currentTarget as HTMLInputElement).value));
    this.querySelector<HTMLInputElement>('[data-query-alias]')?.addEventListener('change', (event) => this.updateSelectedData('alias', (event.currentTarget as HTMLInputElement).value));
    this.querySelector<HTMLInputElement>('[data-query-expression]')?.addEventListener('change', (event) => { const node = this.selectedNode(); if (node) this.updateSelectedData(this.expressionKey(node.type), (event.currentTarget as HTMLInputElement).value); });
    this.querySelector<HTMLInputElement>('[data-query-group]')?.addEventListener('change', (event) => this.updateSelectedData('groupBy', (event.currentTarget as HTMLInputElement).value));
    this.querySelector<HTMLSelectElement>('[data-query-join]')?.addEventListener('change', (event) => this.updateSelectedData('joinType', (event.currentTarget as HTMLSelectElement).value));
    this.updateQueryControls();
  }
  protected override renderResults(): string { try { return `<h3 class="tp-graph-results-header">Equivalent SQL</h3><div class="tp-graph-results-content tp-query-sql"><pre><code>${escapeXml(this.toSql())}</code></pre></div>`; } catch (error) { return `<h3 class="tp-graph-results-header">Equivalent SQL</h3><div class="tp-graph-results-content tp-query-error">${escapeXml(error instanceof Error ? error.message : 'SQL is unavailable.')}</div>`; } }
  private selectedNode(): TpGraphNode | undefined { return this.value.nodes.find((node) => node.id === this.selectedQueryId); }
  private expressionKey(type: string): string { if (type === TP_QUERY_SELECTION || type === TP_QUERY_JOIN) return 'condition'; if (type === TP_QUERY_PROJECTION) return 'columns'; if (type === TP_QUERY_AGGREGATION) return 'expressions'; return 'orderBy'; }
  private updateSelectedData(key: string, value: string): void { if (!this.selectedQueryId) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedQueryId); if (!node) return; node.data = { ...(node.data ?? {}), [key]: value.trim() }; this.setGraph(graph); }
  private updateQueryControls(): void {
    const node = this.selectedNode(); const relation = node?.type === TP_QUERY_RELATION; const aliasVisible = relation || node?.type === TP_QUERY_RENAME; const expressionVisible = node ? [TP_QUERY_SELECTION, TP_QUERY_PROJECTION, TP_QUERY_AGGREGATION, TP_QUERY_SORT, TP_QUERY_JOIN].includes(node.type) : false;
    const setControl = (selector: string, visible: boolean, value: string): void => { const control = this.querySelector<HTMLInputElement | HTMLSelectElement>(selector); if (!control) return; control.disabled = !visible; control.closest<HTMLElement>('.tp-query-parameter')?.toggleAttribute('hidden', !visible); control.value = value; };
    setControl('[data-query-table]', relation, node ? stringData(node, 'table') : ''); setControl('[data-query-alias]', aliasVisible, node ? stringData(node, 'alias') : '');
    const expressionKey = node ? this.expressionKey(node.type) : 'condition'; setControl('[data-query-expression]', expressionVisible, node ? stringData(node, expressionKey) : '');
    setControl('[data-query-group]', node?.type === TP_QUERY_AGGREGATION, node ? stringData(node, 'groupBy') : ''); setControl('[data-query-join]', node?.type === TP_QUERY_JOIN, node ? stringData(node, 'joinType', 'inner') : 'inner');
  }
}

if (!customElements.get('tp-graph-query-tree')) customElements.define('tp-graph-query-tree', TpGraphQueryTree);
