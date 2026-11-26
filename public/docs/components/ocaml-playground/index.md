<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ocaml-playground" library="components" size="1.25em"></tp-icon> OCaml Playground

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ocaml-playground>` element edits and runs an OCaml project.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-ocaml-playground src="/docs/components/_shared/intro-projects/ocaml.json"></tp-ocaml-playground>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ocaml-playground" src="/docs/components/ocaml-playground/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript console calls (including `console.log`, warnings and errors), DOM event messages and asynchronous errors appear directly in the rendered output. There is no separate console.

### Projects and sources

Set `src` to a project JSON or `.ml` file, or `repository` to a project directory. Projects can contain `/index.html`, an OCaml entry file and a test file. Select the entry with the standard project controls. The viewer additionally accepts inline `<script type="tp/ocaml" filename="main.ml">` content.

Use the native `#use "helpers.ml";;` directive to evaluate a project file in the current session, or `#mod_use "helpers.ml";;` to load it as a module. Project files are registered in the virtual filesystem before execution.

### Tests

Use **Test** to execute an isolated Alcotest suite. The corresponding question component uses the same runner on submission.

### OCaml execution

The engine is an OCaml 5.5.2 toplevel compiled with [Js_of_ocaml 6.5.0](https://ocsigen.org/js_of_ocaml/). The runtime and standard library are distributed with tp-components and loaded on demand; a CDN is not required. Sessions are independent, except for cells in the same notebook. When rebundling the library into an application, copy the distributed `runtimes/ocaml` directory into the application’s public assets at the deployment root. Keep its license and source files alongside the runtime.

Expressions display their value and inferred type. `print_endline` and `Printf.printf` write to the output. Type errors and exceptions do not discard earlier definitions. Use `;;` to separate successive toplevel phrases. Sources can also use ordinary `.ml` file syntax.

Browser bindings are available through `Js_of_ocaml`. Use `Tp_dom.document ()` and `Tp_dom.window ()` to access the containing interpreter page or the active project/cell preview. Standard OCaml calls such as `Dom.appendChild` and `Dom_html.addEventListener` work without preprocessing. PPX syntax such as `##` is not enabled. This browser runtime does not install arbitrary opam packages or provide operating-system processes. Run trusted code: browser bindings can modify the page, and a synchronous infinite loop can block it.

### Alcotest tests

Tests use [Alcotest 1.10.2](https://github.com/mirage/alcotest), compiled with Js_of_ocaml and loaded only for **Test**. Set the project's `test` path to a `.test.ml` file. The isolated session loads the entry first, then the tests. Define cases with `Alcotest.test_case`, use its typed `check` functions and `check_raises`, and call `Alcotest.run "Suite" groups`.

TP wraps the real Alcotest runner to prevent process exit and report each case in the shared table: suite, test, status and failure details. `Alcotest.skip ()` marks a case as skipped. Empty suites and unhandled errors are failures. Engine output is available in a closed disclosure below the table. The browser wrapper supports the two positional arguments of `run`; command-line options, native system operations and asynchronous Lwt/Async suites are outside this integration. Existing `test_equal`/`test_assert` examples remain supported for compatibility.

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
  <script type="module" src="/path/to/components/ocaml-playground/ocaml-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/ocaml-playground/ocaml-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ocaml-playground/ocaml-playground.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit and run the supplied ocaml example, then compare the source with its output.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

OCaml tests
: Run tests to see three passing assertions. Replace x * 2 with x and run tests again to see failed checks.

Alcotest tests
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
@credit Alcotest https://github.com/mirage/alcotest
@summary Typed OCaml tests, compiled for the browser and loaded on demand.
-->
<!--
@credit es-module-lexer https://github.com/guybedford/es-module-lexer
@summary ECMAScript module import analysis.
-->
<!--
@credit Js_of_ocaml https://ocsigen.org/js_of_ocaml/
@summary OCaml toplevel compiled to JavaScript, including the standard library and browser bindings.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->
<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Alcotest](https://github.com/mirage/alcotest) : Typed OCaml tests, compiled for the browser and loaded on demand.
- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Js_of_ocaml](https://ocsigen.org/js_of_ocaml/) : OCaml toplevel compiled to JavaScript, including the standard library and browser bindings.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
