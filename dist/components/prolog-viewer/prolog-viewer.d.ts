/**
 * @module components/prolog-viewer
 * @summary Compact Prolog code viewer and runner.
 *
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-prolog-playground
 * @summary Prolog playground component.
 */
import "../prolog-playground/prolog-playground.js";
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
export declare class TpPrologViewer extends TpPrologPlayground {
    protected get viewerMode(): boolean;
    protected get usesViewerEditorTabs(): boolean;
    protected createInitialProject(): TpPrologProject;
    protected getViewerAdditionalFilePaths(project: TpPrologProject): readonly string[];
    protected resolveViewerPrimaryFile(project: TpPrologProject): string | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-prolog-viewer": TpPrologViewer;
    }
}
