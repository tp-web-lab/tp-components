import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './cover.js';
import { TpCover } from './cover.js';

describe('<tp-cover>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-cover');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpCover);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-cover');
    const second = document.createElement('tp-cover');

    document.body.append(first, second);

    const styles = document.head.querySelectorAll('#tp-cover-styles');
    expect(styles).toHaveLength(1);
  });

  it('contains the expected base CSS rules', () => {
    const element = document.createElement('tp-cover');
    document.body.append(element);

    const styleEl = document.head.querySelector('#tp-cover-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('display: flex;');
    expect(cssText).toContain('flex-direction: column;');
    expect(cssText).toContain('min-block-size: var(--tp-cover-min-height, 100vh);');
    expect(cssText).toContain('padding: var(--tp-cover-padding, 1rem);');
    expect(cssText).toContain('margin-block: var(--tp-cover-gap, 1rem);');
  });

  it('reflects the heading property to the attribute', () => {
    const element = document.createElement('tp-cover') as TpCover;

    expect(element.heading).toBe('');
    expect(element.hasAttribute('heading')).toBe(false);

    element.heading = 'h1';

    expect(element.getAttribute('heading')).toBe('h1');
    expect(element.heading).toBe('h1');

    element.heading = '';

    expect(element.hasAttribute('heading')).toBe(false);
    expect(element.heading).toBe('');
  });

  it('throws when setting an invalid heading selector', () => {
    const element = document.createElement('tp-cover') as TpCover;

    expect(() => {
      element.heading = 'h1, h2';
    }).toThrow(TypeError);

    expect(() => {
      element.heading = 'main h1';
    }).toThrow(TypeError);

    expect(() => {
      element.heading = 'h1:first-child';
    }).toThrow(TypeError);
  });

  it('returns an empty string when heading attribute is invalid', () => {
    const element = document.createElement('tp-cover') as TpCover;

    element.setAttribute('heading', 'h1, h2');

    expect(element.heading).toBe('');
  });

  it('reflects the minHeight property to the attribute', () => {
    const element = document.createElement('tp-cover') as TpCover;

    element.minHeight = '80vh';
    expect(element.getAttribute('min-height')).toBe('80vh');
    expect(element.minHeight).toBe('80vh');

    element.minHeight = '';
    expect(element.hasAttribute('min-height')).toBe(false);
  });

  it('reflects the gap property to the attribute', () => {
    const element = document.createElement('tp-cover') as TpCover;

    element.gap = '2rem';
    expect(element.getAttribute('gap')).toBe('2rem');
    expect(element.gap).toBe('2rem');

    element.gap = '';
    expect(element.hasAttribute('gap')).toBe(false);
  });

  it('reflects the padding property to the attribute', () => {
    const element = document.createElement('tp-cover') as TpCover;

    element.padding = '2rem';
    expect(element.getAttribute('padding')).toBe('2rem');
    expect(element.padding).toBe('2rem');

    element.padding = '';
    expect(element.hasAttribute('padding')).toBe(false);
  });

  it('applies min-height through a CSS custom property', () => {
    const element = document.createElement('tp-cover');
    document.body.append(element);

    element.setAttribute('min-height', '75vh');

    expect(element.style.getPropertyValue('--tp-cover-min-height')).toBe('75vh');
  });

  it('applies gap through a CSS custom property', () => {
    const element = document.createElement('tp-cover');
    document.body.append(element);

    element.setAttribute('gap', '1.5rem');

    expect(element.style.getPropertyValue('--tp-cover-gap')).toBe('1.5rem');
  });

  it('applies padding through a CSS custom property', () => {
    const element = document.createElement('tp-cover');
    document.body.append(element);

    element.setAttribute('padding', '2rem');

    expect(element.style.getPropertyValue('--tp-cover-padding')).toBe('2rem');
  });

  it('removes custom properties when attributes are removed', () => {
    const element = document.createElement('tp-cover');
    document.body.append(element);

    element.setAttribute('min-height', '70vh');
    element.setAttribute('gap', '1rem');
    element.setAttribute('padding', '2rem');

    element.removeAttribute('min-height');
    element.removeAttribute('gap');
    element.removeAttribute('padding');

    expect(element.style.getPropertyValue('--tp-cover-min-height')).toBe('');
    expect(element.style.getPropertyValue('--tp-cover-gap')).toBe('');
    expect(element.style.getPropertyValue('--tp-cover-padding')).toBe('');
  });

  it('creates an instance style when heading is set', () => {
    const element = document.createElement('tp-cover');
    element.setAttribute('heading', 'h1');

    document.body.append(element);

    const styles = Array.from(document.head.querySelectorAll('style'));
    const headingStyle = styles.find((styleEl) =>
      styleEl.textContent?.includes('> h1 {'),
    );

    expect(headingStyle).toBeDefined();
    expect(headingStyle?.textContent).toContain('margin-block: auto;');
    expect(element.getAttribute('data-tp-cover-id')).toBeTruthy();
  });

  it('updates the instance style when heading changes', () => {
    const element = document.createElement('tp-cover');
    element.setAttribute('heading', 'h1');
    document.body.append(element);

    element.setAttribute('heading', 'h2');

    const styles = Array.from(document.head.querySelectorAll('style'));
    const selector = `tp-cover[data-tp-cover-id="${element.getAttribute('data-tp-cover-id')}"]`;
    const matchingStyles = styles.filter(
      (styleEl) => styleEl.textContent?.includes(selector),
    );

    expect(matchingStyles).toHaveLength(1);
    expect(matchingStyles[0]?.textContent).toContain('> h2 {');
  });

  it('removes the instance style when heading is removed', () => {
    const element = document.createElement('tp-cover');
    element.setAttribute('heading', 'h1');
    document.body.append(element);

    element.removeAttribute('heading');

    const styles = Array.from(document.head.querySelectorAll('style'));
    const selector = `tp-cover[data-tp-cover-id="${element.getAttribute('data-tp-cover-id')}"]`;
    const matchingStyles = styles.filter(
      (styleEl) => styleEl.textContent?.includes(selector),
    );

    expect(matchingStyles).toHaveLength(0);
  });

  it('removes the instance style when the element is disconnected', () => {
    const element = document.createElement('tp-cover');
    element.setAttribute('heading', 'h1');
    document.body.append(element);

    const selector = `tp-cover[data-tp-cover-id="${element.getAttribute('data-tp-cover-id')}"]`;
    document.body.removeChild(element);

    const styles = Array.from(document.head.querySelectorAll('style'));
    const matchingStyles = styles.filter(
      (styleEl) => styleEl.textContent?.includes(selector),
    );

    expect(matchingStyles).toHaveLength(0);
  });
});
