:::::: tp-markdown-viewer { label="tp-python-notebook" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-python-notebook
::: script { type="tp/markdown" }
# Interactive Python

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.
:::

::: script { type="tp/python" }
print("Hello from Python")
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/python-notebook/python-notebook.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-python-notebook");
element1.append(document.createTextNode("\n    "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/markdown");
element2.textContent = "# Interactive Python\n\nSelect **Run all cells** to execute the program. Use the code button in a cell to edit its source.";
element1.append(element2);
element1.append(document.createTextNode("\n    "));

const element3 = document.createElement("script");
element3.setAttribute("type", "tp/python");
element3.textContent = "print(\"Hello from Python\")";
element1.append(element3);
element1.append(document.createTextNode("\n  "));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
