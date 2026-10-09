/**
 * @module components/color
 * @summary Brand color preset controller scoped to the containing element.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./color.css?inline";

import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import type { TpDropdown } from "../dropdown/dropdown.js";

/**
 * Built-in color presets exposed by the component.
 *
 * @summary Lists the available color preset class names.
 * @internal
 */
const TP_COLOR_PRESETS = [
	"tp-default",
	"tp-red",
	"tp-orange",
	"tp-amber",
	"tp-yellow",
	"tp-lime",
	"tp-green",
	"tp-emerald",
	"tp-teal",
	"tp-glaz",
	"tp-cyan",
	"tp-sky",
	"tp-blue",
	"tp-indigo",
	"tp-violet",
	"tp-purple",
	"tp-fuchsia",
	"tp-pink",
	"tp-rose",
	"tp-zinc",
	"tp-ivory",
	"tp-stone",
] as const;

type TpColorPreset = (typeof TP_COLOR_PRESETS)[number];

/**
 * Maps each preset to the swatch color used by the UI.
 *
 * @summary Associates presets with preview colors.
 * @internal
 */
const TP_COLOR_SWATCH: Record<TpColorPreset, string> = {
	"tp-default": "#88B1A1" /* tp-glaz */,
	"tp-red": "#ef5655",
	"tp-orange": "#f08039",
	"tp-amber": "#e89a26",
	"tp-yellow": "#dcb31e",
	"tp-lime": "#9abb28",
	"tp-green": "#5dbb55",
	"tp-emerald": "#47b873",
	"tp-teal": "#37b995",
	"tp-glaz": "#88B1A1",
	"tp-cyan": "#20b8bc",
	"tp-sky": "#1caedd",
	"tp-blue": "#4a97f4",
	"tp-indigo": "#6e85f8",
	"tp-violet": "#927cfb",
	"tp-purple": "#ae75f6",
	"tp-fuchsia": "#d26ae8",
	"tp-pink": "#e468b0",
	"tp-rose": "#ee6383",
	"tp-zinc": "#8b8c93",
	"tp-ivory": "#fffff0",
	"tp-stone": "#918c87",
};

/**
 * Checks whether a string is a valid color preset.
 *
 * @summary Validates a color preset string.
 * @param value Value to test.
 * @returns `true` when the value is a valid preset.
 */
function isTpColorPreset(value: string): value is TpColorPreset {
	return TP_COLOR_PRESETS.includes(value as TpColorPreset);
}

/**
 * Converts a preset class name into a readable label.
 *
 * @summary Converts a preset to display text.
 * @param preset Preset to format.
 * @returns Human-readable label.
 */
function toPresetLabel(preset: TpColorPreset): string {
	return preset.replace("tp-", "").replace("-", " ");
}

interface ColorTargetState {
	controllers: Set<TpColor>;
	initialPresetClasses: Set<TpColorPreset>;
}

const colorTargetStates = new WeakMap<HTMLElement, ColorTargetState>();

/**
 * Returns the synchronization state associated with a controlled color target.
 *
 * @summary Returns or creates color synchronization state.
 * @param target Controlled target element.
 * @returns State record associated with the target.
 * @internal
 */
function getColorTargetState(target: HTMLElement): ColorTargetState {
	let state = colorTargetStates.get(target);
	if (state === undefined) {
		state = {
			controllers: new Set<TpColor>(),
			initialPresetClasses: new Set(
				TP_COLOR_PRESETS.filter((preset) => target.classList.contains(preset)),
			),
		};
		colorTargetStates.set(target, state);
	}

	return state;
}

/**
 * Registers a color controller on a shared target element.
 *
 * @summary Registers a controller for a target element.
 * @param target Controlled target element.
 * @param controller Controller instance to register.
 * @returns The synchronization state for the target.
 * @internal
 */
