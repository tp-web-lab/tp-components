import { afterEach, describe, expect, it } from 'vitest';

import './radio-list.js';
import { TpRadioList } from './radio-list.js';

async function flush(): Promise<void> {
  await Promise.resolve();
}

describe('<tp-radio-list>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    const styleEl = document.head.querySelector('#tp-radio-list-styles');
    styleEl?.parentElement?.removeChild(styleEl);
  });

  it('extends TpBase', () => {
    const element = document.createElement('tp-radio-list');

    expect(element).toBeInstanceOf(TpRadioList);
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('injects global style once', async () => {
    document.body.innerHTML = `
      <tp-radio-list><ul><li>One</li></ul></tp-radio-list>
      <tp-radio-list><ul><li>Two</li></ul></tp-radio-list>
    `;
    await flush();

    expect(document.head.querySelectorAll('#tp-radio-list-styles')).toHaveLength(1);
  });

  it('uses vertical orientation by default', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ul><li>One</li></ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list');
    expect(element?.getAttribute('orientation')).toBe('vertical');
  });

  it('normalizes unsupported orientation to vertical', async () => {
    document.body.innerHTML = `
      <tp-radio-list orientation="diagonal">
        <ul><li>One</li></ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list');
    expect(element?.getAttribute('orientation')).toBe('vertical');
  });

  it('supports horizontal orientation', async () => {
    document.body.innerHTML = `
      <tp-radio-list orientation="horizontal">
        <ul><li>One</li><li>Two</li></ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list');
    expect(element?.getAttribute('orientation')).toBe('horizontal');
  });

  it('transforms ul list items into radio options', async () => {
    document.body.innerHTML = `
      <tp-radio-list name="choices">
        <ul>
          <li>Alpha</li>
          <li>Beta</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const inputs = document.querySelectorAll(
      'tp-radio-list li > label > input[type="radio"]',
    );
    expect(inputs).toHaveLength(2);
    expect((inputs[0] as HTMLInputElement).name).toBe('choices');
    expect((inputs[1] as HTMLInputElement).name).toBe('choices');

    const firstLabel = document.querySelector('tp-radio-list li > label');
    expect(firstLabel?.textContent?.trim()).toBe('Alpha');
  });

  it('supports ordered lists', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ol>
          <li>First</li>
          <li>Second</li>
        </ol>
      </tp-radio-list>
    `;
    await flush();

    expect(
      document.querySelectorAll('tp-radio-list ol li > label > input[type="radio"]'),
    ).toHaveLength(2);
  });

  it('keeps ordered-list marker style metadata from the source list', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ol style="list-style-type: upper-alpha;">
          <li>One</li>
          <li>Two</li>
        </ol>
      </tp-radio-list>
    `;
    await flush();

    const list = document.querySelector('tp-radio-list > ol');
    expect(list?.getAttribute('data-tp-radio-list-counter-style')).toBe('upper-alpha');
  });

  it('preserves checked and disabled flags from list item attributes', async () => {
    document.body.innerHTML = `
      <tp-radio-list name="flags">
        <ul>
          <li checked>Selected</li>
          <li disabled>Locked</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const selected = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    const element = document.querySelector('tp-radio-list') as TpRadioList;
    expect(selected[0]?.checked).toBe(true);
    expect(selected[1]?.disabled).toBe(true);
    expect(element.value).toBe('1');
  });

  it('keeps transformation idempotent when re-running', async () => {
    document.body.innerHTML = `
      <tp-radio-list name="stable">
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    element.setAttribute('lang', 'fr');
    await flush();

    expect(
      document.querySelectorAll('tp-radio-list li > label > input[type="radio"]'),
    ).toHaveLength(2);
  });

  it('updates generated radio names when the name attribute changes', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    const before = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    expect(before[0]?.name).toBeTruthy();
    expect(before[0]?.name).toBe(before[1]?.name);

    element.setAttribute('name', 'updated-group');
    await flush();

    const after = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    expect(after[0]?.name).toBe('updated-group');
    expect(after[1]?.name).toBe('updated-group');
  });

  it('exposes value as 1-based selected index', async () => {
    document.body.innerHTML = `
      <tp-radio-list value="2">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );

    expect(element.value).toBe('2');
    expect(inputs[0]?.checked).toBe(false);
    expect(inputs[1]?.checked).toBe(true);
    expect(inputs[2]?.checked).toBe(false);
  });

  it('allows setting value property to select an item', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>Four</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    element.value = '4';
    await flush();

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    expect(element.getAttribute('value')).toBe('4');
    expect(inputs[3]?.checked).toBe(true);
  });

  it('supports value="" for no selection', async () => {
    document.body.innerHTML = `
      <tp-radio-list value="2">
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    element.value = '';
    await flush();

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    expect(element.getAttribute('value')).toBe('');
    expect(inputs[0]?.checked).toBe(false);
    expect(inputs[1]?.checked).toBe(false);
  });

  it('updates value when selection changes', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    const input = inputs[2];
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('expected third radio input');
    }
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();

    expect(element.value).toBe('3');
    expect(element.getAttribute('value')).toBe('3');
  });

  it('emits tp-radio-list-change with value and label when value changes', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ul>
          <li>First choice</li>
          <li>Second choice</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    const events: Array<{ value: string; label: string }> = [];
    element.addEventListener('tp-radio-list-change', (event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }
      const detail = event.detail as { value?: unknown; label?: unknown };
      events.push({
        value: typeof detail.value === 'string' ? detail.value : '',
        label: typeof detail.label === 'string' ? detail.label : '',
      });
    });

    element.value = '2';
    await flush();

    expect(events).toHaveLength(1);
    expect(events[0]?.value).toBe('2');
    expect(events[0]?.label).toBe('Second choice');
  });

  it('reset() restores the initial selected index', async () => {
    document.body.innerHTML = `
      <tp-radio-list value="2">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </tp-radio-list>
    `;
    await flush();

    const element = document.querySelector('tp-radio-list') as TpRadioList;
    element.value = '3';
    await flush();
    element.reset();
    await flush();

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-radio-list input[type="radio"]',
    );
    expect(element.value).toBe('2');
    expect(inputs[0]?.checked).toBe(false);
    expect(inputs[1]?.checked).toBe(true);
    expect(inputs[2]?.checked).toBe(false);
  });

  it('includes ul bullet reset and horizontal layout rules in injected CSS', async () => {
    document.body.innerHTML = `
      <tp-radio-list>
        <ul><li>One</li></ul>
      </tp-radio-list>
    `;
    await flush();

    const cssText =
      document.head.querySelector('#tp-radio-list-styles')?.textContent ?? '';
    expect(cssText).toContain('tp-radio-list > ul {');
    expect(cssText).toContain('--tp-radio-list-marker-width: 2ch;');
    expect(cssText).toContain('list-style: none;');
    expect(cssText).toContain('display: block;');
    expect(cssText).toContain('margin-bottom: 1em;');
    expect(cssText).toContain('padding-inline-start: 0.5em;');
    expect(cssText).toContain('margin-block-start: 0.25em;');
    expect(cssText).toContain("tp-radio-list[orientation='vertical'] > ol > li::before");
    expect(cssText).toContain('grid-template-columns: auto minmax(0, 1fr);');
    expect(cssText).toContain('grid-column: 2;');
    expect(cssText).toContain('margin-block-end: 0.5em;');
    expect(cssText).toContain("content: counter(tp-radio-list-counter) '.';");
    expect(cssText).toContain('text-align: end;');
    expect(cssText).toContain('grid-template-columns:');
    expect(cssText).toContain("tp-radio-list[orientation='vertical'] > ol > li::before");
    expect(cssText).toContain("data-tp-radio-list-counter-style='upper-alpha'");
    expect(cssText).toContain("data-tp-radio-list-counter-style='lower-alpha'");
    expect(cssText).toContain("data-tp-radio-list-counter-style='upper-roman'");
    expect(cssText).toContain("data-tp-radio-list-counter-style='lower-roman'");
    expect(cssText).toContain('padding-inline-start: 1.25em;');
    expect(cssText).toContain('block-size: 1em;');
    expect(cssText).not.toContain('transform: scale(1.4);');
    expect(cssText).toContain("tp-radio-list[orientation='horizontal'] > ul,");
    expect(cssText).toContain('gap: 1em;');
    expect(cssText).toContain("tp-radio-list[orientation='horizontal'] > ol > li::before");
    expect(cssText).toContain("content: counter(tp-radio-list-counter) '.';");
  });

  it('reflects name and orientation properties and cleans listeners on disconnect', async () => {
    const element = document.createElement('tp-radio-list') as TpRadioList;
    element.innerHTML = '<ul><li>One</li><li>Two</li></ul>';
    element.name = 'choice';
    element.orientation = 'horizontal';
    document.body.append(element);
    await flush();
    expect(element.name).toBe('choice');
    expect(element.orientation).toBe('horizontal');
    element.remove();
    document.body.append(element);
    await flush();
    expect(element.querySelectorAll('input')).toHaveLength(2);
  });

  it('rejects malformed and out-of-range values', async () => {
    document.body.innerHTML = '<tp-radio-list><ul><li>A</li><li>B</li></ul></tp-radio-list>';
    await flush();
    const element = document.querySelector('tp-radio-list') as TpRadioList;
    element.value = '3';
    expect(element.value).toBe('');
    element.value = '1.0';
    expect(element.value).toBe('');
  });

  it.each([['a', 'lower-alpha'], ['A', 'upper-alpha'], ['i', 'lower-roman'], ['I', 'upper-roman'], ['1', 'decimal'], ['x', 'decimal']])(
    'maps ordered-list type %s to %s',
    async (type, expected) => {
      document.body.innerHTML = `<tp-radio-list><ol type="${type}"><li>A</li><li>B</li></ol></tp-radio-list>`;
      await flush();
      expect(document.querySelector('ol')?.getAttribute('data-tp-radio-list-counter-style')).toBe(expected);
    },
  );
});
