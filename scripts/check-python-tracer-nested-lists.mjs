import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const browser = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
	});
	await page.route("**/__trace-nested.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: '<tp-python-tracer src="/docs/components/python-tracer/examples/nested-lists.py"></tp-python-tracer><script type="module" src="/src/components/python-tracer/python-tracer.ts"></script>',
		}),
	);
	await page.goto("http://127.0.0.1:4386/__trace-nested.html");
	await page.waitForFunction(() =>
		document
			.querySelector("[data-role=status]")
			?.textContent.includes("Source loaded"),
	);
	const host = page.locator("tp-python-tracer");
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
	const last = data.trace.at(-1);
	assert.equal(
		last.stdout,
		"[[1, 2], [3, 4], [1, 2]]\nTrue\n[[1, 2, 5], [3, 4], [1, 2, 5]]\n",
	);
	assert.ok(!data.trace.some((s) => s.exception_msg));
	const shared = last.globals.shared[1],
		rows = last.globals.rows[1];
	assert.deepEqual(last.heap[rows].slice(1), [
		["REF", shared],
		last.heap[rows][2],
		["REF", shared],
	]);
	assert.notEqual(last.heap[rows][2][1], shared);
	assert.deepEqual(last.heap[shared], ["LIST", 1, 2, 5]);
	assert.ok(
		data.trace.some((s) => JSON.stringify(s.heap?.[shared]) === '["LIST",1,2]'),
	);
	await host.evaluate((e) => e.goTo(10000));
	for (const width of [1440, 760, 340]) {
		await page.setViewportSize({ width, height: 1000 });
		await page.waitForTimeout(150);
		const arrows = await host.locator(".reference-arrows g path").evaluateAll(
			(paths, rows) =>
				paths
					.filter(
						(p) =>
							document.getElementById(p.dataset.from)?.closest("[data-object]")
								?.dataset.object === String(rows),
					)
					.map((p) => {
						const a = p.getPointAtLength(0),
							b = p.getPointAtLength(1);
						const origin = document
							.getElementById(p.dataset.from)
							.closest("[data-object]");
						const memoryTop = origin
							.closest('[data-role="memory"]')
							.getBoundingClientRect().top;
						const exit = memoryTop + Number(p.dataset.exit);
						return {
							clearance:
								origin.nextElementSibling.getBoundingClientRect().top - exit,
							dx: b.x - a.x,
							dy: b.y - a.y,
							to: p.dataset.to,
							lane: p.dataset.lane,
						};
					}),
			rows,
		);
		assert.equal(arrows.length, 3);
		assert.ok(
			arrows.every((a) => a.clearance >= 10),
			"Exit lanes must clear the next card",
		);
		assert.ok(arrows.every((a) => Math.abs(a.dx) < 0.01 && a.dy > 0));
		assert.equal(arrows.filter((a) => a.to === String(shared)).length, 2);
		assert.equal(new Set(arrows.map((a) => a.lane)).size, 3);
		await page.screenshot({
			path: `/tmp/trace-nested-${name}-${width}.png`,
			fullPage: true,
		});
	}
	console.log(
		name +
			": nested lists, mutation, shared references and arrows passed at 1440/760/340px",
	);
} finally {
	await browser.close();
}
