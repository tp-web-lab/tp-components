::::::: tp-markdown-viewer { label="tp-skeleton" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-skeleton { label="Article layout preview" }
::: script { type="tp/html" }
<main>
  <nav>Home · Articles · About</nav>
  <h1>Building accessible interfaces</h1>
  <p>An introduction to the article.</p>
  <figure><img src="portrait.jpg" alt="Portrait"><figcaption>Caption</figcaption></figure>
  <h2>Key ideas</h2>
  <ul><li>Clear structure</li><li>Consistent interactions</li></ul>
  <table><tr><th>Feature</th><th>Status</th></tr><tr><td>Keyboard</td><td>Ready</td></tr></table>
  <blockquote>A useful quotation.</blockquote>
</main>
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Inline HTML (default)

- Article HTML

- Reference HTML with iframe

- Missing HTML (test error)
:::

:::: tp-cluster
::: tp-textfield { data-setting="label" label="label" value="Content layout preview" placeholder="Content layout preview" clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="skeleton attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

The src control offers the inline example, two reviewed HTML documents and a missing file to test the warning. A nonempty src takes precedence over value; clear src to test a literal HTML value containing a heading and a paragraph. HTML is source data: it is not executed.

::: script { type="module" src="/docs/components/skeleton/examples/attributes.js" }
:::
```
::::::
:::::::
