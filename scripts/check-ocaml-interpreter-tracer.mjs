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
	await page.route("**/__ocaml-drawer.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: `<tp-ocaml filename="square.ml" query="print_int (square 7);;"><script type="tp/ocaml">let square x = x * x;;</script></tp-ocaml><script type="module" src="/src/components/ocaml/ocaml.ts"></script>`,
		}),
	);
	await page.goto(
		(process.env.BASE_URL || "http://127.0.0.1:4386") + "/__ocaml-drawer.html",
	);
	await page.waitForFunction(
		() =>
			customElements.get("tp-ocaml") &&
			document.querySelector("tp-ocaml").getAttribute("aria-busy") === "false",
	);
	const host = page.locator("tp-ocaml");
	assert.equal(await host.locator("[data-command=trace]").count(), 0);
	assert.equal(
		await page.evaluate(() => !!customElements.get("tp-ocaml-tracer")),
		false,
	);
	await host.evaluate(async (e) => {
		e.tracer = true;
		await e.toggleSource();
		e.querySelector("tp-code-editor").setValue("let square x = x * x");
		e.querySelector(".tp-interpreter-prompt > tp-textfield").value =
			"print_int (square 8);;";
	});
	async function record(expected) {
		const before = await host
			.locator(":scope > .tp-interpreter-panel > .tp-interpreter-output")
			.innerText();

		await host.locator("[data-command=trace] button").click();
		await page.waitForFunction(
			() =>
				document
					.querySelector("tp-ocaml-tracer [data-role=status]")
					?.textContent.startsWith("Step "),
			null,
			{ timeout: 90000 },
		);
		const result = await host.evaluate((e) => ({
			width: e.querySelector("tp-drawer").getAttribute("width"),
			open: e.querySelector("tp-drawer").open,
			filename: e.querySelector("tp-ocaml-tracer").filename,
			trace: JSON.parse(e.querySelector("tp-ocaml-tracer").getCode()),
		}));
		assert.equal(result.width, "75%");
		assert.equal(result.open, true);
		assert.equal(result.filename, "square.ml");
		assert.equal(result.trace.trace.at(-1).stdout, expected);
		assert.equal(result.trace.trace.at(-1).exception_msg, undefined);
		assert.ok(result.trace.code.includes("let square x = x * x\n;;"));
		assert.equal(
			await host
				.locator(":scope > .tp-interpreter-panel > .tp-interpreter-output")
				.innerText(),
			before,
		);
		await host.evaluate((e) => e.querySelector("tp-drawer").hide());
	}
	await record("64");
	await host.evaluate((e) => {
		e.mode = "simple";
		e.querySelector(".tp-interpreter-prompt > tp-textfield").value =
			"print_int (square 9);;";
	});
	assert.equal(
		await host.locator(".tp-interpreter-prompt > [data-command=trace]").count(),
		1,
	);
	await record("81");
	await host.evaluate((e) => (e.tracer = false));
	assert.equal(await host.locator("tp-drawer").count(), 0);
	assert.equal(await host.locator("[data-command=trace]").count(), 0);
	assert.deepEqual(errors, []);
	console.log(
		browserName +
			": OCaml drawer, edited source/query, simple mode, independent session and removal passed",
	);
} finally {
	await browser.close();
}
