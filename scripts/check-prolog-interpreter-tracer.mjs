import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const browserName = process.env.BROWSER || "chrome";
const browser = await (browserName === "firefox" ? firefox : chromium).launch(
	browserName === "chrome" ? { channel: "chrome" } : {},
);
try {
	const page = await browser.newPage({
		viewport: { width: 1400, height: 1000 },
	});
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.route("**/__prolog-drawer.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: `<tp-prolog filename="colors.pl" query="color(X)."><script type="tp/prolog">color(red).</script></tp-prolog><script type="module" src="/src/components/prolog/prolog.ts"></script>`,
		}),
	);
	await page.goto(
		(process.env.BASE_URL || "http://127.0.0.1:4386") + "/__prolog-drawer.html",
	);
	await page.waitForFunction(
		() =>
			customElements.get("tp-prolog") &&
			!!document.querySelector("tp-prolog .tp-interpreter-prompt"),
	);
	const host = page.locator("tp-prolog");
	assert.equal(await host.locator("[data-command=trace]").count(), 0);
	assert.equal(
		await page.evaluate(() => !!customElements.get("tp-prolog-tracer")),
		false,
	);
	await host.evaluate(async (e) => {
		e.tracer = true;
		await e.toggleSource();
		e.querySelector("tp-code-editor").setValue("color(blue).\ncolor(green).");
		e.querySelector(".tp-interpreter-prompt > tp-textfield").value =
			"color(X).";
	});
	async function record(expected) {
		const before = await host
			.locator(":scope > .tp-interpreter-panel > .tp-interpreter-output")
			.innerText();

		await page.evaluate(
			() =>
				(window.previousTracer = document.querySelector("tp-prolog-tracer")),
		);
		await host.locator("[data-command=trace] button").click();
		await page.waitForFunction(
			() =>
				document.querySelector("tp-prolog-tracer") !== window.previousTracer &&
				document
					.querySelector("tp-prolog-tracer [data-role=status]")
					?.textContent.startsWith("0 / "),
			null,
			{ timeout: 90000 },
		);
		const result = await host.evaluate((e) => ({
			width: e.querySelector("tp-drawer").getAttribute("width"),
			open: e.querySelector("tp-drawer").open,
			filename: e.querySelector("tp-prolog-tracer").filename,
			trace: JSON.parse(e.querySelector("tp-prolog-tracer").getCode()),
		}));
		assert.equal(result.width, "75%");
		assert.equal(result.open, true);
		assert.equal(result.filename, "colors.pl");
		assert.equal(
			result.trace.events.filter((event) => event.port === "solution").length,
			expected,
		);
		assert.equal(result.trace.events.at(-1).exception_msg, undefined);
		assert.equal(result.trace.code, "color(blue).\ncolor(green).");
		assert.equal(
			await host
				.locator(":scope > .tp-interpreter-panel > .tp-interpreter-output")
				.innerText(),
			before,
		);
		await host.evaluate((e) => e.querySelector("tp-drawer").hide());
	}
	await record(2);
	await host.evaluate((e) => {
		e.mode = "simple";
		e.querySelector(".tp-interpreter-prompt > tp-textfield").value =
			"color(green).";
	});
	assert.equal(
		await host.locator(".tp-interpreter-prompt > [data-command=trace]").count(),
		1,
	);
	await record(1);
	await host.evaluate((e) => (e.tracer = false));
	assert.equal(await host.locator("tp-drawer").count(), 0);
	assert.equal(await host.locator("[data-command=trace]").count(), 0);
	assert.deepEqual(errors, []);
	console.log(
		browserName +
			": Prolog drawer, edited source/query, simple mode, independent session and removal passed",
	);
} finally {
	await browser.close();
}
