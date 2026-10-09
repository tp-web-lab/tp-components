import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './popover.js';
import { TpPopover } from './popover.js';
import {
  setupTpPopoverTriggers,
  teardownTpPopoverTriggers,
} from './popover-triggers.js';

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('setupTpPopoverTriggers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    teardownTpPopoverTriggers(document);
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('handles show action', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show');
    const popover = document.querySelector('#popover');

    expect(popover).toBeInstanceOf(TpPopover);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(true);
  });

  it('handles hide action', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="hide"
        type="button"
        data-tp-popover-action="hide"
        data-tp-popover-target="#popover"
      >
        Hide
      </button>

      <tp-popover id="popover" anchor="#anchor" open>
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#hide');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('handles toggle action from closed to open', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="toggle"
        type="button"
        data-tp-popover-action="toggle"
        data-tp-popover-target="#popover"
      >
        Toggle
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#toggle');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(true);
  });

  it('handles toggle action from open to closed', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="toggle"
        type="button"
        data-tp-popover-action="toggle"
        data-tp-popover-target="#popover"
      >
        Toggle
      </button>

      <tp-popover id="popover" anchor="#anchor" open>
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#toggle');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('does nothing when target selector is missing', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('does nothing when target is not found', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#missing"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('does nothing when target exists but is not a TpPopover', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#target"
      >
        Show
      </button>

      <div id="target"></div>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show');

    expect(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }).not.toThrow();
  });

  it('does nothing when action is invalid', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="invalid"
        type="button"
        data-tp-popover-action="other"
        data-tp-popover-target="#popover"
      >
        Invalid
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#invalid');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover"
      >
        <span id="inner-label">Show</span>
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const label = document.querySelector('#inner-label');
    const popover = document.querySelector('#popover');

    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(true);
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>
      <div id="outside">Outside</div>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const outside = document.querySelector('#outside');
    const popover = document.querySelector('#popover');

    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    document.body.append(root);

    const popover = root.querySelector('#popover');
    const button = root.querySelector('button[data-tp-popover-action]');

    expect(popover).toBeInstanceOf(TpPopover);

    const showSpy = vi.spyOn(popover as TpPopover, 'show');

    setupTpPopoverTriggers(root);
    setupTpPopoverTriggers(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect((popover as TpPopover).open).toBe(true);
  });

  it('works with a custom root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    document.body.append(root);

    setupTpPopoverTriggers(root);

    const button = root.querySelector('#show');
    const popover = root.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(true);
  });

  it('teardown removes the listener', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor">
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();
    teardownTpPopoverTriggers();

    const button = document.querySelector('#show');
    const popover = document.querySelector('#popover');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((popover as TpPopover).open).toBe(false);
  });

  it('works with backdrop-enabled popover', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover"
      >
        Show
      </button>

      <tp-popover id="popover" anchor="#anchor" backdrop>
        <div>Content</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show');
    const popover = document.querySelector('#popover') as TpPopover;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(popover.open).toBe(true);
    expect(document.querySelector('tp-popover-backdrop')).not.toBeNull();
  });

  it('exclusive show closes other open popovers', () => {
    document.body.innerHTML = `
      <button id="anchor-a">Anchor A</button>
      <button id="anchor-b">Anchor B</button>

      <button
        id="show-b"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover-b"
        data-tp-popover-exclusive
      >
        Show B
      </button>

      <tp-popover id="popover-a" anchor="#anchor-a" open>
        <div>Content A</div>
      </tp-popover>

      <tp-popover id="popover-b" anchor="#anchor-b">
        <div>Content B</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show-b');
    const popoverA = document.querySelector('#popover-a') as TpPopover;
    const popoverB = document.querySelector('#popover-b') as TpPopover;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(popoverA.open).toBe(false);
    expect(popoverB.open).toBe(true);
  });

  it('exclusive toggle closes other open popovers only when opening', () => {
    document.body.innerHTML = `
      <button id="anchor-a">Anchor A</button>
      <button id="anchor-b">Anchor B</button>

      <button
        id="toggle-b"
        type="button"
        data-tp-popover-action="toggle"
        data-tp-popover-target="#popover-b"
        data-tp-popover-exclusive
      >
        Toggle B
      </button>

      <tp-popover id="popover-a" anchor="#anchor-a" open>
        <div>Content A</div>
      </tp-popover>

      <tp-popover id="popover-b" anchor="#anchor-b">
        <div>Content B</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#toggle-b');
    const popoverA = document.querySelector('#popover-a') as TpPopover;
    const popoverB = document.querySelector('#popover-b') as TpPopover;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(popoverA.open).toBe(false);
    expect(popoverB.open).toBe(true);
  });

  it('exclusive toggle does not reopen others when closing current popover', () => {
    document.body.innerHTML = `
      <button id="anchor-a">Anchor A</button>
      <button id="anchor-b">Anchor B</button>

      <button
        id="toggle-b"
        type="button"
        data-tp-popover-action="toggle"
        data-tp-popover-target="#popover-b"
        data-tp-popover-exclusive
      >
        Toggle B
      </button>

      <tp-popover id="popover-a" anchor="#anchor-a">
        <div>Content A</div>
      </tp-popover>

      <tp-popover id="popover-b" anchor="#anchor-b" open>
        <div>Content B</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#toggle-b');
    const popoverA = document.querySelector('#popover-a') as TpPopover;
    const popoverB = document.querySelector('#popover-b') as TpPopover;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(popoverA.open).toBe(false);
    expect(popoverB.open).toBe(false);
  });

  it('non-exclusive triggers do not close other popovers', () => {
    document.body.innerHTML = `
      <button id="anchor-a">Anchor A</button>
      <button id="anchor-b">Anchor B</button>

      <button
        id="show-b"
        type="button"
        data-tp-popover-action="show"
        data-tp-popover-target="#popover-b"
      >
        Show B
      </button>

      <tp-popover id="popover-a" anchor="#anchor-a" open>
        <div>Content A</div>
      </tp-popover>

      <tp-popover id="popover-b" anchor="#anchor-b">
        <div>Content B</div>
      </tp-popover>
    `;

    setupTpPopoverTriggers();

    const button = document.querySelector('#show-b');
    const popoverA = document.querySelector('#popover-a') as TpPopover;
    const popoverB = document.querySelector('#popover-b') as TpPopover;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(popoverA.open).toBe(true);
    expect(popoverB.open).toBe(true);
  });
});