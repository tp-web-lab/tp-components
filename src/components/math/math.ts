/** @module components/math */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
 * @summary Markdown parsing and rendering.
 */
// tp-docgen:dependencies:end

import mathRenderer from "@tp/tp-markdown/markdown/renderers/math";
import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { TpBase } from "../base/base.js";
import "../callout/callout.js";
import style from "./math.css?inline";

/** Mathematical input notation, consistent with tp-mathfield. */
export type TpMathMode = "latexmath" | "asciimath";

/**
 * @summary renders LaTeX or AsciiMath expressions as inline or display-style SVG.
 * @tagname tp-math
 * @attr {string} value = "" - Expression without surrounding math delimiters.
 * @attr {string} src = "" - Expression file; takes precedence over value and inline content.
 * @attr {"latexmath" | "asciimath"} mode = "latexmath" - Mathematical input notation.
 * @attr {boolean} displaystyle = false - Uses display-style mathematics in a centered block instead of inline mathematics.
 * @attr {string} label = "" - Accessible description of the formula; defaults to its source text.
 * @event tp-math-rendered Emitted after the current expression is rendered successfully.
 * @eventdetail tp-math-rendered { value: string; mode: TpMathMode; displaystyle: boolean }
 * @event tp-math-error Emitted when loading or rendering the current expression fails.
 * @eventdetail tp-math-error { message: string }
 * @accessibility The SVG has an accessible name; label can provide a readable description instead of source notation.
 * @accessibilityresponsibility Describe complex expressions with label or surrounding explanatory text.
 * @example
 * <p>The identity <tp-math value="a^2 + b^2 = c^2" label="a squared plus b squared equals c squared"></tp-math> describes a right triangle.</p>
 */
export class TpMath extends TpBase {
	/** Serializes this component's MathJax jobs, including initial runtime loading. */
	private static queue: Promise<void> = Promise.resolve();
	/** Preserves author content independently of generated SVGs and messages. */
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/math", "tp/txt"],
		textContentFallback: true,
		ignoreSelector: "[data-tp-math-output]",
	});
	/** Invalidates asynchronous work after updates or disconnection. */
	private revision = 0;
	/** Cancels an obsolete source request. */
	private request: AbortController | null = null;
	/** Defers initial reading until the HTML parser has supplied child content. */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** Attributes that update the expression without rebuilding the element. */
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"value",
			"src",
			"mode",
			"displaystyle",
			"label",
		];
	}
	/** Expression supplied directly as an attribute. */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}
	/** Sets the expression; an empty value falls back to inline content. */
	public set value(value: string) {
		this.setAttribute("value", value);
	}
	/** URL of an external expression file. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	/** Sets the external source; an empty string restores local content. */
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Effective input notation; unrecognized values fall back to LaTeX. */
	public get mode(): TpMathMode {
		return this.getAttribute("mode") === "asciimath"
			? "asciimath"
			: "latexmath";
	}
	/** Sets the input notation. */
	public set mode(value: TpMathMode) {
		this.setAttribute("mode", value);
	}
	/** Whether the formula uses display style and block layout. */
	public get displaystyle(): boolean {
		return this.hasAttribute("displaystyle");
	}
	/** Enables display style by presence, or inline style by absence. */
	public set displaystyle(value: boolean) {
		this.toggleAttribute("displaystyle", value);
	}
	/** Optional human-readable accessible name. */
	public get label(): string {
		return this.getAttribute("label") ?? "";
	}
	/** Sets the accessible description. */
	public set label(value: string) {
		this.setAttribute("label", value);
	}
	/** Installs shared styles and observes author content arriving after upgrade. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-math-styles", style);
		this.source.observe(() => this.schedule());
		this.schedule();
	}
	/** Cancels pending work without losing the original expression. */
	public disconnectedCallback(): void {
		this.revision++;
		this.request?.abort();
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
		this.source.disconnect();
	}
	/** Renders only connected elements, coalescing synchronous attribute changes. */
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.schedule();
	}
	/** Invalidates obsolete output immediately, then defers a single render. */
	private schedule(): void {
		this.revision++;
		this.request?.abort();
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.timer = null;
			void this.render();
		}, 0);
	}
	/** Reads the common source contract and commits only the latest SVG or error. */
	private async render(): Promise<void> {
		const revision = this.revision;
		this.source.capture();
		this.request = new AbortController();
		const output = document.createElement("span");
		output.setAttribute("data-tp-math-output", "");
		this.setAttribute("aria-busy", "true");
		try {
			const value = (
				(await this.source.read({ signal: this.request.signal })) ||
				this.querySelector(":scope > [data-tp-math-output]")?.getAttribute(
					"data-tp-math-source",
				) ||
				""
			).trim();
			if (revision !== this.revision || !this.isConnected) return;
			// Keep serialized copies (reference tooltips and lists) self-contained.
			output.setAttribute("data-tp-math-source", value);
			const mode = this.mode;
			const displaystyle = this.displaystyle;
			if (value) {
				const placeholder = document.createElement("span");
				placeholder.setAttribute(
					mode === "asciimath" ? "data-mathjax-asciimath" : "data-mathjax-tex",
					value,
				);
				placeholder.setAttribute("data-mathjax-display", String(displaystyle));
				output.append(placeholder);
				const job = TpMath.queue.then(async () => {
					try {
						await mathRenderer.render(output);
					} finally {
						// AsciiMath typesetting tracks temporary nodes; do not retain detached jobs.
						const runtime = window.MathJax as
							| { typesetClear?: (nodes: Element[]) => void }
							| undefined;
						runtime?.typesetClear?.([output]);
					}
				});
				TpMath.queue = job.catch(() => undefined);
				await job;
				if (revision !== this.revision || !this.isConnected) return;
				const svg = output.querySelector("svg");
				if (!svg || output.querySelector('[data-mml-node="merror"]'))
					throw new Error(
						"The mathematical expression could not be rendered as SVG.",
					);
				svg.setAttribute("role", "img");
				svg.setAttribute("aria-label", this.label.trim() || value);
				svg.removeAttribute("aria-hidden");
				svg.removeAttribute("aria-labelledby");
			}
			this.replaceChildren(output);
			if (value)
				this.dispatchEvent(
					new CustomEvent("tp-math-rendered", {
						bubbles: true,
						detail: { value, mode, displaystyle },
					}),
				);
		} catch (error: unknown) {
			if (revision !== this.revision || !this.isConnected) return;
			const message =
				error instanceof Error
					? error.message
					: "Unable to render the mathematical expression.";
			const warning = document.createElement("tp-callout");
			warning.setAttribute("variant", "warning");
			warning.textContent = message;
			output.replaceChildren(warning);
			this.replaceChildren(output);
			this.dispatchEvent(
				new CustomEvent("tp-math-error", {
					bubbles: true,
					detail: { message },
				}),
			);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
}

if (!customElements.get("tp-math")) customElements.define("tp-math", TpMath);
declare global {
	interface HTMLElementTagNameMap {
		"tp-math": TpMath;
	}
}
