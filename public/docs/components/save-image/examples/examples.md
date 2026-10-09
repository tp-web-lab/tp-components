::::::: tp-markdown-viewer { label="tp-save-image" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box
Save this heart icon as an SVG, PNG or WebP image.

:tp-icon:{id="intro-save-diagram" name="heart" size="5rem" aria-label="Heart"}

::: tp-save-image { anchor="#intro-save-diagram" filename="heart" }
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- disabled
:::

::: tp-radio-list { data-setting="size" label="size" label-position="top" orientation="horizontal" value="4" }
- xxs

- xs

- s

- m

- l

- xl

- xxl
:::

::: tp-radio-list { data-setting="variant" label="variant" label-position="top" orientation="horizontal" value="5" }
- success

- danger

- warning

- info

- neutral

- brand
:::

:::: tp-cluster
::: tp-textfield { data-setting="anchor" label="anchor" value placeholder clearable }
:::

::: tp-textfield { data-setting="filename" label="filename" value="image" placeholder="image" clearable }
:::

::: tp-textfield { data-setting="name" label="name" value="image-download" placeholder="image-download" clearable }
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

::: tp-iframe { id="attributes-frame" title="save-image attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/save-image/examples/attributes.js" }
:::
```
::::::
:::::::
