<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="theorem" library="components" size="1.25em"></tp-icon> Theorem

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-theorem>` element presents theorems, lemmas, propositions, corollaries, definitions, examples, remarks and proofs with optional titles, numbering and references.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-theorem type="theorem" heading="Nonnegativity" number="1" id="square">
  <p>The square of every real number is nonnegative.</p>
</tp-theorem>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-theorem" src="/docs/components/theorem/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Statement types

The `type` attribute accepts `theorem`, `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark` and `proof`. `heading` adds a complementary title; `label` replaces the usual type name. Use a native `id` and a link to reference a statement.

### Rich headings

The `heading` attribute supplies plain text. For links, references, emphasis or formulas, provide an inline child such as `<span slot="heading">…</span>`. This content takes precedence over `heading` and stays in the light DOM. Its actual nodes are moved into the generated heading, so links and reference tooltips retain their behavior when the statement number changes. Removing the child restores the plain-text heading.

Native LaTeX optional titles containing commands or mathematics are parsed into this heading slot. A citation such as `\begin{proposition}[Companion input, {\cite[p. 12]{guide}}]` stays in the title. Exports preserve the authored heading content and use the native optional title in LaTeX.

### Background color

`variant="none"` is the default: no border, background or inner padding. Choose `neutral`, `brand`, `info`, `success`, `warning` or `danger` for a colored panel. Background, text and accent use the matching TP tokens and follow light/dark mode. The `brand` variant follows the current brand color.

### Numbering

`numbering="document"` is the default, except for proofs (`none`). Each type has an independent counter. Give statements the same `counter` to share a sequence. `numbering="section"` resets at each preceding `h1` or `h2`; `subsection` additionally resets at `h3`. Numbers follow document order within the same document or document fragment and update when statements are inserted, removed or changed.

An explicit `number` takes priority and does not consume the automatic counter. `number=""` or `numbering="none"` hides the number. `displayNumber` exposes the resolved number. For predictable independent documents, use separate viewers; `counter` names distinguish independent sequences within one document.

### Ending symbols and author content

The `qed` attribute appends an ending character or short text to any statement type. When `qed` is omitted, it defaults to an empty string, except for `type="proof"`, which uses `□`. Any explicit value takes priority, including `qed=""` to hide the proof symbol. For example, `type="theorem" qed="◆"` displays a diamond, while `type="proof" qed=""` has no ending symbol. An explicit symbol survives a change of type. Native LaTeX proof environments are converted with an explicit `qed="□"`. Generated labels and proof symbols are identified presentation nodes in the light DOM. Conversions omit these generated nodes and preserve the author's content without duplicate titles or symbols. Native links and nested components keep their usual behavior. Presentation uses shared TP color tokens in light and dark modes.

### Markup conversion

The HTML pivot uses `tp-theorem`. Markdown, AsciiDoc and reStructuredText use their native custom-element syntax. LaTeX uses `amsthm` declarations and theorem/proof environments, with TP attribute metadata when needed to preserve explicit numbers, IDs and settings. Automatic numbers are resolved when converting a whole document. Source labels and shared/reset counter metadata survive; the converter does not reconstruct arbitrary TeX macros or original declaration spelling.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/theorem/theorem.js"></script>
  ```

import
: ```js
  import "/path/to/components/theorem/theorem.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/theorem/theorem.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read a named theorem with an explicit number and a reference target.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Statement types
: Compare the eight statement types and the proof-ending symbol.

Shared section counters
: Compare the shared theorem/lemma sequence across two sections.

Background variants
: Compare the plain default with the six colored panels; switch the viewer between light and dark themes.

Ending symbols
: Compare a theorem and a definition with custom ending symbols, a proof with an explicit square and a proof without a symbol.

Rich heading and citation
: Hover or focus the citation in the proposition title to read its bibliography entry. The numeric label is shared with the generated bibliography.
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
<!-- tp-docgen:dependencies:end -->
