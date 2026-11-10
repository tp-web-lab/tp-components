::::: tp-markdown-viewer { label="tp-spreadsheet-editor" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-spreadsheet-editor { src="/docs/components/spreadsheet-editor/examples/budget.csv" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/spreadsheet-editor/spreadsheet-editor.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-spreadsheet-editor");
element1.setAttribute("src", "/docs/components/spreadsheet-editor/examples/budget.csv");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
