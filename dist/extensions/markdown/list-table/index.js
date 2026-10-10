export default function markdownListTableExtension(md, options = {}) {
  registerListTable(md);
}

function registerListTable(md) {
  md.block.ruler.before(
    'fence',
    'list_table',
    (state, startLine, endLine, silent) => {
      const firstLine = getLine(state, startLine).trim();

      if (!firstLine.startsWith(':::list-table')) {
        return false;
      }

      if (silent) {
        return true;
      }

      const headerRows = Number(
        readOption(firstLine, 'header-rows') ?? '0',
      );

      const content = collectContainerContent(
        state,
        startLine,
        endLine,
      );

      const token = state.push('list_table', '', 0);

      token.content = content.content;
      token.meta = {
        headerRows,
      };

      state.line = content.nextLine;

      return true;
    },
  );

  md.renderer.rules.list_table = (tokens, index) => {
    const token = tokens[index];

    const rows = parseRows(token.content);

    if (rows.length === 0) {
      return '';
    }

    const headerRows = Number(
      token.meta?.headerRows ?? 0,
    );

    return renderTable(md, rows, headerRows);
  };
}

function parseRows(source) {
  const lines = source.split('\n');

  const rows = [];
  let currentRow = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === '') {
      continue;
    }

    if (line.startsWith('- ')) {
      if (currentRow !== null) {
        rows.push(currentRow);
      }

      currentRow = [];

      const value = line.slice(2).trim();

      if (value !== '') {
        currentRow.push(value);
      }

      continue;
    }

    if (line.startsWith('  - ')) {
      if (currentRow === null) {
        currentRow = [];
      }

      currentRow.push(line.slice(4).trim());
    }
  }

  if (currentRow !== null) {
    rows.push(currentRow);
  }

  return rows;
}

function renderTable(md, rows, headerRows) {
  const parts = ['<table class="tp-md-list-table">'];

  if (headerRows > 0) {
    parts.push('<thead>');

    for (const row of rows.slice(0, headerRows)) {
      parts.push('<tr>');

      for (const cell of row) {
        parts.push(`<th>${md.renderInline(cell)}</th>`);
      }

      parts.push('</tr>');
    }

    parts.push('</thead>');
  }

  const bodyRows =
    headerRows > 0
      ? rows.slice(headerRows)
      : rows;

  parts.push('<tbody>');

  for (const row of bodyRows) {
    parts.push('<tr>');

    for (const cell of row) {
      parts.push(`<td>${md.renderInline(cell)}</td>`);
    }

    parts.push('</tr>');
  }

  parts.push('</tbody>');
  parts.push('</table>');

  return parts.join('');
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
  const start =
    state.bMarks[line] + state.tShift[line];

  const end = state.eMarks[line];

  return state.src.slice(start, end);
}

function readOption(line, name) {
  const pattern = new RegExp(
    `${name}=("[^"]+"|'[^']+'|\\S+)`,
  );

  const match = line.match(pattern);

  if (match === null) {
    return null;
  }

  return match[1].replace(/^["']|["']$/g, '');
}
