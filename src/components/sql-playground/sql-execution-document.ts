import type { TpExecutionDocument } from "../playground/playground.js";

import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	findProjectFile,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";

import type { TpSqlProject } from "./sql-project.js";

const SQL_JS_URL =
	"https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js";

const SQL_WASM_BASE_URL = "https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/";

function stripScripts(html: string): string {
	return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

function toStorageId(value: string): string {
	return (
		value
			.trim()
			.toLowerCase()
			.replaceAll(/[^a-z0-9]+/g, "-")
			.replaceAll(/^-+|-+$/g, "") || "sql-project"
	);
}

export function createSqlStorageKey(project: { name?: string }): string {
	return `tp-sql-db:${toStorageId(project.name ?? "sql-project")}`;
}

export interface BuildSqlExecutionDocumentOptions {
	entry?: string;
	scope?: string;
}

export async function buildSqlExecutionDocument(
	project: TpSqlProject,
	options: BuildSqlExecutionDocumentOptions = {},
): Promise<TpExecutionDocument> {
	const entryFile = resolveEntryFile(project, {
		entry: options.entry,
		priorityPaths: ["/query.sql", "/main.sql"],
		extensions: [".sql"],
		fallbackToFirstFile: false,
	});

	if (entryFile === undefined) {
		throw new Error("No SQL entry file found.");
	}

	const database = project.getActiveDatabase() ?? null;

	const databaseSetupFile =
		database?.type === "sql"
			? findProjectFile(project, database.path)
			: undefined;

	const setupFile =
		databaseSetupFile ??
		(typeof project.setup === "string" && project.setup !== ""
			? findProjectFile(project, project.setup)
			: (findProjectFile(project, "/tables.sql") ??
				findProjectFile(project, "/setup.sql")));

	if (
		typeof project.setup === "string" &&
		project.setup !== "" &&
		setupFile === undefined
	) {
		throw new Error(`SQL setup file not found: ${project.setup}`);
	}

	const htmlFile = findProjectFile(project, "/index.html");
	const body = htmlFile
		? stripScripts(htmlFile.content)
		: '<div id="sql-output"></div>';

	const setupSql = setupFile?.content ?? "";
	const querySql = entryFile.content;

	const storageKey =
		typeof options.scope === "string" && options.scope !== ""
			? `tp-sql-notebook:${options.scope}`
			: typeof database?.storageKey === "string"
				? database.storageKey
				: createSqlStorageKey(project);

	return {
		html: `
<!doctype html>
<html>
<head>
  <script src="${SQL_JS_URL}"></script>
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
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}

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
  const storageKey = ${JSON.stringify(storageKey)};
  const resetKey = storageKey + ':reset';

  try {
    const SQL = await initSqlJs({
      locateFile: (file) => '${SQL_WASM_BASE_URL}' + file,
    });

    const shouldReset = localStorage.getItem(resetKey) === '1';

    if (shouldReset) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(resetKey);
    }

    const database = ${JSON.stringify(database)};
    let db = loadDb(SQL, storageKey);

    if (!db && database?.type === 'sqlite') {
      throw new Error(
        'SQLite database not found in localStorage for key: ' + storageKey,
      );
    }

    if (!db) {
      db = new SQL.Database();

      if (database?.type !== 'sqlite') {
        const setupSql = ${JSON.stringify(setupSql)};

        if (setupSql.trim() !== '') {
          db.run(setupSql);
        }
      }

      saveDb(db, storageKey);
    }

    const schema = extractSchema(db);
    postSchema(schema);

    const querySql = ${JSON.stringify(querySql)};
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
</script>
</body>
</html>
`,
	};
}
