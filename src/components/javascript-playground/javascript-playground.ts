/**
 * @module components/javascript-playground
 * @summary JavaScript playground component.
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
	createJavaScriptModuleBlobUrls,
	createStaticBlobUrls,
} from "../playground/playground-build-utils.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { TpJavascriptProject } from "./javascript-project.js";

export { TpJavascriptProject } from "./javascript-project.js";

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

function createBody(project: TpJavascriptProject): string {
	const htmlFile =
		project.findFile("/index.html") ?? project.findFile("/index.htm");

	if (htmlFile !== undefined) {
		return htmlFile.content;
	}

	return '<main id="app"></main>';
}

/**
 * JavaScript playground component.
 *
 * Provides a file-based playground that runs JavaScript modules in an isolated preview.
 *
 * @summary Edits and runs a JavaScript project.
 * @tagname tp-javascript-playground
 *
 * @attr {string} repository = "" - Directory containing a JavaScript playground project to load at initialization.
 * @attr {string} src = "" - JSON project or javascript source file to load.
 *
 * @example
 * <tp-javascript-playground></tp-javascript-playground>
 */
export class TpJavascriptPlayground extends TpPlayground<TpJavascriptProject> {
	protected override get supportsTestExecution(): boolean {
		return true;
	}

	private applyImportmap(importmap: Record<string, unknown> | undefined): void {
		this.syncProjectFromFilesystem();

		const project = this.getProject();

		this.setProject(
			new TpJavascriptProject({
				name: project.name,
				entry: project.entry,
				test: project.test,
				files: project.files,
				importmap,
			}),
		);

		void this.run();
	}

	protected override createEmptyProject(): TpJavascriptProject {
		return new TpJavascriptProject({
			name: "JavaScript project",
			entry: "/main.js",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: '<main id="app"></main>',
				},
				{
					path: "/main.js",
					language: "javascript",
					content: `
const app = document.querySelector('#app');

if (app instanceof HTMLElement) {
  app.innerHTML = '<h1>Hello JavaScript playground</h1>';
}

console.log('Hello from JavaScript');
`.trim(),
				},
			],
		});
	}

	protected override createNewProject(): TpJavascriptProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpJavascriptProject {
		return new TpJavascriptProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpJavascriptProject,
	): TpJavascriptProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".js"))?.path ??
				nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpJavascriptProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path.endsWith(".js"))?.path ?? null
		);
	}

	protected override getPlaygroundKind(): string {
		return "javascript";
	}

	protected override getLanguageIconName(): string {
		return "file_type_javascript";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>JavaScript</h2>
      <p>JavaScript adds behavior to web pages.</p>
      <ul>
        <li><a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank" rel="noreferrer">MDN JavaScript</a></li>
        <li><a href="https://tc39.es/ecma262/" target="_blank" rel="noreferrer">ECMAScript specification</a></li>
      </ul>
    `;
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpJavascriptProject {
		return new TpJavascriptProject({
			name:
				metadata.name ?? metadata.label ?? metadata.id ?? "JavaScript project",
			entry: metadata.entry ?? "/main.js",
			test: metadata.test,
			importmap: metadata.importmap,
			files,
		});
	}

	protected override async buildExecutionDocument(
		project: TpJavascriptProject,
	): Promise<TpExecutionDocument> {
		const entry = this.resolveEntry(project);

		if (entry === null) {
			throw new Error("No JavaScript entry file found.");
		}

		const staticBlobUrls = createStaticBlobUrls(project.files);

		const moduleBlobUrls = await createJavaScriptModuleBlobUrls(
			project.files,
			staticBlobUrls,
			project.importmap,
		);

		const entryUrl = moduleBlobUrls.get(entry);

		if (entryUrl === undefined) {
			throw new Error(`JavaScript module not built: ${entry}`);
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

		const html = `
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
      owner.__tpJavascriptNotebookRealms ??= new Map();
      let realm = owner.__tpJavascriptNotebookRealms.get(executionScope);
      if (!realm) {
        realm = owner.document.createElement('iframe');
        realm.hidden = true;
        owner.document.body.append(realm);
        owner.__tpJavascriptNotebookRealms.set(executionScope, realm);
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
`;

		return {
			html,
			cleanup,
		};
	}

	protected override async buildTestDocument(
		project: TpJavascriptProject,
	): Promise<TpExecutionDocument> {
		return buildBrowserTestDocument(project, {
			kind: "javascript",
			defaultTest: "/main.test.js",
			importmap: project.importmap,
		});
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return `
      <li>
        Import map
        <ul>
          <li data-tp-playground-action="javascript-importmap-lit">Lit</li>
          <li data-tp-playground-action="javascript-importmap-shoelace">Shoelace</li>
          <li data-tp-playground-action="javascript-importmap-none">None</li>
        </ul>
      </li>
    `;
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		switch (action) {
			case "javascript-importmap-lit":
				this.applyImportmap({
					imports: {
						lit: "https://cdn.jsdelivr.net/npm/lit@3/+esm",
					},
				});
				return true;

			case "javascript-importmap-shoelace":
				this.applyImportmap({
					imports: {
						"@shoelace-style/shoelace":
							"https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2/+esm",
					},
				});
				return true;

			case "javascript-importmap-none":
				this.applyImportmap(undefined);
				return true;

			default:
				return false;
		}
	}
}

if (!customElements.get("tp-javascript-playground")) {
	customElements.define("tp-javascript-playground", TpJavascriptPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-playground": TpJavascriptPlayground;
	}
}
