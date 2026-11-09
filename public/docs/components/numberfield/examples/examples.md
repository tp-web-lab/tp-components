:::::: tp-markdown-viewer { label="tp-numberfield" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-cluster
::: tp-numberfield { label="Quantity" value="3" min="0" max="10" clearable }
:::

::: tp-numberfield { label="Level" value="40" min="0" max="100" step="5" range clearable }
:::
::::
```

``` example {label="Inline named field"}
Value: :tp-numberfield:`identifier`{value="12" placeholder="Enter a value"}
```
:::::
::::::
