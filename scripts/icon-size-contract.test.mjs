import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const presets = /^(?:xxs|xs|sm|s|md|m|lg|l|xl|xxl)$/;
function files(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		return entry.isDirectory()
			? files(path)
			: /\.(?:ts|mjs|html|md|adoc|rst|tex)$/.test(path)
				? [path]
				: [];
	});
}

function invalidSizes(source, path) {
	const failures = [];
	const report = (value) => {
		if (presets.test(value)) failures.push(value);
	};
	// HTML, Markdown roles, AsciiDoc inline elements and LaTeX macros.
	for (const match of source.matchAll(
		/<tp-icon(?=\s|>)[^>]*|\[tp-icon(?=,|\])[^\]]*|:tp-icon:(?:`[^`]*`)?\s*\{[^}]*|\\wcTpIcon\*?\[[^\]]*/g,
	)) {
		const size = /\bsize\s*=\s*["']?([\w.%-]+)/.exec(match[0]);
		if (size) report(size[1]);
	}
	if (!/\.(?:ts|mjs)$/.test(path)) return failures;
	const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
	const literal = (node) =>
		node && ts.isStringLiteralLike(node) ? node.text : undefined;
	const visit = (node, inherited) => {
		const icons = new Set(inherited);
		const collect = (child) => {
			if (child !== node && ts.isBlock(child)) return;
			if (ts.isVariableDeclaration(child) && ts.isIdentifier(child.name)) {
				const init = child.initializer;
				if (
					init &&
					ts.isCallExpression(init) &&
					ts.isPropertyAccessExpression(init.expression) &&
					init.expression.name.text === "createElement" &&
					literal(init.arguments[0]) === "tp-icon"
				)
					icons.add(child.name.text);
			}
			ts.forEachChild(child, collect);
		};
		collect(node);
		const inspect = (child) => {
			if (child !== node && ts.isBlock(child)) {
				visit(child, icons);
				return;
			}
			if (
				ts.isCallExpression(child) &&
				ts.isPropertyAccessExpression(child.expression) &&
				ts.isIdentifier(child.expression.expression) &&
				icons.has(child.expression.expression.text) &&
				child.expression.name.text === "setAttribute" &&
				literal(child.arguments[0]) === "size"
			)
				report(literal(child.arguments[1]) ?? "");
			if (
				ts.isBinaryExpression(child) &&
				ts.isPropertyAccessExpression(child.left) &&
				ts.isIdentifier(child.left.expression) &&
				icons.has(child.left.expression.text) &&
				child.left.name.text === "size"
			)
				report(literal(child.right) ?? "");
			ts.forEachChild(child, inspect);
		};
		inspect(node);
	};
	visit(ast, new Set());
	return failures;
}

test("detects icon presets while allowing button presets and CSS dimensions", () => {
	assert.deepEqual(
		invalidSizes(
			'<tp-icon size="sm"></tp-icon><tp-icon-button size="xs"></tp-icon-button>',
			"fixture.html",
		),
		["sm"],
	);
	assert.deepEqual(
		invalidSizes(
			'const close = document.createElement("tp-icon"); close.setAttribute("size", "xs");',
			"fixture.ts",
		),
		["xs"],
	);
	assert.deepEqual(
		invalidSizes('<tp-icon size="0.75em"></tp-icon>', "fixture.html"),
		[],
	);
});

test("components and documentation do not pass button size presets to tp-icon", () => {
	const failures = [];
	for (const dir of ["src/components", "public/docs", "scripts"]) {
		for (const path of files(join(root, dir))) {
			if (path === fileURLToPath(import.meta.url)) continue;
			const invalid = invalidSizes(readFileSync(path, "utf8"), path);
			if (invalid.length) failures.push(`${path}: ${invalid.join(", ")}`);
		}
	}
	assert.deepEqual(failures, []);
});
