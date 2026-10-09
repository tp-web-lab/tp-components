/**
 * @module components/tooltip/tooltip-triggers
 * @summary External triggers for the `<tp-tooltip>` component.
 */
import { TpTooltip } from './tooltip.js';

type TpTooltipAction = 'show' | 'hide' | 'toggle';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

/**
 * Vérifie si une valeur correspond à une action valide.
 */
function isTpTooltipAction(value: string): value is TpTooltipAction {
  return value === 'show' || value === 'hide' || value === 'toggle';
}

/**
 * Retourne le tooltip cible à partir d'un sélecteur CSS.
 */
function getTargetTooltip(
  trigger: HTMLElement,
  root: ParentNode = document,
): TpTooltip | null {
  const selector = trigger.getAttribute('data-tp-tooltip-target');

  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpTooltip) {
    return scopedTarget;
  }

  const rootTarget =
    root instanceof Document || root instanceof ShadowRoot
      ? root.querySelector(selector)
      : null;

  if (rootTarget instanceof TpTooltip) {
    return rootTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpTooltip ? globalTarget : null;
}

/**
 * Exécute l'action demandée sur le tooltip cible.
 */
function handleAction(
  trigger: HTMLElement,
  root: ParentNode = document,
): void {
  const action = trigger.getAttribute('data-tp-tooltip-action');

  if (action === null || !isTpTooltipAction(action)) {
    return;
  }

  const tooltip = getTargetTooltip(trigger, root);
  if (tooltip === null) {
    return;
  }

  if (action === 'show') {
    tooltip.show();
    return;
  }

  if (action === 'hide') {
    tooltip.hide();
    return;
  }

  if (tooltip.open) {
    tooltip.hide();
    return;
  }

  tooltip.show();
}

/**
 * Initialise les triggers externes de tp-tooltip sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-tooltip-action="show|hide|toggle"`
 * - `data-tp-tooltip-target="<sélecteur CSS>"`
 */
export function setupTpTooltipTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-tooltip-action]');
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
export function teardownTpTooltipTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}