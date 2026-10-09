# <tp-icon name="color-picker" library="components" size="1.25em"></tp-icon> Color picker

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-color-picker>` element implements the <tp-icon name="color-picker" library="components" size="1.25em"></tp-icon> Color picker functionality: light-DOM viewer for base color tokens.

<tp-color-picker></tp-color-picker>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Select | Select a color to copy its CSS variable reference. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus a color choice. |
| Enter / Space | Select the focused color and copy its CSS variable reference. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose a color and inspect the picker’s displayed color values.
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
<!-- tp-docgen:api TpColorPicker -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-color-picker>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpColorPicker`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-color-picker-copy-error</code> | <code>&#123; token: unknown; value: string; error: unknown &#125;</code> | Emitted when the clipboard rejects a copy operation. |
  | <code>tp-color-picker-select</code> | <code>&#123; token: unknown; value: string &#125;</code> | Emitted after a CSS variable reference is selected and copied. |
  [Events emitted by `<tp-color-picker>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-color-picker>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_color-picker.TpColorPicker.html)
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
  <script type="module" src="/path/to/components/color-picker/color-picker.js"></script>
  ```

import
: ```js
  import "/path/to/components/color-picker/color-picker.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/color-picker/color-picker.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-color-picker>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
