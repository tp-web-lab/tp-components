::::::: tp-markdown-viewer { label="tp-mathfield" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-mathfield { label="Formula" value="E = mc^2" clearable }
:::
```

``` example {label="Attributes"}
Change several attributes on one preview. All controls start at their documented defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Reset defaults fills the controls with their defaults again. Controls stay available when the preview is disabled or readonly.

::::: tp-stack
::: tp-checkbox-list { id="mathfield-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- clearable

- disabled

- multiline

- preview

- readonly

- required
:::

::: tp-radio-list { data-setting="label-position" label="label-position" label-position="top" orientation="horizontal" value="1" }
- top

- bottom

- start

- end
:::

::: tp-radio-list { data-setting="mode" label="mode" label-position="top" orientation="horizontal" value="1" }
- latexmath

- asciimath
:::

:::: tp-cluster
::: tp-textfield { data-setting="autocomplete" label="autocomplete" value placeholder clearable }
:::

::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
:::

::: tp-textfield { data-setting="name" label="name" value placeholder clearable }
:::

::: tp-textfield { data-setting="placeholder" label="placeholder" value="Type LaTeX formula..." placeholder="Type LaTeX formula..." clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
:::
::::

::: tp-button { id="mathfield-reset" type="button" }
Reset defaults
:::
:::::

::: tp-divider
:::

### Preview

:::: tp-box
::: tp-mathfield { id="mathfield-preview" }
:::
::::

::: tp-box { id="mathfield-readout" aria-live="polite" }
Reading native attributes…
:::

::: tp-callout { variant="info" heading="Things to try" }
Set label, enter x^2 in value, then enable preview to see the rendered formula. Compare latexmath and asciimath, and try multiline. The formula preview button also updates the preview checkbox. Enable clearable to show the clear button; it is hidden otherwise.
:::

::: script { type="module" src="/tp-components/docs/components/mathfield/examples/attributes.js" }
:::
```

``` example {label="Inline in prose"}
Einstein's equation :tp-mathfield:`energy`{value="E = mc^2"} relates mass and energy.
```

``` example {label="Inline named field"}
Value: :tp-mathfield:`identifier`{value="E = mc^2" placeholder="Enter a value"}
```
::::::
:::::::