function registerColorTarget(
	target: HTMLElement,
	controller: TpColor,
): ColorTargetState {
	const state = getColorTargetState(target);
	state.controllers.add(controller);
	return state;
}

/**
 * Unregisters a color controller and restores original preset classes when needed.
 *
 * @summary Unregisters a controller from a target element.
 * @param target Controlled target element.
 * @param controller Controller instance to unregister.
 * @internal
 */
function unregisterColorTarget(target: HTMLElement, controller: TpColor): void {
	const state = colorTargetStates.get(target);
	if (state === undefined) {
		return;
	}

	state.controllers.delete(controller);
	if (state.controllers.size > 0) {
		return;
	}

	target.classList.remove(...TP_COLOR_PRESETS);
	for (const preset of state.initialPresetClasses) {
		target.classList.add(preset);
	}

	colorTargetStates.delete(target);
}

/**
 * Propagates a preset change to sibling controllers on the same target.
 *
 * @summary Synchronizes sibling color controllers.
 * @param target Controlled target element.
 * @param source Controller that initiated the change.
 * @internal
 */
function syncColorTargets(target: HTMLElement, source: TpColor): void {
	const state = colorTargetStates.get(target);
	if (state === undefined) {
		return;
	}

	for (const controller of state.controllers) {
		if (controller === source) {
			continue;
		}

		if (controller.preset !== source.preset) {
			controller.syncToPreset(source.preset);
		}
	}
}

/**
 * `<tp-color>` lets users pick one of the built-in brand presets from `tp.css`
 * and applies it to the containing element.
 *
 * @summary Preset-based color controller.
 * @tagname tp-color
 * @attr {string} preset = "tp-default" - Preset class name (e.g. `tp-default`, `tp-red`)
 * @attr {string} anchor = "" - CSS selector used as the explicit element that receives the selected preset.
 * @attr {string} ui-anchor = "" - CSS selector used only to anchor the dropdown UI.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the color trigger.
 *
 * @event tp-color-change Emitted when the selected brand preset is applied to a target.
 * @eventdetail tp-color-change { preset: string; brand: string; anchor: string; target: HTMLElement }
 * @example
 * <section>
 * <tp-color></tp-color>
 * <p>The selected brand color is scoped to this section.</p>
 * <p><code>Inline code</code> is displayed in the brand colour.</p>
 * </section>
 */
export class TpColor extends TpBase {
	private static readonly styleId = "tp-color-styles";
	private static readonly changeEventName = "tp-color-change";

	/**
	 * Exposes the ordered list of built-in color presets.
	 *
	 * @summary Returns the available color presets.
	 */
	public static readonly presets = TP_COLOR_PRESETS;

	/**
	 * Returns the list of attributes observed by the component.
	 *
	 * @summary Returns the observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["preset", "anchor", "ui-anchor", "variant", "size", "disabled"];
	}

	private targetElement: HTMLElement | null = null;
	private triggerEl: HTMLElement | null = null;
	private dropdownEl: TpDropdown | null = null;
	private isSyncing = false;
	private hasAppliedPreset = false;

	/**
	 * Returns the selected preset class name.
	 *
	 * @summary Returns the configured preset.
	 */
	public get preset(): TpColorPreset {
		const value = this.getStringAttribute("preset", "tp-default");
		return isTpColorPreset(value) ? value : "tp-default";
	}

	/**
	 * Updates the selected preset class name.
	 *
	 * @summary Sets the configured preset.
	 * @param value Preset value to apply.
	 */
	public set preset(value: TpColorPreset) {
		this.setStringAttribute("preset", value);
	}

	public get anchor(): string {
		return this.getAttribute("anchor") ?? "";
	}

	public set anchor(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("anchor");
			return;
		}

		this.setAttribute("anchor", value);
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

