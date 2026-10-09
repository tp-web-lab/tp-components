/**
 * @module components/markdown-playground
 * @summary Markdown playground component.
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
import type { TpMarkupExtensionId } from "../markup-playground/markup-extension.types.js";
import {
	getMarkupExtensionIdFromAction,
	isMarkupExtensionAction,
	renderMarkupExtensionMenu,
	syncMarkupExtensionMenuChecks,
} from "../markup-playground/markup-extension-menu.js";
import {
	createMarkupExtensionMenuItems,
	toggleMarkupExtensionId,
	toMarkupRuntimeExtensions,
} from "../markup-playground/markup-extension-registry.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpPlayground } from "../playground/playground.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { buildMarkdownExecutionDocument } from "./markdown-execution-document.js";
import {
	type TpMarkdownExtension,
	TpMarkdownProject,
} from "./markdown-project.js";

export {
	type TpMarkdownExtension,
	TpMarkdownProject,
} from "./markdown-project.js";

/**
 * Markdown playground component.
 *
 * Provides a file-based playground that renders Markdown documents in the browser.
 *
 * @summary Edits and renders a Markdown project.
 * @tagname tp-markdown-playground
 *
 * @attr {string} repository = "" - Directory containing a Markdown playground project to load at initialization.
 * @attr {string} src = "" - JSON project or markdown source file to load.
 *
 * @example
 * <tp-markdown-playground></tp-markdown-playground>
 */
export class TpMarkdownPlayground extends TpPlayground<TpMarkdownProject> {
	protected override createEmptyProject(): TpMarkdownProject {
		return new TpMarkdownProject({
			name: "Markdown project",
			entry: "/index.md",
			files: [
				{
					path: "/index.md",
					language: "markdown",
					content: `
---
sectionNumbering:
  enabled: true
  maxLevel: 3
---
# Hello Markdown

Markdown is rendered with **@tp/tp-markdown**.

## Included default extensions

==Marked text==

H~2~O

x^2^

HTML
: HyperText Markup Language

CSS
: Cascading Style Sheets

A footnote example.[^1]

[^1]: Footnote text.
`.trim(),
				},
			],
		});
	}

	protected override createNewProject(): TpMarkdownProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpMarkdownProject {
		return new TpMarkdownProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpMarkdownProject,
	): TpMarkdownProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".md"))?.path ??
				nextProject.files.find((file) => file.path.endsWith(".markdown"))
					?.path ??
				nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpMarkdownProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path === "/index.md")?.path ??
			project.files.find((file) => file.path === "/main.md")?.path ??
			project.files.find((file) => file.path.endsWith(".md"))?.path ??
			project.files.find((file) => file.path.endsWith(".markdown"))?.path ??
			null
		);
	}

	protected override getPlaygroundKind(): string {
		return "markdown";
	}

	protected override getLanguageIconName(): string {
		return "file_type_markdown";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>Markdown</h2>
      <p>Markdown est rendu avec @tp/tp-markdown.</p>
      <ul>
        <li><a href="https://github.com/tp-web-lab/tp-markdown" target="_blank" rel="noreferrer">@tp/tp-markdown</a></li>
        <li><a href="https://spec.commonmark.org/" target="_blank" rel="noreferrer">CommonMark</a></li>
      </ul>
    `;
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return renderMarkupExtensionMenu(
			createMarkupExtensionMenuItems(
				"markdown",
				this.getActiveMarkupExtensionIds(),
			),
		);
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		if (!isMarkupExtensionAction(action)) {
			return false;
		}

		const id = getMarkupExtensionIdFromAction(action);

		if (id === null) {
			return false;
		}

		const activeIds = toggleMarkupExtensionId(
			this.getActiveMarkupExtensionIds(),
			id,
		);

		this.applyMarkupExtensions(activeIds);
		return true;
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpMarkdownProject {
		const candidate = metadata as TpExampleProjectMetadata & {
			extensions?: unknown;
		};

		return new TpMarkdownProject({
			name:
				metadata.name ?? metadata.label ?? metadata.id ?? "Markdown project",
			entry: metadata.entry ?? "/index.md",
			test: metadata.test,
			extensions: Array.isArray(candidate.extensions)
				? candidate.extensions.filter(
						(extension): extension is TpMarkdownExtension =>
							typeof extension === "object" &&
							extension !== null &&
							typeof (extension as { id?: unknown }).id === "string" &&
							typeof (extension as { label?: unknown }).label === "string" &&
							typeof (extension as { url?: unknown }).url === "string",
					)
				: undefined,
			files,
		});
	}

	protected override async buildExecutionDocument(
		project: TpMarkdownProject,
	): Promise<TpExecutionDocument> {
		return buildMarkdownExecutionDocument(project, {
			entry: this.resolveEntry(project) ?? undefined,
		});
	}

	protected override get exampleCategory(): string {
		return "playgrounds";
	}

	protected override get exampleGroup(): string {
		return "markdown";
	}

	protected override afterProjectLoaded(): void {
		queueMicrotask(() => {
			this.syncToolbarExtensionChecks();
		});
	}

	private getActiveMarkupExtensionIds(): Set<TpMarkupExtensionId> {
		const ids: TpMarkupExtensionId[] = [];

		for (const extension of this.getProject().extensions ?? []) {
			ids.push(extension.id as TpMarkupExtensionId);
		}

		return new Set(ids);
	}

	private applyMarkupExtensions(
		activeIds: ReadonlySet<TpMarkupExtensionId>,
	): void {
		this.toolbarStartMenuEl?.closeAll?.();

		this.syncProjectFromFilesystem();

		const project = this.getProject();

		this.setProject(
			new TpMarkdownProject({
				name: project.name,
				entry: project.entry,
				test: project.test,
				files: project.files,
				extensions: toMarkupRuntimeExtensions("markdown", activeIds),
			}),
		);

		queueMicrotask(() => {
			this.syncToolbarExtensionChecks();
			void this.run();
		});
	}

	private syncToolbarExtensionChecks(): void {
		syncMarkupExtensionMenuChecks(this, this.getActiveMarkupExtensionIds());
	}
}

if (!customElements.get("tp-markdown-playground")) {
	customElements.define("tp-markdown-playground", TpMarkdownPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-markdown-playground": TpMarkdownPlayground;
	}
}
