/**
 * @module icon-picker/test
 * @summary Tests for the `<tp-icon-picker>` component.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './icon-picker.js';
import type { TpIconPicker } from './icon-picker.js';

/**
 * Creates and connects a `<tp-icon-picker>` element.
 *
 * @summary Mounts the icon picker component for tests.
 * @returns Connected picker instance.
 */
function mountPicker(): TpIconPicker {
  const picker = document.createElement('tp-icon-picker') as TpIconPicker;
  document.body.append(picker);
  return picker;
}

describe('<tp-icon-picker>', () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    writeTextMock = vi.fn<(_: string) => Promise<void>>().mockResolvedValue();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is registered as a custom element', () => {
    expect(customElements.get('tp-icon-picker')).toBeDefined();
  });

  it('renders icon items from predefined icon sources', () => {
    const picker = mountPicker();
    const cards = picker.querySelectorAll('[data-tp-icon-picker-item]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('filters icon cards by text using the filter attribute', () => {
    const picker = mountPicker();
    picker.setAttribute('filter', 'camera-timer');

    const cards = Array.from(
      picker.querySelectorAll<HTMLElement>('[data-tp-icon-picker-item]'),
    );
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      const iconName = card.dataset.name ?? '';
      expect(iconName.includes('camera-timer')).toBe(true);
    }
  });

  it('filters icon cards by library', () => {
    const picker = mountPicker();
    picker.setAttribute('library', 'languages');

    const cards = Array.from(
      picker.querySelectorAll<HTMLElement>('[data-tp-icon-picker-item]'),
    );
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card.dataset.library).toBe('languages');
    }
  });

  it('dispatches a selection event when an icon is clicked', () => {
    const picker = mountPicker();
    const onSelect = vi.fn();
    picker.addEventListener('tp-icon-picker-select', onSelect);

    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    expect(firstCard).not.toBeNull();
    firstCard?.click();

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('copies the clicked icon name to clipboard', () => {
    const picker = mountPicker();
    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    expect(firstCard).not.toBeNull();
    const iconName = firstCard?.dataset.name ?? '';
    expect(iconName).not.toBe('');

    firstCard?.click();

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(iconName);
  });

  it('labels and groups the filter and library controls', () => {
    const picker = mountPicker();
    const filterField = picker.querySelector('[data-tp-icon-picker-field="filter"]');
    const libraryField = picker.querySelector('[data-tp-icon-picker-field="library"]');

    expect(picker.querySelector(':scope > [data-tp-icon-picker-heading]')?.textContent)
      .toBe('Icon picker');
    expect(filterField?.querySelector('label')?.textContent).toBe('Filter');
    expect(filterField?.querySelector('label')?.htmlFor)
      .toBe(filterField?.querySelector('input')?.id);
    expect(libraryField?.querySelector('label')?.textContent).toBe('Library');
    expect(libraryField?.querySelector('label')?.htmlFor)
      .toBe(libraryField?.querySelector('select')?.id);
  });

  it('reflects the compact presentation mode', () => {
    const picker = mountPicker();
    picker.compact = true;
    expect(picker.hasAttribute('compact')).toBe(true);
    picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]')?.click();
    expect(picker.querySelector('[data-tp-icon-picker-compact-selected] svg')).not.toBeNull();
  });

  it.each([
    ['svg', /^<svg[\s>]/],
    ['tp-icon', /^<tp-icon name="[^"]+"(?: library="[^"]+")? size="1em" color="currentColor" scale="1" rotate="0deg"><\/tp-icon>$/],
    ['tp-icon-button', /^<tp-icon-button name="[^"]+"(?: library="[^"]+")? color="currentColor" scale="1" rotate="0deg"><\/tp-icon-button>$/],
    ['img', /^<img src="[^"]+" alt="[^"]+ from [^"]+" \/>$/],
  ] as const)('copies the icon as %s', (format, expected) => {
    const picker = mountPicker();
    picker.copy = format;

    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    expect(firstCard).not.toBeNull();
    firstCard?.click();

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0]?.[0]).toMatch(expected);
  });

  it('falls back to the icon name for an unsupported copy attribute', () => {
    const picker = mountPicker();
    picker.setAttribute('copy', 'unsupported');
    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    const iconName = firstCard?.dataset.name ?? '';

    firstCard?.click();

    expect(writeTextMock).toHaveBeenCalledWith(iconName);
  });

	it('integrates a labelled radio list for every copy format', async () => {
		const picker = mountPicker();
		await new Promise<void>((resolve) => queueMicrotask(resolve));
    const labels = Array.from(
      picker.querySelectorAll<HTMLLabelElement>(
        '[data-tp-icon-picker-copy-format] input[type="radio"] + span, [data-tp-icon-picker-copy-format] label',
      ),
    ).map((label) => label.textContent?.trim());

    expect(picker.querySelector('tp-radio-list[data-tp-icon-picker-copy-format]')).not.toBeNull();
    expect(labels).toEqual(expect.arrayContaining([
      'Icon name',
      'SVG code',
      'tp-icon HTML',
      'tp-icon-button HTML',
      'img HTML',
    ]));

    const radios = picker.querySelectorAll<HTMLInputElement>(
      '[data-tp-icon-picker-copy-format] input[type="radio"]',
    );
    radios[1]?.click();
    expect(picker.copy).toBe('svg');
  });

  it('shows the exact value that will be copied and updates it with the format', () => {
    const picker = mountPicker();
    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    const preview = picker.querySelector<HTMLTextAreaElement>(
      '[data-tp-icon-picker-copy-preview]',
    );
    expect(firstCard).not.toBeNull();
    expect(preview?.value).toBe(firstCard?.dataset.name);

    picker.copy = 'tp-icon';

    expect(preview?.value).toMatch(
      /^<tp-icon name="[^"]+"(?: library="[^"]+")? size="1em" color="currentColor" scale="1" rotate="0deg"><\/tp-icon>$/,
    );
    firstCard?.click();
    expect(writeTextMock).toHaveBeenCalledWith(preview?.value);
  });

  it('adds configured icon attributes to the tp-icon code', () => {
    const picker = mountPicker();
    picker.copy = 'tp-icon';

    const setValue = (name: string, value: string): void => {
      const input = picker.querySelector<HTMLInputElement>(
        `[data-tp-icon-picker-option="${name}"]`,
      );
      expect(input).not.toBeNull();
      if (input !== null) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };
    const check = (name: string): void => {
      const input = picker.querySelector<HTMLInputElement>(
        `[data-tp-icon-picker-option="${name}"]`,
      );
      expect(input).not.toBeNull();
      input?.click();
    };

    setValue('size', '3em');
    setValue('color', 'tomato');
    setValue('scale', '1.5');
    setValue('rotate', '45deg');
    check('flip-h');
    check('flip-v');
    check('spin');

    const preview = picker.querySelector<HTMLTextAreaElement>(
      '[data-tp-icon-picker-copy-preview]',
    );
    expect(preview?.value).toContain(' size="3em"');
    expect(preview?.value).toContain(' color="tomato"');
    expect(preview?.value).toContain(' scale="1.5"');
    expect(preview?.value).toContain(' rotate="45deg"');
    expect(preview?.value).toContain(' flip-h flip-v spin');
  });

  it('initializes icon attribute inputs with tp-icon defaults', () => {
    const picker = mountPicker();
    const value = (name: string): string | undefined => picker
      .querySelector<HTMLInputElement>(`[data-tp-icon-picker-option="${name}"]`)
      ?.value;

    expect(value('size')).toBe('1em');
    expect(value('color')).toBe('currentColor');
    expect(value('scale')).toBe('1');
    expect(value('rotate')).toBe('0deg');
  });

  it('visualizes the clicked icon with its name and library', () => {
    const picker = mountPicker();
    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    const selectedPreview = picker.querySelector<HTMLElement>(
      '[data-tp-icon-picker-selected-preview]',
    );
    const caption = picker.querySelector<HTMLElement>(
      '[data-tp-icon-picker-selected-caption]',
    );

    expect(selectedPreview?.textContent).toBe('Click an icon');
    expect(selectedPreview?.style.inlineSize).toBe('max-content');
    expect(selectedPreview?.style.blockSize).toBe('auto');
    const stableIconBeforeClick = selectedPreview?.querySelector<HTMLElement>('tp-icon');
    expect(stableIconBeforeClick?.id).not.toBe('');
    expect(stableIconBeforeClick?.hidden).toBe(true);
    firstCard?.click();

    const selectedIcon = selectedPreview?.querySelector<HTMLElement>('tp-icon');
    expect(selectedIcon).toBe(stableIconBeforeClick);
    expect(selectedIcon).not.toBeNull();
    expect(selectedIcon?.hidden).toBe(false);
    expect(selectedIcon?.getAttribute('name')).toBe(firstCard?.dataset.name);
    expect(selectedIcon?.getAttribute('library')).toBe(firstCard?.dataset.library);
    expect(selectedPreview?.style.blockSize).toBe('1em');
    expect(caption?.textContent).toBe(
      `${firstCard?.dataset.name ?? ''} — ${firstCard?.dataset.library ?? ''}`,
    );

    const size = picker.querySelector<HTMLInputElement>(
      '[data-tp-icon-picker-option="size"]',
    );
    const color = picker.querySelector<HTMLInputElement>(
      '[data-tp-icon-picker-option="color"]',
    );
    const scale = picker.querySelector<HTMLInputElement>(
      '[data-tp-icon-picker-option="scale"]',
    );
    if (size !== null) {
      size.value = '4em';
      size.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (color !== null) {
      color.value = 'tomato';
      color.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (scale !== null) {
      scale.value = '1.5';
      scale.dispatchEvent(new Event('input', { bubbles: true }));
    }

    expect(selectedIcon?.getAttribute('size')).toBe('4em');
    expect(selectedIcon?.getAttribute('color')).toBe('tomato');
    expect(selectedIcon?.getAttribute('scale')).toBe('1.5');
  });

  it('does not modify the icon clicked in the grid', () => {
    const picker = mountPicker();
    const firstCard = picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]');
    const gridSvg = firstCard?.querySelector<SVGElement>('svg');
    const originalStyle = gridSvg?.getAttribute('style');
    firstCard?.click();

    const size = picker.querySelector<HTMLInputElement>(
      '[data-tp-icon-picker-option="size"]',
    );
    if (size !== null) {
      size.value = '8em';
      size.dispatchEvent(new Event('input', { bubbles: true }));
    }

    expect(gridSvg?.getAttribute('style')).toBe(originalStyle);
    expect(
      picker.querySelector('tp-icon[data-tp-icon-picker-selected-icon]')?.getAttribute('size'),
    ).toBe('8em');
  });

  it('uses normalized flag names in the selected tp-icon', async () => {
    const picker = mountPicker();
    picker.library = 'flags';
    const flag = picker.querySelector<HTMLButtonElement>(
      '[data-tp-icon-picker-item][data-name="fr"]',
    );
    expect(flag).not.toBeNull();
    flag?.click();
    await Promise.resolve();
    await Promise.resolve();

    const selected = picker.querySelector<HTMLElement>(
      'tp-icon[data-tp-icon-picker-selected-icon]',
    );
    expect(selected?.getAttribute('name')).toBe('fr');
    expect(selected?.getAttribute('library')).toBe('flags');
    expect(selected?.querySelector('svg')).not.toBeNull();
  });

  it('renders unique SVG definition IDs across visible icons', () => {
    const picker = mountPicker();
    picker.setAttribute('library', 'flags');

    const idNodes = Array.from(
      picker.querySelectorAll<HTMLElement>('[data-tp-icon-picker-preview] [id]'),
    );
    const ids = idNodes
      .map((node) => node.getAttribute('id'))
      .filter((id): id is string => id !== null && id !== '');

    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reuses its structure and handles its public controls', async () => {
    const picker = mountPicker();
    expect(picker.compact).toBe(false);
    picker.compact = true;
    expect(picker.compact).toBe(true);

    const search = picker.querySelector<HTMLInputElement>('[data-tp-icon-picker-search]');
    if (search !== null) {
      search.value = 'camera-timer';
      search.dispatchEvent(new Event('input'));
    }
    expect(picker.filter).toBe('camera-timer');

    picker.filter = '';
    const library = picker.querySelector<HTMLSelectElement>('[data-tp-icon-picker-library]');
    if (library !== null) {
      library.value = 'languages';
      library.dispatchEvent(new Event('change'));
    }
    expect(picker.library).toBe('languages');

    picker.querySelector('[data-tp-icon-picker-copy-format]')?.dispatchEvent(
      new CustomEvent('tp-radio-list-change', { detail: {} }),
    );
    expect(picker.copy).toBe('name');

    const childCount = picker.childElementCount;
    picker.remove();
    document.body.append(picker);
    await Promise.resolve();
    expect(picker.childElementCount).toBe(childCount);
  });

  it('reports clipboard rejection and supports an empty result set', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('denied'));
    const picker = mountPicker();
    const onError = vi.fn();
    picker.addEventListener('tp-icon-picker-copy-error', onError);
    picker.querySelector<HTMLButtonElement>('[data-tp-icon-picker-item]')?.click();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());

    picker.filter = 'a value that cannot match any icon';
    expect(picker.querySelectorAll('[data-tp-icon-picker-item]')).toHaveLength(0);
    expect(picker.querySelector('[data-tp-icon-picker-count]')?.textContent).toBe('0 icon');
  });

  it('omits empty optional attributes from copied markup', () => {
    const picker = mountPicker();
    for (const input of picker.querySelectorAll<HTMLInputElement>(
      '[data-tp-icon-picker-option]:not([type="checkbox"])',
    )) {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    }
    picker.copy = 'tp-icon';
    const preview = picker.querySelector<HTMLTextAreaElement>('[data-tp-icon-picker-copy-preview]');
    expect(preview?.value).not.toContain(' size=');
    expect(preview?.value).not.toContain(' color=');
    expect(preview?.value).not.toContain(' scale=');
    expect(preview?.value).not.toContain(' rotate=');
  });
});
