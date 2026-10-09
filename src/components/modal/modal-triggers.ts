/**
 * @module components/modal/modal-triggers
 * @summary External triggers for the `<tp-modal>` component.
 */

import { TpModal } from './modal.js';

type TpModalAction = 'show' | 'hide' | 'toggle';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

function isTpModalAction(value: string): value is TpModalAction {
  return value === 'show' || value === 'hide' || value === 'toggle';
}

function getTargetModal(trigger: HTMLElement): TpModal | null {
  const selector = trigger.getAttribute('data-tp-modal-target');
  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpModal) {
    return scopedTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpModal ? globalTarget : null;
}

function handleAction(trigger: HTMLElement): void {
  const action = trigger.getAttribute('data-tp-modal-action');
  if (action === null || !isTpModalAction(action)) {
    return;
  }

  const modal = getTargetModal(trigger);
  if (modal === null) {
    return;
  }

  if (action === 'show') {
    modal.show();
    return;
  }

  if (action === 'hide') {
    modal.hide();
    return;
  }

  modal.open = !modal.open;
}

/**
 * Initialise les triggers externes de tp-modal sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-modal-action="show|hide|toggle"`
 * - `data-tp-modal-target="<sélecteur CSS>"`
 */
export function setupTpModalTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-modal-action]');
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
export function teardownTpModalTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}