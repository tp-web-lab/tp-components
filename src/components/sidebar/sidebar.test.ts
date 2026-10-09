import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './sidebar.js';
import { TpSidebar } from './sidebar.js';

describe('<tp-sidebar>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('accepts a valid percentage for contentWidth', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;

    element.contentWidth = '60%';

    expect(element.getAttribute('content-width')).toBe('60%');
    expect(element.contentWidth).toBe('60%');
  });

  it('accepts a valid decimal percentage for contentWidth', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;

    element.contentWidth = '65.5%';

    expect(element.getAttribute('content-width')).toBe('65.5%');
    expect(element.contentWidth).toBe('65.5%');
  });

  it('throws when setting an invalid contentWidth value', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;

    expect(() => {
      element.contentWidth = '60';
    }).toThrow(TypeError);

    expect(() => {
      element.contentWidth = 'abc';
    }).toThrow(TypeError);

    expect(() => {
      element.contentWidth = '-10%';
    }).toThrow(TypeError);
  });

  it('returns an empty string when content-width attribute is invalid', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;

    element.setAttribute('content-width', 'invalid');

    expect(element.contentWidth).toBe('');
  });

  it('does not apply an invalid content-width attribute to CSS custom properties', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;
    document.body.append(element);

    element.setAttribute('content-width', 'invalid');

    expect(element.style.getPropertyValue('--tp-sidebar-content-width')).toBe('');
  });

  it('applies a valid content-width attribute to CSS custom properties', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;
    document.body.append(element);

    element.setAttribute('content-width', '70%');

    expect(element.style.getPropertyValue('--tp-sidebar-content-width')).toBe('70%');
  });

  it('uses the base lifecycle for help source capture', () => {
    document.body.innerHTML = `
      <tp-sidebar side-width="18rem">
        <nav>Navigation</nav>
        <main>Content</main>
      </tp-sidebar>
    `;

    const element = document.querySelector('tp-sidebar');

    expect(element?.hasAttribute('data-tp-base-host')).toBe(true);
    expect(element?.getAttribute('data-source')).toContain('<nav>Navigation</nav>');
  });

  it('removes content-width when the property is set to an empty string', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;

    element.contentWidth = '55%';
    expect(element.getAttribute('content-width')).toBe('55%');

    element.contentWidth = '';
    expect(element.hasAttribute('content-width')).toBe(false);
    expect(element.contentWidth).toBe('');
  });

  it('reflects side width, gap, and right-side placement', () => {
    const element = document.createElement('tp-sidebar') as TpSidebar;
    document.body.append(element);

    element.sideWidth = '18rem';
    element.gap = '1.5rem';
    element.rightSidebar = true;

    expect(element.style.getPropertyValue('--tp-sidebar-side-width')).toBe('18rem');
    expect(element.style.gap).toBe('1.5rem');
    expect(element.rightSidebar).toBe(true);

    element.sideWidth = '';
    element.gap = '';
    element.rightSidebar = false;

    expect(element.style.getPropertyValue('--tp-sidebar-side-width')).toBe('');
    expect(element.style.gap).toBe('');
    expect(element.hasAttribute('right-sidebar')).toBe(false);
  });

  it('injects its stylesheet once and exposes observed attributes', () => {
    document.body.append(
      document.createElement('tp-sidebar'),
      document.createElement('tp-sidebar'),
    );

    expect(document.head.querySelectorAll('#tp-sidebar-styles')).toHaveLength(1);
    expect(TpSidebar.observedAttributes).toEqual([
      'side-width',
      'content-width',
      'gap',
      'right-sidebar',
    ]);
  });

});
