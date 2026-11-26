import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
	const page = await browser.newPage();
	await page.route("**/__native_metadata", (route) =>
		route.fulfill({ contentType: "text/html", body: "<!doctype html><body>" }),
	);
	await page.goto(
		`${process.env.TP_TEST_BASE_URL ?? "http://127.0.0.1:4173"}/__native_metadata`,
	);
	const results = await page.evaluate(async () => {
		const { htmlToMarkup, markupToHtml } = await import(
			"/src/utilities/markup-conversion.ts"
		);
		const { nativeMetadataCases } = await import(
			"/src/utilities/markup-native-metadata-fixtures.ts"
		);
		const languages = ["markdown", "asciidoc", "latex", "restructuredtext"];
		const results = [];
		const check = (html, example) => {
			if (/system-message|System Message|ERROR\/3/.test(html))
				throw new Error(html);
			const root = document.createElement("div");
			root.innerHTML = html;
			const found = root.querySelector(example.selector);
			if (!found) throw new Error(`Missing ${example.selector}: ${html}`);
			if (
				example.text !== null &&
				found.textContent
					.replace(/\u200b/g, "")
					.replace(/\s+/g, " ")
					.trim() !== example.text
			)
				throw new Error(`Text differs: ${html}`);
			if (example.name === "anchor" && !root.querySelector('a[href="#Part_A"]'))
				throw new Error(`Lost link: ${html}`);
		};
		const native = (source) => {
			if (
				/\\wc(?:P|Span|Blockquote)|\\webcomponent|^:+ (?:p|h[1-6]|blockquote)\b|^\[(?:h[1-6]|p|span|blockquote)[,\]]|^\.\. (?:p|h[1-6]|blockquote|hr)::/m.test(
					source,
				)
			)
				throw new Error(`Element fallback: ${source}`);
		};
		for (const example of nativeMetadataCases)
			for (const from of languages) {
				let initial;
				const source = htmlToMarkup(example.html, from);
				try {
					native(source);
					initial = await markupToHtml(source, from, location.href);
					check(initial, example);
				} catch (e) {
					results.push({ name: example.name, from, source, error: String(e) });
					continue;
				}
				for (const to of languages) {
					let target, back;
					try {
						target = htmlToMarkup(initial, to);
						native(target);
						const html = await markupToHtml(target, to, location.href);
						check(html, example);
						back = htmlToMarkup(html, from);
						native(back);
						check(await markupToHtml(back, from, location.href), example);
						results.push({ name: example.name, from, to });
					} catch (e) {
						results.push({
							name: example.name,
							from,
							to,
							source,
							target,
							back,
							error: String(e),
						});
					}
				}
			}
		return results;
	});
	const failures = results.filter((item) => item.error);
	if (process.env.TP_METADATA_REPORT)
		writeFileSync(
			process.env.TP_METADATA_REPORT,
			JSON.stringify(results, null, 2),
		);
	console.log(JSON.stringify(failures, null, 2));
	assert.equal(results.length, 192);
	assert.equal(failures.length, 0);
	console.log("192 native metadata cross-language round trips passed.");
} finally {
	await browser.close();
}
