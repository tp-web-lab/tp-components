import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TpDragdrop } from "../dragdrop/dragdrop.js";
import { normalizeMatchingValue, TpMatching } from "./matching.js";

/** Creates a connected matcher with two independently typed lists. */
function fixture(): TpMatching {
	const element = new TpMatching();
	element.innerHTML =
		'<ul><li>Hello</li><li><audio controls></audio>Goodbye</li></ul><ol><li>Bonjour</li><li><svg aria-label="Goodbye"></svg>Au revoir</li></ol>';
	document.body.append(element);
	return element;
}
/** Resolves a generated association control in source order. */
function control(element: TpMatching, index: number): HTMLElement {
	const node = element.querySelectorAll<HTMLElement>(
		".tp-matching-controls > tp-icon-button.tp-matching-select",
	)[index];
	if (!node) throw new Error("Missing selection control");
	return node;
}
/** Dispatches the shared drag controller's public integration events. */
function dragEvent(drag: TpDragdrop, name: string, detail: object): void {
	drag.dispatchEvent(new CustomEvent(`tp-dragdrop-${name}`, { detail }));
}
beforeEach(() => {
	vi.spyOn(Math, "random").mockReturnValue(0.999);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

describe("tp-matching", () => {
	it("always shuffles each list initially and on reset without changing author ranks", () => {
		vi.mocked(Math.random).mockReturnValue(0);
		const element = fixture();
		expect(Math.random).toHaveBeenCalledTimes(2);
		expect(element.querySelector("ul > li")?.textContent).toContain("Goodbye");
		control(element, 0).click();
		control(element, 2).click();
		expect(element.value).toEqual([{ left: 2, right: 2 }]);
		vi.mocked(Math.random).mockClear();
		element.reset();
		expect(Math.random).toHaveBeenCalledTimes(2);
		expect(element.value).toEqual([]);
		vi.mocked(Math.random).mockClear();
		element.reset();
		expect(Math.random).toHaveBeenCalledTimes(2);
		element.remove();
		vi.mocked(Math.random).mockClear();
		document.body.append(element);
		expect(Math.random).not.toHaveBeenCalled();
		expect(TpMatching.observedAttributes).not.toContain("shuffle");
	});
	it("cycles identity colors and restores author classes on reset", () => {
		const element = new TpMatching();
		const rows = Array.from(
			{ length: 7 },
			(_, index) =>
				`<li class="custom ${index === 0 ? "tp-orange" : ""}">${index + 1}</li>`,
		).join("");
		element.innerHTML = `<ul>${rows}</ul><ol>${rows}</ol>`;
		document.body.append(element);
		element.value = Array.from({ length: 7 }, (_, index) => ({
			left: index + 1,
			right: index + 1,
		}));
		const palette = [
			"tp-blue",
			"tp-violet",
			"tp-amber",
			"tp-cyan",
			"tp-orange",
			"tp-indigo",
			"tp-blue",
		];
		for (const list of element.querySelectorAll("[data-matching-list]")) {
			[...list.children].forEach((item, index) => {
				expect(item.className).toBe(`custom ${palette[index]}`);
				expect(item.textContent).toContain(`Pair ${index + 1}`);
			});
		}
		expect(element.querySelectorAll("li.tp-blue")).toHaveLength(4);
		element.reset();
		expect(element.querySelectorAll("li.tp-orange")).toHaveLength(2);
		expect(
			element.querySelectorAll(
				"li.tp-blue, li.tp-violet, li.tp-amber, li.tp-cyan, li.tp-indigo",
			),
		).toHaveLength(0);
	});
	it("renders titled columns and builds, edits and restores four-member groups", () => {
		const element = new TpMatching();
		element.innerHTML =
			"<dl><dt>Base form</dt><dd><ul><li>be</li><li>have</li></ul></dd><dt>Past simple</dt><dd><ol><li>was</li><li>had</li></ol></dd><dt>Past participle</dt><dd><ul><li>been</li><li>had</li></ul></dd><dt>French</dt><dd><ol><li>être</li><li>avoir</li></ol></dd></dl>";
		document.body.append(element);
		expect(element.columnCount).toBe(4);
		expect(element.itemCount).toBe(2);
		expect(element.querySelectorAll(".tp-matching-column > h3")).toHaveLength(
			4,
		);
		for (const list of element.querySelectorAll("[data-matching-list]"))
			expect(
				document.getElementById(list.getAttribute("aria-labelledby") ?? ""),
			).not.toBeNull();
		control(element, 0).click();
		control(element, 2).click();
		expect(element.value).toEqual([{ items: [1, 1, null, null] }]);
		expect(element.querySelectorAll("li.tp-blue")).toHaveLength(2);
		control(element, 4).click();
		control(element, 6).click();
		expect(element.value).toEqual([{ items: [1, 1, 1, 1] }]);
		expect(element.querySelectorAll("li.tp-blue")).toHaveLength(4);
		expect(element.complete).toBe(false);
		element.value = [{ items: [1, 1, 1, 1] }, { items: [2, 2, 2, 2] }];
		expect(element.complete).toBe(true);
		const third = element.querySelectorAll("[data-matching-list]")[2];
		third?.querySelector<HTMLElement>("li tp-icon-button")?.click();
		expect(element.value).toContainEqual({ items: [1, 1, null, 1] });
		expect(element.complete).toBe(false);
		control(element, 0).click();
		control(element, 5).click();
		expect(element.value).toContainEqual({ items: [1, 1, 2, 1] });
		expect(element.value).toContainEqual({ items: [2, 2, null, 2] });
		expect(element.querySelectorAll("li.tp-blue")).toHaveLength(4);
		expect(element.querySelectorAll("li.tp-violet")).toHaveLength(3);
		const change = vi.fn();
		element.addEventListener("change", change);
		control(element, 0).click();
		control(element, 2).click();
		expect(change).not.toHaveBeenCalled();
		control(element, 2).dispatchEvent(
			new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
		);
		vi.spyOn(Math, "random").mockReturnValue(0);
		element.reset();
		expect(
			element.querySelector("[data-matching-list] > li")?.textContent,
		).toContain("have");
		element.remove();
		document.body.append(element);
		expect(element.querySelectorAll("h3")).toHaveLength(4);
		element.reset();
		expect(element.value).toEqual([]);
	});
	it("supports three bare columns and partial groups starting outside the first list", () => {
		const element = new TpMatching();
		element.innerHTML =
			"<ul><li>A</li><li>B</li></ul><ol><li>C</li><li>D</li></ol><ul><li>E</li><li>F</li></ul>";
		document.body.append(element);
		control(element, 2).click();
		control(element, 4).click();
		expect(element.value).toEqual([{ items: [null, 1, 1] }]);
		control(element, 0).click();
		expect(element.value).toEqual([{ items: [1, 1, 1] }]);
		element.value = [{ items: [1, 1, null] }, { items: [2, 2, 2] }];
		const snapshot = element.value;
		if ("items" in (snapshot[0] ?? {}))
			(snapshot[0] as { items: (number | null)[] }).items[0] = null;
		expect(element.value).toContainEqual({ items: [1, 1, null] });
		expect(() => {
			element.value = [{ items: [1, null, null] }];
		}).toThrow(RangeError);
	});
	it("validates titled structures without consuming malformed author content", () => {
		for (const source of [
			"<dl><dt>Empty</dt><dd></dd></dl>",
			"<dl><dt></dt><dd><ul><li>A</li></ul></dd></dl>",
			"<dl><dd>Wrong order</dd><dt>Title</dt></dl>",
			"<ul><li>A</li></ul><dl><dt>Mixed</dt><dd><ul><li>B</li></ul></dd></dl>",
		]) {
			const element = new TpMatching();
			element.innerHTML = source;
			document.body.append(element);
			expect(element.querySelector("tp-callout")).not.toBeNull();
			expect(element.querySelector("dl")).not.toBeNull();
			element.remove();
		}
		const element = new TpMatching();
		element.innerHTML =
			"<dl><dt>Left</dt><dd><ul><li>A</li></ul></dd><dt>Right</dt><dd><ol><li>B</li></ol></dd></dl>";
		document.body.append(element);
		element.value = [{ left: 1, right: 1 }];
		expect(element.value).toEqual([{ left: 1, right: 1 }]);
	});
	it("normalizes snapshots atomically with complete and partial multi-list validation", () => {
		expect(normalizeMatchingValue([{ items: [null, 1, 2] }], 3, 2)).toEqual([
			{ items: [null, 1, 2] },
		]);
		for (const value of [
			null,
			[null],
			[{}],
			[{ items: [1, 2] }],
			[{ items: [1, 2, NaN] }],
			[{ items: [1, 1, 1] }, { items: [2, 1, 2] }],
			[{ items: [1, 1, 3] }],
			[{ items: [1] }],
			[{ items: [1, null, null] }],
		])
			expect(normalizeMatchingValue(value, 3, 2)).toBeNull();
		expect(normalizeMatchingValue([], 0, 0)).toBeNull();
		expect(
			normalizeMatchingValue([{ items: [1, 1, null] }], 3, 1, true),
		).toBeNull();
		expect(normalizeMatchingValue([{ items: [1, 1, 1] }], 3, 1, true)).toEqual([
			{ items: [1, 1, 1] },
		]);
	});
	it("creates unique associations, changes them and preserves live rich content", () => {
		const element = fixture();
		const audio = element.querySelector("audio");
		const change = vi.fn();
		element.addEventListener("change", change);
		audio?.click();
		expect(element.value).toEqual([]);
		control(element, 0).click();
		control(element, 2).click();
		expect(element.value).toEqual([{ left: 1, right: 1 }]);
		expect(change.mock.calls[0]?.[0].detail.complete).toBe(false);
		control(element, 1).click();
		control(element, 3).click();
		expect(change.mock.calls[1]?.[0].detail.complete).toBe(true);
		control(element, 2).click();
		control(element, 1).click();
		expect(element.value).toEqual([{ left: 2, right: 1 }]);
		expect(element.querySelector("audio")).toBe(audio);
		expect(element.querySelectorAll("svg[aria-label='Goodbye']")).toHaveLength(
			1,
		);
		const copy = element.value;
		copy.pop();
		expect(element.value).toHaveLength(1);
		const clear = element.querySelector<HTMLElement>(
			"li[data-matching-paired] tp-icon-button",
		);
		clear?.click();
		expect(element.value).toEqual([]);
	});
	it("selects card content while preserving embedded controls and cancelled clicks", () => {
		const element = fixture();
		const left = element.querySelector<HTMLElement>("ul > li");
		const right = element.querySelector<HTMLElement>("ol > li");
		if (!left || !right) throw new Error("Missing cards");
		left.click();
		expect(left.hasAttribute("data-matching-selected")).toBe(true);
		const content = right.querySelector(".tp-matching-content");
		if (!content) throw new Error("Missing content");
		content.innerHTML =
			'<a href="#"><span>Link</span></a><button>Action</button><input><label>Label</label><audio controls></audio><video controls></video><span contenteditable="true">Edit</span><span role="button">Custom button</span><tp-textfield></tp-textfield><span tabindex="0">Focusable</span>';
		for (const control of content.querySelectorAll<HTMLElement>(
			"a span, button, input, label, audio, video, [contenteditable], [role], tp-textfield, [tabindex]",
		)) {
			control.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true }),
			);
			expect(element.value).toEqual([]);
			expect(left.hasAttribute("data-matching-selected")).toBe(true);
		}
		const shadowHost = document.createElement("div");
		const shadow = shadowHost.attachShadow({ mode: "open" });
		const button = document.createElement("button");
		shadow.append(button);
		content.append(shadowHost);
		button.click();
		expect(element.value).toEqual([]);
		const cancelled = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
		});
		cancelled.preventDefault();
		right.dispatchEvent(cancelled);
		expect(element.value).toEqual([]);
		content.innerHTML =
			'<tp-icon name="home"><svg><path></path></svg></tp-icon>';
		content
			.querySelector("path")
			?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(element.value).toEqual([{ left: 1, right: 1 }]);
		element.reset();
		element.disabled = true;
		left.click();
		expect(left.hasAttribute("data-matching-selected")).toBe(false);
	});
	it("selects from either list, cancels and honors disabled", () => {
		const element = fixture();
		const select = control(element, 0);
		expect(select.tagName).toBe("TP-ICON-BUTTON");
		expect(select.getAttribute("name")).toBe("link");
		expect(select.parentElement?.lastElementChild).toBe(select);
		expect(select.querySelector("button")?.getAttribute("aria-label")).toBe(
			"Select list 1 item 1",
		);
		control(element, 0).click();
		expect(select.querySelector("button")?.getAttribute("aria-pressed")).toBe(
			"true",
		);
		expect(select.getAttribute("label")).toBe(
			"Cancel selection of list 1 item 1",
		);
		control(element, 0).click();
		expect(element.querySelector("[data-matching-selected]")).toBeNull();
		control(element, 0).click();
		control(element, 1).click();
		control(element, 1).dispatchEvent(
			new KeyboardEvent("keydown", { key: "x", bubbles: true }),
		);
		expect(element.querySelector("[data-matching-selected]")).not.toBeNull();
		control(element, 1).dispatchEvent(
			new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
		);
		expect(element.querySelector("[data-matching-selected]")).toBeNull();
		control(element, 0).click();
		element.disabled = true;
		expect(element.disabled).toBe(true);
		control(element, 2).click();
		expect(element.value).toEqual([]);
		element.disabled = false;
		control(element, 3).click();
		control(element, 0).click();
		expect(element.value).toEqual([{ left: 1, right: 2 }]);
		element.reset();
		element.reset();
		expect(element.value).toEqual([]);
		element.dispatchEvent(new Event("click"));
	});
	it("restores values atomically and preserves identity across shuffle and reconnect", () => {
		const element = fixture();
		const original = [...element.querySelectorAll(":scope > ul > li")];
		element.value = [
			{ left: 2, right: 1 },
			{ left: 1, right: 2 },
		];
		expect(element.value[0]).toEqual({ left: 1, right: 2 });
		for (const value of [
			[{ left: 0, right: 1 }],
			[{ left: 1, right: 3 }],
			[
				{ left: 1, right: 1 },
				{ left: 1, right: 2 },
			],
			[
				{ left: 1, right: 1 },
				{ left: 2, right: 1 },
			],
		])
			expect(() => {
				element.value = value;
			}).toThrow(RangeError);
		expect(element.value).toHaveLength(2);
		vi.spyOn(Math, "random").mockReturnValue(0);
		element.reset();
		expect(element.querySelector("ul > li")).toBe(original[1]);
		vi.mocked(Math.random).mockReturnValue(0.999);
		element.reset();
		expect(element.querySelector("ul > li")).toBe(original[0]);
		element.value = [
			{ left: 1, right: 2 },
			{ left: 2, right: 1 },
		];
		element.remove();
		document.body.append(element);
		expect(element.querySelectorAll(".tp-matching-controls")).toHaveLength(4);
		expect(element.value).toHaveLength(2);
	});
	it("waits for complete author content and explains malformed lists", async () => {
		const element = new TpMatching();
		document.body.append(element);
		expect(element.querySelector("tp-callout")?.textContent).toContain(
			"same number",
		);
		element.insertAdjacentHTML(
			"afterbegin",
			"<ul><li>A</li><li>B</li></ul><ul><li>C</li></ul>",
		);
		await vi.waitFor(() =>
			expect(element.querySelector("tp-callout")).not.toBeNull(),
		);
		element
			.querySelectorAll("ul")[1]
			?.insertAdjacentHTML("beforeend", "<li>D</li>");
		await vi.waitFor(() =>
			expect(element.querySelectorAll(".tp-matching-controls")).toHaveLength(4),
		);
		expect(element.querySelector("tp-callout")).toBeNull();
	});
	it("delegates drag-and-drop and does not grab embedded media or nested components", () => {
		const element = fixture();
		const drag = element.querySelector<TpDragdrop>("tp-dragdrop");
		if (!drag?.adapter) throw new Error("Missing adapter");
		const adapter = drag.adapter;
		const event = new Event("dragstart");
		Object.defineProperty(event, "target", { value: control(element, 0) });
		const left = element.querySelector("ul > li");
		const right = element.querySelector("ol > li");
		if (!(left instanceof HTMLElement) || !(right instanceof HTMLElement))
			throw new Error("Missing items");
		expect(adapter.getItem(event)).toBe(left);
		expect(adapter.canStart(event as DragEvent)).toBe(true);
		expect(adapter.canDrop(right)).toBe(false);
		dragEvent(drag, "start", { source: left });
		expect(adapter.canDrop(right)).toBe(true);
		expect(adapter.canDrop(left)).toBe(false);
		expect(adapter.getPosition(event as DragEvent, right)).toBe("inside");
		expect(adapter.getData(left)).toBe("tp-matching");
		dragEvent(drag, "drop", {
			source: left,
			target: right,
			position: "inside",
		});
		dragEvent(drag, "end", {});
		expect(element.value).toEqual([{ left: 1, right: 1 }]);
		element.disabled = true;
		expect(adapter.canStart(event as DragEvent)).toBe(false);
		dragEvent(drag, "drop", { target: right });
		dragEvent(drag, "start", { source: document.createElement("div") });
		expect(adapter.getItem(new Event("dragstart"))).toBeNull();
		const nested = document.createElement("tp-matching");
		left.append(nested);
		const nestedEvent = new Event("click");
		Object.defineProperty(nestedEvent, "target", { value: nested });
		expect(adapter.getItem(nestedEvent)).toBeNull();
	});
});

