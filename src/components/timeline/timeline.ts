/**
 * @module components/timeline
 * @summary Chronological events arranged around a timeline.
 */
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
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../callout/callout.js";
import "../icon/icon.js";
import style from "./timeline.css?inline";

/** Axis along which events are arranged. */
export type TpTimelineOrientation = "vertical" | "horizontal";

/**
 * Each direct `dl` describes one event using Time, Icon, Title and Content terms.
 * Icon and Content are optional. Author nodes are moved, not serialized or cloned.
 * @summary Arranges chronological events on a vertical or horizontal timeline.
 * @tagname tp-timeline
 * @attr {string} orientation = "vertical" - Timeline orientation (`vertical` or `horizontal`).
 * @accessibility Presents events as an ordered list in author order; decorative markers are hidden from assistive technology.
 * @keyboard {Tab} Focuses the horizontal event list and any interactive event content.
 * @keyboard {ArrowLeft / ArrowRight} Scrolls the focused horizontal event list left or right.
 * @example
 * <tp-timeline>
 *   <dl>
 *     <dt>Time</dt><dd>09:00</dd>
 *     <dt>Icon</dt><dd><tp-icon name="home"></tp-icon></dd>
 *     <dt>Title</dt><dd>Welcome</dd>
 *     <dt>Content</dt><dd>Meet the team and explore the project.</dd>
 *   </dl>
 *   <dl>
 *     <dt>Time</dt><dd>10:00</dd>
 *     <dt>Title</dt><dd>Workshop</dd>
 *     <dt>Content</dt><dd>Build your first component together.</dd>
 *   </dl>
 *   <dl>
 *     <dt>Time</dt><dd>12:00</dd>
 *     <dt>Title</dt><dd>Closing session</dd>
 *   </dl>
 * </tp-timeline>
 */
export class TpTimeline extends TpBase {
	/** Watches for event lists supplied after connection. */
	private readonly observer = new MutationObserver(() => this.renderEntries());

	/** Attributes whose changes affect the layout. */
	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "orientation"];
	}

	/** Returns the axis, falling back to vertical for unknown values. */
	public get orientation(): TpTimelineOrientation {
		return this.getAttribute("orientation") === "horizontal"
			? "horizontal"
			: "vertical";
	}

	/** Changes the timeline axis without recreating event content. */
	public set orientation(value: TpTimelineOrientation) {
		this.setAttribute("orientation", value);
	}

	/** Installs shared styles and converts the author-provided event lists. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-timeline-styles", style);
		this.renderEntries();
		this.addEventListener("keydown", this.handleKeydown);
	}

	/** Stops watching detached content; connection resumes observation. */
	public disconnectedCallback(): void {
		this.observer.disconnect();
		this.removeEventListener("keydown", this.handleKeydown);
	}

	/** Scrolls only the focused horizontal list, leaving nested controls untouched. */
	private readonly handleKeydown = (event: KeyboardEvent): void => {
		const list = this.querySelector<HTMLOListElement>(":scope > ol");
		if (
			!list ||
			event.target !== list ||
			this.orientation !== "horizontal" ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey
		)
			return;
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		event.preventDefault();
		list.scrollLeft +=
			(event.key === "ArrowRight" ? 1 : -1) *
			Math.max(80, list.clientWidth * 0.8);
	};

	/** Reflects layout changes while retaining event nodes and their state. */
	protected attributeChangedCallback(): void {
		this.updateOrientation();
	}

	/** Applies the effective orientation and makes horizontal overflow keyboard-scrollable. */
	private updateOrientation(): void {
		this.dataset.orientation = this.orientation;
		const list = this.querySelector<HTMLOListElement>(":scope > ol");
		if (list) {
			if (this.orientation === "horizontal") list.tabIndex = 0;
			else list.removeAttribute("tabindex");
		}
	}

	/** Consumes complete event lists and retains invalid author content with a diagnostic. */
	private renderEntries(): void {
		this.observer.disconnect();
		for (const error of this.querySelectorAll(":scope > [data-timeline-error]"))
			error.remove();
		const sources = Array.from(this.children).filter(
			(child) => child.localName === "dl",
		);
		let list = this.querySelector<HTMLOListElement>(":scope > ol");
		for (const source of sources) {
			let fields = new Map<string, Node[]>();
			const entries = [fields];
			let key = "";
			for (const child of Array.from(source.children)) {
				if (child.localName === "dt") {
					key = child.textContent?.trim().toLowerCase() ?? "";
					// Native markup may combine consecutive definition lists.
					if (key === "time" && fields.has("time")) {
						fields = new Map<string, Node[]>();
						entries.push(fields);
					}
				} else if (child.localName === "dd") {
					const nodes = fields.get(key) ?? [];
					nodes.push(...Array.from(child.childNodes));
					fields.set(key, nodes);
				}
			}
			if (
				entries.some(
					(entry) =>
						!entry
							.get("time")
							?.some(
								(node) => node.textContent?.trim() || node instanceof Element,
							) ||
						!entry
							.get("title")
							?.some(
								(node) => node.textContent?.trim() || node instanceof Element,
							),
				)
			) {
				const message = document.createElement("tp-callout");
				message.setAttribute("variant", "warning");
				message.setAttribute("data-timeline-error", "");
				message.textContent =
					"Each timeline event requires Time and Title entries.";
				this.append(message);
				continue;
			}
			if (!list) {
				list = document.createElement("ol");
				list.setAttribute("role", "list");
				list.setAttribute("aria-label", "Timeline events");
				this.prepend(list);
			}
			for (const fields of entries) {
				const event = document.createElement("li");
				const time = document.createElement("div");
				time.className = "tp-timeline-time";
				time.append(...(fields.get("time") ?? []));
				const marker = document.createElement("div");
				marker.className = "tp-timeline-marker";
				marker.setAttribute("aria-hidden", "true");
				const icon = document.createElement("span");
				icon.className = "tp-timeline-icon";
				icon.append(...(fields.get("icon") ?? []));
				marker.append(icon);
				const body = document.createElement("div");
				body.className = "tp-timeline-body";
				const title = document.createElement("div");
				title.className = "tp-timeline-title";
				title.append(...(fields.get("title") ?? []));
				body.append(title);
				if (fields.has("content")) {
					const content = document.createElement("div");
					content.className = "tp-timeline-content";
					content.append(...(fields.get("content") ?? []));
					body.append(content);
				}
				event.append(time, marker, body);
				list.append(event);
			}
			source.remove();
		}
		this.updateOrientation();
		this.observer.observe(this, { childList: true });
	}
}

// Register only once when modules are shared by several viewers.
if (!customElements.get("tp-timeline"))
	customElements.define("tp-timeline", TpTimeline);

// Expose the concrete element type to DOM APIs and TypeScript consumers.
declare global {
	interface HTMLElementTagNameMap {
		"tp-timeline": TpTimeline;
	}
}
