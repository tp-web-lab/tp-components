::::::: tp-markdown-viewer { label="tp-post-it" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { style="min-block-size: 20rem" }
Drag the note by its header to move it over the page. The pin folds and opens it.

::: tp-post-it { heading="Remember" }
Keep examples **simple and meaningful**.

- Show a useful result.

- Try the keyboard controls.
:::
::::
```

``` example {label="Lite note"}
::: tp-post-it { heading="Reminder" lite }
Keep examples **simple and meaningful**.
:::
```

``` example {label="Notes board"}
::::: tp-cluster { gap="2rem" style="padding: 1rem" }
::: tp-post-it { heading="Plan" color="yellow" rotation="-2" }
Write one useful example.
:::

::: tp-post-it { heading="Review" color="blue" rotation="2" }
Check the result with the keyboard.
:::

:::: tp-post-it { heading="Your reminder" color="pink" }
::: tp-textfield { label="Reminder" placeholder="What comes next?" clearable }
:::
::::
:::::
```
::::::
:::::::
