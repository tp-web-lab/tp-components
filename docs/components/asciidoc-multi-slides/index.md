# AsciiDoc multi-slides

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-asciidoc-multi-slides>` element implements the AsciiDoc multi-slides functionality: presents a navigable repository of AsciiDoc slides.

<tp-iframe src="/tp-components/docs/components/asciidoc-multi-slides/examples/introduction-frame.html" title="tp-asciidoc-multi-slides — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Next arrow / click in slide content | Reveal the next progressive step, then advance to the next slide. |
| Previous arrow / right-click in slide content | Hide the previous step, or return to the preceding slide with its steps revealed. |
| Slide slider | Drag to select a slide directly; its progressive content starts again from the beginning. |
| Navigation menu, when shown | Choose a slide directly. |
| Links, buttons and fields inside slides | Keep their usual behavior; interacting with them does not advance the slide. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space / Right Arrow outside editing controls | Reveal the next step or advance to the next slide. |
| Left Arrow / Backspace outside editing controls | Hide the preceding step or return to the previous slide. |
| Arrow keys on the slide slider | Choose a slide. |
| Home / End on the slide slider | Choose the first or last slide. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

```html
<tp-asciidoc-multi-slides repository="/slides"></tp-asciidoc-multi-slides>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move between the slides rendered from the asciidoc source.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

AsciiDoc
: ::include{examples/examples.adoc}

Markdown
: ::include{examples/examples.md}

reStructuredText
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpAsciidocMultiSlides -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-asciidoc-multi-slides>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAsciidocMultiSlides`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-asciidoc-multi-slides>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-asciidoc-multi-slides>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_asciidoc-multi-slides.TpAsciidocMultiSlides.html)
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
  <script type="module" src="/path/to/components/asciidoc-multi-slides/asciidoc-multi-slides.js"></script>
  ```

import
: ```js
  import "/path/to/components/asciidoc-multi-slides/asciidoc-multi-slides.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/asciidoc-multi-slides/asciidoc-multi-slides.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-asciidoc-multi-slides>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-multi-pages
@summary Multi-page documentation with support for multiple markup languages.
-->
<!--
@tp-dependency tp-markup-multi-slides
@summary presents multi-format pages as a responsive slide deck.
-->

- [`<tp-markup-multi-pages>`](../markup-multi-pages/index.md) : Multi-page documentation with support for multiple markup languages.
- [`<tp-markup-multi-slides>`](../markup-multi-slides/index.md) : presents multi-format pages as a responsive slide deck.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
