:::::::: tp-markdown-viewer { label="tp-center" allow-script }
::::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-center { intrinsic }
::: tp-box
Centered content
:::
::::
```

``` example {label="Constrained region"}
Compare the two centered regions: the narrow region wraps the same text onto more lines. Resize the preview to see both regions shrink when less space is available.

:::::: tp-stack
::::: tp-box
**Maximum width: 18rem**

:::: tp-center { max-inline-size="18rem" }
::: tp-box { invert }
The same text appears in both regions. The maximum width controls the width of the region, not the alignment of its text. Equal space on either side keeps the region centered.
:::
::::
:::::

::::: tp-box
**Maximum width: 36rem**

:::: tp-center { max-inline-size="36rem" }
::: tp-box { invert }
The same text appears in both regions. The maximum width controls the width of the region, not the alignment of its text. Equal space on either side keeps the region centered.
:::
::::
:::::
::::::
```
:::::::
::::::::
