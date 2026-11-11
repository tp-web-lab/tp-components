:::::: tp-markdown-viewer { label="tp-toc" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { data-tp-toc-scope }
::: tp-toc { label="On this page" open expand-all }
:::

## Getting started

Choose a heading in the table of contents to jump to its section.

### Installation

Install the library in your project.

### First component

Add your first interactive component.
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/toc/toc.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.setAttribute("data-tp-toc-scope", "");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-toc");
element2.setAttribute("label", "On this page");
element2.setAttribute("open", "");
element2.setAttribute("expand-all", "");
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("h2");
element3.append(document.createTextNode("Getting started"));
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("p");
element4.append(document.createTextNode("Choose a heading in the table of contents to jump to its section."));
element1.append(element4);
element1.append(document.createTextNode("\n  "));

const element5 = document.createElement("h3");
element5.append(document.createTextNode("Installation"));
element1.append(element5);

const element6 = document.createElement("p");
element6.append(document.createTextNode("Install the library in your project."));
element1.append(element6);
element1.append(document.createTextNode("\n  "));

const element7 = document.createElement("h3");
element7.append(document.createTextNode("First component"));
element1.append(element7);

const element8 = document.createElement("p");
element8.append(document.createTextNode("Add your first interactive component."));
element1.append(element8);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
