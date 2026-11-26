::::::: tp-markdown-viewer { label="tp-markdown-viewer" allow-script preserve-source }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-markdown-viewer
::: script { type="tp/markdown" }
# Live Markdown

Edit this source and select **Run**.
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/markdown/markdown.js";
import "/components/markdown-viewer/markdown-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-markdown-viewer");
element1.append(document.createTextNode("\n      "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/markdown");
element2.textContent = "\n        # Live Markdown\n\n        Edit this source and select **Run**.\n      ";
element1.append(element2);
element1.append(document.createTextNode("\n    "));
example.append(element1);

document.body.append(example);
:::
```

```` example {label="Multiple examples"}
:::: tp-markdown-viewer
::: script { type="tp/markdown" }
``` example {label="Paragraph and list"}
A paragraph with **strong text** and *emphasis*.

- Alpha
- Beta
```

``` example {label="Table"}
| Language | Purpose |
| --- | --- |
| Markdown | Technical writing |
| HTML | Web documents |
```
:::
::::
````

``` example {label="Compare presentation modes"}
::::: section
### mode="default" — Standard controls

Open Code to edit the source, then click Run or press :kbd:Shift{}+:kbd:Enter{} in the editor.

:::: tp-markdown-viewer { mode="default" }
::: script { type="tp/markdown" }
## Viewer modes

Change this **message**, then run the source.
:::
::::
:::::

::::: section
### mode="lite" — Compact controls

Open Code to edit the source, then click Run or press :kbd:Shift{}+:kbd:Enter{} in the editor.

:::: tp-markdown-viewer { mode="lite" }
::: script { type="tp/markdown" }
## Viewer modes

Change this **message**, then run the source.
:::
::::
:::::

::::: section
### mode="simple" — Editor and rendered output only

Edit the code below, keep the cursor in the editor and press :kbd:Shift{}+:kbd:Enter{} (Return) to run it. This viewer has no Run button.

:::: tp-markdown-viewer { mode="simple" }
::: script { type="tp/markdown" }
## Viewer modes

Change this **message**, then run the source.
:::
::::
:::::
```
::::::
:::::::
