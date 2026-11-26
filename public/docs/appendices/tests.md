# Tests

The test suites cover component behavior, shared utilities, the local question-assistance server, documentation generators, browser integrations and accessibility. Run commands from the `tp-components` package directory after installing the workspace dependencies.

## Named public actions

See the [named public actions audit](public-actions-audit.md) for the menu-to-method corrections, execution results and remaining test limitations. `pnpm api:check-methods` checks published descriptions, command branches across component classes and the menu contract of all twelve playgrounds. Functional subcomponents retain ownership of their own commands.

## Optional test feedback for programming questions

On 2026/11/25, the programming questions were verified with an optional **Feedback** filename or path to an external test file. Submission captures the current edited program/project before fetching the tests. The legacy `test` attribute remains supported; the Feedback field takes precedence. Without tests, submission reports “No tests provided.” without claiming correctness.

- **20 focused Vitest tests passed** across interpreter, playground and markup-viewer question adapters, including source snapshots, Feedback precedence and existing cancellation/error behavior.
- **19 Chromium integration scenarios passed**: failure followed by success after an editor correction for JavaScript, TypeScript, Python, Prolog, Scheme and OCaml in each of the interpreter, playground and viewer questions (18 scenarios), plus a Markdown exercise with a relative Feedback filename.
- **18 additional Chromium scenarios passed** for the documented **Explicit Feedback file** examples: the six languages in all three question families load the program from an inline script with an explicit Feedback filename, fail with the initial source and pass after correction. Neither `src` nor a `test` attribute is used.
- TypeScript and Biome checks passed. Introductory examples, their five markup versions, JavaScript API examples and TypeDoc were synchronized. Native markup, example labels and descriptions were checked.

Programming-question Feedback uses only the console; the execution iframe is hidden. Scheme now logs each test name and status, failure details and the final summary, matching the console-based presentation of the other languages. Standalone playgrounds retain their common results table. Python and Prolog test feedback is compact: one line per test plus one suite summary. Python tracebacks remain in the detailed report/engine output; the console keeps the final error message. PlUnit engine output is retained in its log without being duplicated in the console. The Python/Prolog browser checks cover failing and corrected submissions and verify three single-line results plus one summary (excluding the initial runtime-loading notice). All 37 Chromium scenarios pass with console-only question feedback, including Scheme per-test messages; the 20 question adapter tests also pass.

Run the browser regressions with `pnpm exec playwright test --config playwright.playgrounds.config.ts tests/playgrounds/programming-question-feedback.test.ts --project=chromium`. This verification does not claim Firefox or Safari coverage for the new Feedback-file flow.

The six programming languages now share the same deliberate initial error (`x + 1`) in Basic usage and Explicit Feedback file. All suites check `3 → 6`, `0 → 0` and `−2 → −4`. The 36 example scenarios verify **three failures and no passes before correction**, then **three passes and no failures** with `x * 2`; the additional external-Markdown scenario also passes (**37 Chromium scenarios**, 2026/11/25). The five markup variants, API examples and TypeDoc are synchronized.

## Running the suites

| Command | Scope |
| --- | --- |
| `pnpm test` | All Vitest tests: `src/**/*.test.ts`, `scripts/**/*.test.ts` and `server/**/*.test.mjs`. Component tests use jsdom; server tests select the Node environment. |
| `pnpm test:coverage` | The complete Vitest suite with V8 coverage of production TypeScript in `src/components/`; writes `config/global-quality-coverage/coverage-summary.json`. |
| `pnpm test:scripts` | Node test runner tests in `scripts/*.test.mjs`: documentation, examples, generators, CI configuration and publication helpers. |
| `pnpm test:playgrounds` | Functional Playwright tests in Chromium, Firefox and WebKit: local files, Python projects, and dynamic editor/iframe sizing. |
| `pnpm test:a11y` | Playwright accessibility scenarios in all three browser engines, including color contracts and geometry keyboard interaction. |
| `pnpm test:all` | `test`, `test:scripts`, `test:playgrounds`, then `test:a11y`; execution stops at the first failing suite. Coverage is not included. |
| `pnpm test:component <name>` | Focused Vitest regression tests for one component. |
| `pnpm test:a11y:component <name>` | Focused browser accessibility scenarios for one component. |
| `pnpm exec tsc --noEmit` | Type checking, separate from test execution. |

Install the three Playwright browsers with `pnpm exec playwright install` when they are not available. Browser suites use a dedicated Vite server on port 4198 and the `node_modules/.vite-playwright` dependency cache. Hot reload is disabled during these runs. This keeps the development server on port 4173 and its optimized dependencies independent; outside CI, a running test server can be reused only if it serves this checkout. Python integration tests also require the browser runtime resources to be available. Run the suites sequentially, as `test:all` does. For concurrent browser suites, start the test server separately with `pnpm vite --config vite.playwright.config.ts`; otherwise the first suite to finish can stop a server still used by another suite.

`pnpm test` does **not** run the Node script suite or Playwright. The server's `.test.mjs` file imports Vitest and belongs to `pnpm test`; do not execute it with `node --test`.

The `test:quality:*` commands select overlapping parts of the Vitest suite and collect coverage; they do not introduce additional independent tests. Test files under `public/` are sample projects or learner exercise fixtures, executed by the embedded runners. Some deliberately fail for the initial answer, so they must not be collected as library regression tests.

## Tracer stepping in Safari

On 2026/11/24, the four tracers passed the focused checks in **Safari 26.6.2** using SafariDriver, rather than Playwright WebKit.

| Tracer | Recorded steps | Highlight checks | Saved JSON replay and duplicate grouping | Next/Previous buttons |
| --- | ---: | ---: | --- | --- |
| JavaScript | 7 | 42 | Passed | Passed |
| TypeScript | 7 | 42 | Passed | Passed |
| Python | 10 | 60 | Passed | Passed |
| Scheme | 14 | 84 | Passed | Passed |

The scenarios evaluate nested arithmetic with Unicode text before the highlighted expressions, and retain the original TypeScript annotations. Each recording is checked forwards and backwards, saved to a JSON file, then loaded with Worker creation blocked. A second load introduces duplicate snapshots to verify grouping. Every highlighted source range and accumulated output is checked; native pointer navigation is also exercised. These focused checks do not constitute a complete language or SICP example audit.

Run `node scripts/check-tracer-visible-steps-safari.mjs` with the documentation server at `BASE_URL` (default `http://127.0.0.1:4386`) and SafariDriver at `SAFARI_DRIVER_URL` (default `http://127.0.0.1:4445`). The script writes recordings, screenshots and its report to `/tmp/tp-tracer-safari/`. The verified result is retained in `config/tracer-visible-steps-safari.json`.

SafariDriver's pointer coordinates required compensation for the inherited 85% page zoom; this adjustment belongs to the test harness and does not alter the components or Safari settings.

## Same-line expressions and OCaml recording

On 2026/11/25, the five “Subexpressions on one line” documentation examples passed in Chrome and Firefox. The checks verify separate source ranges for both additions, actual grouping of unchanged snapshots, and saved JSON replay with Worker creation blocked.

| Tracer | Visible steps | Groups containing unchanged snapshots |
| --- | ---: | ---: |
| JavaScript | 7 | 1 |
| TypeScript | 7 | 1 |
| Python | 8 | 1 |
| Scheme | 15 | 1 |
| OCaml | 11 | 5 |

Run `node scripts/check-tracer-same-line-examples.mjs` with `BROWSER=chrome` or `BROWSER=firefox`. The default documentation server is `http://127.0.0.1:4386`; override it with `BASE_URL`.

The OCaml recorder additionally passed thirteen cases in Chrome and Firefox: the seven executable documentation examples, Unicode source locations, a structure without phrase separators, a bounded infinite loop, syntax errors, explicitly unsupported modules, and typed float arrays/Boolean references. Checks cover recursion depth, shared identities, captured mutable values, source highlights and replay. The same thirteen cases passed against the production build in Chrome. These checks validate the documented synchronous subset, not complete OCaml language compatibility.

Run `node scripts/check-ocaml-tracer-browser.mjs`; use `TRACE_MODULE=/components/ocaml-tracer/ocaml-tracer.js` and the preview server's `BASE_URL` to test a production build. Reports are retained in `config/ocaml-tracer-verification/`. The focused Vitest run for the five tracers and component API generation passed **119 tests**. Documentation checks, TypeScript declarations and the Vite build also passed.

Safari 26.6.2 also passed the focused OCaml recording, 66 source-highlight checks, duplicate grouping and saved JSON replay without a Worker. Next/Previous were exercised with DOM button clicks. Native SafariDriver pointer clicks did not reach the document during this run, so native pointer interaction remains **unverified** for this new component; no component fix is inferred from that automation failure. Reproduce the completed checks with `TRACERS=ocaml SAFARI_NAVIGATION=dom node scripts/check-tracer-visible-steps-safari.mjs`. The report explicitly records this navigation mode.

