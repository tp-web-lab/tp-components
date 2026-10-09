export default function markdownDesignExtension(md, options = {}) {
  registerGrid(md);
  registerCard(md);
  registerStyles();
}

function registerGrid(md) {
  md.block.ruler.before(
    'fence',
    'design_grid',
    (state, startLine, endLine, silent) => {
      const line = getLine(state, startLine).trim();

      if (!line.startsWith(':::grid')) {
        return false;
      }

      if (silent) {
        return true;
      }

      const columns = readOption(line, 'columns') ?? '2';
      const content = collectContainerContent(state, startLine, endLine);

      const token = state.push('design_grid', '', 0);
      token.content = content.content;
      token.meta = { columns };

      state.line = content.nextLine;
      return true;
    },
  );

  md.renderer.rules.design_grid = (tokens, index) => {
    const token = tokens[index];
    const columns = String(token.meta?.columns ?? '2');

    return `
<div class="tp-md-grid tp-md-grid-${escapeAttribute(columns)}">
${md.render(token.content)}
</div>
`;
  };
}

function registerCard(md) {
  md.block.ruler.before(
    'fence',
    'design_card',
    (state, startLine, endLine, silent) => {
      const line = getLine(state, startLine).trim();

      if (!line.startsWith(':::card')) {
        return false;
      }

      if (silent) {
        return true;
      }

      const title = readOption(line, 'title') ?? '';
      const content = collectContainerContent(state, startLine, endLine);

      const token = state.push('design_card', '', 0);
      token.content = content.content;
      token.meta = { title };

      state.line = content.nextLine;
      return true;
    },
  );

  md.renderer.rules.design_card = (tokens, index) => {
    const token = tokens[index];
    const title = String(token.meta?.title ?? '');

    return `
<section class="tp-md-card">
  ${
    title !== ''
      ? `<p class="tp-md-card-title">${escapeHtml(title)}</p>`
      : ''
  }
  ${md.render(token.content)}
</section>
`;
  };
}

function collectContainerContent(state, startLine, endLine) {
  const lines = [];

  let nextLine = startLine + 1;
  let depth = 1;

  while (nextLine < endLine) {
    const line = getLine(state, nextLine).trim();

    if (line.startsWith(':::') && line !== ':::') {
      depth += 1;
    } else if (line === ':::') {
      depth -= 1;

      if (depth === 0) {
        return {
          content: lines.join('\n'),
          nextLine: nextLine + 1,
        };
      }
    }

    lines.push(getLine(state, nextLine));
    nextLine += 1;
  }

  return {
    content: lines.join('\n'),
    nextLine,
  };
}

function getLine(state, line) {
  const start = state.bMarks[line] + state.tShift[line];
  const end = state.eMarks[line];

  return state.src.slice(start, end);
}

function readOption(line, name) {
  const pattern = new RegExp(`${name}=("[^"]+"|'[^']+'|\\S+)`);
  const match = line.match(pattern);

  if (match === null) {
    return null;
  }

  return match[1].replace(/^["']|["']$/g, '');
}

function registerStyles() {
  if (document.getElementById('tp-md-design-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'tp-md-design-styles';
  style.textContent = `
.tp-md-grid {
  display: grid;
  gap: 1rem;
  margin-block: 1rem;
}

.tp-md-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.tp-md-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.tp-md-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.tp-md-card {
  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
  border-radius: 0.75rem;
  padding: 1rem;
  background: Canvas;
}

.tp-md-card > :first-child {
  margin-top: 0;
}

.tp-md-card > :last-child {
  margin-bottom: 0;
}

.tp-md-card-title {
  font-weight: 700;
  margin-block: 0 0.5rem;
}

@media (max-width: 700px) {
  .tp-md-grid-2,
  .tp-md-grid-3,
  .tp-md-grid-4 {
    grid-template-columns: 1fr;
  }
}
`;

  document.head.append(style);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
  return String(value).replaceAll(/[^a-zA-Z0-9_-]/g, '');
}
