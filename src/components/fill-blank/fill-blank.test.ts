import { afterEach, describe, expect, it } from 'vitest';

import './fill-blank.js';
import { TpFillBlank } from './fill-blank.js';

async function flush(): Promise<void> {
  await Promise.resolve();
}

describe('<tp-fill-blank>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    const styleEl = document.head.querySelector('#tp-fill-blank-styles');
    styleEl?.parentElement?.removeChild(styleEl);
  });

  it('extends TpBase', () => {
    const element = document.createElement('tp-fill-blank');

    expect(element).toBeInstanceOf(TpFillBlank);
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('injects global style once', async () => {
    document.body.innerHTML = `
      <tp-fill-blank><p>3 x 4 = <input /></p></tp-fill-blank>
      <tp-fill-blank><p>2 x 5 = <input /></p></tp-fill-blank>
    `;
    await flush();

    expect(document.head.querySelectorAll('#tp-fill-blank-styles')).toHaveLength(1);
  });

  it('initializes input and select without initial value', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>3 x 4 = <input value="12" placeholder="nombre" /></p>
        <p>
          couleur ?
          <select>
            <option value="">placeholder</option>
            <option value="blanc" selected>blanc</option>
            <option value="gris">gris</option>
          </select>
        </p>
      </tp-fill-blank>
    `;
    await flush();

    const input = document.querySelector('tp-fill-blank input');
    const select = document.querySelector('tp-fill-blank select');
    expect((input as HTMLInputElement).value).toBe('');
    expect((select as HTMLSelectElement).value).toBe('');
  });

  it('normalizes select placeholder and option values', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>
          couleur ?
          <select>
            <option>blanc</option>
            <option>gris</option>
          </select>
        </p>
      </tp-fill-blank>
    `;
    await flush();

    const select = document.querySelector('tp-fill-blank select') as HTMLSelectElement;
    const options = Array.from(select.options);

    expect(options[0]?.value).toBe('');
    expect(options[0]?.textContent?.trim()).toBe('choose an option');
    expect(options[1]?.value).toBe('blanc');
    expect(options[2]?.value).toBe('gris');
    expect(select.value).toBe('');
  });

  it('assigns generated names when blanks have no name', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p><input /></p>
        <p><select><option value="">placeholder</option></select></p>
      </tp-fill-blank>
    `;
    await flush();

    const blanks = document.querySelectorAll('tp-fill-blank input, tp-fill-blank select');
    expect((blanks[0] as HTMLInputElement).name).toMatch(/^blank-\d+$/);
    expect((blanks[1] as HTMLSelectElement).name).toMatch(/^blank-\d+$/);
  });

  it('returns FormData from value getter', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>3 x 4 = <input name="first" /></p>
        <p>
          couleur ?
          <select name="second">
            <option value="">placeholder</option>
            <option value="blanc">blanc</option>
            <option value="gris">gris</option>
          </select>
        </p>
      </tp-fill-blank>
    `;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const input = document.querySelector('tp-fill-blank input') as HTMLInputElement;
    const select = document.querySelector('tp-fill-blank select') as HTMLSelectElement;
    input.value = '12';
    select.value = 'gris';

    const data = element.value;
    expect(data.get('first')).toBe('12');
    expect(data.get('second')).toBe('gris');
  });

  it('applies FormData through value setter', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>3 x 4 = <input name="first" /></p>
        <p>
          couleur ?
          <select name="second">
            <option value="">placeholder</option>
            <option value="blanc">blanc</option>
            <option value="gris">gris</option>
          </select>
        </p>
      </tp-fill-blank>
    `;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const data = new FormData();
    data.set('first', '12');
    data.set('second', 'blanc');

    element.value = data;
    await flush();

    const input = document.querySelector('tp-fill-blank input') as HTMLInputElement;
    const select = document.querySelector('tp-fill-blank select') as HTMLSelectElement;
    expect(input.value).toBe('12');
    expect(select.value).toBe('blanc');
  });

  it('reset() restores initialization state', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>3 x 4 = <input name="first" /></p>
        <p>
          couleur ?
          <select name="second">
            <option value="">placeholder</option>
            <option value="blanc">blanc</option>
            <option value="gris">gris</option>
          </select>
        </p>
      </tp-fill-blank>
    `;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const input = document.querySelector('tp-fill-blank input') as HTMLInputElement;
    const select = document.querySelector('tp-fill-blank select') as HTMLSelectElement;
    input.value = '99';
    select.value = 'gris';

    element.reset();
    await flush();

    expect(input.value).toBe('');
    expect(select.value).toBe('');
  });

  it('emits tp-fill-blank-change when an input changes', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>3 x 4 = <input name="answer" /></p>
      </tp-fill-blank>
    `;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const input = document.querySelector('tp-fill-blank input') as HTMLInputElement;

    let eventDetail: { value: Record<string, string>; formData: FormData } | null = null;
    element.addEventListener('tp-fill-blank-change', (e) => {
      eventDetail = (
        e as CustomEvent<{ value: Record<string, string>; formData: FormData }>
      ).detail;
    });

    input.value = '12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    expect(eventDetail).not.toBeNull();
    expect(eventDetail!.value.answer).toBe('12');
    expect(eventDetail!.formData.get('answer')).toBe('12');
  });

  it('emits tp-fill-blank-change when a select changes', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <p>
          couleur ?
          <select name="color">
            <option value="">placeholder</option>
            <option value="blanc">blanc</option>
            <option value="gris">gris</option>
          </select>
        </p>
      </tp-fill-blank>
    `;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const select = document.querySelector('tp-fill-blank select') as HTMLSelectElement;

    let eventDetail: { value: Record<string, string>; formData: FormData } | null = null;
    element.addEventListener('tp-fill-blank-change', (e) => {
      eventDetail = (
        e as CustomEvent<{ value: Record<string, string>; formData: FormData }>
      ).detail;
    });

    select.value = 'gris';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();

    expect(eventDetail).not.toBeNull();
    expect(eventDetail!.value.color).toBe('gris');
    expect(eventDetail!.formData.get('color')).toBe('gris');
  });

  it('ignores bubbled events that do not originate from a blank', async () => {
    document.body.innerHTML = '<tp-fill-blank><button>Help</button></tp-fill-blank>';
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    let changes = 0;
    element.addEventListener('tp-fill-blank-change', () => changes += 1);
    element.querySelector('button')?.dispatchEvent(new Event('input', { bubbles: true }));

    expect(changes).toBe(0);
  });

  it('uses only the first FormData value and clears missing or unknown select values', async () => {
    document.body.innerHTML = `
      <tp-fill-blank>
        <input name="word" />
        <select name="color"><option value="">Choose</option><option value="blue">Blue</option></select>
      </tp-fill-blank>
    `;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const data = new FormData();
    data.append('word', 'first');
    data.append('word', 'second');
    data.set('color', 'unknown');
    element.value = data;

    expect((element.querySelector('input') as HTMLInputElement).value).toBe('first');
    expect((element.querySelector('select') as HTMLSelectElement).selectedIndex).toBe(-1);
  });

  it('removes change listeners when disconnected', async () => {
    document.body.innerHTML = '<tp-fill-blank><input name="answer" /></tp-fill-blank>';
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const input = element.querySelector('input') as HTMLInputElement;
    let changes = 0;
    element.addEventListener('tp-fill-blank-change', () => changes += 1);
    element.remove();
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(changes).toBe(0);
  });

  it('clears a select even after its placeholder option is removed', async () => {
    document.body.innerHTML = `
      <tp-fill-blank><select name="color"><option value="blue">Blue</option></select></tp-fill-blank>`;
    await flush();

    const element = document.querySelector('tp-fill-blank') as TpFillBlank;
    const select = element.querySelector('select') as HTMLSelectElement;
    select.querySelector('option[value=""]')?.remove();
    const data = new FormData();
    data.set('color', '');
    element.value = data;

    expect(select.selectedIndex).toBe(-1);
  });
});
