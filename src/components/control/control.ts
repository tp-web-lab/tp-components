// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-clock
 * @summary Live clock component with digital or analogic display and date tooltip.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-dir
 * @summary Reading-direction controller (`ltr`/`rtl`/`auto`) with embedded UI.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-lang
 * @summary Documentation language selector.
 */
/**
 * @tp-dependency tp-screen
 * @summary Responsive page preview in selectable device viewports.
 */
/**
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import type { TpCheckboxList } from "../checkbox-list/checkbox-list.js";
import "../checkbox-list/checkbox-list.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import "../toolbar/toolbar.js";
import "../clock/clock.js";
import "../color/color.js";
import "../dir/dir.js";
import "../fullscreen/fullscreen.js";
import "../lang/lang.js";
import "../theme/theme.js";
import "../screen/screen.js";
import style from "./control.css?inline";

const controllers = [
	{ name: "clock", label: "Clock" },
	{ name: "lang", label: "Language" },
	{ name: "dir", label: "Direction" },
	{ name: "color", label: "Color" },
	{ name: "theme", label: "Theme" },
	{ name: "screen", label: "Screen" },
	{ name: "fullscreen", label: "Fullscreen" },
] as const;

/**
 * The custom `<tp-control>` element selects which interface controllers appear in a compact toolbar.
 *
 * @summary Selects which interface controllers appear in a compact toolbar.
 * @tagname tp-control
 * @attr {string} value = "" - Comma-separated visible controllers: clock, lang, dir, color, theme, screen and fullscreen. Empty hides all controllers.
 * @attr {string} langs = "en" - Comma-separated languages forwarded to the language controller.
 * @attr {string} repository = "" - Documentation repository root forwarded to the language controller.
 * @event tp-control-change Emitted when the reader changes the visible controllers.
 * @eventdetail tp-control-change { value: string; controllers: string[] }
 * @keyboard {Enter / Space} Opens or closes the dropdown when the Controllers button is focused.
 * @keyboard {Space} Toggles a focused checkbox.
 * @keyboard {Tab / Shift+Tab} Moves between the visible controllers, the trigger and the dropdown checkboxes.
 * @keyboard {Escape} Closes the dropdown and returns focus to its trigger.
 * @accessibility Uses a labelled trigger, a labelled toolbar and native checkboxes; the All controllers checkbox exposes partial selection.
 * @example
 * <tp-box data-tp-color-scope>
 *   <tp-control value="color,theme"></tp-control>
 *   <p>Change the color or theme of this box. The inline code <code>hello(world)</code> uses the selected brand color.</p>
 * </tp-box>
 */
