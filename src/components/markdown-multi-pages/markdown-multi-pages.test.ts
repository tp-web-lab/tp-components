/**
 * @module markdown-multi-pages/test
 * @summary Tests du composant `<tp-markdown-multi-pages>`.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { TpMarkdownMultiPages } from './markdown-multi-pages.js';
import multiMarkdownStyle from './markdown-multi-pages.css?inline';
import sidebarMarkdown from '../../../public/docs/sidebar.md?raw';

async function flush(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

async function waitFor(
  predicate: () => boolean,
  timeoutMs = 500,
): Promise<void> {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt > timeoutMs) break;
    await flush();
  }
}

function mockDocsFetch(files: Record<string, string>): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input), window.location.href);
      const source = files[url.pathname];

      return {
        ok: source !== undefined,
        status: source === undefined ? 404 : 200,
        text: async () => source ?? '',
      } as Response;
    }),
  );
}

function mockViewportWidth(matchesSmallViewport: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      return {
        matches: query === '(max-width: 48rem)' && matchesSmallViewport,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList;
    }),
  );
}

function createMultiMarkdownShell(): TpMarkdownMultiPages {
  const element = new TpMarkdownMultiPages();
  const shellElement = element as unknown as {
    renderShell: () => void;
  };

  shellElement.renderShell();
  return element;
}

describe('<tp-markdown-multi-pages>', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  });

  it('résout les liens relatifs du contenu depuis le document courant', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': '- [Current](guide/current.md)',
      '/docs/guide/current.md': '[Next](./next.html#usage)',
      '/docs/guide/next.md': '# Next',
    });
    window.location.hash = '#/guide/current.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', 'docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('main a[href="./next.html#usage"]') !== null);

    const click = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    element
      .querySelector<HTMLAnchorElement>('main a[href="./next.html#usage"]')
      ?.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('#/guide/next.md#usage');
  });

  it('ajoute une navigation previous/next selon l’ordre de la sidebar', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': [
        '- [**Introduction**](intro.md)',
        '- [Current page](guide/current.md)',
        '- [Next page](guide/next.md)',
      ].join('\n'),
      '/docs/intro.md': '# Introduction',
      '/docs/guide/current.md': '# Current',
      '/docs/guide/next.md': '# Next',
    });
    window.location.hash = '#/guide/current.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() =>
      element.querySelector('tp-markdown > .tp-markdown-output .tp-markdown-multi-pages-page-nav') !== null,
    );

    const previous = element.querySelector<HTMLAnchorElement>(
      '.tp-markdown-multi-pages-page-nav-previous a',
    );
    const top = element.querySelector<HTMLButtonElement>(
      '.tp-markdown-multi-pages-page-nav-top button',
    );
    const next = element.querySelector<HTMLAnchorElement>(
      '.tp-markdown-multi-pages-page-nav-next a',
    );

    expect(previous?.getAttribute('href')).toBe('#/intro.md');
    expect(previous?.textContent).toContain('Introduction');
    expect(top?.textContent).toContain('Top');
    expect(top?.textContent).toContain('Current page');
    expect(next?.getAttribute('href')).toBe('#/guide/next.md');
    expect(next?.textContent).toContain('Next page');

    const click = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    next?.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('#/guide/next.md');
  });

  it('ajoute un bouton top qui remonte au début du contenu courant', async () => {
    const scrollTo = vi.fn();
    mockDocsFetch({
      '/docs/sidebar.md': [
        '- [Introduction](intro.md)',
        '- [Current page](guide/current.md)',
      ].join('\n'),
      '/docs/intro.md': '# Introduction',
      '/docs/guide/current.md': '# Current',
    });
    window.location.hash = '#/guide/current.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() =>
      element.querySelector('tp-markdown > .tp-markdown-output .tp-markdown-multi-pages-page-nav') !== null,
    );

    const content = element.querySelector<HTMLElement>('[data-role="content"]');
    content!.scrollTo = scrollTo;
    const top = element.querySelector<HTMLButtonElement>(
      '.tp-markdown-multi-pages-page-nav-top button',
    );

    expect(top?.textContent).toContain('Current page');

    top?.click();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('déduit l’ordre previous/next depuis la sidebar réelle', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': sidebarMarkdown,
      '/docs/cover.md': '# Cover',
      '/docs/index.md': '# Introduction',
      '/docs/components/index.md': '# Components',
      '/docs/components/controllers.md': '# Controllers',
      '/docs/components/dir/index.md': '# Direction',
    });
    window.location.hash = '#/index.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() =>
      element.querySelector('tp-markdown > .tp-markdown-output .tp-markdown-multi-pages-page-nav') !== null,
    );

    const previous = element.querySelector<HTMLAnchorElement>(
      '.tp-markdown-multi-pages-page-nav-previous a',
    );
    const next = element.querySelector<HTMLAnchorElement>(
      '.tp-markdown-multi-pages-page-nav-next a',
    );

    expect(previous?.getAttribute('href')).toBe('#/cover.md');
    expect(previous?.textContent).toContain('tp-components');
    expect(next?.getAttribute('href')).toBe('#/components/index.md');
    expect(next?.textContent).toContain('Components');
  });

  it('résout les liens de TOC hash-routés sans charger le fragment comme un fichier', async () => {
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    mockDocsFetch({
      '/docs/sidebar.md': '- [Current](guide/current.md)',
      '/docs/guide/current.md': '# Current\n\n<a href="#/docs/guide/current.md#section">Section</a>\n\n## Section',
    });
    window.location.hash = '#/guide/current.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('main a[href="#/docs/guide/current.md#section"]') !== null);

    const click = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    element
      .querySelector<HTMLAnchorElement>('main a[href="#/docs/guide/current.md#section"]')
      ?.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('#/guide/current.md#section');
    await waitFor(() => scrollIntoView.mock.calls.length > 0);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });

  it('convertit les ancres seules en fragments de la route courante', async () => {
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    mockDocsFetch({
      '/docs/sidebar.md': '- [Current](guide/current.md)',
      '/docs/guide/current.md': [
        '[Section](#section)',
        '[External](https://example.com)',
        '',
        '## Section',
      ].join('\n\n'),
    });
    window.location.hash = '#/guide/current.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelectorAll('main a[href]').length === 2);

    const anchorLink = element.querySelector<HTMLAnchorElement>('main a[href="#section"]');
    const externalLink = element.querySelector<HTMLAnchorElement>(
      'main a[href="https://example.com"]',
    );
    const shouldHandleDocumentLink = (
      element as unknown as {
        shouldHandleDocumentLink(link: HTMLAnchorElement, href: string): boolean;
      }
    ).shouldHandleDocumentLink.bind(element);

    expect(anchorLink).not.toBeNull();
    expect(externalLink).not.toBeNull();
    expect(
      externalLink === null
        ? true
        : shouldHandleDocumentLink(externalLink, 'https://example.com'),
    ).toBe(false);

    const click = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    anchorLink?.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('#/guide/current.md#section');
    await waitFor(() => scrollIntoView.mock.calls.length > 0);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });

  it('ouvre le tree de sidebar jusqu’au niveau 2 par défaut', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': [
        '- [Level 1](level-1.md)',
        '  - [Level 2](level-2.md)',
        '    - [Level 3](level-3.md)',
        '      - [Level 4](level-4.md)',
      ].join('\n'),
      '/docs/index.md': '# Home',
    });

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('tp-tree') !== null);

    const tree = element.querySelector('tp-tree');
    const items = Array.from(element.querySelectorAll<HTMLLIElement>('tp-tree li'));

    expect(tree?.getAttribute('level')).toBe('2');
    expect(items[0]?.getAttribute('data-expanded')).toBe('true');
    expect(items[1]?.getAttribute('data-expanded')).toBe('true');
    expect(items[2]?.getAttribute('data-expanded')).toBe('false');
  });

  it('ajoute les contrôles expand, collapse et sort au-dessus du tree de sidebar', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': [
        '- [Beta](beta.md)',
        '  - [Delta](delta.md)',
        '- [Alpha](alpha.md)',
        '  - [Gamma](gamma.md)',
      ].join('\n'),
      '/docs/index.md': '# Home',
    });

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('.tp-markdown-multi-pages-sidebar-controls') !== null);

    const controls = element.querySelector('.tp-markdown-multi-pages-sidebar-controls');
    const tree = element.querySelector('tp-tree') as HTMLElement & {
      expandAll(): void;
      collapseAll(): void;
      sortAll(): void;
    };
    const buttons = Array.from(
      element.querySelectorAll<HTMLElement>('.tp-markdown-multi-pages-sidebar-controls tp-icon-button'),
    );

    expect(controls?.nextElementSibling).toBe(tree);
    expect(buttons.map((button) => button.getAttribute('name'))).toEqual([
      'arrow-expand-vertical',
      'arrow-collapse-vertical',
      'sort-alphabetical-ascending',
    ]);

    buttons[1]?.click();
    expect(
      Array.from(element.querySelectorAll<HTMLLIElement>('tp-tree li'))
        .every((item) => item.getAttribute('data-expanded') !== 'true'),
    ).toBe(true);

    buttons[0]?.click();
    expect(
      Array.from(element.querySelectorAll<HTMLLIElement>('tp-tree li'))
        .filter((item) => item.querySelector(':scope > ul') !== null)
        .every((item) => item.getAttribute('data-expanded') === 'true'),
    ).toBe(true);

    buttons[2]?.click();
    const topLabels = Array.from(element.querySelectorAll<HTMLLIElement>('tp-tree li'))
      .filter((item) => item.parentElement?.closest('li') === null)
      .map((item) => {
        const row = item.querySelector<HTMLElement>(':scope > [data-tp-tree-row]');
        const clone = row?.cloneNode(true);
        if (!(clone instanceof HTMLElement)) return undefined;
        clone.querySelector('[data-tp-tree-toggle]')?.remove();
        return clone.textContent?.trim();
      });
    expect(topLabels).toEqual(['Alpha', 'Beta']);
  });

  it('limite le menu contextuel de sidebar aux sous-arbres', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': [
        '- [Parent](parent.md)',
        '  - [Child](child.md)',
        '- [Leaf](leaf.md)',
      ].join('\n'),
      '/docs/index.md': '# Home',
    });

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('tp-tree li') !== null);

    const tree = element.querySelector('tp-tree');
    const items = Array.from(element.querySelectorAll<HTMLLIElement>('tp-tree li'));
    const parent = items.find((item) => item.textContent?.includes('Parent'));
    const leaf = items.find((item) => item.textContent?.includes('Leaf'));

    leaf?.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 16,
      clientY: 16,
    }));
    expect(document.querySelector('[data-tp-tree-contextmenu]')).toBeNull();

    parent?.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 16,
      clientY: 16,
    }));

    const menu = document.querySelector('[data-tp-tree-contextmenu]');
    const actions = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tp-tree-contextmenu-action]'),
    ).map((action) => action.getAttribute('data-action-id'));

    expect(menu).not.toBeNull();
    expect(actions).toEqual(['expand', 'collapse', 'sort']);
    expect(tree?.querySelector('[data-tp-tree-contextmenu]')).toBeNull();
  });

  it('normalise les chemins relatifs et absolus', () => {
    const element = new TpMarkdownMultiPages();
    element.repository = '/docs';
    const resolveDocumentHref = (
      element as unknown as {
        resolveDocumentHref(href: string, baseHref?: string): string;
      }
    ).resolveDocumentHref.bind(element);

    expect(resolveDocumentHref('./next.html#usage', '/docs/guide/current.md')).toBe(
      '/docs/guide/next.md#usage',
    );
    expect(resolveDocumentHref('#/docs/guide/current.md#section')).toBe(
      '/docs/guide/current.md#section',
    );
    expect(resolveDocumentHref('../intro.md', '/docs/guide/current.md')).toBe(
      '/docs/intro.md',
    );
    expect(resolveDocumentHref('/docs/api/index.md')).toBe('/docs/api/index.md');
    expect(resolveDocumentHref('/outside.md')).toBe('/outside.md');
  });

  it('ouvre la sidebar depuis la gauche en largeur réduite', () => {
    const mobileBreakpoint = multiMarkdownStyle.indexOf('@media (max-width: 48rem)');
    const mobileStyle = multiMarkdownStyle.slice(mobileBreakpoint);

    expect(mobileBreakpoint).toBeGreaterThanOrEqual(0);
    expect(mobileStyle).toContain(
      '.tp-markdown-multi-pages[sidebar-open] .tp-markdown-multi-pages-sidebar',
    );
    expect(mobileStyle).toContain('inset-inline-start: 0;');
    expect(mobileStyle).toContain('display: none;');
    expect(mobileStyle).toContain('display: block;');
  });

  it('utilise tp-splitter pour séparer et redimensionner la sidebar du contenu', async () => {
    mockViewportWidth(false);
    const element = createMultiMarkdownShell();
    document.body.append(element);
    await flush();
    const layout = element.querySelector('tp-splitter.tp-markdown-multi-pages');

    expect(layout).toBeTruthy();
    expect(layout?.getAttribute('axis')).toBe('horizontal');
    expect(layout?.getAttribute('position')).toBe('20%');
    expect(layout?.querySelector(':scope > dl > .tp-markdown-multi-pages-sidebar-panel')).toBeTruthy();
    expect(layout?.querySelector(':scope > dl > .tp-markdown-multi-pages-content-panel')).toBeTruthy();
    expect(layout?.querySelector('[data-tp-splitter-divider]')).toBeTruthy();
  });

  it('dimensionne le composant sur la fenêtre', async () => {
    mockViewportWidth(false);
    const element = document.createElement('tp-markdown-multi-pages');
    document.body.append(element);
    await flush();

    expect(element.style.position).toBe('fixed');
    expect(element.style.insetBlock).toBe('0px');
    expect(element.style.insetInline).toBe('0.5rem');
    expect(element.style.width).toBe('auto');
    expect(element.style.height).toBe('auto');
    expect(element.style.overflow).toBe('hidden');
    expect(multiMarkdownStyle).toContain('position: fixed;');
    expect(multiMarkdownStyle).toContain('inset-block: 0;');
    expect(multiMarkdownStyle).toContain('inset-inline: 0.5rem;');
    expect(multiMarkdownStyle).toContain('inline-size: auto;');
    expect(multiMarkdownStyle).toContain('block-size: auto;');
    expect(multiMarkdownStyle).toContain('.tp-markdown-multi-pages > dl');
    expect(multiMarkdownStyle).toContain('.tp-markdown-multi-pages-sidebar-panel,');
    expect(multiMarkdownStyle).toContain('overflow: hidden;');
    expect(multiMarkdownStyle).toContain('.tp-markdown-multi-pages .tp-markdown-multi-pages-sidebar-panel');
    expect(multiMarkdownStyle).toContain('.tp-markdown-multi-pages[sidebar-open] .tp-markdown-multi-pages-sidebar-panel');
  });

  it('rend la toolbar adaptable aux petites largeurs', () => {
    const mobileBreakpoint = multiMarkdownStyle.indexOf('@media (max-width: 48rem)');
    const mobileStyle = multiMarkdownStyle.slice(mobileBreakpoint);

    expect(multiMarkdownStyle).toContain('flex-wrap: wrap;');
    expect(multiMarkdownStyle).toContain('.tp-markdown-multi-pages-toolbar > [data-toolbar-center]');
    expect(multiMarkdownStyle).toContain('text-overflow: ellipsis;');
    expect(mobileStyle).toContain('flex: 1 0 100%;');
    expect(mobileStyle).toContain('order: 3;');
  });

  it('ajoute tp-fullscreen à la fin de la section end de la toolbar', () => {
    mockViewportWidth(false);
    const element = createMultiMarkdownShell();

    const endSectionItems = Array.from(
      element.querySelectorAll<HTMLElement>('.tp-markdown-multi-pages-toolbar > [section="end"]'),
    );
    const fullscreen = element.querySelector<HTMLElement>('tp-fullscreen');

    expect(fullscreen).toBeTruthy();
    expect(fullscreen?.getAttribute('section')).toBe('end');
    expect(endSectionItems.at(-1)).toBe(fullscreen);
  });

  it('transmet langs au tp-lang de la toolbar', () => {
    mockViewportWidth(false);
    const element = new TpMarkdownMultiPages();
    element.setAttribute('langs', 'en,fr,es,ma,ru,cn');
    const shellElement = element as unknown as {
      renderShell: () => void;
    };

    shellElement.renderShell();

    const lang = element.querySelector<HTMLElement>('.tp-markdown-multi-pages-toolbar > tp-lang');
    expect(lang?.getAttribute('langs')).toBe('en,fr,es,ma,ru,cn');

    element.setAttribute('langs', 'en,fr');
    const attrElement = element as unknown as {
      attributeChangedCallback: (name: string) => void;
      isConnected: boolean;
    };
    Object.defineProperty(attrElement, 'isConnected', {
      configurable: true,
      value: true,
    });
    attrElement.attributeChangedCallback('langs');

    expect(lang?.getAttribute('langs')).toBe('en,fr');
  });

  it('applique la direction du document depuis le code langue du repository', () => {
    mockViewportWidth(false);
    const element = new TpMarkdownMultiPages();
    element.setAttribute('repository', '/docs/components/lang/demo/ma');
    element.setAttribute('langs', 'en,fr,es,ma,ru,cn');
    const shellElement = element as unknown as {
      renderShell: () => void;
    };

    shellElement.renderShell();

    const sidebar = element.querySelector<HTMLElement>('[data-role="sidebar"]');
    const content = element.querySelector<HTMLElement>('[data-role="content"]');

    expect(sidebar?.getAttribute('lang')).toBe('ma');
    expect(sidebar?.getAttribute('dir')).toBe('rtl');
    expect(content?.getAttribute('lang')).toBe('ma');
    expect(content?.getAttribute('dir')).toBe('rtl');
  });

  it('ajoute tp-source dans la section start de la toolbar', () => {
    mockViewportWidth(false);
    const element = new TpMarkdownMultiPages();
    element.setAttribute('git', 'https://github.com/tp-web-lab/tp-components');
    const shellElement = element as unknown as {
      renderShell: () => void;
    };

    shellElement.renderShell();

    const source = element.querySelector<HTMLElement>('.tp-markdown-multi-pages-toolbar > tp-source');

    expect(source).toBeTruthy();
    expect(source?.getAttribute('section')).toBe('start');
    expect(source?.getAttribute('url')).toBe('https://github.com/tp-web-lab/tp-components');
  });

  it('place le bouton code dans la section start de la toolbar', () => {
    mockViewportWidth(false);
    const element = createMultiMarkdownShell();
    const codeButton = element.querySelector<HTMLElement>(
      'tp-icon-button[data-action="code"]',
    );

    expect(codeButton).toBeTruthy();
    expect(codeButton?.getAttribute('section')).toBe('start');
  });

  it('démarre sidebar fermée par défaut et laisse le bouton menu la basculer', () => {
    mockViewportWidth(false);
    const element = createMultiMarkdownShell();

    const layout = element.querySelector('.tp-markdown-multi-pages');
    const menu = element.querySelector<HTMLElement>('[data-action="menu"]');

    expect(element.hasAttribute('menu')).toBe(false);
    expect(layout?.hasAttribute('sidebar-open')).toBe(false);

    menu?.click();
    expect(element.hasAttribute('menu')).toBe(true);
    expect(layout?.hasAttribute('sidebar-open')).toBe(true);

    menu?.click();
    expect(element.hasAttribute('menu')).toBe(false);
    expect(layout?.hasAttribute('sidebar-open')).toBe(false);
  });

  it('démarre sidebar ouverte quand l’attribut menu est présent', () => {
    mockViewportWidth(false);
    const element = new TpMarkdownMultiPages();
    element.setAttribute('menu', '');
    const shellElement = element as unknown as {
      renderShell: () => void;
    };

    shellElement.renderShell();

    const layout = element.querySelector('.tp-markdown-multi-pages');

    expect(layout?.hasAttribute('sidebar-open')).toBe(true);
  });

  it('synchronise la sidebar quand l’attribut menu change', () => {
    mockViewportWidth(false);
    const element = createMultiMarkdownShell();
    document.body.append(element);

    const layout = element.querySelector('.tp-markdown-multi-pages');

    expect(layout?.hasAttribute('sidebar-open')).toBe(false);

    element.setAttribute('menu', '');
    expect(layout?.hasAttribute('sidebar-open')).toBe(true);

    element.removeAttribute('menu');
    expect(layout?.hasAttribute('sidebar-open')).toBe(false);
  });

  it('démarre sidebar fermée en largeur réduite mais laisse le bouton menu l’ouvrir', () => {
    mockViewportWidth(true);
    const element = createMultiMarkdownShell();

    const layout = element.querySelector('.tp-markdown-multi-pages');
    const menu = element.querySelector<HTMLElement>('[data-action="menu"]');

    expect(layout?.hasAttribute('sidebar-open')).toBe(false);

    menu?.click();
    expect(layout?.hasAttribute('sidebar-open')).toBe(true);

    menu?.click();
    expect(layout?.hasAttribute('sidebar-open')).toBe(false);
  });

  it('laisse les liens absolus hors dépôt au navigateur', async () => {
    mockDocsFetch({
      '/docs/sidebar.md': '- [Current](guide/current.md)',
      '/docs/guide/current.md': '[Outside](/outside.md)',
    });
    window.location.hash = '#/guide/current.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('main a[href="/outside.md"]') !== null);

    const link = element.querySelector<HTMLAnchorElement>('main a[href="/outside.md"]');
    const shouldHandleDocumentLink = (
      element as unknown as {
        shouldHandleDocumentLink(link: HTMLAnchorElement, href: string): boolean;
      }
    ).shouldHandleDocumentLink.bind(element);

    expect(link).not.toBeNull();
    expect(link === null ? true : shouldHandleDocumentLink(link, '/outside.md')).toBe(false);
    expect(window.location.hash).toBe('#/guide/current.md');
  });

  it('rend page-not-found.md une seule fois quand le document demandé manque', async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input), window.location.href);
      const files: Record<string, string> = {
        '/docs/sidebar.md': '- [Missing](missing.md)',
        '/docs/page-not-found.md': '# Page not found\n\nMissing `{{ href }}`',
      };
      const source = files[url.pathname];

      return {
        ok: source !== undefined,
        status: source === undefined ? 404 : 200,
        text: async () => source ?? '',
      } as Response;
    });
    vi.stubGlobal('fetch', fetch);
    window.location.hash = '#/missing.md';

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.textContent?.includes('Missing /docs/missing.md') === true);

    const requestedPaths = fetch.mock.calls.map((call) => {
      return new URL(String(call[0]), window.location.href).pathname;
    });

    expect(requestedPaths.filter((path) => path === '/docs/missing.md')).toHaveLength(1);
    expect(requestedPaths.filter((path) => path === '/docs/page-not-found.md')).toHaveLength(1);
    expect(element.textContent).toContain('Missing /docs/missing.md');
  });

  it('affiche page-not-found.md depuis un lien manquant de la sidebar', async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input), window.location.href);
      const files: Record<string, string> = {
        '/docs/sidebar.md': '- [Appendices](appendices.md)',
        '/docs/cover.md': '# Cover',
        '/docs/page-not-found.md': '# Page not found\n\nMissing `{{ href }}`',
      };
      const source = files[url.pathname];

      return {
        ok: source !== undefined,
        status: source === undefined ? 404 : 200,
        text: async () => source ?? '',
      } as Response;
    });
    vi.stubGlobal('fetch', fetch);

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('aside a[href="#/appendices.md"]') !== null);

    const click = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    });
    element.querySelector<HTMLAnchorElement>('aside a[href="#/appendices.md"]')?.dispatchEvent(click);

    await waitFor(() => element.textContent?.includes('Missing /docs/appendices.md') === true);

    const requestedPaths = fetch.mock.calls.map((call) => {
      return new URL(String(call[0]), window.location.href).pathname;
    });

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('#/appendices.md');
    expect(requestedPaths.filter((path) => path === '/docs/appendices.md')).toHaveLength(1);
    expect(requestedPaths.filter((path) => path === '/docs/page-not-found.md')).toHaveLength(1);
    expect(element.textContent).toContain('Missing /docs/appendices.md');
  });

  it('traite le fallback HTML du serveur comme une page Markdown absente', async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input), window.location.href);
      const files: Record<string, { contentType: string; source: string }> = {
        '/docs/sidebar.md': {
          contentType: 'text/markdown',
          source: '- [Appendices](appendices.md)',
        },
        '/docs/cover.md': {
          contentType: 'text/markdown',
          source: '# Cover',
        },
        '/docs/appendices.md': {
          contentType: 'text/html',
          source: '<!doctype html><html><body><tp-markdown-multi-pages></tp-markdown-multi-pages></body></html>',
        },
        '/docs/page-not-found.md': {
          contentType: 'text/markdown',
          source: '# Page not found\n\nMissing `{{ href }}`',
        },
      };
      const file = files[url.pathname];

      return {
        ok: file !== undefined,
        status: file === undefined ? 404 : 200,
        headers: new Headers({
          'content-type': file?.contentType ?? 'text/plain',
        }),
        text: async () => file?.source ?? '',
      } as Response;
    });
    vi.stubGlobal('fetch', fetch);

    const element = document.createElement('tp-markdown-multi-pages');
    element.setAttribute('repository', '/docs');
    document.body.append(element);

    await waitFor(() => element.querySelector('aside a[href="#/appendices.md"]') !== null);
    element.querySelector<HTMLAnchorElement>('aside a[href="#/appendices.md"]')?.click();

    await waitFor(() => element.textContent?.includes('Missing /docs/appendices.md') === true);

    expect(element.querySelector('main tp-markdown-multi-pages')).toBeNull();
    expect(element.textContent).toContain('Missing /docs/appendices.md');
  });
});
