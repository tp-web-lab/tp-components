import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { TpPostIt } from "./post-it.js";

/** Flushes content moves triggered by parser insertion or author edits. */
async function settle(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}
/** Creates an independently connected note. */
function fixture(): TpPostIt {
	const note = new TpPostIt();
	document.body.append(note);
	return note;
}
afterEach(() => {
	document.body.replaceChildren();
});

it("supports every shared color preset without leaving previous paper colors", () => {
	const note = fixture();
	TpPostIt.colors.forEach((color) => {
		note.color = color;
		expect(note.color).toBe(color);
		const paper = note.querySelector("tp-box");
		expect(paper?.classList.contains(`tp-${color}`)).toBe(true);
		expect(
			TpPostIt.colors.filter((value) =>
				paper?.classList.contains(`tp-${value}`),
			),
		).toEqual([color]);
	});
});

it("uses note semantics and shared paper colors, with an expanded persistent pin", () => {
	const note = fixture();
	expect(note.getAttribute("role")).toBe("note");
	expect(note.color).toBe("yellow");
	expect(note.heading).toBe("");
	expect(note.rotation).toBe(0);
	expect(note.lite).toBe(false);
	expect(note.querySelector("tp-box")?.classList.contains("tp-yellow")).toBe(
		true,
	);
	expect(
		note
			.querySelector("[data-post-it-pin] button")
			?.getAttribute("aria-expanded"),
	).toBe("true");
	expect(note.hidden).toBe(false);
	const second = fixture();
	expect(second.querySelector("tp-box")).not.toBeNull();
	expect(document.querySelectorAll("#tp-post-it-styles")).toHaveLength(1);
});

it("defaults and clamps opacity while preserving the paper and folded state", () => {
	const note = fixture();
	const paper = note.querySelector<HTMLElement>("[data-post-it-paper]");
	expect(note.opacity).toBe(1);
	expect(paper?.style.opacity).toBe("1");
	note.opacity = 0.45;
	expect(note.getAttribute("opacity")).toBe("0.45");
	expect(paper?.style.opacity).toBe("0.45");
	note.lite = true;
	expect(paper?.style.opacity).toBe("0.45");
	note.opacity = -2;
	expect(note.opacity).toBe(0);
	expect(paper?.style.opacity).toBe("0");
	note.opacity = 2;
	expect(note.opacity).toBe(1);
	["invalid", "", " ", "Infinity"].forEach((value) => {
		note.setAttribute("opacity", value);
		expect(note.opacity).toBe(1);
		expect(paper?.style.opacity).toBe("1");
	});
	note.opacity = 0.5;
	note.removeAttribute("opacity");
	expect(paper?.style.opacity).toBe("1");
	expect(note.querySelector("[data-post-it-paper]")).toBe(paper);
});

it("updates attributes without rebuilding content, clamps rotation and preserves author roles", async () => {
	const note = new TpPostIt();
	note.setAttribute("role", "region");
	note.heading = "Before connection";
	note.color = "blue";
	note.rotation = -3;
	note.lite = true;
	const input = document.createElement("tp-textfield");
	input.setAttribute("value", "Remember me");
	note.append(input);
	document.body.append(note);
	const paper = note.querySelector("tp-box");
	expect(note.getAttribute("role")).toBe("region");
	expect(note.querySelector("tp-textfield")).toBe(input);
	note.heading = "<em>Plain text</em>";
	note.color = "pink";
	note.rotation = 100;
	expect(note.querySelector("[data-post-it-heading]")?.textContent).toBe(
		"<em>Plain text</em>",
	);
	expect(note.querySelector("em")).toBeNull();
	expect(note.querySelector("tp-box")).toBe(paper);
	expect(paper?.classList.contains("tp-blue")).toBe(false);
	expect(paper?.classList.contains("tp-pink")).toBe(true);
	expect(note.rotation).toBe(12);
	note.rotation = -100;
	expect(note.rotation).toBe(-12);
	note.setAttribute("rotation", "invalid");
	expect(note.rotation).toBe(0);
	note.setAttribute("color", "invalid");
	expect(note.color).toBe("yellow");
	note.setAttribute("lite", "false");
	expect(note.lite).toBe(true);
	expect(
		note.querySelector<HTMLElement>("[data-post-it-content]")?.hidden,
	).toBe(true);
	note.lite = false;
	expect(
		note.querySelector<HTMLElement>("[data-post-it-content]")?.hidden,
	).toBe(false);
	note.heading = " ";
	expect(
		note.querySelector<HTMLElement>("[data-post-it-heading]")?.hidden,
	).toBe(true);
	note.setAttribute("lang", "en");
	note.remove();
	document.body.append(note);
	await settle();
	expect(note.querySelector("tp-textfield")).toBe(input);
});

