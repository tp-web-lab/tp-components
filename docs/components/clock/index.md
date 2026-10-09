# <tp-icon name="clock" library="components" size="1.25em"></tp-icon> Clock

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-clock>` element implements the <tp-icon name="clock" library="components" size="1.25em"></tp-icon> Clock functionality: live clock component with digital or analogic display and date tooltip.

<tp-clock></tp-clock>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component displays information and has no control to operate. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-clock>` as shown below.

```html
<tp-clock></tp-clock>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Observe the clock display and its updating time.

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
<!-- tp-docgen:api TpClock -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>size</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Clock size. |
  | <code>type</code> | <code>string</code> | <code>&quot;digital&quot;</code> | Display type (`digital` or `analogic`). |
  [Attributes of `<tp-clock>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpClock`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-clock>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-clock-size</code> | <code>1rem</code> | Clock size. |
  [CSS properties of `<tp-clock>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_clock.TpClock.html)
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
  <script type="module" src="/path/to/components/clock/clock.js"></script>
  ```

import
: ```js
  import "/path/to/components/clock/clock.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/clock/clock.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-clock>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-tooltip
@summary Displays anchored tooltip content.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-tooltip>`](../tooltip/index.md) : Displays anchored tooltip content.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
