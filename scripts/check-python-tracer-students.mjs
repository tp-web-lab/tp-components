import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const browser =
	name === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
	});
	await page.goto(
		(process.env.BASE_URL || "http://127.0.0.1:4386") +
			"/prototypes/python-tracer/index.html",
	);
	await page.waitForFunction(() => window.pythonTracePrototype);
	await page.locator("[data-example=students]").click();
	await page.locator("#run").click();
	await page.waitForFunction(
		() => window.pythonTracePrototype.snapshots.length > 0,
		null,
		{ timeout: 75000 },
	);
	for (let i = 0; i < 11; i++) await page.locator("#next").click();
	assert.match(await page.locator("#status").innerText(), /^Step 12 /);
	assert.equal(
		await page
			.locator("#frames dt")
			.filter({ hasText: /^avg$/ })
			.evaluate((el) => el.nextElementSibling.textContent),
		"92.5",
	);
	await page.locator("#next").click();
	assert.equal(
		await page
			.locator("#frames dt")
			.filter({ hasText: /^avg$/ })
			.evaluate((el) => el.nextElementSibling.textContent),
		"75.0",
	);
	assert.ok(
		!(await page.locator("#frames").innerText()).includes("SPECIAL_FLOAT"),
	);
	await page.waitForFunction(
		() =>
			document.querySelectorAll(".reference-arrows path[data-lane]").length ===
			4,
	);
	const edges = await page
		.locator(".reference-arrows path[data-lane]")
		.evaluateAll((paths) =>
			paths.map((p) => ({
				lane: p.dataset.lane,
				exit: p.dataset.exit,
				source: document.getElementById(p.dataset.from).closest("[data-object]")
					.dataset.object,
			})),
		);
	assert.equal(new Set(edges.map((e) => e.lane)).size, 4);
	const list = edges.filter((e) => e.source === "1");
	assert.equal(list.length, 2);
	assert.notEqual(list[0].exit, list[1].exit);
	await page
		.locator("#memory")
		.screenshot({ path: `/tmp/python-students-step12-${name}.png` });
	await page.locator("#heap [data-reference]").first().hover();
	assert.equal(await page.locator(".reference-arrows path.active").count(), 1);
	assert.equal(
		await page
			.locator(".reference-arrows path:not(.active)[data-from]")
			.first()
			.evaluate((el) => getComputedStyle(el).opacity),
		"0.18",
	);
	await page.setViewportSize({ width: 600, height: 900 });
	await page.waitForTimeout(200);
	const geometry = await page.locator("#memory").evaluate((root) => {
		const bounds = root.getBoundingClientRect();
		return [...root.querySelectorAll("path[data-lane]")].every((p) => {
			const target = document
					.getElementById("object-" + p.dataset.to)
					.getBoundingClientRect(),
				end = p.getPointAtLength(p.getTotalLength());
			return (
				Math.abs(end.x - 8 - (target.right - bounds.left)) < 1 &&
				Number(p.dataset.lane) < bounds.width
			);
		});
	});
	assert.ok(geometry);
	await page.locator("#last").click();
	assert.equal(await page.locator("#stdout").textContent(), "Ada 92.5\n");
	console.log(
		JSON.stringify({
			browser: name,
			steps: [12, 13],
			avg: "92.5 → 75.0",
			distinctLanes: 4,
			distinctListExits: 2,
			hover: true,
			resize: true,
			output: "Ada 92.5",
			passed: true,
		}),
	);
} finally {
	await browser.close();
}
