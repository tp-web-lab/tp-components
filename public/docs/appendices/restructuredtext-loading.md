# reStructuredText loading verification

For package-download interruptions, see the [Docutils and Pygments download recovery audit](restructuredtext-package-loading.md). Each campaign records the parser revision it tested.

## Investigation

The previous nested-history campaign recorded two initial loading timeouts: Firefox did not reach the Cover heading within 60 seconds, and Safari's WebDriver request exceeded 25 seconds. Neither record contained a completed Back/Forward action; the original Safari record does not identify which pending WebDriver command timed out. Those original records do not contain enough phase measurements to identify a specific CDN request or compilation step as their cause. Subsequent isolated attempts passed; this is not evidence that the original failures were fixed merely by rerunning them.

A fresh Firefox diagnostic measured Pyodide ready at approximately 4.1 seconds, Docutils and Pygments loaded at 4.5 seconds, and the nested cover ready at 8.0 seconds. The source inspection identified two independent recovery defects: the bootstrap script had no deadline, and rejected script/runtime promises were retained permanently. A stalled script could therefore hold the shared conversion queue indefinitely; a failed runtime prevented later conversions from retrying.

## Corrections

- Each Pyodide bootstrap-script request has a 15-second deadline and one automatic retry after timeout or network failure.
- The retry uses a distinct `tp-retry` query parameter: the controlled Safari test showed only one server request when the same URL was reused, and both script elements failed together after 20 seconds. Custom bootstrap URLs must allow that parameter.
- Failed script requests remove their listeners, timer and element. A late factory is reused if it has already arrived.
- After both attempts fail, the conversion rejects with the script URL. The queue remains usable and subsequent conversions can retry.
- Rejected runtime initialization is no longer cached permanently. Successful initialization remains shared.
- Browser verification records initial rendering time and command-specific WebDriver errors. A cleanup error no longer masks the original failure. Firefox waits for DOMContentLoaded, then checks actual content readiness. Safari history tests retain the normal page-load strategy; the direct loading-only probe uses eager. The 60-second content deadline and scroll tolerances are unchanged.

Runtime initialization now has a separate 60-second deadline, configurable with the positive finite parser option `initializationTimeout`. A timeout rejects the caller, releases the shared conversion queue and permits a new initialization; a late result from the old attempt is ignored. This is not cancellation of Pyodide or its network requests. Python package loading after initialization has no additional deadline here. It cannot guarantee performance on every network. Removing a script is not a guarantee that its pending network request is cancelled. Arbitrary Python conversions and doctests are not automatically replayed.

During this investigation, Safari history tests using the eager WebDriver page-load strategy blocked on Back. The [isolated diagnostic](multi-pages-nested-history-safari-rst-diagnostic.json) records a successful initial load in 1.87 seconds, followed by the Back timeout; session cleanup also timed out. Earlier failed attempts obscured the original error because cleanup threw before the case was recorded. The driver was restarted to release those orphan test sessions. No user browser was closed. The final history campaign uses the normal strategy used by the earlier passing campaign. This is distinct from the parser's controlled network-stall recovery.

## Fresh-session and recovery measurements

Each case starts a new browser session and attempts a real Docutils conversion. For Firefox and Safari, existing browser/system HTTP caches are not explicitly purged: these are fresh-session measurements, not guaranteed cold-network benchmarks. The controlled-stall case withholds the first script response for 20 seconds and returns an error; the second request redirects to the real pinned Pyodide script. Passing requires a real heading and at least 15 seconds elapsed in that case.

| Browser | Scenario | Result | Conversion time (s) |
| --- | --- | --- | ---: |
| chrome 158.0.8127.38 | normal | Passed | 1.56 |
| chrome 158.0.8127.38 | slow-network | Passed | 8.60 |
| chrome 158.0.8127.38 | interrupted-script | Passed | 1.54 |
| chrome 158.0.8127.38 | offline-recovery | Passed | 1.53 |
| chrome 158.0.8127.38 | interrupted-wasm | Passed | 1.67 |
| chrome 158.0.8127.38 | stalled-first-script | Passed | 16.56 |
| firefox 153.0 | cold-1 | Passed | 8.75 |
| firefox 153.0 | cold-2 | Passed | 8.07 |
| firefox 153.0 | cold-3 | Passed | 8.02 |
| firefox 153.0 | stalled-first-script | Passed | 23.11 |
| firefox 153.0 | interrupted-wasm | Passed | — |
| safari 26.6.2 | cold-1 | Passed | 1.77 |
| safari 26.6.2 | cold-2 | Passed | 1.64 |
| safari 26.6.2 | cold-3 | Passed | 1.64 |
| safari 26.6.2 | stalled-first-script | Passed | 16.55 |
| safari 26.6.2 | interrupted-wasm | Passed | — |

The [failed Safari controlled-stall measurements before the distinct retry URL](restructuredtext-loading-safari-before-retry-url.json) are retained. The [server request trace](restructuredtext-loading-retry-requests.json) showed one request for that attempt; after the fix it records the retry with its distinct URL at approximately 15 seconds.

## Chrome slow and interrupted networks

Chrome means the installed Google Chrome executable, launched with an isolated temporary profile, not bundled Chromium. Each scenario uses a fresh process. The parser facade is imported before the network fault is applied; these measurements cover engine loading and conversion, not downloading the entire component library. Chrome HTTP caching is disabled through CDP.

- Normal: no artificial throttling.
- Slow network: 150 ms latency, 1 MiB/s download and 512 KiB/s upload, applied through CDP to runtime downloads.
- Interrupted script: the first bootstrap request is aborted with a simulated connection reset; its automatic retry must have a distinct URL and render a real heading.
- Offline recovery: both bootstrap attempts fail while offline. The network is restored and the same parser instance must successfully convert again.
- Interrupted WebAssembly: the first request is aborted with connection reset. The conversion must now reject with the initialization-timeout error. Requests are then allowed again and the same parser must convert successfully, without reloading the page. The initial error and recovery time remain in the measurements.
- Stalled script: the shared 20-second controlled-stall fixture verifies the 15-second timeout and automatic retry.

