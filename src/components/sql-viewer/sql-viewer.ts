/**
 * @module components/sql-viewer
 * @summary Compact SQL code viewer and runner.
 *
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-sql-playground
 * @summary SQL playground component.
 */
// tp-docgen:dependencies:end
import "../sql-playground/sql-playground.js";
import { TpSqlPlayground } from "../sql-playground/sql-playground.js";
import type { TpSqlProject } from "../sql-playground/sql-project.js";

/**
 * @tagname tp-sql-viewer
 * @summary Displays and runs one SQL example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or sql source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @example
 * <tp-sql-viewer></tp-sql-viewer>
 */
export class TpSqlViewer extends TpSqlPlayground {
	protected override get viewerMode(): boolean {
		return true;
	}
	protected override get usesViewerEditorTabs(): boolean {
		return true;
	}

	protected override createInitialProject(): TpSqlProject {
		const project = super.createInitialProject();
		const scripts = Array.from(
			this.querySelectorAll<HTMLScriptElement>(
				':scope > script:is([type="tp/sql"], [type="tp/sql-viewer"])',
			),
		);

		if (scripts.length === 1 && !scripts[0]?.hasAttribute("filename")) {
			const tablesPath = project.setup ?? "/tables.sql";
			const queryPath = project.entry ?? "/query.sql";
			const queryFile = project.findFile(queryPath);
			const tablesFile = project.findFile(tablesPath);
			const content = queryFile?.content ?? "";

			project.setup = tablesPath;
			project.entry = queryPath;
			if (tablesFile === undefined) {
				project.files.push({ path: tablesPath, language: "sql", content });
			} else {
				tablesFile.content = content;
			}
			if (queryFile === undefined) {
				project.files.push({ path: queryPath, language: "sql", content: "" });
			} else {
				queryFile.content = "";
			}
		}

		return project;
	}

	protected override getViewerAdditionalFilePaths(
		project: TpSqlProject,
	): readonly string[] {
		return project.entry === undefined ? [] : [project.entry];
	}

	protected override resolveViewerPrimaryFile(
		project: TpSqlProject,
	): string | null {
		return project.setup !== undefined &&
			project.findFile(project.setup) !== undefined
			? project.setup
			: super.resolveViewerPrimaryFile(project);
	}
}

if (!customElements.get("tp-sql-viewer")) {
	customElements.define("tp-sql-viewer", TpSqlViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-sql-viewer": TpSqlViewer;
	}
}
