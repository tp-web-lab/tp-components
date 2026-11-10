<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="frame" library="components" size="1.25em"></tp-icon> Frame

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-frame>` element displays content in a fixed-aspect-ratio frame.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-frame aspect-ratio="16:9" style="max-width: 24rem;">
  <img src="/docs/medias/logos/logo-tp.svg" alt="tp-components logo">
</tp-frame>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-frame" src="/docs/components/frame/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `aspect-ratio` with the `width:height` syntax. Direct image and video children fill the frame while preserving their proportions.

`tp-frame` is a layout container within the current document: it centers its children and clips overflow to maintain the chosen aspect ratio. Images and videos may be cropped to fill it. In contrast, `tp-iframe` embeds a separate HTML document, supplied through `src` or `srcdoc`, with its own browsing context. Choose `tp-frame` to control the proportions of existing content, and `tp-iframe` to embed another document.

```html
<tp-frame aspect-ratio="16:9" style="max-width: 30rem">
  <img src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?auto=format&fit=crop&w=800&q=80" alt="Landscape">
</tp-frame>
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
  <script type="module" src="/path/to/components/frame/frame.js"></script>
  ```

import
: ```js
  import "/path/to/components/frame/frame.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/frame/frame.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the image fits inside a frame with a fixed aspect ratio.

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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