## Prolog resolution tracer

On 2026/11/25, `tp-prolog-tracer` passed the documented family search, factorial, failure, cut and arithmetic-exception scenarios in Chrome and Firefox using SWI-Prolog 10.1.21 through swipl-wasm 8.3.1. The family query returns bob, cat and dan; factorial returns 24; failure returns no solution; the cut keeps only red. Both browsers passed JSON replay with Worker creation prohibited and identical reconstructed SVG trees. An infinite recursive query stops at 2,000 debugger events and preserves a partial recording, including its terminal exception.

Run `node scripts/check-prolog-tracer-browser.mjs` with `BROWSER=chrome` or `BROWSER=firefox` and a documentation server at `BASE_URL` (default `http://127.0.0.1:4386`). Reports are retained in `config/prolog-tracer-verification/`. Seven focused unit tests cover explored alternatives, reused SWI frame references, malformed recordings, replay precedence, current source/query capture, cancellation and deferred engine loading. TypeScript, documentation checks and the production build pass. The execution scenarios above have not been verified in Safari; its presentation checks are described below.

The 2026/11/25 follow-up verifies numbered source lines and event-by-event highlighting in Chrome and Firefox, including calling subgoals on separate lines of a clause and JSON replay. The `tp-prolog tracer` drawer passes with edited source, an edited query, 75% initial width, simple mode and an unchanged interpreter transcript. Run `node scripts/check-prolog-interpreter-tracer.mjs` with the same browser/server options. The shared drawer controller and Prolog source-line regression run passed 47 tests across seven files; the broader interpreter run also passed 52 tests. These runs overlap and must not be added together.

Presentation checks on 2026/11/25 passed in **Firefox 153.0** and **Safari 26.6.2** against the rebuilt production component, in both light and dark themes. They verify the centered filename, larger native icon/title, brand divider, aligned Source and Solutions headings, light default, and opening/closing the complete Trace JSON with native clicks. The displayed JSON matches `getCode()`. SafariDriver's native pointer coordinates compensate for the inherited page zoom; the component does not modify browser zoom.

Run `BROWSER=firefox node scripts/check-prolog-tracer-presentation.mjs` or `BROWSER=safari node scripts/check-prolog-tracer-presentation.mjs` with a Vite preview server at `BASE_URL` (default `http://127.0.0.1:4409`). Safari uses SafariDriver at `SAFARI_DRIVER_URL` (default `http://127.0.0.1:4445`). Reports are in `config/prolog-tracer-verification/presentation-*.json`. Rebuild before running: an earlier `dist` still contained the previous toolbar and omitted the JSON panel, even though the development sources were updated.

The visualizer represents explored goals and clause attempts from the native debugger, not the full theoretical SLD tree. This verification does not claim support for interactive input, DOM operations or programs overriding the debugger hooks.

## Targeted component imports

`pnpm exec vitest run src/utilities/component-imports.test.ts` checks scoped component discovery, source and production module URLs, deduplication and the absence of startup observers. The prose-editor tests cover HTML exports with cherry-picked imports, shared styles and components stored in templates. Importing the editor does not start the document-wide autoloader; embedded content is imported on insertion or rendering. The explicit `tp-loader` entry point retains its global observation behavior.

## Checking API documentation

Run these read-only checks after regenerating the component manifests and documentation with `pnpm build` and `pnpm api:sync-docs` when source comments change.

| Command | Scope |
| --- | --- |
| `pnpm examples:check-javascript` | All five Javascript API sources reconstruct the canonical introduction using cherry-picked imports, with exact source comparison including blank lines and indentation. |
| `pnpm examples:check-basic` | All five Basic usage sources match the introductory example through their native conversion, including blank lines and literal code indentation. Native TikZ is checked against the introductory drawing and scale. |
| `pnpm docs:check-api-examples` | Exact agreement between each introductory HTML example, its class JSDoc, API metadata and generated TypeDoc code, including indentation and blank lines; rejects missing, duplicate or contaminated class examples. |
| `pnpm api:check-attributes` | Attribute types, defaults, descriptions, source comment conventions and coverage of observed attributes. |
| `pnpm api:check-methods` | Missing descriptions and descriptions that merely repeat a method name. |
| `pnpm api:check-css` | Missing CSS property descriptions or defaults and generic placeholder descriptions. |
| `pnpm api:check-events` | Event descriptions, payload declarations and coverage of directly dispatched events with literal names. |
| `pnpm api:check-all` | All four checks above, stopping at the first failure. |
| `pnpm api:check` | All four checks plus source/API consistency, dependency metadata, generated documentation and accessibility report consistency. |

`pnpm examples:check-javascript-browser` parses all five language variants, checks the resulting JavaScript including its line breaks, and executes each reconstruction in Chromium, Firefox and WebKit. It compares inert author DOMs: component upgrades and nested scripts are intentionally not executed. Start the Vite documentation server first; `TP_EXAMPLES_URL` defaults to `http://127.0.0.1:4173`.

`pnpm test:browser:icon-buttons` measures icon and SVG centering and circular button geometry in every component’s introductory example, in light and dark modes, before and after opening its dropdowns and drawers. It also checks all seven button sizes, links, disabled and pressed states, and loading indicators. Run the Vite documentation server first (`TP_EXAMPLES_URL`, default `http://127.0.0.1:4173`). Use `TP_BROWSER=chromium`, `firefox` or `webkit` to restrict the browser, and `TP_COMPONENTS=tree,drawer` to restrict the components. The report is written to `/tmp/tp-icon-button-geometry.json`. Inline loading intentionally places the spinner beside the icon and is excluded from individual-icon centering checks.

The programmed DOM reconstruction and targeted imports are tested with `pnpm exec vitest run scripts/component-javascript-examples.test.ts`. Use `pnpm examples:sync-javascript` after changing an introduction.

Use `pnpm examples:sync-basic` to update only Basic usage in the five languages while retaining complementary examples.

`pnpm docs:api` runs the API, Basic usage and Javascript API checks automatically after generation (also during `pnpm dev` and `pnpm build`). After editing an introduction, run `pnpm api:sync-examples` and regenerate the API. The focused checker regressions run with `node --test scripts/typedoc-examples.test.mjs`. TypeDoc previews preserve the original HTML source instead of serializing it through a template.

These checks catch omissions and placeholders; reviewing behavior against the implementation remains necessary. Dynamically named events and inherited behavior require explicit documentation. The generator regression tests run with `pnpm exec vitest run scripts/component-api.test.ts`.

## Reviewing a change

Exercise observable behavior: public attributes and methods, rendering, emitted events, keyboard interaction, error handling, asynchronous updates and cleanup. Preserve assertions when fixing a failure; distinguish an obsolete expectation from a product regression before changing either.

For viewer and editor changes, check both the content and its containing panel after initial load, growth, shrinking, replacement and width changes. Run browser regressions because jsdom does not establish real layout behavior. Accessibility scans complement these checks; they do not establish screen-reader usability or every keyboard interaction.

Tests of generators must run writes in disposable copies and remove those copies afterward. An idempotence test compares the first generated result with a second generation and verifies that a subsequent check reports no changes. It must not rewrite the working checkout or race with tests that read its examples.

Changed TypeScript files, including tests, must pass `pnpm exec biome check <files>`. After changing examples or generators, also run `pnpm examples:check-structure`, `pnpm examples:check-native-markup`, `pnpm examples:check-descriptions` and `pnpm examples:check-labels`.

## Execution results and coverage

### Review of 11 November 2026

The first full Vitest pass ran **3,824 tests in 364 files**: 3,793 passed and 31 failed, with 19 additional asynchronous teardown errors. The initial script suite had 17 failures. These are initial diagnostic results, not a successful final validation.

The review updates regression tests for the current Component viewer Demo, Javascript API examples, five markup tabs, game headers and notebook export color scope. It also restores the Square root example's use of `tp-math` in all five markup formats and waits for asynchronous imports before disposing of test environments. Browser scenarios use a separate Vite server/cache to avoid stale optimized dependencies from the development server. The review also corrects contrast in chess/checkers coordinates, preformatted code in boxes and the Loto draw button, and preserves Demo attribute edits made before the preview finishes loading.

Validation distinguishes complete runs from targeted reruns; the counts below must not be added together. Machine-readable results are stored in `config/test-review-latest.json`.

| Suite or check | Result |
| --- | --- |
| Full Vitest rerun | **3,817 passed, 7 failed in 364 files**, plus one asynchronous teardown error. The AsciiDoc fixture was corrected after this run started. |
| Targeted unit verification | **182 tests in seven files** cover the failed cases, asynchronous teardown and the new preview-loading regression. The four failures remaining under concurrent load were checked again in an isolated **50-test run: all passed**. This is not a new clean full-suite run. |
| Node script tests | **110 passed, 1 failed**, no skips in the full run. After configuring the published LaTeX repository, the five CI workspace tests passed on a targeted rerun. |
| Functional browser tests | **45 passed**, no failures: 15 scenarios in each of Chromium, Firefox and WebKit. |
| Accessibility | **633 passed, 3 failed** across 636 scenarios: 630 component scans, three color-contract checks and three geometry keyboard checks. No scan errors. The corrected Loto scenario subsequently **passed in all three engines**. |
| TypeScript and changed-file Biome checks | Passed. |
| Example structure, native markup, descriptions and labels | Passed: 210 example sets, 2,022 native examples and 674 descriptions. |

