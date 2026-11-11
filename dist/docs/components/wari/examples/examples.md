::::: tp-markdown-viewer { label="tp-wari" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-wari { interactive }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/wari/wari.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-wari");
element1.setAttribute("interactive", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Capturing seeds"}
::: tp-wari { position="S:4,0,0,0,3,0,1,2,1,0,0,0:18,19" interactive }
:::
```

``` example {label="Feeding the opponent"}
::: tp-wari { position="S:1,0,0,0,0,1,0,0,0,0,0,0:23,23" interactive }
:::
```

``` example {label="Void grand slam"}
::: tp-wari { position="S:1,0,0,0,0,1,1,0,0,0,0,0:22,23" interactive }
:::
```
::::
:::::
