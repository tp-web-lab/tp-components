// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./switcher.css?inline";

/**
 * Compteur interne utilisé pour générer un identifiant unique par instance.
 */
let instanceCount = 0;

/**
 * Vérifie si une valeur correspond à un entier strictement positif.
 */
function isPositiveInteger(value: string): boolean {
	return /^[1-9]\d*$/.test(value);
}

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
export class TpSwitcher extends TpBase {
	/**
	 * Identifiant de la feuille de styles globale injectée une seule fois.
	 */
	private static readonly styleId = "tp-switcher-styles";

	/**
	 * Élément `<style>` propre à l'instance, utilisé pour la règle `max-horizontal`.
	 */
	private maxHorizontalStyleEl: HTMLStyleElement | null = null;

	/**
	 * Identifiant unique de l'instance.
	 */
	private instanceId: string | null = null;

	/**
	 * Liste des attributs observés.
	 */
	public static get observedAttributes(): string[] {
		return ["threshold", "gap", "max-horizontal"];
	}

	/**
	 * Valeur de l'attribut `threshold`.
	 */
	public get threshold(): string {
		return this.getAttribute("threshold") ?? "";
	}

	public set threshold(value: string) {
		if (value === "") {
			this.removeAttribute("threshold");
			return;
		}

		this.setAttribute("threshold", value);
	}

	/**
	 * Valeur de l'attribut `gap`.
	 */
	public get gap(): string {
		return this.getAttribute("gap") ?? "";
	}

	public set gap(value: string) {
		if (value === "") {
			this.removeAttribute("gap");
			return;
		}

		this.setAttribute("gap", value);
	}

	/**
	 * Valeur valide de l'attribut `max-horizontal`.
	 *
	 * Retourne un entier strictement positif si l'attribut est valide,
	 * sinon `null`.
	 */
	public get maxHorizontal(): number | null {
		const value = this.getAttribute("max-horizontal");
		if (value === null || !isPositiveInteger(value)) {
			return null;
		}

		return Number(value);
	}

	public set maxHorizontal(value: number | null) {
		if (value === null) {
			this.removeAttribute("max-horizontal");
			return;
		}

		if (!Number.isInteger(value) || value < 1) {
			throw new TypeError(
				'The "max-horizontal" attribute must be a positive integer.',
			);
		}

		this.setAttribute("max-horizontal", String(value));
	}

	/**
	 * Injecte les styles globaux puis applique les styles réactifs.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureInstanceId();
		this.updateStyles();
		this.updateMaxHorizontalStyle();
	}

	/**
	 * Réagit aux changements des attributs observés.
	 * @internal
	 */
	protected attributeChangedCallback(name: string): void {
		this.updateStyles();

		if (name === "max-horizontal") {
			this.updateMaxHorizontalStyle();
		}
	}

	/**
	 * Supprime le style d'instance lorsque l'élément est retiré du document.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.removeMaxHorizontalStyle();
	}

	/**
	 * Injecte la feuille de styles globale une seule fois.
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpSwitcher.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpSwitcher.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	/**
	 * Garantit qu'un identifiant d'instance existe.
	 */
	private ensureInstanceId(): void {
		if (this.instanceId !== null) {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-switcher-${String(instanceCount)}`;
		this.setAttribute("data-tp-switcher-id", this.instanceId);
	}

	/**
	 * Met à jour les variables CSS de l'instance.
	 */
	private updateStyles(): void {
		if (this.threshold === "") {
			this.style.removeProperty("--tp-switcher-threshold");
		} else {
			this.style.setProperty("--tp-switcher-threshold", this.threshold);
		}

		if (this.gap === "") {
			this.style.removeProperty("--tp-switcher-gap");
		} else {
			this.style.setProperty("--tp-switcher-gap", this.gap);
		}
	}

	/**
	 * Met à jour la règle CSS spécifique à l'instance pour `max-horizontal`.
	 */
	private updateMaxHorizontalStyle(): void {
		this.removeMaxHorizontalStyle();

		if (!this.isConnected) {
			return;
		}

		const maxHorizontal = this.maxHorizontal;
		if (maxHorizontal === null) {
			return;
		}

		this.ensureInstanceId();

		const selector = `tp-switcher[data-tp-switcher-id="${String(this.instanceId)}"]`;

		const styleEl = document.createElement("style");
		// Account for the gaps in a full row without overriding the narrow layout.
		styleEl.textContent = `${selector} > * {flex-basis: max(calc((var(--tp-switcher-threshold, 30rem) - 100%) * 999), calc((100% - ${String(maxHorizontal - 1)} * var(--tp-switcher-gap, 1rem)) / ${String(maxHorizontal)}));}`;

		document.head.append(styleEl);
		this.maxHorizontalStyleEl = styleEl;
	}

	/**
	 * Supprime la règle CSS spécifique à l'instance si elle existe.
	 */
	private removeMaxHorizontalStyle(): void {
		this.maxHorizontalStyleEl?.remove();
		this.maxHorizontalStyleEl = null;
	}
}

if (!customElements.get("tp-switcher")) {
	customElements.define("tp-switcher", TpSwitcher);
}
