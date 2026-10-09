# List of elements

The custom `<tp-listof>` element builds a list of reference entries or links to labelled document elements.

<div data-tp-reference-scope="">
  <tp-listof selector="figure"></tp-listof>
  <figure><p>A diagram of the water cycle.</p><figcaption>The water cycle</figcaption></figure>
  <figure><p>A diagram of a food chain.</p><figcaption>A food chain</figcaption></figure>
</div>

## Usage

Set `selector` to any valid CSS selector, for example `tp-note`, `tp-biblio`, `tp-glossary`, `figure`, `table`, or `.illustration`. Elements must have at least one nonempty `ref`, `title`, `label`, `caption` or `figcaption` attribute, or a direct `caption` or `figcaption` child.

Notes are rendered as an ordered list (`ol`), in first-citation order, with one number per note. Repeated citations do not duplicate a note. Uncited notes follow the cited notes in definition order. A selector that includes only some notes preserves their document numbers.

Bibliography and glossary entries are rendered as description lists (`dl`, `dt`, `dd`) sorted alphabetically by their `ref` terms, ignoring case. Each bibliography term and description share one row in a two-column layout, with all descriptions aligned in the second column; glossary descriptions use the usual indentation. All three kinds retain their complete HTML content.

Other elements form a linked unordered list in document order. Their label uses the first available value: `title`, `label`, `caption` attribute, `figcaption` attribute, caption child, then `ref`. Existing IDs are preserved and missing IDs are generated. A mixed selector produces separate note, bibliography, glossary and ordinary-element lists in that order.

Place the list anywhere in the document, including before its entries or at the end.

An empty selector produces no entries. An invalid selector empties the list and sets `data-invalid-selector` without throwing an error. Generated lists and tooltip copies are excluded from selection, so lists never include their own output.

References and lists use the nearest `data-tp-reference-scope`, rendered markup document, `article` or `main`, falling back to the page body. Nested document scopes are independent. Identifiers should be unique within each reference kind and scope; the first matching definition is used for duplicates. Changes to definitions, labels and selected elements update existing tooltips and lists automatically.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| List link | Follow the link to its document element. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between generated links. |
| Enter | Follow the focused link. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Follow the generated figure links to their captions in the document.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Notes, bibliography and glossary
: Compare repeated note citations sharing one superscript number, bibliography citations and dotted glossary terms. Read the numbered notes and alphabetically sorted description lists at the end.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
html
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpListof -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>selector</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector for reference definitions or elements with a title, label or caption. |
  [Attributes of `<tp-listof>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpListof`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-listof>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-listof>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_listof_listof.TpListof.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-listof>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-biblio
@summary Defines a bibliography entry referenced by tp-ref.
-->
<!--
@tp-dependency tp-glossary
@summary Defines a glossary entry referenced by tp-ref.
-->
<!--
@tp-dependency tp-note
@summary Defines an HTML note referenced by tp-ref.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-biblio>`](../biblio/index.md) : Defines a bibliography entry referenced by tp-ref.
- [`<tp-glossary>`](../glossary/index.md) : Defines a glossary entry referenced by tp-ref.
- [`<tp-note>`](../note/index.md) : Defines an HTML note referenced by tp-ref.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
