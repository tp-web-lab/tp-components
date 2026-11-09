/**
 * @module components/tikz
 * @summary Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
/**
 * @credit TikZJax https://tikzjax.com/
 * @summary WebAssembly TeX engine, core dump and SVG conversion.
 */
// tp-docgen:dependencies:end

import fontsAsset from "@tp/tp-latex/tikz-fonts.css?url&no-inline";
import engineAsset from "@tp/tp-latex/tikzjax.js?url&no-inline";
import { dedent } from "../../utilities/code.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./tikz.css?inline";

const tikzjaxURL = new URL(engineAsset, import.meta.url).href;
const textFontsURL = new URL(fontsAsset, import.meta.url).href;
/**
 * The custom `<tp-tikz>` element renders TikZ drawings.
 *
 * @summary Renders TikZ drawings.
 * @tagname tp-tikz
 * @attr {string} src = "" - URL of a TikZ source file; takes precedence over value and inline source.
 * @attr {string} value = "" - TikZ source; takes precedence over inline source when present.
 * @attr {string} libraries = "" - Comma-separated TikZ libraries to load before the drawing.
 * @attr {number} scale = "1" - Positive display scale for the complete drawing, constrained to the available width.
 * @attr {string} label = "TikZ drawing" - Accessible title for the drawing frame.
 * @example
 * <tp-tikz scale="1.8" label="Linear, sine and exponential functions"><script type="tp/tikz">\begin{tikzpicture}[domain=0:4]
 *   \draw[very thin,color=gray] (-0.1,-1.1) grid (3.9,3.9);
 *
 *   \draw[->] (-0.2,0) -- (4.2,0) node[right] {$x$};
 *   \draw[->] (0,-1.2) -- (0,4.2) node[above] {$f(x)$};
 *
 *   \draw[color=red]    plot (\x,\x)             node[right] {$f(x) =x$};
 *   % \x r means to convert '\x' from degrees to _r_adians:
 *   \draw[color=blue]   plot (\x,{sin(\x r)})    node[right] {$f(x) = \sin x$};
 *   \draw[color=orange] plot (\x,{0.05*exp(\x)}) node[right] {$f(x) = \frac{1}{20} \mathrm e^x$};
 * \end{tikzpicture}</script></tp-tikz>
 * @event tp-tikz-rendered Emitted when the SVG drawing is ready.
 * @eventdetail tp-tikz-rendered void
 * @event tp-tikz-error Emitted when loading or compilation fails.
 * @eventdetail tp-tikz-error { message: string }
 * @see tp-latex - Render a complete LaTeX document containing TikZ figures.
 */