it("preserves late author nodes and their event listeners, and accepts replaced content", async () => {
	const note = fixture();
	const button = document.createElement("button");
	const handler = vi.fn();
	button.addEventListener("click", handler);
	note.append(button);
	await settle();
	expect(note.querySelector("[data-post-it-content]")?.contains(button)).toBe(
		true,
	);
	button.click();
	expect(handler).toHaveBeenCalledOnce();
	note.innerHTML = "<p>Replacement</p>";
	await settle();
	expect(note.querySelector("[data-post-it-content] p")?.textContent).toBe(
		"Replacement",
	);
	expect(note.querySelectorAll("tp-box")).toHaveLength(1);
});

it("toggles from the pin without losing focus, content or disclosure semantics", async () => {
	const note = fixture();
	note.heading = "Reminder";
	expect(note.querySelector("[data-post-it-pin]")?.getAttribute("name")).toBe(
		"pin",
	);
	const listener = vi.fn();
	note.addEventListener("tp-post-it-toggle", listener);
	const paper = note.querySelector("tp-box");
	const button = note.querySelector<HTMLButtonElement>(
		"[data-post-it-pin] button",
	);
	button?.focus();
	button?.click();
	expect(note.lite).toBe(true);
	expect(note.hidden).toBe(false);
	expect(button?.getAttribute("aria-expanded")).toBe("false");
	expect(button?.getAttribute("aria-controls")).toBe(
		note.querySelector("[data-post-it-content]")?.id,
	);
	expect(button?.getAttribute("aria-label")).toBe("Open note: Reminder");
	expect(document.activeElement).toBe(button);
	expect(listener).toHaveBeenCalledOnce();
	button?.click();
	expect(note.lite).toBe(false);
	expect(button?.getAttribute("aria-expanded")).toBe("true");
	expect(listener.mock.calls[0]?.[0].detail).toEqual({ lite: true });
	expect(listener.mock.calls[1]?.[0].detail).toEqual({ lite: false });
	expect(note.querySelector("tp-box")).toBe(paper);
	const input = document.createElement("input");
	input.value = "Retained";
	note.append(input);
	await settle();
	input.focus();
	note.lite = true;
	expect(document.activeElement).toBe(button);
	note.lite = false;
	expect(input.value).toBe("Retained");
	const second = fixture();
	expect(second.querySelector("[data-post-it-content]")?.id).not.toBe(
		note.querySelector("[data-post-it-content]")?.id,
	);
});

it("includes self-contained viewers in the documentation without nesting them", () => {
	const documentation = readFileSync(
		"public/docs/components/post-it/index.md",
		"utf8",
	);
	["html", "adoc", "md", "rst"].forEach((extension) => {
		expect(documentation).toContain(
			`::include{examples/examples.${extension}}`,
		);
	});
	expect(documentation).not.toMatch(
		/<tp-[\w-]*viewer\s+src="examples\/examples\./,
	);
});

/** Dispatches pointer-shaped events in the DOM-only test environment. */
function pointer(
	target: EventTarget,
	type: string,
	x: number,
	y: number,
	id = 1,
	button = 0,
): void {
	const event = new MouseEvent(type, {
		bubbles: true,
		cancelable: true,
		clientX: x,
		clientY: y,
		button,
	});
	Object.defineProperty(event, "pointerId", { value: id });
	target.dispatchEvent(event);
}

it("floats in a nonmodal top layer and clamps movement to the viewport", async () => {
	const note = fixture();
	const show = vi.fn();
	Object.defineProperty(note, "showPopover", {
		value: show,
		configurable: true,
	});
	vi.spyOn(note, "getBoundingClientRect").mockReturnValue(
		new DOMRect(30, 40, 320, 200),
	);
	await new Promise((resolve) => setTimeout(resolve, 5));
	expect(show).toHaveBeenCalled();
	expect(note.getAttribute("popover")).toBe("manual");
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("30px");
	note.moveTo(100000, -10);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe(
		`${window.innerWidth - 328}px`,
	);
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("8px");
	note.moveTo(NaN, 30);
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("8px");
	window.dispatchEvent(new Event("resize"));
	note.lite = true;
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("8px");
	note.remove();
	document.body.append(note);
	await new Promise((resolve) => setTimeout(resolve, 5));
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("8px");
});

