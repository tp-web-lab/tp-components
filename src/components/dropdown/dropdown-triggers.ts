/**
 * @module components/dropdown/dropdown-triggers
 * @summary External triggers for the `<tp-dropdown>` component.
 */

import { TpDropdown } from './dropdown.js';

type TpDropdownAction = 'show' | 'hide' | 'toggle';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

/**
 * Vérifie si une valeur correspond à une action valide.
 */
function isTpDropdownAction(value: string): value is TpDropdownAction {
  return value === 'show' || value === 'hide' || value === 'toggle';
}

/**
 * Retourne le dropdown cible à partir d'un sélecteur CSS.
 */
function getTargetDropdown(
  trigger: HTMLElement,
  root: ParentNode = document,
): TpDropdown | null {
  const selector = trigger.getAttribute('data-tp-dropdown-target');

  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpDropdown) {
    return scopedTarget;
  }

  const rootTarget =
    root instanceof Document || root instanceof ShadowRoot
      ? root.querySelector(selector)
      : null;

  if (rootTarget instanceof TpDropdown) {
    return rootTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpDropdown ? globalTarget : null;
}

/**
 * Retourne tous les dropdowns du scope courant.
 */
function getScopedDropdowns(root: ParentNode = document): TpDropdown[] {
  const elements =
    root instanceof Document || root instanceof ShadowRoot
      ? Array.from(root.querySelectorAll('tp-dropdown'))
      : Array.from(document.querySelectorAll('tp-dropdown'));

  return elements.filter(
    (element): element is TpDropdown => element instanceof TpDropdown,
  );
}

/**
 * Ferme tous les autres dropdowns ouverts du scope courant.
 */
function closeOtherDropdowns(
  current: TpDropdown,
  root: ParentNode = document,
): void {
  const dropdowns = getScopedDropdowns(root);

  for (const dropdown of dropdowns) {
    if (dropdown !== current && dropdown.open) {
      dropdown.hide();
    }
  }
}

/**
 * Exécute l'action demandée sur le dropdown cible.
 */
function handleAction(
  trigger: HTMLElement,
  root: ParentNode = document,
): void {
  const action = trigger.getAttribute('data-tp-dropdown-action');

  if (action === null || !isTpDropdownAction(action)) {
    return;
  }

  const dropdown = getTargetDropdown(trigger, root);
  if (dropdown === null) {
    return;
  }

  const exclusive = trigger.hasAttribute('data-tp-dropdown-exclusive');

  if (action === 'show') {
    if (exclusive) {
      closeOtherDropdowns(dropdown, root);
    }

    dropdown.show();
    return;
  }

  if (action === 'hide') {
    dropdown.hide();
    return;
  }

  if (!dropdown.open && exclusive) {
    closeOtherDropdowns(dropdown, root);
  }

  dropdown.toggle();
}

/**
 * Initialise les triggers externes de tp-dropdown sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-dropdown-action="show|hide|toggle"`
 * - `data-tp-dropdown-target="<sélecteur CSS>"`
 *
 * Attribut optionnel :
 * - `data-tp-dropdown-exclusive`
 */
export function setupTpDropdownTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-dropdown-action]');
    if (trigger === null) {
      return;
    }

    handleAction(trigger, root);
  };

  root.addEventListener('click', listener);
  initializedRoots.set(root, listener);
}

/**
 * Nettoie les triggers externes pour un root donné.
 */
export function teardownTpDropdownTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}