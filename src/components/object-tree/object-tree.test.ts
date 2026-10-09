import { beforeEach, describe, expect, it, vi } from 'vitest';
import './object-tree.js';
import { TpObjectTree } from './object-tree.js';

describe('<tp-object-tree>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('loads the value returned by a direct tp/javascript script', async () => {
    const element = document.createElement('tp-object-tree') as TpObjectTree;
    element.innerHTML = `
      <script type="tp/javascript">
        ({ component: 'tp-object-tree', stable: true, versions: [1, 2, 3] })
      </script>
    `;

    const loaded = vi.fn();
    element.addEventListener('tp-object-tree-load', loaded);
    document.body.append(element);
    await Promise.resolve();

    expect(element.textContent).toContain('component');
    expect(element.textContent).toContain('tp-object-tree');
    expect(element.textContent).toContain('Array(3)');
    expect(loaded).toHaveBeenCalledOnce();
    expect((loaded.mock.calls[0]?.[0] as CustomEvent).detail.source).toBe('script');
  });

  it('loads and inspects a JSON file from src', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ language: 'JavaScript', files: 4 }),
    }));

    const element = document.createElement('tp-object-tree') as TpObjectTree;
    element.src = '/project.json';
    const loaded = vi.fn();
    element.addEventListener('tp-object-tree-load', loaded);
    document.body.append(element);
    await vi.waitFor(() => expect(loaded).toHaveBeenCalledOnce());

    expect(fetch).toHaveBeenCalledWith('/project.json');
    expect(element.textContent).toContain('JavaScript');
    expect((loaded.mock.calls[0]?.[0] as CustomEvent).detail.source).toBe('src');
  });

  it('gives src precedence over an internal script', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ source: 'file' }),
    }));

    const element = document.createElement('tp-object-tree') as TpObjectTree;
    element.src = '/value.json';
    element.innerHTML = '<script type="tp/javascript">({ source: "script" })</script>';
    document.body.append(element);
    await vi.waitFor(() => expect(element.textContent).toContain('file'));

    expect(element.textContent).not.toContain('"script"');
  });

  it('emits an error event when src cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }));

    const element = document.createElement('tp-object-tree') as TpObjectTree;
    element.src = '/missing.json';
    const failed = vi.fn();
    element.addEventListener('tp-object-tree-error', failed);
    document.body.append(element);
    await vi.waitFor(() => expect(failed).toHaveBeenCalledOnce());

    expect((failed.mock.calls[0]?.[0] as CustomEvent).detail.message).toContain('404');
  });

  it('renders, sorts and controls every supported value kind', () => {
    const element = document.createElement('tp-object-tree') as TpObjectTree;
    document.body.append(element);
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const anonymous = () => undefined;
    Object.defineProperty(anonymous, 'name', { value: '' });
    const stackless = new Error('stackless');
    stackless.stack = '';
    element.setValue({
      z: undefined,
      text: 'hello',
      number: 42,
      truth: true,
      bigint: 3n,
      nothing: null,
      callable: anonymous,
      date: new Date('2024-01-02T00:00:00.000Z'),
      error: new Error('boom'),
      stackless,
      array: [1, false],
      circular,
      symbol: Symbol('sample'),
    });

    for (const kind of ['undefined', 'string', 'number', 'boolean', 'null', 'function', 'date', 'error', 'array', 'object', 'circular']) {
      expect(element.querySelector(`[data-kind="${kind}"]`)).not.toBeNull();
    }
    expect(element.textContent).toContain('ƒ');
    expect(element.textContent).toContain('↻ Circular');

    element.expandAll();
    element.collapseAll();
    element.sortAll();
    const tree = element.querySelector('tp-tree');
    for (const actionId of ['expand-all', 'collapse-all', 'sort-all', 'toggle-guides', 'unknown']) {
      tree?.dispatchEvent(new CustomEvent('tp-tree-context-action', {
        bubbles: true,
        detail: { scope: 'global', actionId },
      }));
    }
    tree?.dispatchEvent(new CustomEvent('tp-tree-context-action', {
      detail: { scope: 'node', actionId: 'expand-all' },
    }));
    element.setValue('root primitive');
    expect(element.textContent).toContain('root primitive');
  });

  it('supports empty configuration and reports invalid inline JavaScript', async () => {
    const empty = document.createElement('tp-object-tree') as TpObjectTree;
    empty.src = '  ';
    document.body.append(empty);
    empty.sortAll();
    expect(empty.src).toBe('');

    const invalid = document.createElement('tp-object-tree') as TpObjectTree;
    invalid.innerHTML = '<script type="tp/javascript">not valid (</script>';
    const failed = vi.fn();
    invalid.addEventListener('tp-object-tree-error', failed);
    document.body.append(invalid);
    await vi.waitFor(() => expect(failed).toHaveBeenCalledOnce());
    expect((failed.mock.calls[0]?.[0] as CustomEvent).detail.source).toBe('script');
  });
});