it("does not drag or move from header buttons", () => {
	const note = fixture();
	note.moveTo(100, 100);
	expect(note.querySelector("[data-post-it-grip]")).toBeNull();
	const reset = note.querySelector<HTMLElement>("[data-post-it-reset]");
	if (!reset) throw new Error("Missing reset");
	pointer(reset, "pointerdown", 0, 0);
	expect(note.hasAttribute("data-post-it-dragging")).toBe(false);
	reset.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("100px");
});

it("drags only from the header, commits or cancels, and releases listeners on removal", () => {
	const note = fixture();
	note.moveTo(100, 100);
	const header = note.querySelector<HTMLElement>("[data-post-it-header]");
	if (!header) throw new Error("Missing header");
	const release = vi.fn();
	Object.defineProperties(header, {
		setPointerCapture: { value: vi.fn() },
		hasPointerCapture: { value: () => true },
		releasePointerCapture: { value: release },
	});
	pointer(header, "pointerdown", 10, 10, 1, 2);
	expect(note.hasAttribute("data-post-it-dragging")).toBe(false);
	pointer(header, "pointerdown", 10, 10);
	pointer(header, "pointerdown", 12, 12, 2);
	pointer(document, "pointermove", 50, 60, 2);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("100px");
	pointer(document, "pointermove", 50, 60);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("140px");
	pointer(document, "pointerup", 50, 60, 2);
	expect(note.hasAttribute("data-post-it-dragging")).toBe(true);
	pointer(document, "pointerup", 50, 60);
	expect(note.hasAttribute("data-post-it-dragging")).toBe(false);
	expect(release).toHaveBeenCalled();
	pointer(header, "pointerdown", 0, 0);
	pointer(document, "pointermove", 30, 30);
	document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
	document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("140px");
	pointer(header, "pointerdown", 0, 0);
	pointer(document, "pointermove", 20, 20);
	pointer(document, "pointercancel", 20, 20, 2);
	expect(note.hasAttribute("data-post-it-dragging")).toBe(true);
	pointer(document, "pointercancel", 20, 20);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("140px");
	pointer(header, "pointerdown", 0, 0);
	pointer(document, "pointermove", 20, 20);
	window.dispatchEvent(new Event("blur"));
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("140px");
	pointer(header, "pointerdown", 0, 0);
	note.remove();
	pointer(document, "pointermove", 200, 200);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("140px");
});

it("follows nested scrolling without snapping back when folded or resized", () => {
	const panel = document.createElement("div");
	document.body.append(panel);
	const note = fixture();
	panel.append(note);
	note.moveTo(100, 100);
	panel.scrollTop = 240;
	panel.scrollLeft = 30;
	panel.dispatchEvent(new Event("scroll"));
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("-140px");
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("70px");
	note.lite = true;
	window.dispatchEvent(new Event("resize"));
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("-140px");
	panel.scrollTop = 0;
	panel.scrollLeft = 0;
	panel.dispatchEvent(new Event("scroll"));
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("100px");
	note.remove();
	panel.scrollTop = 200;
	panel.dispatchEvent(new Event("scroll"));
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("100px");
});

it("resets to the loading position after movement and scrolling, preserving folded content", async () => {
	const panel = document.createElement("div");
	document.body.append(panel);
	panel.scrollTop = 40;
	const note = fixture();
	panel.append(note);
	note.heading = "Reminder";
	vi.spyOn(note, "getBoundingClientRect").mockReturnValue(
		new DOMRect(30, 80, 320, 200),
	);
	await new Promise((resolve) => setTimeout(resolve, 5));
	const header = note.querySelector("[data-post-it-header]");
	expect(
		Array.from(header?.children ?? []).map((element) =>
			element.hasAttribute("data-post-it-heading")
				? "heading"
				: element.getAttribute("name"),
		),
	).toEqual(["pin", "heading", "refresh"]);
	note.moveTo(300, 250);
	panel.scrollTop = 200;
	panel.dispatchEvent(new Event("scroll"));
	note.lite = true;
	const content = note.querySelector("[data-post-it-content]");
	note.querySelector<HTMLButtonElement>("[data-post-it-reset] button")?.click();
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("30px");
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("-80px");
	expect(note.lite).toBe(true);
	expect(note.querySelector("[data-post-it-content]")).toBe(content);
	note.moveTo(200, 200);
	note.resetPosition();
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("-80px");
	panel.scrollTop = 40;
	panel.dispatchEvent(new Event("scroll"));
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("80px");
});

