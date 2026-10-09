/**
 * @module components/save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import style from "./save-image.css?inline";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";

export type TpSaveImageFormat = "svg" | "png" | "webp";

type SvgExportTarget = Element & { exportSvg?: () => string };

function isSaveImageFormat(value: string): value is TpSaveImageFormat {
	return value === "svg" || value === "png" || value === "webp";
}

/**
 * Image download controller with an embedded dropdown.
 *
 * @summary Saves an anchored image in several formats.
 * @tagname tp-save-image
 * @attr {string} anchor = "" - CSS selector of the image or exportable component.
 * @attr {string} name = "image-download" - Icon used by the trigger.
 * @attr {string} filename = "image" - Download filename without its extension.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the trigger.
 * @event tp-save-image-save Emitted after an image has been prepared for download.
 * @eventdetail tp-save-image-save { format: "svg" | "png" | "webp"; filename: string; anchor: string; target: Element }
 * @event tp-save-image-error Emitted when the target cannot be exported.
 * @eventdetail tp-save-image-error { format: "svg" | "png" | "webp"; error: unknown; anchor: string }
 * @example
 * <tp-save-image></tp-save-image>
 */
export class TpSaveImage extends TpBase {
	private static readonly styleId = "tp-save-image-styles";
	private static nextId = 0;
	private dropdownEl: TpDropdown | null = null;

	public static get observedAttributes(): string[] {
		return ["anchor", "name", "filename", "variant", "size", "disabled"];
	}

