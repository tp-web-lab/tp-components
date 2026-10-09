import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './accordion.js';
import { TpAccordion } from './accordion.js';

describe('<tp-accordion>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  function createAccordion(): TpAccordion {
    document.body.innerHTML = `
      <tp-accordion>
        <dl>
          <dt>Summary 1</dt>
          <dd>Content 1</dd>

          <dt>Summary 2</dt>
          <dd>Content 2</dd>
        </dl>
      </tp-accordion>
    `;

    const element = document.querySelector('tp-accordion');
    if (!(element instanceof TpAccordion)) {
      throw new Error('Expected <tp-accordion> instance.');
    }

    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-accordion');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpAccordion);
  });

  it('injects CSS once', () => {
    const first = createAccordion();

    const second = document.createElement('tp-accordion');
    second.innerHTML = `
      <dl>
        <dt>One</dt>
        <dd>Content</dd>
      </dl>
    `;

    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-accordion-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpAccordion);
  });

  it('reflects multiple property', () => {
    const element = createAccordion();

    expect(element.multiple).toBe(false);

    element.multiple = true;
    expect(element.hasAttribute('multiple')).toBe(true);
    expect(element.multiple).toBe(true);

    element.multiple = false;
    expect(element.hasAttribute('multiple')).toBe(false);
  });

  it('normalizes and reflects the appearance property', () => {
    const element = createAccordion();

    expect(element.appearance).toBe('default');

    element.appearance = 'outlined';
    expect(element.getAttribute('appearance')).toBe('outlined');
    expect(element.appearance).toBe('outlined');

    element.setAttribute('appearance', 'unknown');
    expect(element.appearance).toBe('default');

    element.appearance = 'default';
    expect(element.hasAttribute('appearance')).toBe(false);
  });

  it('defines default, outlined, and filled appearance styles', () => {
    createAccordion();
    const css = document.getElementById('tp-accordion-styles')?.textContent ?? '';

    expect(css).toContain("tp-accordion[appearance='default']");
    expect(css).toContain("tp-accordion[appearance='outlined']");
    expect(css).toContain("tp-accordion[appearance='filled']");
    expect(css).toContain('--tp-brand-fill-softer');
    expect(css).toContain("tp-accordion[appearance='filled'] > dl > dd");
    expect(css).toContain('background-color: var(--tp-paper-color, Canvas)');
    expect(css).toContain('translateY(-70%) rotate(45deg)');
    expect(css).toContain("tp-accordion[appearance='outlined'] > dl,");
    expect(css).toContain('margin-block-end: 0');
  });

  it('reflects openIndexes property', () => {
    const element = createAccordion();

    element.openIndexes = [2, 0, 2, 1];

    expect(element.getAttribute('open-indexes')).toBe('0 1 2');
    expect(element.openIndexes).toEqual([0, 1, 2]);
  });

  it('opens one section with open(index)', () => {
    const element = createAccordion();
    const contents = element.querySelectorAll('dd');

    element.open(1);

    expect(contents[0]?.hidden).toBe(true);
    expect(contents[1]?.hidden).toBe(false);
  });

  it('closes one section with close(index)', () => {
    const element = createAccordion();
    const contents = element.querySelectorAll('dd');

    element.open(1);
    element.close(1);

    expect(contents[0]?.hidden).toBe(true);
    expect(contents[1]?.hidden).toBe(true);
  });

  it('toggles one section with toggle(index)', () => {
    const element = createAccordion();
    const contents = element.querySelectorAll('dd');

    element.toggle(0);
    expect(contents[0]?.hidden).toBe(false);

    element.toggle(0);
    expect(contents[0]?.hidden).toBe(true);
  });

  it('allows only one open section by default', () => {
    const element = createAccordion();

    element.open(0);
    element.open(1);

    expect(element.openIndexes).toEqual([1]);
  });

  it('allows multiple open sections when multiple is set', () => {
    const element = createAccordion();

    element.multiple = true;
    element.open(0);
    element.open(1);

    expect(element.openIndexes).toEqual([0, 1]);
  });

  it('clicking a summary toggles the matching content', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');
    const contents = element.querySelectorAll('dd');

    summaries[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(contents[0]?.hidden).toBe(false);
  });

  it('adds ARIA attributes to summaries and contents', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');
    const contents = element.querySelectorAll('dd');

    expect(summaries[0]?.getAttribute('role')).toBe('button');
    expect(summaries[0]?.getAttribute('tabindex')).toBe('0');
    expect(contents[0]?.getAttribute('role')).toBe('region');
    expect(summaries[0]?.getAttribute('aria-controls')).toBe(contents[0]?.id ?? null);
    expect(contents[0]?.getAttribute('aria-labelledby')).toBe(summaries[0]?.id ?? null);
  });

  it('supports ArrowDown keyboard navigation', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');

    summaries[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowDown',
      }),
    );

    expect(document.activeElement).toBe(summaries[1]);
  });

  it('supports ArrowUp keyboard navigation', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');

    summaries[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowUp',
      }),
    );

    expect(document.activeElement).toBe(summaries[0]);
  });

  it('supports Home key', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');

    summaries[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Home',
      }),
    );

    expect(document.activeElement).toBe(summaries[0]);
  });

  it('supports End key', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');

    summaries[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'End',
      }),
    );

    expect(document.activeElement).toBe(summaries[1]);
  });

  it('supports Enter to toggle a summary', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');
    const contents = element.querySelectorAll('dd');

    summaries[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
      }),
    );

    expect(contents[0]?.hidden).toBe(false);
  });

  it('supports Space to toggle a summary', () => {
    const element = createAccordion();
    const summaries = element.querySelectorAll('dt');
    const contents = element.querySelectorAll('dd');

    summaries[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: ' ',
      }),
    );

    expect(contents[0]?.hidden).toBe(false);
  });

  it('ignores nested dt/dd elements outside direct dl children', () => {
    document.body.innerHTML = `
      <tp-accordion>
        <dl>
          <dt>Summary 1</dt>
          <dd>
            Content 1
            <dl>
              <dt>Nested</dt>
              <dd>Nested content</dd>
            </dl>
          </dd>

          <dt>Summary 2</dt>
          <dd>Content 2</dd>
        </dl>
      </tp-accordion>
    `;

    const element = document.querySelector('tp-accordion');
    if (!(element instanceof TpAccordion)) {
      throw new Error('Expected <tp-accordion> instance.');
    }

    const summaries = element.querySelectorAll('dt[role="button"]');
    const contents = element.querySelectorAll('dd[role="region"]');

    expect(summaries).toHaveLength(2);
    expect(contents).toHaveLength(2);
  });
});
