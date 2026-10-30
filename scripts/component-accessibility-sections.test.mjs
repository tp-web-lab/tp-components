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
import { spawnSync } from "node:child_process";
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

test("accessibility checks and reports recognize abstract class contracts", () => {
	const root = mkdtempSync(join(tmpdir(), "tp-accessibility-contract-"));
	try {
		for (const directory of [
			"scripts",
			"config",
			"src/components/example",
			"public/docs/components/example",
		]) {
			mkdirSync(join(root, directory), { recursive: true });
		}
		for (const script of [
			"sync-component-accessibility-docs.mjs",
			"generate-accessibility-report.mjs",
		]) {
			copyFileSync(`scripts/${script}`, join(root, "scripts", script));
		}
		writeFileSync(
			join(root, "config/accessibility-static-review-baseline.json"),
			'["legacy"]',
		);
		writeFileSync(
			join(root, "public/docs/components/example/index.md"),
			"# Example\n",
		);
		const source = join(root, "src/components/example/example.ts");
		const run = (script, ...args) =>
			spawnSync(process.execPath, [join(root, "scripts", script), ...args], {
				encoding: "utf8",
			});
		writeFileSync(source, "export abstract class Example {}\n");
		const missing = run("sync-component-accessibility-docs.mjs", "--check");
		assert.equal(missing.status, 1);
		assert.match(
			missing.stderr,
			/require explicit accessibility metadata:\nexample/,
		);
		writeFileSync(
			source,
			"/**\n * @accessibility Preserves inherited keyboard navigation.\n */\nexport abstract class Example {}\n",
		);
		const check = run("sync-component-accessibility-docs.mjs", "--check");
		assert.equal(check.status, 0, check.stderr);
		const report = run("generate-accessibility-report.mjs");
		assert.equal(report.status, 0, report.stderr);
		assert.match(
			readFileSync(
				join(root, "public/docs/appendices/accessibility/index.md"),
				"utf8",
			),
			/tp-example[^\n]*Detailed/,
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
