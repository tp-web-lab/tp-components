::::: tp-markdown-viewer { label="tp-clock" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-clock
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/clock/clock.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-clock");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
