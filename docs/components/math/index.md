# <tp-icon name="math" library="components" size="1.25em"></tp-icon> Math

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-math>` element implements the Math functionality: renders LaTeX or AsciiMath expressions as inline or display-style SVG.

<p>The identity <tp-math value="a^2 + b^2 = c^2" label="a squared plus b squared equals c squared"></tp-math> describes a right triangle.</p>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Formula | Read the rendered expression. There are no component-specific buttons or editing controls. |
| Wide display formula | Scroll horizontally when the expression exceeds the available width. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Formula | No component-specific keyboard interaction; the expression is not an editable field. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `mode="latexmath"` (default) for LaTeX, or `mode="asciimath"` for AsciiMath. Supply the expression without surrounding `$`, `\(`, `\[` or backtick delimiters. Unknown modes fall back to LaTeX. The default SVG stays inline with the surrounding sentence. Add the boolean `displaystyle` attribute for a centered block with display-style fractions, sums and integrals; remove it to return inline. Boolean attributes use presence=true, absence=false.

Source precedence follows [TpDeclarativeTextSource](../../../api/classes/utilities_declarative-text-source.TpDeclarativeTextSource.html): nonempty `src`, nonempty `value`, an internal `tp/math` or `tp/txt` script, then direct text. Use scripts for source that contains HTML-sensitive characters. Their inert `tp/` type prevents JavaScript execution. Inline source is preserved across rendering and reconnection; change `value` or `src` to update the formula rather than editing generated SVG nodes. Empty input produces no formula.

```html
<tp-math displaystyle>
  <script type="tp/math">\frac{1}{2\sqrt{x}}</script>
</tp-math>
<tp-math src="/tp-components/docs/components/math/examples/identity.txt"></tp-math>
```

`label` supplies a human-readable accessible description; otherwise the source expression names the SVG. MathJax 4 is loaded lazily through the renderer already used by `@tp/tp-markdown`, sharing its runtime rather than loading a second copy. Loading and rendering failures show a warning and emit `tp-math-error`. Changing attributes retries rendering; obsolete requests cannot replace newer results. Rendering needs access to the MathJax CDN unless the page has already loaded a compatible runtime.

For editing an expression, use [tp-mathfield](../mathfield/index.md). This component only displays it.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the Pythagorean identity inline with its surrounding sentence. The formula is rendered as SVG, not as editable source text.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

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

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

Set `value`, `mode`, `displaystyle`, `label` or `src` to update the formula. Listen for `tp-math-rendered` after a successful nonempty render, or `tp-math-error` for a loading or rendering failure. Updates are asynchronous and consecutive attribute changes are grouped into one render.

### API

<!-- tp-docgen:api TpMath -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>displaystyle</code> | <code>boolean</code> | <code>false</code> | Uses display-style mathematics in a centered block instead of inline mathematics. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Accessible description of the formula; defaults to its source text. |
  | <code>mode</code> | <code>&quot;latexmath&quot; \| &quot;asciimath&quot;</code> | <code>&quot;latexmath&quot;</code> | Mathematical input notation. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Expression file; takes precedence over value and inline content. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Expression without surrounding math delimiters. |
  [Attributes of `<tp-math>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMath`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-math-error</code> | <code>&#123; message: string &#125;</code> | Emitted when loading or rendering the current expression fails. |
  | <code>tp-math-rendered</code> | <code>&#123; value: string; mode: TpMathMode; displaystyle: boolean &#125;</code> | Emitted after the current expression is rendered successfully. |
  [Events emitted by `<tp-math>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-math>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_math.TpMath.html)
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



<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-math>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.

### External

<!--
@credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
@summary Markdown parsing and rendering.
-->

- [tp-markdown](https://www.npmjs.com/package/@tp/tp-markdown) : Markdown parsing and rendering.
<!-- tp-docgen:dependencies:end -->
