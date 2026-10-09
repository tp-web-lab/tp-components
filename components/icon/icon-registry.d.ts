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
 * Enregistre une bibliothèque complète d'icônes SVG.
 *
 * Si une bibliothèque du même nom existe déjà, elle est entièrement remplacée.
 *
 * @summary Enregistre ou remplace une bibliothèque complète d’icônes.
 * @param name Nom de la bibliothèque à enregistrer.
 * @param icons Dictionnaire simple `{ nomIcône: svg }`.
 */
export declare function registerTpIconLibrary(name: TpIconLibraryName, icons: Record<string, string>): void;
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
export declare function registerTpIcon(name: TpIconName, svg: TpIconSvg, library?: string): void;
/**
 * Retourne le SVG d'une icône ou `null` si elle est absente.
 *
 * @summary Recherche une icône dans une bibliothèque.
 * @param name Nom de l’icône recherchée.
 * @param library Bibliothèque dans laquelle effectuer la recherche.
 * @returns Le SVG brut de l’icône, ou `null` si elle n’existe pas.
 * @default library 'tp'
 */
export declare function getTpIcon(name: TpIconName, library?: string): TpIconSvg | null;
/**
 * Indique si une icône existe dans une bibliothèque.
 *
 * @summary Vérifie la présence d’une icône dans une bibliothèque.
 * @param name Nom de l’icône recherchée.
 * @param library Bibliothèque dans laquelle effectuer la recherche.
 * @returns `true` si l’icône existe, sinon `false`.
 * @default library 'tp'
 */
export declare function hasTpIcon(name: TpIconName, library?: string): boolean;
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
export declare function listTpIcons(library?: string): string[];
/**
 * Retourne la liste triée des bibliothèques enregistrées.
 *
 * @summary Liste les bibliothèques d’icônes disponibles.
 * @returns La liste des noms de bibliothèques.
 */
export declare function listTpIconLibraries(): string[];
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
export declare function getTpIconLibrary(library?: string): Record<string, string>;
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
export declare function getAllTpIconLibraries(): Record<string, Record<string, string>>;
/**
 * Supprime toutes les bibliothèques enregistrées.
 *
 * Cette fonction est surtout utile dans les tests
 * pour repartir d’un registre vide entre deux cas.
 *
 * @summary Réinitialise complètement le registre d’icônes.
 */
export declare function clearTpIconRegistry(): void;
