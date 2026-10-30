import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "vitest";
import { generateComponentApiFiles } from "./component-api-plugin.js";

test("CSS API retains documented defaults and prose for both tag syntaxes", async () => {
	const root = await mkdtemp(join(tmpdir(), "tp-css-api-"));
	try {
		const dir = join(root, "src/components/example");
		await mkdir(dir, { recursive: true });
		await writeFile(
			join(dir, "example.ts"),
			`/**
 * @tagname tp-example
 * @cssprop [--tp-example-color=color-mix(in srgb, red 20%, transparent)] Color of the focus outline.
 * @cssproperty --tp-example-gap Space between adjacent items.
 * @cssprop [--tp-example-width] Preferred panel width.
 * @cssprop [--tp-example-order=unset] Stacking order assigned to child elements at runtime.
 */
export class TpExample {}`,
		);
		await writeFile(
			join(dir, "example.css"),
			`tp-example { --tp-example-color: red; gap: var(--tp-example-gap, 1rem); width: var(--tp-example-width, 12rem); }
tp-example[active] { --tp-example-color: blue; }`,
		);
		await generateComponentApiFiles(root, "src/components");
		const serialized = await readFile(join(dir, "example.json"), "utf8");
		await generateComponentApiFiles(root, "src/components");
		assert.equal(await readFile(join(dir, "example.json"), "utf8"), serialized);
		const api = JSON.parse(serialized);
		const props = Object.fromEntries(
			api.cssproperties.map(
				(p: { name: string; default: string; description: string }) => [
					p.name,
					p,
				],
			),
		);
		assert.equal(
			props["--tp-example-color"].default,
			"color-mix(in srgb, red 20%, transparent)",
		);
		assert.equal(
			props["--tp-example-color"].description,
			"Color of the focus outline.",
		);
		assert.equal(props["--tp-example-gap"].default, "1rem");
		assert.equal(
			props["--tp-example-gap"].description,
			"Space between adjacent items.",
		);
		assert.equal(props["--tp-example-width"].default, "12rem");
		assert.equal(props["--tp-example-order"].default, "unset");
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});

test("markup sidebar width inherits without a cyclic custom property declaration", async () => {
	const css = await readFile(
		"src/components/markup-multi-pages/markup-multi-pages.css",
		"utf8",
	);
	assert.doesNotMatch(
		css,
		/--tp-markup-multi-pages-sidebar-width\s*:\s*var\(--tp-markup-multi-pages-sidebar-width/,
	);
	assert.match(
		css,
		/min\(var\(--tp-markup-multi-pages-sidebar-width, 12rem\), 85%\)/,
	);
});

test("event API preserves reviewed payloads and discovers component-native notifications", async () => {
	const root = await mkdtemp(join(tmpdir(), "tp-event-api-"));
	try {
		const dir = join(root, "src/components/example");
		await mkdir(dir, { recursive: true });
		await writeFile(
			join(dir, "example.ts"),
			`/**
 * @tagname tp-example
 * @event tp-example-error Reports either loading or editing failures.
 * @eventdetail tp-example-error { operation: "load" | "edit"; error: unknown; src?: string }
 * @event tp-example-mode Emitted when the rendering mode changes.
 * @eventdetail tp-example-mode void
 */
export class TpExample {
 load() { this.dispatchEvent(new CustomEvent("tp-example-error", {detail: {operation: "load", error: null, src: "test"}})); }
 edit() { this.dispatchEvent(new CustomEvent("tp-example-error", {detail: {operation: "edit", error: null}})); }
 mode() { this.dispatchEvent(new Event("tp-example-mode", {bubbles:true})); }
 internal(dialog) { dialog.dispatchEvent(new Event("close")); }
 discovered() { this.dispatchEvent(new Event("tp-example-undocumented")); }
}`,
		);
		await generateComponentApiFiles(root, "src/components");
		const serialized = await readFile(join(dir, "example.json"), "utf8");
		await generateComponentApiFiles(root, "src/components");
		assert.equal(await readFile(join(dir, "example.json"), "utf8"), serialized);
		const api = JSON.parse(serialized);
		assert.deepEqual(api.events, [
			{
				name: "tp-example-error",
				description: "Reports either loading or editing failures.",
				detail: '{ operation: "load" | "edit"; error: unknown; src?: string }',
			},
			{
				name: "tp-example-mode",
				description: "Emitted when the rendering mode changes.",
				detail: "void",
			},
			{
				name: "tp-example-undocumented",
				description: "Emitted when example undocumented occurs.",
				detail: "void",
			},
		]);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});
