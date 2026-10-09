/**
 * @module components/drawer/drawer-triggers
 * @summary External triggers for the `<tp-drawer>` component.
 */

import { TpDrawer } from './drawer.js';

type TpDrawerAction = 'show' | 'hide' | 'toggle';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

function isTpDrawerAction(value: string): value is TpDrawerAction {
  return value === 'show' || value === 'hide' || value === 'toggle';
}

function getTargetDrawer(trigger: HTMLElement): TpDrawer | null {
  const selector = trigger.getAttribute('data-tp-drawer-target');
  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpDrawer) {
    return scopedTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpDrawer ? globalTarget : null;
}

function handleAction(trigger: HTMLElement): void {
  const action = trigger.getAttribute('data-tp-drawer-action');
  if (action === null || !isTpDrawerAction(action)) {
    return;
  }

  const drawer = getTargetDrawer(trigger);
  if (drawer === null) {
    return;
  }

  if (action === 'show') {
    drawer.show();
    return;
  }

  if (action === 'hide') {
    drawer.hide();
    return;
  }

  drawer.open = !drawer.open;
}

/**
 * Initialise les triggers externes de tp-drawer sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-drawer-action="show|hide|toggle"`
 * - `data-tp-drawer-target="<sélecteur CSS>"`
 */
export function setupTpDrawerTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-drawer-action]');
    if (trigger === null) {
      return;
    }

    handleAction(trigger);
  };

  root.addEventListener('click', listener);
  initializedRoots.set(root, listener);
}

/**
 * Nettoie les triggers externes pour un root donné.
 */
export function teardownTpDrawerTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}