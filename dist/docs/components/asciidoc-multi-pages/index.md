# <tp-icon name="asciidoc-multi-pages" library="components" size="1.25em"></tp-icon> AsciiDoc multi-pages

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-asciidoc-multi-pages>` element implements the <tp-icon name="asciidoc-multi-pages" library="components" size="1.25em"></tp-icon> AsciiDoc multi-pages functionality: renders a navigable repository with tp-asciidoc. *

<tp-iframe src="/docs/components/asciidoc-multi-pages/examples/introduction-frame.html" title="tp-asciidoc-multi-pages — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

## Usage

### User interactions

Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Calculator (between Code and Personal annotations) | Open or close the scientific calculator. Calculations are retained when closing the panel or navigating between pages. |
| Personal annotations (comment with pencil in the toolbar) | Open the annotation list. The button is immediately after Calculator. Use the large + button to add an annotation, select a document element, enter text and Save. The close icon is at the right of the panel title. |
| Annotation pin | Click to open the note, or drag it to another document element. Its attachment is saved. |
| Edit / Reattach / Delete | Update the selected annotation, choose a new target, or remove it from this browser. Each note has pencil (Edit) and delete-outline (Delete) icon buttons in its bottom-right footer. |
| Annotation appearance | Choose color, heading, opacity (0–1) and rotation (−12–12°). Save stores these settings with the text; Cancel discards edits. Reset appearance defaults restores yellow, an empty heading, opacity 1 and rotation 0 without changing the text. |
| Using the component | Choose a page in the navigation menu or follow a document link. |
| Using the component | The selected page replaces the current content. |
| Using the component | Use the available table of contents and document controls to navigate within it. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Selecting an annotation target | Tab to a paragraph, heading or other available target, then Enter to select it. Escape cancels. |
| Annotation pin arrows | Move the folded annotation; Shift uses smaller steps. Enter or Space opens it. |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-asciidoc-multi-pages>` as shown below.

```html
<tp-asciidoc-multi-pages></tp-asciidoc-multi-pages>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Navigate between the asciidoc documentation pages and observe dynamic page loading inside the isolated example.
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
<!-- tp-docgen:api TpAsciidocMultiPages -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-asciidoc-multi-pages>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAsciidocMultiPages`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-asciidoc-multi-pages>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-asciidoc-multi-pages>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_asciidoc-multi-pages.TpAsciidocMultiPages.html)
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
  <script type="module" src="/path/to/components/asciidoc-multi-pages/asciidoc-multi-pages.js"></script>
  ```

import
: ```js
  import "/path/to/components/asciidoc-multi-pages/asciidoc-multi-pages.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/asciidoc-multi-pages/asciidoc-multi-pages.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-asciidoc-multi-pages>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-multi-pages
@summary Multi-page documentation with support for multiple markup languages.
-->

- [`<tp-markup-multi-pages>`](../markup-multi-pages/index.md) : Multi-page documentation with support for multiple markup languages.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
