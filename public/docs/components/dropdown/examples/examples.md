::::::: tp-markdown-viewer { label="tp-dropdown" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { data-intro-action="dropdown" data-allow-script }
::: tp-button { id="intro-dropdown-trigger" data-demo-trigger }
Open the menu
:::

::: tp-dropdown { anchor="#intro-dropdown-trigger" outside-click }
- [Buttons](/#/components/button/index.md)

- [Trees](/#/components/tree/index.md)
:::

::: p { data-demo-status role="status" }
Try the dropdown using its trigger.
:::

::: script { src="/docs/components/_shared/introduction-actions.js" }
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- open

- outside-click
:::

::: tp-radio-list { data-setting="placement" label="placement" label-position="top" orientation="horizontal" value="3" }
- top

- end

- bottom

- start
:::

:::: tp-cluster
::: tp-textfield { data-setting="anchor" label="anchor" value placeholder clearable }
:::

::: tp-textfield { data-setting="offset" label="offset" value="8px" placeholder="8px" clearable }
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

::: tp-iframe { id="attributes-frame" title="dropdown attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/dropdown/examples/attributes.js" }
:::
```
::::::
:::::::
