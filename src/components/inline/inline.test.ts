import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './inline.js';
import { TpInline } from './inline.js';

describe('<tp-inline>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-inline');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpInline);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-inline');
    const second = document.createElement('tp-inline');

    document.body.append(first, second);

    expect(document.head.querySelectorAll('#tp-inline-styles')).toHaveLength(1);
  });

  it('contains the expected base CSS rules', () => {
    const element = document.createElement('tp-inline');
    document.body.append(element);

    const styleEl = document.head.querySelector('#tp-inline-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('display: flex;');
    expect(cssText).toContain('flex-wrap: nowrap;');
    expect(cssText).toContain('gap: var(--tp-inline-gap, 0.5rem);');
    expect(cssText).toContain('justify-content: flex-start;');
    expect(cssText).toContain('align-items: center;');
  });

  it('reflects gap property', () => {
    const element = document.createElement('tp-inline') as TpInline;

    element.gap = '1rem';
    expect(element.getAttribute('gap')).toBe('1rem');
    expect(element.gap).toBe('1rem');

    element.gap = '';
    expect(element.hasAttribute('gap')).toBe(false);
  });

  it('reflects justify property', () => {
    const element = document.createElement('tp-inline') as TpInline;

    element.justify = 'space-between';
    expect(element.getAttribute('justify')).toBe('space-between');
    expect(element.justify).toBe('space-between');

    element.justify = '';
    expect(element.hasAttribute('justify')).toBe(false);
  });

  it('reflects align property', () => {
    const element = document.createElement('tp-inline') as TpInline;

    element.align = 'flex-start';
    expect(element.getAttribute('align')).toBe('flex-start');
    expect(element.align).toBe('flex-start');

    element.align = '';
    expect(element.hasAttribute('align')).toBe(false);
  });

  it('reflects stretch property', () => {
    const element = document.createElement('tp-inline') as TpInline;

    expect(element.stretch).toBe(false);

    element.stretch = true;
    expect(element.hasAttribute('stretch')).toBe(true);
    expect(element.stretch).toBe(true);

    element.stretch = false;
    expect(element.hasAttribute('stretch')).toBe(false);
  });

  it('applies gap through CSS custom property', () => {
    const element = document.createElement('tp-inline');
    document.body.append(element);

    element.setAttribute('gap', '1.5rem');

    expect(element.style.getPropertyValue('--tp-inline-gap')).toBe('1.5rem');
  });

  it('applies justify and align inline styles', () => {
    const element = document.createElement('tp-inline');
    document.body.append(element);

    element.setAttribute('justify', 'space-between');
    element.setAttribute('align', 'flex-start');

    expect(element.style.justifyContent).toBe('space-between');
    expect(element.style.alignItems).toBe('flex-start');
  });

  it('removes gap custom property when gap is removed', () => {
    const element = document.createElement('tp-inline');
    document.body.append(element);

    element.setAttribute('gap', '1rem');
    element.removeAttribute('gap');

    expect(element.style.getPropertyValue('--tp-inline-gap')).toBe('');
  });
});