export class TpControl extends TpBase {
	private static nextId = 0;
	private toolbar: HTMLElement | null = null;
	private trigger: HTMLElement | null = null;
	private dropdown: TpDropdown | null = null;
	private all: TpCheckboxList | null = null;
	private choices: TpCheckboxList | null = null;
	private readonly instances = new Map<string, HTMLElement>();
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "value", "langs", "repository"];
	}
	public get value(): string {
		const selected = new Set(
			(this.getAttribute("value") ?? "").split(/[\s,]+/),
		);
		return controllers
			.filter((c) => selected.has(c.name))
			.map((c) => c.name)
			.join(",");
	}
	public set value(value: string) {
		this.setAttribute("value", value);
	}
	public get langs(): string {
		return this.getAttribute("langs") || "en";
	}
	public set langs(value: string) {
		this.setAttribute("langs", value);
	}
	public get repository(): string {
		return this.getAttribute("repository") ?? "";
	}
	public set repository(value: string) {
		this.setAttribute("repository", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-control-styles", style);
		if (!this.toolbar) this.createControls();
		this.sync();
		queueMicrotask(() => {
			if (this.isConnected) this.sync();
		});
	}
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.sync();
	}
	public disconnectedCallback(): void {
		this.dropdown?.hide();
	}
	private createControls(): void {
		const id = `tp-control-${++TpControl.nextId}`;
		this.toolbar = document.createElement("tp-toolbar");
		this.toolbar.dataset.controlToolbar = "";
		this.toolbar.setAttribute("aria-label", "Visible controllers");
		this.toolbar.setAttribute("role", "toolbar");
		this.trigger = document.createElement("tp-icon-button");
		this.trigger.id = `${id}-trigger`;
		this.trigger.setAttribute("name", "cog-transfert");
		this.trigger.setAttribute("label", "Controllers");
		this.trigger.setAttribute("aria-haspopup", "dialog");
		this.trigger.setAttribute("aria-controls", `${id}-dropdown`);
		this.trigger.setAttribute("aria-expanded", "false");
		this.trigger.dataset.helpDescription =
			"Choose which controllers are visible.";
		this.dropdown = document.createElement("tp-dropdown") as TpDropdown;
		this.dropdown.id = `${id}-dropdown`;
		this.dropdown.setAttribute("anchor", `#${id}-trigger`);
		this.dropdown.setAttribute("outside-click", "");
		this.dropdown.setAttribute("role", "dialog");
		this.dropdown.setAttribute("aria-label", "Controllers");
		this.all = document.createElement("tp-checkbox-list") as TpCheckboxList;
		this.all.setAttribute("aria-label", "All controllers");
		this.all.innerHTML = "<ul><li>All controllers</li></ul>";
		this.choices = document.createElement("tp-checkbox-list") as TpCheckboxList;
		this.choices.setAttribute("aria-label", "Individual controllers");
		this.choices.innerHTML = `<ul>${controllers.map((c) => `<li>${c.label}</li>`).join("")}</ul>`;
		this.dropdown.append(
			this.all,
			document.createElement("tp-divider"),
			this.choices,
		);
		this.trigger.addEventListener("click", () => {
			if (!this.dropdown) return;
			this.dropdown.open = !this.dropdown.open;
			if (this.dropdown.open)
				this.all?.querySelector<HTMLInputElement>("input")?.focus();
		});
		this.dropdown.addEventListener("tp-dropdown-toggle", (event) => {
			if (event.target !== this.dropdown) return;
			this.syncTrigger();
		});
		this.dropdown.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				this.dropdown?.hide();
				this.trigger?.querySelector<HTMLButtonElement>("button")?.focus();
			}
		});
		this.all.addEventListener("change", (event) => {
			event.stopPropagation();
			this.choose(
				this.all?.querySelector<HTMLInputElement>("input")?.checked
					? controllers.map((c) => c.name).join(",")
					: "",
			);
		});
		this.choices.addEventListener("change", (event) => {
			event.stopPropagation();
			const selected = new Set(
				Array.from(
					this.choices?.querySelectorAll<HTMLInputElement>("input") ?? [],
				).flatMap((input, index) => (input.checked ? [String(index + 1)] : [])),
			);
			this.choose(
				controllers
					.filter((_, i) => selected.has(String(i + 1)))
					.map((c) => c.name)
					.join(","),
			);
		});
		this.append(this.toolbar, this.trigger, this.dropdown);
	}
	private choose(value: string): void {
		this.value = value;
		this.dispatchEvent(
			new CustomEvent("tp-control-change", {
				bubbles: true,
				detail: {
					value: this.value,
					controllers: this.value ? this.value.split(",") : [],
				},
			}),
		);
	}
	private syncTrigger(): void {
		const button = this.trigger?.querySelector("button");
		for (const target of [this.trigger, button]) {
			target?.setAttribute(
				"aria-expanded",
				String(this.dropdown?.open ?? false),
			);
			target?.setAttribute("aria-haspopup", "dialog");
			if (this.dropdown)
				target?.setAttribute("aria-controls", this.dropdown.id);
		}
	}
	private sync(): void {
		this.syncTrigger();
		if (!this.toolbar || !this.all || !this.choices) return;
		const selected = new Set(this.value.split(",").filter(Boolean));
		for (const { name } of controllers) {
			let instance = this.instances.get(name);
			if (selected.has(name) && !instance) {
				instance = document.createElement(`tp-${name}`);
				if (name === "lang") {
					instance.setAttribute("langs", this.langs);
					instance.setAttribute("repository", this.repository);
				}
				this.instances.set(name, instance);
				// Insert into the toolbar's existing start zone to preserve connected controllers.
				const zone =
					this.toolbar.querySelector("[data-toolbar-start]") ?? this.toolbar;
				const following = controllers
					.slice(controllers.findIndex((c) => c.name === name) + 1)
					.map((c) => this.instances.get(c.name))
					.find(Boolean);
				zone.insertBefore(instance, following ?? null);
			}
			if (instance) instance.hidden = !selected.has(name);
		}
		const language = this.instances.get("lang");
		if (language) {
			if (language.getAttribute("langs") !== this.langs)
				language.setAttribute("langs", this.langs);
			if (language.getAttribute("repository") !== this.repository)
				language.setAttribute("repository", this.repository);
		}
		this.toolbar.hidden = !selected.size;
		this.all.value = selected.size === controllers.length ? "1" : "";
		const checkbox = this.all.querySelector<HTMLInputElement>("input");
		if (checkbox)
			checkbox.indeterminate =
				selected.size > 0 && selected.size < controllers.length;
		this.choices.value = controllers
			.flatMap((c, i) => (selected.has(c.name) ? [String(i + 1)] : []))
			.join(",");
	}
}
if (!customElements.get("tp-control"))
	customElements.define("tp-control", TpControl);
declare global {
	interface HTMLElementTagNameMap {
		"tp-control": TpControl;
	}
}
