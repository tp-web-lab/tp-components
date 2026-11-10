::::: tp-markdown-viewer { label="tp-alarm" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-alarm
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/alarm/alarm.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-alarm");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
