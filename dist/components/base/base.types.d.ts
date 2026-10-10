/**
 * @module base/types
 * @summary Types partagés par les composants `tp-*`.
 */
/**
 * Variantes visuelles communes aux composants de statut et d’action.
 *
 * @summary Représente une variante visuelle standardisée.
 */
export type TpVariantType = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'brand';
/**
 * Tailles communes aux composants de la bibliothèque.
 *
 * Les valeurs sont ordonnées de la plus petite à la plus grande.
 *
 * @summary Représente une taille standardisée.
 */
export type TpSizeType = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
/**
 * Vérifie si une chaîne correspond à une variante valide.
 *
 * @summary Vérifie une variante visuelle.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est une variante valide.
 */
export declare function isTpVariantType(value: string): value is TpVariantType;
/**
 * Vérifie si une chaîne correspond à une taille valide.
 *
 * @summary Vérifie une taille standardisée.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est une taille valide.
 */
export declare function isTpSizeType(value: string): value is TpSizeType;
/**
 * Modes de sens de lecture gérés par `<tp-dir>`.
 *
 * - `ltr` — gauche à droite
 * - `rtl` — droite à gauche
 * - `auto` — détection automatique depuis `lang` ou `dir` de la racine du document
 *
 * @summary Mode de direction textuelle.
 */
export type TpDirType = 'ltr' | 'rtl' | 'auto';
/**
 * Vérifie si une chaîne correspond à un mode de direction valide.
 *
 * @summary Vérifie un mode de direction.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est un mode valide.
 */
export declare function isTpDirType(value: string): value is TpDirType;
