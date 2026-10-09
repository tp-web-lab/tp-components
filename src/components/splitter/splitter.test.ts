import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './splitter.js';
import { TpSplitter } from './splitter.js';

function createLocalStorageMock(): Storage {
  const data = new Map<string, string>();
  return {
    clear: () => {
      data.clear();
    },
    getItem: (key: string) => data.get(String(key)) ?? null,
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => {
      data.delete(String(key));
    },
    setItem: (key: string, value: string) => {
      data.set(String(key), String(value));
    },
    get length() {
      return data.size;
    },
  };
}

describe('<tp-splitter>', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock());
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function createSplitter(): TpSplitter {
    document.body.innerHTML = `
      <tp-splitter>
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;
    return document.querySelector('tp-splitter') as TpSplitter;
  }

  it('extends HTMLElement', () => {
    const el = document.createElement('tp-splitter');
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el).toBeInstanceOf(TpSplitter);
  });

  it('injects CSS once', () => {
    const first = createSplitter();
    const second = document.createElement('tp-splitter');
    second.innerHTML = `
      <dl>
        <dt>start</dt>
        <dd>A</dd>
        <dt>end</dt>
        <dd>B</dd>
      </dl>
    `;
    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-splitter-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpSplitter);
  });

  it('uses the brand color for the divider handle', () => {
    createSplitter();

    const style = document.getElementById('tp-splitter-styles')?.textContent ?? '';

    expect(style).toContain('--tp-splitter-divider-color: var(--tp-brand-fill-mid, #2563eb);');
    expect(style).toContain('background: color-mix(in srgb, var(--tp-splitter-divider-color) 12%, Canvas);');
    expect(style).toContain('background: var(--tp-splitter-divider-color);');
  });

  it('uses horizontal as default axis', () => {
    const el = createSplitter();
    expect(el.axis).toBe('horizontal');
    expect(el.getAttribute('axis')).toBe('horizontal');
  });

  it('reflects axis', () => {
    const el = createSplitter();
    el.axis = 'vertical';

    expect(el.getAttribute('axis')).toBe('vertical');
    expect(el.axis).toBe('vertical');
  });

  it('uses 50% as default position', () => {
    const el = createSplitter();
    expect(el.position).toBe('50%');
  });

  it('reflects position', () => {
    const el = createSplitter();
    el.position = '30%';

    expect(el.getAttribute('position')).toBe('30%');
    expect(el.position).toBe('30%');
  });

  it('throws on invalid position', () => {
    const el = createSplitter();

    expect(() => {
      el.position = '30';
    }).toThrow(TypeError);
  });

  it('creates a divider', () => {
    const el = createSplitter();
    expect(el.querySelector('[data-tp-splitter-divider]')).not.toBeNull();
  });

  it('marks start and end panels', () => {
    const el = createSplitter();

    expect(
      el.querySelector('[data-tp-splitter-panel="start"]')?.textContent,
    ).toBe('Left');
    expect(
      el.querySelector('[data-tp-splitter-panel="end"]')?.textContent,
    ).toBe('Right');
  });

  it('updates CSS variable from position', () => {
    const el = createSplitter();
    el.setAttribute('position', '40%');

    expect(el.style.getPropertyValue('--tp-splitter-position')).toBe('40%');
  });

  it('sets separator aria-orientation for horizontal axis', () => {
    const el = createSplitter();
    const divider = el.querySelector('[data-tp-splitter-divider]');

    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('sets separator aria-orientation for vertical axis', () => {
    const el = createSplitter();
    el.setAttribute('axis', 'vertical');

    const divider = el.querySelector('[data-tp-splitter-divider]');

    expect(divider?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('exposes the divider value and accessible name', () => {
    const el = createSplitter();
    const divider = el.querySelector('[data-tp-splitter-divider]');

    expect(divider?.getAttribute('aria-label')).toBe('Resize panels');
    expect(divider?.getAttribute('aria-valuemin')).toBe('10');
    expect(divider?.getAttribute('aria-valuemax')).toBe('90');
    expect(divider?.getAttribute('aria-valuenow')).toBe('50');
    expect(divider?.getAttribute('aria-valuetext')).toBe('50%');
  });

  it('resizes with arrow, Shift, Home and End keys', () => {
    const el = createSplitter();
    const divider = el.querySelector(
      '[data-tp-splitter-divider]',
    ) as HTMLElement;

    divider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(el.position).toBe('51%');

    divider.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true }),
    );
    expect(el.position).toBe('61%');

    divider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(el.position).toBe('10%');

    divider.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(el.position).toBe('90%');
    expect(divider.getAttribute('aria-valuenow')).toBe('90');
  });

  it('updates position from pointer horizontally', () => {
    const el = createSplitter();
    const dl = el.querySelector('dl') as HTMLDListElement;

    Object.defineProperty(dl, 'getBoundingClientRect', {
      value: () => ({
        width: 1000,
        height: 500,
        top: 0,
        left: 0,
        right: 1000,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    const divider = el.querySelector('[data-tp-splitter-divider]') as HTMLElement;
    divider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 250, clientY: 0 }));

    expect(el.position).toBe('25%');
    window.dispatchEvent(new PointerEvent('pointerup'));
  });

  it('updates position from pointer vertically', () => {
    const el = createSplitter();
    el.setAttribute('axis', 'vertical');

    const dl = el.querySelector('dl') as HTMLDListElement;

    Object.defineProperty(dl, 'getBoundingClientRect', {
      value: () => ({
        width: 500,
        height: 1000,
        top: 0,
        left: 0,
        right: 500,
        bottom: 1000,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    const divider = el.querySelector('[data-tp-splitter-divider]') as HTMLElement;
    divider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, clientY: 300 }));

    expect(el.position).toBe('30%');
    window.dispatchEvent(new PointerEvent('pointerup'));
  });

  it('clamps position between 10% and 90%', () => {
    const el = createSplitter();
    const dl = el.querySelector('dl') as HTMLDListElement;

    Object.defineProperty(dl, 'getBoundingClientRect', {
      value: () => ({
        width: 1000,
        height: 500,
        top: 0,
        left: 0,
        right: 1000,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    const divider = el.querySelector('[data-tp-splitter-divider]') as HTMLElement;
    divider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5, clientY: 0 }));

    expect(el.position).toBe('10%');

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 995, clientY: 0 }));

    expect(el.position).toBe('90%');
    window.dispatchEvent(new PointerEvent('pointerup'));
  });

  it('loads saved position from localStorage', () => {
    localStorage.setItem('my-split', '42%');

    document.body.innerHTML = `
      <tp-splitter storage-key="my-split">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    const el = document.querySelector('tp-splitter') as TpSplitter;

    expect(el.position).toBe('42%');
  });

  it('clamps saved position from localStorage', () => {
    localStorage.setItem('my-split-start', '0%');
    localStorage.setItem('my-split-end', '100%');

    document.body.innerHTML = `
      <tp-splitter storage-key="my-split-start">
        <dl><dt>start</dt><dd>Start</dd><dt>end</dt><dd>End</dd></dl>
      </tp-splitter>
      <tp-splitter storage-key="my-split-end">
        <dl><dt>start</dt><dd>Start</dd><dt>end</dt><dd>End</dd></dl>
      </tp-splitter>
    `;

    const splitters = document.querySelectorAll<TpSplitter>('tp-splitter');

    expect(splitters[0]?.position).toBe('10%');
    expect(splitters[1]?.position).toBe('90%');
  });

  it('ignores invalid saved position from localStorage', () => {
    localStorage.setItem('my-split', 'invalid');

    document.body.innerHTML = `
      <tp-splitter storage-key="my-split">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    const el = document.querySelector('tp-splitter') as TpSplitter;

    expect(el.position).toBe('50%');
  });

  it('saves position to localStorage on pointerup', () => {
    const el = createSplitter();
    el.setAttribute('storage-key', 'my-split');

    const dl = el.querySelector('dl') as HTMLDListElement;

    Object.defineProperty(dl, 'getBoundingClientRect', {
      value: () => ({
        width: 1000,
        height: 500,
        top: 0,
        left: 0,
        right: 1000,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    const divider = el.querySelector('[data-tp-splitter-divider]') as HTMLElement;
    divider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 300, clientY: 0 }));
    window.dispatchEvent(new PointerEvent('pointerup'));

    expect(localStorage.getItem('my-split')).toBe('30%');
  });

  it('dispatches tp-splitter-change on pointerup', () => {
    const el = createSplitter();

    const handler = vi.fn();
    el.addEventListener('tp-splitter-change', handler);

    const dl = el.querySelector('dl') as HTMLDListElement;

    Object.defineProperty(dl, 'getBoundingClientRect', {
      value: () => ({
        width: 1000,
        height: 500,
        top: 0,
        left: 0,
        right: 1000,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    const divider = el.querySelector('[data-tp-splitter-divider]') as HTMLElement;
    divider.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 350, clientY: 0 }));
    window.dispatchEvent(new PointerEvent('pointerup'));

    expect(handler).toHaveBeenCalledTimes(1);

    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.position).toBe('35%');
    expect(event.detail.axis).toBe('horizontal');
  });

  it('reset() restores the initial position', () => {
    document.body.innerHTML = `
      <tp-splitter position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    const el = document.querySelector('tp-splitter') as TpSplitter;

    el.position = '70%';
    expect(el.position).toBe('70%');

    el.reset();
    expect(el.position).toBe('35%');
  });

  it('reset() falls back to 50% when no initial position is provided', () => {
    const el = createSplitter();

    el.position = '80%';
    el.reset();

    expect(el.position).toBe('50%');
  });

  it('reset() saves the restored position to localStorage', () => {
    document.body.innerHTML = `
      <tp-splitter position="40%" storage-key="my-split">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    const el = document.querySelector('tp-splitter') as TpSplitter;

    el.position = '75%';
    el.reset();

    expect(localStorage.getItem('my-split')).toBe('40%');
  });

  it('reset() dispatches tp-splitter-change', () => {
    document.body.innerHTML = `
      <tp-splitter position="45%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    const el = document.querySelector('tp-splitter') as TpSplitter;
    const handler = vi.fn();

    el.addEventListener('tp-splitter-change', handler);

    el.position = '70%';
    el.reset();

    expect(handler).toHaveBeenCalledTimes(1);

    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.position).toBe('45%');
  });
});
