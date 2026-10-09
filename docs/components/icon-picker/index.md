# <tp-icon name="icon-picker" library="components" size="1.25em"></tp-icon> Icon picker

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-icon-picker>` element implements the <tp-icon name="icon-picker" library="components" size="1.25em"></tp-icon> Icon picker functionality: light-DOM picker for predefined icons.

<tp-icon-picker></tp-icon-picker>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Browse or search the available items, then select one to copy it in the chosen format. |
| Using the component | Use the displayed filters and format selector, when available, to narrow the list or change the copied representation. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use the integrated, labelled radio buttons or the `copy` attribute to choose what a click copies. Its supported values are `name` (default), `svg`, `tp-icon`, `tp-icon-button`, and `img`.

```html
<tp-icon-picker copy="name"></tp-icon-picker>
<tp-icon-picker copy="svg"></tp-icon-picker>
<tp-icon-picker copy="tp-icon"></tp-icon-picker>
<tp-icon-picker copy="tp-icon-button"></tp-icon-picker>
<tp-icon-picker copy="img"></tp-icon-picker>
<tp-icon-picker compact filter="text"></tp-icon-picker>
```

The field above the icon grid follows the focused, hovered, or selected icon and displays exactly what will be copied. The icons in the grid are never modified by the presentation controls. After a click, the **Selected icon** area updates one dedicated `<tp-icon id="…">` component together with its name and library; only that component receives the configured attributes. The generated `<tp-icon>` and `<tp-icon-button>` markup includes `library` for icons that belong to an external library. For `<tp-icon-button>`, `color`, `scale`, `rotate`, `flip-h`, `flip-v`, and `spin` are forwarded to its internal `<tp-icon>`; its own `size` keeps controlling the button size preset. The generated `<img>` uses the SVG file path and an alternative text in the form `name from library`; internal icons without a standalone file use a self-contained data URL.

The **Icon attributes** controls configure `size`, `color`, `scale`, `rotate`, `flip-h`, `flip-v`, and `spin`. Their initial values are `1em`, `currentColor`, `1`, and `0deg`; checkboxes are initially unchecked. `color` accepts any valid CSS color, for example `red`, `#336699`, `rgb(51 102 153)`, or `var(--tp-brand-text-colorful)`. `scale` increases the vector render size rather than enlarging a rasterized CSS layer, so large values remain sharp. When `spin` is enabled, the icon rotates continuously around its centre and `rotate` is ignored. These options update the selected `<tp-icon>` and are included when the selected format is `tp-icon`. The selected-icon area adapts its height to the configured icon size and scale.

For example, the generated code can be:

```html
<tp-icon name="check" size="3em" color="tomato" scale="1.5" rotate="45deg" flip-h spin></tp-icon>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse and select icons using the picker and its copy controls.

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
<!-- tp-docgen:api TpIconPicker -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>compact</code> | <code>boolean</code> | <code>false</code> | Shows only the title, filters, and a compact 2em icon grid. |
  | <code>copy</code> | <code>&#39;name&#39;\|&#39;svg&#39;\|&#39;tp-icon&#39;\|&#39;tp-icon-button&#39;\|&#39;img&#39;</code> | <code>&quot;name&quot;</code> | Clipboard output format (`name` by default). |
  | <code>filter</code> | <code>string</code> | <code>&quot;&quot;</code> | Free-text filter applied to icon names/libraries. |
  | <code>library</code> | <code>string</code> | <code>&quot;all&quot;</code> | Active library filter (`all` by default). |
  [Attributes of `<tp-icon-picker>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpIconPicker`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-icon-picker-copy-error</code> | <code>&#123; name: unknown; library: unknown; format: unknown; value: string; error: unknown &#125;</code> | Emitted when the clipboard rejects a copy operation. |
  | <code>tp-icon-picker-select</code> | <code>&#123; name: unknown; library: unknown; sourcePath: unknown; format: unknown; value: string &#125;</code> | Emitted after an icon is selected. |
  [Events emitted by `<tp-icon-picker>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-icon-picker>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_icon-picker.TpIconPicker.html)
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
  <script type="module" src="/path/to/components/icon-picker/icon-picker.js"></script>
  ```

import
: ```js
  import "/path/to/components/icon-picker/icon-picker.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/icon-picker/icon-picker.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-icon-picker>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
