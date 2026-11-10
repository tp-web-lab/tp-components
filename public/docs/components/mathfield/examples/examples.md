::::: tp-markdown-viewer { label="tp-mathfield" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-mathfield { label="Formula" value="E = mc^2" clearable }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/math/math.js";
import "/components/mathfield/mathfield.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-mathfield");
element1.setAttribute("label", "Formula");
element1.setAttribute("value", "E = mc^2");
element1.setAttribute("clearable", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Inline in prose"}
Einstein's equation :tp-mathfield:`energy`{value="E = mc^2"} relates mass and energy.
```

``` example {label="Inline named field"}
Value: :tp-mathfield:`identifier`{value="E = mc^2" placeholder="Enter a value"}
```
::::
:::::
