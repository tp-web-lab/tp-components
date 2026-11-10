::::: tp-markdown-viewer { label="tp-iframe" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-iframe { src="/docs/components/iframe/examples/welcome.html" title="A document inside an iframe" style="height: 12rem;" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/iframe/iframe.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-iframe");
element1.setAttribute("src", "/docs/components/iframe/examples/welcome.html");
element1.setAttribute("title", "A document inside an iframe");
element1.setAttribute("style", "height: 12rem;");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
