import { afterEach, describe, expect, it } from 'vitest';

import './checkbox-list.js';
import { TpCheckboxList } from './checkbox-list.js';

async function flush(): Promise<void> {
  await Promise.resolve();
}

describe('<tp-checkbox-list>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    const styleEl = document.head.querySelector('#tp-checkbox-list-styles');
    styleEl?.parentElement?.removeChild(styleEl);
  });

  it('extends TpBase', () => {
    const element = document.createElement('tp-checkbox-list');

    expect(element).toBeInstanceOf(TpCheckboxList);
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('injects global style once', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list><ul><li>One</li></ul></tp-checkbox-list>
      <tp-checkbox-list><ul><li>Two</li></ul></tp-checkbox-list>
    `;
    await flush();

    expect(document.head.querySelectorAll('#tp-checkbox-list-styles')).toHaveLength(1);
  });

  it('uses vertical orientation by default', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list>
        <ul><li>One</li></ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list');
    expect(element?.getAttribute('orientation')).toBe('vertical');
  });

  it('normalizes unsupported orientation to vertical', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list orientation="diagonal">
        <ul><li>One</li></ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list');
    expect(element?.getAttribute('orientation')).toBe('vertical');
  });

  it('transforms list items into checkbox options', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list name="choices">
        <ul>
          <li>Alpha</li>
          <li>Beta</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const inputs = document.querySelectorAll(
      'tp-checkbox-list li > label > input[type="checkbox"]',
    );
    expect(inputs).toHaveLength(2);
    expect((inputs[0] as HTMLInputElement).name).toBe('choices');
    expect((inputs[1] as HTMLInputElement).name).toBe('choices');
  });

  it('preserves checked and disabled item states and ignores unrelated changes', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list><ul><li checked>One</li><li disabled>Two</li></ul></tp-checkbox-list>
    `;
    await flush();
    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    const inputs = element.querySelectorAll<HTMLInputElement>('input');
    expect(inputs[0]?.checked).toBe(true);
    expect(inputs[1]?.disabled).toBe(true);
    element.dispatchEvent(new Event('change', { bubbles: true }));
    const text = document.createElement('input');
    text.type = 'text';
    element.append(text);
    text.dispatchEvent(new Event('change', { bubbles: true }));
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    element.append(checkbox);
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(element.value).toBe('1');
  });

  it('keeps ordered-list marker style metadata from the source list', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list>
        <ol style="list-style-type: upper-alpha;">
          <li>One</li>
          <li>Two</li>
        </ol>
      </tp-checkbox-list>
    `;
    await flush();

    const list = document.querySelector('tp-checkbox-list > ol');
    expect(list?.getAttribute('data-tp-checkbox-list-counter-style')).toBe('upper-alpha');
  });

  it('exposes value as comma-separated selected indexes', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list value="2,4">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>Four</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-checkbox-list input[type="checkbox"]',
    );

    expect(element.value).toBe('2,4');
    expect(inputs[0]?.checked).toBe(false);
    expect(inputs[1]?.checked).toBe(true);
    expect(inputs[2]?.checked).toBe(false);
    expect(inputs[3]?.checked).toBe(true);
  });

  it('allows setting value property to select multiple items', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>Four</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    element.value = '4,2';
    await flush();

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-checkbox-list input[type="checkbox"]',
    );
    expect(element.getAttribute('value')).toBe('2,4');
    expect(inputs[1]?.checked).toBe(true);
    expect(inputs[3]?.checked).toBe(true);
  });

  it('supports value="" for no selection', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list value="2,3">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    element.value = '';
    await flush();

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-checkbox-list input[type="checkbox"]',
    );
    expect(element.getAttribute('value')).toBe('');
    expect(inputs[0]?.checked).toBe(false);
    expect(inputs[1]?.checked).toBe(false);
    expect(inputs[2]?.checked).toBe(false);
  });

  it('updates value when selection changes', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list>
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-checkbox-list input[type="checkbox"]',
    );
    const second = inputs[1];
    const third = inputs[2];
    if (!(second instanceof HTMLInputElement) || !(third instanceof HTMLInputElement)) {
      throw new Error('expected second and third checkbox inputs');
    }

    second.checked = true;
    second.dispatchEvent(new Event('change', { bubbles: true }));
    third.checked = true;
    third.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();

    expect(element.value).toBe('2,3');
    expect(element.getAttribute('value')).toBe('2,3');
  });

  it('reset() restores the initial selected indexes', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list value="1,3">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    element.value = '2';
    await flush();
    element.reset();
    await flush();

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'tp-checkbox-list input[type="checkbox"]',
    );
    expect(element.value).toBe('1,3');
    expect(inputs[0]?.checked).toBe(true);
    expect(inputs[1]?.checked).toBe(false);
    expect(inputs[2]?.checked).toBe(true);
  });

  it('emits tp-checkbox-list-change with value and labels when selection changes', async () => {
    document.body.innerHTML = `
      <tp-checkbox-list>
        <ul>
          <li>First choice</li>
          <li>Second choice</li>
        </ul>
      </tp-checkbox-list>
    `;
    await flush();

    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    const events: Array<{ value: string; label: string }> = [];
    element.addEventListener('tp-checkbox-list-change', (event) => {
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

  it('reflects name and orientation properties and cleans listeners on disconnect', async () => {
    const element = document.createElement('tp-checkbox-list') as TpCheckboxList;
    element.innerHTML = '<ul><li>One</li><li>Two</li></ul>';
    element.name = 'choices';
    element.orientation = 'horizontal';
    document.body.append(element);
    await flush();
    expect(element.name).toBe('choices');
    expect(element.orientation).toBe('horizontal');
    element.remove();
    document.body.append(element);
    await flush();
    expect(element.querySelectorAll('input')).toHaveLength(2);
  });

  it('normalizes invalid, duplicate and out-of-range values', async () => {
    document.body.innerHTML = '<tp-checkbox-list><ul><li>A</li><li>B</li><li>C</li></ul></tp-checkbox-list>';
    await flush();
    const element = document.querySelector('tp-checkbox-list') as TpCheckboxList;
    element.value = ' 3,2,2,0,bad,4 ';
    expect(element.value).toBe('2,3');
  });

  it.each([['a', 'lower-alpha'], ['A', 'upper-alpha'], ['i', 'lower-roman'], ['I', 'upper-roman'], ['1', 'decimal'], ['x', 'decimal']])(
    'maps ordered-list type %s to %s',
    async (type, expected) => {
      document.body.innerHTML = `<tp-checkbox-list><ol type="${type}"><li>A</li><li>B</li></ol></tp-checkbox-list>`;
      await flush();
      expect(document.querySelector('ol')?.getAttribute('data-tp-checkbox-list-counter-style')).toBe(expected);
    },
  );
});
