/**
 * @module components/copy-code
 * @summary Copy-to-clipboard button component.
 */
/**
 * @tp-dependency tp-animation
 * @summary Applies an animation to a target element.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
import "../animation/animation.js";
import "../icon/icon.js";
/**
 * Bouton de copie de code basé sur `<tp-icon>`, avec feedback visuel,
 * changement temporaire d’icône et animation.
 *
 * The target can be defined as:
 * - via l’attribut `for`, qui référence l’`id` d’un élément cible
 * - via la propriété `forElement`, qui reçoit directement un `HTMLElement`
 *
 * Target resolution:
 * 1. `forElement`
 * 2. attribut `for`
 *
 * Content extraction:
 * 1. `getValue()` si disponible
 * 2. `getCode()` si disponible
 * 3. `textContent`
 *
 * @summary Copies the textual content of a target component to the clipboard.
 * @tagname tp-copy-code
 *
 * @attr {string} for = "" - Identifiant de l’élément cible.
 * @attr {string} icon = "copy" - Nom de l’icône affichée à l’état normal. Valeur par défaut : `copy`.
 * @attr {string} success-icon = "check" - Nom de l’icône affichée après une copie réussie. Valeur par défaut : `check`.
 * @attr {string} error-icon = "warning" - Nom de l’icône affichée après une erreur. Valeur par défaut : `warning`.
 * @attr {string} copied-text = "Copied!" - Libellé accessible après une copie réussie. Valeur par défaut : `Copied!`.
 *
 * @event tp-copy-code-success Émis quand la copie a réussi.
 * @event tp-copy-code-error Émis quand la copie a échoué.
 *
 * @example
 * <tp-box>
 * <tp-box id="intro-copy-code" style="width:300px">
 * <pre><code>const answer = 6 * 7;</code></pre>
 * </tp-box>
 * <tp-copy-code for="intro-copy-code"></tp-copy-code>
 * </tp-box>
 */