it("hides movement controls in lite mode and cancels dragging", () => {
	const note = fixture();
	note.moveTo(100, 100);
	const header = note.querySelector<HTMLElement>("[data-post-it-header]");
	const reset = note.querySelector<HTMLElement>("[data-post-it-reset]");
	if (!header || !reset) throw new Error("Missing controls");
	header.focus();
	pointer(header, "pointerdown", 0, 0);
	pointer(document, "pointermove", 30, 30);
	note.lite = true;
	expect(header.tabIndex).toBe(-1);
	expect(reset.hidden).toBe(true);
	expect(document.activeElement).toBe(
		note.querySelector("[data-post-it-pin] button"),
	);
	expect(note.hasAttribute("data-post-it-dragging")).toBe(false);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("100px");
	pointer(header, "pointerdown", 0, 0);
	pointer(document, "pointermove", 50, 50);
	header.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("100px");
	note.lite = false;
	expect(header.tabIndex).toBe(0);
	expect(reset.hidden).toBe(false);
	expect(reset.getAttribute("name")).toBe("refresh");
});

it("anchors the pin to the dropped element through reflow and releases frame tracking", async () => {
	const target = document.createElement("div");
	document.body.append(target);
	const note = fixture();
	let targetX = 0;
	let targetWidth = 400;
	vi.spyOn(target, "getBoundingClientRect").mockImplementation(
		() => new DOMRect(targetX, 0, targetWidth, 400),
	);
	const pin = note.querySelector<HTMLElement>("[data-post-it-pin]");
	if (!pin) throw new Error("Missing pin");
	vi.spyOn(pin, "getBoundingClientRect").mockImplementation(
		() =>
			new DOMRect(
				Number.parseFloat(note.style.getPropertyValue("--tp-post-it-x")) || 0,
				Number.parseFloat(note.style.getPropertyValue("--tp-post-it-y")) || 0,
				20,
				20,
			),
	);
	const hitTest = Object.getOwnPropertyDescriptor(
		document,
		"elementsFromPoint",
	);
	Object.defineProperty(document, "elementsFromPoint", {
		configurable: true,
		value: () => [pin, target],
	});
	try {
		note.moveTo(90, 90);
		await new Promise((resolve) => setTimeout(resolve, 40));
		targetX = 100;
		targetWidth = 800;
		note.lite = true;
		await new Promise((resolve) => setTimeout(resolve, 40));
		expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("190px");
		target.remove();
		await new Promise((resolve) => setTimeout(resolve, 40));
		expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("190px");
		note.remove();
	} finally {
		if (hitTest) Object.defineProperty(document, "elementsFromPoint", hitTest);
		else Reflect.deleteProperty(document, "elementsFromPoint");
	}
});

it("drags the lite pin without opening it and preserves click and keyboard activation", () => {
	const note = fixture();
	note.lite = true;
	note.moveTo(100, 100);
	const pin = note.querySelector<HTMLElement>("[data-post-it-pin]");
	if (!pin) throw new Error("Missing pin");
	pointer(pin, "pointerdown", 0, 0);
	pointer(document, "pointermove", 2, 2);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("100px");
	pointer(document, "pointermove", 40, 30);
	pointer(document, "pointerup", 40, 30);
	pin.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
	expect(note.lite).toBe(true);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("140px");
	pin.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("150px");
	pointer(pin, "pointerdown", 0, 0);
	pointer(document, "pointerup", 0, 0);
	pin.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
	expect(note.lite).toBe(false);
	note.lite = true;
	pointer(pin, "pointerdown", 0, 0);
	pointer(document, "pointermove", 40, 30);
	document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
	pin.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
	expect(note.lite).toBe(true);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("150px");
	pin.querySelector("button")?.click();
	expect(note.lite).toBe(false);
});

it("moves by keyboard on the header, with Shift for fine movement", () => {
	const note = fixture();
	note.moveTo(100, 100);
	const header = note.querySelector("[data-post-it-header]");
	header?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("110px");
	header?.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "ArrowDown",
			shiftKey: true,
			bubbles: true,
		}),
	);
	expect(note.style.getPropertyValue("--tp-post-it-y")).toBe("101px");
	header?.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "ArrowLeft",
			ctrlKey: true,
			bubbles: true,
		}),
	);
	header?.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	expect(note.style.getPropertyValue("--tp-post-it-x")).toBe("110px");
});
