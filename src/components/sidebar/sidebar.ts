// tp-docgen:dependencies:start

// tp-docgen:dependencies:end

import { TpBase } from "../base/base";
import style from "./sidebar.css?inline";

/**
 * @module components/sidebar
 * @summary Sidebar layout component.
 */

/**
 * Vérifie si une valeur correspond à un pourcentage CSS valide.
 *
 * Exemples valides :
 * - `50%`
 * - `65.5%`
 * - `100%`
 *
 * Exemples invalides :
 * - `50`
 * - `abc`
 * - `%`
 * - `-10%`
 */
function isPercentage(value: string): boolean {
	if (!/^(?:\d+|\d*\.\d+)%$/.test(value)) {
		return false;
	}

	const numericValue = Number.parseFloat(value);
	return numericValue > 0 && numericValue <= 100;
}

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
export class TpSidebar extends TpBase {
	/**
	 * Identifiant de la feuille de styles globale injectée une seule fois.
	 */
	private static readonly styleId = "tp-sidebar-styles";

	/**
	 * Liste des attributs observés.
	 */
	public static get observedAttributes(): string[] {
		return ["side-width", "content-width", "gap", "right-sidebar"];
	}

	/**
	 * Valeur de l'attribut `side-width`.
	 */
	public get sideWidth(): string {
		return this.getAttribute("side-width") ?? "";
	}

	public set sideWidth(value: string) {
		if (value === "") {
			this.removeAttribute("side-width");
			return;
		}

		this.setAttribute("side-width", value);
	}

	/**
	 * Valeur valide de l'attribut `content-width`.
	 *
	 * Retourne une chaîne vide si l'attribut est absent ou invalide.
	 */
	public get contentWidth(): string {
		const value = this.getAttribute("content-width") ?? "";
		return isPercentage(value) ? value : "";
	}

	public set contentWidth(value: string) {
		if (value === "") {
			this.removeAttribute("content-width");
			return;
		}

		if (!isPercentage(value)) {
			throw new TypeError(
				'The "content-width" attribute must be a percentage string like "50%" or "65.5%".',
			);
		}

		this.setAttribute("content-width", value);
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
	 * Indique si la sidebar correspond au dernier enfant.
	 */
	public get rightSidebar(): boolean {
		return this.hasAttribute("right-sidebar");
	}

	public set rightSidebar(value: boolean) {
		if (value) {
			this.setAttribute("right-sidebar", "");
			return;
		}

		this.removeAttribute("right-sidebar");
	}

	/**
	 * Injecte les styles globaux puis applique les styles réactifs.
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.updateStyles();
	}

	/**
	 * Réagit aux changements des attributs observés.
	 */
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		this.updateStyles();
	}

	/**
	 * Cleans up the sidebar instance.
	 */
	public disconnectedCallback(): void {}

	/**
	 * Injecte la feuille de styles globale une seule fois.
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpSidebar.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpSidebar.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	/**
	 * Met à jour les variables CSS et styles inline de l'instance.
	 */
	private updateStyles(): void {
		if (this.sideWidth === "") {
			this.style.removeProperty("--tp-sidebar-side-width");
		} else {
			this.style.setProperty("--tp-sidebar-side-width", this.sideWidth);
		}

		if (this.contentWidth === "") {
			this.style.removeProperty("--tp-sidebar-content-width");
		} else {
			this.style.setProperty("--tp-sidebar-content-width", this.contentWidth);
		}

		this.style.gap = this.gap;
	}
}

if (!customElements.get("tp-sidebar")) {
	customElements.define("tp-sidebar", TpSidebar);
}
