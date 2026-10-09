/**
 * @module divider/test
 * @summary Tests du composant `<tp-divider>`.
 */

import { describe, expect, it } from 'vitest';
import { TpDivider } from './divider.js';

describe('<tp-divider>', () => {
  it('est défini', () => {
    expect(customElements.get('tp-divider')).toBe(TpDivider);
  });

  it('utilise une orientation horizontale par défaut', () => {
    document.body.innerHTML = '<tp-divider></tp-divider>';
    const divider = document.querySelector('tp-divider');

    expect(divider?.getAttribute('orientation')).toBe('horizontal');
    expect(divider?.getAttribute('role')).toBe('separator');
    expect(divider?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('accepte une orientation verticale', () => {
    document.body.innerHTML = '<tp-divider orientation="vertical"></tp-divider>';
    const divider = document.querySelector('tp-divider');

    expect(divider?.getAttribute('orientation')).toBe('vertical');
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('corrige une orientation inconnue', () => {
    document.body.innerHTML = '<tp-divider orientation="diagonal"></tp-divider>';
    const divider = document.querySelector('tp-divider');

    expect(divider?.getAttribute('orientation')).toBe('horizontal');
  });

  it('reflète la propriété orientation après connexion', () => {
    const divider = document.createElement('tp-divider') as TpDivider;
    document.body.append(divider);
    divider.orientation = 'vertical';
    expect(divider.orientation).toBe('vertical');
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    expect(TpDivider.observedAttributes).toEqual(['orientation']);
  });
});
