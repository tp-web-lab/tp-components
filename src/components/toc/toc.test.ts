/**
 * @module toc/test
 * @summary Tests du composant `<tp-toc>`.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import './toc.js';

async function flush(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

describe('<tp-toc>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  });

  it('est défini', () => {
    expect(customElements.get('tp-toc')).toBeDefined();
  });

  it('expose les couleurs du panneau avec des propriétés CSS', async () => {
    document.body.innerHTML = '<tp-toc></tp-toc>';
    await flush();

    const css = document.getElementById('tp-toc-styles')?.textContent ?? '';
    expect(css).toContain('--tp-toc-background');
    expect(css).toContain('--tp-toc-border-color');
    expect(css).toContain('--tp-toc-color');
    expect(css).toContain('tp-toc[brand]');
  });

  it('reflète la variante brand', () => {
    const toc = document.createElement('tp-toc') as HTMLElement & { brand: boolean };
    toc.brand = true;
    expect(toc.hasAttribute('brand')).toBe(true);
    expect(toc.brand).toBe(true);
    toc.brand = false;
    expect(toc.hasAttribute('brand')).toBe(false);
  });

  it('laisse le navigateur gérer un clic modifié', async () => {
    document.body.innerHTML = `<main><tp-toc></tp-toc><h1 id="target">Target</h1></main>`;
    await flush();
    const event = new MouseEvent('click', { bubbles: true, ctrlKey: true });
    document.querySelector('tp-toc a')?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);

    const alreadyHandled = new MouseEvent('click', { bubbles: true, cancelable: true });
    alreadyHandled.preventDefault();
    document.querySelector('tp-toc a')?.dispatchEvent(alreadyHandled);
    expect(alreadyHandled.defaultPrevented).toBe(true);
  });

  it('reflète les propriétés publiques avec leurs valeurs de repli', () => {
    const toc = document.createElement('tp-toc') as HTMLElement & {
      expandAll: boolean;
      label: string;
      open: boolean;
      position: string;
    };
    expect(toc.label).toBe('Contents');
    toc.label = 'Plan';
    toc.position = 'end';
    toc.open = true;
    toc.expandAll = true;
    expect(toc.label).toBe('Plan');
    expect(toc.position).toBe('end');
    expect(toc.open).toBe(true);
    expect(toc.expandAll).toBe(true);
    toc.label = '  ';
    toc.position = 'invalid';
    toc.open = false;
    toc.expandAll = false;
    expect(toc.label).toBe('Contents');
    expect(toc.position).toBe('center');
  });

  it('ignore les titres vides et produit des identifiants uniques', async () => {
    document.body.innerHTML = `<main><tp-toc></tp-toc><h1>Same</h1><h2>Same</h2><h3> </h3><h4>!!!</h4></main>`;
    await flush();
    expect(document.querySelector('h1')?.id).toBe('same');
    expect(document.querySelector('h2')?.id).toBe('same-2');
    expect(document.querySelector('h3')?.id).toBe('');
    expect(document.querySelector('h4')?.id).toBe('section');
    expect(document.querySelectorAll('tp-toc a')).toHaveLength(3);
  });

  it('rend les titres de la page dans un tp-tree', async () => {
    document.body.innerHTML = `
      <main>
        <tp-toc label="Sommaire"></tp-toc>
        <h1>Introduction</h1>
        <h2>Usage</h2>
        <h3>Détails</h3>
      </main>
    `;
    await flush();

    const toc = document.querySelector('tp-toc');
    const details = toc?.querySelector<HTMLDetailsElement>('details[data-tp-toc-panel]');
    const summary = toc?.querySelector('summary[data-tp-toc-label]');
    const tree = toc?.querySelector('tp-tree');
    const links = Array.from(toc?.querySelectorAll<HTMLAnchorElement>('a') ?? []);

    expect(toc?.getAttribute('position')).toBe('center');
    expect(toc?.getAttribute('data-position')).toBe('center');
    expect(details?.open).toBe(false);
    expect(summary?.textContent).toBe('Sommaire');
    expect(tree).not.toBeNull();
    expect(links.map((link) => link.textContent)).toEqual(['Introduction', 'Usage', 'Détails']);
    expect(document.querySelector('h1')?.id).toBe('introduction');
    expect(document.querySelector('h2')?.id).toBe('usage');
  });

  it('ouvre le panneau et développe le tp-tree avec les attributs open et expand-all', async () => {
    document.body.innerHTML = `
      <main>
        <tp-toc open expand-all></tp-toc>
        <h1>Introduction</h1>
        <h2>Usage</h2>
        <h3>Détails</h3>
      </main>
    `;
    await flush();

    const toc = document.querySelector('tp-toc');
    const details = toc?.querySelector<HTMLDetailsElement>('details[data-tp-toc-panel]');
    const expandedItems = Array.from(
      toc?.querySelectorAll('tp-tree li[data-expanded="true"]') ?? [],
    );

    expect(details?.open).toBe(true);
    expect(expandedItems.length).toBeGreaterThan(0);
  });

  it('préserve la route hash courante dans les liens', async () => {
    window.location.hash = '#/components/code-editor/index.md';
    document.body.innerHTML = `
      <main>
        <h1>Code editor</h1>
        <tp-toc></tp-toc>
      </main>
    `;
    await flush();

    const link = document.querySelector<HTMLAnchorElement>('tp-toc a');
    expect(link?.getAttribute('href')).toBe('#/components/code-editor/index.md#code-editor');
  });

  it('fait défiler vers le titre au clic sur un lien interne', async () => {
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    window.location.hash = '#/components/code-editor/index.md';
    document.body.innerHTML = `
      <main>
        <h1>Code editor</h1>
        <tp-toc></tp-toc>
      </main>
    `;
    await flush();

    const click = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    document.querySelector<HTMLAnchorElement>('tp-toc a')?.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('#/components/code-editor/index.md#code-editor');
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });

  it('normalise les positions invalides vers center', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Title</h1>
        <tp-toc position="right"></tp-toc>
      </main>
    `;
    await flush();

    const toc = document.querySelector('tp-toc');
    expect(toc?.getAttribute('position')).toBe('center');
    expect(toc?.getAttribute('data-position')).toBe('center');
  });

  it('met à jour la table des matières quand un titre est ajouté', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Initial</h1>
        <tp-toc position="end"></tp-toc>
      </main>
    `;
    await flush();

    const heading = document.createElement('h2');
    heading.textContent = 'Added';
    document.querySelector('main')?.append(heading);
    await flush();

    const toc = document.querySelector('tp-toc');
    const links = Array.from(toc?.querySelectorAll<HTMLAnchorElement>('a') ?? []);

    expect(toc?.getAttribute('data-position')).toBe('end');
    expect(links.map((link) => link.textContent)).toEqual(['Initial', 'Added']);
  });

  it('limite un exemple Markdown aux titres de son panneau de sortie', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Documentation page</h1>
        <div class="tp-md-mdviewer-output">
          <tp-toc open></tp-toc>
          <h1>Example title</h1>
          <h2>Example child</h2>
        </div>
      </main>
    `;
    await flush();

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('tp-toc a'),
      (link) => link.textContent,
    );
    expect(links).toEqual(['Example title', 'Example child']);
  });

  it('ignore les titres des composants et documents imbriqués', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Viewer documentation</h1>
        <tp-toc></tp-toc>
        <section>
          <h2>Usage</h2>
        </section>
        <tp-html-viewer>
          <div role="example">
            <h2>Example title</h2>
          </div>
        </tp-html-viewer>
        <article>
          <h2>Embedded article</h2>
        </article>
        <div data-tp-toc-scope>
          <h2>Nested contents</h2>
        </div>
      </main>
    `;
    await flush();

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('tp-toc a'),
      (link) => link.textContent,
    );

    expect(links).toEqual(['Viewer documentation', 'Usage']);
    expect(document.querySelector('tp-html-viewer h2')?.id).toBe('');
    expect(document.querySelector('article h2')?.id).toBe('');
  });

  it('préserve son affichage pendant les mutations internes aux viewers', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Viewer documentation</h1>
        <tp-toc open></tp-toc>
        <h2>Usage</h2>
        <tp-markdown-viewer>
          <div data-role="output"><h2>Rendered example</h2></div>
        </tp-markdown-viewer>
      </main>
    `;
    await flush();

    const toc = document.querySelector('tp-toc');
    const panel = toc?.querySelector<HTMLDetailsElement>('details[data-tp-toc-panel]');
    const tree = toc?.querySelector('tp-tree');
    const output = document.querySelector<HTMLElement>(
      'tp-markdown-viewer [data-role="output"]',
    );
    expect(panel?.open).toBe(true);

    output?.replaceChildren(document.createElement('tp-code-editor'));
    await flush();

    expect(toc?.querySelector('details[data-tp-toc-panel]')).toBe(panel);
    expect(toc?.querySelector('tp-tree')).toBe(tree);
    expect(panel?.open).toBe(true);
  });
});
