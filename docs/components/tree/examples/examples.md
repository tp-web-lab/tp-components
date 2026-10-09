::::::: tp-markdown-viewer { label="tp-tree" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-tree { selectable guides level="2" }
- Project

  - Documentation

    - Getting started

    - Examples

  - Source code

  - README.md
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- draggable

- editable

- guides

- selectable
:::

:::: tp-cluster
::: tp-textfield { data-setting="level" label="level" value="1" placeholder="1" clearable }
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

::: tp-iframe { id="attributes-frame" title="tree attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/tree/examples/attributes.js" }
:::
```
::::::
:::::::
