import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseFragment } from "parse5";
import { readExamples } from "./standardize-component-examples.mjs";
import {
	fieldAttributesScript,
	fieldSettings,
	groupedFields,
} from "./textfield-attributes-example.mjs";

const walk = (node) => [node, ...(node.childNodes ?? []).flatMap(walk)];
const get = (node, name) =>
	node.attrs?.find((item) => item.name === name)?.value;
for (const component of groupedFields) {
	const textfieldSettings = fieldSettings(component);
	test(`${component} has Basic usage and grouped Attributes in all languages`, () => {
		for (const language of ["html", "md", "adoc", "rst"]) {
			const examples = readExamples(component, language);
			assert.deepEqual(
				examples.map((example) => example.label),
				[
					"Basic usage",
					"Attributes",
					...(component === "mathfield" ? ["Inline in prose"] : []),
				],
			);
			assert.ok(
				examples[1].source.includes(
					`/docs/components/${component}/examples/attributes.js`,
				),
			);
			assert.ok(!examples[1].source.includes("function synchronize"));
			const script = readFileSync(
				`public/docs/components/${component}/examples/attributes.js`,
				"utf8",
			);
			assert.equal(script, fieldAttributesScript(component));
			for (const setting of textfieldSettings)
				assert.ok(script.includes(`"name":"${setting.name}"`));
		}
	});
	test(`${component} settings start at documented defaults with one external control per attribute`, () => {
		const nodes = walk(
			parseFragment(readExamples(component, "html")[1].source),
		);
		const bools = textfieldSettings.filter(
			(setting) => setting.kind === "boolean",
		);
		const list = nodes.filter((node) => node.tagName === "tp-checkbox-list");
		assert.equal(list.length, 1);
		assert.equal(get(list[0], "orientation"), "horizontal");
		assert.equal(get(list[0], "label"), "Boolean attributes");
		assert.equal(get(list[0], "label-position"), "top");
		assert.equal(get(list[0], "value"), "");
		assert.equal(
			walk(list[0]).filter((node) => node.tagName === "li").length,
			bools.length,
		);
		for (const setting of textfieldSettings.filter(
			(item) => item.kind !== "boolean",
		)) {
			const controls = nodes.filter(
				(node) => get(node, "data-setting") === setting.name,
			);
			assert.equal(controls.length, 1, setting.name);
			if (!setting.kind)
				assert.equal(get(controls[0], "placeholder"), String(setting.value));
			assert.equal(
				controls[0].tagName,
				setting.kind === "enum" ? "tp-radio-list" : "tp-textfield",
			);
			if (setting.kind === "enum") {
				assert.equal(get(controls[0], "label"), setting.name);
				assert.equal(get(controls[0], "label-position"), "top");
				const content = controls[0].childNodes.filter((node) => node.tagName);
				assert.deepEqual(
					content.map((node) => node.tagName),
					["ul"],
				);
				assert.equal(
					content[0].childNodes.filter((node) => node.tagName === "li").length,
					setting.values.length,
				);
				assert.ok(
					!walk(controls[0]).some((node) =>
						["dl", "dt", "dd"].includes(node.tagName),
					),
				);
			}
			assert.equal(
				get(controls[0], "value"),
				setting.kind === "enum"
					? String(setting.values.indexOf(setting.value) + 1)
					: String(setting.value),
			);
		}
		const preview = nodes.filter(
			(node) => get(node, "id") === `${component}-preview`,
		);
		assert.equal(preview.length, 1);
		for (const setting of textfieldSettings)
			assert.equal(
				get(preview[0], setting.name),
				undefined,
				"Preview should use native component defaults",
			);
	});
}
