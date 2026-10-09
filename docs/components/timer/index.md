# <tp-icon name="timer" library="components" size="1.25em"></tp-icon> Timer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-timer>` element implements the <tp-icon name="timer" library="components" size="1.25em"></tp-icon> Timer functionality: countdown timer with stop control and optional ring.

<tp-timer></tp-timer>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Duration | Enter the countdown duration in seconds. |
| Start timer | Begin the countdown. Completion sound depends on the page and browser. |
| Stop timer | Stop the countdown. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-timer>` as shown below.

```html
<tp-timer></tp-timer>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the timer controls and observe the countdown.

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
<!-- tp-docgen:api TpTimer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>duration</code> | <code>number</code> | <code>60</code> | Countdown duration in seconds. |
  | <code>silent</code> | <code>boolean</code> | <code>false</code> | Disables sound playback. |
  | <code>size</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Icon and text size. |
  [Attributes of `<tp-timer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpTimer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-timer-elapsed</code> | <code>void</code> | Emitted when the countdown reaches zero. |
  [Events emitted by `<tp-timer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-timer-alert</code> | <code>#b91c1c</code> | Controls the alert. |
  | <code>&#45;&#45;tp-timer-alert-bg</code> | <code>#fecaca</code> | Controls the alert bg. |
  | <code>&#45;&#45;tp-timer-muted</code> | <code>#9ca3af</code> | Controls the muted. |
  | <code>&#45;&#45;tp-timer-size</code> | <code>1rem</code> | Icon and text size. |
  [CSS properties of `<tp-timer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_timer.TpTimer.html)
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
  <script type="module" src="/path/to/components/timer/timer.js"></script>
  ```

import
: ```js
  import "/path/to/components/timer/timer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/timer/timer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-timer>` are loaded automatically by this component if they have not already been loaded by another component.

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
