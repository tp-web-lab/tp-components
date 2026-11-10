<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="carousel" library="components" size="1.25em"></tp-icon> Carousel

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-carousel>` element displays images one at a time in a horizontal or vertical carousel.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-carousel aria-label="Outdoor activities" height="18rem">
  <img src="/docs/medias/images/canoe.svg" alt="Canoe">
  <img src="/docs/medias/images/basketball.svg" alt="Basketball">
  <img src="/docs/medias/images/walking-shoe.svg" alt="Walking shoe">
</tp-carousel>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-carousel" src="/docs/components/carousel/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Place images inside the carousel and provide meaningful `alt` text. A `picture` or a `figure` with an image and caption can also represent a slide. Give the carousel an `aria-label` that identifies its contents.

Set `orientation="vertical"` for vertical navigation; the default is `horizontal`. Set `height` to the image viewport height (default `20rem`). Images retain their proportions and fit inside this viewport.

`index` selects an image by its zero-based position. Add the boolean `loop` attribute to let the Previous and Next commands wrap between the first and last images. Navigation is manual; images do not advance automatically.

Use `previous()`, `next()` or `goTo(index)` to select an image from JavaScript. The `tp-carousel-change` event provides `{ index, count }` in `event.detail`.

Use [tp-slider](#/components/slider/index.md) for a freely scrolling strip of arbitrary content; use `tp-carousel` for an image gallery with one image per view and navigation controls.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/carousel/carousel.js"></script>
  ```

import
: ```js
  import "/path/to/components/carousel/carousel.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/carousel/carousel.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use Previous image and Next image to browse three illustrations, or focus the image viewport and use the arrow keys.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Vertical navigation
: Browse the images vertically using the buttons, a vertical swipe or the Up and Down arrow keys.

Looping navigation
: Use Next image after the last illustration to return to the first; Previous image also wraps in the other direction.
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
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-slider
@summary Arranges content in a horizontally or vertically scrollable strip.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-slider>`](#/components/slider/index.md) : Arranges content in a horizontally or vertically scrollable strip.

### External

<!--
@summary No external dependency.
-->
No external dependency

### See also

- [`<tp-slider>`](#/components/slider/index.md) : Provides the scrollable strip used by the carousel.
<!-- tp-docgen:dependencies:end -->
