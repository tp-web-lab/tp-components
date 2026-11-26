#!/bin/sh
# opam install alcotest.1.10.2 js_of_ocaml.6.5.0 js_of_ocaml-toplevel.6.5.0
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
build_dir=$(mktemp -d)
trap 'rm -rf "$build_dir"' EXIT
cp "$root/scripts/ocaml-runtime/"*.ml "$build_dir/"
cd "$build_dir"
ocamlfind ocamlc -g -linkall -no-check-prims -I "$(ocamlfind query js_of_ocaml)/../stublibs" -package js_of_ocaml,js_of_ocaml-toplevel,alcotest -linkpkg tp_dom.ml tp_alcotest.ml toplevel.ml -o toplevel.byte
jsoo_listunits -o units.txt stdlib js_of_ocaml alcotest
printf 'Tp_dom\nTp_alcotest\n' >> units.txt
js_of_ocaml --toplevel --export units.txt --effects=cps "$(ocamlfind query alcotest)/runtime.js" toplevel.byte -o "$root/public/runtimes/ocaml/toplevel-tests.js"
cp "$root/scripts/ocaml-runtime/tp_alcotest.ml" "$root/scripts/ocaml-runtime/build-tests.sh" "$root/public/runtimes/ocaml/source/"
