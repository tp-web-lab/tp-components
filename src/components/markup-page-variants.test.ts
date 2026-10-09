import { afterEach, describe, expect, it, vi } from 'vitest';
import './markdown-multi-pages/markdown-multi-pages.js';
import './markup-multi-pages/markup-multi-pages.js';
import './asciidoc-multi-pages/asciidoc-multi-pages.js';
import './restructuredtext-multi-pages/restructuredtext-multi-pages.js';
import './html-multi-pages/html-multi-pages.js';
import './markup-single-page/markup-single-page.js';
import './markdown-single-page/markdown-single-page.js';
import './asciidoc-single-page/asciidoc-single-page.js';
import './restructuredtext-single-page/restructuredtext-single-page.js';
import './html-single-page/html-single-page.js';

async function waitFor(predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (predicate()) return;
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
  }
  throw new Error('Timed out waiting for component rendering.');
}

describe('format-specific page components', () => {
  afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); window.location.hash = ''; });

  it('registers every canonical multi-page and single-page tag', () => {
    for (const tag of ['tp-markdown-multi-pages', 'tp-markup-multi-pages', 'tp-asciidoc-multi-pages', 'tp-restructuredtext-multi-pages', 'tp-html-multi-pages', 'tp-markup-single-page', 'tp-markdown-single-page', 'tp-asciidoc-single-page', 'tp-restructuredtext-single-page', 'tp-html-single-page']) expect(customElements.get(tag)).toBeDefined();
  });

  it('forces Markdown even when the external filename has no Markdown extension', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('# Fixed Markdown', { status: 200 }));
    const element = document.createElement('tp-markdown-single-page'); element.setAttribute('src', '/page.txt'); document.body.append(element);
    await waitFor(() => element.hasAttribute('data-tp-markup-single-page-rendered'));
    expect(element.getAttribute('data-tp-markup-single-page-language')).toBe('markdown');
    expect(element.querySelector('tp-markdown')).not.toBeNull();
  });

  it('renders inline HTML directly with the browser', async () => {
    const rendered = vi.fn(); const element = document.createElement('tp-html-single-page'); element.addEventListener('tp-html-single-page-rendered', rendered); element.innerHTML = '<script type="tp/html"><strong>Native HTML</strong></script>'; document.body.append(element);
    await waitFor(() => element.hasAttribute('data-tp-markup-single-page-rendered'));
    expect(element.querySelector('.tp-markup-single-page-output strong')?.textContent).toBe('Native HTML');
    expect(element.querySelector('tp-markdown, tp-asciidoc, tp-restructuredtext')).toBeNull();
    expect(rendered).toHaveBeenCalledOnce();
  });

  it('looks for AsciiDoc special pages in an AsciiDoc repository', async () => {
    const requested: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input); requested.push(url);
      if (url.includes('sidebar.adoc')) return new Response('= Navigation', { status: 200 });
      if (url.includes('cover.adoc')) return new Response('= Cover', { status: 200 });
      return new Response('', { status: 404 });
    });
    const element = document.createElement('tp-asciidoc-multi-pages'); element.setAttribute('repository', '/adoc-docs'); document.body.append(element);
    await waitFor(() => requested.some((url) => url.includes('cover.adoc')));
    expect(requested.some((url) => url.includes('sidebar.adoc'))).toBe(true);
    expect(requested.some((url) => url.includes('/adoc-docs/sidebar.md'))).toBe(false);
  });
});
