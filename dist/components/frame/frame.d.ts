/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Displays content in a fixed-aspect-ratio frame.
 *
 * @summary displays content in a fixed-aspect-ratio frame.
 * @tagname tp-frame
 * @attr {string} aspect-ratio = "16:9" - Width-to-height ratio in numerator:denominator notation. When absent, uses the CSS defaults of 16 and 9.
 * @remarks
 * Centers its children and clips overflowing content. Direct image and video
 * children fill the frame using object-fit: cover, preserving their proportions
 * while cropping when necessary. Unlike tp-iframe, this component does not
 * create a separate document or browsing context.
 * @example
 * <tp-frame></tp-frame>
 */
export declare class TpFrame extends TpBase {
    /**
     * Identifiant de la feuille de styles globale injectée une seule fois.
     */
    private static readonly styleId;
    /**
     * Liste des attributs observés.
     */
    static get observedAttributes(): string[];
    /**
     * Explicit valid aspect ratio in numerator:denominator notation.
     *
     * Returns an empty string when absent or invalid, leaving the CSS defaults active.
     */
    get aspectRatio(): string;
    set aspectRatio(value: string);
    /**
     * Injecte les styles globaux puis applique les styles réactifs.
     */
    protected connectedCallback(): void;
    /**
     * Réagit aux changements des attributs observés.
     */
    protected attributeChangedCallback(): void;
    /**
     */
    disconnectedCallback(): void;
    /**
     * Injecte la feuille de styles globale une seule fois.
     */
    private ensureStyles;
    /**
     * Met à jour les variables CSS de l'instance à partir de `aspect-ratio`.
     *
     * Si l'attribut est absent ou invalide, les variables CSS inline sont retirées
     * afin de laisser agir les valeurs par défaut définies dans la feuille CSS.
     */
    private updateStyles;
}
