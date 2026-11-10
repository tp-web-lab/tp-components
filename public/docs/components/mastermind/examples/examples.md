::::: tp-markdown-viewer { label="tp-mastermind" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-mastermind { solution="red blue green yellow" attempts="8" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/mastermind/mastermind.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-mastermind");
element1.setAttribute("solution", "red blue green yellow");
element1.setAttribute("attempts", "8");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="mastermind ⭐⭐"}
::: tp-mastermind { solution="orange purple red green" attempts="8" }
:::
```

``` example {label="mastermind ⭐⭐⭐"}
::: tp-mastermind { solution="yellow red purple blue orange" attempts="10" }
:::
```
::::
:::::
