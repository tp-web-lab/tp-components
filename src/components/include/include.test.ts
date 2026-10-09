import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './include.js';
import { TpInclude } from './include.js';

describe('<tp-include>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpInclude);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-include') as TpInclude as TpInclude;
    const second = document.createElement('tp-include') as TpInclude as TpInclude;

    document.body.append(first, second);

    expect(document.head.querySelectorAll('#tp-include-styles')).toHaveLength(1);
  });

  it('uses cors as default fetchMode', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    expect(element.fetchMode).toBe('cors');
  });

  it('reflects src property', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    element.src = '/partial.html';

    expect(element.getAttribute('src')).toBe('/partial.html');
    expect(element.src).toBe('/partial.html');
  });

  it('reflects mode property', () => {
    const element = document.createElement('tp-include') as TpInclude;

    expect(element.mode).toBe('auto');
    element.mode = 'raw';
    expect(element.getAttribute('mode')).toBe('raw');
    expect(element.mode).toBe('raw');
    element.mode = 'auto';
    expect(element.hasAttribute('mode')).toBe(false);
  });

  it('reflects fetchMode property', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    element.fetchMode = 'same-origin';

    expect(element.getAttribute('fetch-mode')).toBe('same-origin');
    expect(element.fetchMode).toBe('same-origin');
  });

  it('reflects allowScripts property', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    expect(element.allowScripts).toBe(false);

    element.allowScripts = true;
    expect(element.hasAttribute('allow-scripts')).toBe(true);

    element.allowScripts = false;
    expect(element.hasAttribute('allow-scripts')).toBe(false);
  });

  it('loads remote html content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<p>Hello</p>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.innerHTML).toContain('<p>Hello</p>');
  });

  it('displays remote content as text in raw mode', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<p>Hello</p>\n\nSecond line.',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.src = '/fragment.html';
    element.mode = 'raw';
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('pre code')?.textContent).toBe(
      '<p>Hello</p>\n\nSecond line.',
    );
    expect(element.querySelector('p')).toBeNull();
  });

  it('passes fetch mode to fetch', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '<p>Hello</p>',
    });

    vi.stubGlobal('fetch', fetchSpy);

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('fetch-mode', 'same-origin');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    const firstCall = fetchSpy.mock.calls[0] as [RequestInfo | URL, RequestInit?] | undefined;
    const requestedPath = new URL(String(firstCall?.[0]), window.location.href).pathname;

    expect(requestedPath).toBe('/fragment.html');
    expect(firstCall?.[1]).toEqual({
      mode: 'same-origin',
    });
  });

  it('résout src depuis le document Markdown courant', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '<p>Hello</p>',
    });

    vi.stubGlobal('fetch', fetchSpy);

    document.body.innerHTML = `
      <div data-tp-markdown-source="/docs/components/prose-editor/index.md">
        <tp-include src="fragment.html"></tp-include>
      </div>
    `;

    await Promise.resolve();
    await Promise.resolve();

    const firstCall = fetchSpy.mock.calls[0] as [RequestInfo | URL, RequestInit?] | undefined;
    const requestedPath = new URL(String(firstCall?.[0]), window.location.href).pathname;

    expect(requestedPath).toBe('/docs/components/prose-editor/fragment.html');
  });

  it('removes scripts when allow-scripts is absent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<div>Content</div><script>window.__tpInclude = 1;</script>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('script')).toBeNull();
  });

  it('keeps declarative tp/LANG scripts when allow-scripts is absent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => `
          <script type="tp/asciidoc">Hello, *Asciidoctor*!</script>
          <script type="tp/markdown">Hello, **Markdown**!</script>
          <script type="module">window.__tpIncludeModule = true;</script>
          <script>window.__tpIncludeClassic = true;</script>
        `,
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    const scripts = Array.from(element.querySelectorAll('script'));
    expect(scripts.map((script) => script.type)).toEqual(['tp/asciidoc', 'tp/markdown']);
    expect(scripts[0]?.textContent).toContain('Hello, *Asciidoctor*!');
    expect(scripts[1]?.textContent).toContain('Hello, **Markdown**!');
  });

  it('keeps scripts when allow-scripts is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<div>Content</div><script>window.__tpInclude = 1;</script>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('allow-scripts', '');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('script')).not.toBeNull();
  });

  it('dispatches tp-include-load on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<p>Hello</p>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');

    const handler = vi.fn();
    element.addEventListener('tp-include-load', handler);

    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(element.getAttribute('data-tp-source')).toBe(
      'http://localhost:3000/fragment.html',
    );

    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.src).toBe('/fragment.html');
    expect(event.detail.fetchMode).toBe('cors');
    expect(event.detail.allowScripts).toBe(false);
  });

  it('dispatches tp-include-error on fetch failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network failure')),
    );

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');

    const handler = vi.fn();
    element.addEventListener('tp-include-error', handler);

    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);

    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.error).toBe('Network failure');
  });

  it('dispatches tp-include-error on http error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => '',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/missing.html');

    const handler = vi.fn();
    element.addEventListener('tp-include-error', handler);

    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);

    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.error).toBe('HTTP 404');
  });

  it('clears content when src is removed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<p>Hello</p>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude  as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.innerHTML).toContain('<p>Hello</p>');

    element.removeAttribute('src');

    expect(element.children).toHaveLength(0);
  });

  it('supports reload()', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        text: async () => '<p>Hello</p>',
      });

    vi.stubGlobal('fetch', fetchSpy);

    const element = document.createElement('tp-include') as TpInclude as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    await element.reload();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('reflects allowStyles property', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    expect(element.allowStyles).toBe(false);

    element.allowStyles = true;
    expect(element.hasAttribute('allow-styles')).toBe(true);

    element.allowStyles = false;
    expect(element.hasAttribute('allow-styles')).toBe(false);
  });

  it('reflects sanitize property', () => {
    const element = document.createElement('tp-include') as TpInclude as TpInclude;

    expect(element.sanitize).toBe(false);

    element.sanitize = true;
    expect(element.hasAttribute('sanitize')).toBe(true);

    element.sanitize = false;
    expect(element.hasAttribute('sanitize')).toBe(false);
  });

  it('removes style elements when allow-styles is absent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<style>.x{color:red;}</style><div class="x">Hello</div>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('style')).toBeNull();
    expect(element.textContent).toContain('Hello');
  });

  it('keeps style elements when allow-styles is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<style>.x{color:red;}</style><div class="x">Hello</div>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('allow-styles', '');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('style')).not.toBeNull();
  });

  it('removes stylesheet links when allow-styles is absent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          '<link rel="stylesheet" href="/style.css"><div>Hello</div>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/fragment.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('link[rel="stylesheet"]')).toBeNull();
  });

  it('keeps stylesheet links when allow-styles is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          '<link rel="stylesheet" href="/style.css"><div>Hello</div>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('allow-styles', '');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('link[rel="stylesheet"]')).not.toBeNull();
  });

  it('sanitizes dangerous attributes when sanitize is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<div onclick="alert(1)">Hello</div>',
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('sanitize', '');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    const div = element.querySelector('div');
    expect(div?.hasAttribute('onclick')).toBe(false);
  });

  it('parses full html documents and injects only body content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => `
          <!doctype html>
          <html>
            <head>
              <title>Test</title>
              <style>body{color:red;}</style>
            </head>
            <body>
              <p>Hello from body</p>
            </body>
          </html>
        `,
      }),
    );

    const element = document.createElement('tp-include') as TpInclude;
    element.setAttribute('src', '/document.html');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.textContent).toContain('Hello from body');
    expect(element.querySelector('title')).toBeNull();
  });

  it('removes scripts when sanitize is present, even if allow-scripts is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          '<div>Content</div><script>window.__tpInclude = 1;</script>',
      }),
    );

    const element = document.createElement('tp-include');
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('allow-scripts', '');
    element.setAttribute('sanitize', '');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('script')).toBeNull();
  });

  it('reports scriptsExecuted=false when sanitize is present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          '<div>Content</div><script>window.__tpInclude = 1;</script>',
      }),
    );

    const element = document.createElement('tp-include');
    element.setAttribute('src', '/fragment.html');
    element.setAttribute('allow-scripts', '');
    element.setAttribute('sanitize', '');

    const handler = vi.fn();
    element.addEventListener('tp-include-load', handler);

    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.scriptsExecuted).toBe(false);
  });

  it('reflects loading and fallback properties', () => {
    const element = document.createElement('tp-include') as TpInclude;
    element.loading = 'Loading…';
    element.fallback = '#fallback';
    expect(element.loading).toBe('Loading…');
    expect(element.fallback).toBe('#fallback');
    element.loading = '';
    element.fallback = '';
    expect(element.hasAttribute('loading')).toBe(false);
    expect(element.hasAttribute('fallback')).toBe(false);
  });

  it('renders loading text while a request is pending', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)));
    const element = document.createElement('tp-include') as TpInclude;
    element.src = '/slow.html';
    element.loading = 'Loading content';
    document.body.append(element);
    expect(element.querySelector('[data-tp-include-loading]')?.textContent).toBe('Loading content');
  });

  it('ignores an obsolete response after src changes', async () => {
    let resolveFirst: ((value: unknown) => void) | undefined;
    const fetchSpy = vi.fn()
      .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce({ ok: true, text: async () => '<p>new</p>' });
    vi.stubGlobal('fetch', fetchSpy);
    const element = document.createElement('tp-include') as TpInclude;
    element.src = '/old.html';
    document.body.append(element);
    element.src = '/new.html';
    await Promise.resolve();
    await Promise.resolve();
    resolveFirst?.({ ok: true, text: async () => '<p>old</p>' });
    await Promise.resolve();
    await Promise.resolve();
    expect(element.textContent).toContain('new');
    expect(element.textContent).not.toContain('old');
  });

  it('reports non-Error failures with a stable message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('failure'));
    const element = document.createElement('tp-include') as TpInclude;
    const failed = vi.fn();
    element.addEventListener('tp-include-error', failed);
    element.src = '/failure.html';
    document.body.append(element);
    await Promise.resolve();
    await Promise.resolve();
    expect((failed.mock.calls[0]?.[0] as CustomEvent).detail.error).toBe('Unknown include error');
  });

});
