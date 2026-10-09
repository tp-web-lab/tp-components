::::::: tp-markdown-viewer { label="tp-graph-editor" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-editor { grid grid-size="20" message="Graph message area" src="/tp-components/docs/components/graph-editor/examples/graph-example.json" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- grid

- ports-visible

- readonly
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="grid-size" label="grid-size" value="20" placeholder="20" clearable }
:::

::: tp-textfield { data-setting="message" label="message" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="graph-editor attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/tp-components/docs/components/graph-editor/examples/attributes.js" }
:::
```
::::::
:::::::
