/** @module components/word-cloud */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../icon/icon.js";
import style from "./word-cloud.css?inline";

const NS = "http://www.w3.org/2000/svg";
const COLORS =
	"default red orange amber yellow lime green emerald teal glaz cyan sky blue indigo violet purple fuchsia pink rose zinc ivory stone".split(
		" ",
	);
const SHAPES = [
	"circle",
	"triangle",
	"square",
	"pentagon",
	"hexagon",
	"cloud",
	"heart",
	"puzzle",
];
type Point = { x: number; y: number };
/** Sample cubic outlines once; both the SVG and placement use these exact vertices. */
function curvedOutline(start: Point, curves: number[][]): Point[] {
	const points = [start];
	let from = start;
	for (const curve of curves) {
		const [ax = 0, ay = 0, bx = 0, by = 0, x = 0, y = 0] = curve;
		for (let step = 1; step <= 24; step++) {
			const t = step / 24,
				u = 1 - t;
			points.push({
				x:
					u ** 3 * from.x +
					3 * u * u * t * ax +
					3 * u * t * t * bx +
					t ** 3 * x,
				y:
					u ** 3 * from.y +
					3 * u * u * t * ay +
					3 * u * t * t * by +
					t ** 3 * y,
			});
		}
		from = { x, y };
	}
	return points;
}
const OUTLINES: Record<string, Point[]> = {
	cloud: curvedOutline({ x: -155, y: 150 }, [
		[-265, 150, -265, -30, -165, -45],
		[-185, -160, -45, -220, 30, -140],
		[90, -225, 210, -160, 190, -65],
		[275, -40, 250, 150, 155, 150],
	]),
	heart: Array.from({ length: 120 }, (_, i) => {
		const t = (i * 2 * Math.PI) / 120;
		return {
			x: 235 * Math.sin(t) ** 3,
			y:
				15 *
				(-13 * Math.cos(t) +
					5 * Math.cos(2 * t) +
					2 * Math.cos(3 * t) +
					Math.cos(4 * t) -
					2.5),
		};
	}),
	puzzle: curvedOutline({ x: -170, y: -170 }, [
		[-170, -170, -55, -170, -55, -170],
		[-90, -250, 90, -250, 55, -170],
		[55, -170, 170, -170, 170, -170],
		[170, -170, 170, -55, 170, -55],
		[90, -90, 90, 90, 170, 55],
		[170, 55, 170, 170, 170, 170],
		[170, 170, 55, 170, 55, 170],
		[90, 250, -90, 250, -55, 170],
		[-55, 170, -170, 170, -170, 170],
		[-170, 170, -170, 55, -170, 55],
		[-90, 90, -90, -90, -170, -55],
		[-170, -55, -170, -170, -170, -170],
	]),
};
/** Full rectangle containment also rejects concave notches crossing between its corners. */
export function fitsCloud(
	x: number,
	y: number,
	w: number,
	h: number,
	shape: string,
): boolean {
	if (
		![-1, 1].every((dx) =>
			[-1, 1].every((dy) =>
				insideCloud(x + (dx * w) / 2, y + (dy * h) / 2, shape),
			),
		)
	)
		return false;
	const outline = OUTLINES[shape];
	if (!outline) return true;
	const left = x - w / 2,
		right = x + w / 2,
		top = y - h / 2,
		bottom = y + h / 2;
	return !outline.some((a, i) => {
		const b = outline[(i + 1) % outline.length];
		if (
			!b ||
			Math.max(a.x, b.x) <= left ||
			Math.min(a.x, b.x) >= right ||
			Math.max(a.y, b.y) <= top ||
			Math.min(a.y, b.y) >= bottom
		)
			return false;
		let low = 0,
			high = 1;
		for (const [origin, delta, min, max] of [
			[a.x, b.x - a.x, left, right],
			[a.y, b.y - a.y, top, bottom],
		]) {
			if (
				origin === undefined ||
				delta === undefined ||
				min === undefined ||
				max === undefined
			)
				continue;
			if (Math.abs(delta) < 1e-10) {
				if (origin <= min || origin >= max) return false;
			} else {
				const t1 = (min - origin) / delta,
					t2 = (max - origin) / delta;
				low = Math.max(low, Math.min(t1, t2));
				high = Math.min(high, Math.max(t1, t2));
			}
		}
		return low < high;
	});
}
/** Tests points against the chosen silhouette, centered on the origin. */
export function insideCloud(x: number, y: number, shape: string): boolean {
	const outline = OUTLINES[shape];
	if (outline) {
		let inside = false;
		for (let i = 0; i < outline.length; i++) {
			const a = outline[i],
				b = outline[(i + 1) % outline.length];
			if (
				a &&
				b &&
				a.y > y !== b.y > y &&
				x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x
			)
				inside = !inside;
		}
		return inside;
	}
	if (shape === "square") return Math.max(Math.abs(x), Math.abs(y)) <= 235;
	const sides = (
		{ triangle: 3, pentagon: 5, hexagon: 6 } as Record<string, number>
	)[shape];
	if (!sides) return x * x + y * y <= 235 * 235;
	for (let i = 0; i < sides; i++) {
		const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
		const b = a + (2 * Math.PI) / sides;
		const ax = 235 * Math.cos(a),
			ay = 235 * Math.sin(a);
		const bx = 235 * Math.cos(b),
			by = 235 * Math.sin(b);
		if ((bx - ax) * (y - ay) - (by - ay) * (x - ax) < -0.001) return false;
	}
	return true;
}
type Word = { text: string; rank: number; icon?: Element };
type Box = { x: number; y: number; w: number; h: number };

