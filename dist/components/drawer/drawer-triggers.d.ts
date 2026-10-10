/**
 * @module components/drawer/drawer-triggers
 * @summary External triggers for the `<tp-drawer>` component.
 */
/**
 * Initialise les triggers externes de tp-drawer sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-drawer-action="show|hide|toggle"`
 * - `data-tp-drawer-target="<sélecteur CSS>"`
 */
export declare function setupTpDrawerTriggers(root?: ParentNode): void;
/**
 * Nettoie les triggers externes pour un root donné.
 */
export declare function teardownTpDrawerTriggers(root?: ParentNode): void;
