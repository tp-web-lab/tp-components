import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const browserName = process.env.BROWSER || "chrome";
const browser =
	browserName === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
	});
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.goto(
		(process.env.BASE_URL || "http://127.0.0.1:4386") +
			"/prototypes/python-tracer/index.html",
	);
	await page.waitForFunction(() => window.pythonTracePrototype);
	await page.locator("[data-example=sharing]").click();
	await page.locator("#run").click();
	await page.waitForFunction(
		() => window.pythonTracePrototype.snapshots.length > 0,
		null,
		{ timeout: 75000 },
	);
	await page.locator("#last").click();
	async function check() {
		await page.waitForFunction(
			() =>
				document.querySelectorAll(".reference-arrows g path").length ===
				document.querySelectorAll("#memory [data-reference]").length,
		);
		const result = await page.evaluate(() => {
			const root = document.getElementById("memory").getBoundingClientRect();
			const edges = [
				...document.querySelectorAll(".reference-arrows g path"),
			].map((path) => {
				const s = document.getElementById(path.dataset.from),
					t = document.getElementById("object-" + path.dataset.to);
				const a = s.getBoundingClientRect(),
					b = t.getBoundingClientRect(),
					internal = !!s.closest("#heap");
				const start = path.getPointAtLength(0),
					end = path.getPointAtLength(path.getTotalLength());
				return {
					to: path.dataset.to,
					internal,
					startError: Math.hypot(
						start.x - ((internal ? a.left + a.width / 2 : a.right) - root.left),
						start.y - ((internal ? a.bottom : a.top + a.height / 2) - root.top),
					),
					endError: Math.abs(
						end.x +
							(internal ? -8 : 8) -
							((internal ? b.right : b.left) - root.left),
					),
					within: end.y >= b.top - root.top && end.y <= b.bottom - root.top,
				};
			});
			return edges;
		});
		assert.equal(result.length, 6); // a,b,c,pair and pair's two references
		assert.equal(result.filter((e) => e.to === "1").length, 4);
		assert.equal(result.filter((e) => e.internal).length, 2);
		for (const edge of result) {
			assert.ok(edge.startError < 1, JSON.stringify(edge));
			assert.ok(edge.endError < 1);
			assert.ok(edge.within);
		}
	}
	await check();
	await page.waitForFunction(
		() => document.querySelectorAll(".reference-arrows g path").length === 6,
	);
	const markers = await page.locator(".reference-arrows").evaluate((svg) => {
		const marker = svg.querySelector("marker");
		return {
			units: marker.getAttribute("markerUnits"),
			x: marker.getAttribute("refX"),
			y: marker.getAttribute("refY"),
			width: marker.getAttribute("markerWidth"),
			aligned: [...svg.querySelectorAll("g path")].every((path) => {
				const length = path.getTotalLength(),
					tip = path.getPointAtLength(length),
					before = path.getPointAtLength(length - 1);
				return Math.abs(tip.y - before.y) < 0.01;
			}),
		};
	});
	assert.deepEqual(markers, {
		units: "userSpaceOnUse",
		x: "0",
		y: "4",
		width: "8",
		aligned: true,
	});
	const reference = page.locator('#frames [data-reference="1"]').first();
	await reference.hover();
	assert.equal(await page.locator(".reference-arrows path.active").count(), 1);
	assert.equal(await page.locator("#object-1.referenced").count(), 1);
	await reference.focus();
	assert.equal(await page.locator(".reference-arrows path.active").count(), 1);
	await page
		.locator("#memory")
		.screenshot({ path: "/tmp/python-tracer-arrows-" + browserName + ".png" });
	await page.setViewportSize({ width: 600, height: 900 });
	await page.waitForTimeout(150);
	await check();
	await page.locator(".memory-scroll").evaluate((el) => {
		el.scrollLeft = el.scrollWidth;
	});
	await check();
	await page.locator("#first").click();
	await page.waitForFunction(
		() => document.querySelectorAll(".reference-arrows g path").length === 0,
	);
	await page.locator("#last").click();
	await check();
	assert.deepEqual(errors, []);
	console.log(
		JSON.stringify({
			browser: browserName,
			version: browser.version(),
			arrows: 6,
			sharedTarget: 4,
			checks: [
				"endpoints",
				"nested references",
				"hover",
				"focus",
				"resize",
				"horizontal scroll",
				"step replacement",
			],
			passed: true,
		}),
	);
} finally {
	await browser.close();
}
