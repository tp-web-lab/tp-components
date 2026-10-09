/**
 * @module source/test
 * @summary Tests du composant `<tp-source>`.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import './source.js';

async function flush(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

describe('<tp-source>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('est défini', () => {
    expect(customElements.get('tp-source')).toBeDefined();
  });

  it('ne s’affiche pas quand url est vide', async () => {
    document.body.innerHTML = '<tp-source></tp-source>';
    await flush();

    const source = document.querySelector('tp-source');

    expect(source?.hasAttribute('hidden')).toBe(true);
    expect(source?.querySelector('tp-icon-button')).toBeNull();
  });

  it.each([
    ['https://github.com/tp-web-lab/tp-components', 'github'],
    ['https://gitlab.com/example/project', 'gitlab'],
    ['https://bitbucket.org/example/project', 'bitbucket'],
    ['https://example.com/project.git', 'git'],
  ])('choisit l’icône %s', async (url, iconName) => {
    document.body.innerHTML = `<tp-source url="${url}"></tp-source>`;
    await flush();

    const button = document.querySelector('tp-source > tp-icon-button');

    expect(button?.getAttribute('name')).toBe(iconName);
    expect(button?.getAttribute('label')).toBe(`Source: ${url}`);
  });

  it('ouvre l’url dans un nouvel onglet au clic', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    document.body.innerHTML = '<tp-source url="https://github.com/tp-web-lab/tp-components"></tp-source>';
    await flush();

    document.querySelector<HTMLElement>('tp-source > tp-icon-button')?.click();

    expect(open).toHaveBeenCalledWith(
      'https://github.com/tp-web-lab/tp-components',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('masque le composant quand url redevient vide', async () => {
    document.body.innerHTML = '<tp-source url="https://github.com/tp-web-lab/tp-components"></tp-source>';
    await flush();

    const source = document.querySelector('tp-source');
    source?.removeAttribute('url');
    await flush();

    expect(source?.hasAttribute('hidden')).toBe(true);
    expect(source?.querySelector('tp-icon-button')).toBeNull();
  });

  it('reflète la propriété url et réutilise le bouton existant', async () => {
    const source = document.createElement('tp-source') as HTMLElement & { url: string };
    document.body.append(source);
    source.url = 'https://github.com/example/one';
    await flush();
    const button = source.querySelector('tp-icon-button');
    source.url = 'https://gitlab.com/example/two';
    await flush();
    expect(source.querySelector('tp-icon-button')).toBe(button);
    expect(button?.getAttribute('name')).toBe('gitlab');
    source.url = '   ';
    expect(source.hasAttribute('url')).toBe(false);
  });

  it('ignore le clic d’un ancien bouton lorsque son URL a été supprimée', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    document.body.innerHTML = '<tp-source url="https://example.com/repository"></tp-source>';
    await flush();
    const source = document.querySelector('tp-source');
    const button = source?.querySelector<HTMLElement>('tp-icon-button');
    source?.removeAttribute('url');
    button?.click();
    expect(open).not.toHaveBeenCalled();
  });
});
