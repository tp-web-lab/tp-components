import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";

test("multi-slides introduction frames shrink beside a floating table of contents", () => {
	["markup", "html", "markdown", "asciidoc", "restructuredtext"].forEach((language) => {
		const page = readFileSync(`public/docs/components/${language}-multi-slides/index.md`, "utf8");
		const frame = page.match(/<tp-iframe\b[^>]*introduction-frame\.html[^>]*>/)?.[0];
		assert.ok(frame, language);
		assert.match(frame, /display: flow-root;/, language);
		assert.match(frame, /inline-size: auto;/, language);
	});
	const generator = readFileSync("scripts/sync-component-doc-introductions.mjs", "utf8");
	assert.match(generator, /display: flow-root; inline-size: auto;/);
});

test("content-dependent introductions demonstrate something and are reused verbatim in HTML", () => {
	const components = [
		"iframe",
		"include",
		"button-group",
		"accordion",
		"animation",
		"box",
		"card",
		"center",
		"checkbox-list",
		"cluster",
		"divider",
		"flip-card",
		"fullscreen",
		"inline",
		"radio-list",
		"slider",
		"tabs",
		"toolbar",
		"grid",
		"stack",
		"cover",
		"switcher",
		"tree",
		"asciidoc-multi-pages",
		"asciidoc-single-page",
		"binary",
		"crossword",
		"cryptarithm",
		"game-life",
		"html-multi-pages",
		"html-single-page",
		"markdown-single-page",
		"markup-single-page",
		"mastermind",
		"memory",
		"restructuredtext-multi-pages",
		"restructuredtext-single-page",
		"sudoku",
		"yakazu",
		"asciidoc",
		"asciidoc-playground",
		"asciidoc-viewer",
		"button",
		"code-editor",
		"color",
		"compare",
		"console",
		"contextmenu",
		"copy-code",
		"dialog",
		"dir",
		"drawer",
		"dropdown",
		"file-tree",
		"filesystem",
		"fill-blank",
		"frame",
		"graph-analog-circuit",
		"graph-dfa",
		"graph-editor",
		"graph-geometric-optics",
		"graph-logical-circuit",
		"graph-petri",
		"graph-query-tree",
		"graph-sequential-circuit",
		"html-playground",
		"html-viewer",
		"icon",
		"icon-button",
		"javascript-notebook",
		"javascript-playground",
		"javascript-viewer",
		"lang",
		"markdown",
		"markdown-playground",
		"markdown-viewer",
		"menu",
		"modal",
		"multi-choice-question",
		"popover",
		"prolog-notebook",
		"prolog-playground",
		"prolog-viewer",
		"prose-editor",
		"python-notebook",
		"python-playground",
		"python-viewer",
		"question",
		"restructuredtext-playground",
		"restructuredtext-viewer",
		"save-image",
		"sidebar",
		"single-choice-question",
		"source",
		"splitter",
		"spreadsheet-editor",
		"sql-notebook",
		"sql-playground",
		"sql-viewer",
		"theme",
		"toc",
		"tooltip",
		"turtle",
		"typescript-notebook",
		"typescript-playground",
		"typescript-viewer",
		"xy-plot",
	];
	for (const component of components) {
		const path = `public/docs/components/${component}`;
		let introduction = readFileSync(`${path}/index.md`, "utf8").split(
			/^## Usage\s*$/m,
		)[0];
		if (component === "lang" || component.endsWith("-multi-pages"))
			introduction = readFileSync(
				`${path}/examples/introduction-frame.html`,
				"utf8",
			);
		const basic = namedExamples(
			"html",
			viewerSource(
				"html",
				readFileSync(`${path}/examples/examples.html`, "utf8"),
			),
		)[0].source;
		assert.doesNotMatch(basic, /^<tp-[\w-]+>\s*<\/tp-[\w-]+>$/, component);
		const normalize = (text) =>
			text
				.replace(/=""(?=[ >])/g, "")
				.replace(/\s+/g, " ")
				.trim();
		assert.ok(
			normalize(introduction).includes(normalize(basic)),
			`${component}: introduction and HTML Basic usage differ`,
		);
	}
	for (const component of ["iframe", "include"]) {
		const sample = readFileSync(
			`public/docs/components/${component}/examples/welcome.html`,
			"utf8",
		);
		assert.match(sample, /<p>.+<\/p>/);
	}
});

