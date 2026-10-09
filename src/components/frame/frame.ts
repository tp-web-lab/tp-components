// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./frame.css?inline";

/**
 * Représente une valeur d'aspect ratio valide.
 */
interface FrameAspectRatio {
	denominator: number;
	numerator: number;
	raw: string;
}

/**
 * Vérifie et parse une valeur d'aspect ratio au format `numerator:denominator`.
 *
 * Exemples valides :
 * - `16:9`
 * - `4:3`
 * - `1:1`
 *
 * Exemples invalides :
 * - `16/9`
 * - `abc`
 * - `16:0`
 * - `0:9`
 */
function parseAspectRatio(value: string): FrameAspectRatio | null {
	const match = /^(?<numerator>[1-9]\d*):(?<denominator>[1-9]\d*)$/.exec(
		value.trim(),
	);

	if (!match?.groups) {
		return null;
	}

	const numerator = Number(match.groups.numerator);
	const denominator = Number(match.groups.denominator);

	if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
		return null;
	}

	if (numerator < 1 || denominator < 1) {
		return null;
	}

	return {
		denominator,
		numerator,
		raw: `${String(numerator)}:${String(denominator)}`,
	};
}

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
export class TpFrame extends TpBase {
	/**
	 * Identifiant de la feuille de styles globale injectée une seule fois.
	 */
	private static readonly styleId = "tp-frame-styles";

	/**
	 * Liste des attributs observés.
	 */
	public static get observedAttributes(): string[] {
		return ["aspect-ratio"];
	}

	/**
	 * Explicit valid aspect ratio in numerator:denominator notation.
	 *
	 * Returns an empty string when absent or invalid, leaving the CSS defaults active.
	 */
	public get aspectRatio(): string {
		const value = this.getAttribute("aspect-ratio") ?? "";
		return parseAspectRatio(value)?.raw ?? "";
	}

	public set aspectRatio(value: string) {
		if (value === "") {
			this.removeAttribute("aspect-ratio");
			return;
		}

		const parsed = parseAspectRatio(value);
		if (parsed === null) {
			throw new TypeError(
				'The "aspect-ratio" attribute must be a string like "16:9", "4:3" or "1:1".',
			);
		}

		this.setAttribute("aspect-ratio", parsed.raw);
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
	protected attributeChangedCallback(): void {
		this.updateStyles();
	}

	/**
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
	}

	/**
	 * Injecte la feuille de styles globale une seule fois.
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpFrame.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpFrame.styleId;
		styleEl.textContent = style;

		document.head.append(styleEl);
	}

	/**
	 * Met à jour les variables CSS de l'instance à partir de `aspect-ratio`.
	 *
	 * Si l'attribut est absent ou invalide, les variables CSS inline sont retirées
	 * afin de laisser agir les valeurs par défaut définies dans la feuille CSS.
	 */
	private updateStyles(): void {
		const parsed = parseAspectRatio(this.getAttribute("aspect-ratio") ?? "");

		if (parsed === null) {
			this.style.removeProperty("--tp-frame-numerator");
			this.style.removeProperty("--tp-frame-denominator");
			return;
		}

		this.style.setProperty("--tp-frame-numerator", String(parsed.numerator));
		this.style.setProperty(
			"--tp-frame-denominator",
			String(parsed.denominator),
		);
	}
}

if (!customElements.get("tp-frame")) {
	customElements.define("tp-frame", TpFrame);
}
