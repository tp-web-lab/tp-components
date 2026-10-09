import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { describeExample } from "./component-example-descriptions.mjs";
import {
	checkExampleStructure,
	componentAttributes,
	documentedComponents,
	readExamples,
	standardizeComponentExamples,
} from "./standardize-component-examples.mjs";

test("all components use Basic usage, grouped Attributes and complementary examples", () => {
	assert.deepEqual(checkExampleStructure(), []);
});
test("every grouped panel has a documented objective and no per-attribute examples remain", () => {
	for (const component of documentedComponents()) {
		for (const language of ["html", "md", "adoc", "rst"]) {
			const examples = readExamples(component, language);
			assert.ok(
				!examples.some((example) => /^Attributes?\\s*:/i.test(example.label)),
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
	const snapshot = () =>
		createHash("sha256")
			.update(
				JSON.stringify(
					documentedComponents().map((component) =>
						["html", "md", "adoc", "rst"].map((language) =>
							readFileSync(
								new URL(
									`../public/docs/components/${component}/examples/examples.${language}`,
									import.meta.url,
								),
								"utf8",
							),
						),
					),
				),
			)
			.digest("hex");
	const before = snapshot();
	const introductions = documentedComponents().map(
		(component) => readExamples(component, "html")[0],
	);
	assert.equal(standardizeComponentExamples().added, 0);
	assert.equal(snapshot(), before);
	assert.deepEqual(
		documentedComponents().map(
			(component) => readExamples(component, "html")[0],
		),
		introductions,
	);
});
