#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
build_dir=$(mktemp -d)
trap 'rm -rf "$build_dir"' EXIT
cp "$root/scripts/ocaml-runtime/"*.ml "$build_dir/"
cd "$build_dir"
ocamlfind ocamlc -g -linkall -no-check-prims -I "$(ocamlfind query js_of_ocaml)/../stublibs" -package js_of_ocaml,js_of_ocaml-toplevel -linkpkg tp_dom.ml tp_trace.ml toplevel.ml -o tracer.byte
jsoo_listunits -o units.txt stdlib js_of_ocaml
printf 'Tp_dom\nTp_trace\n' >> units.txt
js_of_ocaml --toplevel --export units.txt --effects=cps tracer.byte -o "$root/public/runtimes/ocaml/tracer.js"
cp "$root/scripts/ocaml-runtime/tp_trace.ml" "$root/public/runtimes/ocaml/source/"
cp "$root/scripts/ocaml-runtime/build-tracer.sh" "$root/public/runtimes/ocaml/source/"
