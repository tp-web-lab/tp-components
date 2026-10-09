::::::: tp-markdown-viewer { label="tp-checkbox-list" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-checkbox-list { name="topics" value="1,3" }
- HTML

- CSS

- JavaScript
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="label-position" label="label-position" label-position="top" orientation="horizontal" value="1" }
- top

- bottom

- start

- end
:::

::: tp-radio-list { data-setting="orientation" label="orientation" label-position="top" orientation="horizontal" value="2" }
- horizontal

- vertical
:::

:::: tp-cluster
::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="name" label="name" value placeholder clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="checkbox-list attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/checkbox-list/examples/attributes.js" }
:::
```
::::::
:::::::
