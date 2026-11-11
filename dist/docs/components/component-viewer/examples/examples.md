::::: tp-markdown-viewer { label="tp-component-viewer" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-component-viewer { tag="tp-button" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/component-viewer/component-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-component-viewer");
element1.setAttribute("tag", "tp-button");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Custom content"}
::: tp-component-viewer { src="/docs/components/component-viewer/examples/button.html" }
:::
```
::::
:::::