it("uses the first list as rich headings and preserves ranks and nodes across heading changes", () => {
	const matching = new TpMatching();
	matching.heading = true;
	matching.innerHTML =
		"<ul><li><em>English</em></li><li>French</li></ul><ul><li>Hello</li><li>Bye</li></ul><ol><li>Bonjour</li><li>Salut</li></ol>";
	const rich = matching.querySelector("em");
	const item = matching.querySelectorAll("ul")[1]?.firstElementChild;
	document.body.append(matching);
	expect(matching.columnCount).toBe(2);
	expect(matching.itemCount).toBe(2);
	expect(
		[...matching.querySelectorAll("h3")].map((h) => h.textContent),
	).toEqual(["English", "French"]);
	expect(matching.querySelector("h3 em")).toBe(rich);
	matching.value = [
		{ left: 1, right: 1 },
		{ left: 2, right: 2 },
	];
	expect(matching.complete).toBe(true);
	matching.reset();
	expect(matching.querySelector("h3 em")).toBe(rich);
	matching.heading = false;
	expect(matching.columnCount).toBe(3);
	expect(matching.querySelectorAll("h3")).toHaveLength(0);
	matching.heading = true;
	expect(matching.columnCount).toBe(2);
	expect(matching.querySelector("h3 em")).toBe(rich);
	expect([...matching.querySelectorAll("[data-matching-list] > li")]).toContain(
		item,
	);
	expect(matching.querySelectorAll(".tp-matching-controls")).toHaveLength(4);
	matching.remove();
	document.body.append(matching);
	expect(matching.columnCount).toBe(2);
});
it("validates heading count independently from the number of matching items", () => {
	const matching = new TpMatching();
	matching.heading = true;
	matching.innerHTML =
		"<ul><li>A</li><li>B</li></ul><ul><li>1</li><li>2</li><li>3</li></ul><ul><li>x</li><li>y</li><li>z</li></ul>";
	document.body.append(matching);
	expect(matching.itemCount).toBe(3);
	expect(matching.columnCount).toBe(2);
	const invalid = new TpMatching();
	invalid.heading = true;
	invalid.innerHTML =
		"<ul><li>Only one</li></ul><ul><li>1</li></ul><ul><li>x</li></ul>";
	document.body.append(invalid);
	expect(invalid.columnCount).toBe(0);
	expect(invalid.querySelector("tp-callout")).not.toBeNull();
	expect(invalid.querySelectorAll(":scope > ul")).toHaveLength(3);
});
