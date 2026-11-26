import { chromium, firefox } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
async function webdriverCommand(url, data, options = {}) {
	const response = await fetch(url, {
		method: options.method || "POST",
		headers: { "Content-Type": "application/json" },
		body: data == null ? undefined : JSON.stringify(data),
		signal: AbortSignal.timeout(options.timeoutMilliseconds || 25000),
	});
	const result = await response.json();
	if (!response.ok || result.value?.error)
		throw Error(result.value?.message || response.statusText);
	return result.value;
}
const nested = process.env.NESTED === "1";
const fixtureBase = process.env.BASE_URL || "http://127.0.0.1:4376";
const root = new URL("../", import.meta.url);
const endpoint = process.env.SAFARI_DRIVER_URL || "http://127.0.0.1:4445";
const sources = () =>
	Object.fromEntries(
		[
			"src/utilities/multi-pages-reading-history.ts",
			"src/utilities/document-history.ts",
			"../tp-restructuredtext/src/parser.ts",
			"src/utilities/restore-element-scroll.ts",
			"src/components/markdown-multi-pages/markdown-multi-pages.ts",
			"src/components/markup-multi-pages/markup-multi-pages.ts",
		].map((f) => [
			f,
			createHash("sha256")
				.update(readFileSync(new URL(f, root)))
				.digest("hex"),
		]),
	);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
