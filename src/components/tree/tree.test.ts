import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './tree.js';
import type { TpTree } from './tree.js';

function renderTree(attributes = 'selectable editable draggable'): TpTree {
  document.body.innerHTML = `
    <tp-tree ${attributes}>
      <ul><li data-node-id="root">Root<ul><li data-node-id="b">Beta</li><li data-node-id="a">Alpha</li></ul></li></ul>
    </tp-tree>`;
  return document.querySelector('tp-tree') as TpTree;
}

function items(tree: TpTree): HTMLLIElement[] {
  return Array.from(tree.querySelectorAll('li'));
}

describe('<tp-tree>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.querySelectorAll('[data-tp-tree-contextmenu]').forEach((item) => item.remove());
    vi.restoreAllMocks();
  });

  it('reflects behavior attributes and validates level', () => {
    const tree = document.createElement('tp-tree') as TpTree;
    expect(tree.level).toBe(1);
    tree.selectable = true;
    tree.guides = true;
    tree.editable = true;
    tree.draggableNodes = true;
    tree.level = 0;
    expect(tree.selectable).toBe(true);
    expect(tree.guides).toBe(true);
    expect(tree.editable).toBe(true);
    expect(tree.draggableNodes).toBe(true);
    expect(tree.level).toBe(0);
    tree.setAttribute('level', 'bad');
    expect(tree.level).toBe(1);
    expect(() => { tree.level = -1; }).toThrow(TypeError);
    tree.selectable = false;
    tree.guides = false;
    tree.editable = false;
    tree.draggableNodes = false;
    expect(tree.hasAttribute('selectable')).toBe(false);
  });

  it('selects nodes and toggles branches with pointer interactions', () => {
    const tree = renderTree();
    const [root, beta] = items(tree);
    const selected = vi.fn();
    tree.addEventListener('tp-tree-select', selected);
    beta?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(tree.getSelectedItem()).toBe(beta);
    expect(beta?.hasAttribute('data-selected')).toBe(true);
    expect(selected).toHaveBeenCalledOnce();

    root?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(root?.getAttribute('data-expanded')).toBe('false');
    root?.querySelector<HTMLElement>('[data-tp-tree-toggle]')?.click();
    expect(root?.getAttribute('data-expanded')).toBe('true');
  });

  it('expands, collapses, sorts, and toggles guides through the public API', () => {
    const tree = renderTree();
    const [root] = items(tree);
    tree.collapseAll();
    expect(root?.getAttribute('data-expanded')).toBe('false');
    tree.expandAll();
    expect(root?.getAttribute('data-expanded')).toBe('true');
    if (root) {
      tree.collapseNode(root);
      tree.expandNode(root);
      tree.sortNodeChildren(root);
    }
    tree.sortAll();
    expect(items(tree).slice(1).map((item) => item.getAttribute('data-node-id'))).toEqual(['a', 'b']);
    tree.toggleGuides();
    expect(tree.guides).toBe(true);
  });

  it('renames a node with Enter and cancels with Escape', () => {
    const tree = renderTree();
    const beta = items(tree)[1];
    const renamed = vi.fn();
    tree.addEventListener('tp-tree-node-rename-request', renamed);
    if (!beta) throw new Error('Expected node.');
    tree.beginRename(beta);
    const input = beta.querySelector<HTMLInputElement>('[data-tp-tree-rename-input]');
    if (!input) throw new Error('Expected rename input.');
    input.value = 'Gamma';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(beta.getAttribute('data-label')).toBe('Gamma');
    expect(renamed).toHaveBeenCalledOnce();

    tree.beginRename(beta);
    const second = beta.querySelector<HTMLInputElement>('[data-tp-tree-rename-input]');
    second?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(beta.getAttribute('data-label')).toBe('Gamma');
  });

  it.each(['expand-all', 'collapse-all', 'sort-all', 'toggle-guides'])(
    'executes the %s global context action',
    (action) => {
      const tree = renderTree();
      const actionEvent = vi.fn();
      tree.addEventListener('tp-tree-context-action', actionEvent);
      tree.openGlobalContextMenuAt(12, 18);
      document.querySelector<HTMLButtonElement>(`[data-action-id="${action}"]`)?.click();
      expect(actionEvent).toHaveBeenCalledOnce();
      expect(document.querySelector('[data-tp-tree-contextmenu]')).toBeNull();
    },
  );

  it.each(['add-leaf', 'add-node', 'clone', 'sort', 'delete'])(
    'executes the %s node context action',
    (action) => {
      const tree = renderTree();
      const beta = items(tree)[1];
      if (!beta) throw new Error('Expected node.');
      tree.openNodeContextMenuAt(beta, 20, 30);
      document.querySelector<HTMLButtonElement>(`[data-action-id="${action}"]`)?.click();
      expect(document.querySelector('[data-tp-tree-contextmenu]')).toBeNull();
    },
  );

  it('supports custom context menu metadata and closing events', () => {
    const tree = renderTree();
    tree.setContextMenuConfig({
      globalActions: [
        { id: 'custom', label: 'Custom', shortcutLabel: 'C', tone: 'danger' },
        { id: 'hidden', label: 'Hidden', hidden: true },
      ],
      getNodeActions: () => [],
    });
    const opened = vi.fn();
    const closed = vi.fn();
    tree.addEventListener('tp-tree-context-open', opened);
    tree.addEventListener('tp-tree-context-close', closed);
    tree.openGlobalContextMenuAt(10, 10);
    expect(document.querySelector('[data-action-id="custom"] [data-tp-tree-contextmenu-shortcut]')?.textContent).toBe('C');
    expect(document.querySelector('[data-action-id="custom"]')?.getAttribute('data-tone')).toBe('danger');
    expect(document.querySelector('[data-action-id="hidden"]')).toBeNull();
    tree.closeContextMenu();
    expect(opened).toHaveBeenCalledOnce();
    expect(closed).toHaveBeenCalledOnce();
  });

  it('moves nodes with drag and drop and emits the move request', () => {
    const tree = renderTree();
    const [, beta, alpha] = items(tree);
    if (!beta || !alpha) throw new Error('Expected nodes.');
    vi.spyOn(alpha, 'getBoundingClientRect').mockReturnValue({
      bottom: 100, height: 100, left: 0, right: 100, top: 0, width: 100, x: 0, y: 0,
      toJSON: () => ({}),
    });
    const values = new Map<string, string>();
    const transfer = {
      dropEffect: 'none', effectAllowed: 'none',
      getData: (type: string) => values.get(type) ?? '',
      setData: (type: string, value: string) => values.set(type, value),
    } as unknown as DataTransfer;
    const moved = vi.fn();
    tree.addEventListener('tp-tree-node-move-request', moved);
    const dragStart = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperties(dragStart, { dataTransfer: { value: transfer }, clientY: { value: 50 } });
    beta.dispatchEvent(dragStart);
    const dragOver = new Event('dragover', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperties(dragOver, { dataTransfer: { value: transfer }, clientY: { value: 95 } });
    alpha.dispatchEvent(dragOver);
    const drop = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperties(drop, { dataTransfer: { value: transfer }, clientY: { value: 95 } });
    alpha.dispatchEvent(drop);
    expect(values.get('text/plain')).toBe('b');
    expect(transfer.effectAllowed).toBe('move');
    expect(moved).toHaveBeenCalledOnce();
    expect(items(tree).slice(1).map((item) => item.getAttribute('data-node-id'))).toEqual(['a', 'b']);
  });

  it('computes drop zones and guards invalid DOM moves', () => {
    const tree = renderTree();
    const [root, beta, alpha] = items(tree);
    if (!root || !beta || !alpha) throw new Error('Expected nodes.');
    vi.spyOn(beta, 'getBoundingClientRect').mockReturnValue({
      bottom: 100, height: 100, left: 0, right: 100, top: 0, width: 100, x: 0, y: 0,
      toJSON: () => ({}),
    });
    const internals = tree as unknown as {
      getDropPosition: (item: HTMLLIElement, y: number) => string;
      getEffectiveDropPosition: (item: HTMLLIElement, position: string) => string;
      moveItemInDom: (source: HTMLLIElement, destination: HTMLLIElement, position: string) => void;
    };
    expect(internals.getDropPosition(beta, 5)).toBe('before');
    expect(internals.getDropPosition(beta, 50)).toBe('inside');
    expect(internals.getDropPosition(beta, 95)).toBe('after');
    expect(internals.getEffectiveDropPosition(root, 'before')).toBe('inside');
    expect(internals.getEffectiveDropPosition(beta, 'inside')).toBe('after');
    internals.moveItemInDom(alpha, beta, 'before');
    expect(items(tree).slice(1)[0]).toBe(alpha);
    internals.moveItemInDom(alpha, beta, 'after');
    expect(items(tree).slice(1)[1]).toBe(alpha);
    internals.moveItemInDom(root, beta, 'inside');
    internals.moveItemInDom(beta, beta, 'inside');
  });

  it('commits rename on blur and avoids renaming when capability denies it', () => {
    const tree = renderTree();
    const beta = items(tree)[1];
    if (!beta) throw new Error('Expected node.');
    tree.beginRename(beta);
    const input = beta.querySelector<HTMLInputElement>('[data-tp-tree-rename-input]');
    if (!input) throw new Error('Expected input.');
    input.value = 'Delta';
    input.dispatchEvent(new FocusEvent('blur'));
    expect(beta.getAttribute('data-label')).toBe('Delta');

    tree.setContextMenuConfig({
      globalActions: [],
      getNodeActions: () => [],
      getNodeCapabilities: () => ({ renamable: false }),
    });
    tree.beginRename(beta);
    expect(beta.querySelector('[data-tp-tree-rename-input]')).toBeNull();
    tree.openGlobalContextMenuAt(0, 0);
    tree.openNodeContextMenuAt(beta, 0, 0);
    expect(document.querySelector('[data-tp-tree-contextmenu]')).toBeNull();
  });

  it('combines node and global actions with separators and disabled state', () => {
    const tree = renderTree();
    const beta = items(tree)[1];
    if (!beta) throw new Error('Expected node.');
    tree.setContextMenuConfig({
      globalActions: [{ id: 'global', label: 'Global' }],
      getNodeActions: () => [{ id: 'node', label: 'Node', disabled: true }],
      getNodeCapabilities: () => ({}),
    });
    tree.openNodeContextMenuAt(beta, window.innerWidth + 50, window.innerHeight + 50);
    expect(document.querySelector('[data-tp-tree-contextmenu-separator]')).not.toBeNull();
    expect(document.querySelector<HTMLButtonElement>('[data-action-id="node"]')?.disabled).toBe(true);
    expect(document.querySelector('[data-action-id="global"]')).not.toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('[data-tp-tree-contextmenu]')).toBeNull();
  });

  it('handles contextmenu gestures on nodes and the global surface', () => {
    const tree = renderTree();
    const beta = items(tree)[1];
    beta?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 4, clientY: 5 }));
    expect(document.querySelector('[data-action-id="rename"]')).not.toBeNull();
    tree.closeContextMenu();
    tree.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 4, clientY: 5 }));
    expect(document.querySelector('[data-action-id="expand-all"]')).not.toBeNull();
    document.dispatchEvent(new Event('scroll'));
    expect(document.querySelector('[data-tp-tree-contextmenu]')).toBeNull();
  });

  it('ignores selection and drag operations when capabilities are absent', () => {
    const tree = renderTree('');
    const [, beta, alpha] = items(tree);
    if (!beta || !alpha) throw new Error('Expected nodes.');
    beta.click();
    beta.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(tree.getSelectedItem()).toBeNull();

    const dragStart = new Event('dragstart', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(dragStart, 'dataTransfer', { value: null });
    beta.dispatchEvent(dragStart);
    expect(dragStart.defaultPrevented).toBe(true);
    alpha.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    alpha.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    beta.dispatchEvent(new Event('dragend', { bubbles: true }));
    expect(items(tree)).toHaveLength(3);
  });

  it('covers safe no-op branches for author-provided structures', () => {
    const tree = renderTree();
    const [root, beta] = items(tree);
    if (!root || !beta) throw new Error('Expected nodes.');

    tree.expandNode(beta);
    tree.collapseNode(beta);
    tree.beginRename(beta);
    tree.beginRename(beta);
    const input = beta.querySelector<HTMLInputElement>('[data-tp-tree-rename-input]');
    input?.dispatchEvent(new Event('keydown'));
    if (input) input.value = '   ';
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    tree.setContextMenuConfig({ globalActions: [{ id: 'only', label: 'Only' }] });
    tree.openNodeContextMenuAt(beta, 0, 0);
    expect(document.querySelector('[data-action-id="only"]')).not.toBeNull();
    tree.closeContextMenu();

    const nested = document.createElement('li');
    nested.innerHTML = 'Nested<ul><li>Child</li></ul>';
    root.querySelector(':scope > ul')?.append(nested);
    const internals = tree as unknown as {
      getEffectiveDropPosition: (item: HTMLLIElement, position: string) => string;
      moveItemInDom: (source: HTMLLIElement, destination: HTMLLIElement, position: string) => void;
    };
    expect(internals.getEffectiveDropPosition(nested, 'inside')).toBe('inside');
    expect(internals.getEffectiveDropPosition(beta, 'before')).toBe('before');
    internals.moveItemInDom(beta, nested, 'inside');
    expect(nested.querySelector(':scope > ul > li[data-node-id="b"]')).toBe(beta);
  });
});
