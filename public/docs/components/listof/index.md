<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="listof" library="components" size="1.25em"></tp-icon> List of elements

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-listof>` element builds a list of reference entries or links to labelled document elements.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<div data-tp-reference-scope="">
  <tp-listof selector="figure"></tp-listof>
  <figure><p>A diagram of the water cycle.</p><figcaption>The water cycle</figcaption></figure>
  <figure><p>A diagram of a food chain.</p><figcaption>A food chain</figcaption></figure>
</div>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-listof" src="/docs/components/listof/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage


See [Reference scope](#/components/references.md) for `data-tp-reference-scope`, nested boundaries and an editable example with repeated identifiers.

For a list covering the pages declared in a multi-page guide, use [tp-global-listof](#/components/global-listof/index.md). It provides page and anchor links without changing local reference scopes or numbering.

### Authoring

Set `selector` to any valid CSS selector, for example `tp-note`, `tp-biblio`, `tp-glossary`, `figure`, `table`, or `.illustration`. Elements must have at least one nonempty `ref`, `title`, `label`, `caption` or `figcaption` attribute, or a direct `caption` or `figcaption` child.

Notes are rendered as an ordered list (`ol`), in first-citation order, with one number per note. Repeated citations do not duplicate a note. Uncited notes follow the cited notes in definition order. A selector that includes only some notes preserves their document numbers.

Bibliography and glossary entries are rendered as description lists (`dl`, `dt`, `dd`) sorted alphabetically by their `ref` terms, ignoring case. Each bibliography term and description share one row in a two-column layout, with all descriptions aligned in the second column; glossary descriptions use the usual indentation. All three kinds retain their complete HTML content.

Other elements form a linked unordered list in document order. Their label uses the first available value: `title`, `label`, `caption` attribute, `figcaption` attribute, caption child, then `ref`. Existing IDs are preserved and missing IDs are generated. A mixed selector produces separate note, bibliography, glossary and ordinary-element lists in that order.

Place the list anywhere in the document, including before its entries or at the end.

An empty selector produces no entries. An invalid selector empties the list and sets `data-invalid-selector` without throwing an error. Generated lists and tooltip copies are excluded from selection, so lists never include their own output.

References and lists use the nearest `data-tp-reference-scope`, rendered markup document, `article` or `main`, falling back to the page body. Nested document scopes are independent. Identifiers should be unique within each reference kind and scope; the first matching definition is used for duplicates. Changes to definitions, labels and selected elements update existing tooltips and lists automatically.

### Index references

Use `tp-index` to define a term and `tp-ref href="!term"` to mark each occurrence. The visible label is the reference content, or the entry title when omitted. `silent` marks a location without visible text or a keyboard stop. Use the same `index="name"` on the definition, reference and list to select a named group. Default group: `default`.

`tp-listof selector="tp-index"` produces an alphabetical hierarchy with occurrence links and see/see also cross-references. The optional `title` names the index. See the [Index examples](#/components/index/index.md) for visible references, silent occurrences and multiple indexes.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/listof/listof.js"></script>
  ```

import
: ```js
  import "/path/to/components/listof/listof.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/listof/listof.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Follow the generated figure links to their captions in the document.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Notes, bibliography and glossary
: Compare repeated note citations sharing one superscript number, bibliography citations and dotted glossary terms. Read the numbered notes and alphabetically sorted description lists at the end.
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
<!--
@tp-dependency tp-biblio
@summary Defines a hidden bibliography entry for reference tooltips and generated lists.
-->
<!--
@tp-dependency tp-glossary
@summary Defines a hidden glossary entry for reference tooltips and generated lists.
-->
<!--
@tp-dependency tp-index
@summary Defines an alphabetical index entry with optional descriptive content and links to its occurrences.
-->
<!--
@tp-dependency tp-note
@summary Defines a hidden HTML note for reference tooltips and generated lists.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-biblio>`](#/components/biblio/index.md) : Defines a hidden bibliography entry for reference tooltips and generated lists.
- [`<tp-glossary>`](#/components/glossary/index.md) : Defines a hidden glossary entry for reference tooltips and generated lists.
- [`<tp-index>`](#/components/index/index.md) : Defines an alphabetical index entry with optional descriptive content and links to its occurrences.
- [`<tp-note>`](#/components/note/index.md) : Defines a hidden HTML note for reference tooltips and generated lists.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
