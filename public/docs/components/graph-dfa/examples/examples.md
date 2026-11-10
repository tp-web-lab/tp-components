::::: tp-markdown-viewer { label="tp-graph-dfa" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-dfa { id="dfa-starts-with-ab" grid grid-size="20" src="/docs/components/graph-dfa/examples/starts-with-ab.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/graph-dfa/graph-dfa.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-graph-dfa");
element1.setAttribute("id", "dfa-starts-with-ab");
element1.setAttribute("grid", "");
element1.setAttribute("grid-size", "20");
element1.setAttribute("src", "/docs/components/graph-dfa/examples/starts-with-ab.json");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
