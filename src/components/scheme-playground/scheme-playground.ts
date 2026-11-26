/** @module components/scheme-playground */
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
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
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
 * @credit LIPS https://lips.js.org/
 * @summary Scheme execution in JavaScript with its standard library.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit SRFI-64 https://srfi.schemers.org/srfi-64/srfi-64.html
 * @summary Scheme test-suite reference implementation, loaded on demand.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import {
	type TpExecutionDocument,
	TpPlayground,
} from "../playground/playground.js";
import { TpProject } from "../playground/project.js";
import { buildSchemeExecutionDocument } from "./scheme-execution-document.js";
/**
 * The custom `<tp-scheme-playground>` element edits and runs a Scheme project with LIPS.
 *
 * @summary Edits and runs a Scheme project with LIPS.
 * @tagname tp-scheme-playground
 * @attr {string} src = "" - JSON project or Scheme source file to load.
 * @attr {string} repository = "" - Project directory to load.
 * @keyboard {Shift+Enter} Run the current project.
 * @example
 * <tp-scheme-playground src="/docs/components/_shared/intro-projects/scheme.json"></tp-scheme-playground>
 */
export class TpSchemePlayground extends TpPlayground<TpProject> {
	/** Restores the source and releases this notebook's shared Scheme session. */
	public override reset(): void {
		const scope = this.getAttribute("execution-scope");
		const owner = this.ownerDocument.defaultView as
			| (Window & {
					__tpSchemeSessions?: Map<
						string,
						{
							session?: { dispose(): void };
							queue: Promise<unknown>;
							disposed?: boolean;
						}
					>;
			  })
			| null;
		const state = scope ? owner?.__tpSchemeSessions?.get(scope) : undefined;
		if (state && scope) {
			state.disposed = true;
			owner?.__tpSchemeSessions?.delete(scope);
			void state.queue.finally(() => state.session?.dispose());
		}
		super.reset();
	}

	protected override get supportsTestExecution(): boolean {
		return true;
	}
	protected override createInitialProject(): TpProject {
		const project = super.createInitialProject();
		if (this.viewerMode) {
			const first = this.querySelector<HTMLScriptElement>(
				':scope > script:is([type="tp/scheme"],[type="tp/scheme-viewer"])',
			);
			const filename = first?.getAttribute("filename")?.trim();
			if (filename) {
				const path = filename.startsWith("/") ? filename : `/${filename}`;
				if (project.findFile(path)) {
					project.entry = path;
					if (
						path !== "/main.scm" &&
						!this.querySelector(
							'script[filename="main.scm"],script[filename="/main.scm"]',
						)
					)
						project.files = project.files.filter(
							(file) => file.path !== "/main.scm",
						);
				}
			}
		}
		return project;
	}

	protected override createEmptyProject(): TpProject {
		return new TpProject({
			name: "Scheme project",
			entry: "/main.scm",
			files: [
				{
					path: "/main.scm",
					language: "scheme",
					content: '(display "Hello from Scheme")\n(newline)',
				},
			],
		});
	}
	protected override getPlaygroundKind(): string {
		return "scheme";
	}
	protected override getLanguageIconName(): string {
		return "file_type_scheme";
	}
	protected override getLanguageHelp(): string {
		return '<h2>Scheme</h2><p>Scheme runs in the browser with LIPS.</p><a href="https://lips.js.org/docs/intro" target="_blank" rel="noreferrer">LIPS documentation</a>';
	}
	protected override resolveEntry(project: TpProject): string | null {
		return (
			project.entry ??
			project.files.find(
				(f) => /\.(scm|ss|sld)$/i.test(f.path) && !f.path.includes(".test."),
			)?.path ??
			null
		);
	}
	protected override async buildExecutionDocument(
		project: TpProject,
	): Promise<TpExecutionDocument> {
		const next = project.clone();
		next.entry = this.resolveEntry(next) ?? undefined;
		return buildSchemeExecutionDocument(
			next,
			this.getAttribute("execution-scope") ?? "",
		);
	}
	protected override async buildTestDocument(
		project: TpProject,
	): Promise<TpExecutionDocument> {
		const next = project.clone();
		next.entry = this.resolveEntry(next) ?? undefined;
		return buildSchemeExecutionDocument(next, "", true);
	}
}
if (!customElements.get("tp-scheme-playground"))
	customElements.define("tp-scheme-playground", TpSchemePlayground);
declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme-playground": TpSchemePlayground;
	}
}
