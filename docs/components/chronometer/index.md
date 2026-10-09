# <tp-icon name="chronometer" library="components" size="1.25em"></tp-icon> Chronometer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-chronometer>` element implements the <tp-icon name="chronometer" library="components" size="1.25em"></tp-icon> Chronometer functionality: chronometer component with play, pause and stop controls.

<tp-chronometer></tp-chronometer>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Start chronometer | Start or resume timing. |
| Pause chronometer | Freeze the elapsed time. |
| Stop chronometer | Stop timing and reset the display. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-chronometer>` as shown below.

```html
<tp-chronometer></tp-chronometer>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the chronometer controls to measure elapsed time.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpChronometer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>size</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Icon and text size. |
  [Attributes of `<tp-chronometer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>pause</code> | <code>pause(): void</code> | Pauses the chronometer. |
  | <code>play</code> | <code>play(): void</code> | Starts the chronometer. |
  | <code>stop</code> | <code>stop(): void</code> | Stops and resets the chronometer. |
  [Public methods of `TpChronometer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-chronometer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-chronometer-size</code> | <code>1rem</code> | Icon and text size. |
  [CSS properties of `<tp-chronometer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_chronometer.TpChronometer.html)
<!-- tp-docgen:typedoc:end -->






































































































































































































































































### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/chronometer/chronometer.js"></script>
  ```

import
: ```js
  import "/path/to/components/chronometer/chronometer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/chronometer/chronometer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-chronometer>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
