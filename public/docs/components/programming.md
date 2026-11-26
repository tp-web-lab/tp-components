# Programming

Explore programming languages through interactive interpreters, notebooks, playgrounds and viewers. The languages below illustrate complementary approaches to types, computation and program structure; a language can support several paradigms.

## Languages and type systems

| Language / component | Type system | Main paradigms | Topics to explore |
| --- | --- | --- | --- |
| :tp-icon:{name="file_type_javascript" library="languages" size="1.25em" aria-hidden="true"} [JavaScript — tp-javascript](javascript/index.md) | Dynamic, with frequent implicit conversions | Imperative, prototype-based object-oriented, functional | DOM manipulation, events, asynchronous programming |
| :tp-icon:{name="file_type_ocaml" library="languages" size="1.25em" aria-hidden="true"} [OCaml — tp-ocaml](ocaml/index.md) | Static, with type inference and polymorphism | Functional, imperative, object-oriented | Algebraic data types, pattern matching, modules |
| :tp-icon:{name="file_type_prolog" library="languages" size="1.25em" aria-hidden="true"} [Prolog — tp-prolog](prolog/index.md) | Dynamic, based on terms and unification | Logic, declarative, constraint programming | Relations, backtracking, finite-domain constraints, metaprogramming |
| :tp-icon:{name="file_type_python" library="languages" size="1.25em" aria-hidden="true"} [Python — tp-python](python/index.md) | Dynamic; optional annotations can be checked by external tools | Imperative, object-oriented, functional | Algorithms, data processing, generators |
| :tp-icon:{name="file_type_scheme" library="languages" size="1.25em" aria-hidden="true"} [Scheme — tp-scheme](scheme/index.md) | Dynamic | Primarily functional, also imperative | Recursion, first-class functions, lexical scope, code as data |
| :tp-icon:{name="file_type_sql" library="languages" size="1.25em" aria-hidden="true"} [SQL — tp-sql-playground](sql-playground/index.md) | Types belong to values, columns and expressions; enforcement depends on the database engine | Declarative, relational | Queries, joins, aggregation, sets of records |
| :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript — tp-typescript](typescript/index.md) | Static, structural, with type inference; types are erased at runtime | JavaScript's paradigms | Interfaces, unions, generics, static checking |
The SQL components use SQLite, whose ordinary tables have flexible typing and column affinities rather than strict static column typing. Python annotations are not runtime type checks. Likewise, TypeScript's type system describes the language and its tooling: executing code after transpilation does not by itself guarantee that full static checking has taken place.

## Programming approaches

| Approach | Languages and components |
| --- | --- |
| Imperative programming and algorithms | :tp-icon:{name="file_type_javascript" library="languages" size="1.25em" aria-hidden="true"} [JavaScript](javascript/index.md), :tp-icon:{name="file_type_ocaml" library="languages" size="1.25em" aria-hidden="true"} [OCaml](ocaml/index.md), :tp-icon:{name="file_type_python" library="languages" size="1.25em" aria-hidden="true"} [Python](python/index.md), :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript](typescript/index.md) |
| Functional programming | :tp-icon:{name="file_type_javascript" library="languages" size="1.25em" aria-hidden="true"} [JavaScript](javascript/index.md), :tp-icon:{name="file_type_ocaml" library="languages" size="1.25em" aria-hidden="true"} [OCaml](ocaml/index.md), :tp-icon:{name="file_type_python" library="languages" size="1.25em" aria-hidden="true"} [Python](python/index.md), :tp-icon:{name="file_type_scheme" library="languages" size="1.25em" aria-hidden="true"} [Scheme](scheme/index.md), :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript](typescript/index.md) |
| Object-oriented programming | :tp-icon:{name="file_type_javascript" library="languages" size="1.25em" aria-hidden="true"} [JavaScript](javascript/index.md), :tp-icon:{name="file_type_ocaml" library="languages" size="1.25em" aria-hidden="true"} [OCaml](ocaml/index.md), :tp-icon:{name="file_type_python" library="languages" size="1.25em" aria-hidden="true"} [Python](python/index.md), :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript](typescript/index.md) |
| Logic and constraint programming | :tp-icon:{name="file_type_prolog" library="languages" size="1.25em" aria-hidden="true"} [Prolog](prolog/index.md) |
| Declarative data queries | :tp-icon:{name="file_type_sql" library="languages" size="1.25em" aria-hidden="true"} [SQL](sql-playground/index.md) |
| Static types and data modelling | :tp-icon:{name="file_type_ocaml" library="languages" size="1.25em" aria-hidden="true"} [OCaml](ocaml/index.md), :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript](typescript/index.md) |
| Event-driven programming and web interfaces | :tp-icon:{name="file_type_javascript" library="languages" size="1.25em" aria-hidden="true"} [JavaScript](javascript/index.md), :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript](typescript/index.md) |
| Metaprogramming and code representation | :tp-icon:{name="file_type_prolog" library="languages" size="1.25em" aria-hidden="true"} [Prolog](prolog/index.md), :tp-icon:{name="file_type_scheme" library="languages" size="1.25em" aria-hidden="true"} [Scheme](scheme/index.md) |
Scheme represents code with Lisp data structures and supports macros. Prolog represents goals and clauses as terms: `call/N` invokes a goal supplied as data, and meta-interpreters can define how those goals are executed. These provide two useful approaches to exploring programs that manipulate other programs.

