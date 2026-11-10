::::: tp-markdown-viewer { label="tp-base" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-base
This element provides the common tp-components foundation.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/base/base.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-base");
element1.append(document.createTextNode("This element provides the common tp-components foundation."));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
