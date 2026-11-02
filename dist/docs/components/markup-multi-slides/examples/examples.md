::::::: tp-markdown-viewer { label="tp-markup-multi-slides" allow-script style="--tp-markup-viewer-frame-min-height: 32rem" }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/docs" label="Mixed markup slides" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="auto" label="auto" label-position="top" orientation="horizontal" value="1" }
- Default (empty)

- notes

- timing
:::

:::: tp-cluster
::: tp-textfield { data-setting="timing" label="timing" value="5000" placeholder="5000" clearable }
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

::: tp-iframe { id="attributes-frame" title="markup-multi-slides attribute preview" style="height: 36rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/markup-multi-slides/examples/attributes.js" }
:::
```

``` example {label="Slides navigation menu"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/docs" label="Mixed markup slides" menu }
:::
```

``` example {label="Automatic notes"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/automatic/html" auto="notes" timing="5000" label="Automatic notes" }
:::
```

``` example {label="Timed steps"}
::: tp-markup-multi-slides { repository="/docs/components/markup-multi-slides/automatic/html" auto="timing" timing="5000" label="Timed steps" }
:::
```
::::::
:::::::
