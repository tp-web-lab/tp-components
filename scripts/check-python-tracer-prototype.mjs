import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { chromium, firefox } from "@playwright/test";
const browserName = process.env.BROWSER || "chrome";
const browser =
	browserName === "firefox"
		? await firefox.launch()
		: await chromium.launch({ channel: "chrome" });
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
const reports = [];
const requests = new Set();
try {
	const context = await browser.newContext();
	context.on("request", (r) => requests.add(r.url()));
	const page = await context.newPage();
	const pageErrors = [];
	page.on("pageerror", (e) => pageErrors.push(e.message));
	await page.goto(base + "/prototypes/python-tracer/index.html");
	await page.waitForFunction(() => window.pythonTracePrototype);
	async function record(code) {
		if (code !== undefined)
			await page.evaluate(
				(code) => document.getElementById("source").setValue(code),
				code,
			);
		const start = Date.now();
		await page.locator("#run").click();
		await page.waitForFunction(
			() => !document.getElementById("run").hasAttribute("disabled"),
			null,
			{ timeout: 75000 },
		);
		const result = await page.evaluate(() => ({
			trace: window.pythonTracePrototype.snapshots,
			status: document.getElementById("status").textContent,
		}));
		return { ...result, milliseconds: Date.now() - start };
	}
	for (const name of ["recursion", "variables", "lists", "sharing"]) {
		await page.locator(`[data-example="${name}"]`).click();
		const { trace, status, milliseconds } = await record();
		assert.ok(trace.length > 0, status);
		assert.ok(
			!trace.some((t) => t.event === "uncaught_exception"),
			JSON.stringify(trace.at(-1)),
		);
		const last = trace.at(-1);
		if (name === "recursion") {
			assert.equal(last.stdout, "120\n");
			const deepest = trace.reduce((a, b) =>
				(a.stack_to_render?.length ?? 0) > (b.stack_to_render?.length ?? 0)
					? a
					: b,
			);
			assert.equal(deepest.stack_to_render.length, 5);
			assert.deepEqual(
				deepest.stack_to_render.map((f) => f.encoded_locals.n),
				[5, 4, 3, 2, 1],
			);
			for (let i = 0; i < trace.indexOf(deepest); i++)
				await page.locator("#next").click();
			assert.equal(await page.locator("#frames article").count(), 6);
			await page.screenshot({
				path: "/tmp/python-tracer-recursion-" + browserName + ".png",
				fullPage: true,
			});
		}
		if (name === "variables") {
			assert.equal(last.globals.x, 9);
			assert.equal(last.globals.y, 5);
			assert.ok(trace.some((t) => t.globals?.x === 2));
			assert.equal(last.stdout, "9 5\n");
		}
		if (name === "lists") {
			const id = last.globals.items[1];
			assert.deepEqual(last.heap[id], ["LIST", 10, 2, 3]);
			assert.ok(
				trace.some((t) => JSON.stringify(t.heap?.[id]) === '["LIST",1,2]'),
			);
		}
		if (name === "sharing") {
			const { a, b, c, pair } = last.globals;
			assert.deepEqual(a, b);
			assert.notEqual(a[1], c[1]);
			assert.deepEqual(last.heap[a[1]], ["LIST", 1, 2, 3]);
			assert.deepEqual(last.heap[c[1]], ["LIST", 1, 2]);
			assert.deepEqual(last.heap[pair[1]], ["LIST", a, b]);
			assert.equal(last.stdout, "[1, 2, 3] [1, 2, 3] [1, 2]\nTrue False\n");
		}
		await page.locator("#last").click();
		assert.equal(await page.locator("#stdout").textContent(), last.stdout);
		if (name === "sharing") {
			const id = last.globals.a[1];
			assert.ok(
				(await page.locator(`#frames [data-reference="${id}"]`).count()) >= 2,
			);
			assert.equal(
				await page.locator(`#heap [data-object="${id}"]`).count(),
				1,
			);
			await page.locator(`#frames [data-reference="${id}"]`).first().click();
			assert.ok(page.url().endsWith("#object-" + id));
			await page.screenshot({
				path: "/tmp/python-tracer-sharing-" + browserName + ".png",
				fullPage: true,
			});
		}
		await page.locator("#previous").click();
		assert.equal(
			await page.evaluate(() => window.pythonTracePrototype.position),
			trace.length - 2,
		);
		await page.locator("#first").click();
		assert.equal(
			await page.evaluate(() => window.pythonTracePrototype.position),
			0,
		);
		reports.push({
			case: name,
			steps: trace.length,
			milliseconds,
			passed: true,
		});
	}
	const syntax = await record("def broken(:\n    pass");
	assert.ok(
		syntax.trace.some(
			(t) =>
				t.event === "uncaught_exception" &&
				t.exception_msg.includes("SyntaxError"),
		),
	);
	reports.push({ case: "syntax-error", passed: true });
	const loop = await record("while True:\n    pass");
	assert.ok(loop.trace.some((t) => t.event === "instruction_limit_reached"));
	assert.ok(loop.trace.length <= 1001);
	reports.push({ case: "event-limit", steps: loop.trace.length, passed: true });
	// Native Python computation emits no line events until it returns: prove the main
	// thread remains responsive and the Worker can be stopped or killed by deadline.
	await page.evaluate(() =>
		document.getElementById("source").setValue("sum(range(10**10))"),
	);
	await page.locator("#run").click();
	await page.waitForFunction(
		() =>
			document
				.getElementById("status")
				.textContent.startsWith("Recording with"),
		null,
		{ timeout: 60000 },
	);
	await page.locator("#stop").click();
	assert.equal(await page.locator("#status").innerText(), "Recording stopped.");
	reports.push({ case: "stop-native-computation", passed: true });
	const timeout = await record("sum(range(10**10))");
	assert.ok(timeout.status.startsWith("Execution timed out"), timeout.status);
	reports.push({
		case: "execution-timeout",
		milliseconds: timeout.milliseconds,
		passed: true,
	});
	const recovery = await record("print(42)");
	assert.equal(recovery.trace.at(-1).stdout, "42\n");
	reports.push({
		case: "recovery-after-timeout",
		milliseconds: recovery.milliseconds,
		passed: true,
	});
	assert.deepEqual(pageErrors, []);
	const forbidden = [...requests].filter(
		(url) =>
			/^https?:/.test(url) &&
			!["127.0.0.1", "cdn.jsdelivr.net"].includes(new URL(url).hostname),
	);
	assert.deepEqual(forbidden, [], "Unexpected external service");
	const report = {
		browser: browserName,
		version: browser.version(),
		checkedAt: new Date().toISOString(),
		cases: reports,
		requestHosts: [
			...new Set(
				[...requests]
					.filter((u) => /^https?:/.test(u))
					.map((u) => new URL(u).hostname),
			),
		],
		pythonTutorRequests: [...requests].filter((u) =>
			/pythontutor\.com/.test(u),
		),
	};
	writeFileSync(
		`public/prototypes/python-tracer/verification-${browserName}.json`,
		JSON.stringify(report, null, 2) + "\n",
	);
	console.log(JSON.stringify(report, null, 2));
} finally {
	await browser.close();
}
