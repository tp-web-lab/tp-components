/**
 * @module components/icon/vite
 * @summary Intégration Vite pour charger automatiquement des icônes SVG.
 */

import { registerTpIconLibrary } from './icon-registry.js';

/**
 * Forme attendue du résultat d’un
 * `import.meta.glob(..., { query: '?raw', import: 'default', eager: true })`.
 *
 * La clé est le chemin du fichier.
 * La valeur est le contenu brut du SVG.
 *
 * Exemple :
 *
 * ```ts
 * {
 *   '/src/icons/flags/cif-fr.svg': '<svg ...></svg>',
 *   '/src/icons/flags/cif-de.svg': '<svg ...></svg>',
 * }
 * ```
 *
 * @summary Objet retourné par Vite pour un glob SVG chargé en brut.
 */
export type TpIconGlobModules = Record<string, string>;

/**
 * Modes de normalisation du nom final d’une icône.
 *
 * - `none` : conserve le nom tel quel
 * - `kebab` : produit un nom en kebab-case
 * - `camel` : produit un nom en camelCase
 *
 * @summary Stratégie de normalisation des noms d’icônes importées.
 */
export type TpIconNameNormalization = 'none' | 'kebab' | 'camel';

/**
 * Options de transformation utilisées par `registerTpIconLibraryFromGlob()`.
 *
 * @summary Options de conversion chemin → nom d’icône pour un glob Vite.
 */
export type RegisterTpIconLibraryFromGlobOptions = {
  /**
   * Préfixe à retirer du chemin complet avant toute autre transformation.
   *
   * Exemple :
   * - chemin : `/src/icons/mdi/home.svg`
   * - `stripPrefix: '/src/icons/mdi/'`
   * - résultat intermédiaire : `home.svg`
   */
  stripPrefix?: string;

  /**
   * Suffixe à retirer du nom intermédiaire.
   *
   * Le cas le plus courant est `.svg`.
   *
   * Exemple :
   * - `home.svg` → `home`
   */
  stripSuffix?: string;

  /**
   * Préfixe à retirer du nom de fichier métier.
   *
   * Exemples :
   * - `cif-fr` → `fr`
   * - `file_type_html` → `html`
   */
  namePrefix?: string;

  /**
   * Normalisation appliquée au nom final.
   *
   * - `none` : ne change rien
   * - `kebab` : `alert_circle` → `alert-circle`
   * - `camel` : `alert-circle` → `alertCircle`
   *
   * @default 'none'
   */
  normalize?: TpIconNameNormalization;

  /**
   * Fonction personnalisée de transformation chemin → nom d’icône.
   *
   * Si cette fonction est fournie, elle est prioritaire et remplace
   * la chaîne de transformations automatique (`stripPrefix`, `stripSuffix`,
   * `namePrefix`, `normalize`).
   *
   * @param path Chemin original du fichier issu du glob.
   * @returns Le nom d’icône final.
   */
  fileNameToIconName?: (path: string) => string;
};

/**
 * Extrait un nom de fichier par défaut à partir d’un chemin.
 *
 * Transformations appliquées :
 * - normalisation des séparateurs Windows `\` en `/`
 * - extraction du dernier segment
 * - suppression de l’extension `.svg`
 *
 * Exemples :
 * - `/src/icons/mdi/home.svg` → `home`
 * - `C:\icons\alert-circle.svg` → `alert-circle`
 *
 * @summary Convertit un chemin de fichier en nom d’icône par défaut.
 * @param path Chemin brut du fichier.
 * @returns Le nom de fichier sans extension `.svg`.
 * @internal
 */
function defaultFileNameToIconName(path: string): string {
  const normalized = path.replace(/\\/g, '/');
  const fileName = normalized.split('/').pop() ?? normalized;
  return fileName.replace(/\.svg$/i, '');
}

/**
 * Découpe une chaîne en mots normalisés en minuscules.
 *
 * Cette fonction sert de base à la normalisation `kebab` et `camel`.
 *
 * Transformations appliquées :
 * - séparation des transitions `camelCase` / `PascalCase`
 * - remplacement des séparateurs `_`, `-` et espaces
 * - trim
 * - passage en minuscules
 *
 * Exemples :
 * - `AlertCircle` → `['alert', 'circle']`
 * - `alert_circle` → `['alert', 'circle']`
 * - `alert-circle` → `['alert', 'circle']`
 *
 * @summary Découpe un nom brut en mots normalisés.
 * @param value Chaîne source.
 * @returns Tableau de mots normalisés.
 * @internal
 */
