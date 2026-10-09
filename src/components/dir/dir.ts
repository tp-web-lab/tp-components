/**
 * @module components/dir
 * @summary Reading-direction controller (`ltr`/`rtl`/`auto`) with embedded UI.
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

import style from "./dir.css?inline";

import "../icon-button/icon-button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";

import { isRtlLocale } from "../../utilities/text-direction.js";
import { TpBase } from "../base/base.js";
import {
	isTpDirType,
	isTpSizeType,
	isTpVariantType,
	type TpDirType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import type { TpDropdown } from "../dropdown/dropdown.js";

/**
 * Resolves the effective direction from the document root `lang` and `dir`.
 *
 * @summary Resolves the effective `ltr` or `rtl` document direction.
 * @returns `'rtl'` when either the root direction or language is RTL, otherwise `'ltr'`.
 * @internal
 */
function resolveDocumentDir(): "ltr" | "rtl" {
	const root = document.documentElement;
	const dir = root.getAttribute("dir");
	if (dir === "rtl") {
		return "rtl";
	}

	if (dir === "ltr") {
		return "ltr";
	}

	const lang = root.getAttribute("lang") ?? "";
	return isRtlLocale(lang) ? "rtl" : "ltr";
}

// ---------------------------------------------------------------------------
// State tracking for multi-controller synchronisation
// ---------------------------------------------------------------------------

interface DirTargetState {
	controllers: Set<TpDir>;
	initialDir: string | null;
}

const dirTargetStates = new WeakMap<HTMLElement, DirTargetState>();

/**
 * Returns the synchronization state associated with a controlled target.
 *
 * @summary Returns or creates direction synchronization state.
 * @param target Controlled target element.
 * @returns The state record stored for the target.
 * @internal
 */
function getDirTargetState(target: HTMLElement): DirTargetState {
	let state = dirTargetStates.get(target);
	if (state === undefined) {
		state = {
			controllers: new Set<TpDir>(),
			initialDir: target.getAttribute("dir"),
		};
		dirTargetStates.set(target, state);
	}

	return state;
}

/**
 * Registers a direction controller on a shared target.
 *
 * @summary Registers a controller for a target element.
 * @param target Controlled target element.
 * @param controller Controller instance to register.
 * @returns The synchronization state for the target.
 * @internal
 */
function registerDirTarget(
	target: HTMLElement,
	controller: TpDir,
): DirTargetState {
	const state = getDirTargetState(target);
	state.controllers.add(controller);
	return state;
}

/**
 * Unregisters a direction controller and restores the original target state when needed.
 *
 * @summary Unregisters a controller from a target element.
 * @param target Controlled target element.
 * @param controller Controller instance to unregister.
 * @internal
 */
function unregisterDirTarget(target: HTMLElement, controller: TpDir): void {
	const state = dirTargetStates.get(target);
	if (state === undefined) {
		return;
	}

	state.controllers.delete(controller);
	if (state.controllers.size > 0) {
		return;
	}

	if (state.initialDir === null) {
		target.removeAttribute("dir");
	} else {
		target.setAttribute("dir", state.initialDir);
	}

	dirTargetStates.delete(target);
}

/**
 * Propagates a direction change to every controller attached to the same target.
 *
 * @summary Synchronizes sibling controllers on the same target.
 * @param target Controlled target element.
 * @param source Controller that initiated the change.
 * @internal
 */
