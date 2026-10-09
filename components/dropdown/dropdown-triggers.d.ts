/**
 * @module components/dropdown/dropdown-triggers
 * @summary External triggers for the `<tp-dropdown>` component.
 */
/**
 * Initialise les triggers externes de tp-dropdown sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-dropdown-action="show|hide|toggle"`
 * - `data-tp-dropdown-target="<sélecteur CSS>"`
 *
 * Attribut optionnel :
 * - `data-tp-dropdown-exclusive`
 */
export declare function setupTpDropdownTriggers(root?: ParentNode): void;
/**
 * Nettoie les triggers externes pour un root donné.
 */
export declare function teardownTpDropdownTriggers(root?: ParentNode): void;
