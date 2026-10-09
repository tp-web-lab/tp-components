# Note

The custom `<tp-note>` element defines a hidden HTML note for reference tooltips and generated lists.

<div data-tp-reference-scope="">
  <p>Read more <tp-ref href="^example"></tp-ref>.</p>
  <tp-note ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-note>
  <tp-listof selector="tp-note"></tp-listof>
</div>

## Usage

Use `ref="identifier"` to identify this entry. Its HTML blocks remain hidden at their original location. A `tp-ref` shows them in a tooltip, and `tp-listof` displays their full content where the list is placed. Note numbers follow the first occurrence of each note in the text; repeated references reuse that number. Bibliography and glossary terms use their `ref` identifier.

The identifier does not include the prefix: use `^identifier` for `tp-note`, `@identifier` for `tp-biblio`, and `%identifier` for `tp-glossary` in a reference's `href`.

References and lists use the nearest `data-tp-reference-scope`, rendered markup document, `article` or `main`, falling back to the page body. Nested document scopes are independent. Identifiers should be unique within each reference kind and scope; the first matching definition is used for duplicates. Changes to definitions, labels and selected elements update existing tooltips and lists automatically.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| None | No component-specific mouse interaction; the definition is hidden. Its content is displayed through references and generated lists. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| None | No component-specific keyboard interaction. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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
<!-- tp-docgen:api TpNote -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>ref</code> | <code>string</code> | <code>&quot;&quot;</code> | Identifier used by references in this document. |
  [Attributes of `<tp-note>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpNote`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-note>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-note>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_note_note.TpNote.html)
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
  <script type="module" src="/path/to/components/note/note.js"></script>
  ```

import
: ```js
  import "/path/to/components/note/note.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/note/note.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-note>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
