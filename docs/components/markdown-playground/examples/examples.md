::::::: tp-markdown-viewer { label="tp-markdown-playground" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-markdown-playground { src="/tp-components/docs/components/_shared/intro-projects/markdown.json" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="repository" label="repository" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

::: tp-cluster
:::

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

::: tp-iframe { id="attributes-frame" title="markdown-playground attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/tp-components/docs/components/markdown-playground/examples/attributes.js" }
:::
```

``` example {label="Single source file"}
::: tp-markdown-playground { src="/tp-components/docs/components/_shared/single-source/example.md" }
:::
```
::::::
:::::::
