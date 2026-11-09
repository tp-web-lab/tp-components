:::::: tp-markdown-viewer { label="tp-theme" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: section
::: tp-theme
:::

The selected theme is scoped to this section.

`Inline code follows the selected theme.`
::::
```

``` example {label="Local theme scope"}
:::: tp-box
::: tp-theme
:::

::: tp-callout
The selected theme is scoped to this box.
:::
::::
```

``` example {label="Change event"}
:::: section { id="theme-event-target" }
::: tp-theme { anchor="#theme-event-target" }
:::

Choose a different theme mode to emit
`tp-theme-change`
.

::: tp-callout
This callout follows the selected theme.
:::
::::

::: tp-console
:::

::: script { type="module" }
customElements.whenDefined('tp-console').then(() => {
  const section = document.querySelector('#theme-event-target');
  const output = document.querySelector('tp-console');
  output.redirectConsoleToSelf();
  section?.addEventListener('tp-theme-change', (event) => {
    console.info('tp-theme-change', {
      mode: event.detail.mode,
      theme: event.detail.theme,
      anchor: event.detail.anchor,
      target: event.detail.target?.id,
    });
  });
});
:::
```
:::::
::::::
