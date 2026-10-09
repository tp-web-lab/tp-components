/**
 * @module components/tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */

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
import style from "./tabs.css?inline";

import "../icon/icon.js";

/**
 * @summary API documentation summary.
 */
type TpTabsActivation = "auto" | "manual";

/**
 * @summary Sets the axis of navigation.
 */
type TpTabsOrientation = "horizontal" | "vertical";

/**
 * @summary Represents a tab selection change.
 */
export interface TpTabsSelectDetail {
	/**
	 * @summary Selected tab index.
	 */
	selected: number;

	/**
	 * @summary Selected tab value.
	 */
	value: string;
}

/**
 * @summary Represents a tab close request.
 */
export interface TpTabsCloseDetail {
	/**
	 * @summary Closed tab index.
	 */
	index: number;

	/**
	 * @summary Closed tab value.
	 */
	value: string;
}

/**
 * @summary Represents a tab reorder event.
 */
export interface TpTabsReorderDetail {
	/**
	 * @summary Original tab index.
	 */
	fromIndex: number;

	/**
	 * @summary New tab index.
	 */
	toIndex: number;

	/**
	 * @summary Reordered tab value.
	 */
	value: string;
}

/**
 * @summary Validates an activation mode.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isActivation(value: string): value is TpTabsActivation {
	return value === "auto" || value === "manual";
}

/**
 * @summary API documentation summary.
 * @param value Parameter.
 * @returns Return value.
 * @internal
 */
function isOrientation(value: string): value is TpTabsOrientation {
	return value === "horizontal" || value === "vertical";
}

let instanceCount = 0;

/**
 * @summary Accessible tab group.
 * @tagname tp-tabs
 * @attr {string} activation = "auto" - Keyboard activation mode (`auto` or `manual`).
 * @attr {string} orientation = "horizontal" - Tab list orientation (`horizontal` or `vertical`).
 * @attr {number} selected = 0 - Selected tab index.
 * @event tp-tabs-close Emitted when a tab close button is activated.
 * @eventdetail tp-tabs-close { index: number; value: string }
 * @event tp-tabs-reorder Emitted after a tab is reordered by drag and drop.
 * @eventdetail tp-tabs-reorder { fromIndex: number; toIndex: number; value: string }
 * @event tp-tabs-select Emitted after a tab is selected.
 * @eventdetail tp-tabs-select { selected: number; value: string }
 * @accessibility Accepts author-friendly dl/dt/dd markup and converts it to ARIA-compatible generic tab, tablist, and tabpanel elements at runtime.
 * @accessibility Implements the ARIA tablist, tab, and tabpanel relationships in light DOM.
 * @accessibility Exposes selection through `aria-selected` and uses roving tabindex.
 * @accessibilityresponsibility Provide a concise, unique visible label for every tab.
 * @keyboard {ArrowRight / ArrowDown} Moves focus to the next tab according to orientation.
 * @keyboard {ArrowLeft / ArrowUp} Moves focus to the previous tab according to orientation.
 * @keyboard {Home} Moves focus to the first tab.
 * @keyboard {End} Moves focus to the last tab.
 * @keyboard {Enter / Space} Activates the focused tab in manual activation mode.
 * @keyboard {Delete} Requests closing a dynamically added tab.
 * @example
 * <tp-tabs>
 *   <dl>
 *     <dt>Tab 1</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-1"></tp-icon></dd>
 *     <dt>Tab 2</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-2"></tp-icon></dd>
 *     <dt>Tab 3</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-3"></tp-icon></dd>
 *     <dt>Tab 4</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-4"></tp-icon></dd>
 *   </dl>
 * </tp-tabs>
 */
export class TpTabs extends TpBase {
	/**
	 * @summary Global style ID.
	 * @internal
	 */
	private static readonly styleId = "tp-tabs-styles";

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private instanceId = "";

	/**
	 * @summary Reference to the internal description list.
	 * @internal
	 */
	private dlEl: HTMLElement | null = null;

	/**
	 * @summary Observes external structural changes.
	 * @internal
	 */
	private mutationObserver: MutationObserver | null = null;

	/**
	 * @summary Declares reactive attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["selected", "activation", "orientation"];
	}

	/**
	 * @summary Selected tab index.
	 * @attr selected
	 * @default 0
	 * @returns Return value.
	 */
	public get selected(): number {
		const value = this.getAttribute("selected");
		const parsed = Number(value);

		return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
	}

