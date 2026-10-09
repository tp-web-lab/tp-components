import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './popover.js';
import { TpPopover } from './popover.js';

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('<tp-popover>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  function createPopover(): TpPopover {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>
      <tp-popover anchor="#anchor">
        <div>Popover content</div>
      </tp-popover>
    `;

    const element = document.querySelector('tp-popover');
    if (!(element instanceof TpPopover)) {
      throw new Error('Expected <tp-popover> instance.');
    }

    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-popover');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpPopover);
  });

  it('injects CSS once', () => {
    const first = createPopover();
    const second = document.createElement('tp-popover');

    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-popover-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpPopover);
  });

  it('uses bottom as default placement', () => {
    const element = createPopover();

    expect(element.placement).toBe('bottom');
  });

  it('reflects anchor property', () => {
    const element = createPopover();

    element.anchor = '#other';

    expect(element.getAttribute('anchor')).toBe('#other');
    expect(element.anchor).toBe('#other');
  });

  it('reflects placement property', () => {
    const element = createPopover();

    element.placement = 'top';

    expect(element.getAttribute('placement')).toBe('top');
    expect(element.placement).toBe('top');
  });

  it('reflects offset property', () => {
    const element = createPopover();

    element.offset = '12px';

    expect(element.getAttribute('offset')).toBe('12px');
    expect(element.offset).toBe('12px');
  });

  it('throws on invalid offset', () => {
    const element = createPopover();

    expect(() => {
      element.offset = 'abc';
    }).toThrow(TypeError);
  });

  it('show() opens the popover', () => {
    const element = createPopover();

    element.show();

    expect(element.open).toBe(true);
    expect(element.getAttribute('data-open')).toBe('true');
  });

  it('hide() closes the popover', () => {
    const element = createPopover();
    element.show();

    element.hide();

    expect(element.open).toBe(false);
    expect(element.getAttribute('data-open')).toBe('false');
  });

  it('toggle() toggles the open state', () => {
    const element = createPopover();

    element.toggle();
    expect(element.open).toBe(true);

    element.toggle();
    expect(element.open).toBe(false);
  });

  it('creates a backdrop when backdrop is present', () => {
    const element = createPopover();
    element.backdrop = true;

    const backdrop = document.querySelector('tp-popover-backdrop');

    expect(backdrop).not.toBeNull();
  });

  it('clicking the backdrop hides the popover', () => {
    const element = createPopover();
    element.backdrop = true;
    element.show();

    const backdrop = document.querySelector('tp-popover-backdrop');
    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('Expected popover backdrop element');
    }

    backdrop.click();

    expect(element.open).toBe(false);
  });

  it('hides on Escape when open', () => {
    const element = createPopover();
    element.show();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(element.open).toBe(false);
  });

  it('dispatches tp-popover-toggle when shown', () => {
    const element = createPopover();
    const handler = vi.fn();

    element.addEventListener('tp-popover-toggle', handler);
    element.show();

    expect(handler).toHaveBeenCalled();

    const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.detail.open).toBe(true);
    expect(event.detail.anchor).toBe('#anchor');
    expect(event.detail.placement).toBe('bottom');
  });

  it('positions itself relative to the anchor', () => {
    const element = createPopover();
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
      height: 60,
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

  it('closes when clicking outside the popover and anchor', () => {
    const element = createPopover();
    element.setAttribute('outside-click', '');
    element.show();

    const outside = document.createElement('div');
    document.body.append(outside);

    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(false);
  });

  it('does not close when clicking inside the popover', () => {
    const element = createPopover();
    element.show();

    const content = element.querySelector('div');
    if (!(content instanceof HTMLElement)) {
      throw new Error('Expected popover content element');
    }

    content.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(true);
  });

  it('does not close when clicking the anchor', () => {
    const element = createPopover();
    element.show();

    const anchor = document.querySelector('#anchor');
    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    anchor.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(true);
  });

  it('still closes with backdrop click when backdrop is enabled', () => {
    const element = createPopover();
    element.backdrop = true;
    element.show();

    const backdrop = document.querySelector('tp-popover-backdrop');
    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('Expected popover backdrop element');
    }

    backdrop.click();

    expect(element.open).toBe(false);
  });

  it('outsideClick is false by default', () => {
    const element = createPopover();

    expect(element.outsideClick).toBe(false);
  });

  it('outsideClick becomes true when attribute is present', () => {
    const element = createPopover();

    element.setAttribute('outside-click', '');

    expect(element.outsideClick).toBe(true);
  });

  it('outsideClick property reflects attribute', () => {
    const element = createPopover();

    element.outsideClick = true;
    expect(element.hasAttribute('outside-click')).toBe(true);

    element.outsideClick = false;
    expect(element.hasAttribute('outside-click')).toBe(false);
  });

  it('does not close on outside click when outside-click is absent', () => {
    const element = createPopover();
    element.show();

    const outside = document.createElement('div');
    document.body.append(outside);

    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(true);
  });

  it('closes on outside click when outside-click is present', () => {
    const element = createPopover();
    element.setAttribute('outside-click', '');
    element.show();

    const outside = document.createElement('div');
    document.body.append(outside);

    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(false);
  });

  it('retire une ancre vide et reflète outsideClick dans les deux sens', () => {
    const element = createPopover();
    element.anchor = '';
    element.outsideClick = true;
    expect(element.hasAttribute('anchor')).toBe(false);
    expect(element.outsideClick).toBe(true);
    element.outsideClick = false;
    expect(element.outsideClick).toBe(false);
  });

  it('positionne les placements alternatifs avec un offset CSS', () => {
    const element = createPopover();
    element.offset = '1rem';
    for (const placement of ['top', 'start', 'end'] as const) {
      element.placement = placement;
      element.show();
      expect(element.style.left).not.toBe('');
      expect(element.style.top).not.toBe('');
    }
  });
});
