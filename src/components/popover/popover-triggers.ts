/**
 * @module components/popover/popover-triggers
 * @summary External triggers for the `<tp-popover>` component.
 */
import { TpPopover } from './popover.js';

type TpPopoverAction = 'show' | 'hide' | 'toggle';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

/**
 * Vérifie si une valeur correspond à une action valide.
 */
function isTpPopoverAction(value: string): value is TpPopoverAction {
  return value === 'show' || value === 'hide' || value === 'toggle';
}

/**
 * Retourne le popover cible à partir d'un sélecteur CSS.
 */
function getTargetPopover(
  trigger: HTMLElement,
  root: ParentNode = document,
): TpPopover | null {
  const selector = trigger.getAttribute('data-tp-popover-target');

  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpPopover) {
    return scopedTarget;
  }

  const rootTarget =
    root instanceof Document || root instanceof ShadowRoot
      ? root.querySelector(selector)
      : null;

  if (rootTarget instanceof TpPopover) {
    return rootTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpPopover ? globalTarget : null;
}

/**
 * Retourne tous les popovers du scope courant.
 */
function getScopedPopovers(root: ParentNode = document): TpPopover[] {
  const elements =
    root instanceof Document || root instanceof ShadowRoot
      ? Array.from(root.querySelectorAll('tp-popover'))
      : Array.from(document.querySelectorAll('tp-popover'));

  return elements.filter(
    (element): element is TpPopover => element instanceof TpPopover,
  );
}

/**
 * Ferme tous les autres popovers ouverts du scope courant.
 */
function closeOtherPopovers(
  current: TpPopover,
  root: ParentNode = document,
): void {
  const popovers = getScopedPopovers(root);

  for (const popover of popovers) {
    if (popover !== current && popover.open) {
      popover.hide();
    }
  }
}

/**
 * Exécute l'action demandée sur le popover cible.
 */
function handleAction(
  trigger: HTMLElement,
  root: ParentNode = document,
): void {
  const action = trigger.getAttribute('data-tp-popover-action');

  if (action === null || !isTpPopoverAction(action)) {
    return;
  }

  const popover = getTargetPopover(trigger, root);
  if (popover === null) {
    return;
  }

  const exclusive = trigger.hasAttribute('data-tp-popover-exclusive');

  if (action === 'show') {
    if (exclusive) {
      closeOtherPopovers(popover, root);
    }

    popover.show();
    return;
  }

  if (action === 'hide') {
    popover.hide();
    return;
  }

  if (!popover.open && exclusive) {
    closeOtherPopovers(popover, root);
  }

  popover.toggle();
}

/**
 * Initialise les triggers externes de tp-popover sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-popover-action="show|hide|toggle"`
 * - `data-tp-popover-target="<sélecteur CSS>"`
 *
 * Attribut optionnel :
 * - `data-tp-popover-exclusive`
 */
export function setupTpPopoverTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-popover-action]');
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
export function teardownTpPopoverTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}