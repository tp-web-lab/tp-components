import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './tree.js';
import type { TpTree } from './tree.js';

function getItems(): HTMLLIElement[] {
  return Array.from(document.querySelectorAll('tp-tree li')).filter(
    (element): element is HTMLLIElement => element instanceof HTMLLIElement,
  );
}

function renderTree(level?: string): TpTree {
  document.body.innerHTML = `
    <tp-tree${level === undefined ? '' : ` level="${level}"`}>
      <ul>
        <li>Root
          <ul>
            <li>Child
              <ul>
                <li>Grandchild</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </tp-tree>
  `;

  const tree = document.querySelector('tp-tree');

  if (!(tree instanceof HTMLElement)) {
    throw new Error('Expected <tp-tree>.');
  }

  return tree as TpTree;
}

describe('<tp-tree> level', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('expands level 1 by default', () => {
    renderTree();

    const [root, child] = getItems();

    expect(root?.getAttribute('data-expanded')).toBe('true');
    expect(child?.getAttribute('data-expanded')).toBe('false');
  });

  it('expands subtrees up to the configured level', () => {
    renderTree('2');

    const [root, child] = getItems();

    expect(root?.getAttribute('data-expanded')).toBe('true');
    expect(child?.getAttribute('data-expanded')).toBe('true');
  });

  it('reapplies generated expansion state when level changes', () => {
    const tree = renderTree('1');
    const [, child] = getItems();

    expect(child?.getAttribute('data-expanded')).toBe('false');

    tree.level = 2;

    expect(child?.getAttribute('data-expanded')).toBe('true');
  });
});
