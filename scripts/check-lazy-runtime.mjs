import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { init, parse } from "es-module-lexer";

const dist = resolve(import.meta.dirname, "../dist");
await init;

// Inspect static imports in the actual production output, including re-exports.
// Lazy imports must remain outside the initial dependency graph.
async function staticSources(entry) {
	const visited = new Set();
	const sources = new Set();
	async function visit(file) {
		if (visited.has(file)) return;
		visited.add(file);
		const code = await readFile(file, "utf8");
		const mapName = code.match(/\/\/# sourceMappingURL=(.+)/)?.[1];
		if (mapName) {
			const map = JSON.parse(
				await readFile(resolve(dirname(file), mapName.trim()), "utf8"),
			);
			for (const source of map.sources)
				sources.add(source.replaceAll("\\", "/"));
		}
		const [imports] = parse(code);
		for (const { n: specifier, d: dynamic } of imports) {
			if (dynamic === -1 && specifier?.startsWith(".")) {
				await visit(resolve(dirname(file), specifier));
			}
		}
	}
	await visit(resolve(dist, entry));
	assert.ok(sources.size > 0, `${entry}: production source maps are required`);
	return [...sources];
}

for (const entry of [
	"tp-loader.js",
	"components/markup-single-page/markup-single-page.js",
	"components/markup-multi-pages/markup-multi-pages.js",
]) {
	const sources = await staticSources(entry);
	assert.deepEqual(
		sources.filter((source) =>
			/\/node_modules\/(?:typescript|markdown-it)\//.test(source),
		),
		[],
		`${entry} must not eagerly load the TypeScript compiler or Markdown parser`,
	);
}
for (const entry of [
	"components/python-viewer/python-viewer.js",
	"components/javascript-viewer/javascript-viewer.js",
	"components/typescript-viewer/typescript-viewer.js",
]) {
	const sources = await staticSources(entry);
	assert.deepEqual(
		sources.filter((source) => /\/node_modules\/typescript\//.test(source)),
		[],
		`${entry} must load the TypeScript compiler only when compiling TypeScript`,
	);
}
console.log(
	"Production runtime: documentation parsers and TypeScript compilation remain lazy.",
);
