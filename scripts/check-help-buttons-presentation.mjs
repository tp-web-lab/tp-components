import assert from "node:assert/strict";
import { writeFile, rm, mkdir } from "node:fs/promises";
import { firefox, chromium } from "@playwright/test";
const browserName = process.env.BROWSER || "firefox";
const base = process.env.BASE_URL || "http://127.0.0.1:4409";
const modulePath =
	process.env.TRACE_MODULE ||
	"/components/component-viewer/component-viewer.js";
const fixture =
	(modulePath.startsWith("/src/") ? "public" : "dist") +
	"/__help-buttons-check.html";
const directory = "/tmp/help-buttons-check";
await mkdir(directory, { recursive: true });
await writeFile(
	fixture,
	`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><tp-component-viewer tag="tp-prolog-tracer"></tp-component-viewer><script type="module" src="${modulePath}"></script>`,
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
			url: base + "/__help-buttons-check.html?check=" + Date.now(),
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
		await page.goto(base + "/__help-buttons-check.html?check=" + Date.now());
	}
	async function wait(fn) {
		const deadline = Date.now() + 45000;
		while (Date.now() < deadline) {
			if (await execute(fn)) return;
			await new Promise((r) => setTimeout(r, 150));
		}
		console.log(
			await execute(() =>
				[...document.querySelectorAll("[data-component-buttons] tp-icon")].map(
					(i) => ({ name: i.getAttribute("name"), html: i.innerHTML }),
				),
			),
		);
		throw Error("Timed out: " + fn);
	}

	for (const tag of [
		"tp-prolog-tracer",
		"tp-diff-code-editor",
		"tp-code-editor",
	]) {
		await execute((tag) => {
			const old = document.querySelector("tp-component-viewer");
			const host = document.createElement("tp-component-viewer");
			host.setAttribute("tag", tag);
			old.replaceWith(host);
		}, tag);
		await wait(
			() =>
				document.querySelectorAll("[data-component-buttons] tbody tr").length >
				0,
		);
		for (const mode of ["light", "dark"]) {
			await execute((mode) => {
				document.documentElement.classList.remove("tp-light", "tp-dark");
				document.documentElement.classList.add("tp-" + mode);
				document
					.querySelector("tp-component-viewer")
					.classList.remove("tp-light", "tp-dark");
				document
					.querySelector("tp-component-viewer")
					.classList.add("tp-" + mode);
			}, mode);
			const count = await execute(
				() =>
					document.querySelectorAll("[data-component-buttons] tbody tr").length,
			);
			for (let row = 0; row < count; row++) {
				await execute(
					(row) =>
						document
							.querySelectorAll("[data-component-buttons] tbody tr")
							[row].scrollIntoView({ block: "center" }),
					row,
				);
				await new Promise((r) => setTimeout(r, 150));
			}
			await wait(() =>
				[
					...document.querySelectorAll("[data-component-buttons] tp-icon"),
				].every((i) => i.querySelector("svg")),
			);
			const result = await execute(() => {
				const panel = document.querySelector("[data-component-buttons]");
				return {
					rows: [...panel.querySelectorAll("tbody tr")].map((r) => ({
						label: r.cells[0].textContent.trim(),
						description: r.cells[1].textContent.trim(),
						icons: [...r.querySelectorAll("tp-icon")].map((i) => ({
							name: i.getAttribute("name"),
							svg: !!i.querySelector("svg"),
							width: i.getBoundingClientRect().width,
							height: i.getBoundingClientRect().height,
							color: getComputedStyle(i).color,
						})),
					})),
					visible: panel.getBoundingClientRect().height > 0,
					color: getComputedStyle(panel).color,
				};
			});
			assert.equal(result.visible, true);
			assert.ok(result.rows.every((r) => r.description.length > 5));
			assert.ok(
				result.rows
					.flatMap((r) => r.icons)
					.every((i) => i.svg && i.width > 0 && i.height > 0),
			);
			if (tag === "tp-prolog-tracer") assert.equal(result.rows.length, 13);
			await screenshot(`${directory}/${browserName}-${tag}-${mode}.png`);
			report.checks.push({ tag, mode, ...result });
		}
	}
	report.passed = true;
	await writeFile(
		`${directory}/${browserName}.json`,
		JSON.stringify(report, null, 2) + "\n",
	);
	console.log(
		JSON.stringify({
			browser: browserName,
			version: report.version,
			passed: true,
			checks: report.checks.map((c) => ({
				tag: c.tag,
				mode: c.mode,
				buttons: c.rows.length,
				color: c.color,
			})),
		}),
	);
} finally {
	await close?.();
	await rm(fixture, { force: true });
}