/**
 * The custom `<tp-word-cloud>` element generates a responsive SVG word cloud inside a chosen silhouette.
 *
 * @summary Generates a responsive SVG word cloud inside a chosen silhouette.
 * @tagname tp-word-cloud
 * @attr {"circle"|"triangle"|"square"|"pentagon"|"hexagon"|"cloud"|"heart"|"puzzle"} shape = "circle" - Outer silhouette, using English names only.
 * @attr {"default"|"red"|"orange"|"amber"|"yellow"|"lime"|"green"|"emerald"|"teal"|"glaz"|"cyan"|"sky"|"blue"|"indigo"|"violet"|"purple"|"fuchsia"|"pink"|"rose"|"zinc"|"ivory"|"stone"} color = "glaz" - Brand palette, with varied levels for individual words.
 * @attr {""|"default"|"red"|"orange"|"amber"|"yellow"|"lime"|"green"|"emerald"|"teal"|"glaz"|"cyan"|"sky"|"blue"|"indigo"|"violet"|"purple"|"fuchsia"|"pink"|"rose"|"zinc"|"ivory"|"stone"} bg-color = "glaz" - Brand palette for the shape background at level 100; an explicit empty value leaves it transparent.
 * @attr {number} scale = 1 - Positive font-size multiplier, clamped to 0.1–4; crowded clouds shrink together to fit.
 * @attr {number} rotate = 0 - Maximum word rotation in degrees, clamped to -90–90; orientations alternate between zero and both signs.
 * @accessibility The original ranked list remains available to assistive technology; the generated SVG is decorative.
 * @example
 * <tp-word-cloud shape="circle" color="glaz" bg-color="glaz" scale="1" rotate="0">
 *   <ol>
 *     <li><tp-icon name="logo-tp" aria-label="tp logo"></tp-icon></li>
 *     <li></li>
 *     <li>quizzes, playgrounds, viewers, notebooks</li>
 *     <li>simulators, plots, games</li>
 *     <li></li>
 *     <li>documentations, editors, pickers, controllers, feedbacks</li>
 *     <li>markdown, asciidoc, latex, restructuredtext</li>
 *     <li>forms, overlays, medias, times</li>
 *     <li></li>
 *     <li>utilities</li>
 *   </ol>
 * </tp-word-cloud>
 */
