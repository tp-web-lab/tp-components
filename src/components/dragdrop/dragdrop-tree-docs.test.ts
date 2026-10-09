import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import "../tree/tree.js";

/** Returns the example's tree with its public API. */
function tree() {
	const element = document.querySelector("tp-tree");
	if (!element) throw new Error("Missing tree");
	return element;
}

/** Mounts the authored example used in the language tabs. */
beforeEach(() => {
	document.body.innerHTML = readFileSync(
		"public/docs/components/dragdrop/examples/tree-dragdrop.html",
		"utf8",
	);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

/** Finds a node by its stable authored identifier. */
function node(id: string): HTMLLIElement {
	const item = document.querySelector<HTMLLIElement>(
		`li[data-node-id="${id}"]`,
	);
	if (!item) throw new Error(`Missing project node: ${id}`);
	return item;
}

/** Exercises the native tree event handlers with a deterministic drop position. */
function move(
	source: HTMLLIElement,
	target: HTMLLIElement,
	clientY: number,
): void {
	vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
		top: 0,
		bottom: 100,
		height: 100,
		left: 0,
		right: 100,
		width: 100,
		x: 0,
		y: 0,
		toJSON: () => ({}),
	});
	const transfer = {
		setData: vi.fn(),
		effectAllowed: "none",
		dropEffect: "none",
	};
	for (const type of ["dragstart", "dragover", "drop"]) {
		const event = new Event(type, { bubbles: true, cancelable: true });
		Object.defineProperties(event, {
			dataTransfer: { value: transfer },
			clientY: { value: clientY },
		});
		(type === "dragstart" ? source : target).dispatchEvent(event);
	}
}

it("moves a file into a folder through the tree's internal tp-dragdrop", () => {
	const notes = node("notes");
	const folder = node("documentation");
	move(notes, folder, 50);
	expect(notes.parentElement).toBe(folder.querySelector(":scope > ul"));
	expect(folder.getAttribute("data-expanded")).toBe("true");
	const controllers = document.querySelectorAll("tp-dragdrop");
	expect(controllers).toHaveLength(1);
	expect(controllers[0]?.adapter?.root).toBe(document.querySelector("tp-tree"));
	expect(document.querySelector("[data-drop-target]")).toBeNull();
});

it("reorders sibling files without changing their parent", () => {
	const index = node("index");
	const app = node("app");
	move(index, app, 5);
	expect(index.nextElementSibling).toBe(app);
	expect(index.parentElement).toBe(node("source").querySelector(":scope > ul"));
});

it("moves complete subtrees but rejects a folder dropped into its descendant", () => {
	const folder = node("source");
	const child = node("app");
	move(folder, node("documentation"), 50);
	expect(folder.parentElement).toBe(
		node("documentation").querySelector(":scope > ul"),
	);
	expect(folder.contains(child)).toBe(true);
	const parent = folder.parentElement;
	move(folder, child, 50);
	expect(folder.parentElement).toBe(parent);
	expect(folder.contains(child)).toBe(true);
});

it("emits one unchanged tree move event through the controller", () => {
	const moved = vi.fn();
	const delegated = vi.fn();
	tree().addEventListener("tp-tree-node-move-request", moved);
	tree()
		.querySelector("tp-dragdrop")
		?.addEventListener("tp-dragdrop-drop", delegated);
	move(node("notes"), node("documentation"), 50);
	expect(delegated).toHaveBeenCalledOnce();
	expect(moved).toHaveBeenCalledOnce();
	expect(moved.mock.calls[0]?.[0].detail).toMatchObject({
		source: { nodeId: "notes" },
		destination: { nodeId: "documentation" },
		position: "inside",
	});
});

it("preserves the tree's 15 percent edge threshold and leaf fallback", () => {
	move(node("notes"), node("documentation"), 20);
	expect(node("notes").parentElement?.closest("li")).toBe(
		node("documentation"),
	);
	move(node("notes"), node("app"), 50);
	expect(node("app").nextElementSibling).toBe(node("notes"));
	move(node("notes"), node("project"), 5);
	expect(node("notes").parentElement?.closest("li")).toBe(node("project"));
});

it("honors live per-node drag and drop permissions", () => {
	const parent = node("notes").parentElement;
	tree().contextMenuConfig = {
		globalActions: [],
		getNodeCapabilities: () => ({ draggable: false, droppable: true }),
	};
	move(node("notes"), node("documentation"), 50);
	expect(node("notes").parentElement).toBe(parent);
	tree().contextMenuConfig = {
		globalActions: [],
		getNodeCapabilities: () => ({ draggable: true, droppable: false }),
	};
	move(node("notes"), node("documentation"), 50);
	expect(node("notes").parentElement).toBe(parent);
	tree().contextMenuConfig = {
		globalActions: [],
		getNodeCapabilities: () => ({ draggable: true, droppable: true }),
	};
	move(node("notes"), node("documentation"), 50);
	expect(node("notes").parentElement?.closest("li")).toBe(
		node("documentation"),
	);
});

it("reconnects one controller without duplicate move events or keyboard ownership", () => {
	const element = tree();
	const controller = element.querySelector("tp-dragdrop");
	const moved = vi.fn();
	element.addEventListener("tp-tree-node-move-request", moved);
	element.remove();
	document.body.append(element);
	expect(element.querySelectorAll("tp-dragdrop")).toHaveLength(1);
	expect(element.querySelector("tp-dragdrop")).toBe(controller);
	move(node("notes"), node("documentation"), 50);
	expect(moved).toHaveBeenCalledOnce();
	const start = vi.fn();
	controller?.addEventListener("tp-dragdrop-start", start);
	const keyboard = new KeyboardEvent("keydown", {
		key: "Enter",
		bubbles: true,
		cancelable: true,
	});
	node("notes").dispatchEvent(keyboard);
	expect(start).not.toHaveBeenCalled();
	expect(node("notes").hasAttribute("aria-grabbed")).toBe(false);
});

it("isolates multiple trees without requiring root identifiers", () => {
	const first = tree();
	const second = document.createElement("tp-tree");
	second.draggableNodes = true;
	second.innerHTML =
		'<ul><li data-node-id="other">Other<ul><li>Child</li></ul></li></ul>';
	document.body.append(second);
	const source = node("notes");
	const parent = source.parentElement;
	move(source, node("other"), 50);
	expect(source.parentElement).toBe(parent);
	expect(first.querySelector("tp-dragdrop")?.adapter?.root).toBe(first);
	expect(second.querySelector("tp-dragdrop")?.adapter?.root).toBe(second);
});
