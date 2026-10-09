/**
 * @module components/markup-playground/extension-menu
 * @summary Rendering and update helpers for the shared markup extension menu.
 */

import type {
  TpMarkupExtensionId,
  TpMarkupExtensionMenuItem,
} from './markup-extension.types.js';

/** Selector for the shared markup extension menu. */
export const TP_MARKUP_EXTENSION_MENU_SELECTOR =
  '[data-tp-markup-extension-menu]';

/** Selector for markup extension items. */
export const TP_MARKUP_EXTENSION_ITEM_SELECTOR =
  '[data-tp-markup-extension-id]';

/** Builds the action name for a markup extension. */
export function createMarkupExtensionAction(
  id: TpMarkupExtensionId,
): string {
  return `markup-extension-${id}`;
}

/** Returns whether an action targets a markup extension. */
export function isMarkupExtensionAction(action: string): boolean {
  return action.startsWith('markup-extension-');
}

/** Extracts a markup extension identifier from an action name. */
export function getMarkupExtensionIdFromAction(
  action: string,
): TpMarkupExtensionId | null {
  if (!isMarkupExtensionAction(action)) {
    return null;
  }

  const id = action.replace(/^markup-extension-/, '');

  if (id === '') {
    return null;
  }

  return id as TpMarkupExtensionId;
}

/** Renders the shared markup extension menu. */
export function renderMarkupExtensionMenu(
  items: readonly TpMarkupExtensionMenuItem[],
): string {
  return `
    <li data-tp-markup-extension-menu>
      Extensions
      <ul>
        ${
          items.length === 0
            ? `
              <li aria-disabled="true">
                None
              </li>
            `
            : items.map((item) => renderMarkupExtensionMenuItem(item)).join('')
        }
      </ul>
    </li>
  `;
}

/** Renders a single markup extension menu item. */
export function renderMarkupExtensionMenuItem(
  item: TpMarkupExtensionMenuItem,
): string {
  return `
    <li
      role="menuitemcheckbox"
      aria-checked="${item.checked ? 'true' : 'false'}"
      aria-disabled="${item.disabled ? 'true' : 'false'}"
      data-tp-markup-extension-id="${item.id}"
      data-tp-playground-action="${createMarkupExtensionAction(item.id)}"
    >
      <span data-tp-markup-extension-check>${item.checked ? '✓' : ''}</span>
      <span>${item.label}</span>
    </li>
  `;
}

/** Synchronizes checked states in the markup extension menu. */
export function syncMarkupExtensionMenuChecks(
  root: ParentNode,
  activeIds: ReadonlySet<TpMarkupExtensionId>,
): void {
  const items = root.querySelectorAll<HTMLElement>(
    TP_MARKUP_EXTENSION_ITEM_SELECTOR,
  );

  for (const item of items) {
    const id = item.getAttribute('data-tp-markup-extension-id');

    if (id === null) {
      continue;
    }

    const checked = activeIds.has(id as TpMarkupExtensionId);

    item.setAttribute('aria-checked', checked ? 'true' : 'false');

    const check = item.querySelector('[data-tp-markup-extension-check]');

    if (check instanceof HTMLElement) {
      check.textContent = checked ? '✓' : '';
    }
  }
}