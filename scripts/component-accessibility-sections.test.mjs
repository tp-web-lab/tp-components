/**
 * Tests the absence of redundant component Accessibility sections and presence of the
 * transversal appendix.
 *
 * Run with the Node.js test runner from the tp-components package root after installing
 * workspace dependencies.
 *
 * @example
 * node --test scripts/component-accessibility-sections.test.mjs
 */

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

test("component pages keep accessibility reporting in the transversal appendix", () => {
	for (const directory of readdirSync("public/docs/components")) {
		const path = `public/docs/components/${directory}/index.md`;
		if (!existsSync(path)) continue;
		const markdown = readFileSync(path, "utf8");
		assert.doesNotMatch(markdown, /^## Accessibility\s*$/m, path);
		assert.ok(!markdown.includes("tp-docgen:accessibility:start"), path);
	}
	assert.ok(existsSync("public/docs/appendices/accessibility/index.md"));
});
