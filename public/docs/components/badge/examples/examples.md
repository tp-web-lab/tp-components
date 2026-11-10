:::::: tp-markdown-viewer { label="tp-badge" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
Build status: :tp-badge:`Ready`{variant="success" pulse}
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/badge/badge.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("p");
element1.append(document.createTextNode("\n  Build status: "));

const element2 = document.createElement("tp-badge");
element2.setAttribute("variant", "success");
element2.setAttribute("pulse", "");
element2.append(document.createTextNode("Ready"));
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="With icon"}
:::: tp-badge { outlined }
:tp-icon:{name="file_type_vite" library="languages"} Vite

::: tp-divider { orientation="vertical" }
:::

8.1.5
::::
```

``` example {label="Status labels"}
::: tp-badge { variant="success" }
Complete
:::

::: tp-badge { variant="warning" }
Pending
:::
```
:::::
::::::
