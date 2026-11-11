/**
 * @module components/latex-playground
 * @summary Edits and renders LaTeX projects as interactive web documents.
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
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-filesystem
 * @summary In-memory file system component.
 */
/**
 * @tp-dependency tp-html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { dedent } from "../../utilities/code.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import {
	type TpExecutionDocument,
	TpPlayground,
} from "../playground/playground.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { buildLatexExecutionDocument } from "./latex-execution-document.js";
import { TpLatexProject } from "./latex-project.js";

export { TpLatexProject } from "./latex-project.js";
/**
 * The custom `<tp-latex-playground>` element edits and previews LaTeX projects.
 *
 * @summary Edits and previews LaTeX projects.
 * @tagname tp-latex-playground
 * @attr {string} src = "" - LaTeX source file or JSON project to load.
 * @attr {string} repository = "" - Directory containing a playground project.
 * @example
 * <tp-latex-playground><script type="tp/latex">\section{Hello}A formula $x^2$.</script></tp-latex-playground>
 *  @see tp-latex-viewer - Present editable examples with rendered and generated HTML views.
 * @see tp-latex - Render LaTeX directly in a page.
 */
export class TpLatexPlayground extends TpPlayground<TpLatexProject> {
	protected override createEmptyProject(): TpLatexProject {
		return new TpLatexProject({
			name: "LaTeX project",
			entry: "/main.tex",
			files: [
				{
					path: "/main.tex",
					language: "latex",
					content: String.raw`\documentclass{article}
\begin{document}
\section{Hello}A formula $x^2$.
\end{document}`,
				},
			],
		});
	}
	protected override createInitialProject(): TpLatexProject {
		const project = this.createEmptyProject();
		const scripts = this.querySelectorAll<HTMLScriptElement>(
			':scope > script[type="tp/latex"]',
		);
		for (const [index, script] of scripts.entries()) {
			const filename =
				script.getAttribute("filename")?.trim() ||
				(index === 0 ? "main.tex" : `document-${index + 1}.tex`);
			const path = filename.startsWith("/") ? filename : `/${filename}`;
			const file = {
				path,
				language: "latex",
				content: dedent(script.textContent ?? ""),
			};
			if (index === 0) {
				project.files = [];
				project.entry = path;
			}
			project.files.push(file);
		}
		return project;
	}
	protected override createClearProject(): TpLatexProject {
		return new TpLatexProject({ files: [] });
	}
	protected override normalizeProject(project: TpLatexProject): TpLatexProject {
		const next = project.clone();
		if (!next.entry) next.entry = this.resolveEntry(next) ?? undefined;
		return next;
	}
	protected override resolveEntry(project: TpLatexProject): string | null {
		return (
			(project.entry && project.findFile(project.entry)
				? project.entry
				: project.files.find((file) => /\.(tex|latex)$/i.test(file.path))
						?.path) ?? null
		);
	}
	protected override getPlaygroundKind(): string {
		return "latex";
	}
	protected override getLanguageIconName(): string {
		return "file_type_tex";
	}
	protected override getLanguageHelp(): string {
		return "<h2>LaTeX</h2><p>Documents render as interactive HTML with MathJax formulas and TikZ drawings.</p><p>Each .tex file can be selected as the entry document. Packages are limited to those supported by @tp/tp-latex.</p>";
	}
	protected override createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TpLatexProject {
		return new TpLatexProject({
			name: metadata.name ?? metadata.label ?? "LaTeX project",
			entry: metadata.entry,
			test: metadata.test,
			files,
		});
	}
	protected override async buildExecutionDocument(
		project: TpLatexProject,
	): Promise<TpExecutionDocument> {
		return buildLatexExecutionDocument(project);
	}
	protected override get exampleCategory(): string {
		return "playgrounds";
	}
	protected override get exampleGroup(): string {
		return "latex";
	}
}
if (!customElements.get("tp-latex-playground"))
	customElements.define("tp-latex-playground", TpLatexPlayground);
declare global {
	interface HTMLElementTagNameMap {
		"tp-latex-playground": TpLatexPlayground;
	}
}
