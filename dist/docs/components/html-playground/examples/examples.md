::::: tp-markdown-viewer { label="tp-html-playground" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-html-playground { src="/docs/components/_shared/intro-projects/html.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/html-playground/html-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-html-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/html.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Single source file"}
::: tp-html-playground { src="/docs/components/_shared/single-source/example.html" }
:::
```
::::
:::::
