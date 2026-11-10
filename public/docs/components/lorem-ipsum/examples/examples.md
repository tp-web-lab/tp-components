::::: tp-markdown-viewer { label="tp-lorem-ipsum" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-lorem-ipsum { length="1" words-per-sentence="8" sentences-per-paragraph="2" seed="42" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/lorem-ipsum/lorem-ipsum.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-lorem-ipsum");
element1.setAttribute("length", "1");
element1.setAttribute("words-per-sentence", "8");
element1.setAttribute("sentences-per-paragraph", "2");
element1.setAttribute("seed", "42");
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
