::::: tp-markdown-viewer { label="tp-textfield" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-textfield { label="Single line" placeholder="Type some text..." clearable }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/textfield/textfield.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-textfield");
element1.setAttribute("label", "Single line");
element1.setAttribute("placeholder", "Type some text...");
element1.setAttribute("clearable", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Inline named field"}
Value: :tp-textfield:`identifier`{value="Ada" placeholder="Enter a value"}
```

``` example {label="Clearable search"}
::: tp-textfield { label="Search" value="Garden" clearable }
:::
```
::::
:::::
