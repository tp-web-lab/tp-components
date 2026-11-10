::::: tp-markdown-viewer { label="tp-timer" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-timer
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/timer/timer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-timer");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
