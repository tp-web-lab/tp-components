# <tp-icon name="prose-editor" library="components" size="1.25em"></tp-icon> Prose-editor

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-prose-editor>` element implements the <tp-icon name="prose-editor" library="components" size="1.25em"></tp-icon> Prose-editor functionality: proseMirror-based rich text editor.

<tp-prose-editor>
  <h2>A short editable document</h2>
  <p>Select a word and use the toolbar to change its <strong>formatting</strong>.</p>
  <ul><li>Write a draft</li><li>Review the content</li></ul>
</tp-prose-editor>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Edit the document directly and use the toolbar to format text, insert content, undo or redo changes. |
| :tp-icon:{name="file" size="1.25em"} Files | Creates, loads, saves, or exports the document. |
| :tp-icon:{name="format-title" size="1.25em"} Types | Inserts paragraphs, headings, quotations, code, markup, math, and horizontal rules. |
| :tp-icon:{name="letter-f" size="1.25em"} Format | Applies inline text, math, and link formatting. |
| :tp-icon:{name="list-down" size="1.25em"} :tp-icon:{name="table" size="1.25em"} :tp-icon:{name="multimedia" size="1.25em"} Lists / Table / Media | Inserts and edits structured or media content. |
| :tp-icon:{name="emoticon-happy-outline" size="1.25em"} :tp-icon:{name="shapes" size="1.25em"} :tp-icon:{name="symbol" size="1.25em"} Emoji / Icon / Symbol | Opens a compact picker and inserts the selected item inline. |
| :tp-icon:{name="undo" size="1.25em"} :tp-icon:{name="redo" size="1.25em"} Undo / Redo | Navigates the editing history. |
| :tp-icon:{name="copy" size="1.25em"} :tp-icon:{name="cut" size="1.25em"} :tp-icon:{name="paste" size="1.25em"} :tp-icon:{name="select-all" size="1.25em"} Copy / Cut / Paste / Select all | Applies the corresponding clipboard or selection operation. |
| :tp-icon:{name="format-clear" size="1.25em"} Clear formatting | Removes formatting from the selection. |
| :tp-icon:{name="language-html" size="1.25em"} HTML | Opens the HTML source and rendered views. |
| :tp-icon:{name="search" size="1.25em"} Search | Finds and highlights matching text. |
| :tp-icon:{name="dots-vertical" size="1.25em"} More | Shows or hides the secondary formatting toolbar. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the toolbar of the visible code or markup block editor. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

#### Importing
::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js">
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prose-editor/prose-editor.js">
  ```


import
: ```js
  import "/path/to/components/prose-editor/prose-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prose-editor/prose-editor.js";
  ```
:::

#### Initial editor content

::: tp-tabs
no content
: ```html
  <tp-prose-editor></tp-prose-editor>
  ```

`value` attribute
: ```html
  <tp-prose-editor value="<p>Editable prose</p>"></tp-prose-editor>
  ```

element content
: ```html
  <tp-prose-editor><p>Editable prose</p></tp-prose-editor>
  ```

external file
: ```html
  <tp-prose-editor src="./prose.html"></tp-prose-editor>
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the document and use the toolbar to format the selected text.

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
<!-- tp-docgen:api TpProseEditor -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;Type your prose...&quot;</code> | Text displayed while the editor is empty. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents the user from editing the prose. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an external document loaded into the editor. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Initial HTML content of the editor. |
  [Attributes of `<tp-prose-editor>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addTableColumnAfter</code> | <code>addTableColumnAfter(): boolean</code> | Adds table column after. |
  | <code>addTableRowAfter</code> | <code>addTableRowAfter(): boolean</code> | Adds table row after. |
  | <code>deleteTable</code> | <code>deleteTable(): boolean</code> | Deletes table. |
  | <code>deleteTableColumn</code> | <code>deleteTableColumn(): boolean</code> | Deletes table column. |
  | <code>deleteTableRow</code> | <code>deleteTableRow(): boolean</code> | Deletes table row. |
  | <code>findNext</code> | <code>findNext(value?: string): boolean</code> | Finds next. |
  | <code>findPrevious</code> | <code>findPrevious(value?: string): boolean</code> | Finds previous. |
  | <code>focus</code> | <code>focus(options?: FocusOptions): void</code> | Focus. |
  | <code>getHTML</code> | <code>getHTML(): string</code> | Returns html. |
  | <code>insertTable</code> | <code>insertTable(rows = 3, columns = 3): boolean</code> | Inserts table. |
  | <code>setHTML</code> | <code>setHTML(value: string): void</code> | Sets html. |
  | <code>setSearchQuery</code> | <code>setSearchQuery(value: string, options: Omit&lt;ConstructorParameters&lt;typeof SearchQuery&gt;[0], &quot;search&quot;&gt; = &#123;&#125;): void</code> | Sets search query. |
  [Public methods of `TpProseEditor`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-prose-editor-change</code> | <code>&#123; value: string &#125;</code> | Emitted when prose editor change occurs. |
  | <code>tp-prose-editor-input</code> | <code>&#123; value: string &#125;</code> | Emitted when prose editor input occurs. |
  [Events emitted by `<tp-prose-editor>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-prose-editor>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_prose-editor.TpProseEditor.html)
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
  <script type="module" src="/path/to/components/prose-editor/prose-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/prose-editor/prose-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prose-editor/prose-editor.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-prose-editor>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-asciidoc
@summary Semantic AsciiDoc rendering component.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-checkbox-list
@summary Transforms a list into a group of checkboxes.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-emoji-picker
@summary Unicode Emoji 17.0 picker.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-icon-picker
@summary Icon picker that lists built-in icons from `icon-internal`
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-restructuredtext
@summary reStructuredText rendering component.
-->
<!--
@tp-dependency tp-symbol-picker
@summary HTML named-character symbol picker.
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
- [`<tp-checkbox-list>`](../checkbox-list/index.md) : Transforms a list into a group of checkboxes.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-emoji-picker>`](../emoji-picker/index.md) : Unicode Emoji 17.0 picker.
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-icon-picker>`](../icon-picker/index.md) : Icon picker that lists built-in icons from `icon-internal`
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-menu>`](../menu/index.md) : Accessible menu component.
- [`<tp-restructuredtext>`](../restructuredtext/index.md) : reStructuredText rendering component.
- [`<tp-symbol-picker>`](../symbol-picker/index.md) : HTML named-character symbol picker.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit ProseMirror https://prosemirror.net/
@summary Rich-text editing.
-->
<!--
@credit MathJax https://www.mathjax.org/
@summary Mathematical notation rendering.
-->

- [ProseMirror](https://prosemirror.net/) : Rich-text editing.
- [MathJax](https://www.mathjax.org/) : Mathematical notation rendering.
<!-- tp-docgen:dependencies:end -->
