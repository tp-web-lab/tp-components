# <tp-icon name="frame" library="components" size="1.25em"></tp-icon> Frame

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-frame>` element implements the <tp-icon name="frame" library="components" size="1.25em"></tp-icon> Frame functionality: displays content in a fixed-aspect-ratio frame.

<tp-frame aspect-ratio="16:9" style="max-width: 24rem;">
  <img src="/docs/medias/logos/logo-tp.svg" alt="tp-components logo">
</tp-frame>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component organizes or presents content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `aspect-ratio` with the `width:height` syntax. Direct image and video children fill the frame while preserving their proportions.

`tp-frame` is a layout container within the current document: it centers its children and clips overflow to maintain the chosen aspect ratio. Images and videos may be cropped to fill it. In contrast, `tp-iframe` embeds a separate HTML document, supplied through `src` or `srcdoc`, with its own browsing context. Choose `tp-frame` to control the proportions of existing content, and `tp-iframe` to embed another document.

```html
<tp-frame aspect-ratio="16:9" style="max-width: 30rem">
  <img src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?auto=format&fit=crop&w=800&q=80" alt="Landscape">
</tp-frame>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the image fits inside a frame with a fixed aspect ratio.

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
<!-- tp-docgen:api TpFrame -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>aspect-ratio</code> | <code>string</code> | <code>&quot;16:9&quot;</code> | Width-to-height ratio in numerator:denominator notation. When absent, uses the CSS defaults of 16 and 9. |
  [Attributes of `<tp-frame>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpFrame`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-frame>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-frame-denominator</code> | <code>9</code> | Controls the denominator. |
  | <code>&#45;&#45;tp-frame-numerator</code> | <code>16</code> | Controls the numerator. |
  [CSS properties of `<tp-frame>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_frame_frame.TpFrame.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-frame>` are loaded automatically by this component if they have not already been loaded by another component.

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
