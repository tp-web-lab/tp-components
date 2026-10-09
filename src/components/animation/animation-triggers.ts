import { TpAnimation } from './animation.js';

type TpAnimationAction = 'play-in' | 'play-out' | 'pause' | 'cancel' | 'restart';

const initializedRoots = new WeakMap<ParentNode, EventListener>();

function isTpAnimationAction(value: string): value is TpAnimationAction {
  return (
    value === 'play-in' ||
    value === 'play-out' ||
    value === 'pause' ||
    value === 'cancel' ||
    value === 'restart'
  );
}

function getTargetAnimation(
  trigger: HTMLElement,
  root: ParentNode = document,
): TpAnimation | null {
  const selector = trigger.getAttribute('data-tp-animation-target');

  if (selector === null || selector.trim() === '') {
    return null;
  }

  const rootNode = trigger.getRootNode();
  const scopedTarget =
    rootNode instanceof ShadowRoot || rootNode instanceof Document
      ? rootNode.querySelector(selector)
      : null;

  if (scopedTarget instanceof TpAnimation) {
    return scopedTarget;
  }

  const rootTarget =
    root instanceof Document || root instanceof ShadowRoot
      ? root.querySelector(selector)
      : null;

  if (rootTarget instanceof TpAnimation) {
    return rootTarget;
  }

  const globalTarget = document.querySelector(selector);
  return globalTarget instanceof TpAnimation ? globalTarget : null;
}

function handleAction(trigger: HTMLElement, root: ParentNode = document): void {
  const action = trigger.getAttribute('data-tp-animation-action');

  if (action === null || !isTpAnimationAction(action)) {
    return;
  }

  const animation = getTargetAnimation(trigger, root);
  if (animation === null) {
    return;
  }

  if (action === 'play-in') {
    void animation.playIn();
    return;
  }

  if (action === 'play-out') {
    void animation.playOut();
    return;
  }

  if (action === 'pause') {
    animation.pause();
    return;
  }

  if (action === 'cancel') {
    animation.cancel();
    return;
  }

  void animation.restart();
}

/**
 * Initialise les triggers externes de tp-animation.
 *
 * Attributs attendus :
 * - `data-tp-animation-action="play-in|play-out|pause|cancel|restart"`
 * - `data-tp-animation-target="<sélecteur CSS>"`
 */
export function setupTpAnimationTriggers(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-animation-action]');
    if (trigger === null) {
      return;
    }

    handleAction(trigger, root);
  };

  root.addEventListener('click', listener);
  initializedRoots.set(root, listener);
}

export function teardownTpAnimationTriggers(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}