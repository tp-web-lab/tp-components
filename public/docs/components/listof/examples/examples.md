::::::: tp-markdown-viewer { label="tp-listof" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::::: div { data-tp-reference-scope }
::: tp-listof { selector="figure" }
:::

:::: figure
A diagram of the water cycle.

::: figcaption
The water cycle
:::
::::

:::: figure
A diagram of a food chain.

::: figcaption
A food chain
:::
::::
:::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

Enter figure in selector to list the two figures. Clear the field to return to the empty default.

::::: tp-stack
:::: tp-cluster
::: tp-textfield { data-setting="selector" label="selector" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="listof attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/docs/components/listof/examples/attributes.js" }
:::
```

``` example {label="Notes, bibliography and glossary"}
:::: div { data-tp-reference-scope }
Read a note :tp-ref:{href="^method"}, consult a source :tp-ref:{href="@book"}, or look up :tp-ref:{href="%ecosystem"}. Compare another note :tp-ref:{href="^weather"}, then read the first note again :tp-ref:{href="^method"}.

::: tp-note { ref="method" title="Method" }
Observe the habitat at **three different times** of day.

- Record the weather.

- Compare your observations.
:::

::: tp-biblio { ref="book" title="Book" }
Alex Example. *Field observation handbook*. Example Press, 2026.
:::

::: tp-glossary { ref="ecosystem" title="Ecosystem" }
A community of organisms interacting with their physical environment.
:::

::: tp-note { ref="weather" }
Record the temperature and cloud cover.
:::

::: tp-biblio { ref="atlas" }
Alex Example. *A field atlas*. Example Press, 2025.
:::

::: tp-glossary { ref="community" }
A group of interacting populations.
:::

### Notes

::: tp-listof { selector="tp-note" }
:::

### Bibliography

::: tp-listof { selector="tp-biblio" }
:::

### Glossary

::: tp-listof { selector="tp-glossary" }
:::
::::
```
::::::
:::::::
