::::: tp-markdown-viewer { label="tp-include" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-include { src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/include/include.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-include");
element1.setAttribute("src", "/docs/components/include/examples/welcome.html");
element1.setAttribute("loading", "Loading the shared notice…");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
