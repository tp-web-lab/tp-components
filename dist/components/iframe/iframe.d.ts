/**
 * @module components/iframe
 * @summary Controlled iframe component.
 */
import { TpBase } from "../base/base.js";
/**
 * Affiche un `iframe` natif encapsulé dans un composant sans Shadow DOM,
 * avec prise en charge de :
 * - `src`
 * - `srcdoc`
 * - zoom
 * - sandbox
 * - interaction
 *
 * @tagname tp-iframe
 * @attr {boolean} controls = false - Shows the internal toolbar for zoom and frame actions; controls="false" hides it.
 *
 * @attr {string} src = "" - URL of the document to embed; a nonempty srcdoc takes precedence.
 * @attr {string} srcdoc = "" - Inline HTML document to embed, taking precedence over src.
 * @attr {boolean} fullscreen = false - Allows the embedded document to request fullscreen when present.
 * @attr {string} loading = "" - Browser iframe loading policy: lazy defers offscreen loading; eager requests immediate loading. Absent leaves the browser default.
 * @attr {string} sandbox = "" - Space-separated iframe sandbox permissions, for example allow-scripts. In this component, empty or absent removes the sandbox; an empty attribute does not enable the fully restricted native sandbox.
 * @attr {string} referrerpolicy = "" - Referrer policy forwarded to the iframe, for example no-referrer or strict-origin-when-cross-origin. Empty leaves the browser default.
 * @attr {boolean} interaction = true - Enables pointer interaction with the embedded document; interaction="false" blocks pointer events. Enabled by default.
 * @attr {number} zoom = 1 - Nonnegative numeric magnification factor: 1 is 100%, 0.5 is 50%, and 2 is 200%. Invalid values use 1.
 * @attr {string} zoom-levels = "25% 50% 75% 100% 125% 150% 175% 200%" - Space-separated zoom choices offered in the toolbar, expressed as percentages, for example 50% 100% 150%.
 *
 *


 *
 * @example
 * <tp-iframe></tp-iframe>
 * @cssprop [--tp-iframe-zoom=1] Unitless scale factor applied to iframe content (1 means 100%); synchronized with the zoom attribute.
 * @event tp-iframe-change Emitted when zoom, interaction or horizontal viewport state is refreshed. overflowWidth and scrollPosition are in CSS pixels, zoom is a scale factor, and zoomText is its percentage label.
 * @eventdetail tp-iframe-change { interaction: boolean; overflowWidth: number; scrollPosition: number; zoom: number; zoomText: string }
 * @event tp-iframe-load Emitted after the inner iframe loads and its layout is refreshed. contentHeight is in CSS pixels (0 when inaccessible), hasSrcdoc indicates inline content, and src is the configured URL.
 * @eventdetail tp-iframe-load { contentHeight: number; hasSrcdoc: boolean; src: string }
 */
