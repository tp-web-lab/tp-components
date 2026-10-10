export default function markdownItTableOfContents(md, options = {}) {
  md.core.ruler.push('tp_collect_toc', (state) => {
    const maxLevel = Number(state.env?.attributes?.toc?.maxLevel ?? 6);
    const headings = [];

    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index];

      if (token.type !== 'heading_open') {
        continue;
      }

      const level = Number(token.tag.slice(1));

      if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        continue;
      }
      const id = token.attrGet('id');
      const next = state.tokens[index + 1];

      if (id !== null && next?.type === 'inline') {
        headings.push({
          level,
          id,
          title: next.content,
        });
      }
    }

    state.env.__tp_toc = headings;
  });

  md.block.ruler.before(
    'paragraph',
    'table_of_contents',
    (state, startLine, _endLine, silent) => {
      const pos = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      const line = state.src.slice(pos, max).trim();

      const match =
        line.match(/^\[\[toc(?::(.*))?\]\]$/i) ??
        line.match(/^\[toc(?::(.*))?\]$/i) ??
        line.match(/^\$\{toc(?::(.*))?\}$/i);

      if (match === null) {
        return false;
      }

      if (silent) {
        return true;
      }

      const title =
        typeof match[1] === 'string' && match[1].trim() !== ''
          ? match[1].trim()
          : 'Contents';

      const token = state.push('toc_body', '', 0);
      token.block = true;
      token.meta = { title };

      state.line = startLine + 1;
      return true;
    },
  );

  md.renderer.rules.toc_body = (tokens, index, _options, env) => {
    const headings = env.__tp_toc ?? [];
    const title = String(tokens[index].meta?.title ?? 'Contents');
    const tree = buildTocTree(headings);

    return `
      <details data-markdown-toc>
        <summary>${escapeHtml(title)}</summary>
        ${renderTocItems(tree)}
      </details>
    `;
  };
};

function buildTocTree(headings) {
  const root = [];
  const stack = [{ level: 0, children: root }];

  for (const heading of headings) {
    const item = {
      ...heading,
      children: [],
    };

    while (stack.length > 1 && heading.level <= stack[stack.length - 1].level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(item);
    stack.push(item);
  }

  return root;
}

function renderTocItems(items) {
  if (items.length === 0) {
    return '<ul></ul>';
  }

  return `
<ul>
  ${items
    .map(
      (item) => `
<li data-level="${item.level}">
  <a href="#${escapeAttribute(item.id)}">${escapeHtml(item.title)}</a>
  ${renderTocItems(item.children)}
</li>`,
    )
    .join('')}
</ul>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
