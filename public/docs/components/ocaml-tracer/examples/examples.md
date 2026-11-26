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
::::
:::::
