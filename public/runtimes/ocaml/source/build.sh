#!/bin/sh
# Run in an opam environment with OCaml 5.5.2, js_of_ocaml and js_of_ocaml-toplevel 6.5.0.
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
build_dir=$(mktemp -d)
trap 'rm -rf "$build_dir"' EXIT
cp "$root/scripts/ocaml-runtime/"*.ml "$build_dir/"
cd "$build_dir"
ocamlfind ocamlc -g -linkall -no-check-prims -I "$(ocamlfind query js_of_ocaml)/../stublibs" -package js_of_ocaml,js_of_ocaml-toplevel -linkpkg tp_dom.ml toplevel.ml -o toplevel.byte
jsoo_listunits -o units.txt stdlib js_of_ocaml
printf 'Tp_dom\n' >> units.txt
js_of_ocaml --toplevel --export units.txt --effects=cps toplevel.byte -o "$root/public/runtimes/ocaml/toplevel.js"

mkdir -p "$root/public/runtimes/ocaml/source"
cp "$root/scripts/ocaml-runtime/"*.ml "$root/public/runtimes/ocaml/source/"
cp "$root/scripts/ocaml-runtime/build.sh" "$root/public/runtimes/ocaml/source/"
