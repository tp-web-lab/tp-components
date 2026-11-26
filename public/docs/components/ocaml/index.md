<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ocaml" library="components" size="1.25em"></tp-icon> OCaml

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ocaml>` element provides an interactive OCaml interpreter.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-ocaml query="square 7;;">
  <script type="tp/ocaml">
    let square x = x * x;;
  </script>
</tp-ocaml>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ocaml" src="/docs/components/ocaml/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
script
: ```html
  <tp-ocaml query="square 7;;">
    <script type="tp/ocaml">
      let square x = x * x;;
    </script>
  </tp-ocaml>
  ```

value
: ```html
  <tp-ocaml value="let count = ref 0;;" query="incr count; !count;;"></tp-ocaml>
  ```

src
: ```html
  <tp-ocaml src="/docs/components/ocaml/examples/functions.ml" query="square 7;;"></tp-ocaml>
  ```
:::

### Configuration

`mode="default"` (the default) and `mode="lite"` show the normal interface. `mode="simple"` opens the source editor and hides the interpreter header, welcome and engine information, and buttons below the query. The query and output remain available: use Return or Shift+Return to reload changed source before executing. Changing mode preserves the source, query and session.

The Run button, <kbd>Return</kbd> and <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field reload the program if its source has changed, then execute the current query. An unchanged program keeps its existing session. A changed program starts a fresh session, so previous runtime state is discarded; the query text is retained. A source-loading error is shown without executing the query. A successful reload displays “> Program reloaded.” before the query; unchanged source produces no reload message.

The engine banner appears only on the first interpreter of this language opened in the page. Reset, a source reload and other instances do not repeat it. Reloading the page allows it to appear again.

### Session and source editor

Source precedence is `src`, `value`, then an inline script; inline source is dedented. Wait for loading to finish, then Run the prefilled command. Variables and definitions persist. Clear removes output; Reset restores the authored program and command. Edit source opens a code editor; a source reload creates a fresh session from its contents. Run keeps the command for editing, copying or clearing. Arrow keys recall command history.

The `run(code?)`, `clear()`, `reset()`, `toggleSource()` and `applySource()` methods mirror the controls. Wait until `aria-busy="false"` before calling them during loading.

### OCaml execution

The engine is an OCaml 5.5.2 toplevel compiled with [Js_of_ocaml 6.5.0](https://ocsigen.org/js_of_ocaml/). Its version is displayed in the Engine line. The runtime and standard library are distributed with tp-components and loaded on demand; a CDN is not required. Sessions are independent, except for cells in the same notebook. When rebundling the library into an application, copy the distributed `runtimes/ocaml` directory into the application’s public assets at the deployment root. Keep its license and source files alongside the runtime.

Expressions display their value and inferred type. `print_endline` and `Printf.printf` write to the output. Type errors and exceptions do not discard earlier definitions. Use `;;` to separate successive toplevel phrases. Sources can also use ordinary `.ml` file syntax.

Browser bindings are available through `Js_of_ocaml`. Use `Tp_dom.document ()` and `Tp_dom.window ()` to access the containing interpreter page or the active project/cell preview. Standard OCaml calls such as `Dom.appendChild` and `Dom_html.addEventListener` work without preprocessing. PPX syntax such as `##` is not enabled. This browser runtime does not install arbitrary opam packages or provide operating-system processes. Run trusted code: browser bindings can modify the page, and a synchronous infinite loop can block it.

### Execution tracing

Add the boolean `tracer` attribute to show Trace execution. The button opens `tp-ocaml-tracer` in a drawer initially 75% wide and records the current editor source followed by the current query, without changing the interpreter session. The recorder is loaded only when requested. Closing the drawer stops recording; removing `tracer` also removes the command and drawer.

The button remains beside the query in `mode="simple"`. Reopen it after editing the source or query to record the new version. The [OCaml tracer](components/ocaml-tracer/index.md) documents the supported synchronous subset and its limits.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/ocaml/ocaml.js"></script>
  ```

import
: ```js
  import "/path/to/components/ocaml/ocaml.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ocaml/ocaml.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Wait for the OCaml engine to load, then run the prefilled expression.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

DOM elements and click events
: Run setup_dom (), then click the generated button. Its callback updates the paragraph and prints a message.

Type errors and recovery
: Run to see an OCaml type error, then enter square 7;; and run again. Earlier definitions remain available.

Lists and pattern matching
: Run the expression to pattern-match optional values and return a typed list of strings.

External OCaml file
: Load a .ml source file, then run square 9;; to obtain 81.

Presentation modes and automatic reload
: Compare default, lite and simple using the same program. Run the query to obtain 10, edit the source to return 20, then use Run or Return in the query field. Only a changed program displays “> Program reloaded.”; run again without editing to keep the session.

Execution trace drawer
: Enable tracer and open Trace execution to record the current program and query in a drawer initially 75% wide. Edit factorial or its argument and reopen the drawer; the recording is independent of the interpreter session.
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
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
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

- [Alcotest](https://github.com/mirage/alcotest) : Typed OCaml tests, compiled for the browser and loaded on demand.
- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Js_of_ocaml](https://ocsigen.org/js_of_ocaml/) : OCaml toplevel compiled to JavaScript, including the standard library and browser bindings.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
