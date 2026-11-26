// Read the documentation itself so examples and regression checks cannot drift.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const b = await chromium.launch();
try {
	const p = await b.newPage();
	await p.route("**/__mapping_audit", (r) =>
		r.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await p.route("**/part.md", (r) =>
		r.fulfill({ contentType: "text/plain", body: "Included **text**." }),
	);
	await p.goto(
		`${process.env.TP_TEST_BASE_URL ?? "http://127.0.0.1:4173"}/__mapping_audit`,
	);
	const r = await p.evaluate(async () => {
		const { renderMarkdownToHtml } = await import(
			"/src/utilities/markdown-source.ts"
		);
		const { htmlToMarkup, markupToHtml } = await import(
			"/src/utilities/markup-conversion.ts"
		);
		let src = await (
			await fetch("/docs/components/markup-converter/index.md")
		).text();
		src = src.slice(
			src.indexOf("#### HTML-to-markup mapping"),
			src.indexOf("#### Cleaning the HTML pivot"),
		);
		const el = document.createElement("div");
		el.innerHTML = await renderMarkdownToHtml(src);
		if (
			el.querySelectorAll("table").length !== 2 ||
			el.querySelectorAll("tbody tr").length < 45
		)
			throw new Error("Both complete mapping tables are required");
		const signature = (h) => {
			const d = document.createElement("template");
			d.innerHTML = h;
			return JSON.stringify(
				[
					...d.content.querySelectorAll(
						"h1,h2,h3,h4,h5,h6,pre,code,dl,dt,dd,a,table,tr,td,th,ul,ol,li,blockquote,aside,figure,figcaption,details,summary,header,footer,section,article,script,style,img,audio,video,kbd,tp-math,tp-icon,tp-callout,tp-theorem,sl-alert,sl-badge",
					),
				].map((n) => [
					n.localName,
					...[
						"src",
						"href",
						"id",
						"data-kind",
						"hidden",
						"variant",
						"heading",
						"number",
						"qed",
						"name",
						"mode",
						"displaystyle",
						"type",
						"start",
						"controls",
						"width",
						"height",
						"alt",
					]
						.filter((a) => n.hasAttribute(a))
						.sort()
						.map((a) => [a, n.getAttribute(a)]),
					...(["script", "style"].includes(n.localName)
						? [n.textContent.trim()]
						: []),
				]),
			);
		};
		const records = [];
		for (const row of el.querySelectorAll("tbody tr")) {
			for (const [i, lang] of [
				"markdown",
				"asciidoc",
				"latex",
				"restructuredtext",
			].entries()) {
				const cell = row.cells[i + 1];
				const code = [...cell.childNodes]
					.map((n) =>
						n.nodeName === "BR"
							? "\n"
							: n.nodeName === "CODE"
								? n.textContent
								: "",
					)
					.join("");
				try {
					const html = await markupToHtml(code, lang, location.href);
					const target = htmlToMarkup(html, lang);
					const roundtrip = await markupToHtml(target, lang, location.href);
					const plain = (h) => {
						const d = document.createElement("div");
						d.innerHTML = h;
						d.querySelectorAll("script,style").forEach((x) => x.remove());
						return d.textContent.replace(/\s+/g, " ").trim();
					};
					records.push({
						label: row.cells[0].textContent,
						lang,
						code,
						html,
						target,
						roundtrip,
						textEqual: plain(html) === plain(roundtrip),
						structureEqual: signature(html) === signature(roundtrip),
						error: /system-message|System Message|ERROR\/3/.test(
							html + roundtrip,
						),
					});
				} catch (e) {
					records.push({
						label: row.cells[0].textContent,
						lang,
						code,
						error: String(e),
					});
				}
			}
		}
		return records;
	});
	if (process.env.TP_MAPPING_REPORT)
		writeFileSync(process.env.TP_MAPPING_REPORT, JSON.stringify(r, null, 2));
	console.log(
		JSON.stringify(
			r.filter((x) => x.error || !x.textEqual || !x.structureEqual),
			null,
			2,
		),
	);
	assert.equal(
		r.filter((x) => x.error || !x.textEqual || !x.structureEqual).length,
		0,
		"Mapping examples must preserve text and structure in both directions",
	);
	console.log(
		`${r.length} documented markup → HTML → native markup → HTML checks passed.`,
	);
} finally {
	await b.close();
}
