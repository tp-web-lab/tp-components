import { afterEach, expect, it } from "vitest";
import "./toolbar.js";

afterEach(() => document.body.replaceChildren());

it("distributes inline controls wrapped by markup parsers", () => {
	const toolbar = document.createElement("tp-toolbar");
	toolbar.innerHTML =
		'<p><span section="start">Home</span> <span section="end">Help</span></p>';
	document.body.append(toolbar);
	expect(toolbar.querySelector("[data-toolbar-start]")?.textContent).toBe(
		"Home",
	);
	expect(toolbar.querySelector("[data-toolbar-end]")?.textContent).toBe("Help");
	expect(toolbar.querySelector("p")).toBeNull();
});

it("distributes dynamically added inline groups", async () => {
	const toolbar = document.createElement("tp-toolbar");
	document.body.append(toolbar);
	const paragraph = document.createElement("p");
	paragraph.innerHTML = '<span section="end">Settings</span>';
	toolbar.append(paragraph);
	await Promise.resolve();
	expect(toolbar.querySelector("[data-toolbar-end]")?.textContent).toBe(
		"Settings",
	);
});

it("preserves prose and explicitly attributed paragraphs", () => {
	const toolbar = document.createElement("tp-toolbar");
	toolbar.innerHTML =
		'<p>Choose <span section="end">Help</span></p><p section="center"><span section="end">Document</span></p><p class="custom"><span section="end">Custom</span></p>';
	document.body.append(toolbar);
	expect(toolbar.querySelectorAll("p")).toHaveLength(3);
	expect(toolbar.querySelector("[data-toolbar-center]")?.textContent).toBe(
		"Document",
	);
	expect(toolbar.querySelector("[data-toolbar-end]")?.textContent).toBe("");
});
