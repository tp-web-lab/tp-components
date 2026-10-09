import { TpBase } from "../base/base";
/**
 * Sidebar layout component, without Shadow DOM.
 *
 * @summary Creates a two-column sidebar and content layout.
 * @tagname tp-sidebar
 *
 * @attr {string} content-width = "50%" - Minimum percentage of the container width reserved for the content column. When absent, uses the --tp-sidebar-content-width CSS default.
 * @attr {string} gap = "1rem" - Gap between sidebar and content. When absent, uses --tp-sidebar-gap, with a fallback of 1rem.
 * @attr {boolean} right-sidebar = false - Uses the last child as the sidebar instead of the first child.
 * @attr {string} side-width = "auto" - Preferred sidebar width before flex space is distributed. By default, uses the item's own width or content-based size through --tp-sidebar-side-width.
 *
 *
 * @cssprop --tp-sidebar-content-width Default content column width.
 * @cssprop --tp-sidebar-gap Default gap between sidebar and content.
 * @cssprop --tp-sidebar-side-width Default sidebar column width.
 * @example
 * <tp-sidebar></tp-sidebar>
 */
export declare class TpSidebar extends TpBase {
    /**
     * Identifiant de la feuille de styles globale injectée une seule fois.
     */
    private static readonly styleId;
    /**
     * Liste des attributs observés.
     */
    static get observedAttributes(): string[];
    /**
     * Valeur de l'attribut `side-width`.
     */
    get sideWidth(): string;
    set sideWidth(value: string);
    /**
     * Valeur valide de l'attribut `content-width`.
     *
     * Retourne une chaîne vide si l'attribut est absent ou invalide.
     */
    get contentWidth(): string;
    set contentWidth(value: string);
    /**
     * Valeur de l'attribut `gap`.
     */
    get gap(): string;
    set gap(value: string);
    /**
     * Indique si la sidebar correspond au dernier enfant.
     */
    get rightSidebar(): boolean;
    set rightSidebar(value: boolean);
    /**
     * Injecte les styles globaux puis applique les styles réactifs.
     */
    protected connectedCallback(): void;
    /**
     * Réagit aux changements des attributs observés.
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Cleans up the sidebar instance.
     */
    disconnectedCallback(): void;
    /**
     * Injecte la feuille de styles globale une seule fois.
     */
    private ensureStyles;
    /**
     * Met à jour les variables CSS et styles inline de l'instance.
     */
    private updateStyles;
}
