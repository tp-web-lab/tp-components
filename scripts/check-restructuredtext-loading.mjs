import { chromium, firefox } from "@playwright/test";
import { writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const base = process.env.BASE_URL || "http://127.0.0.1:4379";
const browserName = process.env.HISTORY_BROWSERS || "firefox";
const results = [];
let version;
const driver = async (path, data, method = "POST") => {
	const r = await fetch("http://127.0.0.1:4445" + path, {
		method,
		headers: { "Content-Type": "application/json" },
		body: data === undefined ? undefined : JSON.stringify(data),
		signal: AbortSignal.timeout(25000),
	});
	const d = await r.json();
	if (!r.ok || (d.value?.error && "stacktrace" in d.value))
		throw Error(JSON.stringify(d));
	return d.value;
};
for (const scenario of [
	"cold-1",
	"cold-2",
	"cold-3",
	"stalled-first-script",
	"interrupted-wasm",
	"docutils",
	"pygments",
	"docutils-stalled",
	"pygments-stalled",
].filter(
	(s) => !process.env.SCENARIO || process.env.SCENARIO.split(",").includes(s),
)) {
	let close, read, go;
	if (browserName !== "safari") {
		const browser =
			browserName === "chrome"
				? await chromium.launch({ channel: "chrome" })
				: await firefox.launch();
		version = browser.version();
		const page = await browser.newPage();
		close = () => browser.close();
		read = () => page.evaluate(() => window.loadResult);
		go = (url) => page.goto(url, { waitUntil: "domcontentloaded" });
	} else {
		const s = await driver("/session", {
			capabilities: {
				alwaysMatch: { browserName: "safari", pageLoadStrategy: "eager" },
			},
		});
		version = s.capabilities.browserVersion;
		const path = "/session/" + s.sessionId;
		close = () => driver(path, undefined, "DELETE");
		read = () =>
			driver(path + "/execute/sync", {
				script: "return window.loadResult || null;",
				args: [],
			});
		go = (url) => driver(path + "/url", { url });
	}
	try {
		const started = Date.now();
		await go(
			/^(docutils|pygments)(-stalled)?$/.test(scenario)
				? base +
						"/__rst-package-test/?package=" +
						scenario.split("-")[0] +
						(scenario.endsWith("-stalled") ? "&stall=1" : "") +
						"&token=" +
						crypto.randomUUID()
				: scenario === "interrupted-wasm"
					? base + "/__rst-wasm-test/?token=" + crypto.randomUUID()
					: base +
						"/__rst-load/" +
						(scenario.startsWith("stalled")
							? "?stall=" + crypto.randomUUID()
							: ""),
		);
		let result;
		while (
			Date.now() - started <
			(scenario === "interrupted-wasm" || scenario.endsWith("-stalled")
				? 120000
				: 60000)
		) {
			result = await read();
			if (result) break;
			await new Promise((r) => setTimeout(r, 100));
		}
		if (!result) throw Error("Content not ready before the scenario deadline");
		if (scenario.startsWith("stalled") && result.milliseconds < 15000)
			throw Error("Controlled timeout not exercised");
		results.push({
			scenario,
			...result,
			totalMilliseconds: Date.now() - started,
		});
	} catch (e) {
		results.push({ scenario, passed: false, error: String(e) });
	} finally {
		await close();
	}
	console.log(browserName, JSON.stringify(results.at(-1)));
}
writeFileSync(
	`public/docs/appendices/restructuredtext-loading-${browserName}${process.env.REPORT_SUFFIX || ""}.json`,
	JSON.stringify(
		{
			checkedAt: new Date().toISOString(),
			browser: browserName,
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
