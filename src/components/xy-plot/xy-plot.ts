/**
 * @module components/xy-plot
 * @summary XY graph rendering component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-cluster
 * @summary Flexible cluster layout component.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @tp-dependency tp-stack
 * @summary Vertical stack layout component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import {
	type AxisRange,
	parseXYGraph,
	renderXYGraphSvg,
	type SampledCurve,
	sampleXYGraph,
	type XYGraphDiagram,
	type XYGrid,
	type XYLineStyle,
	type XYVector,
} from "@tp/tp-utilities/xy-graph";
import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { TpBase } from "../base/base.js";
import style from "./xy-plot.css?inline";
import "../icon-button/icon-button.js";

import type { XYPlotSettings } from "./xy-plot-settings.js";

let settingsId = 0;
const STYLE_ID = "tp-xy-plot-styles";
let zoomButtonsRegistered = false;

/** Numeric series supplied directly instead of mathematical expressions. */
export interface TpXYPlotData {
	vectors?: XYVector[];
	/** Accessible chart title. */
	title: string;
	/** Horizontal axis label, including units. */
	xLabel: string;
	/** Vertical axis label, including units. */
	yLabel: string;
	/** Independent polylines; separate entries are never connected. */
	series: {
		label: string;
		points: { x: number; y: number }[];
		/** Uses dashes for the curve and its legend sample instead of a solid stroke. */
		dashed?: boolean;
		lineStyle?: XYLineStyle;
	}[];
	/** Optional labelled markers; offsets position labels in SVG pixels. */
	points?: { x: number; y: number; label: string; dx?: number; dy?: number }[];
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * @summary XY graph rendering component.
 * @tagname tp-xy-plot
 * @attr {"both" | "horizontal" | "vertical" | "none"} grid = "both" - Visible grid directions; overrides the graph directive when present.
 * @attr {"both" | "horizontal" | "vertical" | "none"} axis = "both" - Visible axes and their ticks.
 * @attr {boolean} no-legend = false - Hides curve legends.
 * @attr {boolean} settings = false - Shows a button for editing the graph definition in a panel below the plot.
 * @example
 * <tp-xy-plot>
 *   <script type="tp/xy-plot">
 *     xyFunctionGraph
 *       title "Functions"
 *       x-axis [-10,10]
 *       y-axis [-5,5]
 *       functions [["Sine", "2*sin(x)"], ["Line", "x/2"]]
 *   </script>
 * </tp-xy-plot>
 */
export class TpXYPlot extends TpBase {
	/** Optional numeric data, retained when the component reconnects. */
	private data: TpXYPlotData | null = null;
	/** Prevents an obsolete asynchronous source read from replacing new data. */
	private revision = 0;
	private animation: string[] = [];
	/** Original bounds and samples remain unchanged by interactive zoom. */
	private zoomDiagram: XYGraphDiagram | null = null;
	private zoomCurves: SampledCurve[] | null = null;
	private zoomLevel = 0;
	private panX = 0;
	private panY = 0;
	private panFrame = 0;
	private drag: {
		host: HTMLElement;
		id: number;
		x: number;
		y: number;
		offsetX: number;
		offsetY: number;
		unitX: number;
		unitY: number;
		nextX: number;
		nextY: number;
		viewBox: string;
	} | null = null;
	private animationOverride: string[] | null = null;
	private sourceGrid: XYGrid = "both";
	private objectNames: Set<string> | null = null;
	private animationStep = 0;
	private currentSource: string | null = null;
	private initialSource: string | null = null;
	private settingsEditor: XYPlotSettings | null = null;
	private settingsOpen = false;
	private settingsRevision = 0;
	private readonly settingsPanelId = `tp-xy-plot-settings-${++settingsId}`;

	/** Whether the graph settings button is shown. @attr settings */
	public get settings(): boolean {
		return this.hasAttribute("settings");
	}
	public set settings(value: boolean) {
		this.toggleAttribute("settings", value);
	}

