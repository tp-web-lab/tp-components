import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
	const page = await browser.newPage();
	await page.route("**/__native_complex", (route) =>
		route.fulfill({ contentType: "text/html", body: "<!doctype html><body>" }),
	);
	await page.goto(
		`${process.env.TP_TEST_BASE_URL ?? "http://127.0.0.1:4173"}/__native_complex`,
	);
	const results = await page.evaluate(async () => {
		const { htmlToMarkup, markupToHtml } = await import(
			"/src/utilities/markup-conversion.ts"
		);
		const { nativeComplexCases } = await import(
			"/src/utilities/markup-native-complex-fixtures.ts"
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
		};
		const native = (source) => {
			if (
				/\\wc(?:P|Span|Blockquote|Figure|Figcaption|Ol|Ul|Li)|\\webcomponent|^:+ (?:p|h[1-6]|blockquote)\b|^\[(?:h[1-6]|p|span|blockquote)[,\]]|^\.\. (?:p|h[1-6]|blockquote|hr)::/m.test(
					source,
				)
			)
				throw new Error(`Element fallback: ${source}`);
		};
		for (const example of nativeComplexCases)
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
		for (const [first, second] of [
			["Part_A", "part_a"],
			["a-b", "a_b"],
		]) {
			const source = `.. _${first}:\n\nFirst.\n\n.. _${second}:\n\nSecond.\n\n${first}_ and ${second}_.`;
			const html = await markupToHtml(
				source,
				"restructuredtext",
				location.href,
			);
			const root = document.createElement("div");
			root.innerHTML = html;
			for (const id of [first, second])
				if (
					!root.querySelector(`[id="${id}"]`) ||
					!root.querySelector(`a[href="#${id}"]`)
				)
					throw new Error(`Incorrect exact reference: ${html}`);
		}
		for (const [source, message] of [
			[
				".. _Part_A:\n\nFirst.\n\n.. _Part_A:\n\nSecond.",
				"Duplicate exact target",
			],
			[
				".. _Part_A:\n\nFirst.\n\n.. _part_a:\n\nSecond.\n\nPART_A_.",
				"Ambiguous target reference",
			],
		]) {
			let error = "";
			try {
				await markupToHtml(source, "restructuredtext", location.href);
			} catch (e) {
				error = String(e);
			}
			if (!error.includes(message))
				throw new Error(`Expected ${message}: ${error}`);
		}
		return results;
	});
	const failures = results.filter((item) => item.error);
	if (process.env.TP_COMPLEX_REPORT)
		writeFileSync(
			process.env.TP_COMPLEX_REPORT,
			JSON.stringify(results, null, 2),
		);
	console.log(JSON.stringify(failures, null, 2));
	assert.equal(results.length, 80);
	assert.equal(failures.length, 0);
	console.log(
		"80 native complex cross-language round trips and 4 exact-target checks passed.",
	);
} finally {
	await browser.close();
}
