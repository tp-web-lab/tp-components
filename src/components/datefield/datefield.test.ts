import { afterEach, describe, expect, it, vi } from 'vitest';
import './datefield.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-datefield>', () => {
  it('renders a native date input and forwards constraints', () => {
    const field = document.createElement('tp-datefield');
    field.setAttribute('value', '2026-09-03');
    field.setAttribute('min', '2026-01-01');
    field.setAttribute('max', '2026-12-31');
    document.body.append(field);
    const input = field.querySelector('input')!;
    expect(input.type).toBe('date');
    expect(input.value).toBe('2026-09-03');
    expect(input.min).toBe('2026-01-01');
    expect(input.max).toBe('2026-12-31');
  });

  it('associates its label and supports logical positions', () => {
    const field = document.createElement('tp-datefield');
    field.label = 'Date';
    field.labelPosition = 'start';
    document.body.append(field);
    expect(field.querySelector('label')?.contains(field.querySelector('input'))).toBe(true);
    expect(field.labelPosition).toBe('start');
  });

  it('reflects native input and clears the value', () => {
    const field = document.createElement('tp-datefield');
    field.setAttribute('value', '2026-09-03');
    field.setAttribute('clearable', '');
    document.body.append(field);
    const listener = vi.fn();
    field.addEventListener('tp-clear', listener);
    field.querySelector<HTMLElement>('[data-tp-datefield-clear]')?.click();
    expect(field.value).toBe('');
    expect(listener).toHaveBeenCalledOnce();
  });

  it('reflects its complete form API and emits native input/change events', () => {
    const field = document.createElement('tp-datefield');
    field.label = 'Birthday';
    field.value = '2026-09-06';
    field.min = '2026-01-01';
    field.max = '2026-12-31';
    field.step = 2;
    field.name = 'birthday';
    field.autocomplete = 'bday';
    field.required = true;
    field.readOnly = true;
    field.disabled = true;
    field.clearable = true;
    document.body.append(field);
    expect([field.label, field.value, field.min, field.max, field.step, field.name, field.autocomplete]).toEqual(['Birthday', '2026-09-06', '2026-01-01', '2026-12-31', 2, 'birthday', 'bday']);
    expect([field.required, field.readOnly, field.disabled, field.clearable]).toEqual([true, true, true, true]);
    const input = field.querySelector('input')!;
    const inputEvent = vi.fn();
    const changeEvent = vi.fn();
    field.addEventListener('input', inputEvent);
    field.addEventListener('change', changeEvent);
    input.value = '2026-10-01';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(field.value).toBe('2026-10-01');
    expect(inputEvent).toHaveBeenCalled();
    expect(changeEvent).toHaveBeenCalled();
  });

  it('uses defaults for invalid label position and step', () => {
    const field = document.createElement('tp-datefield');
    field.setAttribute('label-position', 'middle');
    field.setAttribute('step', 'bad');
    expect(field.labelPosition).toBe('top');
    expect(field.step).toBe(1);
  });

  it('opens the picker, falls back to focus, and ignores blocked states', () => {
    const field = document.createElement('tp-datefield');
    document.body.append(field);
    const input = field.querySelector('input')!;
    const focus = vi.spyOn(input, 'focus');
    const showPicker = vi.fn();
    Object.defineProperty(input, 'showPicker', { configurable: true, value: showPicker });
    field.showPicker();
    expect(showPicker).toHaveBeenCalledOnce();
    showPicker.mockImplementation(() => { throw new Error('unsupported'); });
    field.querySelector<HTMLElement>('[data-tp-datefield-picker]')?.click();
    expect(focus).toHaveBeenCalled();
    field.disabled = true;
    field.showPicker();
    expect(showPicker).toHaveBeenCalledTimes(2);
  });
});
