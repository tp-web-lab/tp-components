import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import emojiTestData from './emoji-test-17.0.txt?raw';
import './emoji-picker.js';
import {
  getEmojiMetadata,
  parseEmojiTestData,
  type TpEmojiPicker,
} from './emoji-picker.js';

function mountPicker(filter = 'distorted face'): TpEmojiPicker {
  const picker = document.createElement('tp-emoji-picker') as TpEmojiPicker;
  picker.setAttribute('filter', filter);
  document.body.append(picker);
  return picker;
}

describe('<tp-emoji-picker>', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    writeText = vi.fn<(_: string) => Promise<void>>().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('parses the complete Unicode Emoji 17.0 RGI set', () => {
    const items = parseEmojiTestData(emojiTestData);
    expect(items).toHaveLength(3953);
    expect(items).toContainEqual(expect.objectContaining({
      emoji: '🫪',
      name: 'distorted face',
      version: '17.0',
      codepoints: ['1FAEA'],
    }));
  });

  it('renders an Emoji 17.0 entry by name', () => {
    const picker = mountPicker();
    const item = picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]');
    expect(item?.dataset.emoji).toBe('🫪');
    expect(item?.dataset.name).toBe('distorted face');
  });

  it('provides official Unicode groups', () => {
    const picker = mountPicker();
    const values = Array.from(
      picker.querySelectorAll<HTMLOptionElement>('[data-tp-emoji-picker-group] option'),
    ).map((option) => option.value);
    expect(values).toContain('Smileys & Emotion');
    expect(values).toContain('Flags');
  });

  it('keeps the group label beside its select', () => {
    const picker = mountPicker();
    const field = picker.querySelector('[data-tp-emoji-picker-field="group"]');
    expect(field?.children[0]?.textContent).toBe('Group');
    expect(field?.children[1]?.matches('select[data-tp-emoji-picker-group]')).toBe(true);
  });

  it('copies and displays the selected emoji', () => {
    const picker = mountPicker();
    const listener = vi.fn();
    picker.addEventListener('tp-emoji-picker-select', listener);
    picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]')?.click();

    expect(writeText).toHaveBeenCalledWith('🫪');
    expect(
      picker.querySelector('[data-tp-emoji-picker-selected-emoji]')?.textContent,
    ).toBe('🫪');
    expect(listener).toHaveBeenCalledTimes(1);
    const values = Array.from(
      picker.querySelectorAll<HTMLElement>('[data-tp-emoji-picker-metadata] code'),
    ).map((element) => element.textContent);
    expect(values).toEqual(['U+1FAEA', '&#x1FAEA;', '&#129770;', 'None']);
  });

  it('reports a named HTML entity when one exists', () => {
    expect(getEmojiMetadata({
      emoji: '©️',
      name: 'copyright',
      group: 'Symbols',
      subgroup: 'other-symbol',
      version: '0.6',
      codepoints: ['00A9', 'FE0F'],
    }).htmlEntity).toBe('&copy;');
  });

  it('integrates a labelled radio list for every clipboard format', () => {
    const picker = mountPicker();
    const radioList = picker.querySelector('tp-radio-list[data-tp-emoji-picker-copy-format]');
    expect(radioList).not.toBeNull();
    expect(Array.from(radioList?.querySelectorAll('li') ?? []).map((item) => item.textContent?.trim()))
      .toEqual(['Emoji', 'Unicode', 'Hexa code', 'HTML code', 'HTML entity']);
  });

  it('copies the selected representation', () => {
    const picker = mountPicker();
    picker.copy = 'unicode';
    picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]')?.click();
    expect(writeText).toHaveBeenLastCalledWith('U+1FAEA');

    picker.copy = 'hexadecimal-html';
    picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]')?.click();
    expect(writeText).toHaveBeenLastCalledWith('&#x1FAEA;');
  });

  it('does not copy an unavailable named HTML entity', () => {
    const picker = mountPicker();
    picker.copy = 'html-entity';
    picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]')?.click();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('reflects the compact presentation mode', () => {
    const picker = mountPicker();
    picker.compact = true;
    expect(picker.hasAttribute('compact')).toBe(true);
    picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]')?.click();
    expect(picker.querySelector('[data-tp-emoji-picker-compact-selected]')?.textContent)
      .toBe('🫪');
  });

  it('supports control events, all copy formats, fallbacks, and copy errors', async () => {
    const picker = mountPicker('');
    picker.group = '';
    expect(picker.group).toBe('all');
    picker.filter = ' distorted face ';
    const search = picker.querySelector<HTMLInputElement>('[data-tp-emoji-picker-search]');
    if (search !== null) {
      search.value = 'face';
      search.dispatchEvent(new Event('input'));
    }
    const group = picker.querySelector<HTMLSelectElement>('[data-tp-emoji-picker-group]');
    if (group !== null) {
      group.value = 'Flags';
      group.dispatchEvent(new Event('change'));
    }
    expect(picker.group).toBe('Flags');
    picker.group = 'all'; picker.filter = 'distorted face';

    const item = picker.querySelector<HTMLButtonElement>('[data-tp-emoji-picker-item]');
    picker.copy = 'decimal-html'; item?.click();
    expect(writeText).toHaveBeenLastCalledWith('&#129770;');
    picker.setAttribute('copy', 'unsupported'); item?.click();
    expect(writeText).toHaveBeenLastCalledWith('🫪');

    writeText.mockRejectedValueOnce(new Error('denied'));
    const onError = vi.fn(); picker.addEventListener('tp-emoji-picker-copy-error', onError);
    item?.click();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());

    picker.querySelector('[data-tp-emoji-picker-copy-format]')?.dispatchEvent(
      new CustomEvent('tp-radio-list-change', { detail: {} }),
    );
    expect(picker.copy).toBe('emoji');
  });
});
