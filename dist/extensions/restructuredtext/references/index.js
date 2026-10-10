module.exports = async function referencesExtension(root) {
  registerStyles();
  setupReferencePopovers(root);
  buildIndexes(root);
};

function setupReferencePopovers(root) {
  const definitions = new Map();

  for (const dd of root.querySelectorAll('[data-bibitem-def]')) {
    definitions.set(dd.getAttribute('data-bibitem-def'), dd.innerHTML ?? '');
  }

  for (const dd of root.querySelectorAll('[data-glossary-def]')) {
    definitions.set(dd.getAttribute('data-glossary-def'), dd.innerHTML ?? '');
  }

  let popover = document.getElementById('tp-rst-reference-popover');

  if (!(popover instanceof HTMLElement)) {
    popover = document.createElement('div');
    popover.id = 'tp-rst-reference-popover';
    popover.setAttribute('popover', 'manual');
    popover.className = 'tp-rst-reference-popover';
    document.body.append(popover);
  }

  for (const link of root.querySelectorAll('[data-cite-ref], [data-glossary-link]')) {
    if (!(link instanceof HTMLElement)) {
      continue;
    }

    const ref =
      link.getAttribute('data-cite-ref') ??
      link.getAttribute('data-glossary-link');

    const definition = ref === null ? undefined : definitions.get(ref);

    if (definition === undefined || definition.trim() === '') {
      continue;
    }

    link.addEventListener('mouseenter', () => {
      showReferencePopover(popover, link, definition);
    });

    link.addEventListener('focus', () => {
      showReferencePopover(popover, link, definition);
    });

    link.addEventListener('mouseleave', () => {
      hideReferencePopover(popover);
    });

    link.addEventListener('blur', () => {
      hideReferencePopover(popover);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideReferencePopover(popover);
    }
  });
}

function showReferencePopover(popover, anchor, content) {
  popover.innerHTML = content.trim();

  const rect = anchor.getBoundingClientRect();

  popover.style.position = 'fixed';
  popover.style.inset = 'auto';
  popover.style.left = `${String(Math.round(rect.left))}px`;
  popover.style.top = `${String(Math.round(rect.bottom + 8))}px`;

  if (typeof popover.showPopover === 'function') {
    popover.showPopover();
  } else {
    popover.hidden = false;
  }
}

function hideReferencePopover(popover) {
  if (typeof popover.hidePopover === 'function') {
    popover.hidePopover();
  } else {
    popover.hidden = true;
  }
}

function buildIndexes(root) {
  for (const placeholder of root.querySelectorAll('[data-rst-index-placeholder]')) {
    const tree = collectIndexTree(root);

    const dl = renderIndexLevel(tree);

    dl.classList.add('tp-rst-index');

    placeholder.replaceWith(dl);
  }
}

function collectIndexTree(root) {
  const tree = new Map();

  const markers = Array.from(root.querySelectorAll('[data-index-entry]'));

  for (const [position, marker] of markers.entries()) {
    if (!(marker instanceof HTMLElement)) {
      continue;
    }

    if (marker.id === '') {
      marker.id = `index-entry-${String(position + 1)}`;
    }

    const rawEntry = marker.getAttribute('data-index-entry') ?? '';
    const parts = rawEntry
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');

    if (parts.length === 0) {
      continue;
    }

    addIndexEntry(tree, parts, marker.id);
  }

  return tree;
}

function addIndexEntry(tree, parts, targetId) {
  const [head, ...tail] = parts;
  const key = head.toLowerCase();

  let node = tree.get(key);

  if (node === undefined) {
    node = {
      label: head,
      targets: [],
      children: new Map(),
    };

    tree.set(key, node);
  }

  if (tail.length === 0) {
    node.targets.push(targetId);
    return;
  }

  addIndexEntry(node.children, tail, targetId);
}

function renderIndexLevel(tree) {
  const dl = document.createElement('dl');

  for (const node of sortIndexNodes(tree)) {
    const dt = document.createElement('dt');
    dt.textContent = node.label;

    if (node.targets.length > 0) {
      dt.append(' ');
      dt.append(renderIndexLinks(node.targets));
    }

    dl.append(dt);

    if (node.children.size > 0) {
      const dd = document.createElement('dd');
      dd.append(renderIndexLevel(node.children));
      dl.append(dd);
    }
  }

  return dl;
}

function renderIndexLinks(targets) {
  const fragment = document.createDocumentFragment();

  for (const [index, targetId] of targets.entries()) {
    if (index > 0) {
      fragment.append(', ');
    }

    const link = document.createElement('a');
    link.href = `#${targetId}`;
    link.textContent = String(index + 1);

    fragment.append(link);
  }

  return fragment;
}

function sortIndexNodes(tree) {
  return [...tree.values()].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

function registerStyles() {
  if (document.getElementById('tp-rst-references-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'tp-rst-references-styles';
  style.textContent = `
.tp-rst-bibliography,
.tp-rst-glossary,
.tp-rst-index {
  margin-block: 1rem;
}

.tp-rst-bibliography,
.tp-rst-glossary {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 1rem;
  row-gap: 0.35rem;
  align-items: start;
}

.tp-rst-bibliography dt,
.tp-rst-glossary dt {
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
}

.tp-rst-bibliography dd,
.tp-rst-glossary dd {
  margin: 0;
  min-inline-size: 0;
}

.tp-rst-bibliography dd > :first-child,
.tp-rst-glossary dd > :first-child {
  margin-top: 0;
}

.tp-rst-bibliography dd > :last-child,
.tp-rst-glossary dd > :last-child {
  margin-bottom: 0;
}

.tp-rst-glossary-link,
[data-cite-ref] {
  text-decoration: underline dotted;
  text-underline-offset: 0.2em;
}

.tp-rst-index,
.tp-rst-index dl {
  margin: 0;
  padding: 0;
}

.tp-rst-index dt {
  font-weight: 400;
  margin: 0;
  padding: 0;
  line-height: 1.35;
}

.tp-rst-index dd {
  margin: 0 0 0 1.5rem;
  padding: 0;
}

.tp-rst-index a {
  text-decoration: none;
}

.tp-rst-index a:hover {
  text-decoration: underline;
}

.tp-rst-reference-popover {
  max-inline-size: 24rem;
  padding: 0.75rem 1rem;
  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
  border-radius: 0.75rem;
  background: Canvas;
  color: CanvasText;
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 18%);
  font: 0.9rem/1.4 system-ui, sans-serif;
  z-index: 9999;
}

.tp-rst-reference-popover:popover-open {
  display: block;
}
`;

  document.head.append(style);
}