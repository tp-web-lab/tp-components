::::::: tp-markdown-viewer { label="tp-mask" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-textfield { id="mask-answer" label="Answer" value="Thursday" clearable }
:::

::: tp-mask { anchor="#mask-answer" active }
The answer is hidden until the review.
:::
```

``` example {label="Attributes"}
Enter `#mask-answer` in anchor, then enable active. Edit the answer before masking it and check that the value returns when active is unchecked. Clear anchor or use Reset defaults to restore the inactive defaults. Reload preview recreates the target with its initial value.

::::: tp-stack
::: tp-checkbox-list { id="mask-active" label="Boolean attributes" label-position="top" orientation="horizontal" }
- active
:::

::: tp-textfield { id="mask-anchor" label="anchor" label-position="top" placeholder clearable }
:::

:::: tp-button-group
::: tp-button { id="mask-reset" }
Reset defaults
:::

::: tp-button { id="mask-reload" }
Reload preview
:::
::::
:::::

::: tp-divider
:::

:::: tp-stack { id="mask-preview" }
::: tp-textfield { id="mask-answer" label="Answer" value="Thursday" clearable }
:::

::: tp-mask
The answer is hidden until the review.
:::
::::

::: script { type="module" src="/docs/components/mask/examples/attributes.js" }
:::
```
::::::
:::::::
