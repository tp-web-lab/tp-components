::::::: tp-markdown-viewer { label="tp-color" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: section
::: tp-color
:::

The selected brand color is scoped to this section.

`Inline code uses the selected brand colour.`
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

::: tp-textfield { data-setting="preset" label="preset" value="tp-default" placeholder="tp-default" clearable }
:::

::: tp-textfield { data-setting="ui-anchor" label="ui-anchor" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="color attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/color/examples/attributes.js" }
:::
```

``` example {label="Local color scope"}
:::: tp-box
::: tp-color
:::

::: tp-callout { variant="brand" }
The selected brand color is scoped to this box.
:::
::::
```

``` example {label="Change event"}
:::: section { id="color-event-target" }
::: tp-color { anchor="#color-event-target" }
:::

Choose a brand color to emit
`tp-color-change`
.

::: tp-callout { variant="brand" }
This callout follows the selected brand color.
:::
::::

::: tp-console
:::

::: script { type="module" }
customElements.whenDefined('tp-console').then(() => {
  const section = document.querySelector('#color-event-target');
  const output = document.querySelector('tp-console');
  output.redirectConsoleToSelf();
  section?.addEventListener('tp-color-change', (event) => {
  console.info('tp-color-change', {
    preset: event.detail.preset,
    brand: event.detail.brand,
    anchor: event.detail.anchor,
    target: event.detail.target?.id,
  });
  });
});
:::
```
::::::
:::::::
