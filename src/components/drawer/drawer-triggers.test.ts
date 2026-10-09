import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './drawer.js';
import { TpDrawer } from './drawer.js';
import {
  setupTpDrawerTriggers,
  teardownTpDrawerTriggers,
} from './drawer-triggers.js';

describe('setupTpDrawerTriggers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    teardownTpDrawerTriggers(document);
    document.body.innerHTML = '';
  });

  it('handles show action', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        Show
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#show');
    const drawer = document.querySelector('#drawer');

    expect(drawer).toBeInstanceOf(TpDrawer);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(true);
  });

  it('handles hide action', () => {
    document.body.innerHTML = `
      <button
        id="hide"
        type="button"
        data-tp-drawer-action="hide"
        data-tp-drawer-target="#drawer"
      >
        Hide
      </button>

      <tp-drawer id="drawer" open></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#hide');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('handles toggle action from closed to open', () => {
    document.body.innerHTML = `
      <button
        id="toggle"
        type="button"
        data-tp-drawer-action="toggle"
        data-tp-drawer-target="#drawer"
      >
        Toggle
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#toggle');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(true);
  });

  it('handles toggle action from open to closed', () => {
    document.body.innerHTML = `
      <button
        id="toggle"
        type="button"
        data-tp-drawer-action="toggle"
        data-tp-drawer-target="#drawer"
      >
        Toggle
      </button>

      <tp-drawer id="drawer" open></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#toggle');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('does nothing when target selector is missing', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
      >
        Show
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#show');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('does nothing when target is not found', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#missing"
      >
        Show
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#show');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('does nothing when target exists but is not a TpDrawer', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#target"
      >
        Show
      </button>

      <div id="target"></div>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#show');

    expect(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }).not.toThrow();
  });

  it('does nothing when action is invalid', () => {
    document.body.innerHTML = `
      <button
        id="invalid"
        type="button"
        data-tp-drawer-action="other"
        data-tp-drawer-target="#drawer"
      >
        Invalid
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#invalid');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        <span id="inner-label">Show</span>
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const label = document.querySelector('#inner-label');
    const drawer = document.querySelector('#drawer');

    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(true);
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <div id="outside">Outside</div>
      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const outside = document.querySelector('#outside');
    const drawer = document.querySelector('#drawer');

    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        Show
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    document.body.append(root);

    const drawer = root.querySelector('#drawer');
    const button = root.querySelector('button');

    expect(drawer).toBeInstanceOf(TpDrawer);

    const showSpy = vi.spyOn(drawer as TpDrawer, 'show');

    setupTpDrawerTriggers(root);
    setupTpDrawerTriggers(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect((drawer as TpDrawer).open).toBe(true);
  });

  it('works with a custom root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        Show
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    document.body.append(root);

    setupTpDrawerTriggers(root);

    const button = root.querySelector('#show');
    const drawer = root.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(true);
  });

  it('teardown removes the listener', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        Show
      </button>

      <tp-drawer id="drawer"></tp-drawer>
    `;

    setupTpDrawerTriggers();
    teardownTpDrawerTriggers();

    const button = document.querySelector('#show');
    const drawer = document.querySelector('#drawer');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((drawer as TpDrawer).open).toBe(false);
  });

  it('works with backdrop-enabled drawer', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        Show
      </button>

      <tp-drawer id="drawer" backdrop></tp-drawer>
    `;

    setupTpDrawerTriggers();

    const button = document.querySelector('#show');
    const drawer = document.querySelector('#drawer') as TpDrawer;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(drawer.open).toBe(true);
    expect(document.querySelector('tp-drawer-backdrop')).not.toBeNull();
  });

  it('works with contained drawer', () => {
    const parent = document.createElement('div');
    parent.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-drawer-action="show"
        data-tp-drawer-target="#drawer"
      >
        Show
      </button>

      <tp-drawer id="drawer" contained backdrop></tp-drawer>
    `;

    document.body.append(parent);

    setupTpDrawerTriggers(parent);

    const button = parent.querySelector('#show');
    const drawer = parent.querySelector('#drawer') as TpDrawer;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(drawer.open).toBe(true);
    expect(parent.querySelector('tp-drawer-backdrop')).not.toBeNull();
  });
});