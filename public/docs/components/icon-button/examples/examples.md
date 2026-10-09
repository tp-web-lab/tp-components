::::::: tp-markdown-viewer { label="tp-icon-button" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { data-intro-action="counter" data-allow-script }
Activate the heart button to add a like.

::: tp-icon-button { name="heart" label="Like this example" data-demo-trigger }
:::

::: p { data-demo-status role="status" }
Likes: 0
:::

::: script { src="/docs/components/_shared/introduction-actions.js" }
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- disabled

- flip-h

- flip-v

- spin
:::

::: tp-radio-list { data-setting="size" label="size" label-position="top" orientation="horizontal" value="4" }
- xxs

- xs

- s

- m

- l

- xl

- xxl
:::

::: tp-radio-list { data-setting="type" label="type" label-position="top" orientation="horizontal" value="1" }
- button

- submit

- reset
:::

::: tp-radio-list { data-setting="variant" label="variant" label-position="top" orientation="horizontal" value="5" }
- success

- danger

- warning

- info

- neutral

- brand
:::

:::: tp-cluster
::: tp-textfield { data-setting="color" label="color" value placeholder clearable }
:::

::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="library" label="library" value placeholder clearable }
:::

::: tp-textfield { data-setting="name" label="name" value placeholder clearable }
:::

::: tp-textfield { data-setting="rotate" label="rotate" value="0deg" placeholder="0deg" clearable }
:::

::: tp-textfield { data-setting="scale" label="scale" value="1" placeholder="1" clearable }
:::
::::

:::: tp-button-group
::: tp-button { id="attributes-reset" type="button" }
Reset defaults
:::

::: tp-button { id="attributes-reload" type="button" }
Reload preview
:::
::::
:::::

::: tp-divider
:::

### Preview

::: tp-iframe { id="attributes-frame" title="icon-button attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/icon-button/examples/attributes.js" }
:::
```
::::::
:::::::
