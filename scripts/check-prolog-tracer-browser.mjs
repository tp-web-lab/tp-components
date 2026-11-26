import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const b = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
const report = {
	browser: name,
	version: b.version(),
	date: new Date().toISOString(),
	cases: [],
};
try {
	const p = await b.newPage({ viewport: { width: 1450, height: 1000 } });
	const errors = [];
	p.on("pageerror", (e) => errors.push(e.message));
	await p.route("**/__prolog-tracer.html", (r) =>
		r.fulfill({
			contentType: "text/html",
			body: '<tp-prolog-tracer></tp-prolog-tracer><script type="module" src="/src/components/prolog-tracer/prolog-tracer.ts"></script>',
		}),
	);
	await p.goto(
		(process.env.BASE_URL || "http://127.0.0.1:4386") + "/__prolog-tracer.html",
	);
	await p.waitForFunction(() => customElements.get("tp-prolog-tracer"));
	const host = p.locator("tp-prolog-tracer");
	for (const [file, query, count] of [
		["family.pl", "ancestor(ann, Who).", 3],
		["recursion.pl", "factorial(4, F).", 1],
		["failure.pl", "share(Drink).", 0],
		["cut.pl", "choose(Color).", 1],
		["exception.pl", "divide(X).", 0],
	]) {
		await host.evaluate(
			async (e, { file, query }) => {
				e.src = "/docs/components/prolog-tracer/examples/" + file;
				e.query = query;
				await e.refresh();
				e.record();
			},
			{ file, query },
		);
		await p.waitForFunction(
			() =>
				document
					.querySelector("[data-role=status]")
					.textContent.match(/^0 \/|timed out|Error/),
			null,
			{ timeout: 60000 },
		);
		const raw = await host.evaluate((e) => e.getCode());
		assert.ok(raw, await host.locator("[data-role=status]").innerText());
		const data = JSON.parse(raw);
		assert.equal(
			data.events.filter((e) => e.port === "solution").length,
			count,
			file,
		);
		assert.ok(
			data.events.some((e) => e.port === "call"),
			file,
		);
		assert.equal(data.stdout.includes("ERROR:"), false, data.stdout);
		assert.equal(
			await host.locator(".resolution-line-number").count(),
			data.code.split("\n").length,
		);
		for (let i = 0; i < data.events.length; i++) {
			await host.evaluate((e, index) => e.goTo(index), i);
			const line = data.events[i].sourceLine ?? data.events[i].line ?? 0;
			assert.equal(
				await host.evaluate(
					(e) =>
						e
							.querySelector(".resolution-source-line.current")
							?.getAttribute("data-line") ?? null,
				),
				line > 0 ? String(line) : null,
			);
		}
		await host.evaluate((e) => e.goTo(-1));
		if (file === "family.pl") {
			assert.ok(
				data.events.some(
					(e) =>
						e.port === "call" &&
						e.goal.startsWith("parent(ann") &&
						e.sourceLine === 6,
				),
			);
			assert.ok(
				data.events.some(
					(e) =>
						e.port === "call" &&
						e.goal.startsWith("ancestor(bob") &&
						e.sourceLine === 10,
				),
			);
		}

		if (file === "family.pl") {
			assert.ok(data.events.some((e) => e.port.startsWith("redo")));
			assert.ok(data.events.some((e) => e.port === "fail"));
			await writeFile("/tmp/prolog-family.trace.json", raw);
		}
		if (file === "exception.pl")
			assert.ok(data.events.some((e) => e.port.startsWith("exception")));
		if (file === "recursion.pl")
			assert.ok(
				data.events.some((e) => e.port === "solution" && e.goal.includes("24")),
			);
		if (file === "cut.pl")
			assert.ok(
				data.events.some(
					(e) => e.port === "solution" && e.goal.includes("red"),
				),
			);
		assert.equal(await host.locator(".resolution-node").count(), 1);
		await host.locator("[data-role=next] button").click();
		assert.equal(await host.locator(".resolution-node").count(), 2);
		await host.locator("[data-role=last] button").click();
		assert.equal(await host.locator("[data-role=solutions] li").count(), count);
		const tree = await host.locator("[data-role=tree]").innerHTML();
		await p.evaluate(() => {
			window.oldWorker = Worker;
			window.Worker = class {
				constructor() {
					throw Error("Replay started Prolog");
				}
			};
		});
		await host.locator("[data-role=file]").setInputFiles({
			name: "replay.json",
			mimeType: "application/json",
			buffer: Buffer.from(raw),
		});
		await p.waitForFunction(() =>
			document
				.querySelector("[data-role=status]")
				.textContent.startsWith("0 /"),
		);
		await host.locator("[data-role=last] button").click();
		assert.equal(await host.locator("[data-role=tree]").innerHTML(), tree);
		await host.locator("[data-role=first] button").click();
		assert.equal(await host.locator(".resolution-node").count(), 1);
		await p.evaluate(() => (window.Worker = window.oldWorker));
		await host.locator("[data-role=last] button").click();
		await p.screenshot({ path: "/tmp/prolog-" + file + ".png" });
		report.cases.push({
			file,
			events: data.events.length,
			solutions: count,
			replay: true,
			sourceLines: true,
		});
		console.log(file, data.events.length, count);
	}
	await host.evaluate(async (e) => {
		e.removeAttribute("src");
		e.value = "loop :- loop.";
		e.query = "loop.";
		await e.refresh();
		e.record();
	});
	await p.waitForFunction(
		() =>
			document.querySelector("[data-role=status]").textContent !==
			"Recording with SWI-Prolog…",
		null,
		{ timeout: 45000 },
	);
	console.log("limit:", await host.locator("[data-role=status]").innerText());
	const limited = JSON.parse(await host.evaluate((e) => e.getCode()));
	assert.equal(limited.limited, true);
	assert.ok(limited.events.length >= 2000 && limited.events.length <= 2001);
	report.cases.push({
		file: "infinite recursion",
		events: limited.events.length,
		limited: true,
	});
	assert.deepEqual(errors, []);
	report.passed = true;
	await writeFile(
		"/tmp/prolog-tracer-" + name + ".json",
		JSON.stringify(report, null, 2),
	);
} finally {
	await b.close();
}
