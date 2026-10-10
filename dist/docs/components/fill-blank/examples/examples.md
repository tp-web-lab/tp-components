::::::: tp-markdown-viewer { label="tp-fill-blank" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-fill-blank
The capital of France is :tp-textfield:`capital`{name="capital" placeholder="City name" aria-label="Capital of France" clearable}.
:::
```

``` example {label="Selected answer with tp-blank"}
::::: tp-box { id="selected-answer-demo" }
Select a shape or drag it onto the blank. Use its clear button to remove the answer.

::: tp-fill-blank
A shape with three sides is :tp-blank:`shape`{name="shape" aria-label="Shape with three sides"}.
:::

:::: tp-button-group { aria-label="Shape choices" }
::: tp-button { data-answer="triangle" aria-label="Triangle" }
![Triangle](/docs/medias/examples/36c2ceb2a29fc3ae.svg){width="48" height="40"}
:::

::: tp-button { data-answer="square" aria-label="Square" }
![Square](/docs/components/fill-blank/examples/square.svg){width="48" height="40"}
:::
::::

::: tp-dragdrop { root="#selected-answer-demo" items="tp-button[data-answer], tp-blank" }
:::

The latest event is shown below. FormData is displayed as a list of name/value pairs.

:::: tp-callout { variant="neutral" heading="tp-fill-blank-change" aria-live="polite" aria-atomic="true" }
::: div { data-event-output }
No change event yet.
:::
::::
:::::

::: script { src="/docs/components/fill-blank/examples/selected-answer.js" }
:::
```
::::::
:::::::
