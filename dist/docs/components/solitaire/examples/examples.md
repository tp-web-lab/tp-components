::::: tp-markdown-viewer { label="tp-solitaire" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-solitaire
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/solitaire/solitaire.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-solitaire");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="32 cards with red back"}
::: tp-solitaire { deck-size="32" back="red" }
:::
```
::::
:::::
