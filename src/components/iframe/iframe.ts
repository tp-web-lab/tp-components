/**
 * @module components/iframe
 * @summary Controlled iframe component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import style from './iframe.css?inline';
import { TpBase } from '../base/base.js';
import { IframeOverlayBridge } from '../../utilities/iframe-overlay-bridge.js';

const DEFAULT_ZOOM_LEVELS = '25% 50% 75% 100% 125% 150% 175% 200%';

/**
 * Parses a serialized boolean attribute.
 *
 * Valeurs reconnues :
 * - `null` ou `''` → valeur par défaut
 * - `'true'` → `true`
 * - `'false'` → `false`
 *
 * @summary Convertit une valeur d’attribut en booléen.
 * @param value Valeur brute de l’attribut.
 * @param defaultValue Valeur par défaut à utiliser si la valeur n’est pas explicite.
 * @returns Valeur booléenne interprétée.
 * @internal
 */
function parseBooleanAttribute(
  value: string | null,
  defaultValue: boolean,
): boolean {
  if (value === null || value === '') {
    return defaultValue;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return defaultValue;
}

/**
 * Converts a list of percentages into numeric zoom levels.
 *
 * Exemple :
 * - `'25% 50% 100%'` → `[0.25, 0.5, 1]`
 *
 * Si aucune valeur valide n’est trouvée, un ensemble par défaut est renvoyé.
 *
 * @summary Convertit une chaîne de niveaux de zoom en tableau numérique.
 * @param value Chaîne source.
 * @returns Tableau trié de niveaux de zoom.
 * @internal
 */
function parseZoomLevels(value: string): number[] {
  const levels = value
    .trim()
    .split(/\s+/)
    .map((token) => {
      const match = /^(?<value>\d+(?:\.\d+)?)%$/.exec(token);
      if (!match?.groups) {
        return null;
      }

      const parsed = Number(match.groups.value) / 100;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    })
    .filter((level): level is number => level !== null);

  const uniqueSorted = [...new Set(levels)].sort((a, b) => a - b);

  return uniqueSorted.length > 0
    ? uniqueSorted
    : [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
}

/**
 * Formats a numeric zoom level as a readable percentage.
 *
 * @summary Formate une valeur de zoom.
 * @param value Niveau de zoom.
 * @returns Chaîne de pourcentage.
 * @internal
 */
function formatZoom(value: number): string {
  return `${String(Math.round(value * 100))}%`;
}

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
export class TpIframe extends TpBase {
  /**
   * Identifiant unique de la feuille de styles injectée globalement.
   *
   * @summary Identifiant du style global du composant.
   * @internal
   */
  private static readonly styleId = 'tp-iframe-styles';

  /**
   * Référence vers la vraie balise `<iframe>`.
   *
   * @summary Référence vers l’iframe native.
   * @internal
   */
  private iframeEl: HTMLIFrameElement | null = null;
  private iframeOverlayBridge: IframeOverlayBridge | null = null;

  /**
   * Référence vers l’élément de stage.
   *
   * @summary Conteneur de transformation du rendu.
   * @internal
   */
  private stageEl: HTMLDivElement | null = null;

  /**
   * Référence vers le viewport scrollable.
   *
   * @summary Conteneur scrollable du rendu.
   * @internal
   */
  private viewportEl: HTMLDivElement | null = null;
  private controlsEl: HTMLDivElement | null = null;
  private zoomLabelEl: HTMLSpanElement | null = null;

  /**
   * Observateur de mutations sur le composant.
   *
   * @internal
   */
  private mutationObserver: MutationObserver | null = null;

  /**
   * Observateur de redimensionnement.
   *
   * @summary Observe la taille du composant.
   * @internal
   */
  private resizeObserver: ResizeObserver | null = null;

  /**
   * Handler de scroll du viewport.
   *
   * @summary Réagit au scroll horizontal du viewport.
   * @internal
   */
  private readonly handleScroll = (): void => {
    this.dispatchZoomState();
  };

  /**
   * Handler de chargement de l’iframe native.
   *
   * Deux `requestAnimationFrame()` successifs laissent le temps au navigateur,
   * notamment Safari, de terminer le layout interne avant d’émettre `tp-iframe-load`.
   *
   * @summary Réagit au chargement de l’iframe native.
   * @internal
   */
  private readonly handleIframeLoad = (): void => {
    this.dispatchZoomState();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.dispatchEvent(
          new CustomEvent('tp-iframe-load', {
            bubbles: true,
            detail: {
              contentHeight: this.getContentHeight(),
              hasSrcdoc: this.srcdoc !== '',
              src: this.src,
            },
          }),
        );
      });
    });
  };

  /**
   * Liste des attributs observés par le composant.
   *
   * @summary Déclare les attributs observés.
   * @internal
   */
  public static get observedAttributes(): string[] {
    return [
      'src',
      'srcdoc',
      'fullscreen',
      'controls',
      'loading',
      'sandbox',
      'referrerpolicy',
      'interaction',
      'zoom',
      'zoom-levels',
    ];
  }

  /**
   * URL du document à charger.
   *
   * @attr src
   */
  public get src(): string {
    return this.getAttribute('src') ?? '';
  }

  /**
   * Définit l’URL du document à charger.
   *
   * @param value URL du document.
   */
  public set src(value: string) {
    if (value === '') {
      this.removeAttribute('src');
      return;
    }

    this.setAttribute('src', value);
  }

  /**
   * Document HTML inline affiché via `srcdoc`.
   *
   * @attr srcdoc
   */
  public get srcdoc(): string {
    return this.getAttribute('srcdoc') ?? '';
  }

  /**
   * Définit le document HTML inline à afficher.
   *
   * @param value Document HTML sérialisé.
   */
  public set srcdoc(value: string) {
    if (value === '') {
      this.removeAttribute('srcdoc');
      return;
    }

    this.setAttribute('srcdoc', value);
  }

  /**
   * Autorise le mode plein écran.
   *
   * @attr fullscreen
   */
  public get fullscreen(): boolean {
    return this.hasAttribute('fullscreen');
  }

  /**
   * Active ou désactive le mode plein écran.
   *
   * @param value `true` pour autoriser le plein écran, sinon `false`.
   */
  public set fullscreen(value: boolean) {
    if (value) {
      this.setAttribute('fullscreen', '');
      return;
    }

    this.removeAttribute('fullscreen');
  }

  /**
   * Affiche la barre de contrôles interne.
   *
   * @attr controls
   * @default false
   */
  public get controls(): boolean {
    return parseBooleanAttribute(this.getAttribute('controls'), false);
  }

  public set controls(value: boolean) {
    this.setAttribute('controls', String(value));
  }

  /**
   * Politique de chargement de l’iframe.
   *
   * @attr loading
   */
  public get loading(): string {
    const value = this.getAttribute('loading');
    return value === 'lazy' || value === 'eager' ? value : '';
  }

  /**
   * Définit la politique de chargement.
   *
   * @param value `lazy` ou `eager`.
   * @throws {TypeError} Si la valeur n’est pas valide.
   */
  public set loading(value: string) {
    if (value === '') {
      this.removeAttribute('loading');
      return;
    }

    if (value !== 'lazy' && value !== 'eager') {
      throw new TypeError('The "loading" attribute must be "eager" or "lazy".');
    }

    this.setAttribute('loading', value);
  }

  /**
   * Valeur de l’attribut `sandbox`.
   *
   * @attr sandbox
   */
  public get sandbox(): string {
    return this.getAttribute('sandbox') ?? '';
  }

  /**
   * Définit la valeur de l’attribut `sandbox`.
   *
   * @param value Valeur sérialisée de `sandbox`.
   */
  public set sandbox(value: string) {
    if (value === '') {
      this.removeAttribute('sandbox');
      return;
    }

    this.setAttribute('sandbox', value);
  }

  /**
   * Politique de referrer.
   *
   * @attr referrerpolicy
   */
  public get referrerPolicy(): string {
    return this.getAttribute('referrerpolicy') ?? '';
  }

  /**
   * Définit la politique de referrer.
   *
   * @param value Valeur de `referrerpolicy`.
   */
  public set referrerPolicy(value: string) {
    if (value === '') {
      this.removeAttribute('referrerpolicy');
      return;
    }

    this.setAttribute('referrerpolicy', value);
  }

  /**
   * Indique si l’interaction pointeur est active.
   *
   * @attr interaction
   * @default true
   */
  public get interaction(): boolean {
    return parseBooleanAttribute(this.getAttribute('interaction'), true);
  }

  /**
   * Active ou désactive l’interaction pointeur.
   *
   * @param value `true` pour activer l’interaction, `false` pour la désactiver.
   */
  public set interaction(value: boolean) {
    this.setAttribute('interaction', String(value));
  }

  /**
   * Niveau de zoom courant.
   *
   * Si l’attribut est absent, la valeur par défaut est `1`.
   *
   * @attr zoom
   * @default 1
   */
  public get zoom(): number {
    const raw = this.getAttribute('zoom');

    if (raw === null || raw === '') {
      return 1;
    }

    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : 1;
  }

  /**
   * Définit le niveau de zoom.
   *
   * @param value Niveau de zoom.
   * @throws {TypeError} Si la valeur n’est pas un nombre supérieur ou égal à 0.
   */
  public set zoom(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError('The "zoom" property must be a number greater than or equal to 0.');
    }

    this.setAttribute('zoom', String(value));
  }

  /**
   * Liste sérialisée des niveaux de zoom disponibles.
   *
   * @attr zoom-levels
   * @default 25% 50% 75% 100% 125% 150% 175% 200%
   */
  public get zoomLevels(): string {
    return this.getAttribute('zoom-levels') ?? DEFAULT_ZOOM_LEVELS;
  }

  /**
   * Définit la liste des niveaux de zoom disponibles.
   *
   * @param value Chaîne de pourcentages séparés par des espaces.
   */
  public set zoomLevels(value: string) {
    if (value.trim() === '') {
      this.removeAttribute('zoom-levels');
      return;
    }

    this.setAttribute('zoom-levels', value);
  }

  /**
   * Retourne le `Document` chargé dans l’iframe.
   *
   * @summary Expose le `Document` de l’iframe native.
   * @returns Le document interne, ou `null`.
   */
  public get contentDocument(): Document | null {
    return this.iframeEl?.contentDocument ?? null;
  }

  /**
   * Retourne le `Window` chargé dans l’iframe.
   *
   * @summary Expose le `Window` de l’iframe native.
   * @returns La fenêtre interne, ou `null`.
   */
  public get contentWindow(): Window | null {
    return this.iframeEl?.contentWindow ?? null;
  }

  /**
   * Retourne la hauteur réelle du document chargé.
   *
   * @summary Mesure la hauteur du contenu interne de l’iframe.
   * @returns Hauteur du contenu en pixels.
   */
  public getContentHeight(): number {
    const doc = this.contentDocument;
    if (doc === null) {
      return 0;
    }

    const body = doc.body;
    const html = doc.documentElement;

    return Math.max(
      body?.scrollHeight ?? 0,
      body?.offsetHeight ?? 0,
      html?.scrollHeight ?? 0,
      html?.offsetHeight ?? 0,
    );
  }

  /**
   * Lifecycle callback called when the component is connected to the document.
   *
   * @summary Initialise le composant lors de sa connexion au DOM.
   * @internal
   */
  protected connectedCallback(): void {
    super.connectedCallback();
    this.ensureStyles();
    this.ensureDom();
    this.updateAll();
    this.observeLayout();
  }

  /**
   * Callback du cycle de vie appelée lorsqu’un attribut observé change.
   *
   * @summary Réagit aux changements d’attributs observés.
   * @internal
   */
  protected attributeChangedCallback(): void {
    if (!this.isConnected) {
      return;
    }

    this.ensureDom();
    this.updateAll();
  }

  /**
   * Callback du cycle de vie appelée lors de la déconnexion du composant.
   *
   * @summary Nettoie les écouteurs et observateurs.
   * @internal
   */
  public disconnectedCallback(): void {
    super.connectedCallback();
    this.viewportEl?.removeEventListener('scroll', this.handleScroll);
    this.iframeEl?.removeEventListener('load', this.handleIframeLoad);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.mutationObserver?.disconnect();
    this.mutationObserver = null;
    this.iframeOverlayBridge?.disconnect();
    this.iframeOverlayBridge = null;
  }

  /**
   * Passe au niveau de zoom supérieur disponible.
   *
   * @summary Augmente le zoom.
   */
  public zoomIn(): void {
    const levels = parseZoomLevels(this.zoomLevels);
    const current = this.zoom;
    const next = levels.find((level) => level > current + Number.EPSILON);

    this.zoom = next ?? levels.at(-1) ?? current;
  }

  /**
   * Passe au niveau de zoom inférieur disponible.
   *
   * @summary Réduit le zoom.
   */
  public zoomOut(): void {
    const levels = parseZoomLevels(this.zoomLevels);
    const current = this.zoom;
    const previous = [...levels]
      .reverse()
      .find((level) => level < current - Number.EPSILON);

    this.zoom = previous ?? levels[0] ?? current;
  }

  /**
   * Réinitialise le zoom à une valeur donnée.
   *
   * @summary Réinitialise le zoom.
   * @param value Valeur de zoom cible.
   */
  public resetZoom(value = 1): void {
    this.zoom = value;
  }

  /**
   * Injecte la feuille de styles du composant dans `document.head`
   * si elle n’existe pas encore.
   *
   * @summary Injecte la feuille de styles globale du composant.
   * @internal
   */
  private ensureStyles(): void {
    if (document.getElementById(TpIframe.styleId)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = TpIframe.styleId;
    styleEl.textContent = style;
    document.head.append(styleEl);
  }

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
  private ensureDom(): void {
    if (
      this.viewportEl !== null &&
      this.stageEl !== null &&
      this.iframeEl !== null &&
      this.controlsEl !== null &&
      this.zoomLabelEl !== null
    ) {
      return;
    }

    this.textContent = '';

    const viewport = document.createElement('div');
    viewport.setAttribute('data-tp-iframe-viewport', '');
    viewport.setAttribute('data-tp-iframe-role', 'viewport');
    viewport.addEventListener('scroll', this.handleScroll, { passive: true });

    const stage = document.createElement('div');
    stage.setAttribute('data-tp-iframe-stage', '');
    stage.setAttribute('data-tp-iframe-role', 'stage');

    const iframe = document.createElement('iframe');
    iframe.setAttribute('data-tp-iframe-role', 'iframe');
    iframe.style.display = 'block';
    iframe.style.inlineSize = '100%';
    iframe.style.blockSize = '100%';
    iframe.style.border = '0';
    iframe.addEventListener('load', this.handleIframeLoad);

    stage.append(iframe);
    viewport.append(stage);
    const controls = document.createElement('div');
    controls.setAttribute('data-tp-iframe-controls', '');
    controls.setAttribute('hidden', '');

    const zoomLabel = document.createElement('span');
    zoomLabel.setAttribute('data-tp-iframe-zoom-label', '');
    controls.append(zoomLabel);

    this.append(viewport);
    this.append(controls);

    this.viewportEl = viewport;
    this.stageEl = stage;
    this.iframeEl = iframe;
    this.iframeOverlayBridge = new IframeOverlayBridge(iframe);
    this.iframeOverlayBridge.connect();
    this.controlsEl = controls;
    this.zoomLabelEl = zoomLabel;
  }

  /**
   * Met en place les observateurs liés à la taille et aux mutations.
   *
   * @summary Observe la mise en page du composant.
   * @internal
   */
  private observeLayout(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.dispatchZoomState();
      });
      this.resizeObserver.observe(this);
    }

    this.mutationObserver = new MutationObserver(() => {
      this.dispatchZoomState();
    });
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: false,
    });
  }

  /**
   * Met à jour l’ensemble de l’état interne du composant.
   *
   * @internal
   */
  private updateAll(): void {
    this.updateIframeAttributes();
    this.updateZoom();
    this.updateControls();
    this.updateInteraction();
    this.dispatchZoomState();
  }

  /**
   * Répercute les attributs publics sur la vraie balise `<iframe>`.
   *
   * @summary Synchronise les attributs de l’iframe native.
   * @internal
   */
  private updateIframeAttributes(): void {
    if (this.iframeEl === null) {
      return;
    }

    this.iframeEl.title = this.getAttribute('aria-label')?.trim()
      || this.getAttribute('title')?.trim()
      || 'Embedded content';

    if (this.src === '') {
      this.iframeEl.removeAttribute('src');
    } else {
      this.iframeEl.src = this.src;
    }

    if (this.srcdoc === '') {
      this.iframeEl.removeAttribute('srcdoc');
    } else {
      this.iframeEl.srcdoc = this.srcdoc;
    }

    if (this.fullscreen) {
      this.iframeEl.setAttribute('allowfullscreen', '');
    } else {
      this.iframeEl.removeAttribute('allowfullscreen');
    }

    if (this.loading === '') {
      this.iframeEl.removeAttribute('loading');
    } else {
      this.iframeEl.setAttribute('loading', this.loading);
    }

    if (this.sandbox === '') {
      this.iframeEl.removeAttribute('sandbox');
    } else {
      this.iframeEl.setAttribute('sandbox', this.sandbox);
    }

    if (this.referrerPolicy === '') {
      this.iframeEl.removeAttribute('referrerpolicy');
    } else {
      this.iframeEl.setAttribute('referrerpolicy', this.referrerPolicy);
    }
  }

  /**
   * Applique le niveau de zoom au composant via variable CSS.
   *
   * @summary Met à jour la variable CSS de zoom.
   * @internal
   */
  private updateZoom(): void {
    this.style.setProperty('--tp-iframe-zoom', String(this.zoom));
  }

  private updateControls(): void {
    if (this.controlsEl !== null) {
      this.controlsEl.toggleAttribute('hidden', !this.controls);
    }

    if (this.zoomLabelEl !== null) {
      this.zoomLabelEl.textContent = formatZoom(this.zoom);
    }
  }

  /**
   * Applique l’état d’interaction au composant.
   *
   * @summary Met à jour l’interaction pointeur.
   * @internal
   */
  private updateInteraction(): void {
    this.setAttribute('data-tp-iframe-interaction', String(this.interaction));

    if (this.iframeEl !== null) {
      this.iframeEl.style.pointerEvents = this.interaction ? 'auto' : 'none';
    }
  }

  /**
   * Retourne la largeur de débordement horizontale.
   *
   * @summary Mesure le débordement horizontal du viewport.
   * @returns Largeur de débordement en pixels.
   * @internal
   */
  private getOverflowWidth(): number {
    if (this.viewportEl === null) {
      return 0;
    }

    return Math.max(
      0,
      this.viewportEl.scrollWidth - this.viewportEl.clientWidth,
    );
  }

  /**
   * Émet l’événement `tp-iframe-change`.
   *
   * @summary Émet l’état courant de l’iframe.
   * @internal
   */
  private dispatchZoomState(): void {
    this.dispatchEvent(
      new CustomEvent('tp-iframe-change', {
        bubbles: true,
        detail: {
          interaction: this.interaction,
          overflowWidth: this.getOverflowWidth(),
          scrollPosition: this.viewportEl?.scrollLeft ?? 0,
          zoom: this.zoom,
          zoomText: formatZoom(this.zoom),
        },
      }),
    );
  }
}

/**
 * Enregistre l’élément personnalisé `tp-iframe`
 * if it is not already defined.
 *
 * @summary Enregistre le custom element `tp-iframe`.
 * @internal
 */
if (!customElements.get('tp-iframe')) {
  customElements.define('tp-iframe', TpIframe);
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
