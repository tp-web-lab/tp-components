/**
 * @module components/prolog-playground
 * @summary Prolog playground component.
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
 * @credit Scryer Prolog https://www.scryer.pl/
 * @summary Prolog execution in the browser.
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
import type { TpPlaygroundProjectMetadata } from "../playground/playground-project-loader.js";
import { buildPrologExecutionDocument } from "./prolog-execution-document.js";
import { TpPrologProject } from "./prolog-project.js";
import { buildPrologTestDocument } from "./prolog-test-document.js";

export { TpPrologProject } from "./prolog-project.js";

/**
 * Prolog playground component.
 *
 * Provides a file-based playground that executes Prolog in the browser with Scryer Prolog.
 *
 * @summary Edits and runs a Prolog project with Scryer Prolog.
 * @tagname tp-prolog-playground
 *
 * @attr {string} repository = "" - Directory containing a Prolog playground project to load at initialization.
 * @attr {string} src = "" - JSON project or prolog source file to load.
 *
 * @example
 * <tp-prolog-playground></tp-prolog-playground>
 */
export class TpPrologPlayground extends TpPlayground<TpPrologProject> {
	protected override get supportsTestExecution(): boolean {
		return true;
	}

	protected override createEmptyProject(): TpPrologProject {
		return new TpPrologProject({
			name: "Prolog project",
			entry: "/program.pl",
			query: "/query.pl",
			files: [
				{
					path: "/program.pl",
					language: "prolog",
					content: `
parent(ada, byron).
parent(ada, charles).
parent(byron, diana).

grandparent(Grandparent, Grandchild) :-
  parent(Grandparent, Parent),
  parent(Parent, Grandchild).
`.trim(),
				},
				{
					path: "/query.pl",
					language: "prolog",
					content: "grandparent(ada, Grandchild).",
				},
			],
		});
	}

	protected override createNewProject(): TpPrologProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpPrologProject {
		return new TpPrologProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpPrologProject,
	): TpPrologProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path === "/program.pl")?.path ??
				nextProject.files.find(
					(file) =>
						file.path.endsWith(".pl") && file.path !== nextProject.query,
				)?.path;
		}

		if (nextProject.query === undefined || nextProject.query === "") {
			nextProject.query =
				nextProject.files.find((file) => file.path === "/query.pl")?.path ??
				nextProject.files.find((file) => file.path.endsWith(".query.pl"))?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpPrologProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path === "/program.pl")?.path ??
			project.files.find(
				(file) => file.path.endsWith(".pl") && file.path !== project.query,
			)?.path ??
			null
		);
	}

	protected override getPlaygroundKind(): string {
		return "prolog";
	}

	protected override getLanguageIconName(): string {
		return "file_type_prolog";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>Prolog</h2>
      <p>Ce playground exécute Prolog avec Scryer Prolog et prend en charge les contraintes CLP(Z).</p>
      <ul>
        <li><a href="https://www.scryer.pl/" target="_blank" rel="noreferrer">Scryer Prolog</a></li>
        <li><a href="https://github.com/guregu/scryer-js" target="_blank" rel="noreferrer">scryer-js</a></li>
      </ul>
    `;
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpPrologProject {
		const prologMetadata = metadata as TpExampleProjectMetadata & {
			query?: unknown;
		};

		return new TpPrologProject({
			name: metadata.name ?? metadata.label ?? metadata.id ?? "Prolog project",
			entry: metadata.entry ?? "/program.pl",
			test: metadata.test,
			query:
				typeof prologMetadata.query === "string"
					? prologMetadata.query
					: "/query.pl",
			files,
		});
	}

	protected override createProjectFromRepository(
		metadata: TpPlaygroundProjectMetadata,
		files: readonly TpFile[],
	): TpPrologProject {
		return this.createProjectFromExample(
			metadata as TpExampleProjectMetadata,
			files,
		);
	}

	protected override async buildExecutionDocument(
		project: TpPrologProject,
	): Promise<TpExecutionDocument> {
		return buildPrologExecutionDocument(project, {
			entry: this.resolveEntry(project) ?? undefined,
			query: project.query,
			scope: this.getAttribute("execution-scope") ?? undefined,
			index: Number(this.getAttribute("execution-index") ?? "0"),
		});
	}

	protected override async buildTestDocument(
		project: TpPrologProject,
	): Promise<TpExecutionDocument> {
		return buildPrologTestDocument(project, {
			defaultTest: "/test.pl",
		});
	}
}

if (!customElements.get("tp-prolog-playground")) {
	customElements.define("tp-prolog-playground", TpPrologPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog-playground": TpPrologPlayground;
	}
}
