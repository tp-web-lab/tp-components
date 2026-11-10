::::: tp-markdown-viewer { label="tp-markdown-multi-pages" allow-script style="--tp-markup-viewer-frame-min-height: 32rem" }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-markdown-multi-pages
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/markdown/markdown.js";
import "/components/markdown-multi-pages/markdown-multi-pages.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-markdown-multi-pages");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
