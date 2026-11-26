import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import ts from "typescript";
const base = process.env.BASE_URL || "http://127.0.0.1:4198";
const endpoint = process.env.SAFARI_DRIVER_URL || "http://127.0.0.1:4446";
const out = process.env.REPORT_DIR || "/tmp/playground-frameworks-safari";
const languages = (
	process.env.LANGUAGES || "javascript,typescript,python,prolog,scheme,ocaml"
).split(",");
await mkdir(out, { recursive: true });
const setups = {};
for (const name of ["test-frameworks", "mocha-unittest-results"]) {
	const source = await readFile(`tests/playgrounds/${name}.test.ts`, "utf8");
	const start = source.indexOf("async ({ language, scenario }) => {");
	const end = source.indexOf("\n\t\t\t\t{ language, scenario },", start);
	assert(start >= 0 && end > start);
	const callback = source.slice(start, end).trim().replace(/,$/, "");
	setups[name] = ts.transpileModule("window.setupFramework=" + callback + ";", {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.None,
		},
	}).outputText;
}
const fixture = "public/__frameworks-safari-check.html";
await writeFile(
	fixture,
	'<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><body></body></html>',
);
async function command(
	path,
	data,
	method = data === undefined ? "GET" : "POST",
) {
	const response = await fetch(endpoint + path, {
		method,
		headers: { "Content-Type": "application/json" },
		body: data === undefined ? undefined : JSON.stringify(data),
		signal: AbortSignal.timeout(30000),
	});
	const result = await response.json();
	if (!response.ok || result.value?.error) throw Error(JSON.stringify(result));
	return result.value;
}
const report = {
	date: new Date().toISOString(),
	browser: "native Safari",
	checks: [],
	limitations: [
		"CDN interruption scenarios require request interception and remain covered by Playwright, not this native Safari campaign.",
		"Test uses the public test() method; the passing case also replays the toolbar Test click handler.",
	],
};
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
let session;
try {
	session = await command("/session", {
		capabilities: { alwaysMatch: { browserName: "safari" } },
	});
	report.version = session.capabilities.browserVersion;

	const path = "/session/" + session.sessionId;
	const execute = (fn, arg) =>
		command(path + "/execute/sync", {
			script: `return (${fn.toString()})(arguments[0]);`,
			args: [arg ?? null],
		});
	async function until(fn) {
		const start = Date.now();
		while (Date.now() - start < 120000) {
			const v = await execute(fn);
			if (v) return v;
			await delay(200);
		}
		throw Error("Timeout: " + fn);
	}
	for (const language of languages)
		for (const theme of ["light", "dark"]) {
			const native = ["prolog", "scheme", "ocaml"].includes(language);
			const scenarios = native
				? ["passing", "failing", "empty", "syntax-error"]
				: [
						"passing",
						"failing",
						"runtime-error",
						"import-error",
						"empty",
						"fixture-error",
						language === "python" ? "unexpected-success" : "timeout",
					];
			for (const scenario of scenarios) {
				if (
					process.env.SCENARIOS &&
					!process.env.SCENARIOS.split(",").includes(scenario)
				)
					continue;
				const started = Date.now();
				console.log("Starting", language, theme, scenario);
				await command(path + "/window/rect", { width: 1400, height: 1000 });
				await command(path + "/url", {
					url: base + "/__frameworks-safari-check.html",
				});
				await execute(
					({ code, theme, language, scenario }) => {
						document.documentElement.className = "tp-" + theme;
						const script = document.createElement("script");
						script.textContent = code;
						document.head.append(script);
						window
							.setupFramework({ language, scenario })
							.catch((e) => (window.setupFailure = String(e)));
					},
					{
						code: setups[native ? "test-frameworks" : "mocha-unittest-results"],
						theme,
						language,
						scenario,
					},
				);
				const result = await until(() => {
					if (window.setupFailure) throw Error(window.setupFailure);
					const f = document.querySelector("tp-iframe iframe");
					const d = f?.contentDocument;
					const r = d?.querySelector(
						"[data-tp-test-results][data-test-complete]",
					);
					if (!r) return null;
					const w = f.contentWindow;
					return {
						status: r.dataset.testResult,
						headers: [...r.querySelectorAll("th")].map((n) => n.textContent),
						passed: r.querySelectorAll('[data-test-status="passed"]').length,
						failed: r.querySelectorAll('[data-test-status="failed"]').length,
						skipped: r.querySelectorAll('[data-test-status="skipped"]').length,
						expectedFailures: r.querySelectorAll(
							'[data-test-status="expected-failure"]',
						).length,
						text: r.textContent,
						theme: d.documentElement.className,
						background: w.getComputedStyle(d.body).backgroundColor,
						headerBorder: w.getComputedStyle(r.querySelector("th"))
							.borderBottomWidth,
					};
				});
				assert.equal(
					result.status,
					scenario === "passing" ? "passed" : "failed",
				);
				assert(result.theme.includes("tp-" + theme));
				assert.deepEqual(result.headers, [
					"Suite",
					"Test",
					"Status",
					"Details",
				]);
				assert(parseFloat(result.headerBorder) > 0);
				assert.notEqual(result.background, "rgba(0, 0, 0, 0)");
				result.frameBackground = await execute(
					() =>
						getComputedStyle(document.querySelector("tp-iframe iframe"))
							.backgroundColor,
				);
				assert.equal(result.frameBackground, result.background);
				result.previewBackground = await execute(
					() =>
						getComputedStyle(document.querySelector("tp-iframe"))
							.backgroundColor,
				);

				if (scenario === "passing") {
					assert(result.passed > 0);
					assert.equal(result.skipped, 1);
					if (language === "scheme" || language === "python")
						assert(result.expectedFailures > 0);
					result.log = await execute(() => {
						const d =
							document.querySelector("tp-iframe iframe").contentDocument;
						const details = d.querySelector("[data-tp-test-results] details");
						const closed = !details.open;
						details.querySelector("summary").click();
						return { initiallyClosed: closed, opened: details.open };
					});
					assert(result.log.initiallyClosed && result.log.opened);
					await until(() => {
						const f = document.querySelector("tp-iframe iframe");
						return (
							Math.abs(
								f.getBoundingClientRect().height -
									Math.max(
										f.contentDocument.documentElement.scrollHeight,
										f.contentDocument.body.scrollHeight,
									),
							) < 5
						);
					});
					const height = await execute(
						() =>
							document.querySelector("tp-iframe iframe").getBoundingClientRect()
								.height,
					);
					await execute(() => {
						const d =
							document.querySelector("tp-iframe iframe").contentDocument;
						const probe = d.createElement("div");
						probe.id = "height-probe";
						probe.style.height = "500px";
						d.body.append(probe);
					});
					await until(() => {
						const f = document.querySelector("tp-iframe iframe");
						return (
							Math.abs(
								f.getBoundingClientRect().height -
									Math.max(
										f.contentDocument.documentElement.scrollHeight,
										f.contentDocument.body.scrollHeight,
									),
							) < 5
						);
					});
					const grown = await execute(
						() =>
							document.querySelector("tp-iframe iframe").getBoundingClientRect()
								.height,
					);
					assert(grown > height + 400);
					await execute(() =>
						document
							.querySelector("tp-iframe iframe")
							.contentDocument.querySelector("#height-probe")
							.remove(),
					);
					await until(() => {
						const f = document.querySelector("tp-iframe iframe");
						return (
							Math.abs(
								f.getBoundingClientRect().height -
									Math.max(
										f.contentDocument.documentElement.scrollHeight,
										f.contentDocument.body.scrollHeight,
									),
							) < 5
						);
					});
					const shrunk = await execute(
						() =>
							document.querySelector("tp-iframe iframe").getBoundingClientRect()
								.height,
					);
					assert(Math.abs(height - shrunk) < 5);
					result.height = { initial: height, grown, shrunk };
					await execute(() => {
						document.documentElement.classList.toggle("tp-light");
						document.documentElement.classList.toggle("tp-dark");
					});
					await delay(300);
					const alternate = await execute(() => {
						const f = document.querySelector("tp-iframe iframe");
						return f.contentWindow.getComputedStyle(f.contentDocument.body)
							.backgroundColor;
					});
					assert.notEqual(alternate, result.background);
					await execute(() => {
						document.documentElement.classList.toggle("tp-light");
						document.documentElement.classList.toggle("tp-dark");
					});
					await delay(300);
					assert.equal(
						await execute(() => {
							const f = document.querySelector("tp-iframe iframe");
							return f.contentWindow.getComputedStyle(f.contentDocument.body)
								.backgroundColor;
						}),
						result.background,
					);
					result.liveThemeRoundTrip = true;
					await writeFile(
						`${out}/${language}-${theme}.png`,
						Buffer.from(await command(path + "/screenshot"), "base64"),
					);
					await command(path + "/window/rect", { width: 750, height: 900 });
					await delay(400);
					result.narrow = await execute(() => {
						const f = document.querySelector("tp-iframe iframe");
						const d = f.contentDocument;
						return {
							width: f.getBoundingClientRect().width,
							table: d.querySelector("table").getBoundingClientRect().width,
							viewport: f.contentWindow.innerWidth,
						};
					});
					assert(result.narrow.width > 0);
					assert(result.narrow.table <= result.narrow.viewport + 2);
					await execute(() => {
						document
							.querySelector("tp-iframe iframe")
							.contentDocument.querySelector("[data-test-complete]")
							.setAttribute("data-old-report", "");
						document.querySelector("[data-tp-playground-test]").click();
					});
					const rerun = await until(
						() =>
							document
								.querySelector("tp-iframe iframe")
								?.contentDocument?.querySelector(
									"[data-test-complete]:not([data-old-report])",
								)?.dataset.testResult,
					);
					assert.equal(rerun, "passed");
					result.toolbarRerun = true;
				} else assert(result.failed > 0);
				report.checks.push({
					language,
					theme,
					scenario,
					ms: Date.now() - started,
					...result,
				});
				console.log(language, theme, scenario, "verified");
				await writeFile(
					out + "/results.json",
					JSON.stringify(report, null, 2) + "\n",
				);
			}
		}
} catch (error) {
	report.error = String(error);
	throw error;
} finally {
	await writeFile(
		out + "/results.json",
		JSON.stringify(report, null, 2) + "\n",
	);
	if (session)
		await command("/session/" + session.sessionId, undefined, "DELETE");
	await rm(fixture, { force: true });
}