OCaml and Scheme contrast static and dynamic typing in functional programming. JavaScript and TypeScript illustrate what static type checking adds to a shared execution environment. Prolog and SQL demonstrate different forms of declarative programming.

HTML, Markdown, AsciiDoc, reStructuredText and LaTeX belong to the separate [Markup Languages](markups.md) section: they describe documents, so the static/dynamic typing distinction above does not apply directly.

## Embedded engine sizes

The following measurements cover the base engine files, excluding TP components, editor assets, source maps and optional libraries. Sizes are decimal megabytes (1 MB = 1,000,000 bytes), measured on 2026/11/20 for the versions listed below.

| Language / component | Engine | Version | Uncompressed files (MB) | Gzip-compressed files (MB) |
| --- | --- | --- | ---: | ---: |
| :tp-icon:{name="file_type_javascript" library="languages" size="1.25em" aria-hidden="true"} [JavaScript](javascript/index.md) | Browser JavaScript engine | Built into the browser | 0.00 | 0.00 |
| :tp-icon:{name="file_type_ocaml" library="languages" size="1.25em" aria-hidden="true"} [OCaml](ocaml/index.md) | [Js_of_ocaml toplevel](https://github.com/ocsigen/js_of_ocaml) | OCaml 5.5.2 / Js_of_ocaml 6.5.0 | 21.11 | 5.96 |
| :tp-icon:{name="file_type_prolog" library="languages" size="1.25em" aria-hidden="true"} [Prolog](prolog/index.md) | [SWI-Prolog WASM](https://github.com/SWI-Prolog/npm-swipl-wasm) | SWI-Prolog 10.1.21 / swipl-wasm 8.3.1 | 4.25 | 2.11 |
| :tp-icon:{name="file_type_python" library="languages" size="1.25em" aria-hidden="true"} [Python](python/index.md) | [Pyodide](https://pyodide.org/) | 0.29.3 | 12.28 | 5.47 |
| :tp-icon:{name="file_type_scheme" library="languages" size="1.25em" aria-hidden="true"} [Scheme](scheme/index.md) | [LIPS](https://lips.js.org/) | 1.0.0-beta.23.1 | 0.40 | 0.18 |
| :tp-icon:{name="file_type_sql" library="languages" size="1.25em" aria-hidden="true"} [SQL](sql-playground/index.md) | [SQLite / sql.js](https://sql.js.org/) | sql.js 1.13.0 | 0.71 | 0.34 |
| :tp-icon:{name="file_type_typescript" library="languages" size="1.25em" aria-hidden="true"} [TypeScript](typescript/index.md) | [TypeScript compiler](https://www.typescriptlang.org/) | 6.0.3 | 3.47 | 0.97 |
JavaScript requires no additional language engine: it uses the one already provided by the browser, such as [V8](https://v8.dev/), [SpiderMonkey](https://spidermonkey.dev/) or [JavaScriptCore](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html). TypeScript uses that same engine after transpilation.

“Uncompressed” means without outer HTTP compression; internal archives, such as Python's standard-library ZIP file, remain compressed. These figures describe file sizes, not runtime memory consumption. The gzip column was calculated with compression level 6 for a consistent comparison; actual downloads depend on server compression (gzip or Brotli) and browser caching. Additional Python packages or user libraries increase the total.

## Components

- [Interpreters](interpreters.md)
- [Notebooks](notebooks.md)
- [Playgrounds](playgrounds.md)
- [Viewers](viewers.md)
