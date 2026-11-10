::::: tp-markdown-viewer { label="tp-python-playground" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-python-playground { src="/docs/components/_shared/intro-projects/python.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/python-playground/python-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-python-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/python.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Single source file"}
::: tp-python-playground { src="/docs/components/_shared/single-source/example.py" }
:::
```
::::
:::::
