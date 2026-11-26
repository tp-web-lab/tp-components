/** @module components/bibtex
 * @summary BibTeX conversion to bibliography source code.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
// tp-docgen:dependencies:end

import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../code-editor/code-editor.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import {
	type BibtexFormat,
	type BibtexInput,
	bibtexToCode,
} from "./bibtex-conversion.js";

export {
	type BibtexEntry,
	type BibtexFormat,
	type BibtexInput,
	bibtexToCode,
	parseBibtex,
} from "./bibtex-conversion.js";

/**
 * The custom `<tp-bibtex>` element converts BibTeX or CSL-JSON entries into tp-biblio or standard LaTeX bibliography source code.
 *
 * @summary Converts BibTeX or CSL-JSON entries into tp-biblio or standard LaTeX bibliography source code.
 * @tagname tp-bibtex
 * @attr {string} src = "" - URL of a bibliography file; takes priority over the inline script.
 * @attr {"bibtex" | "clsjson"} in = "bibtex" - Input format: bibtex or clsjson (CSL-JSON).
 * @attr {"tp-biblio" | "latex"} out = "tp-biblio" - Output format: tp-biblio or latex.
 * @event tp-bibtex-load Emitted after conversion with the generated code and format.
 * @eventdetail tp-bibtex-load { code: string; in: string; out: string }
 * @event tp-bibtex-error Emitted when fetching or parsing fails, with an error message.
 * @eventdetail tp-bibtex-error { error: string }
 * @example
 * <tp-bibtex src="/docs/components/bibtex/examples/books.bib"></tp-bibtex>
 */
export class TpBibtex extends TpBase {
	private editor?: TpCodeEditor;
	private status?: HTMLParagraphElement;
	private code = "";
	private controller?: AbortController;
	private revision = 0;
	private observer = new MutationObserver((records) => {
		if (
			records.some(
				(record) =>
					(record.target instanceof Element &&
						record.target.matches("script")) ||
					record.target.parentElement?.matches("script") ||
					(record.target === this &&
						[...record.addedNodes, ...record.removedNodes].some(
							(node) => node instanceof HTMLScriptElement,
						)),
			)
		)
			void this.refresh();
	});
	public static get observedAttributes(): string[] {
		return ["src", "in", "out"];
	}
	/** URL of the BibTeX source. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Bibliography input format. */
	public get in(): BibtexInput {
		return this.getAttribute("in") === "clsjson" ? "clsjson" : "bibtex";
	}
	public set in(value: BibtexInput) {
		this.setAttribute("in", value);
	}
	/** Generated source format. */
	public get out(): BibtexFormat {
		return this.getAttribute("out") === "latex" ? "latex" : "tp-biblio";
	}
	public set out(value: BibtexFormat) {
		this.setAttribute("out", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(
			"tp-bibtex-styles",
			"tp-bibtex { display: block; } tp-bibtex > [data-tp-bibtex-generated=error] { color: var(--tp-danger-text-colorful); }",
		);
		if (!this.editor) {
			this.editor = document.createElement("tp-code-editor");
			this.editor.setAttribute("readonly", "");
			this.editor.setAttribute("data-tp-bibtex-generated", "code");
			this.status = document.createElement("p");
			this.status.setAttribute("role", "alert");
			this.status.setAttribute("data-tp-bibtex-generated", "error");
			this.status.hidden = true;
			this.append(this.editor, this.status);
		}
		this.observer.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["type"],
		});
		void this.refresh();
	}
	protected disconnectedCallback(): void {
		this.observer.disconnect();
		this.controller?.abort();
		this.revision++;
	}
	protected attributeChangedCallback(
		_name: string,
		old: string | null,
		value: string | null,
	): void {
		if (old !== value && this.isConnected) void this.refresh();
	}
	/** Return the latest successfully generated source, or an empty string while loading or after an error. */
	public getCode(): string {
		return this.code;
	}
	/** Reload the source and update the code. Await this before calling getCode for a remote source. Fetch/parse errors are displayed and emitted through tp-bibtex-error. */
	public async refresh(): Promise<void> {
		const revision = ++this.revision;
		this.controller?.abort();
		this.controller = new AbortController();
		this.code = "";
		if (this.editor) this.editor.value = "";
		if (this.status) this.status.hidden = true;
		this.setAttribute("aria-busy", "true");
		try {
			for (const [attribute, allowed] of [
				["in", ["bibtex", "clsjson"]],
				["out", ["tp-biblio", "latex"]],
			] as const) {
				const value = this.getAttribute(attribute);
				if (value && !allowed.includes(value as never))
					throw new Error(`Unsupported ${attribute}: ${value}`);
			}
			const types =
				this.in === "bibtex"
					? ["tp/bibtex", "application/x-bibtex"]
					: [
							"tp/clsjson",
							"application/vnd.citationstyles.csl+json",
							"application/json",
						];
			let source =
				[...this.children].find(
					(child) =>
						child instanceof HTMLScriptElement && types.includes(child.type),
				)?.textContent ?? "";
			if (this.src) {
				const response = await fetch(
					resolveComponentSourceUrl(this, this.src),
					{ signal: this.controller.signal },
				);
				if (!response.ok)
					throw new Error(`Cannot load BibTeX (${response.status}).`);
				source = await response.text();
			}
			if (revision !== this.revision) return;
			this.code = bibtexToCode(source, this.out, this.in);
			if (this.editor) {
				this.editor.setAttribute(
					"language",
					this.out === "latex" ? "latex" : "html",
				);
				this.editor.value = this.code;
			}
			this.dispatchEvent(
				new CustomEvent("tp-bibtex-load", {
					bubbles: true,
					detail: { code: this.code, in: this.in, out: this.out },
				}),
			);
		} catch (error) {
			if (revision !== this.revision) return;
			const message = error instanceof Error ? error.message : String(error);
			if (this.status) {
				this.status.textContent = message;
				this.status.hidden = false;
			}
			this.dispatchEvent(
				new CustomEvent("tp-bibtex-error", {
					bubbles: true,
					detail: { error: message },
				}),
			);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
}
if (!customElements.get("tp-bibtex"))
	customElements.define("tp-bibtex", TpBibtex);
declare global {
	interface HTMLElementTagNameMap {
		"tp-bibtex": TpBibtex;
	}
}