### Recovery after an interrupted WebAssembly response

The [original Chrome failure](restructuredtext-loading-chrome-before-wasm-recovery.json) is preserved. In [Pyodide 0.29.3's initialization](https://github.com/pyodide/pyodide/blob/0.29.3/src/js/emscripten-settings.ts#L196-L221), the WebAssembly-instantiation error is logged without settling initialization. The parser now bounds that wait instead of retaining the pending operation forever. It does not modify Pyodide's private APIs or replay Python code automatically.

A second, cross-browser fixture sends a valid WebAssembly header followed by a prematurely closed HTTP response, with more bytes advertised than delivered. This tests interruption after response headers and body bytes, rather than only rejecting the initial request. After the expected timeout, the server restores the resource. The same parser must render a real heading and complete a further conversion. The browser observation deadline is 100 seconds for this deliberately failing initialization plus recovery; the production initialization limit remains 60 seconds, and ordinary history checks retain their existing deadlines.

| Browser | Recovery | Time until error (s) | Conversion after restoration (s) |
| --- | --- | ---: | ---: |
| chrome | Passed | 60.05 | 1.50 |
| firefox | Passed | 60.40 | 8.04 |
| safari | Passed | 60.10 | 1.57 |

[Chrome truncated-response measurements](restructuredtext-loading-chrome-wasm.json); Firefox and Safari include this case in their loading measurements below.

A successful recovery does not mean rendering works offline. Outages in the script and WebAssembly phases are exercised; interruption during every possible Python package download is not claimed. This is an emulated network profile, not a physical network benchmark.

## History regression

The reStructuredText guide is embedded in a real HTML multi-pages parent. Both child-anchor cases repeat twelve Back/Forward actions and verify the child page, child position, parent URL and parent position. Safari is native Safari, not Playwright WebKit. All three browsers additionally run the same anchor cases without a parent guide. History tests use normal network conditions; the degraded-network cases above test loading and recovery separately.

| Browser | Embedding | Child anchor | Initial load (s) | Passed transitions | Error |
| --- | --- | --- | ---: | ---: | --- |
| chrome | nested | none | 2.03 | 12/12 | none |
| chrome | nested | #heading | 1.67 | 12/12 | none |
| firefox | nested | none | 9.77 | 12/12 | none |
| firefox | nested | #heading | 9.25 | 12/12 | none |
| safari | nested | none | 1.92 | 12/12 | none |
| safari | nested | #heading | 1.94 | 12/12 | none |
| chrome | standalone | none | 1.86 | 12/12 | none |
| chrome | standalone | #heading | 1.67 | 12/12 | none |
| firefox | standalone | none | 8.42 | 12/12 | none |
| firefox | standalone | #heading | 8.16 | 12/12 | none |
| safari | standalone | none | 1.88 | 12/12 | none |
| safari | standalone | #heading | 1.94 | 12/12 | none |

- chrome: 2026-11-24T10:00:24.537Z; [loading measurements](restructuredtext-loading-chrome.json), [history measurements](multi-pages-nested-history-chrome-rst-loading.json).
- firefox: 2026-11-24T10:01:10.468Z; [loading measurements](restructuredtext-loading-firefox.json), [history measurements](multi-pages-nested-history-firefox-rst-loading.json).
- safari: 2026-11-24T10:00:39.429Z; [loading measurements](restructuredtext-loading-safari.json), [history measurements](multi-pages-nested-history-safari-rst-loading.json).

[Chrome standalone-history measurements](multi-pages-history-chrome-rst-loading.json), [Firefox](multi-pages-history-firefox-rst-loading.json), [Safari](multi-pages-history-safari-rst-loading.json).

Parser source SHA-256: `a02568410fe35d3719f76ecb738f894ce1f71050dca1d630a3afd7f675cfc02f`.

The parser suite passes 28 tests, including six recovery tests for stalled scripts, network errors, shared initialization, a configurable initialization deadline, queue recovery and ignoring a late runtime from a failed attempt. The focused component/history suite passes 14 tests. TypeScript and Biome checks pass. The [earlier nested-history audit](multi-pages-nested-history.md) retains its original failures and subsequent successful reruns; the targeted measurements here supplement that campaign rather than replacing it.

## Reproduce

Start `PORT=4379 node scripts/serve-reading-history-fixtures.mjs` and native `safaridriver -p 4445`. Run `HISTORY_BROWSERS=firefox node scripts/check-restructuredtext-loading.mjs`, then the same command with `HISTORY_BROWSERS=safari`. Do not run two Safari sessions concurrently. Run the history suite with `BASE_URL=http://127.0.0.1:4379 NESTED=1 LANGUAGE=restructuredtext HISTORY_BROWSERS=firefox,safari REPORT_SUFFIX=-rst-loading node scripts/check-multi-pages-cross-document-history.mjs`. For installed Google Chrome, run `BASE_URL=http://127.0.0.1:4379 node scripts/check-restructuredtext-chrome-loading.mjs`. Run `HISTORY_BROWSERS=chrome SCENARIO=interrupted-wasm REPORT_SUFFIX=-wasm BASE_URL=http://127.0.0.1:4379 node scripts/check-restructuredtext-loading.mjs` for the Chrome truncated-response case. Run the history command with `HISTORY_BROWSERS=chrome`, first with `NESTED=1`, then with that variable omitted. Generate this report with `node scripts/report-restructuredtext-loading.mjs`.
