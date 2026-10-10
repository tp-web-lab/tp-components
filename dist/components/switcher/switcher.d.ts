/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Switcher layout component, without Shadow DOM.
 *
 * @summary Switches between horizontal and vertical layouts based on available space.
 * @tagname tp-switcher
 *
 * @attr {string} gap = "1rem" - Gap between switcher items, using --tp-switcher-gap when absent.
 * @attr {number} max-horizontal = "" - Maximum number of items per row; additional items wrap onto following rows. Below threshold, items still stack vertically. Absent by default: no per-row limit (the maxHorizontal property returns null).
 * @attr {string} threshold = "30rem" - Available-width threshold below which the items stack vertically, using --tp-switcher-threshold when absent.
 *
 *
 * @cssprop --tp-switcher-gap Default gap between switcher items.
 * @cssprop --tp-switcher-threshold Default switch threshold.
 * @example
 * ```html
 * <tp-switcher threshold="35rem" gap="1rem">
 *   <tp-box>1. Plan the content.</tp-box>
 *   <tp-box>2. Write a draft.</tp-box>
 *   <tp-box>3. Review the text.</tp-box>
 *   <tp-box>4. Add illustrations.</tp-box>
 *   <tp-box>5. Publish the result.</tp-box>
 * </tp-switcher>
 * ```
 */
export declare class TpSwitcher extends TpBase {
    /**
     * Identifiant de la feuille de styles globale injectée une seule fois.
     */
    private static readonly styleId;
    /**
     * Élément `<style>` propre à l'instance, utilisé pour la règle `max-horizontal`.
     */
    private maxHorizontalStyleEl;
    /**
     * Identifiant unique de l'instance.
     */
    private instanceId;
    /**
     * Liste des attributs observés.
     */
    static get observedAttributes(): string[];
    /**
     * Valeur de l'attribut `threshold`.
     */
    get threshold(): string;
    set threshold(value: string);
    /**
     * Valeur de l'attribut `gap`.
     */
    get gap(): string;
    set gap(value: string);
    /**
     * Valeur valide de l'attribut `max-horizontal`.
     *
     * Retourne un entier strictement positif si l'attribut est valide,
     * sinon `null`.
     */
    get maxHorizontal(): number | null;
    set maxHorizontal(value: number | null);
    /**
     * Injecte les styles globaux puis applique les styles réactifs.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Réagit aux changements des attributs observés.
     * @internal
     */
    protected attributeChangedCallback(name: string): void;
    /**
     * Supprime le style d'instance lorsque l'élément est retiré du document.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Injecte la feuille de styles globale une seule fois.
     */
    private ensureStyles;
    /**
     * Garantit qu'un identifiant d'instance existe.
     */
    private ensureInstanceId;
    /**
     * Met à jour les variables CSS de l'instance.
     */
    private updateStyles;
    /**
     * Met à jour la règle CSS spécifique à l'instance pour `max-horizontal`.
     */
    private updateMaxHorizontalStyle;
    /**
     * Supprime la règle CSS spécifique à l'instance si elle existe.
     */
    private removeMaxHorizontalStyle;
}
