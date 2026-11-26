import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
const module =
	process.env.TRACE_MODULE ||
	"/src/components/javascript-tracer/javascript-tracer.ts";
const browser = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
		acceptDownloads: true,
	});
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.route("**/__javascript-tracer.html", (r) =>
		r.fulfill({
			contentType: "text/html",
			body: `<tp-javascript-tracer></tp-javascript-tracer><script type="module" src="${module}"></script>`,
		}),
	);
	await page.goto(base + "/__javascript-tracer.html");
	await page.waitForFunction(() => customElements.get("tp-javascript-tracer"));
	const host = page.locator("tp-javascript-tracer");
	const cases = [
		["nested-arrays.js", "true\n[[1,2,5],[3,4],[1,2,5]]\n"],
		["recursion.js", "120\n"],
		["closures.js", "1\n2\n1\n"],
		["classes.js", "4\n4\ntrue\n"],
		["inheritance.js", "5\n7\ntrue\n"],
		["caught-exception.js", "Cannot divide by zero\ndone\n"],
		["uncaught-exception.js", ""],
		["loops.js", "[1,4,9,16]\n"],
	];
	for (const [filename, stdout] of cases) {
		await host.evaluate(async (e, filename) => {
			e.src = "/docs/components/javascript-tracer/examples/" + filename;
			await e.refresh();
			e.record();
		}, filename);
		await page.waitForFunction(
			() =>
				document
					.querySelector("[data-role=status]")
					?.textContent.startsWith("Step "),
			null,
			{ timeout: 90000 },
		);
		const data = JSON.parse(await host.evaluate((e) => e.getCode()));
		assert.equal(data.language, "javascript");
		assert.equal(data.trace.at(-1).stdout, stdout);
		assert.ok(data.trace.length > 1);
		for (let index = 0; index < data.trace.length; index++) {
			await host.evaluate((e, index) => e.goTo(index), index);
			assert.deepEqual(
				await host.locator('[data-role="variables"] dt').allTextContents(),
				data.trace[index].ordered_globals,
			);
			assert.ok(
				!(await host.locator('[data-role="frames"]').innerText()).includes(
					"<uninitialized>",
				),
			);
		}
		if (filename === "nested-arrays.js") {
			assert.deepEqual(data.trace[0].ordered_globals, []);
			assert.deepEqual(data.trace[1].ordered_globals, ["shared"]);
			assert.deepEqual(data.trace[2].ordered_globals, ["shared", "rows"]);
			await host.evaluate((e) => e.goTo(0));
			assert.equal(await host.locator('[data-role="variables"] dt').count(), 0);
		}
		if (filename === "inheritance.js") {
			const last = data.trace.at(-1);
			assert.deepEqual(last.heap[last.globals.StepCounter[1]].slice(0, 3), [
				"CLASS",
				"StepCounter",
				["Counter"],
			]);
			const frames = data.trace
				.flatMap((s) => s.stack_to_render)
				.filter((f) => f.func_name === "StepCounter.constructor");
			assert.ok(frames.some((f) => !("this" in f.encoded_locals)));
			assert.ok(frames.some((f) => "this" in f.encoded_locals));
		}

		if (filename === "recursion.js")
			assert.ok(data.trace.some((s) => s.stack_to_render.length === 5));
		if (filename === "closures.js")
			assert.deepEqual(
				data.trace
					.at(-1)
					.stack_to_render.filter((f) => f.is_parent)
					.map((f) => f.encoded_locals.count)
					.sort(),
				[1, 2],
			);
		await host.evaluate((e) => e.goTo(10000));
		if (filename === "uncaught-exception.js") {
			assert.match(
				await host.locator("[data-role=event]").innerText(),
				/TypeError: Invalid value/,
			);
			assert.ok(
				await host
					.locator("[data-role=event]")
					.evaluate((e) => e.classList.contains("trace-error")),
			);
		}
		if (filename === "nested-arrays.js") {
			for (const width of [1440, 760, 340]) {
				await page.setViewportSize({ width, height: 1000 });
				await page.waitForTimeout(100);
				const edges = await host
					.locator(".reference-arrows g path")
					.evaluateAll((paths) =>
						paths.map((p) => {
							const source = document.getElementById(p.dataset.from);
							const a = p.getPointAtLength(0),
								b = p.getPointAtLength(1);
							return {
								sequence: !!source.closest(".sequence"),
								dx: b.x - a.x,
								dy: b.y - a.y,
							};
						}),
					);
				assert.ok(edges.some((e) => e.sequence));
				assert.ok(
					edges
						.filter((e) => e.sequence)
						.every((e) => Math.abs(e.dx) < 0.01 && e.dy > 0),
				);
			}
			await page.setViewportSize({ width: 1440, height: 1000 });
		}
		await page.screenshot({
			path: `/tmp/javascript-tracer-${name}-${filename}.png`,
			fullPage: true,
		});
		// Import the full JSON with Worker disabled, preserving language, values and source.
		await page.evaluate(() => {
			window.originalWorker = window.Worker;
			window.Worker = class {
				constructor() {
					throw Error("Replay must not execute");
				}
			};
		});
		await host.locator("[data-role=file]").setInputFiles({
			name: filename + ".json",
			mimeType: "application/json",
			buffer: Buffer.from(JSON.stringify(data)),
		});
		await page.waitForFunction(() =>
			document
				.querySelector("[data-role=status]")
				?.textContent.startsWith("Step 1 /"),
		);
		await host.evaluate((e) => e.goTo(10000));
		assert.equal(
			await host.locator("[data-role=stdout]").textContent(),
			stdout,
		);
		await page.evaluate(() => (window.Worker = window.originalWorker));
		console.log(name, filename, data.trace.length, "snapshots, replay passed");
	}
	// Save as fallback uses a chosen filename and downloads a complete recording.
	await page.evaluate(() => {
		window.showSaveFilePicker = undefined;
	});
	page.once("dialog", (dialog) => dialog.accept("javascript-lesson.json"));
	const downloadPromise = page.waitForEvent("download");
	await host.locator("[data-role=save]").click();
	const download = await downloadPromise;
	assert.equal(download.suggestedFilename(), "javascript-lesson.json");
	assert.deepEqual(errors, []);
} finally {
	await browser.close();
}
