/** Pure Kakuro parsing, constraint validation and bounded solution search. */
export interface KakuroCell {
    row: number;
    col: number;
    white: boolean;
    given: number;
    down: number;
    across: number;
    runs: number[];
}
export interface KakuroRun {
    total: number;
    cells: number[];
    direction: "across" | "down";
}
export interface KakuroGrid {
    rows: number;
    columns: number;
    cells: KakuroCell[];
    runs: KakuroRun[];
}
/** Parses whitespace-separated rows: #, ., fixed digits, or down/across clues. */
export declare function parseKakuro(source: string): KakuroGrid;
/** Returns cells in runs whose current digits cannot meet the sum without repetition. */
export declare function kakuroConflicts(grid: KakuroGrid, values: readonly number[]): Set<number>;
/** Finds a completion consistent with values, or null. Caps search to protect the browser. */
export declare function solveKakuro(grid: KakuroGrid, initial: readonly number[], limit?: number): number[] | null;
