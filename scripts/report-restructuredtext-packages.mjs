import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const hash = createHash("sha256")
	.update(readFileSync("../tp-restructuredtext/src/parser.ts"))
	.digest("hex");
const runs = ["chrome", "firefox", "safari"].map((b) =>
	JSON.parse(
		readFileSync(
			`public/docs/appendices/restructuredtext-loading-${b}-packages.json`,
		),
	),
);
for (const r of runs)
	if (r.parserSha256 !== hash)
		throw Error("Stale package results: " + r.browser);
for (const run of runs) {
	if (run.results.length !== 4) throw Error("Missing package cases");
	for (const c of run.results) {
		const stalled = c.scenario.endsWith("-stalled");
		const name = c.scenario.split("-")[0];
		const expected = stalled
			? "Python package loading timed out after 60000 ms"
			: `Unable to load Python packages: ${name}`;
		if (!c.passed || !c.highlighted || !c.firstError?.includes(expected))
			throw Error("Package recovery failed");
		if (stalled && !(c.openDuringRecovery > 0))
			throw Error("Old response was not held during recovery");
		const target = c.requests.filter((r) => r.file.startsWith(name + "-"));
		if (
			!target.some((r) => r.interrupted) ||
			target.filter((r) => !r.interrupted).length !== 1 ||
			c.requests.filter((r) => !r.file.startsWith(name + "-")).length !==
				(stalled ? 2 : 1)
		)
			throw Error("Unexpected request sequence");
	}
}
const rows = runs.flatMap((r) =>
	r.results.map(
		(c) =>
			`| ${r.browser} ${r.version} | ${c.scenario} | ${c.passed ? "Passed" : "Failed"} | ${(c.failureMilliseconds / 1000).toFixed(2)} | ${(c.recoveryMilliseconds / 1000).toFixed(2)} | ${c.highlighted ? "Yes" : "No"} |`,
	),
);
writeFileSync(
	"public/docs/appendices/restructuredtext-package-loading.md",
	`# Docutils and Pygments download recovery

## Findings and correction

The [Chrome measurements before correction](restructuredtext-loading-chrome-packages-before.json) show different outcomes. A missing Docutils package produced a Python import error and could be retried. A missing Pygments package did not stop conversion: Docutils cached the unavailable colorizer, so installing Pygments on the next attempt did not restore highlighting in that runtime.

[Pyodide 0.29.3's package loader](https://github.com/pyodide/pyodide/blob/0.29.3/src/js/load-package.ts#L291-L317) can finish its promise after reporting failed package downloads. Awaiting loadPackage alone is therefore insufficient. Before executing any conversion code or reporting packages as loaded, the parser now verifies both required packages against Pyodide's public loadedPackages registry. Names are matched case-insensitively, including the registry's Pygments key. An absent package rejects the conversion with its name. A subsequent conversion retries the missing download on the same parser and runtime, retaining packages already installed.

## Package-loading deadline

The package batch now has a 60-second deadline after runtime initialization. Configure the parser with \`packageTimeout\` (a positive finite number of milliseconds), for example \`new TpRestructuredTextParser({ packageTimeout: 120_000 })\`, for slower networks. The initialization deadline is separate.

On expiration, the conversion rejects and releases the conversion queue. The parser discards the shared runtime because Pyodide's unfinished package operation can retain its installation lock and continue changing its filesystem. A retry on the same parser initializes a fresh runtime, rather than waiting on that lock. Both required packages are loaded again. Late completion or rejection of the discarded operation does not run conversion code or replace the new runtime. This bounds the caller's wait; it does not cancel Pyodide's internal download.

Firefox initially reused the still-open wheel response even after runtime replacement, so a new runtime alone was insufficient ([failed measurements before the distinct retry downloads](restructuredtext-loading-firefox-packages-before-distinct-retry.json)). After a package timeout, missing Docutils and Pygments archives are fetched through distinct URLs with a tp-retry query parameter. Each archive is verified by the browser against the SHA-256 in the runtime lockfile before installation through a temporary Blob URL. Failed or expired controlled downloads are aborted and temporary URLs released. Custom package servers must accept this query parameter. The original Pyodide download remains outside this cancellation mechanism.

Ordinary interrupted downloads that have already settled still reuse the healthy runtime and only download the missing package.

## Browser verification

Each case starts a fresh session, uses real Pyodide and Docutils, and affects only the selected wheel. The server sends a ZIP header and advertises a longer body. Ordinary cases then close the connection; cases ending in -stalled keep the response open without completing it. Other runtime resources remain available. After the first conversion rejects, the server restores the wheel for new requests. In stalled cases, the original response remains open throughout the successful recovery; the test then closes it and runs one further conversion to check that late failure is harmless. The same parser must render a heading and Python code with real Pygments token spans, then complete another conversion. This verifies functionality after retry, not just a resolved promise. The requested syntax_highlight setting is short; the normal parser default remains unchanged.

| Browser | Interrupted package | Result | Time to error (s) | Conversion after restoration (s) | Highlighting restored |
| --- | --- | --- | ---: | ---: | --- |
${rows.join("\n")}

${runs.map((r) => `- ${r.browser}: ${r.checkedAt}; [errors, timings and wheel requests](restructuredtext-loading-${r.browser}-packages.json).`).join("\n")}

The request records distinguish the interrupted wheel from the subsequent successful request. Ordinary interruption cases download the missing package again; stalled cases download both packages into the fresh runtime. The records verify that the old response is still open during recovery. Neither case downloads either wheel for the final extra conversion. Google Chrome is the installed browser, not bundled Chromium. Safari is native Safari, not Playwright WebKit.

These cases cover abrupt closure and an indefinitely open response for each wheel separately. They do not cover simultaneous failure of every runtime resource. The browser observation limit is 120 seconds for a deliberately stalled case, allowing the production 60-second package deadline plus initialization and recovery; the other cases retain their existing limit.

## Validation and provenance

All twelve browser cases pass. The parser suite passes 34 tests, including separate silent-failure/retry tests for each required package. Those tests assert that no Python conversion runs before both packages are installed, and that a settled download failure reuses the same runtime. Additional tests cover a stuck package loader, a queued retry on a fresh runtime, late completion of the old loader and a longer configurable deadline. Retry tests also check distinct archive URLs, SHA-256 integrity metadata, rejection of a failed archive fetch, cancellation of sibling downloads and reuse of already installed packages. Fourteen focused component/history tests pass; TypeScript, Biome and builds pass.

Current parser SHA-256: \`${hash}\`.

The [initialization and reading-history audit](restructuredtext-loading.md) records the preceding revision and its browser measurements. Its navigation campaign was not rerun as part of this package-download check; the package measurements above are tied to the current parser hash.

## Reproduce

Start \`PORT=4383 node scripts/serve-reading-history-fixtures.mjs\` and, for Safari, \`safaridriver -p 4445\` with remote automation enabled. For each browser chrome, firefox and safari, run \`BASE_URL=http://127.0.0.1:4383 HISTORY_BROWSERS=chrome SCENARIO=docutils,pygments,docutils-stalled,pygments-stalled REPORT_SUFFIX=-packages node scripts/check-restructuredtext-loading.mjs\`, replacing the browser name. Do not run concurrent Safari sessions. Generate this page with \`node scripts/report-restructuredtext-packages.mjs\`; generating the report does not execute tests.
`,
);
