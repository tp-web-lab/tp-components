<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="python" library="components" size="1.25em"></tp-icon> Python

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-python>` element provides an interactive Python interpreter.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-python query="square(7)">
  <script type="tp/python">
    def square(x):
        return x * x
  </script>
</tp-python>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-python" src="/docs/components/python/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
script
: ```html
  <tp-python query="square(7)">
    <script type="tp/python">
      def square(x):
          return x * x
    </script>
  </tp-python>
  ```

value
: ```html
  <tp-python value="count = 0" query="count + 1"></tp-python>
  ```

src
: ```html
  <tp-python src="/docs/components/python/examples/squares.py" query="square(9)"></tp-python>
  ```
:::

### Configuration

`mode="default"` (the default) and `mode="lite"` show the normal interface. `mode="simple"` opens the source editor and hides the interpreter header, welcome and engine information, and buttons below the query. The query and output remain available: use Return or Shift+Return to reload changed source before executing. Changing mode preserves the source, query and session.

The Run button, <kbd>Return</kbd> and <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field reload the program if its source has changed, then execute the current query. An unchanged program keeps its existing session. A changed program starts a fresh session, so previous runtime state is discarded; the query text is retained. A source-loading error is shown without executing the query. A successful reload displays “> Program reloaded.” before the query; unchanged source produces no reload message.

### Source and commands

Use `src` for an external Python file, `value` for a program string, or an inline `<script type="tp/python">`. Source precedence is `src`, then `value`, then script. Inline sources are dedented while preserving Python indentation. `filename` sets the toolbar and editor filename; otherwise the external basename, script filename or `program.py` is used.

Python initializes when the component opens. Wait for the controls to become available. The initial program runs once. Set `query` to prefill the prompt, then select Run or press <kbd>Enter</kbd>. The command remains available for editing, copying or clearing. <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> recall commands. Variables, functions, classes and imports persist until Reset or a source reload.

The final expression is displayed using Python's `repr`; a statement without a result displays `None`. `print` and error output appear in the transcript. Exceptions include a traceback and do not close the session. `await` expressions are supported by Pyodide.

### Toolbar and session

Edit source opens a `tp-code-editor` configured for Python. Run reloads modified source in a fresh session before executing the query. Reset restores the originally loaded program and initial command. Clear removes the transcript while keeping variables and history. Color, theme and fullscreen apply to this interpreter.

### Execution trace

The boolean `tracer` attribute enables Trace execution. It is absent by default: no trace button is shown and `openTrace()` does nothing. Add `tracer` to enable it, for example `<tp-python tracer>`. Removing the attribute stops any recording, closes its drawer and removes the button. It can also be changed with the `tracer` boolean property. The button appears in the toolbar in default and lite modes. In simple mode, it appears next to the query while the toolbar remains hidden.

Trace execution opens a resizable `tp-drawer` at an initial width of 75%, containing a `tp-python-tracer`. It records the current program, including unsaved editor changes, followed by the current query. An empty query records only the program. Use `print(...)` in the query to display a value in the trace output.

The recording runs in a fresh isolated Python Worker, without changing the interpreter's variables or transcript. Earlier commands and imports from its live session are not carried over: the source and query must be self-contained. The trace supports the same limits as [Python tracer](#/components/python-tracer/index.md). Closing the drawer stops an active recording; reopening it captures the latest source and query. The existing drawer width is retained after resizing. With `tracer` enabled, `openTrace()` also opens the trace programmatically.

### Engine information

The engine banner appears only on the first interpreter of this language opened in the page. It is not repeated after Reset, a source reload, or when another interpreter of the same language is opened. Reloading the page allows it to appear again.

The Engine line initially shows `Python · Loading Pyodide…`. After loading, it displays `Python X.Y.Z · Pyodide A.B.C`, using `sys.version` and the loaded Pyodide version. Resetting or reloading the source does not repeat this information. Internet access is required for the initial Pyodide download; browser caching can reuse its files.

### Execution model and DOM

The interface uses light DOM and shares its toolbar, prompt, editor, history, source loading and lifecycle with the JavaScript and TypeScript interpreters. The Python adapter reuses the library's Pyodide loader in a separate execution context per session. Variables, imports, output and event callbacks are isolated from other interpreters.

Python runs in the browser through [Pyodide](https://pyodide.org/). The standard library is available, but this is not a local desktop Python installation: installed desktop packages and unrestricted filesystem access are not available. A synchronous infinite loop blocks the page. Run trusted code only.

Use `from js import parent` and `parent.document` to access the page containing the interpreter. `js.document` alone refers to its hidden execution context. For event listeners, create and retain a proxy with `pyodide.ffi.create_proxy`; destroy it when no longer used. The DOM example demonstrates this with a `tp-button`. Reset starts a fresh Python session; author-created DOM elements and listeners in the containing page are not automatically removed. Run the setup command again to replace them.

### JavaScript API

`run(code?)` executes the supplied command or current prompt. `clear()`, `reset()` and `toggleSource()` expose the corresponding controls. `applySource()` remains available to reload the editor source without executing a query. Wait until the component's `aria-busy` attribute is `false` before calling methods during initial loading.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/python/python.js"></script>
  ```

import
: ```js
  import "/path/to/components/python/python.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/python/python.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Wait for Python to load, then run square(7), edit its source and explore the persistent session.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Persistent session
: Run repeatedly to advance the counter. Clear retains its state; Reset restores the first value.

Async functions and output
: Run the await expression to display a printed message followed by the resolved result, 42.

External Python file
: Run to get 81. Edit the loaded Python file and click Run; Reset restores the original file.

DOM elements and click events
: Run setup_dom(), then click the generated button to update the paragraph and print the click count. Run again to rebuild it. The retained proxy keeps the Python event callback alive.

Errors and recovery
: Run divide(12, 0) to display a ZeroDivisionError traceback. Change the command to divide(12, 3) and Run again: the result is 4.0, without Reset.

Presentation modes and automatic reload
: Compare default, lite and simple using the same program. Run the query to obtain 10, edit the source to return 20, then use Run or Return in the query field. Only a changed program displays “> Program reloaded.”; run again without editing to keep the session.

Execution trace drawer
: Open Trace execution to record factorial(5) in a drawer initially 75% wide. Edit the source or query, reopen the trace and compare the recursive frames; closing the drawer stops recording.
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
@credit Pyodide https://pyodide.org/
@summary Python execution in the browser.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [Pyodide](https://pyodide.org/) : Python execution in the browser.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