The isolated 50-test rerun retains the assertions and time limits of the preceding run. Run expensive DOM suites separately from browser audits to avoid resource contention. The full accessibility report preserves its original findings; the Loto rerun does not overwrite that report. Automated scans also contain 490 incomplete checks that require review; they are not equivalent to passed checks.

The missing `chess.js` entry was restored in the frozen CI lockfile. The CI workspace now includes `tp-latex` at revision `d6e8f598d4ca78153f5946765ef98ac20c96623e`, with a dedicated read-only deploy key. The frozen installation and all five dependency builds passed in an isolated workspace under Node.js 24.22.2; the five CI configuration tests also passed. The browser audit also reports accessibility violations inside the external YouTube player used by the video-player example; these third-party findings remain visible in the results and cannot be fixed in the component’s own markup. Coverage and Lighthouse measurements below are historical and are not refreshed by ordinary test execution.


### Review of 29 October 2026

The review inventories 319 Vitest files, including the local server suite, plus the separate Node and Playwright suites. No test is intentionally skipped or marked todo. The initial Vitest run reported 3,420 passed and 26 failed tests; the initial script run reported 84 passed and eight failed tests.

Final validation:

| Suite or check | Result |
| --- | --- |
| Full Vitest suite | **3447 passed**, 0 failed, 0 skipped; 319 files. |
| Node script tests | **93 passed**, 0 failed, 0 skipped. |
| Functional browser tests | **21 passed**: seven scenarios in each of three engines. |
| Accessibility | **555 component scans** and **three color-contract tests** passed. The **three geometry keyboard tests** passed on their targeted rerun after correction. |
| TypeScript and changed-file Biome checks | Passed. |
| Example structure, native markup, descriptions and labels | Passed: 1,575 examples and 525 descriptions in 185 component pages. |

Vitest completed at 2026-10-29T10:01:47.796Z. Machine-readable totals for that review are stored in `config/test-review-2026-10-29.json`; current Vitest results are also recorded in `config/component-quality-latest-run.json`. Browser failures caused by the former combined sizing scenario were corrected by giving each language an independent scenario. A traced Firefox run also exceeded the local-file scenario's deadline; the final full browser run passed without tracing.

Coverage and Lighthouse were recalculated in the follow-ups below.

Corrections cover:

- source ownership in editor questions: a programming source must be loaded by its editor, without also being fetched as a question-definition document;
- keyboard focus in the geometry tool strip: activating a tool keeps the button focused so navigation can continue; tool shortcuts and palette actions can focus the drawing;
- test expectations for lazy question opening, inherited mode, timed-solution unlocking, current documentation examples and editor controls;
- asynchronous icon rendering and scoped chart/slide selectors that exclude unrelated toolbar controls;
- explicit layout fixtures for jsdom's unsupported CSS calculations during asynchronous editor measurements, while retaining real browser sizing checks;
- documentation parsing that distinguishes a complete custom-element name from a longer name with the same prefix, and public custom elements from abstract implementation classes;
- isolated generator tests, curated resource choices and specialized attribute controls;
- CI dependency metadata and independent browser sizing scenarios for each markup language.

The browser matrix scanned 185 component examples in each of Chromium, Firefox and WebKit: 555 scans, no reported violations and no scan errors. Axe also returned 407 incomplete checks (133 / 137 / 137); these need human assessment and are not successful manual accessibility reviews. The color-contract scenarios passed in all three engines. The geometry keyboard scenario initially failed in each engine and passed in all three after the focus correction.

The [component-quality appendix](component-quality/index.md) records the current global coverage, separate historical family measurements and advisory targets. Its family counts overlap the complete Vitest suite; do not add them to the global total. A passing execution does not refresh coverage, and a coverage percentage is not a test pass rate. Keep the execution date and scope attached to every result.

The [accessibility appendix](accessibility/index.md) records browser scan results separately. Lighthouse is a separate audit (`pnpm test:lighthouse`), not part of the assertions in `pnpm test:all`.

### Coverage refresh of 29 October 2026

The complete instrumented suite passed: **3447 tests in 319 files**, with no failures, skipped tests or unhandled errors. Completed at 2026-10-29T10:15:55.510Z using V8. The measurement includes production TypeScript under `src/components/` and excludes test files; utilities outside that directory and the server are outside this coverage denominator even though their tests run.

| Metric | Previous measurement (20 September) | Current measurement | Covered / total |
| --- | ---: | ---: | ---: |
| Lines | 93.46% | **94.05%** | 33945 / 36091 |
| Statements | 92.05% | **92.4%** | 36381 / 39372 |
| Functions | 95.54% | **95.45%** | 6717 / 7037 |
| Branches | 80.84% | **81.93%** | 20571 / 25108 |

The source tree has changed since September, so percentages compare different code totals. The machine-readable summary is `config/global-quality-coverage/coverage-summary.json`; the HTML report is available locally in `coverage/review-2026-10-29/index.html`. Family reports retain their separately dated measurements and were not rerun as isolated families.

### Lighthouse refresh of 29 October 2026

The three configured pages were audited successfully with Lighthouse 12.6.1, using one local measurement per page. Latest measurement: 2026-10-29T10:21:51.671Z. Scores and remaining findings are recorded in the [Lighthouse appendix](lighthouse/index.md); machine-readable scores are in `config/lighthouse-latest-run.json`.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| single-page-accessibility.html | 52 | 100 | 100 | 100 |
| single-page-code-editor.html | 18 | 94 | 82 | 100 |
| single-page-markup-multi-pages.html | 25 | 100 | 82 | 100 |

The audits completed, but advisory thresholds remain unmet for performance on all three pages, accessibility on Code editor, and best practices on Code editor and Markup multi-pages. Scores are laboratory measurements, not test pass rates. Full HTML and JSON evidence is retained locally in `.lighthouseci/reports/`. If the default port is occupied, run `TP_LIGHTHOUSE_PORT=4175 pnpm lighthouse` to use another local port.

### On-demand loading and accessibility follow-up

The single-page renderer now imports its selected markup engine on demand. AsciiDoc and reStructuredText inclusions and markup viewers wait until their enclosing tab is initialized and visible before fetching and converting their sources. Deferred work is cancelled on disconnection; reopening uses the current source.

Tab labels containing inline code inherit the tab foreground. Viewer toolbar buttons no longer shrink into overlapping touch targets; controls wrap on narrow screens. WebKit visibility is refreshed when the viewer finishes rendering.

Validation: **84 focused Vitest tests**, **six browser loading/accessibility tests**, and **12 browser sizing scenarios** passed across Chromium, Firefox and WebKit (WebKit sizing and the final reStructuredText checks were validated by targeted reruns). TypeScript and changed-file Biome checks passed. Coverage was not recalculated after these production changes; the earlier coverage section remains a dated measurement.

Lighthouse was rerun with **three measurements per page**. The [current Lighthouse report](lighthouse/index.md) uses its representative runs. No Python runtime or Docutils/Pygments download was observed during initial loading on any of the three audited pages. The browser tests separately verify that reStructuredText still loads and renders when selected.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| single-page-accessibility.html | 65 | 100 | 100 | 100 |
| single-page-code-editor.html | 37 | 100 | 100 | 100 |
| single-page-markup-multi-pages.html | 35 | 100 | 100 | 100 |

These results follow the earlier single-measurement baseline; performance differences are indicative because the number of measurements and local load differ. Remaining performance findings require separate work on initial rendering, repeated viewer updates and layout stability.

### Viewer rendering performance follow-up

Iframe height measurement now walks the rendered tree once, carrying clipping bounds into descendants instead of repeatedly reading their ancestors. Hidden branches, closed details and out-of-flow overlays retain their sizing rules. Custom-element upgrades share one scheduled height update per animation frame; duplicate subscriptions and stale callbacks from replaced previews are ignored. The former immediate/microtask/timer measurement bursts have been removed.

Validation: **65 focused viewer tests** passed, including regressions for deeply nested previews and coalesced/stale upgrade callbacks. **18 browser scenarios** passed in Chromium, Firefox and WebKit: six loading/accessibility scenarios and twelve native iframe/panel sizing scenarios covering initial rendering, asynchronous growth, shrinking, replacement, editor changes and width changes. TypeScript and changed-file Biome checks passed. Coverage was not recalculated.

