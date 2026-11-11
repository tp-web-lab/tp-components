<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="icon-picker" library="components" size="1.25em"></tp-icon> Icon picker

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-icon-picker>` element browses and selects icons from the available libraries.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-icon-picker></tp-icon-picker>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-icon-picker" src="/docs/components/icon-picker/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse and select icons using the picker and its copy controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-radio-list>`](#/components/radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
