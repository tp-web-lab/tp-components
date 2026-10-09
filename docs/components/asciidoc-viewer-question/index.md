# <tp-icon name="asciidoc-viewer-question" library="components" size="1.25em"></tp-icon> AsciiDoc viewer question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-asciidoc-viewer-question>` element implements the markup exercise functionality: checks rendered AsciiDoc using a viewer and external JavaScript DOM tests.

<tp-asciidoc-viewer-question open src="/tp-components/docs/components/markup-viewer-question/examples/emphasis.adoc" test="/tp-components/docs/components/markup-viewer-question/examples/emphasis.test.js">
  <dl>
    <dt>Title</dt><dd>Semantic emphasis</dd>
    <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
    <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
  </dl>
</tp-asciidoc-viewer-question>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Question title | Expand or collapse the exercise without losing code. |
| Input / Output | Show or hide the answer form or feedback panels. |
| Code / Render | Show or hide editable markup and its output. |
| Rendered HTML / Generated HTML / Tree, when available | Inspect the preview, generated HTML or parser structure. |
| Editor toolbar | Show or hide the source editor tools. |
| Run in the embedded toolbar | Refresh the preview from the edited markup without submitting. |
| Embedded Reset | Restore the original project. |
| Submit response | Run the external tests against the current code, including on repeated unchanged submissions. |
| Reset response | Restore the original code and cancel or clear the current report. |
| Feedback / Solution | Read test messages or the author's solution, available before submission. |
| Console controls | Copy or clear execution messages. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between question and programming controls. |
| Enter / Space | Activate the focused action or expand/collapse the title. |
| Arrow keys in Output tabs | Navigate Feedback and Solution. |
| Typing in the editor | Modify source code using the embedded editor's editing behavior. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component. Include Shift if needed to type ?. |

### Author directives

The tag fixes the language to AsciiDoc and embeds [tp-asciidoc-viewer](../asciidoc-viewer/index.md). Inherited `src` is one markup file, `test` is a trusted JavaScript test file; both default to an empty string. Inherited `open` is false when absent. Declare Title, Prompt and optional Solution with a definition list. Form and test Feedback are generated.

Tests use Mocha/Chai through `@tp/test` and query `document` in an isolated rendering of the current markup, including edits not yet previewed with Run. They check semantic HTML, not exact source spelling. See the [shared markup question contract](../markup-viewer-question/index.md).

The initial paragraph deliberately fails both tests. Give Hello strong emphasis and submit again. Reset restores the paragraph. Every submission rerenders a snapshot without changing the visible viewer. Changing src or test discards edits. Browser-side tests are formative, not secure grading, and have no timeout for infinite loops. Source scripts are not executed in the test document.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Submit the initial paragraph to see two failures. Use the source editor to mark Hello with strong emphasis, then submit again to pass both DOM tests.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

Extends `TpMarkupViewerQuestion<TpAsciidocViewer>`. The inherited `tp-question-submit` event carries the current markup string in `detail.value`. Test loading, cancellation, output isolation and repeated submissions are shared with programming questions.

### API

<!-- tp-docgen:api TpAsciidocViewerQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-asciidoc-viewer-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAsciidocViewerQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-asciidoc-viewer-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-asciidoc-viewer-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_asciidoc-viewer-question.TpAsciidocViewerQuestion.html)
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
  <script type="module" src="/path/to/components/asciidoc-viewer-question/asciidoc-viewer-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/asciidoc-viewer-question/asciidoc-viewer-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/asciidoc-viewer-question/asciidoc-viewer-question.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-asciidoc-viewer-question>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-asciidoc-viewer
@summary Interactive AsciiDoc viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-console
@summary Displays structured console output.
-->
<!--
@tp-dependency tp-drawer
@summary Displays a sliding drawer panel.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-file-tree
@summary Displays an interactive file and folder tree.
-->
<!--
@tp-dependency tp-filesystem
@summary In-memory file system component.
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
@tp-dependency tp-iframe
@summary Controlled iframe component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->
<!--
@tp-dependency tp-splitter
@summary Splitter component with two resizable panels.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-asciidoc-viewer>`](../asciidoc-viewer/index.md) : Interactive AsciiDoc viewer with editable source and parser outputs.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-console>`](../console/index.md) : Displays structured console output.
- [`<tp-drawer>`](../drawer/index.md) : Displays a sliding drawer panel.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-file-tree>`](../file-tree/index.md) : Displays an interactive file and folder tree.
- [`<tp-filesystem>`](../filesystem/index.md) : In-memory file system component.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-iframe>`](../iframe/index.md) : Controlled iframe component.
- [`<tp-menu>`](../menu/index.md) : Accessible menu component.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.
- [`<tp-splitter>`](../splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](../tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit es-module-lexer https://github.com/guybedford/es-module-lexer
@summary ECMAScript module import analysis.
-->
<!--
@credit Chai https://www.chaijs.com/
@summary Assertions in browser tests.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit Mocha https://mochajs.org/
@summary Browser test execution.
-->
<!--
@credit TypeScript https://www.typescriptlang.org/
@summary TypeScript transpilation and language services.
-->
<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Chai](https://www.chaijs.com/) : Assertions in browser tests.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [Mocha](https://mochajs.org/) : Browser test execution.
- [TypeScript](https://www.typescriptlang.org/) : TypeScript transpilation and language services.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
