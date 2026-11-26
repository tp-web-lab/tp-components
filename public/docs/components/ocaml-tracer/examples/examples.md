::::: tp-markdown-viewer { label="tp-ocaml-tracer" allow-script preserve-source }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/recursion.ml" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/ocaml/ocaml.js";
import "/components/ocaml-tracer/ocaml-tracer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-ocaml-tracer");
element1.setAttribute("src", "/docs/components/ocaml-tracer/examples/recursion.ml");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Subexpressions on one line"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/same-line.ml" }
:::
```

``` example {label="Shared arrays and references"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/shared.ml" }
:::
```

``` example {label="Closures"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/closures.ml" }
:::
```

``` example {label="Pattern matching"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/patterns.ml" }
:::
```

``` example {label="Caught exception"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/caught.ml" }
:::
```

``` example {label="Uncaught exception"}
::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/error.ml" }
:::
```

``` example {label="Replay a saved trace"}
::: tp-ocaml-tracer {trace="/docs/components/ocaml-tracer/examples/recursion.trace.json"}
:::
```

``` example {label="Nested calls and a separate query"}
Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/nested-calls.ml" query="print_int (fact 4);;" }
:::
```

``` example {label="Constant expressions and intermediate values"}
Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again. Follow the order reported by the OCaml engine: it differs from the JavaScript and Scheme examples.

::: tp-ocaml-tracer { src="/docs/components/ocaml-tracer/examples/constant-expressions.ml" }
:::
```
::::
:::::
