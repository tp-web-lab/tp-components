<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="equanum" library="components" size="1.25em"></tp-icon> Equation number

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-equanum>` element associates an equation with its number and reference previews.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<div data-tp-reference-scope="">
  <tp-equanum ref="energy" number="2.1">
    <tp-math displaystyle value="E = mc^2"></tp-math>
  </tp-equanum>
  <p>See equation <tp-ref href="=energy"></tp-ref>.</p>
</div>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-equanum" src="/docs/components/equanum/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Numbered equations

Put a display `tp-math` inside `tp-equanum`. Set `ref` to a document-local identifier and `number` to the explicit number, without parentheses. The component displays the number at the right edge. It does not invent a numbering sequence.

Use `tp-ref href="=energy"` to display `(2.1)` and preview the equation on hover or keyboard focus. A `label` on the reference overrides that text. References use the same document boundaries as notes and bibliography entries; unresolved references remain disabled.

### Reference scope

The Basic usage example wraps the equation and its reference in `div[data-tp-reference-scope]`. This attribute defines a local reference boundary: `tp-ref` resolves `energy` inside that boundary, allowing independent examples to reuse the same identifier. The empty attribute value is intentional; its presence defines the boundary.

The wrapper is optional when an enclosing document already provides the intended scope, such as an `article`, `main` or a TP markup output. Without such a boundary, references use the document body. The `div` adds no visual presentation.

See [Reference scope](#/components/references.md) for `data-tp-reference-scope`, nested boundaries and an editable example with repeated identifiers.

### Existing MathJax numbers

Set `target="#formula-id"` to associate the definition with an existing equation. This form is hidden and adds no number. TP LaTeX uses it to preserve MathJax tags and aligned multi-row environments; references to align, alignat, flalign, gather and eqnarray rows preview only the labelled row and its number. A multline equation retains its complete-group preview. Multiple labels may target the same group.

### Native LaTeX conversion

Simple wrappers export as `equation` with `tag` and `label`; references export as `ref` or `eqref`. TP LaTeX's equation groups retain their native environment, row tags and labels. Markdown, AsciiDoc and reStructuredText retain the preview association through TP custom elements because their native mathematical notation does not describe this interaction. Unsupported rich wrappers, AsciiMath and unresolved targets retain their custom-element form.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/equanum/equanum.js"></script>
  ```

import
: ```js
  import "/path/to/components/equanum/equanum.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/equanum/equanum.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus the equation reference to preview its mathematical expression and compare it with the numbered equation.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

align row previews
: Compare references to the two rows of a native LaTeX align environment; each tooltip contains only its own equation and number.

alignat row previews
: Compare two rows with two equation pairs; each preview retains the alignat column-pair count and the referenced row's number.

flalign row previews
: Compare full-width rows in the document with their compact previews; the source retains flalign while each tooltip uses align.

gather row previews
: Compare independently centered equations; each reference previews its own row and number.

eqnarray row previews
: Compare references to the two rows of a native LaTeX eqnarray environment, preserving its three-column alignment in each preview.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
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

### See also

- [`<tp-math>`](#/components/math/index.md) : Renders the mathematical expression.
- [`<tp-ref>`](#/components/ref/index.md) : Displays an equation preview for an equals-prefixed reference.
<!-- tp-docgen:dependencies:end -->
