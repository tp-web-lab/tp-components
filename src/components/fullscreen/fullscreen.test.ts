/**
 * @module fullscreen/test
 * @summary Tests du composant `<tp-fullscreen>`.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import './fullscreen.js';
import type { TpFullscreen } from './fullscreen.js';

async function flush(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

describe('<tp-fullscreen>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    vi.restoreAllMocks();
  });

  it('est défini', () => {
    expect(customElements.get('tp-fullscreen')).toBeDefined();
  });

  it('rend un bouton fullscreen', async () => {
    document.body.innerHTML = '<tp-fullscreen></tp-fullscreen>';
    await flush();

    const button = document.querySelector('tp-fullscreen > tp-icon-button');
    const style = document.getElementById('tp-fullscreen-styles');

    expect(button?.getAttribute('name')).toBe('fullscreen');
    expect(button?.getAttribute('label')).toBe('Fullscreen');
    expect(style?.textContent).toContain('[data-tp-fullscreen-target]):fullscreen');
  });

  it('transmet variant, size et disabled au déclencheur', async () => {
    document.body.innerHTML = '<tp-fullscreen variant="brand" size="s" disabled></tp-fullscreen>';
    await flush();

    const fullscreen = document.querySelector('tp-fullscreen');
    const button = document.querySelector('tp-fullscreen > tp-icon-button');

    expect(button?.getAttribute('variant')).toBe('brand');
    expect(button?.getAttribute('size')).toBe('s');
    expect(button?.hasAttribute('disabled')).toBe(true);

    fullscreen?.setAttribute('variant', 'danger');
    fullscreen?.setAttribute('size', 'l');
    fullscreen?.removeAttribute('disabled');

    expect(button?.getAttribute('variant')).toBe('danger');
    expect(button?.getAttribute('size')).toBe('l');
    expect(button?.hasAttribute('disabled')).toBe(false);
  });

  it('fait passer la cible anchor en plein écran', async () => {
    document.body.innerHTML = `
      <section id="target"></section>
      <tp-fullscreen anchor="#target"></tp-fullscreen>
    `;
    await flush();

    const target = document.querySelector<HTMLElement>('#target');
    const requestFullscreen = vi.fn(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => target,
      });
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    Object.defineProperty(target, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    });

    document.querySelector<HTMLElement>('tp-fullscreen > tp-icon-button')?.click();
    await flush();

    expect(requestFullscreen).toHaveBeenCalledOnce();
    expect(document.querySelector('tp-fullscreen > tp-icon-button')?.getAttribute('name')).toBe('fullscreen-exit');
    expect(document.querySelector('tp-fullscreen > tp-icon-button')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('émet tp-fullscreen-change avec l’état et la cible', async () => {
    document.body.innerHTML = `
      <section id="target"></section>
      <tp-fullscreen anchor="#target"></tp-fullscreen>
    `;
    await flush();

    const target = document.querySelector<HTMLElement>('#target');
    const fullscreen = document.querySelector('tp-fullscreen');
    const events: Array<CustomEvent<{
      fullscreen: boolean;
      anchor: string;
      target: HTMLElement;
    }>> = [];
    fullscreen?.addEventListener('tp-fullscreen-change', (event) => {
      events.push(event as CustomEvent<{
        fullscreen: boolean;
        anchor: string;
        target: HTMLElement;
      }>);
    });
    const requestFullscreen = vi.fn(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => target,
      });
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    Object.defineProperty(target, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    });

    document.querySelector<HTMLElement>('tp-fullscreen > tp-icon-button')?.click();
    await flush();

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toMatchObject({
      fullscreen: true,
      anchor: '#target',
      target,
    });
  });

  it('préserve temporairement le thème effectif sur la cible fullscreen', async () => {
    document.body.classList.add('tp-light');
    document.body.innerHTML = `
      <section id="target"></section>
      <tp-fullscreen anchor="#target"></tp-fullscreen>
    `;
    await flush();

    const target = document.querySelector<HTMLElement>('#target');
    const requestFullscreen = vi.fn(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => target,
      });
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    Object.defineProperty(target, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    });

    document.querySelector<HTMLElement>('tp-fullscreen > tp-icon-button')?.click();
    await flush();

    expect(target?.hasAttribute('data-tp-fullscreen-target')).toBe(true);
    expect(target?.classList.contains('tp-light')).toBe(true);

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    });
    document.dispatchEvent(new Event('fullscreenchange'));
    await flush();

    expect(target?.hasAttribute('data-tp-fullscreen-target')).toBe(false);
    expect(target?.classList.contains('tp-light')).toBe(false);
  });

  it('quitte le plein écran quand la cible est déjà en plein écran', async () => {
    document.body.innerHTML = `
      <section id="target"></section>
      <tp-fullscreen anchor="#target"></tp-fullscreen>
    `;
    await flush();

    const target = document.querySelector<HTMLElement>('#target');
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => target,
    });
    const exitFullscreen = vi.fn(async () => {
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => null,
      });
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFullscreen,
    });
    document.dispatchEvent(new Event('fullscreenchange'));
    await flush();

    document.querySelector<HTMLElement>('tp-fullscreen > tp-icon-button')?.click();
    await flush();

    expect(exitFullscreen).toHaveBeenCalledOnce();
    expect(document.querySelector('tp-fullscreen > tp-icon-button')?.getAttribute('name')).toBe('fullscreen');
    expect(document.querySelector('tp-fullscreen > tp-icon-button')?.getAttribute('aria-pressed')).toBe('false');
  });

  it('utilise le composant conteneur quand anchor est absent', async () => {
    document.body.innerHTML = `
      <tp-box>
        <tp-toolbar>
          <tp-fullscreen></tp-fullscreen>
        </tp-toolbar>
      </tp-box>
    `;
    await flush();

    const target = document.querySelector<HTMLElement>('tp-box');
    const requestFullscreen = vi.fn(async () => {});
    Object.defineProperty(target, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    });

    document.querySelector<HTMLElement>('tp-fullscreen > tp-icon-button')?.click();
    await flush();

    expect(requestFullscreen).toHaveBeenCalledOnce();
  });

  it('expose les propriétés du déclencheur et retire une ancre vide', () => {
    const element = document.createElement('tp-fullscreen') as TpFullscreen;
    element.anchor = '#target';
    element.variant = 'brand';
    element.size = 's';
    element.disabled = true;
    expect(element.anchor).toBe('#target');
    expect(element.variant).toBe('brand');
    expect(element.size).toBe('s');
    expect(element.disabled).toBe(true);
    element.anchor = ' ';
    element.disabled = false;
    expect(element.hasAttribute('anchor')).toBe(false);
    expect(element.disabled).toBe(false);
  });

  it('ignore le clic lorsqu’il est désactivé ou sans cible résolue', async () => {
    const element = document.createElement('tp-fullscreen') as TpFullscreen;
    element.disabled = true;
    document.body.append(element);
    element.querySelector<HTMLElement>('tp-icon-button')?.click();
    element.remove();
    await (element as unknown as { toggleFullscreen(): Promise<void> }).toggleFullscreen();
    expect(document.fullscreenElement).toBeNull();
  });

  it('nettoie la cible quand requestFullscreen échoue', async () => {
    document.body.innerHTML = '<section id="target"><tp-fullscreen anchor="#target"></tp-fullscreen></section>';
    const target = document.querySelector<HTMLElement>('#target');
    if (target === null) throw new Error('Target missing');
    target.requestFullscreen = vi.fn().mockRejectedValue(new Error('denied'));
    const element = document.querySelector('tp-fullscreen') as TpFullscreen;
    await expect(
      (element as unknown as { toggleFullscreen(): Promise<void> }).toggleFullscreen(),
    ).rejects.toThrow('denied');
    expect(target.hasAttribute('data-tp-fullscreen-target')).toBe(false);
  });
});
