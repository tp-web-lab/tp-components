/**
 * @module components/toolbar
 * @summary Sticky toolbar with start / center / end sections,
 *          horizontal or vertical orientation, and configurable placement.
 *          Sticks to the edge of its containing element (not the viewport).
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./toolbar.css?inline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Reading-axis orientation of the toolbar. */
export type TpToolbarOrientation = "horizontal" | "vertical";

/** Container edge to which the toolbar sticks within its containing element. */
export type TpToolbarPlacement = "top" | "bottom" | "start" | "end";

/**
 * Checks whether a string is a valid toolbar orientation.
 *
 * @summary Validates a toolbar orientation string.
 * @param value Value to test.
 * @returns `true` when the value is a valid orientation.
 */
function isTpToolbarOrientation(value: string): value is TpToolbarOrientation {
	return value === "horizontal" || value === "vertical";
}

/**
 * Checks whether a string is a valid toolbar placement.
 *
 * @summary Validates a toolbar placement string.
 * @param value Value to test.
 * @returns `true` when the value is a valid placement.
 */
function isTpToolbarPlacement(value: string): value is TpToolbarPlacement {
	return (
		value === "top" ||
		value === "bottom" ||
		value === "start" ||
		value === "end"
	);
}

// ---------------------------------------------------------------------------
// TpToolbar element
// ---------------------------------------------------------------------------

/**
 * `<tp-toolbar>` renders a sticky toolbar with three zones: `start`, `center`, and `end`.
 *
 * Children are distributed into zones via their `section` attribute
 * (`section="start"` | `section="center"` | `section="end"`; default: `"start"`).
 * This is light DOM — no Shadow DOM slots are used.
 *
 * The toolbar sticks to the edge of its nearest scrolling container, not the viewport.
 * Set `position: relative` (or `overflow: auto`) on the parent to define the sticky boundary.
 *
 * The toolbar supports any `tp-*` component as a child, including:
 * `tp-button`, `tp-button-group`, `tp-icon-button`, `tp-dropdown`,
 * `tp-alarm`, `tp-chronometer`, `tp-clock`, `tp-color`, `tp-dir`,
 * `tp-icon`, `tp-theme`, `tp-timer`.
 *
 * @summary Sticky, zoned toolbar for tp-* components.
 * @tagname tp-toolbar
 * @attr {string} orientation = "horizontal" - `horizontal` (default) or `vertical`.
 * @attr {string} placement = "top (horizontal) / start (vertical)" - `top` (default for horizontal) | `bottom` | `start` | `end`.
 *
 * @example
 * <tp-box padding="0">
 *   <tp-toolbar>
 *     <tp-icon section="start" name="home" aria-label="Home"></tp-icon>
 *     <tp-icon section="start" name="menu" aria-label="Menu"></tp-icon>
 *     <span section="center">Document</span>
 *     <tp-icon section="end" name="github" aria-label="GitHub"></tp-icon>
 *     <tp-icon section="end" name="settings" aria-label="Settings"></tp-icon>
 *     <tp-icon section="end" name="help" aria-label="Help"></tp-icon>
 *   </tp-toolbar>
 *   <tp-box border-width="0" style="min-block-size: 5rem; display: grid; place-items: center">Document area</tp-box>
 * </tp-box>
 */
export class TpToolbar extends TpBase {
	/** Identifier used for the injected component stylesheet. */
	private static readonly styleId = "tp-toolbar-styles";

	/** MutationObserver that distributes children added after connect. */
	private childObserver: MutationObserver | null = null;

	/** Container for `section="start"` children. */
	private startSection: HTMLElement | null = null;

	/** Container for `section="center"` children. */
	private centerSection: HTMLElement | null = null;

	/** Container for `section="end"` children. */
	private endSection: HTMLElement | null = null;

	// -------------------------------------------------------------------------
	// Observed attributes
	// -------------------------------------------------------------------------

	/**
	 * Returns the list of attributes observed by the component.
	 *
	 * @summary Returns the observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["orientation", "placement"];
	}

	// -------------------------------------------------------------------------
	// Public properties
	// -------------------------------------------------------------------------

	/**
	 * Returns the toolbar orientation.
	 *
	 * @summary Returns the configured orientation.
	 */
	public get orientation(): TpToolbarOrientation {
		const value = this.getAttribute("orientation") ?? "horizontal";
		return isTpToolbarOrientation(value) ? value : "horizontal";
	}

	/**
	 * Updates the toolbar orientation.
	 *
	 * @summary Sets the configured orientation.
	 * @param value Orientation to apply.
	 */
	public set orientation(value: TpToolbarOrientation) {
		this.setAttribute("orientation", value);
	}

	/**
	 * Returns the toolbar placement.
	 *
	 * Defaults to `top` for horizontal toolbars and `start` for vertical ones.
	 *
	 * @summary Returns the configured placement.
	 */
	public get placement(): TpToolbarPlacement {
		const value = this.getAttribute("placement");
		if (value !== null && isTpToolbarPlacement(value)) {
			return value;
		}

		return this.orientation === "vertical" ? "start" : "top";
	}

