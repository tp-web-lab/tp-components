::::: tp-markdown-viewer { label="tp-loto" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-loto
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/loto/loto.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-loto");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
