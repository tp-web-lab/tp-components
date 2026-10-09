import { afterEach, describe, expect, it } from 'vitest';
import './badge.js';
import type { TpBadge } from './badge.js';

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
 * Retourne le premier élément `<tp-badge>` du document.
 *
 * @summary Récupère l’élément badge de test.
 * @returns Élément `<tp-badge>`.
 * @throws {Error} Si aucun badge n’est trouvé.
 */
function getBadge(): HTMLElement {
  const element = document.querySelector('tp-badge');

  if (!(element instanceof HTMLElement)) {
    throw new Error('tp-badge not found');
  }

  return element;
}

describe('<tp-badge>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('est défini', () => {
    expect(customElements.get('tp-badge')).toBeDefined();
  });

  it('utilise la variante neutral par défaut', async () => {
    document.body.innerHTML = '<tp-badge>Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.getAttribute('variant')).toBe('neutral');
  });

  it('utilise la taille m par défaut', async () => {
    document.body.innerHTML = '<tp-badge>Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.getAttribute('size')).toBe('m');
  });

  it('conserve une variante valide fournie par l’utilisateur', async () => {
    document.body.innerHTML = '<tp-badge variant="info">Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.getAttribute('variant')).toBe('info');
  });

  it('retombe sur neutral quand la variante est invalide', async () => {
    document.body.innerHTML = '<tp-badge variant="unknown">Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.getAttribute('variant')).toBe('neutral');
  });

  it('conserve une taille valide fournie par l’utilisateur', async () => {
    document.body.innerHTML = '<tp-badge size="xl">Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.getAttribute('size')).toBe('xl');
  });

  it('retombe sur m quand la taille est invalide', async () => {
    document.body.innerHTML = '<tp-badge size="huge">Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.getAttribute('size')).toBe('m');
  });

  it('gère les booléens outlined, pill et pulse par présence/absence', async () => {
    document.body.innerHTML =
      '<tp-badge outlined pill pulse>Badge</tp-badge>';
    await flush();

    const badge = getBadge();

    expect(badge.hasAttribute('outlined')).toBe(true);
    expect(badge.hasAttribute('pill')).toBe(true);
    expect(badge.hasAttribute('pulse')).toBe(true);

    badge.removeAttribute('outlined');
    badge.removeAttribute('pill');
    badge.removeAttribute('pulse');
    await flush();

    expect(badge.hasAttribute('outlined')).toBe(false);
    expect(badge.hasAttribute('pill')).toBe(false);
    expect(badge.hasAttribute('pulse')).toBe(false);
  });

  it('conserve le contenu enfant', async () => {
    document.body.innerHTML =
      '<tp-badge><span>Inner</span></tp-badge>';
    await flush();

    const badge = getBadge();
    const child = badge.querySelector('span');

    expect(child).toBeInstanceOf(HTMLSpanElement);
    expect(child?.textContent).toBe('Inner');
  });

  it('utilise les tokens de couleur de tp.css dans sa feuille de style', async () => {
    document.body.innerHTML = '<tp-badge variant="success">Badge</tp-badge>';
    await flush();

    const styleEl = document.head.querySelector('#tp-badge-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('var(--tp-success-fill-softer)');
    expect(cssText).toContain('var(--tp-danger-fill-softer)');
    expect(cssText).toContain('var(--tp-brand-fill-softer)');
    expect(cssText).toContain('var(--tp-neutral-text-on-soft)');
    expect(cssText).toContain('--tp-badge-font-size: 0.875em;');
    expect(cssText).toContain('--tp-badge-padding-block: 0.35em;');
    expect(cssText).toContain('--tp-badge-padding-inline: 0.7em;');
    expect(cssText).not.toMatch(/--tp-badge-(?:font-size|padding[^:]*|radius):[^;]*px/);
    expect(cssText).toContain('@keyframes tp-badge-pulse');
    expect(cssText).toContain('prefers-reduced-motion');
  });

  it('expose toutes ses propriétés publiques', () => {
    const element = document.createElement('tp-badge') as TpBadge;
    element.variant = 'success';
    element.size = 's';
    element.outlined = true;
    element.pill = true;
    element.pulse = true;
    expect(element.variant).toBe('success');
    expect(element.size).toBe('s');
    expect(element.outlined).toBe(true);
    expect(element.pill).toBe(true);
    expect(element.pulse).toBe(true);
    element.outlined = false;
    element.pill = false;
    element.pulse = false;
    expect(element.outlined || element.pill || element.pulse).toBe(false);
  });
});
