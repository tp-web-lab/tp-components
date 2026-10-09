::::::: tp-markdown-viewer { label="tp-textfield" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-textfield { label="Single line" placeholder="Type some text..." clearable }
:::
```

``` example {label="Attributes"}
Change several attributes on one preview. All controls start at their documented defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Reset defaults fills the controls with their defaults again. Controls stay available when the preview is disabled or readonly.

::::: tp-stack
::: tp-checkbox-list { id="textfield-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- clearable

- disabled

- multiline

- readonly

- required
:::

::: tp-radio-list { data-setting="label-position" label="label-position" label-position="top" orientation="horizontal" value="1" }
- top

- bottom

- start

- end
:::

::: tp-radio-list { data-setting="type" label="type" label-position="top" orientation="horizontal" value="1" }
- text

- email

- password

- search

- tel

- url
:::

:::: tp-cluster
::: tp-textfield { data-setting="aria-label" label="aria-label" value placeholder clearable }
:::

::: tp-textfield { data-setting="autocomplete" label="autocomplete" value placeholder clearable }
:::

::: tp-textfield { data-setting="icon" label="icon" value placeholder clearable }
:::

::: tp-textfield { data-setting="icon-library" label="icon-library" value="tp" placeholder="tp" clearable }
:::

::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="name" label="name" value placeholder clearable }
:::

::: tp-textfield { data-setting="placeholder" label="placeholder" value placeholder clearable }
:::

::: tp-textfield { data-setting="rows" label="rows" value="3" placeholder="3" clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
:::
::::

::: tp-button { id="textfield-reset" type="button" }
Reset defaults
:::
:::::

::: tp-divider
:::

### Preview

:::: tp-box
::: tp-textfield { id="textfield-preview" }
:::
::::

::: tp-box { id="textfield-readout" aria-live="polite" }
Reading native attributes…
:::

::: tp-callout { variant="info" heading="Things to try" }
Set label or aria-label to give the preview an accessible name. Choose type email and enter email in autocomplete, then focus the preview to try browser-managed suggestions (saved data and browser settings are required). Enable multiline to test rows. Type applies to single-line inputs only. Enable clearable to show the clear button; it is hidden otherwise.
:::

::: script { type="module" src="/tp-components/docs/components/textfield/examples/attributes.js" }
:::
```

``` example {label="Inline named field"}
Value: :tp-textfield:`identifier`{value="Ada" placeholder="Enter a value"}
```
::::::
:::::::
