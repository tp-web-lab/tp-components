import { afterEach, expect, it, vi } from "vitest";
import {
	collectTpComponentTags,
	getTpComponentModuleUrl,
	importTpComponent,
	importTpComponentsIn,
} from "./component-imports.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

it("imports only unique components inside the requested root", async () => {
	document.body.innerHTML = "<tp-external></tp-external>";
	const root = document.createElement("tp-box");
	root.innerHTML =
		"<tp-button></tp-button><tp-button></tp-button><tp-loader></tp-loader><tp-dialog-backdrop></tp-dialog-backdrop><tp-code-editor data-tp-editor-pending></tp-code-editor><template><tp-dialog></tp-dialog></template>";
	const importer = vi.fn(async (_tag: string) => {});
	await importTpComponentsIn(root, importer);
	expect(importer.mock.calls.map(([tag]) => tag)).toEqual([
		"tp-box",
		"tp-button",
	]);
	expect([...collectTpComponentTags(root)]).toEqual(["tp-box", "tp-button"]);
});

it.each([
	[
		"https://example.test/src/utilities/component-imports.ts",
		"https://example.test/src/components/button/button.ts",
	],
	[
		"https://example.test/dist/utilities/component-imports.js",
		"https://example.test/dist/components/button/button.js",
	],
	[
		"https://example.test/dist/chunks/component-imports.js",
		"https://example.test/dist/components/button/button.js",
	],
])("resolves a cherry-picked module relative to %s", (base, expected) => {
	expect(getTpComponentModuleUrl("button", base)).toBe(expected);
});

it("does not start an observer when imported", async () => {
	const observe = vi.spyOn(MutationObserver.prototype, "observe");
	vi.resetModules();
	await import("./component-imports.js");
	expect(observe).not.toHaveBeenCalled();
});

it("skips defined components, non-TP elements and internal tags", async () => {
	if (!customElements.get("tp-import-test"))
		customElements.define("tp-import-test", class extends HTMLElement {});
	await expect(importTpComponent("tp-import-test")).resolves.toBeUndefined();
	await expect(importTpComponent("div")).resolves.toBeUndefined();
	await expect(importTpComponent("tp-loader")).resolves.toBeUndefined();
	await expect(
		importTpComponent("tp-dialog-backdrop"),
	).resolves.toBeUndefined();
});
