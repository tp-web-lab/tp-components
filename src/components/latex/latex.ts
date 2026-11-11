/**
 * @module components/latex
 * @summary Renders LaTeX documents with interactive components, MathJax formulas and TikZ figures.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-math
 * @summary renders LaTeX or AsciiMath expressions as inline or display-style SVG.
 */
/**
 * @tp-dependency tp-tikz
 * @summary Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
// tp-docgen:dependencies:end

/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
import { renderLatexToFragment } from "@tp/tp-latex";
import { dedent } from "../../utilities/code.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../math/math.js";
import "../tikz/tikz.js";
import style from "./latex.css?inline";

/**
 * The custom `<tp-latex>` element renders LaTeX documents, mathematical formulas and TikZ drawings.
 *
 * @summary Renders LaTeX documents, mathematical formulas and TikZ drawings.
 * @tagname tp-latex
 * @attr {string} src = "" - URL of a LaTeX document; takes precedence over value and inline source.
 * @attr {string} value = "" - LaTeX source; takes precedence over inline source when present.
 * @example
 * <tp-latex><script type="tp/latex">\section{A first document}
 * The area of a circle is $A=\pi r^2$.</script></tp-latex>
 *  @event tp-latex-rendered Emitted after document conversion. Nested formulas and figures may still be rendering.
 * @eventdetail tp-latex-rendered { html: string }
 * @event tp-latex-error Emitted when loading or conversion fails.
 * @eventdetail tp-latex-error { message: string }
 * @see tp-tikz - Render a standalone TikZ drawing.
 */
export class TpLatex extends TpBase {
	public static get observedAttributes(): string[] {
		return ["src", "value"];
	}
	private readonly output = document.createElement("div");
	private snapshot: string | undefined;
	private revision = 0;
	private request?: AbortController;
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	public get value(): string {
		return this.getAttribute("value") ?? this.snapshot ?? "";
	}
	public set value(value: string) {
		this.setAttribute("value", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.snapshot ??= dedent(
			this.querySelector('script[type="tp/latex"]')?.textContent ??
				this.textContent ??
				"",
		);
		this.output.className = "tp-latex-output";
		this.output.setAttribute("data-tp-reference-scope", "");
		this.ensureGlobalStyle("tp-latex-styles", style);
		this.replaceChildren(this.output);
		void this.render();
	}
	protected attributeChangedCallback(): void {
		if (this.isConnected) void this.render();
	}
	protected disconnectedCallback(): void {
		this.revision++;
		this.request?.abort();
	}
	private async render(): Promise<void> {
		const revision = ++this.revision;
		this.request?.abort();
		this.request = new AbortController();
		this.setAttribute("aria-busy", "true");
		this.removeAttribute("data-tp-latex-rendered");
		try {
			let source = this.value;
			if (this.src.trim()) {
				const url = resolveComponentSourceUrl(this, this.src);
				const response = await fetch(url, { signal: this.request.signal });
				if (!response.ok)
					throw new Error(`Unable to load LaTeX (${response.status}).`);
				source = await response.text();
				if (revision !== this.revision || !this.isConnected) return;
				this.output.setAttribute("data-tp-source", url.href);
			} else this.output.removeAttribute("data-tp-source");
			if (revision !== this.revision || !this.isConnected) return;
			const fragment = renderLatexToFragment(source);
			const holder = document.createElement("div");
			holder.append(fragment);
			const html = holder.innerHTML;
			this.output.replaceChildren(...holder.childNodes);
			this.setAttribute("data-tp-latex-rendered", "");
			this.removeAttribute("aria-busy");
			this.dispatchEvent(
				new CustomEvent("tp-latex-rendered", {
					bubbles: true,
					detail: { html },
				}),
			);
		} catch (error) {
			if (revision !== this.revision || !this.isConnected) return;
			this.removeAttribute("aria-busy");
			const message = error instanceof Error ? error.message : String(error);
			const alert = document.createElement("p");
			alert.setAttribute("role", "alert");
			alert.textContent = message;
			this.output.replaceChildren(alert);
			this.dispatchEvent(
				new CustomEvent("tp-latex-error", {
					bubbles: true,
					detail: { message },
				}),
			);
		}
	}
}
if (!customElements.get("tp-latex")) customElements.define("tp-latex", TpLatex);
declare global {
	interface HTMLElementTagNameMap {
		"tp-latex": TpLatex;
	}
}
