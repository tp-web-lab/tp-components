/** Cell contents grouped by row; original nodes can be moved without serialization. */
export type ContentTableRows = Node[][][];
/** Creates a semantic table, padding short rows and optionally promoting its first row. */
export declare function createContentTable(rows: ContentTableRows, heading: boolean, owner: Document): HTMLTableElement;
