import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";
import {
	latexMarkup,
	synchronizeLatexExamples,
} from "./sync-latex-examples.mjs";
const { JSDOM } = createRequire(
	import.meta.resolve("@tp/tp-latex/package.json"),
)("jsdom");
const dom = new JSDOM("<!doctype html>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { renderLatexToFragment } = await import("@tp/tp-latex");

function signatures(root) {
	return Array.from(root.querySelectorAll("*"))
		.filter((node) => !(node.localName === "p" && node.attributes.length === 0))
		.map((node) => {
			let tag = node.localName;
			if (tag === "b") tag = "strong";
			if (tag === "i") tag = "em";
			if (node.matches("span.bf, span.it") && node.attributes.length === 1)
				tag = node.className === "bf" ? "strong" : "em";
			const attrs = Array.from(node.attributes, (a) => [a.name, a.value])
				.filter(
					([name]) =>
						!(node.localName === "span" && tag !== "span" && name === "class"),
				)
				.sort(([a], [b]) => a.localeCompare(b));
			const literal = [
				"script",
				"style",
				"pre",
				"textarea",
				"template",
				"code",
			].includes(node.localName)
				? node.innerHTML
				: "";
			return JSON.stringify([tag, attrs, literal]);
		});
}

test("all LaTeX example labels match HTML and all generated examples preserve elements, attributes and literal code", () => {
	const failures = [];
	let count = 0;
	for (const component of readdirSync("public/docs/components")) {
		const folder = `public/docs/components/${component}/examples`;
		let html;
		try {
			html = readFileSync(`${folder}/examples.html`, "utf8");
		} catch {
			continue;
		}
		const examples = namedExamples("html", viewerSource("html", html));
		const tex = readFileSync(`${folder}/examples.tex`, "utf8");
		const chunks = tex.split(/^% !tp-example /m).slice(1);
		assert.deepEqual(
			chunks.map((c) => c.slice(0, c.indexOf("\n"))),
			examples.map((e) => e.label),
			component,
		);
		for (let i = 0; i < chunks.length; i++) {
			const name = `${component}/${examples[i].label}`;
			try {
				const fragment = renderLatexToFragment(
					chunks[i].slice(chunks[i].indexOf("\n") + 1),
				);
				if (!["tikz", "latex-viewer"].includes(component)) {
					const source = document.createElement("template");
					source.innerHTML = examples[i].source;
					const actual = signatures(fragment);
					for (const signature of signatures(source.content)) {
						const index = actual.indexOf(signature);
						assert.notEqual(
							index,
							-1,
							`Missing or changed element: ${signature}`,
						);
						actual.splice(index, 1);
					}
				}
				count++;
			} catch (error) {
				failures.push(`${name}: ${error.message}`);
			}
		}
	}
	assert.deepEqual(failures, []);
	assert.ok(count >= 437);
});

test("literal scripts and nested native commands remain editable LaTeX", () => {
	const source = latexMarkup(
		'<tp-callout heading="Information">Hello <strong>world</strong><script type="tp/latex">\\section{Hello}50% $x$</script></tp-callout>',
	);
	assert.ok(source.includes("\\wcTpCallout"));
	assert.ok(source.includes("\\textbf"));
	assert.ok(source.includes("\\wcScript"));
	assert.equal(
		renderLatexToFragment(source).querySelector("script").textContent,
		"\\section{Hello}50% $x$",
	);
});

test("the generated files and tabs are up to date", () =>
	synchronizeLatexExamples(true));

test("uses native paragraphs, formatting, lists, descriptions, headings and mathematics", () => {
	const source = latexMarkup(
		'<tp-post-it heading="Remember"><p>Keep examples <strong>simple</strong> and <em>useful</em>.</p><ul><li>First</li><li>Second</li></ul><ol><li>Paris</li><li>London</li></ol><dl><dt>Title</dt><dd>Geography</dd></dl><h2>Calculation</h2><p>Try \\(x^2\\).</p></tp-post-it>',
	);
	for (const command of [
		"\\textbf{simple}",
		"\\emph{useful}",
		"\\begin{itemize}",
		"\\begin{enumerate}",
		"\\begin{description}",
		"\\section*{Calculation}",
		"$x^2$",
	])
		assert.ok(source.includes(command), command);
	assert.doesNotMatch(source, /\\wc(?:P|Strong|Em|Ul|Ol|Li|Dl|Dt|Dd)\b/);
	const fragment = renderLatexToFragment(source);
	assert.deepEqual(
		[...fragment.querySelectorAll("ol > li")].map((item) =>
			item.textContent.trim(),
		),
		["Paris", "London"],
	);
	assert.equal(fragment.querySelector("dt").textContent, "Title");
	assert.equal(fragment.querySelector("tp-math").getAttribute("value"), "x^2");
	assert.ok(fragment.querySelector("span.bf"));
});

test("preserves authored attributes instead of converting functional elements into plain prose", () => {
	const source = latexMarkup(
		'<tp-box><p id="status" role="status">Ready</p><ul class="choices"><li data-value="one">One</li></ul></tp-box>',
	);
	const fragment = renderLatexToFragment(source);
	assert.equal(
		fragment.querySelector("p#status").getAttribute("role"),
		"status",
	);
	assert.equal(
		fragment.querySelector("ul.choices > li").getAttribute("data-value"),
		"one",
	);
});
