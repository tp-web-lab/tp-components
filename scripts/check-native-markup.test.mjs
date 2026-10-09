import assert from "node:assert/strict";
import test from "node:test";
import { auditNativeMarkup, rawMarkup } from "./check-native-markup.mjs";
import { nativeMarkup } from "./native-markup.mjs";

test("rejects raw HTML while allowing explicitly literal HTML source", () => {
	assert.equal(rawMarkup("md", "A <tp-blank></tp-blank>."), true);
	assert.equal(rawMarkup("adoc", "++++\n<p>Text</p>\n++++"), true);
	assert.equal(rawMarkup("rst", ".. raw:: html\n\n   <p>Text</p>"), true);
	assert.equal(
		rawMarkup("md", "`<tp-box>`\n``` html\n<p>Code</p>\n```"),
		false,
	);
	assert.equal(
		rawMarkup("md", '::: script { type="tp/html" }\n<p>Source</p>\n:::'),
		false,
	);
	assert.equal(
		rawMarkup("adoc", '[script,type="tp/html"]\n....\n<p>Source</p>\n....'),
		false,
	);
	assert.equal(
		rawMarkup("rst", ".. script::\n   :type: tp/html\n\n   <p>Source</p>"),
		false,
	);
});

test("renders inline components without breaking surrounding prose", () => {
	const source =
		'<p>Choose <tp-blank name="answer" aria-label="Answer"></tp-blank>.</p>';
	assert.match(
		nativeMarkup("md", source),
		/Choose :tp-blank:`answer`\{name="answer" aria-label="Answer"\}\./,
	);
	assert.match(
		nativeMarkup("adoc", source),
		/Choose \[tp-blank,name="answer",aria-label="Answer"\]#answer#\./,
	);
	assert.match(
		nativeMarkup("rst", source),
		/\.\. role:: example-tp-blank-1\(tp-blank\)/,
	);
});

test("keeps list hierarchy and places boolean AsciiDoc options before named attributes", () => {
	const html =
		'<tp-tree level="3" draggable><ul><li>Project<ul><li>File</li></ul></li></ul></tp-tree>';
	assert.match(nativeMarkup("adoc", html), /^\[tp-tree%draggable,level="3"\]/);
	assert.match(nativeMarkup("adoc", html), /\* Project\n\*\* File/);
	assert.match(nativeMarkup("md", html), /- Project\n\n {2}- File/);
});

test("all component language examples comply with the native markup rule", () => {
	const result = auditNativeMarkup();
	assert.ok(result.checked > 1000);
	assert.deepEqual(result.failures, []);
});
