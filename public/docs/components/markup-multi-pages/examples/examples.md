::::: tp-markdown-viewer { label="tp-markup-multi-pages" allow-script style="--tp-markup-viewer-frame-min-height: 32rem" }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-markup-multi-pages { repository="/docs/components/markup-multi-pages/docs" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/markup-multi-pages/markup-multi-pages.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-markup-multi-pages");
element1.setAttribute("repository", "/docs/components/markup-multi-pages/docs");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
