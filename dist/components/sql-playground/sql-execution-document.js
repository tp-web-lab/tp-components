import { E as e, f as t, n, t as r } from "../../chunks/playground-build-utils.js";
//#region src/components/sql-playground/sql-execution-document.ts
var i = "https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js", a = "https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/";
function o(e) {
	return e.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}
function s(e) {
	return e.trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "") || "sql-project";
}
function c(e) {
	return `tp-sql-db:${s(e.name ?? "sql-project")}`;
}
async function l(s, l = {}) {
	let u = e(s, {
		entry: l.entry,
		priorityPaths: ["/query.sql", "/main.sql"],
		extensions: [".sql"],
		fallbackToFirstFile: !1
	});
	if (u === void 0) throw Error("No SQL entry file found.");
	let d = s.getActiveDatabase() ?? null, f = (d?.type === "sql" ? t(s, d.path) : void 0) ?? (typeof s.setup == "string" && s.setup !== "" ? t(s, s.setup) : t(s, "/tables.sql") ?? t(s, "/setup.sql"));
	if (typeof s.setup == "string" && s.setup !== "" && f === void 0) throw Error(`SQL setup file not found: ${s.setup}`);
	let p = t(s, "/index.html"), m = p ? o(p.content) : "<div id=\"sql-output\"></div>", h = f?.content ?? "", g = u.content, _ = typeof l.scope == "string" && l.scope !== "" ? `tp-sql-notebook:${l.scope}` : typeof d?.storageKey == "string" ? d.storageKey : c(s);
	return { html: `
<!doctype html>
<html>
<head>
  <script src="${i}"><\/script>
  <style>
    #sql-output {
      display: grid;
      gap: 1rem;
      margin-block: 1rem;
    }

    #sql-output,
    #sql-output details,
    #sql-output summary {
      box-sizing: border-box;
      inline-size: 100%;
      max-inline-size: 100%;
      min-inline-size: 0;
    }

    #sql-output details {
      border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
      border-radius: 0.5rem;
      overflow: hidden;
      padding: 0.75rem;
    }

    #sql-output summary {
      align-items: center;
      cursor: pointer;
      display: grid;
      font: inherit;
      grid-template-columns: 1rem minmax(0, 1fr);
      gap: 0.5rem;
      list-style: none;
    }

    #sql-output summary::-webkit-details-marker {
      display: none;
    }

    #sql-output summary::marker {
      content: "";
    }

    #sql-output summary::before {
      content: "▶";
      font-size: 0.75rem;
      line-height: 1;
    }

    #sql-output details[open] > summary::before {
      content: "▼";
    }

    #sql-output .sql-query {
      display: block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      inline-size: 100%;
      overflow-x: auto;
      white-space: nowrap;
    }

    #sql-output .sql-table-wrapper {
      max-inline-size: 100%;
      overflow-x: auto;
    }

    #sql-output table {
      border-collapse: collapse;
      inline-size: max-content;
      margin-block-start: 0.5rem;
      min-inline-size: 100%;
    }

    #sql-output th,
    #sql-output td {
      padding: 0.25rem 0.5rem;
    }
  </style>
</head>
<body>
  ${m}
  ${r()}
  ${n()}

<script>
function extractSchema(db) {
  const tables = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );

  if (tables.length === 0) {
    return [];
  }

  return tables[0].values.map((row) => {
    const tableName = String(row[0]);
    const escapedTableName = tableName.replaceAll('"', '""');
    const cols = db.exec('PRAGMA table_info("' + escapedTableName + '")');

    const columns =
      cols.length > 0 ? cols[0].values.map((col) => String(col[1])) : [];

    return { name: tableName, columns };
  });
}

function postSchema(schema) {
  window.parent.postMessage(
    {
      type: 'tp-playground-sql-schema',
      schema,
    },
    '*',
  );
}

function saveDb(db, key) {
  const data = db.export();
  let binary = '';

  for (let index = 0; index < data.length; index += 1) {
    binary += String.fromCharCode(data[index]);
  }

  localStorage.setItem(key, btoa(binary));
}

function loadDb(SQL, key) {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return null;
  }

  const binary = atob(saved);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new SQL.Database(bytes);
}

function render(results) {
  let root = document.getElementById('sql-output');

  if (!root) {
    root = document.createElement('div');
    root.id = 'sql-output';
    document.body.append(root);
  }

  root.innerHTML = '';

  if (!results || results.length === 0) {
    root.textContent = 'No result';
    return;
  }

  for (const [index, result] of results.entries()) {
    const details = document.createElement('details');
    details.open = false;

    const summary = document.createElement('summary');
    const query = document.createElement('span');

    query.className = 'sql-query';
    query.tabIndex = 0;
    query.textContent = result.sql ?? String(index + 1);

    summary.append(query);
    details.append(summary);

    const table = document.createElement('table');
    table.border = '1';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    for (const column of result.columns) {
      const th = document.createElement('th');
      th.textContent = column;
      headRow.append(th);
    }

    thead.append(headRow);
    table.append(thead);

    const tbody = document.createElement('tbody');

    for (const row of result.values) {
      const tr = document.createElement('tr');

      for (const value of row) {
        const td = document.createElement('td');
        td.textContent = String(value);
        tr.append(td);
      }

      tbody.append(tr);
    }

    table.append(tbody);

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'sql-table-wrapper';
    tableWrapper.tabIndex = 0;
    tableWrapper.setAttribute('role', 'region');
    tableWrapper.setAttribute('aria-label', 'Query result');
    tableWrapper.append(table);

    details.append(tableWrapper);
    root.append(details);
  }
}

async function main() {
  const storageKey = ${JSON.stringify(_)};
  const resetKey = storageKey + ':reset';

  try {
    const SQL = await initSqlJs({
      locateFile: (file) => '${a}' + file,
    });

    const shouldReset = localStorage.getItem(resetKey) === '1';

    if (shouldReset) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(resetKey);
    }

    const database = ${JSON.stringify(d)};
    let db = loadDb(SQL, storageKey);

    if (!db && database?.type === 'sqlite') {
      throw new Error(
        'SQLite database not found in localStorage for key: ' + storageKey,
      );
    }

    if (!db) {
      db = new SQL.Database();

      if (database?.type !== 'sqlite') {
        const setupSql = ${JSON.stringify(h)};

        if (setupSql.trim() !== '') {
          db.run(setupSql);
        }
      }

      saveDb(db, storageKey);
    }

    const schema = extractSchema(db);
    postSchema(schema);

    const querySql = ${JSON.stringify(g)};
    const statements = querySql
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement !== '');

    const results = [];

    for (const statement of statements) {
      const query = \`\${statement};\`;
      const partialResults = db.exec(query);

      for (const result of partialResults) {
        results.push({
          ...result,
          sql: query,
        });
      }
    }

    render(results);
    saveDb(db, storageKey);
    db.close();
  } catch (error) {
    console.error(error);
  }
}

void main();
<\/script>
</body>
</html>
` };
}
//#endregion
export { l as buildSqlExecutionDocument, c as createSqlStorageKey };

//# sourceMappingURL=sql-execution-document.js.map