	/**
	 * @summary Selects a tab by index.
	 * @param value Selected tab index.
	 */
	public set selected(value: number) {
		if (!Number.isInteger(value) || value < 0) {
			throw new TypeError(
				'The "selected" property must be an integer greater than or equal to 0.',
			);
		}

		this.setAttribute("selected", String(value));
	}

	/**
	 * @summary Mode of activation keyboard.
	 * @attr activation
	 * @default auto
	 * @returns Return value.
	 */
	public get activation(): TpTabsActivation {
		const value = this.getAttribute("activation");
		return value !== null && isActivation(value) ? value : "auto";
	}

	/**
	 * @summary Sets the keyboard activation mode.
	 * @param value Keyboard activation mode.
	 */
	public set activation(value: TpTabsActivation) {
		this.setAttribute("activation", value);
	}

	/**
	 * @summary Tab list orientation.
	 * @attr orientation
	 * @default horizontal
	 * @returns Return value.
	 */
	public get orientation(): TpTabsOrientation {
		const value = this.getAttribute("orientation");
		return value !== null && isOrientation(value) ? value : "horizontal";
	}

	/**
	 * @summary Sets the tab list orientation.
	 * @param value Tab list orientation.
	 */
	public set orientation(value: TpTabsOrientation) {
		this.setAttribute("orientation", value);
	}

	/**
	 * @summary Injects the styles, initializes the structure and observes the content.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureInstanceId();
		this.ensureDl();
		this.observeMutations();
		this.update();
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	public disconnectedCallback(): void {
		super.connectedCallback();
		this.mutationObserver?.disconnect();
		this.mutationObserver = null;
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		if (!this.isConnected) {
			return;
		}

		this.ensureDl();
		this.update();
	}

	/**
	 * @summary Selects a tab by its index.
	 * @param index Tab index.
	 */
	public select(index: number): void {
		const tabs = this.getTabs();

		if (tabs.length === 0) {
			return;
		}

		const safeIndex = Math.max(0, Math.min(index, tabs.length - 1));
		this.selected = safeIndex;
	}

	/**
	 * @summary Selects a tab by its `data-value`.
	 * @param value Tab value.
	 */
	public selectValue(value: string): void {
		const index = this.getTabs().findIndex(
			(tab) => tab.getAttribute("data-value") === value,
		);

		if (index >= 0) {
			this.selected = index;
		}
	}

	/**
	 * @summary Adds a tab and its empty panel.
	 * @param value Tab value.
	 * @param label Tab label.
	 * @returns Added tab index.
	 */
	public addTab(value: string, label: string): number {
		this.ensureDl();

		if (this.dlEl === null) {
			return -1;
		}

		const existingIndex = this.getTabs().findIndex(
			(tab) => tab.getAttribute("data-value") === value,
		);

		if (existingIndex >= 0) {
			const existingTab = this.getTabs()[existingIndex];

			if (existingTab !== undefined) {
				this.setTabLabel(existingTab, label);
			}

			this.update();
			return existingIndex;
		}

		const dt = document.createElement("div");
		dt.setAttribute("data-tp-tab", "");
		dt.setAttribute("data-value", value);
		dt.setAttribute("draggable", "true");

		const labelEl = document.createElement("span");
		labelEl.setAttribute("data-tp-tab-label", "");
		labelEl.textContent = label;

		const closeButton = document.createElement("tp-icon");
		closeButton.setAttribute("data-tp-tab-close", "");
		closeButton.setAttribute("name", "close");
		closeButton.setAttribute("size", "xs");
		closeButton.setAttribute("aria-hidden", "true");

		dt.append(labelEl, closeButton);

		const dd = document.createElement("div");
		dd.setAttribute("data-tp-tabpanel", "");
		dd.setAttribute("data-value", value);

		this.dlEl.append(dt);
		this.append(dd);
		this.update();

		return this.getTabs().findIndex(
			(tab) => tab.getAttribute("data-value") === value,
		);
	}

	/**
	 * @summary Removes a tab by value.
	 * @param value Tab value.
	 */
	public removeTab(value: string): void {
		const tabs = this.getTabs();
		const panels = this.getPanels();

		const index = tabs.findIndex(
			(tab) => tab.getAttribute("data-value") === value,
		);

		if (index < 0) {
			return;
		}

		tabs[index]?.remove();
		panels[index]?.remove();

		const nextTabsCount = this.getTabs().length;

		if (nextTabsCount === 0) {
			this.selected = 0;
			this.update();
			return;
		}

		if (this.selected >= nextTabsCount) {
			this.selected = nextTabsCount - 1;
		}

		this.update();
	}

