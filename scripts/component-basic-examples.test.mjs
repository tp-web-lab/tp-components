import assert from "node:assert/strict";
import test from "node:test";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
	withBasicUsage,
} from "./component-basic-examples.mjs";

test("Markdown quotes JSON-valued attributes without backslash-escaping their quotes", () => {
	const result = markupExample(
		"md",
		'<tp-spreadsheet-editor value="[[&quot;Name&quot;,&quot;Value&quot;],[&quot;Total&quot;,42]]"></tp-spreadsheet-editor>',
	);
	assert.ok(result.includes(`value='[["Name","Value"],["Total",42]]'`));
	assert.ok(!result.includes('\\"'));
});

test("updating an introduction replaces Basic usage without accumulating obsolete copies", () => {
	const existing = [
		{ label: "Basic usage", source: "Old introduction" },
		{ label: "Sortable list", source: "Keep this example" },
	];
	const next = withBasicUsage(existing, "Updated introduction");
	assert.deepEqual(next, [
		{ label: "Basic usage", source: "Updated introduction" },
		existing[1],
	]);
	assert.deepEqual(
		withBasicUsage(next, "Updated again").map((item) => item.label),
		["Basic usage", "Sortable list"],
	);
});

test("all four viewers round-trip a first Basic usage and preserve later examples", () => {
	for (const extension of ["html", "md", "adoc", "rst"]) {
		const examples = [
			{
				label: "Basic usage",
				source: markupExample(
					extension,
					'<tp-text-to-speech lang="en" show-text=""><script type="tp/txt">Hello.</script></tp-text-to-speech>',
				),
			},
			{
				label: "Another example",
				source: markupExample(extension, "<tp-button>Continue</tp-button>"),
			},
		];
		assert.deepEqual(
			namedExamples(
				extension,
				viewerSource(
					extension,
					exampleFile(extension, "tp-text-to-speech", examples),
				),
			),
			examples,
			extension,
		);
	}
});

test("script indentation is normalized as a block, not just on its first line", () => {
	const html =
		'<tp-python-viewer>\n  <script type="tp/python">\n    x = 6 * 7\n    print(x)\n  </script>\n</tp-python-viewer>';
	assert.match(markupExample("md", html), /\nx = 6 \* 7\nprint\(x\)\n/);
	assert.match(markupExample("rst", html), / {6}x = 6 \* 7\n {6}print\(x\)/);
});

test("nested and indented delimiters do not close an example or drop later source", () => {
	const examples = [
		{
			label: "Basic usage",
			source:
				"[tp-memory]\n=====\n. First\n  ======\n  ======\n. Second\n=====",
		},
	];
	const file = exampleFile("adoc", "tp-memory", examples);
	assert.deepEqual(namedExamples("adoc", viewerSource("adoc", file)), examples);
});

test("rich content uses native lists and images within component directives", () => {
	const html =
		'<tp-fill-blank-question closed><dl><dt>Answers</dt><dd><ol><li><svg viewBox="0 0 1 1"></svg></li></ol></dd></dl></tp-fill-blank-question>';
	assert.match(
		markupExample("adoc", html),
		/\[tp-fill-blank-question%closed\]/,
	);
	assert.match(markupExample("adoc", html), /Answers::\n\+\n\. \{blank\}/);
	assert.match(markupExample("rst", html), /\.\. image::/);
	assert.match(
		markupExample("md", html),
		/::: tp-fill-blank-question \{ closed \}/,
	);
});

test("RST keeps inline literals and prose in one consistently indented paragraph", () => {
	const html =
		'<p>The <code>border-width</code> attribute changes the border.</p><tp-box border-width="4px">The custom element <code>tp-box</code> has a thicker border.</tp-box>';
	assert.equal(
		markupExample("rst", html),
		"The ``border-width`` attribute changes the border.\n\n.. tp-box::\n   :border-width: 4px\n\n   The custom element ``tp-box`` has a thicker border.",
	);
});

test("RST indents multiline option continuations deeper than the option name", () => {
	const html =
		'<tp-code-editor value="first line&#10;second line"></tp-code-editor>';
	assert.equal(
		markupExample("rst", html),
		".. tp-code-editor::\n   :value: first line\n      second line",
	);
});

test("Markdown and AsciiDoc preserve inline code within a component paragraph", () => {
	const html =
		"<tp-box>The custom HTML element <code>&lt;tp-box&gt;</code> wraps its content in various ways.</tp-box>";
	const sentence =
		"The custom HTML element `<tp-box>` wraps its content in various ways.";
	assert.equal(markupExample("md", html), `::: tp-box\n${sentence}\n:::`);
	assert.equal(
		markupExample("adoc", html),
		`[tp-box]\n====\n${sentence}\n====`,
	);
});
