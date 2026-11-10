::::: tp-markdown-viewer { label="tp-graph-nfa" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-nfa
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/graph-nfa/graph-nfa.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-graph-nfa");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
