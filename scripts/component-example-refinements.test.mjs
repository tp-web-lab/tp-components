import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";
import { exampleRefinements } from "./component-example-refinements.mjs";
import { isRetiredExample } from "./interactive-attribute-examples.mjs";

const root = resolve(import.meta.dirname, "../public/docs/components");
test("no component retains a generic additional example in any language", () => {
	for (const component of readdirSync(root)) {
		for (const language of ["html", "md", "adoc", "rst"]) {
			const path = `${root}/${component}/examples/examples.${language}`;
			if (!existsSync(path)) continue;
			const examples = namedExamples(
				language,
				viewerSource(language, readFileSync(path, "utf8")),
			);
			assert.ok(examples.length > 0, `${component}/${language}`);
			assert.equal(
				examples[0].label,
				"Basic usage",
				`${component}/${language}`,
			);
			assert.ok(
				examples.every((example) => !/^Additional usage$/i.test(example.label)),
				`${component}/${language}`,
			);
			assert.equal(
				new Set(examples.map((example) => example.label)).size,
				examples.length,
				`${component}/${language}`,
			);
		}
	}
});

test("each refined example has matching labels and an objective in all four languages", () => {
	for (const [component, plans] of Object.entries(exampleRefinements)) {
		for (const language of ["html", "md", "adoc", "rst"]) {
			const source = viewerSource(
				language,
				readFileSync(
					`${root}/${component}/examples/examples.${language}`,
					"utf8",
				),
			);
			const examples = namedExamples(language, source);
			for (const plan of plans) {
				assert.ok(plan.description.length > 30);
				if (isRetiredExample(component, plan.label)) {
					assert.ok(!examples.some((example) => example.label === plan.label));
					continue;
				}
				assert.ok(
					examples.some((example) => example.label === plan.label),
					`${component}/${language}/${plan.label}`,
				);
			}
		}
	}
});

test("nested AsciiDoc scripts use distinct component and script fences", () => {
	const plan = exampleRefinements["code-editor"].find(
		(example) => example.label === "Code folding",
	);
	const source = markupExample("adoc", plan.source);
	assert.match(
		source,
		/\[tp-code-editor[^\n]*\]\n=====\n\[script[^\n]*\]\n====\n/,
	);
	const file = exampleFile("adoc", "tp-code-editor", [
		{ label: plan.label, source },
	]);
	assert.deepEqual(namedExamples("adoc", viewerSource("adoc", file)), [
		{ label: plan.label, source },
	]);
});
