/**
 * Initialise les triggers externes de tp-tooltip sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-tooltip-action="show|hide|toggle"`
 * - `data-tp-tooltip-target="<sélecteur CSS>"`
 */
export declare function setupTpTooltipTriggers(root?: ParentNode): void;
/**
 * Nettoie les triggers externes pour un root donné.
 */
export declare function teardownTpTooltipTriggers(root?: ParentNode): void;
