::::::: tp-markdown-viewer { label="tp-slide-note" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-slide-note { legend="Speaker notes" lang="en-GB" show-text }
::: script { type="tp/txt" }
Introduce the idea. [trigger=clic] Explain the next step.
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- open
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

::: tp-iframe { id="attributes-frame" title="slide-note attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/slide-note/examples/attributes.js" }
:::
```

``` example {label="External notes"}
::: tp-slide-note { legend="External notes" src="/docs/components/slide-note/examples/notes.txt" lang="en-GB" show-text }
:::
```
::::::
:::::::
