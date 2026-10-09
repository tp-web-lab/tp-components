import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './iframe.js';
import { TpIframe } from './iframe.js';

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('<tp-iframe>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-iframe');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpIframe);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-iframe');
    const second = document.createElement('tp-iframe');

    document.body.append(first, second);

    expect(document.head.querySelectorAll('#tp-iframe-styles')).toHaveLength(1);
  });

  it('creates internal DOM', () => {
    const element = document.createElement('tp-iframe');
    document.body.append(element);

    expect(element.querySelector('iframe')).not.toBeNull();
    expect(element.querySelector('[data-tp-iframe-controls]')).not.toBeNull();
    expect(element.querySelector('[data-tp-iframe-viewport]')).not.toBeNull();
  });

  it('reflects src', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    element.src = '/demo.html';

    expect(element.getAttribute('src')).toBe('/demo.html');
    expect(element.src).toBe('/demo.html');
  });

  it('reflects srcdoc', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    element.srcdoc = '<p>Hello</p>';

    expect(element.getAttribute('srcdoc')).toBe('<p>Hello</p>');
    expect(element.srcdoc).toBe('<p>Hello</p>');
  });

  it('applies iframe attributes', () => {
    const element = document.createElement('tp-iframe');
    element.setAttribute('src', '/demo.html');
    element.setAttribute('srcdoc', '<p>Hello</p>');
    element.setAttribute('fullscreen', '');
    element.setAttribute('loading', 'lazy');
    element.setAttribute('sandbox', 'allow-scripts');
    element.setAttribute('referrerpolicy', 'no-referrer');

    document.body.append(element);

    const frame = element.querySelector('iframe');
    expect(frame?.getAttribute('allowfullscreen')).not.toBeNull();
    expect(frame?.getAttribute('loading')).toBe('lazy');
    expect(frame?.getAttribute('sandbox')).toBe('allow-scripts');
    expect(frame?.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(frame?.getAttribute('srcdoc')).toBe('<p>Hello</p>');
  });

  it('shows controls when controls is true', () => {
    const element = document.createElement('tp-iframe');
    element.setAttribute('controls', 'true');
    document.body.append(element);

    const controls = element.querySelector('[data-tp-iframe-controls]');
    expect(controls?.hasAttribute('hidden')).toBe(false);
  });

  it('hides controls by default', () => {
    const element = document.createElement('tp-iframe');
    document.body.append(element);

    const controls = element.querySelector('[data-tp-iframe-controls]');
    expect(controls?.hasAttribute('hidden')).toBe(true);
  });

  it('disables interaction when interaction is false', () => {
    const element = document.createElement('tp-iframe');
    element.setAttribute('interaction', 'false');
    document.body.append(element);

    const frame = element.querySelector('iframe');
    expect(frame?.style.pointerEvents).toBe('none');
  });

  it('reflects zoom', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    element.zoom = 1.25;

    expect(element.getAttribute('zoom')).toBe('1.25');
    expect(element.zoom).toBe(1.25);
  });

  it('updates zoom label', () => {
    const element = document.createElement('tp-iframe');
    element.setAttribute('zoom', '1.5');
    element.setAttribute('controls', 'true');
    document.body.append(element);

    const label = element.querySelector('[data-tp-iframe-zoom-label]');
    expect(label?.textContent).toBe('150%');
  });

  it('zoomIn goes to next level', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    document.body.append(element);

    element.zoom = 1;
    element.zoomIn();

    expect(element.zoom).toBe(1.25);
  });

  it('zoomOut goes to previous level', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    document.body.append(element);

    element.zoom = 1;
    element.zoomOut();

    expect(element.zoom).toBe(0.75);
  });

  it('supports custom zoom levels', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    element.zoomLevels = '50% 100% 300%';
    document.body.append(element);

    element.zoom = 1;
    element.zoomIn();

    expect(element.zoom).toBe(3);
  });

  it('contentDocument and contentWindow proxy the internal iframe', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    document.body.append(element);

    const frame = element.querySelector('iframe');

    expect(element.contentDocument).toBe(frame?.contentDocument ?? null);
    expect(element.contentWindow).toBe(frame?.contentWindow ?? null);
  });

  it('reflects and clears the complete public attribute API', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    element.src = '/demo.html';
    element.srcdoc = '<p>demo</p>';
    element.fullscreen = true;
    element.controls = true;
    element.loading = 'eager';
    element.sandbox = 'allow-scripts';
    element.referrerPolicy = 'origin';
    element.interaction = false;
    element.zoomLevels = '50% 100%';
    document.body.append(element);

    expect(element.loading).toBe('eager');
    expect(element.sandbox).toBe('allow-scripts');
    expect(element.referrerPolicy).toBe('origin');
    expect(element.fullscreen).toBe(true);
    expect(element.controls).toBe(true);
    expect(element.interaction).toBe(false);
    element.src = '';
    element.srcdoc = '';
    element.fullscreen = false;
    element.loading = '';
    element.sandbox = '';
    element.referrerPolicy = '';
    element.zoomLevels = '';
    expect(element.querySelector('iframe')?.hasAttribute('src')).toBe(false);
    expect(element.querySelector('iframe')?.hasAttribute('allowfullscreen')).toBe(false);
  });

  it('validates loading and zoom values and falls back for invalid attributes', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    expect(() => { element.loading = 'later'; }).toThrow(TypeError);
    expect(() => { element.zoom = -1; }).toThrow(TypeError);
    expect(() => { element.zoom = Number.NaN; }).toThrow(TypeError);
    element.setAttribute('loading', 'later');
    element.setAttribute('zoom', 'bad');
    element.setAttribute('controls', 'other');
    element.setAttribute('interaction', 'other');
    expect(element.loading).toBe('');
    expect(element.zoom).toBe(1);
    expect(element.controls).toBe(false);
    expect(element.interaction).toBe(true);
  });

  it('uses safe accessible titles and emits load and scroll state', () => {
    const frames: VoidFunction[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: VoidFunction) => {
      frames.push(callback);
      return frames.length;
    });
    const element = document.createElement('tp-iframe') as TpIframe;
    element.setAttribute('aria-label', ' Preview ');
    element.srcdoc = '<p>Hello</p>';
    const changed = vi.fn();
    const loaded = vi.fn();
    element.addEventListener('tp-iframe-change', changed);
    element.addEventListener('tp-iframe-load', loaded);
    document.body.append(element);
    const frame = element.querySelector('iframe')!;
    expect(frame.title).toBe('Preview');
    element.querySelector('[data-tp-iframe-viewport]')?.dispatchEvent(new Event('scroll'));
    frame.dispatchEvent(new Event('load'));
    while (frames.length > 0) frames.shift()?.();
    expect(changed).toHaveBeenCalled();
    expect(loaded).toHaveBeenCalledOnce();
    expect((loaded.mock.calls[0]?.[0] as CustomEvent).detail.hasSrcdoc).toBe(true);
    expect(element.getContentHeight()).toBeGreaterThanOrEqual(0);
  });

  it('uses default zoom levels for invalid lists and clamps at their ends', () => {
    const element = document.createElement('tp-iframe') as TpIframe;
    element.zoomLevels = 'invalid';
    document.body.append(element);
    element.zoom = 2;
    element.zoomIn();
    expect(element.zoom).toBe(2);
    element.zoom = 0.25;
    element.zoomOut();
    expect(element.zoom).toBe(0.25);
    element.resetZoom();
    expect(element.zoom).toBe(1);
  });
});