export class TpWordCloud extends TpBase {
	private observer = new MutationObserver((records) => {
		if (
			records.some(
				(r) =>
					!(
						r.target instanceof Element ? r.target : r.target.parentElement
					)?.closest("svg[data-word-cloud]"),
			)
		)
			this.schedule();
	});
	private measuredWidth = -1;
	private resize = new ResizeObserver(([entry]) => {
		if (entry && entry.contentRect.width !== this.measuredWidth) {
			this.measuredWidth = entry.contentRect.width;
			if (this.measuredWidth > 0) this.schedule();
		}
	});
	private pending: ReturnType<typeof setTimeout> | null = null;
	private svg: SVGSVGElement | null = null;
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"shape",
			"color",
			"bg-color",
			"scale",
			"rotate",
		];
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-word-cloud-styles", style);
		this.observe();
		this.resize.observe(this);
		this.ownerDocument.fonts?.addEventListener("loadingdone", this.schedule);
		void this.ownerDocument.fonts?.ready.then(() => {
			if (this.isConnected) this.schedule();
		});
		this.schedule();
	}
	public disconnectedCallback(): void {
		this.resize.disconnect();
		this.measuredWidth = -1;
		this.observer.disconnect();
		this.ownerDocument.fonts?.removeEventListener("loadingdone", this.schedule);
		if (this.pending !== null) clearTimeout(this.pending);
		this.pending = null;
	}
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.schedule();
	}
	private observe(): void {
		this.observer.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: [
				"name",
				"library",
				"src",
				"color",
				"fallback",
				"fallback-icon",
				"aria-label",
			],
		});
	}
	private schedule = (): void => {
		if (this.pending !== null) clearTimeout(this.pending);
		this.pending = setTimeout(() => {
			this.pending = null;
			if (this.isConnected) this.render();
		}, 0);
	};
	private number(
		name: string,
		fallback: number,
		min: number,
		max: number,
	): number {
		const raw = this.getAttribute(name)?.trim();
		const value = raw ? Number(raw) : fallback;
		return Number.isFinite(value) && (name !== "scale" || value > 0)
			? Math.min(max, Math.max(min, value))
			: fallback;
	}
	private render(): void {
		const words: Word[] = [];
		this.querySelector(":scope > ol")
			?.querySelectorAll(":scope > li")
			.forEach((li, rank) => {
				// Empty items deliberately consume a rank without generating words.
				let buffer = "";
				const flush = (): void => {
					for (const text of buffer
						.split(",")
						.map((value) => value.trim())
						.filter(Boolean))
						words.push({ text, rank });
					buffer = "";
				};
				const read = (node: Node): void => {
					if (node instanceof Element && node.localName === "tp-icon") {
						flush();
						words.push({ text: "", rank, icon: node });
					} else if (node.nodeType === Node.TEXT_NODE)
						buffer += node.textContent ?? "";
					else for (const child of node.childNodes) read(child);
				};
				for (const child of li.childNodes) read(child);
				flush();
			});
		this.observer.disconnect();
		this.svg?.remove();
		this.removeAttribute("data-cloud-ready");
		if (words.length > 500) {
			this.svg = null;
			this.observe();
			return;
		}
		const svg = this.ownerDocument.createElementNS(NS, "svg");
		this.svg = svg;
		svg.dataset.wordCloud = "";
		svg.setAttribute("viewBox", "-250 -250 500 500");
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("focusable", "false");
		const color = this.getAttribute("color") ?? "glaz";
		svg.classList.add(`tp-${COLORS.includes(color) ? color : "glaz"}`);
		this.append(svg);
		const shapeRaw = this.getAttribute("shape") ?? "circle";
		const shape = SHAPES.includes(shapeRaw) ? shapeRaw : "circle";
		const requestedBackground = this.getAttribute("bg-color") ?? "glaz";
		const backgroundColor =
			requestedBackground === "" || COLORS.includes(requestedBackground)
				? requestedBackground
				: "glaz";
		if (COLORS.includes(backgroundColor)) {
			const background = this.ownerDocument.createElementNS(
				NS,
				shape === "circle" ? "circle" : shape === "square" ? "rect" : "polygon",
			);
			background.dataset.wordCloudBackground = "";
			background.classList.add(`tp-${backgroundColor}`);
			background.setAttribute("fill", "var(--tp-brand-100)");
			if (shape === "circle") background.setAttribute("r", "235");
			else if (shape === "square") {
				background.setAttribute("x", "-235");
				background.setAttribute("y", "-235");
				background.setAttribute("width", "470");
				background.setAttribute("height", "470");
			} else if (OUTLINES[shape]) {
				background.setAttribute(
					"points",
					OUTLINES[shape].map((point) => `${point.x},${point.y}`).join(" "),
				);
			} else {
				const sides = shape === "triangle" ? 3 : shape === "pentagon" ? 5 : 6;
				background.setAttribute(
					"points",
					Array.from({ length: sides }, (_, i) => {
						const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
						return `${235 * Math.cos(angle)},${235 * Math.sin(angle)}`;
					}).join(" "),
				);
			}
			svg.append(background);
		}
		const scale = this.number("scale", 1, 0.1, 4);
		const rotation = this.number("rotate", 0, -90, 90);
		const nodes = words.map((word, index) => {
			const node = this.ownerDocument.createElementNS(
				NS,
				word.icon ? "g" : "text",
			);
			if (word.icon) {
				node.dataset.wordCloudIcon = "";
				const viewport = this.ownerDocument.createElementNS(
					NS,
					"foreignObject",
				);
				const icon = word.icon.cloneNode(true) as HTMLElement;
				// Keep the author source; let tp-icon resolve registry, URL and inline SVG sources.
				icon
					.querySelectorAll(
						":scope > [data-tp-icon-container], :scope > [data-tp-icon-fallback]",
					)
					.forEach((child) => {
						child.remove();
					});
				for (const attribute of [
					"id",
					"data-source",
					"style",
					"scale",
					"rotate",
					"spin",
				])
					icon.removeAttribute(attribute);
				icon.setAttribute("size", "100%");
				icon.setAttribute("data-tp-render-eager", "");
				icon.setAttribute("aria-hidden", "true");
				viewport.append(icon);
				node.append(viewport);
			} else {
				node.textContent = word.text;
				node.setAttribute("font-family", "sans-serif");
				node.setAttribute("font-weight", "600");
			}
			node.style.color = `var(--tp-brand-${[600, 800, 500, 700][index % 4]})`;
			node.setAttribute(
				"fill",
				`var(--tp-brand-${[600, 800, 500, 700][index % 4]})`,
			);
			svg.append(node);
			return node;
		});
		let fitted = false;
		// Retry the entire layout at a common smaller size to preserve rank equality.
		for (let attempt = 0; attempt < 80; attempt++) {
			const boxes: Box[] = [];
			let complete = true;
			for (let i = 0; i < words.length; i++) {
				const word = words[i],
					node = nodes[i];
				if (!word || !node) continue;
				const size = (52 * scale * 0.88 ** attempt) / (1 + word.rank * 0.3);
				node.setAttribute("font-size", String(size));
				node.removeAttribute("transform");
				const viewport = node.querySelector("foreignObject");
				viewport?.setAttribute("width", String(size));
				viewport?.setAttribute("height", String(size));
				const measured = word.icon
					? { x: 0, y: 0, width: size, height: size }
					: node.getBBox();
				const angle = [0, rotation, -rotation][i % 3] ?? 0;
				const radians = (angle * Math.PI) / 180;
				const w =
					Math.abs(measured.width * Math.cos(radians)) +
					Math.abs(measured.height * Math.sin(radians)) +
					size * 0.12;
				const h =
					Math.abs(measured.width * Math.sin(radians)) +
					Math.abs(measured.height * Math.cos(radians)) +
					size * 0.12;
				let placed = false;
				for (let step = 0; step < 2400; step++) {
					const radius = 235 * Math.sqrt(step / 2400),
						theta = step * 2.399963229728653;
					const x = radius * Math.cos(theta),
						y = radius * Math.sin(theta);
					if (!fitsCloud(x, y, w, h, shape)) continue;
					if (
						boxes.some(
							(b) =>
								Math.abs(x - b.x) < (w + b.w) / 2 &&
								Math.abs(y - b.y) < (h + b.h) / 2,
						)
					)
						continue;
					boxes.push({ x, y, w, h });
					node.setAttribute(
						"transform",
						`translate(${x} ${y}) rotate(${angle}) translate(${-measured.x - measured.width / 2} ${-measured.y - measured.height / 2})`,
					);
					placed = true;
					break;
				}
				if (!placed) {
					complete = false;
					break;
				}
			}
			if (complete) {
				fitted = true;
				break;
			}
		}
		if (fitted) this.setAttribute("data-cloud-ready", "");
		else {
			svg.remove();
			this.svg = null;
		}
		this.observe();
	}
}
if (!customElements.get("tp-word-cloud"))
	customElements.define("tp-word-cloud", TpWordCloud);
declare global {
	interface HTMLElementTagNameMap {
		"tp-word-cloud": TpWordCloud;
	}
}
