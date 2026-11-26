# Local Python tracer prototype

This is an isolated feasibility prototype, a local light-DOM `tp-python-tracer` element, not a registered library component or a restored integration with the public Python Tutor website.

## Open locally

From `@tp/tp-components`, run:

```sh
pnpm exec vite --host 127.0.0.1 --port 4386
```

Open http://127.0.0.1:4386/prototypes/python-tracer/index.html (include `index.html`). This development-only page imports TP components from `/src`; it is not yet a standalone production build.

Choose Recursion, Variables, Lists, Shared references or Students. Edit the program in `tp-code-editor`, then choose Record execution. First, Previous, Next and Last browse the recorded snapshots without executing the program again. The JSON panel exposes the current snapshot.

A line event is captured before its line runs. Call and return events also carry a line number; the event label distinguishes them. The output is cumulative at that step. A return value appears as `__return__` in its function frame.

## Architecture

1. The main page starts a fresh classic Web Worker for each recording.
2. The Worker loads Pyodide 0.29.3 (the same pinned release as the existing TP Python runtime).
3. Local copies of `pg_logger.py` and `pg_encoder.py` trace execution using Python's `bdb` facilities and serialize snapshots.
4. A local JavaScript renderer displays the recorded source, global variables, call frames and heap objects using TP controls and shared color tokens.
5. Worker completion, error, Stop or deadline expiration terminates the Worker. Old messages cannot replace a newer recording.

The trace engine comes from revision `526266872a2dc8af671eacd9cb853e08b5bb9fa9` of `sineagles/OnlinePythonTutor` (2019-11-24). The only upstream Python adaptation required by these examples was removing `import imp` and replacing `imp.new_module` with `types.ModuleType`. See [provenance](vendor/UPSTREAM.md) and the retained [license](vendor/LICENSE.txt).

No upstream HTML, TypeScript visualizer, analytics, advertisements or Python execution server are used. No request to pythontutor.com is needed. Pyodide still downloads its runtime from `cdn.jsdelivr.net`: local execution does not yet mean offline installation.

## Verified behavior

- Recursion: `factorial(5)` returns 120; five distinct function frames contain `n = 5, 4, 3, 2, 1` at the deepest call.
- Students: a list of two dictionaries points to score tuples. The loop computes averages 92.5 and 75.0 and prints `Ada 92.5`; `s` points to each student dictionary in turn.
- Variables: `x` changes from 2 to 9 while `y` stays 5.
- Lists: the same list object changes from `[1, 2]` to `[10, 2, 3]`.
- Shared references: `a` and `b` link to one list; `c` is an independent copy. A list containing `a` and `b` points twice to the same object, whose card is rendered once. SVG arrows connect variable dots and list-cell dots to their targets; shared references converge on the same card.
- Previous/Next/First/Last navigate the trace; clicking a reference locates its object. Hovering or focusing a dot highlights its arrow and target. Connectors follow resizing and horizontal scrolling; narrow screens keep a scrollable two-column memory diagram.
- Syntax errors appear in the trace.
- Infinite Python loops stop at the event limit.
- A long native Python operation can be stopped without freezing the main page, and is terminated after the execution deadline.
- A new recording succeeds after a timeout.

Browser reports, including timings and observed request hosts: [Chrome](verification-chrome.json), [Firefox](verification-firefox.json). These checks use real Pyodide, not mocked traces. Safari has not been verified for this prototype.

Reproduce:

```sh
node scripts/check-python-tracer-prototype.mjs
BROWSER=firefox node scripts/check-python-tracer-prototype.mjs
```

`BASE_URL` can select another local server. The browser script checks the snapshots, the rendered frames and shared-reference links, output, navigation, interruption and recovery. It rejects requests outside the local host and Pyodide CDN. Report timings include Worker initialization and recording, and depend on the browser cache; they are not benchmarks of Python alone.

## Deliberate limits

- 20,000 source characters, 1,000 trace events plus a terminal limit notification.
- 60-second initialization deadline and 10-second execution deadline.
- Each run starts a fresh Python session; it does not reuse interpreter variables.
- Sequences use indexed cells and SVG reference arrows. Dictionaries have structured cards; functions show their signature. Other object types currently use a JSON representation. Complex diagrams can still have crossing arrows; graph layout is deliberately simple.
- Arbitrary imported packages, DOM integration, asynchronous code, generators, closures, large objects and hostile programs have not been validated.
- The upstream local entry point disables server process resource limits. Worker termination protects responsiveness; this prototype is not a hardened security sandbox and does not impose a strict memory quota.
- No changes to `tp-python`, `tp-python-viewer`, or their public API.

