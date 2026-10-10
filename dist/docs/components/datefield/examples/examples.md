::::::: tp-markdown-viewer { label="tp-datefield" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-datefield { label="Date" value="2026-09-03" clearable }
:::
```

``` example {label="Attributes"}
Change several attributes on one preview. All controls start at their documented defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Reset defaults fills the controls with their defaults again. Controls stay available when the preview is disabled or readonly.

::::: tp-stack
::: tp-checkbox-list { id="datefield-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- clearable

- disabled

- readonly

- required
:::

::: tp-radio-list { data-setting="label-position" label="label-position" label-position="top" orientation="horizontal" value="1" }
- top

- bottom

- start

- end
:::

:::: tp-cluster
::: tp-textfield { data-setting="autocomplete" label="autocomplete" value placeholder clearable }
:::

::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="max" label="max" value placeholder clearable }
:::

::: tp-textfield { data-setting="min" label="min" value placeholder clearable }
:::

::: tp-textfield { data-setting="name" label="name" value placeholder clearable }
:::

::: tp-textfield { data-setting="placeholder" label="placeholder" value placeholder clearable }
:::

::: tp-textfield { data-setting="step" label="step" value="1" placeholder="1" clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
:::
::::

::: tp-button { id="datefield-reset" type="button" }
Reset defaults
:::
:::::

::: tp-divider
:::

### Preview

:::: tp-box
::: tp-datefield { id="datefield-preview" }
:::
::::

::: tp-box { id="datefield-readout" aria-live="polite" }
Reading native attributes…
:::

::: tp-callout { variant="info" heading="Things to try" }
Set label and enter a date such as 2026-09-14 in value. Use YYYY-MM-DD for min and max; step is measured in days. Choose a date in the native field and observe the value setting update. Enable clearable to show the clear button; it is hidden otherwise.
:::

::: script { type="module" src="/docs/components/datefield/examples/attributes.js" }
:::
```

``` example {label="Inline named field"}
Value: :tp-datefield:`identifier`{value="2026-10-05" placeholder="Enter a value"}
```
::::::
:::::::
