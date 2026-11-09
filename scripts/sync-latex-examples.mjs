/** Generate the LaTeX variants of the canonical HTML documentation examples.
 * Uses wc commands, literal wcScript bodies, and localized rawhtml for syntax
 * that LaTeX.js cannot represent losslessly (SVG, templates, CSS, complex attributes).
 * Run with --check to detect stale files without writing.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { latexMarkup } from "../src/utilities/latex-markup.js";
export { latexMarkup, rawBody } from "../src/utilities/latex-markup.js";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";

const root = resolve(import.meta.dirname, "../public/docs/components");
export function synchronizeLatexExamples(check = false, selected = null) {
	let count = 0,
		examplesCount = 0;
	const stale = [];
	const save = (path, content) => {
		if (existsSync(path) && readFileSync(path, "utf8") === content) return;
		if (check) stale.push(path);
		else writeFileSync(path, content);
	};
	for (const component of readdirSync(root).sort()) {
		if (selected && component !== selected) continue;
		const folder = `${root}/${component}`;
		const source = `${folder}/examples/examples.html`;
		if (!existsSync(source) || !existsSync(`${folder}/index.md`)) continue;
		const examples = namedExamples(
			"html",
			viewerSource("html", readFileSync(source, "utf8")),
		);
		if (!examples.length) throw new Error(`No examples: ${component}`);
		// Retain the two manually authored native demonstrations already reviewed.
		if (!["tikz", "latex-viewer"].includes(component)) {
			const tex = examples
				.map(
					({ label, source }) =>
						`% !tp-example ${label}\n\\documentclass{article}\n\\begin{document}\n${latexMarkup(source)}\n\\end{document}\n`,
				)
				.join("\n");
			save(`${folder}/examples/examples.tex`, tex);
		}
		save(
			`${folder}/examples/examples-latex.html`,
			`<tp-latex-viewer label="tp-${component}" allow-script src="/docs/components/${component}/examples/examples.tex"></tp-latex-viewer>\n`,
		);
		const pagePath = `${folder}/index.md`;
		let page = readFileSync(pagePath, "utf8");
		let found = false;
		page = page.replace(
			/^(:{3,}) tp-tabs[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm,
			(block, fence, body) => {
				if (!body.includes("::include{examples/examples.md")) return block;
				found = true;
				const items = [
					["html", "HTML", "html"],
					["adoc", "tp-asciidoc", "asciidoc"],
					["latex", "tp-latex", "latex"],
					["md", "tp-markdown", "markdown"],
					["rst", "tp-restructuredtext", "restructuredtext"],
				];
				const entries = items.map(([extension, label, icon]) => {
					const file =
						extension === "latex"
							? "examples-latex.html"
							: `examples.${extension}`;
					const include =
						body
							.split("\n")
							.find((line) =>
								line.startsWith(`: ::include{examples/${file}`),
							) ?? `: ::include{examples/${file}}`;
					const title = body.includes("<tp-icon")
						? `<tp-icon name="file_type_${icon}" library="languages" size="1.25em"></tp-icon> ${label}`
						: label;
					return `${title}\n${include}`;
				});
				return `${fence} tp-tabs\n${entries.join("\n\n")}\n${fence}`;
			},
		);
		if (!found) throw new Error(`Missing language tabs: ${component}`);
		save(pagePath, page);
		count++;
		examplesCount += examples.length;
	}
	if (stale.length)
		throw new Error(`Stale LaTeX examples:\n${stale.join("\n")}`);
	console.log(
		`${check ? "Checked" : "Generated"} LaTeX tabs for ${count} components (${examplesCount} examples).`,
	);
}
if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
	synchronizeLatexExamples(process.argv.includes("--check"), process.argv.includes("--component") ? process.argv[process.argv.indexOf("--component") + 1] : null);
