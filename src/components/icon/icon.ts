/**
 * @module components/icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./icon.css?inline";
import { getTpIcon } from "./icon-registry.js";
import { setupTpIcons } from "./icon-setup.js";
import { registerTpIconLibraryFromGlob } from "./icon-vite.js";

/**
 * @summary Initializes the internal icon library.
 * @internal
 */
setupTpIcons();

const languageIcons = import.meta.glob(
	"/src/components/icon/icons/languages/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("languages", languageIcons, {
	stripPrefix: "/src/components/icon/icons/languages/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});

const flagIcons = import.meta.glob("/src/components/icon/icons/flags/*.svg", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

registerTpIconLibraryFromGlob("flags", flagIcons, {
	stripPrefix: "/src/components/icon/icons/flags/",
	stripSuffix: ".svg",
	namePrefix: "cif-",
	normalize: "none",
});

const numberIcons = import.meta.glob(
	"/src/components/icon/icons/numbers/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("numbers", numberIcons, {
	stripPrefix: "/src/components/icon/icons/numbers/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});

const letterIcons = import.meta.glob(
	"/src/components/icon/icons/letters/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("letters", letterIcons, {
	stripPrefix: "/src/components/icon/icons/letters/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});

const componentsIcons = import.meta.glob(
	"/src/components/icon/icons/components/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

registerTpIconLibraryFromGlob("components", componentsIcons, {
	stripPrefix: "/src/components/icon/icons/components/",
	stripSuffix: ".svg",
	namePrefix: "",
	normalize: "none",
});
/**
 * @summary API documentation summary.
 * @internal
 */
type TpIconSource =
	| "inline"
	| "src"
	| "registry"
	| "fallback-icon"
	| "fallback-text"
	| "none";

/**
 * @summary Normalizes the value of `scale`.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function parseScale(value: string | null): number {
	if (!value) return 1;
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : 1;
}

/**
 * @summary Normalizes the value of `rotate`.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function parseRotate(value: string | null): string {
	if (!value) return "0deg";

	if (/^-?\d+(\.\d+)?$/.test(value)) {
		return `${value}deg`;
	}

	if (/^-?\d+(\.\d+)?(deg|rad|turn)$/.test(value)) {
		return value;
	}

	return "0deg";
}

/**
 * Computes the vector render size before painting instead of enlarging a
 * rasterized CSS transform layer.
 *
 * @summary Multiplies an icon CSS size by its numeric scale.
 * @param size Base CSS size.
 * @param scale Positive scale factor.
 * @returns Scaled CSS size.
 * @internal
 */
function getScaledSize(size: string, scale: number): string {
	if (scale === 1) return size;

	const simpleDimension = size
		.trim()
		.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))([a-z%]+)$/i);
	if (simpleDimension !== null) {
		const value = Number(simpleDimension[1]);
		const unit = simpleDimension[2] ?? "";
		if (Number.isFinite(value)) return `${String(value * scale)}${unit}`;
	}

	return `calc((${size}) * ${String(scale)})`;
}

/**
 * @summary API documentation summary.
 * @internal
 */
const cache = new Map<string, string | null>();

/**
 * @summary API documentation summary.
 * @tagname tp-icon
 * @attr {string} name = "" - Attribute `name`.
 * @attr {string} library = "tp" - Attribute `library`.
 * @attr {string} src = "" - Attribute `src`.
 * @attr {string} size = "1em" - Attribute `size`.
 * @attr {string} color = "" - Attribute `color`.
 * @attr {number} scale = 1 - Attribute `scale`.
 * @attr {string} rotate = "0deg" - Attribute `rotate`.
 * @attr {boolean} flip-h = false - Attribute `flip-h`.
 * @attr {boolean} flip-v = false - Attribute `flip-v`.
 * @attr {boolean} spin = false - Attribute `spin`.
 * @attr {string} fallback = "" - Attribute `fallback`.
 * @attr {string} fallback-icon = "" - Attribute `fallback-icon`.
 * @cssprop [--tp-icon-size=1em] CSS custom property.
 * @example
 * <tp-icon></tp-icon>
 */
export class TpIcon extends TpBase {
	/**
	 * @summary Component global style ID.
	 * @internal
	 */
	private static readonly styleId = "tp-icon-styles";

	/**
	 * @summary Internal rendering container.
	 * @internal
	 */
	private container: HTMLSpanElement | null = null;

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private requestId = 0;

	/**
	 * @summary Declares observed attributes.
	 * @internal
	 */
	static get observedAttributes(): string[] {
		return [
			"name",
			"library",
			"src",
			"size",
			"color",
			"scale",
			"rotate",
			"flip-h",
			"flip-v",
			"spin",
			"fallback",
			"fallback-icon",
		];
	}

	/**
	 * @summary API documentation summary.
	 * @attr name
	 */
	public get name(): string {
		return this.getAttribute("name") ?? "";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set name(value: string) {
		if (value === "") {
			this.removeAttribute("name");
			return;
		}
		this.setAttribute("name", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr library
	 * @default tp
	 */
	public get library(): string {
		return this.getAttribute("library") ?? "tp";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set library(value: string) {
		if (value === "") {
			this.removeAttribute("library");
			return;
		}
		this.setAttribute("library", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr src
	 */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set src(value: string) {
		if (value === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr size
	 * @default 1em
	 */
	public get size(): string {
		return this.getAttribute("size") ?? "1em";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set size(value: string) {
		if (value === "") {
			this.removeAttribute("size");
			this.applyStyle();
			return;
		}
		this.setAttribute("size", value);
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr color
	 */
	public get color(): string {
		return this.getAttribute("color") ?? "";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set color(value: string) {
		if (value === "") {
			this.removeAttribute("color");
			this.applyStyle();
			return;
		}
		this.setAttribute("color", value);
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr scale
	 * @default 1
	 */
	public get scale(): number {
		return parseScale(this.getAttribute("scale"));
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set scale(value: number) {
		this.setAttribute("scale", String(value));
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr rotate
	 * @default 0deg
	 */
	public get rotate(): string {
		return parseRotate(this.getAttribute("rotate"));
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set rotate(value: string) {
		if (value === "") {
			this.removeAttribute("rotate");
			this.applyStyle();
			return;
		}
		this.setAttribute("rotate", value);
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr flip-h
	 */
	public get flipH(): boolean {
		return this.hasAttribute("flip-h");
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set flipH(value: boolean) {
		if (value) {
			this.setAttribute("flip-h", "");
			this.applyStyle();
			return;
		}
		this.removeAttribute("flip-h");
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr flip-v
	 */
	public get flipV(): boolean {
		return this.hasAttribute("flip-v");
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set flipV(value: boolean) {
		if (value) {
			this.setAttribute("flip-v", "");
			this.applyStyle();
			return;
		}
		this.removeAttribute("flip-v");
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr spin
	 */
	public get spin(): boolean {
		return this.hasAttribute("spin");
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set spin(value: boolean) {
		if (value) {
			this.setAttribute("spin", "");
			this.applyStyle();
			return;
		}
		this.removeAttribute("spin");
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @attr fallback
	 */
	public get fallback(): string {
		return this.getAttribute("fallback") ?? "";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set fallback(value: string) {
		if (value === "") {
			this.removeAttribute("fallback");
			return;
		}
		this.setAttribute("fallback", value);
	}

	/**
	 * @summary API documentation summary.
	 * @attr fallback-icon
	 */
	public get fallbackIcon(): string {
		return this.getAttribute("fallback-icon") ?? "";
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 */
	public set fallbackIcon(value: string) {
		if (value === "") {
			this.removeAttribute("fallback-icon");
			return;
		}
		this.setAttribute("fallback-icon", value);
	}

	private readonly handleIconLibraryChange = (event: Event): void => {
		const detail = (event as CustomEvent).detail;

		if (detail?.library !== this.library) {
			return;
		}

		void this.update();
	};

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureContainer();
		void this.update();
		window.addEventListener(
			"tp-icon-library-registered",
			this.handleIconLibraryChange,
		);
	}

	public disconnectedCallback(): void {
		super.connectedCallback();
		window.removeEventListener(
			"tp-icon-library-registered",
			this.handleIconLibraryChange,
		);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		if (!this.isConnected) return;
		void this.update();
	}

	// --------------------------
	// core
	// --------------------------

	/**
	 * @summary API documentation summary.
	 * @returns Return value.
	 * @internal
	 */
	private async update(): Promise<void> {
		if (!this.container) return;

		this.removeAttribute("data-tp-icon-catalog");

		const id = ++this.requestId;

		const { svg } = await this.resolve();

		if (id !== this.requestId) return;

		// Inline markup syntaxes require a nonempty placeholder (for example #icon#).
		// It is not a label or a fallback: only the resolved icon is displayed.
		// Keep element sources, in particular author-provided inline SVGs, intact.
		for (const node of Array.from(this.childNodes)) {
			if (node.nodeType === Node.TEXT_NODE) node.remove();
		}

		if (svg === null) {
			this.renderFallback();
			this.applyStyle();
			return;
		}

		const template = document.createElement("template");
		template.innerHTML = svg;
		this.container.replaceChildren(template.content.cloneNode(true));
		this.applyStyle();
	}

	/**
	 * @summary API documentation summary.
	 * @returns Return value.
	 * @internal
	 */
	private async resolve(): Promise<{
		svg: string | null;
		source: TpIconSource;
	}> {
		const inlineSvg = this.getInlineSvg();

		if (inlineSvg !== null) {
			return {
				svg: inlineSvg,
				source: "inline",
			};
		}

		const src = this.src;

		if (src !== "") {
			const srcSvg = await this.fetchSvg(src);

			if (srcSvg !== null) {
				return {
					svg: srcSvg,
					source: "src",
				};
			}
		}

		const name = this.name;
		const library = this.library;

		if (name !== "" && name !== "*") {
			const registrySvg = getTpIcon(name, library);

			if (registrySvg !== null) {
				return {
					svg: registrySvg,
					source: "registry",
				};
			}
		}

		const fallbackSvg = this.resolveFallbackIcon(name, library);

		if (fallbackSvg !== null) {
			return {
				svg: fallbackSvg,
				source: "fallback-icon",
			};
		}

		return {
			svg: null,
			source: "none",
		};
	}

	private resolveFallbackIcon(name: string, library: string): string | null {
		const fallbackIcon = this.fallbackIcon;

		if (fallbackIcon === "" || fallbackIcon === name) {
			return null;
		}

		const localFallback = getTpIcon(fallbackIcon, library);

		if (localFallback !== null) {
			return localFallback;
		}

		if (library === "tp") {
			return null;
		}

		return getTpIcon(fallbackIcon, "tp");
	}

	/**
	 * @summary API documentation summary.
	 * @returns Return value.
	 * @internal
	 */
	private getInlineSvg(): string | null {
		const svg = this.querySelector(":scope > svg");
		return svg ? svg.outerHTML : null;
	}

	/**
	 * @summary API documentation summary.
	 * @param src Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private async fetchSvg(src: string): Promise<string | null> {
		const sourceUrl = resolveComponentSourceUrl(this, src).href;

		if (cache.has(sourceUrl)) {
			return cache.get(sourceUrl) ?? null;
		}

		try {
			const res = await globalThis.fetch(sourceUrl);
			if (!res.ok) {
				cache.set(sourceUrl, null);
				return null;
			}

			const text = await res.text();

			if (!text.includes("<svg")) {
				cache.set(sourceUrl, null);
				return null;
			}

			cache.set(sourceUrl, text);
			return text;
		} catch {
			cache.set(sourceUrl, null);
			return null;
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private renderFallback(): void {
		if (!this.container) return;

		const text = this.getAttribute("fallback");
		if (!text) {
			this.container.innerHTML = "";
			return;
		}

		const span = document.createElement("span");
		span.textContent = text;
		span.setAttribute("data-tp-icon-fallback", "");

		this.container.replaceChildren(span);
	}

	// --------------------------
	// styling
	// --------------------------

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private applyStyle(): void {
		const size = this.getAttribute("size") ?? "1em";
		const scale = parseScale(this.getAttribute("scale"));
		this.style.setProperty("--tp-icon-size", getScaledSize(size, scale));

		const color = this.getAttribute("color");
		if (color) this.style.color = color;
		else this.style.removeProperty("color");

		const rotate = this.spin
			? "0deg"
			: parseRotate(this.getAttribute("rotate"));

		const flipH = this.hasAttribute("flip-h");
		const flipV = this.hasAttribute("flip-v");

		const sx = flipH ? -1 : 1;
		const sy = flipV ? -1 : 1;

		const transform = `scale(${sx}, ${sy}) rotate(${rotate})`;

		if (this.container) {
			this.container.style.transform = transform;
			this.applyColorToSvg(color ?? "");
		}
	}

	/**
	 * Applies the `color` attribute to visible SVG paint while preserving
	 * definitions such as masks, gradients, and clipping paths.
	 *
	 * @summary Colors the rendered SVG when an explicit icon color is set.
	 * @param color Any valid CSS color, including custom-property expressions.
	 * @internal
	 */
	private applyColorToSvg(color: string): void {
		const svg = this.container?.querySelector<SVGElement>(":scope > svg");
		if (svg === null || svg === undefined) return;

		svg.style.color = color;
		svg.style.fill = color;

		for (const element of svg.querySelectorAll<SVGElement>(
			"[fill], [stroke]",
		)) {
			if (element.closest("defs, mask, clipPath") !== null) continue;

			const fill = element.getAttribute("fill")?.trim().toLowerCase();
			const stroke = element.getAttribute("stroke")?.trim().toLowerCase();
			const isColorizable = (paint: string | undefined): boolean =>
				paint === "currentcolor" ||
				paint?.startsWith("var(--tp-brand-text-colorful") === true;
			element.style.fill = color !== "" && isColorizable(fill) ? color : "";
			element.style.stroke = color !== "" && isColorizable(stroke) ? color : "";
		}
	}

	// --------------------------
	// setup
	// --------------------------

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureContainer(): void {
		const existing = this.querySelector("[data-tp-icon-container]");
		if (existing instanceof HTMLSpanElement) {
			this.container = existing;
			return;
		}

		const span = document.createElement("span");
		span.setAttribute("data-tp-icon-container", "");
		this.append(span);
		this.container = span;
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpIcon.styleId)) return;

		const styleEl = document.createElement("style");
		styleEl.id = TpIcon.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}
}

/**
 * @summary Registers the custom element `tp-icon`.
 * @internal
 */
if (!customElements.get("tp-icon")) {
	customElements.define("tp-icon", TpIcon);
}

/**
 * @summary API documentation summary.
 * @internal
 */
declare global {
	interface HTMLElementTagNameMap {
		"tp-icon": TpIcon;
	}
}