	/**
	 * Initializes the color controller when connected.
	 *
	 * @summary Connects the color controller.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpColor.styleId, style);
		this.ensureControl();
		this.updateControl();
		this.applyPreset();
	}

	/**
	 * Reacts to observed attribute changes.
	 *
	 * @summary Handles observed attribute changes.
	 * @param name Updated attribute name.
	 * @param oldValue Previous attribute value.
	 * @param newValue New attribute value.
	 */
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (this.isSyncing) {
			return;
		}

		if (
			![
				"preset",
				"anchor",
				"ui-anchor",
				"variant",
				"size",
				"disabled",
			].includes(name) ||
			oldValue === newValue
		) {
			return;
		}

		this.updateControl();
		if (name === "preset" || name === "anchor") {
			this.applyPreset();
		}
	}

	/**
	 * Restores the original preset classes when the controller is disconnected.
	 *
	 * @summary Disconnects the color controller.
	 */
	protected disconnectedCallback(): void {
		if (this.targetElement instanceof HTMLElement) {
			unregisterColorTarget(this.targetElement, this);
			this.targetElement = null;
		}
	}

	/**
	 * Creates and caches the embedded preset picker UI.
	 *
	 * @summary Ensures the internal color UI exists.
	 */
	private ensureControl(): void {
		let trigger = this.queryElement<HTMLElement>(":scope > tp-icon-button");
		if (!(trigger instanceof HTMLElement)) {
			trigger = document.createElement("tp-icon-button");
			trigger.id = `${this.getControlId()}-trigger`;
			this.prepend(trigger);
		}

		trigger.setAttribute("name", "palette-swatch");
		trigger.setAttribute("variant", this.variant);
		trigger.setAttribute("size", this.size);
		trigger.toggleAttribute("disabled", this.disabled);
		trigger.removeEventListener("click", this.onTriggerClick);
		trigger.addEventListener("click", this.onTriggerClick);
		this.triggerEl = trigger;

		let dropdown = this.queryElement<TpDropdown>(":scope > tp-dropdown");
		if (!(dropdown instanceof HTMLElement)) {
			dropdown = document.createElement("tp-dropdown") as unknown as TpDropdown;
			this.append(dropdown);
		}

		dropdown.setAttribute("anchor", this.getDropdownAnchor(trigger.id));
		dropdown.setAttribute("placement", "bottom");
		dropdown.setAttribute("outside-click", "");

		const ul = dropdown.querySelector("ul");
		if (
			!ul ||
			ul.querySelectorAll(".tp-color-option").length !==
				TP_COLOR_PRESETS.length ||
			ul.querySelector("tp-divider") === null
		) {
			const newUl = document.createElement("ul");

			for (const preset of TP_COLOR_PRESETS) {
				const li = document.createElement("li");
				li.className = "tp-color-option";
				li.setAttribute("data-preset", preset);

				const check = document.createElement("tp-icon");
				check.setAttribute("name", "check");

				const swatch = document.createElement("tp-icon");
				swatch.className = "tp-color-swatch";
				swatch.setAttribute("name", "square-rounded");
				swatch.setAttribute("size", "1.5em");
				swatch.setAttribute("color", TP_COLOR_SWATCH[preset]);

				const text = document.createElement("span");
				text.textContent = toPresetLabel(preset);

				li.append(check, swatch, text);
				li.addEventListener("click", () => {
					this.preset = preset;
					dropdown.open = false;
				});

				newUl.append(li);

				if (preset === "tp-default") {
					const separator = document.createElement("li");
					separator.className = "tp-color-separator";
					separator.setAttribute("role", "none");
					separator.setAttribute("aria-hidden", "true");
					const divider = document.createElement("tp-divider");
					separator.append(divider);
					newUl.append(separator);
				}
			}

			if (ul) {
				ul.replaceWith(newUl);
			} else {
				dropdown.append(newUl);
			}
		}

		this.dropdownEl = dropdown;
	}

	/**
	 * Returns a stable identifier for the trigger element.
	 *
	 * @summary Ensures a stable trigger identifier.
	 * @returns Existing or generated controller identifier.
	 */
	private getControlId(): string {
		if (this.id.trim() !== "") {
			return this.id.trim();
		}

		this.id = `tp-color-${Math.random().toString(36).slice(2, 9)}`;
		return this.id;
	}

	/**
	 * Resolves the dropdown anchor reference.
	 *
	 * @summary Returns the dropdown anchor selector.
	 * @param controlId Trigger identifier used as the default anchor.
	 * @returns Dropdown anchor selector.
	 */
	private getDropdownAnchor(controlId: string): string {
		const uiAnchor = this.getAttribute("ui-anchor")?.trim() ?? "";
		if (uiAnchor !== "") {
			return uiAnchor;
		}

		return `#${controlId}`;
	}

	/**
	 * Synchronizes this controller to a preset received from a sibling controller.
	 *
	 * @summary Synchronizes the preset from another controller.
	 * @param preset Preset to apply.
	 */
	public syncToPreset(preset: TpColorPreset): void {
		if (this.preset === preset) {
			return;
		}

		this.isSyncing = true;
		this.preset = preset;
		this.isSyncing = false;
		this.updateControl();
		this.applyPreset();
	}

	/**
	 * Toggles the color dropdown when the trigger is clicked.
	 *
	 * @summary Handles trigger clicks.
	 */
	private readonly onTriggerClick = (): void => {
		if (this.disabled) {
			return;
		}

		if (this.dropdownEl instanceof HTMLElement) {
			this.dropdownEl.open = !this.dropdownEl.open;
		}
	};

	/**
	 * Refreshes trigger state and dropdown selection.
	 *
	 * @summary Updates the color control UI.
	 */
	private updateControl(): void {
		this.ensureControl();
		const preset = this.preset;

		if (this.triggerEl instanceof HTMLElement) {
			this.triggerEl.setAttribute(
				"label",
				`Brand preset: ${toPresetLabel(preset)}. Click to choose another color.`,
			);
			this.triggerEl.style.setProperty("color", TP_COLOR_SWATCH[preset]);
		}

		if (this.dropdownEl instanceof HTMLElement) {
			const options =
				this.dropdownEl.querySelectorAll<HTMLElement>(".tp-color-option");
			for (const option of options) {
				const isSelected = option.getAttribute("data-preset") === preset;
				if (isSelected) {
					option.setAttribute("data-selected", "");
				} else {
					option.removeAttribute("data-selected");
				}
			}
		}
	}

	/**
	 * Applies the current preset to the resolved target element.
	 *
	 * @summary Applies the selected preset to the target.
	 */
	private applyPreset(): void {
		const preset = this.preset;
		if (this.getAttribute("preset") !== preset) {
			this.setAttribute("preset", preset);
			return;
		}

		const target = this.resolveColorTarget();

		if (!(target instanceof HTMLElement)) {
			if (this.targetElement instanceof HTMLElement) {
				unregisterColorTarget(this.targetElement, this);
				this.targetElement = null;
			}
			this.hasAppliedPreset = true;
			return;
		}

		const isNewTarget = this.targetElement !== target;

		if (isNewTarget) {
			if (this.targetElement instanceof HTMLElement) {
				unregisterColorTarget(this.targetElement, this);
			}
			this.targetElement = target;
			registerColorTarget(target, this);
		}

		// On first connection to a target:
		// - If sibling controllers already manage this target, sync to their preset.
		// - If this is the first controller and the target already carries a static
		//   preset class (e.g. `<div class="tp-yellow">`), adopt it instead of
		//   overriding with the default.
		if (isNewTarget) {
			const state = getColorTargetState(target);
			if (state.controllers.size > 1) {
				// Adopt the preset already applied by a sibling controller.
				for (const sibling of state.controllers) {
					if (sibling !== this) {
						this.syncToPreset(sibling.preset);
						return;
					}
				}
			} else if (state.initialPresetClasses.size > 0) {
				const [initialPreset] = state.initialPresetClasses;
				if (
					initialPreset !== undefined &&
					isTpColorPreset(initialPreset) &&
					initialPreset !== preset
				) {
					this.isSyncing = true;
					this.setAttribute("preset", initialPreset);
					this.isSyncing = false;
					this.updateControl();
					return;
				}
			}
		}

		target.classList.remove(...TP_COLOR_PRESETS);
		target.classList.add(preset);
		this.emitChange(target);
		this.hasAppliedPreset = true;
		syncColorTargets(target, this);
	}

	private emitChange(target: HTMLElement): void {
		if (!this.hasAppliedPreset) {
			return;
		}

		const preset = this.preset;
		this.dispatchEvent(
			new CustomEvent(TpColor.changeEventName, {
				bubbles: true,
				composed: true,
				detail: {
					preset,
					brand: preset,
					anchor: this.anchor,
					target,
				},
			}),
		);
	}

	/**
	 * Resolves the element controlled by the current instance.
	 *
	 * Skips container elements (toolbar, menu, dropdown, button-group, contextmenu)
	 * to find the actual target. Checks for explicit scope markers first.
	 *
	 * @summary Returns the current color target.
	 * @returns Controlled target element, or `null`.
	 */
	private resolveColorTarget(): HTMLElement | null {
		const anchoredTarget = this.resolveAnchoredColorTarget();
		if (anchoredTarget instanceof HTMLElement) {
			return anchoredTarget;
		}

		const colorScope = this.getClosestSkippingContainers(
			"[data-tp-color-scope]",
		);
		if (colorScope instanceof HTMLElement) {
			return colorScope;
		}

		const effectiveParent = this.getEffectiveParent();
		if (!(effectiveParent instanceof HTMLElement)) {
			return null;
		}

		return effectiveParent;
	}

	/**
	 * Resolves an explicit color target from the `anchor` attribute.
	 *
	 * The selector points directly to the element that receives the selected
	 * preset. Use `ui-anchor` when only the dropdown placement must be moved.
	 *
	 * @summary Returns the anchored color scope target, when present.
	 * @returns Anchored scope element, or `null`.
	 */
	private resolveAnchoredColorTarget(): HTMLElement | null {
		const anchor = this.getAttribute("anchor")?.trim() ?? "";
		if (anchor === "") {
			return null;
		}

		const target = this.ownerDocument.querySelector(anchor);
		if (!(target instanceof HTMLElement)) {
			return null;
		}

		return target;
	}

	/**
	 * Skips over container elements that should not be considered as scoping targets.
	 *
	 * Containers like toolbars, menus, and dropdowns are transparent to scope resolution,
	 * so this method traverses upward until it finds a non-container parent.
	 *
	 * @summary Returns the first non-container parent.
	 * @returns Parent element, skipping containers, or `null` if none exist.
	 */
	private getEffectiveParent(): HTMLElement | null {
		const containerTags = new Set([
			"TP-TOOLBAR",
			"TP-MENU",
			"TP-DROPDOWN",
			"TP-BUTTON-GROUP",
			"TP-CONTEXTMENU",
		]);
		let current: HTMLElement | null = this.parentElement;

		while (current instanceof HTMLElement) {
			const tagName = current.tagName.toUpperCase();

			// Skip both container tags AND their internal divs
			if (containerTags.has(tagName)) {
				current = current.parentElement;
				continue;
			}

			// Also skip internal container divs
			if (
				current.parentElement &&
				containerTags.has(current.parentElement.tagName.toUpperCase())
			) {
				current = current.parentElement.parentElement;
				continue;
			}

			return current;
		}

		return null;
	}
}

if (!customElements.get("tp-color")) {
	customElements.define("tp-color", TpColor);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-color": TpColor;
	}
}
