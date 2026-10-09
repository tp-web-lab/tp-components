/**
 * @module components/copy-code
 * @summary Copy-to-clipboard button component.
 */

// tp-docgen:dependencies:start
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
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./copy-code.css?inline";
import "../animation/animation.js";
import "../icon/icon.js";
import { TpAnimation } from "../animation/animation.js";
import { TpIcon } from "../icon/icon.js";

const SUCCESS_TIMEOUT = 1500;

/**
 * État visuel courant du bouton de copie.
 *
 * - `idle` : état normal
 * - `success` : copie réussie
 * - `error` : erreur pendant la copie
 *
 * @summary Représente l’état visuel de `<tp-copy-code>`.
 * @internal
 */
type TpCopyCodeState = "idle" | "success" | "error";

/**
 * Compteur global d’instances.
 *
 * @summary Génère des identifiants uniques d’ancre.
 * @internal
 */
let instanceCount = 0;

/**
 * Checks whether a value exposes a `getValue()` method.
 *
 * @summary Détecte une cible de type éditeur.
 * @param value Valeur à tester.
 * @returns `true` si `value` expose `getValue()`.
 * @internal
 */
function hasGetValue(value: unknown): value is { getValue: () => string } {
	return (
		typeof value === "object" &&
		value !== null &&
		"getValue" in value &&
		typeof (value as { getValue?: unknown }).getValue === "function"
	);
}

/**
 * Checks whether a value exposes a `getCode()` method.
 *
 * @summary Détecte une cible exposant `getCode()`.
 * @param value Valeur à tester.
 * @returns `true` si `value` expose `getCode()`.
 * @internal
 */
function hasGetCode(value: unknown): value is { getCode: () => string } {
	return (
		typeof value === "object" &&
		value !== null &&
		"getCode" in value &&
		typeof (value as { getCode?: unknown }).getCode === "function"
	);
}

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
export class TpCopyCode extends TpBase {
	/**
	 * Identifiant unique de la feuille de styles injectée globalement.
	 *
	 * @summary Identifiant du style global du composant.
	 * @internal
	 */
	private static readonly styleId = "tp-copy-code-styles";

	/**
	 * Référence directe éventuelle vers la cible.
	 *
	 * @summary Cible explicite fournie par l’API JS.
	 * @internal
	 */
	private targetEl: HTMLElement | null = null;

	/**
	 * Référence vers l’icône interne.
	 *
	 * @summary Référence vers le composant `tp-icon`.
	 * @internal
	 */
	private iconEl: TpIcon | null = null;

	/**
	 * Référence vers le composant d’animation interne.
	 *
	 * @summary Référence vers le composant `tp-animation`.
	 * @internal
	 */
	private animationEl: TpAnimation | null = null;

	/**
	 * Référence vers l’élément interactif servant d’ancre.
	 *
	 * @summary Référence vers l’élément ancre de l’icône.
	 * @internal
	 */
	private anchorEl: HTMLSpanElement | null = null;

	/**
	 * Identifiant unique de l’ancre interne.
	 *
	 * @summary Identifiant CSS unique de l’ancre.
	 * @internal
	 */
	private anchorId = "";

	/**
	 * Timer d’effacement de l’état temporaire.
	 *
	 * @summary Gère le retour à l’état visuel normal.
	 * @internal
	 */
	private stateTimer: number | null = null;

	/**
	 * État visuel courant du composant.
	 *
	 * @summary État visuel du bouton.
	 * @internal
	 */
	private state: TpCopyCodeState = "idle";

