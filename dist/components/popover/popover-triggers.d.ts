/**
 * Initialise les triggers externes de tp-popover sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-popover-action="show|hide|toggle"`
 * - `data-tp-popover-target="<sélecteur CSS>"`
 *
 * Attribut optionnel :
 * - `data-tp-popover-exclusive`
 */
export declare function setupTpPopoverTriggers(root?: ParentNode): void;
/**
 * Nettoie les triggers externes pour un root donné.
 */
export declare function teardownTpPopoverTriggers(root?: ParentNode): void;
