<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog-playground" library="components" size="1.25em"></tp-icon> Prolog Playground

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog-playground>` element edits and runs Prolog projects.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-prolog-playground src="/docs/components/_shared/intro-projects/prolog.json"></tp-prolog-playground>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog-playground" src="/docs/components/prolog-playground/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript console calls (including `console.log`, warnings and errors), DOM event messages and asynchronous errors appear directly in the rendered output. There is no separate console.

Engine versions and documentation links are displayed only in the Prolog interpreter, once per page.

### Initial content

::: tp-tabs
no content
: ```html
  <tp-prolog-playground></tp-prolog-playground>
  ```

internal project
: ```html
  <tp-prolog-playground>
    <script type="tp/json">{"files":[]}</script>
  </tp-prolog-playground>
  ```

external project
: ```html
  <tp-prolog-playground src="./project.json"></tp-prolog-playground>
  ```

repository
: ```html
  <tp-prolog-playground repository="./project/"></tp-prolog-playground>
  ```
:::

### Authoring

The `src` attribute accepts either a JSON project or a single prolog source file (`.pl`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-prolog-playground src="/docs/components/_shared/single-source/example.pl"></tp-prolog-playground>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files display an error in the output. Existing JSON sources, including extensionless URLs, remain supported.

The default program file is `/program.pl` and the default query file is `/query.pl`. The runtime is SWI-Prolog WASM.

### SWI-Prolog runtime

Prolog runs on demand with SWI-Prolog WASM (distribution `swipl-wasm` 8.3.1). Execution uses the same runtime in viewers, playgrounds, notebooks, questions and exported HTML notebooks. Prolog source files retain their modules and relative `use_module`/`include` paths.

Use `library(clpfd)` for integer constraints, including `ins`, `#=` and `labeling/2`; `library(clpq)` and `library(clpr)` provide rational and real constraints. Unlabelled answers retain their residual constraints. Programs written for the previous runtime should replace `library(clpz)` with `library(clpfd)`.

`library(wasm)` provides direct JavaScript and DOM access through `:=/2`. `library(dom)` provides HTML creation and event bindings; its DOM is the execution iframe's document. This is SWI-Prolog's native DOM library, not the former TP DOM simulation. For Tau-style predicates such as `get_by_id/2` and `set_html/2`, use `library(dialect/tau/dom)` where supported. See the [SWI-Prolog WASM manual](https://www.swi-prolog.org/pldoc/man?section=wasm-version).

Tests can use [PlUnit](https://www.swi-prolog.org/pldoc/package/plunit.html): load `library(plunit)`, declare a suite with `begin_tests/1` and `end_tests/1`, and write `test/1` or `test/2` clauses. The test command runs PlUnit and displays each case in the shared results table. Existing TP `:- test(Name, Goal[, Expected]).` directives remain supported in files without a PlUnit suite.

### PlUnit tests

Tests use [PlUnit](https://www.swi-prolog.org/pldoc/package/plunit) from the pinned SWI-Prolog WASM runtime. Set the project's `test` path, load `library(plunit)` and enclose test clauses between `begin_tests` and `end_tests`. PlUnit handles fixtures, expected failure (`fail`), expected exceptions (`throws`), all solutions (`all`/`set`) and blocked tests.

The shared result table shows suite, test, status and failure details, followed by a closed Engine output disclosure. Empty suites and unhandled errors are failures. TP collects the pinned runtime's PlUnit results after the complete suite runs, preserving native fixture and enumeration semantics. Legacy `:- test(...)` directives remain supported; new suites should use PlUnit.

### Programmatic toolbar actions

Toolbar and menu actions are also available as named methods. The API tab includes methods inherited from the shared playground.

| Action | Method |
| --- | --- |
| Run / Test / Reset | `run()` / `test()` / `reset()` |
| New / Clear project | `newProject()` / `clearProject()` |
| Open source file | `openSourceFile()` |
| Save / Save as | `saveFile()` / `saveFileAs()` |
| Import / Export project | `importProject()` / `exportProject()` |
| Save / Load / Clear browser memory | `saveInMemory()` / `loadFromMemory()` / `clearMemory()` |
| Load a bundled example | `loadExample(id)` |
| Language help | `showLanguageHelp()` |
| Show/hide the editor toolbar | `toggleEditorToolbar()` |

File choosers may require a user gesture. Await asynchronous methods to wait for completion. Browser memory stores one project per playground language.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog-playground/prolog-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-playground/prolog-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-playground/prolog-playground.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit and run the supplied prolog example, then compare the source with its output.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Single source file
: Load the standalone prolog file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.

SWI-Prolog DOM, constraints and PlUnit
: Run the CLP(FD) queries, click Show solutions to update the DOM directly from Prolog, then run the PlUnit tests. Change a test expectation to compare success and failure.

PlUnit tests
: Run the native test suite and compare passed and skipped cases in the shared results table. Change double to return x, run tests again and inspect the failure details; expand Engine output for the full log.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-filesystem
@summary In-memory file system component.
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-filesystem>`](#/components/filesystem/index.md) : In-memory file system component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-splitter>`](#/components/splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-switcher>`](#/components/switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](#/components/tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit es-module-lexer https://github.com/guybedford/es-module-lexer
@summary ECMAScript module import analysis.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit PlUnit https://www.swi-prolog.org/pldoc/package/plunit
@summary Native SWI-Prolog test suites and assertions.
-->
<!--
@credit SWI-Prolog WASM https://www.swi-prolog.org/
@summary Prolog execution in the browser.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->
<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [PlUnit](https://www.swi-prolog.org/pldoc/package/plunit) : Native SWI-Prolog test suites and assertions.
- [SWI-Prolog WASM](https://www.swi-prolog.org/) : Prolog execution in the browser.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
