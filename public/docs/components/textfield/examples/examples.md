::::: tp-markdown-viewer { label="tp-textfield" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-textfield { label="Single line" placeholder="Type some text..." clearable }
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
