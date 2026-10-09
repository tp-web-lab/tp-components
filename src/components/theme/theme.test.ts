import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './theme.js';

type MatchMediaListener = (event: MediaQueryListEvent) => void;

class MatchMediaMock {
  private listeners = new Set<MatchMediaListener>();

  public constructor(private isDark: boolean) {}

  public get matches(): boolean {
    return this.isDark;
  }

  public get media(): string {
    return '(prefers-color-scheme: dark)';
  }

  public onchange: ((event: MediaQueryListEvent) => void) | null = null;

  public addEventListener(_type: 'change', listener: MatchMediaListener): void {
    this.listeners.add(listener);
  }

  public removeEventListener(_type: 'change', listener: MatchMediaListener): void {
    this.listeners.delete(listener);
  }

  public addListener(listener: MatchMediaListener): void {
    this.listeners.add(listener);
  }

  public removeListener(listener: MatchMediaListener): void {
    this.listeners.delete(listener);
  }

  public dispatchEvent(_event: Event): boolean {
    return true;
  }

  public setDarkMode(enabled: boolean): void {
    this.isDark = enabled;
    const event = { matches: this.isDark } as MediaQueryListEvent;
    for (const listener of [...this.listeners]) {
      listener(event);
    }
  }
}

describe('<tp-theme>', () => {
  let mediaQueryMock: MatchMediaMock;

  beforeEach(() => {
    document.body.className = '';
    document.body.innerHTML = '';
    mediaQueryMock = new MatchMediaMock(false);

    vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryMock));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.className = '';
    document.body.innerHTML = '';
  });

  it('est défini', () => {
    expect(customElements.get('tp-theme')).toBeDefined();
  });

  it('rend un tp-icon-button intégré avec un menu', () => {
    document.body.innerHTML = '<section><tp-theme mode="auto"></tp-theme></section>';
    const control = document.querySelector('tp-theme tp-icon-button');
    const dropdown = document.querySelector('tp-theme tp-dropdown');
    const items = document.querySelectorAll('tp-theme .tp-theme-option');

    expect(control).not.toBeNull();
    expect(control?.getAttribute('name')).toBe('sun');
    expect(control?.getAttribute('data-mode')).toBe('auto');
    expect(control?.getAttribute('data-effective-mode')).toBe('light');
    expect(control?.id).toContain('tp-theme-control-');
    expect(document.querySelector('tp-theme tp-tooltip')).toBeNull();
    expect(dropdown?.getAttribute('anchor')).toBe(`#${control?.id}`);
    expect(items).toHaveLength(3);
  });

  it('transmet variant, size et disabled au déclencheur', () => {
    document.body.innerHTML = '<section><tp-theme variant="brand" size="s" disabled></tp-theme></section>';
    const theme = document.querySelector('tp-theme');
    const trigger = document.querySelector('tp-theme > tp-icon-button');

    expect(trigger?.getAttribute('variant')).toBe('brand');
    expect(trigger?.getAttribute('size')).toBe('s');
    expect(trigger?.hasAttribute('disabled')).toBe(true);

    theme?.setAttribute('variant', 'danger');
    theme?.setAttribute('size', 'l');
    theme?.removeAttribute('disabled');

    expect(trigger?.getAttribute('variant')).toBe('danger');
    expect(trigger?.getAttribute('size')).toBe('l');
    expect(trigger?.hasAttribute('disabled')).toBe(false);
  });

  it('contraint le menu en largeur et le rend scrollable en hauteur', () => {
    document.body.innerHTML = '<section><tp-theme mode="auto"></tp-theme></section>';
    const styleEl = document.getElementById('tp-theme-styles');

    expect(styleEl?.textContent).toContain('tp-theme > tp-dropdown');
    expect(styleEl?.textContent).toContain('min-inline-size: 9rem;');
    expect(styleEl?.textContent).toContain('max-block-size: calc(100vh - 1rem);');
    expect(styleEl?.textContent).toContain('overflow-y: auto;');
    expect(styleEl?.textContent).toContain('overscroll-behavior: contain;');
  });

  it('applique le mode dark sur le parent', () => {
    document.body.innerHTML = '<section><tp-theme mode="dark"></tp-theme></section>';
    const section = document.querySelector('section');

    expect(section?.classList.contains('tp-dark')).toBe(true);
    expect(section?.classList.contains('tp-light')).toBe(false);
  });

  it('applique le mode light sur le parent', () => {
    document.body.innerHTML = '<section class="tp-dark"><tp-theme mode="light"></tp-theme></section>';
    const section = document.querySelector('section');

    expect(section?.classList.contains('tp-light')).toBe(true);
    expect(section?.classList.contains('tp-dark')).toBe(false);
  });

  it('utilise le mode auto avec matchMedia', () => {
    document.body.innerHTML = '<section><tp-theme mode="auto"></tp-theme></section>';
    const section = document.querySelector('section');

    expect(section?.classList.contains('tp-light')).toBe(true);
    expect(section?.classList.contains('tp-dark')).toBe(false);
  });

  it('suit les changements système en mode auto', () => {
    document.body.innerHTML = '<section><tp-theme mode="auto"></tp-theme></section>';
    const section = document.querySelector('section');

    expect(section?.classList.contains('tp-light')).toBe(true);
    mediaQueryMock.setDarkMode(true);
    expect(section?.classList.contains('tp-dark')).toBe(true);
  });

  it('sélectionne un mode via le menu', () => {
    document.body.innerHTML = '<section><tp-theme mode="auto"></tp-theme></section>';
    const section = document.querySelector('section');
    const control = document.querySelector('tp-theme tp-icon-button');
    const dropdown = document.querySelector('tp-theme tp-dropdown');
    const darkItem = document.querySelector<HTMLElement>(
      'tp-theme .tp-theme-option[data-mode="dark"]',
    );

    control?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dropdown?.getAttribute('open')).not.toBeNull();

    darkItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(section?.classList.contains('tp-dark')).toBe(true);
    expect(control?.getAttribute('data-mode')).toBe('dark');
    expect(control?.getAttribute('data-effective-mode')).toBe('dark');
    expect(control?.getAttribute('name')).toBe('moon');
    expect(document.querySelector('tp-theme tp-tooltip')).toBeNull();
  });

  it('émet tp-theme-change avec le thème effectif et la cible', () => {
    document.body.innerHTML = '<section id="scope"><tp-theme mode="light" anchor="#scope"></tp-theme></section>';
    const section = document.getElementById('scope');
    const theme = document.querySelector('tp-theme');
    const events: Array<CustomEvent<{
      mode: string;
      theme: string;
      anchor: string;
      target: HTMLElement;
    }>> = [];
    theme?.addEventListener('tp-theme-change', (event) => {
      events.push(event as CustomEvent<{
        mode: string;
        theme: string;
        anchor: string;
        target: HTMLElement;
      }>);
    });

    theme?.setAttribute('mode', 'dark');

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toMatchObject({
      mode: 'dark',
      theme: 'dark',
      anchor: '#scope',
      target: section,
    });
  });

  it('synchronise deux tp-theme sur le même parent', () => {
    document.body.innerHTML = `
      <section id="scope">
        <tp-theme id="first" mode="auto"></tp-theme>
        <tp-theme id="second" mode="light"></tp-theme>
      </section>
    `;

    const scope = document.getElementById('scope');
    const secondTheme = document.querySelector<HTMLElement>('#second');

    secondTheme?.setAttribute('mode', 'dark');

    expect(scope?.classList.contains('tp-dark')).toBe(true);
    expect(document.querySelector('#first tp-icon-button')?.getAttribute('data-mode')).toBe(
      'dark',
    );
    expect(document.querySelector('#second tp-icon-button')?.getAttribute('data-mode')).toBe(
      'dark',
    );
  });

  it('permet une surcharge locale imbriquée', () => {
    document.body.innerHTML = `
      <tp-theme mode="light"></tp-theme>
      <section id="local-scope">
        <tp-theme mode="dark"></tp-theme>
      </section>
    `;

    const localScope = document.getElementById('local-scope');
    expect(document.body.classList.contains('tp-light')).toBe(true);
    expect(localScope?.classList.contains('tp-dark')).toBe(true);
  });

  it('garde la priorité locale quand global est dark et local en auto', () => {
    document.body.innerHTML = `
      <tp-theme mode="dark"></tp-theme>
      <section id="local-scope">
        <tp-theme mode="auto"></tp-theme>
      </section>
    `;

    const localScope = document.getElementById('local-scope');
    expect(document.body.classList.contains('tp-dark')).toBe(true);
    expect(localScope?.classList.contains('tp-light')).toBe(true);
    expect(localScope?.classList.contains('tp-dark')).toBe(false);
  });

  it('réapplique le local auto quand le global bascule vers dark', () => {
    document.body.innerHTML = `
      <tp-theme id="global-theme" mode="auto"></tp-theme>
      <section id="local-scope">
        <tp-theme id="local-theme" mode="auto"></tp-theme>
      </section>
    `;

    const globalControl = document.querySelector('#global-theme tp-icon-button');
    const globalDarkItem = document.querySelector<HTMLElement>(
      '#global-theme .tp-theme-option[data-mode="dark"]',
    );
    const localScope = document.getElementById('local-scope');

    expect(document.body.classList.contains('tp-light')).toBe(true);
    expect(localScope?.classList.contains('tp-light')).toBe(true);

    globalControl?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    globalDarkItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(document.body.classList.contains('tp-dark')).toBe(true);
    expect(localScope?.classList.contains('tp-light')).toBe(true);
    expect(localScope?.classList.contains('tp-dark')).toBe(false);
  });

  it('restaure les classes initiales du parent à la déconnexion', () => {
    document.body.innerHTML = '<section class="tp-light"></section>';
    const section = document.querySelector('section');
    const theme = document.createElement('tp-theme');
    theme.setAttribute('mode', 'dark');

    section?.append(theme);
    expect(section?.classList.contains('tp-dark')).toBe(true);

    theme.remove();
    expect(section?.classList.contains('tp-light')).toBe(true);
    expect(section?.classList.contains('tp-dark')).toBe(false);
  });

  it('cible le parent effectif quand imbriqué dans un composant', () => {
    document.body.innerHTML = `
      <div data-tp-base-host id="host-component">
        <div id="target">
          <tp-theme mode="light"></tp-theme>
        </div>
      </div>
    `;

    const target = document.getElementById('target');
    expect(target?.classList.contains('tp-light')).toBe(true);
    expect(target?.classList.contains('tp-dark')).toBe(false);
  });

  it('utilise ui-anchor pour le menu quand il est fourni', () => {
    document.body.innerHTML = `
      <button id="theme-anchor"></button>
      <section id="theme-scope">
        <tp-theme mode="dark" ui-anchor="#theme-anchor"></tp-theme>
      </section>
    `;

    const dropdown = document.querySelector('tp-theme tp-dropdown');
    const scope = document.getElementById('theme-scope');

    expect(dropdown?.getAttribute('anchor')).toBe('#theme-anchor');
    expect(document.querySelector('tp-theme tp-tooltip')).toBeNull();
    expect(scope?.classList.contains('tp-dark')).toBe(true);
    expect(document.getElementById('theme-anchor')?.classList.contains('tp-dark')).toBe(false);
  });

  it('utilise anchor comme cible explicite', () => {
    document.body.innerHTML = `
      <p id="anchor-p" class="tp-light tp-yellow">Target</p>
      <tp-theme mode="dark" anchor="#anchor-p"></tp-theme>
    `;

    const target = document.getElementById('anchor-p');
    expect(target?.classList.contains('tp-dark')).toBe(true);
    expect(target?.classList.contains('tp-light')).toBe(false);
  });

  it('préserve la couleur de marque héritée sur une cible sans scope couleur', () => {
    document.body.innerHTML = `
      <section class="tp-red">
        <tp-callout variant="info">
          <code>language</code>
          <tp-theme mode="light"></tp-theme>
        </tp-callout>
      </section>
    `;

    const callout = document.querySelector<HTMLElement>('tp-callout');
    expect(callout?.classList.contains('tp-light')).toBe(true);
    expect(callout?.style.getPropertyValue('--tp-brand-seed')).toBe('inherit');
  });

  it('ignore le paragraphe parent pour cibler le conteneur de contenu', () => {
    document.body.innerHTML = `
      <tp-callout variant="info">
        <p>
          Text
          <tp-theme mode="light"></tp-theme>
        </p>
      </tp-callout>
    `;

    const paragraph = document.querySelector('p');
    const callout = document.querySelector('tp-callout');

    expect(paragraph?.classList.contains('tp-light')).toBe(false);
    expect(callout?.classList.contains('tp-light')).toBe(true);
  });

  it('ne force pas la couleur héritée sur une cible avec scope couleur explicite', () => {
    document.body.innerHTML = `
      <section class="tp-red">
        <div id="scope" class="tp-blue">
          <tp-theme mode="light"></tp-theme>
        </div>
      </section>
    `;

    const scope = document.getElementById('scope');
    expect(scope?.classList.contains('tp-light')).toBe(true);
    expect(scope?.style.getPropertyValue('--tp-brand-seed')).toBe('');
  });
});
