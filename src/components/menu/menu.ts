// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./menu.css?inline";

/**
 * @module components/menu
 * @summary Accessible menu component.
 */

type TpMenuOrientation = "horizontal" | "vertical";

function isOrientation(value: string): value is TpMenuOrientation {
	return value === "horizontal" || value === "vertical";
}

/**
 * Turns a nested list into a keyboard-accessible menu.
 *
 * Expected structure:
 *
 * ```html
 * <tp-menu>
 *   <ul>
 *     <li>Item</li>
 *     <li>
 *       Parent
 *       <ul>
 *         <li>Child 1</li>
 *         <li>Child 2</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </tp-menu>
 * ```
 *
 * Conventions:
 * - The first `<ul>` becomes the root menu.
 * - Each direct `<li>` becomes a menu item.
 * - A `<ul>` nested inside an item becomes that item's submenu.
 *
 * @summary Turns a nested list into a keyboard-accessible menu.
 * @tagname tp-menu
 *
 * @attr {string} orientation = "vertical" - Root menu orientation (`horizontal` or `vertical`).
 *
 *
 * @event tp-menu-item-select Emitted when a menu item without submenu is selected.
 * @eventdetail tp-menu-item-select { item: HTMLLIElement }
 *
 * @cssprop --tp-menu-gap Gap between root menu items.
 * @example
 * ```html
 * <tp-menu>
 *   <ul>
 *     <li><a href="/#/components/button/index.md">Buttons</a></li>
 *     <li><a href="/#/components/tabs/index.md">Tabs</a></li>
 *     <li><a href="/#/components/tree/index.md">Trees</a></li>
 *   </ul>
 * </tp-menu>
 * <script src="/docs/components/menu/examples/navigation.js"></script>
 * ```
 */
export class TpMenu extends TpBase {
	private static readonly styleId = "tp-menu-styles";

	public static get observedAttributes(): string[] {
		return ["orientation"];
	}

	/**
	 * Orientation of the root menu.
	 *
	 * Submenus always remain vertical.
	 */
	public get orientation(): TpMenuOrientation {
		const value = this.getAttribute("orientation");
		return value !== null && isOrientation(value) ? value : "vertical";
	}

	public set orientation(value: TpMenuOrientation) {
		this.setAttribute("orientation", value);
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();

		if (!this.hasAttribute("orientation")) {
			this.setAttribute("orientation", "vertical");
		}

		this.updateMenu();

		document.addEventListener("pointerdown", this.handleDocumentPointerDown);
	}

	protected attributeChangedCallback(): void {
		if (!this.isConnected) {
			return;
		}

		this.updateMenu();
	}

	public disconnectedCallback(): void {
		super.connectedCallback();
		document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
	}

	/**
	 * Closes every open submenu.
	 *
	 * @summary Closes all expanded submenu items.
	 */
	public closeAll(): void {
		const items = this.getMenuItems();

		for (const item of items) {
			if (this.getSubmenu(item) !== null) {
				item.setAttribute("aria-expanded", "false");
			}
		}
	}

	/**
	 * Rebuilds menu roles, submenu metadata, and keyboard handlers.
	 *
	 * @summary Refreshes the menu structure after content changes.
	 */
	public refresh(): void {
		this.updateMenu();
	}

