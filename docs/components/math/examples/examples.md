::::::: tp-markdown-viewer { label="tp-math" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
The identity :tp-math:`…`{value="a^2 + b^2 = c^2" label="a squared plus b squared equals c squared"} describes a right triangle.
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- displaystyle
:::

::: tp-radio-list { data-setting="mode" label="mode" label-position="top" orientation="horizontal" value="1" }
- latexmath

- asciimath
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="label" label="label" value placeholder clearable }
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

::: tp-iframe { id="attributes-frame" title="math attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/tp-components/docs/components/math/examples/attributes.js" }
:::
```

``` example {label="Script and display style"}
:::: tp-math
::: script { type="tp/math" }
\frac{1}{2\sqrt{x}}
:::
::::

:::: tp-math { displaystyle }
::: script { type="tp/math" }
\frac{1}{2\sqrt{x}}
:::
::::
```

``` example {label="AsciiMath"}
An inline expression: :tp-math:`…`{mode="asciimath" value="1/(2sqrt(x))" label="One divided by twice the square root of x"}.

::: tp-math { mode="asciimath" value="1/(2sqrt(x))" displaystyle label="One divided by twice the square root of x" }
:::
```

``` example {label="External expression"}
::: tp-math { src="/tp-components/docs/components/math/examples/identity.txt" displaystyle }
:::
```
::::::
:::::::
