import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './dropdown.js';
import { TpDropdown } from './dropdown.js';
import {
  setupTpDropdownTriggers,
  teardownTpDropdownTriggers,
} from './dropdown-triggers.js';

class ResizeObserverMock {
  public observe = vi.fn();
  public disconnect = vi.fn();
}

describe('setupTpDropdownTriggers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    teardownTpDropdownTriggers(document);
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('handles show action', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown"
      >
        Show
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#show');
    const dropdown = document.querySelector('#dropdown');

    expect(dropdown).toBeInstanceOf(TpDropdown);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(true);
  });

  it('handles hide action', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="hide"
        type="button"
        data-tp-dropdown-action="hide"
        data-tp-dropdown-target="#dropdown"
      >
        Hide
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor" open>
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#hide');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('handles toggle action from closed to open', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="toggle"
        type="button"
        data-tp-dropdown-action="toggle"
        data-tp-dropdown-target="#dropdown"
      >
        Toggle
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#toggle');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(true);
  });

  it('handles toggle action from open to closed', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="toggle"
        type="button"
        data-tp-dropdown-action="toggle"
        data-tp-dropdown-target="#dropdown"
      >
        Toggle
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor" open>
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#toggle');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('does nothing when target selector is missing', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
      >
        Show
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#show');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('does nothing when target is not found', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#missing"
      >
        Show
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#show');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('does nothing when target exists but is not a TpDropdown', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#target"
      >
        Show
      </button>

      <div id="target"></div>
    `;

    setupTpDropdownTriggers();

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
        data-tp-dropdown-action="other"
        data-tp-dropdown-target="#dropdown"
      >
        Invalid
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#invalid');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown"
      >
        <span id="inner-label">Show</span>
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const label = document.querySelector('#inner-label');
    const dropdown = document.querySelector('#dropdown');

    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(true);
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>
      <div id="outside">Outside</div>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const outside = document.querySelector('#outside');
    const dropdown = document.querySelector('#dropdown');

    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown"
      >
        Show
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    document.body.append(root);

    const dropdown = root.querySelector('#dropdown');
    const button = root.querySelector('button[data-tp-dropdown-action]');

    expect(dropdown).toBeInstanceOf(TpDropdown);

    const showSpy = vi.spyOn(dropdown as TpDropdown, 'show');

    setupTpDropdownTriggers(root);
    setupTpDropdownTriggers(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect((dropdown as TpDropdown).open).toBe(true);
  });

  it('works with a custom root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown"
      >
        Show
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    document.body.append(root);

    setupTpDropdownTriggers(root);

    const button = root.querySelector('#show');
    const dropdown = root.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(true);
  });

  it('teardown removes the listener', () => {
    document.body.innerHTML = `
      <button id="anchor">Anchor</button>

      <button
        id="show"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown"
      >
        Show
      </button>

      <tp-dropdown id="dropdown" anchor="#anchor">
        <ul>
          <li>Item</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();
    teardownTpDropdownTriggers();

    const button = document.querySelector('#show');
    const dropdown = document.querySelector('#dropdown');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((dropdown as TpDropdown).open).toBe(false);
  });

  it('exclusive show closes other open dropdowns', () => {
    document.body.innerHTML = `
      <button id="anchor-a">Anchor A</button>
      <button id="anchor-b">Anchor B</button>

      <button
        id="show-b"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown-b"
        data-tp-dropdown-exclusive
      >
        Show B
      </button>

      <tp-dropdown id="dropdown-a" anchor="#anchor-a" open>
        <ul>
          <li>A</li>
        </ul>
      </tp-dropdown>

      <tp-dropdown id="dropdown-b" anchor="#anchor-b">
        <ul>
          <li>B</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#show-b');
    const dropdownA = document.querySelector('#dropdown-a') as TpDropdown;
    const dropdownB = document.querySelector('#dropdown-b') as TpDropdown;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(dropdownA.open).toBe(false);
    expect(dropdownB.open).toBe(true);
  });

  it('non-exclusive triggers do not close other dropdowns', () => {
    document.body.innerHTML = `
      <button id="anchor-a">Anchor A</button>
      <button id="anchor-b">Anchor B</button>

      <button
        id="show-b"
        type="button"
        data-tp-dropdown-action="show"
        data-tp-dropdown-target="#dropdown-b"
      >
        Show B
      </button>

      <tp-dropdown id="dropdown-a" anchor="#anchor-a" open>
        <ul>
          <li>A</li>
        </ul>
      </tp-dropdown>

      <tp-dropdown id="dropdown-b" anchor="#anchor-b">
        <ul>
          <li>B</li>
        </ul>
      </tp-dropdown>
    `;

    setupTpDropdownTriggers();

    const button = document.querySelector('#show-b');
    const dropdownA = document.querySelector('#dropdown-a') as TpDropdown;
    const dropdownB = document.querySelector('#dropdown-b') as TpDropdown;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(dropdownA.open).toBe(true);
    expect(dropdownB.open).toBe(true);
  });
});