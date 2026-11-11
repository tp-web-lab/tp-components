::::: tp-markdown-viewer { label="tp-prose-editor" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-prose-editor
## A short editable document

Select a word and use the toolbar to change its **formatting**.

- Write a draft

- Review the content
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/prose-editor/prose-editor.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-prose-editor");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("h2");
element2.append(document.createTextNode("A short editable document"));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("p");
element3.append(document.createTextNode("Select a word and use the toolbar to change its "));

const element4 = document.createElement("strong");
element4.append(document.createTextNode("formatting"));
element3.append(element4);
element3.append(document.createTextNode("."));
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element5 = document.createElement("ul");

const element6 = document.createElement("li");
element6.append(document.createTextNode("Write a draft"));
element5.append(element6);

const element7 = document.createElement("li");
element7.append(document.createTextNode("Review the content"));
element5.append(element7);
element1.append(element5);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
