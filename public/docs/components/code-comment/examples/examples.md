:::::: tp-markdown-viewer { label="tp-code-comment" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-code-editor { id="commented-function" language="typescript" }
::: script { type="tp/typescript" }
function f(x: number): number {
  if (x > 0) { return 2 * x; } // <1>
  else { return 4 * x; } // <2>
}
:::
::::

::: tp-code-comment { for="commented-function" }
1. Positive values are doubled.

2. Zero and negative values are multiplied by four.
:::
```
:::::
::::::
