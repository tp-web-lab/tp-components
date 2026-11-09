<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markdown" library="components" size="1.25em"></tp-icon> Markdown component

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markdown>` element renders Markdown documents.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-markdown>
  <script type="tp/markdown">
## A short document

This paragraph uses **Markdown**.

- Write content
- Add components
- Publish the page
  </script>
</tp-markdown>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markdown" src="/docs/components/markdown/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

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

### Mathematics

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

### Authoring

TeX and AsciiMath formulas use MathJax 4 with SVG output, matching the AsciiDoc and reStructuredText components. The math runtime is loaded on demand and reused on the same page.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded markdown source is rendered as a formatted document.

Mathematical notation
: Compare inline and displayed mathematical notation written in AsciiMath and LaTeX.
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
@credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
@summary Markdown parsing and rendering.
-->

- [tp-markdown](https://www.npmjs.com/package/@tp/tp-markdown) : Markdown parsing and rendering.
<!-- tp-docgen:dependencies:end -->
