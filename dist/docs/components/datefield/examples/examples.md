::::: tp-markdown-viewer { label="tp-datefield" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-datefield { label="Date" value="2026-09-03" clearable }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/datefield/datefield.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-datefield");
element1.setAttribute("label", "Date");
element1.setAttribute("value", "2026-09-03");
element1.setAttribute("clearable", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Inline named field"}
Value: :tp-datefield:`identifier`{value="2026-10-05" placeholder="Enter a value"}
```
::::
:::::
