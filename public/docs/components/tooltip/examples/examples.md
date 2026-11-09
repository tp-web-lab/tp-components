:::::: tp-markdown-viewer { label="tp-tooltip" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { data-intro-action="tooltip" data-allow-script }
::: tp-button { id="intro-tooltip-trigger" data-demo-trigger }
Hover or focus for help
:::

::: tp-tooltip { anchor="#intro-tooltip-trigger" }
This help also appears when the trigger receives keyboard focus.
:::

::: p { data-demo-status role="status" }
Try the tooltip using its trigger.
:::

::: script { src="/docs/components/_shared/introduction-actions.js" }
:::
::::
```
:::::
::::::
