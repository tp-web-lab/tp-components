/**
 * @module components/icon/registry
 * @summary Global SVG icon registry used by `<tp-icon>`.
 */

/**
 * Nom d’une bibliothèque d’icônes.
 *
 * Exemples :
 * - `tp`
 * - `mdi`
 * - `flags`
 * - `languages`
 *
 * @summary Identifiant textuel d’une bibliothèque d’icônes.
 */
export type TpIconLibraryName = string;

/**
 * Nom d’une icône à l’intérieur d’une bibliothèque.
 *
 * Exemples :
 * - `close`
 * - `home`
 * - `fr`
 * - `html`
 *
 * @summary Identifiant textuel d’une icône dans une bibliothèque.
 */
export type TpIconName = string;

/**
 * Contenu SVG brut d’une icône.
 *
 * La valeur attendue est généralement une chaîne commençant par `<svg ...>`.
 *
 * @summary Chaîne SVG brute représentant une icône.
 */
export type TpIconSvg = string;

/**
 * Représentation interne d’une bibliothèque d’icônes.
 *
 * La clé est le nom de l’icône.
 * La valeur est son SVG brut.
 *
 * @summary Structure interne de stockage d’une bibliothèque d’icônes.
 * @internal
 */
type TpIconLibrary = Map<TpIconName, TpIconSvg>;

/**
 * Registre global partagé entre toutes les instances/modules.
 *
 * Important avec Vite/HMR : plusieurs imports du registre peuvent sinon créer
 * plusieurs `Map` différentes.
 *
 * @summary Stockage singleton global du registre d’icônes.
 * @internal
 */
const globalRegistryKey = '__tpIconLibraries__' as const;

type TpIconRegistryGlobal = typeof globalThis & {
  [globalRegistryKey]?: Map<TpIconLibraryName, TpIconLibrary>;
};

const globalScope = globalThis as TpIconRegistryGlobal;

const libraries: Map<TpIconLibraryName, TpIconLibrary> =
  globalScope[globalRegistryKey] ??
  new Map<TpIconLibraryName, TpIconLibrary>();

globalScope[globalRegistryKey] = libraries;


/**
 * Enregistre une bibliothèque complète d'icônes SVG.
 *
 * Si une bibliothèque du même nom existe déjà, elle est entièrement remplacée.
 *
 * @summary Enregistre ou remplace une bibliothèque complète d’icônes.
 * @param name Nom de la bibliothèque à enregistrer.
 * @param icons Dictionnaire simple `{ nomIcône: svg }`.
 */
export function registerTpIconLibrary(
  name: TpIconLibraryName,
  icons: Record<string, string>,
): void {
  const library =
    libraries?.get(name) ?? new Map<TpIconName, TpIconSvg>();

  for (const [iconName, svg] of Object.entries(icons)) {
    library.set(iconName, svg);
  }

  libraries?.set(name, library);

  window.dispatchEvent(
    new CustomEvent('tp-icon-library-registered', {
      detail: { library: name },
    }),
  );
}

/**
 * Enregistre une seule icône SVG dans une bibliothèque.
 *
 * Si la bibliothèque n’existe pas encore, elle est créée.
 * Si une icône du même nom existe déjà dans cette bibliothèque,
 * elle est remplacée.
 *
 * @summary Enregistre une seule icône dans une bibliothèque.
 * @param name Nom de l’icône à enregistrer.
 * @param svg Contenu SVG brut de l’icône.
 * @param library Bibliothèque cible.
 * @default library 'tp'
 */
export function registerTpIcon(
  name: TpIconName,
  svg: TpIconSvg,
  library = 'tp',
): void {
  const existing = libraries?.get(library) ?? new Map<TpIconName, TpIconSvg>();
  existing.set(name, svg);
  libraries?.set(library, existing);
  window.dispatchEvent(new CustomEvent('tp-icon-library-registered', { detail: { library } }));
}

