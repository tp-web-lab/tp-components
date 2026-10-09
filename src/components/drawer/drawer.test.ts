import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./drawer.js";
import { TpDrawer } from "./drawer.js";

describe("<tp-drawer> after overlay refactor", () => {
	it("uses the top layer for viewport drawers and leaves it for contained drawers", () => {
		const drawer = document.createElement("tp-drawer") as TpDrawer;
		const show = vi.fn();
		const hide = vi.fn();
		drawer.showPopover = show;
		drawer.hidePopover = hide;
		document.body.append(drawer);
		drawer.show();
		expect(drawer.getAttribute("popover")).toBe("manual");
		expect(show).toHaveBeenCalled();
		drawer.contained = true;
		expect(drawer.hasAttribute("popover")).toBe(false);
		expect(hide).toHaveBeenCalled();
		drawer.contained = false;
		expect(drawer.getAttribute("popover")).toBe("manual");
		drawer.hide();
		expect(hide).toHaveBeenCalled();
	});
	it("bounds contained resizing and stops tracking pointers after disconnection", () => {
		const parent = document.createElement("div");
		Object.defineProperty(parent, "clientWidth", { value: 250 });
		const drawer = document.createElement("tp-drawer") as TpDrawer;
		drawer.contained = true;
		drawer.open = true;
		parent.append(drawer);
		document.body.append(parent);
		vi.spyOn(drawer, "getBoundingClientRect").mockReturnValue({
			width: 200,
		} as DOMRect);
		const handle = drawer.querySelector<HTMLElement>("[data-tp-drawer-resize]");
		handle?.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));
		expect(drawer.width).toBe("250px");
		handle?.dispatchEvent(
			new PointerEvent("pointerdown", {
				button: 0,
				pointerId: 2,
				clientX: 100,
				bubbles: true,
			}),
		);
		drawer.remove();
		document.dispatchEvent(
			new PointerEvent("pointermove", { pointerId: 2, clientX: 200 }),
		);
		expect(drawer.width).toBe("250px");
	});
	it("groups expand, collapse and close at the end of the header", () => {
		const drawer = document.createElement("tp-drawer");
		document.body.append(drawer);
		const actions = drawer.querySelector('[data-tp-drawer-actions="end"]');
		expect(
			[...(actions?.children ?? [])].map((child) =>
				child.getAttribute("data-tp-drawer-role"),
			),
		).toEqual(["expand-button", "collapse-button", "close-button"]);
		expect(drawer.querySelector('[data-tp-drawer-actions="start"]')).toBeNull();
	});

	it.each([
		["end", "ltr", 350],
		["start", "ltr", 250],
		["end", "rtl", 250],
		["start", "rtl", 350],
	])(
		"resizes from the free edge for %s / %s",
		(placement, direction, expected) => {
			const drawer = document.createElement("tp-drawer") as TpDrawer;
			drawer.setAttribute("placement", String(placement));
			drawer.style.direction = String(direction);
			drawer.open = true;
			document.body.append(drawer);
			vi.spyOn(drawer, "getBoundingClientRect").mockReturnValue({
				width: 300,
			} as DOMRect);
			const handle = drawer.querySelector<HTMLElement>(
				"[data-tp-drawer-resize]",
			);
			expect(handle).not.toBeNull();
			handle?.dispatchEvent(
				new PointerEvent("pointerdown", {
					button: 0,
					pointerId: 1,
					clientX: 500,
					bubbles: true,
				}),
			);
			document.dispatchEvent(
				new PointerEvent("pointermove", { pointerId: 1, clientX: 450 }),
			);
			expect(drawer.width).toBe(`${expected}px`);
			document.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
			document.dispatchEvent(
				new PointerEvent("pointermove", { pointerId: 1, clientX: 400 }),
			);
			expect(drawer.width).toBe(`${expected}px`);
		},
	);

	it("supports keyboard resizing, bounds and top/bottom placement", () => {
		const drawer = document.createElement("tp-drawer") as TpDrawer;
		drawer.open = true;
		document.body.append(drawer);
		vi.spyOn(drawer, "getBoundingClientRect").mockReturnValue({
			width: 300,
		} as DOMRect);
		const handle = drawer.querySelector<HTMLElement>("[data-tp-drawer-resize]");
		handle?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
		);
		expect(drawer.width).toBe("310px");
		handle?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
		);
		expect(drawer.width).toBe("160px");
		handle?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "End", bubbles: true }),
		);
		expect(drawer.width).toBe(`${window.innerWidth}px`);
		drawer.placement = "top";
		expect(handle?.hidden).toBe(true);
		drawer.placement = "bottom";
		expect(handle?.hidden).toBe(true);
		drawer.placement = "start";
		expect(handle?.hidden).toBe(false);
	});
	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("extends TpDrawer", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;

		expect(element).toBeInstanceOf(HTMLElement);
		expect(element).toBeInstanceOf(TpDrawer);
	});

	it("injects CSS once", () => {
		const first = document.createElement("tp-drawer") as TpDrawer;
		const second = document.createElement("tp-drawer") as TpDrawer;

		document.body.append(first, second);

		expect(document.head.querySelectorAll("#tp-drawer-styles")).toHaveLength(1);
	});

	it("creates internal header and content containers", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.innerHTML = "<p>Body</p>";
		document.body.append(element);

		expect(element.querySelector("[data-tp-drawer-header]")).not.toBeNull();
		expect(element.querySelector("[data-tp-drawer-content]")).not.toBeNull();
		expect(
			element.querySelector("[data-tp-drawer-content] p")?.textContent,
		).toBe("Body");
	});

	it("preserves the authored body in the help source before rendering internals", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.innerHTML = "<p>Body</p>";
		document.body.append(element);

		const source = element.getAttribute("data-source") ?? "";

		expect(source).toContain("<p>Body</p>");
		expect(source).not.toContain("data-tp-drawer-header");
		expect(source).not.toContain("data-tp-drawer-content");
	});

	it("uses end as default placement", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);

		expect(element.placement).toBe("end");
		expect(element.getAttribute("data-placement")).toBe("end");
	});

	it("reflects placement", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.placement = "start";

		expect(element.getAttribute("placement")).toBe("start");
		expect(element.placement).toBe("start");
	});

	it("reflects open property", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;

		expect(element.open).toBe(false);

		element.open = true;
		expect(element.hasAttribute("open")).toBe(true);

		element.open = false;
		expect(element.hasAttribute("open")).toBe(false);
	});

	it("reflects contained property", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;

		expect(element.contained).toBe(false);

		element.contained = true;
		expect(element.hasAttribute("contained")).toBe(true);

		element.contained = false;
		expect(element.hasAttribute("contained")).toBe(false);
	});

	it("reflects label property", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;

		element.label = "Settings";

		expect(element.getAttribute("label")).toBe("Settings");
		expect(element.label).toBe("Settings");
	});

	it("reflects width property and updates the drawer size token", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);

		element.width = "75%";

		expect(element.getAttribute("width")).toBe("75%");
		expect(element.width).toBe("75%");
		expect(element.style.getPropertyValue("--tp-drawer-size")).toBe("75%");

		element.width = "";

		expect(element.hasAttribute("width")).toBe(false);
		expect(element.style.getPropertyValue("--tp-drawer-size")).toBe("");
	});

	it("reflects backdrop property", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;

		expect(element.backdrop).toBe(false);

		element.backdrop = true;
		expect(element.hasAttribute("backdrop")).toBe(true);

		element.backdrop = false;
		expect(element.hasAttribute("backdrop")).toBe(false);
	});

	it("show() opens the drawer", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);

		element.show();

		expect(element.open).toBe(true);
		expect(element.getAttribute("data-open")).toBe("true");
	});

	it("hide() closes the drawer", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.open = true;
		document.body.append(element);

		element.hide();

		expect(element.open).toBe(false);
		expect(element.getAttribute("data-open")).toBe("false");
	});

	it("updates label in the header", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.setAttribute("label", "Settings");
		document.body.append(element);

		const title = element.querySelector("[data-tp-drawer-title]");
		expect(title?.textContent).toBe("Settings");
		expect((title as HTMLElement).hidden).toBe(false);
	});

	it("hides title when label is empty", () => {
		const element = document.createElement("tp-drawer");
		document.body.append(element);

		const title = element.querySelector(
			"[data-tp-drawer-title]",
		) as HTMLElement;
		expect(title.hidden).toBe(true);
	});

	it("close button hides the drawer", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.open = true;
		document.body.append(element);

		const button = element.querySelector(
			"[data-tp-drawer-close]",
		) as HTMLButtonElement;

		button.click();

		expect(element.open).toBe(false);
	});

	it("creates expand and collapse icon buttons in the header", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);

		const expandButton = element.querySelector("[data-tp-drawer-expand]");
		const collapseButton = element.querySelector("[data-tp-drawer-collapse]");
		const closeButton = element.querySelector("[data-tp-drawer-close]");

		expect(expandButton?.tagName).toBe("TP-ICON-BUTTON");
		expect(expandButton?.getAttribute("name")).toBe("arrow-expand-horizontal");
		expect(collapseButton?.tagName).toBe("TP-ICON-BUTTON");
		expect(collapseButton?.getAttribute("name")).toBe(
			"arrow-collapse-horizontal",
		);
		expect(closeButton?.tagName).toBe("TP-ICON-BUTTON");
		expect(closeButton?.getAttribute("name")).toBe("close");
	});

	it("expands and collapses width from the header buttons", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);

		const expandButton = element.querySelector(
			"[data-tp-drawer-expand]",
		) as HTMLElement;
		const collapseButton = element.querySelector(
			"[data-tp-drawer-collapse]",
		) as HTMLElement;

		expandButton.click();
		expect(element.width).toBe("100vw");
		expect(element.style.getPropertyValue("--tp-drawer-size")).toBe("100vw");

		collapseButton.click();
		expect(element.width).toBe("24rem");
		expect(element.style.getPropertyValue("--tp-drawer-size")).toBe("24rem");
	});

	it("creates a backdrop when backdrop is present", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.setAttribute("backdrop", "");
		document.body.append(element);

		const backdrop = document.body.querySelector("tp-drawer-backdrop");

		expect(backdrop).not.toBeNull();
		expect(backdrop?.getAttribute("data-open")).toBe("false");
	});

	it("updates backdrop when drawer opens", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.setAttribute("backdrop", "");
		document.body.append(element);

		element.show();

		const backdrop = document.body.querySelector("tp-drawer-backdrop");
		expect(backdrop?.getAttribute("data-open")).toBe("true");
	});

	it("appends contained backdrop to the parent element", () => {
		const parent = document.createElement("div");
		const element = document.createElement("tp-drawer") as TpDrawer;

		parent.append(element);
		document.body.append(parent);

		element.setAttribute("contained", "");
		element.setAttribute("backdrop", "");

		const backdrop = parent.querySelector("tp-drawer-backdrop");

		expect(backdrop).not.toBeNull();
		expect(backdrop?.getAttribute("data-contained")).toBe("true");
	});

	it("appends non-contained backdrop to document.body", () => {
		const parent = document.createElement("div");
		const element = document.createElement("tp-drawer") as TpDrawer;

		parent.append(element);
		document.body.append(parent);

		element.setAttribute("backdrop", "");

		const backdrop = document.body.querySelector("tp-drawer-backdrop");

		expect(backdrop).not.toBeNull();
		expect(backdrop?.getAttribute("data-contained")).toBe("false");
	});

	it("removes backdrop when backdrop attribute is removed", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.setAttribute("backdrop", "");
		document.body.append(element);

		element.removeAttribute("backdrop");

		expect(document.querySelector("tp-drawer-backdrop")).toBeNull();
	});

	it("backdrop clicks respect dynamic outside-click changes", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.setAttribute("backdrop", "");
		element.setAttribute("open", "");
		document.body.append(element);

		const backdrop = document.querySelector(
			"tp-drawer-backdrop",
		) as HTMLElement;
		backdrop.click();
		expect(element.open).toBe(true);

		element.outsideClick = true;
		backdrop.click();

		expect(element.open).toBe(false);

		element.open = true;
		element.outsideClick = false;
		backdrop.click();
		expect(element.open).toBe(true);
	});

	it("outside pointer clicks respect outside-click without a backdrop", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.open = true;
		document.body.append(element);
		document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
		expect(element.open).toBe(true);
		element.outsideClick = true;
		document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
		expect(element.open).toBe(false);
	});

	it("hides on Escape when open", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.setAttribute("open", "");
		document.body.append(element);

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

		expect(element.open).toBe(false);
	});

	it("dispatches tp-drawer-toggle when shown", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);

		const handler = vi.fn();
		element.addEventListener("tp-drawer-toggle", handler);

		element.show();

		expect(handler).toHaveBeenCalled();

		const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
		expect(event.detail.open).toBe(true);
		expect(event.detail.backdrop).toBe(false);
		expect(event.detail.contained).toBe(false);
		expect(event.detail.placement).toBe("end");
	});

	it("dispatches tp-drawer-toggle when hidden", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.open = true;
		document.body.append(element);

		const handler = vi.fn();
		element.addEventListener("tp-drawer-toggle", handler);

		element.hide();

		const event = handler.mock.calls.at(-1)?.[0] as CustomEvent;
		expect(event.detail.open).toBe(false);
	});

	it("does not dispatch the same toggle state twice", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.open = true;
		document.body.append(element);

		const handler = vi.fn();
		element.addEventListener("tp-drawer-toggle", handler);

		element.hide();
		element.hide();

		const falseStates = handler.mock.calls
			.map((call) => (call[0] as CustomEvent).detail.open)
			.filter((value) => value === false);

		expect(falseStates).toHaveLength(1);
	});

	it("retire les propriétés textuelles vidées", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		element.label = "Details";
		element.width = "20rem";
		expect(element.label).toBe("Details");
		expect(element.width).toBe("20rem");
		element.label = "";
		element.width = "";
		expect(element.hasAttribute("label")).toBe(false);
		expect(element.hasAttribute("width")).toBe(false);
	});

	it("accepte du HTML, un nœud ou plusieurs nœuds comme contenu", () => {
		const element = document.createElement("tp-drawer") as TpDrawer;
		document.body.append(element);
		element.setContent("<strong>HTML</strong>");
		expect(
			element.querySelector("[data-tp-drawer-content] strong")?.textContent,
		).toBe("HTML");
		const one = document.createElement("em");
		element.setContent(one);
		expect(element.querySelector("[data-tp-drawer-content] em")).toBe(one);
		const first = document.createTextNode("A");
		const second = document.createTextNode("B");
		element.setContent([first, second]);
		expect(element.querySelector("[data-tp-drawer-content]")?.textContent).toBe(
			"AB",
		);
	});
});
