::::: tp-markdown-viewer { label="tp-frame" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-frame { aspect-ratio="16:9" style="max-width: 24rem;" }
![tp-components logo](/docs/medias/logos/logo-tp.svg)
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/frame/frame.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-frame");
element1.setAttribute("aspect-ratio", "16:9");
element1.setAttribute("style", "max-width: 24rem;");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("img");
element2.setAttribute("src", "/docs/medias/logos/logo-tp.svg");
element2.setAttribute("alt", "tp-components logo");
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
