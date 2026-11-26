<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="typescript" library="components" size="1.25em"></tp-icon> TypeScript

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-typescript>` element provides an interactive TypeScript interpreter.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-typescript query="square(7)">
  <script type="tp/typescript">
    function square(x: number): number {
      return x * x;
    }
  </script>
</tp-typescript>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-typescript" src="/docs/components/typescript/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

`mode="default"` (the default) and `mode="lite"` show the normal interface. `mode="simple"` opens the source editor and hides the interpreter header, welcome and engine information, and buttons below the query. The query and output remain available: use Return or Shift+Return to reload changed source before executing. Changing mode preserves the source, query and session.

The Run button, <kbd>Return</kbd> and <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field reload the program if its source has changed, then execute the current query. An unchanged program keeps its existing session. A changed program starts a fresh session, so previous runtime state is discarded; the query text is retained. A source-loading error is shown without executing the query. A successful reload displays “> Program reloaded.” before the query; unchanged source produces no reload message.

### Initial content

::: tp-tabs
script
: ```html
  <tp-typescript query="square(7)">
    <script type="tp/typescript">
      function square(x: number): number { return x * x; }
    </script>
  </tp-typescript>
  ```

value
: ```html
  <tp-typescript value="let count = 0;" query="++count"></tp-typescript>
  ```

src
: ```html
  <tp-typescript src="/docs/components/typescript/examples/squares.ts" query="square(9)"></tp-typescript>
  ```
:::

### Source and commands

Use `src` for an external TypeScript file, `value` for a program string, or an inline `<script type="tp/typescript">`. Source precedence is `src`, then `value`, then script. Inline sources are dedented. The source runs once before the first command. `filename` sets the toolbar and editor filename; otherwise the external basename or `program.ts` is used.

Set `query` to prefill the prompt. Select Run or press <kbd>Enter</kbd> to execute it. The command remains available for editing, copying or clearing. <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> recall commands. Variables, functions, classes and objects persist until Reset or a source reload. The value of the last expression is displayed; statements without a final expression display `undefined`. Console messages appear in the transcript.

### Toolbar and session

Edit source opens a `tp-code-editor`. Run reloads modified source in a fresh session before executing the query. Reset restores the originally loaded program and initial command. Clear removes the transcript while keeping variables and history. Color, theme and fullscreen apply to this interpreter.

### Engine information

The engine banner appears only on the first interpreter of this language opened in the page. It is not repeated after Reset, a source reload, or when another interpreter of the same language is opened. Reloading the page allows it to appear again.

The Engine line identifies JavaScript through the browser name and version reported by its user-agent string. TypeScript also displays the installed compiler version, read from its package metadata. This information is shown only by the first interpreter of this language opened in the page; Reset and a source reload do not repeat it. The browser version is informational: it is not an ECMAScript edition or an exact JavaScript engine version, and browser identification may be reduced or overridden. See [Navigator.userAgent](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent).

### Execution model

TypeScript is transpiled to JavaScript before execution in a separate browser realm. Type annotations, interfaces, type aliases, generics, enums and classes are supported. Syntax errors are reported before execution. This is a transpilation-based interpreter, not a semantic type checker: type mismatches are not checked, and types do not validate runtime data. Each command is transpiled independently; runtime variables persist, while type declarations have no runtime representation. The component and its controls use light DOM. Source code is trusted browser code, not a security sandbox. It can access the containing page through `parent.document`; its own `document` belongs to the execution realm. Reset removes that realm and its timers; author-created changes in the containing page remain.

Promise results and `await` expressions are supported. Static module imports/exports and top-level `await` declarations are not supported in this script session; use dynamic `import()` in an expression. A synchronous infinite loop blocks the page, as with ordinary browser JavaScript. Declaring the same `let` or `const` twice follows normal script semantics and reports an error; assign to a variable or Reset instead.

### JavaScript API

`run(code?)` executes the supplied command or current prompt. `clear()`, `reset()` and `toggleSource()` expose the corresponding controls. `applySource()` remains available to reload the editor source without executing a query. The shared interpreter interface handles source loading, the toolbar, the source editor, prompt history and session lifecycle. TypeScript delegates execution to the same JavaScript engine after transpilation. Prolog shares the source loader and presentation styles while retaining its solution-specific commands.

### Execution trace

The boolean `tracer` attribute enables Trace execution. It is absent by default: no trace button is shown and `openTrace()` does nothing. Add `tracer` to enable it, for example `<tp-typescript tracer>`. Removing the attribute stops any recording, closes its drawer and removes the button. It can also be changed with the `tracer` boolean property. The button appears in the toolbar in default and lite modes. In simple mode, it appears next to the query while the toolbar remains hidden.

Trace execution opens a drawer initially 75% wide containing `tp-typescript-tracer`. It records the current source, including unsaved editor changes, followed by the current query, in an independent Worker. It does not change the interpreter session or carry over earlier queries. Closing the drawer stops recording; reopening it uses the latest source and query and retains a resized drawer's width.

`openTrace()` provides the same action when `tracer` is present. The tracer supports synchronous programs; see [TypeScript tracer](#/components/typescript-tracer/index.md) for its scope and limits.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/typescript/typescript.js"></script>
  ```

import
: ```js
  import "/path/to/components/typescript/typescript.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typescript/typescript.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run square(7), edit its typed source and explore the persistent TypeScript session.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Persistent session
: Run the command repeatedly to increment count. Clear keeps the value; Reset restores it to zero.

Promises and console
: Run the prefilled await expression to display a console message followed by the resolved result, 42.

External TypeScript file
: Run the command to get 81. Open the source editor, change the function and click Run; Reset restores the external file.

DOM elements and click events
: Run setupDom(), then click the generated button to update the paragraph and log the click. Run again to rebuild the demonstration. parent.document targets the page containing the interpreter; document alone targets its execution context.

Errors and recovery
: Run divide(12, 0) to display an error. Replace the command with divide(12, 3) and Run again: the result is 4 and the same session remains usable without Reset.

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
@credit TypeScript https://www.typescriptlang.org/
@summary TypeScript transpilation and language services.
-->

- [TypeScript](https://www.typescriptlang.org/) : TypeScript transpilation and language services.
<!-- tp-docgen:dependencies:end -->
