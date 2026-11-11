::::: tp-markdown-viewer { label="tp-color-picker" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-color-picker
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/color/color.js";
import "/components/color-picker/color-picker.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-color-picker");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
