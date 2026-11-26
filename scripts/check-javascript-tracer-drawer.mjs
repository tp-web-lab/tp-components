import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
const moduleUrl =
	process.env.JAVASCRIPT_MODULE || "/src/components/javascript/javascript.ts";
const browser =
	name === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
	});
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.addInitScript(() => {
		const Original = window.Worker;
		window.traceWorkers = 0;
		window.traceStops = 0;
		window.Worker = class extends Original {
			constructor(url, options) {
				super(url, options);
				this.isTrace = String(url).includes("javascript-tracer-worker");
				if (this.isTrace) window.traceWorkers++;
			}
			terminate() {
				if (this.isTrace) window.traceStops++;
				super.terminate();
			}
		};
	});
	await page.route("**/__javascript-tracer-drawer.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: `<!doctype html><html><body><tp-javascript tracer filename="square.js" query="square(7)"><script type="tp/javascript">function square(n) { return n*n; }</script></tp-javascript><script type="module" src="${moduleUrl}"></script></body></html>`,
		}),
	);
	await page.goto(`${base}/__javascript-tracer-drawer.html`);
	await page.waitForFunction(
		() =>
			Boolean(document.querySelector("tp-javascript [data-command=edit]")),
		null,
		{ timeout: 90000 },
	);
	const host = page.locator("tp-javascript");
	await host.locator("[data-command=edit]").click();
	await page.waitForFunction(() =>
		document
			.querySelector("tp-javascript > .tp-interpreter-panel tp-code-editor")
			?.getValue?.()
			?.includes("return n*n"),
	);
	await host
		.locator(":scope > .tp-interpreter-panel tp-code-editor")
		.evaluate((e) => e.setValue("function square(n) { return n*n + 1; }"));
	await host
		.locator(
			":scope > .tp-interpreter-panel > .tp-interpreter-prompt > tp-textfield",
		)
		.evaluate((e) => (e.value = "console.log(square(7))"));
	const transcript = await host
		.locator(":scope > .tp-interpreter-panel > .tp-interpreter-output")
		.innerText();
	await host.locator("[data-command=trace]").click();
	await page.waitForFunction(
		() => {
			const t = document.querySelector(
				"[data-javascript-tracer-drawer] tp-javascript-tracer",
			);
			return t?.getCode?.() && JSON.parse(t.getCode()).trace.length > 0;
		},
		null,
		{ timeout: 90000 },
	);
	const drawer = host.locator("[data-javascript-tracer-drawer]");
	const trace = drawer.locator("tp-javascript-tracer");
	assert.equal(await drawer.getAttribute("width"), "75%");
	const bounds = await drawer.boundingBox();
	assert.ok(Math.abs(bounds.width - 1080) < 4, `Drawer width ${bounds.width}`);
	await trace.evaluate((e) => e.goTo(10000));
	assert.equal(await trace.locator("[data-role=stdout]").innerText(), "50\n");
	assert.equal(await trace.getAttribute("filename"), "square.js");
	const code = JSON.parse(await trace.evaluate((e) => e.getCode())).code;
	assert.equal(code, "function square(n) { return n*n + 1; }\n\nconsole.log(square(7))");
	assert.equal(
		await host
			.locator(":scope > .tp-interpreter-panel > .tp-interpreter-output")
			.innerText(),
		transcript,
	);
	await drawer.locator("[data-tp-drawer-close]").click();
	await drawer.evaluate((e) => e.setAttribute("width", "60%"));
	const stopped = await page.evaluate(() => window.traceStops);
	await host.locator("[data-command=trace]").click();
	await page.waitForFunction(() => window.traceWorkers >= 2);
	assert.equal(await drawer.getAttribute("width"), "60%");
	await drawer.locator("[data-tp-drawer-close]").click();
	await page.waitForFunction((stops) => window.traceStops > stops, stopped);
	assert.equal(
		await host.locator("[data-command=trace]").getAttribute("disabled"),
		null,
	);
	assert.deepEqual(errors, []);
	console.log(
		`${name}: unsaved source + current query -> 50, 75% drawer, unchanged interpreter, preserved resized width, Worker stopped on close`,
	);
} finally {
	await browser.close();
}
