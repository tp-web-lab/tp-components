::::::: tp-markdown-viewer { label="tp-compare" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-compare { position="50%" before-label="Before" after-label="After" style="height: 12rem;" }
::: tp-box { slot="before" style="height: 100%; background: var(--tp-neutral-100);" }
Before: the original design
:::

::: tp-box { slot="after" style="height: 100%; background: var(--tp-brand-100);" }
After: the updated design
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="orientation" label="orientation" label-position="top" orientation="horizontal" value="1" }
- horizontal

- vertical
:::

:::: tp-cluster
::: tp-textfield { data-setting="after-label" label="after-label" value placeholder clearable }
:::

::: tp-textfield { data-setting="before-label" label="before-label" value placeholder clearable }
:::

::: tp-textfield { data-setting="position" label="position" value placeholder clearable }
:::

::: tp-textfield { data-setting="storage-key" label="storage-key" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="compare attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/compare/examples/attributes.js" }
:::
```
::::::
:::::::
