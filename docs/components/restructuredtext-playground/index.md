# <tp-icon name="restructuredtext-playground" library="components" size="1.25em"></tp-icon> reStructuredText Playground

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-restructuredtext-playground>` element implements the <tp-icon name="restructuredtext-playground" library="components" size="1.25em"></tp-icon> reStructuredText Playground functionality: edits and renders a reStructuredText project.

<tp-restructuredtext-playground src="/tp-components/docs/components/_shared/intro-projects/restructuredtext.json"></tp-restructuredtext-playground>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Select | Select a project file to edit it, then run the project to update the result. |
| Using the component | Use the project and file menus to manage your work. |
| Project | Creates, clears, imports, or exports a complete project. |
| Project > Import from disk / Export to disk | Opens or saves a JSON project containing all files and project settings. Import replaces the current project. |
| File > Open source file… | Opens a local source file, including in an empty playground, and creates its surrounding project automatically. This replaces the current project; choose Run to execute or render it. |
| File > Save | Saves the active editor file, not the whole project. The first save asks for a destination; later saves reuse it where direct file access is supported, or download the file again otherwise. |
| File > Save as… | Chooses a new destination or download filename for the active file. This does not rename files or change imports inside the project. Cancelling leaves the previous destination unchanged. |
| Examples | Loads one of the bundled example projects. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the active code editor toolbar. |
| :tp-icon:{name="refresh" size="1.25em"} Reset | Restores the initially loaded project. |
| :tp-icon:{name="test-tube" size="1.25em"} Test | Runs the project test file when one is available. |
| :tp-icon:{name="play" size="1.25em"} Run | Executes or renders the current project. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Arrow keys / Enter / Space / Escape | Navigate toolbar menus, activate an action, or close a submenu. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The `src` attribute accepts either a JSON project or a single restructuredtext source file (`.rst`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-restructuredtext-playground src="/tp-components/docs/components/_shared/single-source/example.rst"></tp-restructuredtext-playground>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files produce a console error. Existing JSON sources, including extensionless URLs, remain supported.

#### Initial playground content

::: tp-tabs
no content
: ```html
  <tp-restructuredtext-playground></tp-restructuredtext-playground>
  ```

internal project
: ```html
  <tp-restructuredtext-playground>
    <script type="tp/json">{"files":[]}</script>
  </tp-restructuredtext-playground>
  ```

external project
: ```html
  <tp-restructuredtext-playground src="./project.json"></tp-restructuredtext-playground>
  ```

repository
: ```html
  <tp-restructuredtext-playground repository="./project/"></tp-restructuredtext-playground>
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit and run the supplied restructuredtext example, then compare the source with its output.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Single source file
: Load the standalone restructuredtext file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
<!-- tp-docgen:api TpRestructuredTextPlayground -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>repository</code> | <code>string</code> | <code>&quot;&quot;</code> | Directory containing a reStructuredText playground project to load at initialization. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON project or restructuredtext source file to load. |
  [Attributes of `<tp-restructuredtext-playground>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpRestructuredTextPlayground`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-restructuredtext-playground>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-restructuredtext-playground>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_restructuredtext-playground.TpRestructuredTextPlayground.html)
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
  <script type="module" src="/path/to/components/restructuredtext-playground/restructuredtext-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/restructuredtext-playground/restructuredtext-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/restructuredtext-playground/restructuredtext-playground.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-restructuredtext-playground>` are loaded automatically by this component if they have not already been loaded by another component.

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
@credit Pyodide https://pyodide.org/
@summary Python execution in the browser.
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
- [Pyodide](https://pyodide.org/) : Python execution in the browser.
- [TypeScript](https://www.typescriptlang.org/) : TypeScript transpilation and language services.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
