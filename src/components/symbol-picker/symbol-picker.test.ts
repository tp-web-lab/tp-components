import { beforeEach, describe, expect, it, vi } from 'vitest';

import htmlSymbolsData from './html-symbols.json?raw';
import './symbol-picker.js';
import { getSymbolMetadata, parseHtmlSymbols, type TpSymbolPicker } from './symbol-picker.js';

function mountPicker(filter = 'infinity'): TpSymbolPicker {
  const picker = document.createElement('tp-symbol-picker') as TpSymbolPicker;
  picker.filter = filter;
  document.body.append(picker);
  return picker;
}

describe('<tp-symbol-picker>', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    writeText = vi.fn<(_: string) => Promise<void>>().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  it('provides the complete deduplicated HTML5 entity repertoire', () => {
    const items = parseHtmlSymbols(htmlSymbolsData);
    expect(items).toHaveLength(1511);
    expect(items).toContainEqual(expect.objectContaining({
      symbol: '∞',
      entities: expect.arrayContaining(['&infin;']),
      codepoints: ['221E'],
    }));
  });

  it('renders filtered symbols and their groups', () => {
    const picker = mountPicker();
    expect(picker.querySelector<HTMLButtonElement>('[data-tp-symbol-picker-item][data-symbol="∞"]'))
      .not.toBeNull();
    expect(Array.from(picker.querySelectorAll('option')).map((option) => option.textContent))
      .toContain('Mathematics');
  });

  it('displays metadata and copies the selected representation', () => {
    const picker = mountPicker();
    picker.copy = 'html-entity';
    picker.querySelector<HTMLButtonElement>(
      '[data-tp-symbol-picker-item][data-symbol="∞"]',
    )?.click();

    expect(writeText).toHaveBeenCalledWith('&infin;');
    expect(Array.from(picker.querySelectorAll('[data-tp-symbol-picker-aliases] code'))
      .map((element) => element.textContent))
      .toContain('&infin;');
    expect(Array.from(picker.querySelectorAll('[data-tp-symbol-picker-metadata] code'))
      .map((element) => element.textContent))
      .toEqual(['U+221E', '&#x221E;', '&#8734;', '&infin;']);
  });

  it('integrates all clipboard formats in a tp-radio-list', () => {
    const picker = mountPicker();
    const radioList = picker.querySelector('tp-radio-list[data-tp-symbol-picker-copy-format]');
    expect(Array.from(radioList?.querySelectorAll('li') ?? []).map((item) => item.textContent?.trim()))
      .toEqual(['Symbol', 'Unicode', 'Hexa code', 'HTML code', 'HTML entity']);
  });

  it('computes numeric and named HTML representations', () => {
    const infinity = parseHtmlSymbols(htmlSymbolsData).find((item) => item.symbol === '∞');
    expect(infinity === undefined ? null : getSymbolMetadata(infinity)).toEqual({
      unicode: 'U+221E',
      hexadecimalHtml: '&#x221E;',
      decimalHtml: '&#8734;',
      htmlEntity: '&infin;',
    });
  });

  it('reflects the compact presentation mode', () => {
    const picker = mountPicker();
    picker.compact = true;
    expect(picker.hasAttribute('compact')).toBe(true);
    picker.querySelector<HTMLButtonElement>(
      '[data-tp-symbol-picker-item][data-symbol="∞"]',
    )?.click();
    expect(picker.querySelector('[data-tp-symbol-picker-compact-selected]')?.textContent)
      .toBe('∞');
  });

  it('supports filters, groups, every copy representation, and copy errors', async () => {
    const picker = mountPicker('');
    picker.group = '';
    expect(picker.group).toBe('all');
    picker.filter = ' infinity ';
    const search = picker.querySelector<HTMLInputElement>('[data-tp-symbol-picker-search]');
    if (search !== null) {
      search.value = 'infinity';
      search.dispatchEvent(new Event('input'));
    }
    const item = picker.querySelector<HTMLButtonElement>(
      '[data-tp-symbol-picker-item][data-symbol="∞"]',
    );
    picker.copy = 'unicode'; item?.click();
    expect(writeText).toHaveBeenLastCalledWith('U+221E');
    picker.copy = 'hexadecimal-html'; item?.click();
    expect(writeText).toHaveBeenLastCalledWith('&#x221E;');
    picker.copy = 'decimal-html'; item?.click();
    expect(writeText).toHaveBeenLastCalledWith('&#8734;');
    picker.setAttribute('copy', 'unsupported'); item?.click();
    expect(writeText).toHaveBeenLastCalledWith('∞');

    writeText.mockRejectedValueOnce(new Error('denied'));
    const onError = vi.fn(); picker.addEventListener('tp-symbol-picker-copy-error', onError);
    item?.click();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());

    picker.querySelector('[data-tp-symbol-picker-copy-format]')?.dispatchEvent(
      new CustomEvent('tp-radio-list-change', { detail: {} }),
    );
    expect(picker.copy).toBe('symbol');
  });

  it('covers group filtering, singular counts, reconnection, and missing entities', () => {
    const picker = mountPicker('infinity');
    expect(picker.compact).toBe(false);
    picker.group = 'Mathematics';
    expect(picker.querySelectorAll('[data-tp-symbol-picker-item]').length).toBeGreaterThan(0);
    picker.group = 'missing-group';
    expect(picker.querySelectorAll('[data-tp-symbol-picker-item]')).toHaveLength(0);

    picker.group = 'all';
    picker.filter = '221E';
    expect(picker.querySelector('[data-tp-symbol-picker-count]')?.textContent).toBe('1 symbol');

    const internal = picker as unknown as {
      selectItem(item: {
        symbol: string; name: string; group: string; entities: string[]; codepoints: string[];
      }): void;
    };
    internal.selectItem({ symbol: 'x', name: 'without entity', group: 'Test', entities: [], codepoints: ['78'] });
    expect(picker.querySelectorAll('[data-tp-symbol-picker-aliases] code')).toHaveLength(0);

    const childCount = picker.childElementCount;
    picker.remove(); document.body.append(picker);
    expect(picker.childElementCount).toBe(childCount);
  });
});
