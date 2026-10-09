import { afterEach, describe, expect, it } from 'vitest';
import './color.js';
import type { TpColor } from './color.js';

describe('<tp-color>', () => {
  afterEach(() => {
    document.body.className = '';
    document.body.innerHTML = '';
  });

  it('est défini', () => {
    expect(customElements.get('tp-color')).toBeDefined();
  });

  it('rend les presets autorisés dans le menu', () => {
    document.body.innerHTML = '<section><tp-color></tp-color></section>';
    const options = document.querySelectorAll<HTMLElement>(
      'tp-color > tp-dropdown .tp-color-option',
    );
    const values = Array.from(options).map(
      (option) => option.getAttribute('data-preset') ?? '',
    );

    expect(values).toEqual([
      'tp-default',
      'tp-red',
      'tp-orange',
      'tp-amber',
      'tp-yellow',
      'tp-lime',
      'tp-green',
      'tp-emerald',
      'tp-teal',
      'tp-glaz',
      'tp-cyan',
      'tp-sky',
      'tp-blue',
      'tp-indigo',
      'tp-violet',
      'tp-purple',
      'tp-fuchsia',
      'tp-pink',
      'tp-rose',
      'tp-zinc',
      'tp-ivory',
      'tp-stone',
    ]);
  });

  it('applique le preset sur le parent direct', () => {
    document.body.innerHTML = '<section id="scope"><tp-color preset="tp-red"></tp-color></section>';
    const scope = document.getElementById('scope');

    expect(scope?.classList.contains('tp-red')).toBe(true);
  });

  it('retombe sur tp-default quand preset est invalide', () => {
    document.body.innerHTML = '<section id="scope"><tp-color preset="invalid"></tp-color></section>';
    const scope = document.getElementById('scope');
    const element = document.querySelector('tp-color');

    expect(scope?.classList.contains('tp-default')).toBe(true);
    expect(element?.getAttribute('preset')).toBe('tp-default');
  });

  it('met à jour le preset quand une option du menu est cliquée', () => {
    document.body.innerHTML = '<section id="scope"><tp-color></tp-color></section>';
    const scope = document.getElementById('scope');
    const option = document.querySelector<HTMLElement>(
      'tp-color .tp-color-option[data-preset="tp-blue"]',
    );
    option?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(scope?.classList.contains('tp-blue')).toBe(true);
    expect(scope?.classList.contains('tp-default')).toBe(false);
  });

  it('émet tp-color-change avec le preset et la cible', () => {
    document.body.innerHTML = '<section id="scope"><tp-color anchor="#scope"></tp-color></section>';
    const scope = document.getElementById('scope');
    const color = document.querySelector('tp-color');
    const events: Array<CustomEvent<{
      preset: string;
      brand: string;
      anchor: string;
      target: HTMLElement;
    }>> = [];
    color?.addEventListener('tp-color-change', (event) => {
      events.push(event as CustomEvent<{
        preset: string;
        brand: string;
        anchor: string;
        target: HTMLElement;
      }>);
    });

    document.querySelector<HTMLElement>(
      'tp-color .tp-color-option[data-preset="tp-blue"]',
    )?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toMatchObject({
      preset: 'tp-blue',
      brand: 'tp-blue',
      anchor: '#scope',
      target: scope,
    });
  });

  it('utilise un déclencheur icon-button palette-swatch', () => {
    document.body.innerHTML = '<section><tp-color></tp-color></section>';
    const trigger = document.querySelector('tp-color > tp-icon-button');
    expect(trigger?.getAttribute('name')).toBe('palette-swatch');
  });

  it('transmet variant, size et disabled au déclencheur', () => {
    document.body.innerHTML = '<section><tp-color variant="brand" size="s" disabled></tp-color></section>';
    const color = document.querySelector('tp-color');
    const trigger = document.querySelector('tp-color > tp-icon-button');

    expect(trigger?.getAttribute('variant')).toBe('brand');
    expect(trigger?.getAttribute('size')).toBe('s');
    expect(trigger?.hasAttribute('disabled')).toBe(true);

    color?.setAttribute('variant', 'danger');
    color?.setAttribute('size', 'l');
    color?.removeAttribute('disabled');

    expect(trigger?.getAttribute('variant')).toBe('danger');
    expect(trigger?.getAttribute('size')).toBe('l');
    expect(trigger?.hasAttribute('disabled')).toBe(false);
  });

  it('rend le menu scrollable en hauteur', () => {
    document.body.innerHTML = '<section><tp-color></tp-color></section>';
    const styleEl = document.getElementById('tp-color-styles');

    expect(styleEl?.textContent).toContain('tp-color > tp-dropdown');
    expect(styleEl?.textContent).toContain('inline-size: max-content;');
    expect(styleEl?.textContent).toContain('min-inline-size: 13rem;');
    expect(styleEl?.textContent).toContain('max-block-size: calc(100vh - 1rem);');
    expect(styleEl?.textContent).toContain('overflow-y: auto;');
    expect(styleEl?.textContent).toContain('overscroll-behavior: contain;');
  });

  it('ne rend pas de tooltip', () => {
    document.body.innerHTML = '<section><tp-color></tp-color></section>';
    const tooltip = document.querySelector('tp-color > tp-tooltip');

    expect(tooltip).toBeNull();
  });

  it('préfixe chaque entrée par un swatch square-rounded', () => {
    document.body.innerHTML = '<section><tp-color></tp-color></section>';
    const firstSwatch = document.querySelector(
      'tp-color .tp-color-option .tp-color-swatch',
    );
    expect(firstSwatch?.getAttribute('name')).toBe('square-rounded');
    expect(firstSwatch?.tagName.toLowerCase()).toBe('tp-icon');
  });

  it('cible le parent effectif quand il n’y a pas de data-tp-color-scope', () => {
    document.body.innerHTML = `
      <div data-tp-base-host id="host" class="tp-amber">
        <div id="target" class="tp-amber">
          <tp-color preset="tp-green"></tp-color>
        </div>
      </div>
    `;
    const target = document.getElementById('target');
    const greenOption = document.querySelector<HTMLElement>(
      'tp-color .tp-color-option[data-preset="tp-green"]',
    );

    // First connection adopts the static preset class from the target.
    expect(target?.classList.contains('tp-amber')).toBe(true);
    expect(target?.classList.contains('tp-green')).toBe(false);

    greenOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(target?.classList.contains('tp-green')).toBe(true);
    expect(target?.classList.contains('tp-amber')).toBe(false);
  });

  it('cible le scope couleur le plus proche quand il existe', () => {
    document.body.innerHTML = `
      <section data-tp-color-scope id="color-scope" class="tp-amber">
        <div>
          <tp-color preset="tp-green"></tp-color>
        </div>
      </section>
    `;
    const scope = document.getElementById('color-scope');
    const greenOption = document.querySelector<HTMLElement>(
      'tp-color .tp-color-option[data-preset="tp-green"]',
    );

    // First connection adopts the static preset class from the target.
    expect(scope?.classList.contains('tp-amber')).toBe(true);
    expect(scope?.classList.contains('tp-green')).toBe(false);

    greenOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(scope?.classList.contains('tp-green')).toBe(true);
    expect(scope?.classList.contains('tp-amber')).toBe(false);
  });

  it('synchronise deux tp-color sur le même scope', () => {
    document.body.innerHTML = `
      <section data-tp-color-scope id="scope" class="tp-red">
        <tp-color id="first" preset="tp-default"></tp-color>
        <tp-color id="second" preset="tp-purple"></tp-color>
      </section>
    `;

    const scope = document.getElementById('scope');
    const blueOption = document.querySelector<HTMLElement>(
      '#first .tp-color-option[data-preset="tp-blue"]',
    );
    blueOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(scope?.classList.contains('tp-blue')).toBe(true);
    expect(document.querySelector('#first tp-icon-button')?.getAttribute('name')).toBe(
      'palette-swatch',
    );
    expect(document.querySelector('#second tp-icon-button')?.getAttribute('name')).toBe(
      'palette-swatch',
    );
    expect(document.querySelector('#second')?.getAttribute('preset')).toBe('tp-blue');
  });

  it('restaure les classes initiales du scope à la déconnexion', () => {
    document.body.innerHTML = '<section id="scope" class="tp-rose"></section>';
    const scope = document.getElementById('scope');
    const color = document.createElement('tp-color');
    scope?.append(color);
    const cyanOption = document.querySelector<HTMLElement>(
      'tp-color .tp-color-option[data-preset="tp-cyan"]',
    );
    cyanOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(scope?.classList.contains('tp-cyan')).toBe(true);
    expect(scope?.classList.contains('tp-rose')).toBe(false);

    color.remove();

    expect(scope?.classList.contains('tp-rose')).toBe(true);
    expect(scope?.classList.contains('tp-cyan')).toBe(false);
  });

  it('utilise ui-anchor pour positionner le dropdown sans changer la cible', () => {
    document.body.innerHTML = `
      <button id="color-anchor"></button>
      <section id="scope"><tp-color ui-anchor="#color-anchor"></tp-color></section>
    `;

    const dropdown = document.querySelector('tp-color > tp-dropdown');
    const tooltip = document.querySelector('tp-color > tp-tooltip');

    expect(dropdown?.getAttribute('anchor')).toBe('#color-anchor');
    expect(tooltip).toBeNull();
  });

  it('utilise anchor comme cible explicite sans data-tp-color-scope', () => {
    document.body.innerHTML = `
      <section id="local-color-scope" class="tp-red tp-light">
        <p>Local scope</p>
      </section>
      <tp-toolbar>
        <tp-color anchor="#local-color-scope"></tp-color>
      </tp-toolbar>
    `;

    const scope = document.getElementById('local-color-scope');
    const blueOption = document.querySelector<HTMLElement>(
      'tp-color .tp-color-option[data-preset="tp-blue"]',
    );

    // First connection adopts the static preset class from the anchored target.
    expect(scope?.classList.contains('tp-red')).toBe(true);
    expect(scope?.classList.contains('tp-blue')).toBe(false);

    blueOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(scope?.classList.contains('tp-blue')).toBe(true);
    expect(scope?.classList.contains('tp-red')).toBe(false);
  });

  it('expose les propriétés du contrôleur et retire une ancre vide', () => {
    const element = document.createElement('tp-color') as TpColor;
    element.preset = 'tp-red';
    element.anchor = '#target';
    element.variant = 'brand';
    element.size = 's';
    element.disabled = true;
    expect(element.preset).toBe('tp-red');
    expect(element.anchor).toBe('#target');
    expect(element.variant).toBe('brand');
    expect(element.size).toBe('s');
    expect(element.disabled).toBe(true);
    element.anchor = ' ';
    element.disabled = false;
    expect(element.hasAttribute('anchor')).toBe(false);
    expect(element.disabled).toBe(false);
  });
});