export declare class TpCopyCode extends TpBase {
    /**
     * Identifiant unique de la feuille de styles injectée globalement.
     *
     * @summary Identifiant du style global du composant.
     * @internal
     */
    private static readonly styleId;
    /**
     * Référence directe éventuelle vers la cible.
     *
     * @summary Cible explicite fournie par l’API JS.
     * @internal
     */
    private targetEl;
    /**
     * Référence vers l’icône interne.
     *
     * @summary Référence vers le composant `tp-icon`.
     * @internal
     */
    private iconEl;
    /**
     * Référence vers le composant d’animation interne.
     *
     * @summary Référence vers le composant `tp-animation`.
     * @internal
     */
    private animationEl;
    /**
     * Référence vers l’élément interactif servant d’ancre.
     *
     * @summary Référence vers l’élément ancre de l’icône.
     * @internal
     */
    private anchorEl;
    /**
     * Identifiant unique de l’ancre interne.
     *
     * @summary Identifiant CSS unique de l’ancre.
     * @internal
     */
    private anchorId;
    /**
     * Timer d’effacement de l’état temporaire.
     *
     * @summary Gère le retour à l’état visuel normal.
     * @internal
     */
    private stateTimer;
    /**
     * État visuel courant du composant.
     *
     * @summary État visuel du bouton.
     * @internal
     */
    private state;
    /**
     * Handler de clavier.
     *
     * @summary Déclenche la copie au clavier.
     * @internal
     */
    private readonly handleKeydown;
    /**
     * Handler de clic.
     *
     * @summary Déclenche la copie au clic.
     * @internal
     */
    private readonly handleClick;
    /**
     * Liste des attributs observés par le composant.
     *
     * @summary Déclare les attributs observés.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Identifiant de l’élément cible.
     *
     * @attr for
     */
    get htmlFor(): string;
    /**
     * Définit l’identifiant de l’élément cible.
     *
     * @param value Identifiant de la cible.
     */
    set htmlFor(value: string);
    /**
     * Nom de l’icône affichée à l’état normal.
     *
     * @attr icon
     * @default copy
     */
    get icon(): string;
    /**
     * Définit l’icône affichée à l’état normal.
     *
     * @param value Nom d’icône.
     */
    set icon(value: string);
    /**
     * Nom de l’icône affichée après une copie réussie.
     *
     * @attr success-icon
     * @default check
     */
    get successIcon(): string;
    /**
     * Définit l’icône affichée après une copie réussie.
     *
     * @param value Nom d’icône.
     */
    set successIcon(value: string);
    /**
     * Nom de l’icône affichée après une erreur.
     *
     * @attr error-icon
     * @default warning
     */
    get errorIcon(): string;
    /**
     * Définit l’icône affichée après une erreur.
     *
     * @param value Nom d’icône.
     */
    set errorIcon(value: string);
    /**
     * Libellé accessible après une copie réussie.
     *
     * @attr copied-text
     * @default Copied!
     */
    get copiedText(): string;
    /**
     * Définit le libellé accessible après une copie réussie.
     *
     * @param value Libellé accessible.
     */
    set copiedText(value: string);
    /**
     * Cible explicite définie par l’API JavaScript.
     *
     * Cette propriété est prioritaire sur l’attribut `for`.
     *
     * @summary Définit la cible explicitement.
     */
    get forElement(): HTMLElement | null;
    /**
     * Définit la cible explicitement.
     *
     * @param value Élément cible.
     */
    set forElement(value: HTMLElement | null);
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
     * @summary Nettoie l’état temporaire du composant.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Copie dans le presse-papiers le contenu de la cible.
     *
     * @summary Copie le contenu texte de la cible.
     * @returns `true` si la copie a réussi, sinon `false`.
     */
    copy(): Promise<boolean>;
    /**
     * Garantit qu’un identifiant unique d’ancre existe.
     *
     * @summary Initialise l’identifiant unique de l’ancre.
     * @internal
     */
    private ensureAnchorId;
    /**
     * Crée le DOM interne si nécessaire.
     *
     * Structure générée :
     *
     * ```html
     * <tp-copy-code>
     *   <span id="...">
     *     <tp-animation target="[data-tp-copy-code-icon]">
     *       <tp-icon data-tp-copy-code-icon name="copy"></tp-icon>
     *     </tp-animation>
     *   </span>
     * </tp-copy-code>
     * ```
     *
     * @summary Crée ou réutilise le DOM interne.
     * @internal
     */
    private ensureDom;
    /**
     * Injecte la feuille de styles du composant dans `document.head`
     * si elle n’existe pas encore.
     *
     * @summary Injecte la feuille de styles globale du composant.
     * @internal
     */
    private ensureStyles;
    /**
     * Retourne l’élément cible effectif.
     *
     * Priorité :
     * 1. `forElement`
     * 2. attribut `for`
     *
     * @summary Résout la cible du bouton de copie.
     * @returns Élément cible, ou `null`.
     * @internal
     */
    private resolveTarget;
    /**
     * Extrait le contenu textuel à copier depuis une cible.
     *
     * Priorité :
     * 1. `getValue()`
     * 2. `getCode()`
     * 3. `textContent`
     *
     * @summary Extrait le contenu texte de la cible.
     * @param target Élément cible.
     * @returns Texte à copier.
     * @internal
     */
    private getTargetContent;
    /**
     * Met à jour l’icône en fonction de l’état courant.
     *
     * @summary Synchronise l’icône affichée.
     * @internal
     */
    private syncIcon;
    /**
     * Met à jour la configuration de l’animation interne.
     *
     * @summary Synchronise l’animation affichée.
     * @internal
     */
    private syncAnimation;
    /**
     * Déclenche le feedback visuel de copie réussie.
     *
     * @summary Déclenche le feedback visuel de succès.
     * @internal
     */
    private showSuccessFeedback;
    /**
     * Change l’état visuel du composant.
     *
     * Après un état temporaire (`success` ou `error`), le composant
     * revient automatiquement à l’état `idle`.
     *
     * @summary Met à jour l’état visuel du bouton.
     * @param nextState Nouvel état.
     * @internal
     */
    private setState;
    /**
     * Émet un événement d’erreur standardisé.
     *
     * @summary Émet l’événement `tp-copy-code-error`.
     * @param message Message d’erreur.
     * @internal
     */
    private emitError;
}
/**
 * Déclaration globale pour typer automatiquement
 * `document.querySelector('tp-copy-code')`.
 *
 * @summary Étend le typage global des éléments HTML.
 * @internal
 */
declare global {
    interface HTMLElementTagNameMap {
        "tp-copy-code": TpCopyCode;
    }
}
