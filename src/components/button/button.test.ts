/**
 * @module button/test
 * @summary Tests du composant `<tp-button>`.
 */

import { afterEach, describe, expect, it } from 'vitest';
import './button.js';

/**
 * Attend la fin des micro-tâches en cours.
 *
 * @summary Attend la stabilisation asynchrone du DOM.
 * @returns Promesse résolue au prochain tour de micro-tâche.
 */
async function flush(): Promise<void> {
  await Promise.resolve();
}

/**
 * Retourne le premier élément `<tp-button>` du document.
 *
 * @summary Récupère l’élément bouton de test.
 * @returns Élément `<tp-button>`.
 * @throws {Error} Si aucun bouton n’est trouvé.
 */
function getTpButton(): HTMLElement {
  const element = document.querySelector('tp-button');

  if (!(element instanceof HTMLElement)) {
    throw new Error('tp-button not found');
  }

  return element;
}

describe('<tp-button>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('est défini', () => {
    expect(customElements.get('tp-button')).toBeDefined();
  });

  it('rend un bouton natif par défaut', async () => {
    document.body.innerHTML = '<tp-button>Run</tp-button>';
    await flush();

    const host = getTpButton();
    const button = host.querySelector(':scope > button');

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(host.querySelector(':scope > a')).toBeNull();
  });

  it('rend un lien natif quand href est présent', async () => {
    document.body.innerHTML =
      '<tp-button href="/docs">Documentation</tp-button>';
    await flush();

    const host = getTpButton();
    const anchor = host.querySelector(':scope > a');

    expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    expect(host.querySelector(':scope > button')).toBeNull();
  });

  it('utilise la variante neutral par défaut', async () => {
    document.body.innerHTML = '<tp-button>Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('variant')).toBe('neutral');
  });

  it('utilise la taille m par défaut', async () => {
    document.body.innerHTML = '<tp-button>Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('size')).toBe('m');
  });

  it('utilise le type natif button par défaut', async () => {
    document.body.innerHTML = '<tp-button>Run</tp-button>';
    await flush();

    const host = getTpButton();
    const button = host.querySelector(':scope > button');

    expect(host.getAttribute('type')).toBe('button');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect((button as HTMLButtonElement).type).toBe('button');
  });

  it('conserve le contenu quand type est défini avant la connexion', async () => {
    const host = document.createElement('tp-button');
    host.setAttribute('type', 'button');
    host.textContent = 'Show toast';

    document.body.append(host);
    await flush();

    const content = host.querySelector(':scope > button > [data-tp-button-content]');

    expect(content?.textContent).toBe('Show toast');
    expect(host.getAttribute('data-source')).toBe(
      '<tp-button type="button">Show toast</tp-button>',
    );
  });

  it('conserve le contenu ajouté après la construction interne', async () => {
    const host = document.createElement('tp-button');
    host.setAttribute('type', 'button');

    document.body.append(host);
    await flush();

    host.append('Show toast');
    await flush();

    const content = host.querySelector(':scope > button > [data-tp-button-content]');

    expect(content?.textContent).toBe('Show toast');
    expect(host.childNodes).toHaveLength(1);
    expect(host.getAttribute('data-source')).toBe(
      '<tp-button type="button">Show toast</tp-button>',
    );
  });

  it('utilise loading-mode="replace" par défaut', async () => {
    document.body.innerHTML = '<tp-button>Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('loading-mode')).toBe('replace');
  });

  it('conserve une variante valide fournie par l’utilisateur', async () => {
    document.body.innerHTML =
      '<tp-button variant="brand">Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('variant')).toBe('brand');
  });

  it('retombe sur neutral quand la variante est invalide', async () => {
    document.body.innerHTML =
      '<tp-button variant="unknown">Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('variant')).toBe('neutral');
  });

  it('conserve une taille valide fournie par l’utilisateur', async () => {
    document.body.innerHTML =
      '<tp-button size="xl">Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('size')).toBe('xl');
  });

  it('retombe sur m quand la taille est invalide', async () => {
    document.body.innerHTML =
      '<tp-button size="huge">Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('size')).toBe('m');
  });

  it('conserve un type natif valide fourni par l’utilisateur', async () => {
    document.body.innerHTML =
      '<tp-button type="submit">Send</tp-button>';
    await flush();

    const host = getTpButton();
    const button = host.querySelector(':scope > button');

    expect(host.getAttribute('type')).toBe('submit');
    expect((button as HTMLButtonElement).type).toBe('submit');
  });

  it('retombe sur button quand le type natif est invalide', async () => {
    document.body.innerHTML =
      '<tp-button type="danger">Send</tp-button>';
    await flush();

    const host = getTpButton();
    const button = host.querySelector(':scope > button');

    expect(host.getAttribute('type')).toBe('button');
    expect((button as HTMLButtonElement).type).toBe('button');
  });

  it('conserve loading-mode valide fourni par l’utilisateur', async () => {
    document.body.innerHTML =
      '<tp-button loading-mode="inline">Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('loading-mode')).toBe('inline');
  });

  it('retombe sur replace quand loading-mode est invalide', async () => {
    document.body.innerHTML =
      '<tp-button loading-mode="weird">Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.getAttribute('loading-mode')).toBe('replace');
  });

  it('retransmet href, target, rel et download sur le lien interne', async () => {
    document.body.innerHTML = `
      <tp-button
        href="/file.txt"
        target="_blank"
        rel="noreferrer"
        download="file.txt"
      >
        Download
      </tp-button>
    `;
    await flush();

    const host = getTpButton();
    const anchor = host.querySelector(':scope > a') as HTMLAnchorElement;

    expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    expect(anchor.getAttribute('href')).toContain('/file.txt');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noreferrer');
    expect(anchor.getAttribute('download')).toBe('file.txt');
  });

  it('désactive le bouton natif quand disabled est présent', async () => {
    document.body.innerHTML =
      '<tp-button disabled>Run</tp-button>';
    await flush();

    const host = getTpButton();
    const button = host.querySelector(':scope > button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('désactive le lien interne quand disabled est présent', async () => {
    document.body.innerHTML =
      '<tp-button href="/docs" disabled>Docs</tp-button>';
    await flush();

    const host = getTpButton();
    const anchor = host.querySelector(':scope > a') as HTMLAnchorElement;

    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.tabIndex).toBe(-1);
  });

  it('bloque le bouton natif quand loading est présent', async () => {
    document.body.innerHTML =
      '<tp-button loading>Run</tp-button>';
    await flush();

    const host = getTpButton();
    const button = host.querySelector(':scope > button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(host.hasAttribute('data-loading')).toBe(true);
  });

  it('bloque le lien interne quand loading est présent', async () => {
    document.body.innerHTML =
      '<tp-button href="/docs" loading>Docs</tp-button>';
    await flush();

    const host = getTpButton();
    const anchor = host.querySelector(':scope > a') as HTMLAnchorElement;

    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.getAttribute('aria-busy')).toBe('true');
    expect(anchor.tabIndex).toBe(-1);
    expect(host.hasAttribute('data-loading')).toBe(true);
  });

  it('crée la structure interne spinner + contenu', async () => {
    document.body.innerHTML =
      '<tp-button>Run</tp-button>';
    await flush();

    const host = getTpButton();
    const control = host.querySelector(':scope > button');
    const spinner = control?.querySelector(':scope > [data-tp-button-spinner]');
    const content = control?.querySelector(':scope > [data-tp-button-content]');

    expect(spinner).toBeInstanceOf(HTMLSpanElement);
    expect(content).toBeInstanceOf(HTMLSpanElement);
    expect(content?.textContent).toBe('Run');
  });

  it('conserve le contenu enfant lors du rendu interne', async () => {
    document.body.innerHTML =
      '<tp-button><span>Run</span></tp-button>';
    await flush();

    const host = getTpButton();
    const span = host.querySelector(
      ':scope > button > [data-tp-button-content] > span',
    );

    expect(span).toBeInstanceOf(HTMLSpanElement);
    expect(span?.textContent).toBe('Run');
  });

  it('conserve le contenu lors du passage de button à a', async () => {
    document.body.innerHTML =
      '<tp-button><span>Run</span></tp-button>';
    await flush();

    const host = getTpButton();
    host.setAttribute('href', '/docs');
    await flush();

    const span = host.querySelector(
      ':scope > a > [data-tp-button-content] > span',
    );

    expect(host.querySelector(':scope > button')).toBeNull();
    expect(host.querySelector(':scope > a')).toBeInstanceOf(HTMLAnchorElement);
    expect(span).toBeInstanceOf(HTMLSpanElement);
    expect(span?.textContent).toBe('Run');
  });

  it('gère les booléens outlined et pill par présence/absence', async () => {
    document.body.innerHTML =
      '<tp-button outlined pill>Run</tp-button>';
    await flush();

    const host = getTpButton();

    expect(host.hasAttribute('outlined')).toBe(true);
    expect(host.hasAttribute('pill')).toBe(true);

    host.removeAttribute('outlined');
    host.removeAttribute('pill');
    await flush();

    expect(host.hasAttribute('outlined')).toBe(false);
    expect(host.hasAttribute('pill')).toBe(false);
  });

  it('utilise les tokens de couleur de tp.css dans sa feuille de style', async () => {
    document.body.innerHTML = '<tp-button variant="brand">Run</tp-button>';
    await flush();

    const styleEl = document.head.querySelector('#tp-button-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('var(--tp-brand-fill-loud)');
    expect(cssText).toContain('var(--tp-success-fill-loud)');
    expect(cssText).toContain('var(--tp-neutral-fill-loud)');
    expect(cssText).toContain('var(--tp-focus-color)');
  });

  it('reflète toute son API publique', async () => {
    const host = document.createElement('tp-button');
    host.variant = 'brand';
    host.size = 'l';
    host.type = 'submit';
    host.outlined = true;
    host.pill = true;
    host.disabled = true;
    host.loading = true;
    host.loadingMode = 'inline';
    host.href = '/next';
    host.target = '_blank';
    host.rel = 'noopener';
    host.download = 'result.txt';
    document.body.append(host);
    await flush();
    expect([host.variant, host.size, host.type, host.loadingMode, host.href, host.target, host.rel, host.download]).toEqual(['brand', 'l', 'submit', 'inline', '/next', '_blank', 'noopener', 'result.txt']);
    expect([host.outlined, host.pill, host.disabled, host.loading]).toEqual([true, true, true, true]);
  });
});
