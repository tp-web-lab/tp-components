/**
 * @module components/typescript-playground
 * @summary TypeScript playground component.
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
 * @credit Chai https://www.chaijs.com/
 * @summary Assertions in browser tests.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Mocha https://mochajs.org/
 * @summary Browser test execution.
 */
/**
 * @credit Shoelace https://shoelace.style/
 * @summary Web-component examples and import maps.
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
import { buildBrowserTestDocument } from "../playground/browser-test-document.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpPlayground } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	createStaticBlobUrls,
	createTypescriptModuleBlobUrls,
} from "../playground/playground-build-utils.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { TpTypescriptProject } from "./typescript-project.js";

export { TpTypescriptProject } from "./typescript-project.js";

function createImportmapScript(
	importmap: Record<string, unknown> | undefined,
): string {
	if (importmap === undefined) {
		return "";
	}

	return `
<script type="importmap">
${JSON.stringify(importmap, null, 2)}
</script>
`;
}

function createBody(project: TpTypescriptProject): string {
	const htmlFile =
		project.findFile("/index.html") ?? project.findFile("/index.htm");

	return htmlFile?.content ?? '<main id="app"></main>';
}

/**
 * TypeScript playground component.
 *
 * Provides a file-based playground that transpiles and runs TypeScript in an isolated preview.
 *
 * @summary Edits and runs a TypeScript project.
 * @tagname tp-typescript-playground
 *
 * @attr {string} repository = "" - Directory containing a TypeScript playground project to load at initialization.
 * @attr {string} src = "" - JSON project or typescript source file to load.
 *
 * @example
 * <tp-typescript-playground></tp-typescript-playground>
 */
export class TpTypescriptPlayground extends TpPlayground<TpTypescriptProject> {
	protected override get supportsTestExecution(): boolean {
		return true;
	}

	protected override createEmptyProject(): TpTypescriptProject {
		return new TpTypescriptProject({
			name: "TypeScript project",
			entry: "/main.ts",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: '<main id="app"></main>',
				},
				{
					path: "/main.ts",
					language: "typescript",
					content: `
const app = document.querySelector('#app');

if (app instanceof HTMLElement) {
  app.innerHTML = '<h1>Hello TypeScript playground</h1>';
}

const message: string = 'Hello from TypeScript';
console.log(message);
`.trim(),
				},
			],
		});
	}

	protected override createNewProject(): TpTypescriptProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpTypescriptProject {
		return new TpTypescriptProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpTypescriptProject,
	): TpTypescriptProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".ts"))?.path ??
				nextProject.files.find((file) => file.path.endsWith(".tsx"))?.path ??
				nextProject.files.find((file) => file.path.endsWith(".js"))?.path ??
				nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpTypescriptProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path.endsWith(".ts"))?.path ??
			project.files.find((file) => file.path.endsWith(".tsx"))?.path ??
			project.files.find((file) => file.path.endsWith(".js"))?.path ??
			null
		);
	}

	protected override getPlaygroundKind(): string {
		return "typescript";
	}

	protected override getLanguageIconName(): string {
		return "file_type_typescript";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>TypeScript</h2>
      <p>TypeScript ajoute un typage statique à JavaScript.</p>
      <ul>
        <li><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noreferrer">TypeScript documentation</a></li>
        <li><a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank" rel="noreferrer">MDN JavaScript</a></li>
      </ul>
    `;
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return `
      <li>
        Import map
        <ul>
          <li data-tp-playground-action="typescript-importmap-lit">Lit</li>
          <li data-tp-playground-action="typescript-importmap-shoelace">Shoelace</li>
          <li data-tp-playground-action="typescript-importmap-none">None</li>
        </ul>
      </li>
    `;
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		switch (action) {
			case "typescript-importmap-lit":
				this.applyImportmap({
					imports: {
						lit: "https://cdn.jsdelivr.net/npm/lit@3/+esm",
					},
				});
				return true;

			case "typescript-importmap-shoelace":
				this.applyImportmap({
					imports: {
						"@shoelace-style/shoelace":
							"https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2/+esm",
					},
				});
				return true;

			case "typescript-importmap-none":
				this.applyImportmap(undefined);
				return true;

			default:
				return false;
		}
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpTypescriptProject {
		return new TpTypescriptProject({
			name:
				metadata.name ?? metadata.label ?? metadata.id ?? "TypeScript project",
			entry: metadata.entry ?? "/main.ts",
			test: metadata.test,
			importmap: metadata.importmap,
			files,
		});
	}

	protected override async buildExecutionDocument(
		project: TpTypescriptProject,
	): Promise<TpExecutionDocument> {
		const entry = this.resolveEntry(project);

		if (entry === null) {
			throw new Error("No TypeScript entry file found.");
		}

		const staticBlobUrls = createStaticBlobUrls(project.files);

		const moduleBlobUrls = await createTypescriptModuleBlobUrls(
			project.files,
			staticBlobUrls,
			project.importmap,
		);

		const entryUrl = moduleBlobUrls.get(entry);

		if (entryUrl === undefined) {
			throw new Error(`TypeScript module not built: ${entry}`);
		}
		const executionScope = this.getAttribute("execution-scope") ?? "";

		const cleanup = (): void => {
			for (const url of staticBlobUrls.values()) {
				URL.revokeObjectURL(url);
			}

			for (const url of moduleBlobUrls.values()) {
				URL.revokeObjectURL(url);
			}
		};

		return {
			html: `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  ${createImportmapScript(project.importmap)}
</head>
<body>
  ${createBody(project)}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  <script type="module">
    const entryUrl = ${JSON.stringify(entryUrl)};
    const executionScope = ${JSON.stringify(executionScope)};
    if (executionScope === '') {
      await import(entryUrl);
    } else {
      const owner = window.parent !== window ? window.parent : window;
      owner.__tpTypescriptNotebookRealms ??= new Map();
      let realm = owner.__tpTypescriptNotebookRealms.get(executionScope);
      if (!realm) {
        realm = owner.document.createElement('iframe');
        realm.hidden = true;
        owner.document.body.append(realm);
        owner.__tpTypescriptNotebookRealms.set(executionScope, realm);
      }
      realm.contentWindow.console = console;
      const source = (await (await fetch(entryUrl)).text())
        .replace(/(^|\\n)(\\s*)(?:let|const)(\\s+)/g, '$1$2var$3')
        .replace(/^\\s*export\\s*\\{\\s*\\};?\\s*$/gm, '');
      if (/^\\s*(?:import|export)\\b/m.test(source)) await import(entryUrl);
      else realm.contentWindow.eval(source);
    }
  </script>
</body>
</html>
`,
			cleanup,
		};
	}

	protected override async buildTestDocument(
		project: TpTypescriptProject,
	): Promise<TpExecutionDocument> {
		return buildBrowserTestDocument(project, {
			kind: "typescript",
			defaultTest: "/main.test.ts",
			importmap: project.importmap,
		});
	}

	private applyImportmap(importmap: Record<string, unknown> | undefined): void {
		this.syncProjectFromFilesystem();

		const project = this.getProject();

		this.setProject(
			new TpTypescriptProject({
				name: project.name,
				entry: project.entry,
				test: project.test,
				files: project.files,
				importmap,
			}),
		);

		void this.run();
	}
}

if (!customElements.get("tp-typescript-playground")) {
	customElements.define("tp-typescript-playground", TpTypescriptPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-typescript-playground": TpTypescriptPlayground;
	}
}
