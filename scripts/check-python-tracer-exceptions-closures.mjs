import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name = process.env.BROWSER || "chrome";
const browser = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
try {
	const page = await browser.newPage();
	await page.route("**/__trace-behavior.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: '<tp-python-tracer></tp-python-tracer><script type="module" src="/src/components/python-tracer/python-tracer.ts"></script>',
		}),
	);
	await page.goto("http://127.0.0.1:4386/__trace-behavior.html");
	await page.waitForFunction(() => customElements.get("tp-python-tracer"));
	const host = page.locator("tp-python-tracer");
	const cases = [
		["handled", "caught-exception.py", "caught\ndone\n"],
		["unhandled", "uncaught-exception.py", ""],
		["closure", "closure-nonlocal.py", "1\n2\n"],
	];
	for (const [label, filename, output] of cases) {
		await host.evaluate(async (e, filename) => {
			e.src = `/docs/components/python-tracer/examples/${filename}`;
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
		assert.deepEqual(
			await host.locator('[data-role="frames"] > h2').allTextContents(),
			["Variables", "Call stack"],
		);
		const exceptionIndex = data.trace.findIndex((step) => step.exception_msg);
		if (exceptionIndex >= 0) {
			await host.evaluate((e, i) => e.goTo(i), exceptionIndex);
			assert.equal(
				await host
					.locator('[data-role="event"]')
					.evaluate((e) => e.classList.contains("trace-error")),
				true,
			);
		}

		assert.equal(data.trace.at(-1).stdout, output);
		if (label !== "closure") assert.ok(data.trace.some((s) => s.exception_msg));
		else {
			const parents = data.trace
				.flatMap((s) => s.stack_to_render || [])
				.filter((f) => f.func_name === "make_counter" && f.is_parent);
			assert.ok(parents.some((f) => f.encoded_locals.count === 0));
			assert.ok(parents.some((f) => f.encoded_locals.count === 1));
			assert.ok(
				parents.some((f) => f.encoded_locals.count === 2 && f.is_zombie),
			);
			assert.ok(data.trace.some((s) => s.func_name === "next_value"));
			for (const count of [0, 1, 2]) {
				const index = data.trace.findIndex((step) =>
					step.stack_to_render?.some(
						(frame) =>
							frame.func_name === "make_counter" &&
							frame.is_parent &&
							frame.encoded_locals.count === count,
					),
				);
				await host.evaluate((e, index) => e.goTo(index), index);
				const parent = host
					.locator(".frame")
					.filter({ hasText: "make_counter" });
				assert.equal(
					await parent
						.locator("dt")
						.filter({ hasText: /^count$/ })
						.evaluate((dt) => dt.nextElementSibling.textContent),
					String(count),
				);
			}
		}
		await host.evaluate((e) => e.goTo(100000));
		if (label === "unhandled")
			assert.match(await host.innerText(), /ValueError: test error/);
		console.log(
			name,
			label,
			data.trace.length,
			"snapshots",
			JSON.stringify(output),
			"passed",
		);
	}
} finally {
	await browser.close();
}
