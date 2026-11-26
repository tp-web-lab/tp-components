<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="scheme" library="components" size="1.25em"></tp-icon> Scheme

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-scheme>` element provides an interactive Scheme interpreter.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-scheme query="(square 7)">
  <script type="tp/scheme">
    (define (square x)
      (* x x))
  </script>
</tp-scheme>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-scheme" src="/docs/components/scheme/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

`mode="default"` (the default) and `mode="lite"` show the normal interface. `mode="simple"` opens the source editor and hides the interpreter header, welcome and engine information, and buttons below the query. The query and output remain available: use Return or Shift+Return to reload changed source before executing. Changing mode preserves the source, query and session.

The Run button, <kbd>Return</kbd> and <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field reload the program if its source has changed, then execute the current query. An unchanged program keeps its existing session. A changed program starts a fresh session, so previous runtime state is discarded; the query text is retained. A source-loading error is shown without executing the query. A successful reload displays “> Program reloaded.” before the query; unchanged source produces no reload message.

The engine banner appears only on the first interpreter of this language opened in the page. Reset, a source reload and other instances do not repeat it. Reloading the page allows it to appear again.

### Initial content

::: tp-tabs
script
: ```html
  <tp-scheme query="(square 7)">
    <script type="tp/scheme">
      (define (square x) (* x x))
    </script>
  </tp-scheme>
  ```

value
: ```html
  <tp-scheme value="(define count 0)" query="(set! count (+ count 1)) count"></tp-scheme>
  ```

src
: ```html
  <tp-scheme src="/docs/components/scheme/examples/functions.scm" query="(square 7)"></tp-scheme>
  ```
:::

### Session and source editor

Source precedence is `src`, `value`, then an inline script; inline source is dedented. Wait for loading to finish, then Run the prefilled command. Variables and definitions persist. Clear removes output; Reset restores the authored program and command. Edit source opens a code editor; a source reload creates a fresh session from its contents. Run keeps the command for editing, copying or clearing. Arrow keys recall command history.

The `run(code?)`, `clear()`, `reset()`, `toggleSource()` and `applySource()` methods mirror the controls. Wait until `aria-busy="false"` before calling them during loading.

### LIPS execution

Scheme runs with [LIPS](https://lips.js.org/docs/intro), pinned to `1.0.0-beta.23.1`, including its standard library. The Engine line displays the loaded LIPS version. The first execution downloads the runtime and standard library. Run trusted code only: Scheme can access JavaScript and the DOM. A synchronous infinite loop can block the page.

`display` and `newline` produce output; the last result uses Scheme notation, including lists and exact rational numbers. Exceptions are reported without preventing subsequent executions. The implementation aims at R7RS compatibility through LIPS; this is not a native operating-system Scheme installation.

Use `document` to access the containing interpreter page or the current project preview. JavaScript methods can be called with dot notation, and a Scheme `lambda` can handle a DOM event. The interface uses light DOM and shared TP components.

### Execution trace

The boolean `tracer` attribute enables Trace execution. It is absent by default: no trace button is shown and `openTrace()` does nothing. Add `tracer` to enable it, for example `<tp-scheme tracer>`. Removing the attribute stops any recording, closes its drawer and removes the button. It can also be changed with the `tracer` boolean property. The button appears in the toolbar in default and lite modes. In simple mode, it appears next to the query while the toolbar remains hidden.

Trace execution opens a drawer initially 75% wide containing `tp-scheme-tracer`. It records the current source, including unsaved editor changes, followed by the current query, in an independent Worker. Program return values are not echoed during loading; explicit output remains visible, followed by query results. It does not change the interpreter session or carry over earlier queries. Closing the drawer stops recording; reopening it uses the latest source and query and retains a resized drawer's width.

`openTrace()` provides the same action when `tracer` is present. The tracer supports synchronous programs; see [Scheme tracer](#/components/scheme-tracer/index.md) for its scope and limits.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/scheme/scheme.js"></script>
  ```

import
: ```js
  import "/path/to/components/scheme/scheme.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/scheme/scheme.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Wait for LIPS to load, then run (square 7) and explore the persistent session.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

DOM elements and click events
: Run setup-dom, then click the generated tp-button to update the paragraph and print a message from Scheme.

Errors and recovery
: Run to display an error, then enter (square 7) and Run again. The result is 49 without resetting the session.

Exact numbers and lists
: Run to compute a list of exact rational squares: (1/4 4/9 9/16).

Presentation modes and automatic reload
: Compare default, lite and simple using the same program. Run the query to obtain 10, edit the source to return 20, then use Run or Return in the query field. Only a changed program displays “> Program reloaded.”; run again without editing to keep the session.

Execution trace drawer
: With tracer enabled, open Trace execution to record factorial(5) in a drawer initially 75% wide. Edit the source or query and reopen the trace without changing the interpreter session.
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
@credit LIPS https://lips.js.org/
@summary Scheme execution in JavaScript with its standard library.
-->

- [LIPS](https://lips.js.org/) : Scheme execution in JavaScript with its standard library.
<!-- tp-docgen:dependencies:end -->
