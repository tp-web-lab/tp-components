/**
 * @module components/splitter
 * @summary Splitter component with two resizable panels.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./splitter.css?inline";

/**
 * @summary API documentation summary.
 */
type TpSplitterAxis = "horizontal" | "vertical";

/**
 * @summary API documentation summary.
 * @internal
 */
type TpSplitterSide = "start" | "end";

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isAxis(value: string): value is TpSplitterAxis {
	return value === "horizontal" || value === "vertical";
}

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isSide(value: string): value is TpSplitterSide {
	return value === "start" || value === "end";
}

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isPercentage(value: string): boolean {
	return /^\d+(?:\.\d+)?%$/.test(value);
}

/**
 * @summary Parses a percentage string.
 * @param value Percentage string.
 * @returns Numeric percentage value, or null when invalid.
 * @internal
 */
function parsePercentage(value: string): number | null {
	if (!isPercentage(value)) return null;

	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : null;
}

/**
 * @summary Global instance counter for `<tp-splitter>`.
 * @internal
 */
let instanceCount = 0;

/**
 * @summary Splitter layout with two resizable panels.
 * @tagname tp-splitter
 * @attr {string} axis = "horizontal" - Split direction (`horizontal` or `vertical`).
 * @attr {string} position = "50%" - Divider position as a percentage.
 * @attr {string} storage-key = "" - Optional localStorage key used to save and restore the divider position. Empty by default: persistence is disabled. Use a distinct key for each independent splitter.
 * @cssprop [--tp-splitter-position=50%] Divider position.
 * @cssprop [--tp-splitter-divider-color=var(--tp-brand-fill-mid, #2563eb)] Divider handle color.
 * @cssprop [--tp-splitter-divider-size=0.75rem] Divider hit area size.
 * @event tp-splitter-change Emitted when the divider position changes.
 * @eventdetail tp-splitter-change { axis: "horizontal" | "vertical"; position: string; storageKey: string }
 * @accessibility Exposes the divider as an adjustable ARIA separator with its current numeric value.
 * @accessibility Supports equivalent pointer and keyboard resizing.
 * @accessibilityresponsibility Give the surrounding content headings or labels that identify both panels.
 * @keyboard {Arrow keys} Moves the divider by 1%, or by 10% while Shift is held.
 * @keyboard {Home / End} Moves the divider to its minimum or maximum position.
 * @example
 * ```html
 * <tp-splitter position="40%">
 *   <dl>
 *     <dt>start</dt><dd><tp-box>Drag the divider to resize this panel.</tp-box></dd>
 *     <dt>end</dt><dd><tp-box>This panel uses the remaining space.</tp-box></dd>
 *   </dl>
 * </tp-splitter>
 * ```
 */
export class TpSplitter extends TpBase {
	/**
	 * @summary Component global style ID.
	 * @internal
	 */
	private static readonly styleId = "tp-splitter-styles";

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private dlEl: HTMLDListElement | null = null;

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private dividerEl: HTMLDivElement | null = null;

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private initialPosition = "50%";

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private instanceId = "";

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private readonly handlePointerMove = (event: PointerEvent): void => {
		this.updatePositionFromPointer(event);
	};

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private readonly handlePointerUp = (): void => {
		this.endDrag();
		this.savePosition();
		this.dispatchChangeEvent();
	};

	/**
	 * @summary Declares observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["axis", "position", "storage-key"];
	}

	/**
	 * @summary Split direction.
	 * @attr axis
	 * @default horizontal
	 */
	public get axis(): TpSplitterAxis {
		const value = this.getAttribute("axis");
		return value !== null && isAxis(value) ? value : "horizontal";
	}

	/**
	 * @summary Divider position as a percentage.
	 * @param value Parameter.
	 */
	public set axis(value: TpSplitterAxis) {
		this.setAttribute("axis", value);
	}

	/**
	 * @summary Divider position as a percentage.
	 * @attr position
	 * @default 50%
	 */
	public get position(): string {
		const value = this.getAttribute("position") ?? "";
		return isPercentage(value) ? value : "50%";
	}

