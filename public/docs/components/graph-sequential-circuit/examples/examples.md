::::: tp-markdown-viewer { label="tp-graph-sequential-circuit" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-sequential-circuit { id="sequential-counter" grid grid-size="20" message="Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes." src="/docs/components/graph-sequential-circuit/examples/two-bit-counter.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/graph-sequential-circuit/graph-sequential-circuit.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-graph-sequential-circuit");
element1.setAttribute("id", "sequential-counter");
element1.setAttribute("grid", "");
element1.setAttribute("grid-size", "20");
element1.setAttribute("message", "Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes.");
element1.setAttribute("src", "/docs/components/graph-sequential-circuit/examples/two-bit-counter.json");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
