import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
const moduleUrl =
	process.env.TRACE_MODULE || "/src/components/python-tracer/python-tracer.ts";
const browser =
	name === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
const report = { browser: name, checks: [] };
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
	});
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.route("**/__trace-tests.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: `<!doctype html><html><body><tp-python-tracer src="/docs/components/python-tracer/examples/students.py"></tp-python-tracer><script type="module" src="${moduleUrl}"></script></body></html>`,
		}),
	);
	await page.goto(`${base}/__trace-tests.html`);
	const host = page.locator("tp-python-tracer").first();
	const control = (id) => host.locator(`[data-role="${id}"]`);
	await page.waitForFunction(() =>
		document
			.querySelector("tp-python-tracer")
			?.querySelector("tp-code-editor")
			?.getValue()
			?.includes("students ="),
	);
	assert.equal(await host.evaluate((e) => e.shadowRoot), null);
	assert.equal(await control("filename").innerText(), "students.py");
	assert.equal(await control("source").getAttribute("filename"), "students.py");
	assert.equal(await control("source-panel").isVisible(), false);
	await control("edit").click();
	assert.equal(await control("source-panel").isVisible(), true);
	await control("edit").click();
	assert.equal(await control("source-panel").isVisible(), false);
	report.checks.push("interpreter toolbar, filename and source toggle");
	assert.ok((await control("save").getAttribute("disabled")) !== null);
	await control("run").click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-python-tracer")?.getCode?.() &&
			JSON.parse(document.querySelector("tp-python-tracer").getCode()).trace
				.length > 0,
		null,
		{ timeout: 90000 },
	);
	await control("last").click();
	assert.equal(await control("stdout").innerText(), "Ada 92.5\n");
	const recorded = JSON.parse(await host.evaluate((e) => e.getCode()));
	report.checks.push("real Python recording: Students, expression snapshots, Ada 92.5");
	// Save the complete real recording, not the current edited text.
	await control("source").evaluate((e) => e.setValue('print("not recorded")'));
	await page.evaluate(() => {
		window.showSaveFilePicker = undefined;
	});
	page.once("dialog", (dialog) => dialog.accept("students-saved"));
	const pending = page.waitForEvent("download");
	await control("save").click();
	const download = await pending;
	assert.equal(download.suggestedFilename(), "students-saved.json");
	const bytes = await readFile(await download.path());
	assert.deepEqual(JSON.parse(bytes.toString()), recorded);
	await page.evaluate(() => {
		window.Worker = class {
			constructor() {
				throw Error("Replay must not start Python");
			}
		};
	});
	await control("file").setInputFiles({
		name: "students-saved.json",
		mimeType: "application/json",
		buffer: bytes,
	});
	await page.waitForFunction(
		() =>
			document.querySelector('[data-role="status"]').textContent.startsWith("Step 1 / "),
	);
	for (const id of ["next", "last", "previous", "first"])
		await control(id).click();
	assert.equal(await control("status").innerText(), `Step 1 / ${recorded.trace.length}`);
	report.checks.push(
		"Save as download, complete JSON reload, navigation without Worker",
	);
	// Multiple instances and trace precedence use actual saved assets.
	let sourceFetched = false;
	await page.route("**/unused.py", (route) => {
		sourceFetched = true;
		return route.abort();
	});
	await page.evaluate(() => {
		const h = document.createElement("tp-python-tracer");
		h.setAttribute("src", "unused.py");
		h.setAttribute(
			"trace",
			"/docs/components/python-tracer/examples/students.trace.json",
		);
		document.body.append(h);
	});
	const second = page.locator("tp-python-tracer").nth(1);
	await page.waitForFunction(
		() =>
			document.querySelectorAll("tp-python-tracer")[1]?.getCode?.() &&
			JSON.parse(document.querySelectorAll("tp-python-tracer")[1].getCode())
				.trace.length === 16,
	);
	assert.equal(sourceFetched, false);
	await second.evaluate((e) => e.goTo(15));
	assert.equal(
		await second.locator('[data-role="stdout"]').innerText(),
		"Ada 92.5\n",
	);
	assert.equal(await control("status").innerText(), `Step 1 / ${recorded.trace.length}`);
	report.checks.push("independent instances and trace priority");

	await control("file").setInputFiles({
		name: "bad.json",
		mimeType: "application/json",
		buffer: Buffer.from("{}"),
	});
	await page.waitForFunction(() =>
		document
			.querySelector('[data-role="status"]')
			.textContent.startsWith("Load failed"),
	);
	assert.deepEqual(
		JSON.parse(await host.first().evaluate((e) => e.getCode())),
		recorded,
	);
	report.checks.push("invalid JSON preserves previous trace");
	assert.equal(await control("filename").innerText(), "students-saved.json");
	await host.evaluate((e) => {
		e.filename = "lesson.py";
	});
	assert.equal(await control("filename").innerText(), "lesson.py");
	assert.deepEqual(
		JSON.parse(await host.evaluate((e) => e.getCode())),
		recorded,
	);
	await host.first().evaluate((e) => e.goTo(15));
	await page.setViewportSize({ width: 600, height: 900 });
	await page.waitForFunction(() =>
		document
			.querySelector("tp-python-tracer")
			?.querySelector(".reference-arrows g path"),
	);
	assert.ok(
		(await host.first().locator(".reference-arrows g path").count()) > 0,
	);
	await page.screenshot({
		path: `/tmp/python-tracer-component-${name}.png`,
		fullPage: true,
	});
	assert.deepEqual(errors, []);
	report.checks.push("narrow screen, reference arrows and no page errors");
	report.passed = true;
	await writeFile(
		`/tmp/python-tracer-component-${name}.json`,
		JSON.stringify(report, null, 2) + "\n",
	);
	console.log(report);
} finally {
	await browser.close();
}
