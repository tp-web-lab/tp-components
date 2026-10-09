import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, beforeEach, expect, it } from "vitest";
import "./dragdrop.js";

/** Uses the actual introduction and the same script as the four markup examples. */
const documentation = readFileSync(
	"public/docs/components/dragdrop/index.md",
	"utf8",
);
const script = readFileSync(
	"public/docs/components/dragdrop/examples/task-board.js",
	"utf8",
);

/** Retrieves a required element from the mounted example. */
function element(selector: string): HTMLElement {
	const found = document.querySelector<HTMLElement>(selector);
	if (!found) throw new Error(`Missing example element: ${selector}`);
	return found;
}

/** Dispatches a native drag event without requiring a browser DataTransfer object. */
function drag(target: HTMLElement, type: string): Event {
	const event = new Event(type, { bubbles: true, cancelable: true });
	Object.defineProperties(event, {
		dataTransfer: { value: null },
		clientY: { value: 0 },
	});
	target.dispatchEvent(event);
	return event;
}

beforeEach(async () => {
	const start = documentation.indexOf('<tp-box id="dragdrop-board"');
	const end = documentation.indexOf("\n## Usage", start);
	document.body.innerHTML = documentation.slice(start, end);
	await runInNewContext(script, { document, customElements });
});

afterEach(() => document.body.replaceChildren());

it("initializes three draggable tasks and moves one with its button", () => {
	expect(
		document.querySelectorAll('[data-task][draggable="true"]'),
	).toHaveLength(3);
	element("[data-task] [data-move]").click();
	expect(
		element('[data-task][aria-label="Write the introduction"]')
			.closest("[data-zone]")
			?.getAttribute("data-zone"),
	).toBe("Done");
	expect(element("[data-demo-status]").textContent).toBe(
		"Write the introduction moved to Done.",
	);
});

it("accepts a pointer drop into an empty column", () => {
	element('[data-zone="To do"] [data-move]').click();
	element('[data-zone="To do"] [data-move]').click();
	const source = element('[data-task][aria-label="Choose a title"]');
	const empty = element('[data-zone="To do"]');
	drag(source, "dragstart");
	expect(drag(empty, "dragover").defaultPrevented).toBe(true);
	drag(empty, "drop");
	expect(source.closest("[data-zone]")).toBe(empty);
	expect(empty.querySelectorAll("[data-task]")).toHaveLength(1);
});

it("reorders tasks using the component keyboard workflow and cancels with Escape", () => {
	const source = element('[data-task][aria-label="Write the introduction"]');
	source.focus();
	source.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	source.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
	);
	element('[data-task][aria-label="Review the examples"]').dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	expect(
		[...element('[data-zone="To do"]').querySelectorAll("[data-task]")].map(
			(item) => item.getAttribute("aria-label"),
		),
	).toEqual(["Review the examples", "Write the introduction"]);
	source.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	source.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
	);
	element('[data-task][aria-label="Choose a title"]').dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(source.closest("[data-zone]")?.getAttribute("data-zone")).toBe(
		"To do",
	);
});

it("does not duplicate handlers when the example script runs again", async () => {
	await runInNewContext(script, { document, customElements });
	element("[data-task] [data-move]").click();
	expect(
		element('[data-task][aria-label="Write the introduction"]')
			.closest("[data-zone]")
			?.getAttribute("data-zone"),
	).toBe("Done");
});
