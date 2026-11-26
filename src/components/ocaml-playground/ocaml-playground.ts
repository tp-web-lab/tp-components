/** @module components/ocaml-playground */

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
 * @credit Alcotest https://github.com/mirage/alcotest
 * @summary Typed OCaml tests, compiled for the browser and loaded on demand.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Js_of_ocaml https://ocsigen.org/js_of_ocaml/
 * @summary OCaml toplevel compiled to JavaScript, including the standard library and browser bindings.
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
import { buildOCamlExecutionDocument } from "./ocaml-execution-document.js";
/**
 * The custom `<tp-ocaml-playground>` element edits and runs an OCaml project.
 *
 * @summary Edits and runs an OCaml project.
 * @tagname tp-ocaml-playground
 * @attr {string} src = "" - JSON project or OCaml source file to load.
 * @attr {string} repository = "" - Project directory to load.
 * @keyboard {Shift+Enter} Run the current project.
 * @example
 * <tp-ocaml-playground src="/docs/components/_shared/intro-projects/ocaml.json"></tp-ocaml-playground>
 */
export class TpOCamlPlayground extends TpPlayground<TpProject> {
	/** Restores the source and releases this notebook's shared OCaml session. */
	public override reset(): void {
		const scope = this.getAttribute("execution-scope");
		const owner = this.ownerDocument.defaultView as
			| (Window & {
					__tpOCamlSessions?: Map<
						string,
						{
							session?: { dispose(): void };
							queue: Promise<unknown>;
							disposed?: boolean;
						}
					>;
			  })
			| null;
		const state = scope ? owner?.__tpOCamlSessions?.get(scope) : undefined;
		if (state && scope) {
			state.disposed = true;
			owner?.__tpOCamlSessions?.delete(scope);
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
				':scope > script:is([type="tp/ocaml"],[type="tp/ocaml-viewer"])',
			);
			const filename = first?.getAttribute("filename")?.trim();
			if (filename) {
				const path = filename.startsWith("/") ? filename : `/${filename}`;
				if (project.findFile(path)) {
					project.entry = path;
					if (
						path !== "/main.ml" &&
						!this.querySelector(
							'script[filename="main.ml"],script[filename="/main.ml"]',
						)
					)
						project.files = project.files.filter(
							(file) => file.path !== "/main.ml",
						);
				}
			}
		}
		return project;
	}

	protected override createEmptyProject(): TpProject {
		return new TpProject({
			name: "OCaml project",
			entry: "/main.ml",
			files: [
				{
					path: "/main.ml",
					language: "ocaml",
					content: 'print_endline "Hello from OCaml";;',
				},
			],
		});
	}
	protected override getPlaygroundKind(): string {
		return "ocaml";
	}
	protected override getLanguageIconName(): string {
		return "file_type_ocaml";
	}
	protected override getLanguageHelp(): string {
		return '<h2>OCaml</h2><p>OCaml runs in the browser with Js_of_ocaml.</p><a href="https://ocsigen.org/js_of_ocaml/" target="_blank" rel="noreferrer">Js_of_ocaml documentation</a>';
	}
	protected override resolveEntry(project: TpProject): string | null {
		return (
			project.entry ??
			project.files.find(
				(f) => /\.(ml)$/i.test(f.path) && !f.path.includes(".test."),
			)?.path ??
			null
		);
	}
	protected override async buildExecutionDocument(
		project: TpProject,
	): Promise<TpExecutionDocument> {
		const next = project.clone();
		next.entry = this.resolveEntry(next) ?? undefined;
		return buildOCamlExecutionDocument(
			next,
			this.getAttribute("execution-scope") ?? "",
			false,
			this.viewerMode,
		);
	}
	protected override async buildTestDocument(
		project: TpProject,
	): Promise<TpExecutionDocument> {
		const next = project.clone();
		next.entry = this.resolveEntry(next) ?? undefined;
		return buildOCamlExecutionDocument(next, "", true);
	}
}
if (!customElements.get("tp-ocaml-playground"))
	customElements.define("tp-ocaml-playground", TpOCamlPlayground);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml-playground": TpOCamlPlayground;
	}
}
