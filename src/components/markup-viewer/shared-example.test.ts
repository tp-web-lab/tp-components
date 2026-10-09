import { afterEach, expect, it, vi } from "vitest";
import { sharedViewerExample, shareViewerExample } from "./shared-example.js";

afterEach(() => document.body.replaceChildren());

/** Creates a lightweight viewer selector without loading editors or remote parsers. */
function viewer(
	scope: Element,
	labels = ["Geography", "Square root"],
): [Element, HTMLSelectElement] {
	const host = document.createElement("div");
	const select = document.createElement("select");
	select.setAttribute("aria-label", "Example");
	for (const label of labels) select.add(new Option(label, label));
	host.append(select);
	scope.append(host);
	select.addEventListener("change", () => shareViewerExample(host, select));
	return [host, select];
}

it("synchronizes equivalent lists and restores a lazy language tab", () => {
	const tabs = document.createElement("tp-tabs");
	const [html, htmlSelect] = viewer(tabs);
	const [, mdSelect] = viewer(tabs);
	const changed = vi.fn();
	mdSelect.addEventListener("change", changed);
	htmlSelect.value = "Square root";
	shareViewerExample(html, htmlSelect);
	expect(mdSelect.value).toBe("Square root");
	expect(changed).toHaveBeenCalledTimes(1);
	const [rst] = viewer(tabs);
	expect(sharedViewerExample(rst, ["Geography", "Square root"])).toBe(
		"Square root",
	);
});

it("isolates different example lists and unrelated or nested tab groups", () => {
	const tabs = document.createElement("tp-tabs");
	const [html, select] = viewer(tabs);
	const [, different] = viewer(tabs, ["Other", "Square root"]);
	const nested = document.createElement("tp-tabs");
	tabs.append(nested);
	const [inner, innerSelect] = viewer(nested);
	const outside = document.createElement("tp-tabs");
	const [other] = viewer(outside);
	select.value = "Square root";
	shareViewerExample(html, select);
	expect(different.value).toBe("Other");
	expect(innerSelect.value).toBe("Geography");
	expect(
		sharedViewerExample(inner, ["Geography", "Square root"]),
	).toBeUndefined();
	expect(
		sharedViewerExample(other, ["Geography", "Square root"]),
	).toBeUndefined();
});
