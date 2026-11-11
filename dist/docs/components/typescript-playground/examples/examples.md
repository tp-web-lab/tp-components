::::: tp-markdown-viewer { label="tp-typescript-playground" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-typescript-playground { src="/docs/components/_shared/intro-projects/typescript.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/typescript-playground/typescript-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-typescript-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/typescript.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Single source file"}
::: tp-typescript-playground { src="/docs/components/_shared/single-source/example.ts" }
:::
```
::::
:::::