	/**
	 * @summary Moves a tab from one index to another.
	 * @param fromIndex Original tab index.
	 * @param toIndex New tab index.
	 */
	public moveTab(fromIndex: number, toIndex: number): void {
		if (this.dlEl === null) {
			return;
		}

		const tabs = this.getTabs();
		const panels = this.getPanels();

		if (
			fromIndex < 0 ||
			toIndex < 0 ||
			fromIndex >= tabs.length ||
			toIndex >= tabs.length ||
			fromIndex === toIndex
		) {
			return;
		}

		const entries = tabs.map((tab, index) => ({
			tab,
			panel: panels[index],
		}));

		const movedEntry = entries.splice(fromIndex, 1)[0];

		if (movedEntry === undefined) {
			return;
		}

		entries.splice(toIndex, 0, movedEntry);

		this.dlEl.replaceChildren(...entries.map((entry) => entry.tab));
		for (const entry of entries) {
			if (entry.panel !== undefined) this.append(entry.panel);
		}

		const selectedValue =
			movedEntry.tab.getAttribute("data-value") ?? this.getSelectedValue();

		if (selectedValue !== null) {
			this.selectValue(selectedValue);
		}

		this.update();
	}

	/**
	 * @summary Removes all tabs and panels.
	 */
	public clearTabs(): void {
		this.ensureDl();

		if (this.dlEl === null) {
			return;
		}

		this.dlEl.replaceChildren();
		for (const panel of this.getPanels()) panel.remove();
		this.selected = 0;
		this.update();
	}

	/**
	 * @summary Returns the selected tab value.
	 * @returns Selected tab value, or `null` when no tab is selected.
	 */
	public getSelectedValue(): string | null {
		const tab = this.getTabs()[this.selected];
		return tab?.getAttribute("data-value") ?? null;
	}

	/**
	 * @summary Rebuilds tab roles and selection state.
	 */
	public refresh(): void {
		this.ensureDl();
		this.update();
	}

