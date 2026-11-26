<!-- tp-docgen:page-layout:v2 -->
# <tp-icon name="global-listof" library="components" size="1.25em"></tp-icon> Global list of elements

The custom `<tp-global-listof>` element lists labelled elements across the pages of a multi-page document, with links to their pages and anchors.

<div class="tp-component-doc-example">
<!-- tp-docgen:introduction:start -->
<tp-box style="position: relative; contain: layout; block-size: 32rem; padding: 0;">
  <tp-html-multi-pages repository="/docs/components/global-listof/examples/guide" label="Global lists" menu=""></tp-html-multi-pages>
</tp-box>
<!-- tp-docgen:introduction:end -->
</div>

## Component viewer

<tp-component-viewer tag="tp-global-listof" src="/docs/components/global-listof/examples/component-viewer.html"></tp-component-viewer>

## Usage

Place the component in a page loaded by any `tp-*-multi-pages` shell. Set `selector` to the elements to collect, for example `figure`, `table`, `tp-biblio`, `tp-note`, `tp-glossary`, `tp-index`, `tp-theorem` or `tp-equanum`. The introductory guide groups ten pages under **Appendices** in its navigation: **List of figures**, **List of tables**, **List of equations**, **List of codes**, **List of theorems**, **List of definitions**, **List of notes**, **Glossary**, **Bibliography** and **Index**. Both chapters define terms, bibliography entries and index subjects; their local references and lists make the definitions readable. Each appendix contains its own global list:

```html
<tp-global-listof selector="figure" title="List of figures"></tp-global-listof>

<!-- In the separate List of tables appendix: -->
<tp-global-listof selector="table" title="List of tables"></tp-global-listof>

<!-- In the separate List of equations appendix: -->
<tp-global-listof selector="tp-equanum" title="List of equations"></tp-global-listof>

<!-- In the separate List of codes appendix: -->
<tp-global-listof selector="pre[label]" title="List of codes"></tp-global-listof>

<!-- In the separate List of theorems appendix: -->
<tp-global-listof selector="tp-theorem:not([type]), tp-theorem[type='theorem']" title="List of theorems"></tp-global-listof>

<!-- In the separate List of notes appendix: -->
<tp-global-listof selector="tp-note" title="List of notes"></tp-global-listof>

<!-- Each declaration below belongs to its own appendix: -->
<tp-global-listof merge selector="tp-glossary" title="Glossary"></tp-global-listof>
<tp-global-listof merge selector="tp-biblio" title="Bibliography"></tp-global-listof>
<tp-global-listof merge selector="tp-index" title="Index"></tp-global-listof>
```

### Pages, labels and navigation

Source links create browser history entries. Back returns to the previous page and reading position, restoring the list’s expanded sections; Forward returns to the linked object. Embedded guides keep the parent document’s address unchanged.

The list indexes the internal pages declared in the nearest shell's sidebar, in navigation order. Include the cover in that navigation to index it too. It does not crawl arbitrary links, external sites or files not listed there. Mixed guides detect each page's language from its file extension.

Labels use title, label or caption attributes, a direct caption/figcaption child, then ref; headings may use their text. Inside accordion panels, links show only the object label or equation number; the section name appears once in the summary. Other link lists retain the page title followed by the element label. Matching elements without a label are omitted. For tp-index definitions, index selects the named group (default: default).

Existing authored IDs are used as anchors. Otherwise a route locator uses the element tag, label and occurrence on that page; navigation inserts an empty anchor immediately before the target. Prefer stable authored IDs for permanent links, since renaming or reordering repeated labels changes a generated locator. The source definitions remain hidden. For `tp-glossary`, `tp-biblio` and `tp-index`, the global list displays a native description list: each linked term leads to its first source definition, and its description shows the definition content. For `tp-note`, it displays an ordered list with the note content and its source-page link. Each item retains its original local number using the same first-citation rules as `tp-listof`; equations display their mathematical content beneath the source link and its local number. Figures display their content and caption as thumbnails in a native `figure` below the source-page link. Previews fit within 20rem in width and media within 14rem in height, shrinking on narrow screens while preserving the complete image. Source figures retain their original size. Other targets remain link lists.

When a guide is embedded inside another multi-page document, its links navigate locally without consuming or changing the parent document route. Standalone guides continue to use page-and-anchor routes in the browser address.

