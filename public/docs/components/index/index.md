<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="index" library="components" size="1.25em"></tp-icon> Index

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-index>` element defines an alphabetical index entry with optional descriptive content and links to its occurrences.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<div data-tp-reference-scope="">
  <p>A <tp-ref href="!matrix">matrix</tp-ref> represents a linear map.</p>
  <p>A square matrix<tp-ref href="!square" silent></tp-ref> has equal dimensions.</p>
  <tp-index ref="matrix" title="Matrix"><p>A rectangular array of numbers.</p></tp-index>
  <tp-index ref="square" title="Square matrix" parent="matrix"></tp-index>
  <tp-listof selector="tp-index" title="Subject index"></tp-listof>
</div>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-index" src="/docs/components/index/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage


See [Reference scope](#/components/references.md) for `data-tp-reference-scope`, nested boundaries and an editable example with repeated identifiers.

### Authoring

Define a term with `ref` and its displayed `title`. Use `sort-key` for an alternative sorting key, and `parent` to identify a parent entry. Descriptive HTML is optional: it is hidden here and available from a visible reference's tooltip.

Write `<tp-ref href="!term">visible term</tp-ref>` at each occurrence. With no label, the reference uses the entry title. Add `silent` for a zero-content marker without a keyboard stop; its location still appears in the index. Unlike notes, each occurrence has its own link.

Place `<tp-listof selector="tp-index" title="Subject index">` where the index belongs. Entries are sorted alphabetically and nested by parent. Occurrence links follow document order. `see` and `see-also` name another entry in the same index.

Use the same `index="people"` on definitions, references and the list to select a named index. The default name is `default`. References and lists use the nearest reference scope, rendered markup document, article or main. Duplicate entry identifiers use the first definition in a group; missing parents and cyclic parent chains are displayed at the root. Unresolved references remain disabled, and missing see targets are omitted. Edits to attributes, definitions and references update the list automatically.

### Markup conversion

The converter maps index occurrences to native imakeidx commands: makeindex, index and printindex. Visible reference labels and rich descriptions require additional TP wc commands because imakeidx does not describe interactive references or HTML definitions. Silent occurrences remain native index commands. Independent reference scopes use TP commands instead of merging their document-local indexes. Markdown, AsciiDoc and reStructuredText use their TP custom-element notation. No raw HTML is needed. The imakeidx subset limits entries to three levels and plain sorting/display terms; invalid native terms or cyclic parents cannot be exported as imakeidx.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/index/index.js"></script>
  ```

import
: ```js
  import "/path/to/components/index/index.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/index/index.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read a visible index reference and mark a second occurrence silently. Follow the generated links and inspect the parent/child terms in the index.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Named indexes and cross-references
: Compare subject and people indexes, follow occurrence links and use see/see also cross-references within each group.
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

- [`<tp-listof>`](#/components/listof/index.md) : Builds the alphabetical index with links to occurrences.
- [`<tp-ref>`](#/components/ref/index.md) : Marks visible or silent occurrences of this entry.
<!-- tp-docgen:dependencies:end -->

For multiple cross-references, `see` and `see-also` also accept a JSON array of identifiers, or objects such as `[{"ref":"target","label":"Original wording"}]`. The optional label preserves the wording of a source index while linking to the corresponding entry. Unresolved targets remain visible as text.
