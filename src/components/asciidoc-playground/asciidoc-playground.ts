/**
 * @module components/asciidoc-playground
 * @summary AsciiDoc playground component.
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
 * @credit Asciidoctor.js https://asciidoctor.org/docs/asciidoctor.js/
 * @summary AsciiDoc conversion in the browser.
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
import { buildAsciidocExecutionDocument } from "./asciidoc-execution-document.js";
import {
	type TpAsciidocExtension,
	TpAsciidocProject,
} from "./asciidoc-project.js";

export {
	type TpAsciidocExtension,
	TpAsciidocProject,
} from "./asciidoc-project.js";

const KNOWN_EXTENSIONS: TpAsciidocExtension[] = [
	{
		id: "asciidoctor-glossary",
		label: "asciidoctor-glossary",
		url: "/extensions/asciidoc/asciidoctor-glossary/glossary.js",
		enabled: true,
	},
];

/**
 * AsciiDoc playground component.
 *
 * Provides a file-based playground that renders AsciiDoc documents in the browser.
 *
 * @summary Edits and renders an AsciiDoc project.
 * @tagname tp-asciidoc-playground
 *
 * @attr {string} repository = "" - Directory containing an AsciiDoc playground project to load at initialization.
 * @attr {string} src = "" - JSON project or asciidoc source file to load.
 *
 * @example
 * <tp-asciidoc-playground></tp-asciidoc-playground>
 */
export class TpAsciidocPlayground extends TpPlayground<TpAsciidocProject> {
	protected override get exampleCategory(): string {
		return "playgrounds";
	}

	protected override get exampleGroup(): string {
		return "asciidoc";
	}

	protected override createEmptyProject(): TpAsciidocProject {
		return new TpAsciidocProject({
			name: "AsciiDoc project",
			entry: "/index.adoc",
			files: [
				{
					path: "/index.adoc",
					language: "asciidoc",
					content: `
= Hello AsciiDoc

This document is rendered with Asciidoctor.js.

include::partials/details.adoc[]
`.trim(),
				},
				{
					path: "/partials/details.adoc",
					language: "asciidoc",
					content: `
== Included section

This section comes from another project file.
`.trim(),
				},
			],
		});
	}

	protected override createNewProject(): TpAsciidocProject {
		return this.createEmptyProject();
	}

	protected override createClearProject(): TpAsciidocProject {
		return new TpAsciidocProject({
			name: "Untitled project",
			files: [],
		});
	}

	protected override normalizeProject(
		project: TpAsciidocProject,
	): TpAsciidocProject {
		const nextProject = project.clone();

		if (nextProject.entry === undefined || nextProject.entry === "") {
			nextProject.entry =
				nextProject.files.find((file) => file.path.endsWith(".adoc"))?.path ??
				nextProject.files.find((file) => file.path.endsWith(".asciidoc"))
					?.path ??
				nextProject.files[0]?.path;
		}

		return nextProject;
	}

	protected override resolveEntry(project: TpAsciidocProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return (
			project.files.find((file) => file.path === "/index.adoc")?.path ??
			project.files.find((file) => file.path === "/main.adoc")?.path ??
			project.files.find((file) => file.path.endsWith(".adoc"))?.path ??
			project.files.find((file) => file.path.endsWith(".asciidoc"))?.path ??
			null
		);
	}

	protected override getPlaygroundKind(): string {
		return "asciidoc";
	}

	protected override getLanguageIconName(): string {
		return "file_type_asciidoc";
	}

	protected override getLanguageHelp(): string {
		return `
      <h2>AsciiDoc</h2>
      <p>AsciiDoc est rendu dans le navigateur avec Asciidoctor.js.</p>
      <ul>
        <li><a href="https://docs.asciidoctor.org/asciidoc/latest/" target="_blank" rel="noreferrer">AsciiDoc syntax</a></li>
        <li><a href="https://docs.asciidoctor.org/asciidoctor.js/latest/" target="_blank" rel="noreferrer">Asciidoctor.js</a></li>
        <li><a href="https://docs.asciidoctor.org/asciidoctor/latest/extensions/" target="_blank" rel="noreferrer">Extensions</a></li>
      </ul>
    `;
	}

	protected override getAdditionalToolbarMenuItems(): string {
		return `
      <li>
        Extensions
        <ul>
          ${KNOWN_EXTENSIONS.map(
						(extension) => `
              <li data-tp-playground-action="asciidoc-extension-${extension.id}">
                ${extension.label}
              </li>
            `,
					).join("")}
          <li data-tp-playground-action="asciidoc-extension-none">None</li>
        </ul>
      </li>
    `;
	}

	protected override handleAdditionalToolbarAction(action: string): boolean {
		if (action === "asciidoc-extension-none") {
			this.applyExtensions(undefined);
			return true;
		}

		const prefix = "asciidoc-extension-";

		if (!action.startsWith(prefix)) {
			return false;
		}

		const id = action.slice(prefix.length);
		const extension = KNOWN_EXTENSIONS.find((item) => item.id === id);

		if (extension === undefined) {
			return false;
		}

		this.applyExtensions([{ ...extension, enabled: true }]);
		return true;
	}

	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpAsciidocProject {
		const candidate = metadata as TpExampleProjectMetadata & {
			attributes?: unknown;
			extensions?: unknown;
		};

		return new TpAsciidocProject({
			name:
				metadata.name ?? metadata.label ?? metadata.id ?? "AsciiDoc project",
			entry: metadata.entry ?? "/index.adoc",
			test: metadata.test,
			attributes:
				typeof candidate.attributes === "object" &&
				candidate.attributes !== null
					? (candidate.attributes as Record<string, string | boolean | number>)
					: undefined,
			extensions: Array.isArray(candidate.extensions)
				? candidate.extensions.filter(
						(extension): extension is TpAsciidocExtension =>
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
		project: TpAsciidocProject,
	): Promise<TpExecutionDocument> {
		return buildAsciidocExecutionDocument(project, {
			entry: this.resolveEntry(project) ?? undefined,
		});
	}

	private applyExtensions(extensions: TpAsciidocExtension[] | undefined): void {
		this.syncProjectFromFilesystem();

		const project = this.getProject();

		this.setProject(
			new TpAsciidocProject({
				name: project.name,
				entry: project.entry,
				test: project.test,
				files: project.files,
				attributes: project.attributes,
				extensions,
			}),
		);

		void this.run();
	}
}

if (!customElements.get("tp-asciidoc-playground")) {
	customElements.define("tp-asciidoc-playground", TpAsciidocPlayground);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-asciidoc-playground": TpAsciidocPlayground;
	}
}
