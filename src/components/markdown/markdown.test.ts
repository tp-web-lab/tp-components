import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseMarkdownToTokens, renderMarkdownInto, renderMarkdownRuntimeIn, renderMarkdownToHtml, TpMarkdown } from './markdown.js';

afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals(); });

describe('<tp-markdown>', () => {
  it('renders raw-text blocks, fenced examples and tokens', async () => {
    const html = await renderMarkdownToHtml('<tp-box>\n<script>const x = 1;</script>\n</tp-box>\n\n```html\n<style>x{}</style>\n```');
    expect(html).toContain('<script>const x = 1;</script>');
    expect(html).toContain('&lt;style&gt;');
    expect(await parseMarkdownToTokens('# Title')).toBeTruthy();
    const root = document.createElement('div'); await renderMarkdownInto('**bold**', root);
    expect(root.querySelector('strong')?.textContent).toBe('bold');
  });

  it('renders inline, external and recursively included sources', async () => {
    const responses = new Map([
      ['http://localhost:3000/root.md', '# Remote\n::include{child.md}'],
      ['http://localhost:3000/child.md', 'Child'],
    ]);
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => new Response(responses.get(String(url)) ?? '', { status: responses.has(String(url)) ? 200 : 404 })));
    const element = document.createElement('tp-markdown') as TpMarkdown;
    element.innerHTML = '<script type="tp/markdown"># Inline</script>'; document.body.append(element);
    await vi.waitFor(() => expect(element.hasAttribute('data-tp-markdown-rendered')).toBe(true));
    expect(element.querySelector('h1')?.textContent).toBe('Inline');
    element.src = '/root.md';
    await vi.waitFor(() => expect(element.textContent).toContain('Child'));
    expect(element.querySelector('h1')?.textContent).toBe('Remote');
    element.src = ''; expect(element.hasAttribute('src')).toBe(false);
  });

  it('maps includes by format, raw mode and failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => new Response(String(url).endsWith('.txt') ? '<raw>' : '', { status: String(url).includes('missing') ? 404 : 200 })));
    const element = document.createElement('tp-markdown');
    element.innerHTML = `<script type="tp/markdown">::include{page.adoc}\n::include{page.rst}\n::include{page.html}\n::include{icon.svg}\n::include{file.txt mode=raw}\n::include{missing.md}</script>`;
    document.body.append(element); await vi.waitFor(() => expect(element.hasAttribute('data-tp-markdown-rendered')).toBe(true));
    expect(element.querySelector('tp-asciidoc')).not.toBeNull();
    expect(element.querySelector('tp-restructuredtext')).not.toBeNull();
    expect(element.querySelector('tp-include')).not.toBeNull();
    expect(element.querySelector('raw')).not.toBeNull();
    expect(element.textContent).toContain('Unable to include');
  });

  it('preserves several raw blocks and applies include prefixes', async () => {
    const html = await renderMarkdownToHtml('<script>one</script>\n<style>two</style>');
    expect(html).toContain('<script>one</script>'); expect(html).toContain('<style>two</style>');
    const root = document.createElement('div'); await renderMarkdownRuntimeIn(root);
    const editor = document.createElement('tp-markdown') as HTMLElement & {
      applyIncludePrefix(content: string, prefix: string): string;
      resolveIncludes(source: string, url: URL, depth?: number): Promise<string>;
    };
    expect(editor.applyIncludePrefix('one\ntwo', '  ')).toBe('  one\n  two');
    expect(editor.applyIncludePrefix('one\ntwo', '  : ')).toBe('  : one\n    two');
    expect(editor.applyIncludePrefix('::: tp-card\ncontent\n:::', ': ')).toContain(':\n');
    await expect(editor.resolveIncludes('text', new URL('http://localhost/root.md'), 13)).rejects.toThrow('depth exceeded');
  });

  it('covers external failures, code fallback and every automatic include output', async () => {
    const requests = vi.fn(async (url: string | URL | Request) => {
      const path = new URL(String(url)).pathname;
      if (path.includes('missing')) return new Response('', { status: 500 });
      if (path.endsWith('.md')) return new Response('Nested');
      if (path.endsWith('.svg')) return new Response('<svg><title>Icon</title></svg>');
      return new Response('<unsafe>');
    });
    vi.stubGlobal('fetch', requests);
    const element = document.createElement('tp-markdown') as TpMarkdown;
    element.innerHTML = '<pre><code># From code</code></pre>'; document.body.append(element);
    await vi.waitFor(() => expect(element.hasAttribute('data-tp-markdown-rendered')).toBe(true));
    expect(element.querySelector('h1')?.textContent).toBe('From code');
    element.src = '/missing-root.md';
    await vi.waitFor(() => expect(element.querySelector('[role="alert"]')?.textContent).toContain('500'));
    const internal = element as unknown as { renderInclude(path: string, url: URL, depth: number, mode: 'auto' | 'raw'): Promise<string> };
    const base = new URL('http://localhost/docs/root.md');
    expect(await internal.renderInclude('missing.txt', base, 0, 'raw')).toContain('Unable to include');
    expect(await internal.renderInclude('file.txt', base, 0, 'auto')).toContain('&lt;unsafe&gt;');
    expect(await internal.renderInclude('icon.svg', base, 0, 'auto')).toContain('<svg>');
    expect(await internal.renderInclude('nested.md', base, 0, 'auto')).toBe('Nested');
  });
});