	public get anchor(): string {
		return this.getAttribute("anchor") ?? "";
	}
	public set anchor(value: string) {
		this.setAttribute("anchor", value);
	}
	public get name(): string {
		return this.getAttribute("name")?.trim() || "image-download";
	}
	public set name(value: string) {
		this.setAttribute("name", value);
	}
	public get filename(): string {
		return this.getAttribute("filename")?.trim() || "image";
	}
	public set filename(value: string) {
		this.setAttribute("filename", value);
	}
	public get variant(): TpVariantType {
		const value = this.getAttribute("variant") ?? "neutral";
		return isTpVariantType(value) ? value : "neutral";
	}
	public set variant(value: TpVariantType) {
		this.setAttribute("variant", value);
	}
	public get size(): TpSizeType {
		const value = this.getAttribute("size") ?? "m";
		return isTpSizeType(value) ? value : "m";
	}
	public set size(value: TpSizeType) {
		this.setAttribute("size", value);
	}
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpSaveImage.styleId, style);
		this.ensureControl();
	}

	protected attributeChangedCallback(): void {
		if (this.isConnected) this.ensureControl();
	}

	public async save(format: TpSaveImageFormat): Promise<void> {
		if (!isSaveImageFormat(format))
			throw new TypeError(`Unsupported image format: ${format}`);
		const target = this.resolveTarget();
		if (!target)
			throw new TypeError(`No image matches the anchor "${this.anchor}".`);
		try {
			const saveTarget = await chooseSaveTarget({
				suggestedName: `${this.safeFilename()}.${format}`,
				description: `${format.toUpperCase()} image`,
				mimeType: format === "svg" ? "image/svg+xml" : `image/${format}`,
				extension: `.${format}`,
			});
			if (!saveTarget) return;
			const blob =
				format === "svg"
					? new Blob([await this.createSvg(target)], { type: "image/svg+xml" })
					: await this.createRaster(target, format);
			await saveBlob(blob, saveTarget);
			this.dropdownEl?.removeAttribute("open");
			this.dispatchEvent(
				new CustomEvent("tp-save-image-save", {
					bubbles: true,
					composed: true,
					detail: {
						format,
						filename: saveTarget.filename,
						anchor: this.anchor,
						target,
					},
				}),
			);
		} catch (error) {
			this.dispatchEvent(
				new CustomEvent("tp-save-image-error", {
					bubbles: true,
					composed: true,
					detail: { format, error, anchor: this.anchor },
				}),
			);
			throw error;
		}
	}

	private ensureControl(): void {
		let trigger = this.querySelector<HTMLElement>(":scope > tp-icon-button");
		if (!trigger) {
			trigger = document.createElement("tp-icon-button");
			this.prepend(trigger);
		}
		if (trigger.id === "") {
			TpSaveImage.nextId += 1;
			trigger.id = `tp-save-image-trigger-${TpSaveImage.nextId}`;
		}
		trigger.setAttribute("name", this.name);
		trigger.setAttribute("label", "Save image");
		trigger.setAttribute("variant", this.variant);
		trigger.setAttribute("size", this.size);
		trigger.toggleAttribute("disabled", this.disabled);
		trigger.removeEventListener("click", this.handleTriggerClick);
		trigger.addEventListener("click", this.handleTriggerClick);
		let dropdown = this.querySelector<TpDropdown>(":scope > tp-dropdown");
		if (!(dropdown instanceof HTMLElement)) {
			dropdown = document.createElement("tp-dropdown") as TpDropdown;
			this.append(dropdown);
		}
		dropdown.setAttribute("anchor", `#${trigger.id}`);
		dropdown.setAttribute("placement", "bottom");
		dropdown.setAttribute("outside-click", "");
		if (!dropdown.querySelector("[data-format]")) {
			const menu = document.createElement("ul");
			menu.setAttribute("role", "menu");
			for (const format of ["svg", "png", "webp"] as const) {
				const item = document.createElement("li");
				item.dataset.format = format;
				item.setAttribute("role", "menuitem");
				item.tabIndex = 0;
				item.textContent = format.toUpperCase();
				item.addEventListener("click", () => {
					void this.save(format).catch(() => undefined);
				});
				item.addEventListener("keydown", (event) => {
					if (event.key === "Enter" || event.key === " ")
						void this.save(format).catch(() => undefined);
				});
				menu.append(item);
			}
			dropdown.append(menu);
		}
		this.dropdownEl = dropdown;
	}

	private readonly handleTriggerClick = (): void => {
		if (!this.disabled) this.dropdownEl?.toggle();
	};

	private resolveTarget(): Element | null {
		if (this.anchor.trim() === "") return null;
		try {
			return document.querySelector(this.anchor);
		} catch {
			return null;
		}
	}

	private async createSvg(target: SvgExportTarget): Promise<string> {
		if (typeof target.exportSvg === "function") return target.exportSvg();
		const svg =
			target instanceof SVGSVGElement ? target : target.querySelector("svg");
		if (svg) {
			const clone = svg.cloneNode(true) as SVGSVGElement;
			clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
			return new XMLSerializer().serializeToString(clone);
		}
		const source =
			target instanceof HTMLCanvasElement || target instanceof HTMLImageElement
				? target
				: target.querySelector("canvas, img");
		if (
			!(
				source instanceof HTMLCanvasElement ||
				source instanceof HTMLImageElement
			)
		) {
			throw new TypeError(
				"The anchored element does not contain an exportable image.",
			);
		}
		const url =
			source instanceof HTMLCanvasElement
				? source.toDataURL("image/png")
				: source.currentSrc || source.src;
		const { width, height } = this.imageSize(source);
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="${url}" width="${width}" height="${height}" /></svg>`;
	}

	private async createRaster(
		target: SvgExportTarget,
		format: "png" | "webp",
	): Promise<Blob> {
		if (target instanceof HTMLCanvasElement)
			return this.canvasBlob(target, format);
		const canvasTarget = target.querySelector("canvas");
		if (canvasTarget instanceof HTMLCanvasElement)
			return this.canvasBlob(canvasTarget, format);
		const svg = await this.createSvg(target);
		const { width, height } = this.svgSize(svg, target);
		const image = new Image();
		const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
		try {
			await new Promise<void>((resolve, reject) => {
				image.onload = () => resolve();
				image.onerror = () =>
					reject(new Error("The SVG could not be rasterized."));
				image.src = url;
			});
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext("2d");
			if (!context) throw new Error("Canvas rendering is not available.");
			context.drawImage(image, 0, 0, width, height);
			return await this.canvasBlob(canvas, format);
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	private svgSize(
		source: string,
		target: Element,
	): { width: number; height: number } {
		const document = new DOMParser().parseFromString(source, "image/svg+xml");
		const root = document.documentElement;
		const widthAttribute = root.getAttribute("width") ?? "";
		const heightAttribute = root.getAttribute("height") ?? "";
		const width = widthAttribute.includes("%")
			? Number.NaN
			: Number.parseFloat(widthAttribute);
		const height = heightAttribute.includes("%")
			? Number.NaN
			: Number.parseFloat(heightAttribute);
		if (
			Number.isFinite(width) &&
			width > 0 &&
			Number.isFinite(height) &&
			height > 0
		) {
			return { width: Math.round(width), height: Math.round(height) };
		}
		const viewBox = root
			.getAttribute("viewBox")
			?.trim()
			.split(/[ ,]+/)
			.map(Number);
		if (
			viewBox?.length === 4 &&
			Number.isFinite(viewBox[2]) &&
			Number.isFinite(viewBox[3]) &&
			(viewBox[2] ?? 0) > 0 &&
			(viewBox[3] ?? 0) > 0
		) {
			return {
				width: Math.round(viewBox[2] ?? 1),
				height: Math.round(viewBox[3] ?? 1),
			};
		}
		const bounds = target.getBoundingClientRect();
		return {
			width: Math.max(1, Math.round(bounds.width || 1200)),
			height: Math.max(1, Math.round(bounds.height || 800)),
		};
	}

	private canvasBlob(
		canvas: HTMLCanvasElement,
		format: "png" | "webp",
	): Promise<Blob> {
		return new Promise((resolve, reject) =>
			canvas.toBlob(
				(blob) =>
					blob
						? resolve(blob)
						: reject(
								new Error(
									`The image could not be encoded as ${format.toUpperCase()}.`,
								),
							),
				`image/${format}`,
			),
		);
	}

	private imageSize(source: HTMLCanvasElement | HTMLImageElement): {
		width: number;
		height: number;
	} {
		if (source instanceof HTMLCanvasElement)
			return { width: source.width || 1, height: source.height || 1 };
		return {
			width: source.naturalWidth || source.width || 1,
			height: source.naturalHeight || source.height || 1,
		};
	}

	private safeFilename(): string {
		return (
			this.filename
				.replace(/\.(svg|png|webp)$/i, "")
				.replace(/[^a-z0-9._-]+/gi, "-")
				.replace(/^-+|-+$/g, "") || "image"
		);
	}
}

if (!customElements.get("tp-save-image"))
	customElements.define("tp-save-image", TpSaveImage);

declare global {
	interface HTMLElementTagNameMap {
		"tp-save-image": TpSaveImage;
	}
}
