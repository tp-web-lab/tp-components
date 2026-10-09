::::::: tp-markdown-viewer { label="tp-animation" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-animation { in="fadeIn" trigger="load" duration="800ms" }
::: tp-box
Animated content
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- once

- paused
:::

::: tp-radio-list { data-setting="fill" label="fill" label-position="top" orientation="horizontal" value="4" }
- none

- forwards

- backwards

- both

- auto
:::

::: tp-radio-list { data-setting="trigger" label="trigger" label-position="top" orientation="horizontal" value="1" }
- load

- click

- hover

- manual

- intersection
:::

:::: tp-cluster
::: tp-textfield { data-setting="delay" label="delay" value="0s" placeholder="0s" clearable }
:::

::: tp-textfield { data-setting="duration" label="duration" value="1s" placeholder="1s" clearable }
:::

::: tp-textfield { data-setting="easing" label="easing" value="ease" placeholder="ease" clearable }
:::

::: tp-textfield { data-setting="in" label="in" value placeholder clearable }
:::

::: tp-textfield { data-setting="iterations" label="iterations" value="1" placeholder="1" clearable }
:::

::: tp-textfield { data-setting="out" label="out" value placeholder clearable }
:::

::: tp-textfield { data-setting="root-margin" label="root-margin" value="0px" placeholder="0px" clearable }
:::

::: tp-textfield { data-setting="target" label="target" value placeholder clearable }
:::

::: tp-textfield { data-setting="threshold" label="threshold" value="0.1" placeholder="0.1" clearable }
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

::: tp-iframe { id="attributes-frame" title="animation attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/animation/examples/attributes.js" }
:::
```
::::::
:::::::
