import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { trackPreviewDocuments } from "./attributes-preview-test-helpers.mjs";

const require = createRequire(import.meta.url);
const { JSDOM } = createRequire(require.resolve("vitest/package.json"))(
	"jsdom",
);

test("accordion index controls convert comma-separated choices to space-separated zero-based indexes", async () => {
	const dom = new JSDOM(
		'<tp-iframe id="attributes-frame"></tp-iframe><p id="attributes-status"></p><tp-checkbox-list data-setting="open-indexes"></tp-checkbox-list><button id="attributes-reset"></button><button id="attributes-reload"></button>',
		{ runScripts: "outside-only", url: "about:srcdoc" },
	);
	try {
		const { window } = dom;
		const base = window.document.createElement("base");
		base.href = "https://example.test/docs/components/accordion/examples/";
		window.document.head.append(base);
		const preview = trackPreviewDocuments(window);
		for (const tag of ["tp-iframe", "tp-checkbox-list"])
			window.customElements.define(tag, class extends window.HTMLElement {});
		const source = readFileSync(
			"public/docs/components/_shared/component-attributes.js",
			"utf8",
		).replace("export async function", "async function");
		window.eval(
			`${source}\nwindow.initializeAttributes = initializeAttributes;`,
		);
		await window.initializeAttributes({
			component: "accordion",
			settings: [{ name: "open-indexes", kind: "indexes", value: "0 2" }],
			source: "<tp-accordion multiple></tp-accordion>",
		});
		assert.equal(window.location.origin, "null");
		assert.match(
			await preview.read(),
			/<base href="https:\/\/example.test\/docs\/components\/accordion\/examples\/">/,
		);
		const control = window.document.querySelector("tp-checkbox-list");
		assert.equal(control.value, "1,3");
		for (const [selected, expected] of [
			["1,2", "0 1"],
			["2", "1"],
			["", ""],
		]) {
			control.dispatchEvent(
				new window.CustomEvent("tp-checkbox-list-change", {
					detail: { value: selected },
				}),
			);
			const data = JSON.parse(
				(await preview.read()).match(
					/type="application\/json">([\s\S]*?)<\/script>/,
				)[1],
			);
			assert.equal(data.values["open-indexes"], expected);
			window.dispatchEvent(
				new window.MessageEvent("message", {
					data: {
						type: "tp-attributes-state",
						generation: data.generation,
						channel: data.channel,
						values: data.values,
					},
				}),
			);
			assert.equal(control.value, selected);
		}
	} finally {
		dom.window.close();
	}
});

test("preview state synchronizes booleans across realms and rejects unrelated or stale messages", async () => {
	const dom = new JSDOM(
		'<tp-iframe id="attributes-frame"></tp-iframe><p id="attributes-status"></p><tp-checkbox-list id="attributes-booleans"></tp-checkbox-list><button id="attributes-reset"></button><button id="attributes-reload"></button>',
		{ runScripts: "outside-only", url: "https://example.test" },
	);
	try {
		const { window } = dom;
		const preview = trackPreviewDocuments(window);
		for (const tag of ["tp-iframe", "tp-checkbox-list"])
			window.customElements.define(tag, class extends window.HTMLElement {});
		const source = readFileSync(
			"public/docs/components/_shared/component-attributes.js",
			"utf8",
		).replace("export async function", "async function");
		window.eval(
			`${source}\nwindow.initializeAttributes = initializeAttributes;`,
		);
		await window.initializeAttributes({
			component: "drawer",
			settings: [{ name: "open", kind: "boolean", value: false }],
			source: "<tp-drawer></tp-drawer>",
		});
		const config = async () =>
			JSON.parse(
				(await preview.read()).match(
					/type="application\/json">([\s\S]*?)<\/script>/,
				)[1],
			);
		const first = await config();
		const firstUrl = window.document.querySelector("tp-iframe").src;
		assert.match(firstUrl, /^blob:/);
		assert.match(
			await preview.read(),
			/<base href="https:\/\/example.test\/docs\/components\/drawer\/examples\/">/,
		);
		const control = window.document.querySelector("tp-checkbox-list");
		const send = (values, identity = first) =>
			window.dispatchEvent(
				new window.MessageEvent("message", {
					source: window,
					data: {
						type: "tp-attributes-state",
						generation: identity.generation,
						channel: identity.channel,
						values,
					},
				}),
			);
		send({ open: true });
		assert.equal(control.value, "1");
		send({ open: false }, { ...first, channel: "unrelated" });
		assert.equal(control.value, "1");
		send({ open: false });
		assert.equal(control.value, "");
		window.document.querySelector("#attributes-reload").click();
		assert.notEqual((await config()).channel, first.channel);
		assert.deepEqual(preview.revoked, [firstUrl]);
		assert.equal(preview.documents.size, 1);
		send({ open: true });
		assert.equal(control.value, "");
		send({ open: true }, await config());
		assert.equal(control.value, "1");
		window.dispatchEvent(new window.Event("pagehide"));
		assert.equal(preview.documents.size, 0);
	} finally {
		dom.window.close();
	}
});
