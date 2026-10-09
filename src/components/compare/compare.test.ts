import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './compare.js';
import { TpCompare } from './compare.js';

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

describe('<tp-compare>', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock());
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function createCompare(): TpCompare {
    document.body.innerHTML = `
      <tp-compare>
        <img slot="before" src="/before.jpg" alt="Avant">
        <img slot="after" src="/after.jpg" alt="Après">
      </tp-compare>
    `;

    return document.querySelector('tp-compare') as TpCompare;
  }

  it('extends HTMLElement', () => {
    const el = document.createElement('tp-compare');

    expect(el).toBeInstanceOf(HTMLElement);
    expect(el).toBeInstanceOf(TpCompare);
  });

  it('injects CSS once', () => {
    const first = createCompare();
    const second = document.createElement('tp-compare');
    second.innerHTML = `
      <img slot="before" src="/a.jpg" alt="A">
      <img slot="after" src="/b.jpg" alt="B">
    `;
    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-compare-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpCompare);
  });

  it('uses horizontal as default orientation', () => {
    const el = createCompare();

    expect(el.orientation).toBe('horizontal');
    expect(el.getAttribute('orientation')).toBe('horizontal');
  });

  it('reflects orientation', () => {
    const el = createCompare();
    el.orientation = 'vertical';

    expect(el.getAttribute('orientation')).toBe('vertical');
    expect(el.orientation).toBe('vertical');
  });

  it('uses 50% as default position', () => {
    const el = createCompare();

    expect(el.position).toBe('50%');
  });

  it('reflects position', () => {
    const el = createCompare();
    el.position = '30%';

    expect(el.getAttribute('position')).toBe('30%');
    expect(el.position).toBe('30%');
  });

  it('throws on invalid position', () => {
    const el = createCompare();

    expect(() => {
      el.position = '30';
    }).toThrow(TypeError);
  });

  it('reflects beforeLabel property', () => {
    const el = createCompare();

    el.beforeLabel = 'Avant';

    expect(el.getAttribute('before-label')).toBe('Avant');
    expect(el.beforeLabel).toBe('Avant');
  });

  it('reflects afterLabel property', () => {
    const el = createCompare();

    el.afterLabel = 'Après';

    expect(el.getAttribute('after-label')).toBe('Après');
    expect(el.afterLabel).toBe('Après');
  });

  it('reflects storageKey property', () => {
    const el = createCompare();

    el.storageKey = 'compare-position';

    expect(el.getAttribute('storage-key')).toBe('compare-position');
    expect(el.storageKey).toBe('compare-position');
  });

  it('creates before and after layers', () => {
    const el = createCompare();

    expect(el.querySelector('[data-tp-compare-layer="before"]')).not.toBeNull();
    expect(el.querySelector('[data-tp-compare-layer="after"]')).not.toBeNull();
  });

  it('moves slot="before" into the before layer', () => {
    const el = createCompare();

    const before = el.querySelector(
      '[data-tp-compare-layer="before"] > [slot="before"]',
    );
    expect(before).not.toBeNull();
  });

  it('moves slot="after" into the after layer', () => {
    const el = createCompare();

    const after = el.querySelector(
      '[data-tp-compare-layer="after"] > [slot="after"]',
    );
    expect(after).not.toBeNull();
  });

  it('creates divider and handle', () => {
    const el = createCompare();

    expect(el.querySelector('[data-tp-compare-divider]')).not.toBeNull();
    expect(el.querySelector('[data-tp-compare-handle]')).not.toBeNull();
  });

  it('creates optional label elements', () => {
    const el = createCompare();

    expect(el.querySelector('[data-tp-compare-label="before"]')).not.toBeNull();
    expect(el.querySelector('[data-tp-compare-label="after"]')).not.toBeNull();
  });

  it('shows before label when before-label is set', () => {
    const el = createCompare();
    el.setAttribute('before-label', 'Avant');

    const label = el.querySelector(
      '[data-tp-compare-label="before"]',
    ) as HTMLElement;

    expect(label.hidden).toBe(false);
    expect(label.textContent).toBe('Avant');
  });

  it('shows after label when after-label is set', () => {
    const el = createCompare();
    el.setAttribute('after-label', 'Après');

    const label = el.querySelector(
      '[data-tp-compare-label="after"]',
    ) as HTMLElement;

    expect(label.hidden).toBe(false);
    expect(label.textContent).toBe('Après');
  });

  it('hides labels when attributes are absent', () => {
    const el = createCompare();

    const beforeLabel = el.querySelector(
      '[data-tp-compare-label="before"]',
    ) as HTMLElement;
    const afterLabel = el.querySelector(
      '[data-tp-compare-label="after"]',
    ) as HTMLElement;

    expect(beforeLabel.hidden).toBe(true);
    expect(afterLabel.hidden).toBe(true);
  });

  it('sets separator aria-orientation for horizontal orientation', () => {
    const el = createCompare();
    const handle = el.querySelector('[data-tp-compare-handle]');

    expect(handle?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('sets separator aria-orientation for vertical orientation', () => {
    const el = createCompare();
    el.orientation = 'vertical';

    const handle = el.querySelector('[data-tp-compare-handle]');

    expect(handle?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('exposes the comparison position as an accessible value', () => {
    const el = createCompare();
    const handle = el.querySelector('[data-tp-compare-handle]');

    expect(handle?.getAttribute('aria-label')).toBe('Comparison position');
    expect(handle?.getAttribute('aria-valuemin')).toBe('5');
    expect(handle?.getAttribute('aria-valuemax')).toBe('95');
    expect(handle?.getAttribute('aria-valuenow')).toBe('50');
    expect(handle?.getAttribute('aria-valuetext')).toBe('50%');
  });

  it('moves the comparison with arrow, Shift, Home and End keys', () => {
    const el = createCompare();
    const handle = el.querySelector('[data-tp-compare-handle]') as HTMLElement;

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(el.position).toBe('51%');

    handle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true }),
    );
    expect(el.position).toBe('61%');

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(el.position).toBe('5%');

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(el.position).toBe('95%');
    expect(handle.getAttribute('aria-valuenow')).toBe('95');
  });

  it('updates CSS variable from position', () => {
    const el = createCompare();
    el.setAttribute('position', '40%');

    expect(el.style.getPropertyValue('--tp-compare-position')).toBe('40%');
  });

  it('loads saved position from localStorage', () => {
    localStorage.setItem('compare-key', '42%');

    document.body.innerHTML = `
      <tp-compare storage-key="compare-key">
        <img slot="before" src="/before.jpg" alt="Avant">
        <img slot="after" src="/after.jpg" alt="Après">
      </tp-compare>
    `;

    const el = document.querySelector('tp-compare') as TpCompare;

    expect(el.position).toBe('42%');
  });

  it('ignores invalid saved position from localStorage', () => {
    localStorage.setItem('compare-key', 'invalid');

    document.body.innerHTML = `
      <tp-compare storage-key="compare-key">
        <img slot="before" src="/before.jpg" alt="Avant">
        <img slot="after" src="/after.jpg" alt="Après">
      </tp-compare>
    `;

    const el = document.querySelector('tp-compare') as TpCompare;

    expect(el.position).toBe('50%');
  });

  it('saves position to localStorage on pointerup', () => {
    const el = createCompare();
    el.setAttribute('storage-key', 'compare-key');

    Object.defineProperty(el, 'getBoundingClientRect', {
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

    const handle = el.querySelector('[data-tp-compare-handle]') as HTMLElement;
    handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 300, clientY: 0 }),
    );
    window.dispatchEvent(new PointerEvent('pointerup'));

    expect(localStorage.getItem('compare-key')).toBe('30%');
  });

  it('reset() restores the initial position', () => {
    document.body.innerHTML = `
      <tp-compare position="35%">
        <img slot="before" src="/before.jpg" alt="Avant">
        <img slot="after" src="/after.jpg" alt="Après">
      </tp-compare>
    `;

    const el = document.querySelector('tp-compare') as TpCompare;

    el.position = '70%';
    el.reset();

    expect(el.position).toBe('35%');
  });

  it('reset() falls back to 50% when no initial position is provided', () => {
    const el = createCompare();

    el.position = '80%';
    el.reset();

    expect(el.position).toBe('50%');
  });

  it('reset() saves the restored position to localStorage', () => {
    document.body.innerHTML = `
      <tp-compare position="40%" storage-key="compare-key">
        <img slot="before" src="/before.jpg" alt="Avant">
        <img slot="after" src="/after.jpg" alt="Après">
      </tp-compare>
    `;

    const el = document.querySelector('tp-compare') as TpCompare;

    el.position = '75%';
    el.reset();

    expect(localStorage.getItem('compare-key')).toBe('40%');
  });

  it('updates position from pointer horizontally', () => {
    const el = createCompare();

    Object.defineProperty(el, 'getBoundingClientRect', {
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

    const handle = el.querySelector('[data-tp-compare-handle]') as HTMLElement;
    handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 250, clientY: 0 }),
    );

    expect(el.position).toBe('25%');
    window.dispatchEvent(new PointerEvent('pointerup'));
  });

  it('updates position from pointer vertically', () => {
    const el = createCompare();
    el.orientation = 'vertical';

    Object.defineProperty(el, 'getBoundingClientRect', {
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

    const handle = el.querySelector('[data-tp-compare-handle]') as HTMLElement;
    handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 0, clientY: 300 }),
    );

    expect(el.position).toBe('30%');
    window.dispatchEvent(new PointerEvent('pointerup'));
  });
});
