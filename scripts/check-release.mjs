/**
 * Validates package entry points, type declarations, release documents and lazy production
 * dependencies.
 *
 * Run from the tp-components package root with workspace dependencies installed. Build the
 * package first so dist and its source maps are available; failed assertions stop release
 * validation.
 *
 * @example
 * node scripts/check-release.mjs
 */

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

await import("./check-lazy-runtime.mjs");

const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
for (const [name, entry] of Object.entries(pkg.exports)) {
	const paths = typeof entry === "string" ? [entry] : Object.values(entry);
	if (typeof entry !== "string")
		assert.equal(
			Object.keys(entry)[0],
			"types",
			`${name}: types must precede runtime conditions`,
		);
	for (const path of paths) await access(resolve(root, path));
}
for (const path of [pkg.main, pkg.types, "LICENSE", "CHANGELOG.md"])
	await access(resolve(root, path));
assert.match(await readFile(resolve(root, pkg.types), "utf8"), /TpAccordion/);
assert.match(
	await readFile(resolve(root, pkg.exports["./tp-loader"].types), "utf8"),
	/export/,
);
console.log(
	`Release ${pkg.version}: package entry points, declarations and release documents verified.`,
);
