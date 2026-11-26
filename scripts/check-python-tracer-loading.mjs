import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const browser =
	name === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
try {
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto(`${base}/prototypes/python-tracer/index.html`);
	await page.waitForFunction(() => window.pythonTracePrototype);
	// Capture an actual recording, then replay it in a fresh page where Workers are forbidden.
	await page.locator("[data-example=students]").click();
	await page.locator("#run").click();
	await page.waitForFunction(
		() => window.pythonTracePrototype.snapshots.length > 0,
		null,
		{ timeout: 75000 },
	);
	const saved = await page.evaluate(() => ({
		version: 1,
		code: document.querySelector("#source").getValue(),
		trace: window.pythonTracePrototype.snapshots,
	}));
	assert.equal(saved.trace.at(-1).stdout, "Ada 92.5\n");
	if (name === "chrome") {
		await mkdir("public/prototypes/python-tracer/examples", { recursive: true });
		await writeFile(
			"public/prototypes/python-tracer/examples/students.trace.json",
			JSON.stringify(saved, null, 2) + "\n",
		);
		await writeFile(
			"public/prototypes/python-tracer/examples/students.py",
			saved.code + "\n",
		);
	}
	await page.addInitScript(() => {
		window.workerCalls = 0;
		window.Worker = class {
			constructor() {
				window.workerCalls++;
				throw Error("Replay must not launch Python");
			}
		};
	});
	await page.reload();
	await page.waitForFunction(() => window.pythonTracePrototype);
	let sources = 0;
	await page.route("**/must-not-load.py", (route) => {
		sources++;
		return route.fulfill({ body: 'raise Exception("wrong source")' });
	});
	await page.route("**/saved.json", (route) =>
		route.fulfill({
			contentType: "application/json",
			body: JSON.stringify(saved),
		}),
	);
	await page.evaluate(() => {
		const host = document.querySelector("tp-python-tracer");
		host.setAttribute("trace", "saved.json");
		host.setAttribute("src", "must-not-load.py");
	});
	await page.waitForFunction(
		() => window.pythonTracePrototype.snapshots.length > 0,
	);
	assert.equal(sources, 0);
	assert.equal(
		await page.locator("#source").evaluate((el) => el.getValue()),
		saved.code,
	);
	await page.locator("#last").click();
	assert.equal(await page.locator("#stdout").innerText(), "Ada 92.5\n");
	await page.locator("#previous").click();
	assert.equal(
		await page.evaluate(() => window.pythonTracePrototype.position),
		saved.trace.length - 2,
	);
	await page.locator("#first").click();
	await page.locator("#next").click();
	assert.equal(
		await page.evaluate(() => window.pythonTracePrototype.position),
		1,
	);
	// Native chooser accepts a previously saved complete JSON trace.
	const chooser = page.waitForEvent("filechooser");
	await page.locator("#load").click();
	await (await chooser).setFiles({
		name: "saved.json",
		mimeType: "application/json",
		buffer: Buffer.from(JSON.stringify(saved)),
	});
	await page.waitForFunction(() => window.pythonTracePrototype.position === 0);
	for (const invalid of [
		"{",
		JSON.stringify(saved.trace[0]),
		JSON.stringify({ ...saved, version: 2 }),
		JSON.stringify({ ...saved, trace: [{ event: "line", heap: { 1: null } }] }),
	]) {
		await page
			.locator("#file")
			.setInputFiles({
				name: "bad.json",
				mimeType: "application/json",
				buffer: Buffer.from(invalid),
			});
		await page.waitForFunction(() =>
			document.querySelector("#status").textContent.startsWith("Load failed:"),
		);
		assert.equal(
			await page.evaluate(() => window.pythonTracePrototype.snapshots.length),
			saved.trace.length,
		);
	}
	// Source only loads the editor, not the Python runtime.
	await page.route("**/source.py", (route) =>
		route.fulfill({ body: "print(42)" }),
	);
	await page.evaluate(() => {
		const h = document.querySelector("tp-python-tracer");
		h.setAttribute("src", "source.py");
		h.removeAttribute("trace");
	});
	await page.waitForFunction(
		() => document.querySelector("#source").getValue() === "print(42)",
	);
	assert.equal(
		await page.evaluate(() => window.pythonTracePrototype.snapshots.length),
		0,
	);
	await page.route("**/missing.json", (route) =>
		route.fulfill({ status: 404 }),
	);
	await page.evaluate(() =>
		document
			.querySelector("tp-python-tracer")
			.setAttribute("trace", "missing.json"),
	);
	await page.waitForFunction(() =>
		document.querySelector("#status").textContent.includes("HTTP 404"),
	);
	// A later source wins over a delayed trace; separate instances have independent navigation.
	await page.route("**/slow.json", async (route) => {
		await new Promise((r) => setTimeout(r, 300));
		await route.fulfill({ body: JSON.stringify(saved) }).catch(() => {});
	});
	await page.evaluate(() => {
		const h = document.querySelector("tp-python-tracer");
		h.setAttribute("trace", "slow.json");
		h.removeAttribute("trace");
		const second = document.createElement("tp-python-tracer");
		second.setAttribute("trace", "saved.json");
		document.querySelector("main").append(second);
	});
	await page.waitForFunction(
		() =>
			document.querySelectorAll("tp-python-tracer")[1].runtime?.snapshots
				.length > 0,
	);
	const second = page.locator("tp-python-tracer").nth(1);
	await second.locator("[data-role=last]").click();
	assert.equal(
		await second.locator("[data-role=stdout]").innerText(),
		"Ada 92.5\n",
	);
	assert.equal(
		await page.locator("#source").evaluate((el) => el.getValue()),
		"print(42)",
	);
	assert.equal(await page.evaluate(() => window.workerCalls), 0);
	assert.deepEqual(errors, []);
	await page.screenshot({
		path: `/tmp/python-tracer-loading-${name}.png`,
		fullPage: true,
	});
	console.log(
		`${name}: live recording, trace priority, file picker, navigation, invalid files, src, HTTP error, cancellation and independent instances passed; replay Worker calls: 0`,
	);
} finally {
	await browser.close();
}
