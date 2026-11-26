# Tracer expression values verification

Verified on 2026/11/26 for JavaScript, TypeScript, Scheme and OCaml, using the real component Workers and the documented **Constant expressions and intermediate values** examples.

| Browser | Version | Tracers passed | Time |
| --- | --- | ---: | ---: |
| Chrome | 158.0.8127.38 | 4 / 4 | 4.87 s |
| Firefox | 153.0 | 4 / 4 | 9.98 s |
| Safari | 26.6.2 | 4 / 4 | 6.95 s |

[Chrome results](tracer-expression-values-chrome.json), [Firefox results](tracer-expression-values-firefox.json), [Safari results](tracer-expression-values-safari.json).

## What is verified

- The constant expression produces 57. JavaScript, TypeScript and LIPS Scheme record the arithmetic values 8, 8, 16, 48, 3, 9, 57. The tested OCaml engine records 3, 9, 8, 8, 16, 48, 57. The trace follows actual evaluation rather than imposing one ordering on every language.
- Every numeric expression highlights the matching original source range and displays its value, in light and dark themes. Previous and Next revisit those values without modifying the saved recording.
- Mutating procedures run once per executed call. Skipped Boolean branches do not run.
- The saved JSON reopens with Worker construction forbidden. Values, source highlights and navigation still work in both themes.
- All three browsers also run the seven OCaml examples covering recursion, same-line expressions, shared mutation, closures, pattern matching, caught exceptions and uncaught exceptions.

Node tests additionally cover JavaScript/TypeScript getters, postfix updates, receiver binding, optional-chain short circuiting, temporary objects and UTF-16 source ranges, plus Scheme continuation results and temporary pairs. Existing recorder and component regression tests remain active.

## Reproduce

Run `pnpm test:tracer-expressions` for the focused value/replay checks. Run the JavaScript, TypeScript, Scheme and OCaml tracer Vitest suites for component and recorder regressions. After building tp-components, run `BROWSER=chrome`, `BROWSER=firefox` or `BROWSER=safari` followed by `node scripts/check-tracer-expression-values.mjs`. Safari uses its native WebDriver on port 4445 (`SAFARI_DRIVER_URL` can override it).

## Limits

The existing synchronous subsets and event limits still apply. Extra Scheme completion snapshots count toward the recording limit. JavaScript/TypeScript optional-chain results do not have a separate expression-value step. OCaml values with unresolved types retain the existing generic runtime representation. Older saved traces without expression values cannot reconstruct them. These checks cover the published examples and explicit regression cases, not arbitrary programs or asynchronous execution.