A local Chromium CPU profile of the Markup multi-pages fixture (412 × 823 viewport, navigation followed by a 15-second observation) attributed about 3,698 ms of self time to the markup-viewer bundle before the change and 13 ms afterwards. This single diagnostic comparison is separate from Lighthouse mobile simulation and is not a guaranteed timing.

Lighthouse was recalculated with **three measurements per page**, completed at 2026-10-29T11:46:04.997Z. No initial Python runtime download was observed in any of the nine audits. The table uses Lighthouse CI representative runs, compared with the preceding three-run baseline.

| Page | Previous performance | Current performance | Previous blocking time | Current blocking time | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| single-page-accessibility.html | 65 | 65 | 19 ms | 12 ms | 100 | 100 | 100 |
| single-page-code-editor.html | 37 | 56 | 756 ms | 226 ms | 100 | 100 | 100 |
| single-page-markup-multi-pages.html | 35 | 64 | 6202 ms | 207 ms | 100 | 100 | 100 |

See the [current Lighthouse report](lighthouse/index.md) for remaining findings. Initial content rendering and layout stability remain separate optimisation opportunities; performance scores vary with local measurement conditions.

### Initial display and layout stability follow-up

Single-page documents no longer load optional toolbar controls when the toolbar is absent. Toolbar module loading is shared, and removing or replacing the toolbar while the module loads invalidates the pending request without replacing the document. Markdown prepares the table of contents, icons, code editors and iframe components present in its parsed content before insertion, so their upgrades do not subsequently reflow surrounding text. Optional viewers and language runtimes remain deferred. Icons reserve their authored size before their SVG resolves; catalog icons retain intrinsic sizing.

Validation: **350 targeted unit tests** passed, with the 63-test Markdown integration file rerun after correcting an outdated expectation that AsciiDoc loads before its enclosing tabs are initialized. **24 browser scenarios** passed in Chromium, Firefox and WebKit, including cancelled/restarted toolbar loading, delayed SVG geometry, markup-engine switching, accessibility checks and dynamic iframe/panel sizing. TypeScript and changed-file Biome checks passed. Coverage was not recalculated.

The following comparison uses representative runs from **three Lighthouse measurements per page** before and after the change. Latest measurement: 2026-10-29T11:57:39.291Z. All nine final audits completed without an initial Python runtime download. FCP measures first content, LCP the largest visible content, and CLS unexpected layout shifts.

| Page | Performance before → after | FCP before → after | LCP before → after | CLS before → after |
| --- | ---: | ---: | ---: | ---: |
| single-page-accessibility.html | 65 → 78 | 3.02 s → 2.87 s | 5.14 s → 4.68 s | 0.210 → 0.000 |
| single-page-code-editor.html | 56 → 64 | 3.20 s → 3.69 s | 5.65 s → 6.48 s | 0.254 → 0.000 |
| single-page-markup-multi-pages.html | 64 → 72 | 3.27 s → 2.86 s | 5.93 s → 5.04 s | 0.122 → 0.000 |

Preparing geometry can defer the first paint of a document containing a code editor; the benefit is that readers receive its settled layout rather than text that later moves. Timings remain local laboratory measurements. See the [current Lighthouse report](lighthouse/index.md) for category scores and remaining findings.

### Example-loading trace before deferral

A diagnostic trace was recorded on 2026-10-29T12:06:13.442Z against the production build, using Chromium with a 412 × 823 viewport and a fresh browser context for each page. Each visit covers initial loading, scrolling to the HTML examples, opening Show code, then selecting AsciiDoc. Each phase waits for a one-second quiet period in the observed network stream, bounded to 20 seconds. All eight phase snapshots reached network quiet with no unfinished requests. This is a loading trace without CPU/network throttling, not a new Lighthouse measurement.

| Page | Initial requests | Initial transfer | HTML example position | New requests on scroll | New requests on Show code |
| --- | ---: | ---: | ---: | ---: | ---: |
| code-editor | 114 | 1.42 MB | 6,836 px from document top | 0 | 0 |
| markup-multi-pages | 247 | 1.61 MB | 6,269 px from document top | 0 | 0 |

Both HTML viewers and their preview iframes are already rendered while far below the viewport. The introductory Code editor is visible and legitimately needs CodeMirror. The Markup multi-pages introduction is also visible and should remain eager, but its second, off-screen example is already running a separate preview of the same documentation application.

The request initiators and source inspection identify these eager dependency chains:

- **AsciiDoc:** `tp-loader` discovers the hidden `tp-asciidoc` element and imports its definition. That definition statically imports the parser, transferring **736,763 bytes** for `chunks/asciidoc.js` on each fresh visit. The existing visibility gate delays fetching `examples.adoc` and rendering it; it does not delay the parser module import. The source file is fetched only in the AsciiDoc-selection phase.
- **Editors:** the hidden Markdown viewer definition imports the shared markup-viewer module, which statically imports the code editor. On Markup multi-pages, **137,556 bytes** for `chunks/code-editor.js` and **93,367 bytes** for its shared CodeMirror bundle arrive before any source editor is displayed. The viewer also constructs a detached editor before Show code is opened. Code editor's introductory editor already requires these modules, so delaying its source panel alone cannot eliminate their initial download on that page.
- **Included examples:** the HTML example file and included Markdown examples are fetched before scrolling. A viewport gate must cover this inclusion stage as well as preview creation if it is to defer both download and rendering.

The next implementation should separate parser imports from component registration, defer off-screen example inclusion/rendering until near the viewport, and import/create source editors when required. Preserve visible introductory examples and stable layout geometry. These byte counts identify candidates for deferral; they are not additive guaranteed savings. Requests include cache revalidation and repeated loads in distinct iframe contexts. The trace records one cancelled introductory iframe navigation during replacement; it does not indicate an HTTP failure.

Reproduce with a separately running production preview:

```sh
node scripts/trace-example-loading.mjs http://127.0.0.1:4176 config/example-loading-latest.json
```

The machine-readable trace contains request URLs, frame identities, initiator stacks, transfer sizes, cache status and DOM/viewport snapshots. Runtime loading behavior, Lighthouse scores and coverage were not changed by this diagnostic task.


### Deferred engines, editors and off-screen examples

The production trace after deferral confirms that work now follows user navigation:

| Page | Initial requests before → after | Initial transfer before → after | Requests on scroll | Requests on Show code |
| --- | ---: | ---: | ---: | ---: |
| Code editor | 114 → 74 | 1,419,113 → 656,342 bytes (−54%) | 38 | 0 |
| Markup multi-pages | 247 → 146 | 1,609,328 → 600,533 bytes (−63%) | 89 | 12 |

AsciiDoc's parser is dynamically imported when rendering is requested. The component can register inside a hidden tab without loading the engine. The internal `createTpAsciidocParser()` helper now returns a promise; callers await the parser. Python remains deferred until reStructuredText is actually rendered.

A viewer keeps the current source as text and imports/creates its source editor only when Show code is opened. Generated HTML modes also import their editor on demand. Reading, testing and resetting the source still work before an editor exists. The visible Code editor introduction legitimately loads CodeMirror immediately, explaining why Show code adds no network requests on that page. On Markup multi-pages, Show code transfers 237,059 bytes; selecting AsciiDoc transfers approximately 755 kB. These costs are postponed, not removed for visitors who use these features.

HTML inclusions and markup previews wait until within 600 px of the viewport, and hidden tabs wait until selected. Observations are disconnected on removal and stale callbacks are ignored. Once a component has approached the viewport, subsequent edits stay immediate. Visible introductions retain their normal loading. No fixed minimum iframe or editor heights were added.

Markdown inclusion remains eager by default to preserve document-wide headings and recursive composition. Use `::include{examples/examples.md loading=lazy}` for an independent deferred fragment; the Code editor and Markup multi-pages documentation pages use this option. Lazy fragments retain their source URL and inclusion-depth limit. Their headings are rendered within the fragment, so this option is intended for examples rather than sections needed by the parent table of contents.

Validation covers deferred network requests and editors, hidden language tabs, disposal of stale observations, nested hidden panels, recursive include limits, and iframe/panel growth, shrinkage, replacement and width changes. Validation passes **284 focused unit tests**, **4 example-tab script tests**, and **27 browser scenarios across Chromium, Firefox and WebKit**. TypeScript, Biome and the native-markup check (1,575 examples, no rewrites) also pass. The loading trace uses the same production method as the earlier baseline and is saved with the previous phase totals in `config/example-loading-latest.json`. Coverage has not been recalculated for this change.


Lighthouse was rerun with three mobile audits per page (Lighthouse 12.6.1; representative runs on 2026-10-29T13:47–13:49Z):

| Page | Performance before → after | Blocking time before → after | LCP before → after | CLS |
| --- | ---: | ---: | ---: | ---: |
| Accessibility | 78 → 77 | 13.5 → 12.5 ms | 4.68 → 4.81 s | 0 |
| Code editor | 64 → 66 | 257.5 → 65 ms | 6.48 → 7.36 s | 0 |
| Markup multi-pages | 72 → 76 | 214 → 32 ms | 5.04 → 5.10 s | 0 |

