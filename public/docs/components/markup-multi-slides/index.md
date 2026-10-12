# <tp-icon name="markup-multi-slides" library="components" size="1.25em"></tp-icon> Markup multi-slides

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markup-multi-slides>` element implements the <tp-icon name="markup-multi-slides" library="components" size="1.25em"></tp-icon> Markup multi-slides functionality: presents multi-format pages as a responsive slide deck.

<tp-iframe src="/docs/components/markup-multi-slides/examples/introduction-frame.html" title="tp-markup-multi-slides — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

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

`<tp-markup-multi-slides>` specializes `<tp-markup-multi-pages>`. It uses the same toolbar, splitter, sidebar, parsers, source display, fallback page, attributes, and full-window layout. Each linked document is one slide and can contain any markup supported by its format. The sidebar is hidden by default; add `menu` to show it initially.

Its only visual differences are the responsive font size and the bottom navigation made of a [`tp-numberfield`](../numberfield/index.md) in `range` mode without `clearable`, a slide counter, and previous/next arrow buttons. The HTML, Markdown, AsciiDoc and reStructuredText multi-slides variants inherit this navigation. The slider displays the current slide number after its # marker.

The slider has one native tick mark per slide, supplied by a `datalist` through the numberfield's `list` attribute. Marks update when the slide count changes; their appearance depends on the browser.

#### Responsive content size

The content font size adapts continuously to the width of the presentation viewport:

```css
font-size: clamp(1rem, calc(0.65rem + 1.15vw), 2.5rem);
```

The size is therefore limited to a minimum of `1rem` and a maximum of `2.5rem`. Between these limits, it is calculated from `0.65rem` plus `1.15%` of the viewport width. With a root font size of `16px`, the resulting values are approximately:

| Viewport width | Content font size |
| ---: | ---: |
| `500px` | `16px` |
| `1000px` | `21.9px` |
| `1440px` | `27px` |

CSS recalculates this value automatically whenever the presentation viewport changes size; no reload or JavaScript calculation is required. In an embedded example, `vw` follows the iframe viewport. In fullscreen mode, it follows the fullscreen viewport.

#### Progressive content

Add `data-slide-step` to content that must be revealed progressively. Elements without this attribute remain visible from the beginning. Step numbers determine the reveal order, and elements with the same number are revealed together.

```html
<h1>Always visible</h1>
<p data-slide-step="1">Revealed first.</p>
<p data-slide-step="2">Revealed second.</p>
<tp-callout data-slide-step="2">Revealed with the second step.</tp-callout>
```

A click in the slide content, the `Enter` key, the `Space` key, the right arrow key, or the footer right arrow reveals the next step. After the last step, the same action opens the next slide. `Backspace`, the left arrow key, a right click in the slide content, or the footer left arrow hides the previous step; from the first step, it returns to the preceding slide with that slide's steps already revealed. Interactive elements such as links, buttons, fields, the slide range, and code editors keep their normal pointer and keyboard behavior. The sidebar menu and the range navigate directly between slides and reset the selected slide's progressive content.

```html
<tp-markup-multi-slides
  repository="/slides"
  label="Presentation"
  git="https://example.com/presentation.git"
></tp-markup-multi-slides>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move between the slides rendered from the markup source.

Slides navigation menu
: Open the slide navigation menu and use it to move between the supplied slides.
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
<!-- tp-docgen:api TpMarkupMultiSlides -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-markup-multi-slides>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMarkupMultiSlides`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-markup-multi-slides>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-markup-multi-slides>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_markup-multi-slides.TpMarkupMultiSlides.html)
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
  <script type="module" src="/path/to/components/markup-multi-slides/markup-multi-slides.js"></script>
  ```

import
: ```js
  import "/path/to/components/markup-multi-slides/markup-multi-slides.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markup-multi-slides/markup-multi-slides.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markup-multi-slides>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-multi-pages
@summary Multi-page documentation with support for multiple markup languages.
-->
<!--
@tp-dependency tp-numberfield
@summary Numeric field with an optional native range slider.
-->

- [`<tp-markup-multi-pages>`](../markup-multi-pages/index.md) : Multi-page documentation with support for multiple markup languages.
- [`<tp-numberfield>`](../numberfield/index.md) : Numeric field with an optional native range slider.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
