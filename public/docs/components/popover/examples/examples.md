::::::: tp-markdown-viewer { label="tp-popover" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::::: tp-box { data-intro-action="popover" data-allow-script }
::: tp-button { id="intro-popover-trigger" data-demo-trigger }
Show more information
:::

:::: tp-popover { anchor="#intro-popover-trigger" outside-click }
This panel contains additional information.

::: tp-button { data-demo-close }
Close
:::
::::

::: p { data-demo-status role="status" }
Try the popover using its trigger.
:::

::: script { src="/docs/components/_shared/introduction-actions.js" }
:::
:::::
```
::::::
:::::::
