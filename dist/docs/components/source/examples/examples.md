:::::: tp-markdown-viewer { label="tp-source" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box
Open the source repository for this library.

::: tp-source { url="https://github.com/tp-web-lab/tp-components" }
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/source/source.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("p");
element2.append(document.createTextNode("Open the source repository for this library."));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("tp-source");
element3.setAttribute("url", "https://github.com/tp-web-lab/tp-components");
element1.append(element3);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Repository providers"}
GitHub

::: tp-source { url="https://github.com/tp-web-lab/tp-components" }
:::

GitLab

::: tp-source { url="https://gitlab.com" }
:::

Generic Git address (illustrative)

::: tp-source { url="https://example.com/project.git" }
:::
```
:::::
::::::
