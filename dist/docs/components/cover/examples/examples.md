::::: tp-markdown-viewer { label="tp-cover" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-cover { min-height="16rem" heading="h2" }
A short introduction

## A heading centered in the cover

Supporting information stays below.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/cover/cover.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-cover");
element1.setAttribute("min-height", "16rem");
element1.setAttribute("heading", "h2");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("p");
element2.append(document.createTextNode("A short introduction"));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("h2");
element3.append(document.createTextNode("A heading centered in the cover"));
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("p");
element4.append(document.createTextNode("Supporting information stays below."));
element1.append(element4);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
