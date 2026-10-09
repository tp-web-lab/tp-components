/**
 * @module components/python-playground
 * @summary Python playground component.
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
 * @credit Pyodide https://pyodide.org/
 * @summary Python execution in the browser.
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
import { buildPythonExecutionDocument } from "./python-execution-document.js";
import { TpPythonProject } from "./python-project.js";
import { buildPythonTestDocument } from "./python-test-document.js";

export { TpPythonProject } from "./python-project.js";

/**
 * Python playground component.
 *
 * Provides a file-based playground that executes Python in the browser.
 *
 * @summary Edits and runs a Python project.
 * @tagname tp-python-playground
 *
 * @attr {string} repository = "" - Directory containing a Python playground project to load at initialization.
 * @attr {string} src = "" - JSON project or python source file to load.
 *
 * @example
 * <tp-python-playground></tp-python-playground>
 */
export class TpPythonPlayground extends TpPlayground<TpPythonProject> {
	private static nextExecutionScope = 0;

	private readonly defaultExecutionScope =
		`tp-python-${++TpPythonPlayground.nextExecutionScope}`;

	protected override get supportsTestExecution(): boolean {
		return true;
	}

	protected override createEmptyProject(): TpPythonProject {
		return new TpPythonProject({
			name: "Python project",
			entry: "/main.py",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: '<main id="app"></main>',
				},
				{
					path: "/main.py",
					language: "python",
					content: `
from js import document

print("Hello from Python")

message = "Hello Python playground"
document.getElementById("app").textContent = message
print(message)
`.trim(),
				},
			],
		});
	}

	protected override createNewProject(): TpPythonProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpPythonProject {
		return new TpPythonProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpPythonProject,
	): TpPythonProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".py"))?.path ??
				nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpPythonProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path.endsWith(".py"))?.path ?? null
		);
	}

	protected override getPlaygroundKind(): string {
		return "python";
	}

	protected override getLanguageIconName(): string {
		return "file_type_python";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>Python</h2>
      <p>Python est exécuté dans le navigateur avec Pyodide.</p>
      <ul>
        <li><a href="https://docs.python.org/3/" target="_blank" rel="noreferrer">Python documentation</a></li>
        <li><a href="https://pyodide.org/en/stable/" target="_blank" rel="noreferrer">Pyodide documentation</a></li>
        <li><a href="https://docs.python.org/3/library/unittest.html" target="_blank" rel="noreferrer">unittest</a></li>
      </ul>
    `;
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return `
      <li>
        Python libs
        <ul>
          <li data-tp-playground-action="python-libs-none">None</li>
          <li data-tp-playground-action="python-libs-numpy">NumPy</li>
          <li data-tp-playground-action="python-libs-pandas">Pandas</li>
          <li data-tp-playground-action="python-libs-matplotlib">Matplotlib</li>
        </ul>
      </li>
    `;
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		switch (action) {
			case "python-libs-none":
				this.applyLibs(undefined);
				return true;

			case "python-libs-numpy":
				this.applyLibs(["numpy"]);
				return true;

			case "python-libs-pandas":
				this.applyLibs(["pandas"]);
				return true;

			case "python-libs-matplotlib":
				this.applyLibs(["matplotlib"]);
				return true;

			default:
				return false;
		}
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpPythonProject {
		const metadataWithLibs = metadata as TpExampleProjectMetadata & {
			libs?: unknown;
		};

		return new TpPythonProject({
			name: metadata.name ?? metadata.label ?? metadata.id ?? "Python project",
			entry: metadata.entry ?? "/main.py",
			test: metadata.test,
			libs: Array.isArray(metadataWithLibs.libs)
				? metadataWithLibs.libs.filter(
						(item): item is string => typeof item === "string",
					)
				: undefined,
			files,
		});
	}

	protected override async buildExecutionDocument(
		project: TpPythonProject,
	): Promise<TpExecutionDocument> {
		return buildPythonExecutionDocument(project, {
			entry: this.resolveEntry(project) ?? undefined,
			libs: project.libs,
			scope: this.getAttribute("execution-scope") ?? this.defaultExecutionScope,
		});
	}

	protected override async buildTestDocument(
		project: TpPythonProject,
	): Promise<TpExecutionDocument> {
		return buildPythonTestDocument(project, {
			defaultTest: "/main.test.py",
			libs: project.libs,
		});
	}

	private applyLibs(libs: string[] | undefined): void {
		this.syncProjectFromFilesystem();

		const project = this.getProject();

		this.setProject(
			new TpPythonProject({
				name: project.name,
				entry: project.entry,
				test: project.test,
				files: project.files,
				libs,
			}),
		);

		void this.run();
	}
}

if (!customElements.get("tp-python-playground")) {
	customElements.define("tp-python-playground", TpPythonPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-python-playground": TpPythonPlayground;
	}
}
