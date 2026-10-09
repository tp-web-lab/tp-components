/**
 * @module callout/test
 * @summary Tests du composant `<tp-callout>`.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import './callout.js';
import type { TpCallout } from './callout.js';

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
 * Retourne le premier élément `<tp-callout>` du document.
 *
 * @summary Récupère l’élément callout de test.
 * @returns Élément `<tp-callout>`.
 * @throws {Error} Si aucun callout n’est trouvé.
 */
function getCallout(): HTMLElement {
  const element = document.querySelector('tp-callout');

  if (!(element instanceof HTMLElement)) {
    throw new Error('tp-callout not found');
  }

  return element;
}

describe('<tp-callout>', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('est défini', () => {
    expect(customElements.get('tp-callout')).toBeDefined();
  });

  it('utilise la variante neutral par défaut', async () => {
    document.body.innerHTML = '<tp-callout>Info</tp-callout>';
    await flush();

    const callout = getCallout();

    expect(callout.getAttribute('variant')).toBe('neutral');
  });

  it('conserve une variante valide fournie par l’utilisateur', async () => {
    document.body.innerHTML =
      '<tp-callout variant="warning">Attention</tp-callout>';
    await flush();

    const callout = getCallout();

    expect(callout.getAttribute('variant')).toBe('warning');
  });

  it('retombe sur neutral quand la variante est invalide', async () => {
    document.body.innerHTML =
      '<tp-callout variant="unknown">Attention</tp-callout>';
    await flush();

    const callout = getCallout();

    expect(callout.getAttribute('variant')).toBe('neutral');
  });

  it('affiche un heading quand heading est présent', async () => {
    document.body.innerHTML =
      '<tp-callout heading="Attention">Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]');

    expect(heading).toBeInstanceOf(HTMLDivElement);
    expect(heading?.textContent).toBe('Attention');
    expect((heading as HTMLElement).hidden).toBe(false);
  });

  it('affiche une icône avant le heading quand icon est présent', async () => {
    document.body.innerHTML =
      '<tp-callout heading="Attention" icon="info" library="mdi">Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]') as HTMLElement;
    const icon = heading.querySelector('tp-icon');
    const text = heading.querySelector('[data-tp-callout-heading-text]');

    expect(heading.hidden).toBe(false);
    expect(icon).toBeInstanceOf(HTMLElement);
    expect(icon?.getAttribute('name')).toBe('info');
    expect(icon?.getAttribute('library')).toBe('mdi');
    expect(text?.textContent).toBe('Attention');
    expect(Array.from(heading.children).at(0)).toBe(icon);
  });

  it('affiche une icône même quand heading est absent', async () => {
    document.body.innerHTML =
      '<tp-callout icon="info">Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]') as HTMLElement;
    const icon = heading.querySelector('tp-icon');

    expect(heading.hidden).toBe(false);
    expect(icon).toBeInstanceOf(HTMLElement);
    expect(icon?.getAttribute('name')).toBe('info');
    expect(heading.querySelector('[data-tp-callout-heading-text]')).toBeNull();
  });

  it('affiche un bouton de fermeture quand closable est présent', async () => {
    document.body.innerHTML =
      '<tp-callout closable>Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]') as HTMLElement;
    const closeButton = heading.querySelector('[data-tp-callout-close]');

    expect(heading.hidden).toBe(false);
    expect(closeButton?.tagName).toBe('TP-ICON-BUTTON');
    expect(closeButton?.getAttribute('name')).toBe('close');

    (closeButton as HTMLElement).click();

    expect(callout.hidden).toBe(true);
  });

  it('mappe la propriété title vers heading sans conserver l’attribut title natif', async () => {
    const callout = document.createElement('tp-callout') as HTMLElement & {
      title: string;
    };

    callout.title = 'Important';
    callout.textContent = 'Body';
    document.body.append(callout);
    await flush();

    expect(callout.getAttribute('heading')).toBe('Important');
    expect(callout.getAttribute('title')).toBeNull();

    const heading = callout.querySelector('[data-tp-callout-heading]');
    expect(heading?.textContent).toBe('Important');
  });

  it('convertit l’attribut title natif en heading et supprime le tooltip natif', async () => {
    document.body.innerHTML =
      '<tp-callout title="Attention">Body</tp-callout>';
    await flush();

    const callout = getCallout();

    expect(callout.getAttribute('heading')).toBe('Attention');
    expect(callout.getAttribute('title')).toBeNull();

    const heading = callout.querySelector('[data-tp-callout-heading]');
    expect(heading?.textContent).toBe('Attention');
  });

  it('masque le heading quand heading est absent', async () => {
    document.body.innerHTML =
      '<tp-callout>Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]') as HTMLElement;

    expect(heading).toBeInstanceOf(HTMLDivElement);
    expect(heading.hidden).toBe(true);
    expect(heading.textContent).toBe('');
  });

  it('gère le booléen outlined par présence/absence', async () => {
    document.body.innerHTML =
      '<tp-callout outlined>Body</tp-callout>';
    await flush();

    const callout = getCallout();
    expect(callout.hasAttribute('outlined')).toBe(true);

    callout.removeAttribute('outlined');
    await flush();

    expect(callout.hasAttribute('outlined')).toBe(false);
  });

  it('conserve le contenu enfant', async () => {
    document.body.innerHTML = `
      <tp-callout variant="info">
        <p>Hello</p>
      </tp-callout>
    `;
    await flush();

    const callout = getCallout();
    const paragraph = callout.querySelector('p');

    expect(paragraph).toBeInstanceOf(HTMLParagraphElement);
    expect(paragraph?.textContent).toBe('Hello');
  });

  it('conserve plusieurs enfants et leur ordre', async () => {
    document.body.innerHTML = `
      <tp-callout variant="brand">
        <h3>Title</h3>
        <p>Body</p>
      </tp-callout>
    `;
    await flush();

    const callout = getCallout();
    const contentChildren = Array.from(callout.children).filter(
      (child) => !child.hasAttribute('data-tp-callout-heading'),
    );

    expect(contentChildren).toHaveLength(2);
    expect(contentChildren[0]).toBeInstanceOf(HTMLHeadingElement);
    expect(contentChildren[1]).toBeInstanceOf(HTMLParagraphElement);
    expect(contentChildren[0]?.textContent).toBe('Title');
    expect(contentChildren[1]?.textContent).toBe('Body');
  });

  it('met à jour la variante quand l’attribut change', async () => {
    document.body.innerHTML = '<tp-callout variant="info">Body</tp-callout>';
    await flush();

    const callout = getCallout();
    expect(callout.getAttribute('variant')).toBe('info');

    callout.setAttribute('variant', 'brand');
    await flush();

    expect(callout.getAttribute('variant')).toBe('brand');
  });

  it('met à jour le heading quand l’attribut heading change', async () => {
    document.body.innerHTML =
      '<tp-callout heading="Before">Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]');

    expect(heading?.textContent).toBe('Before');

    callout.setAttribute('heading', 'After');
    await flush();

    expect(heading?.textContent).toBe('After');
  });

  it('met à jour l’icône quand l’attribut icon change', async () => {
    document.body.innerHTML =
      '<tp-callout icon="info">Body</tp-callout>';
    await flush();

    const callout = getCallout();
    const heading = callout.querySelector('[data-tp-callout-heading]') as HTMLElement;

    expect(heading.querySelector('tp-icon')?.getAttribute('name')).toBe('info');

    callout.setAttribute('icon', 'warning');
    await flush();

    expect(heading.querySelector('tp-icon')?.getAttribute('name')).toBe('warning');

    callout.removeAttribute('icon');
    await flush();

    expect(heading.hidden).toBe(true);
    expect(heading.querySelector('tp-icon')).toBeNull();
  });

  it('affiche le callout comme toast puis le masque après le délai', async () => {
    vi.useFakeTimers();
    document.body.innerHTML =
      '<tp-callout hidden>Body</tp-callout>';
    await flush();

    const callout = getCallout() as HTMLElement & {
      toast(delay?: number): void;
    };

    callout.toast(1000);

    expect(callout.hidden).toBe(false);
    expect(callout.hasAttribute('data-tp-callout-toast')).toBe(true);
    expect(callout.getAttribute('role')).toBe('status');

    vi.advanceTimersByTime(999);
    expect(callout.hidden).toBe(false);

    vi.advanceTimersByTime(1);
    expect(callout.hidden).toBe(true);
    expect(callout.hasAttribute('data-tp-callout-toast')).toBe(false);
  });

  it('utilise les tokens de couleur de tp.css dans sa feuille de style', async () => {
    document.body.innerHTML = '<tp-callout variant="success">Body</tp-callout>';
    await flush();

    const styleEl = document.head.querySelector('#tp-callout-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('var(--tp-success-fill-softer)');
    expect(cssText).toContain('var(--tp-danger-fill-softer)');
    expect(cssText).toContain('var(--tp-brand-fill-softer)');
    expect(cssText).toContain('var(--tp-text-body)');
    expect(cssText).toContain('display: flow-root;');
  });

  it('expose toutes ses propriétés publiques', () => {
    const element = document.createElement('tp-callout') as TpCallout;
    element.variant = 'info';
    element.title = 'Title';
    element.heading = 'Heading';
    element.icon = 'info';
    element.library = 'custom';
    element.closable = true;
    element.outlined = true;
    expect(element.variant).toBe('info');
    expect(element.title).toBe('Heading');
    expect(element.icon).toBe('info');
    expect(element.library).toBe('custom');
    expect(element.closable).toBe(true);
    expect(element.outlined).toBe(true);
  });

  it('ferme immédiatement un toast sans délai', async () => {
    document.body.innerHTML = '<tp-callout closable heading="Notice">Body</tp-callout>';
    await flush();
    const element = document.querySelector('tp-callout') as TpCallout;
    element.toast(0);
    expect(element.hidden).toBe(false);
    element.querySelector<HTMLElement>('[data-tp-callout-close]')?.click();
    expect(element.hidden).toBe(true);
    expect(element.hasAttribute('role')).toBe(false);
  });
});
