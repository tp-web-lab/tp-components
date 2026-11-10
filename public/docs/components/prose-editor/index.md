<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prose-editor" library="components" size="1.25em"></tp-icon> Prose-editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prose-editor>` element edits rich text with formatting, lists, tables and embedded media.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-prose-editor>
  <h2>A short editable document</h2>
  <p>Select a word and use the toolbar to change its <strong>formatting</strong>.</p>
  <ul><li>Write a draft</li><li>Review the content</li></ul>
</tp-prose-editor>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prose-editor" src="/docs/components/prose-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the document and use the toolbar to format the selected text.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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
@summary Dropdown menu component.
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

- [`<tp-asciidoc>`](#/components/asciidoc/index.md) : Semantic AsciiDoc rendering component.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-checkbox-list>`](#/components/checkbox-list/index.md) : Transforms a list into a group of checkboxes.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-emoji-picker>`](#/components/emoji-picker/index.md) : Unicode Emoji 17.0 picker.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-icon-picker>`](#/components/icon-picker/index.md) : Icon picker that lists built-in icons from `icon-internal`
- [`<tp-markdown>`](#/components/markdown/index.md) : Markdown rendering component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-restructuredtext>`](#/components/restructuredtext/index.md) : reStructuredText rendering component.
- [`<tp-symbol-picker>`](#/components/symbol-picker/index.md) : HTML named-character symbol picker.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit MathJax https://www.mathjax.org/
@summary Mathematical notation rendering.
-->
<!--
@credit ProseMirror https://prosemirror.net/
@summary Rich-text editing.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [MathJax](https://www.mathjax.org/) : Mathematical notation rendering.
- [ProseMirror](https://prosemirror.net/) : Rich-text editing.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
