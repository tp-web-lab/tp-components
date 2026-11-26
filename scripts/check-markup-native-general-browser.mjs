import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
	const page = await browser.newPage();
	await page.route("**/__native_general", (route) =>
		route.fulfill({ contentType: "text/html", body: "<!doctype html><body>" }),
	);
	await page.goto(
		`${process.env.TP_TEST_BASE_URL ?? "http://127.0.0.1:4173"}/__native_general`,
	);
	const results = await page.evaluate(async () => {
		const { htmlToMarkup, markupToHtml } = await import(
			"/src/utilities/markup-conversion.ts"
		);
		const { nativeGeneralCases } = await import(
			"/src/utilities/markup-native-general-fixtures.ts"
		);
		const languages = ["markdown", "asciidoc", "latex", "restructuredtext"];
		const results = [];
		const check = (html, example) => {
			if (/system-message|System Message|ERROR\/3/.test(html))
				throw new Error(html);
			const root = document.createElement("div");
			root.innerHTML = html;
			for (const selector of example.selectors)
				if (!root.querySelector(selector))
					throw new Error(`Missing ${selector}: ${html}`);
			for (const [selector, value] of example.texts || [])
				if (
					root
						.querySelector(selector)
						?.textContent?.replace(/\s+/g, " ")
						.trim() !== value
				)
					throw new Error(`Text differs: ${selector}: ${html}`);
			for (const [selector, key, value] of example.attributes)
				if (root.querySelector(selector)?.getAttribute(key) !== value)
					throw new Error(`Attribute differs ${selector}/${key}: ${html}`);
		};
		const native = (source) => {
			if (
				/\\wc(?:P|Span|Blockquote|Figure|Figcaption|Ol|Ul|Li)|\\webcomponent|^:+ (?:p|h[1-6]|blockquote)\b|^\[(?:h[1-6]|p|span|blockquote)[,\]]|^\.\. (?:p|h[1-6]|blockquote|hr)::/m.test(
					source,
				)
			)
				throw new Error(`Element fallback: ${source}`);
		};
		for (const example of nativeGeneralCases)
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
						results.push({
							name: example.name,
							from,
							to,
							source,
							target,
							back,
						});
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
	if (process.env.TP_GENERAL_REPORT)
		writeFileSync(
			process.env.TP_GENERAL_REPORT,
			JSON.stringify(results, null, 2),
		);
	console.log(JSON.stringify(failures, null, 2));
	assert.equal(results.length, 224);
	assert.equal(failures.length, 0);
	console.log("224 general native cross-language round trips passed.");
} finally {
	await browser.close();
}
