import { describe, expect, it } from 'vitest';

describe('<tp-button> - browser', () => {
  it('affiche un bouton natif sans href', async () => {
    document.body.innerHTML = `
      <tp-button id="test-button" type="brand">Run</tp-button>
    `;

    await customElements.whenDefined('tp-button');

    const host = document.getElementById('test-button');
    const button = host?.querySelector('button');

    expect(button).toBeTruthy();
    expect(host?.querySelector('a')).toBeNull();
    expect(button?.textContent?.trim()).toBe('Run');
  });

  it('affiche un lien natif avec href', async () => {
    document.body.innerHTML = `
      <tp-button id="test-button" href="/docs" type="info">Docs</tp-button>
    `;

    await customElements.whenDefined('tp-button');

    const host = document.getElementById('test-button');
    const link = host?.querySelector('a');

    expect(link).toBeTruthy();
    expect(host?.querySelector('button')).toBeNull();
    expect(link?.getAttribute('href')).toBe('/docs');
  });

  it('applique aria-disabled et tabindex sur un lien désactivé', async () => {
    document.body.innerHTML = `
      <tp-button id="test-button" href="/docs" disabled>Docs</tp-button>
    `;

    await customElements.whenDefined('tp-button');

    const host = document.getElementById('test-button');
    const link = host?.querySelector('a');

    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(link?.getAttribute('tabindex')).toBe('-1');
    expect(link?.hasAttribute('href')).toBe(false);
  });

  it('prend le focus clavier sur le contrôle interne', async () => {
    document.body.innerHTML = `
      <tp-button id="test-button" type="brand">Run</tp-button>
    `;

    await customElements.whenDefined('tp-button');

    const host = document.getElementById('test-button');
    const button = host?.querySelector('button');

    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Expected native button');
    }

    button.focus();

    expect(document.activeElement).toBe(button);
  });

  it('conserve les attributs visuels sur le host', async () => {
    document.body.innerHTML = `
      <tp-button
        id="test-button"
        type="brand"
        outlined
        small
        pill
      >
        Run
      </tp-button>
    `;

    await customElements.whenDefined('tp-button');

    const host = document.getElementById('test-button');

    expect(host?.getAttribute('type')).toBe('brand');
    expect(host?.hasAttribute('outlined')).toBe(true);
    expect(host?.hasAttribute('small')).toBe(true);
    expect(host?.hasAttribute('pill')).toBe(true);
  });
});