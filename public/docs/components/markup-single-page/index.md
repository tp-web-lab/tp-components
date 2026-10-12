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

The toolbar is optional. The interactions below are available only when the corresponding controls are displayed. Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Source repository | Open the linked Git repository in a new tab. |
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

Use `label="My document"` to display a title in the center of the toolbar. Its default is an empty string. Changing or removing the label updates only the title, without reloading the document or closing its tools. Without a toolbar, the label is not displayed.

The toolbar is hidden by default. Add `toolbar` (or `toolbar=""`) to display all available controls, or give a comma-separated selection. The toolbar updates immediately without reloading the document. Unknown names and duplicates are ignored.

```html
<tp-markup-single-page src="guide.md" toolbar="code,calc,postit,theme,fullscreen" label="My document"></tp-markup-single-page>
```

Set `git="https://github.com/owner/repository"` to add a repository button at the start of the toolbar, before Code. It opens the repository in a new tab. This button is independent of the selection in `toolbar`; an absent or empty `git` hides it. Without a toolbar, no repository button is displayed.

The left group contains `code`, `calc`, `postit`; the right group contains `clock`, `lang`, `color`, `theme`, `fullscreen`, in that order regardless of the order in the attribute. Code displays the original source as text; Calculator opens a separate drawer.

For translated external documents, provide `langs="en,fr,es"`. The first language uses the source directory (for example `guide.md`); the others use subdirectories with the same filename (`fr/guide.md`, `es/guide.md`). With no `langs`, only `en` is assumed and no translation requests are made. The language control is shown only when `lang` is selected and at least two versions are available. It is hidden for inline documents. A static server must return 404 for missing translation files instead of serving a fallback page.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the rendered markup document. The toolbar is hidden unless explicitly enabled.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Toolbar controls
: Compare the complete toolbar with a selection of Code, Calculator and Theme. Open a drawer or change the appearance without replacing the document.
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
  | <code>git</code> | <code>string</code> | <code>&quot;&quot;</code> | Repository URL. Adds a source link before Code when the toolbar is enabled. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Text displayed in the center of the optional toolbar. |
  | <code>langs</code> | <code>string</code> | <code>&quot;en&quot;</code> | Candidate document languages. The first uses the source directory; others use language subdirectories. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Source file. The extension selects the renderer. |
  | <code>toolbar</code> | <code>string \| null</code> | <code>null</code> | Optional comma-separated controls: code, calc, postit, clock, lang, color, theme, fullscreen. Empty enables all; absent hides the toolbar. |
  [Attributes of `<tp-markup-single-page>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>setDocumentLanguage</code> | <code>setDocumentLanguage(language: string): void</code> | Select a translation discovered for this document. |
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
[More details…](/api/classes/components_markup-single-page.TpMarkupSinglePage.html)
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
@tp-dependency tp-calculator
@summary Scientific calculator with an editable expression and degree/radian modes.
-->
<!--
@tp-dependency tp-clock
@summary Live clock component with digital or analogic display and date tooltip.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-drawer
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-lang
@summary Documentation language selector.
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-post-it-editor
@summary creates and edits persistent personal annotations attached to document elements.
-->
<!--
@tp-dependency tp-restructuredtext
@summary reStructuredText rendering component.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-asciidoc>`](../asciidoc/index.md) : Semantic AsciiDoc rendering component.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-calculator>`](../calculator/index.md) : Scientific calculator with an editable expression and degree/radian modes.
- [`<tp-clock>`](../clock/index.md) : Live clock component with digital or analogic display and date tooltip.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-drawer>`](../drawer/index.md) : Drawer overlay component.
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-lang>`](../lang/index.md) : Documentation language selector.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-post-it-editor>`](../post-it-editor/index.md) : creates and edits persistent personal annotations attached to document elements.
- [`<tp-restructuredtext>`](../restructuredtext/index.md) : reStructuredText rendering component.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