function syncDirTargets(target: HTMLElement, source: TpDir): void {
	const state = dirTargetStates.get(target);
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

// ---------------------------------------------------------------------------
// TpDir element
// ---------------------------------------------------------------------------

/**
 * `<tp-dir>` controls the reading direction of its parent element.
 *
 * It applies the `dir` attribute (`ltr` or `rtl`) to the parent that contains
 * `<tp-dir>`. In `auto` mode, it follows the document direction by observing
 * the root `<html>` `dir` and `lang` attributes. RTL detection supports both
 * language tags such as `ar` or `he` and documentation region codes such as
 * `ma`.
 *
 * Multiple `<tp-dir>` controllers on the same parent stay synchronized.
 *
 * @summary Parent-scoped reading-direction switcher.
 * @tagname tp-dir
 * @attr {string} mode = "auto" - Reading-direction mode (`ltr`, `rtl`, `auto`). In `auto`, RTL is inferred from language or supported region codes.
 * @attr {string} anchor = "" - CSS selector used as the explicit element that receives the selected direction.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the direction trigger.
 *
 * @event tp-dir-change Emitted when the reading direction applied to a target changes.
 * @eventdetail tp-dir-change { mode: "ltr" | "rtl" | "auto"; dir: "ltr" | "rtl"; anchor: string; target: HTMLElement }
 * @example
 * <p>The reading direction of this section can be changed.</p>
 *     <p>اس حصے کی پڑھنے کی سمت تبدیل کی جا سکتی ہے۔</p>
 *     <tp-dir></tp-dir>
 */
export class TpDir extends TpBase {
	private static readonly styleId = "tp-dir-styles";
	private static readonly changeEventName = "tp-dir-change";
	private static nextControlId = 0;

	public static override get observedAttributes(): string[] {
		return ["mode", "anchor", "variant", "size", "disabled"];
	}

	private targetElement: HTMLElement | null = null;
	private controlEl: HTMLElement | null = null;
	private dropdownEl: TpDropdown | null = null;
	private documentObserver: MutationObserver | null = null;
	private isSyncing = false;
	private hasAppliedDir = false;

	/**
	 * Returns the selected direction mode.
	 *
	 * @summary Returns the configured direction mode.
	 */
	public get mode(): TpDirType {
		const value = this.getStringAttribute("mode", "auto");
		return isTpDirType(value) ? value : "auto";
	}

	/**
	 * Updates the selected direction mode.
	 *
	 * @summary Sets the configured direction mode.
	 * @param value Direction mode to apply.
	 */
	public set mode(value: TpDirType) {
		this.setStringAttribute("mode", value);
	}

	/**
	 * Returns the explicit direction target selector.
	 *
	 * @summary Returns the configured target selector.
	 */
	public get anchor(): string {
		return this.getAttribute("anchor") ?? "";
	}

	/**
	 * Updates the explicit direction target selector.
	 *
	 * @summary Sets the configured target selector.
	 * @param value CSS selector for the target element.
	 */
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
	 * Initializes the direction controller when connected to the document.
	 *
	 * @summary Connects the direction controller.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpDir.styleId, style);
		this.ensureControl();
		this.updateControl();
		this.applyDir();
	}

	/**
	 * Reacts to changes on observed attributes.
	 *
	 * @summary Handles observed attribute changes.
	 * @param name Updated attribute name.
	 * @param oldValue Previous attribute value.
	 * @param newValue New attribute value.
	 */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (this.isSyncing) {
			return;
		}

		if (
			!["mode", "anchor", "variant", "size", "disabled"].includes(name) ||
			oldValue === newValue
		) {
			return;
		}

		this.updateControl();
		if (name === "mode" || name === "anchor") {
			this.applyDir();
		}
	}

	/**
	 * Restores the original direction and removes active observers.
	 *
	 * @summary Disconnects the controller and restores target state.
	 */
	protected disconnectedCallback(): void {
		this.teardownDocumentObserver();

		if (this.targetElement instanceof HTMLElement) {
			unregisterDirTarget(this.targetElement, this);
			this.targetElement = null;
		}
	}

	/**
	 * Synchronizes this controller to a specific mode when updated by a peer.
	 *
	 * @summary Synchronizes the mode from a peer controller.
	 * @param mode New mode to apply.
	 * @internal
	 */
	public syncToMode(mode: TpDirType): void {
		if (this.mode === mode) {
			return;
		}

		this.isSyncing = true;
		this.mode = mode;
		this.isSyncing = false;
		this.updateControl();
		this.applyDir();
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Creates and caches the embedded control UI.
	 *
	 * @summary Ensures that the direction control UI exists.
	 */
	private ensureControl(): void {
		let control = this.queryElement<HTMLElement>(":scope > tp-icon-button");

		if (!(control instanceof HTMLElement)) {
			control = document.createElement("tp-icon-button");
			this.prepend(control);
		}

		control.setAttribute("name", "arrow-right");
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
		dropdownEl.setAttribute("anchor", `#${controlId}`);
		dropdownEl.setAttribute("placement", "bottom");
		dropdownEl.setAttribute("outside-click", "");

		const ul = dropdownEl.querySelector("ul");
		if (
			!ul ||
			ul.querySelectorAll(".tp-dir-option").length !== 3 ||
			ul.querySelector("tp-divider") === null
		) {
			const newUl = document.createElement("ul");

			for (const choice of ["ltr", "rtl", "auto"] as const) {
				if (choice === "auto") {
					const separator = document.createElement("li");
					separator.className = "tp-dir-separator";
					separator.setAttribute("role", "none");
					separator.setAttribute("aria-hidden", "true");
					const divider = document.createElement("tp-divider");
					separator.append(divider);
					newUl.append(separator);
				}

				const li = document.createElement("li");
				li.className = "tp-dir-option";
				li.setAttribute("data-mode", choice);
				li.setAttribute("role", "menuitem");

				const check = document.createElement("tp-icon");
				check.setAttribute("name", "check");

				const icon = document.createElement("tp-icon");
				icon.className = "tp-dir-option-icon";

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
	 * Returns a stable element identifier for the trigger button.
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

		TpDir.nextControlId += 1;
		const id = `tp-dir-control-${String(TpDir.nextControlId)}`;
		control.id = id;
		return id;
	}

	/**
	 * Toggles the direction dropdown when the trigger is clicked.
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
	 * Refreshes trigger metadata and dropdown selection state.
	 *
	 * @summary Updates the direction control UI.
	 */
	private updateControl(): void {
		this.ensureControl();

		if (!(this.controlEl instanceof HTMLElement)) {
			return;
		}

		const mode = this.mode;
		const effectiveDir = this.resolveEffectiveDir(mode);
		this.controlEl.setAttribute(
			"label",
			`Direction: ${mode}. Choose ltr, rtl, or auto.`,
		);
		this.controlEl.setAttribute("data-mode", mode);
		this.controlEl.setAttribute("data-effective-dir", effectiveDir);
		this.controlEl.setAttribute(
			"name",
			effectiveDir === "rtl" ? "arrow-left" : "arrow-right",
		);

		if (this.dropdownEl instanceof HTMLElement) {
			const options =
				this.dropdownEl.querySelectorAll<HTMLElement>(".tp-dir-option");
			for (const option of options) {
				const optionMode = option.getAttribute("data-mode");
				const icon = option.querySelector<HTMLElement>(
					"tp-icon.tp-dir-option-icon",
				);
				if (optionMode === "auto") {
					icon?.setAttribute(
						"name",
						effectiveDir === "rtl" ? "arrow-left" : "arrow-right",
					);
				} else if (optionMode === "rtl") {
					icon?.setAttribute("name", "arrow-left");
				} else if (optionMode === "ltr") {
					icon?.setAttribute("name", "arrow-right");
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
	 * Applies the effective direction to the resolved target element.
	 *
	 * @summary Applies the current direction mode to the target.
	 */
	private applyDir(): void {
		this.setAttribute("mode", this.mode);
		this.updateControl();

		const target = this.resolveTarget();

		if (!(target instanceof HTMLElement)) {
			this.teardownDocumentObserver();
			if (this.targetElement instanceof HTMLElement) {
				unregisterDirTarget(this.targetElement, this);
				this.targetElement = null;
			}
			this.hasAppliedDir = true;
			return;
		}

		if (this.targetElement !== target) {
			if (this.targetElement instanceof HTMLElement) {
				unregisterDirTarget(this.targetElement, this);
			}
			this.targetElement = target;
			registerDirTarget(target, this);
		}

		const mode = this.mode;
		if (mode === "auto") {
			this.setupDocumentObserver();
		} else {
			this.teardownDocumentObserver();
		}

		const effectiveDir = this.resolveEffectiveDir(mode);
		target.setAttribute("dir", effectiveDir);
		this.emitChange(target, effectiveDir);
		this.hasAppliedDir = true;

		syncDirTargets(target, this);
	}

	private emitChange(target: HTMLElement, dir: "ltr" | "rtl"): void {
		if (!this.hasAppliedDir) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent(TpDir.changeEventName, {
				bubbles: true,
				composed: true,
				detail: {
					mode: this.mode,
					dir,
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
	 * to find the actual target.
	 *
	 * @summary Returns the current direction target.
	 * @returns Parent element used as direction target, or `null`.
	 */
	private resolveTarget(): HTMLElement | null {
		const anchoredTarget = this.resolveAnchoredTarget();
		if (anchoredTarget instanceof HTMLElement) {
			return anchoredTarget;
		}

		return this.getEffectiveParent();
	}

	/**
	 * Resolves an explicit direction target from the `anchor` attribute.
	 *
	 * @summary Returns the anchored direction target when present.
	 * @returns Anchored element, or `null`.
	 */
	private resolveAnchoredTarget(): HTMLElement | null {
		const anchor = this.anchor.trim();
		if (anchor === "") {
			return null;
		}

		const target = this.ownerDocument.querySelector(anchor);
		return target instanceof HTMLElement ? target : null;
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

	/**
	 * Resolves the effective `ltr` or `rtl` direction for a mode.
	 *
	 * @summary Resolves the effective direction for a mode.
	 * @param mode Direction mode to resolve.
	 * @returns Effective `ltr` or `rtl` direction.
	 */
	private resolveEffectiveDir(mode: TpDirType): "ltr" | "rtl" {
		if (mode === "ltr") {
			return "ltr";
		}

		if (mode === "rtl") {
			return "rtl";
		}

		return resolveDocumentDir();
	}

	/**
	 * Starts observing the document root for `dir` and `lang` changes.
	 *
	 * @summary Sets up automatic document-direction observation.
	 */
	private setupDocumentObserver(): void {
		if (this.documentObserver !== null) {
			return;
		}

		this.documentObserver = new MutationObserver(() => {
			if (this.mode !== "auto") {
				return;
			}

			this.applyDir();
		});

		this.documentObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["dir", "lang"],
		});
	}

	/**
	 * Stops observing the document root for direction changes.
	 *
	 * @summary Tears down automatic document-direction observation.
	 */
	private teardownDocumentObserver(): void {
		this.documentObserver?.disconnect();
		this.documentObserver = null;
	}
}

if (!customElements.get("tp-dir")) {
	customElements.define("tp-dir", TpDir);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-dir": TpDir;
	}
}
