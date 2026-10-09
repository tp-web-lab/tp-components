::::::: tp-markdown-viewer { label="tp-avatar-group" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-avatar-group
::: tp-avatar { initials="AL" label="Ada Lovelace" }
:::

::: tp-avatar { initials="GH" label="Grace Hopper" }
:::

::: tp-avatar { initials="KT" label="Katherine Johnson" }
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="order" label="order" label-position="top" orientation="horizontal" value="1" }
- ltr

- rtl
:::

::: tp-radio-list { data-setting="orientation" label="orientation" label-position="top" orientation="horizontal" value="1" }
- horizontal

- vertical
:::

:::: tp-cluster
::: tp-textfield { data-setting="offset" label="offset" value="0.75rem" placeholder="0.75rem" clearable }
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

::: tp-iframe { id="attributes-frame" title="avatar-group attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/avatar-group/examples/attributes.js" }
:::
```
::::::
:::::::
