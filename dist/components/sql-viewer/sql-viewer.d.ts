/**
 * @module components/sql-viewer
 * @summary Compact SQL code viewer and runner.
 *
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-sql-playground
 * @summary SQL playground component.
 */
import "../sql-playground/sql-playground.js";
import { TpSqlPlayground } from "../sql-playground/sql-playground.js";
import type { TpSqlProject } from "../sql-playground/sql-project.js";
/**
 * @tagname tp-sql-viewer
 * @summary Displays and runs one SQL example in a compact interface.
 * @attr {string} repository = "" - Directory containing a project to load.
 * @attr {string} src = "" - JSON project or sql source file to load.
 * @event tp-playground-src-load Emitted after a project configured with `src` has loaded.
 * @eventdetail tp-playground-src-load { src: string; project: TpProject }
 * @event tp-playground-repository-load Emitted after a project configured with `repository` has loaded.
 * @eventdetail tp-playground-repository-load { repository: string; project: TpProject }
 * @example
 * <tp-sql-viewer></tp-sql-viewer>
 */
export declare class TpSqlViewer extends TpSqlPlayground {
    protected get viewerMode(): boolean;
    protected get usesViewerEditorTabs(): boolean;
    protected createInitialProject(): TpSqlProject;
    protected getViewerAdditionalFilePaths(project: TpSqlProject): readonly string[];
    protected resolveViewerPrimaryFile(project: TpSqlProject): string | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-sql-viewer": TpSqlViewer;
    }
}
