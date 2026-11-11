::::: tp-markdown-viewer { label="tp-box" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-box
The custom HTML element `<tp-box>` wraps its content in various ways.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.append(document.createTextNode("\n      The custom HTML element "));

const element2 = document.createElement("code");
element2.append(document.createTextNode("\u003ctp-box>"));
element1.append(element2);
element1.append(document.createTextNode(" wraps its content in various ways.\n    "));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
