:::::: tp-markdown-viewer { label="tp-stack" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-stack
::: tp-box
Step 1: Write a draft.
:::

::: tp-box
Step 2: Review the content.
:::

::: tp-box
Step 3: Publish the document.
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/stack/stack.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-stack");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-box");
element2.append(document.createTextNode("Step 1: Write a draft."));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("tp-box");
element3.append(document.createTextNode("Step 2: Review the content."));
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("tp-box");
element4.append(document.createTextNode("Step 3: Publish the document."));
element1.append(element4);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
