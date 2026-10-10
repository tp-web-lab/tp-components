::::::: tp-markdown-viewer { label="tp-frame" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-frame { aspect-ratio="16:9" style="max-width: 24rem;" }
![tp-components logo](/docs/medias/logos/logo-tp.svg)
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
:::: tp-cluster
::: tp-textfield { data-setting="aspect-ratio" label="aspect-ratio" value="16:9" placeholder="16:9" clearable }
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

::: tp-iframe { id="attributes-frame" title="frame attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/frame/examples/attributes.js" }
:::
```
::::::
:::::::
