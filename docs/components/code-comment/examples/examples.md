::::::: tp-markdown-viewer { label="tp-code-comment" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-code-editor { id="commented-function" language="typescript" }
::: script { type="tp/typescript" }
function f(x: number): number {
  if (x > 0) { return 2 * x; } // <1>
  else { return 4 * x; } // <2>
}
:::
::::

::: tp-code-comment { for="commented-function" }
1. Positive values are doubled.

2. Zero and negative values are multiplied by four.
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

The preview code editor has `id="commented-function"`. Enter `commented-function` in `for` to link the comments, then enable `open` to display the list. Hover the numbered code markers to read their tooltips even when the list is hidden.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- open
:::

:::: tp-cluster
::: tp-textfield { data-setting="for" label="for" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="code-comment attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/code-comment/examples/attributes.js" }
:::
```
::::::
:::::::
