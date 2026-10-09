::::::: tp-markdown-viewer { label="tp-drawer" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::::: tp-box { data-intro-action="drawer" data-allow-script }
::: tp-button { id="intro-drawer-trigger" data-demo-trigger }
Open the drawer
:::

:::: tp-drawer { label="Example drawer" backdrop outside-click }
This panel contains additional information.

::: tp-button { data-demo-close }
Close
:::
::::

::: p { data-demo-status role="status" }
Try the drawer using its trigger.
:::

::: script { src="/docs/components/_shared/introduction-actions.js" }
:::
:::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- backdrop

- contained

- open

- outside-click
:::

::: tp-radio-list { data-setting="placement" label="placement" label-position="top" orientation="horizontal" value="2" }
- top

- end

- bottom

- start
:::

:::: tp-cluster
::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="width" label="width" value="min(24rem, 100vw)" placeholder="min(24rem, 100vw)" clearable }
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

::: tp-iframe { id="attributes-frame" title="drawer attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/drawer/examples/attributes.js" }
:::
```
::::::
:::::::
