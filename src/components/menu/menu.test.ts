import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./menu.js";
import { TpMenu } from "./menu.js";

describe("<tp-menu>", () => {
	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	function createMenu(): TpMenu {
		document.body.innerHTML = `
      <tp-menu>
        <ul>
          <li>File</li>
          <li>
            Edit
            <ul>
              <li>Copy</li>
              <li>Paste</li>
            </ul>
          </li>
          <li>Help</li>
        </ul>
      </tp-menu>
    `;

		const element = document.querySelector("tp-menu");
		if (!(element instanceof TpMenu)) {
			throw new Error("Expected <tp-menu> instance.");
		}

		return element;
	}

	it("extends HTMLElement", () => {
		const element = document.createElement("tp-menu");

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element).toBeInstanceOf(TpMenu);
	});

	it("injects CSS once", () => {
		const first = createMenu();

		const second = document.createElement("tp-menu");
		second.innerHTML = "<ul><li>One</li></ul>";
		document.body.append(second);

		expect(document.head.querySelectorAll("#tp-menu-styles")).toHaveLength(1);
		expect(first).toBeInstanceOf(TpMenu);
	});

	it('assigns role="menu" to root ul', () => {
		const element = createMenu();
		const root = element.querySelector(":scope > ul");

		expect(root?.getAttribute("role")).toBe("menu");
	});

	it('assigns role="menuitem" to li elements', () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		expect(items[0]?.getAttribute("role")).toBe("menuitem");
		expect(items[1]?.getAttribute("role")).toBe("menuitem");
	});

	it("detects submenu items", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		expect(items[1]?.getAttribute("aria-haspopup")).toBe("menu");
		expect(items[1]?.getAttribute("aria-expanded")).toBe("false");
	});

	it("opens submenu on click", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		items[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

		expect(items[1]?.getAttribute("aria-expanded")).toBe("true");
	});

	it("toggles submenu on Enter", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
		);

		expect(items[1]?.getAttribute("aria-expanded")).toBe("true");
	});

	it("opens submenu on ArrowRight", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
		);

		expect(items[1]?.getAttribute("aria-expanded")).toBe("true");
	});

	it("closes submenus on Escape", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		items[1]?.setAttribute("aria-expanded", "true");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
		);

		expect(items[1]?.getAttribute("aria-expanded")).toBe("false");
	});

	it("supports ArrowDown navigation", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		items[0]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
		);

		expect(items[1]?.getAttribute("tabindex")).toBe("0");
	});

	it("supports ArrowUp navigation", () => {
		const element = createMenu();
		const items = element.querySelectorAll("li");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }),
		);

		expect(items[0]?.getAttribute("tabindex")).toBe("0");
	});

	it("supports Home and End", () => {
		const element = createMenu();
		const items = element.querySelectorAll(":scope > ul > li");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "End" }),
		);
		expect(items[2]?.getAttribute("tabindex")).toBe("0");

		items[2]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "Home" }),
		);
		expect(items[0]?.getAttribute("tabindex")).toBe("0");
	});

	it("uses vertical as default orientation", () => {
		const element = createMenu();

		expect(element.orientation).toBe("vertical");
		expect(element.getAttribute("orientation")).toBe("vertical");
	});

	it("reflects orientation property", () => {
		const element = createMenu();

		element.orientation = "horizontal";

		expect(element.getAttribute("orientation")).toBe("horizontal");
		expect(element.orientation).toBe("horizontal");
	});

	it("sets aria-orientation on the root menu", () => {
		const element = createMenu();
		element.orientation = "horizontal";

		const root = element.querySelector(":scope > ul");

		expect(root?.getAttribute("aria-orientation")).toBe("horizontal");
	});

	it("supports horizontal root navigation with ArrowRight", () => {
		const element = createMenu();
		element.orientation = "horizontal";

		const items = element.querySelectorAll("li");

		items[0]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
		);

		expect(items[1]?.getAttribute("tabindex")).toBe("0");
	});

	it("supports horizontal root navigation with ArrowLeft", () => {
		const element = createMenu();
		element.orientation = "horizontal";

		const items = element.querySelectorAll("li");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
		);

		expect(items[0]?.getAttribute("tabindex")).toBe("0");
	});

	it("opens a submenu with ArrowDown on a horizontal root item", () => {
		const element = createMenu();
		element.orientation = "horizontal";

		const items = element.querySelectorAll("li");

		items[1]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
		);

		expect(items[1]?.getAttribute("aria-expanded")).toBe("true");
	});

	it("decorates separators and refreshes content added by the author", () => {
		const element = createMenu();
		const root = element.querySelector(":scope > ul");
		const divider = document.createElement("li");
		divider.setAttribute("data-tp-menu-divider", "");
		root?.append(divider);
		element.refresh();
		expect(divider.getAttribute("role")).toBe("separator");
		expect(divider.getAttribute("aria-disabled")).toBe("true");
		expect(divider.hasAttribute("tabindex")).toBe(false);
	});

	it("emits selection for a leaf and closes open submenus", () => {
		const element = createMenu();
		const items = element.querySelectorAll<HTMLLIElement>("li");
		items[1]?.setAttribute("aria-expanded", "true");
		let selected: HTMLLIElement | null = null;
		element.addEventListener("tp-menu-item-select", (event) => {
			selected = (event as CustomEvent<{ item: HTMLLIElement }>).detail.item;
		});
		items[0]?.click();
		expect(selected).toBe(items[0]);
		expect(items[1]?.getAttribute("aria-expanded")).toBe("false");
	});

	it("closes submenus on an outside pointer interaction", () => {
		const element = createMenu();
		const submenuItem = element.querySelectorAll("li")[1];
		submenuItem?.setAttribute("aria-expanded", "true");
		document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
		expect(submenuItem?.getAttribute("aria-expanded")).toBe("false");
	});

	it("keeps submenus open for an inside pointer interaction", () => {
		const element = createMenu();
		const submenuItem = element.querySelectorAll("li")[1];
		submenuItem?.setAttribute("aria-expanded", "true");
		submenuItem?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
		expect(submenuItem?.getAttribute("aria-expanded")).toBe("true");
	});

	it("returns focus to the parent with ArrowLeft in a submenu", () => {
		const element = createMenu();
		const items = element.querySelectorAll<HTMLLIElement>("li");
		items[1]?.setAttribute("aria-expanded", "true");
		items[3]?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
		);
		expect(items[1]?.getAttribute("aria-expanded")).toBe("false");
		expect(items[1]?.getAttribute("tabindex")).toBe("0");
	});

	it("handles nested keyboard navigation only at the focused level", () => {
		document.body.innerHTML =
			'<tp-menu orientation="horizontal"><ul><li>Components<ul><li>Layout<ul><li>Rows<ul><li>Inline</li></ul></li></ul></li></ul></li></ul></tp-menu>';
		const items = document.querySelectorAll<HTMLLIElement>("tp-menu li");
		const root = items.item(0);
		const layout = items.item(1);
		const rows = items.item(2);
		const leaf = items.item(3);
		root.focus();
		root.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
		);
		layout.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
		);
		rows.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
		);
		expect(document.activeElement).toBe(leaf);
		leaf.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
		);
		expect(rows.getAttribute("aria-expanded")).toBe("false");
		expect(layout.getAttribute("aria-expanded")).toBe("true");
		expect(root.getAttribute("aria-expanded")).toBe("true");
		expect(document.activeElement).toBe(rows);
	});

	it("does nothing when no root list is present", () => {
		const element = document.createElement("tp-menu") as TpMenu;
		document.body.append(element);
		element.refresh();
		expect(element.querySelector('[role="menu"]')).toBeNull();
	});
});
