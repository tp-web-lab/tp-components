import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TpCluster } from './cluster.js';
import './cluster.js';

describe('<tp-cluster>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-cluster');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpCluster);
  });

  it('injects the base styles once', () => {
    const first = document.createElement('tp-cluster');
    const second = document.createElement('tp-cluster');

    document.body.append(first, second);

    const styles = document.head.querySelectorAll('#tp-cluster-styles');
    expect(styles).toHaveLength(1);
  });

  it('contains the expected base CSS rules', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    const style = document.head.querySelector('#tp-cluster-styles');
    const cssText = style?.textContent ?? '';

    expect(cssText).toContain('display: flex;');
    expect(cssText).toContain('flex-wrap: wrap;');
    expect(cssText).toContain('gap: var(--tp-cluster-gap, 1rem);');
    expect(cssText).toContain('justify-content: flex-start;');
    expect(cssText).toContain('align-items: center;');
  });

  it('uses default inline styles when no reactive attribute is set', () => {
    const element = document.createElement('tp-cluster') as TpCluster;
    document.body.append(element);

    expect(element.style.justifyContent).toBe('flex-start');
    expect(element.style.alignItems).toBe('center');
    expect(element.style.gap).toBe('var(--tp-cluster-gap, 1rem)');
  });

  it('reflects the justify property to the justify attribute', () => {
    const element = document.createElement('tp-cluster') as TpCluster;

    expect(element.justify).toBe('');
    expect(element.hasAttribute('justify')).toBe(false);

    element.justify = 'center';

    expect(element.getAttribute('justify')).toBe('center');
    expect(element.justify).toBe('center');

    element.justify = '';

    expect(element.hasAttribute('justify')).toBe(false);
    expect(element.justify).toBe('');
  });

  it('reflects the align property to the align attribute', () => {
    const element = document.createElement('tp-cluster') as TpCluster;

    expect(element.align).toBe('');
    expect(element.hasAttribute('align')).toBe(false);

    element.align = 'flex-start';

    expect(element.getAttribute('align')).toBe('flex-start');
    expect(element.align).toBe('flex-start');

    element.align = '';

    expect(element.hasAttribute('align')).toBe(false);
    expect(element.align).toBe('');
  });

  it('reflects the gap property to the gap attribute', () => {
    const element = document.createElement('tp-cluster') as TpCluster;

    expect(element.gap).toBe('');
    expect(element.hasAttribute('gap')).toBe(false);

    element.gap = '2rem';

    expect(element.getAttribute('gap')).toBe('2rem');
    expect(element.gap).toBe('2rem');

    element.gap = '';

    expect(element.hasAttribute('gap')).toBe(false);
    expect(element.gap).toBe('');
  });

  it('updates justify-content from the justify attribute', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    element.setAttribute('justify', 'space-between');

    expect(element.style.justifyContent).toBe('space-between');
  });

  it('updates align-items from the align attribute', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    element.setAttribute('align', 'stretch');

    expect(element.style.alignItems).toBe('stretch');
  });

  it('updates gap from the gap attribute', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    element.setAttribute('gap', '0.5rem');

    expect(element.style.gap).toBe('0.5rem');
  });

  it('restores the default justify-content when justify is removed', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    element.setAttribute('justify', 'center');
    expect(element.style.justifyContent).toBe('center');

    element.removeAttribute('justify');
    expect(element.style.justifyContent).toBe('flex-start');
  });

  it('restores the default align-items when align is removed', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    element.setAttribute('align', 'flex-end');
    expect(element.style.alignItems).toBe('flex-end');

    element.removeAttribute('align');
    expect(element.style.alignItems).toBe('center');
  });

  it('restores the default gap when gap is removed', () => {
    const element = document.createElement('tp-cluster');
    document.body.append(element);

    element.setAttribute('gap', '12px');
    expect(element.style.gap).toBe('12px');

    element.removeAttribute('gap');
    expect(element.style.gap).toBe('var(--tp-cluster-gap, 1rem)');
  });

  it('supports updating reactive properties after connection', () => {
    const element = document.createElement('tp-cluster') as TpCluster;
    document.body.append(element);

    element.justify = 'center';
    element.align = 'baseline';
    element.gap = '1.25rem';

    expect(element.style.justifyContent).toBe('center');
    expect(element.style.alignItems).toBe('baseline');
    expect(element.style.gap).toBe('1.25rem');
  });

});
