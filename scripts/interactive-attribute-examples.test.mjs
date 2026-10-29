/**
 * Tests grouped controls, defaults, runtime modules and reviewed resource fixtures.
 *
 * Run with the Node.js test runner from the tp-components package root after installing
 * workspace dependencies.
 *
 * @example
 * node --test scripts/interactive-attribute-examples.test.mjs
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { parseFragment } from "parse5";
import { attributeSettings } from "./grouped-attribute-examples.mjs";
import {
	componentAttributes,
	documentedComponents,
	readExamples,
} from "./standardize-component-examples.mjs";
import { groupedFields } from "./textfield-attributes-example.mjs";

const walk = (node) => [node, ...(node.childNodes ?? []).flatMap(walk)];
const get = (node, name) =>
	node.attrs?.find((item) => item.name === name)?.value;

test("grouped controls cover defaults, enums, booleans and external runtime in every component", () => {
	for (const component of documentedComponents()) {
		if (
			groupedFields.includes(component) ||
			!componentAttributes(component).length
		)
			continue;
		const source = readExamples(component, "html")[1].source;
		const nodes = walk(parseFragment(source));
		const settings = attributeSettings(component);
		const script = readFileSync(
			`public/docs/components/${component}/examples/attributes.js`,
			"utf8",
		);
		if (component === "mask") {
			const preview = nodes.find(node => get(node, "id") === "mask-preview");
			assert.ok(preview);
			for (const [id, tag] of [["mask-active", "tp-checkbox-list"], ["mask-anchor", "tp-textfield"], ["mask-reset", "tp-button"], ["mask-reload", "tp-button"]]) {
				const control = nodes.find(node => get(node, "id") === id);
				assert.equal(control?.tagName, tag);
				assert.ok(!walk(preview).includes(control), `${id} stays outside the masked area`);
			}
			assert.equal(get(nodes.find(node => node.tagName === "tp-mask"), "active"), undefined);
			assert.match(script, /preview\.anchor=anchor\.value;preview\.active=active\.value==='1'/);
			assert.match(script, /active\.addEventListener\('tp-checkbox-list-change',apply\)/);
			assert.match(script, /anchor\.addEventListener\('input',apply\)/);
			continue;
		}
		const config = JSON.parse(
			script.match(/initializeAttributes\(([\s\S]*)\);/)[1],
		);
		assert.equal(
			nodes.filter((node) => get(node, "id") === "attributes-frame").length,
			1,
			component,
		);
		assert.ok(script.includes("/_shared/component-attributes.js"));
		const booleanSettings = settings.filter(
			(setting) => setting.kind === "boolean",
		);
		const booleanGroup = nodes.find(
			(node) => get(node, "id") === "attributes-booleans",
		);
		assert.equal(Boolean(booleanGroup), booleanSettings.length > 0, component);
		if (booleanGroup) {
			assert.equal(get(booleanGroup, "orientation"), "horizontal");
			assert.equal(get(booleanGroup, "label-position"), "top");
			assert.equal(
				walk(booleanGroup).filter((node) => node.tagName === "li").length,
				booleanSettings.length,
			);
			assert.equal(
				get(booleanGroup, "value"),
				booleanSettings
					.map((setting, index) => (setting.value ? index + 1 : null))
					.filter(Boolean)
					.join(","),
			);
		}
		for (const setting of config.settings.filter(
			(setting) => setting.kind !== "boolean",
		)) {
			const controls = nodes.filter(
				(node) => get(node, "data-setting") === setting.name,
			);
			assert.equal(controls.length, 1, `${component}/${setting.name}`);
			const control = controls[0];
			if (setting.kind) {
				assert.equal(
					control.tagName,
					setting.kind === "indexes" ? "tp-checkbox-list" : "tp-radio-list",
				);
				assert.equal(get(control, "label-position"), "top");
				const choices =
					setting.choices ?? setting.values.map((value) => ({ value }));
				if (setting.kind !== "indexes")
					assert.equal(
						String(choices[Number(get(control, "value")) - 1].value),
						String(setting.value),
						`${component}/${setting.name}`,
					);
			} else {
				assert.ok(["tp-textfield", "tp-numberfield"].includes(control.tagName), `${component}/${setting.name}: typed field`);
				if (control.tagName === "tp-numberfield") assert.ok(Number.isFinite(Number(setting.value)), `${component}/${setting.name}: numeric default`);
				assert.equal(get(control, "value"), String(setting.value), `${component}/${setting.name}: value`);
				if (get(control, "range") === undefined)
					assert.equal(get(control, "placeholder"), String(setting.value), `${component}/${setting.name}: placeholder`);
			}
			if (setting.kind === "file") {
				const fixtures = JSON.parse(readFileSync(`public/docs/components/${component}/examples/attributes-fixtures.json`, "utf8"));
				assert.equal(setting.choices.length, 4, `${component}/${setting.name}`);
				assert.deepEqual(
					setting.choices,
					fixtures[setting.name],
				);
				assert.equal(setting.choices[0].value, setting.value);
				assert.ok(setting.choices.every(choice => choice.label.trim().length > 0));
				for (const choice of setting.choices.slice(1, 3))
					assert.ok(
						existsSync(`public${choice.value}`),
						component + choice.value,
					);
				assert.ok(!existsSync(`public${setting.choices[3].value}`));
			}
		}
	}
});
