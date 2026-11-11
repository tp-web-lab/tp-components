:::::: tp-markdown-viewer { label="tp-grid" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-grid { min-width="12rem" gap="1rem" }
::: tp-box
First column
:::

::: tp-box
Second column
:::

::: tp-box
Third column
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/grid/grid.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-grid");
element1.setAttribute("min-width", "12rem");
element1.setAttribute("gap", "1rem");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-box");
element2.append(document.createTextNode("First column"));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("tp-box");
element3.append(document.createTextNode("Second column"));
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("tp-box");
element4.append(document.createTextNode("Third column"));
element1.append(element4);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
