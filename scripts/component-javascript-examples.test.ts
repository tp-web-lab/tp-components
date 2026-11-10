/// <reference lib="dom" />
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import vm from "node:vm";
import { parseFragment, serialize } from "parse5";
import { test } from "vitest";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";
import { javascriptExample } from "./component-javascript-examples.mjs";

test("all Javascript API examples recreate Basic usage with DOM calls and targeted imports", () => {
	let count = 0;
	for (const component of readdirSync("public/docs/components")) {
		const folder = `public/docs/components/${component}/examples`;
		if (!existsSync(`${folder}/examples.html`)) continue;
		const examples = namedExamples(
			"html",
			viewerSource("html", readFileSync(`${folder}/examples.html`, "utf8")),
		);
		assert.equal(examples[1]?.label, "Javascript API", component);
		const program =
			examples[1].source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "";
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
			serialize(parseFragment(examples[0]?.source ?? "")),
			component,
		);
		count++;
	}
	assert.ok(count >= 205);
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
