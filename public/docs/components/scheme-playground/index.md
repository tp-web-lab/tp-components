<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="scheme-playground" library="components" size="1.25em"></tp-icon> Scheme Playground

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-scheme-playground>` element edits and runs a Scheme project with LIPS.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-scheme-playground src="/docs/components/_shared/intro-projects/scheme.json"></tp-scheme-playground>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-scheme-playground" src="/docs/components/scheme-playground/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript console calls (including `console.log`, warnings and errors), DOM event messages and asynchronous errors appear directly in the rendered output. There is no separate console.

### Projects and sources

Set `src` to a project JSON or `.scm`, `.ss` or `.sld` file, or `repository` to a project directory. Projects can contain `/index.html`, a Scheme entry file and a test file. Select the entry with the standard project controls. The viewer additionally accepts inline `<script type="tp/scheme" filename="main.scm">` content.

Run executes the entry in a fresh session. The optional `execution-scope` shares a queued session, as used by notebooks. Local helper files can be evaluated with `(load-project "helpers.scm")`; this helper resolves paths from the project root. Standard LIPS `load` remains available for URLs.

### Tests

Use **Test** to execute an isolated SRFI-64 suite. The corresponding question component uses the same runner on submission.

### LIPS execution

Scheme runs with [LIPS](https://lips.js.org/docs/intro), pinned to `1.0.0-beta.23.1`, including its standard library. The first execution downloads the runtime and standard library. Run trusted code only: Scheme can access JavaScript and the DOM. A synchronous infinite loop can block the page.

`display` and `newline` produce output; the last result uses Scheme notation, including lists and exact rational numbers. Exceptions are reported without preventing subsequent executions. The implementation aims at R7RS compatibility through LIPS; this is not a native operating-system Scheme installation.

Use `document` to access the containing interpreter page or the current project preview. JavaScript methods can be called with dot notation, and a Scheme `lambda` can handle a DOM event. The interface uses light DOM and shared TP components.

### SRFI-64 tests

Tests use the [SRFI-64 reference implementation](https://srfi.schemers.org/srfi-64/srfi-64.html), loaded only for **Test**. Set the project's `test` path to a `.test.scm` file. The isolated session loads the entry first, then the tests. Use `test-begin`/`test-end`, `test-equal`, `test-assert`, `test-approximate`, `test-error`, `test-skip` and `test-expect-fail`. The existing named `test-equal` and `test-assert` calls remain valid.

TP installs a browser test runner instead of writing log files. LIPS uses the reference implementation's R7RS error handling; use `#t` to accept any expected exception. A small adapter preserves test names in LIPS macro expansion. The result table shows suite, test, status and failure details; skipped tests and expected failures are counted separately. Empty suites and unhandled errors are failures. Engine output is available in a closed disclosure below the table.

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

### Program output in tests

In a test file, `tp-test-program-output` contains the initial program’s printed output followed by its final value, as a trimmed string. It is captured before the tests run. Use it for integration tests of a program that runs at load time, without executing a stateful or expensive program twice. Ordinary procedure tests should call the procedures directly with `test-equal` or `test-assert`.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/scheme-playground/scheme-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/scheme-playground/scheme-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/scheme-playground/scheme-playground.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit and run the supplied scheme example, then compare the source with its output.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Scheme tests
: Run tests to see three passing assertions. Change double to return x and run tests again to see the failed checks.

SRFI-64 tests
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
@credit LIPS https://lips.js.org/
@summary Scheme execution in JavaScript with its standard library.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit SRFI-64 https://srfi.schemers.org/srfi-64/srfi-64.html
@summary Scheme test-suite reference implementation, loaded on demand.
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
- [LIPS](https://lips.js.org/) : Scheme execution in JavaScript with its standard library.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [SRFI-64](https://srfi.schemers.org/srfi-64/srfi-64.html) : Scheme test-suite reference implementation, loaded on demand.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
