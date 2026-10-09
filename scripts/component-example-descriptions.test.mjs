import assert from "node:assert/strict";
import test from "node:test";
import {
	exampleLabels,
	synchronizeDescriptions,
} from "./sync-component-example-descriptions.mjs";

test("reads exact titles in order and ignores nested examples", () => {
	const html =
		'<tp-html-viewer><template><div role="example" label="Basic usage"><div role="example" label="Nested"></div></div><div role="example" label="Selected answer with tp-blank"></div></template></tp-html-viewer>';
	assert.deepEqual(exampleLabels(html), [
		"Basic usage",
		"Selected answer with tp-blank",
	]);
});

test("inserts a definition list before tabs, preserves prose and is idempotent", () => {
	const source =
		"# Test\n\n## Examples\n\nKeep this introduction.\n\n### Notes\n\nKeep this note.\n\n::::::::::::::: tp-tabs\nHTML\n: content\n:::::::::::::::\n\n## API\n\nKeep this API.\n";
	const labels = ["Basic usage", "Selected answer with tp-blank"];
	const result = synchronizeDescriptions(source, "fill-blank", labels);
	assert.ok(result.includes("Basic usage\n: Type a city"));
	assert.ok(
		result.includes("Selected answer with tp-blank\n: Select the triangle"),
	);
	assert.ok(result.includes("Keep this note."));
	assert.ok(result.endsWith("## API\n\nKeep this API.\n"));
	assert.ok(
		result.indexOf("Selected answer with tp-blank") <
			result.indexOf("::::::::::::::: tp-tabs"),
	);
	assert.equal(synchronizeDescriptions(result, "fill-blank", labels), result);
});

test("fails for an undocumented new example rather than inventing an objective", () => {
	assert.throws(
		() =>
			synchronizeDescriptions(
				"## Examples\n\n::: tp-tabs\n:::\n",
				"fill-blank",
				["New example"],
			),
		/Missing editorial description/,
	);
});

test("rejects missing or duplicate example titles", () => {
	assert.throws(
		() => exampleLabels("<tp-html-viewer></tp-html-viewer>"),
		/Expected named/,
	);
	assert.throws(
		() =>
			exampleLabels(
				'<tp-html-viewer><div role="example" label="Same"></div><div role="example" label="Same"></div></tp-html-viewer>',
			),
		/Duplicate/,
	);
});
