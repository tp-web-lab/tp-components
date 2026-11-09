<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="latex" library="components" size="1.25em"></tp-icon> LaTeX

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-latex>` element renders LaTeX documents, mathematical formulas and TikZ drawings.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-latex><script type="tp/latex">\section{A first document}
The area of a circle is $A=\pi r^2$.</script></tp-latex>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-latex" src="/docs/components/latex/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Generated headings, paragraphs and standard lists inherit the shared TP styles. Native `itemize`, `enumerate` and `description` lists are converted to semantic HTML throughout the document, including component bodies. Explicit item labels and authored raw HTML are preserved. The same conversion is used by LaTeX viewers, playgrounds and notebook cells.

### Initial content

::: tp-tabs
Inline source
: Use a `script` with `type="tp/latex"` to preserve backslashes and literal source.

Attribute
: Set `value` with a source string. An empty value clears the output.

External file
: Set `src` to a `.tex` file. A nonempty `src` takes precedence over the other inputs.
:::

### Configuration

Provide a literal source in a `script[type="tp/latex"]`, set `value`, or load a file with `src`. Source precedence is `src`, then `value`, then inline content. An empty `value` clears the output. Relative file URLs resolve against the containing document. Source changes replace the previous result; stale requests are discarded.

Use the supported LaTeX.js subset, generic \wc… commands and \rawhtml for authored HTML. Formulas use MathJax. This is an HTML renderer, not a full TeX distribution; arbitrary packages, BibTeX and PDF pagination are not supported. The rendered event signals document conversion; nested components can finish later.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/latex/latex.js"></script>
  ```

import
: ```js
  import "/path/to/components/latex/latex.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/latex/latex.js";
  ```
:::

<!-- -->
## Examples

Basic usage
: Read a section with an inline MathJax formula.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read a section with an inline MathJax formula.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
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
@tp-dependency tp-math
@summary renders LaTeX or AsciiMath expressions as inline or display-style SVG.
-->
<!--
@tp-dependency tp-tikz
@summary Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-math>`](#/components/math/index.md) : renders LaTeX or AsciiMath expressions as inline or display-style SVG.
- [`<tp-tikz>`](#/components/tikz/index.md) : Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.

### External

<!--
@credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
@summary LaTeX.js conversion and patched TikZJax assets.
-->

- [tp-latex](https://www.npmjs.com/package/@tp/tp-latex) : LaTeX.js conversion and patched TikZJax assets.

### See also

- [`<tp-tikz>`](#/components/tikz/index.md) : Render a standalone TikZ drawing.
<!-- tp-docgen:dependencies:end -->
