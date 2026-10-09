import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './modal.js';
import { TpModal } from './modal.js';

describe('<tp-modal> after overlay refactor', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends TpModal', () => {
    const element = document.createElement('tp-modal') as TpModal;

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpModal);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-modal') as TpModal;
    const second = document.createElement('tp-modal') as TpModal;

    document.body.append(first, second);

    expect(document.head.querySelectorAll('#tp-modal-styles')).toHaveLength(1);
  });

  it('reflects open property', () => {
    const element = document.createElement('tp-modal') as TpModal;

    expect(element.open).toBe(false);

    element.open = true;
    expect(element.hasAttribute('open')).toBe(true);
    expect(element.open).toBe(true);

    element.open = false;
    expect(element.hasAttribute('open')).toBe(false);
    expect(element.open).toBe(false);
  });

  it('reflects backdrop property', () => {
    const element = document.createElement('tp-modal') as TpModal;

    expect(element.backdrop).toBe(false);

    element.backdrop = true;
    expect(element.hasAttribute('backdrop')).toBe(true);

    element.backdrop = false;
    expect(element.hasAttribute('backdrop')).toBe(false);
  });

  it('reflects fixed property', () => {
    const element = document.createElement('tp-modal') as TpModal;

    expect(element.fixed).toBe(false);

    element.fixed = true;
    expect(element.hasAttribute('fixed')).toBe(true);

    element.fixed = false;
    expect(element.hasAttribute('fixed')).toBe(false);
  });

  it('reflects breakout property', () => {
    const element = document.createElement('tp-modal') as TpModal;

    expect(element.breakout).toBe(false);

    element.breakout = true;
    expect(element.hasAttribute('breakout')).toBe(true);

    element.breakout = false;
    expect(element.hasAttribute('breakout')).toBe(false);
  });

  it('reflects margin property', () => {
    const element = document.createElement('tp-modal') as TpModal;

    element.margin = '1rem';
    expect(element.getAttribute('margin')).toBe('1rem');
    expect(element.margin).toBe('1rem');

    element.margin = '';
    expect(element.hasAttribute('margin')).toBe(false);
  });

  it('show() opens the modal', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    element.show();

    expect(element.open).toBe(true);
    expect(element.getAttribute('data-open')).toBe('true');
  });

  it('hide() closes the modal', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.open = true;
    document.body.append(element);

    element.hide();

    expect(element.open).toBe(false);
    expect(element.getAttribute('data-open')).toBe('false');
  });

  it('uses contain mode by default', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    expect(element.classList.contains('contain')).toBe(true);
  });

  it('removes contain mode when breakout is true', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.setAttribute('breakout', '');

    document.body.append(element);

    expect(element.classList.contains('contain')).toBe(false);
  });

  it('applies margin through CSS custom property', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    element.setAttribute('margin', '2rem');

    expect(element.style.getPropertyValue('--tp-modal-margin')).toBe('2rem');
  });

  it('removes margin custom property when margin is removed', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    element.setAttribute('margin', '2rem');
    element.removeAttribute('margin');

    expect(element.style.getPropertyValue('--tp-modal-margin')).toBe('');
  });

  it('creates a backdrop when backdrop is present', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.setAttribute('backdrop', '');

    document.body.append(element);

    const backdrop = document.body.querySelector('tp-modal-backdrop');

    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute('data-open')).toBe('false');
  });

  it('updates backdrop state when modal opens', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.setAttribute('backdrop', '');

    document.body.append(element);
    element.show();

    const backdrop = document.body.querySelector('tp-modal-backdrop');

    expect(backdrop?.getAttribute('data-open')).toBe('true');
  });

  it('appends fixed backdrop to document.body', () => {
    const parent = document.createElement('div');
    const element = document.createElement('tp-modal') as TpModal;

    parent.append(element);
    document.body.append(parent);

    element.setAttribute('fixed', '');
    element.setAttribute('backdrop', '');

    const backdrop = document.body.querySelector('tp-modal-backdrop');

    expect(backdrop).not.toBeNull();
    expect(backdrop?.parentElement).toBe(document.body);
    expect(backdrop?.getAttribute('data-contained')).toBe('false');
  });

  it('appends non-fixed backdrop to the parent element', () => {
    const parent = document.createElement('div');
    const element = document.createElement('tp-modal') as TpModal;

    parent.append(element);
    document.body.append(parent);

    element.setAttribute('backdrop', '');

    const backdrop = parent.querySelector('tp-modal-backdrop');

    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute('data-contained')).toBe('true');
  });

  it('removes backdrop when backdrop attribute is removed', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.setAttribute('backdrop', '');
    document.body.append(element);

    element.removeAttribute('backdrop');

    expect(document.querySelector('tp-modal-backdrop')).toBeNull();
  });

  it('clicking the backdrop hides the modal', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.setAttribute('backdrop', '');
    element.setAttribute('open', '');
    document.body.append(element);

    const backdrop = document.querySelector('tp-modal-backdrop') as HTMLElement;
    backdrop.click();

    expect(element.open).toBe(false);
  });

  it('hides on Escape when open', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.setAttribute('open', '');
    document.body.append(element);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(element.open).toBe(false);
  });

  it('exposes modal dialog semantics', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    expect(element.getAttribute('role')).toBe('dialog');
    expect(element.getAttribute('aria-modal')).toBe('true');
  });

  it('moves focus inside and restores it when closed', async () => {
    const trigger = document.createElement('button');
    const element = document.createElement('tp-modal') as TpModal;
    const firstButton = document.createElement('button');
    trigger.textContent = 'Open';
    firstButton.textContent = 'First action';
    element.append(firstButton);
    document.body.append(trigger, element);
    trigger.focus();

    element.show();
    await Promise.resolve();
    expect(document.activeElement).toBe(firstButton);

    element.hide();
    await Promise.resolve();
    expect(document.activeElement).toBe(trigger);
  });

  it('cycles focus within the modal with Tab', async () => {
    const element = document.createElement('tp-modal') as TpModal;
    const firstButton = document.createElement('button');
    const lastButton = document.createElement('button');
    element.append(firstButton, lastButton);
    document.body.append(element);
    element.show();
    await Promise.resolve();

    lastButton.focus();
    lastButton.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Tab',
    }));
    expect(document.activeElement).toBe(firstButton);

    firstButton.focus();
    firstButton.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Tab',
      shiftKey: true,
    }));
    expect(document.activeElement).toBe(lastButton);
  });

  it('makes background content inert only while open', () => {
    const background = document.createElement('main');
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(background, element);

    element.show();
    expect(background.inert).toBe(true);

    element.hide();
    expect(background.inert).toBe(false);
  });

  it('does nothing on Escape when already closed', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(element.open).toBe(false);
  });

  it('dispatches tp-modal-toggle when shown', () => {
    const element = document.createElement('tp-modal') as TpModal;
    document.body.append(element);

    const handler = vi.fn();
    element.addEventListener('tp-modal-toggle', handler);

    element.show();

    expect(handler).toHaveBeenCalled();

    const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.detail.open).toBe(true);
    expect(event.detail.backdrop).toBe(false);
    expect(event.detail.breakout).toBe(false);
    expect(event.detail.fixed).toBe(false);
  });

  it('dispatches tp-modal-toggle when hidden', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.open = true;
    document.body.append(element);

    const handler = vi.fn();
    element.addEventListener('tp-modal-toggle', handler);

    element.hide();

    const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.detail.open).toBe(false);
  });

  it('does not dispatch the same toggle state twice', () => {
    const element = document.createElement('tp-modal') as TpModal;
    element.open = true;
    document.body.append(element);

    const handler = vi.fn();
    element.addEventListener('tp-modal-toggle', handler);

    element.hide();
    element.hide();

    const falseStates = handler.mock.calls
      .map((call) => (call[0] as CustomEvent).detail.open)
      .filter((value) => value === false);

    expect(falseStates).toHaveLength(1);
  });

});