export declare class TpIframe extends TpBase {
    /**
     * Identifiant unique de la feuille de styles injectée globalement.
     *
     * @summary Identifiant du style global du composant.
     * @internal
     */
    private static readonly styleId;
    /**
     * Référence vers la vraie balise `<iframe>`.
     *
     * @summary Référence vers l’iframe native.
     * @internal
     */
    private iframeEl;
    private iframeOverlayBridge;
    /**
     * Référence vers l’élément de stage.
     *
     * @summary Conteneur de transformation du rendu.
     * @internal
     */
    private stageEl;
    /**
     * Référence vers le viewport scrollable.
     *
     * @summary Conteneur scrollable du rendu.
     * @internal
     */
    private viewportEl;
    private controlsEl;
    private zoomLabelEl;
    /**
     * Observateur de mutations sur le composant.
     *
     * @internal
     */
    private mutationObserver;
    /**
     * Observateur de redimensionnement.
     *
     * @summary Observe la taille du composant.
     * @internal
     */
    private resizeObserver;
    /**
     * Handler de scroll du viewport.
     *
     * @summary Réagit au scroll horizontal du viewport.
     * @internal
     */
    private readonly handleScroll;
    /**
     * Handler de chargement de l’iframe native.
     *
     * Deux `requestAnimationFrame()` successifs laissent le temps au navigateur,
     * notamment Safari, de terminer le layout interne avant d’émettre `tp-iframe-load`.
     *
     * @summary Réagit au chargement de l’iframe native.
     * @internal
     */
    private readonly handleIframeLoad;
    /**
     * Liste des attributs observés par le composant.
     *
     * @summary Déclare les attributs observés.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary URL of the document to embed; a nonempty srcdoc takes precedence.
     * @attr src
     */
    get src(): string;
    /**
     * Définit l’URL du document à charger.
     *
     * @param value URL du document.
     */
    set src(value: string);
    /**
     * @summary Inline HTML document to embed, taking precedence over src.
     * @attr srcdoc
     */
    get srcdoc(): string;
    /**
     * Définit le document HTML inline à afficher.
     *
     * @param value Document HTML sérialisé.
     */
    set srcdoc(value: string);
    /**
     * @summary Allows the embedded document to request fullscreen when present.
     * @attr fullscreen
     */
    get fullscreen(): boolean;
    /**
     * Active ou désactive le mode plein écran.
     *
     * @param value `true` pour autoriser le plein écran, sinon `false`.
     */
    set fullscreen(value: boolean);
    /**
     * @summary Shows the internal toolbar for zoom and frame actions; controls="false" hides it.
     * @attr controls
     * @default false
     */
    get controls(): boolean;
    set controls(value: boolean);
    /**
     * @summary Browser iframe loading policy: lazy defers offscreen loading; eager requests immediate loading. Absent leaves the browser default.
     * @attr loading
     */
    get loading(): string;
    /**
     * Définit la politique de chargement.
     *
     * @param value `lazy` ou `eager`.
     * @throws {TypeError} Si la valeur n’est pas valide.
     */
    set loading(value: string);
    /**
     * @summary Space-separated iframe sandbox permissions, for example allow-scripts. In this component, empty or absent removes the sandbox; an empty attribute does not enable the fully restricted native sandbox.
     * @attr sandbox
     */
    get sandbox(): string;
    /**
     * Définit la valeur de l’attribut `sandbox`.
     *
     * @param value Valeur sérialisée de `sandbox`.
     */
    set sandbox(value: string);
    /**
     * @summary Referrer policy forwarded to the iframe, for example no-referrer or strict-origin-when-cross-origin. Empty leaves the browser default.
     * @attr referrerpolicy
     */
    get referrerPolicy(): string;
    /**
     * Définit la politique de referrer.
     *
     * @param value Valeur de `referrerpolicy`.
     */
    set referrerPolicy(value: string);
    /**
     * @summary Enables pointer interaction with the embedded document; interaction="false" blocks pointer events. Enabled by default.
     * @attr interaction
     * @default true
     */
    get interaction(): boolean;
    /**
     * Active ou désactive l’interaction pointeur.
     *
     * @param value `true` pour activer l’interaction, `false` pour la désactiver.
     */
    set interaction(value: boolean);
    /**
     * @summary Nonnegative numeric magnification factor: 1 is 100%, 0.5 is 50%, and 2 is 200%. Invalid values use 1.
     * @attr zoom
     * @default 1
     */
    get zoom(): number;
    /**
     * Définit le niveau de zoom.
     *
     * @param value Niveau de zoom.
     * @throws {TypeError} Si la valeur n’est pas un nombre supérieur ou égal à 0.
     */
    set zoom(value: number);
    /**
     * @summary Space-separated zoom choices offered in the toolbar, expressed as percentages, for example 50% 100% 150%.
     * @attr zoom-levels
     * @default 25% 50% 75% 100% 125% 150% 175% 200%
     */
    get zoomLevels(): string;
    /**
     * Définit la liste des niveaux de zoom disponibles.
     *
     * @param value Chaîne de pourcentages séparés par des espaces.
     */
    set zoomLevels(value: string);
    /**
     * Retourne le `Document` chargé dans l’iframe.
     *
     * @summary Expose le `Document` de l’iframe native.
     * @returns Le document interne, ou `null`.
     */
    get contentDocument(): Document | null;
    /**
     * Retourne le `Window` chargé dans l’iframe.
     *
     * @summary Expose le `Window` de l’iframe native.
     * @returns La fenêtre interne, ou `null`.
     */
    get contentWindow(): Window | null;
    /**
     * @summary Returns the maximum scroll/offset height of the embedded document in CSS pixels. Returns 0 if its document is unavailable, including inaccessible cross-origin content.
     */
    getContentHeight(): number;
    /**
     * Lifecycle callback called when the component is connected to the document.
     *
     * @summary Initialise le composant lors de sa connexion au DOM.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Callback du cycle de vie appelée lorsqu’un attribut observé change.
     *
     * @summary Réagit aux changements d’attributs observés.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Callback du cycle de vie appelée lors de la déconnexion du composant.
     *
     * @summary Nettoie les écouteurs et observateurs.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary Selects the next larger configured zoom level, capped at the largest available level.
     */
    zoomIn(): void;
    /**
     * @summary Selects the next smaller configured zoom level, capped at the smallest available level.
     */
    zoomOut(): void;
    /**
     * @summary Sets the magnification factor to value; 1 restores 100%. Rejects negative or nonfinite values with TypeError.
     */
    resetZoom(value?: number): void;
    /**
     * Injecte la feuille de styles du composant dans `document.head`
     * si elle n’existe pas encore.
     *
     * @summary Injecte la feuille de styles globale du composant.
     * @internal
     */
    private ensureStyles;
    /**
     * Garantit l’existence du DOM interne.
     *
     * Structure générée :
     *
     * ```html
     * <tp-iframe>
     *   <div data-tp-iframe-viewport>
     *     <div data-tp-iframe-stage>
     *       <iframe></iframe>
     *     </div>
     *   </div>
     * </tp-iframe>
     * ```
     *
     * @summary Crée ou réutilise la structure interne du composant.
     * @internal
     */
    private ensureDom;
    /**
     * Met en place les observateurs liés à la taille et aux mutations.
     *
     * @summary Observe la mise en page du composant.
     * @internal
     */
    private observeLayout;
    /**
     * Met à jour l’ensemble de l’état interne du composant.
     *
     * @internal
     */
    private updateAll;
    /**
     * Répercute les attributs publics sur la vraie balise `<iframe>`.
     *
     * @summary Synchronise les attributs de l’iframe native.
     * @internal
     */
    private updateIframeAttributes;
    /**
     * Applique le niveau de zoom au composant via variable CSS.
     *
     * @summary Met à jour la variable CSS de zoom.
     * @internal
     */
    private updateZoom;
    private updateControls;
    /**
     * Applique l’état d’interaction au composant.
     *
     * @summary Met à jour l’interaction pointeur.
     * @internal
     */
    private updateInteraction;
    /**
     * Retourne la largeur de débordement horizontale.
     *
     * @summary Mesure le débordement horizontal du viewport.
     * @returns Largeur de débordement en pixels.
     * @internal
     */
    private getOverflowWidth;
    /**
     * Émet l’événement `tp-iframe-change`.
     *
     * @summary Émet l’état courant de l’iframe.
     * @internal
     */
    private dispatchZoomState;
}
/**
 * Déclaration globale pour typer automatiquement
 * `document.querySelector('tp-iframe')`.
 *
 * @summary Étend le typage global des éléments HTML.
 * @internal
 */
declare global {
    interface HTMLElementTagNameMap {
        "tp-iframe": TpIframe;
    }
}
