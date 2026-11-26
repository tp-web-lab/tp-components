/** Audit all cheat sheet conversions and their raw HTML under shared TP styles.
 * Run with the components (4173) and cheatsheet (4326) dev servers running.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
	const page = await browser.newPage();
	await page.goto(
		"http://127.0.0.1:4173/scripts/fixtures/cheatsheet-audit.html",
	);
	await page.locator("#run").click();
	await page.waitForFunction(
		() => document.querySelector("#status").textContent.startsWith("Complete"),
		{},
		{ timeout: 120000 },
	);
	const report = await page.evaluate(
		async (latexModule) => {
			const cases = JSON.parse(document.querySelector("#report").textContent);
			const { renderLatexToHtml } = await import(latexModule);
			const { renderMarkdownToHtml } = await import(
				"/src/utilities/markdown-source.ts"
			);
			const { renderAsciidocToHtml } = await import(
				"/src/components/asciidoc/asciidoc.ts"
			);
			const { renderRestructuredTextToHtml } = await import(
				"/src/components/restructuredtext/restructuredtext.ts"
			);
			await import("/src/components/latex/latex.ts");
			await import("/src/components/markdown/markdown.ts");
			for (const language of [
				"latex",
				"markdown",
				"asciidoc",
				"restructuredtext",
			]) {
				const element = document.createElement(`tp-${language}`);
				document.body.append(element);
				element.remove();
			}
			const results = [];
			const selectors = [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"code:not(pre code)",
				"pre",
				"table",
				"caption",
				"th",
				"td",
				"strong,b",
				"em,i",
				"figcaption",
			];
			const properties = [
				"color",
				"background-color",
				"font-family",
				"font-size",
				"font-weight",
				"font-style",
				"line-height",
				"padding-top",
				"padding-right",
				"padding-bottom",
				"padding-left",
				"border-top-width",
				"border-right-width",
				"border-bottom-width",
				"border-left-width",
				"border-top-color",
				"border-top-style",
				"text-align",
				"vertical-align",
				"white-space",
			];
			const host = document.createElement("div");
			host.style.cssText = "position:absolute;left:-10000px;width:800px";
			document.body.append(host);
			for (const c of cases) {
				const base = `http://127.0.0.1:4326/docs/markup-cheatsheet-examples/${c.name}.html`;
				let raw = c.code;
				if (c.language === "latex") raw = renderLatexToHtml(c.code);
				if (c.language === "markdown")
					raw = await renderMarkdownToHtml(c.code, base);
				if (c.language === "asciidoc")
					raw = await renderAsciidocToHtml(c.code, new URL(base));
				if (c.language === "restructuredtext")
					raw = await renderRestructuredTextToHtml(c.code);
				const template = document.createElement("template");
				template.innerHTML = raw;
				const unexpected = [
					...template.content.querySelectorAll(
						'style,link[rel="stylesheet"],span.bf,span.it,span.tt,span.docutils.literal',
					),
				].map((e) => e.outerHTML);
				if (c.language === "restructuredtext") {
					const nativeClass = {
						"document-header": ["author", "header.document-details > p.author"],
						"ids-roles": ["introduction", "p#workshop.introduction"],
						bibliography: ["bibliography", "ul.bibliography"],
					}[c.name];
					if (
						nativeClass &&
						(!c.code.includes(`.. class:: ${nativeClass[0]}`) ||
							!template.content.querySelector(nativeClass[1]))
					)
						unexpected.push(
							`Missing native class directive or preserved element: ${nativeClass[0]}`,
						);
				}
				for (const element of template.content.querySelectorAll("[style]")) {
					const allowed = element.matches("img,video")
						? ["width", "height"]
						: element.matches("td,th")
							? ["text-align", "vertical-align"]
							: element.matches("caption")
								? ["caption-side"]
								: [];
					for (const property of element.style)
						if (!allowed.includes(property))
							unexpected.push(
								`${element.localName}: ${property}: ${element.style.getPropertyValue(property)}`,
							);
				}
				const inlineStyles = [
					...template.content.querySelectorAll("[style]"),
				].map((e) => ({ tag: e.localName, style: e.getAttribute("style") }));
				for (const script of template.content.querySelectorAll("script"))
					script.remove();
				const differences = [];
				const paletteSamples = [];
				for (const theme of ["tp-light", "tp-dark"])
					for (const brand of ["tp-default", "tp-red"]) {
						host.className = `${theme} ${brand}`;
						const reference = document.createElement("div");
						reference.innerHTML = c.original;
						for (const script of reference.querySelectorAll(
							"script,style,link",
						))
							script.remove();
						const rendered = document.createElement("div");
						rendered.className = `tp-${c.language}-output`;
						rendered.append(template.content.cloneNode(true));
						host.replaceChildren(reference, rendered);
						if (c.name === "text-formatting")
							paletteSamples.push({
								theme,
								brand,
								color: getComputedStyle(rendered.querySelector("code")).color,
							});
						for (const selector of selectors) {
							const expected = [...reference.querySelectorAll(selector)];
							const actual = [...rendered.querySelectorAll(selector)];
							if (!expected.length) continue;
							if (expected.length !== actual.length) {
								differences.push({
									theme,
									brand,
									selector,
									count: [expected.length, actual.length],
								});
								continue;
							}
							expected.forEach((node, index) => {
								const left = getComputedStyle(node),
									right = getComputedStyle(actual[index]);
								const value = (style, p) =>
									p === "text-align" && style.getPropertyValue(p) === "start"
										? style.direction === "rtl"
											? "right"
											: "left"
										: style.getPropertyValue(p);
								const diff = Object.fromEntries(
									properties
										.filter((p) => value(left, p) !== value(right, p))
										.map((p) => [p, [value(left, p), value(right, p)]]),
								);
								if (Object.keys(diff).length)
									differences.push({ theme, brand, selector, index, diff });
							});
						}
					}
				results.push({
					name: c.name,
					language: c.language,
					conversionPass: c.pass,
					unexpected,
					inlineStyles,
					differences,
					paletteSamples,
				});
			}
			host.remove();
			return results;
		},
		"/@fs" +
			fileURLToPath(
				new URL("../../tp-latex/dist/tp-latex.js", import.meta.url),
			),
	);
	const summary = {
		cases: report.length,
		conversionPassed: report.filter((r) => r.conversionPass).length,
		semanticPassed: report.filter((r) => !r.unexpected.length).length,
		presentationPassed: report.filter((r) => !r.differences.length).length,
	};
	await writeFile(
		process.env.TP_AUDIT_OUTPUT || "/tmp/cheatsheet-presentation-audit.json",
		JSON.stringify({ summary, results: report }, null, 2),
	);
	console.log(JSON.stringify(summary));
	for (const r of report.filter(
		(r) => r.unexpected.length || r.differences.length,
	))
		console.log(
			JSON.stringify({
				name: r.name,
				language: r.language,
				unexpected: r.unexpected,
				differences: r.differences.slice(0, 4),
			}),
		);
	if (
		summary.conversionPassed !== report.length ||
		summary.semanticPassed !== report.length ||
		summary.presentationPassed !== report.length
	)
		process.exitCode = 1;
} finally {
	await browser.close();
}
