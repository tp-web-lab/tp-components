import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";

// Read-only browser audit: isolated HTML introductions, no microphone, clipboard,
// filesystem or download actions, and no accessibility/coverage report generation.
const root = resolve(import.meta.dirname, "..");
const output = process.env.TP_INTRO_AUDIT_OUTPUT;
if (!output) throw Error("Set TP_INTRO_AUDIT_OUTPUT to a report directory.");
const origin = process.env.TP_INTRO_AUDIT_ORIGIN ?? "http://127.0.0.1:4173";
const selected = new Set(process.argv.slice(2));
const hostDocument = await (await fetch(origin)).text();
const devClient = hostDocument.includes("/@vite/client")
	? '<script type="module" src="/@vite/client"></script>'
	: "";
const examples = [];
for (const name of readdirSync(join(root, "public/docs/components"))) {
	const file = join(
		root,
		"public/docs/components",
		name,
		"examples/examples.html",
	);
	if (
		!existsSync(file) ||
		!existsSync(join(root, "src/components", name, `${name}.ts`)) ||
		(selected.size && !selected.has(name))
	)
		continue;
	const source = namedExamples(
		"html",
		viewerSource("html", readFileSync(file, "utf8")),
	)[0]?.source;
	if (source === undefined) throw Error(`Missing Basic usage: ${name}`);
	examples.push({
		name,
		source,
		bare: /^<tp-[\w-]+\s*>\s*<\/tp-[\w-]+>$/.test(source),
	});
}
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
let cursor = 0;
async function worker() {
	while (cursor < examples.length) {
		const example = examples[cursor++];
		const context = await browser.newContext({
			viewport: { width: 1100, height: 850 },
			reducedMotion: "reduce",
		});
		const page = await context.newPage();
		const errors = [],
			requests = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("response", (response) => {
			if (response.status() >= 400)
				requests.push({ url: response.url(), status: response.status() });
		});
		const url = `${origin}/docs/components/${example.name}/__introduction_review__.html`;
		await page.route(url, (route) =>
			route.fulfill({
				contentType: "text/html",
				body: `<!doctype html><html lang="en"><head>${devClient}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${example.name} introduction review</title></head><body class="tp-light"><main data-intro-review>${example.source}</main><script type="module" src="/src/tp-loader.ts"></script></body></html>`,
			}),
		);
		const result = { name: example.name, bare: example.bare, errors, requests };
		try {
			await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
			await page.waitForFunction(
				(name) => customElements.get(`tp-${name}`) !== undefined,
				example.name,
				{ timeout: 15000 },
			);
			await page.waitForTimeout(2200);
			result.frames = [];
			for (const frame of page.frames()) {
				try {
					result.frames.push(
						await frame.evaluate(() => {
							const root =
								document.querySelector("[data-intro-review]") ?? document.body;
							const visible = (element) => {
								const style = getComputedStyle(element);
								const r = element.getBoundingClientRect();
								return (
									style.visibility !== "hidden" &&
									style.display !== "none" &&
									r.width > 0 &&
									r.height > 0
								);
							};
							const all = Array.from(root.querySelectorAll("*")).filter(
								visible,
							);
							return {
								url: location.href,
								text: (root.innerText ?? "").trim().slice(0, 2000),
								controls: all
									.filter((el) =>
										el.matches(
											'button,input,select,textarea,a[href],[role="button"]',
										),
									)
									.map((el) => ({
										tag: el.localName,
										label:
											el.getAttribute("aria-label") ??
											el.getAttribute("title") ??
											el.textContent?.trim().slice(0, 80),
										disabled: el.matches(":disabled"),
									}))
									.slice(0, 40),
								images: all
									.filter((el) => el.matches("img"))
									.map((el) => ({
										src: el.getAttribute("src"),
										loaded: el.complete && el.naturalWidth > 0,
									})),
								graphics: all.filter((el) => el.matches("svg,canvas")).length,
								hosts: all
									.filter((el) => el.localName.startsWith("tp-"))
									.slice(0, 20)
									.map((el) => ({
										tag: el.localName,
										width: Math.round(el.getBoundingClientRect().width),
										height: Math.round(el.getBoundingClientRect().height),
									})),
								undefinedTags: [
									...new Set(
										Array.from(root.querySelectorAll(":not(:defined)")).map(
											(el) => el.localName,
										),
									),
								],
							};
						}),
					);
				} catch (error) {
					result.errors.push(`Frame inspection: ${error.message}`);
				}
			}
			await page.screenshot({
				path: join(output, `${example.name}.png`),
				timeout: 6000,
			});
		} catch (error) {
			result.auditError = error.message;
		}
		results.push(result);
		writeFileSync(
			join(output, "results.json"),
			`${JSON.stringify(
				results.sort((a, b) => a.name.localeCompare(b.name)),
				null,
				2,
			)}\n`,
		);
		console.log(
			`${results.length}/${examples.length} ${example.name}: ${result.auditError ? "audit error" : (result.frames?.[0]?.text.replace(/\s+/g, " ").slice(0, 110) ?? "")}`,
		);
		await context.close();
	}
}
try {
	await Promise.all([worker(), worker(), worker()]);
} finally {
	await browser.close();
}
console.log(`Reports and screenshots: ${output}`);