	private direction(name: string): XYGrid {
		const value = this.getAttribute(name);
		return value === "horizontal" || value === "vertical" || value === "none"
			? value
			: "both";
	}
	/** Visible grid directions. @attr grid */
	public get grid(): "both" | "horizontal" | "vertical" | "none" {
		return this.direction("grid");
	}
	public set grid(value: XYGrid) {
		this.setAttribute("grid", value);
	}
	/** Visible axes and associated ticks. @attr axis */
	public get axis(): "both" | "horizontal" | "vertical" | "none" {
		return this.direction("axis");
	}
	public set axis(value: XYGrid) {
		this.setAttribute("axis", value);
	}
	/** Whether curve legends are hidden. @attr no-legend */
	public get noLegend(): boolean {
		return this.hasAttribute("no-legend");
	}
	public set noLegend(value: boolean) {
		this.toggleAttribute("no-legend", value);
	}

	/** Gets the comma-separated reveal order, or sets it and returns to the start. */
	public anim(): string;
	public anim(names: string): void;
	public anim(names?: string): string | undefined {
		if (names === undefined)
			return (this.animationOverride ?? this.animation).join(",");
		const list = names.trim()
			? names.split(",").map((name) => name.trim())
			: [];
		if (list.some((name) => !name) || new Set(list).size !== list.length)
			throw new Error("anim requires unique, nonempty names.");
		if (this.objectNames) {
			for (const name of list)
				if (!this.objectNames.has(name))
					throw new Error(`Unknown anim object: ${name}`);
		}
		this.animationOverride = list;
		this.animation = list;
		this.animationStep = 0;
		this.createAnimationControls();
		this.syncAnimation();
	}
	/** Hides all objects in the reveal sequence. */
	public goToStart(): void {
		this.animationStep = 0;
		this.syncAnimation();
	}
	/** Reveals all objects in the reveal sequence. */
	public goToEnd(): void {
		this.animationStep = this.animation.length;
		this.syncAnimation();
	}
	/** Hides the last revealed object; stops at the start. */
	public previous(): void {
		this.animationStep = Math.max(0, this.animationStep - 1);
		this.syncAnimation();
	}
	/** Reveals the next object; stops at the end. */
	public next(): void {
		this.animationStep = Math.min(
			this.animation.length,
			this.animationStep + 1,
		);
		this.syncAnimation();
	}

	private syncPresentation(): void {
		const grid = this.hasAttribute("grid") ? this.grid : this.sourceGrid;
		for (const item of this.querySelectorAll<SVGElement>(
			"[data-xy-grid], [data-xy-axis], [data-xy-legend]",
		)) {
			const mode = item.hasAttribute("data-xy-grid") ? grid : this.axis;
			const direction =
				item.getAttribute("data-xy-grid") ?? item.getAttribute("data-xy-axis");
			const visible = item.hasAttribute("data-xy-legend")
				? !this.noLegend
				: mode === "both" || mode === direction;
			item.style.display = visible ? "" : "none";
		}
		this.fitPlotViewBox();
	}

