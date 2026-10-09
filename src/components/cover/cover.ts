// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./cover.css?inline";

/**
 * @module components/cover
 * @summary Cover layout component.
 */

/**
 * Compteur interne utilisé pour générer un identifiant unique par instance.
 */
let instanceCount = 0;

/**
 * Vérifie si une valeur ressemble à un sélecteur simple.
 */
function isSimpleSelector(value: string): boolean {
	const trimmed = value.trim();

	if (trimmed === "") {
		return false;
	}

	if (/[,\s>+~:]/.test(trimmed)) {
		return false;
	}

	return (
		/^[a-zA-Z][\w-]*$/.test(trimmed) ||
		/^\.[\w-]+$/.test(trimmed) ||
		/^#[\w-]+$/.test(trimmed) ||
		/^\[[\w-]+(?:="[^"]*")?\]$/.test(trimmed)
	);
}

/**
 * Cover layout component, without Shadow DOM.
 *
 * @summary Creates a vertical cover layout with an optional centered heading element.
 * @tagname tp-cover
 *
 * @attr {string} gap = "1rem" - Gap between direct children. When absent, uses the --tp-cover-gap CSS default.
 * @attr {string} heading = "" - Simple CSS selector (for example h2, .hero or #title) identifying a direct child to center vertically in the available space, not the heading text. Empty by default: no child is selected for centering.
 * @attr {string} min-height = "100vh" - Minimum block size of the cover. When absent, uses the --tp-cover-min-height CSS default.
 * @attr {string} padding = "1rem" - Padding applied inside the cover. When absent, uses the --tp-cover-padding CSS default.
 *
 *
 * @cssprop --tp-cover-gap Default gap between direct children.
 * @cssprop --tp-cover-min-height Default minimum block size.
 * @cssprop --tp-cover-padding Default inner padding.
 * @example
 * <tp-cover min-height="16rem" heading="h2">
 * <p>A short introduction</p>
 * <h2>A heading centered in the cover</h2>
 * <p>Supporting information stays below.</p>
 * </tp-cover>
 */
export class TpCover extends TpBase {
	private static readonly styleId = "tp-cover-styles";

	private headingStyleEl: HTMLStyleElement | null = null;
	private instanceId: string | null = null;

	public static get observedAttributes(): string[] {
		return ["heading", "min-height", "gap", "padding"];
	}

	public get heading(): string {
		const value = this.getAttribute("heading") ?? "";
		return isSimpleSelector(value) ? value : "";
	}

	public set heading(value: string) {
		if (value === "") {
			this.removeAttribute("heading");
			return;
		}

		if (!isSimpleSelector(value)) {
			throw new TypeError(
				'The "heading" attribute must be a simple selector like "h1", ".hero", "#title" or "[data-role=\\"hero\\"]".',
			);
		}

		this.setAttribute("heading", value);
	}

	public get minHeight(): string {
		return this.getAttribute("min-height") ?? "";
	}

	public set minHeight(value: string) {
		if (value === "") {
			this.removeAttribute("min-height");
			return;
		}

		this.setAttribute("min-height", value);
	}

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

	public get padding(): string {
		return this.getAttribute("padding") ?? "";
	}

	public set padding(value: string) {
		if (value === "") {
			this.removeAttribute("padding");
			return;
		}

		this.setAttribute("padding", value);
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureInstanceId();
		this.updateStyles();
		this.updateHeadingStyle();
	}

	protected attributeChangedCallback(name: string): void {
		this.updateStyles();

		if (name === "heading") {
			this.updateHeadingStyle();
		}
	}

	public disconnectedCallback(): void {
		super.connectedCallback();
		this.removeHeadingStyle();
	}

	private ensureStyles(): void {
		if (document.getElementById(TpCover.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpCover.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	private ensureInstanceId(): void {
		if (this.instanceId !== null) {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-cover-${instanceCount}`;
		this.setAttribute("data-tp-cover-id", this.instanceId);
	}

	private updateStyles(): void {
		if (this.minHeight === "") {
			this.style.removeProperty("--tp-cover-min-height");
		} else {
			this.style.setProperty("--tp-cover-min-height", this.minHeight);
		}

		if (this.gap === "") {
			this.style.removeProperty("--tp-cover-gap");
		} else {
			this.style.setProperty("--tp-cover-gap", this.gap);
		}

		if (this.padding === "") {
			this.style.removeProperty("--tp-cover-padding");
		} else {
			this.style.setProperty("--tp-cover-padding", this.padding);
		}
	}

	private updateHeadingStyle(): void {
		this.removeHeadingStyle();

		if (!this.isConnected) {
			return;
		}

		const heading = this.heading;
		if (heading === "") {
			return;
		}

		this.ensureInstanceId();

		const selector = `tp-cover[data-tp-cover-id="${this.instanceId}"]`;

		const styleEl = document.createElement("style");
		styleEl.textContent = `${selector} > :first-child:not(${heading}) {margin-block-start: 0;}${selector} > :last-child:not(${heading}) {margin-block-end: 0;}${selector} > ${heading} {margin-block: auto;}`;

		document.head.append(styleEl);
		this.headingStyleEl = styleEl;
	}

	private removeHeadingStyle(): void {
		this.headingStyleEl?.remove();
		this.headingStyleEl = null;
	}
}

if (!customElements.get("tp-cover")) {
	customElements.define("tp-cover", TpCover);
}
