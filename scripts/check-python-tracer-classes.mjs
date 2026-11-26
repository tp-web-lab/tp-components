import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
const moduleUrl =
	process.env.TRACE_MODULE || "/src/components/python-tracer/python-tracer.ts";
const browser = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
	});
	const errors = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.route("**/__trace-classes.html", (r) =>
		r.fulfill({
			contentType: "text/html",
			body: `<!doctype html><tp-python-tracer src="/docs/components/python-tracer/examples/counter.py"></tp-python-tracer><script type="module" src="${moduleUrl}"></script>`,
		}),
	);
	await page.goto(`${base}/__trace-classes.html`);
	const host = page.locator("tp-python-tracer");
	for (const [filename, expected] of [
		["counter.py", "4\n4\nTrue\n"],
		["inheritance.py", "5\n7\nTrue\n"],
		["linked-nodes.py", "2\n"],
	]) {
		await host.evaluate(
			(e, f) => (e.src = "/docs/components/python-tracer/examples/" + f),
			filename,
		);
		await page.waitForFunction(
			(f) =>
				document.querySelector("[data-role=filename]")?.textContent === f &&
				document
					.querySelector("[data-role=status]")
					?.textContent.includes("Source loaded"),
			filename,
		);
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
		assert.equal(last.stdout, expected);
		assert.equal(
			data.trace.some((s) => s.exception_msg),
			false,
		);
		if (filename === "counter.py") {
			const id = last.globals.counter[1];
			assert.deepEqual(last.globals.counter, last.globals.alias);
			const values = data.trace.map(
				(step) =>
					step.heap?.[id]?.slice(2).find((pair) => pair?.[0] === "value")?.[1],
			);
			assert.ok(values.includes(3));
			assert.ok(values.includes(4));
			const call = data.trace.find(
				(s) =>
					s.func_name === "increment" &&
					s.stack_to_render?.some((f) => f.encoded_locals?.self?.[1] === id),
			);
			assert.ok(call);
			await host.evaluate((e) => e.goTo(10000));
			const card = host.locator(`[data-object="${id}"]`);
			assert.equal(await card.getAttribute("data-object-kind"), "instance");
			assert.match(await card.innerText(), /value\s+4/);
			assert.equal(
				await host
					.locator(`[data-role=frames] [data-reference="${id}"]`)
					.count(),
				2,
			);
		} else if (filename === "inheritance.py") {
			const id = last.globals.counter[1];
			assert.deepEqual(last.heap[last.globals.StepCounter[1]].slice(0, 3), [
				"CLASS",
				"StepCounter",
				["Counter"],
			]);
			assert.deepEqual(last.heap[id].slice(0, 2), ["INSTANCE", "StepCounter"]);
			assert.deepEqual(Object.fromEntries(last.heap[id].slice(2)), {
				value: 7,
				step: 2,
			});
			const values = data.trace.map(
				(step) =>
					step.heap?.[id]?.slice(2).find((pair) => pair?.[0] === "value")?.[1],
			);
			for (const value of [3, 4, 5, 6, 7]) assert.ok(values.includes(value));
			const nested = data.trace.find(
				(step) =>
					step.stack_to_render?.filter(
						(frame) => frame.func_name === "increment",
					).length === 2,
			);
			assert.ok(nested);
			for (const frame of nested.stack_to_render.filter(
				(frame) => frame.func_name === "increment",
			))
				assert.deepEqual(frame.encoded_locals.self, ["REF", id]);
			for (let index = 0; index < data.trace.length; index++) {
				await host.evaluate((e, index) => e.goTo(index), index);
				assert.ok(
					!(await host.locator('[data-role="event"]').innerText()).includes(
						"Error",
					),
				);
			}
			assert.match(
				await host
					.locator(`[data-object="${last.globals.StepCounter[1]}"]`)
					.innerText(),
				/super: Counter/,
			);
		} else {
			const a = last.globals.first[1],
				b = last.globals.second[1];
			assert.deepEqual(last.globals.first, last.globals.alias);
			await host.evaluate((e) => e.goTo(10000));
			assert.equal(
				await host
					.locator(`[data-object="${a}"] [data-reference="${b}"]`)
					.count(),
				1,
			);
			assert.equal(
				await host
					.locator(`[data-object="${b}"] [data-reference="${a}"]`)
					.count(),
				1,
			);
			await page.waitForFunction(
				() => document.querySelectorAll(".reference-arrows g path").length >= 5,
			);
		}
		assert.equal(await host.locator("[data-object-kind] pre").count(), 0);
		assert.ok((await host.locator("[data-object-kind=class] dt").count()) > 0);
		// Reimport the exact serialized recording without creating another Python Worker.
		await page.evaluate(() => {
			window.savedWorker = window.Worker;
			window.Worker = class {
				constructor() {
					throw Error("Replay must not execute Python");
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
			await host.locator("[data-role=stdout]").innerText(),
			expected,
		);
		assert.equal(await host.locator("[data-object-kind] pre").count(), 0);
		await page.evaluate(() => (window.Worker = window.savedWorker));
		await page.waitForTimeout(100);
		const departures = await host
			.locator(".reference-arrows g path")
			.evaluateAll((paths) =>
				paths.map((path) => {
					const start = path.getPointAtLength(0);
					const next = path.getPointAtLength(1);
					const sequence = document
						.getElementById(path.dataset.from)
						?.closest(".sequence");
					return sequence
						? Math.abs(start.x - next.x) < 0.01 && next.y > start.y
						: Math.abs(start.y - next.y) < 0.01 && next.x > start.x;
				}),
			);
		assert.ok(
			departures.length > 0 && departures.every(Boolean),
			"List references depart vertically; attributes depart horizontally",
		);
		await page.screenshot({
			path: `/tmp/trace-${filename}-${name}.png`,
			fullPage: true,
		});
		console.log(
			`${name}: ${filename}, ${data.trace.length} snapshots, ${JSON.stringify(expected)}, structured attributes and references, JSON replay passed`,
		);
	}
	assert.deepEqual(errors, []);
} finally {
	await browser.close();
}