Definition copies retain text, emphasis and HTML content. Bibliographies and glossaries are sorted by their displayed term; indexes use `sort-key` or `ref` within each level. Other lists retain page-navigation order. Relative links and media URLs are resolved from the source page; links to indexed pages keep multi-page navigation. IDs and definition keys are not duplicated, and scripts are not copied. A `tp-ref` inside a copied definition becomes a link to its definition in the source page, or plain text if unresolved; it does not acquire the appendix's reference scope. Source definitions and their local numbering remain unchanged.

Note numbering is computed from all notes and citations in each source scope before applying the selector. Repeated citations share a number; uncited notes follow cited notes. Notes are ordered by local number within their source scope, while page order follows navigation. Filtering the list does not renumber its entries. Different pages or nested scopes can therefore both display note 1: their source links identify the corresponding definitions.

### Separate sections or a merged list

By default, all matching elements are grouped in a `tp-accordion`, with one panel per source page, using its chapter title from the navigation as the summary. All matching entries from that page share the same panel, even when they belong to different subsections. Sections are initially collapsed and may be expanded independently. Thumbnails, tables with their captions, formulas, code blocks, theorem statements, note contents, local numbers and source links remain inside their section. This default also applies to bibliographies, glossaries, indexes and arbitrary selectors such as `h1`.

Add the boolean `merge` attribute to combine entries from all pages into a single global list without accordion panels. Local numbers, contents and source links are preserved. Ordinary entries keep their source-page title in the link when merged. Bibliographies, glossaries and indexes merge identical definitions across pages only in this mode, retaining their grouped occurrence links and index hierarchy. Without `merge`, definitions are collected separately inside each page panel.

```html
<!-- Closed panels, one per source section (default). -->
<tp-global-listof selector="figure"></tp-global-listof>

<!-- All figures together. -->
<tp-global-listof selector="figure" merge></tp-global-listof>

<!-- One merged bibliography. -->
<tp-global-listof selector="tp-biblio" merge></tp-global-listof>
```

The **Compare merge modes** example below provides a single-option `tp-checkbox-list` labelled **Merge across pages**. Check it to merge the shared bibliography entry; clear it to restore the two closed chapter panels, on the same list instance.

`merge` is a presence attribute: omit it for false, include it for true. Set `element.merge = true` or `false` to switch dynamically. The introductory Bibliography, Glossary and Index appendices explicitly use `merge`; the other appendices retain closed sections. Mixed selectors retain the appropriate native list structure for each entry kind.

### List of tables

The introductory **List of tables** appendix displays four native tables, including their captions, column headings and row headings. Each chapter contains an **Activities** section with an authored table ID and a **Schedule** section with a generated locator. The two chapter panels start closed; each contains both tables. Expand them to compare the tables, then follow the source links back to their chapters. Copied tables retain cell formatting and relative resource links without duplicating source IDs.

### List of codes

The introductory **List of codes** appendix selects `pre[label]` blocks. Each chapter has a **Greeting** example with an authored ID and a **Total duration** example with a generated locator. One closed panel per chapter contains both blocks. Links display only their labels. The copied native `pre`/`code` preserves source indentation, line breaks and the language class, and uses the shared code-block styling. Following a label opens the original block in its chapter.

### List of theorems

The introductory **List of theorems** appendix shows two theorems per chapter, numbered locally 1 and 2. The separate **List of definitions** appendix collects only definitions. Lemmas and proofs remain in the chapter text without their own appendix. The first chapter contains **Lemma 1** and **Definition 1**; the second contains an unnumbered **Proof** ending with □. Each list includes only chapters with matching statements, in closed panels. Each link displays the type, original number and complementary heading, without repeating the chapter name. The first theorem has an authored ID; the second uses a generated locator.

Use attribute selectors to choose the statement type. The theorem selector also includes components whose omitted `type` defaults to `theorem`:

```html
<tp-global-listof selector="tp-theorem:not([type]), tp-theorem[type='theorem']"></tp-global-listof>
<tp-global-listof selector="tp-theorem[type='definition']"></tp-global-listof>
```

`selector="tp-theorem"` remains available for a combined list of all statement types.

Numbers are resolved from every theorem in the source document before applying the selector, using the same counters as `tp-theorem`. Explicit numbers, suppressed numbers and section-based counters are retained. Copies receive a fixed number so the appendix does not renumber them. Type, heading, variant and QED symbol are preserved; source IDs are not duplicated.

### List of equations

