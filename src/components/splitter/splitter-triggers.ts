import { TpSplitter } from './splitter.js';

type TpSplitterAction = 'reset';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

function isTpSplitterAction(value: string): value is TpSplitterAction {
  return value === 'reset';
}

function getTargetSplitter(trigger: HTMLElement): TpSplitter | null {
  const selector = trigger.getAttribute('data-tp-splitter-target');
  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpSplitter) {
    return scopedTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpSplitter ? globalTarget : null;
}

function handleAction(trigger: HTMLElement): void {
  const action = trigger.getAttribute('data-tp-splitter-action');
  if (action === null || !isTpSplitterAction(action)) {
    return;
  }

  const splitter = getTargetSplitter(trigger);
  if (splitter === null) {
    return;
  }

  splitter.reset();
}

/**
 * Initialise les triggers externes de tp-splitter sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-splitter-action="reset"`
 * - `data-tp-splitter-target="<sélecteur CSS>"`
 */
export function setupTpSplitterTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-splitter-action]');
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
export function teardownTpSplitterTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}