	/**
	 * @summary Sets the divider position as a percentage.
	 * @param value Parameter.
	 */
	public set position(value: string) {
		if (!isPercentage(value)) {
			throw new TypeError(
				'The "position" attribute must be a percentage string like "50%".',
			);
		}

		this.setAttribute("position", value);
	}

	/**
	 * @summary Optional localStorage key; an empty value disables position persistence.
	 * @attr storage-key
	 * @default ""
	 */
	public get storageKey(): string {
		return this.getAttribute("storage-key") ?? "";
	}

	/**
	 * @summary Sets the local storage key used to persist the divider position.
	 * @param value Parameter.
	 */
	public set storageKey(value: string) {
		if (value === "") {
			this.removeAttribute("storage-key");
			return;
		}

		this.setAttribute("storage-key", value);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureInstanceId();
		this.ensureStructure();
		this.normalizeAxisAttribute();
		this.initialPosition = this.position;
		this.loadPosition();
		this.update();
	}

	/**
	 * @summary API documentation summary.
	 * @param name Parameter.
	 * @internal
	 */
	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) {
			return;
		}

		if (name === "axis" && this.normalizeAxisAttribute()) {
			return;
		}

		if (name === "storage-key") {
			this.loadPosition();
		}

		this.update();
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.endDrag();
	}

	/**
	 * @summary Restores the divider to its initial position.
	 */
	public reset(): void {
		this.position = this.initialPosition;
		this.savePosition();
		this.update();
		this.dispatchChangeEvent();
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpSplitter.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpSplitter.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureInstanceId(): void {
		if (this.instanceId !== "") {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-splitter-${String(instanceCount)}`;
		this.setAttribute("data-tp-splitter-id", this.instanceId);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureStructure(): void {
		const dl = this.querySelector("dl");
		if (!(dl instanceof HTMLDListElement)) {
			return;
		}

		this.dlEl = dl;
		this.dlEl.setAttribute("role", "presentation");

		const entries = Array.from(dl.children);
		let startPanel: HTMLElement | null = null;
		let endPanel: HTMLElement | null = null;
		let startLabel = "";
		let endLabel = "";

		for (let index = 0; index < entries.length; index += 1) {
			const term = entries[index];
			const detail = entries[index + 1];

			if (!(term instanceof HTMLElement) || !(detail instanceof HTMLElement)) {
				continue;
			}

			if (term.tagName !== "DT" || detail.tagName !== "DD") {
				continue;
			}

			const label = term.textContent?.trim().toLowerCase() ?? "";
			if (!isSide(label)) {
				continue;
			}

			if (label === "start" && startPanel === null) {
				startPanel = detail;
				startLabel = term.textContent?.trim() ?? "start";
			}

			if (label === "end" && endPanel === null) {
				endPanel = detail;
				endLabel = term.textContent?.trim() ?? "end";
			}

			term.setAttribute("data-tp-splitter-term", label);
		}

		if (startPanel !== null) {
			startPanel.setAttribute("data-tp-splitter-panel", "start");
			startPanel.setAttribute("data-tp-splitter-label", startLabel);
		}

		if (endPanel !== null) {
			endPanel.setAttribute("data-tp-splitter-panel", "end");
			endPanel.setAttribute("data-tp-splitter-label", endLabel);
		}

		if (this.dividerEl === null) {
			const divider = document.createElement("div");
			divider.setAttribute("data-tp-splitter-divider", "");
			divider.setAttribute("role", "separator");
			divider.setAttribute("aria-label", "Resize panels");
			divider.setAttribute("aria-valuemin", "10");
			divider.setAttribute("aria-valuemax", "90");
			divider.tabIndex = 0;
			divider.addEventListener("pointerdown", (event) => {
				event.preventDefault();
				divider.setPointerCapture?.(event.pointerId);
				this.beginDrag();
			});
			divider.addEventListener("keydown", (event) => {
				this.updatePositionFromKeyboard(event);
			});

			this.dividerEl = divider;
			dl.append(divider);
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private beginDrag(): void {
		this.setAttribute("data-dragging", "true");
		window.addEventListener("pointermove", this.handlePointerMove);
		window.addEventListener("pointerup", this.handlePointerUp);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private endDrag(): void {
		this.removeAttribute("data-dragging");
		window.removeEventListener("pointermove", this.handlePointerMove);
		window.removeEventListener("pointerup", this.handlePointerUp);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private update(): void {
		if (this.dlEl === null) {
			return;
		}

		this.style.setProperty("--tp-splitter-position", this.position);

		if (this.dividerEl !== null) {
			this.dividerEl.setAttribute(
				"aria-orientation",
				this.axis === "horizontal" ? "vertical" : "horizontal",
			);
			const value = parsePercentage(this.position) ?? 50;
			this.dividerEl.setAttribute("aria-valuenow", String(value));
			this.dividerEl.setAttribute("aria-valuetext", `${String(value)}%`);
		}
	}

	/**
	 * @summary Normalizes `axis` to a valid value and reflects default when omitted.
	 * @returns True when normalization changed the attribute.
	 * @internal
	 */
	private normalizeAxisAttribute(): boolean {
		const axis = this.getAttribute("axis");
		if (axis === null || !isAxis(axis)) {
			this.setAttribute("axis", "horizontal");
			return true;
		}

		return false;
	}

	/**
	 * @summary API documentation summary.
	 * @param event Parameter.
	 * @internal
	 */
	private updatePositionFromPointer(event: PointerEvent): void {
		if (this.dlEl === null) {
			return;
		}

		const rect = this.dlEl.getBoundingClientRect();

		if (this.axis === "horizontal") {
			const relativeX = event.clientX - rect.left;
			const percentage = (relativeX / rect.width) * 100;
			this.position = `${String(this.clampPercentage(percentage))}%`;
			return;
		}

		const relativeY = event.clientY - rect.top;
		const percentage = (relativeY / rect.height) * 100;
		this.position = `${String(this.clampPercentage(percentage))}%`;
	}

	/**
	 * @summary Updates the divider position from a keyboard command.
	 * @param event Keyboard event emitted by the divider.
	 * @internal
	 */
	private updatePositionFromKeyboard(event: KeyboardEvent): void {
		const supportedKeys = [
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Home",
			"End",
		];
		if (!supportedKeys.includes(event.key)) {
			return;
		}

		event.preventDefault();
		const current = parsePercentage(this.position) ?? 50;
		const step = event.shiftKey ? 10 : 1;
		let next = current;

		if (event.key === "Home") next = 10;
		else if (event.key === "End") next = 90;
		else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next -= step;
		else next += step;

		this.position = `${String(this.clampPercentage(next))}%`;
		this.savePosition();
		this.dispatchChangeEvent();
	}

	/**
	 * @summary API documentation summary.
	 * @param value Parameter.
	 * @returns Return value.
	 * @internal
	 */
	private clampPercentage(value: number): number {
		return Math.min(90, Math.max(10, Math.round(value * 100) / 100));
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private loadPosition(): void {
		if (this.storageKey === "") {
			return;
		}

		try {
			const saved = localStorage.getItem(this.storageKey);
			const percentage = saved === null ? null : parsePercentage(saved);
			if (percentage !== null) {
				this.position = `${String(this.clampPercentage(percentage))}%`;
			}
		} catch {
			// ignore storage errors
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private savePosition(): void {
		if (this.storageKey === "") {
			return;
		}

		try {
			localStorage.setItem(this.storageKey, this.position);
		} catch {
			// ignore storage errors
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private dispatchChangeEvent(): void {
		this.dispatchEvent(
			new CustomEvent("tp-splitter-change", {
				bubbles: true,
				detail: {
					axis: this.axis,
					position: this.position,
					storageKey: this.storageKey,
				},
			}),
		);
	}
}

/**
 * @summary Registers the custom element `tp-splitter`.
 * @internal
 */
if (!customElements.get("tp-splitter")) {
	customElements.define("tp-splitter", TpSplitter);
}

/**
 * @summary API documentation summary.
 * @internal
 */
declare global {
	interface HTMLElementTagNameMap {
		"tp-splitter": TpSplitter;
	}
}
