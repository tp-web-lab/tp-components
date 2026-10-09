import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './tooltip.js';
import { TpTooltip } from './tooltip.js';
import {
  setupTpTooltipTriggers,
  teardownTpTooltipTriggers,
} from './tooltip-triggers.js';

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('setupTpTooltipTriggers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    teardownTpTooltipTriggers(document);
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('handles show action', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#tooltip"
      >
        Show
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#show');
    const tooltip = document.querySelector('#tooltip');

    expect(tooltip).toBeInstanceOf(TpTooltip);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(true);
  });

  it('handles hide action', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="hide"
        type="button"
        data-tp-tooltip-action="hide"
        data-tp-tooltip-target="#tooltip"
      >
        Hide
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor" open>
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#hide');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });

  it('handles toggle action from closed to open', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="toggle"
        type="button"
        data-tp-tooltip-action="toggle"
        data-tp-tooltip-target="#tooltip"
      >
        Toggle
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#toggle');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(true);
  });

  it('handles toggle action from open to closed', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="toggle"
        type="button"
        data-tp-tooltip-action="toggle"
        data-tp-tooltip-target="#tooltip"
      >
        Toggle
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor" open>
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#toggle');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });

  it('does nothing when target selector is missing', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
      >
        Show
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#show');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });

  it('does nothing when target is not found', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#missing"
      >
        Show
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#show');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });

  it('does nothing when target exists but is not a TpTooltip', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#target"
      >
        Show
      </button>

      <div id="target"></div>
    `;

    setupTpTooltipTriggers();

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
        data-tp-tooltip-action="other"
        data-tp-tooltip-target="#tooltip"
      >
        Invalid
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const button = document.querySelector('#invalid');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#tooltip"
      >
        <span id="inner-label">Show</span>
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const label = document.querySelector('#inner-label');
    const tooltip = document.querySelector('#tooltip');

    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(true);
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>
      <div id="outside">Outside</div>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();

    const outside = document.querySelector('#outside');
    const tooltip = document.querySelector('#tooltip');

    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#tooltip"
      >
        Show
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    document.body.append(root);

    const tooltip = root.querySelector('#tooltip');
    const button = root.querySelector('button[data-tp-tooltip-action]');

    expect(tooltip).toBeInstanceOf(TpTooltip);

    const showSpy = vi.spyOn(tooltip as TpTooltip, 'show');

    setupTpTooltipTriggers(root);
    setupTpTooltipTriggers(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect((tooltip as TpTooltip).open).toBe(true);
  });

  it('works with a custom root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#tooltip"
      >
        Show
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    document.body.append(root);

    setupTpTooltipTriggers(root);

    const button = root.querySelector('#show');
    const tooltip = root.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(true);
  });

  it('teardown removes the listener', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-tooltip-action="show"
        data-tp-tooltip-target="#tooltip"
      >
        Show
      </button>

      <tp-tooltip id="tooltip" anchor="#anchor">
        <div>Content</div>
      </tp-tooltip>
    `;

    setupTpTooltipTriggers();
    teardownTpTooltipTriggers();

    const button = document.querySelector('#show');
    const tooltip = document.querySelector('#tooltip');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((tooltip as TpTooltip).open).toBe(false);
  });
});