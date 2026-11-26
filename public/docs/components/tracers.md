# Tracers

Tracers record a program's execution and let you inspect its source, output, variables, call stack and object references step by step. Save a recording as JSON to replay it without executing the program again.

JavaScript, TypeScript, Python, Scheme and OCaml share **Step over**, **Step out** and **Start at query** commands. These navigate existing recordings without removing skipped steps. Provide a separate `query`, or open the trace from an interpreter, to retain the boundary between initialization and the query. [Browser verification](../appendices/tracer-semantic-navigation.md).

::: tp-center {intrinsic}
:tp-icon:{name="javascript-tracer" library="components" size="4em"}

[tp-javascript-tracer](javascript-tracer/index.md)
:::

::: tp-center {intrinsic}
:tp-icon:{name="python-tracer" library="components" size="4em"}

[tp-python-tracer](python-tracer/index.md)
:::

::: tp-center {intrinsic}
:tp-icon:{name="typescript-tracer" library="components" size="4em"}

[tp-typescript-tracer](typescript-tracer/index.md)
:::

::: tp-center {intrinsic}
:tp-icon:{name="scheme-tracer" library="components" size="4em"}

[tp-scheme-tracer](scheme-tracer/index.md)
:::

::: tp-center {intrinsic}
:tp-icon:{name="ocaml-tracer" library="components" size="4em"}

[tp-ocaml-tracer](ocaml-tracer/index.md)
:::

The Prolog tracer uses SWI-Prolog debugger events to show explored goals, clause attempts, backtracking and solutions as a resolution tree.

::: tp-center {intrinsic}
:tp-icon:{name="prolog-tracer" library="components" size="4em"}

[tp-prolog-tracer](prolog-tracer/index.md)
:::

[Expression values: cross-browser verification](../appendices/tracer-expression-values.md) covers intermediate results, source highlights, side effects and saved-trace replay.
