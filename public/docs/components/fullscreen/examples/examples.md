::::::: tp-markdown-viewer { label="tp-fullscreen" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box
::: tp-fullscreen
:::

This box is the fullscreen target.

Press Esc to exit fullscreen mode.
::::
```

``` example {label="Toolbar control"}
::::: tp-box
:::: tp-toolbar
::: tp-fullscreen
:::
::::

The fullscreen button is in a toolbar.

The containing box is still the fullscreen target.
:::::
```

``` example {label="Change event"}
:::: tp-box { id="fullscreen-event-target" }
::: tp-fullscreen { anchor="#fullscreen-event-target" }
:::

Enter or exit fullscreen to emit
`tp-fullscreen-change`
.
::::

::: tp-console
:::

::: script { type="module" }
customElements.whenDefined('tp-console').then(() => {
  const section = document.querySelector('#fullscreen-event-target');
  const output = document.querySelector('tp-console');
  output.redirectConsoleToSelf();
  section?.addEventListener('tp-fullscreen-change', (event) => {
  console.info('tp-fullscreen-change', {
    fullscreen: event.detail.fullscreen,
    anchor: event.detail.anchor,
    target: event.detail.target?.id,
  });
  });
});
:::
```
::::::
:::::::
