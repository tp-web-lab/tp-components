# browser-swift

Run **Swift in a browser tab with no server**. `swift-frontend.wasm` compiles Swift to
WebAssembly, `wasm-ld.wasm` links it, and the result runs under a WASI shim — every step on
the page, from static files. Nothing executes Swift for you.

This is the proof of concept for Swift support in [LiveCodes](https://livecodes.io), shaped
as the adapter package (`@live-codes/swift-wasm`) that LiveCodes will consume. Wiring it
into LiveCodes itself is a follow-up; this repo stands alone.

![the POC page running Swift](docs/screenshot.png)

## How it works

The Swift compiler has already been cross-compiled to run *on* WebAssembly by
[`tothambrus11/swift-toolchain-wasm`](https://github.com/tothambrus11/swift-toolchain-wasm);
this repo consumes that release rather than rebuilding it (that build is a ~40 GB,
hours-long Linux cross-build).

WASI cannot `fork`/`exec`, so there is no `swiftc` driver in the loop. The embedder replays
what the driver would have done — three separate WASI command modules over one shared
in-memory filesystem:

```
        ┌──────────────────────── browser tab ────────────────────────┐
        │ poc/swift.html ──<script>──► SwiftWasm.createRuntime()      │
        │                                   │ spawns                  │
        │                                   ▼                         │
        │   Worker: dist/swift-wasm.worker.iife.js                    │
        │     1. fetch + compile swift-frontend.wasm, wasm-ld.wasm    │
        │     2. untar swift-sysroot-core.tar into /sysroot   (once)  │
        │     3. write /build/main.swift                              │
        │     4. swift-frontend --frontend -c -primary-file … → main.o│
        │     5. wasm-ld …                                    → program.wasm
        │     6. run program.wasm under WASI → capture stdout         │
        └─────────────────────────────────────────────────────────────┘
              shared filesystem = one browser_wasi_shim Directory tree
```

The argument vectors are taken from upstream's `docs/consuming.md` (itself captured from a
real `swiftc -target wasm32-unknown-wasip1 -v` run), with two driver steps deliberately
skipped: `swift-autolink-extract` (the wasm dependency list is fixed) and the macro plugin
plumbing (macros cannot work under WASI at all).

### Multiple files

`run()` takes either a source string (treated as `main.swift`) or a whole module as
`[{ filename, content }]`. Each source is compiled as the primary of a batch that includes
the module's other files, then the objects are linked:

```
swift-frontend -frontend -c -primary-file a.swift b.swift … -o objects/0.o
swift-frontend -frontend -c a.swift -primary-file b.swift … -o objects/1.o
wasm-ld … objects/0.o objects/1.o -o program.wasm
```

Every source is listed exactly once per invocation — the primary as the argument to
`-primary-file`, the rest positionally. Repeating the primary as a positional input is a
duplicate-input error, which is why the single-file case passes no positional sources at all.
Diagnostics come back with the filename you supplied rather than an internal `/build/...`
path, including for nested names like `Support/helpers.swift`.

The cost is that each invocation parses every file, so compile time grows with the file count.

## Quick start

The toolchain and the built bundles are committed, so there is nothing to download and
nothing to build — serving the directory is enough:

```bash
npm run serve      # http://localhost:8137/poc/swift.html
```

(No `npm install` either: the server uses only Node built-ins.)

For development:

```bash
npm install        # esbuild for bundling, browser_wasi_shim for the Node tests
npm run fetch      # re-fetch/verify the pinned toolchain (~70 MiB, gzipped)
npm run build      # re-bundle dist/ after changing src/
npm test           # Node end-to-end tests, no browser
```

Open <http://localhost:8137/poc/swift.html>, wait for the toolchain to warm up, and press
**Run**. The first load is the expensive one (~70 MiB over the wire); after that a compile is
a second or so.

`npm run smoke` runs the same pipeline in Node, with no browser, and asserts exact output.

## API

```js
// The toolchain ships next to the bundle, so baseUrl is usually unnecessary.
const runtime = await SwiftWasm.createRuntime({
  onProgress: (p) => console.log(p),   // { phase, name, loaded, total }
});

await runtime.warmUp();                // fetch + compile tools, mount the sysroot

const result = await runtime.run('print("Hello, world!")');
// {
//   ok: true,
//   output: 'Hello, world!\n',
//   error: '',
//   exitCode: 0,
//   compileMs: 2562, linkMs: 1109, runMs: 23,
//   diagnostics: [],                   // [{ file, line, column, severity, message }]
// }

// Standard input is passed per run:
await runtime.run('print((readLine() ?? "").uppercased())', { input: 'hello\n' }); // "HELLO\n"

// A whole module instead of a single file — the file named main.swift carries the
// top-level statements, as Swift requires. Each file is compiled separately and the
// objects are linked together.
const module = await runtime.run([
  { filename: 'main.swift', content: 'print(greeting())\n' },
  { filename: 'greeting.swift', content: 'func greeting() -> String { "Hello!" }\n' },
]);
// module.diagnostics[].file is the filename you supplied, not an internal path.

runtime.capabilities;                  // { supported, missingFeatures, swiftVersion, toolchain }
runtime.destroy();                     // terminate the worker
```

`createRuntime` throws `SwiftUnsupportedError` (with `missingFeatures`) when the browser
lacks what the toolchain needs, so a caller can route elsewhere.

## Layout

| Path | What |
|---|---|
| `src/pipeline.js` | the compile → link → run pipeline, shared by the worker and the Node smoke test |
| `src/driver.js` | argument vectors and the diagnostics parser (pure) |
| `src/vfs.js`, `src/untar.js` | the shared in-memory filesystem and a ustar reader |
| `src/worker.js`, `src/index.js` | the worker and the page-side adapter |
| `scripts/fetch-toolchain.mjs` | pinned download + SHA-256 + gunzip |
| `scripts/build.mjs`, `scripts/serve.mjs` | IIFE bundling; a MIME-correct static server |
| `scripts/smoke.mjs` | Node end-to-end test |
| `scripts/spike.mjs` | the original de-risk spike (compiles several programs and prints timings) |
| `poc/cross-origin.html` | checks the CDN path: cross-origin bundle, blob worker, client-side inflate |
| `toolchain/` | the vendored artifacts, gzipped — committed and published with the package |
| `toolchain.lock.json` | release tag + per-asset SHA-256 — the single source of truth |
| `scripts/check-package.mjs` | refuses to publish if the artifacts or bundles are missing |
| `FINDINGS.md` | what worked, what didn't, and why |

## Publishing and consuming

`npm pack` / `npm publish` ships the artifacts alongside the bundles, so nothing needs a
separate host:

```
@live-codes/swift-wasm/
├─ dist/
│  ├─ swift-wasm.iife.js
│  └─ swift-wasm.worker.iife.js
└─ toolchain/
   ├─ swift-frontend.wasm.gz
   ├─ wasm-ld.wasm.gz
   └─ swift-sysroot-core.tar.gz
```

`prepack` rebuilds `dist/` and then refuses to publish if any of those files is missing, so a
package that installs but cannot compile anything cannot go out. Current contents: **5 files,
73.6 MB packed, 73.8 MB unpacked**.

Because `toolchain/` sits next to `dist/`, `createRuntime()` finds it with no configuration:

```html
<script src="https://cdn.jsdelivr.net/npm/@live-codes/swift-wasm@0.0.1/dist/swift-wasm.iife.js"></script>
<script>
  const runtime = await SwiftWasm.createRuntime(); // artifacts resolve to ../toolchain/
</script>
```

The artifacts ship **gzipped and are inflated by the client**, so any static host or CDN works
with no configuration: nothing depends on `Content-Encoding`, and the client knows what it is
getting from the `.gz` suffix. `scripts/serve.mjs` serves them exactly as a CDN would, with
`immutable` caching (safe because they are content-pinned).

Two things make the CDN case work, both covered by `poc/cross-origin.html`:

- **The worker is bootstrapped cross-origin from a `data:` URL that `importScripts` the
  bundle.** `new Worker` refuses a cross-origin script, but `importScripts` inside a worker is
  not bound by that, so nothing needs fetching into the page first. A `data:` worker has an
  opaque origin, so the artifact host must send CORS headers when the bundle is cross-origin
  — a CDN does, and `scripts/serve.mjs` does. Same-origin bundles spawn directly, which keeps
  self-hosting free of any CORS requirement.
- **The client inflates the artifacts itself**, streaming them through `DecompressionStream`
  into `WebAssembly.compileStreaming`, so incremental compilation — and the engine's
  compiled-module cache — still apply.

A consumer that self-hosts points `baseUrl` at its own copy instead.

## Before publishing

Verified on this tree:

- `npm pack --dry-run` → 8 files, 73.6 MB: both bundles, all three artifacts, the notices.
- `npm test` → 8/8 in Node: single file, multi-file, nested filenames, stdin, diagnostics,
  and repeat runs.
- `npm run serve` + `poc/swift.html` → compiles and runs from the committed tree with no
  install, no build, and no download.
- `poc/cross-origin.html` with two servers → bundle and artifacts from a **different origin**,
  worker via `data:` URL: `cross-origin ok: 4`.

Still open, and a judgement call rather than a bug:

- **Version** `0.1.0` is fine for a first publish; bump it if the name is already taken.

## Limitations

Grouped by whether they can be fixed from here.

**Fixed in this adapter**

- **Cold load.** The toolchain is vendored gzipped and served with `Content-Encoding: gzip`:
  **70.4 MiB over the wire instead of 301 MiB** (4.3×). The artifacts are content-pinned, so
  they are served `immutable` and never re-downloaded; the two wasm modules are fetched with
  `WebAssembly.compileStreaming` so the engine keeps the compiled artifacts in its code
  cache. A warm reload reaches readiness in about half the time of a cold one.

**Fixable from here, deferred**

- **Sysroot untar on every page load** (~99 MiB, tens of thousands of entries). Could be
  cached in the Origin Private File System instead of rebuilt per tab.
- **Cross-run Clang module cache** is discarded each run for correctness (see
  [FINDINGS.md](FINDINGS.md)); preserving only completed entries would be faster.

**Not fixable here**

- **No macros** and no compiler plugins. Macros are spawned executables, and WASI cannot
  spawn anything. Upstream's route is redesigning plugins as in-process wasm modules the
  embedder loads — a toolchain-level project.
- **No Swift-implemented SIL optimizer passes.** `SWIFT_ENABLE_SWIFT_IN_SWIFT` is off because
  C++ interop is broken for `wasm32-unknown-wasip1` in the stock SDK (a Clang module cycle:
  `SwiftWASILibc -> std_inttypes_h -> SwiftWASILibc`). The fix is known upstream and needs a
  toolchain rebuild (~40 GB cross-build), not a change here.
- **4 GiB address space.** Inherent to wasm32. Single-file snippets fit comfortably; large
  whole-module builds need a server-side fallback — which is exactly what we are avoiding.
- **Interactive stdin.** Input is a finite buffer handed to the program up front, not a live
  stream: `browser_wasi_shim` is synchronous, so a program cannot block waiting for more.

## Licence

MIT — see [LICENSE](LICENSE), © 2026 Hatem Hosny. The vendored toolchain is Swift, Apache-2.0
with the Runtime Library Exception; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
