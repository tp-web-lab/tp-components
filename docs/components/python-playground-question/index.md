# <tp-icon name="python-playground-question" library="components" size="1.25em"></tp-icon> Python playground question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-python-playground-question>` element implements the programming exercise functionality: checks a Python exercise using the playground and an external test file.

<tp-python-playground-question open src="/tp-components/docs/components/playground-question/examples/python/double.py" test="/tp-components/docs/components/playground-question/examples/python/double.test.py">
  <dl>
    <dt>Title</dt><dd>Double a number</dd>
    <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
    <dt>Solution</dt><dd>Return value * 2.</dd>
  </dl>
</tp-python-playground-question>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Question title | Expand or collapse the exercise without losing code. |
| Input / Output | Show or hide the answer form or feedback panels. |
| Project menu and file tabs | Manage project files and select the file to edit. |
| Run in the embedded toolbar | Execute the current program without submitting the exercise. |
| Embedded Reset | Restore the original project. |
| Embedded Test, when project tests exist | Run the project tests in the programming interface; Submit runs the exercise test file in Feedback. |
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

The language and interface are fixed by the tag: this component always creates [`tp-python-playground`](../python-playground/index.md). There are no `language` or `mode` attributes. For the other interface, use [`tp-python-viewer-question`](../python-viewer-question/index.md).

Inherit `src` and `test` from [TpPlaygroundQuestion](../playground-question/index.md): `src` is a Python source file or JSON project, and `test` is a Python test file. Both default to an empty string. Inherited `open` controls the initial disclosure state (closed when absent). Declare Title, Prompt and optional Solution with a definition list; Form and test Feedback are generated.

Tests use unittest; import the learner module by its filename without `.py`. The introductory source intentionally adds 1 instead of multiplying by 2: correct it and submit again to compare failing and passing reports.

Each submission fetches fresh tests and executes a project snapshot without replacing the learner's source or preview. Changing src or test recreates the form and discards unsaved edits. Reset, reconfiguration and disconnection invalidate pending reports. These are browser-side formative tests, not secure grading; use trusted sources. There is no execution-time limit for infinite loops.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.
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

This class extends `TpPlaygroundQuestion<TpPythonPlayground>` and implements only the factory for its response control. Test loading, repeated submission, Feedback and cleanup are shared by the generic base. The inherited `tp-question-submit` event exposes a project snapshot in `detail.value`.

### API

<!-- tp-docgen:api TpPythonPlaygroundQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-python-playground-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpPythonPlaygroundQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-python-playground-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-python-playground-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_python-playground-question.TpPythonPlaygroundQuestion.html)
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
  <script type="module" src="/path/to/components/python-playground-question/python-playground-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/python-playground-question/python-playground-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/python-playground-question/python-playground-question.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-python-playground-question>` are loaded automatically by this component if they have not already been loaded by another component.

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
@tp-dependency tp-python-playground
@summary Python playground component.
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
- [`<tp-python-playground>`](../python-playground/index.md) : Python playground component.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.
- [`<tp-splitter>`](../splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](../tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
