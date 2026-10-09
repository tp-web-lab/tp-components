/**
 * @module components/copy-code/setup
 * @summary Utilitaires d’installation et de suppression automatique de boutons `<tp-copy-code>`.
 */
import './copy-code.js';
import type { TpCopyCode } from './copy-code.js';
/**
 * Options de configuration de `setupTpCopyCodeButtons()`.
 *
 * @summary Options d’installation des boutons de copie.
 */
export type SetupTpCopyCodeButtonsOptions = {
    /**
     * Sélecteur des cibles auxquelles ajouter un bouton.
     *
     * @default 'tp-code-editor, tp-html'
     */
    selector?: string;
    /**
     * Nom de l’icône affichée à l’état normal.
     *
     * @default 'copy'
     */
    icon?: string;
    /**
     * Nom de l’icône affichée après une copie réussie.
     *
     * @default 'check'
     */
    successIcon?: string;
    /**
     * Nom de l’icône affichée après une erreur.
     *
     * @default 'warning'
     */
    errorIcon?: string;
    /**
     * Texte affiché dans le tooltip après une copie réussie.
     *
     * @default 'Copied!'
     */
    copiedText?: string;
};
/**
 * Options de configuration de `teardownTpCopyCodeButtons()`.
 *
 * @summary Options de suppression des boutons de copie.
 */
export type TeardownTpCopyCodeButtonsOptions = {
    /**
     * Sélecteur des conteneurs à nettoyer.
     *
     * @default 'tp-code-editor, tp-html'
     */
    selector?: string;
};
/**
 * Attache dynamiquement un bouton `<tp-copy-code>` à une cible donnée.
 *
 * Le bouton est inséré comme enfant direct de la cible,
 * afin de pouvoir être positionné relativement à celle-ci.
 *
 * Si un bouton généré existe déjà, aucun nouveau bouton n’est créé.
 *
 * @summary Attache un bouton de copie à une cible.
 * @param target Élément cible.
 * @param options Options de configuration du bouton.
 * @returns Le bouton créé, ou `null` si un bouton généré existait déjà.
 */
export declare function attachTpCopyCodeButton(target: HTMLElement, options?: SetupTpCopyCodeButtonsOptions): TpCopyCode | null;
/**
 * Installe automatiquement un bouton `<tp-copy-code>` sur toutes les cibles
 * correspondant au sélecteur fourni.
 *
 * Le bouton est généré une seule fois par cible.
 *
 * @summary Installe automatiquement des boutons de copie sur un ensemble de cibles.
 * @param options Options d’installation.
 * @returns Tableau des boutons créés.
 */
export declare function setupTpCopyCodeButtons(options?: SetupTpCopyCodeButtonsOptions): TpCopyCode[];
/**
 * Supprime les boutons `<tp-copy-code>` générés automatiquement.
 *
 * Seuls les boutons marqués avec `data-tp-copy-code-generated`
 * sont supprimés. Les boutons déclarés manuellement dans le HTML
 * ne sont pas affectés.
 *
 * @summary Supprime les boutons ajoutés par `setupTpCopyCodeButtons()`.
 * @param options Options de suppression.
 */
export declare function teardownTpCopyCodeButtons(options?: TeardownTpCopyCodeButtonsOptions): void;
