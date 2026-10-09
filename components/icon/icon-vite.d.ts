/**
 * @module components/icon/vite
 * @summary Intégration Vite pour charger automatiquement des icônes SVG.
 */
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
 *   '/tp-components/icons/flags/cif-fr.svg': '<svg ...></svg>',
 *   '/tp-components/icons/flags/cif-de.svg': '<svg ...></svg>',
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
     * - chemin : `/tp-components/icons/mdi/home.svg`
     * - `stripPrefix: '/tp-components/icons/mdi/'`
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
 * const flags = import.meta.glob('/tp-components/icons/flags/*.svg', {
 *   query: '?raw',
 *   import: 'default',
 *   eager: true,
 * });
 *
 * registerTpIconLibraryFromGlob('flags', flags, {
 *   stripPrefix: '/tp-components/icons/flags/',
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
export declare function registerTpIconLibraryFromGlob(libraryName: string, modules: TpIconGlobModules, options?: RegisterTpIconLibraryFromGlobOptions): void;
