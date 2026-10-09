/**
 * @module lang/test
 * @summary Tests du composant `<tp-lang>`.
 */

import { afterEach, describe, expect, it } from 'vitest';
import './lang.js';
import type { TpLang } from './lang.js';

async function flush(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

describe('<tp-lang>', () => {
  const originalNavigatorLanguage = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language');

  afterEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState(null, '', '/index.html');
    if (originalNavigatorLanguage) {
      Object.defineProperty(Navigator.prototype, 'language', originalNavigatorLanguage);
    }
  });

  function setNavigatorLanguage(language: string): void {
    Object.defineProperty(Navigator.prototype, 'language', {
      configurable: true,
      get: () => language,
    });
  }

  it('est défini', () => {
    expect(customElements.get('tp-lang')).toBeDefined();
  });

  it('rend un tp-dropdown avec les langues passées par attribut', async () => {
    document.body.innerHTML = '<tp-lang langs="en,fr" repository="/docs"></tp-lang>';
    await flush();

    const items = Array.from(document.querySelectorAll<HTMLElement>('tp-lang [data-lang]'));

    expect(document.querySelector('tp-lang > tp-dropdown')).not.toBeNull();
    expect(items.map((item) => item.dataset.lang)).toEqual(['auto', 'en', 'fr']);
    expect(document.querySelector('tp-lang > tp-icon-button')?.getAttribute('name')).toBe('en');
    expect(document.querySelector('tp-lang > tp-icon-button')?.getAttribute('library')).toBe('flags');
    expect(document.querySelector('tp-lang > tp-icon-button')?.getAttribute('label')).toBe('Language: EN');
    expect(document.querySelector('tp-lang [data-lang="fr"] tp-icon.tp-lang-option-icon')?.getAttribute('name')).toBe('fr');
    expect(document.querySelector('tp-lang [data-lang="fr"] tp-icon.tp-lang-option-icon')?.getAttribute('library')).toBe('flags');
  });

  it('transmet variant, size et disabled au déclencheur', async () => {
    document.body.innerHTML = '<tp-lang langs="en,fr" variant="brand" size="s" disabled></tp-lang>';
    await flush();

    const lang = document.querySelector('tp-lang');
    const trigger = document.querySelector('tp-lang > tp-icon-button');

    expect(trigger?.getAttribute('variant')).toBe('brand');
    expect(trigger?.getAttribute('size')).toBe('s');
    expect(trigger?.hasAttribute('disabled')).toBe(true);

    lang?.setAttribute('variant', 'danger');
    lang?.setAttribute('size', 'l');
    lang?.removeAttribute('disabled');

    expect(trigger?.getAttribute('variant')).toBe('danger');
    expect(trigger?.getAttribute('size')).toBe('l');
    expect(trigger?.hasAttribute('disabled')).toBe(false);
  });

  it('met à jour le repository du tp-markdown-multi-pages avec la langue choisie', async () => {
    document.body.innerHTML = `
      <tp-lang langs="en,fr" repository="/docs"></tp-lang>
      <tp-markdown-multi-pages repository="/docs"></tp-markdown-multi-pages>
    `;
    await flush();

    document.querySelector<HTMLElement>('tp-lang [data-lang="fr"]')?.click();
    await flush();

    expect(document.querySelector('tp-markdown-multi-pages')?.getAttribute('repository')).toBe('/docs/fr');
  });

  it('émet tp-lang-change avec la langue, le repository et la cible', async () => {
    document.body.innerHTML = `
      <tp-lang langs="en,fr" repository="/docs"></tp-lang>
      <tp-markdown-multi-pages repository="/docs"></tp-markdown-multi-pages>
    `;
    await flush();

    const lang = document.querySelector('tp-lang');
    const multiMarkdown = document.querySelector('tp-markdown-multi-pages');
    const events: Array<CustomEvent<{
      choice: string;
      lang: string;
      repository: string;
      anchor: null;
      target: HTMLElement | null;
    }>> = [];
    lang?.addEventListener('tp-lang-change', (event) => {
      events.push(event as CustomEvent<{
        choice: string;
        lang: string;
        repository: string;
        anchor: null;
        target: HTMLElement | null;
      }>);
    });

    document.querySelector<HTMLElement>('tp-lang [data-lang="fr"]')?.click();
    await flush();

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toMatchObject({
      choice: 'fr',
      lang: 'fr',
      repository: '/docs/fr',
      anchor: null,
      target: multiMarkdown,
    });
  });

  it('utilise le repository effectif du tp-markdown-multi-pages quand son attribut est absent', async () => {
    document.body.innerHTML = `
      <tp-lang langs="en,fr"></tp-lang>
      <tp-markdown-multi-pages></tp-markdown-multi-pages>
    `;
    const multiMarkdown = document.querySelector<HTMLElement & { repository: string }>('tp-markdown-multi-pages');
    Object.defineProperty(multiMarkdown, 'repository', {
      configurable: true,
      get: () => multiMarkdown?.getAttribute('repository') ?? '/docs',
    });
    await flush();

    document.querySelector<HTMLElement>('tp-lang [data-lang="fr"]')?.click();
    await flush();

    expect(multiMarkdown?.getAttribute('repository')).toBe('/docs/fr');
  });

  it('retire la langue courante du repository effectif avant de changer de langue', async () => {
    document.body.innerHTML = `
      <tp-lang langs="en,fr"></tp-lang>
      <tp-markdown-multi-pages repository="/docs/fr"></tp-markdown-multi-pages>
    `;
    await flush();

    document.querySelector<HTMLElement>('tp-lang [data-lang="en"]')?.click();
    await flush();

    expect(document.querySelector('tp-markdown-multi-pages')?.getAttribute('repository')).toBe('/docs');
  });

  it('conserve la page courante quand la navigation utilise un hash multi-markdown', async () => {
    window.history.replaceState(null, '', '/index.html#/components/callout/index.md');
    document.body.innerHTML = `
      <tp-lang langs="en,fr" repository="/docs"></tp-lang>
      <tp-markdown-multi-pages repository="/docs"></tp-markdown-multi-pages>
    `;
    await flush();

    document.querySelector<HTMLElement>('tp-lang [data-lang="fr"]')?.click();
    await flush();

    expect(window.location.hash).toBe('#/components/callout/index.md');
    expect(document.querySelector('tp-markdown-multi-pages')?.getAttribute('repository')).toBe('/docs/fr');
  });

  it('utilise le dossier du index.html comme repository par défaut', async () => {
    window.history.replaceState(null, '', '/guide/index.html');
    document.body.innerHTML = '<tp-lang langs="en,fr"></tp-lang>';
    await flush();

    document.querySelector<HTMLElement>('tp-lang [data-lang="fr"]')?.click();
    await flush();

    expect(window.location.pathname).toBe('/guide/fr/index.html');
  });

  it('déduit la langue courante du chemin sans attribut repository', async () => {
    window.history.replaceState(null, '', '/guide/fr/index.html');
    document.body.innerHTML = '<tp-lang langs="en,fr"></tp-lang>';
    await flush();

    expect(document.querySelector('tp-lang > tp-icon-button')?.getAttribute('label')).toBe('Language: FR');
  });

  it('utilise navigator.language pour l’item auto', async () => {
    setNavigatorLanguage('fr-FR');
    document.body.innerHTML = `
      <tp-lang langs="en,fr" repository="/docs"></tp-lang>
      <tp-markdown-multi-pages repository="/docs"></tp-markdown-multi-pages>
    `;
    await flush();

    document.querySelector<HTMLElement>('tp-lang [data-lang="auto"]')?.click();
    await flush();

    expect(document.querySelector('tp-markdown-multi-pages')?.getAttribute('repository')).toBe('/docs/fr');
    expect(document.querySelector('tp-lang [data-lang="auto"] tp-icon.tp-lang-option-icon')?.getAttribute('name')).toBe('fr');
  });

  it('expose les propriétés du contrôleur et retire un repository vide', () => {
    const element = document.createElement('tp-lang') as TpLang;
    element.langs = 'en,fr';
    element.repository = '/docs/{lang}';
    element.variant = 'brand';
    element.size = 's';
    element.disabled = true;
    expect(element.langs).toBe('en,fr');
    expect(element.repository).toBe('/docs/{lang}');
    expect(element.variant).toBe('brand');
    expect(element.size).toBe('s');
    expect(element.disabled).toBe(true);
    element.repository = ' ';
    element.disabled = false;
    expect(element.hasAttribute('repository')).toBe(false);
    expect(element.disabled).toBe(false);
  });

  it('gère le clavier et bloque les actions lorsqu’il est désactivé', async () => {
    document.body.innerHTML = '<tp-lang langs="en,fr" disabled></tp-lang>';
    await flush();
    const element = document.querySelector('tp-lang') as TpLang;
    const control = element.querySelector<HTMLElement>(':scope > tp-icon-button');
    const french = element.querySelector<HTMLElement>('[data-lang="fr"]');
    control?.click();
    french?.click();
    expect(element.querySelector('tp-dropdown')?.hasAttribute('open')).toBe(false);

    element.disabled = false;
    french?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    french?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await flush();
    expect(element.querySelector('[data-lang="fr"]')?.hasAttribute('data-selected')).toBe(true);
  });

  it('retombe sur en lorsque la liste de langues est vide', async () => {
    document.body.innerHTML = '<tp-lang langs=" , "></tp-lang>';
    await flush();
    expect(document.querySelector('[data-lang="en"]')).not.toBeNull();
  });
});
