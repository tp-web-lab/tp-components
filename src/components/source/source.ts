/**
 * @module components/source
 * @summary Source repository link button.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./source.css?inline";

import "../icon-button/icon-button.js";

import { TpBase } from "../base/base.js";

const STYLE_ID = "tp-source-styles";

type TpSourceIconName = "github" | "gitlab" | "bitbucket" | "git";

function readSourceIconName(url: string): TpSourceIconName {
	const normalizedUrl = url.toLowerCase();
	if (normalizedUrl.includes("github")) return "github";
	if (normalizedUrl.includes("gitlab")) return "gitlab";
	if (normalizedUrl.includes("bitbucket")) return "bitbucket";
	return "git";
}

/**
 * `<tp-source>` displays a source repository button when a URL is available.
 *
 * @summary Source repository link button.
 * @tagname tp-source
 * @attr {string} url = "" - Source repository URL.
 * @example
 * <tp-source></tp-source>
 */
export class TpSource extends TpBase {
	public static get observedAttributes(): string[] {
		return ["url"];
	}

	public get url(): string {
		return this.getAttribute("url") ?? "";
	}

	public set url(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("url");
			return;
		}

		this.setAttribute("url", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.render();
	}

	protected attributeChangedCallback(): void {
		if (!this.isConnected) return;
		this.render();
	}

	private render(): void {
		const url = this.url.trim();
		this.toggleAttribute("hidden", url === "");

		if (url === "") {
			this.replaceChildren();
			return;
		}

		const iconName = readSourceIconName(url);
		const label = `Source: ${url}`;
		let button = this.querySelector<HTMLElement>(":scope > tp-icon-button");

		if (!(button instanceof HTMLElement)) {
			button = document.createElement("tp-icon-button");
			button.addEventListener("click", this.handleButtonClick);
			this.replaceChildren(button);
		}

		button.setAttribute("name", iconName);
		button.setAttribute("label", label);
		button.setAttribute("title", label);
		button.setAttribute("variant", "neutral");
		button.setAttribute("size", "m");
	}

	private handleButtonClick = (): void => {
		const url = this.url.trim();
		if (url === "") return;

		window.open(url, "_blank", "noopener,noreferrer");
	};
}

if (!customElements.get("tp-source")) {
	customElements.define("tp-source", TpSource);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-source": TpSource;
	}
}
