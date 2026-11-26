/// <reference lib="dom" />
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import vm from "node:vm";
import { parseFragment, serialize } from "parse5";
import { test } from "vitest";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";
import { javascriptExample } from "./component-javascript-examples.mjs";
import { syncJavascriptExamples } from "./sync-javascript-examples.mjs";

test("all Javascript API examples recreate introductions with DOM calls and targeted imports", () => {
	let count = 0;
	for (const component of readdirSync("public/docs/components")) {
		const folder = `public/docs/components/${component}/examples`;
		if (!existsSync(`${folder}/examples.html`)) continue;
		const examples = namedExamples(
			"html",
			viewerSource("html", readFileSync(`${folder}/examples.html`, "utf8")),
		);
		const programmed = examples.filter(
			(example) => example.label === "Javascript API",
		);
		assert.equal(programmed.length, 1, component);
		const program =
			programmed[0].source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ??
			"";
		assert.doesNotMatch(
			program,
			/\.innerHTML\s*=|insertAdjacentHTML|import\s+.*tp-loader/,
		);
		const imports = [
			...program.matchAll(/^import "(\/components\/([^/]+)\/[^/]+\.js)";$/gm),
		];
		assert.ok(imports.length, component);
		for (const [, , name] of imports)
			assert.ok(existsSync(`src/components/${name}/${name}.ts`), name);
		const documentNode = document.implementation.createHTMLDocument();
		vm.runInNewContext(program.replace(/^import .*;$/gm, ""), {
			document: documentNode,
		});
		assert.equal(
			serialize(parseFragment(documentNode.body.innerHTML)),
			serialize(
				parseFragment(
					readFileSync(`${folder}/introduction.html`, "utf8").trim(),
				),
			),
			component,
		);
		count++;
	}
	assert.ok(count >= 212);
});

test("literal scripts, templates, comments and SVG namespaces survive generation", () => {
	const source =
		'<template><svg viewBox="0 0 24 24"><use xlink:href="#shape"></use></svg></template><!-- example --><script type="tp/html"><tp-button>Literal</tp-button></script>';
	const program = javascriptExample(source, new Map([["tp-button", "button"]]));
	assert.match(program, /createElementNS/);
	assert.match(program, /setAttributeNS/);
	assert.match(program, /\.content\.append/);
	assert.match(program, /import "\/components\/button\/button.js"/);
	assert.equal((program.match(/<\/script>/g) ?? []).length, 1);
});

test("all five Javascript API sources match their introduction without losing newlines", () => {
	const { count, stale } = syncJavascriptExamples(true);
	assert.ok(count >= 212);
	assert.deepEqual(stale, []);
});

test("programmed reconstruction retains blank lines and indentation in literal source", () => {
	const source =
		'<tp-box><pre>\nfirst\n\n  indented\n</pre><script type="tp/python">\nvalue = 1\n\nif value:\n    print(value)\n</script></tp-box>';
	const program = javascriptExample(source, new Map([["tp-box", "box"]]));
	const code = program.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "";
	const documentNode = document.implementation.createHTMLDocument();
	vm.runInNewContext(code.replace(/^import .*;$/gm, ""), {
		document: documentNode,
	});
	const expected = document.createElement("template");
	expected.innerHTML = source;
	assert.equal(
		documentNode.body.querySelector("script")?.textContent,
		expected.content.querySelector("script")?.textContent,
	);
	assert.equal(
		documentNode.body.querySelector("pre")?.textContent,
		expected.content.querySelector("pre")?.textContent,
	);
});
