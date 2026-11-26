import assert from "node:assert/strict";
import { writeFile, rm, mkdir } from "node:fs/promises";
import { firefox, chromium } from "@playwright/test";
const browserName = process.env.BROWSER || "firefox";
const base = process.env.BASE_URL || "http://127.0.0.1:4409";
const modulePath =
	process.env.TRACE_MODULE || "/components/prolog-tracer/prolog-tracer.js";
const fixture =
	(modulePath.startsWith("/src/") ? "public" : "dist") +
	"/__prolog-presentation-check.html";
const directory = "/tmp/prolog-presentation-check";
await mkdir(directory, { recursive: true });
await writeFile(
	fixture,
	`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><tp-prolog-tracer filename="family.pl" trace="/docs/components/prolog-tracer/examples/family.trace.json"></tp-prolog-tracer><script type="module" src="${modulePath}"></script>`,
);
let browser, page, session, execute, nativeClick, screenshot, resize, close;
const endpoint = process.env.SAFARI_DRIVER_URL || "http://127.0.0.1:4445";
async function command(
	path,
	data,
	method = data === undefined ? "GET" : "POST",
) {
	const r = await fetch(endpoint + path, {
		method,
		headers: { "Content-Type": "application/json" },
		body: data === undefined ? undefined : JSON.stringify(data),
		signal: AbortSignal.timeout(30000),
	});
	const result = await r.json();
	if (!r.ok || result.value?.error) throw Error(JSON.stringify(result));
	return result.value;
}
const report = {
	browser: browserName,
	date: new Date().toISOString(),
	module: modulePath,
	checks: [],
};
try {
	if (browserName === "safari") {
		session = await command("/session", {
			capabilities: { alwaysMatch: { browserName: "safari" } },
		});
		const path = "/session/" + session.sessionId;
		report.version = session.capabilities.browserVersion;
		execute = (fn, arg) =>
			command(path + "/execute/sync", {
				script: `return (${fn.toString()})(arguments[0]);`,
				args: [arg ?? null],
			});
		resize = (width, height) =>
			command(path + "/window/rect", { width, height });
		nativeClick = async (selector) => {
			// SafariDriver pointer coordinates need compensation for the page zoom.
			const point = await execute((selector) => {
				const node = document.querySelector(selector);
				node.scrollIntoView({ block: "center" });
				const r = node.getBoundingClientRect(),
					zoom = outerWidth / innerWidth;
				return {
					x: Math.round((r.x + r.width / 2) * zoom),
					y: Math.round((r.y + r.height / 2) * zoom),
				};
			}, selector);
			await command(path + "/actions", {
				actions: [
					{
						type: "pointer",
						id: "mouse",
						parameters: { pointerType: "mouse" },
						actions: [
							{
								type: "pointerMove",
								origin: "viewport",
								...point,
								duration: 0,
							},
							{ type: "pointerDown", button: 0 },
							{ type: "pointerUp", button: 0 },
						],
					},
				],
			});
		};
		screenshot = async (file) =>
			writeFile(
				file,
				Buffer.from(await command(path + "/screenshot"), "base64"),
			);
		close = () => command(path, undefined, "DELETE");
		await resize(1450, 1100);
		await command(path + "/url", {
			url: base + "/__prolog-presentation-check.html?check=" + Date.now(),
		});
	} else {
		browser = await (browserName === "firefox" ? firefox : chromium).launch(
			browserName === "chrome" ? { channel: "chrome" } : {},
		);
		report.version = browser.version();
		page = await browser.newPage({ viewport: { width: 1450, height: 1100 } });
		execute = (fn, arg) => page.evaluate(fn, arg);
		nativeClick = (selector) => page.locator(selector).click();
		screenshot = (file) => page.screenshot({ path: file });
		resize = (width, height) => page.setViewportSize({ width, height });
		close = () => browser.close();
		await page.goto(
			base + "/__prolog-presentation-check.html?check=" + Date.now(),
		);
	}
	async function wait(fn) {
		const deadline = Date.now() + 45000;
		while (Date.now() < deadline) {
			if (await execute(fn)) return;
			await new Promise((r) => setTimeout(r, 150));
		}
		throw Error("Timed out: " + fn);
	}
	await wait(() => !!document.querySelector("tp-prolog-tracer")?.getCode?.());
	assert.equal(
		await execute(() =>
			document.querySelector("tp-prolog-tracer").classList.contains("tp-light"),
		),
		true,
		"default light theme",
	);
	assert.equal(
		await execute(() => document.querySelector(".resolution-json").open),
		false,
		"JSON starts closed",
	);
	for (const mode of ["light", "dark"]) {
		await execute(
			(mode) =>
				document
					.querySelector("tp-prolog-tracer tp-theme")
					.setAttribute("mode", mode),
			mode,
		);
		await wait(() => !document.fonts || document.fonts.status === "loaded");
		const result = await execute(() => {
			const host = document.querySelector("tp-prolog-tracer"),
				toolbar = host.querySelector(".tp-interpreter-toolbar");
			const rect = (e) => {
				const r = e.getBoundingClientRect();
				return { x: r.x, y: r.y, width: r.width, height: r.height };
			};
			const headings = [
				...host.querySelectorAll(".resolution-column > h2:first-child"),
			].map(rect);
			const divider = host.querySelector("[data-document-navbar-divider]");
			const reference = document.createElement("span");
			reference.style.color = "var(--tp-brand-stroke-soft)";
			host.append(reference);
			const brand = getComputedStyle(reference).color;
			reference.remove();
			return {
				light: host.classList.contains("tp-light"),
				dark: host.classList.contains("tp-dark"),
				headings,
				filename: host
					.querySelector("[data-toolbar-center]")
					?.textContent.trim(),
				title: toolbar
					.querySelector(".tp-interpreter-title")
					?.textContent.trim(),
				titleSize: parseFloat(
					getComputedStyle(toolbar.querySelector(".tp-interpreter-title"))
						.fontSize,
				),
				iconSize: rect(toolbar.querySelector(".tp-interpreter-title tp-icon"))
					.width,
				divider: getComputedStyle(divider).borderInlineStartColor,
				brand,
				json: host.querySelector("[data-role=json]").textContent,
				code: host.getCode(),
				background: getComputedStyle(
					host.querySelector(".tp-interpreter-panel"),
				).backgroundColor,
				foreground: getComputedStyle(
					host.querySelector(".tp-interpreter-panel"),
				).color,
			};
		});
		assert.equal(result[mode], true);
		assert.equal(result.filename, "family.pl");
		assert.equal(result.title, "Prolog tracer");
		assert.ok(result.titleSize >= 18);
		assert.ok(result.iconSize >= 24);
		assert.equal(result.headings.length, 2);
		assert.ok(
			Math.abs(result.headings[0].y - result.headings[1].y) < 1,
			JSON.stringify(result.headings),
		);
		assert.equal(result.divider, result.brand);
		assert.equal(result.json, result.code);
		assert.notEqual(result.background, result.foreground);
		await nativeClick(".resolution-json > summary");
		await wait(() => document.querySelector(".resolution-json").open);
		assert.equal(
			await execute(() => {
				const code = document.querySelector("[data-role=json]");
				return (
					code.getBoundingClientRect().height > 0 &&
					JSON.parse(code.textContent).language === "prolog"
				);
			}),
			true,
		);
		await screenshot(directory + "/" + browserName + "-" + mode + ".png");
		await nativeClick(".resolution-json > summary");
		await wait(() => !document.querySelector(".resolution-json").open);
		report.checks.push({
			mode,
			toolbar: true,
			columnsAligned: true,
			brandDivider: true,
			jsonNativeToggle: true,
			background: result.background,
			foreground: result.foreground,
		});
	}
	report.passed = true;
	await writeFile(
		directory + "/" + browserName + ".json",
		JSON.stringify(report, null, 2) + "\n",
	);
	console.log(JSON.stringify(report));
} finally {
	await close?.();
	await rm(fixture, { force: true });
}
