/** Shared game header: commands, assistance and locally scoped display controllers. */
import "../components/icon/icon.js";
import "../components/icon-button/icon-button.js";
import "../components/chronometer/chronometer.js";
import "../components/dropdown/dropdown.js";
import "../components/color/color.js";
import "../components/theme/theme.js";
import "../components/fullscreen/fullscreen.js";
import type { TpChronometer } from "../components/chronometer/chronometer.js";
import type { TpDropdown } from "../components/dropdown/dropdown.js";
import type { TpIconButton } from "../components/icon-button/icon-button.js";
import "../components/divider/divider.js";
import "../components/drawer/drawer.js";
import type { TpDrawer } from "../components/drawer/drawer.js";
import style from "./game-header.css?inline";
import { GAME_RULES } from "./game-rules.js";
export interface GameHelpAction {
	id?: string;
	label: string;
	run: () => void;
	disabled?: () => boolean;
}
export interface GameHeaderOptions {
	name: string;
	icon: string;
	target: HTMLElement;
	reset: () => void;
	undo: () => void;
	redo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	help: () => GameHelpAction[];
	controls?: { reset?: TpIconButton; undo?: TpIconButton; redo?: TpIconButton };
	chronometer?: TpChronometer;
}
let sequence = 0;
const headers = new WeakMap<HTMLElement, GameHeader>();
/** Reuses one header and chronometer when a game rebuilds its board. */
export function mountGameHeader(
	host: HTMLElement,
	options: GameHeaderOptions,
): void {
	let header = headers.get(host);
	if (!header) {
		header = new GameHeader(host);
		headers.set(host, header);
	}
	header.mount(options);
}
/** Refreshes command availability after a game-state change. */
export function updateGameHeader(host: HTMLElement): void {
	headers.get(host)?.update();
}
/** Tracks active play without resetting elapsed time during undo or rerendering. */
export function gameActivity(
	host: HTMLElement,
	active: boolean,
	complete = false,
): void {
	const clock = headers.get(host)?.clock;
	if (!clock) return;
	if (active && !complete) {
		clock.pause();
		clock.play();
	} else clock.pause();
}
export function resetGameClock(host: HTMLElement): void {
	headers.get(host)?.clock.stop();
}
class GameHeader {
	readonly root = document.createElement("div");
	readonly actions = document.createElement("div");
	readonly title = document.createElement("strong");
	readonly menu = document.createElement("tp-dropdown") as TpDropdown;
	clock = document.createElement("tp-chronometer") as TpChronometer;
	private options?: GameHeaderOptions;
	private rulesDrawer?: TpDrawer;
	private reset?: TpIconButton;
	private undo?: TpIconButton;
	private redo?: TpIconButton;
	private readonly help = document.createElement(
		"tp-icon-button",
	) as TpIconButton;
	private readonly color = document.createElement("tp-color");
	private readonly theme = document.createElement("tp-theme");
	private readonly fullscreen = document.createElement("tp-fullscreen");
	private readonly anchor: string;
	constructor(host: HTMLElement) {
		const id = ++sequence;
		host.setAttribute("data-tp-game-scope", String(id));
		this.anchor = `[data-tp-game-scope="${id}"]`;
		if (!document.getElementById("tp-game-header-style")) {
			const css = document.createElement("style");
			css.id = "tp-game-header-style";
			css.textContent = style;
			document.head.append(css);
		}
		this.root.className = "tp-game-header";
		this.actions.className = "tp-game-header-actions";
		this.actions.dataset.helpGroup = "Game controls";
		this.title.className = "tp-game-header-title";
		this.help.id = `tp-game-help-${id}`;
		this.help.name = "help";
		this.help.setAttribute("size", "s");
		this.help.label = "Help";
		this.help.dataset.gameCommand = "help";
		this.help.setAttribute("aria-haspopup", "menu");
		this.menu.className = "tp-game-help";
		this.menu.setAttribute("anchor", `#${this.help.id}`);
		this.menu.setAttribute("placement", "bottom");
		this.menu.setAttribute("outside-click", "");
		this.help.addEventListener("click", () => {
			this.populateHelp();
			this.menu.toggle();
		});
		this.menu.addEventListener("tp-dropdown-toggle", () =>
			this.help.setAttribute("aria-expanded", String(this.menu.open)),
		);
		for (const controller of [this.color, this.theme, this.fullscreen]) {
			controller.setAttribute("anchor", this.anchor);
			controller.setAttribute("size", "s");
		}
		this.root.append(this.title, this.actions, this.menu);
	}
	private button(name: string, run: () => void): TpIconButton {
		const b = document.createElement("tp-icon-button") as TpIconButton;
		b.name = name === "reset" ? "refresh" : name;
		b.label = name[0]?.toUpperCase() + name.slice(1);
		b.addEventListener("click", run);
		return b;
	}
	mount(options: GameHeaderOptions): void {
		this.options = options;
		this.reset =
			options.controls?.reset ??
			this.reset ??
			this.button("reset", () => {
				this.options?.reset();
				this.clock.stop();
			});
		this.undo =
			options.controls?.undo ??
			this.undo ??
			this.button("undo", () => this.options?.undo());
		this.redo =
			options.controls?.redo ??
			this.redo ??
			this.button("redo", () => this.options?.redo());
		for (const [id, b] of [
			["reset", this.reset],
			["undo", this.undo],
			["redo", this.redo],
		] as const) {
			b.dataset.gameCommand = id;
			b.setAttribute("size", "s");
			b.setAttribute("label", id[0]?.toUpperCase() + id.slice(1));
			b.setAttribute("name", id === "reset" ? "refresh" : id);
		}
		if (
			options.chronometer &&
			options.chronometer !== this.clock &&
			!this.clock.isConnected
		)
			this.clock = options.chronometer;
		this.clock.classList.add("tp-game-chronometer");
		this.clock.setAttribute("size", "0.85rem");
		if (
			options.controls?.reset &&
			!options.controls.reset.hasAttribute("data-game-clock-reset")
		) {
			options.controls.reset.setAttribute("data-game-clock-reset", "");
			options.controls.reset.addEventListener("click", () => this.clock.stop());
		}
		const controls = [
			this.reset,
			this.undo,
			this.redo,
			this.help,
			this.clock,
			this.color,
			this.theme,
			this.fullscreen,
		];
		for (const [index, control] of controls.entries())
			if (this.actions.children[index] !== control)
				this.actions.insertBefore(
					control,
					this.actions.children[index] ?? null,
				);
		for (const child of Array.from(this.actions.children))
			if (!controls.includes(child as TpIconButton)) child.remove();

		const icon = document.createElement("tp-icon");
		icon.setAttribute("name", options.icon);
		icon.setAttribute("size", "2em");
		icon.setAttribute("library", "components");
		icon.setAttribute("aria-hidden", "true");
		this.title.replaceChildren(icon, document.createTextNode(options.name));
		if (options.target !== this.root) options.target.replaceWith(this.root);
		this.update();
	}
	update(): void {
		if (!this.options) return;
		this.undo?.toggleAttribute("disabled", !this.options.canUndo());
		this.redo?.toggleAttribute("disabled", !this.options.canRedo());
	}
	private populateHelp(): void {
		const list = document.createElement("ul");
		for (const action of this.options?.help() ?? []) {
			const li = document.createElement("li");
			li.textContent = action.label;
			li.dataset.gameHelp = action.id ?? action.label;
			li.setAttribute("aria-disabled", String(action.disabled?.() ?? false));
			li.addEventListener("click", () => {
				if (action.disabled?.()) return;
				this.menu.hide();
				action.run();
				this.update();
				this.help.querySelector<HTMLButtonElement>("button")?.focus();
			});
			list.append(li);
		}
		const separator = document.createElement("li");
		separator.className = "tp-game-help-separator";
		separator.setAttribute("role", "none");
		separator.setAttribute("aria-hidden", "true");
		separator.append(document.createElement("tp-divider"));
		const rules = document.createElement("li");
		rules.textContent = "Rules of the game";
		rules.dataset.gameHelp = "rules";
		rules.addEventListener("click", () => {
			this.menu.hide();
			this.showRules();
		});
		rules.addEventListener("keydown", (event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			rules.click();
		});
		list.append(separator, rules);
		this.menu.replaceChildren(list);
	}
	private showRules(): void {
		if (!this.options) return;
		if (!this.rulesDrawer) {
			this.rulesDrawer = document.createElement("tp-drawer") as TpDrawer;
			this.rulesDrawer.className = "tp-game-rules";
			this.rulesDrawer.addEventListener("tp-drawer-toggle", () => {
				if (!this.rulesDrawer?.open)
					this.help.querySelector<HTMLButtonElement>("button")?.focus();
			});
			this.root.append(this.rulesDrawer);
		}
		this.rulesDrawer.label = this.options.name;
		this.rulesDrawer.id = `${this.help.id}-rules`;
		const actions = this.rulesDrawer.querySelector("[data-tp-drawer-actions]");
		if (actions && !actions.querySelector("tp-color")) {
			const color = document.createElement("tp-color");
			const theme = document.createElement("tp-theme");
			for (const control of [color, theme]) {
				control.setAttribute("anchor", `#${this.rulesDrawer.id}`);
				control.setAttribute("size", "s");
			}
			actions.prepend(color, theme);
		}
		const header = this.rulesDrawer.querySelector("[data-tp-drawer-header]");
		let icon = header?.querySelector(".tp-game-rules-icon");
		if (!icon && header) {
			icon = document.createElement("tp-icon");
			icon.className = "tp-game-rules-icon";
			icon.setAttribute("library", "components");
			icon.setAttribute("size", "2em");
			icon.setAttribute("aria-hidden", "true");
			header.prepend(icon);
		}
		icon?.setAttribute("name", this.options.icon);
		const list = document.createElement("ol");
		for (const rule of GAME_RULES[this.options.icon] ?? []) {
			const item = document.createElement("li");
			item.textContent = rule;
			list.append(item);
		}
		const heading = document.createElement("h3");
		heading.textContent = "Rules of the game";
		this.rulesDrawer.setContent([heading, list]);
		this.rulesDrawer.show();
	}
}
/** Adapts existing select-based assistance while retaining its game-specific actions and live restrictions. */
export function mountLegacyGameHeader(host: HTMLElement, slug: string): void {
	const target = host.querySelector<HTMLElement>(`.tp-${slug}-header`);
	const select = host.querySelector<HTMLSelectElement>(`.tp-${slug}-assist`);
	const undo = host.querySelector<TpIconButton>(`.tp-${slug}-undo`),
		redo = host.querySelector<TpIconButton>(`.tp-${slug}-redo`);
	if (!target || !select || !undo || !redo) return;
	const name =
		host.querySelector(`.tp-${slug}-title`)?.textContent?.trim() ?? slug;
	const run = (value: string) => {
		select.value = value;
		select.dispatchEvent(new Event("change"));
	};
	const mode = host.querySelector<HTMLElement>(`.tp-${slug}-mode`);
	if (mode || slug === "binary") {
		const grid = host.querySelector<HTMLElement>(`.tp-${slug}-grid`);
		if (grid) {
			const board = document.createElement("div");
			board.className = "tp-game-entry-board";
			const columns =
				grid.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] ?? "9";
			board.style.setProperty("--tp-game-columns", columns);
			grid.before(board);
			if (mode) board.append(mode);
			board.append(grid);
		} else if (mode) target.after(mode);
	}
	mountGameHeader(host, {
		name,
		icon: slug,
		target,
		reset: () => run("reset-game"),
		undo: () => {},
		redo: () => {},
		canUndo: () => !undo.disabled,
		canRedo: () => !redo.disabled,
		controls: { undo, redo },
		help: () =>
			Array.from(select.options)
				.filter((o) => o.value && o.value !== "reset-game")
				.map((o) => ({
					id: o.value,
					label: o.textContent ?? o.value,
					run: () => run(o.value),
					disabled: () => select.disabled || o.disabled,
				})),
	});
}
