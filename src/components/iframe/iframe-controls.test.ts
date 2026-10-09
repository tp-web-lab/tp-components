import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './iframe.js';
import { TpIframe } from './iframe.js';
import { setupTpIframeControls } from './iframe-controls.js';

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('setupTpIframeControls', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('handles zoom-in action', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="zoom-in"
        type="button"
        data-tp-iframe-action="zoom-in"
        data-tp-iframe-target="#preview"
      >
        Zoom in
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-in');

    expect(iframe).toBeInstanceOf(TpIframe);
    expect(button).toBeInstanceOf(HTMLButtonElement);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1.25);
  });

  it('handles zoom-out action', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="zoom-out"
        type="button"
        data-tp-iframe-action="zoom-out"
        data-tp-iframe-target="#preview"
      >
        Zoom out
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-out');

    expect(iframe).toBeInstanceOf(TpIframe);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(0.75);
  });

  it('handles zoom-reset action with explicit zoom value', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1.5"></tp-iframe>
      <button
        id="zoom-reset"
        type="button"
        data-tp-iframe-action="zoom-reset"
        data-tp-iframe-target="#preview"
        data-tp-iframe-zoom="0.5"
      >
        Reset
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-reset');

    expect(iframe).toBeInstanceOf(TpIframe);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(0.5);
  });

  it('handles zoom-reset action with default zoom value', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1.5"></tp-iframe>
      <button
        id="zoom-reset"
        type="button"
        data-tp-iframe-action="zoom-reset"
        data-tp-iframe-target="#preview"
      >
        Reset
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-reset');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1);
  });

  it('ignores invalid zoom-reset values and falls back to 1', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1.5"></tp-iframe>
      <button
        id="zoom-reset"
        type="button"
        data-tp-iframe-action="zoom-reset"
        data-tp-iframe-target="#preview"
        data-tp-iframe-zoom="invalid"
      >
        Reset
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-reset');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1);
  });

  it('does nothing when the target selector is missing', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="zoom-in"
        type="button"
        data-tp-iframe-action="zoom-in"
      >
        Zoom in
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-in');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1);
  });

  it('does nothing when the target is not found', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="zoom-in"
        type="button"
        data-tp-iframe-action="zoom-in"
        data-tp-iframe-target="#missing"
      >
        Zoom in
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#zoom-in');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1);
  });

  it('does nothing when the target exists but is not a TpIframe', () => {
    document.body.innerHTML = `
      <div id="preview"></div>
      <button
        id="zoom-in"
        type="button"
        data-tp-iframe-action="zoom-in"
        data-tp-iframe-target="#preview"
      >
        Zoom in
      </button>
    `;

    setupTpIframeControls();

    const button = document.querySelector('#zoom-in');
    const target = document.querySelector('#preview');

    expect(target).toBeInstanceOf(HTMLDivElement);

    expect(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }).not.toThrow();
  });

  it('does nothing when the action is invalid', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="invalid-action"
        type="button"
        data-tp-iframe-action="something-else"
        data-tp-iframe-target="#preview"
      >
        Invalid
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const button = document.querySelector('#invalid-action');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1);
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="zoom-in"
        type="button"
        data-tp-iframe-action="zoom-in"
        data-tp-iframe-target="#preview"
      >
        <span id="inner-label">Zoom in</span>
      </button>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const label = document.querySelector('#inner-label');

    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1.25);
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <div id="outside">Outside</div>
    `;

    setupTpIframeControls();

    const iframe = document.querySelector('#preview');
    const outside = document.querySelector('#outside');

    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1);
  });

  it('works with a custom root instead of document', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        id="zoom-in"
        type="button"
        data-tp-iframe-action="zoom-in"
        data-tp-iframe-target="#preview"
      >
        Zoom in
      </button>
    `;

    document.body.append(root);

    setupTpIframeControls(root);

    const iframe = root.querySelector('#preview');
    const button = root.querySelector('#zoom-in');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((iframe as TpIframe).zoom).toBe(1.25);
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <tp-iframe id="preview" zoom="1"></tp-iframe>
      <button
        data-tp-iframe-action="zoom-in"
        data-tp-iframe-target="#preview"
      ></button>
    `;

    document.body.append(root);

    const iframe = root.querySelector('#preview');
    const button = root.querySelector('button');

    expect(iframe).toBeInstanceOf(TpIframe);

    const zoomInSpy = vi.spyOn(iframe as TpIframe, 'zoomIn');

    setupTpIframeControls(root);
    setupTpIframeControls(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(zoomInSpy).toHaveBeenCalledTimes(1);
    expect((iframe as TpIframe).zoom).toBe(1.25);
  });
});