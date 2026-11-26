import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { compactTraceSteps } from "../src/components/trace/visible-steps.js";
const name = process.env.BROWSER || "chrome";
const browser = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
const report = { browser: name, checks: [] };
try {
	const page = await browser.newPage({
		viewport: { width: 1450, height: 1000 },
	});
	for (const [language, extension] of [
		["javascript", "js"],
		["typescript", "ts"],
		["python", "py"],
		["scheme", "scm"],
		["ocaml", "ml"],
	]) {
		await page.route(`**/__line-${language}.html`, (r) =>
			r.fulfill({
				contentType: "text/html",
				body: `<tp-${language}-tracer src="/docs/components/${language}-tracer/examples/same-line.${extension}"></tp-${language}-tracer><script type="module" src="/src/components/${language}-tracer/${language}-tracer.ts"></script>`,
			}),
		);
		await page.goto(`http://127.0.0.1:4386/__line-${language}.html`);
		await page.waitForFunction(() =>
			document
				.querySelector("[data-role=status]")
				?.textContent.includes("Source loaded"),
		);
		const host = page.locator(`tp-${language}-tracer`);
		await host.locator("[data-role=run]").click();
		await page.waitForFunction(
			() =>
				document
					.querySelector("[data-role=status]")
					?.textContent.startsWith("Step "),
			null,
			{ timeout: 90000 },
		);
		const data = JSON.parse(await host.evaluate((e) => e.getCode()));
		assert.equal(data.trace.at(-1).stdout, "30\n");
		const expressions = data.trace.map((s) =>
			s.source_range
				? data.code.slice(s.source_range.start, s.source_range.end)
				: "",
		);
		for (const term of language === "scheme"
			? ["(+ x 3)", "(+ x 4)"]
			: language === "ocaml"
				? ["(x + 3)", "(x + 4)"]
				: ["x + 3", "x + 4"])
			assert.ok(expressions.includes(term), `${language}: ${term}`);
		assert.deepEqual(compactTraceSteps(data.trace), data.trace);
		assert.ok(
			data.trace.some((s) => (s.grouped_steps || 1) > 1),
			`${language} must demonstrate actual grouping`,
		);
		for (let i = 0; i < data.trace.length; i++) {
			await host.evaluate((e, i) => e.goTo(i), i);
			const range = data.trace[i].source_range;
			if (range)
				assert.equal(
					(
						await host.locator("[data-role=recorded] mark").allTextContents()
					).join("\n"),
					data.code.slice(range.start, range.end),
				);
		}
		await page.evaluate(() => {
			window.Worker = class {
				constructor() {
					throw Error("Replay started a Worker");
				}
			};
		});
		await host
			.locator("[data-role=file]")
			.setInputFiles({
				name: "same-line.json",
				mimeType: "application/json",
				buffer: Buffer.from(JSON.stringify(data)),
			});
		await host.locator("[data-role=last]").click();
		assert.equal(await host.locator("[data-role=stdout]").innerText(), "30\n");
		report.checks.push({
			language,
			steps: data.trace.length,
			grouped: data.trace.reduce((n, s) => n + (s.grouped_steps || 1) - 1, 0),
			replay: true,
		});
	}
	console.log(JSON.stringify(report));
	await writeFile(
		`/tmp/tracer-same-line-${name}.json`,
		JSON.stringify(report, null, 2),
	);
} finally {
	await browser.close();
}
