/**
 * Tests Basic usage ordering, grouped Attributes panels and normalization idempotence.
 *
 * Run with the Node.js test runner from the tp-components package root after installing
 * workspace dependencies.
 *
 * @example
 * node --test scripts/component-example-structure.test.mjs
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { describeExample } from "./component-example-descriptions.mjs";
import {
	checkExampleStructure,
	componentAttributes,
	documentedComponents,
	readExamples,
} from "./standardize-component-examples.mjs";

test("all components use Basic usage, grouped Attributes and complementary examples", () => {
	assert.deepEqual(checkExampleStructure(), []);
});
test("every grouped panel has a documented objective and no per-attribute examples remain", () => {
	for (const component of documentedComponents()) {
		for (const language of ["html", "md", "adoc", "rst"]) {
			const examples = readExamples(component, language);
			assert.ok(
				!examples.some((example) => /^Attributes?\s*:/i.test(example.label)),
				component,
			);
			for (const example of examples)
				assert.ok(
					describeExample(component, example.label),
					`${component}/${example.label}`,
				);
			if (componentAttributes(component).length)
				assert.ok(examples[1].source.includes("attributes.js"), component);
		}
	}
});
test("normalization is idempotent and preserves all Basic usage sources", () => {
	const root = resolve(import.meta.dirname, "..");
	const temporary = mkdtempSync(join(tmpdir(), "tp-examples-test-"));
	try {
		for (const directory of ["scripts", "src", "public", "config"])
			cpSync(join(root, directory), join(temporary, directory), { recursive: true });
		symlinkSync(join(root, "node_modules"), join(temporary, "node_modules"), "dir");
		execFileSync(process.execPath, ["--input-type=module", "-e", `
			import assert from 'node:assert/strict';
			import { readFileSync } from 'node:fs';
			import { documentedComponents, languages, readExamples, standardizeComponentExamples } from './scripts/standardize-component-examples.mjs';
			const components = documentedComponents();
			const introductions = () => components.flatMap(c => languages.map(l => readExamples(c, l)[0]));
			const snapshot = () => components.flatMap(c => languages.map(l => readFileSync('public/docs/components/' + c + '/examples/examples.' + l, 'utf8')));
			const original = introductions();
			standardizeComponentExamples();
			assert.deepEqual(introductions(), original);
			const first = snapshot();
			standardizeComponentExamples();
			assert.deepEqual(snapshot(), first);
			assert.deepEqual(introductions(), original);
		`], { cwd: temporary, stdio: "pipe" });
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
});
