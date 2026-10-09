import { beforeEach, describe, expect, it, vi } from 'vitest';

import './dialog.js';
import type { TpDialog } from './dialog.js';

describe('<tp-dialog>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: vi.fn(),
    });
  });
  it('uses the base lifecycle for help source capture before rendering internals', () => {
    document.body.innerHTML = `
      <tp-dialog>
        Dialog body
      </tp-dialog>
    `;

    const element = document.querySelector('tp-dialog');
    const source = element?.getAttribute('data-source') ?? '';

    expect(element?.hasAttribute('data-tp-base-host')).toBe(true);
    expect(source).toContain('Dialog body');
    expect(source).not.toContain('data-tp-dialog');
  });

  it('injecte le contenu et les libellés des actions', () => {
    const element = document.createElement('tp-dialog') as TpDialog;
    document.body.append(element);
    const body = document.createElement('strong');
    body.textContent = 'Body';
    element.setContent({
      title: 'Title',
      body: [body],
      confirmText: 'OK',
      cancelText: 'Back',
    });

    expect(element.querySelector('[data-tp-dialog-header]')?.textContent).toBe('Title');
    expect(element.querySelector('[data-tp-dialog-body] strong')).toBe(body);
    expect(element.textContent).toContain('OK');
    expect(element.textContent).toContain('Back');

    element.setContent({});
    expect(element.querySelector('[data-tp-dialog-header]')?.textContent).toBe('');
    expect(element.querySelector('[data-tp-dialog-body]')?.textContent).toBe('');
    expect(element.textContent).toContain('Confirm');
    expect(element.textContent).toContain('Cancel');
  });

  it('ouvre puis ferme avec le résultat demandé', () => {
    const showModal = vi.mocked(HTMLDialogElement.prototype.showModal);
    const close = vi.mocked(HTMLDialogElement.prototype.close);
    const element = document.createElement('tp-dialog') as TpDialog;
    document.body.append(element);
    const listener = vi.fn();
    element.addEventListener('tp-dialog-close', listener);

    element.show();
    element.close('confirm');
    element.close();

    expect(showModal).toHaveBeenCalledOnce();
    expect(close).toHaveBeenNthCalledWith(1, 'confirm');
    expect(close).toHaveBeenNthCalledWith(2, 'cancel');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('relie les boutons aux actions confirm et cancel', () => {
    const element = document.createElement('tp-dialog') as TpDialog;
    document.body.append(element);
    const listener = vi.fn();
    element.addEventListener('tp-dialog-close', listener);
    const buttons = element.querySelectorAll('tp-button');
    buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    buttons[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(listener.mock.calls.map(([event]) => (event as CustomEvent).detail.action)).toEqual([
      'cancel',
      'confirm',
    ]);
  });

  it('gère les fallbacks internes et réutilise les styles', () => {
    const first = document.createElement('tp-dialog') as TpDialog;
    const second = document.createElement('tp-dialog') as TpDialog;
    document.body.append(first, second);
    const internals = first as unknown as {
      setButtonText(button: HTMLElement | null, text: string): void;
    };
    internals.setButtonText(null, 'Ignored');
    const plainButton = document.createElement('div');
    internals.setButtonText(plainButton, 'Fallback');
    const structuredButton = document.createElement('div');
    const content = document.createElement('span');
    content.setAttribute('data-tp-button-content', '');
    structuredButton.append(content);
    internals.setButtonText(structuredButton, 'Structured');

    expect(plainButton.textContent).toBe('Fallback');
    expect(content.textContent).toBe('Structured');
    expect(document.querySelectorAll('#tp-dialog-styles')).toHaveLength(1);
  });
});