Accessibility, Best Practices and SEO remain **100** on all three pages. Deferred work substantially reduces transferred bytes and main-thread blocking, but does not establish an improvement in first paint or LCP: Code editor FCP increased from 3.69 to 4.13 seconds in this run. The visible introductory editor and the initial rendering path remain candidates for a separate optimization. These measurements do not claim that the Lighthouse score increases in proportion to the bytes saved. See the Lighthouse appendix for the complete current reports.


### First paint before interactive component initialization

Markdown documents now publish simple inline code editors as readable source previews while CodeMirror is loading. The preview uses the actual normalized source, the editor's line spacing, padding and border, and its two-line minimum content convention. The interactive editor replaces this temporary preview without including it in the captured author source. Its subsequent height remains content-driven. Empty toolbar containers no longer retain CodeMirror's border and spacing; search panels and source errors remain visible when needed.

Icon dimensions are established with the icon stylesheet and declared size before the icon module completes. The loader imports a lightweight base-style entry instead of the full base component, and starts the Markdown renderer alongside a single-page shell when its source URL explicitly ends in `.md`. Other markup engines remain deferred.

The progressive editor path currently covers inline script sources without a toolbar, external source or word wrapping. More complex editors retain the previous awaited initialization path because their geometry cannot be inferred faithfully from that source alone. The table of contents and iframe definitions are also still prepared before insertion to preserve the surrounding layout. No fixed editor or iframe height has been introduced.

Validation: **264 distinct focused unit tests** pass, including editor-source preservation, base styles and document rendering. The **30 browser scenarios** cover the three engines, delayed editor delivery with text already visible and unchanged following-text position, icon delivery, hidden examples and dynamic iframe/editor sizing. One Firefox scenario was interrupted while development modules were being updated; its isolated rerun on the final code passes. TypeScript and Biome checks pass. Coverage has not been regenerated.


The production Lighthouse rerun contains three mobile measurements per page (12.6.1; representative runs at 2026-10-29T14:02–14:03Z):

| Page | Performance before → after | First contentful paint before → after | Largest contentful paint before → after | Blocking time before → after | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accessibility | 77 → 80 | 2.86 → 2.64 s | 4.81 → 4.60 s | 12.5 → 18 ms | 0 |
| Code editor | 66 → 69 | 4.13 → 3.56 s | 7.36 → 6.47 s | 65 → 96 ms | 0 |
| Markup multi-pages | 76 → 77 | 2.96 → 2.82 s | 5.10 → 4.89 s | 32 → 55 ms | 0 |

Accessibility, Best Practices and SEO remain **100** on all pages. The change improves initial display in these measurements while preserving layout stability; it does not reduce every metric. Main-thread blocking increases modestly as initialization overlaps earlier, and the initial Markdown rendering path still limits the result. The previous measurement is preserved in `config/lighthouse-latest-run.json` under `progressiveFirstPaintBaseline`. The earlier example-loading trace remains dated and has not been rerun for this change.

### Reaching 80 in the two remaining performance examples

The production loader now emits module-preload hints from the actual bundle graph for document renderers and the layout components present in parsed content. Only static dependencies are followed; optional engines and editors remain dynamic imports. Source maps are preserved when the build embeds this manifest. Copy-button initialization no longer delays installation of the base styles. Simple inline editor previews receive a paint opportunity before CodeMirror starts loading.

CodeMirror downloads the selected standard language support on demand and shares concurrent requests. A compartment installs the arriving grammar without resetting the document, cursor selection or undo history; obsolete responses after a language switch or disconnection are ignored. Toolbar controls stay in their existing parents instead of repeatedly reconnecting. Dropdowns skip unchanged attribute assignments and resolve their anchor again when opened, including anchors inserted after the closed menu.

Component icons load individually instead of downloading the complete collection. Unloaded built-in icon libraries wait until their icon approaches the viewport; authored dimensions are established before the SVG arrives. The full collection remains available to icon pickers. Disconnected icons cancel their pending rendering and visibility observation.

Validation: **408 focused unit tests**, **2 build-plugin tests** and **36 browser scenarios** pass. Chromium, Firefox and WebKit cover delayed imports, offscreen icon delivery, language changes, editing, toolbar behavior and dynamic editor/iframe/panel sizing through growth, shrinking, replacement and width changes. TypeScript and Biome checks pass. Global coverage has not been regenerated.

The final production Lighthouse run contains **three mobile measurements per page**, with default audit settings unchanged (Lighthouse 12.6.1; 29 October 2026, 15:42–15:43 Europe/Paris, UTC+1). Raw timestamps remain UTC in the technical data. The table uses Lighthouse CI's representative runs and also lists every performance score:

| Page | Performance before → after | Three performance scores | FCP before → after | LCP before → after | Transfer before → after |
| --- | ---: | --- | ---: | ---: | ---: |
| Accessibility | 80 → 85 | 84, 85, 85 | 2.64 → 2.30 s | 4.60 → 3.96 s | 299.1 → 300.2 kB |
| Code editor | 69 → 80 | 80, 77, 80 | 3.56 → 2.64 s | 6.47 → 4.60 s | 658.5 → 535.5 kB |
| Markup multi-pages | 77 → 83 | 83, 82, 83 | 2.82 → 2.44 s | 4.89 → 4.13 s | 603.8 → 437.4 kB |

**CLS remains 0, and Accessibility, Best Practices and SEO remain 100 in all nine audits.** The representative scores reach the requested 80 threshold for both target pages. Code editor remains close to the threshold: one run scored 77, so these results do not guarantee 80 on every execution or device. Its remaining initial work includes the Markdown renderer and the visible CodeMirror editor. The previous official measurement is retained under `performance80Baseline` in `config/lighthouse-latest-run.json`; the earlier example-loading trace remains separately dated. See the [Lighthouse appendix](lighthouse/index.md) for the regenerated report.

### LaTeX package conversions

The focused conversion fixtures cover `tabularray`, `booktabs`, `enumitem`, `amsthm`/`cleveref`, `siunitx`, `graphicx` and `listings`, including external listing files. Each fixture is rendered with TP LaTeX, converted, and rendered again with the target parser. Checks compare formulas, anchors and links, list markers, table structure and column widths, image transformations, code contents and line-number settings.

Run the automated conversion and converter tests with:

```sh
pnpm exec vitest run src/utilities/markup-latex-packages.test.ts src/utilities/converter-title.test.ts src/components/markup-converter/markup-converter.test.ts
```

For the complete browser matrix, start the development server, open `/scripts/fixtures/latex-package-conversions.html` and select **Run all conversions**. This also exercises the real Docutils runtime for reStructuredText. Each result includes the generated source and rendered output for inspection.

Validation on 2026-11-16: **44 focused unit tests**, **12 native-markup regression tests**, and **28 browser conversions** pass (seven fixtures into HTML, Markdown, AsciiDoc and reStructuredText). TypeScript compilation, Biome checks and the production build pass. This checks the supported package subsets and these fixtures; it does not imply support for arbitrary LaTeX packages or identical typography across renderers.


#### Conversion into TP LaTeX

The same browser fixture also provides **Run reverse conversions**. It converts each package example through HTML, Markdown, AsciiDoc or reStructuredText and renders the resulting TP LaTeX. Four additional documents are authored directly in the source languages and exercise headings, anchors, formatting, numbered lists, tables, formulas, code and images independently of the LaTeX fixtures.

The reverse checks cover column widths and cell alignment, booktabs horizontal and partial rules, graphicx image transformations and alternative text, links and anchors, list numbering, and listings code content and language. Native LaTeX commands are preferred; custom-element commands retain HTML attributes and structures that the native conversion does not represent.

Validation on 2026-11-16: **32 reverse browser conversions** and the **28 forward browser conversions** pass. The focused conversion, converter and rich-table export suites contain **106 passing tests**, with **12 additional native-markup regression tests** passing. TypeScript and Biome checks pass. Generated LaTeX preserves the tested content and supported presentation; it does not reconstruct the original package declarations or macro definitions from rendered HTML.


#### Cross-conversions between HTML, Markdown, AsciiDoc and reStructuredText

Open `/scripts/fixtures/markup-conversion-matrix.html` on the development server and select **Run conversions**. The matrix exercises all **12 directed conversions** between the four languages, with four scenarios per direction:

- Independently authored native documents: headings, anchors, links, numbered lists, tables, inline formulas, code and images.
- Rich media: formatted text, inline code, quotations, images, audio, video with multiple sources and subtitle tracks.
- Table layout: caption, column widths, merged cells, horizontal and vertical alignment, rich cell content.
- Math and code: inline LaTeX and AsciiMath, display math, Python syntax metadata and indentation.

Each converted source is parsed by the target renderer. Checks compare structural elements, references, formatting, numbering, image dimensions, media attributes, table spans and alignment, formulas, code text and language. The browser suite uses the real Docutils runtime. Expand a result to inspect its generated source and rendered output.

