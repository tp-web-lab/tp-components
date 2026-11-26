# Scheme tracer engine

LIPS **1.0.0-beta.23.1**, the version used by `tp-scheme`.

- Source: https://cdn.jsdelivr.net/npm/lips@1.0.0-beta.23.1/dist/lips.esm.js
- Standard library: https://cdn.jsdelivr.net/npm/lips@1.0.0-beta.23.1/dist/std.xcb
- Project: https://github.com/jcubic/lips
- License: MIT; see `LICENSE` and the retained source license headers.

The optional observer is called at evaluator-state creation/continuation, before expression evaluation, after a lambda scope is bound, and when entering a Scheme procedure. The procedure-entry hook also supplies its original call expression so calls and returns can highlight the call site. The adapter reads the existing environments and continuation identities; it does not rewrite Scheme expressions, special forms or tail calls. Throwing from the observer aborts an over-limit recording. Each browser recording has its own Worker and engine instance.

`std.xcb` is unchanged. `lips.js` differs from the official ES module only by these hook insertions and the observer setter. The generated observer is disabled by default and cleared after every recording. Standard-library implementation frames are omitted from source stepping.

Verify the patch with `node scripts/patch-scheme-tracer-lips.mjs --check`. To reproduce it, download the pinned ES module and pass its local filename to that script. Its SHA-256 is checked before writing. No network fetch or patching happens at application runtime.

The native evaluator's Node-specific setup is used only by semantic tests; import it inside test setup so collecting the test inventory does not initialize the engine. Browser execution uses the bundled engine and standard library, without a CDN dependency.

The engine is loaded as a preserved ES-module asset, not re-minified by the application bundler. LIPS relies on runtime identities that must survive packaging. The binary standard library is also kept as a distinct `.xcb` asset.
