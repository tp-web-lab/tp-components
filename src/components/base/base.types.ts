/**
 * @module base/types
 * @summary Types partagés par les composants `tp-*`.
 */

/**
 * Variantes visuelles communes aux composants de statut et d’action.
 *
 * @summary Représente une variante visuelle standardisée.
 */
export type TpVariantType =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral'
  | 'brand';

/**
 * Tailles communes aux composants de la bibliothèque.
 *
 * Les valeurs sont ordonnées de la plus petite à la plus grande.
 *
 * @summary Représente une taille standardisée.
 */
export type TpSizeType =
  | 'xxs'
  | 'xs'
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | 'xxl';

/**
 * Vérifie si une chaîne correspond à une variante valide.
 *
 * @summary Vérifie une variante visuelle.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est une variante valide.
 */
export function isTpVariantType(value: string): value is TpVariantType {
  return (
    value === 'success' ||
    value === 'danger' ||
    value === 'warning' ||
    value === 'info' ||
    value === 'neutral' ||
    value === 'brand'
  );
}

/**
 * Vérifie si une chaîne correspond à une taille valide.
 *
 * @summary Vérifie une taille standardisée.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est une taille valide.
 */
export function isTpSizeType(value: string): value is TpSizeType {
  return (
    value === 'xxs' ||
    value === 'xs' ||
    value === 's' ||
    value === 'm' ||
    value === 'l' ||
    value === 'xl' ||
    value === 'xxl'
  );
}

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
export function isTpDirType(value: string): value is TpDirType {
  return value === 'ltr' || value === 'rtl' || value === 'auto';
}