The automated subset uses the HTML, Markdown and AsciiDoc parsers:

```sh
pnpm exec vitest run src/utilities/markup-matrix.test.ts
```

Validation on 2026-11-16: **48 of 48 browser scenarios** pass, including both directions for every pair of languages. These are focused content and structure checks; they do not assert pixel-identical typography or support for every feature of each language.

#### Native table width conversions

Open `/scripts/fixtures/converter-width-audit.html` and choose **Check width conversions**. Four combinations (fixed lengths, fixed plus automatic, fixed plus weighted shares, and percentage plus rem plus flexible) pass through all five languages as both source and destination. The matrix checks native syntax, retained dimensions, cell content and measured column widths at 800px and 400px. A separate assertion requires the weighted columns to keep a 2:1 ratio and actually shrink. Columns are recalculated after replacement and container resizing.

Focused validation: **127 conversion/table tests** and **16 LaTeX tests** pass. The browser matrix reports **100/100 width conversions**. These checks cover the declared width syntax and the tested layouts; normal HTML minimum-content and table-width constraints still apply.

#### Native RST cell alignment

The fixture `/scripts/fixtures/converter-rst-alignment-audit.html` verifies all nine horizontal/vertical combinations through HTML, Markdown, AsciiDoc and LaTeX and back to native RST. Additional checks cover merged cells, retained widths, rich text line breaks and invalid, duplicate or covered coordinates. **42 browser checks** pass. The focused converter/table suites pass **131 tests**. The native-syntax policy now rejects table fallbacks for the alignment comparison examples.

#### Markup converter presentation

The [native syntax audit](../components/markup-converter/native-syntax-audit.md) covers all **23 examples and 92 conversions** separately from presentation checks. `markup-documentation-native.test.ts` reads the actual documentation sources; `markup-native-policy.js` records the reviewed exceptions. The browser audit includes both reStructuredText source examples and rejects additional HTML-element fallbacks. Its detailed report includes the 115 source views. Validation: **145 conversion/table tests**, **49 LaTeX tests** and **12 serializer tests** pass, together with **46/46** browser presentation comparisons and the native-syntax policy.

The native-syntax follow-up adds headerless Markdown tables, cell-specific Markdown alignment, native AsciiDoc spans/alignment and relative column widths, RST alias targets, and native numbered listings in AsciiDoc/RST/LaTeX. **109 focused conversion/table tests** and **31 AsciiDoc parser tests** pass. The browser fixture additionally checks RST alias destinations and numbered-code round trips through AsciiDoc and LaTeX, including literal text and a starting line number of 20.

Open `/scripts/fixtures/converter-style-audit.html` on the development server and select **Check all documentation examples**. The audit reads the current converter examples, including the source used by the JavaScript example, and renders each through HTML, TP AsciiDoc, TP LaTeX, TP Markdown and TP reStructuredText.

For each example it compares computed styles in both light and dark themes: heading levels, fonts, heights and spacing; table horizontal positions and widths, cell padding, heading backgrounds and alignment; code backgrounds, foregrounds and borders. Explicit local themes remain part of the source. Expand **Computed styles** to inspect the measurements. The report groups the five language outputs into one comparison per example and theme: **23 examples, 230 rendered states, 46 comparisons**.

Native-output regression tests read the actual introductory documentation source and require native AsciiDoc tables and reStructuredText `list-table`, including caption anchors. Captioned LaTeX exports must not introduce `\centering`; the parser produces a semantic table and caption, while an explicit centering declaration supplies a class for the host stylesheet. The focused conversion/table suites pass **118 tests**, and the LaTeX table suites pass **10 tests**. The visual comparison, including horizontal positions, passes **46/46**.

The shared defaults come from `tp-base`. Read-only code listings without their own toolbar inherit the surrounding theme, while explicit code themes remain unchanged. Markdown does not inject fallback table styles. Conversion tests also cover heading levels, reference anchors, table dimensions and literal code inside table cells.

Validation on 2026-11-16: **46/46 presentation comparisons pass**, covering all **230 rendered states**. The focused component/conversion suites pass **132 tests**, with **13 Markdown**, **12 AsciiDoc** and **9 LaTeX** tests passing separately. TypeScript, Biome and production builds pass. These checks cover the listed computed styles and documentation examples, rather than arbitrary documents or every possible CSS property.


The theorem fixture also covers `babel` with English text, an `amsthm` definition sharing the theorem counter, forward `cleveref` references and a proof. Regression checks preserve complete sentences and spaces, Definition 1.1 / Theorem 1.2, all formulas and links, and prevent prose becoming inline code. Heading content remains inline rather than acquiring an invalid nested paragraph. Browser validation compares the actual five component renderers, including upright definition text, italic theorem text, normal theorem headings and the proof-ending symbol.

#### Native table cell borders

`src/utilities/markup-borders.test.ts` covers native Markdown/AsciiDoc round trips, generated RST, merged cells, explicit widths, workbook border exports, invalid declarations and nested tables. Together with the four existing converter/table suites, **139 focused tests** pass.

The browser fixture `/scripts/fixtures/converter-border-audit.html` adds **27 checks**: all nine Markdown/AsciiDoc/RST directed conversions in light and dark themes, three unmerged-table cases and six invalid RST option cases. It compares the computed width, style and color of every cell edge. The documentation native-syntax policy no longer allows table fallbacks for the LaTeX partial-rule example.

#### Native headings, figures and numbered code

`src/utilities/markup-structure.test.ts` verifies heading aliases, RST level directives, image captions, captionless figures, numbered fences and literal code whitespace. The focused converter/table suites pass **157 tests** across seven files.

`/scripts/fixtures/converter-structure-audit.html` runs **64 browser checks** across Markdown, AsciiDoc, RST and LaTeX in both directions, using HTML references. It checks heading levels, every alias target, figure captions and image dimensions, and exact numbered-code content and starting numbers. The documentation policy rejects the former heading, alias-span and Markdown figure fallbacks.

### Native list and image conversions

`src/utilities/markup-presentation.test.ts` checks custom markers, nested lists, continuation, explicit spacing, image dimensions and transformations through Markdown and AsciiDoc and back to LaTeX. It also checks invalid options and unchanged ordinary lists. `/scripts/fixtures/converter-presentation-audit.html` runs 48 directed conversions with the real RST engine. The documentation syntax policy now rejects list/image element fallbacks for the enumitem and graphicx comparison examples.

`markup-presentation-next.test.ts` and `/scripts/fixtures/converter-presentation-next-audit.html` cover per-item marker overrides, inline RST images, image origins, transformed images inside native tables, and local listing themes with and without line numbers. The browser matrix checks 96 directed conversions and rejects standard-element fallbacks for these cases.

### Native media, RST literal code and heading levels

`markup-media-rst.test.ts` checks simple and advanced audio/video through Markdown, AsciiDoc and LaTeX in both directions. `/scripts/fixtures/converter-media-rst-audit.html` adds the real RST engine: 56 directed checks cover media attributes, source order, subtitle languages/defaults, literal whitespace, line numbering, local themes and noncontiguous heading levels. The rich-cell export test also checks native media within tables. These checks accompany the existing documentation-wide native-syntax policy and light/dark presentation audit.

### Component viewer button icons

`pnpm docs:check-button-icons` audits all 212 component interaction pages against statically declared icon buttons and their state icons. It reads executable TypeScript rather than JSDoc examples. Multi-page controls use the complete shared document catalog tested by `help-presentation.test.ts`. Dynamic author-supplied icons (icon-button, language flags and picker tiles) are described explicitly rather than replaced with an unrelated fixed symbol.

The Component viewer tests check that Buttons contains declared icon/text commands, excludes gestures and reading instructions, preserves icon libraries, and stays independent of the current Demo. Hidden optional toolbars remain documented; internal commands of functional subcomponents belong to their own help. Text-only buttons carry an explicit button marker in interactions.md. The source audit detects missing static icons; it does not prove every dynamically constructed menu or runtime configuration reachable.

Latest button-doc verification: 212 interaction pages audited, 204 statically declared icon/state occurrences covered, 35 Component viewer/help tests and 3 documentation tests passing. The browser fixture `/scripts/fixtures/component-buttons-audit.html` checks prose-editor, spreadsheet-editor, calculator, theme, word-cloud and latex-multi-pages, including language icon libraries, secondary tools, text-only keys and the absence of invented commands.

## TypeDoc during development

`pnpm dev` reuses the generated API documentation when source files and generation inputs are unchanged. The first run generates TypeDoc; subsequent runs compare file contents, including source files, configuration, TypeDoc plugins and assets, dependency versions and the generated API output. Missing or modified output triggers regeneration. Failed generation does not populate the local cache.

Documentation links and introductory-example checks still run at every startup. Use `pnpm docs:api` to force regeneration; `pnpm build` also regenerates the API. The disposable cache is stored in `node_modules/.cache/tp-components`.

