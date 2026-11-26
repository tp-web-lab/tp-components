# Tracer semantic navigation verification

Verified on 2026/11/26 for Python, JavaScript, TypeScript, Scheme and OCaml. Prolog uses a separate resolution-tree visualizer and is outside this change.

The browser checks load the documented “Nested calls and a separate query” source files through src and record recursive factorial with initialization and a separate query. This example is available in all five tracer documentations and their five markup variants. They compare button and public-method destinations for Step over, Step out and Start at query, check the returned output, revisit skipped steps, and verify that navigation leaves the recording unchanged. Saved JSON is then replayed with Worker construction forbidden. The query boundary remains available. Buttons and icons are checked in light and dark themes. A second Scheme recording checks that Step out follows a tail-call continuation instead of stopping at its replacement frame.

| Browser | Version | Languages passed | Time |
| --- | --- | ---: | ---: |
| Chrome | 158.0.8127.38 | 5 / 5 | 2.91 s |
| Firefox | 153.0 | 5 / 5 | 7.39 s |
| Safari | 26.6.2 | 5 / 5 | 3.78 s |

[Chrome report](tracer-semantic-navigation-chrome.json), [Firefox report](tracer-semantic-navigation-firefox.json), [Safari report](tracer-semantic-navigation-safari.json).

Unit tests additionally cover exceptions, recording limits, captured environments, recursive invocations with identical names, Unicode query offsets, invalid source/query metadata, legacy traces without invocation identifiers and the interpreter-to-tracer query boundary.

Reproduce browser checks from tp-components with `BROWSER=chrome`, `BROWSER=firefox` or `BROWSER=safari` followed by `node scripts/check-tracer-semantic-navigation.mjs`, after building the package. Safari uses the native WebDriver on port 4445 (`SAFARI_DRIVER_URL` can override it).

The commands navigate existing snapshots; they do not reduce recording time or increase the event limit. Existing grouping of consecutive states without visible changes remains in effect; call and return boundaries are retained. A legacy recording without explicit source/query metadata cannot reliably offer Start at query. Old Scheme recordings without continuation identifiers cannot reconstruct optimized tail-call chains.
