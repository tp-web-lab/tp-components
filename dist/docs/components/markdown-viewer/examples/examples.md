:::::: tp-markdown-viewer { label="tp-markdown-viewer" allow-script }
::::: script { type="tp/markdown" }
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
:::::
::::::
