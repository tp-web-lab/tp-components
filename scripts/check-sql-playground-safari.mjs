import assert from "node:assert/strict";
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import ts from "typescript";
const base = process.env.BASE_URL || "http://127.0.0.1:4198";
const endpoint = process.env.SAFARI_DRIVER_URL || "http://127.0.0.1:4445";
const selectedScenarios = process.env.SCENARIOS?.split(",");
const out = process.env.REPORT_DIR || "/tmp/sql-playground-safari";
await mkdir(out, { recursive: true });
// Reuse the same actual-project fixtures as the cross-engine regression suite.
const source = await readFile(
	"tests/playgrounds/sql-test-results.test.ts",
	"utf8",
);
const start = source.indexOf("async (scenario) => {");
const end = source.indexOf("}, scenario);", start);
assert(start >= 0 && end > start);
const setup = ts.transpileModule(
	"window.setupSqlTest=" + source.slice(start, end + 1) + ";",
	{
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.None,
		},
	},
).outputText;
const fixture = "public/__sql-safari-check.html";
await writeFile(
	fixture,
	'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>',
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
let session;
const report = {
	date: new Date().toISOString(),
	browser: "native Safari",
	checks: [],
	limitations: [
		"The CDN interruption scenario is covered by Playwright, not this native Safari run.",
	],
};
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
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
		const deadline = Date.now() + 90000;
		while (Date.now() < deadline) {
			const v = await execute(fn);
			if (v) return v;
			await delay(200);
		}
		throw Error("Timed out: " + fn);
	}
	await command(path + "/window/rect", { width: 1400, height: 1000 });
	await command(path + "/url", { url: base + "/__sql-safari-check.html" });
	report.storageProbe = await command(path + "/execute/async", {
		script:
			"const done=arguments[arguments.length-1];localStorage.setItem('sql-safari-probe','test');const immediate=localStorage.getItem('sql-safari-probe');setTimeout(()=>{const later=localStorage.getItem('sql-safari-probe');localStorage.removeItem('sql-safari-probe');done({immediate,later});},1000);",
		args: [],
	});

	assert.equal(
		report.storageProbe.later,
		"test",
		"Safari localStorage failed the independent persistence probe",
	);

	for (const theme of ["light", "dark"])
		for (const scenario of [
			"passing",
			"inferred",
			"query-change",
			"columns",
			"duplicates",
			"unexpected-error",
			"wrong-error",
			"setup-error",
			"missing-source",
			"invalid-json",
			"empty",
			"invalid-expectation",
			"sqlite",
		]) {
			if (selectedScenarios && !selectedScenarios.includes(scenario)) continue;
			const began = Date.now();
			await command(path + "/url", { url: base + "/__sql-safari-check.html" });
			await execute((code) => {
				const script = document.createElement("script");
				script.textContent = code;
				document.head.append(script);
			}, setup);
			await execute(
				({ scenario, theme }) => {
					document.documentElement.classList.add("tp-" + theme);
					window.ready = false;
					window
						.setupSqlTest(scenario)
						.then((saved) => {
							window.saved = saved;
							const el = document.querySelector("tp-sql-playground");
							el.classList.add("tp-" + theme);
							window.ready = true;
						})
						.catch((e) => (window.failure = String(e)));
				},
				{ scenario, theme },
			);
			await until(() =>
				window.failure
					? (() => {
							throw Error(window.failure);
						})()
					: window.ready,
			);

			await execute(() =>
				document.querySelector("[data-tp-playground-test]").click(),
			);
			const result = await until(() => {
				const d = document.querySelector(
					"tp-sql-playground tp-iframe iframe",
				)?.contentDocument;
				const r = d?.querySelector(
					"[data-tp-test-results][data-test-complete]",
				);
				if (!r) return null;
				return {
					status: r.dataset.testResult,
					headers: [...r.querySelectorAll("th")].map((n) => n.textContent),
					passed: r.querySelectorAll('[data-test-status="passed"]').length,
					skipped: r.querySelectorAll('[data-test-status="skipped"]').length,
					text: r.textContent,
					actualTheme: d.documentElement.className,
					sentinel: localStorage.getItem("tp-sql-db:sql-result-comparisons"),
					storedUnchanged:
						!window.saved ||
						window.saved === localStorage.getItem("sql-tests-snapshot"),
				};
			});
			assert(result.actualTheme.includes("tp-" + theme));
			assert.equal(
				result.status,
				["passing", "inferred", "sqlite"].includes(scenario)
					? "passed"
					: "failed",
			);
			assert.deepEqual(result.headers, ["Suite", "Test", "Status", "Details"]);
			assert.equal(result.sentinel, "untouched");
			assert.equal(result.storedUnchanged, true);
			if (result.status === "passed") {
				assert.equal(result.passed, 8);
				assert.equal(result.skipped, 1);
			}
			if (scenario === "passing" || scenario === "query-change") {
				result.presentation = await execute(() => {
					const frame = document.querySelector(
							"tp-sql-playground tp-iframe iframe",
						),
						d = frame.contentDocument,
						w = frame.contentWindow;
					const rows = [...d.querySelectorAll("[data-test-status]")];
					const colors = rows.map((r) => {
						const c = r.querySelector("td");
						const s = w.getComputedStyle(c);
						return {
							status: r.dataset.testStatus,
							color: s.color,
							background: w.getComputedStyle(r).backgroundColor,
						};
					});
					const details = d.querySelector("details");
					const closed = !details.open;
					details.querySelector("summary").click();
					return {
						colors,
						logInitiallyClosed: closed,
						logOpened: details.open,
						bodyBackground: w.getComputedStyle(d.body).backgroundColor,
						theme: d.documentElement.outerHTML.slice(0, 350),
						tableWidth: d.querySelector("table").getBoundingClientRect().width,
						viewport: w.innerWidth,
					};
				});
				assert(
					result.presentation.logInitiallyClosed &&
						result.presentation.logOpened,
				);
				assert(
					result.presentation.tableWidth <= result.presentation.viewport + 2,
				);
				await delay(500);
				await writeFile(
					`${out}/${theme}-${scenario}.png`,
					Buffer.from(await command(path + "/screenshot"), "base64"),
				);
			}
			if (scenario === "passing") {
				await execute(() => {
					for (const node of [
						document.documentElement,
						document.querySelector("tp-sql-playground"),
					]) {
						node.classList.toggle("tp-dark");
						node.classList.toggle("tp-light");
					}
				});
				await until(() => {
					const f = document.querySelector(
						"tp-sql-playground tp-iframe iframe",
					);
					const d = f.contentDocument;
					return {
						theme: d.documentElement.className,
						background: f.contentWindow.getComputedStyle(d.body)
							.backgroundColor,
					};
				});
				await delay(300);
				const changedColor = await execute(() => {
					const f = document.querySelector(
						"tp-sql-playground tp-iframe iframe",
					);
					return f.contentWindow.getComputedStyle(f.contentDocument.body)
						.backgroundColor;
				});
				assert.notEqual(changedColor, result.presentation.bodyBackground);
				result.presentation.liveThemeSwitch = true;
				await execute(() => {
					for (const node of [
						document.documentElement,
						document.querySelector("tp-sql-playground"),
					]) {
						node.classList.toggle("tp-dark");
						node.classList.toggle("tp-light");
					}
				});
				await delay(300);
				await execute(() => {
					const f = document.querySelector(
						"tp-sql-playground tp-iframe iframe",
					);
					f.contentDocument
						.querySelector("[data-test-complete]")
						.setAttribute("data-old-report", "");
					document.querySelector("tp-sql-playground").test();
				});
				await until(() => {
					const d = document.querySelector(
						"tp-sql-playground tp-iframe iframe",
					).contentDocument;
					return !!d.querySelector(
						"[data-test-complete]:not([data-old-report])",
					);
				});
				result.presentation.publicMethodRerun = true;
			}
			if (scenario === "sqlite") {
				const saved = await execute(() =>
					localStorage.getItem("sql-tests-snapshot"),
				);
				assert(saved && saved.length > 0);
				await command(path + "/refresh", {});
				await delay(1000);
				assert.equal(
					await execute(() => localStorage.getItem("sql-tests-snapshot")),
					saved,
				);
				result.persistedAfterReload = true;
				result.storedBytes = Buffer.from(saved, "base64").length;
			}

			report.checks.push({
				theme,
				scenario,
				ms: Date.now() - began,
				...result,
			});
			console.log(theme, scenario, result.status);
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