The introductory **List of equations** appendix collects two equations per chapter. Both chapters use the same local keys, `law` and `relation`, and the same numbers, (1) and (2). Each entry displays the formula below a link containing the equation's explicit `number`, without assigning a new global number. The copy does not introduce another equation definition or change local reference scopes. The first equation has an authored ID; the second uses a generated locator. Follow all four links to compare their formulas and local references. Equations without an explicit number use the usual label fallback.

### Global bibliography and citation links

With `merge`, all selected `tp-biblio` definitions form one `dl`, including when other element kinds are selected. Each term uses its label attribute or reference key, as in `tp-listof`; terms are sorted alphabetically. Definitions merge only when both the nonempty `ref` and the normalized HTML content match. Formatting is retained, attribute order and insignificant indentation are normalized, and whitespace in literal code is preserved. Relative URLs are resolved before comparison, so two relative images pointing to different files are not treated as identical. Different definitions under the same key remain separate; the first definition's display label is used when identical copies have different labels.

Under each definition, **Sources** groups links by page: for example, **First chapter: 1, 2 · Second chapter: 1, 2**. Each number links to one citation in the document content, in source order on that page. These occurrence numbers belong only to the return links and do not alter `tp-ref` labels or local numbering. The term itself links to the first original definition. An uncited source definition has a **definition** return link instead of citation numbers.

Citation lookup follows the original reference scopes: a citation is associated with the first matching definition in its own scope, without falling back to a parent scope. Citations inside hidden definitions and generated lists/tooltips are excluded from return links. Authored citation IDs are retained; otherwise generated locators identify the citation by its href and position, independently of its rendered label.

The introductory bibliography demonstrates one handbook merged across both chapters (two citations per chapter), different regional guides under the same key, and an uncited entry. Follow every Sources link to compare the distinct citation locations.

### Global glossary and index occurrence links

With `merge`, all selected glossary definitions form one `dl`; index definitions form another. As with the bibliography, a nonempty reference key and identical normalized content are required for fusion. Different keys or conflicting definitions remain separate. The first copy supplies the displayed term. Index groups, parents, `see` and `see-also` values must also match.

**Sources** lists every matching occurrence grouped by page and ordered within that page. This includes `tp-ref[silent]` index markers: their links reach an invisible anchor at the marker's location. An unused definition retains a **definition** link. Occurrences resolve only in their own reference scope and index group; unresolved inner references never borrow an outer definition.

The introductory glossary and index each show a common definition with two occurrences per chapter, two different local definitions under the same key, and an unused definition. Follow the numbered links to compare all locations. These return-link numbers do not change local labels or numbering.

### Hierarchical global index

The introductory **Index** appendix demonstrates `parent`, `see` and `see-also`. **Shared subject** contains **Water cycle** and **Food chain**, defined in different chapters. **Local term** points to Shared subject with **see**; **Further term** uses **see also**. These links focus the destination inside the global index; Sources links still open the original pages.

```html
<!-- First chapter -->
<tp-index ref="shared" title="Shared subject">A common definition.</tp-index>
<tp-index ref="water" title="Water cycle" parent="shared">Water movement.</tp-index>
<tp-index ref="alias" title="Alternative term" see="shared"></tp-index>

<!-- Second chapter -->
<tp-index ref="shared" title="Shared subject">A common definition.</tp-index>
<tp-index ref="food" title="Food chain" parent="shared">Feeding relationships.</tp-index>
<tp-index ref="related" title="Related term" see-also="shared"></tp-index>

<!-- Index appendix -->
<tp-global-listof merge selector="tp-index"></tp-global-listof>
```

Children use nested description lists and retain their contents and occurrence links. Siblings sort by `sort-key`, falling back to `ref`, as in `tp-listof`. Relationships prefer a unique definition in the original scope; otherwise they can target a unique global entry in the selected index. An ambiguous or missing parent leaves the child at the root; an unresolved renvoi shows its key without a link. Parent cycles spanning indexed pages remain at the root. This does not extend the lookup scope of local `tp-ref` elements.

### Independent reference scopes

Source definitions remain independent even when their ref or id values match. Definition copies with identical content are grouped only in the global display. This does not renumber notes/equations, change tp-ref lookup, or create cross-page reference tooltips. Local numbering starts and behaves exactly as before. Nested reference scopes are not merged; this component only lists navigation targets across them.

### Bibliographies, glossaries and indexes across pages

The three reference guides below each contain an overview and two chapter pages. Follow all four global links: one definition per chapter has an authored ID, and the other uses a generated anchor. Each chapter includes local references and a local list so its hidden definitions can be read without changing their visibility.