	/**
	 * Updates the toolbar placement.
	 *
	 * @summary Sets the configured placement.
	 * @param value Placement to apply.
	 */
	public set placement(value: TpToolbarPlacement) {
		this.setAttribute("placement", value);
	}

	// -------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------

	/**
	 * Builds the section layout, distributes children, and starts observing.
	 *
	 * @summary Connects the toolbar component.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpToolbar.styleId, style);
		this.buildSections();
		this.distributeExistingChildren();
		this.updateDataAttributes();
		this.startObserving();
	}

	/**
	 * Reacts to changes on observed attributes.
	 *
	 * @summary Handles observed attribute changes.
	 * @param name Updated attribute name.
	 * @param oldValue Previous value.
	 * @param newValue New value.
	 */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) {
			return;
		}

		if (name === "orientation" || name === "placement") {
			this.updateDataAttributes();
		}
	}

	/**
	 * Stops observing child mutations.
	 *
	 * @summary Disconnects the toolbar component.
	 */
	public disconnectedCallback(): void {
		this.childObserver?.disconnect();
		this.childObserver = null;
	}

	public addButtonToSection(button: HTMLElement, section: string): void {
		if (!this.startSection || !this.centerSection || !this.endSection) {
			throw new Error("Toolbar sections are not initialized.");
		}

		switch (section) {
			case "start":
				this.startSection.appendChild(button);
				break;
			case "center":
				this.centerSection.appendChild(button);
				break;
			case "end":
				this.endSection.appendChild(button);
				break;
			default:
				throw new Error(`Invalid section: ${section}`);
		}
	}
	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Creates and caches the three section containers when they do not exist yet.
	 *
	 * @summary Ensures the section containers exist.
	 */
	private buildSections(): void {
		let start = this.querySelector<HTMLElement>("[data-toolbar-start]");
		let center = this.querySelector<HTMLElement>("[data-toolbar-center]");
		let end = this.querySelector<HTMLElement>("[data-toolbar-end]");

		if (start === null) {
			start = document.createElement("div");
			start.setAttribute("data-toolbar-start", "");
			center = document.createElement("div");
			center.setAttribute("data-toolbar-center", "");
			end = document.createElement("div");
			end.setAttribute("data-toolbar-end", "");
			this.append(start, center, end);
		}

		this.startSection = start;
		this.centerSection = center;
		this.endSection = end;
	}

	/**
	 * Moves children that were already present at connect time into their target section.
	 *
	 * @summary Distributes pre-existing children into sections.
	 */
	private distributeExistingChildren(): void {
		const children = Array.from(this.children).filter(
			(el) =>
				!el.hasAttribute("data-toolbar-start") &&
				!el.hasAttribute("data-toolbar-center") &&
				!el.hasAttribute("data-toolbar-end"),
		);

		for (const child of children) {
			this.assignToSection(child as HTMLElement);
		}
	}

	/**
	 * Moves a single child element into the section indicated by its `section` attribute.
	 *
	 * @summary Assigns one child to its target section.
	 * @param child Child element to place.
	 */
	private assignToSection(child: HTMLElement): void {
		// Markup parsers wrap adjacent inline controls in an unassigned paragraph.
		// Unwrap only pure sectioned groups; preserve prose and author-owned wrappers.
		if (
			child.localName === "p" &&
			child.attributes.length === 0 &&
			child.children.length > 0 &&
			Array.from(child.childNodes).every((node) =>
				node instanceof HTMLElement
					? node.hasAttribute("section")
					: node.nodeType === Node.TEXT_NODE && !node.textContent?.trim(),
			)
		) {
			for (const item of Array.from(child.children)) {
				if (item instanceof HTMLElement) this.assignToSection(item);
			}
			child.remove();
			return;
		}
		const section = child.getAttribute("section") ?? "start";
		const target =
			section === "center"
				? this.centerSection
				: section === "end"
					? this.endSection
					: this.startSection;

		target?.append(child);
	}

	/**
	 * Updates `data-orientation` and `data-placement` host attributes
	 * so CSS can target the current state.
	 *
	 * @summary Refreshes data attributes for CSS.
	 */
	private updateDataAttributes(): void {
		this.setAttribute("data-orientation", this.orientation);
		this.setAttribute("data-placement", this.placement);
	}

	/**
	 * Installs a MutationObserver to distribute children added after the initial connect.
	 *
	 * @summary Starts observing direct child mutations.
	 */
	private startObserving(): void {
		this.childObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (!(node instanceof HTMLElement)) {
						continue;
					}

					if (
						node.hasAttribute("data-toolbar-start") ||
						node.hasAttribute("data-toolbar-center") ||
						node.hasAttribute("data-toolbar-end")
					) {
						continue;
					}

					this.assignToSection(node);
				}
			}
		});

		this.childObserver.observe(this, { childList: true });
	}
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

if (!customElements.get("tp-toolbar")) {
	customElements.define("tp-toolbar", TpToolbar);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-toolbar": TpToolbar;
	}
}
