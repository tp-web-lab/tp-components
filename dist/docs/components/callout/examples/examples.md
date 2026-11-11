::::: tp-markdown-viewer { label="tp-callout" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-callout { variant="info" heading="Information" }
The workshop starts at 9:00.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/callout/callout.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-callout");
element1.setAttribute("variant", "info");
element1.setAttribute("heading", "Information");
element1.append(document.createTextNode("\n  The workshop starts at 9:00.\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Dismissible notice"}
::: tp-callout { variant="success" heading="Saved" closable }
Your changes have been saved.
:::
```

``` example {label="Outlined warning"}
::: tp-callout { variant="warning" heading="Before leaving" outlined }
Save your work before closing this page.
:::
```
::::
:::::
