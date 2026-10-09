import { TpIframe } from './iframe.js';

type TpIframeAction = 'zoom-in' | 'zoom-out' | 'zoom-reset';

/**
 * Map des roots déjà initialisés.
 * Permet d’éviter les doubles listeners.
 */
const initializedRoots = new WeakMap<ParentNode, EventListener>();

function isTpIframeAction(value: string): value is TpIframeAction {
  return value === 'zoom-in' || value === 'zoom-out' || value === 'zoom-reset';
}

function getTargetIframe(trigger: HTMLElement, root: ParentNode): TpIframe | null {
  const selector = trigger.getAttribute('data-tp-iframe-target');
  if (selector === null || selector.trim() === '') {
    return null;
  }

  const scopedTarget =
    'querySelector' in root ? root.querySelector(selector) : null;
  const target = scopedTarget ?? document.querySelector(selector);
  return target instanceof TpIframe ? target : null;
}

function handleAction(trigger: HTMLElement, root: ParentNode): boolean {
  const action = trigger.getAttribute('data-tp-iframe-action');
  if (action === null || !isTpIframeAction(action)) {
    return false;
  }

  const iframe = getTargetIframe(trigger, root);
  if (iframe === null) {
    return false;
  }

  if (action === 'zoom-in') {
    iframe.zoomIn();
    return true;
  }

  if (action === 'zoom-out') {
    iframe.zoomOut();
    return true;
  }

  const zoomValue = Number(trigger.getAttribute('data-tp-iframe-zoom') ?? '1');
  iframe.resetZoom(Number.isFinite(zoomValue) ? zoomValue : 1);
  return true;
}

/**
 * Initialise les contrôles tp-iframe sur un root donné.
 *
 * - idempotent : plusieurs appels sur le même root n’ajoutent qu’un seul listener
 * - supporte document, shadowRoot, ou n’importe quel conteneur
 */
export function setupTpIframeControls(root: ParentNode = document): void {
  if (initializedRoots.has(root)) {
    return;
  }

  const listener: EventListener = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>('[data-tp-iframe-action]');
    if (trigger === null) {
      return;
    }

    const handled = handleAction(trigger, root);

    if (handled && root !== document) {
      event.stopPropagation();
    }
  };

  root.addEventListener('click', listener);
  initializedRoots.set(root, listener);
}

/**
 * Nettoie les contrôles pour un root donné.
 *
 * Utile pour tests ou teardown d’app.
 */
export function teardownTpIframeControls(root: ParentNode = document): void {
  const listener = initializedRoots.get(root);

  if (listener === undefined) {
    return;
  }

  root.removeEventListener('click', listener);
  initializedRoots.delete(root);
}