import type { EditorState, Extension } from "@codemirror/state";
import "../tooltip/tooltip.js";
/** One numbered marker located inside a parsed language comment. */
export interface CodeCommentMarker {
    /** Inclusive document offset. */
    from: number;
    /** Exclusive document offset. */
    to: number;
    /** One-based annotation number. */
    number: number;
}
/** Finds explicit markers in comments without treating strings or code as annotations. */
export declare function findCodeCommentMarkers(state: EditorState, numbers: ReadonlySet<number>): CodeCommentMarker[];
/** Adds live SVG decorations for the annotation numbers supplied by linked lists. */
export declare function codeCommentMarkers(numbers: ReadonlySet<number>, comments?: ReadonlyMap<number, HTMLElement>): Extension;
