# <tp-icon name="markup-single-page" library="components" size="1.25em"></tp-icon> Markup single-page

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markup-single-page>` element implements the <tp-icon name="markup-single-page" library="components" size="1.25em"></tp-icon> Markup single-page functionality: renders one Markdown, AsciiDoc, reStructuredText or HTML document. *

<tp-markup-single-page>
  <script type="tp/markdown">
## A short guide

This document is rendered as a single page.

### Getting started

- Read the introduction
- Try a component
  </script>
</tp-markup-single-page>

## Usage

### User interactions

Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Personal annotations (comment with pencil in the toolbar) | Open the annotation list. Use the large + button to add an annotation, select a document element, enter text and Save. The close icon is at the right of the panel title. |
| Annotation pin | Click to open the note, or drag it to another document element. Its attachment is saved. |
| Edit / Reattach / Delete | Update the selected annotation, choose a new target, or remove it from this browser. Each note has pencil (Edit) and delete-outline (Delete) icon buttons in its bottom-right footer. |
| Annotation appearance | Choose color, heading, opacity (0–1) and rotation (−12–12°). Save stores these settings with the text; Cancel discards edits. Reset appearance defaults restores yellow, an empty heading, opacity 1 and rotation 0 without changing the text. |
| Reading | Read the document and follow its links. |
| Using the component | Use the table of contents and document controls when they are displayed. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Selecting an annotation target | Tab to a paragraph, heading or other available target, then Enter to select it. Escape cancels. |
| Annotation pin arrows | Move the folded annotation; Shift uses smaller steps. Enter or Space opens it. |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-markup-single-page>` as shown below.

```html
<tp-markup-single-page></tp-markup-single-page>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered markup document and use its page navigation controls.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpMarkupSinglePage -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Source file. The extension selects the renderer. |
  [Attributes of `<tp-markup-single-page>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMarkupSinglePage`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-markup-single-page-rendered</code> | <code>&#123; language: &quot;html&quot; \| &quot;markdown&quot; \| &quot;asciidoc&quot; \| &quot;restructuredtext&quot;; src: string &#125;</code> | Emitted after the selected renderer completes. |
  [Events emitted by `<tp-markup-single-page>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-markup-single-page>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_markup-single-page.TpMarkupSinglePage.html)
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
  <script type="module" src="/path/to/components/markup-single-page/markup-single-page.js"></script>
  ```

import
: ```js
  import "/path/to/components/markup-single-page/markup-single-page.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markup-single-page/markup-single-page.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markup-single-page>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-asciidoc
@summary Semantic AsciiDoc rendering component.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-restructuredtext
@summary reStructuredText rendering component.
-->

- [`<tp-asciidoc>`](../asciidoc/index.md) : Semantic AsciiDoc rendering component.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-restructuredtext>`](../restructuredtext/index.md) : reStructuredText rendering component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
