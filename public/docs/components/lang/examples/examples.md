:::::: tp-markdown-viewer { label="tp-lang" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { data-intro-action="lang" data-allow-script }
Choose English or French to change the message in this isolated example.

::: tp-lang { langs="en,fr" repository="/docs/components/lang/examples" }
:::

::: h2 { data-demo-translation }
Welcome to this example.
:::

::: script { src="/docs/components/_shared/introduction-actions.js" }
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/lang/lang.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.setAttribute("data-intro-action", "lang");
element1.setAttribute("data-allow-script", "");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("p");
element2.append(document.createTextNode("Choose English or French to change the message in this isolated example."));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("tp-lang");
element3.setAttribute("langs", "en,fr");
element3.setAttribute("repository", "/docs/components/lang/examples");
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("h2");
element4.setAttribute("data-demo-translation", "");
element4.append(document.createTextNode("Welcome to this example."));
element1.append(element4);
element1.append(document.createTextNode("\n  "));

const element5 = document.createElement("script");
element5.setAttribute("src", "/docs/components/_shared/introduction-actions.js");
element1.append(element5);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
