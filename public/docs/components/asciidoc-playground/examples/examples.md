::::: tp-markdown-viewer { label="tp-asciidoc-playground" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-asciidoc-playground { src="/docs/components/_shared/intro-projects/asciidoc.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/asciidoc/asciidoc.js";
import "/components/asciidoc-playground/asciidoc-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-asciidoc-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/asciidoc.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Single source file"}
::: tp-asciidoc-playground { src="/docs/components/_shared/single-source/example.adoc" }
:::
```
::::
:::::
