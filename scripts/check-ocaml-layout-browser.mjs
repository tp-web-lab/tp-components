import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch();
try {
	const page = await browser.newPage({
		viewport: { width: 1200, height: 900 },
	});
	await page.routeWebSocket("**", () => {});
	await page.route("**/__ocaml-layout", (r) =>
		r.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.goto("http://127.0.0.1:4175/__ocaml-layout");
	await page.evaluate(async () => {
		await import("/src/components/ocaml-viewer/ocaml-viewer.js");
		const el = document.createElement("tp-ocaml-viewer");
		el.innerHTML = '<script type="tp/ocaml">let square x = x * x;;</script>';
		document.body.append(el);
	});
	const viewer = page.locator("tp-ocaml-viewer");
	await viewer.locator("[data-tp-programming-viewer-code] button").click();
	const editor = viewer.locator("tp-code-editor").first();
	await expect(editor.locator(".cm-content")).toContainText("square");
	const heights = await editor.evaluate(async (el) => {
		const wait = () => new Promise((r) => setTimeout(r, 400));
		const initial = el.getValue();
		const before = el.getBoundingClientRect().height;
		el.setValue(
			Array.from({ length: 60 }, (_, i) => `(* Line ${i} *)`).join("\n"),
		);
		await wait();
		const large = el.getBoundingClientRect().height;
		el.setValue(initial);
		await wait();
		return { before, large, small: el.getBoundingClientRect().height };
	});
	assert.ok(
		heights.large > heights.before + 200 && heights.small < heights.large - 200,
		JSON.stringify(heights),
	);
	const wide = await editor.evaluate((el) => el.getBoundingClientRect().width);
	await page.setViewportSize({ width: 620, height: 900 });
	await page.waitForTimeout(400);
	const narrow = await editor.evaluate(
		(el) => el.getBoundingClientRect().width,
	);
	assert.ok(narrow !== wide && narrow > 0 && narrow <= 620, JSON.stringify({ wide, narrow }));
	await viewer.evaluate((el) => el.run());
	await expect(
		viewer.frameLocator("iframe").first().locator("[data-ocaml-output]"),
	).toContainText("val square");
	const output = viewer.locator('[data-tp-programming-viewer-panel="output"]');
	const panels = await output.evaluate(async (el) => {
		const f = el.querySelector("iframe");
		const wait = () => new Promise((r) => setTimeout(r, 400));
		const before = el.getBoundingClientRect().height;
		const extra = f.contentDocument.createElement("div");
		extra.style.height = "700px";
		f.contentDocument.body.append(extra);
		await wait();
		const large = el.getBoundingClientRect().height;
		extra.remove();
		await wait();
		return { before, large, small: el.getBoundingClientRect().height };
	});
	assert.ok(
		panels.large > panels.before + 300 && panels.small < panels.large - 300,
		JSON.stringify(panels),
	);
	console.log(
		"OCaml editor, iframe and containing panel grow, shrink and adapt to viewport width.",
	);
} finally {
	await browser.close();
}
