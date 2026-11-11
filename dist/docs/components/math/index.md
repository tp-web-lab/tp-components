<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="math" library="components" size="1.25em"></tp-icon> Math

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-math>` element displays mathematical expressions as inline formulas or separate equations.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<p>The identity <tp-math value="a^2 + b^2 = c^2" label="a squared plus b squared equals c squared"></tp-math> describes a right triangle.</p>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-math" src="/docs/components/math/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

Published documents can include a pre-rendered SVG with the original expression and rendering parameters. Matching output is reused without downloading MathJax, including copies in notes and reference lists. Changing the expression or rendering parameters loads the renderer on demand. The source remains available when an attribute override is removed.

### Authoring

Use `mode="latexmath"` (default) for LaTeX, or `mode="asciimath"` for AsciiMath. Supply the expression without surrounding `$`, `\(`, `\[` or backtick delimiters. Unknown modes fall back to LaTeX. The default SVG stays inline with the surrounding sentence. Add the boolean `displaystyle` attribute for a centered block with display-style fractions, sums and integrals; remove it to return inline. Boolean attributes use presence=true, absence=false.

Source precedence follows [TpDeclarativeTextSource](../../../api/classes/utilities_declarative-text-source.TpDeclarativeTextSource.html): nonempty `src`, nonempty `value`, an internal `tp/math` or `tp/txt` script, then direct text. Use scripts for source that contains HTML-sensitive characters. Their inert `tp/` type prevents JavaScript execution. Inline source is preserved across rendering and reconnection; change `value` or `src` to update the formula rather than editing generated SVG nodes. Empty input produces no formula.

```html
<tp-math displaystyle>
  <script type="tp/math">\frac{1}{2\sqrt{x}}</script>
</tp-math>
<tp-math src="/docs/components/math/examples/identity.txt"></tp-math>
```

`label` supplies a human-readable accessible description; otherwise the source expression names the SVG. MathJax 4 is loaded lazily through the renderer already used by `@tp/tp-markdown`, sharing its runtime rather than loading a second copy. Loading and rendering failures show a warning and emit `tp-math-error`. Changing attributes retries rendering; obsolete requests cannot replace newer results. Rendering needs access to the MathJax CDN unless the page has already loaded a compatible runtime.

For editing an expression, use [tp-mathfield](../mathfield/index.md). This component only displays it.

### Programming notes

Set `value`, `mode`, `displaystyle`, `label` or `src` to update the formula. Listen for `tp-math-rendered` after a successful nonempty render, or `tp-math-error` for a loading or rendering failure. Updates are asynchronous and consecutive attribute changes are grouped into one render.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/math/math.js"></script>
  ```

import
: ```js
  import "/path/to/components/math/math.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/math/math.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the Pythagorean identity inline with its surrounding sentence. The formula is rendered as SVG, not as editable source text.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Script and display style
: Compare the same fraction in inline and display style, supplied by inert tp/math scripts. Display style enlarges the fraction and places it in a centered block.

AsciiMath
: Compare an AsciiMath square-root expression inline and in display style. Both formulas use the same source notation and SVG renderer.

External expression
: Read the identity loaded from a reviewed local text file. The file contains only the expression, without math delimiters.
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
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.

### External

<!--
@credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
@summary Markdown parsing and rendering.
-->

- [tp-markdown](https://www.npmjs.com/package/@tp/tp-markdown) : Markdown parsing and rendering.
<!-- tp-docgen:dependencies:end -->
