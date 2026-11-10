::::: tp-markdown-viewer { label="tp-restructuredtext-playground" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-restructuredtext-playground { src="/docs/components/_shared/intro-projects/restructuredtext.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/restructuredtext/restructuredtext.js";
import "/components/restructuredtext-playground/restructuredtext-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-restructuredtext-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/restructuredtext.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Single source file"}
::: tp-restructuredtext-playground { src="/docs/components/_shared/single-source/example.rst" }
:::
```
::::
:::::
