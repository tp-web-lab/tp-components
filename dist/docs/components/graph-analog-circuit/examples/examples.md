::::: tp-markdown-viewer { label="tp-graph-analog-circuit" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-analog-circuit { grid grid-size="20" message="Run the transient analysis and inspect Vin and Vout." src="/docs/components/graph-analog-circuit/examples/rc-filter.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/graph-analog-circuit/graph-analog-circuit.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-graph-analog-circuit");
element1.setAttribute("grid", "");
element1.setAttribute("grid-size", "20");
element1.setAttribute("message", "Run the transient analysis and inspect Vin and Vout.");
element1.setAttribute("src", "/docs/components/graph-analog-circuit/examples/rc-filter.json");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
