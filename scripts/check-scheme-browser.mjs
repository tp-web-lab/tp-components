import assert from "node:assert/strict";
import { chromium, firefox, webkit, expect } from "@playwright/test";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
try {
	const page = await browser.newPage();
	page.setDefaultTimeout(60000);
	page.on("pageerror", (error) => console.error(error));
	await page.route("**/__scheme-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.goto("http://127.0.0.1:4174/__scheme-test");
	await page.evaluate(async () => {
		await import("/src/components/scheme/scheme.ts");
		document.body.innerHTML =
			'<tp-scheme query="(square 7)"><script type="tp/scheme">(define (square x) (* x x))</script></tp-scheme>';
	});
	const host = page.locator("tp-scheme");
	await expect(host).toHaveAttribute("aria-busy", "false", { timeout: 90000 });
	console.log(await host.locator("[role=log]").textContent());
	await expect(host.locator("[role=log]")).toContainText(/Scheme · LIPS 1\./);
	const run = (code) =>
		host.evaluate(async (el, code) => {
			await el.run(code);
			return el.querySelector("[role=log]").textContent;
		}, code);
	assert.match(await run("(square 7)"), /49\n$/);
	assert.match(
		await run("(define count 1) (set! count (+ count 1)) count"),
		/2\n$/,
	);
	assert.match(await run("(map square (list 1 2 3))"), /\(1 4 9\)\n$/);
	assert.match(await run("(+ 1/2 1/4)"), /3\/4\n$/);
	assert.match(await run('(error "Expected error")'), /ERROR:.*Expected error/);
	assert.match(await run("(square 3)"), /9\n$/);
	await host.evaluate((el) => el.reset());
	assert.match(await run("(square 2)"), /4\n$/);
	console.log(
		"Scheme interpreter standard library, persistent state, errors and reset passed",
	);
} finally {
	await browser.close();
}
