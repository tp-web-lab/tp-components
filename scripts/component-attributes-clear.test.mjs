import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { trackPreviewDocuments } from "./attributes-preview-test-helpers.mjs";

const require = createRequire(import.meta.url);
const { JSDOM } = createRequire(require.resolve("vitest/package.json"))(
	"jsdom",
);

test("clearing leaves an attribute control empty even after synchronization; Reset defaults restores its value", async () => {
	const dom = new JSDOM(
		'<tp-iframe id="attributes-frame"></tp-iframe><p id="attributes-status"></p><tp-textfield data-setting="padding"></tp-textfield><button id="attributes-reset"></button><button id="attributes-reload"></button>',
		{ runScripts: "outside-only", url: "https://example.test" },
	);
	try {
		const { window } = dom;
		const preview = trackPreviewDocuments(window);
		for (const tag of ["tp-iframe", "tp-textfield"])
			window.customElements.define(tag, class extends window.HTMLElement {});
		const source = readFileSync(
			"public/docs/components/_shared/component-attributes.js",
			"utf8",
		).replace("export async function", "async function");
		window.eval(
			`${source}\nwindow.initializeAttributes = initializeAttributes;`,
		);
		await window.initializeAttributes({
			component: "box",
			settings: [{ name: "padding", value: "1rem" }],
			source: "<tp-box></tp-box>",
		});
		const control = window.document.querySelector("tp-textfield");
		control.value = "3rem";
		control.dispatchEvent(new window.Event("input", { bubbles: true }));
		control.value = "";
		control.dispatchEvent(new window.Event("input", { bubbles: true }));
		control.dispatchEvent(
			new window.CustomEvent("tp-clear", { bubbles: true }),
		);
		assert.equal(control.value, "");
		const html = await preview.read();
		const data = JSON.parse(
			html.match(/type="application\/json">([\s\S]*?)<\/script>/)[1],
		);
		assert.equal(data.values.padding, "");
		window.dispatchEvent(
			new window.MessageEvent("message", {
				data: {
					type: "tp-attributes-state",
					channel: data.channel,
					generation: data.generation,
					values: { padding: "1rem" },
				},
			}),
		);
		assert.equal(control.value, "");
		window.document.querySelector("#attributes-reset").click();
		assert.equal(control.value, "1rem");
	} finally {
		dom.window.close();
	}
});
