# OCaml browser runtime

This file is built from OCaml 5.5.2 and Js_of_ocaml 6.5.0, including the OCaml toplevel, standard library and Js_of_ocaml browser bindings. It is loaded lazily when a session is created. No external CDN is required.

The `source/` directory contains the TP bridge and its build recipe. Canonical sources: `scripts/ocaml-runtime/toplevel.ml` and `tp_dom.ml` in @tp/tp-components. Rebuild with `scripts/ocaml-runtime/build.sh` in an opam environment containing `ocaml`, `js_of_ocaml` and `js_of_ocaml-toplevel` at the above versions. The bridge exposes typed evaluation results, virtual files and `Tp_dom.document ()` / `Tp_dom.window ()` for the current preview.

Upstream source: https://github.com/ocsigen/js_of_ocaml/tree/6.5.0 and https://github.com/ocaml/ocaml/tree/5.5.2. License texts are distributed alongside the runtime. Keep the source bridge and reproducible build script when redistributing a modified runtime.

## Execution tracer

`tracer.js` is a separate lazy-loaded build for `tp-ocaml-tracer`. It adds the compiler-based observer in `scripts/ocaml-runtime/tp_trace.ml`; the ordinary interpreter keeps using `toplevel.js`. Build with `scripts/ocaml-runtime/build-tracer.sh` in the same pinned OCaml/Js_of_ocaml environment. The matching source and build recipe are distributed in `source/`.

The observer type-checks the original phrases, preserves their locations and instruments expressions, function calls and lexical bindings. Snapshots retain references and shared object identities. The Worker translates UTF-8 source offsets to JavaScript UTF-16 offsets and applies the shared visible-step grouping. Recording has a 1,000-event limit; replay never loads the compiler. Instrumentation is intended for teaching, not profiling, and does not preserve tail-call optimization. Unsupported language features are listed in the component documentation.

## Test runner

`toplevel-tests.js` is loaded only by the playground Test command. It contains the real Alcotest 1.10.2 library and its official JavaScript runtime, compiled with the same OCaml/Js_of_ocaml versions. `scripts/ocaml-runtime/build-tests.sh` rebuilds it; `source/tp_alcotest.ml` wraps cases for the common TP results table and disables process exit. `Alcotest.check`, testables and exception checks are upstream implementations. The browser `Alcotest.run` accepts the suite name and groups; command-line options and Lwt/Async suites are not exposed. Native descriptor duplication is not used in the enforced verbose browser runner. The normal interpreter and execution tracer do not load this test runtime.

Alcotest source: https://github.com/mirage/alcotest/tree/1.10.2 (ISC). Dependency licenses for Alcotest, Fmt, Astring, Cmdliner and Re are included in `licenses-tests/`.
