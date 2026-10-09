/**
 * @module components/sql-playground
 * @summary SQL playground component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Displays a sliding drawer panel.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-filesystem
 * @summary In-memory file system component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit sql.js https://sql.js.org/
 * @summary SQLite execution in the browser.
 */
/**
 * @credit TypeScript https://www.typescriptlang.org/
 * @summary TypeScript transpilation and language services.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import "../playground/playground.js";

import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpPlayground } from "../playground/playground.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import {
	buildSqlExecutionDocument,
	createSqlStorageKey,
} from "./sql-execution-document.js";
import { type TpSqlDatabase, TpSqlProject } from "./sql-project.js";

export {
	type TpSqlDatabase,
	type TpSqlDatabaseType,
	TpSqlProject,
} from "./sql-project.js";

/**
 * SQL playground component.
 *
 * Provides a file-based playground that executes SQL with SQLite in the browser.
 *
 * @summary Edits and runs a SQL project.
 * @tagname tp-sql-playground
 *
 * @attr {string} repository = "" - Directory containing a SQL playground project to load at initialization.
 * @attr {string} src = "" - JSON project or sql source file to load.
 *
 * @example
 * <tp-sql-playground></tp-sql-playground>
 */
export class TpSqlPlayground extends TpPlayground<TpSqlProject> {
	protected override createEmptyProject(): TpSqlProject {
		return new TpSqlProject({
			name: "SQL project",
			entry: "/query.sql",
			setup: "/tables.sql",
			database: {
				id: "tables.sql",
				name: "tables.sql",
				type: "sql",
				path: "/tables.sql",
				active: true,
			},
			databases: [
				{
					id: "tables.sql",
					name: "tables.sql",
					type: "sql",
					path: "/tables.sql",
					active: true,
				},
			],
			files: [
				{
					path: "/tables.sql",
					language: "sql",
					content: `
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO users (name) VALUES
  ('Ada'),
  ('Grace'),
  ('Linus');
`.trim(),
				},
				{
					path: "/query.sql",
					language: "sql",
					content: "SELECT * FROM users;",
				},
			],
		});
	}

	protected override createNewProject(): TpSqlProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpSqlProject {
		return new TpSqlProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(project: TpSqlProject): TpSqlProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".sql"))?.path ??
				nextProject.files[0]?.path;
		}

		if (
			nextProject.databases === undefined &&
			typeof nextProject.setup === "string"
		) {
			nextProject.databases = [
				{
					id: nextProject.setup,
					name: nextProject.setup.split("/").filter(Boolean).at(-1) ?? "setup",
					type: "sql",
					path: nextProject.setup,
					active: true,
				},
			];

			nextProject.database = nextProject.databases[0];
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpSqlProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path === "/query.sql")?.path ??
			project.files.find((file) => file.path === "/main.sql")?.path ??
			project.files.find((file) => file.path.endsWith(".sql"))?.path ??
			null
		);
	}

	protected override getPlaygroundKind(): string {
		return "sql";
	}

	protected override getLanguageIconName(): string {
		return "file_type_sql";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>SQL</h2>
      <p>Ce playground exécute SQL avec SQLite via sql.js.</p>
      <ul>
        <li><a href="https://www.sqlite.org/lang.html" target="_blank" rel="noreferrer">SQLite language</a></li>
        <li><a href="https://sql.js.org/" target="_blank" rel="noreferrer">sql.js</a></li>
      </ul>
    `;
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return `
      <li>
        DB
        <ul>
          <li data-tp-playground-action="sql-reset-db">Reset DB</li>
        </ul>
      </li>
    `;
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		switch (action) {
			case "sql-reset-db":
				this.resetActiveDatabase();
				return true;

			default:
				return false;
		}
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpSqlProject {
		const setup = (metadata as TpExampleProjectMetadata & { setup?: string })
			.setup;

		const database: TpSqlDatabase | undefined =
			typeof setup === "string" && setup !== ""
				? {
						id: setup,
						name: setup.split("/").filter(Boolean).at(-1) ?? setup,
						type: "sql",
						path: setup,
						active: true,
					}
				: undefined;

		return new TpSqlProject({
			name: metadata.name ?? metadata.label ?? metadata.id ?? "SQL project",
			entry: metadata.entry ?? "/query.sql",
			test: metadata.test,
			setup,
			database,
			databases: database !== undefined ? [database] : undefined,
			files,
		});
	}

	protected override async buildExecutionDocument(
		project: TpSqlProject,
	): Promise<TpExecutionDocument> {
		return buildSqlExecutionDocument(project, {
			entry: this.resolveEntry(project) ?? undefined,
			scope: this.getAttribute("execution-scope") ?? undefined,
		});
	}

	private resetActiveDatabase(): void {
		const project = this.getProject();
		const database = project.getActiveDatabase();
		const key =
			typeof database?.storageKey === "string"
				? database.storageKey
				: createSqlStorageKey(project);

		localStorage.removeItem(key);
		localStorage.removeItem(`${key}:reset`);
		localStorage.removeItem(`${key}:name`);

		void this.run();
	}
}

if (!customElements.get("tp-sql-playground")) {
	customElements.define("tp-sql-playground", TpSqlPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-sql-playground": TpSqlPlayground;
	}
}
