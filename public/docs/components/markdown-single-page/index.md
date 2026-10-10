# <tp-icon name="markdown-single-page" library="components" size="1.25em"></tp-icon> Markdown single-page

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markdown-single-page>` element implements the <tp-icon name="markdown-single-page" library="components" size="1.25em"></tp-icon> Markdown single-page functionality: renders one document with tp-markdown. *

<tp-markdown-single-page>
  <script type="tp/markdown">
## A short guide

This document is rendered as a single page.

### Getting started

- Read the introduction
- Try a component
  </script>
</tp-markdown-single-page>

## Usage

### User interactions

The toolbar is optional. The interactions below are available only when the corresponding controls are displayed. Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Code | Open or close the document source in a drawer, without replacing the rendered document. |
| Calculator | Open or close the scientific calculator. |
| Clock | Read the time; hover to display the date. |
| Language | Select an available translation of this document. |
| Color / Theme | Change the brand color or the light/dark appearance. |
| Fullscreen | Enter or leave fullscreen for this page. |
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

The toolbar is hidden by default. Add `toolbar` (or `toolbar=""`) to display all available controls, or give a comma-separated selection. The toolbar updates immediately without reloading the document. Unknown names and duplicates are ignored.

```html
<tp-markdown-single-page src="guide.md" toolbar="code,calc,postit,theme,fullscreen"></tp-markdown-single-page>
```

The left group contains `code`, `calc`, `postit`; the right group contains `clock`, `lang`, `color`, `theme`, `fullscreen`, in that order regardless of the order in the attribute. Code displays the original source as text; Calculator opens a separate drawer.

For translated external documents, provide `langs="en,fr,es"`. The first language uses the source directory (for example `guide.md`); the others use subdirectories with the same filename (`fr/guide.md`, `es/guide.md`). With no `langs`, only `en` is assumed and no translation requests are made. The language control is shown only when `lang` is selected and at least two versions are available. It is hidden for inline documents. A static server must return 404 for missing translation files instead of serving a fallback page.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the rendered markdown document. The toolbar is hidden unless explicitly enabled.
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
<!-- tp-docgen:api TpMarkdownSinglePage -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-markdown-single-page>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMarkdownSinglePage`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-markdown-single-page>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-markdown-single-page>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_markdown-single-page.TpMarkdownSinglePage.html)
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
  <script type="module" src="/path/to/components/markdown-single-page/markdown-single-page.js"></script>
  ```

import
: ```js
  import "/path/to/components/markdown-single-page/markdown-single-page.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markdown-single-page/markdown-single-page.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markdown-single-page>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-single-page
@summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
-->

- [`<tp-markup-single-page>`](../markup-single-page/index.md) : Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
