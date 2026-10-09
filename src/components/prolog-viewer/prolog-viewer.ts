/**
 * @module components/prolog-viewer
 * @summary Compact Prolog code viewer and runner.
 *
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-prolog-playground
 * @summary Prolog playground component.
 */
// tp-docgen:dependencies:end
import "../prolog-playground/prolog-playground.js";
import { dedent } from "../../utilities/code.js";
import { TpPrologPlayground } from "../prolog-playground/prolog-playground.js";
import { TpPrologProject } from "../prolog-playground/prolog-project.js";

/**
 * @tagname tp-prolog-viewer
 * @summary Displays and runs one Prolog example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or prolog source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @example
 * <tp-prolog-viewer>
 *       <script type="tp/prolog" filename="program.pl">
 *         parent(ada, byron).
 *         parent(byron, charles).
 *
 *         grandparent(Grandparent, Grandchild) :-
 *           parent(Grandparent, Parent),
 *           parent(Parent, Grandchild).
 *       </script>
 *       <script type="tp/prolog" filename="query.pl">
 *         grandparent(ada, Grandchild).
 *       </script>
 *     </tp-prolog-viewer>
 */
export class TpPrologViewer extends TpPrologPlayground {
	protected override get viewerMode(): boolean {
		return true;
	}
	protected override get usesViewerEditorTabs(): boolean {
		return true;
	}

	protected override createInitialProject(): TpPrologProject {
		const project = super.createInitialProject();
		const scripts = Array.from(
			this.querySelectorAll<HTMLScriptElement>(
				':scope > script:is([type="tp/prolog"], [type="tp/prolog-viewer"])',
			),
		);

		if (
			scripts.length > 0 &&
			scripts.every((script) => script.hasAttribute("filename"))
		) {
			const files = scripts.flatMap((script) => {
				const filename = script.getAttribute("filename")?.trim() ?? "";
				if (filename === "") return [];
				const path = filename.startsWith("/") ? filename : `/${filename}`;
				return [
					{
						path,
						language: "prolog",
						content: dedent(script.textContent ?? ""),
					},
				];
			});
			return new TpPrologProject({
				name: "Prolog viewer project",
				entry: files.find((file) => file.path === "/program.pl")?.path,
				query: files.find((file) => file.path === "/query.pl")?.path,
				files,
			});
		}

		if (scripts.length === 0) {
			const programPath = project.entry ?? "/program.pl";
			const queryPath = project.query ?? "/query.pl";
			project.entry = programPath;
			project.query = queryPath;

			for (const path of [programPath, queryPath]) {
				const file = project.findFile(path);
				if (file === undefined) {
					project.files.push({ path, language: "prolog", content: "" });
				} else {
					file.content = "";
				}
			}
		} else if (scripts.length === 1 && !scripts[0]?.hasAttribute("filename")) {
			const queryPath = project.query ?? "/query.pl";
			project.query = queryPath;
			const queryFile = project.findFile(queryPath);
			if (queryFile === undefined) {
				project.files.push({
					path: queryPath,
					language: "prolog",
					content: "",
				});
			} else {
				queryFile.content = "";
			}
		}

		return project;
	}

	protected override getViewerAdditionalFilePaths(
		project: TpPrologProject,
	): readonly string[] {
		return project.query === undefined ? [] : [project.query];
	}

	protected override resolveViewerPrimaryFile(
		project: TpPrologProject,
	): string | null {
		return (
			super.resolveViewerPrimaryFile(project) ??
			(project.query !== undefined &&
			project.findFile(project.query) !== undefined
				? project.query
				: null)
		);
	}
}

if (!customElements.get("tp-prolog-viewer")) {
	customElements.define("tp-prolog-viewer", TpPrologViewer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog-viewer": TpPrologViewer;
	}
}
