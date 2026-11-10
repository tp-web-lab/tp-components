:::::: tp-markdown-viewer { label="tp-numberfield" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-cluster
::: tp-numberfield { label="Quantity" value="3" min="0" max="10" clearable }
:::

::: tp-numberfield { label="Level" value="40" min="0" max="100" step="5" range clearable }
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/cluster/cluster.js";
import "/components/numberfield/numberfield.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-cluster");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-numberfield");
element2.setAttribute("label", "Quantity");
element2.setAttribute("value", "3");
element2.setAttribute("min", "0");
element2.setAttribute("max", "10");
element2.setAttribute("clearable", "");
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("tp-numberfield");
element3.setAttribute("label", "Level");
element3.setAttribute("value", "40");
element3.setAttribute("min", "0");
element3.setAttribute("max", "100");
element3.setAttribute("step", "5");
element3.setAttribute("range", "");
element3.setAttribute("clearable", "");
element1.append(element3);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Inline named field"}
Value: :tp-numberfield:`identifier`{value="12" placeholder="Enter a value"}
```
:::::
::::::
