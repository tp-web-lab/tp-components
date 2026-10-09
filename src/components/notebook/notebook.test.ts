import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../prolog-notebook/prolog-notebook.js';
import '../python-notebook/python-notebook.js';
import { getNotebookLoaderUrl } from './notebook.js';

type NotebookCell = {
  type: 'markup' | 'code';
  language: string;
  content?: string;
  files?: Array<{ filename?: string; content: string }>;
  showEditor?: boolean;
  doctest?: boolean;
};

type NotebookInternals = HTMLElement & {
  cells: NotebookCell[];
  initialCells: NotebookCell[];
  notebookName: string;
  fileHandle: null | { createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }> };
  selectedIndex: number;
  fetchJson(url: string): Promise<{ name?: string; cells: NotebookCell[] }>;
  loadRepository(url: string): Promise<{ name?: string; cells: NotebookCell[] }>;
  loadNotebookFile(file: File): Promise<void>;
  importHtmlFile(file: File): Promise<void>;
  notebookBlob(): Blob;
  standaloneHtml(): string;
  htmlBlob(): Blob;
  saveNotebook(saveAs: boolean): Promise<void>;
  exportHtml(): void;
  chooseNotebookFile(format: 'json' | 'html'): void;
  addCell(type: 'markup' | 'code', language: string): void;
  selectCell(index: number): void;
};

function internals(element: Element): NotebookInternals {
  return element as unknown as NotebookInternals;
}

