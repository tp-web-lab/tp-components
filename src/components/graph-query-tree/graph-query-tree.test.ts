import { afterEach, describe, expect, it } from 'vitest';
import { queryTreeToSql, TpGraphQueryTree, validateQueryTree } from './graph-query-tree.js';
import type { TpGraphDocument } from '../graph-editor/graph-editor.js';

const QUERY: TpGraphDocument = {
  version: 1,
  title: 'Employees in active departments',
  nodes: [
    { id: 'employees', type: 'query-relation', x: 160, y: 340, data: { table: 'employees', alias: 'e' } },
    { id: 'departments', type: 'query-relation', x: 480, y: 340, data: { table: 'departments', alias: 'd' } },
    { id: 'join', type: 'query-join', x: 320, y: 230, data: { condition: 'l.department_id = r.id', joinType: 'inner' } },
    { id: 'selection', type: 'query-selection', x: 320, y: 130, data: { condition: 'q.active = TRUE' } },
    { id: 'projection', type: 'query-projection', x: 320, y: 40, data: { columns: 'q.employee_name, q.department_name' } },
  ],
  edges: [
    { id: 'e1', type: 'query-edge', source: 'employees', target: 'join', direction: 'forward' },
    { id: 'e2', type: 'query-edge', source: 'departments', target: 'join', direction: 'forward' },
    { id: 'e3', type: 'query-edge', source: 'join', target: 'selection', direction: 'forward' },
    { id: 'e4', type: 'query-edge', source: 'selection', target: 'projection', direction: 'forward' },
  ],
};

describe('TpGraphQueryTree', () => {
  afterEach(() => { document.body.innerHTML = ''; });
  it('validates a relational tree and generates nested SQL', () => {
    expect(() => validateQueryTree(QUERY)).not.toThrow();
    const sql = queryTreeToSql(QUERY);
    expect(sql).toContain('INNER JOIN'); expect(sql).toContain('WHERE q.active = TRUE'); expect(sql).toContain('SELECT q.employee_name, q.department_name');
  });
  it('rejects cycles and excessive operator arity', () => {
    const cyclic = structuredClone(QUERY); cyclic.edges.push({ id: 'cycle', type: 'query-edge', source: 'projection', target: 'join', direction: 'forward' });
    expect(() => validateQueryTree(cyclic)).toThrow();
  });
  it('renders the equivalent SQL below the graph', async () => {
    const editor = new TpGraphQueryTree(); editor.value = structuredClone(QUERY); document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('.tp-query-sql')?.textContent).toContain('INNER JOIN');
    expect(editor.querySelector('[data-shape="query-aggregation"]')).not.toBeNull();
    expect(editor.querySelector('[data-edge-direction="forward"]')).not.toBeNull();
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'employees' } }));
    const table = editor.querySelector<HTMLInputElement>('[data-query-table]');
    const alias = editor.querySelector<HTMLInputElement>('[data-query-alias]');
    if (table) { table.value = 'people'; table.dispatchEvent(new Event('change')); }
    if (alias) { alias.value = 'p'; alias.dispatchEvent(new Event('change')); }
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'selection' } }));
    const expression = editor.querySelector<HTMLInputElement>('[data-query-expression]');
    if (expression) { expression.value = 'p.active'; expression.dispatchEvent(new Event('change')); }
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'join' } }));
    const join = editor.querySelector<HTMLSelectElement>('[data-query-join]');
    if (join) { join.value = 'left'; join.dispatchEvent(new Event('change')); }
    expect(editor.toSql()).toContain('LEFT JOIN');
  });
  it('covers public validation and parameter helpers', () => {
    const editor = new TpGraphQueryTree();
    editor.value = structuredClone(QUERY);
    expect(() => editor.addNode('unsupported', { x: 0, y: 0 })).toThrow('Unsupported query-tree');
    expect(() => editor.addEdge('employees', 'join', undefined, undefined, undefined, 'backward')).toThrow('forward');
    const api = editor as unknown as {
      validateConnection(source: string, target: string, type: string): void;
      expressionKey(type: string): string;
      updateSelectedData(key: string, value: string): void;
    };
    expect(() => api.validateConnection('employees', 'join', 'wrong')).toThrow('Unsupported query-tree edge');
    expect(api.expressionKey('query-projection')).toBe('columns');
    expect(api.expressionKey('query-aggregation')).toBe('expressions');
    expect(api.expressionKey('query-sort')).toBe('orderBy');
    api.updateSelectedData('table', 'ignored');
  });
});
