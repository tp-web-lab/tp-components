::::: tp-markdown-viewer { label="tp-speech-to-text" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-speech-to-text { lang="en-US" interim-results }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/speech-to-text/speech-to-text.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-speech-to-text");
element1.setAttribute("lang", "en-US");
element1.setAttribute("interim-results", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="French"}
::: tp-speech-to-text { lang="fr-FR" }
:::
```

``` example {label="Recording"}
::: tp-speech-to-text { lang="en-GB" continuous interim-results record }
:::
```
::::
:::::
