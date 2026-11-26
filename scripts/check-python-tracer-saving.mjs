import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const browser =
	name === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
try {
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.addInitScript(() => {
		window.workerCalls = 0;
		window.Worker = class {
			constructor() {
				window.workerCalls++;
				throw Error("No Python expected");
			}
		};
	});
	const base = process.env.BASE_URL || "http://127.0.0.1:4386";
	await page.goto(`${base}/prototypes/python-tracer/index.html`);
	await page.waitForFunction(() => window.pythonTracePrototype);
	assert.equal(await page.locator("#save").getAttribute("disabled"), "");
	await page.goto(`${base}/prototypes/python-tracer/replay.html`);
	await page.waitForFunction(
		() => window.pythonTracePrototype?.snapshots.length === 16,
	);
	await page.locator("#next").click();
	await page.evaluate(() =>
		document.querySelector("#source").setValue('print("unexecuted edit")'),
	);
	const original = JSON.parse(
		await readFile(
			"public/prototypes/python-tracer/examples/students.trace.json",
			"utf8",
		),
	);
	// Exercise native API contract without opening an OS dialog in automation.
	await page.evaluate(() => {
		window.showSaveFilePicker = async (options) => {
			window.saveOptions = options;
			return {
				name: "custom.json",
				createWritable: async () => ({
					write: async (blob) => {
						window.savedText = await blob.text();
					},
					close: async () => {
						window.closedSave = true;
					},
				}),
			};
		};
	});
	await page.locator("#save").click();
	await page.waitForFunction(() => window.closedSave);
	assert.deepEqual(
		JSON.parse(await page.evaluate(() => window.savedText)),
		original,
	);
	assert.equal(
		await page.evaluate(() => window.saveOptions.suggestedName),
		"students.trace.json",
	);
	assert.equal(
		await page.evaluate(() => window.pythonTracePrototype.position),
		1,
	);
	await page.evaluate(() => {
		window.showSaveFilePicker = async () => {
			throw new DOMException("Cancelled", "AbortError");
		};
	});
	await page.locator("#save").click();
	assert.equal(await page.locator("#status").innerText(), "Step 2 / 16");
	await page.evaluate(() => {
		window.showSaveFilePicker = async () => ({
			name: "bad.json",
			createWritable: async () => {
				throw Error("Cannot write");
			},
		});
	});
	await page.locator("#save").click();
	await page.waitForFunction(
		() =>
			document.querySelector("#status").textContent ===
			"Save failed: Cannot write",
	);
	// Real fallback download and reimport, including automatic .json extension.
	await page.evaluate(() => {
		window.showSaveFilePicker = undefined;
	});
	page.once("dialog", (dialog) => dialog.accept("my-trace"));
	const downloadPromise = page.waitForEvent("download");
	await page.locator("#save").click();
	const download = await downloadPromise;
	assert.equal(download.suggestedFilename(), "my-trace.json");
	const filename = await download.path();
	assert.deepEqual(JSON.parse(await readFile(filename, "utf8")), original);
	await page
		.locator("#file")
		.setInputFiles({
			name: "my-trace.json",
			mimeType: "application/json",
			buffer: await readFile(filename),
		});
	await page.waitForFunction(() => window.pythonTracePrototype.position === 0);
	assert.equal(
		await page.locator("#source").evaluate((e) => e.getValue()),
		original.code,
	);
	await page.locator("#last").click();
	assert.equal(await page.locator("#stdout").innerText(), "Ada 92.5\n");
	assert.equal(await page.evaluate(() => window.workerCalls), 0);
	assert.deepEqual(errors, []);
	await page.waitForFunction(() => document.querySelector("#save tp-icon svg"));
	console.log(
		`${name}: Save as, full JSON round trip, recorded source, cancellation, write error, icon and navigation passed; zero Python Workers`,
	);
} finally {
	await browser.close();
}
