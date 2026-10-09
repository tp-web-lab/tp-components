::::::: tp-markdown-viewer { label="tp-cover" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-cover { min-height="16rem" heading="h2" }
A short introduction

## A heading centered in the cover

Supporting information stays below.
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
:::: tp-cluster
::: tp-textfield { data-setting="gap" label="gap" value="1rem" placeholder="1rem" clearable }
:::

::: tp-textfield { data-setting="heading" label="heading" value placeholder clearable }
:::

::: tp-textfield { data-setting="min-height" label="min-height" value="100vh" placeholder="100vh" clearable }
:::

::: tp-textfield { data-setting="padding" label="padding" value="1rem" placeholder="1rem" clearable }
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

::: tp-iframe { id="attributes-frame" title="cover attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/cover/examples/attributes.js" }
:::
```
::::::
:::::::