export class TpTikz extends TpBase {
	public static get observedAttributes(): string[] {
		return ["src", "value", "libraries", "label", "scale"];
	}
	private revision = 0;
	private request?: AbortController;
	private snapshot: string | undefined;
	private frame?: HTMLIFrameElement;
	private timer?: ReturnType<typeof setTimeout>;
	private source = "";
	private readonly output = this.attachShadow({ mode: "open" });
	private readonly receive = (event: MessageEvent) => {
		if (
			!this.frame?.contentWindow ||
			event.source !== this.frame.contentWindow ||
			event.data?.type !== "tp-tikz"
		)
			return;
		if (event.data.error) {
			this.fail(String(event.data.error));
			return;
		}
		const height = Number(event.data.height);
		if (Number.isFinite(height) && height > 0)
			this.frame.style.height = `${Math.ceil(height)}px`;
		if (event.data.ready && this.hasAttribute("aria-busy")) {
			clearTimeout(this.timer);
			this.removeAttribute("aria-busy");
			this.output.querySelector('[role="status"]')?.remove();
			this.dispatchEvent(
				new CustomEvent("tp-tikz-rendered", { bubbles: true }),
			);
		}
	};

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
	public get libraries(): string {
		return this.getAttribute("libraries") ?? "";
	}
	public set libraries(value: string) {
		this.setAttribute("libraries", value);
	}
	public get scale(): number {
		const value = Number(this.getAttribute("scale") ?? 1);
		return Number.isFinite(value) && value > 0 ? value : 1;
	}
	public set scale(value: number) {
		this.setAttribute("scale", String(value));
	}
	public get label(): string {
		return this.getAttribute("label") ?? "TikZ drawing";
	}
	public set label(value: string) {
		this.setAttribute("label", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-tikz-styles", style);
		this.snapshot ??= dedent(
			this.querySelector('script[type="tp/tikz"]')?.textContent ??
				this.textContent ??
				"",
		);
		window.addEventListener("message", this.receive);
		void this.render();
	}
	protected disconnectedCallback(): void {
		this.revision++;
		this.request?.abort();
		window.removeEventListener("message", this.receive);
		clearTimeout(this.timer);
		this.frame?.remove();
		this.frame = undefined;
	}
	protected attributeChangedCallback(name: string): void {
		if (name === "scale") {
			this.frame?.contentWindow?.postMessage(
				{ type: "tp-tikz-scale", scale: this.scale },
				"*",
			);
			return;
		}
		if (name === "label") {
			if (this.frame) this.frame.title = this.label;
			return;
		}
		if (this.isConnected) void this.render();
	}

	private fail(message: string): void {
		clearTimeout(this.timer);
		this.removeAttribute("aria-busy");
		const status = document.createElement("p");
		status.setAttribute("role", "alert");
		status.textContent = `TikZ : ${message}`;
		this.output.replaceChildren(status);
		this.frame = undefined;
		this.dispatchEvent(
			new CustomEvent("tp-tikz-error", { bubbles: true, detail: { message } }),
		);
	}

	private async render(): Promise<void> {
		const revision = ++this.revision;
		this.request?.abort();
		this.request = new AbortController();
		clearTimeout(this.timer);
		this.frame?.remove();
		this.frame = undefined;
		this.setAttribute("aria-busy", "true");
		this.output.textContent = "Loading TikZ…";
		try {
			let source = this.value;
			if (this.src.trim()) {
				const response = await fetch(
					resolveComponentSourceUrl(this, this.src),
					{ signal: this.request.signal },
				);
				if (!response.ok)
					throw new Error(`Unable to load TikZ (${response.status}).`);
				source = await response.text();
			}
			if (revision !== this.revision || !this.isConnected) return;
			this.source = source;
			this.renderFrame();
		} catch (error) {
			if (revision === this.revision && this.isConnected)
				this.fail(error instanceof Error ? error.message : String(error));
		}
	}

	private renderFrame(): void {
		const libraries = this.getAttribute("libraries") ?? "";
		if (libraries && !/^[a-zA-Z0-9.,-]+$/.test(libraries)) {
			this.fail("Invalid library names");
			return;
		}
		if (!this.source.trim()) {
			this.output.replaceChildren();
			this.frame = undefined;
			this.removeAttribute("aria-busy");
			return;
		}
		const code =
			(libraries ? `\\usetikzlibrary{${libraries}}\n` : "") +
			"\\begin{document}\n" +
			this.source;
		// JSON is embedded as script data: escape '<' to prevent closing the script element.
		const encoded = JSON.stringify(code).replaceAll("<", "\\u003c");
		const status = document.createElement("p");
		status.setAttribute("role", "status");
		status.textContent = "Compiling TikZ…";
		const frame = document.createElement("iframe");
		frame.title = this.label;
		frame.setAttribute("sandbox", "allow-scripts");
		frame.style.cssText = "display:block;width:100%;height:1px;border:0";
		this.frame = frame;
		this.setAttribute("aria-busy", "true");
		frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://tikzjax.com/v1/fonts.css">
<link rel="stylesheet" href="${textFontsURL}">
<style>html,body{margin:0;padding:0}body>div{display:block!important;max-width:100%;height:auto!important}svg{position:static!important;width:100%;max-width:100%;height:auto;display:block}</style>
<script>
const send = data => parent.postMessage({type:'tp-tikz',...data}, '*');
addEventListener('error', event => send({error:event.message || 'Unable to load TikZJax.'}));
addEventListener('unhandledrejection', event => send({error:String(event.reason)}));
let scale = ${this.scale};
const naturalWidths = new WeakMap();
const applyScale = () => {
  for (const drawing of document.querySelectorAll('body > div')) {
    if (!drawing.querySelector('svg')) continue;
    if (!naturalWidths.has(drawing)) naturalWidths.set(drawing, drawing.style.width);
    const width = naturalWidths.get(drawing);
    if (width) drawing.style.width = 'calc(' + width + ' * ' + scale + ')';
  }
};
const report = () => {
  applyScale();
  const drawings = Array.from(document.querySelectorAll('body > div svg'));
  if (drawings.length) send({ready:true,height:Math.max(1, ...drawings.map(drawing => drawing.getBoundingClientRect().bottom))});
};
addEventListener('message', event => {
  if (event.source !== parent || event.data?.type !== 'tp-tikz-scale') return;
  const next = Number(event.data.scale);
  scale = Number.isFinite(next) && next > 0 ? next : 1;
  report();
});
addEventListener('DOMContentLoaded', () => {
  new MutationObserver(report).observe(document.body,{childList:true,subtree:true});
  new ResizeObserver(report).observe(document.body);
  document.fonts.ready.then(report);
});
</script></head><body><script>
const input = document.createElement('script'); input.type='text/tikz'; input.textContent=${encoded}; document.body.append(input);
</script><script src="${tikzjaxURL}"></script></body></html>`;
		frame.addEventListener("load", () => {
			if (this.frame === frame)
				frame.contentWindow?.postMessage(
					{ type: "tp-tikz-scale", scale: this.scale },
					"*",
				);
		});
		this.output.replaceChildren(status, frame);
		this.timer = setTimeout(
			() =>
				this.fail(
					"Compilation timed out or resources are unavailable. Change the source to retry.",
				),
			90000,
		);
	}
}
if (!customElements.get("tp-tikz")) customElements.define("tp-tikz", TpTikz);

declare global {
	interface HTMLElementTagNameMap {
		"tp-tikz": TpTikz;
	}
}
