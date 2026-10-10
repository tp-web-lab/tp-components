::::::: tp-markdown-viewer { label="tp-turtle" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-turtle { width="420" height="220" label="A square" }
::: script { type="tp/turtle" }
turtle x=0 y=0 heading=0 speed=6
forward 80
right 90
forward 80
right 90
forward 80
right 90
forward 80
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="background" label="background" value placeholder clearable }
:::

::: tp-textfield { data-setting="download-name" label="download-name" value placeholder clearable }
:::

::: tp-textfield { data-setting="height" label="height" value placeholder clearable }
:::

::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="replay-label" label="replay-label" value placeholder clearable }
:::

::: tp-textfield { data-setting="save-label" label="save-label" value placeholder clearable }
:::

::: tp-textfield { data-setting="width" label="width" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="turtle attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/docs/components/turtle/examples/attributes.js" }
:::
```
::::::
:::::::