## Documentation cover inventory

`pnpm build` automatically refreshes the cover badges and update date before building the site. This step collects the test inventory without executing test cases. `pnpm dev` keeps the existing badges to avoid delaying startup with the full test inventory; refresh them explicitly when needed.

Run `pnpm docs:sync-cover` after adding or removing a component, documented example or test. It updates the badges at the bottom of `cover.md` and the date in `yyyy/mm/dd` format using the Europe/Paris time zone.

The component count covers documented components with API metadata. Examples are counted once from their canonical HTML definitions, regardless of the number of markup-language variants. The test count comes from `vitest list` with the normal project configuration: it is a collected-test inventory, not a successful-execution result. This command does not run test cases or collect coverage.

`pnpm docs:check-cover` verifies the inventory without rewriting the cover or requiring a new date every day.

### Markup pivot provenance

The focused `src/utilities/markup-pivot.test.ts` tests distinguish parser-generated decoration from explicitly authored HTML and classes, including literal scripts and comments. Conversion regression tests cover formulas, tables, lists and numbered code blocks.

With the development server running, `node scripts/check-markup-pivot-browser.mjs` checks the real Pyodide/Docutils renderer: generated code/link classes, explicit native classes and raw HTML. Set `TP_EXAMPLES_URL` to use a server other than `http://127.0.0.1:4173`.


## SWI-Prolog WASM and PlUnit

The five Prolog components share SWI-Prolog WASM. Their focused unit suite is:

```sh
pnpm exec vitest run src/components/prolog-playground src/components/prolog-viewer src/components/prolog-notebook src/components/prolog-playground-question src/components/prolog-viewer-question
```

With the documentation server running, run `node scripts/check-swipl-browser.mjs` and `node scripts/check-swipl-components-browser.mjs`. Set `TP_EXAMPLES_URL` for a server other than `http://127.0.0.1:4173`, and `BROWSER=chromium`, `firefox` or `webkit` to select the browser. By default the tests load the pinned official distribution from the CDN; `SWIPL_DIST` optionally points to a local copy of that distribution for repeatable offline runtime loading.

The runtime checks cover the seven example projects, native modules, CLP(FD), CLP(Q), CLP(R), residual constraints, DOM updates and event handlers, output and exceptions. PlUnit fixtures check successful tests, expected failure, expected exceptions and a deliberately failing suite; legacy TP test directives remain covered. Component checks exercise viewers and playgrounds, iframe growth and shrinkage, both question components, notebook cells and exported HTML notebooks. The notebook fixture loads the documented “Constraints and PlUnit” example itself, checks both integer-pair solutions and all three named PlUnit results, then repeats these checks in the exported HTML.

These checks passed in Chromium, Firefox and WebKit. The CDN path was also exercised in Chromium. PlUnit's deliberately failing fixture prints failure diagnostics as part of the test; the browser script verifies that this result is correctly reported.


### Prolog interpreter

`node scripts/check-prolog-browser.mjs` exercises the `tp-prolog` prompt with the real SWI-Prolog runtime: successive solutions, persistent facts, query history, clear/reset, constraints, error recovery, the inference limit, narrow layouts and independent sessions. Use `TP_EXAMPLES_URL`, `BROWSER` and optionally `SWIPL_DIST` as described above. The unit tests in `src/components/prolog` also cover lazy loading, initial-source precedence and closing query state.


### Component viewer button legends

`node scripts/check-help-buttons-presentation.mjs` checks the rendered Buttons panel in Firefox; use `BROWSER=safari` for native SafariDriver. `BASE_URL` selects the built documentation server (default `http://127.0.0.1:4409`), and `SAFARI_DRIVER_URL` selects SafariDriver (default port 4445).

On 2026/11/25, Firefox 153.0 and Safari 26.6.2 passed the light and dark checks for Prolog tracer (13 commands), Diff code editor (13 commands) and Code editor (5 commands). The checks require a visible legend, nonempty descriptions, loaded SVG icons and nonzero icon dimensions, including rows initially outside the viewport. Reports are stored in `config/help-buttons-verification/`. Screenshots were also inspected for Prolog tracer in Safari dark mode. This is a focused browser check, not a visual audit of every component or every brand color.

The check exposed and corrected the Prolog tracer Color legend's icon name (`palette-swatch`) and an invalid SVG namespace in the internal icon definitions.

### Named button actions

Button actions are exposed as named methods on their owning component, such as `firstStep()`, `nextStep()`, `toggleJson()`, `undo()` or `saveAs()`. The API of concrete components includes inherited methods; changes to a shared component regenerate the dependent API manifests during development. TypeDoc remains the reference for signatures and parameters.

A control embedded in another component retains its own API: for example, a `tp-color` menu belongs to `tp-color`, and an editor's copy control belongs to `tp-copy-code`. Calling a method does not bypass read-only state, a disabled command or an operation already in progress. File choosers, clipboard operations and fullscreen may still require a browser user gesture.

The regression checks compare trace navigation and JSON/file controls with their buttons, Cryptarithm assistance with its menu commands, and read-only code-editor commands with the restrictions of the keyboard menu. The API generator checks inherited methods and excludes private methods. These checks supplement the existing component tests; they are not an exhaustive proof for every possible sequence of commands.

Verification on 2026/11/25: the 246 interaction pages and the descriptions of 2,008 public method signatures pass their checks. The focused Firefox and Safari checks above also pass after rebuilding. All 83 ProseMirror cases pass when run in separate groups (78 named cases and five parameterized source-resolution cases); the single-process run exceeded the available JavaScript heap, so it is not reported as a successful run. No assertions were removed for the grouped runs.

The editor/graph/notebook selection ran 703 tests. Two outdated export expectations were corrected and their two files rerun successfully (72 tests): headerless Markdown uses a native headerless table rather than a fabricated heading, and LaTeX media use native multimedia commands rather than `wc` wrappers. The Markdown check now also parses the exported table and compares every cell. These results cover the selected suites, not a fresh run of the complete repository test suite.

### Components sidebar ordering

The Components subtree is sorted alphabetically at every depth by `pnpm docs:sync-sidebar`. Both `pnpm dev` and `pnpm build` run this command; the Vite plugin also sorts edits made while the development server is running. Links, parent categories and sections outside Components are preserved. Sorting ignores case and accents.

Use `pnpm docs:check-sidebar` to detect an unsorted sidebar without changing it. Run `node --test scripts/sync-components-sidebar.test.mjs` to verify recursive ordering, unchanged hierarchy, idempotence, check-only behavior, malformed-input protection, the built sidebar and live development edits.

### Native playground test frameworks

The JavaScript and TypeScript playgrounds use Mocha/Chai, Python uses unittest, Prolog uses PlUnit, Scheme uses the SRFI-64 reference implementation and OCaml uses Alcotest 1.10.2. SQL uses JSON expectations to compare SQLite query results. All seven share a semantic results table (suite, case, status, details), separate skipped and expected-failure counts, and a closed Engine output disclosure. Styles come from TP base. OCaml's test runtime is loaded only for Test; Scheme loads its test implementation on demand.

Verification on 2026/11/25: 36 browser checks passed (12 each in Chromium, Firefox and Playwright WebKit). These are WebKit checks, not a native Safari run. Each framework was exercised through its playground with a passing suite, an intentional failure, an empty suite and invalid syntax. Passing fixtures include expected exceptions and skipped cases; Scheme also includes an expected failure. The checks open the engine log and verify asynchronous iframe growth, shrinking after content removal and rendering at a narrower viewport. Three focused unit/component checks passed. TypeScript and Biome checks passed.

```sh
pnpm exec playwright test --config playwright.playgrounds.config.ts tests/playgrounds/test-frameworks.test.ts
pnpm exec vitest run src/components/playground/test-results.test.ts src/components/prolog-playground/prolog-playground.test.ts
```

Additional verification on 2026/11/25: 72 Mocha/Chai and unittest browser checks passed (24 each in Chromium, Firefox and Playwright WebKit). They cover passing and failing suites, skipped tests, native asynchronous execution, unexpected runtime errors, module and library loading failures, fixture errors and empty suites. Mocha timeouts and unittest unexpected successes are also checked. Passing cases exercise unittest subtests and expected failures without double-counting the parent method, opening the engine log, iframe growth/shrinking, a narrower viewport and rerunning after changing the source. The eight Chromium Python cases were rerun successfully after enriching the unittest log. Eight focused unit/component tests, TypeScript and Biome checks passed.

Mocha's errors retain both their message and stack on Firefox as well as Chromium/WebKit. Test libraries still load with anonymous CORS; this is checked on the actual dynamically inserted scripts. Python test runs use the existing shared Pyodide execution queue. The examples and user-help descriptions are synchronized in all five markup variants, and the cover inventory was regenerated.