function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-\s]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((part) => part !== '')
    .map((part) => part.toLowerCase());
}

/**
 * Normalise un nom d’icône selon le mode demandé.
 *
 * Modes :
 * - `none` : conserve la valeur telle quelle
 * - `kebab` : joint les mots avec `-`
 * - `camel` : premier mot en minuscule, suivants en PascalCase
 *
 * Exemples :
 * - `file_type_html` + `kebab` → `file-type-html`
 * - `alert-circle` + `camel` → `alertCircle`
 *
 * @summary Normalise un nom d’icône.
 * @param value Nom source à normaliser.
 * @param mode Mode de normalisation.
 * @returns Le nom normalisé.
 * @internal
 */
function normalizeIconName(
  value: string,
  mode: TpIconNameNormalization,
): string {
  if (mode === 'none') {
    return value;
  }

  const words = splitWords(value);

  if (words.length === 0) {
    return '';
  }

  if (mode === 'kebab') {
    return words.join('-');
  }

  return words
    .map((word, index) => {
      if (index === 0) {
        return word;
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join('');
}

/**
 * Enregistre une bibliothèque d'icônes SVG à partir d'un `import.meta.glob` Vite.
 *
 * Compatible avec :
 *
 * ```ts
 * import.meta.glob('...', {
 *   query: '?raw',
 *   import: 'default',
 *   eager: true,
 * })
 * ```
 *
 * ## Pipeline de transformation par défaut
 *
 * Si `fileNameToIconName` n’est pas fourni, les étapes suivantes sont appliquées :
 *
 * 1. retrait éventuel de `stripPrefix`
 * 2. retrait éventuel de `stripSuffix`
 * 3. fallback sur le nom de fichier sans extension si rien n’a changé
 * 4. retrait éventuel de `namePrefix`
 * 5. normalisation éventuelle via `normalize`
 *
 * ## Exemple
 *
 * ```ts
 * const flags = import.meta.glob('/src/icons/flags/*.svg', {
 *   query: '?raw',
 *   import: 'default',
 *   eager: true,
 * });
 *
 * registerTpIconLibraryFromGlob('flags', flags, {
 *   stripPrefix: '/src/icons/flags/',
 *   stripSuffix: '.svg',
 *   namePrefix: 'cif-',
 *   normalize: 'none',
 * });
 * ```
 *
 * Résultat :
 * - `cif-fr.svg` → `fr`
 * - `cif-de.svg` → `de`
 *
 * @summary Enregistre une bibliothèque d’icônes à partir d’un glob Vite.
 * @param libraryName Nom de la bibliothèque à enregistrer.
 * @param modules Objet issu de `import.meta.glob` avec contenu SVG brut.
 * @param options Options de transformation des noms.
 */
export function registerTpIconLibraryFromGlob(
  libraryName: string,
  modules: TpIconGlobModules,
  options: RegisterTpIconLibraryFromGlobOptions = {},
): void {
  const icons: Record<string, string> = {};

  for (const [path, rawSvg] of Object.entries(modules)) {
    let iconName: string;

    if (options.fileNameToIconName !== undefined) {
      iconName = options.fileNameToIconName(path);
    } else {
      iconName = path;

      if (
        options.stripPrefix !== undefined &&
        iconName.startsWith(options.stripPrefix)
      ) {
        iconName = iconName.slice(options.stripPrefix.length);
      }

      if (
        options.stripSuffix !== undefined &&
        iconName.endsWith(options.stripSuffix)
      ) {
        iconName = iconName.slice(0, -options.stripSuffix.length);
      }

      if (iconName === path) {
        iconName = defaultFileNameToIconName(path);
      }

      if (
        options.namePrefix !== undefined &&
        iconName.startsWith(options.namePrefix)
      ) {
        iconName = iconName.slice(options.namePrefix.length);
      }

      iconName = normalizeIconName(iconName, options.normalize ?? 'none');
    }

    if (iconName !== '') {
      icons[iconName] = rawSvg;
    }
  }

  registerTpIconLibrary(libraryName, icons);
}