# Tests

The test suites cover component behavior, shared utilities, the local question-assistance server, documentation generators, browser integrations and accessibility. Run commands from the `tp-components` package directory after installing the workspace dependencies.

## Running the suites

| Command | Scope |
| --- | --- |
| `pnpm test` | All Vitest tests: `src/**/*.test.ts` and `server/**/*.test.mjs`. Component tests use jsdom; server tests select the Node environment. |
| `pnpm test:coverage` | The complete Vitest suite with V8 coverage of production TypeScript in `src/components/`; writes `config/global-quality-coverage/coverage-summary.json`. |
| `pnpm test:scripts` | Node test runner tests in `scripts/*.test.mjs`: documentation, examples, generators, CI configuration and publication helpers. |
| `pnpm test:playgrounds` | Functional Playwright tests in Chromium, Firefox and WebKit: local files, Python projects, and dynamic editor/iframe sizing. |
| `pnpm test:a11y` | Playwright accessibility scenarios in all three browser engines, including color contracts and geometry keyboard interaction. |
| `pnpm test:all` | The four suites above, in order; execution stops at the first failing suite. |
| `pnpm test:component <name>` | Focused Vitest regression tests for one component. |
| `pnpm test:a11y:component <name>` | Focused browser accessibility scenarios for one component. |
| `pnpm exec tsc --noEmit` | Type checking, separate from test execution. |

Install the three Playwright browsers with `pnpm exec playwright install` when they are not available. Browser suites start a local Vite server on port 4173; outside CI they may reuse an existing server, which must serve this checkout. Python integration tests also require the browser runtime resources to be available.

`pnpm test` does **not** run the Node script suite or Playwright. The server's `.test.mjs` file imports Vitest and belongs to `pnpm test`; do not execute it with `node --test`.

The `test:quality:*` commands select overlapping parts of the Vitest suite and collect coverage; they do not introduce additional independent tests. Test files under `public/` are sample projects or learner exercise fixtures, executed by the embedded runners. Some deliberately fail for the initial answer, so they must not be collected as library regression tests.

## Reviewing a change

Exercise observable behavior: public attributes and methods, rendering, emitted events, keyboard interaction, error handling, asynchronous updates and cleanup. Preserve assertions when fixing a failure; distinguish an obsolete expectation from a product regression before changing either.

For viewer and editor changes, check both the content and its containing panel after initial load, growth, shrinking, replacement and width changes. Run browser regressions because jsdom does not establish real layout behavior. Accessibility scans complement these checks; they do not establish screen-reader usability or every keyboard interaction.

Tests of generators must run writes in disposable copies and remove those copies afterward. An idempotence test compares the first generated result with a second generation and verifies that a subsequent check reports no changes. It must not rewrite the working checkout or race with tests that read its examples.

Changed TypeScript files, including tests, must pass `pnpm exec biome check <files>`. After changing examples or generators, also run `pnpm examples:check-structure`, `pnpm examples:check-native-markup`, `pnpm examples:check-descriptions` and `pnpm examples:check-labels`.

## Execution results and coverage

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

Vitest completed at 2026-10-29T10:01:47.796Z. Machine-readable totals are stored in `config/test-review-latest.json`; current Vitest results are also recorded in `config/component-quality-latest-run.json`. Browser failures caused by the former combined sizing scenario were corrected by giving each language an independent scenario. A traced Firefox run also exceeded the local-file scenario's deadline; the final full browser run passed without tracing.

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
