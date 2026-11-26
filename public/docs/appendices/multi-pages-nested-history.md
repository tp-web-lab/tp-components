# Nested multi-pages reading history

## Behaviour

An embedded guide has its own page history. Its links, including local anchors, leave the parent document's address unchanged. Back and Forward restore the guide's page and reading position, including after leaving the entire document and returning. The parent retains its own page and scroll position.

Restoration avoids redundant scroll assignments and compensates small rounding errors, so repeated history navigation does not accumulate a pixel offset at fractional zoom.

On recreation, the embedded component now reads its saved local route from its history entry instead of reopening its cover. The parent URL is never used as the embedded guide's route. Both base implementations are covered: Markdown and the common markup shell used by HTML, AsciiDoc, LaTeX, reStructuredText and mixed-markup guides. Give each guide a unique stable id, especially when several instances are created asynchronously or their order may change.

## Browser verification

432/432 transitions passed in the current recorded campaign: six variants × two child-anchor cases × three browsers × twelve Back/Forward actions.

Each fixture embeds a real guide with id=guide inside a real tp-html-multi-pages parent with id=parent. The parent keeps its route `#/cover.html#parent-heading`. The child first visits its cover at 500 px, then its chapter (with or without #heading) at 1,400 px. Three Back/Forward cycles visit another document containing an equivalent embedded guide. Child positions change to 1,700, 1,100 and 1,900 px; the other document uses 120, 220 and 160 px. A final Back returns to the chapter. Three further actions check cover/chapter navigation inside the guide (800 and 1,900 px). The reader then moves to 2,100 px; two final actions revisit the original cover and chapter entries created before the full-page trip.

Every transition checks the child heading (Cover or Chapter), its reading position, the full parent URL, the parent heading (Parent page) and the parent's scroll position. Pixel tolerance is below 3 px. The parent includes additional content below the guide so that 30 px is safely inside its scroll range. Its actual position before leaving is the reference. Measurements are checked again after 600 ms. Simulated reader input and an added paragraph verify that a later layout change does not undo the reader's new position.

Positions are established programmatically after a synthetic wheel event; this campaign does not claim physical wheel delivery. Back and Forward use real browser commands. Safari is Apple's native browser through safaridriver, not Playwright WebKit. Each Safari scenario uses a fresh session, retained throughout its twelve actions. The child fixtures use their native language; the generic markup fixture uses Markdown.

| Embedded component | Child anchor | Chromium | Firefox | Safari |
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

- chromium: 151.0.7922.34, 2026-11-24T08:50:12.514Z; source hashes match. [Detailed measurements](multi-pages-nested-history-chromium.json).
- firefox: 153.0, 2026-11-24T08:59:54.593Z; source hashes match. [Detailed measurements](multi-pages-nested-history-firefox.json).
- safari: 26.6.2, 2026-11-24T09:00:31.346Z; source hashes match. [Detailed measurements](multi-pages-nested-history-safari.json).

## Corrections and scope

The first final campaign also encountered initial reStructuredText loading timeouts in Firefox and Safari, before any history action in the unanchored cases. Both reStructuredText cases were rerun separately in each browser; the detailed JSON records preserve the original attempts and the rerun timestamps. A passing rerun validates history restoration after loading, but does not establish that cold loading can never time out. The subsequent [reStructuredText loading investigation](restructuredtext-loading.md) records recovery changes, fresh-session measurements and controlled network stalls.

The missing local-route restoration after full-document reload was fixed in the two shared component bases. A regression test recreates each base with a saved child route and fragment, and verifies that initialization keeps the parent address unchanged.

An early Safari fixture used a parent scroll target close to the end of its scroll range. The final fixture adds enough parent content to avoid testing at its scroll limit, records the actual position and retains the same strict tolerance; the child page and its position were already correct in those attempts. The [earlier fixture measurements](multi-pages-nested-history-safari-fixture-mismatch.json) are retained separately from the final campaign.

An isolated Safari probe then exposed a genuine rounding issue even with enough parent content: assigning scrollTop=30 returned 29; assigning that 29 returned 28. Safari reported devicePixelRatio=1.7000000476837158 with its existing zoom setting, which was not changed. Shared restoration now skips positions already reached and compensates small assignment errors instead of repeatedly losing a pixel. A unit test models this behaviour and verifies that repeated restoration does not accumulate drift. Final browser records include each measured devicePixelRatio and the expected and actual parent positions.

These measurements cover one level of nesting inside an HTML parent, fixed viewport sizes and stable IDs. They do not establish restoration of arbitrary editor state, changed document content, or all combinations of parent languages and nesting depths. [Top-level reading-history verification](multi-pages-reading-history.md) provides the complementary non-nested campaign.

## Reproduce

Start `PORT=4378 node scripts/serve-reading-history-fixtures.mjs` and `safaridriver -p 4445` (remote automation enabled). Run `BASE_URL=http://127.0.0.1:4378 NESTED=1 node scripts/check-multi-pages-cross-document-history.mjs`. HISTORY_BROWSERS selects chromium, firefox or safari; LANGUAGE selects one component variant. Generate this report using `node scripts/report-multi-pages-nested-history.mjs`. Generating it does not execute browser tests.
