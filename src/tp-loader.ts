/**
 * @module tp-loader
 * @summary Charge automatiquement les composants `tp-*` réellement présents dans le DOM.
 */

import { ensureTpBaseStyles } from './components/base/base.js';

const TP_TAG_PREFIX = 'tp-';
const loadedModules = new Set<string>();
const failedModules = new Set<string>();
const loadingModules = new Map<string, Promise<void>>();
let loaderObserver: MutationObserver | null = null;

function getComponentBaseName(tagName: string): string | null {
  const normalizedTagName = tagName.toLowerCase();

  if (!normalizedTagName.startsWith(TP_TAG_PREFIX)) {
    return null;
  }

  return normalizedTagName.slice(TP_TAG_PREFIX.length);
}

function getModuleUrl(baseName: string): string {
  const loaderUrl = new URL(import.meta.url);
  const isSourceLoader = loaderUrl.pathname.endsWith('.ts');
  const extension = isSourceLoader ? 'ts' : 'js';
  const componentRoot = isSourceLoader
    ? './components'
    : loaderUrl.pathname.includes('/chunks/')
      ? '../components'
      : './components';
  const modulePath = [componentRoot, baseName, `${baseName}.${extension}`].join('/');

  return new URL(modulePath, import.meta.url).href;
}

function isInternalTpTag(baseName: string): boolean {
  return baseName === 'loader' || baseName.endsWith('-backdrop');
}

async function loadComponent(tagName: string): Promise<void> {
  const normalizedTagName = tagName.toLowerCase();
  const baseName = getComponentBaseName(normalizedTagName);

  if (baseName === null || isInternalTpTag(baseName)) {
    return;
  }

  if (customElements.get(normalizedTagName) !== undefined) {
    return;
  }

  const moduleUrl = getModuleUrl(baseName);

  if (loadedModules.has(moduleUrl) || failedModules.has(moduleUrl)) {
    return;
  }

  const pendingLoad = loadingModules.get(moduleUrl);

  if (pendingLoad !== undefined) {
    await pendingLoad;
    return;
  }

  const loadPromise = import(/* @vite-ignore */ moduleUrl)
    .then(() => {
      loadedModules.add(moduleUrl);
      console.info(`[tp-loader] loaded <${normalizedTagName}> from ${moduleUrl}`);
    })
    .catch((error: unknown) => {
      failedModules.add(moduleUrl);
      console.warn(`[tp-loader] skipped <${normalizedTagName}> from ${moduleUrl}`, error);
    })
    .finally(() => {
      loadingModules.delete(moduleUrl);
    });

  loadingModules.set(moduleUrl, loadPromise);
  await loadPromise;
}

function collectTpTagNames(root: ParentNode): Set<string> {
  const tagNames = new Set<string>();

  if (root instanceof Element && root.localName.startsWith(TP_TAG_PREFIX)) {
    tagNames.add(root.localName);
  }

  for (const element of root.querySelectorAll('*')) {
    if (element.localName.startsWith(TP_TAG_PREFIX)) {
      tagNames.add(element.localName);
    }
  }

  return tagNames;
}

export async function loadUsedTpComponents(root: ParentNode = document): Promise<void> {
  const tagNames = collectTpTagNames(root);
  await Promise.all([...tagNames].map((tagName) => loadComponent(tagName)));
}

function getObserverTarget(root: ParentNode): Node {
  if (root instanceof Document) {
    return root.documentElement ?? root;
  }

  return root as Node;
}

export function observeUsedTpComponents(root: ParentNode = document): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          void loadUsedTpComponents(node);
        }
      }
    }
  });

  observer.observe(getObserverTarget(root), {
    childList: true,
    subtree: true,
  });

  return observer;
}

export async function startTpLoader(): Promise<void> {
  ensureTpBaseStyles();
  if (loaderObserver === null) {
    loaderObserver = observeUsedTpComponents(document);
  }
  await loadUsedTpComponents(document);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      void startTpLoader();
    });
  } else {
    void startTpLoader();
  }
}
