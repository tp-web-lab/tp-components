import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './grid.js';
import { TpGrid } from './grid.js';

describe('<tp-grid>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const el = document.createElement('tp-grid');

    expect(el).toBeInstanceOf(HTMLElement);
    expect(el).toBeInstanceOf(TpGrid);
  });

  it('injects CSS once', () => {
    document.body.append(
      document.createElement('tp-grid'),
      document.createElement('tp-grid'),
    );

    expect(document.head.querySelectorAll('#tp-grid-styles')).toHaveLength(1);
  });

  it('reflects minWidth', () => {
    const el = document.createElement('tp-grid') as TpGrid;

    el.minWidth = '300px';

    expect(el.getAttribute('min-width')).toBe('300px');
    expect(el.minWidth).toBe('300px');
  });

  it('throws on invalid minWidth', () => {
    const el = document.createElement('tp-grid') as TpGrid;

    expect(() => {
      el.minWidth = 'abc';
    }).toThrow();
  });

  it('applies CSS variables', () => {
    const el = document.createElement('tp-grid');
    document.body.append(el);

    el.setAttribute('min-width', '200px');
    el.setAttribute('gap', '2rem');

    expect(el.style.getPropertyValue('--tp-grid-min-width')).toBe('200px');
    expect(el.style.getPropertyValue('--tp-grid-gap')).toBe('2rem');
  });

  it('accepts functional and signed CSS lengths', () => {
    const el = document.createElement('tp-grid') as TpGrid;
    el.minWidth = 'clamp(10rem, 25vw, 20rem)';
    expect(el.minWidth).toBe('clamp(10rem, 25vw, 20rem)');
    el.minWidth = '-2px';
    expect(el.minWidth).toBe('-2px');
  });

  it('removes reflected values and their CSS variables', () => {
    const el = document.createElement('tp-grid') as TpGrid;
    document.body.append(el);
    el.minWidth = '20rem';
    el.gap = '2rem';

    el.minWidth = '';
    el.gap = '';

    expect(el.hasAttribute('min-width')).toBe(false);
    expect(el.hasAttribute('gap')).toBe(false);
    expect(el.style.getPropertyValue('--tp-grid-min-width')).toBe('');
    expect(el.style.getPropertyValue('--tp-grid-gap')).toBe('');
  });

  it('rejects empty and unitless min-width attributes', () => {
    const el = document.createElement('tp-grid') as TpGrid;
    el.setAttribute('min-width', '10');
    expect(el.minWidth).toBe('');
    el.setAttribute('min-width', '');
    expect(el.minWidth).toBe('');
  });

});
