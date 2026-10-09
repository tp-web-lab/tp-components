::::::: tp-markdown-viewer { label="tp-post-it-editor" allow-script style="--tp-markup-viewer-frame-min-height: 48rem" }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-box { id="post-it-editor-example" }
Select this first paragraph to attach a note about the introduction.

Or select this second paragraph to attach a different note. Reload this page to restore saved notes.
:::

::: tp-post-it-editor { for="#post-it-editor-example" page="post-it-editor-example" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="markup" label="markup" label-position="top" orientation="horizontal" value="5" }
- html

- markdown

- asciidoc

- restructuredtext

- none
:::

:::: tp-cluster
::: tp-textfield { data-setting="for" label="for" value placeholder clearable }
:::

::: tp-textfield { data-setting="page" label="page" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="post-it-editor attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/post-it-editor/examples/attributes.js" }
:::
```
::::::
:::::::
