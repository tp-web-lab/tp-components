# <tp-icon name="markdown" library="components" size="1.25em"></tp-icon> Markdown component

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markdown>` element implements the <tp-icon name="markdown" library="components" size="1.25em"></tp-icon> Markdown component functionality: markdown rendering component.

<tp-markdown>
  <script type="tp/markdown">
## A short document

This paragraph uses **Markdown**.

- Write content
- Add components
- Publish the page
  </script>
</tp-markdown>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the displayed content and use its links and embedded controls. |
| Using the component | The component itself adds no editing or playback controls. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

TeX and AsciiMath formulas use MathJax 4 with SVG output, matching the AsciiDoc and reStructuredText components. The math runtime is loaded on demand and reused on the same page.

#### Initial Markdown content

::: tp-tabs
no content
: ```html
  <tp-markdown></tp-markdown>
  ```

internal script
: ```html
  <tp-markdown>
    <script type="tp/markdown">
      # Document title

      Hello, **Markdown**!
    </script>
  </tp-markdown>
  ```

external file
: ```html
  <tp-markdown src="./example.md"></tp-markdown>
  ```
:::

#### Mathematics

AsciiMath
: Inline equation: :asciimath:`x=(-b +- sqrt(b^2 – 4ac))/(2a)`
: Display equation:
  ```asciimath
  sum_(i=1)^n i^3=((n(n+1))/2)^2
  ```

Latex
: Inline equation: :latexmath:`E = mc^2`
: Display equation:
  ```latexmath
  \begin{eqnarray}
  \hat{f}(\xi)&=&\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{-|x|}e^{-ix\xi}dx\\
  &=&\frac{1}{\sqrt{2\pi}}\int_{0}^{\infty}e^{-x-ix\xi}dx+\int_{-\infty}^0e^{x-ix\xi}dx\\
  &=&\frac{1}{\sqrt{2\pi}}\int_{0}^{\infty}(e^{-x-ix\xi}-e^{-x+ix\xi})dx\\
  &=&\frac{1}{\sqrt{2\pi}}[\frac{1}{-(1+i\xi)}(-1)-\frac{1}{-1+i\xi}(-1)]\\
  &=&\frac{1}{\sqrt{2\pi}}[\frac{1-i\xi}{1+\xi^2}+\frac{-(1+i\xi)}{1+\xi^2}]\\
  &=&\frac{1}{\sqrt{2\pi}}\frac{-2i\xi}{1+\xi^2}\\
  &=&-\sqrt{\frac{2}{\pi}}\frac{i\xi}{1+\xi^2}
  \end{eqnarray}
  ```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded markdown source is rendered as a formatted document.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Mathematical notation
: Compare inline and displayed mathematical notation written in AsciiMath and LaTeX.
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
<!-- tp-docgen:api TpMarkdown -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the src. |
  [Attributes of `<tp-markdown>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMarkdown`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-markdown-rendered</code> | <code>void</code> | Emitted when markdown rendered occurs. |
  [Events emitted by `<tp-markdown>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-markdown>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_markdown.TpMarkdown.html)
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
  <script type="module" src="/path/to/components/markdown/markdown.js"></script>
  ```

import
: ```js
  import "/path/to/components/markdown/markdown.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markdown/markdown.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markdown>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
@summary Markdown parsing and rendering.
-->

- [tp-markdown](https://www.npmjs.com/package/@tp/tp-markdown) : Markdown parsing and rendering.
<!-- tp-docgen:dependencies:end -->
