/** @module components/formula-picker */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit Formula.js https://formulajs.info/
 * @summary Excel-compatible formula functions.
 */
// tp-docgen:dependencies:end

import * as FormulaJs from '@formulajs/formulajs';
import { TpBase } from '../base/base.js';
import style from './formula-picker.css?inline';

export const spreadsheetFormulaNames = Object.entries(FormulaJs)
  .filter(([name, value]) => typeof value === 'function' && /^[A-Z][A-Z0-9.]*$/.test(name))
  .map(([name]) => name)
  .sort((left, right) => left.localeCompare(right));

const variadicFormulaParameters: Record<string, string> = {
  AND: 'logical1, …', AVERAGE: 'number1, …', CONCATENATE: 'text1, …',
  COUNT: 'value1, …', MAX: 'number1, …', MIN: 'number1, …', OR: 'logical1, …',
  PRODUCT: 'number1, …', SUM: 'number1, …',
};

export function spreadsheetFormulaSignature(name: string): string {
  const fn = (FormulaJs as unknown as Record<string, unknown>)[name];
  if (typeof fn !== 'function') return `${name}(xxx)`;
  const parameters = String(fn).match(/^function\s*[^()]*\(([^)]*)\)/)?.[1]?.trim() ?? '';
  const signature = parameters === '' ? variadicFormulaParameters[name] ?? 'xxx' : parameters;
  return `${name}(${signature})`;
}

/** Selects an Excel-compatible Formula.js function.  * @tagname tp-formula-picker
 * @example
 * <tp-formula-picker></tp-formula-picker>
 */
export class TpFormulaPicker extends TpBase {
  private static readonly styleId = 'tp-formula-picker-styles';

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpFormulaPicker.styleId, style);
    this.render();
  }

  private render(): void {
    const label = document.createElement('label');
    label.textContent = 'Formula';
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Formula');
    const prompt = document.createElement('option');
    prompt.value = ''; prompt.textContent = 'Insert a formula…'; prompt.selected = true;
    select.append(prompt);
    for (const name of spreadsheetFormulaNames) {
      const option = document.createElement('option'); option.value = name; option.textContent = spreadsheetFormulaSignature(name); select.append(option);
    }
    select.addEventListener('change', () => {
      if (select.value === '') return;
      const signature = spreadsheetFormulaSignature(select.value);
      const formula = `=${signature}`;
      this.dispatchEvent(new CustomEvent('tp-formula-picker-select', {
        bubbles: true, composed: true, detail: {
          name: select.value, formula,
          selectionStart: formula.indexOf('(') + 1,
          selectionEnd: formula.lastIndexOf(')'),
        },
      }));
      select.value = '';
    });
    label.append(select);
    this.replaceChildren(label);
  }
}

if (!customElements.get('tp-formula-picker')) customElements.define('tp-formula-picker', TpFormulaPicker);

declare global { interface HTMLElementTagNameMap { 'tp-formula-picker': TpFormulaPicker; } }
