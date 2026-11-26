::::: tp-markdown-viewer { label="tp-prolog-tracer" allow-script preserve-source }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-prolog-tracer { src="/docs/components/prolog-tracer/examples/family.pl" query="ancestor(ann, Who)." }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/prolog/prolog.js";
import "/components/prolog-tracer/prolog-tracer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-prolog-tracer");
element1.setAttribute("src", "/docs/components/prolog-tracer/examples/family.pl");
element1.setAttribute("query", "ancestor(ann, Who).");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Recursion"}
::: tp-prolog-tracer { src="/docs/components/prolog-tracer/examples/recursion.pl" query="factorial(4, F)." }
:::
```

``` example {label="Failure"}
::: tp-prolog-tracer { src="/docs/components/prolog-tracer/examples/failure.pl" query="share(Drink)." }
:::
```

``` example {label="Cut"}
::: tp-prolog-tracer { src="/docs/components/prolog-tracer/examples/cut.pl" query="choose(Color)." }
:::
```

``` example {label="Exception"}
::: tp-prolog-tracer { src="/docs/components/prolog-tracer/examples/exception.pl" query="divide(X)." }
:::
```

``` example {label="Replay a saved trace"}
::: tp-prolog-tracer { trace="/docs/components/prolog-tracer/examples/family.trace.json" }
:::
```
::::
:::::