/**
 * Retourne le SVG d'une icône ou `null` si elle est absente.
 *
 * @summary Recherche une icône dans une bibliothèque.
 * @param name Nom de l’icône recherchée.
 * @param library Bibliothèque dans laquelle effectuer la recherche.
 * @returns Le SVG brut de l’icône, ou `null` si elle n’existe pas.
 * @default library 'tp'
 */
export function getTpIcon(
  name: TpIconName,
  library = 'tp',
): TpIconSvg | null {
  const existing = libraries.get(library);
  if (existing === undefined) {
    return null;
  }

  return existing.get(name) ?? null;
}

/**
 * Indique si une icône existe dans une bibliothèque.
 *
 * @summary Vérifie la présence d’une icône dans une bibliothèque.
 * @param name Nom de l’icône recherchée.
 * @param library Bibliothèque dans laquelle effectuer la recherche.
 * @returns `true` si l’icône existe, sinon `false`.
 * @default library 'tp'
 */
export function hasTpIcon(
  name: TpIconName,
  library = 'tp',
): boolean {
  return getTpIcon(name, library) !== null;
}

/**
 * Retourne la liste triée des noms d'icônes d'une bibliothèque.
 *
 * Si la bibliothèque n’existe pas, retourne un tableau vide.
 *
 * @summary Liste les noms d’icônes d’une bibliothèque.
 * @param library Bibliothèque à inspecter.
 * @returns La liste triée des noms d’icônes.
 * @default library 'tp'
 */
export function listTpIcons(library = 'tp'): string[] {
  const existing = libraries.get(library);
  if (existing === undefined) {
    return [];
  }

  return Array.from(existing.keys()).sort();
}

/**
 * Retourne la liste triée des bibliothèques enregistrées.
 *
 * @summary Liste les bibliothèques d’icônes disponibles.
 * @returns La liste des noms de bibliothèques.
 */
export function listTpIconLibraries(): string[] {
  return Array.from(libraries.keys()).sort();
}

/**
 * Retourne le contenu complet d'une bibliothèque sous forme d'objet simple.
 *
 * Cette fonction est utile pour :
 * - l’inspection
 * - la génération d’un catalogue d’icônes
 *
 * Si la bibliothèque n’existe pas, retourne un objet vide.
 *
 * @summary Retourne une bibliothèque entière sous forme d’objet simple.
 * @param library Bibliothèque à lire.
 * @returns Un objet `{ nomIcône: svg }`.
 * @default library 'tp'
 */
export function getTpIconLibrary(
  library = 'tp',
): Record<string, string> {
  const existing = libraries.get(library);
  if (existing === undefined) {
    return {};
  }

  return Object.fromEntries(existing.entries());
}

/**
 * Retourne toutes les bibliothèques enregistrées sous forme d’objets simples.
 *
 * Structure retournée :
 *
 * ```ts
 * {
 *   tp: { close: '<svg...>', check: '<svg...>' },
 *   flags: { fr: '<svg...>', de: '<svg...>' }
 * }
 * ```
 *
 * Cette fonction est particulièrement utile pour :
 * - le mode catalogue
 * - l’inspection globale du registre
 *
 * @summary Retourne l’intégralité du registre sous forme sérialisable.
 * @returns Toutes les bibliothèques enregistrées.
 */
export function getAllTpIconLibraries(): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  for (const [libraryName, library] of libraries.entries()) {
    result[libraryName] = Object.fromEntries(library.entries());
  }

  return result;
}

/**
 * Supprime toutes les bibliothèques enregistrées.
 *
 * Cette fonction est surtout utile dans les tests
 * pour repartir d’un registre vide entre deux cas.
 *
 * @summary Réinitialise complètement le registre d’icônes.
 */
export function clearTpIconRegistry(): void {
  libraries.clear();

  window.dispatchEvent(
    new CustomEvent('tp-icon-library-registered', {
      detail: { library: '*' },
    }),
  );
}