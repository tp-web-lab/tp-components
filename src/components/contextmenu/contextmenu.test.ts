/**
 * @module contextmenu/test
 * @summary Tests du composant `<tp-contextmenu>`.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import './contextmenu.js';
import type { TpContextmenu } from './contextmenu.js';

/**
 * Attend la fin des micro-tâches en cours.
 *
 * @summary Attend la stabilisation asynchrone du DOM.
 * @returns Promesse résolue au prochain tour de micro-tâche.
 */
async function flush(): Promise<void> {
  await Promise.resolve();
}

/**
 * Retourne une valeur définie ou lève une erreur explicite.
 *
 * @summary Garantit qu'une valeur n'est ni `null` ni `undefined`.
 * @param value Valeur à vérifier.
 * @param message Message d'erreur si la valeur est absente.
 * @returns Valeur non nulle.
 * @throws {Error} Si la valeur est absente.
 */
function expectDefined<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}

/**
 * Retourne le premier élément `<tp-contextmenu>` du document.
 *
 * @summary Récupère le menu contextuel de test.
 * @returns Élément `<tp-contextmenu>`.
 * @throws {Error} Si aucun composant n’est trouvé.
 */
function getContextmenu(): TpContextmenu {
  const element = document.querySelector('tp-contextmenu');

  if (!(element instanceof HTMLElement)) {
    throw new Error('tp-contextmenu not found');
  }

  return element as TpContextmenu;
}

/**
 * Retourne tous les items `li` du menu.
 *
 * @summary Récupère tous les items du menu.
 * @returns Liste des items.
 */
function getMenuItems(): HTMLLIElement[] {
  const menu = getContextmenu();

  return Array.from(menu.querySelectorAll('li')).filter(
    (element): element is HTMLLIElement => element instanceof HTMLLIElement,
  );
}

