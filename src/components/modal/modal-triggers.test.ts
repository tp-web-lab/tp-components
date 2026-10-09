import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './modal.js';
import { TpModal } from './modal.js';
import {
  setupTpModalTriggers,
  teardownTpModalTriggers,
} from './modal-triggers.js';

describe('setupTpModalTriggers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    teardownTpModalTriggers(document);
    document.body.innerHTML = '';
  });

  it('handles show action', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#modal"
      >
        Show
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#show');
    const modal = document.querySelector('#modal');

    expect(modal).toBeInstanceOf(TpModal);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(true);
  });

  it('handles hide action', () => {
    document.body.innerHTML = `
      <button
        id="hide"
        type="button"
        data-tp-modal-action="hide"
        data-tp-modal-target="#modal"
      >
        Hide
      </button>

      <tp-modal id="modal" open></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#hide');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('handles toggle action from closed to open', () => {
    document.body.innerHTML = `
      <button
        id="toggle"
        type="button"
        data-tp-modal-action="toggle"
        data-tp-modal-target="#modal"
      >
        Toggle
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#toggle');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(true);
  });

  it('handles toggle action from open to closed', () => {
    document.body.innerHTML = `
      <button
        id="toggle"
        type="button"
        data-tp-modal-action="toggle"
        data-tp-modal-target="#modal"
      >
        Toggle
      </button>

      <tp-modal id="modal" open></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#toggle');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('does nothing when target selector is missing', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
      >
        Show
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#show');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('does nothing when target is not found', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#missing"
      >
        Show
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#show');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('does nothing when target exists but is not a TpModal', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#target"
      >
        Show
      </button>

      <div id="target"></div>
    `;

    setupTpModalTriggers();

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
        data-tp-modal-action="other"
        data-tp-modal-target="#modal"
      >
        Invalid
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#invalid');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#modal"
      >
        <span id="inner-label">Show</span>
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const label = document.querySelector('#inner-label');
    const modal = document.querySelector('#modal');

    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(true);
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <div id="outside">Outside</div>
      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();

    const outside = document.querySelector('#outside');
    const modal = document.querySelector('#modal');

    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#modal"
      >
        Show
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    document.body.append(root);

    const modal = root.querySelector('#modal');
    const button = root.querySelector('button');

    expect(modal).toBeInstanceOf(TpModal);

    const showSpy = vi.spyOn(modal as TpModal, 'show');

    setupTpModalTriggers(root);
    setupTpModalTriggers(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect((modal as TpModal).open).toBe(true);
  });

  it('works with a custom root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#modal"
      >
        Show
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    document.body.append(root);

    setupTpModalTriggers(root);

    const button = root.querySelector('#show');
    const modal = root.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(true);
  });

  it('teardown removes the listener', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#modal"
      >
        Show
      </button>

      <tp-modal id="modal"></tp-modal>
    `;

    setupTpModalTriggers();
    teardownTpModalTriggers();

    const button = document.querySelector('#show');
    const modal = document.querySelector('#modal');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect((modal as TpModal).open).toBe(false);
  });

  it('works with backdrop-enabled modal', () => {
    document.body.innerHTML = `
      <button
        id="show"
        type="button"
        data-tp-modal-action="show"
        data-tp-modal-target="#modal"
      >
        Show
      </button>

      <tp-modal id="modal" backdrop></tp-modal>
    `;

    setupTpModalTriggers();

    const button = document.querySelector('#show');
    const modal = document.querySelector('#modal') as TpModal;

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(modal.open).toBe(true);
    expect(document.querySelector('tp-modal-backdrop')).not.toBeNull();
  });
});