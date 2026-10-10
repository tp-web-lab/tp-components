export default function markdownCsvTableExtension(md) {
  registerCsvTable(md);
}

function registerCsvTable(md) {
  md.block.ruler.before(
    'fence',
    'csv_table',
    (state, startLine, endLine, silent) => {
      const firstLine = getLine(state, startLine).trim();

      if (!firstLine.startsWith(':::csv-table')) {
        return false;
      }

      if (silent) {
        return true;
      }

      const header = readOption(firstLine, 'header') ?? '';
      const headerRows = Number(readOption(firstLine, 'header-rows') ?? '0');
      const content = collectContainerContent(state, startLine, endLine);

      const token = state.push('csv_table', '', 0);
      token.content = content.content;
      token.meta = {
        header,
        headerRows,
      };

      state.line = content.nextLine;
      return true;
    },
  );

  md.renderer.rules.csv_table = (tokens, index) => {
    const token = tokens[index];
    const header = String(token.meta?.header ?? '');
    const headerRows = Number(token.meta?.headerRows ?? 0);

    const rows = parseCsv(token.content);

    if (header !== '') {
      rows.unshift(parseCsvLine(header));
    }

    if (rows.length === 0) {
      return '';
    }

    return renderTable(md, rows, header !== '' ? 1 : headerRows);
  };
}

function parseCsv(source) {
  return source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => parseCsvLine(line));
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());

  return cells;
}

function renderTable(md, rows, headerRows) {
  const parts = ['<table class="tp-md-csv-table">'];

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

  const bodyRows = headerRows > 0 ? rows.slice(headerRows) : rows;

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
