:::::: tp-markdown-viewer { label="tp-restructuredtext-single-page" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-restructuredtext-single-page
::: script { type="tp/restructuredtext" }
A short guide
========================================

This document is rendered as a single page.

Getting started
----------------------------------------

* Read the introduction
* Try a component
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/restructuredtext/restructuredtext.js";
import "/components/restructuredtext-single-page/restructuredtext-single-page.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-restructuredtext-single-page");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/restructuredtext");
element2.textContent = "\nA short guide\n========================================\n\nThis document is rendered as a single page.\n\nGetting started\n----------------------------------------\n\n* Read the introduction\n* Try a component\n  ";
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