beforeEach(() => vi.stubGlobal('requestAnimationFrame', vi.fn(() => 0)));
afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('<tp-notebook>', () => {
  it('resolves the standalone loader in source and distribution builds', () => {
    expect(getNotebookLoaderUrl('http://localhost:4173/src/components/notebook/notebook.ts'))
      .toBe('http://localhost:4173/src/tp-loader.ts');
    expect(getNotebookLoaderUrl('https://example.test/dist/chunks/notebook.js'))
      .toBe('https://example.test/dist/tp-loader.js');
    expect(getNotebookLoaderUrl('https://example.test/components/notebook/notebook.js'))
      .toBe('https://example.test/tp-loader.js');
    expect(getNotebookLoaderUrl('https://example.test/src/chunks/notebook.js'))
      .toBe('https://example.test/tp-loader.js');
    expect(getNotebookLoaderUrl('https://example.test/notebook.js'))
      .toBe('https://example.test/tp-loader.js');
  });

  it('renders inline code from different languages in a generic notebook', async () => {
    const notebook = document.createElement('tp-notebook');
    notebook.innerHTML = `
      <script type="tp/markdown">### Calculation</script>
      <script type="tp/python">print(6 * 7)</script>
      <script type="tp/javascript">console.log(6 * 7)</script>
    `;
    document.body.append(notebook);

    await vi.waitFor(() => expect(notebook.querySelector('tp-python-viewer')).not.toBeNull());
    expect(notebook.querySelector('tp-python-viewer script[type="tp/python"]')?.textContent).toContain('print(6 * 7)');
    expect(notebook.querySelector('tp-javascript-viewer script[type="tp/javascript"]')?.textContent).toContain('console.log(6 * 7)');
    notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
    const preview = notebook.querySelector('[data-tp-notebook-preview-content]');
    expect(preview?.querySelector('tp-python-viewer')).not.toBeNull();
    expect(preview?.querySelector('tp-javascript-viewer')).not.toBeNull();
  }, 15_000);

  it('keeps the complete editor toolbar and adds preview and HTML export', async () => {
    const notebook = document.createElement('tp-notebook');
    document.body.append(notebook);
    await Promise.resolve();

    expect(notebook.querySelector('[data-tp-notebook-title]')?.textContent).toBe('Notebook');
    expect(notebook.querySelector('[data-tp-notebook-files-menu]')?.textContent).toContain('Export HTML');
    expect(notebook.querySelector('[data-tp-notebook-files-menu]')?.textContent).toContain('Import HTML');
    expect(notebook.querySelector('[data-tp-notebook-files-menu] tp-divider')).not.toBeNull();
    expect(notebook.querySelector('tp-icon-button[data-action="preview"][name="eye-outline"]')).not.toBeNull();
    expect(notebook.querySelector('tp-icon-button[data-action="run-all"][name="play-all"]')).not.toBeNull();
    expect(notebook.querySelector('[data-action="delete"]')).not.toBeNull();
    expect(notebook.querySelector('[data-action="up"]')).not.toBeNull();
    expect(notebook.querySelector('[data-action="duplicate"]')).not.toBeNull();
    expect(notebook.querySelector('[data-action="editor-toolbar"][name="keyboard-f1"]')).not.toBeNull();
    expect(notebook.querySelector('[data-tp-notebook-language-menu="markup"]')).not.toBeNull();
    expect(notebook.querySelector('[data-tp-notebook-language-menu="code"]')).not.toBeNull();
    expect(document.getElementById('tp-notebook-styles')?.textContent).toContain('[data-tp-notebook-root]');
    notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
    expect(notebook.querySelector('[data-tp-notebook-preview-content]')).not.toBeNull();
    expect(notebook.querySelector('[data-action="preview"]')?.getAttribute('name')).toBe('pencil');
    expect(notebook.querySelector('[data-action="preview"]')?.getAttribute('aria-pressed')).toBe('true');
    notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
    expect(notebook.querySelector('[data-tp-notebook-preview-content]')).toBeNull();
    expect(notebook.querySelector('[data-action="preview"]')?.getAttribute('name')).toBe('eye-outline');
  });

  it('toggles the selected cell code editor toolbar', async () => {
    const notebook = document.createElement('tp-notebook');
    notebook.innerHTML = '<script type="tp/javascript">console.log(42)</script>';
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelector('tp-code-editor')).not.toBeNull());
    const button = notebook.querySelector<HTMLElement>('[data-action="editor-toolbar"]');
    const editor = notebook.querySelector<HTMLElement>('tp-code-editor');
    expect(button?.hidden).toBe(false);
    button?.click();
    expect(editor?.hasAttribute('toolbar')).toBe(true);
  });

  it('renders AsciiDoc again in the final document so MathJax can initialize there', async () => {
    const notebook = document.createElement('tp-notebook');
    notebook.innerHTML = '<script type="tp/asciidoc">latexmath:[x = 42]</script>';
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelector('tp-asciidoc-viewer')).not.toBeNull());
    notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
    const preview = notebook.querySelector('[data-tp-notebook-preview-content]');
    expect(preview?.querySelector('tp-asciidoc')).not.toBeNull();
  });

  it('renders doctest cells again so their success styling remains available', async () => {
    const notebook = document.createElement('tp-notebook');
    notebook.innerHTML = '<script type="tp/restructuredtext" doctest>&gt;&gt;&gt; print(6 * 7)\n42</script>';
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelector('tp-restructuredtext-viewer')).not.toBeNull());
    notebook.querySelector<HTMLElement>('[data-action="preview"]')?.click();
    expect(notebook.querySelector('[data-tp-notebook-preview-content] tp-restructuredtext[doctest]')).not.toBeNull();
  });

  it('shows only markup output and keeps programming viewers intact', async () => {
    const notebook = document.createElement('tp-prolog-notebook');
    notebook.innerHTML = `
      <script type="tp/markdown"># Family</script>
      <script type="tp/prolog" filename="program.pl">parent(ada, byron).</script>
      <script type="tp/prolog" filename="query.pl">parent(ada, X).</script>
    `;
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelector('tp-markdown-viewer[data-layout="output"]')).not.toBeNull());

    const markupCell = notebook.querySelector('[data-tp-notebook-cell][data-cell-type="markup"]');
    expect(markupCell?.querySelector('tp-code-editor')).toBeNull();
    expect(markupCell?.querySelector('[data-role="output"]')).not.toBeNull();
    expect(document.getElementById('tp-notebook-styles')?.textContent).toContain("[data-tp-notebook-cell][data-cell-type='markup'] .tp-markup-viewer");
    const prologViewer = notebook.querySelector('tp-prolog-viewer');
    expect(prologViewer?.querySelectorAll(':scope > script')).toHaveLength(2);
    expect(prologViewer?.hasAttribute('lite')).toBe(false);
    const title = notebook.querySelector('[data-tp-notebook-title]');
    expect(title?.textContent.trim()).toBe('');
    expect(title?.querySelector('tp-icon[library="components"][name="prolog-notebook"][size="1.75em"]')).not.toBeNull();
    const languageButton = notebook.querySelector('tp-button[data-action="add-language"]');
    expect(languageButton?.hasAttribute('outlined')).toBe(true);
    expect(languageButton?.getAttribute('size')).toBe('m');
    expect(languageButton?.textContent).toContain('Prolog');
    expect(languageButton?.querySelector('tp-icon[library="languages"][name="file_type_prolog"]')).not.toBeNull();
    expect(languageButton?.querySelector('tp-icon[name="plus-box-outline"][size="1.25rem"]')).not.toBeNull();
    expect(notebook.querySelector('[data-tp-notebook-language-menu="code"]')).toBeNull();
  }, 15_000);

  it('shares one Python execution scope between its code cells', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      cells: [
        { type: 'code', language: 'python', files: [{ content: 'x = 3' }] },
        { type: 'code', language: 'python', files: [{ content: 'y = x + 1' }] },
      ],
    })));
    const notebook = document.createElement('tp-python-notebook');
    notebook.setAttribute('src', './shared-scope.json');
    document.body.append(notebook);

    await vi.waitFor(() => expect(notebook.querySelectorAll('tp-python-viewer')).toHaveLength(2));
    const viewers = Array.from(notebook.querySelectorAll('tp-python-viewer'));
    const scopes = viewers.map((viewer) => viewer.getAttribute('execution-scope'));
    expect(scopes[0]).not.toBeNull();
    expect(scopes[1]).toBe(scopes[0]);
    fetchMock.mockRestore();
  }, 15_000);

  it('loads an existing readonly notebook through src', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      name: 'Readonly notebook',
      cells: [{ type: 'markup', language: 'markdown', content: '# Readonly' }],
    })));
    const notebook = document.createElement('tp-notebook');
    notebook.setAttribute('src', './notebook.json');
    notebook.setAttribute('readonly', '');
    document.body.append(notebook);

    await vi.waitFor(() => expect(notebook.querySelector('tp-markdown-viewer')).not.toBeNull());
    expect(fetchMock).toHaveBeenCalled();
    expect(notebook.querySelector('tp-markdown-viewer')?.hasAttribute('readonly')).toBe(true);
    fetchMock.mockRestore();
  });

  it('renders HTML directly without a script wrapper', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      cells: [{ type: 'markup', language: 'html', content: '<p>Hello</p>' }],
    })));
    const notebook = document.createElement('tp-notebook');
    notebook.setAttribute('src', './html-notebook.json');
    document.body.append(notebook);

    await vi.waitFor(() => expect(notebook.querySelector('tp-html-viewer[data-layout="output"]')).not.toBeNull());
    expect(notebook.querySelector('tp-html-viewer tp-code-editor')).toBeNull();
    expect(notebook.querySelector('tp-html-viewer script[type="tp/html"]')).toBeNull();
    fetchMock.mockRestore();
  });

  it('loads repository manifests and resolves referenced cell files', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith('/project.json')) return new Response(JSON.stringify({
        name: 'Repository notebook',
        cells: [
          { type: 'markup', language: 'markdown', content: 'intro.md' },
          { type: 'code', language: 'javascript', files: [{ filename: 'main.js', content: '/main.js' }] },
        ],
      }));
      if (url.endsWith('/.files.json')) {
        return new Response(JSON.stringify({ files: ['intro.md', 'main.js'] }));
      }
      if (url.endsWith('/intro.md')) return new Response('# Loaded');
      if (url.endsWith('/main.js')) return new Response('console.log(42)');
      return new Response('', { status: 404 });
    });
    const notebook = document.createElement('tp-notebook');
    notebook.setAttribute('repository', 'https://example.test/course/');
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelector('tp-markdown-viewer')).not.toBeNull());
    expect(internals(notebook).cells[0]?.content).toBe('# Loaded');
    expect(internals(notebook).cells[1]?.files?.[0]?.content).toBe('console.log(42)');
    await expect(internals(notebook).fetchJson('https://example.test/missing.json')).rejects
      .toThrow('Unable to load notebook');
    fetchMock.mockRestore();
  });

  it('loads JSON and HTML files, including standalone HTML imports', async () => {
    const notebook = document.createElement('tp-notebook');
    document.body.append(notebook);
    const api = internals(notebook);
    const onLoad = vi.fn(); notebook.addEventListener('tp-notebook-load', onLoad);
    const jsonFile = {
      name: 'lesson.json',
      text: async () => JSON.stringify({ name: 'Lesson', cells: [{ type: 'markup', language: 'markdown', content: '# File' }] }),
    } as File;
    await api.loadNotebookFile(jsonFile);
    expect(api.notebookName).toBe('Lesson');
    expect(onLoad).toHaveBeenCalled();
    await expect(api.loadNotebookFile({ name: 'bad.json', text: async () => '{}' } as File))
      .rejects.toThrow('cells array');

    await api.importHtmlFile({ name: 'page.html', text: async () => '<main><p>Imported</p></main>' } as File);
    expect(notebook.querySelector('tp-html-viewer')?.innerHTML).toContain('Imported');
    const exported = '<script id="tp-notebook-data" type="application/json">' +
      JSON.stringify({ name: 'Embedded', cells: [{ type: 'markup', language: 'markdown', content: '# Embedded' }] }) +
      '</script>';
    await api.importHtmlFile({ name: 'export.html', text: async () => exported } as File);
    expect(api.notebookName).toBe('Embedded');
    await expect(api.importHtmlFile({
      name: 'bad.html',
      text: async () => '<script id="tp-notebook-data" type="application/json">{}</script>',
    } as File)).rejects.toThrow('cells array');
  });

  it('serializes and saves JSON and standalone HTML through both save paths', async () => {
    const notebook = document.createElement('tp-notebook');
    notebook.innerHTML = '<script type="tp/markdown"># Export</script>';
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelector('tp-markdown-viewer')).not.toBeNull());
    const api = internals(notebook);
    api.notebookName = 'A & <notebook>';
    expect(api.notebookBlob().type).toBe('application/json');
    expect(api.htmlBlob().type).toBe('text/html');
    const html = api.standaloneHtml();
    expect(html).toContain('<title>A &amp; &lt;notebook&gt;</title>');
    expect(html).toContain('tp-notebook-data');

    const write = vi.fn(async () => undefined);
    const close = vi.fn(async () => undefined);
    const showSaveFilePicker = vi.fn(async () => ({
      createWritable: async () => ({ write, close }),
    }));
    Object.assign(window, { showSaveFilePicker });
    await api.saveNotebook(true);
    expect(write).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();

    api.fileHandle = null;
    Reflect.deleteProperty(window, 'showSaveFilePicker');
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:notebook');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    await api.saveNotebook(false);
    api.exportHtml();
    expect(createObjectURL).toHaveBeenCalledTimes(2);
    expect(click).toHaveBeenCalledTimes(2);
    expect(revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it('routes every files-menu command and closes the dropdown', async () => {
    const notebook = document.createElement('tp-notebook');
    document.body.append(notebook);
    const api = internals(notebook);
    const chooseNotebookFile = vi.fn();
    const saveNotebook = vi.fn(async () => undefined);
    const exportHtml = vi.fn();
    api.chooseNotebookFile = chooseNotebookFile;
    api.saveNotebook = saveNotebook;
    api.exportHtml = exportHtml;
    const menu = notebook.querySelector<HTMLElement>('[data-tp-notebook-files-menu]');
    const hide = vi.fn();
    Object.assign(menu ?? {}, { hide });
    for (const action of ['load', 'import-html', 'save', 'save-as', 'export-html']) {
      menu?.querySelector<HTMLElement>(`[data-file-action="${action}"]`)?.click();
    }
    menu?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
    expect(chooseNotebookFile).toHaveBeenNthCalledWith(1, 'json');
    expect(chooseNotebookFile).toHaveBeenNthCalledWith(2, 'html');
    expect(saveNotebook).toHaveBeenCalledWith(false);
    expect(saveNotebook).toHaveBeenCalledWith(true);
    expect(exportHtml).toHaveBeenCalledOnce();
    expect(hide.mock.calls.length).toBeGreaterThanOrEqual(5);
  });

  it('adds, selects, reorders, duplicates, deletes, resets, and runs cells', async () => {
    const notebook = document.createElement('tp-notebook');
    notebook.innerHTML = '<script type="tp/markdown">First</script><script type="tp/markdown">Second</script>';
    document.body.append(notebook);
    await vi.waitFor(() => expect(notebook.querySelectorAll('[data-tp-notebook-cell]')).toHaveLength(2));
    const api = internals(notebook);
    const onChange = vi.fn(); notebook.addEventListener('tp-notebook-change', onChange);

    api.addCell('markup', 'asciidoc');
    api.addCell('code', 'javascript');
    expect(api.cells).toHaveLength(4);
    api.selectCell(0);
    api.selectCell(0);
    const clickAction = (action: string): void => {
      notebook.querySelector<HTMLElement>(`[data-action="${action}"]`)?.click();
    };
    clickAction('down');
    clickAction('up');
    clickAction('duplicate');
    clickAction('delete');
    clickAction('reset');
    expect(api.cells).toHaveLength(2);

    const run = vi.fn();
    notebook.querySelector('[data-tp-notebook-cell]')?.append(
      Object.assign(document.createElement('button'), { className: 'runner' }),
    );
    const runner = notebook.querySelector<HTMLElement>('.runner');
    runner?.setAttribute('data-tp-playground-run', '');
    if (runner !== null) runner.click = run;
    clickAction('run-all');
    expect(run).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();

    notebook.readonly = true;
    expect(notebook.readonly).toBe(true);
    const length = api.cells.length;
    api.addCell('code', 'python');
    clickAction('delete');
    expect(api.cells).toHaveLength(length);
  }, 20_000);
});
