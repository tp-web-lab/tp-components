::::::: tp-markdown-viewer { label="tp-video-player" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-video-player { src="/docs/components/video-player/examples/clip-1.mp4" controls label="Moving shapes" }
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- autoplay

- controls

- loop

- muted
:::

::: tp-radio-list { data-setting="poster" label="poster" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

::: tp-radio-list { data-setting="preload" label="preload" label-position="top" orientation="horizontal" value="2" }
- none

- metadata

- auto
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="label" label="label" value="Video" placeholder="Video" clearable }
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

::: tp-iframe { id="attributes-frame" title="video-player attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/docs/components/video-player/examples/attributes.js" }
:::
```

``` example {label="YouTube video"}
::: tp-video-player { src="https://www.youtube.com/watch?v=4n0M4YRAVjc" controls label="Virtual reality introduction" }
:::
```
::::::
:::::::
