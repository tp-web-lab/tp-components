/**
 * Initialise les triggers externes de tp-splitter sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-splitter-action="reset"`
 * - `data-tp-splitter-target="<sélecteur CSS>"`
 */
export declare function setupTpSplitterTriggers(root?: ParentNode): void;
/**
 * Nettoie les triggers externes pour un root donné.
 */
export declare function teardownTpSplitterTriggers(root?: ParentNode): void;
