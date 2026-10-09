import type { TpCopyCode } from '../components/copy-code/copy-code.js';

/** Documents already watched for static and dynamically rendered code blocks. */
const observedDocuments = new WeakSet<Document>();

/** Adds a copy control without including its label in the copied source. */
async function enhanceCodeBlock(pre: HTMLPreElement): Promise<void> {
  if (!pre.isConnected || !pre.querySelector(':scope > code')) return;
  if (pre.closest('.cm-editor, [contenteditable="true"]')) return;
  // Lazy loading avoids a dependency cycle through TpCopyCode -> TpBase.
  await import('../components/copy-code/copy-code.js');
  if (!pre.isConnected) return;
  const code = pre.querySelector<HTMLElement>(':scope > code');
  if (!code) return;
  for (const manual of pre.ownerDocument.querySelectorAll<TpCopyCode>('tp-copy-code:not([data-tp-code-block-copy])')) {
    const targetId = manual.getAttribute('for');
    if (manual.forElement === pre || manual.forElement === code) return;
    if (targetId && (targetId === pre.id || targetId === code.id)) return;
  }
  const existing = pre.querySelector<TpCopyCode>(':scope > tp-copy-code');
  if (existing) {
    if (existing.hasAttribute('data-tp-code-block-copy')) existing.forElement = code;
    return;
  }
  const button = pre.ownerDocument.createElement('tp-copy-code');
  button.setAttribute('data-tp-code-block-copy', '');
  button.forElement = code;
  pre.classList.add('tp-code-block-copy');
  pre.append(button);
  button.setAttribute('aria-label', 'Copy code');
}

/** Enhances code blocks in an inserted subtree, including parser-late code children. */
function scanCodeBlocks(node: Node): void {
  if (!(node instanceof Element || node instanceof Document)) return;
  const parentPre = node instanceof Element ? node.closest('pre') : null;
  if (parentPre) void enhanceCodeBlock(parentPre);
  for (const pre of node.querySelectorAll('pre')) void enhanceCodeBlock(pre);
}

/** Installs one observer per document; subsequent component connections reuse it. */
export function ensureCodeBlockCopyButtons(targetDocument: Document): void {
  if (observedDocuments.has(targetDocument)) return;
  observedDocuments.add(targetDocument);
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) scanCodeBlocks(node);
    }
  });
  observer.observe(targetDocument, { childList: true, subtree: true });
  scanCodeBlocks(targetDocument);
}
