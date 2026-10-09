import assert from "node:assert/strict";
import test from "node:test";
import { inlineIcons } from "./sync-inline-icon-examples.mjs";
import { nativeMarkup } from "./native-markup.mjs";

test("Markdown icons have empty content and stay in their text paragraph", () => {
	assert.equal(nativeMarkup("md", '<p>Panel <tp-icon name="numeric-1"></tp-icon> content</p>'), 'Panel :tp-icon:{name="numeric-1"} content');
	assert.equal(nativeMarkup("md", '<tp-badge><tp-icon name="check"></tp-icon> Approved</tp-badge>'), '::: tp-badge\n:tp-icon:{name="check"} Approved\n:::');
	assert.equal(inlineIcons("md", ':tp-icon:`icon`{name="check"} Approved'), ':tp-icon:{name="check"} Approved');
});

test("the generator emits inline icons in all three markup languages", () => {
	const html = '<tp-icon name="heart" size="100%" spin></tp-icon>';
	assert.match(nativeMarkup("md", html), /^:tp-icon:\{/);
	assert.match(nativeMarkup("adoc", html), /^\[tp-icon,spin,name="heart",size="100%"\]#heart#$/);
	const rst = nativeMarkup("rst", html);
	assert.match(rst, /\.\. role:: example-tp-icon-1\(tp-icon\)/);
	assert.match(rst, /:example-tp-icon-1:`heart`/);
	assert.doesNotMatch(rst, /\.\. tp-icon::/);
});

test("migration preserves attributes, percentage sizes and surrounding text", () => {
	assert.equal(inlineIcons("md", 'Text\n\n::: tp-icon { name="heart" }\n:::\n\nAfter'), 'Text\n\n:tp-icon:{name="heart"}\n\nAfter');
	assert.equal(inlineIcons("adoc", '[tp-icon%spin,size="100%"]\n====\n===='), '[tp-icon,spin,size="100%"]#icon#');
});

test("RST migration handles indentation, end of input and existing role names", () => {
	const source = '.. role:: inline-tp-icon-1(tp-icon)\n\n.. tp-box::\n\n   .. tp-icon::\n      :name: heart';
	const result = inlineIcons("rst", source);
	assert.match(result, /^\.\. role:: inline-tp-icon-2\(tp-icon\)\n   :name: heart/);
	assert.match(result, /   :inline-tp-icon-2:`icon`/);
	assert.equal(inlineIcons("rst", result), result);
});

test("structured icon bodies are not removed by the migration", () => {
	for (const [language, source] of [
		["md", '::: tp-icon\nStructured content\n:::'],
		["adoc", '[tp-icon]\n====\nStructured content\n===='],
		["rst", '.. tp-icon::\n   :name: heart\n\n   Structured content'],
	]) assert.equal(inlineIcons(language, source), source);
});
