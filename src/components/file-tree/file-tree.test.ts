import { beforeEach, describe, expect, it, vi } from 'vitest';
import './file-tree.js';
import type { TpFileTree } from './file-tree.js';

const nodes = [
  { kind: 'file' as const, name: 'z.ts', path: '/z.ts', children: [] },
  {
    kind: 'directory' as const,
    name: 'src',
    path: '/src',
    children: [
      { kind: 'file' as const, name: 'index.md', path: '/src/index.md', children: [] },
    ],
  },
];

function render(): TpFileTree {
  const element = document.createElement('tp-file-tree') as TpFileTree;
  document.body.append(element);
  return element;
}

function treeEvent(name: string, detail: unknown): CustomEvent {
  return new CustomEvent(name, { bubbles: true, detail });
}

describe('<tp-file-tree>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('renders a sorted, styled and stateful file hierarchy', () => {
    const element = render();
    element.setState({
      nodes,
      selectedPath: '/src/index.md',
      activePath: '/src/index.md',
      openPaths: ['/src/index.md'],
      dirtyPaths: ['/src/index.md'],
    });

    expect(document.head.querySelectorAll('#tp-file-tree-styles')).toHaveLength(1);
    expect(element.querySelector('tp-tree')).not.toBeNull();
    expect(Array.from(element.querySelectorAll(':scope > tp-tree > ul > li > ul > li')).map((item) => item.getAttribute('data-node-id'))).toEqual(['/src', '/z.ts']);
    const file = element.querySelector('[data-node-id="/src/index.md"]');
    expect(file?.hasAttribute('data-selected-path')).toBe(true);
    expect(file?.hasAttribute('data-active-path')).toBe(true);
    expect(file?.hasAttribute('data-open-path')).toBe(true);
    expect(file?.hasAttribute('data-dirty-path')).toBe(true);
    expect(file?.querySelector('tp-icon')?.getAttribute('name')).toBe('file_type_markdown');
    expect(element.getNodes()).not.toBe(nodes);
  });

  it('supports all state setters and tree commands', () => {
    const element = render();
    element.setNodes(nodes);
    element.setSelectedPath('/z.ts');
    element.setActivePath('/z.ts');
    element.setOpenPaths(['/z.ts']);
    element.setDirtyPaths(['/z.ts']);
    const tree = element.querySelector('tp-tree') as HTMLElement & { expandAll: () => void; collapseAll: () => void; beginRename: (item: HTMLLIElement) => void };
    const expand = vi.spyOn(tree, 'expandAll');
    const collapse = vi.spyOn(tree, 'collapseAll');
    const rename = vi.spyOn(tree, 'beginRename');
    element.expandAll();
    element.collapseAll();
    element.beginRenamePath('/z.ts');
    element.beginRenamePath('');
    element.beginRenamePath('/missing');
    expect(expand).toHaveBeenCalledOnce();
    expect(collapse).toHaveBeenCalledOnce();
    expect(rename).toHaveBeenCalledOnce();
  });

  it('translates file and directory selections', () => {
    const element = render();
    const selected = vi.fn();
    const active = vi.fn();
    const opened = vi.fn();
    element.addEventListener('tp-file-tree-select', selected);
    element.addEventListener('tp-file-tree-active', active);
    element.addEventListener('tp-file-tree-open', opened);
    const tree = element.querySelector('tp-tree')!;
    tree.dispatchEvent(treeEvent('tp-tree-select', { target: { nodeId: '/src', kind: 'directory' } }));
    tree.dispatchEvent(treeEvent('tp-tree-select', { target: { nodeId: '/z.ts', kind: 'file' } }));
    tree.dispatchEvent(treeEvent('tp-tree-select', { target: { nodeId: '', kind: 'file' } }));
    expect(selected).toHaveBeenCalledTimes(2);
    expect(active).toHaveBeenCalledOnce();
    expect(opened).toHaveBeenCalledOnce();
  });

  it('translates context, add, clone, delete, rename and move requests', () => {
    const element = render();
    const tree = element.querySelector('tp-tree')!;
    const received: string[] = [];
    for (const name of ['global-action', 'copy-request', 'add-request', 'clone-request', 'delete-request', 'rename-request', 'move-request']) {
      element.addEventListener(`tp-file-tree-${name}`, () => received.push(name));
    }
    tree.dispatchEvent(treeEvent('tp-tree-context-action', { scope: 'global', actionId: 'expand-all' }));
    tree.dispatchEvent(treeEvent('tp-tree-context-action', { scope: 'global', actionId: 'unknown' }));
    tree.dispatchEvent(treeEvent('tp-tree-context-action', { scope: 'node', actionId: 'copy', target: { nodeId: '/z.ts' } }));
    tree.dispatchEvent(treeEvent('tp-tree-context-action', { scope: 'node', actionId: 'rename', target: { nodeId: '/z.ts' } }));
    tree.dispatchEvent(treeEvent('tp-tree-node-add-request', { actionId: 'add-node', target: { nodeId: '/src' } }));
    tree.dispatchEvent(treeEvent('tp-tree-node-add-request', { actionId: 'add-leaf', target: null }));
    tree.dispatchEvent(treeEvent('tp-tree-node-clone-request', { target: { nodeId: '/z.ts' } }));
    tree.dispatchEvent(treeEvent('tp-tree-node-delete-request', { target: { nodeId: '/z.ts' } }));
    tree.dispatchEvent(treeEvent('tp-tree-node-rename-request', { target: { nodeId: '/z.ts' }, newLabel: 'a.ts' }));
    tree.dispatchEvent(treeEvent('tp-tree-node-move-request', { source: { nodeId: '/z.ts' }, destination: { nodeId: '/src' }, position: 'inside' }));
    tree.dispatchEvent(treeEvent('tp-tree-node-move-request', { source: { nodeId: '/z.ts' }, destination: null, position: 'after' }));
    tree.dispatchEvent(treeEvent('tp-tree-node-clone-request', { target: { nodeId: '' } }));
    tree.dispatchEvent(treeEvent('tp-tree-node-delete-request', { target: { nodeId: '' } }));
    tree.dispatchEvent(treeEvent('tp-tree-node-rename-request', { target: { nodeId: '' }, newLabel: 'x' }));
    tree.dispatchEvent(treeEvent('tp-tree-node-move-request', { source: { nodeId: '' }, destination: null, position: 'inside' }));
    expect(received).toEqual(['global-action', 'copy-request', 'add-request', 'add-request', 'clone-request', 'delete-request', 'rename-request', 'move-request', 'move-request']);
  });
});
