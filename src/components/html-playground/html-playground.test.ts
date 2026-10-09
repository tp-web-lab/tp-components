import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadHtmlProjectFromDirectory } from './html-example-loader.js';
import { TpHtmlPlayground, TpHtmlProject } from './html-playground.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-html-playground>', () => {
  it('clones, serializes and restores HTML projects', () => {
    const project = new TpHtmlProject({ name: 'web', entry: '/index.html', importmap: { imports: { pkg: '/pkg.js' } }, files: [{ path: '/index.html', language: 'html', content: '<h1>Hello</h1>' }] });
    expect(project.clone().toJSON()).toEqual(project.toJSON());
    expect(TpHtmlProject.fromJSON(project.toJSON())?.entry).toBe('/index.html');
    expect(TpHtmlProject.fromJSON(null)).toBeNull();
    expect(TpHtmlProject.fromJSON({ files: 'invalid' })).toBeNull();
    const restored = TpHtmlProject.fromJSON({ files: [null, {}, { path: '/a.txt', content: 'a' }, { path: '/b.txt', content: 'b', language: 'text', readonly: true }], name: 1, entry: 2, test: 3, importmap: null });
    expect(restored?.files).toHaveLength(2);
  });

  it('loads every supported example asset type from a directory', async () => {
    const files = ['index.html', 'styles.css', 'main.js', 'module.mjs', 'data.json', 'readme.md', 'notes.txt'];
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('project.json')) return { ok: true, json: async () => ({ id: 'demo', entry: '/index.html' }) };
      if (url.endsWith('.files.json')) return { ok: true, json: async () => ({ files }) };
      return { ok: true, text: async () => `content:${url}` };
    }));
    const project = await loadHtmlProjectFromDirectory('/examples/demo/');
    expect(project.files.map((file) => file.language)).toEqual(['html', 'css', 'javascript', 'javascript', 'json', 'markdown', 'text']);
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })));
    await expect(loadHtmlProjectFromDirectory('/missing')).rejects.toThrow('Unable to load');
    vi.unstubAllGlobals();
  });

  it('renders and exercises the HTML language contract', async () => {
    const element = new TpHtmlPlayground();
    document.body.append(element);
    await Promise.resolve();
    const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
    const empty = api.createEmptyProject?.() as TpHtmlProject;
    expect(api.getPlaygroundKind?.()).toBe('html');
    expect(api.getLanguageIconName?.()).toBe('file_type_html');
    expect(api.resolveEntry?.(empty)).toBe('/index.html');
    expect(api.createNewProject?.()).toBeInstanceOf(TpHtmlProject);
    expect(api.createClearProject?.()).toBeInstanceOf(TpHtmlProject);
    expect(api.normalizeProject?.(empty)).toBeInstanceOf(TpHtmlProject);
    expect(api.getLanguageHelp?.()).toContain('HTML');
    expect(api.getAdditionalToolbarMenuItems?.()).toContain('Import maps');
    expect(api.createProjectFromExample?.({ id: 'sample', importmap: { imports: {} } }, [])).toBeInstanceOf(TpHtmlProject);
    const executable = new TpHtmlProject({ entry: '/pages/index.html', test: '/main.test.js', importmap: { imports: {} }, files: [
      { path: '/pages/index.html', language: 'html', content: '<html><head><link href="../style.css"><script type="module" src="./main.js"></script></head><body><img src="https://example.test/image.png"><a href="#main">Hello</a><a href="/missing.css">Missing</a></body></html>' },
      { path: '/style.css', language: 'css', content: 'body{}' },
      { path: '/pages/main.js', language: 'javascript', content: 'console.log(1)' },
      { path: '/main.test.js', language: 'javascript', content: 'console.assert(true)' },
    ] });
    const execution = await api.buildExecutionDocument?.(executable) as { html: string; cleanup?: () => void };
    expect(execution.html).toContain('Hello');
    execution.cleanup?.();
    expect(await api.buildTestDocument?.(executable)).toMatchObject({ html: expect.any(String) });
    expect(api.normalizeProject?.(new TpHtmlProject({ files: [{ path: '/page.html', language: 'html', content: '' }] }))).toMatchObject({ entry: '/page.html' });
    expect(api.resolveEntry?.(new TpHtmlProject())).toBeNull();
    await expect(api.buildExecutionDocument?.(new TpHtmlProject())).rejects.toThrow('entry');
    expect(element.querySelector('tp-code-editor')).not.toBeNull();
  });
});
