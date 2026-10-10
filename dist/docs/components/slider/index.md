# <tp-icon name="slider" library="components" size="1.25em"></tp-icon> Slider

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-slider>` element implements the <tp-icon name="slider" library="components" size="1.25em"></tp-icon> Slider functionality: arranges content in a horizontally scrollable row with a configurable scrollbar.

<tp-box style="max-inline-size: 28rem">
  <tp-slider scrollbar item-width="10rem" gap="1rem">
    <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
  </tp-slider>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Horizontal scrolling | Scroll to reveal items outside the visible area. |
| Links and controls | Use embedded items normally. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab | Moves focus to the slider, then to its focusable children. |
| ArrowLeft / ArrowRight | Scrolls the focused slider left or right by 80% of its visible width. |
| Home / End | Scrolls the focused slider to the start or end of its content, respecting text direction. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `item-width`, `gap`, and optionally `slider-height`. The `scrollbar` attribute controls whether the horizontal scrollbar is visible.

`tp-slider` arranges children in a horizontally scrolling row, with keyboard navigation and scrollbar visibility and color settings. It is neither a numeric range input nor an automatically advancing slideshow.

`tp-slider` replaces the removed `tp-reel` component. Replace `height` with `slider-height`, and the CSS properties `--tp-reel-gap`, `--tp-reel-item-width` and `--tp-reel-height` with `--tp-slider-gap`, `--tp-slider-item-width` and `block-size`, respectively. Add the boolean `scrollbar` attribute to display the scrollbar. With `slider-height`, direct images and videos follow the container height and keep their aspect ratio.

The defaults are `gap="1rem"`, `item-width="auto"`, `slider-height="auto"`, a transparent scrollbar track and a neutral thumb using the shared theme color `var(--tp-neutral-fill-mid)`. `scrollbar` is a boolean attribute: add it to show the scrollbar and omit it to hide the scrollbar (the default). Do not write textual true/false values. Hiding the scrollbar does not disable horizontal scrolling. Browser and operating-system preferences can hide scrollbars until scrolling and limit their visual customization.

```html
<tp-box style="max-inline-size: 28rem">
  <tp-slider scrollbar item-width="10rem" gap="1rem">
    <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
  </tp-slider>
</tp-box>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Scroll horizontally to reveal any of the four content panels that do not fit in the available width.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Image gallery
: Browse four captioned illustrations in a width-constrained gallery. Scroll horizontally or focus the slider and use Left/Right Arrow, Home and End to reach the images outside the visible area.
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
<!-- tp-docgen:api TpSlider -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>gap</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Gap between items, using --tp-slider-gap when absent. |
  | <code>item-width</code> | <code>string</code> | <code>&quot;auto&quot;</code> | Preferred width of non-image items. By default, each item uses its own width or content-based size. |
  | <code>scrollback-thumb-color</code> | <code>string</code> | <code>&quot;var(&#45;&#45;tp-neutral-fill-mid)&quot;</code> | Scrollbar thumb color, using --tp-scrollbar-thumb-color when absent. Defaults to the theme's neutral scrollbar color. |
  | <code>scrollbar</code> | <code>boolean</code> | <code>false</code> | Shows the scrollbar when present and hides it when absent, regardless of the attribute's text value. |
  | <code>scrollbar-track-color</code> | <code>string</code> | <code>&quot;transparent&quot;</code> | Scrollbar track color, using --tp-scrollbar-track-color when absent. |
  | <code>slider-height</code> | <code>string</code> | <code>&quot;auto&quot;</code> | Height of the scrolling area. By default, follows the content height. |
  [Attributes of `<tp-slider>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpSlider`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-slider>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-slider-gap</code> | <code>1rem</code> | Controls the gap. |
  | <code>&#45;&#45;tp-slider-item-width</code> | <code>auto</code> | Controls the item width. |
  | <code>&#45;&#45;tp-slider-native-scrollbar-size</code> | <code>0px</code> | Controls the native scrollbar size. |
  [CSS properties of `<tp-slider>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_slider_slider.TpSlider.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-slider>` are loaded automatically by this component if they have not already been loaded by another component.

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
