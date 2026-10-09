import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './tooltip.js';
import { TpTooltip } from './tooltip.js';

class ResizeObserverMock {
  public static callback: ResizeObserverCallback | undefined;
  public constructor(callback: ResizeObserverCallback) {
    ResizeObserverMock.callback = callback;
  }
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('<tp-tooltip>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  function createTooltip(): TpTooltip {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>
      <tp-tooltip anchor="#anchor">
        <div>Tooltip content</div>
      </tp-tooltip>
    `;

    const element = document.querySelector('tp-tooltip');
    if (!(element instanceof TpTooltip)) {
      throw new Error('Expected <tp-tooltip> instance.');
    }

    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-tooltip');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpTooltip);
  });

  it('injects CSS once', () => {
    const first = createTooltip();
    const second = document.createElement('tp-tooltip');

    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-tooltip-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpTooltip);
  });

  it('uses top as default placement', () => {
    const element = createTooltip();

    expect(element.placement).toBe('top');
  });

  it('reflects anchor property', () => {
    const element = createTooltip();

    element.anchor = '#other';

    expect(element.getAttribute('anchor')).toBe('#other');
  });

  it('reflects placement property', () => {
    const element = createTooltip();

    element.placement = 'bottom';

    expect(element.getAttribute('placement')).toBe('bottom');
    expect(element.placement).toBe('bottom');
  });

  it('reflects offset property', () => {
    const element = createTooltip();

    element.offset = '12px';

    expect(element.getAttribute('offset')).toBe('12px');
    expect(element.offset).toBe('12px');
  });

  it('shows on anchor mouseenter', () => {
    const element = createTooltip();
    const anchor = document.querySelector('#anchor');

    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    anchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(element.open).toBe(true);
  });

  it('hides on anchor mouseleave', () => {
    const element = createTooltip();
    const anchor = document.querySelector('#anchor');

    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    anchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    anchor.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    expect(element.open).toBe(false);
  });

  it('shows on anchor focus', () => {
    const element = createTooltip();
    const anchor = document.querySelector('#anchor');

    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    anchor.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

    expect(element.open).toBe(true);
  });

  it('hides on anchor blur', () => {
    const element = createTooltip();
    const anchor = document.querySelector('#anchor');

    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    anchor.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    anchor.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

    expect(element.open).toBe(false);
  });

  it('sets aria-describedby on the anchor', () => {
    const element = createTooltip();
    const anchor = document.querySelector('#anchor');

    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    expect(anchor.getAttribute('aria-describedby')).toBe(element.id);
    expect(element.getAttribute('role')).toBe('tooltip');
  });

  it('dispatches tp-tooltip-toggle when shown', () => {
    const element = createTooltip();
    const handler = vi.fn();

    element.addEventListener('tp-tooltip-toggle', handler);
    element.show();

    expect(handler).toHaveBeenCalled();

    const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.detail.open).toBe(true);
    expect(event.detail.anchor).toBe('#anchor');
    expect(event.detail.placement).toBe('top');
  });

  it('hides on Escape when open', () => {
    const element = createTooltip();
    element.show();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(element.open).toBe(false);
  });

  it('positions itself relative to the anchor', () => {
    const element = createTooltip();
    const anchor = document.querySelector('#anchor');

    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      bottom: 140,
      height: 40,
      left: 100,
      right: 200,
      top: 100,
      width: 100,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    });

    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      bottom: 0,
      height: 40,
      left: 0,
      right: 0,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    element.show();

    expect(element.style.left).not.toBe('');
    expect(element.style.top).not.toBe('');
  });

  it('retire une ancre vide et refuse un offset invalide', () => {
    const element = createTooltip();
    element.anchor = '';
    expect(element.hasAttribute('anchor')).toBe(false);
    expect(() => { element.offset = 'invalid'; }).toThrow(TypeError);
  });

  it('positionne les placements alternatifs avec un offset CSS', () => {
    const element = createTooltip();
    element.offset = '1rem';
    for (const placement of ['bottom', 'start', 'end'] as const) {
      element.placement = placement;
      element.show();
      expect(element.style.left).not.toBe('');
      expect(element.style.top).not.toBe('');
    }
  });

  it('exerce les frontières interactives et le resize observer', () => {
    class TestTooltip extends TpTooltip {
      public backdropParent(): HTMLElement | null { return this.getBackdropParent(); }
      public backdropContained(): boolean { return this.isBackdropContained(); }
      public inside(target: Node): boolean { return this.isInsideInteractiveBoundary(target); }
    }
    if (!customElements.get('tp-test-tooltip')) {
      customElements.define('tp-test-tooltip', TestTooltip);
    }
    const anchor = document.createElement('button');
    anchor.id = 'test-anchor';
    const element = document.createElement('tp-test-tooltip') as TestTooltip;
    element.anchor = '#test-anchor';
    document.body.append(anchor, element);
    const child = document.createElement('span');
    element.append(child);
    expect(element.backdropParent()).toBeNull();
    expect(element.backdropContained()).toBe(false);
    expect(element.inside(child)).toBe(true);
    expect(element.inside(anchor)).toBe(true);
    ResizeObserverMock.callback?.([], {} as ResizeObserver);
  });

});
