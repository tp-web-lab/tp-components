/**
 * @module components/html-playground
 * @summary HTML playground component.
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
 * @credit Mocha https://mochajs.org/
 * @summary Browser test execution.
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
	injectBeforeBodyEnd,
	injectBeforeHeadEnd,
} from "../playground/playground-build-utils.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { TpHtmlProject } from "./html-project.js";

export { TpHtmlProject } from "./html-project.js";

function createImportmapScript(
	importmap: Record<string, unknown> | undefined,
): string {
	if (importmap === undefined) {
		return "";
	}

	return `<script type="importmap">${JSON.stringify(importmap, null, 2)}</script>`;
}

function resolveHtmlAssetPath(entryPath: string, assetPath: string): string {
	if (
		assetPath.startsWith("http://") ||
		assetPath.startsWith("https://") ||
		assetPath.startsWith("data:") ||
		assetPath.startsWith("blob:") ||
		assetPath.startsWith("#")
	) {
		return assetPath;
	}

	if (assetPath.startsWith("/")) {
		return assetPath;
	}

	const entryParts = entryPath.split("/").filter(Boolean);

	entryParts.pop();

	const outputParts = [...entryParts];

	for (const part of assetPath.split("/")) {
		if (part === "" || part === ".") {
			continue;
		}

		if (part === "..") {
			outputParts.pop();
			continue;
		}

		outputParts.push(part);
	}

	return `/${outputParts.join("/")}`;
}

function rewriteHtmlAssetUrls(
	html: string,
	entryPath: string,
	urls: ReadonlyMap<string, string>,
): string {
	return html.replace(
		/\b(src|href)=["']([^"']+)["']/g,
		(match, attribute: string, value: string) => {
			const resolvedPath = resolveHtmlAssetPath(entryPath, value);
			const url = urls.get(resolvedPath);

			if (url === undefined) {
				return match;
			}

			return `${attribute}="${url}"`;
		},
	);
}

/**
 * HTML playground component.
 *
 * Provides a file-based playground that runs HTML, CSS, and JavaScript in an isolated preview.
 *
 * @summary Edits and runs an HTML project.
 * @tagname tp-html-playground
 *
 * @attr {string} repository = "" - Directory containing an HTML playground project to load at initialization.
 * @attr {string} src = "" - JSON project or html source file to load.
 *
 * @example
 * <tp-html-playground></tp-html-playground>
 */
export class TpHtmlPlayground extends TpPlayground<TpHtmlProject> {
	protected override get supportsTestExecution(): boolean {
		return true;
	}

	protected override getPlaygroundKind(): string {
		return "html";
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpHtmlProject {
		return new TpHtmlProject({
			name: metadata.name ?? metadata.label ?? metadata.id ?? "HTML project",
			entry: metadata.entry ?? "/index.html",
			test: metadata.test,
			importmap: metadata.importmap,
			files,
		});
	}

	protected override createNewProject(): TpHtmlProject {
		return new TpHtmlProject({
			name: "HTML project",
			entry: "/index.html",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: `
<link rel="stylesheet" href="/styles.css">
<script type="module" src="/main.js"></script>

<h1>Hello HTML playground</h1>
`,
				},
				{
					path: "/style.css",
					language: "css",
					content: "body { font-family: system-ui, sans-serif; }",
				},
				{
					path: "/main.js",
					language: "javascript",
					content: 'console.log("Hello");',
				},
			],
		});
	}

	protected override createClearProject(): TpHtmlProject {
		return new TpHtmlProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override getLanguageIconName(): string {
		return "file_type_html";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>HTML</h2>
      <p>HTML structures the document.</p>
      <ul>
        <li><a href="https://developer.mozilla.org/docs/Web/HTML" target="_blank" rel="noreferrer">MDN HTML</a></li>
        <li><a href="https://html.spec.whatwg.org/" target="_blank" rel="noreferrer">HTML Living Standard</a></li>
      </ul>
    `;
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return `
      <li>
        Import maps
        <ul>
          <li data-tp-playground-action="html-importmap-lit">Lit</li>
          <li data-tp-playground-action="html-importmap-none">None</li>
        </ul>
      </li>
    `;
	}

	protected override createEmptyProject(): TpHtmlProject {
		return new TpHtmlProject({
			name: "HTML project",
			entry: "/index.html",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: `
<link rel="stylesheet" href="/styles.css">
<script type="module" src="/main.js"></script>

<h1>Hello HTML playground</h1>
`,
				},
				{
					path: "/styles.css",
					language: "css",
					content: "body { font-family: system-ui, sans-serif; }",
				},
				{
					path: "/main.js",
					language: "javascript",
					content: 'console.log("Hello from tp-html-playground");',
				},
			],
		});
	}

	protected override normalizeProject(project: TpHtmlProject): TpHtmlProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			const htmlFile = nextProject.files.find((file) =>
				file.path.endsWith(".html"),
			);

			nextProject.entry = htmlFile?.path ?? nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpHtmlProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path.endsWith(".html"))?.path ??
			project.files[0]?.path ??
			null
		);
	}

	protected override async buildExecutionDocument(
		project: TpHtmlProject,
	): Promise<TpExecutionDocument> {
		const entry = this.resolveEntry(project);

		if (entry === null) {
			throw new Error("No HTML entry file found.");
		}

		const entryFile = project.findFile(entry);

		if (entryFile === undefined) {
			throw new Error(`HTML entry file not found: ${entry}`);
		}

		const staticBlobUrls = createStaticBlobUrls(project.files);

		const moduleBlobUrls = await createJavaScriptModuleBlobUrls(
			project.files,
			staticBlobUrls,
			project.importmap,
		);

		const cleanup = (): void => {
			for (const url of staticBlobUrls.values()) {
				URL.revokeObjectURL(url);
			}

			for (const url of moduleBlobUrls.values()) {
				URL.revokeObjectURL(url);
			}
		};

		const allBlobUrls = new Map([...staticBlobUrls, ...moduleBlobUrls]);

		let html = rewriteHtmlAssetUrls(entryFile.content, entry, allBlobUrls);

		if (project.importmap !== undefined) {
			html = injectBeforeHeadEnd(
				html,
				createImportmapScript(project.importmap),
			);
		}

		html = injectBeforeBodyEnd(
			html,
			`
${createCommonRuntimeScript()}
${createConsoleBridgeScript()}
`,
		);

		return {
			html,
			cleanup,
		};
	}

	protected override async buildTestDocument(
		project: TpHtmlProject,
	): Promise<TpExecutionDocument> {
		return buildBrowserTestDocument(project, {
			kind: "javascript",
			defaultTest: "/main.test.js",
			importmap: project.importmap,
		});
	}
}

if (!customElements.get("tp-html-playground")) {
	customElements.define("tp-html-playground", TpHtmlPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-html-playground": TpHtmlPlayground;
	}
}
