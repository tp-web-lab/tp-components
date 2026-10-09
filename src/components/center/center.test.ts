import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './center.js';
import { TpCenter } from './center.js';

describe('<tp-center>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-center');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpCenter);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-center');
    const second = document.createElement('tp-center');

    document.body.append(first, second);

    const styles = document.head.querySelectorAll('#tp-center-styles');
    expect(styles).toHaveLength(1);
  });

  it('contains the expected base CSS rules', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    const style = document.head.querySelector('#tp-center-styles');
    const cssText = style?.textContent ?? '';

    expect(cssText).toContain('box-sizing: content-box;');
    expect(cssText).toContain('margin-inline: auto;');
    expect(cssText).toContain('max-inline-size: var(--tp-center-width, 60ch);');
  });

  it('reflects the maxInlineSize property to the attribute', () => {
    const element = document.createElement('tp-center') as TpCenter;

    expect(element.maxInlineSize).toBe('');
    expect(element.hasAttribute('max-inline-size')).toBe(false);

    element.maxInlineSize = '60ch';

    expect(element.getAttribute('max-inline-size')).toBe('60ch');
    expect(element.maxInlineSize).toBe('60ch');

    element.maxInlineSize = '';

    expect(element.hasAttribute('max-inline-size')).toBe(false);
    expect(element.maxInlineSize).toBe('');
  });

  it('reflects the centerText property to the attribute', () => {
    const element = document.createElement('tp-center') as TpCenter;

    expect(element.centerText).toBe(false);
    expect(element.hasAttribute('center-text')).toBe(false);

    element.centerText = true;

    expect(element.centerText).toBe(true);
    expect(element.hasAttribute('center-text')).toBe(true);

    element.centerText = false;

    expect(element.centerText).toBe(false);
    expect(element.hasAttribute('center-text')).toBe(false);
  });

  it('reflects the paddingInline property to the attribute', () => {
    const element = document.createElement('tp-center') as TpCenter;

    expect(element.paddingInline).toBe('');
    expect(element.hasAttribute('padding-inline')).toBe(false);

    element.paddingInline = '1rem';

    expect(element.getAttribute('padding-inline')).toBe('1rem');
    expect(element.paddingInline).toBe('1rem');

    element.paddingInline = '';

    expect(element.hasAttribute('padding-inline')).toBe(false);
    expect(element.paddingInline).toBe('');
  });

  it('does not override max-inline-size by default', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    expect(element.style.maxInlineSize).toBe('');
  });

  it('applies max-inline-size from the attribute', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    element.setAttribute('max-inline-size', '72ch');

    expect(element.style.maxInlineSize).toBe('72ch');
  });

  it('applies text-align: center when center-text is present', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    element.setAttribute('center-text', '');

    expect(element.style.textAlign).toBe('center');
  });

  it('removes text-align when center-text is removed', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    element.setAttribute('center-text', '');
    expect(element.style.textAlign).toBe('center');

    element.removeAttribute('center-text');
    expect(element.style.textAlign).toBe('');
  });

  it('applies padding-inline to start and end', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    element.setAttribute('padding-inline', '2rem');

    expect(element.style.paddingInlineStart).toBe('2rem');
    expect(element.style.paddingInlineEnd).toBe('2rem');
  });

  it('removes inline paddings when padding-inline is removed', () => {
    const element = document.createElement('tp-center');
    document.body.append(element);

    element.setAttribute('padding-inline', '1.5rem');
    expect(element.style.paddingInlineStart).toBe('1.5rem');
    expect(element.style.paddingInlineEnd).toBe('1.5rem');

    element.removeAttribute('padding-inline');
    expect(element.style.paddingInlineStart).toBe('');
    expect(element.style.paddingInlineEnd).toBe('');
  });

  it('supports updating reactive properties after connection', () => {
    const element = document.createElement('tp-center') as TpCenter;
    document.body.append(element);

    element.maxInlineSize = '42rem';
    element.centerText = true;
    element.paddingInline = '1rem';

    expect(element.style.maxInlineSize).toBe('42rem');
    expect(element.style.textAlign).toBe('center');
    expect(element.style.paddingInlineStart).toBe('1rem');
    expect(element.style.paddingInlineEnd).toBe('1rem');
  });

  it('reflects intrinsic property to attribute', () => {
    const el = document.createElement('tp-center') as TpCenter;

    expect(el.intrinsic).toBe(false);

    el.intrinsic = true;
    expect(el.hasAttribute('intrinsic')).toBe(true);

    el.intrinsic = false;
    expect(el.hasAttribute('intrinsic')).toBe(false);
  });

  it('applies intrinsic layout via CSS', () => {
    const el = document.createElement('tp-center');
    document.body.append(el);

    el.setAttribute('intrinsic', '');

    // On ne teste pas le layout réel (jsdom), mais la présence du CSS
    const style = document.head.querySelector('#tp-center-styles');
    const cssText = style?.textContent ?? '';

    expect(cssText).toContain('tp-center[intrinsic]');
    expect(cssText).toContain('align-items: center;');
  });

});
