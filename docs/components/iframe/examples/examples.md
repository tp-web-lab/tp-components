::::::: tp-markdown-viewer { label="tp-iframe" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-iframe { src="/tp-components/docs/components/iframe/examples/welcome.html" title="A document inside an iframe" style="height: 12rem;" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value="3" }
- controls

- fullscreen

- interaction
:::

::: tp-radio-list { data-setting="loading" label="loading" label-position="top" orientation="horizontal" value="1" }
- Default (empty)

- eager

- lazy
:::

::: tp-radio-list { data-setting="referrerpolicy" label="referrerpolicy" label-position="top" orientation="horizontal" value="1" }
- Default (empty)

- no-referrer

- no-referrer-when-downgrade

- origin

- origin-when-cross-origin

- same-origin

- strict-origin

- strict-origin-when-cross-origin

- unsafe-url
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="sandbox" label="sandbox" value placeholder clearable }
:::

::: tp-textfield { data-setting="srcdoc" label="srcdoc" value placeholder clearable }
:::

::: tp-textfield { data-setting="zoom" label="zoom" value="1" placeholder="1" clearable }
:::

::: tp-textfield { data-setting="zoom-levels" label="zoom-levels" value="25% 50% 75% 100% 125% 150% 175% 200%" placeholder="25% 50% 75% 100% 125% 150% 175% 200%" clearable }
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

::: tp-iframe { id="attributes-frame" title="iframe attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/tp-components/docs/components/iframe/examples/attributes.js" }
:::
```
::::::
:::::::
