import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './stack.js';
import { TpStack } from './stack.js';

describe('<tp-stack>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-stack');
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpStack);
  });

  it('injects base styles once', () => {
    const a = document.createElement('tp-stack');
    const b = document.createElement('tp-stack');

    document.body.append(a, b);

    const styles = document.head.querySelectorAll('#tp-stack-styles');
    expect(styles).toHaveLength(1);
  });

  it('reflects the recursive property to the attribute', () => {
    const element = document.createElement('tp-stack') as TpStack;

    expect(element.recursive).toBe(false);
    expect(element.hasAttribute('recursive')).toBe(false);

    element.recursive = true;
    expect(element.recursive).toBe(true);
    expect(element.hasAttribute('recursive')).toBe(true);

    element.recursive = false;
    expect(element.recursive).toBe(false);
    expect(element.hasAttribute('recursive')).toBe(false);
  });

  it('reads split-after as a positive integer', () => {
    const element = document.createElement('tp-stack') as TpStack;

    expect(element.splitAfter).toBeNull();

    element.setAttribute('split-after', '2');
    expect(element.splitAfter).toBe(2);

    element.setAttribute('split-after', '0');
    expect(element.splitAfter).toBeNull();

    element.setAttribute('split-after', '-1');
    expect(element.splitAfter).toBeNull();

    element.setAttribute('split-after', 'abc');
    expect(element.splitAfter).toBeNull();
  });

  it('reflects splitAfter property to the attribute', () => {
    const element = document.createElement('tp-stack') as TpStack;

    element.splitAfter = 3;
    expect(element.getAttribute('split-after')).toBe('3');
    expect(element.splitAfter).toBe(3);

    element.splitAfter = null;
    expect(element.hasAttribute('split-after')).toBe(false);
    expect(element.splitAfter).toBeNull();
  });

  it('creates an instance style when split-after is set', () => {
    const element = document.createElement('tp-stack');
    element.setAttribute('split-after', '2');

    document.body.append(element);

    const styles = Array.from(document.head.querySelectorAll('style'));
    const splitStyle = styles.find((style) =>
      style.textContent?.includes(':nth-child(2)'),
    );

    expect(splitStyle).toBeDefined();
    expect(splitStyle?.textContent).toContain('margin-block-end: auto;');
    expect(element.getAttribute('data-tp-stack-id')).toBeTruthy();
  });

  it('updates the instance style when split-after changes', () => {
    const element = document.createElement('tp-stack');
    element.setAttribute('split-after', '2');
    document.body.append(element);

    element.setAttribute('split-after', '3');

    const styles = Array.from(document.head.querySelectorAll('style'));
    const matchingStyles = styles.filter((style) =>
      style.textContent?.includes('margin-block-end: auto;'),
    );

    expect(matchingStyles).toHaveLength(1);
    expect(matchingStyles[0]?.textContent).toContain(':nth-child(3)');
  });

  it('removes the instance style when split-after is removed', () => {
    const element = document.createElement('tp-stack');
    element.setAttribute('split-after', '2');
    document.body.append(element);

    element.removeAttribute('split-after');

    const styles = Array.from(document.head.querySelectorAll('style'));
    const splitStyles = styles.filter((style) =>
      style.textContent?.includes('margin-block-end: auto;'),
    );

    expect(splitStyles).toHaveLength(0);
  });

  it('removes the instance style when the element is disconnected', () => {
    const element = document.createElement('tp-stack');
    element.setAttribute('split-after', '2');
    document.body.append(element);

    document.body.removeChild(element);

    const styles = Array.from(document.head.querySelectorAll('style'));
    const splitStyles = styles.filter((style) =>
      style.textContent?.includes('margin-block-end: auto;'),
    );

    expect(splitStyles).toHaveLength(0);
  });

  it('contains the expected base CSS rules', () => {
    const element = document.createElement('tp-stack');
    document.body.append(element);

    const style = document.head.querySelector('#tp-stack-styles');
    const cssText = style?.textContent ?? '';

    expect(cssText).toContain('tp-stack:not([recursive]) > * + *');
    expect(cssText).toContain('tp-stack[recursive] * + *');
    expect(cssText).toContain('tp-stack[split-after]:only-child');
    expect(cssText).toContain('block-size: 100%');
  });
});
