import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  dedentRestructuredTextSource,
  TpRestructuredText,
} from './restructuredtext/restructuredtext.js';

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

async function waitFor(predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (predicate()) return;
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
  }
  throw new Error('Timed out while waiting for reStructuredText rendering.');
}

describe('reStructuredText component', () => {
  it('dedents embedded source', () => {
    expect(
      dedentRestructuredTextSource(`
        Heading
        =======

        First paragraph.
      `),
    ).toBe(`Heading
=======

First paragraph.`);
  });

  it('renders inline and external sources with the shared parser', async () => {
    const pythonGlobals = new Map<string, unknown>();
    const renderedSources: string[] = [];
    const highlightElement = vi.fn((element: HTMLElement) => {
      element.classList.add('hljs');
    });
    vi.stubGlobal('hljs', { highlightElement });
    const pyodide = {
      globals: {
        delete: (name: string) => pythonGlobals.delete(name),
        get: (name: string) => pythonGlobals.get(name),
        set: (name: string, value: unknown) => pythonGlobals.set(name, value),
      },
      loadPackage: vi.fn(async () => undefined),
      runPythonAsync: vi.fn(async () => {
        const source = String(pythonGlobals.get('tp_rst_source'));
        renderedSources.push(source);
        pythonGlobals.set(
          'tp_rst_result',
          JSON.stringify({
            html: `<main><p>${source.includes('External') ? 'External' : 'Inline'}</p><pre class="code python doctest">&gt;&gt;&gt; print(6 * 7)\n42</pre><pre class="code python literal-block"><code>print('Hello')</code></pre></main>`,
            ast: { type: 'document', attributes: {} },
            doctest: pythonGlobals.get('tp_rst_doctest') === true
              ? source.includes('External')
                ? {
                    attempted: 1,
                    passed: 0,
                    failed: 1,
                    blocks: [{ index: 0, attempted: 1, passed: 0, failed: 1, output: 'Expected:\n 41\nGot:\n 42\n' }],
                  }
                : {
                    attempted: 1,
                    passed: 1,
                    failed: 0,
                    blocks: [{ index: 0, attempted: 1, passed: 1, failed: 0, output: '' }],
                  }
              : undefined,
          }),
        );
      }),
    };
    vi.stubGlobal('loadPyodide', vi.fn(async () => pyodide));

    const rendered = vi.fn();
    const doctest = vi.fn();
    const element = document.createElement('tp-restructuredtext');
    element.setAttribute('doctest', '');
    element.addEventListener('tp-restructuredtext-rendered', rendered);
    element.addEventListener('tp-restructuredtext-doctest', doctest);
    element.innerHTML = `
      <script type="tp/restructuredtext">
        Inline title
        ============

        Inline content.
      </script>
    `;
    document.body.append(element);

    await waitFor(() => element.hasAttribute('data-tp-restructuredtext-rendered'));
    expect(element).toBeInstanceOf(TpRestructuredText);
    expect(renderedSources[0]).toBe(`Inline title
============

Inline content.`);
    expect(element.querySelector('main p')?.textContent).toBe('Inline');
    expect(element.querySelector('pre code')?.classList).toContain(
      'language-python',
    );
    expect(highlightElement).toHaveBeenCalled();
    expect(rendered).toHaveBeenCalledTimes(1);
    expect(doctest).toHaveBeenCalledTimes(1);
    expect(element.querySelector('pre.doctest')?.getAttribute('data-tp-doctest')).toBe('passed');
    expect(element.querySelector('.tp-restructuredtext-doctest-result')?.textContent).toContain('1/1');

    const fetchMock = vi.fn(
      async () => new Response('External **content**.', { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    element.src = '/example.rst';

    await waitFor(() => rendered.mock.calls.length === 2);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/example.rst',
      { cache: 'no-store' },
    );
    expect(renderedSources[1]).toBe('External **content**.');
    expect(element.querySelector('main p')?.textContent).toBe('External');
    expect(element.getAttribute('data-tp-restructuredtext-source')).toBe(
      '/example.rst',
    );
    expect(element.querySelector('pre.doctest')?.getAttribute('data-tp-doctest')).toBe('failed');
    expect(element.querySelector('.tp-restructuredtext-doctest-result code')?.textContent).toContain('Expected:');
  });
});