```sh
pnpm exec playwright test --config playwright.playgrounds.config.ts tests/playgrounds/mocha-unittest-results.test.ts
pnpm exec vitest run src/components/playground/test-results.test.ts src/components/javascript-playground/javascript-playground.test.ts src/components/typescript-playground/typescript-playground.test.ts src/components/python-playground/python-playground.test.ts
```


SQL verification on 2026/11/25: 42 browser checks passed (14 each in Chromium, Firefox and Playwright WebKit; not native Safari). They cover explicit and inferred test files, exact column names and value types, ordered rows and unordered rows with duplicate counts, empty SELECT results, multiple statements, expected SQL errors, invalid expectations, setup errors and loading failures. Each case uses a fresh database. Tests verify that modifying data in one case cannot affect the next case and that a stored SQLite database remains unchanged. Passing cases also verify the engine log, iframe growth/shrinking, a narrower viewport and rerunning modified source through the public `test()` method after using the Test button. Seven focused unit/component tests, TypeScript and Biome checks passed. Example descriptions, language labels, native markup and button documentation checks passed.

The SQL query tests documentation example contains eight passing cases and one skipped case. Its source and descriptions are available in all five markup variants.

```sh
pnpm exec playwright test --config playwright.playgrounds.config.ts tests/playgrounds/sql-test-results.test.ts
pnpm exec vitest run src/components/sql-playground/sql-test-runner.test.ts src/components/sql-playground/sql-playground.test.ts src/components/playground/test-results.test.ts
```


#### Six language playgrounds in native Safari

Verification on 2026/11/25 with Safari 26.6.2 through SafariDriver uses the actual documentation projects and native test runners: Mocha/Chai, unittest, PlUnit, SRFI-64 and Alcotest. The scenarios are shared with the cross-engine regression fixtures. Every scenario is repeated in light and dark mode; a deliberately failing suite passes its verification only when the common report identifies the failure.

**66/66 functional scenarios passed** in native Safari, plus 18 passing-suite regression checks in Chromium, Firefox and Playwright WebKit. Two shared-reporter unit tests, TypeScript and Biome checks passed. [Detailed Safari measurements](playground-frameworks-safari.json) include every result, theme, elapsed time, height measurements and toolbar rerun.

| Language | Light scenarios | Dark scenarios | Total scenario time |
| --- | ---: | ---: | ---: |
| JavaScript | 7 | 7 | 8.123 s |
| OCaml | 4 | 4 | 6.817 s |
| Prolog | 4 | 4 | 6.954 s |
| Python | 7 | 7 | 21.001 s |
| Scheme | 4 | 4 | 9.223 s |
| TypeScript | 7 | 7 | 10.285 s |

Times include navigation, loading, assertions and presentation checks; they are not engine-only execution times.

The campaign covers passing and failing assertions, skipped tests and empty suites in all six languages. Prolog, Scheme and OCaml also check syntax errors. JavaScript, TypeScript and Python additionally check execution, module and fixture errors; Mocha checks a timeout, while unittest checks unexpected success. Python and Scheme preserve their expected-failure counts.

The presentation checks cover the four headers, visible borders, nontransparent theme backgrounds, the closed/open Engine output disclosure, live theme changes in both directions, iframe growth and shrinking, a narrower window and a second execution through the toolbar Test click handler. The initial run uses the public `test()` method. These are DOM click-handler checks, not physical pointer delivery tests. Height comparisons use the larger of the body's and document element's scroll heights, since Safari can report them differently at the browser's existing zoom.

Visual review exposed long Python test names and tracebacks pushing the Details column outside the visible report. The shared TP base stylesheet now constrains the table to the report width and wraps long cell content; no framework-specific styling is added. Detailed tracebacks remain complete, so their rows can be tall. Test frames now receive a dedicated marker so shared TP base rules can apply the report palette without changing ordinary program output frames. The marker is removed when leaving the test document. Narrow-window checks assert that the table remains within the iframe width.

**Remaining visual limitation:** twelve passing-suite screenshots were reviewed. At Safari's retained zoom, some still show a white area outside the dark document content, although the report, native iframe and preview container report matching dark background colors. This residual rendering issue is not counted as fixed; functional and computed-style successes do not imply pixel-perfect rendering. No browser zoom preference was changed.

CDN-interruption scenarios are not repeated here because this native Safari harness does not intercept requests; their existing Playwright coverage remains separate. Browser caches were not cleared, so timings are not cold-download benchmarks.

Reproduce with the playground fixture server on port 4198 and SafariDriver on port 4446:

```sh
pnpm vite --config vite.playwright.config.ts --host 127.0.0.1 --port 4198
safaridriver -p 4446
node scripts/check-playground-frameworks-safari.mjs
```

Run these commands in separate terminals. `BASE_URL`, `SAFARI_DRIVER_URL`, `REPORT_DIR` and `LANGUAGES` (comma-separated) can select the server, driver, output directory and languages; `SCENARIOS` can select comma-separated cases. Measurements and light/dark screenshots are written to `/tmp/playground-frameworks-safari`; the temporary fixture and the harness's own browser session are cleaned up.

#### SQL results in native Safari

Verification on 2026/11/25 with native Safari 26.6.2 through SafariDriver: **26 scenarios passed across the initial campaign and the stored-database rerun**, 13 in light mode and 13 in dark mode. These are actual Safari checks, not Playwright WebKit. They cover the documentation fixture (eight passed cases and one skipped case), inferred test files, changed queries, column and duplicate mismatches, unexpected and expected errors, setup errors, missing source files, invalid JSON, empty suites and invalid expectations. Intentional SQL failures must produce a failed report to pass their verification.

The visual review exposed missing shared reset styles and missing theme propagation in the common report. Reports now load TP's shared typography, table borders, header background and body palette, and inherit their playground's theme and color tokens. Live theme changes update existing reports without executing SQL again. Previously copied CSS tokens are refreshed even when Firefox omits them from a subsequent computed-style enumeration, preventing a stale dark palette after returning to light mode.

Safari checks verify the four table headers, success/failure/skipped rows, closed/open Engine output disclosure, table width, live theme switching and a subsequent call to the public `test()` method. Screenshots were reviewed in both themes. The Test control is activated through its DOM click handler; this does not claim a physical pointer test.

The initial campaign left two stored-database cases blocked: a localStorage value written on a static page disappeared within one second. These original failures remain in the [initial Safari measurements](sql-playground-safari.json). The [independent diagnostic](sql-playground-safari-storage.json) reproduced the loss on both `127.0.0.1` and `localhost`, even with a fresh SafariDriver and a delayed first write. Cookies and session storage remained available; Safari's networking process logged internal database-open errors. This established that the failure also occurred outside TP, without establishing the precise internal browser cause.

**Resolved after restarting Safari with user approval on 2026/11/25.** The independent persistence probe now retains its value. Both stored-database scenarios passed in native Safari 26.6.2: light in **1.960 s**, dark in **1.457 s**, each with eight passing SQL cases and one intentionally skipped case. The **8,192-byte** saved SQLite database remains byte-for-byte unchanged after tests, including a destructive query isolated in its own test database, and survives a full page reload. The unrelated storage sentinel remains unchanged. See the [recovery measurements](sql-playground-safari-storage-recovery.json).

Recovery required restarting the browser, not changing SQL persistence code, substituting a storage mock, deleting browser data or changing Safari preferences. This validates recovery from the observed browser state; it does not establish why that state developed or guarantee it cannot recur. The native check now fails immediately if the independent persistence probe fails, asserts storage isolation and checks persistence after reloading. `SCENARIOS=sqlite` selects the two stored-database checks. The CDN interruption case remains covered by Playwright; it was not repeated in native Safari.


After the presentation fix, all 42 SQL checks passed again in Chromium, Firefox and Playwright WebKit, including saved-database isolation and CDN failure. The passing scenario also verifies light → dark → light background restoration, table borders and iframe growth/shrinking. The six other playgrounds' passing-suite checks passed in all three engines (18 checks). Seven focused unit/component tests, TypeScript and Biome checks passed.

To reproduce the native Safari campaign, start the playground fixture server and SafariDriver, then run:

```sh
pnpm vite --config vite.playwright.config.ts --host 127.0.0.1 --port 4198
safaridriver -p 4445
node scripts/check-sql-playground-safari.mjs
```

Run the three commands in separate terminals. The script writes measurements and screenshots to `/tmp/sql-playground-safari`; `BASE_URL`, `SAFARI_DRIVER_URL` and `REPORT_DIR` can override these locations. It removes its temporary HTML fixture and closes its own automation session.

Browser limitations: Alcotest's TP runner accepts the suite name and test groups and prevents process exit; command-line and Lwt/Async options are not supported. The Scheme adapter uses the reference R7RS exception branch (`#t` for any expected error), preserves LIPS macro labels and replaces file logging with browser reporting. PlUnit result collection targets the pinned SWI-Prolog distribution. Native runtime APIs are not reimplemented as JavaScript assertions.
