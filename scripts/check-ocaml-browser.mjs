import assert from "node:assert/strict";
import { chromium, firefox, webkit, expect } from "@playwright/test";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
try {
	const page = await browser.newPage();
	page.setDefaultTimeout(60000);
	page.on("pageerror", (error) => console.error(error));
	await page.route("**/__ocaml-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.goto("http://127.0.0.1:4175/__ocaml-test");
	await page.evaluate(async () => {
		await import("/src/components/ocaml/ocaml.ts");
		document.body.innerHTML =
			'<tp-ocaml query="square 7;;"><script type="tp/ocaml">let square x = x * x;;</script></tp-ocaml>';
	});
	const host = page.locator("tp-ocaml");
	await expect(host).toHaveAttribute("aria-busy", "false", { timeout: 90000 });
	console.log(await host.locator("[role=log]").textContent());
	await expect(host.locator("[role=log]")).toContainText(
		/OCaml 5\.5\.2 · Js_of_ocaml 6\.5\.0/,
	);
	const run = (code) =>
		host.evaluate(async (el, code) => {
			await el.run(code);
			return el.querySelector("[role=log]").textContent;
		}, code);
	assert.match(await run("square 7;;"), /49\n$/);
	assert.match(await run("let count = ref 1;; incr count; !count;;"), /2\n$/);
	assert.match(await run("List.map square [1;2;3];;"), /\[1; 4; 9\]\n$/);
	assert.match(await run('1 + "wrong";;'), /ERROR:/);
	assert.match(
		await run('failwith "Expected error";;'),
		/ERROR:.*Expected error/,
	);
	assert.match(await run("square 3;;"), /9\n$/);
	await host.evaluate((el) => el.reset());
	assert.match(await run("square 2;;"), /4\n$/);
	console.log(
		"OCaml interpreter standard library, persistent state, errors and reset passed",
	);
} finally {
	await browser.close();
}
