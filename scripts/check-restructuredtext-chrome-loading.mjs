import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const base = process.env.BASE_URL || "http://127.0.0.1:4380";
const results = [];
let version;
for (const scenario of [
	"normal",
	"slow-network",
	"interrupted-script",
	"offline-recovery",
	"interrupted-wasm",
	"stalled-first-script",
]) {
	const browser = await chromium.launch({ channel: "chrome" });
	version = browser.version();
	const page = await browser.newPage();
	const requests = [];
	try {
		// Import the facade before simulating an outage; Pyodide is still uninitialized.
		await page.route("**/__rst-chrome/", (route) =>
			route.fulfill({
				contentType: "text/html",
				body: '<!doctype html><div id="result"></div>',
			}),
		);
		await page.goto(base + "/__rst-chrome/");
		await page.evaluate(async () => {
			window.makeParser = (
				await import("/src/components/restructuredtext/restructuredtext.ts")
			).createTpRestructuredTextParser;
		});
		const cdp = await page.context().newCDPSession(page);
		await cdp.send("Network.enable");
		await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
		const normal = {
			offline: false,
			latency: 0,
			downloadThroughput: -1,
			uploadThroughput: -1,
		};
		const slow = {
			offline: false,
			latency: 150,
			downloadThroughput: 1024 * 1024,
			uploadThroughput: 512 * 1024,
		};
		if (scenario === "slow-network")
			await cdp.send("Network.emulateNetworkConditions", slow);
		if (scenario === "offline-recovery")
			await cdp.send("Network.emulateNetworkConditions", {
				...normal,
				offline: true,
			});
		const wasmPattern = /pyodide\.asm\.wasm(?:\?|$)/;
		if (scenario === "interrupted-wasm")
			await page.route(wasmPattern, (route) => route.abort("connectionreset"));
		let interrupted = false;
		if (scenario === "interrupted-script")
			await page.route("**/pyodide.js*", async (route) => {
				if (!interrupted) {
					interrupted = true;
					await route.abort("connectionreset");
				} else await route.continue();
			});
		page.on("request", (r) => {
			if (/pyodide\.js|pyodide\.asm\.wasm/.test(r.url()))
				requests.push({ url: r.url(), at: Date.now() });
		});
		const options =
			scenario === "stalled-first-script"
				? {
						pyodideUrl:
							base + "/__rst-load/pyodide.js?token=" + crypto.randomUUID(),
					}
				: {};
		await page.evaluate((options) => {
			window.rstParser = window.makeParser(options);
		}, options);
		const run = async () => {
			await page.evaluate(() => {
				window.loadResult = null;
				const start = performance.now();
				window.rstParser
					.render("Ready\n=====\n\nA real Docutils conversion.")
					.then(
						(html) => {
							document.querySelector("#result").innerHTML = html;
							window.loadResult = {
								passed: !!document.querySelector("#result h1"),
								milliseconds: performance.now() - start,
							};
						},
						(error) => {
							window.loadResult = {
								passed: false,
								error: String(error),
								milliseconds: performance.now() - start,
							};
						},
					);
			});
			await page.waitForFunction(
				() => window.loadResult !== null,
				{},
				{ timeout: 90000 },
			);
			return page.evaluate(() => window.loadResult);
		};
		let initialFailure;
		if (["offline-recovery", "interrupted-wasm"].includes(scenario)) {
			initialFailure = await run();
			if (initialFailure.passed)
				throw Error("Interrupted conversion unexpectedly passed");
			if (scenario === "interrupted-wasm") await page.unroute(wasmPattern);
			await cdp.send("Network.emulateNetworkConditions", normal);
		}
		const result = await run();
		if (!result.passed) throw Error(result.error || "No heading rendered");
		if (
			["interrupted-script", "stalled-first-script"].includes(scenario) &&
			(!requests.some((r) => r.url.includes("tp-retry=")) ||
				requests.length < 2)
		)
			throw Error("Retry not exercised");
		if (scenario === "stalled-first-script" && result.milliseconds < 15000)
			throw Error("Timeout not exercised");
		results.push({
			scenario,
			...result,
			initialFailure,
			network: scenario === "slow-network" ? slow : normal,
			cacheDisabled: true,
			requests,
		});
	} catch (error) {
		results.push({ scenario, passed: false, error: String(error), requests });
	} finally {
		await browser.close();
	}
	console.log(JSON.stringify(results.at(-1)));
}
writeFileSync(
	"public/docs/appendices/restructuredtext-loading-chrome.json",
	JSON.stringify(
		{
			checkedAt: new Date().toISOString(),
			browser: "chrome",
			version,
			parserSha256: createHash("sha256")
				.update(readFileSync("../tp-restructuredtext/src/parser.ts"))
				.digest("hex"),
			results,
		},
		null,
		2,
	) + "\n",
);
if (results.some((r) => !r.passed)) process.exitCode = 1;
