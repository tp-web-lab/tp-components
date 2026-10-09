/**
 * @module components/theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
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

import style from "./theme.css?inline";

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

type TpThemeMode = "light" | "dark" | "auto";

/**
 * Checks whether a string is a valid theme mode.
 *
 * @summary Validates a theme mode string.
 * @param value Value to test.
 * @returns `true` when the value is a valid theme mode.
 */
function isTpThemeMode(value: string): value is TpThemeMode {
	return value === "light" || value === "dark" || value === "auto";
}

interface ThemeTargetState {
	controllers: Set<TpTheme>;
	initialHasLight: boolean;
	initialHasDark: boolean;
	inheritedBrandProperties: Set<string>;
}

const themeTargetStates = new WeakMap<HTMLElement, ThemeTargetState>();
const TP_COLOR_PRESET_CLASSES = [
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
const INHERITED_BRAND_PROPERTIES = ["--tp-brand-seed"] as const;

/**
 * Returns the synchronization state associated with a controlled theme target.
 *
 * @summary Returns or creates theme synchronization state.
 * @param target Controlled target element.
 * @returns State record associated with the target.
 * @internal
 */
function getThemeTargetState(target: HTMLElement): ThemeTargetState {
	let state = themeTargetStates.get(target);
	if (state === undefined) {
		state = {
			controllers: new Set<TpTheme>(),
			initialHasLight: target.classList.contains("tp-light"),
			initialHasDark: target.classList.contains("tp-dark"),
			inheritedBrandProperties: new Set<string>(),
		};
		themeTargetStates.set(target, state);
	}

	return state;
}

/**
 * Registers a theme controller on a shared target element.
 *
 * @summary Registers a controller for a target element.
 * @param target Controlled target element.
 * @param controller Controller instance to register.
 * @returns The synchronization state for the target.
 * @internal
 */
function registerThemeTarget(
	target: HTMLElement,
	controller: TpTheme,
): ThemeTargetState {
	const state = getThemeTargetState(target);
	state.controllers.add(controller);
	return state;
}

/**
 * Unregisters a theme controller and restores original classes when needed.
 *
 * @summary Unregisters a controller from a target element.
 * @param target Controlled target element.
 * @param controller Controller instance to unregister.
 * @internal
 */
function unregisterThemeTarget(target: HTMLElement, controller: TpTheme): void {
	const state = themeTargetStates.get(target);
	if (state === undefined) {
		return;
	}

	state.controllers.delete(controller);
	if (state.controllers.size > 0) {
		return;
	}

	target.classList.toggle("tp-light", state.initialHasLight);
	target.classList.toggle("tp-dark", state.initialHasDark);
	removeInheritedBrandProperties(target, state);
	themeTargetStates.delete(target);
}

/**
 * Checks whether a target owns its brand color scope.
 *
 * @summary Detects explicit color scoping.
 * @param target Controlled target element.
 * @returns `true` when the target has a local brand color scope.
 * @internal
 */
function hasExplicitBrandScope(target: HTMLElement): boolean {
	return (
		target.hasAttribute("data-tp-color-scope") ||
		TP_COLOR_PRESET_CLASSES.some((preset) => target.classList.contains(preset))
	);
}

/**
 * Keeps local theme scopes from resetting the inherited brand color.
 *
 * @summary Preserves inherited brand color on theme-only targets.
 * @param target Controlled target element.
 * @param state Synchronization state for the target.
 * @internal
 */
function syncInheritedBrandProperties(
	target: HTMLElement,
	state: ThemeTargetState,
): void {
	if (hasExplicitBrandScope(target)) {
		removeInheritedBrandProperties(target, state);
		return;
	}

	for (const property of INHERITED_BRAND_PROPERTIES) {
		const currentValue = target.style.getPropertyValue(property);
		if (currentValue !== "" && !state.inheritedBrandProperties.has(property)) {
			continue;
		}

		target.style.setProperty(property, "inherit");
		state.inheritedBrandProperties.add(property);
	}
}

/**
 * Removes brand properties that were injected by `tp-theme`.
 *
 * @summary Cleans up inherited brand properties.
 * @param target Controlled target element.
 * @param state Synchronization state for the target.
 * @internal
 */
function removeInheritedBrandProperties(
	target: HTMLElement,
	state: ThemeTargetState,
): void {
	for (const property of state.inheritedBrandProperties) {
		target.style.removeProperty(property);
	}

	state.inheritedBrandProperties.clear();
}

/**
 * Propagates a theme mode change to sibling controllers on the same target.
 *
 * @summary Synchronizes sibling theme controllers.
 * @param target Controlled target element.
 * @param source Controller that initiated the change.
 * @internal
 */
function syncThemeTargets(target: HTMLElement, source: TpTheme): void {
	const state = themeTargetStates.get(target);
	if (state === undefined) {
		return;
	}

	for (const controller of state.controllers) {
		if (controller === source) {
			continue;
		}

		if (controller.mode !== source.mode) {
			controller.syncToMode(source.mode);
		}
	}
}

/**
 * `<tp-theme>` controls the visual theme of its parent element.
 *
 * It applies either `.tp-light` or `.tp-dark` on the parent that contains
 * `<tp-theme>`. In `auto` mode, it follows the system color scheme.
 *
 * This makes it possible to set:
 * - a global theme when `<tp-theme>` is a direct child of `<body>`
 * - a local override by placing another `<tp-theme>` inside a nested container
 *
 * @summary Parent-scoped theme switcher.
 * @tagname tp-theme
 * @attr {string} mode = "auto" - Theme mode (`light`, `dark`, `auto`)
 * @attr {string} anchor = "" - CSS selector used as the explicit element that receives the selected theme.
 * @attr {string} ui-anchor = "" - CSS selector used only to anchor the dropdown UI.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the theme trigger.
 *
 * @event tp-theme-change Emitted when the effective theme applied to a target changes.
 * @eventdetail tp-theme-change { mode: "light" | "dark" | "auto"; theme: "light" | "dark"; anchor: string; target: HTMLElement }
 * @example
 * <tp-theme></tp-theme>
 */
export class TpTheme extends TpBase {
	private static readonly styleId = "tp-theme-styles";
	private static readonly refreshEventName = "tp-theme-refresh";
	private static readonly changeEventName = "tp-theme-change";
	private static nextControlId = 0;

	/**
	 * Returns the list of attributes observed by the component.
	 *
	 * @summary Returns the observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["mode", "anchor", "ui-anchor", "variant", "size", "disabled"];
	}

	private targetElement: HTMLElement | null = null;
	private controlEl: HTMLElement | null = null;
	private dropdownEl: TpDropdown | null = null;
	private mediaQueryList: MediaQueryList | null = null;
	private isSyncing = false;
	private hasAppliedTheme = false;
	private readonly onMediaQueryChange = (): void => {
		if (this.mode !== "auto") {
			return;
		}

		this.applyTheme({ emitRefresh: true });
	};
	private readonly onThemeRefresh = (event: Event): void => {
		const customEvent = event as CustomEvent<{
			source: TpTheme;
			scope: HTMLElement | null;
		}>;
		const source = customEvent.detail?.source;
		const scope = customEvent.detail?.scope;

		if (
			!(source instanceof TpTheme) ||
			source === this ||
			!(scope instanceof HTMLElement)
		) {
			return;
		}

		if (!scope.contains(this)) {
			return;
		}

		if (this.targetElement === scope) {
			return;
		}

		this.applyTheme({ emitRefresh: false });
	};

	/**
	 * Returns the selected theme mode.
	 *
	 * @summary Returns the configured theme mode.
	 */
	public get mode(): TpThemeMode {
		const value = this.getStringAttribute("mode", "auto");
		return isTpThemeMode(value) ? value : "auto";
	}

	/**
	 * Updates the selected theme mode.
	 *
	 * @summary Sets the configured theme mode.
	 * @param value Theme mode to apply.
	 */
	public set mode(value: TpThemeMode) {
		this.setStringAttribute("mode", value);
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
	 * Initializes the theme controller when connected.
	 *
	 * @summary Connects the theme controller.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpTheme.styleId, style);
		this.ensureControl();
		this.updateControl();
		document.addEventListener(
			TpTheme.refreshEventName,
			this.onThemeRefresh as EventListener,
		);
		this.applyTheme({ emitRefresh: true });
	}

	/**
	 * Reacts to changes on observed attributes.
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
			!["mode", "anchor", "ui-anchor", "variant", "size", "disabled"].includes(
				name,
			) ||
			oldValue === newValue
		) {
			return;
		}

		this.updateControl();
		if (name === "mode" || name === "anchor") {
			this.applyTheme({ emitRefresh: true });
		}
	}

	/**
	 * Removes listeners and restores the original target classes.
	 *
	 * @summary Disconnects the theme controller.
	 */
	protected disconnectedCallback(): void {
		document.removeEventListener(
			TpTheme.refreshEventName,
			this.onThemeRefresh as EventListener,
		);
		this.teardownMediaQuery();
		if (this.targetElement instanceof HTMLElement) {
			unregisterThemeTarget(this.targetElement, this);
			this.targetElement = null;
		}
	}

	/**
	 * Creates and caches the embedded theme control UI.
	 *
	 * @summary Ensures the internal theme UI exists.
	 */
	private ensureControl(): void {
		let control = this.queryElement<HTMLElement>(":scope > tp-icon-button");

		if (!(control instanceof HTMLElement)) {
			control = document.createElement("tp-icon-button");
			this.prepend(control);
		}

		control.setAttribute("name", "theme-light-dark");
		control.setAttribute("variant", this.variant);
		control.setAttribute("size", this.size);
		control.toggleAttribute("disabled", this.disabled);
		control.removeEventListener("click", this.onControlClick);
		control.addEventListener("click", this.onControlClick);
		this.controlEl = control;

		const controlId = this.ensureControlId(control);
		let dropdown = this.queryElement<HTMLElement>(":scope > tp-dropdown");
		if (!(dropdown instanceof HTMLElement)) {
			dropdown = document.createElement("tp-dropdown");
			this.append(dropdown);
		}

		const dropdownEl = dropdown as TpDropdown;
		dropdownEl.setAttribute("anchor", this.getDropdownAnchor(controlId));
		if (!dropdownEl.hasAttribute("placement")) {
			dropdownEl.setAttribute("placement", "bottom");
		}
		dropdownEl.setAttribute("outside-click", "");

		const ul = dropdownEl.querySelector("ul");
		if (
			!ul ||
			ul.querySelectorAll(".tp-theme-option").length !== 3 ||
			ul.querySelector("tp-divider") === null
		) {
			const newUl = document.createElement("ul");

			for (const choice of ["light", "dark", "auto"] as const) {
				if (choice === "auto") {
					const separator = document.createElement("li");
					separator.className = "tp-theme-separator";
					separator.setAttribute("role", "none");
					separator.setAttribute("aria-hidden", "true");
					const divider = document.createElement("tp-divider");
					separator.append(divider);
					newUl.append(separator);
				}

				const li = document.createElement("li");
				li.className = "tp-theme-option";
				li.setAttribute("data-mode", choice);
				li.setAttribute("role", "menuitem");

				const check = document.createElement("tp-icon");
				check.setAttribute("name", "check");

				const icon = document.createElement("tp-icon");
				icon.className = "tp-theme-option-icon";

				const label = document.createElement("span");
				label.textContent = choice;

				li.append(check, icon, label);
				li.addEventListener("click", () => {
					this.mode = choice;
					dropdownEl.open = false;
				});

				newUl.append(li);
			}

			if (ul) {
				ul.replaceWith(newUl);
			} else {
				dropdownEl.append(newUl);
			}
		}

		this.dropdownEl = dropdownEl;
	}

	/**
	 * Returns a stable identifier for the trigger element.
	 *
	 * @summary Ensures a stable trigger identifier.
	 * @param control Trigger element to identify.
	 * @returns Existing or generated trigger identifier.
	 */
	private ensureControlId(control: HTMLElement): string {
		const existingId = control.id.trim();
		if (existingId !== "") {
			return existingId;
		}

		TpTheme.nextControlId += 1;
		const id = `tp-theme-control-${String(TpTheme.nextControlId)}`;
		control.id = id;
		return id;
	}

	/**
	 * Synchronizes this controller to a mode received from a sibling controller.
	 *
	 * @summary Synchronizes the mode from another controller.
	 * @param mode Theme mode to apply.
	 */
	public syncToMode(mode: TpThemeMode): void {
		if (this.mode === mode) {
			return;
		}

		this.isSyncing = true;
		this.mode = mode;
		this.isSyncing = false;
		this.updateControl();
		this.applyTheme({ emitRefresh: false });
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
	 * Toggles the theme dropdown when the trigger is clicked.
	 *
	 * @summary Handles trigger clicks.
	 */
	private readonly onControlClick = (): void => {
		if (this.disabled) {
			return;
		}

		if (this.dropdownEl instanceof HTMLElement) {
			this.dropdownEl.open = !this.dropdownEl.open;
		}
	};

	/**
	 * Refreshes the trigger and dropdown state.
	 *
	 * @summary Updates the theme control UI.
	 */
	private updateControl(): void {
		this.ensureControl();

		if (!(this.controlEl instanceof HTMLElement)) {
			return;
		}

		const mode = this.mode;
		const effectiveMode = this.resolveEffectiveMode(mode);
		this.controlEl.setAttribute(
			"label",
			`Theme: ${mode}. Choose light, dark, or auto.`,
		);
		this.controlEl.setAttribute("data-mode", mode);
		this.controlEl.setAttribute("data-effective-mode", effectiveMode);
		this.controlEl.setAttribute(
			"name",
			effectiveMode === "dark" ? "moon" : "sun",
		);
		this.controlEl.style.setProperty("color", "var(--tp-warning-500)");

		if (this.dropdownEl instanceof HTMLElement) {
			const options =
				this.dropdownEl.querySelectorAll<HTMLElement>(".tp-theme-option");
			for (const option of options) {
				const optionMode = option.getAttribute("data-mode");
				const icon = option.querySelector<HTMLElement>(
					"tp-icon.tp-theme-option-icon",
				);

				if (optionMode === "auto") {
					const autoEffectiveMode = this.resolveEffectiveMode("auto");
					icon?.setAttribute(
						"name",
						autoEffectiveMode === "dark" ? "moon" : "sun",
					);
				} else if (optionMode === "light") {
					icon?.setAttribute("name", "sun");
				} else if (optionMode === "dark") {
					icon?.setAttribute("name", "moon");
				}

				if (optionMode === mode) {
					option.setAttribute("data-selected", "");
				} else {
					option.removeAttribute("data-selected");
				}
			}
		}
	}

	/**
	 * Applies the effective theme to the resolved target element.
	 *
	 * @summary Applies the current theme mode to the target.
	 * @param options Theme application options.
	 */
	private applyTheme(options: { emitRefresh: boolean }): void {
		this.setAttribute("mode", this.mode);
		this.updateControl();

		const target = this.resolveThemeTarget();

		if (!(target instanceof HTMLElement)) {
			this.teardownMediaQuery();
			if (this.targetElement instanceof HTMLElement) {
				unregisterThemeTarget(this.targetElement, this);
				this.targetElement = null;
			}
			this.hasAppliedTheme = true;
			return;
		}

		if (this.targetElement !== target) {
			if (this.targetElement instanceof HTMLElement) {
				unregisterThemeTarget(this.targetElement, this);
			}
			this.targetElement = target;
			registerThemeTarget(target, this);
		}

		const mode = this.mode;
		const effectiveMode = this.resolveEffectiveMode(mode);

		if (mode === "auto") {
			this.setupMediaQuery();
		} else {
			this.teardownMediaQuery();
		}

		target.classList.remove("tp-light", "tp-dark");
		target.classList.add(effectiveMode === "dark" ? "tp-dark" : "tp-light");
		syncInheritedBrandProperties(target, getThemeTargetState(target));
		this.emitChange(target, effectiveMode);
		this.hasAppliedTheme = true;

		if (options.emitRefresh) {
			this.dispatchEvent(
				new CustomEvent(TpTheme.refreshEventName, {
					bubbles: true,
					composed: true,
					detail: {
						source: this,
						scope: target,
					},
				}),
			);
		}

		syncThemeTargets(target, this);
	}

	private emitChange(target: HTMLElement, theme: "light" | "dark"): void {
		if (!this.hasAppliedTheme) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent(TpTheme.changeEventName, {
				bubbles: true,
				composed: true,
				detail: {
					mode: this.mode,
					theme,
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
	 * @summary Returns the current theme target.
	 * @returns Controlled target element, or `null`.
	 */
	private resolveThemeTarget(): HTMLElement | null {
		const anchoredTarget = this.resolveAnchoredThemeTarget();
		if (anchoredTarget instanceof HTMLElement) {
			return anchoredTarget;
		}

		const parent = this.parentElement;
		if (parent?.tagName === "TP-TOOLBAR") {
			return parent.parentElement;
		}

		if (parent?.parentElement?.tagName === "TP-TOOLBAR") {
			return parent.parentElement.parentElement;
		}

		const effectiveParent = this.getEffectiveParent();
		if (!(effectiveParent instanceof HTMLElement)) {
			return null;
		}

		if (effectiveParent.hasAttribute("data-tp-theme-scope")) {
			return effectiveParent;
		}

		return effectiveParent;
	}

	/**
	 * Resolves an explicit theme target from the `anchor` attribute.
	 *
	 * @summary Returns the anchored theme target when present.
	 * @returns Anchored element, or `null`.
	 */
	private resolveAnchoredThemeTarget(): HTMLElement | null {
		const anchor = this.getAttribute("anchor")?.trim() ?? "";
		if (anchor === "") {
			return null;
		}

		const target = this.ownerDocument.querySelector(anchor);
		return target instanceof HTMLElement ? target : null;
	}

	/**
	 * Skips over container elements that should not be considered as scoping targets.
	 *
	 * Containers like toolbars, menus, dropdowns, and paragraphs are transparent to scope resolution,
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
			"P",
		]);
		let current: HTMLElement | null = this.parentElement;

		while (current instanceof HTMLElement) {
			const tagName = current.tagName.toUpperCase();

			// Skip both container tags and their internal wrappers.
			if (containerTags.has(tagName)) {
				current = current.parentElement;
				continue;
			}

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

	/**
	 * Resolves the effective light or dark theme for a mode.
	 *
	 * @summary Resolves the effective theme mode.
	 * @param mode Theme mode to resolve.
	 * @returns Effective `light` or `dark` mode.
	 */
	private resolveEffectiveMode(mode: TpThemeMode): "light" | "dark" {
		if (mode === "light") {
			return "light";
		}

		if (mode === "dark") {
			return "dark";
		}

		const mediaQuery = this.getMediaQuery();
		return mediaQuery?.matches === true ? "dark" : "light";
	}

	/**
	 * Returns the cached media query used for auto mode.
	 *
	 * @summary Returns the auto-mode media query.
	 * @returns Cached media query list, or `null` when unavailable.
	 */
	private getMediaQuery(): MediaQueryList | null {
		if (this.mediaQueryList !== null) {
			return this.mediaQueryList;
		}

		const view = this.ownerDocument.defaultView;
		if (view === null || typeof view.matchMedia !== "function") {
			return null;
		}

		this.mediaQueryList = view.matchMedia("(prefers-color-scheme: dark)");
		return this.mediaQueryList;
	}

	/**
	 * Starts listening to system color-scheme changes.
	 *
	 * @summary Sets up auto-mode media query listeners.
	 */
	private setupMediaQuery(): void {
		const mediaQuery = this.getMediaQuery();
		if (mediaQuery === null) {
			return;
		}

		mediaQuery.removeEventListener("change", this.onMediaQueryChange);
		mediaQuery.addEventListener("change", this.onMediaQueryChange);
	}

	/**
	 * Stops listening to system color-scheme changes.
	 *
	 * @summary Tears down auto-mode media query listeners.
	 */
	private teardownMediaQuery(): void {
		const mediaQuery = this.mediaQueryList;
		if (mediaQuery === null) {
			return;
		}

		mediaQuery.removeEventListener("change", this.onMediaQueryChange);
	}
}

if (!customElements.get("tp-theme")) {
	customElements.define("tp-theme", TpTheme);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-theme": TpTheme;
	}
}
