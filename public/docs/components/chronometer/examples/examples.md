::::: tp-markdown-viewer { label="tp-chronometer" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-chronometer
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/chronometer/chronometer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-chronometer");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
