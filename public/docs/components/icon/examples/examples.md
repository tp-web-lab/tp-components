::::: tp-markdown-viewer { label="tp-icon" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:tp-icon:{name="heart" size="3rem" aria-label="Heart"}
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/icon/icon.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-icon");
element1.setAttribute("name", "heart");
element1.setAttribute("size", "3rem");
element1.setAttribute("aria-label", "Heart");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
