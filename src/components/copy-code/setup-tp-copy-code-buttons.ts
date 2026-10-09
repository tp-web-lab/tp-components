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

  /**
   *
   * @default false
   */
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
 * Vérifie si une cible possède déjà un bouton de copie généré automatiquement.
 *
 * Seuls les boutons marqués avec `data-tp-copy-code-generated`
 * sont considérés comme générés par ces helpers.
 *
 * @summary Détecte la présence d’un bouton généré.
 * @param target Élément cible.
 * @returns `true` si un bouton généré est déjà présent.
 * @internal
 */
function hasGeneratedCopyButton(target: HTMLElement): boolean {
  return (
    target.querySelector(
      ':scope > tp-copy-code[data-tp-copy-code-generated]',
    ) !== null
  );
}

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
export function attachTpCopyCodeButton(
  target: HTMLElement,
  options: SetupTpCopyCodeButtonsOptions = {},
): TpCopyCode | null {
  if (hasGeneratedCopyButton(target)) {
    return null;
  }

  const button = document.createElement('tp-copy-code') as TpCopyCode;
  button.setAttribute('data-tp-copy-code-generated', '');

  if (options.icon !== undefined && options.icon !== '') {
    button.setAttribute('icon', options.icon);
  }

  if (options.successIcon !== undefined && options.successIcon !== '') {
    button.setAttribute('success-icon', options.successIcon);
  }

  if (options.errorIcon !== undefined && options.errorIcon !== '') {
    button.setAttribute('error-icon', options.errorIcon);
  }

  if (options.copiedText !== undefined && options.copiedText !== '') {
    button.setAttribute('copied-text', options.copiedText);
  }

  button.forElement = target;
  target.append(button);

  return button;
}

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
export function setupTpCopyCodeButtons(
  options: SetupTpCopyCodeButtonsOptions = {},
): TpCopyCode[] {
  const selector = options.selector ?? 'tp-code-editor, tp-html';

  const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const created: TpCopyCode[] = [];

  for (const target of targets) {
    const button = attachTpCopyCodeButton(target, options);

    if (button !== null) {
      created.push(button);
    }
  }

  return created;
}

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
export function teardownTpCopyCodeButtons(
  options: TeardownTpCopyCodeButtonsOptions = {},
): void {
  const selector = options.selector ?? 'tp-code-editor, tp-html';
  const targets = document.querySelectorAll<HTMLElement>(selector);

  for (const target of targets) {
    const buttons = target.querySelectorAll<TpCopyCode>(
      ':scope > tp-copy-code[data-tp-copy-code-generated]',
    );

    for (const button of buttons) {
      button.remove();
    }
  }
}