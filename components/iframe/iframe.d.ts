/**
 * @module components/iframe
 * @summary Controlled iframe component.
 */
import { TpBase } from '../base/base.js';
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
 *
 * @attr {string} src = "" - URL du document à charger.
 * @attr {string} srcdoc = "" - Document HTML inline à afficher.
 * @attr {boolean} fullscreen = false - Autorise le mode plein écran.
 * @attr {string} loading = "" - Politique de chargement : `lazy` ou `eager`.
 * @attr {string} sandbox = "" - Valeur de l’attribut `sandbox` de l’iframe.
 * @attr {string} referrerpolicy = "" - Politique `referrerpolicy`.
 * @attr {boolean} interaction = true - Active ou désactive l’interaction pointeur avec l’iframe. Par défaut : `true`.
 * @attr {number} zoom = 1 - Niveau de zoom. Par défaut : `1`.
 * @attr {string} zoom-levels = "25% 50% 75% 100% 125% 150% 175% 200%" - Liste des niveaux de zoom disponibles. Par défaut : `25% 50% 75% 100% 125% 150% 175% 200%`.
 *
 * @cssprop [--tp-iframe-zoom=1] Niveau de zoom CSS appliqué au rendu.
 *
 * @event tp-iframe-change Émis quand l’état visible de l’iframe change.
 * @event tp-iframe-load Émis après le chargement de l’iframe interne.
 *
 * @example
 * <tp-iframe></tp-iframe>
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
     * URL du document à charger.
     *
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
     * Document HTML inline affiché via `srcdoc`.
     *
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
     * Autorise le mode plein écran.
     *
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
     * Affiche la barre de contrôles interne.
     *
     * @attr controls
     * @default false
     */
    get controls(): boolean;
    set controls(value: boolean);
    /**
     * Politique de chargement de l’iframe.
     *
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
     * Valeur de l’attribut `sandbox`.
     *
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
     * Politique de referrer.
     *
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
     * Indique si l’interaction pointeur est active.
     *
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
     * Niveau de zoom courant.
     *
     * Si l’attribut est absent, la valeur par défaut est `1`.
     *
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
     * Liste sérialisée des niveaux de zoom disponibles.
     *
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
     * Retourne la hauteur réelle du document chargé.
     *
     * @summary Mesure la hauteur du contenu interne de l’iframe.
     * @returns Hauteur du contenu en pixels.
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
     * Passe au niveau de zoom supérieur disponible.
     *
     * @summary Augmente le zoom.
     */
    zoomIn(): void;
    /**
     * Passe au niveau de zoom inférieur disponible.
     *
     * @summary Réduit le zoom.
     */
    zoomOut(): void;
    /**
     * Réinitialise le zoom à une valeur donnée.
     *
     * @summary Réinitialise le zoom.
     * @param value Valeur de zoom cible.
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
        'tp-iframe': TpIframe;
    }
}
