/**
 * @module components/contextmenu
 * @summary Accessible context menu built from a nested list.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Détail de sélection d’une action de menu contextuel.
 *
 * @summary Représente l’action choisie dans le menu.
 */
export interface TpContextmenuSelectDetail {
    /**
     * Action déclarée sur l’item via `data-action`.
     */
    action: string;
    /**
     * Item de menu sélectionné.
     */
    item: HTMLLIElement;
    /**
     * Texte lisible de l’item.
     */
    label: string;
}
/**
 * `<tp-contextmenu>` affiche un menu contextuel positionné à l’écran.
 *
 * Le composant :
 * - peut être lié à un élément d’ancrage via `anchor`
 * - intercepte le clic droit sur cet ancrage
 * - peut aussi être ouvert manuellement avec `showAt(x, y)`
 * - gère les sous-menus à partir de listes `<ul>` imbriquées
 * - fournit une navigation clavier simple
 * - émet `tp-contextmenu-select` quand un item terminal avec `data-action` est activé
 *
 * Exemple :
 *
 * ```html
 * <button id="target">Open menu</button>
 *
 * <tp-contextmenu anchor="#target">
 *   <ul>
 *     <li data-action="rename">Rename</li>
 *     <li data-action="delete">Delete</li>
 *     <li>
 *       More
 *       <ul>
 *         <li data-action="duplicate">Duplicate</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </tp-contextmenu>
 * ```
 *
 * Attributs réactifs :
 * - `anchor`
 * - `open`
 *
 * @summary Affiche un menu contextuel accessible et réutilisable.
 * @tagname tp-contextmenu
 *
 * @attr {string} anchor = "" - Sélecteur CSS de l’élément servant d’ancrage au clic droit.
 * @attr {boolean} open = false - Ouvre ou ferme le menu.
 *
 *
 * @event tp-contextmenu-select Émis quand un item terminal portant `data-action` est sélectionné.
 * @eventdetail tp-contextmenu-select { action: string; item: HTMLLIElement; label: string }
 *
 * @cssprop --tp-contextmenu-background Background color of the menu and submenus.
 * @cssprop --tp-contextmenu-foreground Text color of the menu.
 * @cssprop --tp-contextmenu-border-color Border color of the menu and dividers.
 * @cssprop --tp-contextmenu-shadow-1 Primary menu shadow color.
 * @cssprop --tp-contextmenu-shadow-2 Secondary menu shadow color.
 * @cssprop --tp-contextmenu-hover Hover background color for menu items.
 * @cssprop --tp-contextmenu-radius Menu and submenu border radius.
 * @cssprop --tp-contextmenu-submenu-offset Inline offset used to position submenus.
 * @cssprop --tp-contextmenu-min-inline-size Minimum inline size of menus.
 * @cssprop --tp-contextmenu-padding Padding around menus.
 * @cssprop --tp-contextmenu-item-padding-block Block padding for menu items.
 * @cssprop --tp-contextmenu-item-padding-inline Inline padding for menu items.
 * @cssprop --tp-contextmenu-z-index Stacking level of the context menu.
 * @example
 * <tp-button id="intro-contextmenu-trigger" data-demo-trigger>Right-click this button</tp-button>
 * <tp-contextmenu anchor="#intro-contextmenu-trigger" outside-click>
 * <ul>
 * <li>Item 1</li>
 * <li>Item 2</li>
 * <li>Item 3</li>
 * </ul>
 * </tp-contextmenu>
 */