	public static get observedAttributes(): string[] {
		return ["src", "settings", "grid", "axis", "no-legend"];
	}

	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/xy-plot"],
		textContentFallback: true,
		ignoreSelector: "[data-xy-plot-output]",
	});

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.classList.add("tp-xy-plot");
		this.ensureGlobalStyle(STYLE_ID, style);
		registerZoomButtons();
		if (!this.data)
			this.source.observe(() => {
				void this.renderPlot();
			});
		void this.renderPlot();
	}

	protected disconnectedCallback(): void {
		this.stopPan();
		this.revision++;
		this.source.disconnect();
		this.disposeSettings();
	}

	protected attributeChangedCallback(name: string): void {
		if (["grid", "axis", "no-legend"].includes(name)) {
			if (this.isConnected) this.syncPresentation();
			return;
		}
		if (name === "settings") {
			if (this.isConnected) this.syncSettings();
			return;
		}
		this.data = null;
		this.currentSource = null;
		this.initialSource = null;
		this.disposeSettings();
		if (!this.isConnected) return;
		void this.renderPlot();
	}

	/** Renders numeric series with automatic axis ranges; separate series preserve gaps. */
	public setData(data: TpXYPlotData): void {
		this.source.capture();
		this.source.disconnect();
		this.data = data;
		this.currentSource = null;
		this.initialSource = null;
		this.disposeSettings();
		if (this.isConnected) void this.renderPlot();
	}

	/** Builds the existing SVG renderer's diagram from finite numeric samples. */
	private renderData(data: TpXYPlotData): string {
		this.objectNames = new Set(
			[...data.series, ...(data.points ?? []), ...(data.vectors ?? [])].map(
				(item) => item.label,
			),
		);
		const points = [
			...data.series.flatMap((series) => series.points),
			...(data.points ?? []),
			...(data.vectors ?? []).flatMap((v) => [
				{ x: v.x, y: v.y },
				{ x: v.x + v.dx, y: v.y + v.dy },
			]),
		];
		if (
			!points.length ||
			points.some(
				(point) => !Number.isFinite(point.x) || !Number.isFinite(point.y),
			)
		)
			throw new Error("Numeric plots require finite data points.");
		const bounds = points.reduce(
			(b, point) => ({
				minX: Math.min(b.minX, point.x),
				maxX: Math.max(b.maxX, point.x),
				minY: Math.min(b.minY, point.y),
				maxY: Math.max(b.maxY, point.y),
			}),
			{ minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
		);
		const pad = Math.max(1, (bounds.maxY - bounds.minY) * 0.05);
		return this.initializeViewport(
			{
				kind: "xyParametricGraph",
				title: data.title,
				legendX: data.xLabel,
				legendY: data.yLabel,
				xAxis: [
					bounds.minX,
					bounds.maxX > bounds.minX ? bounds.maxX : bounds.minX + 1,
				],
				yAxis: [bounds.minY - pad, bounds.maxY + pad],
				tAxis: [0, 1],
				samples: 2,
				functions: [],
				vectors: data.vectors,
				points: [
					...(data.points ?? []),
					...data.series.flatMap((series) =>
						series.points.length === 1
							? series.points.map((point) => ({ ...point, label: "" }))
							: [],
					),
				],
			},
			data.series.map((series) => ({
				...series,
				expression: series.label,
				lineStyle: series.lineStyle ?? (series.dashed ? "dashed" : "solid"),
			})),
		);
	}

	/** Resets the viewport when a new graph definition or dataset is rendered. */
	private initializeViewport(
		diagram: XYGraphDiagram,
		curves: SampledCurve[] | null = null,
	): string {
		const svg = renderXYGraphSvg(
			{ ...diagram, grid: "both" },
			curves ?? sampleXYGraph(diagram),
		);
		this.zoomDiagram = diagram;
		this.zoomCurves = curves;
		this.stopPan();
		this.zoomLevel = 0;
		this.panX = 0;
		this.panY = 0;
		return svg;
	}

	/** Computes a centered viewport without accumulating floating-point drift. */
	private zoomRange(range: AxisRange, level: number, offset = 0): AxisRange {
		const center = range[0] / 2 + range[1] / 2 + offset;
		const half = (range[1] / 2 - range[0] / 2) / 1.25 ** level;
		return level === 0 && offset === 0 ? range : [center - half, center + half];
	}

	/** Resamples functions while preserving the revealed objects and both views. */
	private changeZoom(delta: number): void {
		this.renderViewport(this.zoomLevel + delta, this.panX, this.panY);
	}

	/** Applies a translated and scaled viewport, without changing the source. */
	private renderViewport(
		level: number,
		offsetX: number,
		offsetY: number,
	): void {
		const original = this.zoomDiagram;
		if (!original || level < -12 || level > 12) return;
		const xAxis = this.zoomRange(original.xAxis, level, offsetX);
		const yAxis = this.zoomRange(original.yAxis, level, offsetY);
		if (
			[xAxis, yAxis].some(
				([min, max]) =>
					!Number.isFinite(min) || !Number.isFinite(max) || min >= max,
			)
		)
			return;
		const inside = (
			value: number | undefined,
			range: AxisRange,
		): number | undefined =>
			value !== undefined && value >= range[0] && value <= range[1]
				? value
				: undefined;
		const diagram: XYGraphDiagram = {
			...original,
			xAxis,
			yAxis,
			xTicks: level === 0 && offsetX === 0 ? original.xTicks : undefined,
			yTicks: level === 0 && offsetY === 0 ? original.yTicks : undefined,
			xAxisAt: inside(original.xAxisAt, yAxis),
			yAxisAt: inside(original.yAxisAt, xAxis),
			grid: "both",
		};
		const svg = renderXYGraphSvg(
			diagram,
			this.zoomCurves ?? sampleXYGraph(diagram),
		);
		this.zoomLevel = level;
		this.panX = offsetX;
		this.panY = offsetY;
		this.commitSvg(svg, this.animation, true);
	}

	/** Releases pointer capture and any scheduled pan rendering. */
	private stopPan(): void {
		if (this.panFrame) cancelAnimationFrame(this.panFrame);
		this.panFrame = 0;
		const drag = this.drag;
		this.drag = null;
		if (drag) {
			drag.host.classList.remove("tp-xy-plot-panning");
			if (drag.host.hasPointerCapture?.(drag.id))
				drag.host.releasePointerCapture(drag.id);
		}
	}

	/** Enables dragging and keyboard panning on the stable SVG container. */
	private bindPan(host: HTMLElement): void {
		host.tabIndex = 0;
		host.setAttribute("role", "group");
		host.setAttribute(
			"aria-label",
			"Graph viewport. Drag or use arrow keys to pan; Home resets the view.",
		);
		host.addEventListener("keydown", (event) => {
			if (event.target !== host || !this.zoomDiagram) return;
			if (event.key === "Home") {
				event.preventDefault();
				this.renderViewport(0, 0, 0);
				return;
			}
			const direction = {
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
				ArrowUp: [0, 1],
				ArrowDown: [0, -1],
			}[event.key];
			if (!direction) return;
			event.preventDefault();
			const x = this.zoomRange(this.zoomDiagram.xAxis, this.zoomLevel);
			const y = this.zoomRange(this.zoomDiagram.yAxis, this.zoomLevel);
			this.renderViewport(
				this.zoomLevel,
				this.panX - ((direction[0] ?? 0) * (x[1] - x[0])) / 10,
				this.panY - ((direction[1] ?? 0) * (y[1] - y[0])) / 10,
			);
		});
		host.addEventListener("pointerdown", (event) => {
			if (
				event.button !== 0 ||
				event.isPrimary === false ||
				!this.zoomDiagram ||
				this.drag
			)
				return;
			const svg = host.querySelector("svg");
			const frame = svg?.querySelector<SVGRectElement>('rect[stroke="#999"]');
			const bounds = frame?.getBoundingClientRect();
			if (!svg || !bounds?.width || !bounds.height) return;
			const x = this.zoomRange(this.zoomDiagram.xAxis, this.zoomLevel);
			const y = this.zoomRange(this.zoomDiagram.yAxis, this.zoomLevel);
			this.drag = {
				host,
				id: event.pointerId,
				x: event.clientX,
				y: event.clientY,
				offsetX: this.panX,
				offsetY: this.panY,
				unitX: (x[1] - x[0]) / bounds.width,
				unitY: (y[1] - y[0]) / bounds.height,
				nextX: this.panX,
				nextY: this.panY,
				viewBox: svg.getAttribute("viewBox") ?? "0 0 900 900",
			};
			host.setPointerCapture(event.pointerId);
			host.classList.add("tp-xy-plot-panning");
			host.focus({ preventScroll: true });
			event.preventDefault();
		});
		host.addEventListener("pointermove", (event) => {
			const drag = this.drag;
			if (!drag || drag.id !== event.pointerId) return;
			drag.nextX = drag.offsetX - (event.clientX - drag.x) * drag.unitX;
			drag.nextY = drag.offsetY + (event.clientY - drag.y) * drag.unitY;
			if (!this.panFrame)
				this.panFrame = requestAnimationFrame(() => {
					this.panFrame = 0;
					if (this.drag === drag)
						this.renderViewport(this.zoomLevel, drag.nextX, drag.nextY);
				});
		});
		const finish = (event: PointerEvent): void => {
			const drag = this.drag;
			if (!drag || event.pointerId !== drag.id) return;
			this.renderViewport(this.zoomLevel, drag.nextX, drag.nextY);
			this.stopPan();
		};
		host.addEventListener("pointerup", finish);
		host.addEventListener("pointercancel", finish);
		host.addEventListener("lostpointercapture", finish);
	}

	/** Frames the actual drawing, including rotated axis labels and long legends. */
	private fitPlotViewBox(): void {
		const preview = this.querySelector<SVGSVGElement>(
			".tp-xy-plot-preview > svg",
		);
		if (this.drag) {
			for (const svg of this.querySelectorAll(
				".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
			))
				svg.setAttribute("viewBox", this.drag.viewBox);
			return;
		}
		if (!preview || typeof preview.getBBox !== "function") return;
		const background = preview.querySelector<SVGRectElement>(":scope > rect");
		if (!background) return;
		// The full-canvas background must not contribute to the drawing bounds.
		const display = background.style.display;
		background.style.display = "none";
		let bounds: DOMRect;
		try {
			bounds = preview.getBBox();
		} finally {
			background.style.display = display;
		}
		if (!(bounds.width > 0 && bounds.height > 0)) return;
		const padding = 12;
		const x = bounds.x - padding;
		const y = bounds.y - padding;
		const width = bounds.width + padding * 2;
		const height = bounds.height + padding * 2;
		for (const plot of this.querySelectorAll<SVGSVGElement>(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		)) {
			plot.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
			const fill = plot.querySelector(":scope > rect");
			fill?.setAttribute("x", String(x));
			fill?.setAttribute("y", String(y));
			fill?.setAttribute("width", String(width));
			fill?.setAttribute("height", String(height));
		}
	}

	private disposeSettings(): void {
		this.settingsRevision++;
		this.settingsEditor?.destroy();
		this.settingsEditor = null;
		this.settingsOpen = false;
	}

	private syncSettings(): void {
		let toggle = this.querySelector<HTMLElement>(
			":scope > .tp-xy-plot-toolbar > .tp-xy-plot-settings-button",
		);
		if (!this.settings) {
			this.disposeSettings();
			toggle?.remove();
			return;
		}
		let toolbar = this.querySelector(":scope > .tp-xy-plot-toolbar");
		if (!toolbar) {
			toolbar = document.createElement("div");
			toolbar.className = "tp-xy-plot-toolbar";
			toolbar.setAttribute("data-xy-plot-output", "");
			this.prepend(toolbar);
		}
		if (!toggle) {
			toggle = document.createElement("tp-icon-button");
			toggle.className = "tp-xy-plot-settings-button";
			toggle.setAttribute("name", "settings");
			toggle.setAttribute("library", "tp");
			toggle.addEventListener("click", () => {
				void this.toggleSettings();
			});
			toolbar.insertBefore(
				toggle,
				toolbar.querySelector(".tp-xy-plot-zoom-button"),
			);
		}
		toggle.setAttribute(
			"label",
			this.data ? "Settings require a graph definition" : "Graph settings",
		);
		toggle.toggleAttribute(
			"disabled",
			this.data !== null || !this.currentSource,
		);
		const native = toggle.querySelector("button");
		native?.setAttribute("aria-expanded", String(this.settingsOpen));
		native?.setAttribute("aria-controls", this.settingsPanelId);
		if (this.settingsEditor)
			this.settingsEditor.element.hidden = !this.settingsOpen;
	}

	private async toggleSettings(): Promise<void> {
		if (!this.settings || !this.currentSource || this.data) return;
		this.settingsOpen = !this.settingsOpen;
		this.syncSettings();
		if (!this.settingsOpen || this.settingsEditor) return;
		const revision = this.settingsRevision;
		try {
			const { XYPlotSettings } = await import("./xy-plot-settings.js");
			if (
				revision !== this.settingsRevision ||
				!this.isConnected ||
				!this.settingsOpen ||
				this.settingsEditor ||
				!this.currentSource
			)
				return;
			this.settingsEditor = new XYPlotSettings(
				this.initialSource ?? this.currentSource,
				(source) => {
					const diagram = parseXYGraph(source);
					this.objectNames = new Set(
						[
							...diagram.functions,
							...(diagram.points ?? []),
							...(diagram.vectors ?? []),
						].map((item) => item.label),
					);
					this.sourceGrid = diagram.grid ?? "both";
					const svg = this.initializeViewport(diagram);
					this.revision++;
					this.currentSource = source;
					this.commitSvg(svg, diagram.anim);
				},
			);
			this.settingsEditor.element.id = this.settingsPanelId;
			this.append(this.settingsEditor.element);
			this.settingsEditor.initialize(this.currentSource);
			this.syncSettings();
		} catch (error) {
			if (revision !== this.settingsRevision) return;
			this.settingsOpen = false;
			this.syncSettings();
			const message = document.createElement("p");
			message.setAttribute("role", "alert");
			message.setAttribute("data-xy-plot-output", "");
			message.textContent =
				error instanceof Error ? error.message : String(error);
			this.append(message);
		}
	}

	private commitSvg(
		svg: string,
		animation: string[] = [],
		preserveAnimation = false,
	): void {
		if (!preserveAnimation) {
			this.animation = this.animationOverride ?? animation;
			this.animationStep = 0;
		}
		if (!this.querySelector(":scope > .tp-xy-plot-preview")) {
			this.innerHTML = `
<div class="tp-xy-plot-toolbar">
  <tp-icon-button data-xy-zoom="in" name="plus" library="tp" label="Zoom in"></tp-icon-button>
  <tp-icon-button data-xy-zoom="out" name="minus" library="tp" label="Zoom out"></tp-icon-button>
  <tp-icon-button data-xy-zoom="reset" name="refresh" library="tp" label="Reset view"></tp-icon-button>
  <tp-icon-button class="tp-xy-plot-zoom-button" name="zoom-out" library="tp" label="Zoom graph"></tp-icon-button>
</div>
<div class="tp-xy-plot-preview">${svg}</div>
<dialog class="tp-xy-plot-dialog" aria-label="Zoomed graph">
  <form class="tp-xy-plot-dialog-header" method="dialog">
  <tp-icon-button data-xy-zoom="in" name="plus" library="tp" label="Zoom in"></tp-icon-button>
  <tp-icon-button data-xy-zoom="out" name="minus" library="tp" label="Zoom out"></tp-icon-button>
  <tp-icon-button data-xy-zoom="reset" name="refresh" library="tp" label="Reset view"></tp-icon-button>
    <tp-icon-button type="submit" class="tp-xy-plot-close-button" name="zoom-in" library="tp" label="Close zoomed graph"></tp-icon-button>
  </form>
  <div class="tp-xy-plot-dialog-content">${svg}</div>
</dialog>
`;
			for (const button of this.querySelectorAll("[data-xy-zoom]")) {
				button.addEventListener("click", () => {
					if (button.hasAttribute("disabled")) return;
					if (button.getAttribute("data-xy-zoom") === "reset")
						this.renderViewport(0, 0, 0);
					else
						this.changeZoom(
							button.getAttribute("data-xy-zoom") === "in" ? 1 : -1,
						);
				});
			}
		}
		for (const host of this.querySelectorAll<HTMLElement>(
			".tp-xy-plot-preview, .tp-xy-plot-dialog-content",
		)) {
			if (!host.hasAttribute("tabindex")) this.bindPan(host);
		}
		for (const button of this.querySelectorAll("[data-xy-zoom]")) {
			button.toggleAttribute(
				"disabled",
				button.getAttribute("data-xy-zoom") === "in"
					? this.zoomLevel >= 12
					: button.getAttribute("data-xy-zoom") === "out" &&
							this.zoomLevel <= -12,
			);
		}
		const preview = this.querySelector(":scope > .tp-xy-plot-preview");
		const zoom = this.querySelector(
			":scope > .tp-xy-plot-dialog > .tp-xy-plot-dialog-content",
		);
		if (preview) preview.innerHTML = svg;
		if (zoom) zoom.innerHTML = svg;

		for (const plot of this.querySelectorAll<SVGElement>(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		)) {
			plot.setAttribute("role", "img");
			plot.setAttribute("aria-label", this.data?.title || "XY plot");
		}
		if (this.zoomDiagram) {
			for (const [direction, position, originalRange] of [
				["horizontal", this.zoomDiagram.xAxisAt, this.zoomDiagram.yAxis],
				["vertical", this.zoomDiagram.yAxisAt, this.zoomDiagram.xAxis],
			] as const) {
				const [min, max] = this.zoomRange(
					originalRange,
					this.zoomLevel,
					direction === "horizontal" ? this.panY : this.panX,
				);
				if (position !== undefined && (position < min || position > max)) {
					for (const line of this.querySelectorAll(
						`svg > line[data-xy-axis="${direction}"]`,
					))
						line.remove();
				}
			}
		}
		this.syncPresentation();
		this.fitPlotViewBox();
		if (preserveAnimation) {
			if (this.animation.length) this.syncAnimation();
		} else this.createAnimationControls();
		Array.from(this.children).forEach((child) => {
			child.setAttribute("data-xy-plot-output", "");
		});
		this.syncSettings();
	}

	private createAnimationControls(): void {
		this.querySelector(":scope > .tp-xy-plot-animation")?.remove();
		if (!this.animation.length) return;
		const controls = document.createElement("div");
		controls.className = "tp-xy-plot-animation";
		controls.setAttribute("role", "group");
		controls.setAttribute("aria-label", "Step-by-step graph");
		controls.setAttribute("data-xy-plot-output", "");
		for (const [action, icon, label] of [
			["start", "chevron-left-first", "Start"],
			["previous", "chevron-left", "Previous"],
			["next", "chevron-right", "Next"],
			["end", "chevron-right-last", "End"],
		]) {
			if (!action || !icon || !label) continue;
			if (action === "next") {
				const status = document.createElement("span");
				status.setAttribute("role", "status");
				status.setAttribute("aria-live", "polite");
				controls.append(status);
			}
			const button = document.createElement("tp-icon-button");
			button.setAttribute("name", icon);
			button.setAttribute("library", "tp");
			button.setAttribute("label", label);
			button.dataset.action = action;
			button.addEventListener("click", () => {
				if (button.hasAttribute("disabled")) return;
				if (action === "start") this.goToStart();
				else if (action === "end") this.goToEnd();
				else if (action === "next") this.next();
				else this.previous();
			});
			controls.append(button);
		}
		this.querySelector(":scope > .tp-xy-plot-preview")?.after(controls);
		this.syncAnimation();
	}

	private syncAnimation(): void {
		const hidden = new Set(this.animation.slice(this.animationStep));
		for (const object of this.querySelectorAll<SVGElement>(
			"[data-xy-object]",
		)) {
			const visible = !hidden.has(object.getAttribute("data-xy-object") ?? "");
			object.style.visibility = visible ? "visible" : "hidden";
			object.setAttribute("aria-hidden", String(!visible));
		}
		const controls = this.querySelector(":scope > .tp-xy-plot-animation");
		const status = controls?.querySelector('[role="status"]');
		if (status)
			status.textContent = `${this.animationStep} / ${this.animation.length}`;
		for (const button of controls?.querySelectorAll("tp-icon-button") ?? []) {
			const backwards = ["start", "previous"].includes(
				button.getAttribute("data-action") ?? "",
			);
			button.toggleAttribute(
				"disabled",
				backwards
					? this.animationStep === 0
					: this.animationStep === this.animation.length,
			);
		}
	}

	private async renderPlot(): Promise<void> {
		const revision = ++this.revision;
		try {
			let svg: string;
			let animation: string[] = [];
			if (this.data) {
				this.sourceGrid = "both";
				svg = this.renderData(this.data);
			} else {
				const source =
					this.currentSource ?? (await this.source.read({ cache: "no-store" }));
				if (revision !== this.revision || !this.isConnected) return;

				if (source.trim() === "") {
					this.innerHTML = "";
					this.syncSettings();
					return;
				}

				const diagram = parseXYGraph(source);
				this.objectNames = new Set(
					[
						...diagram.functions,
						...(diagram.points ?? []),
						...(diagram.vectors ?? []),
					].map((item) => item.label),
				);
				animation = diagram.anim ?? [];
				this.sourceGrid = diagram.grid ?? "both";
				svg = this.initializeViewport(diagram);
				this.currentSource = source;
				this.initialSource ??= source;
			}
			this.commitSvg(svg, animation);
		} catch (error) {
			if (revision !== this.revision || !this.isConnected) return;
			const message = error instanceof Error ? error.message : String(error);
			this.innerHTML = `<pre class="tp-xy-plot-error" role="alert" data-xy-plot-output><code>${escapeHtml(message)}</code></pre>`;
			this.syncSettings();
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-xy-plot": TpXYPlot;
	}
}

function registerZoomButtons(): void {
	if (zoomButtonsRegistered || typeof document === "undefined") return;
	zoomButtonsRegistered = true;

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const button = target.closest(".tp-xy-plot-zoom-button");
		if (!(button instanceof HTMLElement)) return;

		const host = button.closest(".tp-xy-plot");
		if (!(host instanceof HTMLElement)) return;

		const dialog = host.querySelector(".tp-xy-plot-dialog");
		if (dialog instanceof HTMLDialogElement) {
			dialog.showModal();
		}
	});
}

if (!customElements.get("tp-xy-plot")) {
	customElements.define("tp-xy-plot", TpXYPlot);
}