	/**
	 * Handler de clavier.
	 *
	 * @summary Déclenche la copie au clavier.
	 * @internal
	 */
	private readonly handleKeydown = (event: KeyboardEvent): void => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		void this.copy();
	};

	/**
	 * Handler de clic.
	 *
	 * @summary Déclenche la copie au clic.
	 * @internal
	 */
	private readonly handleClick = (): void => {
		void this.copy();
	};

	/**
	 * Liste des attributs observés par le composant.
	 *
	 * @summary Déclare les attributs observés.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["for", "icon", "success-icon", "error-icon", "copied-text"];
	}

	/**
	 * Identifiant de l’élément cible.
	 *
	 * @attr for
	 */
	public get htmlFor(): string {
		return this.getAttribute("for") ?? "";
	}

	/**
	 * Définit l’identifiant de l’élément cible.
	 *
	 * @param value Identifiant de la cible.
	 */
	public set htmlFor(value: string) {
		if (value === "") {
			this.removeAttribute("for");
			return;
		}

		this.setAttribute("for", value);
	}

	/**
	 * Nom de l’icône affichée à l’état normal.
	 *
	 * @attr icon
	 * @default copy
	 */
	public get icon(): string {
		return this.getAttribute("icon") ?? "copy";
	}

	/**
	 * Définit l’icône affichée à l’état normal.
	 *
	 * @param value Nom d’icône.
	 */
	public set icon(value: string) {
		if (value === "") {
			this.removeAttribute("icon");
			return;
		}

		this.setAttribute("icon", value);
	}

	/**
	 * Nom de l’icône affichée après une copie réussie.
	 *
	 * @attr success-icon
	 * @default check
	 */
	public get successIcon(): string {
		return this.getAttribute("success-icon") ?? "check";
	}

	/**
	 * Définit l’icône affichée après une copie réussie.
	 *
	 * @param value Nom d’icône.
	 */
	public set successIcon(value: string) {
		if (value === "") {
			this.removeAttribute("success-icon");
			return;
		}

		this.setAttribute("success-icon", value);
	}

	/**
	 * Nom de l’icône affichée après une erreur.
	 *
	 * @attr error-icon
	 * @default warning
	 */
	public get errorIcon(): string {
		return this.getAttribute("error-icon") ?? "warning";
	}

	/**
	 * Définit l’icône affichée après une erreur.
	 *
	 * @param value Nom d’icône.
	 */
	public set errorIcon(value: string) {
		if (value === "") {
			this.removeAttribute("error-icon");
			return;
		}

		this.setAttribute("error-icon", value);
	}

	/**
	 * Libellé accessible après une copie réussie.
	 *
	 * @attr copied-text
	 * @default Copied!
	 */
	public get copiedText(): string {
		return this.getAttribute("copied-text") ?? "Copied!";
	}

	/**
	 * Définit le libellé accessible après une copie réussie.
	 *
	 * @param value Libellé accessible.
	 */
	public set copiedText(value: string) {
		if (value === "") {
			this.removeAttribute("copied-text");
			return;
		}

		this.setAttribute("copied-text", value);
	}

	/**
	 * Cible explicite définie par l’API JavaScript.
	 *
	 * Cette propriété est prioritaire sur l’attribut `for`.
	 *
	 * @summary Définit la cible explicitement.
	 */
	public get forElement(): HTMLElement | null {
		return this.targetEl;
	}

	/**
	 * Définit la cible explicitement.
	 *
	 * @param value Élément cible.
	 */
	public set forElement(value: HTMLElement | null) {
		this.targetEl = value;
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
		this.ensureAnchorId();
		this.ensureDom();

		this.setAttribute("role", "button");
		this.tabIndex = 0;
		this.setAttribute("data-state", this.state);

		this.addEventListener("click", this.handleClick);
		this.addEventListener("keydown", this.handleKeydown);

		this.syncIcon();
		this.syncAnimation();
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

		this.syncIcon();
		this.syncAnimation();
	}

	/**
	 * Callback du cycle de vie appelée lors de la déconnexion du composant.
	 *
	 * @summary Nettoie l’état temporaire du composant.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.removeEventListener("click", this.handleClick);
		this.removeEventListener("keydown", this.handleKeydown);

		if (this.stateTimer !== null) {
			window.clearTimeout(this.stateTimer);
			this.stateTimer = null;
		}
	}

	/**
	 * Copie dans le presse-papiers le contenu de la cible.
	 *
	 * @summary Copie le contenu texte de la cible.
	 * @returns `true` si la copie a réussi, sinon `false`.
	 */
	public async copy(): Promise<boolean> {
		const target = this.resolveTarget();

		if (target === null) {
			this.setState("error");
			this.emitError("No target element found.");
			return false;
		}

		const content = this.getTargetContent(target);

		try {
			await navigator.clipboard.writeText(content);
			this.setState("success");

			this.dispatchEvent(
				new CustomEvent("tp-copy-code-success", {
					bubbles: true,
					detail: {
						length: content.length,
						target,
					},
				}),
			);

			return true;
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Unknown clipboard error";

			this.setState("error");
			this.emitError(message);

			return false;
		}
	}

	/**
	 * Garantit qu’un identifiant unique d’ancre existe.
	 *
	 * @summary Initialise l’identifiant unique de l’ancre.
	 * @internal
	 */
	private ensureAnchorId(): void {
		if (this.anchorId !== "") {
			return;
		}

		instanceCount += 1;
		this.anchorId = `tp-copy-code-anchor-${String(instanceCount)}`;
	}

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
	private ensureDom(): void {
		const existingAnchor = this.querySelector(
			":scope > [data-tp-copy-code-anchor]",
		);
		const existingAnimation = this.querySelector(
			":scope > [data-tp-copy-code-anchor] tp-animation",
		);
		const existingIcon = this.querySelector(
			":scope > [data-tp-copy-code-anchor] tp-icon",
		);

		if (existingAnchor instanceof HTMLSpanElement) {
			this.anchorEl = existingAnchor;
		}

		if (existingAnimation instanceof TpAnimation) {
			this.animationEl = existingAnimation;
		}

		if (existingIcon instanceof TpIcon) {
			this.iconEl = existingIcon;
		}

		if (
			this.anchorEl instanceof HTMLSpanElement &&
			this.animationEl instanceof TpAnimation &&
			this.iconEl instanceof TpIcon
		) {
			this.anchorEl.id = this.anchorId;
			return;
		}

		this.textContent = "";

		const anchor = document.createElement("span");
		anchor.id = this.anchorId;
		anchor.setAttribute("data-tp-copy-code-anchor", "");

		const animation = document.createElement("tp-animation") as TpAnimation;
		animation.setAttribute("data-tp-copy-code-animation", "");
		animation.setAttribute("trigger", "manual");
		animation.setAttribute("target", "[data-tp-copy-code-icon]");
		animation.setAttribute("in", "pulse");

		const icon = document.createElement("tp-icon") as TpIcon;
		icon.setAttribute("data-tp-copy-code-icon", "");
		icon.setAttribute("name", this.icon);
		icon.setAttribute("aria-hidden", "true");

		animation.append(icon);
		anchor.append(animation);

		this.append(anchor);

		this.anchorEl = anchor;
		this.animationEl = animation;
		this.iconEl = icon;
	}

	/**
	 * Injecte la feuille de styles du composant dans `document.head`
	 * si elle n’existe pas encore.
	 *
	 * @summary Injecte la feuille de styles globale du composant.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpCopyCode.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpCopyCode.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

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
	private resolveTarget(): HTMLElement | null {
		if (this.targetEl instanceof HTMLElement) {
			return this.targetEl;
		}

		if (this.htmlFor === "") {
			return null;
		}

		const target = document.getElementById(this.htmlFor);
		return target instanceof HTMLElement ? target : null;
	}

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
	private getTargetContent(target: HTMLElement): string {
		if (hasGetValue(target)) {
			return target.getValue();
		}

		if (hasGetCode(target)) {
			return target.getCode();
		}

		return target.textContent ?? "";
	}

	/**
	 * Met à jour l’icône en fonction de l’état courant.
	 *
	 * @summary Synchronise l’icône affichée.
	 * @internal
	 */
	private syncIcon(): void {
		this.setAttribute(
			"aria-label",
			this.state === "success" ? this.copiedText : "Copy code",
		);
		if (!(this.iconEl instanceof HTMLElement)) {
			return;
		}

		let iconName = this.icon;

		if (this.state === "success") {
			iconName = this.successIcon;
		}

		if (this.state === "error") {
			iconName = this.errorIcon;
		}

		this.iconEl.setAttribute("name", iconName);
	}

	/**
	 * Met à jour la configuration de l’animation interne.
	 *
	 * @summary Synchronise l’animation affichée.
	 * @internal
	 */
	private syncAnimation(): void {
		if (!(this.animationEl instanceof HTMLElement)) {
			return;
		}

		this.animationEl.setAttribute("target", "[data-tp-copy-code-icon]");
		this.animationEl.setAttribute("trigger", "manual");
		this.animationEl.setAttribute("in", "pulse");
	}

	/**
	 * Déclenche le feedback visuel de copie réussie.
	 *
	 * @summary Déclenche le feedback visuel de succès.
	 * @internal
	 */
	private showSuccessFeedback(): void {
		const animation = this.animationEl as TpAnimation & {
			play?: () => Promise<void>;
			playIn?: () => Promise<void>;
			restart?: () => Promise<void>;
		};

		if (typeof animation.restart === "function") {
			void animation.restart();
			return;
		}

		if (typeof animation.playIn === "function") {
			void animation.playIn();
			return;
		}

		if (typeof animation.play === "function") {
			void animation.play();
		}
	}

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
	private setState(nextState: TpCopyCodeState): void {
		this.state = nextState;
		this.setAttribute("data-state", nextState);

		this.syncIcon();

		if (this.stateTimer !== null) {
			window.clearTimeout(this.stateTimer);
			this.stateTimer = null;
		}

		if (nextState === "success") {
			this.showSuccessFeedback();
		}

		if (nextState === "idle") {
			return;
		}

		this.stateTimer = window.setTimeout(() => {
			this.state = "idle";
			this.setAttribute("data-state", "idle");
			this.syncIcon();
			this.stateTimer = null;
		}, SUCCESS_TIMEOUT);
	}

	/**
	 * Émet un événement d’erreur standardisé.
	 *
	 * @summary Émet l’événement `tp-copy-code-error`.
	 * @param message Message d’erreur.
	 * @internal
	 */
	private emitError(message: string): void {
		this.dispatchEvent(
			new CustomEvent("tp-copy-code-error", {
				bubbles: true,
				detail: {
					message,
				},
			}),
		);
	}
}

/**
 * Enregistre l’élément personnalisé `tp-copy-code`
 * if it is not already defined.
 *
 * @summary Enregistre le custom element `tp-copy-code`.
 * @internal
 */
if (!customElements.get("tp-copy-code")) {
	customElements.define("tp-copy-code", TpCopyCode);
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





  