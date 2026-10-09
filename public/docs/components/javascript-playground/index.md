# <tp-icon name="javascript-playground" library="components" size="1.25em"></tp-icon> JavaScript Playground

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-javascript-playground>` element implements the <tp-icon name="javascript-playground" library="components" size="1.25em"></tp-icon> JavaScript Playground functionality: edits and runs a JavaScript project.

<tp-javascript-playground src="/docs/components/_shared/intro-projects/javascript.json"></tp-javascript-playground>

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

The `src` attribute accepts either a JSON project or a single javascript source file (`.js`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-javascript-playground src="/docs/components/_shared/single-source/example.js"></tp-javascript-playground>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files produce a console error. Existing JSON sources, including extensionless URLs, remain supported.

#### Initial playground content

::: tp-tabs
no content
: ```html
  <tp-javascript-playground></tp-javascript-playground>
  ```

internal project
: ```html
  <tp-javascript-playground>
    <script type="tp/json">{"files":[]}</script>
  </tp-javascript-playground>
  ```

external project
: ```html
  <tp-javascript-playground src="./project.json"></tp-javascript-playground>
  ```

repository
: ```html
  <tp-javascript-playground repository="./project/"></tp-javascript-playground>
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit and run the supplied javascript example, then compare the source with its output.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Single source file
: Load the standalone javascript file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
<!-- tp-docgen:api TpJavascriptPlayground -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>repository</code> | <code>string</code> | <code>&quot;&quot;</code> | Directory containing a JavaScript playground project to load at initialization. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON project or javascript source file to load. |
  [Attributes of `<tp-javascript-playground>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpJavascriptPlayground`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-javascript-playground>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-javascript-playground>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_javascript-playground.TpJavascriptPlayground.html)
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
  <script type="module" src="/path/to/components/javascript-playground/javascript-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/javascript-playground/javascript-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/javascript-playground/javascript-playground.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-javascript-playground>` are loaded automatically by this component if they have not already been loaded by another component.

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
@credit Shoelace https://shoelace.style/
@summary Web-component examples and import maps.
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
- [Shoelace](https://shoelace.style/) : Web-component examples and import maps.
- [TypeScript](https://www.typescriptlang.org/) : TypeScript transpilation and language services.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
