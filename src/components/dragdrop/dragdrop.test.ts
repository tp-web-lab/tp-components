/**
 * @module dragdrop/test
 * @summary Tests for the `<tp-dragdrop>` component.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import "./dragdrop.js";
import type { TpDragdrop } from "./dragdrop.js";

if (typeof DragEvent === "undefined") {
	class DragEventPolyfill extends Event {
		public readonly dataTransfer: DataTransfer | null;
		public readonly clientY: number;

		public constructor(type: string, eventInitDict: DragEventInit = {}) {
			super(type, eventInitDict);
			this.dataTransfer = eventInitDict.dataTransfer ?? null;
			this.clientY = eventInitDict.clientY ?? 0;
		}
	}

	Object.defineProperty(globalThis, "DragEvent", {
		value: DragEventPolyfill,
		configurable: true,
		writable: true,
	});
}

/**
 * Waits for asynchronous DOM updates.
 *
 * @summary Waits for pending microtasks.
 * @returns Promise resolved on the next microtask.
 */
async function flush(): Promise<void> {
	await Promise.resolve();
}

/**
 * Returns the `<tp-dragdrop>` component.
 *
 * @summary Retrieves the component under test.
 * @returns The `<tp-dragdrop>` element.
 * @throws {Error} If the element is missing.
 */
function getDragdrop(): TpDragdrop {
	const element = document.querySelector("tp-dragdrop");

	if (!(element instanceof HTMLElement)) {
		throw new Error("tp-dragdrop not found");
	}

	return element as TpDragdrop;
}

/**
 * Finds an element by selector and checks that it is an `HTMLElement`.
 *
 * @summary Retrieves an HTML element from the document.
 * @param selector CSS selector.
 * @returns Matching HTML element.
 * @throws {Error} If no valid element is found.
 */
function getHtmlElement(selector: string): HTMLElement {
	const element = document.querySelector(selector);

	if (!(element instanceof HTMLElement)) {
		throw new Error(`element not found: ${selector}`);
	}

	return element;
}

/**
 * Simulates a complete drag-and-drop cycle.
 *
 * @summary Simulates dragstart → dragenter → dragover → drop → dragend.
 * @param source Source element.
 * @param target Target element.
 * @returns Mock `dataTransfer` object.
 */
async function simulateDragSequence(
	source: HTMLElement,
	target: HTMLElement,
): Promise<DataTransfer> {
	const dataTransfer = {
		effectAllowed: "",
		dropEffect: "",
		setData: vi.fn(),
		getData: vi.fn(),
	} as unknown as DataTransfer;

	source.dispatchEvent(
		new DragEvent("dragstart", {
			bubbles: true,
			cancelable: true,
			dataTransfer,
		}),
	);
	await flush();

	target.dispatchEvent(
		new DragEvent("dragenter", {
			bubbles: true,
			cancelable: true,
			dataTransfer,
			clientY: 10,
		}),
	);
	await flush();

	target.dispatchEvent(
		new DragEvent("dragover", {
			bubbles: true,
			cancelable: true,
			dataTransfer,
			clientY: 10,
		}),
	);
	await flush();

	target.dispatchEvent(
		new DragEvent("drop", {
			bubbles: true,
			cancelable: true,
			dataTransfer,
			clientY: 10,
		}),
	);
	await flush();

	source.dispatchEvent(
		new DragEvent("dragend", {
			bubbles: true,
			cancelable: true,
			dataTransfer,
		}),
	);
	await flush();

	return dataTransfer;
}