export declare class TpContextmenu extends TpBase {
    /**
     * Identifiant de la feuille de styles globale injectée une seule fois.
     *
     * @summary Identifiant du style global du composant.
     * @internal
     */
    private static readonly contextmenuStyleId;
    /**
     * Élément actuellement lié comme ancrage.
     *
     * @summary Référence vers l’élément d’ancrage.
     * @internal
     */
    private anchorEl;
    /**
     * Identifiant unique de l’instance.
     *
     * @summary Identifiant logique du menu.
     * @internal
     */
    private instanceId;
    /**
     * Dernière position X connue du pointeur.
     *
     * @summary Dernière position horizontale utilisée pour ouvrir le menu.
     * @internal
     */
    private lastPointerX;
    /**
     * Dernière position Y connue du pointeur.
     *
     * @summary Dernière position verticale utilisée pour ouvrir le menu.
     * @internal
     */
    private lastPointerY;
    /**
     * Réagit au clic droit sur l’élément d’ancrage.
     *
     * @summary Ouvre le menu à la position du pointeur.
     * @param event Événement de menu contextuel natif.
     * @internal
     */
    private readonly handleAnchorContextmenu;
    /**
     * Réagit aux clics ou pressions en dehors du menu.
     *
     * @summary Ferme le menu lors d’une interaction extérieure.
     * @param event Événement pointeur document.
     * @internal
     */
    private readonly handleDocumentPointerDown;
    /**
     * Réagit aux touches clavier globales.
     *
     * @summary Ferme le menu avec `Escape`.
     * @param event Événement clavier document.
     * @internal
     */
    private readonly handleDocumentKeydown;
    /**
     * Liste des attributs observés.
     *
     * @summary Déclare les attributs observés.
     * @internal
     */
    /**
     * Attributes observed by `<tp-contextmenu>`.
     *
     * @summary Observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Sélecteur CSS de l’élément servant d’ancrage.
     *
     * @attr anchor
     */
    get anchor(): string;
    /**
     * Définit le sélecteur CSS de l’élément d’ancrage.
     *
     * @param value Sélecteur CSS.
     */
    set anchor(value: string);
    /**
     * Indique si le menu est ouvert.
     *
     * @attr open
     */
    get open(): boolean;
    /**
     * Ouvre ou ferme le menu.
     *
     * @param value `true` pour ouvrir le menu.
     */
    set open(value: boolean);
    /**
     * Initialise le composant lors de sa connexion au document.
     *
     * @summary Initialise le menu contextuel lors de sa connexion au DOM.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Réagit aux changements des attributs observés.
     *
     * @summary Met à jour le composant après changement d’attribut.
     * @param name Nom de l’attribut modifié.
     * @param oldValue Ancienne valeur.
     * @param newValue Nouvelle valeur.
     * @internal
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Nettoie les écouteurs et marqueurs lors de la déconnexion.
     *
     * @summary Nettoie le composant lors de sa déconnexion.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Ouvre le menu à une position donnée.
     *
     * @summary Ouvre explicitement le menu à l’écran.
     * @param x Position horizontale en pixels.
     * @param y Position verticale en pixels.
     */
    showAt(x: number, y: number): void;
    /**
     * Ferme le menu.
     *
     * @summary Ferme explicitement le menu.
     */
    hide(): void;
    /**
     * Ferme tous les sous-menus ouverts.
     *
     * @summary Réinitialise l’état d’ouverture des sous-menus.
     */
    closeAll(): void;
    /**
     * Garantit l’existence d’un identifiant unique d’instance.
     *
     * @summary Génère un identifiant unique si nécessaire.
     * @internal
     */
    private ensureInstanceId;
    /**
     * Lie le menu à son élément d’ancrage.
     *
     * @summary Attache l’écouteur de clic droit à l’ancrage.
     * @internal
     */
    private bindAnchor;
    /**
     * Supprime la liaison avec l’ancrage courant.
     *
     * @summary Détache l’écouteur de clic droit de l’ancrage.
     * @internal
     */
    private unbindAnchor;
    /**
     * Retourne la liste racine du menu.
     *
     * @summary Retourne le menu racine.
     * @returns Élément `<ul>` racine ou `null`.
     * @internal
     */
    private getRootMenu;
    /**
     * Retourne les éléments `li` directs d’un menu donné.
     *
     * @summary Retourne les items directs d’un menu.
     * @param menu Menu concerné.
     * @returns Liste des items directs.
     * @internal
     */
    private getDirectMenuItems;
    /**
     * Retourne tous les items du menu et de ses sous-menus.
     *
     * @summary Retourne tous les items du composant.
     * @returns Liste complète des items.
     * @internal
     */
    private getMenuItems;
    /**
     * Retourne le sous-menu direct d’un item.
     *
     * @summary Retourne le sous-menu d’un item.
     * @param item Item concerné.
     * @returns Sous-menu ou `null`.
     * @internal
     */
    private getSubmenu;
    /**
     * Retourne l’action associée à un item.
     *
     * @summary Retourne la valeur de `data-action`.
     * @param item Item concerné.
     * @returns Action ou chaîne vide.
     * @internal
     */
    private getItemAction;
    /**
     * Retourne le texte lisible d’un item sans inclure celui de son sous-menu.
     *
     * @summary Retourne le libellé texte d’un item.
     * @param item Item concerné.
     * @returns Texte du libellé.
     * @internal
     */
    private getItemLabel;
    /**
     * Met à jour les rôles ARIA et la navigation clavier.
     *
     * @summary Décore le menu et ses sous-menus.
     * @internal
     */
    private updateMenu;
    /**
     * Décore un menu donné ainsi que ses éventuels sous-menus.
     *
     * @summary Applique la structure ARIA et les handlers clavier.
     * @param menu Menu à décorer.
     * @internal
     */
    private decorateMenu;
    /**
     * Active un item terminal du menu.
     *
     * Si l’item porte `data-action`, le composant émet
     * `tp-contextmenu-select` avant de se fermer.
     *
     * @summary Active un item de menu terminal.
     * @param item Item activé.
     * @internal
     */
    private handleItemActivation;
    /**
     * Gère la navigation clavier au sein du menu.
     *
     * @summary Gère les interactions clavier sur un item de menu.
     * @param event Événement clavier.
     * @param item Item courant.
     * @param siblings Frères du même niveau.
     * @internal
     */
    private handleKey;
    /**
     * Donne le focus à un item donné et met à jour ses frères.
     *
     * @summary Déplace le focus vers un item du menu.
     * @param item Item à focaliser.
     * @internal
     */
    private focusItem;
    /**
     * Positionne le menu dans la fenêtre en évitant les débordements.
     *
     * @summary Positionne visuellement le menu.
     * @param x Position horizontale souhaitée.
     * @param y Position verticale souhaitée.
     * @internal
     */
    private positionMenu;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-contextmenu": TpContextmenu;
    }
}
