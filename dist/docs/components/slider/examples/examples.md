:::::::: tp-markdown-viewer { label="tp-slider" allow-script }
::::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::::: tp-box { style="max-inline-size: 28rem" }
:::: tp-slider { scrollbar item-width="10rem" gap="1rem" }
::: tp-box
First
:::

::: tp-box
Second
:::

::: tp-box
Third
:::

::: tp-box
Fourth
:::
::::
:::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- scrollbar
:::

:::: tp-cluster
::: tp-textfield { data-setting="gap" label="gap" value="1rem" placeholder="1rem" clearable }
:::

::: tp-textfield { data-setting="item-width" label="item-width" value="auto" placeholder="auto" clearable }
:::

::: tp-textfield { data-setting="scrollback-thumb-color" label="scrollback-thumb-color" value="var(--tp-neutral-fill-mid)" placeholder="var(--tp-neutral-fill-mid)" clearable }
:::

::: tp-textfield { data-setting="scrollbar-track-color" label="scrollbar-track-color" value="transparent" placeholder="transparent" clearable }
:::

::: tp-textfield { data-setting="slider-height" label="slider-height" value="auto" placeholder="auto" clearable }
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

::: tp-iframe { id="attributes-frame" title="slider attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/slider/examples/attributes.js" }
:::
```

``` example {label="Image gallery"}
Browse the illustrations by scrolling horizontally. Press Tab to focus the gallery, then use Left/Right Arrow, Home or End.

:::::: tp-box { style="max-inline-size: 32rem" }
::::: tp-slider { scrollbar item-width="14rem" gap="1rem" aria-label="Illustration gallery" }
:::: tp-box
::: tp-stack { style="--stack-gap: 0.5rem" }
:img:`…`{src="/docs/medias/images/canoe.svg" alt="A red canoe on blue water" width="160" height="160"}

Canoe
:::
::::

:::: tp-box
::: tp-stack { style="--stack-gap: 0.5rem" }
:img:`…`{src="/docs/medias/images/basketball.svg" alt="An orange basketball" width="160" height="160"}

Basketball
:::
::::

:::: tp-box
::: tp-stack { style="--stack-gap: 0.5rem" }
:img:`…`{src="/docs/medias/images/walking-shoe.svg" alt="A walking shoe" width="160" height="160"}

Walking shoe
:::
::::

:::: tp-box
::: tp-stack { style="--stack-gap: 0.5rem" }
:img:`…`{src="/docs/medias/images/lightsaber.svg" alt="A lightsaber" width="160" height="160"}

Lightsaber
:::
::::
:::::
::::::
```
:::::::
::::::::
