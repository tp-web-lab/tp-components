<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="slider" library="components" size="1.25em"></tp-icon> Slider

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-slider>` element arranges content in a horizontally or vertically scrollable strip.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box style="max-inline-size: 28rem">
  <tp-slider scrollbar="" item-width="10rem" gap="1rem" style="max-block-size: 8rem">
    <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
  </tp-slider>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-slider" src="/docs/components/slider/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `orientation="vertical"` and a `slider-height` to scroll vertically. The default orientation is `horizontal`. For one image at a time with Previous and Next buttons, use [tp-carousel](#/components/carousel/index.md).

Set `item-width`, `gap`, and optionally `slider-height`. The `scrollbar` attribute controls whether the scrollbar is visible.

`tp-slider` arranges children in a scrolling strip, with keyboard navigation and scrollbar visibility and color settings. It is neither a numeric range input nor an automatically advancing slideshow.

`tp-slider` replaces the removed `tp-reel` component. Replace `height` with `slider-height`, and the CSS properties `--tp-reel-gap`, `--tp-reel-item-width` and `--tp-reel-height` with `--tp-slider-gap`, `--tp-slider-item-width` and `block-size`, respectively. Add the boolean `scrollbar` attribute to display the scrollbar. With `slider-height`, direct images and videos follow the container height and keep their aspect ratio.

The defaults are `gap="1rem"`, `item-width="auto"`, `slider-height="auto"`, a transparent scrollbar track and a neutral thumb using the shared theme color `var(--tp-neutral-fill-mid)`. `scrollbar` is a boolean attribute: add it to show the scrollbar and omit it to hide the scrollbar (the default). Do not write textual true/false values. Hiding the scrollbar does not disable scrolling. Browser and operating-system preferences can hide scrollbars until scrolling and limit their visual customization.

```html
<tp-box style="max-inline-size: 28rem">
  <tp-slider scrollbar item-width="10rem" gap="1rem">
    <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
  </tp-slider>
</tp-box>
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
  <script type="module" src="/path/to/components/slider/slider.js"></script>
  ```

import
: ```js
  import "/path/to/components/slider/slider.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/slider/slider.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Scroll horizontally to reveal any of the four content panels that do not fit in the available width.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Image gallery
: Browse four captioned illustrations in a width-constrained gallery. Scroll horizontally or focus the slider and use Left/Right Arrow, Home and End to reach the images outside the visible area.
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