	private ensureStyles(): void {
		const existing = document.getElementById(TpMenu.styleId);

		if (existing instanceof HTMLStyleElement) {
			existing.textContent = style;
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpMenu.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	private getRootMenu(): HTMLUListElement | null {
		const element = this.querySelector(":scope > ul");
		return element instanceof HTMLUListElement ? element : null;
	}

	private getDirectMenuItems(menu: HTMLUListElement): HTMLLIElement[] {
		return Array.from(menu.children).filter(
			(element): element is HTMLLIElement => element instanceof HTMLLIElement,
		);
	}

	private getMenuItems(): HTMLLIElement[] {
		return Array.from(this.querySelectorAll("li")).filter(
			(element): element is HTMLLIElement => element instanceof HTMLLIElement,
		);
	}

	private getSubmenu(item: HTMLLIElement): HTMLUListElement | null {
		const submenu = Array.from(item.children).find(
			(child): child is HTMLUListElement => child instanceof HTMLUListElement,
		);

		return submenu ?? null;
	}

	private readonly handleDocumentPointerDown = (event: PointerEvent): void => {
		const target = event.target;

		if (!(target instanceof Node)) {
			return;
		}

		if (this.contains(target)) {
			return;
		}

		this.closeAll();
	};

	private updateMenu(): void {
		const rootMenu = this.getRootMenu();

		if (rootMenu === null) {
			return;
		}

		const orientation = this.orientation;

		this.toggleAttribute("data-horizontal", orientation === "horizontal");
		this.toggleAttribute("data-vertical", orientation === "vertical");

		rootMenu.setAttribute("role", "menu");
		rootMenu.setAttribute("aria-orientation", orientation);

		this.decorateMenu(rootMenu, true);
	}

	private decorateMenu(
		menu: HTMLUListElement,
		isRoot = false,
		isRootSubmenu = false,
	): void {
		menu.setAttribute("role", "menu");
		menu.setAttribute(
			"aria-orientation",
			isRoot ? this.orientation : "vertical",
		);

		if (isRootSubmenu) {
			menu.setAttribute("data-tp-menu-root-submenu", "");
		} else {
			menu.removeAttribute("data-tp-menu-root-submenu");
		}

		const items = this.getDirectMenuItems(menu);

		for (const [index, item] of items.entries()) {
			if (item.hasAttribute("data-tp-menu-divider")) {
				item.setAttribute("role", "separator");
				item.setAttribute("aria-disabled", "true");
				item.removeAttribute("tabindex");
				continue;
			}

			item.setAttribute("role", "menuitem");

			if (isRoot) {
				item.setAttribute("data-tp-menu-root-item", "");
			} else {
				item.removeAttribute("data-tp-menu-root-item");
			}

			item.setAttribute("tabindex", index === 0 ? "0" : "-1");

			const submenu = this.getSubmenu(item);

			if (submenu !== null) {
				submenu.setAttribute("data-tp-menu-submenu", "");
				item.setAttribute("aria-haspopup", "menu");

				if (!item.hasAttribute("aria-expanded")) {
					item.setAttribute("aria-expanded", "false");
				}

				this.decorateMenu(submenu, false, isRoot);
			}

			item.onclick = (event) => {
				const target = event.target;

				if (!(target instanceof Element)) {
					return;
				}

				const clickedItem = target.closest('li[role="menuitem"]');

				if (clickedItem !== item) {
					return;
				}

				if (submenu !== null) {
					const expanded = item.getAttribute("aria-expanded") === "true";

					if (!expanded) {
						this.closeSiblingSubmenus(item);
					}

					item.setAttribute("aria-expanded", String(!expanded));
					event.stopPropagation();
					return;
				}

				this.closeAll();

				this.dispatchEvent(
					new CustomEvent("tp-menu-item-select", {
						bubbles: true,
						composed: true,
						detail: { item },
					}),
				);

				event.stopPropagation();
			};

			item.onkeydown = (event) => {
				// A nested item's key event must not also activate its ancestors.
				if (
					!(event.target instanceof Element) ||
					event.target.closest('li[role="menuitem"]') !== item
				)
					return;
				this.handleKey(event, item, items, menu);
			};
		}
	}

	private closeSiblingSubmenus(item: HTMLLIElement): void {
		const parentMenu = item.parentElement;

		if (!(parentMenu instanceof HTMLUListElement)) {
			return;
		}

		const siblings = this.getDirectMenuItems(parentMenu);

		for (const sibling of siblings) {
			if (sibling !== item) {
				sibling.setAttribute("aria-expanded", "false");
			}
		}
	}

	private handleKey(
		event: KeyboardEvent,
		item: HTMLLIElement,
		siblings: HTMLLIElement[],
		menu: HTMLUListElement,
	): void {
		const index = siblings.indexOf(item);
		if (index < 0) {
			return;
		}

		const isRoot = menu === this.getRootMenu();
		const currentOrientation = isRoot ? this.orientation : "vertical";

		if (
			(currentOrientation === "vertical" && event.key === "ArrowDown") ||
			(currentOrientation === "horizontal" && event.key === "ArrowRight")
		) {
			const next = siblings[(index + 1) % siblings.length];
			this.focusItem(next);
			event.preventDefault();
			return;
		}

		if (
			(currentOrientation === "vertical" && event.key === "ArrowUp") ||
			(currentOrientation === "horizontal" && event.key === "ArrowLeft")
		) {
			const previous =
				siblings[(index - 1 + siblings.length) % siblings.length];
			this.focusItem(previous);
			event.preventDefault();
			return;
		}

		if (event.key === "ArrowRight") {
			const submenu = this.getSubmenu(item);
			if (submenu !== null) {
				item.setAttribute("aria-expanded", "true");
				const firstChild = this.getDirectMenuItems(submenu)[0];
				this.focusItem(firstChild);
				event.preventDefault();
				return;
			}
		}

		if (event.key === "ArrowLeft") {
			const parentItem = item.parentElement?.closest("li");
			if (parentItem instanceof HTMLLIElement) {
				parentItem.setAttribute("aria-expanded", "false");
				this.focusItem(parentItem);
				event.preventDefault();
				return;
			}
		}

		if (event.key === "ArrowDown" && currentOrientation === "horizontal") {
			const submenu = this.getSubmenu(item);
			if (submenu !== null) {
				item.setAttribute("aria-expanded", "true");
				const firstChild = this.getDirectMenuItems(submenu)[0];
				this.focusItem(firstChild);
				event.preventDefault();
				return;
			}
		}

		if (event.key === "Home") {
			this.focusItem(siblings[0]);
			event.preventDefault();
			return;
		}

		if (event.key === "End") {
			this.focusItem(siblings[siblings.length - 1]);
			event.preventDefault();
			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			const submenu = this.getSubmenu(item);
			if (submenu !== null) {
				const expanded = item.getAttribute("aria-expanded") === "true";
				item.setAttribute("aria-expanded", String(!expanded));

				if (!expanded) {
					const firstChild = this.getDirectMenuItems(submenu)[0];
					this.focusItem(firstChild);
				}
			}
			event.preventDefault();
			return;
		}

		if (event.key === "Escape") {
			this.closeAll();
			this.focusItem(item);
			event.preventDefault();
		}
	}

	private focusItem(item: HTMLLIElement | undefined): void {
		if (item === undefined) {
			return;
		}

		const menu = item.parentElement;
		if (!(menu instanceof HTMLUListElement)) {
			return;
		}

		const siblings = this.getDirectMenuItems(menu);

		for (const sibling of siblings) {
			sibling.setAttribute("tabindex", sibling === item ? "0" : "-1");
		}

		item.focus();
	}
}

if (!customElements.get("tp-menu")) {
	customElements.define("tp-menu", TpMenu);
}
