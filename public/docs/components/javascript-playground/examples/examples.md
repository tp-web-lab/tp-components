::::: tp-markdown-viewer { label="tp-javascript-playground" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-javascript-playground { src="/docs/components/_shared/intro-projects/javascript.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/javascript-playground/javascript-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-javascript-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/javascript.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Single source file"}
::: tp-javascript-playground { src="/docs/components/_shared/single-source/example.js" }
:::
```
::::
:::::
