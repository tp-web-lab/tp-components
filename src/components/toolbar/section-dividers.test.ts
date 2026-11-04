import { afterEach, expect, it } from "vitest";
import "./toolbar.js";

afterEach(() => document.body.replaceChildren());

it("keeps real section dividers outside controls and updates their orientation", async () => {
	const toolbar = document.createElement("tp-toolbar");
	toolbar.innerHTML =
		'<span section="start">Start</span><span section="center">Title</span><span section="end">End</span>';
	document.body.append(toolbar);
	const dividers = toolbar.querySelectorAll(
		":scope > tp-divider[data-toolbar-divider]",
	);
	expect(dividers).toHaveLength(2);
	for (const divider of dividers) {
		expect(divider.getAttribute("orientation")).toBe("vertical");
		expect(divider.getAttribute("role")).toBe("separator");
	}
	toolbar.orientation = "vertical";
	for (const divider of dividers)
		expect(divider.getAttribute("aria-orientation")).toBe("horizontal");
	toolbar.remove();
	document.body.append(toolbar);
	await Promise.resolve();
	expect(
		toolbar.querySelectorAll(":scope > tp-divider[data-toolbar-divider]"),
	).toHaveLength(2);
	expect(toolbar.querySelector("[data-toolbar-start] tp-divider")).toBeNull();
});