describe("<tp-dragdrop>", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("est défini", () => {
		expect(customElements.get("tp-dragdrop")).toBeDefined();
	});

	it("émet tp-dragdrop-start avec la source", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-start", listener);

		source.dispatchEvent(
			new DragEvent("dragstart", {
				bubbles: true,
				cancelable: true,
				dataTransfer: {
					effectAllowed: "",
					dropEffect: "",
					setData: vi.fn(),
					getData: vi.fn(),
				} as unknown as DataTransfer,
			}),
		);
		await flush();

		expect(listener).toHaveBeenCalledTimes(1);

		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.source).toBe(source);
	});

	it("marque les items comme draggable", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const first = getHtmlElement("#a");
		const second = getHtmlElement("#b");

		expect(first.getAttribute("draggable")).toBe("true");
		expect(second.getAttribute("draggable")).toBe("true");
		expect(first.tabIndex).toBe(0);
		expect(second.tabIndex).toBe(0);
		expect(document.querySelector('[role="status"]')).not.toBeNull();
	});

	it("permet de déplacer un item entièrement au clavier", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();
		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const target = getHtmlElement("#b");
		const start = vi.fn();
		const over = vi.fn();
		const drop = vi.fn();
		const end = vi.fn();
		dragdrop.addEventListener("tp-dragdrop-start", start);
		dragdrop.addEventListener("tp-dragdrop-over", over);
		dragdrop.addEventListener("tp-dragdrop-drop", drop);
		dragdrop.addEventListener("tp-dragdrop-end", end);

		source.dispatchEvent(
			new KeyboardEvent("keydown", { key: " ", bubbles: true }),
		);
		source.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
		);
		target.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
		);

		expect(start).toHaveBeenCalledTimes(1);
		expect(over).toHaveBeenCalledTimes(1);
		expect(drop).toHaveBeenCalledTimes(1);
		expect(end).toHaveBeenCalledTimes(1);
		expect(
			(drop.mock.calls[0]?.[0] as CustomEvent | undefined)?.detail,
		).toEqual({
			source,
			target,
			position: "after",
		});
		expect(target).toBe(document.activeElement);
		expect(document.querySelector('[role="status"]')?.textContent).toContain(
			"dropped after",
		);
	});

	it("annule un déplacement clavier avec Escape", async () => {
		document.body.innerHTML = `
      <div id="root"><div class="item" id="a">A</div></div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();
		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const end = vi.fn();
		dragdrop.addEventListener("tp-dragdrop-end", end);

		source.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
		);
		source.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
		);

		expect(end).toHaveBeenCalledTimes(1);
		expect(source.hasAttribute("data-tp-dragdrop-keyboard-source")).toBe(false);
		expect(document.querySelector('[role="status"]')?.textContent).toContain(
			"cancelled",
		);
	});

	it("émet tp-dragdrop-over avec une position before", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const target = getHtmlElement("#b");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-over", listener);

		vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: 100,
			bottom: 100,
			width: 100,
			height: 100,
			toJSON: () => ({}),
		});

		const dataTransfer = {
			effectAllowed: "",
			dropEffect: "",
			setData: vi.fn(),
			getData: vi.fn(),
		} as unknown as DataTransfer;

		source.dispatchEvent(
			new DragEvent("dragstart", {
				bubbles: true,
				cancelable: true,
				dataTransfer,
			}),
		);
		await flush();

		target.dispatchEvent(
			new DragEvent("dragover", {
				bubbles: true,
				cancelable: true,
				dataTransfer,
				clientY: 10,
			}),
		);
		await flush();

		expect(listener).toHaveBeenCalledTimes(1);

		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.source).toBe(source);
		expect(event.detail.target).toBe(target);
		expect(event.detail.position).toBe("before");
	});

	it("émet tp-dragdrop-over avec une position inside", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const target = getHtmlElement("#b");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-over", listener);

		vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: 100,
			bottom: 100,
			width: 100,
			height: 100,
			toJSON: () => ({}),
		});

		const dataTransfer = {
			effectAllowed: "",
			dropEffect: "",
			setData: vi.fn(),
			getData: vi.fn(),
		} as unknown as DataTransfer;

		source.dispatchEvent(
			new DragEvent("dragstart", {
				bubbles: true,
				cancelable: true,
				dataTransfer,
			}),
		);
		await flush();

		target.dispatchEvent(
			new DragEvent("dragover", {
				bubbles: true,
				cancelable: true,
				dataTransfer,
				clientY: 50,
			}),
		);
		await flush();

		expect(listener).toHaveBeenCalledTimes(1);

		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.position).toBe("inside");
	});

	it("émet tp-dragdrop-over avec une position after", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const target = getHtmlElement("#b");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-over", listener);

		vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: 100,
			bottom: 100,
			width: 100,
			height: 100,
			toJSON: () => ({}),
		});

		const dataTransfer = {
			effectAllowed: "",
			dropEffect: "",
			setData: vi.fn(),
			getData: vi.fn(),
		} as unknown as DataTransfer;

		source.dispatchEvent(
			new DragEvent("dragstart", {
				bubbles: true,
				cancelable: true,
				dataTransfer,
			}),
		);
		await flush();

		target.dispatchEvent(
			new DragEvent("dragover", {
				bubbles: true,
				cancelable: true,
				dataTransfer,
				clientY: 90,
			}),
		);
		await flush();

		expect(listener).toHaveBeenCalledTimes(1);

		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.position).toBe("after");
	});

	it("émet tp-dragdrop-drop avec source, target et position", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const target = getHtmlElement("#b");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-drop", listener);

		vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: 100,
			bottom: 100,
			width: 100,
			height: 100,
			toJSON: () => ({}),
		});

		await simulateDragSequence(source, target);

		expect(listener).toHaveBeenCalledTimes(1);

		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.source).toBe(source);
		expect(event.detail.target).toBe(target);
		expect(event.detail.position).toBe("before");
	});

	it("émet tp-dragdrop-end à la fin du drag", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">A</div>
        <div class="item" id="b">B</div>
      </div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const source = getHtmlElement("#a");
		const target = getHtmlElement("#b");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-end", listener);

		vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: 100,
			bottom: 100,
			width: 100,
			height: 100,
			toJSON: () => ({}),
		});

		await simulateDragSequence(source, target);

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it("n’autorise le dragstart que depuis le handle si handle est défini", async () => {
		document.body.innerHTML = `
      <div id="root">
        <div class="item" id="a">
          <span class="label">A</span>
          <button class="handle">drag</button>
        </div>
      </div>
      <tp-dragdrop root="#root" items=".item" handle=".handle"></tp-dragdrop>
    `;
		await flush();

		const dragdrop = getDragdrop();
		const item = getHtmlElement("#a");
		const label = getHtmlElement(".label");
		const handle = getHtmlElement(".handle");
		const listener = vi.fn();

		dragdrop.addEventListener("tp-dragdrop-start", listener);

		label.dispatchEvent(
			new DragEvent("dragstart", {
				bubbles: true,
				cancelable: true,
				dataTransfer: {
					effectAllowed: "",
					dropEffect: "",
					setData: vi.fn(),
					getData: vi.fn(),
				} as unknown as DataTransfer,
			}),
		);
		await flush();

		expect(listener).toHaveBeenCalledTimes(0);

		handle.dispatchEvent(
			new DragEvent("dragstart", {
				bubbles: true,
				cancelable: true,
				dataTransfer: {
					effectAllowed: "",
					dropEffect: "",
					setData: vi.fn(),
					getData: vi.fn(),
				} as unknown as DataTransfer,
			}),
		);
		await flush();

		expect(listener).toHaveBeenCalledTimes(1);

		const event = listener.mock.calls[0]?.[0] as CustomEvent;
		expect(event.detail.source).toBe(item);
	});

	it("reflète et retire les sélecteurs publics", () => {
		const dragdrop = document.createElement("tp-dragdrop") as TpDragdrop;
		dragdrop.root = "#root";
		dragdrop.items = ".item";
		dragdrop.handle = ".handle";
		expect(dragdrop.root).toBe("#root");
		expect(dragdrop.items).toBe(".item");
		expect(dragdrop.handle).toBe(".handle");
		dragdrop.root = "";
		dragdrop.items = "";
		dragdrop.handle = "";
		expect(dragdrop.hasAttribute("root")).toBe(false);
		expect(dragdrop.hasAttribute("items")).toBe(false);
		expect(dragdrop.hasAttribute("handle")).toBe(false);
	});

	it("tolère les sélecteurs invalides ou sans cible", async () => {
		document.body.innerHTML = `<tp-dragdrop root="[invalid" items=".item"></tp-dragdrop>`;
		await flush();
		const dragdrop = getDragdrop();
		dragdrop.root = "#missing";
		dragdrop.items = "[invalid";
		await flush();
		expect(document.querySelector('[role="status"]')).toBeNull();
	});

	it("reste inactif sans sélecteur root", async () => {
		const dragdrop = document.createElement("tp-dragdrop");
		document.body.append(dragdrop);
		await flush();

		expect(document.querySelector('[role="status"]')).toBeNull();
	});

	it("utilise le handle comme cible clavier", async () => {
		document.body.innerHTML = `
      <div id="root"><div class="item"><button class="handle">Move A</button></div></div>
      <tp-dragdrop root="#root" items=".item" handle=".handle"></tp-dragdrop>`;
		await flush();
		const item = getHtmlElement(".item");
		const handle = getHtmlElement(".handle");
		expect(item.getAttribute("draggable")).toBe("true");
		expect(handle.tabIndex).toBe(0);
		handle.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
		);
		handle.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
		);
	});

	it("annule un drag sans DataTransfer et ignore les événements hors item", async () => {
		document.body.innerHTML = `
      <div id="root"><div class="item" id="a">A</div><span id="outside">Outside</span></div>
      <tp-dragdrop root="#root" items=".item"></tp-dragdrop>`;
		await flush();
		const source = getHtmlElement("#a");
		const outside = getHtmlElement("#outside");
		const started = vi.fn();
		getDragdrop().addEventListener("tp-dragdrop-start", started);
		const start = new DragEvent("dragstart", {
			bubbles: true,
			cancelable: true,
		});
		source.dispatchEvent(start);
		expect(started).toHaveBeenCalledOnce();
		outside.dispatchEvent(
			new DragEvent("dragenter", { bubbles: true, cancelable: true }),
		);
		outside.dispatchEvent(
			new DragEvent("dragover", { bubbles: true, cancelable: true }),
		);
		outside.dispatchEvent(
			new DragEvent("drop", { bubbles: true, cancelable: true }),
		);
	});
});
