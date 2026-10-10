:::::::: tp-markdown-viewer { label="tp-center" allow-script }
::::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-center { intrinsic }
::: tp-box
Centered content
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- center-text

- intrinsic
:::

:::: tp-cluster
::: tp-textfield { data-setting="max-inline-size" label="max-inline-size" value="60ch" placeholder="60ch" clearable }
:::

::: tp-textfield { data-setting="padding-inline" label="padding-inline" value="0px" placeholder="0px" clearable }
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

::: tp-iframe { id="attributes-frame" title="center attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/center/examples/attributes.js" }
:::
```

``` example {label="Constrained region"}
Compare the two centered regions: the narrow region wraps the same text onto more lines. Resize the preview to see both regions shrink when less space is available.

:::::: tp-stack
::::: tp-box
**Maximum width: 18rem**

:::: tp-center { max-inline-size="18rem" }
::: tp-box { invert }
The same text appears in both regions. The maximum width controls the width of the region, not the alignment of its text. Equal space on either side keeps the region centered.
:::
::::
:::::

::::: tp-box
**Maximum width: 36rem**

:::: tp-center { max-inline-size="36rem" }
::: tp-box { invert }
The same text appears in both regions. The maximum width controls the width of the region, not the alignment of its text. Equal space on either side keeps the region centered.
:::
::::
:::::
::::::
```
:::::::
::::::::
