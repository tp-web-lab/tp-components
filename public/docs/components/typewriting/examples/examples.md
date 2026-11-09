::::: tp-markdown-viewer { label="tp-typewriting" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-typewriting { speed="20" }
Welcome to **tp-components**. Make your words appear progressively.
:::
```

``` example {label="Synchronized speech"}
Press Speak, then try Pause, Resume and Stop. Some voices do not report word boundaries; the full text remains visible in that case.

::: tp-typewriting { id="spoken-text" word }
Welcome to **tp-components**. You can pause this reading and resume it whenever you want.
:::

::: tp-text-to-speech { for="spoken-text" lang="en" }
:::
```
::::
:::::