	/**
	 * @summary Injects the style global.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpTabs.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpTabs.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	/**
	 * @summary Initializes the instance identifier.
	 * @internal
	 */
	private ensureInstanceId(): void {
		if (this.instanceId !== "") {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-tabs-${String(instanceCount)}`;
		this.setAttribute("data-tp-tabs-id", this.instanceId);
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private observeMutations(): void {
		this.mutationObserver?.disconnect();

		this.mutationObserver = new MutationObserver(() => {
			this.ensureDl();
			this.update();
		});

		this.mutationObserver.observe(this, {
			childList: true,
			subtree: true,
		});
	}

	/**
	 * @summary Normalizes existing DL structure (wraps plain text DT/DD).
	 * @internal
	 */
	private normalizeDl(): void {
		if (this.dlEl === null) {
			return;
		}

		const tabs = this.getTabs();

		for (const dt of tabs) {
			// Wrap plain text content in span[data-tp-tab-label]
			const labelEl = dt.querySelector("[data-tp-tab-label]");

			if (labelEl === null) {
				// Save existing content
				const content = Array.from(dt.childNodes);
				dt.replaceChildren();

				// Create and append label span
				const newLabelEl = document.createElement("span");
				newLabelEl.setAttribute("data-tp-tab-label", "");
				for (const node of content) {
					newLabelEl.append(node);
				}
				dt.append(newLabelEl);

				// Add close button if not present
				if (dt.querySelector("[data-tp-tab-close]") === null) {
					const closeButton = document.createElement("tp-icon");
					closeButton.setAttribute("data-tp-tab-close", "");
					closeButton.setAttribute("name", "close");
					closeButton.setAttribute("size", "xs");
					closeButton.setAttribute("aria-hidden", "true");
					dt.append(closeButton);
				}
			}
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private ensureDl(): void {
		const existingTabList = this.querySelector<HTMLElement>(
			":scope > [data-tp-tablist]",
		);

		if (existingTabList !== null) {
			this.dlEl = existingTabList;
			this.dlEl.setAttribute("role", "tablist");
			this.dlEl.setAttribute("aria-orientation", this.orientation);
			this.normalizeDl();
			return;
		}

		const authorDl = this.querySelector(":scope > dl");

		if (authorDl instanceof HTMLDListElement) {
			const tabList = document.createElement("div");
			tabList.setAttribute("data-tp-tablist", "");
			tabList.setAttribute("role", "tablist");
			tabList.setAttribute("aria-orientation", this.orientation);
			const panels: HTMLElement[] = [];

			for (const authorElement of Array.from(authorDl.children)) {
				if (!(authorElement instanceof HTMLElement)) continue;

				if (authorElement.tagName === "DT") {
					const tab = document.createElement("div");
					tab.setAttribute("data-tp-tab", "");
					for (const attribute of Array.from(authorElement.attributes)) {
						tab.setAttribute(attribute.name, attribute.value);
					}
					tab.append(...Array.from(authorElement.childNodes));
					tabList.append(tab);
				} else if (authorElement.tagName === "DD") {
					const panel = document.createElement("div");
					panel.setAttribute("data-tp-tabpanel", "");
					for (const attribute of Array.from(authorElement.attributes)) {
						panel.setAttribute(attribute.name, attribute.value);
					}
					panel.append(...Array.from(authorElement.childNodes));
					panels.push(panel);
				}
			}

			authorDl.replaceWith(tabList);
			this.append(...panels);
			this.dlEl = tabList;
			this.normalizeDl();
			return;
		}

		const tabList = document.createElement("div");
		tabList.setAttribute("data-tp-tablist", "");
		tabList.setAttribute("role", "tablist");
		tabList.setAttribute("aria-orientation", this.orientation);
		this.append(tabList);
		this.dlEl = tabList;
	}

	/**
	 * @summary Returns the tabs source.
	 * @returns Return value.
	 * @internal
	 */
	private getTabs(): HTMLElement[] {
		if (this.dlEl === null) {
			return [];
		}

		return Array.from(this.dlEl.children).filter(
			(element): element is HTMLElement =>
				element instanceof HTMLElement && element.hasAttribute("data-tp-tab"),
		);
	}

	/**
	 * @summary Returns the panels source.
	 * @returns Return value.
	 * @internal
	 */
	private getPanels(): HTMLElement[] {
		if (this.dlEl === null) {
			return [];
		}

		return Array.from(this.children).filter(
			(element): element is HTMLElement =>
				element instanceof HTMLElement &&
				element.hasAttribute("data-tp-tabpanel"),
		);
	}

	/**
	 * @summary API documentation summary.
	 * @param tab Parameter.
	 * @param label Parameter.
	 * @internal
	 */
	private setTabLabel(tab: HTMLElement, label: string): void {
		const labelEl = tab.querySelector("[data-tp-tab-label]");

		if (labelEl instanceof HTMLElement) {
			labelEl.textContent = label;
		}
	}

	/**
	 * @summary API documentation summary.
	 * @internal
	 */
	private update(): void {
		if (this.dlEl === null) {
			return;
		}

		const tabs = this.getTabs();
		const panels = this.getPanels();

		const index =
			tabs.length === 0
				? 0
				: Math.max(0, Math.min(this.selected, tabs.length - 1));

		this.dlEl.setAttribute("aria-orientation", this.orientation);

		for (const [i, tab] of tabs.entries()) {
			tab.setAttribute("role", "tab");
			tab.setAttribute("tabindex", i === index ? "0" : "-1");
			tab.setAttribute("aria-selected", String(i === index));
			tab.setAttribute("aria-disabled", String(tab.hasAttribute("disabled")));
			tab.setAttribute("aria-keyshortcuts", "Delete");
			tab.setAttribute("draggable", "true");

			const panel = panels[i];

			if (panel !== undefined) {
				const tabId = `${this.instanceId}-tab-${String(i)}`;
				const panelId = `${this.instanceId}-panel-${String(i)}`;

				tab.id = tabId;
				panel.id = panelId;
				tab.setAttribute("aria-controls", panelId);
				panel.setAttribute("aria-labelledby", tabId);
			}

			tab.onclick = (event: MouseEvent) => {
				if (tab.hasAttribute("disabled")) return;

				const target = event.target;

				if (
					target instanceof HTMLElement &&
					target.closest("[data-tp-tab-close]")
				) {
					this.dispatchCloseEvent(i);
					event.stopPropagation();
					return;
				}

				event.preventDefault();
				this.selected = i;
				this.dispatchSelectEvent(i);
			};

			tab.onkeydown = (event: KeyboardEvent) => {
				if (tab.hasAttribute("disabled")) {
					if (event.key === "Enter" || event.key === " ")
						event.preventDefault();
					return;
				}

				if (
					event.target instanceof HTMLElement &&
					event.target.closest("[data-tp-tab-close]")
				) {
					if (event.key === "Enter" || event.key === " ") {
						this.dispatchCloseEvent(i);
						event.preventDefault();
					}

					return;
				}

				if (
					event.key === "Delete" &&
					tab.querySelector("[data-tp-tab-close]") !== null
				) {
					this.dispatchCloseEvent(i);
					event.preventDefault();
					return;
				}

				this.handleKey(event, i, tabs);
			};

			tab.ondragstart = (event: DragEvent) => {
				const value = tab.getAttribute("data-value");

				if (value === null || value === "") {
					return;
				}

				const dataTransfer = event.dataTransfer;

				if (dataTransfer === null) {
					return;
				}

				dataTransfer.setData("text/plain", String(i));
				dataTransfer.setData("application/x-tp-tabs-value", value);
				dataTransfer.effectAllowed = "move";
			};

			tab.ondragover = (event: DragEvent) => {
				event.preventDefault();

				const dataTransfer = event.dataTransfer;

				if (dataTransfer !== null) {
					dataTransfer.dropEffect = "move";
				}
			};

			tab.ondrop = (event: DragEvent) => {
				event.preventDefault();

				const dataTransfer = event.dataTransfer;

				if (dataTransfer === null) {
					return;
				}

				const fromRaw = dataTransfer.getData("text/plain");
				const fromIndex = Number(fromRaw);

				if (
					!Number.isInteger(fromIndex) ||
					fromIndex < 0 ||
					fromIndex >= tabs.length ||
					fromIndex === i
				) {
					return;
				}

				this.moveTab(fromIndex, i);
				this.dispatchReorderEvent(fromIndex, i);
			};
		}

		for (const [i, panel] of panels.entries()) {
			panel.setAttribute("role", "tabpanel");
			panel.hidden = i !== index;
		}
	}

	/**
	 * @summary API documentation summary.
	 * @param index Parameter.
	 * @internal
	 */
	private dispatchSelectEvent(index: number): void {
		const value = this.getTabs()[index]?.getAttribute("data-value") ?? "";

		this.dispatchEvent(
			new CustomEvent<TpTabsSelectDetail>("tp-tabs-select", {
				bubbles: true,
				detail: {
					selected: index,
					value,
				},
			}),
		);
	}

	/**
	 * @summary API documentation summary.
	 * @param index Parameter.
	 * @internal
	 */
	private dispatchCloseEvent(index: number): void {
		const value = this.getTabs()[index]?.getAttribute("data-value") ?? "";

		this.dispatchEvent(
			new CustomEvent<TpTabsCloseDetail>("tp-tabs-close", {
				bubbles: true,
				detail: {
					index,
					value,
				},
			}),
		);
	}

	/**
	 * @summary API documentation summary.
	 * @param fromIndex Parameter.
	 * @param toIndex Parameter.
	 * @internal
	 */
	private dispatchReorderEvent(fromIndex: number, toIndex: number): void {
		const value = this.getTabs()[toIndex]?.getAttribute("data-value") ?? "";

		this.dispatchEvent(
			new CustomEvent<TpTabsReorderDetail>("tp-tabs-reorder", {
				bubbles: true,
				detail: {
					fromIndex,
					toIndex,
					value,
				},
			}),
		);
	}

	/**
	 * @summary API documentation summary.
	 * @param event Parameter.
	 * @param index Parameter.
	 * @param tabs Parameter.
	 * @internal
	 */
	private handleKey(
		event: KeyboardEvent,
		index: number,
		tabs: HTMLElement[],
	): void {
		if (tabs.length === 0) {
			return;
		}

		const horizontal = this.orientation === "horizontal";
		let next = index;

		if (
			(horizontal && event.key === "ArrowRight") ||
			(!horizontal && event.key === "ArrowDown")
		) {
			next = (index + 1) % tabs.length;
		}

		if (
			(horizontal && event.key === "ArrowLeft") ||
			(!horizontal && event.key === "ArrowUp")
		) {
			next = (index - 1 + tabs.length) % tabs.length;
		}

		if (event.key === "Home") {
			next = 0;
		}

		if (event.key === "End") {
			next = tabs.length - 1;
		}

		if (next !== index) {
			tabs[next]?.focus();

			if (this.activation === "auto") {
				this.selected = next;
				this.dispatchSelectEvent(next);
			}

			event.preventDefault();
			return;
		}

		if (
			this.activation === "manual" &&
			(event.key === "Enter" || event.key === " ")
		) {
			this.selected = index;
			this.dispatchSelectEvent(index);
			event.preventDefault();
		}
	}
}

if (!customElements.get("tp-tabs")) {
	customElements.define("tp-tabs", TpTabs);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-tabs": TpTabs;
	}

	interface HTMLElementEventMap {
		"tp-tabs-select": CustomEvent<TpTabsSelectDetail>;
		"tp-tabs-close": CustomEvent<TpTabsCloseDetail>;
		"tp-tabs-reorder": CustomEvent<TpTabsReorderDetail>;
	}
}
