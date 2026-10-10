::::::: tp-markdown-viewer { label="tp-tabs" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-tabs
Tab 1
:
  Content of panel :tp-icon:{size="2em" name="numeric-1"}

Tab 2
:
  Content of panel :tp-icon:{size="2em" name="numeric-2"}

Tab 3
:
  Content of panel :tp-icon:{size="2em" name="numeric-3"}

Tab 4
:
  Content of panel :tp-icon:{size="2em" name="numeric-4"}
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="activation" label="activation" label-position="top" orientation="horizontal" value="1" }
- auto

- manual
:::

::: tp-radio-list { data-setting="orientation" label="orientation" label-position="top" orientation="horizontal" value="1" }
- horizontal

- vertical
:::

:::: tp-cluster
::: tp-textfield { data-setting="selected" label="selected" value="0" placeholder="0" clearable }
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

::: tp-iframe { id="attributes-frame" title="tabs attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/tabs/examples/attributes.js" }
:::
```
::::::
:::::::
