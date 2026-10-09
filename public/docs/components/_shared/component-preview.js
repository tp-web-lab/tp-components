/** Loads the same development or production component entry point as the host documentation. */
let host = window.parent;
let loaderUrl;
while (host !== window) {
  try {
    loaderUrl = Array.from(host.document.scripts).find(script => /\/tp-loader\.(?:ts|js)(?:[?#]|$)/.test(script.src))?.src;
    if (loaderUrl || host === host.parent) break;
    host = host.parent;
  } catch {
    break;
  }
}
await import(loaderUrl ?? '/tp-loader.js');