for (const name of (
	process.env.HISTORY_BROWSERS || "chromium,firefox,safari"
).split(",")) {
	const results = [];
	let version = "unknown";
	const browser =
		name === "safari"
			? null
			: name === "chrome"
				? await chromium.launch({ channel: "chrome" })
				: await { chromium, firefox }[name].launch();
	const context = browser
		? await browser.newContext({ viewport: { width: 1100, height: 600 } })
		: null;
	try {
		for (const [mode, ext] of Object.entries({
			html: "html",
			markdown: "md",
			asciidoc: "adoc",
			latex: "tex",
			restructuredtext: "rst",
			markup: "md",
		}).filter(
			([name]) => !process.env.LANGUAGE || name === process.env.LANGUAGE,
		))
			for (const fragment of ["", "#heading"].filter(
				(f) =>
					process.env.CASE_FRAGMENT === undefined ||
					f === process.env.CASE_FRAGMENT,
			)) {
				const base = `${fixtureBase}/__reading/${mode}/a/${nested ? "?nested=1" : ""}`;
				const initialUrl =
					base + (nested ? "#/cover.html#parent-heading" : `#/cover.${ext}`);
				const steps = [];
				let api;
				if (browser) {
					const page = await context.newPage();
					version = browser.version();
					page.setDefaultTimeout(20000);
					api = {
						read: (script, args = []) =>
							page.evaluate(
								({ script, args }) => new Function(script).apply(null, args),
								{ script, args },
							),
						go: (url) => page.goto(url, { waitUntil: "domcontentloaded" }),
						back: () => page.goBack(),
						forward: () => page.goForward(),
						click: () => page.locator("#leave").click(),
						close: () => page.close(),
					};
				} else {
					const c = (p, d) =>
						webdriverCommand(endpoint + p, d, {
							timeoutMilliseconds: 25000,
						}).catch((error) => {
							throw new Error(`WebDriver ${p}: ${error.message}`);
						});
					const session = await c("/session", {
						capabilities: {
							alwaysMatch: {
								browserName: "safari",
								pageLoadStrategy: "normal",
							},
						},
					});
					version = session.capabilities.browserVersion;

					const p = "/session/" + session.sessionId;
					await c(p + "/window/rect", { width: 1100, height: 600 });
					api = {
						read: (script, args = []) =>
							c(p + "/execute/sync", { script, args }),
						go: (url) => c(p + "/url", { url }),
						back: () => c(p + "/back", {}),
						forward: () => c(p + "/forward", {}),
						click: () =>
							c(p + "/execute/sync", {
								script: 'document.querySelector("#leave").click();',
								args: [],
							}),
						close: () =>
							webdriverCommand(endpoint + p, null, {
								method: "DELETE",
								timeoutMilliseconds: 5000,
							}),
					};
				}
				const wait = async (script, args = []) => {
					const end = Date.now() + 60000;
					while (Date.now() < end) {
						try {
							if (await api.read(script, args)) return;
						} catch (error) {
							if (
								!/Execution context was destroyed|Cannot find context/.test(
									error.message,
								)
							)
								throw error;
						}
						await delay(100);
					}
					throw Error("Timed out: " + script);
				};
				const parentPositions = new Map();
				const setPosition = async (value) => {
					await api.read(
						'const el=document.querySelector("#guide main");el.dispatchEvent(new Event("wheel"));el.scrollTop=Math.min(arguments[0],el.scrollHeight-el.clientHeight-5);const parent=document.querySelector("#parent main");if(parent)parent.scrollTop=30;',
						[value],
					);
					await delay(300);
					const top = await api.read(
						'return document.querySelector("#guide main").scrollTop;',
					);
					if (top < 50) throw Error("Page was not scrollable");
					if (nested)
						parentPositions.set(
							top,
							await api.read(
								'return document.querySelector("#parent main").scrollTop;',
							),
						);
					return top;
				};
				const assertPosition = async (action, url, top) => {
					const expectedTitle = [120, 220, 160, 500, 800].includes(top)
						? "Cover"
						: "Chapter";
					await api[action]();
					await wait(
						'return location.href===arguments[0] && document.querySelector("#guide main h1, #guide main h2")?.textContent === arguments[1];',
						[url, expectedTitle],
					);
					let stable = true;
					try {
						await wait(
							'return Math.abs(document.querySelector("#guide main").scrollTop-arguments[0])<3;',
							[top],
						);
					} catch {
						stable = false;
					}
					await delay(600);
					const actual = await api.read(
						'return {url:location.href,top:document.querySelector("#guide main").scrollTop,title:document.querySelector("#guide main h1, #guide main h2")?.textContent,parentTop:document.querySelector("#parent main")?.scrollTop,parentTitle:document.querySelector("#parent main h1")?.textContent,dpr:devicePixelRatio};',
					);
					const step = {
						action,
						expectedUrl: url,
						actualUrl: actual.url,
						expectedTop: top,
						actualTop: actual.top,
						devicePixelRatio: actual.dpr,
						expectedTitle,
						actualTitle: actual.title,
						parentTop: actual.parentTop,
						expectedParentTop: parentPositions.get(top),
						parentTitle: actual.parentTitle,
						passed:
							stable &&
							url === actual.url &&
							actual.title === expectedTitle &&
							Math.abs(actual.top - top) < 3 &&
							(!nested ||
								(Math.abs(actual.parentTop - parentPositions.get(top)) < 3 &&
									actual.parentTitle === "Parent page")),
					};
					steps.push(step);
					if (!step.passed)
						throw Error("Reading position did not survive " + action);
				};
				let error = null;
				let initialLoadMilliseconds = null;
				try {
					const url = nested
						? initialUrl
						: base + `#/chapter.${ext}` + fragment;
					const started = Date.now();
					await api.go(initialUrl);
					await wait(
						'return document.querySelector("#guide main h1, #guide main h2")?.textContent.includes("Cover") && document.querySelector("#guide main").scrollHeight>2200;',
					);
					initialLoadMilliseconds = Date.now() - started;
					const initialTop = await setPosition(500);
					await api.read(
						`const a=document.createElement('a');a.href='chapter.${ext}${fragment}';a.textContent='Read chapter';document.querySelector('#guide main').append(a);a.click();`,
					);
					await wait(
						'return document.querySelector("#guide main h1, #guide main h2")?.textContent.includes("Chapter") && document.querySelector("#guide main").scrollHeight>2200;',
					);
					await delay(800);
					let bookTop = await setPosition(1400);
					await api.click();
					await wait(
						'return document.querySelector("#guide main h1, #guide main h2")?.textContent==="Cover";',
					);
					const homeUrl = await api.read("return location.href;");
					await delay(500);
					let homeTop = await setPosition(120);
					for (let cycle = 0; cycle < 3; cycle++) {
						await assertPosition("back", url, bookTop);
						bookTop = await setPosition([1700, 1100, 1900][cycle]);
						await assertPosition("forward", homeUrl, homeTop);
						if (cycle < 2) homeTop = await setPosition([220, 160][cycle]);
					}
					await assertPosition("back", url, bookTop);
					// Also exercise the component router after a cross-document return.
					await api.read(
						`document.querySelector('#guide aside a[href$="cover.${ext}"]').click();`,
					);
					await wait(
						'return document.querySelector("#guide main h1, #guide main h2")?.textContent==="Cover";',
					);
					const coverUrl = await api.read("return location.href;");
					const coverTop = await setPosition(800);
					await assertPosition("back", url, bookTop);
					await assertPosition("forward", coverUrl, coverTop);
					await assertPosition("back", url, bookTop);
					// Reader input must end restoration, even if content grows later.
					const continued = await setPosition(2100);
					await api.read(
						'document.querySelector("#guide main").append(document.createElement("p"));',
					);
					await delay(600);
					if (
						Math.abs(
							(await api.read(
								'return document.querySelector("#guide main").scrollTop;',
							)) - continued,
						) > 2
					)
						throw Error("Restoration overrode reader input");
					await assertPosition("back", initialUrl, initialTop);
					await assertPosition("forward", url, continued);
				} catch (e) {
					error = e.message;
					console.log("COMMAND ERROR", error);
					try {
						console.log(
							"DIAGNOSTIC",
							JSON.stringify(
								await api.read(
									`const host=document.querySelector('#guide');const nav=host?.navigationHistory;return {url:location.href,state:history.state,current:nav?.current,key:nav?.key,entries:nav?[...nav.entries]:null,main:host?.querySelector('#guide main')?.scrollTop};`,
								),
							),
						);
					} catch {}
				} finally {
					await api.close().catch((e) => {
						console.log("CLEANUP ERROR", e.message);
						error ??= `Cleanup: ${e.message}`;
					});
				}
				results.push({
					mode,
					fragment,
					initialLoadMilliseconds,
					steps,
					error,
					passed: !error && steps.length === 12 && steps.every((s) => s.passed),
				});
				console.log(
					name,
					mode,
					fragment || "no anchor",
					JSON.stringify(results.at(-1)),
				);
			}
	} finally {
		if (browser) await browser.close();
		writeFileSync(
			new URL(
				`public/docs/appendices/multi-pages-${nested ? "nested-" : ""}history-${name}${process.env.REPORT_SUFFIX || ""}.json`,
				root,
			),
			JSON.stringify(
				{
					checkedAt: new Date().toISOString(),
					nested,
					browser: name,
					version,
					sources: sources(),
					requested:
						(process.env.LANGUAGE ? 1 : 6) *
						(process.env.CASE_FRAGMENT === undefined ? 2 : 1),
					results,
				},
				null,
				2,
			) + "\n",
		);
	}
	if (results.some((r) => !r.passed)) process.exitCode = 1;
}
