<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="save-image" library="components" size="1.25em"></tp-icon> Save image

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-save-image>` element saves an anchored image in several formats.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
  <p>Save this heart icon as an SVG, PNG or WebP image.</p>
  <tp-icon id="intro-save-diagram" name="heart" size="5rem" aria-label="Heart"></tp-icon>
  <tp-save-image anchor="#intro-save-diagram" filename="heart"></tp-save-image>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-save-image" src="/docs/components/save-image/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`anchor` can reference an SVG, canvas, image, an element containing one of these images, or a component exposing an `exportSvg(): string` method. Use `name`, `variant`, `size`, and `disabled` to configure the internal icon button.

The component emits `tp-save-image-save` after preparing a download and `tp-save-image-error` when conversion fails.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/save-image/save-image.js"></script>
  ```

import
: ```js
  import "/path/to/components/save-image/save-image.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/save-image/save-image.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the save control to export the heart icon in one of the offered image formats.

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
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