describe('<tp-contextmenu>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('est défini', () => {
    expect(customElements.get('tp-contextmenu')).toBeDefined();
  });

  it('déclare le rôle menu sur la liste racine', async () => {
    document.body.innerHTML = `
      <tp-contextmenu>
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    const root = menu.querySelector(':scope > ul');

    expect(root).toBeInstanceOf(HTMLUListElement);
    expect(root?.getAttribute('role')).toBe('menu');
  });

  it('déclare le rôle menuitem sur chaque item', async () => {
    document.body.innerHTML = `
      <tp-contextmenu>
        <ul>
          <li data-action="rename">Rename</li>
          <li data-action="delete">Delete</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const items = getMenuItems();

    expect(items[0]?.getAttribute('role')).toBe('menuitem');
    expect(items[1]?.getAttribute('role')).toBe('menuitem');
  });

  it('déclare aria-haspopup sur un item ayant un sous-menu', async () => {
    document.body.innerHTML = `
      <tp-contextmenu>
        <ul>
          <li>
            More
            <ul>
              <li data-action="duplicate">Duplicate</li>
            </ul>
          </li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const parentItem = expectDefined(getMenuItems()[0], 'parent item not found');

    expect(parentItem.getAttribute('aria-haspopup')).toBe('menu');
    expect(parentItem.getAttribute('aria-expanded')).toBe('false');
  });

  it('ouvre le menu via showAt()', async () => {
    document.body.innerHTML = `
      <tp-contextmenu>
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    menu.showAt(120, 180);

    expect(menu.hasAttribute('open')).toBe(true);
    expect(menu.style.left).toBe('120px');
    expect(menu.style.top).toBe('180px');
  });

  it('ferme le menu via hide()', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    menu.hide();

    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('ferme le menu par clic extérieur', async () => {
    document.body.innerHTML = `
      <div id="outside"></div>
      <tp-contextmenu open>
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const outside = expectDefined(
      document.getElementById('outside'),
      'outside element not found',
    );

    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await flush();

    const menu = getContextmenu();
    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('ferme le menu avec Escape', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();

    const menu = getContextmenu();
    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('ouvre un sous-menu au clic sur un item parent', async () => {
    document.body.innerHTML = `
      <tp-contextmenu>
        <ul>
          <li>
            More
            <ul>
              <li data-action="duplicate">Duplicate</li>
            </ul>
          </li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const parentItem = expectDefined(getMenuItems()[0], 'parent item not found');
    parentItem.click();
    await flush();

    expect(parentItem.getAttribute('aria-expanded')).toBe('true');
  });

  it('émet tp-contextmenu-select lors du clic sur un item terminal avec data-action', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    const listener = vi.fn();
    menu.addEventListener('tp-contextmenu-select', listener);

    const item = expectDefined(getMenuItems()[0], 'menu item not found');
    item.click();
    await flush();

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.action).toBe('rename');
    expect(event.detail.item).toBe(item);
    expect(event.detail.label).toBe('Rename');
    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('n’émet pas tp-contextmenu-select pour un item terminal sans data-action', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li>Plain item</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    const listener = vi.fn();
    menu.addEventListener('tp-contextmenu-select', listener);

    const item = expectDefined(getMenuItems()[0], 'menu item not found');
    item.click();
    await flush();

    expect(listener).toHaveBeenCalledTimes(0);
    expect(menu.hasAttribute('open')).toBe(false);
  });

  it('émet tp-contextmenu-select avec Enter sur un item terminal', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="delete">Delete</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    const listener = vi.fn();
    menu.addEventListener('tp-contextmenu-select', listener);

    const item = expectDefined(getMenuItems()[0], 'menu item not found');
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await flush();

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.action).toBe('delete');
    expect(event.detail.label).toBe('Delete');
  });

  it('émet tp-contextmenu-select avec Espace sur un item terminal', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="duplicate">Duplicate</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const menu = getContextmenu();
    const listener = vi.fn();
    menu.addEventListener('tp-contextmenu-select', listener);

    const item = expectDefined(getMenuItems()[0], 'menu item not found');
    item.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await flush();

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.action).toBe('duplicate');
    expect(event.detail.label).toBe('Duplicate');
  });

  it('ouvre un sous-menu avec ArrowRight', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li>
            More
            <ul>
              <li data-action="duplicate">Duplicate</li>
            </ul>
          </li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const parentItem = expectDefined(getMenuItems()[0], 'parent item not found');
    parentItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flush();

    expect(parentItem.getAttribute('aria-expanded')).toBe('true');
  });

  it('ferme un sous-menu avec ArrowLeft depuis un item enfant', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li aria-expanded="true">
            More
            <ul>
              <li data-action="duplicate">Duplicate</li>
            </ul>
          </li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const items = getMenuItems();
    const parentItem = expectDefined(items[0], 'parent item not found');
    const childItem = expectDefined(items[1], 'child item not found');

    childItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await flush();

    expect(parentItem.getAttribute('aria-expanded')).toBe('false');
  });

  it('met à jour les tabindex lors du focus clavier', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="rename">Rename</li>
          <li data-action="delete">Delete</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const items = getMenuItems();
    const first = expectDefined(items[0], 'first item not found');
    const second = expectDefined(items[1], 'second item not found');

    expect(first.getAttribute('tabindex')).toBe('0');
    expect(second.getAttribute('tabindex')).toBe('-1');

    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await flush();

    expect(first.getAttribute('tabindex')).toBe('-1');
    expect(second.getAttribute('tabindex')).toBe('0');
  });

  it('s’ancre à un élément via anchor et s’ouvre au clic droit', async () => {
    document.body.innerHTML = `
      <button id="target">Target</button>
      <tp-contextmenu anchor="#target">
        <ul>
          <li data-action="rename">Rename</li>
        </ul>
      </tp-contextmenu>
    `;
    await flush();

    const target = expectDefined(
      document.getElementById('target'),
      'target element not found',
    );

    target.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 30,
        clientY: 40,
      }),
    );
    await flush();

    const menu = getContextmenu();

    expect(menu.hasAttribute('open')).toBe(true);
    expect(menu.style.left).toBe('30px');
    expect(menu.style.top).toBe('40px');
  });

  it('expose ses propriétés publiques', () => {
    const menu = document.createElement('tp-contextmenu') as TpContextmenu;
    menu.anchor = '#target';
    menu.open = true;
    expect(menu.anchor).toBe('#target');
    expect(menu.open).toBe(true);
    menu.open = false;
    expect(menu.open).toBe(false);
  });

  it('gère séparateurs, items désactivés et navigation extrême', async () => {
    document.body.innerHTML = `
      <tp-contextmenu open>
        <ul>
          <li data-action="first">First</li>
          <li role="separator">---</li>
          <li aria-disabled="true" data-action="disabled">Disabled</li>
          <li data-action="last">Last</li>
        </ul>
      </tp-contextmenu>`;
    await flush();
    const items = getMenuItems();
    const first = expectDefined(items[0], 'first item missing');
    const separator = expectDefined(items[1], 'separator missing');
    const disabled = expectDefined(items[2], 'disabled item missing');
    const last = expectDefined(items[3], 'last item missing');
    expect(separator.hasAttribute('tabindex')).toBe(false);
    disabled.click();
    expect(getContextmenu().open).toBe(true);
    disabled.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    disabled.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(last.tabIndex).toBe(0);
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(first.tabIndex).toBe(0);
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(last.tabIndex).toBe(0);
  });

  it('ignore les interactions internes et un contenu sans menu racine', async () => {
    document.body.innerHTML = '<tp-contextmenu open><span>Content</span></tp-contextmenu>';
    await flush();
    const menu = getContextmenu();
    menu.querySelector('span')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(menu.open).toBe(true);
  });

});