## Reference-arrow verification

Run `node scripts/check-python-tracer-arrows.mjs` and `BROWSER=firefox node scripts/check-python-tracer-arrows.mjs` against the local server. The shared-reference example has six arrows: four terminate at the same list, including two originating in another list. Checks cover source/target coordinates, nested references, hover and keyboard focus, resizing, horizontal scrolling and replacement between first/last snapshots. The SVG renderer is local and introduces no additional dependency or remote requests.

The Students regression check (`node scripts/check-python-tracer-students.mjs`, optionally with `BROWSER=firefox`) verifies numeric rendering before/after the second average calculation, four separate right-side arrow lanes, distinct exits from the students list, hover isolation and resizing. Integral floats such as `75.0` are rendered as Python values rather than their internal `SPECIAL_FLOAT` encoding. Each object reference has its own lane; paths are cleared immediately when snapshots change, then recalculated on the next animation frame.

Memory cards use a compact layout with smaller padding and indexed cells. Arrowheads are fixed-size SVG markers in user-space units: each path terminates at the middle of the triangle base, with a horizontal final segment; the triangle tip reaches the target card. Hovering changes the stroke weight, not the triangle size. The reference-arrow regression checks verify this marker geometry.

## Load source or replay a recording

Load the prototype module and stylesheet, then use:

```html
<link rel="stylesheet" href="/prototypes/python-tracer/style.css">
<script type="module" src="/prototypes/python-tracer/main.js"></script>
<tp-python-tracer src="examples/students.py"></tp-python-tracer>
<tp-python-tracer trace="examples/students.trace.json"></tp-python-tracer>
```

`src` loads complete Python source into the editor; recording starts only when Record execution is selected. `trace` loads a complete JSON recording and displays its first snapshot immediately. When both nonempty attributes are present, `trace` wins and `src` is not fetched. URLs resolve relative to the containing document. Attribute changes reload the selected input; removing `trace` falls back to `src`. Independent instances keep separate recordings, navigation and arrow targets.

Load trace opens a local JSON file chooser. It replaces the current recording only after validation. The JSON document contains `version: 1`, `code` (the complete Python source), and `trace` (the ordered array of snapshots). Existing unversioned `{code, trace}` Worker results are also accepted. The Trace JSON panel shows only the current snapshot and is not a complete recording. Imported code is displayed, never executed automatically. First, Previous, Next and Last only browse snapshots. Selecting Record execution explicitly records the current editor code again.

See [the saved Students recording](replay.html) and its [JSON file](examples/students.trace.json). Files are limited to 10 MB, 20,000 source characters and 1,001 snapshots. Invalid JSON, unsupported versions and malformed snapshots leave the previous recording available and show an error. URL loading has a 30-second deadline; newer loads cancel earlier URL requests. HTTP errors are reported without launching Python.

Run `node scripts/check-python-tracer-loading.mjs` (or `BROWSER=firefox node scripts/check-python-tracer-loading.mjs`). Verified in Chrome and Firefox: a real Students recording is reloaded in a fresh page whose Worker constructor rejects any execution; URL priority, the local file chooser, all navigation buttons, invalid documents, source-only loading, HTTP errors, request replacement and multiple instances pass with **zero Worker constructions during replay**. These loading checks do not constitute Safari verification.

### Save trace

Save trace uses the shared TP Save as dialog: the browser file picker where supported, otherwise a filename prompt followed by a download. The button is disabled until a recording is available. It saves a version-1 JSON document with the complete recorded source and **all** snapshots, regardless of the selected step. Unexecuted edits in the source editor are not substituted for the recorded code. The file can be reopened using Load trace or the `trace` attribute. Cancelling Save as leaves the recording and current step unchanged; write errors appear in the status line.

`node scripts/check-python-tracer-saving.mjs` (also with `BROWSER=firefox`) checks a complete save/load round trip, the filename and JSON contents, cancellation, write errors and unchanged navigation, with Python Workers forbidden. The file-picker API is simulated for write/cancel/error coverage; the fallback is checked through an actual browser download.
