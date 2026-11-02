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
 * @attr {string} for = "" - ID of the element whose source text is copied, without a leading #.
 * @attr {string} icon = "copy" - Icon name displayed before copying; defaults to copy.
 * @attr {string} success-icon = "check" - Icon name displayed after a successful copy; defaults to check.
 * @attr {string} error-icon = "warning" - Icon name displayed after a failed clipboard copy; defaults to warning.
 * @attr {string} copied-text = "Copied!" - Accessible feedback text after a successful copy; defaults to Copied!.
 *


 *
 * @example
 * <tp-box>
 * <tp-box id="intro-copy-code" style="width:300px">
 * <pre><code>const answer = 6 * 7;</code></pre>
 * </tp-box>
 * <tp-copy-code for="intro-copy-code"></tp-copy-code>
 * </tp-box>
 * @cssprop [--tp-copy-code-error-color=red] Color of the copy control while reporting a failed clipboard operation.
 * @cssprop [--tp-copy-code-success-color=green] Color of the copy control while confirming a successful clipboard operation.
 * @event tp-copy-code-success Emitted after clipboard writing succeeds. The detail gives the copied text length in UTF-16 code units and the source element.
 * @eventdetail tp-copy-code-success { length: number; target: HTMLElement }
 * @event tp-copy-code-error Emitted when the target cannot be resolved or its contents cannot be copied; message explains the failure.
 * @eventdetail tp-copy-code-error { message: string }
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
     * @summary ID of the element whose source text is copied, without a leading #.
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
     * @summary Icon name displayed before copying; defaults to copy.
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
     * @summary Icon name displayed after a successful copy; defaults to check.
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
     * @summary Icon name displayed after a failed clipboard copy; defaults to warning.
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
     * @summary Accessible feedback text after a successful copy; defaults to Copied!.
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
     * @summary Copies the target source text to the clipboard. Resolves to true on success, or false when the target is missing or copying fails; updates feedback and emits the corresponding result event.
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
