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
				emitted: true,
				description: "Reports either loading or editing failures.",
				detail: '{ operation: "load" | "edit"; error: unknown; src?: string }',
			},
			{
				name: "tp-example-mode",
				emitted: false,
				description: "Emitted when the rendering mode changes.",
				detail: "void",
			},
			{
				name: "tp-example-undocumented",
				emitted: false,
				description: "Emitted when example undocumented occurs.",
				detail: "void",
			},
		]);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});

test("reader interactions are loaded from the dedicated help file and refreshed independently of Usage", async () => {
	const root = await mkdtemp(join(tmpdir(), "tp-reader-help-"));
	try {
		const dir = join(root, "src/components/example");
		const docs = join(root, "public/docs/components/example");
		await mkdir(dir, { recursive: true });
		await mkdir(docs, { recursive: true });
		await writeFile(
			join(dir, "example.ts"),
			"/** @tagname tp-example */\nexport class TpExample {}",
		);
		await writeFile(
			join(docs, "index.md"),
			"# Example\n\nThe custom `<tp-example>` element displays a notice.\n\n## Usage\n\n### Importing\nImport the module.",
		);
		const help =
			"### User interactions\n\n#### Mouse interactions\n\nClose the notice.\n\n#### Keyboard interactions\n\nCtrl+Alt+? chooses a parent.";
		await writeFile(join(docs, "interactions.md"), help);
		await generateComponentApiFiles(root, "src/components");
		let api = JSON.parse(await readFile(join(dir, "example.json"), "utf8"));
		assert.equal(api.userHelp.displayName, "Example");
		assert.equal(
			api.userHelp.interactions,
			help.split("### User interactions\n\n")[1],
		);
		await writeFile(
			join(docs, "interactions.md"),
			help.replace("Close the notice.", "Dismiss the notice with Close."),
		);
		await generateComponentApiFiles(root, "src/components");
		api = JSON.parse(await readFile(join(dir, "example.json"), "utf8"));
		assert.match(api.userHelp.interactions, /Dismiss the notice with Close/);
		assert.doesNotMatch(api.userHelp.interactions, /Import the module/);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});

test("document shells retain inherited attributes through multiple levels", async () => {
	const root = await mkdtemp(join(tmpdir(), "tp-document-api-"));
	try {
		const sources: Record<string, string> = {
			base: "/** @tagname tp-base\n * @attr {string} generic - Base only.\n */\nexport class TpBase {}",
			"markup-multi-pages":
				'import { TpBase } from "../base/base.js";\n/** @tagname tp-markup-multi-pages\n * @attr {string} repository = "/docs" - Root directory.\n * @attr {string} label = "" - Toolbar title.\n */\nexport class TpMarkupMultiPages extends TpBase {}',
			"markup-multi-slides":
				'import { TpMarkupMultiPages } from "../markup-multi-pages/markup-multi-pages.js";\n/** @tagname tp-markup-multi-slides\n * @attr {number} timing = 5000 - Step duration.\n */\nexport class TpMarkupMultiSlides extends TpMarkupMultiPages {}',
			"latex-multi-slides":
				'import { TpMarkupMultiSlides } from "../markup-multi-slides/markup-multi-slides.js";\n/** @tagname tp-latex-multi-slides\n * @attr {string} label = "Slides" - Custom title.\n */\nexport class TpLatexMultiSlides extends TpMarkupMultiSlides {}',
		};
		for (const [name, source] of Object.entries(sources)) {
			const dir = join(root, "src/components", name);
			await mkdir(dir, { recursive: true });
			await writeFile(join(dir, `${name}.ts`), source);
		}
		await generateComponentApiFiles(root, "src/components");
		const api = JSON.parse(
			await readFile(
				join(root, "src/components/latex-multi-slides/latex-multi-slides.json"),
				"utf8",
			),
		);
		assert.deepEqual(
			api.attributes.map((a: { name: string }) => a.name),
			["label", "repository", "timing"],
		);
		assert.equal(api.attributes[0].default, '"Slides"');
		assert.equal(api.attributes[1].inherited, true);
		assert.equal(api.attributes[2].default, "5000");
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});
