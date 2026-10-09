import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './dropdown.js';
import '../divider/divider.js';
import { TpDropdown } from './dropdown.js';

class ResizeObserverMock {
  public static callback: ResizeObserverCallback | undefined;
  public constructor(callback: ResizeObserverCallback) {
    ResizeObserverMock.callback = callback;
  }
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('<tp-dropdown>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  function createDropdown(): TpDropdown {
    document.body.innerHTML = `
      <button id="anchor">Actions</button>

      <tp-dropdown anchor="#anchor" outside-click>
        <ul>
          <li>Rename</li>
          <li>
            Export
            <ul>
              <li>HTML</li>
              <li>Markdown</li>
            </ul>
          </li>
          <li>Delete</li>
        </ul>
      </tp-dropdown>
    `;

    const element = document.querySelector('tp-dropdown');
    if (!(element instanceof TpDropdown)) {
      throw new Error('Expected <tp-dropdown> instance.');
    }

    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-dropdown');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpDropdown);
  });

  it('injects CSS once', () => {
    const first = createDropdown();

    const second = document.createElement('tp-dropdown');
    second.innerHTML = '<ul><li>One</li></ul>';
    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-dropdown-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpDropdown);

    const styleEl = document.getElementById('tp-dropdown-styles');
    expect(styleEl?.textContent).toContain('box-sizing: border-box;');
    expect(styleEl?.textContent).toContain('display: block;');
  });

  it('uses bottom as default placement', () => {
    const element = createDropdown();

    expect(element.placement).toBe('bottom');
  });

  it('reflects anchor property', () => {
    const element = createDropdown();

    element.anchor = '#other';

    expect(element.getAttribute('anchor')).toBe('#other');
  });

  it('reflects placement property', () => {
    const element = createDropdown();

    element.placement = 'end';

    expect(element.getAttribute('placement')).toBe('end');
    expect(element.placement).toBe('end');
  });

  it('reflects offset property', () => {
    const element = createDropdown();

    element.offset = '12px';

    expect(element.getAttribute('offset')).toBe('12px');
    expect(element.offset).toBe('12px');
  });

  it('show() opens the dropdown', () => {
    const element = createDropdown();

    element.show();

    expect(element.open).toBe(true);
  });

  it('hide() closes the dropdown', () => {
    const element = createDropdown();
    element.show();

    element.hide();

    expect(element.open).toBe(false);
  });

  it('toggle() toggles the open state', () => {
    const element = createDropdown();

    element.toggle();
    expect(element.open).toBe(true);

    element.toggle();
    expect(element.open).toBe(false);
  });

  it('assigns role="menu" to root ul', () => {
    const element = createDropdown();
    const root = element.querySelector(':scope > ul');

    expect(root?.getAttribute('role')).toBe('menu');
  });

  it('captures data-source before adding menu roles', () => {
    const element = createDropdown();
    const source = element.getAttribute('data-source') ?? '';

    expect(source).toContain('<tp-dropdown anchor="#anchor" outside-click>');
    expect(source).toContain('<ul>');
    expect(source).toContain('<li>Rename</li>');
    expect(source).not.toContain('role="menu"');
    expect(source).not.toContain('role="menuitem"');
    expect(source).not.toContain('tabindex');
    expect(source).not.toContain('aria-haspopup');
    expect(source).not.toContain('aria-expanded');
  });

  it('assigns role="menuitem" to li elements', () => {
    const element = createDropdown();
    const items = element.querySelectorAll('li');

    expect(items[0]?.getAttribute('role')).toBe('menuitem');
    expect(items[1]?.getAttribute('role')).toBe('menuitem');
  });

  it('supports tp-divider directly inside a menu list', () => {
    document.body.innerHTML = `
      <tp-dropdown open>
        <ul>
          <li>Load</li>
          <tp-divider></tp-divider>
          <li>Save</li>
        </ul>
      </tp-dropdown>
    `;

    const element = document.querySelector('tp-dropdown');
    const divider = element?.querySelector('tp-divider');
    const items = element?.querySelectorAll('li');

    expect(divider?.getAttribute('role')).toBe('separator');
    expect(items?.[0]?.getAttribute('role')).toBe('menuitem');
    expect(items?.[1]?.getAttribute('role')).toBe('menuitem');
    expect(items?.[0]?.getAttribute('tabindex')).toBe('0');
    expect(items?.[1]?.getAttribute('tabindex')).toBe('-1');
  });

  it('detects submenu items', () => {
    const element = createDropdown();
    const items = element.querySelectorAll('li');

    expect(items[1]?.getAttribute('aria-haspopup')).toBe('menu');
    expect(items[1]?.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens submenu on click', () => {
    const element = createDropdown();
    const items = element.querySelectorAll('li');

    items[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(items[1]?.getAttribute('aria-expanded')).toBe('true');
  });

  it('supports ArrowDown navigation', () => {
    const element = createDropdown();
    const items = element.querySelectorAll('li');

    items[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
    );

    expect(items[1]?.getAttribute('tabindex')).toBe('0');
  });

  it('supports ArrowRight to open submenu', () => {
    const element = createDropdown();
    const items = element.querySelectorAll('li');

    items[1]?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
    );

    expect(items[1]?.getAttribute('aria-expanded')).toBe('true');
  });

  it('hides when activating a leaf item with Enter', () => {
    const element = createDropdown();
    element.show();

    const items = element.querySelectorAll('li');

    items[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }),
    );

    expect(element.open).toBe(false);
  });

  it('hides on Escape', () => {
    const element = createDropdown();
    element.show();

    const items = element.querySelectorAll('li');

    items[0]?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
    );

    expect(element.open).toBe(false);
  });

  it('closes on outside click when outside-click is present', () => {
    const element = createDropdown();
    element.show();

    const outside = document.createElement('div');
    document.body.append(outside);

    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(false);
  });

  it('does not close when clicking the anchor', () => {
    const element = createDropdown();
    element.show();

    const anchor = document.querySelector('#anchor');
    if (!(anchor instanceof HTMLElement)) {
      throw new Error('Expected anchor element');
    }

    anchor.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(element.open).toBe(true);
  });

  it('positions itself relative to the anchor', () => {
    const element = createDropdown();
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
      height: 80,
      left: 0,
      right: 0,
      top: 0,
      width: 140,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    element.show();

    expect(element.style.left).not.toBe('');
    expect(element.style.top).not.toBe('');
  });

  it('applies viewport scroll constraints for every dropdown', () => {
    const element = createDropdown();
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
      height: 800,
      left: 0,
      right: 0,
      top: 0,
      width: 140,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    element.show();

    expect(element.style.top).toBe('148px');
    expect(element.style.maxHeight).not.toBe('');
    expect(element.style.maxBlockSize).not.toBe('');
    expect(element.style.height).not.toBe('');
    expect(element.style.overflowY).toBe('auto');
    expect(element.style.overscrollBehavior).toBe('contain');
  });

  it('keeps wheel scrolling inside a scrollable dropdown', () => {
    const element = createDropdown();
    element.show();
    element.style.overflowY = 'auto';
    element.scrollTop = 10;

    Object.defineProperty(element, 'clientHeight', {
      configurable: true,
      value: 100,
    });

    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 300,
    });

    const event = new WheelEvent('wheel', {
      cancelable: true,
      deltaY: 20,
    });

    const dispatched = element.dispatchEvent(event);

    expect(dispatched).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(element.scrollTop).toBe(30);
  });

  it('dispatches tp-dropdown-toggle when shown', () => {
    const element = createDropdown();
    const handler = vi.fn();

    element.addEventListener('tp-dropdown-toggle', handler);
    element.show();

    expect(handler).toHaveBeenCalled();

    const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.detail.open).toBe(true);
    expect(event.detail.anchor).toBe('#anchor');
    expect(event.detail.placement).toBe('bottom');
  });

  it('retire une ancre vide et refuse un offset invalide', () => {
    const element = createDropdown();
    element.anchor = '';
    expect(element.hasAttribute('anchor')).toBe(false);
    expect(() => { element.offset = 'invalid'; }).toThrow(TypeError);
  });

  it('couvre les autres commandes clavier du menu', () => {
    const element = createDropdown();
    element.show();
    const items = element.querySelectorAll<HTMLLIElement>(':scope > ul > li');
    const first = items[0];
    const last = items[items.length - 1];
    if (first === undefined || last === undefined) throw new Error('Menu items missing');
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(last.tabIndex).toBe(0);
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(first.tabIndex).toBe(0);
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(last.tabIndex).toBe(0);
  });

  it('positionne les placements alternatifs avec un offset CSS', () => {
    const element = createDropdown();
    element.offset = '1rem';
    for (const placement of ['top', 'start', 'end'] as const) {
      element.placement = placement;
      element.show();
      expect(element.style.left).not.toBe('');
      expect(element.style.top).not.toBe('');
    }
  });

  it('tolère un contenu sans liste et réagit au redimensionnement', () => {
    const empty = document.createElement('tp-dropdown');
    document.body.append(empty);
    ResizeObserverMock.callback?.([], {} as ResizeObserver);
    expect(empty.querySelector('[role="menu"]')).toBeNull();
  });

  it('déclare un backdrop non contenu', () => {
    class TestDropdown extends TpDropdown {
      public backdropParent(): HTMLElement | null { return this.getBackdropParent(); }
      public backdropContained(): boolean { return this.isBackdropContained(); }
    }
    if (!customElements.get('tp-test-dropdown')) {
      customElements.define('tp-test-dropdown', TestDropdown);
    }
    const element = document.createElement('tp-test-dropdown') as TestDropdown;
    expect(element.backdropParent()).toBeNull();
    expect(element.backdropContained()).toBe(false);
  });

});
