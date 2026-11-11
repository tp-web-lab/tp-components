import type { LogigramCell, LogigramMark, LogigramPuzzle } from "./logigram-model.js";
/** Derives certain associations from player marks, never from the authored solution. */
export declare function deriveLogigramResults(categories: LogigramPuzzle["categories"], cells: readonly LogigramCell[], marks: readonly LogigramMark[]): {
    rows: (string | null)[][];
    conflict: boolean;
};
