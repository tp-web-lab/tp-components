::::: tp-markdown-viewer { label="tp-puzzle" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-puzzle { src="/docs/components/puzzle/examples/landscape.svg" pieces="12" alt="Mountain lake at sunrise" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/puzzle/puzzle.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-puzzle");
element1.setAttribute("src", "/docs/components/puzzle/examples/landscape.svg");
element1.setAttribute("pieces", "12");
element1.setAttribute("alt", "Mountain lake at sunrise");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Square pieces"}
::: tp-puzzle { src="/docs/components/puzzle/examples/landscape.svg" pieces="9" shape="square" exact-orientation alt="Mountain lake at sunrise" }
:::
```

``` example {label="Triangular pieces"}
::: tp-puzzle { src="/docs/components/puzzle/examples/landscape.svg" pieces="12" shape="triangle" alt="Mountain lake at sunrise" }
:::
```

``` example {label="Hexagonal pieces"}
::: tp-puzzle { src="/docs/components/puzzle/examples/landscape.svg" pieces="13" shape="hexagon" alt="Mountain lake at sunrise" }
:::
```
::::
:::::
