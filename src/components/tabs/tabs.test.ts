import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './tabs.js';
import { TpTabs } from './tabs.js';

describe('<tp-tabs>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  function createTabs(): TpTabs {
    document.body.innerHTML = `
      <tp-tabs>
        <dl>
          <dt>Tab 1</dt>
          <dd>Panel 1</dd>

          <dt>Tab 2</dt>
          <dd>Panel 2</dd>
        </dl>
      </tp-tabs>
    `;

    const element = document.querySelector('tp-tabs');
    if (!(element instanceof TpTabs)) {
      throw new Error('Expected <tp-tabs> instance.');
    }

    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-tabs');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpTabs);
  });

  it('injects CSS once', () => {
    const first = createTabs();

    const second = document.createElement('tp-tabs');
    second.innerHTML = `
      <dl>
        <dt>One</dt>
        <dd>Panel one</dd>
      </dl>
    `;

    document.body.append(second);

    expect(document.head.querySelectorAll('#tp-tabs-styles')).toHaveLength(1);
    expect(document.head.querySelector('#tp-tabs-styles')?.textContent).toContain(
      'font-weight: 400;',
    );
    expect(document.head.querySelector('#tp-tabs-styles')?.textContent).toContain(
      'font-weight: 600;',
    );
    expect(document.head.querySelector('#tp-tabs-styles')?.textContent).toContain(
      'display: flow-root;',
    );
    expect(first).toBeInstanceOf(TpTabs);
  });

  it('converts the author dl into an internal tablist', () => {
    const element = createTabs();
    const dl = element.querySelector('[data-tp-tablist]');

    expect(dl?.getAttribute('role')).toBe('tablist');
    expect(dl?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('converts author dt elements into internal tabs', () => {
    const element = createTabs();
    const tabs = element.querySelectorAll('[data-tp-tab]');

    expect(tabs[0]?.getAttribute('role')).toBe('tab');
    expect(tabs[1]?.getAttribute('role')).toBe('tab');
  });

  it('converts author dd elements into internal tabpanels', () => {
    const element = createTabs();
    const panels = element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]');

    expect(panels[0]?.getAttribute('role')).toBe('tabpanel');
    expect(panels[1]?.getAttribute('role')).toBe('tabpanel');
  });

  it('does not expose the author definition-list elements after conversion', () => {
    const element = createTabs();

    expect(element.querySelector(':scope > dl')).toBeNull();
    expect(element.querySelectorAll(':scope > dt, :scope > dd')).toHaveLength(0);
    expect(element.querySelectorAll('[data-tp-tab][role="tab"]')).toHaveLength(2);
    expect(element.querySelectorAll('[data-tp-tabpanel][role="tabpanel"]')).toHaveLength(2);
  });

  it('selects the first tab by default', () => {
    const element = createTabs();
    const tabs = element.querySelectorAll('[data-tp-tab]');
    const panels = element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]');

    expect(element.selected).toBe(0);
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('false');
    expect(panels[0]?.hidden).toBe(false);
    expect(panels[1]?.hidden).toBe(true);
  });

  it('reflects the selected property', () => {
    const element = createTabs();

    element.selected = 1;

    expect(element.getAttribute('selected')).toBe('1');
    expect(element.selected).toBe(1);
  });

  it('throws when selected is negative', () => {
    const element = createTabs();

    expect(() => {
      element.selected = -1;
    }).toThrow(TypeError);
  });

  it('throws when selected is not an integer', () => {
    const element = createTabs();

    expect(() => {
      element.selected = 1.5;
    }).toThrow(TypeError);
  });

  it('activates the clicked tab', () => {
    const element = createTabs();
    const tabs = element.querySelectorAll('[data-tp-tab]');
    const panels = element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]');

    tabs[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(element.selected).toBe(1);
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('false');
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(panels[0]?.hidden).toBe(true);
    expect(panels[1]?.hidden).toBe(false);
  });

  it('prevents link navigation inside a tab label', () => {
    document.body.innerHTML = `
      <tp-tabs>
        <dl>
          <dt>HTML</dt>
          <dd>Panel 1</dd>
          <dt><a href="markdown-example.md">markdown-example.md</a></dt>
          <dd>Panel 2</dd>
        </dl>
      </tp-tabs>
    `;

    const element = document.querySelector('tp-tabs');
    if (!(element instanceof TpTabs)) {
      throw new Error('Expected <tp-tabs> instance.');
    }

    const link = element.querySelector<HTMLAnchorElement>('a[href="markdown-example.md"]');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    link?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(element.selected).toBe(1);
  });

  it('supports auto activation with ArrowRight in horizontal mode', () => {
    const element = createTabs();
    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowRight',
      }),
    );

    expect(element.selected).toBe(1);
  });

  it('supports auto activation with ArrowLeft in horizontal mode', () => {
    const element = createTabs();
    element.selected = 1;

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowLeft',
      }),
    );

    expect(element.selected).toBe(0);
  });

  it('supports vertical orientation with ArrowDown', () => {
    const element = createTabs();
    element.orientation = 'vertical';

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowDown',
      }),
    );

    expect(element.selected).toBe(1);
  });

  it('supports vertical orientation with ArrowUp', () => {
    const element = createTabs();
    element.orientation = 'vertical';
    element.selected = 1;

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowUp',
      }),
    );

    expect(element.selected).toBe(0);
  });

  it('supports Home key', () => {
    const element = createTabs();
    element.selected = 1;

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Home',
      }),
    );

    expect(element.selected).toBe(0);
  });

  it('supports End key', () => {
    const element = createTabs();

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'End',
      }),
    );

    expect(element.selected).toBe(1);
  });

  it('supports manual activation mode', () => {
    const element = createTabs();
    element.activation = 'manual';

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowRight',
      }),
    );

    expect(element.selected).toBe(0);

    tabs[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Enter',
      }),
    );

    expect(element.selected).toBe(1);
  });

  it('supports manual activation with Space', () => {
    const element = createTabs();
    element.activation = 'manual';

    const tabs = element.querySelectorAll('[data-tp-tab]');

    tabs[1]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: ' ',
      }),
    );

    expect(element.selected).toBe(1);
  });

  it('utilise les tokens de couleur de tp.css dans sa feuille de style', () => {
    createTabs();

    const styleEl = document.head.querySelector('#tp-tabs-styles');
    const cssText = styleEl?.textContent ?? '';

    expect(cssText).toContain('var(--tp-neutral-stroke-soft)');
    expect(cssText).toContain('var(--tp-neutral-fill-softer)');
    expect(cssText).toContain('var(--tp-brand-text-colorful)');
    expect(cssText).toContain('var(--tp-focus-color)');
  });

  it('sets roving tabindex correctly', () => {
    const element = createTabs();
    element.selected = 1;

    const tabs = element.querySelectorAll('[data-tp-tab]');

    expect(tabs[0]?.getAttribute('tabindex')).toBe('-1');
    expect(tabs[1]?.getAttribute('tabindex')).toBe('0');
  });

  it('links tabs and panels with ids and aria attributes', () => {
    const element = createTabs();
    const tabs = element.querySelectorAll('[data-tp-tab]');
    const panels = element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]');

    expect(tabs[0]?.id).toContain('tp-tabs-');
    expect(panels[0]?.id).toContain('tp-tabs-');
    expect(tabs[0]?.getAttribute('aria-controls')).toBe(panels[0]?.id ?? null);
    expect(panels[0]?.getAttribute('aria-labelledby')).toBe(tabs[0]?.id ?? null);
  });

  it('ignores nested dt/dd elements outside direct dl children', () => {
    document.body.innerHTML = `
      <tp-tabs>
        <dl>
          <dt>Tab 1</dt>
          <dd>
            Panel 1
            <dl>
              <dt>Nested</dt>
              <dd>Nested panel</dd>
            </dl>
          </dd>

          <dt>Tab 2</dt>
          <dd>Panel 2</dd>
        </dl>
      </tp-tabs>
    `;

    const element = document.querySelector('tp-tabs');
    if (!(element instanceof TpTabs)) {
      throw new Error('Expected <tp-tabs> instance.');
    }

    const tabs = element.querySelectorAll('[data-tp-tab][role="tab"]');
    const panels = element.querySelectorAll('[data-tp-tabpanel][role="tabpanel"]');

    expect(tabs).toHaveLength(2);
    expect(panels).toHaveLength(2);
  });

  it('select(index) clamps to the valid range', () => {
    const element = createTabs();

    element.select(99);
    expect(element.selected).toBe(1);

    element.select(-10);
    expect(element.selected).toBe(0);
  });

  it('does nothing with select(index) when there are no tabs', () => {
    document.body.innerHTML = `
      <tp-tabs>
        <dl></dl>
      </tp-tabs>
    `;

    const element = document.querySelector('tp-tabs');
    if (!(element instanceof TpTabs)) {
      throw new Error('Expected <tp-tabs> instance.');
    }

    expect(() => {
      element.select(1);
    }).not.toThrow();

    expect(element.selected).toBe(0);
  });

  it('adds, updates, selects, and removes tabs by value', () => {
    const element = createTabs();
    const added = element.addTab('third', 'Tab 3');
    expect(added).toBe(2);
    expect(element.querySelector('[data-tp-tab][data-value="third"]')?.textContent).toContain('Tab 3');
    expect(element.querySelector('[data-tp-tabpanel][data-value="third"]')).not.toBeNull();

    expect(element.addTab('third', 'Updated')).toBe(2);
    expect(element.querySelector('[data-tp-tab][data-value="third"] [data-tp-tab-label]')?.textContent).toBe('Updated');
    element.selectValue('third');
    expect(element.selected).toBe(2);
    expect(element.getSelectedValue()).toBe('third');

    element.removeTab('third');
    expect(element.querySelector('[data-value="third"]')).toBeNull();
    expect(element.selected).toBe(1);
    element.removeTab('missing');
  });

  it('creates an internal tablist for an initially empty component', () => {
    const element = document.createElement('tp-tabs') as TpTabs;
    document.body.append(element);
    expect(element.addTab('one', 'One')).toBe(0);
    expect(element.querySelector('[data-tp-tablist]')?.getAttribute('role')).toBe('tablist');
    expect(element.getSelectedValue()).toBe('one');
  });

  it('moves tabs with their panels and ignores invalid moves', () => {
    const element = createTabs();
    element.querySelectorAll('[data-tp-tab]')[0]?.setAttribute('data-value', 'one');
    element.querySelectorAll('[data-tp-tab]')[1]?.setAttribute('data-value', 'two');
    element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]')[0]?.setAttribute('data-value', 'one');
    element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]')[1]?.setAttribute('data-value', 'two');

    element.moveTab(0, 1);
    expect(element.querySelector('[data-tp-tab]')?.getAttribute('data-value')).toBe('two');
    expect(element.querySelector('[data-tp-tabpanel]')?.getAttribute('data-value')).toBe('two');
    expect(element.getSelectedValue()).toBe('one');

    element.moveTab(-1, 0);
    element.moveTab(0, 0);
    element.moveTab(0, 5);
    expect(element.querySelectorAll('[data-tp-tab]')).toHaveLength(2);
  });

  it('clears and refreshes dynamic tabs', () => {
    const element = createTabs();
    element.clearTabs();
    expect(element.querySelectorAll('[data-tp-tab]')).toHaveLength(0);
    expect(element.querySelectorAll<HTMLElement>('[data-tp-tabpanel]')).toHaveLength(0);
    expect(element.getSelectedValue()).toBeNull();
    element.refresh();
    expect(element.querySelector('[data-tp-tablist]')?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('emits close events from pointer and keyboard activation', () => {
    const element = createTabs();
    const tab = element.querySelector<HTMLElement>('[data-tp-tab]');
    const close = tab?.querySelector<HTMLElement>('[data-tp-tab-close]');
    const events: CustomEvent[] = [];
    element.addEventListener('tp-tabs-close', (event) => events.push(event as CustomEvent));

    close?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    close?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    tab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

    expect(events).toHaveLength(3);
    expect(events[0]?.detail).toEqual({ index: 0, value: '' });
  });

  it('blocks activation for disabled tabs', () => {
    const element = createTabs();
    const tab = element.querySelectorAll<HTMLElement>('[data-tp-tab]')[1];
    tab?.setAttribute('disabled', '');
    element.refresh();
    tab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    tab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(element.selected).toBe(0);
    expect(tab?.getAttribute('aria-disabled')).toBe('true');
  });

  it('supports drag reorder and reports its value', () => {
    const element = createTabs();
    const tabs = element.querySelectorAll<HTMLElement>('[data-tp-tab]');
    tabs[0]?.setAttribute('data-value', 'one');
    tabs[1]?.setAttribute('data-value', 'two');
    element.refresh();
    const store = new Map<string, string>();
    const dataTransfer = {
      dropEffect: 'none',
      effectAllowed: 'none',
      getData: (type: string) => store.get(type) ?? '',
      setData: (type: string, value: string) => store.set(type, value),
    } as unknown as DataTransfer;
    const reorder = vi.fn();
    element.addEventListener('tp-tabs-reorder', reorder);

    tabs[0]?.ondragstart?.({ dataTransfer } as DragEvent);
    tabs[1]?.ondragover?.({ dataTransfer, preventDefault: vi.fn() } as unknown as DragEvent);
    tabs[1]?.ondrop?.({ dataTransfer, preventDefault: vi.fn() } as unknown as DragEvent);

    expect(dataTransfer.effectAllowed).toBe('move');
    expect(dataTransfer.dropEffect).toBe('move');
    expect(element.querySelector('[data-tp-tab]')?.getAttribute('data-value')).toBe('two');
    expect(reorder).toHaveBeenCalledOnce();
  });
});
