::::::: tp-markdown-viewer { label="tp-typewriting" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-typewriting { speed="20" }
Welcome to **tp-components**. Make your words appear progressively.
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- loop

- word
:::

:::: tp-cluster
::: tp-textfield { data-setting="delay" label="delay" value="0" placeholder="0" clearable }
:::

::: tp-textfield { data-setting="speed" label="speed" value="20" placeholder="20" clearable }
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

::: tp-iframe { id="attributes-frame" title="typewriting attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/typewriting/examples/attributes.js" }
:::
```

``` example {label="Synchronized speech"}
Press Speak, then try Pause, Resume and Stop. Some voices do not report word boundaries; the full text remains visible in that case.

::: tp-typewriting { id="spoken-text" word }
Welcome to **tp-components**. You can pause this reading and resume it whenever you want.
:::

::: tp-text-to-speech { for="spoken-text" lang="en" }
:::
```
::::::
:::::::