test("every synchronized public component has a direct introduction and a Basic usage example", () => {
	let count = 0;
	for (const directory of readdirSync("public/docs/components")) {
		const path = `public/docs/components/${directory}/index.md`;
		if (!existsSync(path)) continue;
		const markdown = readFileSync(path, "utf8");
		if (!existsSync(`src/components/${directory}/${directory}.ts`)) continue;
		assert.doesNotMatch(
			markdown,
			/<!-- tp-docgen:basic-usage:start -->/,
			`${directory}: standalone Basic usage`,
		);
		count++;
		const preamble = markdown.split(/^## Usage\s*$/m)[0];
		const viewers = [...preamble.matchAll(/^<tp-html-viewer\b/gm)];
		assert.equal(
			viewers.length,
			directory === "html-viewer" ? 1 : 0,
			`${directory}: introductory wrapper`,
		);
		let labels;
		for (const extension of ["html", "md", "adoc", "rst"]) {
			const file = readFileSync(
				`public/docs/components/${directory}/examples/examples.${extension}`,
				"utf8",
			);
			const examples = namedExamples(extension, viewerSource(extension, file));
			assert.equal(
				examples[0]?.label,
				"Basic usage",
				`${directory}/${extension}`,
			);
			if (labels)
				assert.deepEqual(
					examples.map((item) => item.label),
					labels,
					`${directory}/${extension}`,
				);
			labels = examples.map((item) => item.label);
		}
		if (/-multi-(pages|slides)$/.test(directory)) {
			assert.match(
				preamble,
				/^<tp-iframe\b/m,
				`${directory}: full-window isolation`,
			);
			const frame = readFileSync(
				`public/docs/components/${directory}/examples/introduction-frame.html`,
				"utf8",
			);
			assert.ok(frame.includes(`<tp-${directory}`));
			assert.ok(frame.includes("component-preview.js"));
		}
	}
	assert.ok(count >= 140, `Only ${count} components audited`);
});

test("introductory mini-sites have complete repositories and bounded preview layouts", () => {
	for (const [language, extension] of [
		["html", "html"],
		["asciidoc", "adoc"],
		["restructuredtext", "rst"],
	]) {
		const directory = `public/docs/components/_shared/intro-documents/${language}`;
		const cover = readFileSync(`${directory}/cover.${extension}`, "utf8");
		const chapter = readFileSync(`${directory}/chapter.${extension}`, "utf8");
		const sidebar = readFileSync(`${directory}/sidebar.${extension}`, "utf8");
		assert.ok(cover.includes(`chapter.${extension}`));
		assert.ok(chapter.includes(`cover.${extension}`));
		assert.ok(sidebar.includes(`cover.${extension}`));
		assert.ok(sidebar.includes(`chapter.${extension}`));
		const frame = readFileSync(
			`public/docs/components/${language}-multi-pages/examples/introduction-frame.html`,
			"utf8",
		);
		assert.ok(
			frame.includes(
				`repository="/docs/components/_shared/intro-documents/${language}"`,
			),
		);
		assert.ok(frame.includes("contain: layout; block-size: 32rem;"));
	}
});

test("the cryptarithm usage code block closes before the examples tabs", () => {
	const page = readFileSync(
		"public/docs/components/cryptarithm/index.md",
		"utf8",
	);
	const usage = page.split("## Examples")[0];
	assert.match(
		usage,
		/```html\s+<tp-cryptarithm[\s\S]*?<\/tp-cryptarithm>\s+```/,
	);
});

test("synchronization is idempotent and can check every page without writing", () => {
	const result = execFileSync(
		process.execPath,
		["scripts/sync-component-doc-introductions.mjs", "--check"],
		{ encoding: "utf8" },
	);
	assert.match(result, /Outdated 0/);
});
