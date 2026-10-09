import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './frame.js';
import { TpFrame } from './frame.js';

describe('<tp-frame>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-frame');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpFrame);
  });

  it('injects CSS once', () => {
    const first = document.createElement('tp-frame');
    const second = document.createElement('tp-frame');

    document.body.append(first, second);

    const styles = document.head.querySelectorAll('#tp-frame-styles');
    expect(styles).toHaveLength(1);
  });

  it('contains the expected base CSS rules', () => {
    const element = document.createElement('tp-frame');
    document.body.append(element);

    const styleEl = document.head.querySelector('#tp-frame-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('--tp-frame-numerator: 16;');
    expect(cssText).toContain('--tp-frame-denominator: 9;');
    expect(cssText).toContain(
      'aspect-ratio: var(--tp-frame-numerator) / var(--tp-frame-denominator);',
    );
    expect(cssText).toContain('overflow: hidden;');
    expect(cssText).toContain('display: flex;');
    expect(cssText).toContain('justify-content: center;');
    expect(cssText).toContain('align-items: center;');
    expect(cssText).toContain('tp-frame > img,');
    expect(cssText).toContain('tp-frame > video');
    expect(cssText).toContain('object-fit: cover;');
  });

  it('reflects the aspectRatio property to the attribute', () => {
    const element = document.createElement('tp-frame') as TpFrame;

    expect(element.aspectRatio).toBe('');
    expect(element.hasAttribute('aspect-ratio')).toBe(false);

    element.aspectRatio = '4:3';

    expect(element.getAttribute('aspect-ratio')).toBe('4:3');
    expect(element.aspectRatio).toBe('4:3');

    element.aspectRatio = '';

    expect(element.hasAttribute('aspect-ratio')).toBe(false);
    expect(element.aspectRatio).toBe('');
  });

  it('normalizes aspect-ratio values when set through the property', () => {
    const element = document.createElement('tp-frame') as TpFrame;

    element.aspectRatio = '16:9';

    expect(element.getAttribute('aspect-ratio')).toBe('16:9');
    expect(element.aspectRatio).toBe('16:9');
  });

  it('throws when setting an invalid aspectRatio value', () => {
    const element = document.createElement('tp-frame') as TpFrame;

    expect(() => {
      element.aspectRatio = '16/9';
    }).toThrow(TypeError);

    expect(() => {
      element.aspectRatio = 'abc';
    }).toThrow(TypeError);

    expect(() => {
      element.aspectRatio = '16:0';
    }).toThrow(TypeError);

    expect(() => {
      element.aspectRatio = '0:9';
    }).toThrow(TypeError);
  });

  it('returns an empty string when aspect-ratio attribute is invalid', () => {
    const element = document.createElement('tp-frame') as TpFrame;

    element.setAttribute('aspect-ratio', 'invalid');

    expect(element.aspectRatio).toBe('');
  });

  it('does not define custom properties by default', () => {
    const element = document.createElement('tp-frame');
    document.body.append(element);

    expect(element.style.getPropertyValue('--tp-frame-numerator')).toBe('');
    expect(element.style.getPropertyValue('--tp-frame-denominator')).toBe('');
  });

  it('applies aspect-ratio through CSS custom properties', () => {
    const element = document.createElement('tp-frame');
    document.body.append(element);

    element.setAttribute('aspect-ratio', '4:3');

    expect(element.style.getPropertyValue('--tp-frame-numerator')).toBe('4');
    expect(element.style.getPropertyValue('--tp-frame-denominator')).toBe('3');
  });

  it('removes custom properties when aspect-ratio is removed', () => {
    const element = document.createElement('tp-frame');
    document.body.append(element);

    element.setAttribute('aspect-ratio', '1:1');
    expect(element.style.getPropertyValue('--tp-frame-numerator')).toBe('1');
    expect(element.style.getPropertyValue('--tp-frame-denominator')).toBe('1');

    element.removeAttribute('aspect-ratio');

    expect(element.style.getPropertyValue('--tp-frame-numerator')).toBe('');
    expect(element.style.getPropertyValue('--tp-frame-denominator')).toBe('');
  });

  it('does not apply invalid aspect-ratio values to CSS custom properties', () => {
    const element = document.createElement('tp-frame');
    document.body.append(element);

    element.setAttribute('aspect-ratio', 'invalid');

    expect(element.style.getPropertyValue('--tp-frame-numerator')).toBe('');
    expect(element.style.getPropertyValue('--tp-frame-denominator')).toBe('');
  });

  it('supports an img child', () => {
    const element = document.createElement('tp-frame');
    element.innerHTML = '<img src="/image.jpg" alt="Example" />';
    document.body.append(element);

    const image = element.querySelector('img');

    expect(image).not.toBeNull();
    expect(image?.getAttribute('alt')).toBe('Example');
  });

  it('supports a video child', () => {
    const element = document.createElement('tp-frame');
    element.innerHTML = '<video src="/video.mp4"></video>';
    document.body.append(element);

    const video = element.querySelector('video');

    expect(video).not.toBeNull();
    expect(video?.getAttribute('src')).toBe('/video.mp4');
  });
});