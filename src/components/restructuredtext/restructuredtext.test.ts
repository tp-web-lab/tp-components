import { afterEach, describe, expect, it, vi } from 'vitest';
import { dedentRestructuredTextSource, parseRestructuredTextToAst, renderRestructuredTextInto, renderRestructuredTextToHtml, TpRestructuredText } from './restructuredtext.js';

afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals(); });

function installParser(): void {
  const globals = new Map<string, unknown>();
  vi.stubGlobal('loadPyodide', vi.fn(async () => ({
    globals: { set: (key: string, value: unknown) => globals.set(key, value), get: (key: string) => globals.get(key), delete: (key: string) => globals.delete(key) },
    loadPackage: vi.fn(async () => undefined),
    runPythonAsync: vi.fn(async () => globals.set('tp_rst_result', JSON.stringify({ html: '<pre class="code python doctest"><code>print(1)</code></pre>', ast: { type: 'document' }, doctest: globals.get('tp_rst_doctest') ? { attempted: 1, passed: 1, failed: 0, blocks: [{ index: 0, attempted: 1, passed: 1, failed: 0, output: '' }] } : undefined }))),
  })));
  vi.stubGlobal('hljs', { highlightElement: vi.fn() });
}

describe('<tp-restructuredtext>', () => {
  it('dedents, renders and reports successful doctests', async () => {
    installParser();
    expect(dedentRestructuredTextSource('\n  Title\n  =====')).toBe('Title\n=====');
    const element = document.createElement('tp-restructuredtext') as TpRestructuredText;
    element.doctest = true; element.innerHTML = '<script type="tp/restructuredtext">Title\n=====</script>';
    document.body.append(element); await vi.waitFor(() => expect(element.hasAttribute('data-tp-restructuredtext-rendered')).toBe(true));
    expect(element.querySelector('[data-tp-doctest="passed"]')).not.toBeNull();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('1/1');
    expect(element.doctest).toBe(true);
  });

  it('loads external sources and renders loading errors', async () => {
    installParser();
    const fetchMock = vi.fn(async () => new Response('Remote', { status: 200 })); vi.stubGlobal('fetch', fetchMock);
    const element = document.createElement('tp-restructuredtext') as TpRestructuredText; element.src = '/remote.rst';
    document.body.append(element); await vi.waitFor(() => expect(element.hasAttribute('data-tp-restructuredtext-rendered')).toBe(true));
    expect(fetchMock).toHaveBeenCalled();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 }))); element.src = '/missing.rst';
    await vi.waitFor(() => expect(element.querySelector('[role="alert"]')?.textContent).toContain('404'));
    element.src = ''; element.doctest = false;
    expect(element.hasAttribute('src')).toBe(false); expect(element.doctest).toBe(false);
  });

  it('supports the standalone render, parse and render-into APIs', async () => {
    installParser();
    expect(await renderRestructuredTextToHtml('Paragraph')).toContain('doctest');
    expect(await parseRestructuredTextToAst('Paragraph')).toMatchObject({ type: 'document' });
    const root = document.createElement('div'); await renderRestructuredTextInto('Paragraph', root);
    expect(root.querySelector('pre code')?.classList).toContain('language-python');
  });

  it('loads Highlight.js lazily and reports both doctest outcomes', async () => {
    installParser();
    vi.unstubAllGlobals(); installParser();
    Reflect.deleteProperty(window, 'hljs');
    const root = document.createElement('div');
    const pending = renderRestructuredTextInto('Code', root);
    await Promise.resolve(); await Promise.resolve();
    const script = document.querySelector<HTMLScriptElement>('script[data-tp-restructuredtext-asset="highlight"]');
    const highlightElement = vi.fn(); Object.assign(window, { hljs: { highlightElement } });
    script?.dispatchEvent(new Event('load')); await pending;
    expect(highlightElement).toHaveBeenCalled();

    const editor = document.createElement('tp-restructuredtext') as unknown as HTMLElement & {
      outputElement: HTMLDivElement;
      renderDoctestResults(result: unknown): void;
    };
    editor.outputElement.innerHTML = '<pre class="doctest"></pre><pre class="doctest"></pre>';
    editor.renderDoctestResults({ attempted: 2, passed: 1, failed: 1, blocks: [
      { index: 0, attempted: 1, passed: 1, failed: 0, output: '' },
      { index: 1, attempted: 1, passed: 0, failed: 1, output: 'Expected 1' },
      { index: 9, attempted: 1, passed: 0, failed: 1, output: 'Missing block' },
    ] });
    expect(editor.outputElement.querySelector('details code')?.textContent).toContain('Expected 1');
  });

  it('reads code and direct inline fallbacks', async () => {
    installParser();
    for (const source of ['<pre><code>Code source</code></pre>', 'Direct source']) {
      const element = document.createElement('tp-restructuredtext'); element.innerHTML = source;
      document.body.append(element); await vi.waitFor(() => expect(element.hasAttribute('data-tp-restructuredtext-rendered')).toBe(true));
      expect(element.querySelector('pre')).not.toBeNull(); element.remove();
    }
  });
});
