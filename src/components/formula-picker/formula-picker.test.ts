import { beforeEach, describe, expect, it, vi } from 'vitest';
import { spreadsheetFormulaNames, spreadsheetFormulaSignature } from './formula-picker.js';
import './formula-picker.js';

describe('<tp-formula-picker>', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('lists Formula.js functions and emits the selected formula', () => {
    expect(spreadsheetFormulaNames).toContain('SUM');
    expect(spreadsheetFormulaSignature('ABS')).toBe('ABS(number)');
    expect(spreadsheetFormulaSignature('SUM')).toBe('SUM(number1, …)');
    const picker = document.createElement('tp-formula-picker'); document.body.append(picker);
    const listener = vi.fn(); picker.addEventListener('tp-formula-picker-select', listener);
    const select = picker.querySelector('select');
    if (select !== null) { select.value = 'SUM'; select.dispatchEvent(new Event('change')); }
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: expect.objectContaining({ name: 'SUM', formula: '=SUM(number1, …)' }) }));
  });

  it('handles unknown signatures and ignores the prompt option', () => {
    expect(spreadsheetFormulaSignature('NOT_A_FORMULA')).toBe('NOT_A_FORMULA(xxx)');
    const picker = document.createElement('tp-formula-picker'); document.body.append(picker);
    const listener = vi.fn(); picker.addEventListener('tp-formula-picker-select', listener);
    picker.querySelector('select')?.dispatchEvent(new Event('change'));
    expect(listener).not.toHaveBeenCalled();
  });
});
