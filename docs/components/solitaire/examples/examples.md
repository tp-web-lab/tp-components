::::::: tp-markdown-viewer { label="tp-solitaire" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-solitaire
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="back" label="back" label-position="top" orientation="horizontal" value="1" }
- blue

- red
:::

::: tp-radio-list { data-setting="deck-size" label="deck-size" label-position="top" orientation="horizontal" value="2" }
- 32

- 52
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

::: tp-iframe { id="attributes-frame" title="solitaire attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/solitaire/examples/attributes.js" }
:::
```

``` example {label="32 cards with red back"}
::: tp-solitaire { deck-size="32" back="red" }
:::
```
::::::
:::::::
