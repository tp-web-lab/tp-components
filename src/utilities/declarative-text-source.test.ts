import { afterEach, describe, expect, it, vi } from 'vitest';
import { TpDeclarativeTextSource } from './declarative-text-source.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('TpDeclarativeTextSource', () => {
  it('rejects script types outside the tp/ namespace', () => {
    const host = document.createElement('div');
    expect(() => new TpDeclarativeTextSource(host, { scriptTypes: ['text/plain'] }))
      .toThrow('must begin with "tp/"');
  });

  it('captures a script added after connection and preserves its dedented text', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const changed = vi.fn();
    const source = new TpDeclarativeTextSource(host, { scriptTypes: ['tp/example'] });
    source.observe(changed);

    host.innerHTML = '<script type="tp/example">\n  first\n    second\n</script>';
    await Promise.resolve();

    expect(changed).toHaveBeenCalledOnce();
    expect(await source.read()).toBe('first\n  second');
    host.replaceChildren(document.createElement('p'));
    expect(source.inlineSource).toBe('first\n  second');
    source.disconnect();
  });

  it('loads src relative to the component context and reports HTTP errors', async () => {
    const host = document.createElement('div');
    host.setAttribute('src', 'diagram.mmd');
    const source = new TpDeclarativeTextSource(host, { scriptTypes: ['tp/example'] });
    const changed = vi.fn();
    source.observe(changed);
    expect(changed).not.toHaveBeenCalled();

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, text: async () => 'external source' })
      .mockResolvedValueOnce({ ok: false, status: 404 });
    vi.stubGlobal('fetch', fetchMock);
    expect(await source.read({ cache: 'no-store' })).toBe('external source');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/diagram.mmd'), { cache: 'no-store' });
    host.setAttribute('src', 'missing.mmd');
    await expect(source.read()).rejects.toThrow('missing.mmd\" (404)');
  });

  it('optionally accepts direct text content and ignores empty content', async () => {
    const empty = document.createElement('div');
    const emptySource = new TpDeclarativeTextSource(empty, { scriptTypes: ['tp/example'] });
    expect(emptySource.capture()).toBe(false);
    expect(emptySource.inlineSource).toBeNull();

    const host = document.createElement('div');
    host.textContent = '\n  direct\n    text';
    const source = new TpDeclarativeTextSource(host, {
      scriptTypes: ['tp/example'],
      textContentFallback: true,
    });
    expect(source.capture()).toBe(true);
    expect(await source.read()).toBe('direct\n  text');
  });

  it('applies src, value, script and direct-text precedence centrally', async () => {
    const host = document.createElement('div');
    host.setAttribute('value', 'attribute text');
    host.innerHTML = '<script type="tp/example">script text</script>';
    const source = new TpDeclarativeTextSource(host, {
      scriptTypes: ['tp/example'],
      textContentFallback: true,
    });
    expect(await source.read()).toBe('attribute text');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => 'external text' }));
    host.setAttribute('src', 'speech.txt');
    expect(await source.read()).toBe('external text');

    host.removeAttribute('src');
    host.removeAttribute('value');
    expect(await source.read()).toBe('script text');
  });
});
