# Multi-pages reading history

All six multi-pages components automatically save the reading panel position when leaving a document. Back and Forward restore the complete URL and the latest position, including when an old URL anchor points elsewhere. Internal navigation snapshots are serializable and retained in the corresponding history entries, so internal pages visited before leaving remain restorable after a reload. The common implementation preserves unrelated history state and separates component instances by their ID, or their tag and document order when no ID is supplied. Restoration waits for asynchronous layout for up to one minute and stops on reader input or a new route. An explicit restoration event also ends initial fragment tracking. Scroll assignments also compensate small fractional-zoom rounding errors to prevent accumulated drift. Native scroll restoration is set to manual while multi-pages instances are connected, so native and component restoration do not compete. Internal positions are applied immediately after navigation and scheduled again after asynchronous layout, using a task rather than relying on animation frames that Safari may suspend. The previous browser setting is restored when the last instance disconnects.

For guides embedded inside another multi-pages document, see the [nested-guide verification](multi-pages-nested-history.md).

## Browser verification

432/432 transitions passed in the current recorded campaign. Each of the six components is checked with and without an anchor in Chromium, Firefox and native Safari: 36 scenarios, twelve transitions each. These fixtures use the library directly, without SICP or TP Books navigation scripts.

Each scenario first visits the cover at 500 px, then opens a chapter at 1,400 px, leaves through a normal link to a second document, then performs three Back/Forward cycles and one final Back. Reading positions change between visits: 1,400 / 1,700 / 1,100 / 1,900 px in the chapter, and 120 / 220 / 160 px in the second document. The test then selects the cover through the sidebar and performs Back, Forward, Back, checking 1,900 and 800 px. Every transition compares the full URL and the scroll position with a tolerance below 3 px, then checks again after 600 ms. Finally it simulates reader input, moves to 2,100 px and adds content, verifying that restoration does not undo that move. Two final Back/Forward actions revisit the cover entry created before leaving the document and then the chapter, checking 500 and 2,100 px. Thus internal history is checked across a full document reload, not only within one live component.

Positions and the final input signal are set programmatically for reproducibility; these checks do not measure physical wheel delivery. Back and Forward are actual browser history operations. Safari is Apple's native browser controlled through safaridriver, not Playwright WebKit. Each scenario gets a fresh session, retained throughout its twelve transitions.

| Component | Anchor | Chromium | Firefox | Safari |
| --- | --- | --- | --- | --- |
| tp-html-multi-pages | none | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-html-multi-pages | #heading | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-markdown-multi-pages | none | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-markdown-multi-pages | #heading | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-asciidoc-multi-pages | none | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-asciidoc-multi-pages | #heading | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-latex-multi-pages | none | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-latex-multi-pages | #heading | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-restructuredtext-multi-pages | none | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-restructuredtext-multi-pages | #heading | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-markup-multi-pages | none | 12/12 passed | 12/12 passed | 12/12 passed |
| tp-markup-multi-pages | #heading | 12/12 passed | 12/12 passed | 12/12 passed |

- chromium: 151.0.7922.34; 2026-11-24T08:53:33.248Z; source hashes match. [Detailed measurements](multi-pages-history-chromium.json)
- firefox: 153.0; 2026-11-24T08:56:55.913Z; source hashes match. [Detailed measurements](multi-pages-history-firefox.json)
- safari: 26.6.2; 2026-11-24T08:53:19.349Z; source hashes match. [Detailed measurements](multi-pages-history-safari.json)

## Reproduce

Set BASE_URL to the fixture server address if using another port. Start the source fixtures with `node scripts/serve-reading-history-fixtures.mjs` (port 4376), and safaridriver with `safaridriver -p 4445`. Then run `node scripts/check-multi-pages-cross-document-history.mjs`. Use `HISTORY_BROWSERS=chromium,firefox` or `HISTORY_BROWSERS=safari` to select browsers. The Safari remote automation option must be enabled. Regenerate this report with `node scripts/report-multi-pages-reading-history.mjs`.

## Scope

This verifies reading navigation at a fixed viewport in long, native-markup fixture documents. The generic tp-markup-multi-pages fixture uses Markdown pages; the five language-specific components use their respective native formats. It does not promise restoration of unsaved editor state, arbitrary interactive controls, changed document content, or unchanged pixel positions after viewport resizing. Unique stable component IDs are recommended when the order of multiple instances can change between visits. Existing in-document navigation tests additionally cover ordinary links, TOCs, references, global lists and toolbar navigation.

The initial test fixture assumed every native renderer emitted h1. AsciiDoc's section heading is h2; the test now accepts both. The initial anchor fixture also tried to change an already initialized sidebar link; it now follows an actual content link with an anchor. Those earlier incomplete runs are not counted as passing results. Safari initially kept the outgoing page at 800 px despite a correctly saved 1,900 px chapter position. Applying the internal position immediately and retrying asynchronous layout in a task, rather than relying on animation frames, fixes the targeted regressions; the final campaign also uses manual native restoration. A slow Firefox RST render exceeded the original ten-second restoration window; the final implementation allows up to one minute, while reader input still cancels restoration immediately.
