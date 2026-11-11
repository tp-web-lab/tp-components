:::::: tp-markdown-viewer { label="tp-prolog-notebook" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-prolog-notebook
::: script { type="tp/markdown" }
# Family relations

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.
:::

::: script { type="tp/prolog" filename="program.pl" }
parent(ada, byron).
parent(byron, charles).

grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
:::

::: script { type="tp/prolog" filename="query.pl" }
grandparent(ada, Grandchild).
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/prolog-notebook/prolog-notebook.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-prolog-notebook");
element1.append(document.createTextNode("\n      "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/markdown");
element2.textContent = "\n        # Family relations\n\n        Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.\n      ";
element1.append(element2);
element1.append(document.createTextNode("\n      "));

const element3 = document.createElement("script");
element3.setAttribute("type", "tp/prolog");
element3.setAttribute("filename", "program.pl");
element3.textContent = "\n        parent(ada, byron).\n        parent(byron, charles).\n\n        grandparent(X, Z) :- parent(X, Y), parent(Y, Z).\n      ";
element1.append(element3);
element1.append(document.createTextNode("\n      "));

const element4 = document.createElement("script");
element4.setAttribute("type", "tp/prolog");
element4.setAttribute("filename", "query.pl");
element4.textContent = "\n        grandparent(ada, Grandchild).\n      ";
element1.append(element4);
element1.append(document.createTextNode("\n  "));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
