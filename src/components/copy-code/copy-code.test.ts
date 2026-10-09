import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import '../animation/animation.js';
import '../icon/icon.js';
import './copy-code.js';
import type { TpCopyCode } from './copy-code.js';

class TestValueTarget extends HTMLElement {
  public getValue(): string {
    return 'const answer = 42;';
  }
}

class TestCodeTarget extends HTMLElement {
  public getCode(): string {
    return '<p>Hello tp-copy-code</p>';
  }
}

if (!customElements.get('test-value-target')) {
  customElements.define('test-value-target', TestValueTarget);
}

if (!customElements.get('test-code-target')) {
  customElements.define('test-code-target', TestCodeTarget);
}

describe('<tp-copy-code>', () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();

    writeTextMock = vi.fn<(_: string) => Promise<void>>().mockResolvedValue();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('est défini', () => {
    expect(customElements.get('tp-copy-code')).toBeDefined();
  });

  it('crée son DOM interne avec tp-icon et tp-animation, sans tooltip', () => {
    const copy = document.createElement('tp-copy-code');
    document.body.append(copy);

    expect(copy.querySelector('tp-icon')).toBeTruthy();
    expect(copy.querySelector('tp-tooltip')).toBeNull();
    expect(copy.querySelector('tp-animation')).toBeTruthy();
    expect(copy.querySelector('[data-tp-copy-code-anchor]')).toBeTruthy();
  });

  it('copie le contenu depuis une cible référencée par l’attribut for', async () => {
    document.body.innerHTML = `
      <test-value-target id="editor-1"></test-value-target>
      <tp-copy-code for="editor-1"></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    const result = await (
      copy as HTMLElement & { copy: () => Promise<boolean> }
    ).copy();

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith('const answer = 42;');
    expect(copy.getAttribute('data-state')).toBe('success');
  });

  it('copie le contenu depuis forElement si la propriété est définie', async () => {
    const target = document.createElement('test-code-target');
    document.body.append(target);

    const copy = document.createElement('tp-copy-code') as HTMLElement & {
      copy: () => Promise<boolean>;
      forElement: HTMLElement | null;
    };

    copy.forElement = target;
    document.body.append(copy);

    const result = await copy.copy();

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith('<p>Hello tp-copy-code</p>');
    expect(copy.getAttribute('data-state')).toBe('success');
  });

  it('utilise textContent si la cible n’expose ni getValue() ni getCode()', async () => {
    const target = document.createElement('div');
    target.id = 'plain-target';
    target.textContent = 'plain text content';
    document.body.append(target);

    const copy = document.createElement('tp-copy-code') as HTMLElement & {
      copy: () => Promise<boolean>;
    };
    copy.setAttribute('for', 'plain-target');
    document.body.append(copy);

    const result = await copy.copy();

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('plain text content');
    expect(copy.getAttribute('data-state')).toBe('success');
  });

  it('émet tp-copy-code-success après une copie réussie', async () => {
    document.body.innerHTML = `
      <test-value-target id="editor-2"></test-value-target>
      <tp-copy-code for="editor-2"></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    const successSpy = vi.fn();
    copy.addEventListener('tp-copy-code-success', successSpy);

    await (copy as HTMLElement & { copy: () => Promise<boolean> }).copy();

    expect(successSpy).toHaveBeenCalledTimes(1);

    const event = successSpy.mock.calls[0]?.[0] as CustomEvent<{ length: number }>;
    expect(event.detail.length).toBe('const answer = 42;'.length);
  });

  it('émet tp-copy-code-error si aucune cible n’est trouvée', async () => {
    const copy = document.createElement('tp-copy-code') as HTMLElement & {
      copy: () => Promise<boolean>;
    };
    copy.setAttribute('for', 'missing-target');
    document.body.append(copy);

    const errorSpy = vi.fn();
    copy.addEventListener('tp-copy-code-error', errorSpy);

    const result = await copy.copy();

    expect(result).toBe(false);
    expect(writeTextMock).not.toHaveBeenCalled();
    expect(copy.getAttribute('data-state')).toBe('error');
    expect(errorSpy).toHaveBeenCalledTimes(1);

    const event = errorSpy.mock.calls[0]?.[0] as CustomEvent<{ message: string }>;
    expect(event.detail.message).toBe('No target element found.');
  });

  it('émet tp-copy-code-error si navigator.clipboard.writeText échoue', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('Clipboard denied'));

    document.body.innerHTML = `
      <test-value-target id="editor-3"></test-value-target>
      <tp-copy-code for="editor-3"></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    const errorSpy = vi.fn();
    copy.addEventListener('tp-copy-code-error', errorSpy);

    const result = await (copy as HTMLElement & { copy: () => Promise<boolean> }).copy();

    expect(result).toBe(false);
    expect(copy.getAttribute('data-state')).toBe('error');
    expect(errorSpy).toHaveBeenCalledTimes(1);

    const event = errorSpy.mock.calls[0]?.[0] as CustomEvent<{ message: string }>;
    expect(event.detail.message).toBe('Clipboard denied');
  });

  it('revient automatiquement à l’état idle après le délai de succès', async () => {
    document.body.innerHTML = `
      <test-value-target id="editor-4"></test-value-target>
      <tp-copy-code for="editor-4"></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    await (copy as HTMLElement & { copy: () => Promise<boolean> }).copy();
    expect(copy.getAttribute('data-state')).toBe('success');

    vi.advanceTimersByTime(1500);
    await Promise.resolve();

    expect(copy.getAttribute('data-state')).toBe('idle');
  });

  it('met à jour le nom de l’icône selon l’état', async () => {
    document.body.innerHTML = `
      <test-value-target id="editor-5"></test-value-target>
      <tp-copy-code
        for="editor-5"
        icon="copy"
        success-icon="check"
        error-icon="warning"
      ></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    const icon = copy.querySelector('tp-icon');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('name')).toBe('copy');

    await (copy as HTMLElement & { copy: () => Promise<boolean> }).copy();
    expect(icon?.getAttribute('name')).toBe('check');

    vi.advanceTimersByTime(1500);
    await Promise.resolve();

    expect(icon?.getAttribute('name')).toBe('copy');
  });

  it('does not create a tooltip on hover or reconnection', () => {
    const copy = document.createElement('tp-copy-code');
    document.body.append(copy);
    copy.dispatchEvent(new MouseEvent('mouseenter'));
    expect(copy.querySelector('tp-tooltip')).toBeNull();
    expect(copy.getAttribute('aria-label')).toBe('Copy code');
    copy.remove();
    document.body.append(copy);
    expect(copy.querySelectorAll('tp-icon')).toHaveLength(1);
    expect(copy.querySelector('tp-tooltip')).toBeNull();
  });

  it('configure automatiquement tp-animation avec un target valide', () => {
    const copy = document.createElement('tp-copy-code');
    document.body.append(copy);

    const animation = copy.querySelector('tp-animation');
    const icon = copy.querySelector('[data-tp-copy-code-icon]');

    expect(animation).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(animation?.getAttribute('trigger')).toBe('manual');
    expect(animation?.getAttribute('target')).toBe('[data-tp-copy-code-icon]');
  });

  it('conserve copied-text sans afficher de tooltip', () => {
    const copy = document.createElement('tp-copy-code');
    copy.setAttribute('copied-text', 'Copié !');
    document.body.append(copy);

    const tooltip = copy.querySelector('tp-tooltip');
    expect(tooltip).toBeNull();
    expect(copy.copiedText).toBe('Copié !');
  });

  it('déclenche la copie au clavier avec Enter', async () => {
    document.body.innerHTML = `
      <test-value-target id="editor-6"></test-value-target>
      <tp-copy-code for="editor-6"></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    copy.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
      }),
    );

    await Promise.resolve();

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith('const answer = 42;');
  });

  it('déclenche la copie au clavier avec espace', async () => {
    document.body.innerHTML = `
      <test-value-target id="editor-7"></test-value-target>
      <tp-copy-code for="editor-7"></tp-copy-code>
    `;

    const copy = document.querySelector('tp-copy-code');
    expect(copy).toBeInstanceOf(HTMLElement);

    if (!(copy instanceof HTMLElement)) {
      throw new Error('tp-copy-code not found');
    }

    copy.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: ' ',
      }),
    );

    await Promise.resolve();

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith('const answer = 42;');
  });

  it('reflète et retire ses propriétés de présentation', () => {
    const copy = document.createElement('tp-copy-code') as TpCopyCode;
    copy.htmlFor = 'target';
    copy.icon = 'content-copy';
    copy.successIcon = 'done';
    copy.errorIcon = 'alert';
    copy.copiedText = 'Done';
    expect(copy.htmlFor).toBe('target');
    expect(copy.icon).toBe('content-copy');
    expect(copy.successIcon).toBe('done');
    expect(copy.errorIcon).toBe('alert');
    expect(copy.copiedText).toBe('Done');
    copy.htmlFor = '';
    copy.icon = '';
    copy.successIcon = '';
    copy.errorIcon = '';
    copy.copiedText = '';
    expect(copy.htmlFor).toBe('');
    expect(copy.icon).toBe('copy');
    expect(copy.successIcon).toBe('check');
    expect(copy.errorIcon).toBe('warning');
    expect(copy.copiedText).toBe('Copied!');
  });

  it('reflète une cible JavaScript explicite', () => {
    const copy = document.createElement('tp-copy-code') as TpCopyCode;
    const target = document.createElement('pre');
    copy.forElement = target;
    expect(copy.forElement).toBe(target);
    copy.forElement = null;
    expect(copy.forElement).toBeNull();
  });

  it('déclenche la copie au clic et ignore les autres touches', async () => {
    document.body.innerHTML = `<pre id="click-target">click content</pre><tp-copy-code for="click-target"></tp-copy-code>`;
    const copy = document.querySelector<HTMLElement>('tp-copy-code');
    copy?.click();
    copy?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await Promise.resolve();
    expect(writeTextMock).toHaveBeenCalledOnce();
  });

  it('utilise les solutions de repli du feedback visuel', () => {
    const copy = document.createElement('tp-copy-code') as TpCopyCode;
    document.body.append(copy);
    const playIn = vi.fn().mockResolvedValue(undefined);
    const play = vi.fn().mockResolvedValue(undefined);
    const internals = copy as unknown as {
      animationEl: HTMLElement & { restart?: unknown; playIn?: () => Promise<void>; play?: () => Promise<void> };
      showSuccessFeedback: () => void;
    };
    Object.defineProperty(internals.animationEl, 'restart', { configurable: true, value: undefined });
    Object.defineProperty(internals.animationEl, 'playIn', { configurable: true, value: playIn });
    internals.showSuccessFeedback();
    expect(playIn).toHaveBeenCalledOnce();
    Object.defineProperty(internals.animationEl, 'playIn', { configurable: true, value: undefined });
    Object.defineProperty(internals.animationEl, 'play', { configurable: true, value: play });
    internals.showSuccessFeedback();
    expect(play).toHaveBeenCalledOnce();
  });
});
