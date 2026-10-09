import { afterEach, describe, expect, it, vi } from 'vitest';
import './timefield.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-timefield>', () => {
  it('renders a native time input and forwards constraints', () => {
    const field = document.createElement('tp-timefield');
    field.setAttribute('value', '14:30');
    field.setAttribute('min', '09:00');
    field.setAttribute('max', '18:00');
    field.setAttribute('step', '900');
    document.body.append(field);
    const input = field.querySelector('input')!;
    expect(input.type).toBe('time');
    expect(input.value).toBe('14:30');
    expect(input.min).toBe('09:00');
    expect(input.max).toBe('18:00');
    expect(input.step).toBe('900');
  });

  it('associates its label and supports logical positions', () => {
    const field = document.createElement('tp-timefield');
    field.label = 'Time';
    field.labelPosition = 'end';
    document.body.append(field);
    expect(field.querySelector('label')?.contains(field.querySelector('input'))).toBe(true);
    expect(field.labelPosition).toBe('end');
  });

  it('reflects native input and clears the value', () => {
    const field = document.createElement('tp-timefield');
    field.setAttribute('value', '14:30');
    field.setAttribute('clearable', '');
    document.body.append(field);
    const listener = vi.fn();
    field.addEventListener('tp-clear', listener);
    field.querySelector<HTMLElement>('[data-tp-timefield-clear]')?.click();
    expect(field.value).toBe('');
    expect(listener).toHaveBeenCalledOnce();
  });

  it('reflects its complete form API and emits native input/change events', () => {
    const field = document.createElement('tp-timefield');
    field.label = 'Meeting';
    field.value = '14:30';
    field.min = '09:00';
    field.max = '18:00';
    field.step = 60;
    field.name = 'meeting';
    field.autocomplete = 'off';
    field.required = true;
    field.readOnly = true;
    field.disabled = true;
    field.clearable = true;
    document.body.append(field);
    expect([field.label, field.value, field.min, field.max, field.step, field.name, field.autocomplete]).toEqual(['Meeting', '14:30', '09:00', '18:00', 60, 'meeting', 'off']);
    expect([field.required, field.readOnly, field.disabled, field.clearable]).toEqual([true, true, true, true]);
    const input = field.querySelector('input')!;
    const changed = vi.fn();
    field.addEventListener('change', changed);
    input.value = '15:45';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(field.value).toBe('15:45');
    expect(changed).toHaveBeenCalled();
  });

  it('uses defaults for invalid label position and step', () => {
    const field = document.createElement('tp-timefield');
    field.setAttribute('label-position', 'middle');
    field.setAttribute('step', 'bad');
    expect(field.labelPosition).toBe('top');
    expect(field.step).toBe(60);
  });

  it('opens the picker, falls back to focus, and ignores blocked states', () => {
    const field = document.createElement('tp-timefield');
    document.body.append(field);
    const input = field.querySelector('input')!;
    const focus = vi.spyOn(input, 'focus');
    const showPicker = vi.fn();
    Object.defineProperty(input, 'showPicker', { configurable: true, value: showPicker });
    field.showPicker();
    expect(showPicker).toHaveBeenCalledOnce();
    showPicker.mockImplementation(() => { throw new Error('unsupported'); });
    field.querySelector<HTMLElement>('[data-tp-timefield-picker]')?.click();
    expect(focus).toHaveBeenCalled();
    field.readOnly = true;
    field.showPicker();
    expect(showPicker).toHaveBeenCalledTimes(2);
  });
});