The same reference key is deliberately defined on both pages. Local tooltips resolve only that page's definition. Different bibliography definitions sharing a key remain separate in the global list, with source links that distinguish their pages. The index guide uses `index="topics"` and excludes definitions from the `other` group.

### Loading and refresh

Indexing starts when a global list is connected. It parses page sources into detached documents without executing authored script elements or connecting interactive components. Generated lists and tooltips are excluded. Lists in the same shell share cached page snapshots. Call `await element.refresh()` after source files change to clear that shell's cache and rebuild this list; refresh other already displayed lists when needed. Reloading the sidebar clears the cache and updates connected lists.

Missing pages produce a status message while available entries remain usable. Invalid selectors report an error without throwing. Outside a multi-page shell, the component explains where it must be placed. Content created only by runtime scripts is not indexed. A snapshot does not track subsequent edits inside another page's interactive components.

<!-- tp-docgen:api TpGlobalListof -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>index</code> | <code>string</code> | <code>&quot;default&quot;</code> | Named index used when selecting tp-index definitions. |
  | <code>selector</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector identifying the elements to list on each page. |
  | <code>title</code> | <code>string</code> | <code>&quot;&quot;</code> | Heading displayed above the generated list. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-global-listof>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>refresh</code> | <code>refresh(): Promise&lt;void&gt;</code> | Reloads the document index after files have changed. |
  [Public methods of `TpGlobalListof`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-global-listof-ready</code> | <code>&#123; count: number; failures: number &#125;</code> | Emitted after indexing with the entry count and number of unavailable pages. |
  [Events emitted by `<tp-global-listof>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-global-listof>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_global-listof_global-listof.TpGlobalListof.html)
<!-- tp-docgen:typedoc:end -->































































































### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/global-listof/global-listof.js"></script>
  ```

import
: ```js
  import "/path/to/components/global-listof/global-listof.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/global-listof/global-listof.js";
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open Appendices to browse List of figures, List of tables, List of equations, List of codes, List of theorems, List of definitions, List of notes, Glossary, Bibliography and Index. Follow the entries to both chapters and compare authored and generated anchors while references remain local.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Markdown guide
: Follow figure and note entries across the guide pages, including a figure without an authored ID. Return to Overview to compare targets on other pages.

AsciiDoc guide
: Follow figure and note entries across the guide pages, including a figure without an authored ID. Return to Overview to compare targets on other pages.

LaTeX guide
: Follow figure and note entries across the guide pages, including a figure without an authored ID. Return to Overview to compare targets on other pages.

reStructuredText guide
: Follow figure and note entries across the guide pages, including a figure without an authored ID. Return to Overview to compare targets on other pages.

Mixed markup guide
: Follow figure and note entries across the guide pages, including a figure without an authored ID. Return to Overview to compare targets on other pages.

Bibliography across pages
: Follow four bibliography links across two chapters. Compare independent entries with the same ref, authored anchors and generated anchors, then read the local bibliography.

Glossary across pages
: Open the glossary definitions on each chapter page. The shared Model term retains its page-specific definition; local references and lists expose its content.

Index across pages
: Navigate to four definitions in the topics index across two chapters. The other index is excluded, and local occurrence links retain their page scope.

Compare merge modes
: Toggle Merge across pages to compare two chapter panels with one merged bibliography. The shared definition and all four citation links remain available; switching back restores closed panels.
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
@tp-dependency tp-accordion
@summary Collapsible multi-panels element.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-theorem
@summary Theorems, definitions, examples, remarks and proofs.
-->

- [`<tp-accordion>`](#/components/accordion/index.md) : Collapsible multi-panels element.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-theorem>`](#/components/theorem/index.md) : Theorems, definitions, examples, remarks and proofs.

### External

<!--
@summary No external dependency.
-->
No external dependency

### See also

- [`<tp-listof>`](#/components/listof/index.md) : Lists elements in the current document scope.
- [`<tp-markup-multi-pages>`](#/components/markup-multi-pages/index.md) : Provides pages and navigation for mixed markup documents.
<!-- tp-docgen:dependencies:end -->

For an alphabetical subject index, combine `selector="tp-index"`, `merge` and `group-by="letter"`. Each letter has its own initially closed `tp-accordion`; non-letter sorting keys appear under “Symbols”. Subentries stay with their parent, and a cross-reference opens the destination letter before scrolling to its entry.
