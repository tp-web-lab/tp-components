/**
 * Initialise les contrôles tp-iframe sur un root donné.
 *
 * - idempotent : plusieurs appels sur le même root n’ajoutent qu’un seul listener
 * - supporte document, shadowRoot, ou n’importe quel conteneur
 */
export declare function setupTpIframeControls(root?: ParentNode): void;
/**
 * Nettoie les contrôles pour un root donné.
 *
 * Utile pour tests ou teardown d’app.
 */
export declare function teardownTpIframeControls(root?: ParentNode): void;
