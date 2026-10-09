::::::: tp-markdown-viewer { label="tp-menu" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-menu
- [Buttons](/#/components/button/index.md)

- [Tabs](/#/components/tabs/index.md)

- [Trees](/#/components/tree/index.md)
:::

::: script { src="/tp-components/docs/components/menu/examples/navigation.js" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="orientation" label="orientation" label-position="top" orientation="horizontal" value="2" }
- horizontal

- vertical
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

::: tp-iframe { id="attributes-frame" title="menu attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/menu/examples/attributes.js" }
:::
```

``` example {label="Nested submenus"}
Open Components, then Layout, then Rows to explore three submenu levels. Click a branch to open it, or focus Components and press Arrow Down, then Arrow Right twice. Arrow Left closes a submenu and returns focus to its parent. Links open the corresponding documentation page.

:::: tp-box { style="min-height: 22rem" }
::: tp-menu { orientation="horizontal" }
- Components

  - Layout

    - Rows

      - [Inline](/#/components/inline/index.md)

      - [Cluster](/#/components/cluster/index.md)

    - [Grid](/#/components/grid/index.md)

    - [Frame](/#/components/frame/index.md)

  - Navigation

    - [Tabs](/#/components/tabs/index.md)

    - [Trees](/#/components/tree/index.md)

- [Buttons](/#/components/button/index.md)
:::
::::

::: script { src="/tp-components/docs/components/menu/examples/navigation.js" }
:::
```
::::::
:::::::
