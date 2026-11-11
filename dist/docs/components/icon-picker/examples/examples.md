::::: tp-markdown-viewer { label="tp-icon-picker" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-icon-picker
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/icon/icon.js";
import "/components/icon-picker/icon-picker.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-icon-picker");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
