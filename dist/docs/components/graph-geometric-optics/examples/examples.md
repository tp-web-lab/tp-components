::::: tp-markdown-viewer { label="tp-graph-geometric-optics" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-geometric-optics { id="optics-example" grid grid-size="20" message="Move the lens or screen and inspect the paraxial analysis." src="/docs/components/graph-geometric-optics/examples/converging-lens.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/graph-geometric-optics/graph-geometric-optics.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-graph-geometric-optics");
element1.setAttribute("id", "optics-example");
element1.setAttribute("grid", "");
element1.setAttribute("grid-size", "20");
element1.setAttribute("message", "Move the lens or screen and inspect the paraxial analysis.");
element1.setAttribute("src", "/docs/components/graph-geometric-optics/examples/converging-lens.json");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
