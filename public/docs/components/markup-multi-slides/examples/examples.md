::::: tp-markdown-viewer { label="tp-markup-multi-slides" allow-script style="--tp-markup-viewer-frame-min-height: 32rem" }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/docs" label="Mixed markup slides" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/markup-multi-slides/markup-multi-slides.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-markup-multi-slides");
element1.setAttribute("repository", "/docs/components/markup-multi-slides/docs");
element1.setAttribute("label", "Mixed markup slides");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Slides navigation menu"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/docs" label="Mixed markup slides" menu }
:::
```

``` example {label="Automatic notes"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/automatic/html" auto="notes" timing="5000" label="Automatic notes" }
:::
```

``` example {label="Timed steps"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/automatic/html" auto="timing" timing="5000" label="Timed steps" }
:::
```
::::
:::::
