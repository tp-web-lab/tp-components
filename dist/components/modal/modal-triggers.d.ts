/**
 * @module components/modal/modal-triggers
 * @summary External triggers for the `<tp-modal>` component.
 */
/**
 * Initialise les triggers externes de tp-modal sur un root donné.
 *
 * Attributs attendus :
 * - `data-tp-modal-action="show|hide|toggle"`
 * - `data-tp-modal-target="<sélecteur CSS>"`
 */
export declare function setupTpModalTriggers(root?: ParentNode): void;
/**
 * Nettoie les triggers externes pour un root donné.
 */
export declare function teardownTpModalTriggers(root?: ParentNode): void;
