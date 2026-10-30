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

import { DeferredVisibility } from "../../utilities/deferred-visibility.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import style from "./icon.css?inline";
import { getTpIcon } from "./icon-registry.js";
import { setupTpIcons } from "./icon-setup.js";

/**
 * @summary Initializes the internal icon library.
 * @internal
 */
setupTpIcons();

const builtinLibraries: Record<string, (name: string) => Promise<unknown>> = {
	languages: () => import("./icon-library-languages.js"),
	flags: () => import("./icon-library-flags.js"),
	numbers: () => import("./icon-library-numbers.js"),
	letters: () => import("./icon-library-letters.js"),
	components: async (name) =>
		(await import("./icon-component-source.js")).loadComponentIcon(name),
};
const pendingLibraries = new Map<string, Promise<unknown>>();

async function loadBuiltinLibrary(
	library: string,
	name: string,
): Promise<void> {
	const load = builtinLibraries[library];
	if (!load) return;
	const key = library === "components" ? `${library}:${name}` : library;
	let pending = pendingLibraries.get(key);
	if (!pending) {
		pending = load(name).catch((error: unknown) => {
			pendingLibraries.delete(key);
			throw error;
		});
		pendingLibraries.set(key, pending);
	}
	await pending;
}
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
 * @summary Displays SVG icons from inline markup, a URL or an icon library, with sizing, color, transforms and fallbacks.
 * @tagname tp-icon
 * @attr {string} name = "" - Icon identifier in the selected library, for example heart or settings. Used when no inline SVG or successfully loaded src is available.
 * @attr {string} library = "tp" - Registry containing name and the first fallback-icon lookup. Built-in libraries: tp, languages, flags, numbers, letters and components. Custom registered libraries are also accepted.
 * @attr {string} src = "" - URL of an SVG file to load. Relative URLs resolve against the containing source document when available, otherwise the page URL. Inline SVG takes precedence; a failed load falls back to name, then the fallback settings.
 * @attr {string} size = "1em" - Base width and height as a CSS length, for example 24px, 2rem or 1.5em. The scale factor multiplies both dimensions; 1em follows the surrounding font size.
 * @attr {string} color = "" - CSS color applied to the SVG and its colorizable fills and strokes, for example red, #2563eb or var(--brand-color). Empty inherits the surrounding text color; explicit fixed SVG colors are preserved.
 * @attr {number} scale = 1 - Positive numeric multiplier for size, for example 0.5 to halve it or 2 to double it. Zero, negative and invalid values use 1. Changes the space occupied by the icon.
 * @attr {string} rotate = "0deg" - Rotation angle: a number is interpreted in degrees; deg, rad and turn units are also accepted. Negative values rotate in the opposite direction. Invalid values use 0deg; spin overrides this fixed rotation.
 * @attr {boolean} flip-h = false - Mirrors the icon horizontally when present. Remove the attribute to restore its orientation; writing false still enables it.
 * @attr {boolean} flip-v = false - Mirrors the icon vertically when present. Can be combined with flip-h and rotate; writing false still enables it.
 * @attr {boolean} spin = false - Continuously rotates the SVG once per second when present, overriding rotate. Respects the reduced-motion preference. Remove the attribute to stop; writing false still enables it.
 * @attr {string} fallback = "" - Plain text displayed only when no SVG can be resolved, including fallback-icon. For example, use ? for an unavailable icon. Empty leaves the reserved icon area blank.
 * @attr {string} fallback-icon = "" - Backup icon identifier used when inline SVG, src and name provide no icon. Looked up in the selected library, then in tp; if unavailable, fallback text is used.
 * @example
 * <tp-icon name="heart" size="3rem" aria-label="Heart"></tp-icon>
 * @cssprop [--tp-icon-size=1em] Width and height of the rendered icon; assigned internally from size multiplied by scale.
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
	private readonly deferredVisibility = new DeferredVisibility(this, () => {
		void this.update();
	});

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
	 * @summary Icon identifier in the selected library, for example heart or settings. Used when no inline SVG or successfully loaded src is available.
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
	 * @summary Registry containing name and the first fallback-icon lookup. Built-in libraries: tp, languages, flags, numbers, letters and components. Custom registered libraries are also accepted.
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
	 * @summary URL of an SVG file to load. Relative URLs resolve against the containing source document when available, otherwise the page URL. Inline SVG takes precedence; a failed load falls back to name, then the fallback settings.
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
	 * @summary Base width and height as a CSS length, for example 24px, 2rem or 1.5em. The scale factor multiplies both dimensions; 1em follows the surrounding font size.
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
	 * @summary CSS color applied to the SVG and its colorizable fills and strokes, for example red, #2563eb or var(--brand-color). Empty inherits the surrounding text color; explicit fixed SVG colors are preserved.
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
	 * @summary Positive numeric multiplier for size, for example 0.5 to halve it or 2 to double it. Zero, negative and invalid values use 1. Changes the space occupied by the icon.
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
	 * @summary Rotation angle: a number is interpreted in degrees; deg, rad and turn units are also accepted. Negative values rotate in the opposite direction. Invalid values use 0deg; spin overrides this fixed rotation.
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
	 * @summary Mirrors the icon horizontally when present. Remove the attribute to restore its orientation; writing false still enables it.
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
	 * @summary Mirrors the icon vertically when present. Can be combined with flip-h and rotate; writing false still enables it.
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
	 * @summary Continuously rotates the SVG once per second when present, overriding rotate. Respects the reduced-motion preference. Remove the attribute to stop; writing false still enables it.
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
	 * @summary Plain text displayed only when no SVG can be resolved, including fallback-icon. For example, use ? for an unavailable icon. Empty leaves the reserved icon area blank.
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
	 * @summary Backup icon identifier used when inline SVG, src and name provide no icon. Looked up in the selected library, then in tp; if unavailable, fallback text is used.
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
		this.requestId++;
		this.deferredVisibility.disconnect();
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

		// Reserve the authored size before the asynchronous SVG request finishes.
		this.applyStyle();
		this.removeAttribute("data-tp-icon-catalog");

		const id = ++this.requestId;
		if (
			Object.hasOwn(builtinLibraries, this.library) &&
			getTpIcon(this.name, this.library) === null &&
			this.deferredVisibility.defer()
		)
			return;

		this.deferredVisibility.disconnect();
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

		if (
			Object.hasOwn(builtinLibraries, library) &&
			getTpIcon(name, library) === null
		) {
			try {
				await loadBuiltinLibrary(library, name);
			} catch {
				// Keep the existing fallback when a collection cannot be loaded.
			}
		}

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
