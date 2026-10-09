/** Data and reversible state for one-to-one category matching puzzles. */
export interface LogigramPuzzle {
    title: string;
    description?: string;
    categories: {
        name: string;
        items: string[];
    }[];
    clues: string[];
    /** One row per entity, one item per category, in category order. */
    solution: string[][];
}
export type LogigramMark = 0 | -1 | 1;
export interface LogigramCell {
    a: number;
    b: number;
    row: number;
    col: number;
}
export declare function parseLogigram(source: string): LogigramPuzzle;
export declare class LogigramModel {
    readonly puzzle: LogigramPuzzle;
    readonly cells: LogigramCell[];
    private marks;
    private past;
    private future;
    constructor(puzzle: LogigramPuzzle);
    get value(): LogigramMark[];
    get canUndo(): boolean;
    get canRedo(): boolean;
    expected(index: number): LogigramMark;
    set(index: number, mark: LogigramMark, autoExclude?: boolean): void;
    /** Applies assistance as one undoable move. */
    assist(action: "clear-incorrect" | "show-cell" | "show-block" | "show-solution", index?: number): void;
    undo(): void;
    redo(): void;
    reset(): void;
    check(): {
        correct: number;
        total: number;
        errors: number[];
        complete: boolean;
    };
}
/** Reads native markup lists after Markdown, AsciiDoc or RST conversion. */
export declare function readLogigramLists(root: ParentNode, title: string): LogigramPuzzle;
