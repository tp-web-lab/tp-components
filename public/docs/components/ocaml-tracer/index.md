<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ocaml-tracer" library="components" size="1.25em"></tp-icon> OCaml tracer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ocaml-tracer>` element records and replays OCaml execution with variables, call frames and object references.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-ocaml-tracer src="/docs/components/ocaml-tracer/examples/recursion.ml"></tp-ocaml-tracer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ocaml-tracer" src="/docs/components/ocaml-tracer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

Use `src` to load an OCaml file, `value` for source text, or an inline `<script type="tp/ocaml">`. Loading code does not execute it. The `trace` attribute takes precedence and replays a saved JSON recording without starting the OCaml runtime.

### Recording and navigation

Record execution runs the program in an isolated Worker using the real OCaml compiler and Js_of_ocaml runtime. Next and Previous move between visible states; the Source panel highlights the original subexpression. Consecutive unchanged source/state snapshots are grouped. Global bindings, local variables, call frames, output and shared objects use the common tracer visualizer.

Save trace saves the complete JSON recording; Load trace and `trace` replay it without executing OCaml. Edit source opens the initially hidden editor. Stop recording terminates the Worker.

### Supported code and limits

The initial recorder supports synchronous expressions, let bindings, recursive functions, anonymous functions, conditionals, loops, pattern matching, lists, tuples, arrays, references and exceptions. Arrays and references retain their identity through mutations. Record and variant values are displayed as generic tagged blocks; their original field or constructor names are not yet reconstructed. Values with unresolved polymorphic types use their runtime representation.

Modules, classes, local modules, local exceptions, effect handlers, extensions and toplevel directives are rejected explicitly. DOM access and asynchronous callbacks are outside this isolated recording environment. Instrumentation adds observation calls, so it does not preserve tail-call optimization or provide performance measurements. Source is limited to 20,000 characters and recording to 1,000 internal events before grouping, with the common Worker timeout.

### JavaScript API

`refresh()` reloads the declared source or trace. `record()` starts recording; `stop()` terminates it. `goTo(index)` selects a zero-based step, `toggleSource()` shows or hides the editor, `getCode()` returns the recording as a JSON string and `saveAs()` saves it. Wait for recording to finish before reading the complete JSON.

### Semantic navigation

**Step over** skips the internal steps of an invocation. On a Call step, it advances past that call; before a call, it stays in the current invocation until the called function returns. **Step out** advances until the current invocation returns to its caller. Recursive calls are identified separately, even when their names are identical. Retained closure environments are not active calls. A jump stops at an exception or recording-limit notification rather than silently hiding it.

**Start at query** jumps to the first step of the explicitly supplied `query`. It does not rerun the program. The source initialization remains available through First and Previous. Interpreters provide the current source and query automatically when opening their trace drawer. A standalone tracer can also use `query` with its `src`, `value` or embedded script.

These commands only change the displayed position: they do not delete or filter snapshots, returned values or output. Previous can revisit a skipped step; Save trace retains the same complete recording. Ordinary Next retains its existing grouping of consecutive states without visible changes. Calls and returns remain distinct navigation boundaries.

Saved recordings with a query contain `source`, `query` and their combined `code`. Older recordings without this metadata keep normal navigation; Start at query is disabled because the boundary cannot be reliably guessed. Step out is disabled outside an identifiable call frame. Scheme tail calls are followed through their continuation; they do not create an artificial return to the caller.

The corresponding public methods are `stepOver()`, `stepOut()` and `startQuery()`. They perform the same actions as the buttons and leave the recording unchanged.

### Expression values

After an observed expression finishes, Source highlights its original text and shows its **Expression value** below. Temporary objects remain inspectable through the same reference links as variables. Values are recorded once from the real evaluation: operands, calls and side effects are not repeated, and short-circuit branches stay unevaluated.

Previous revisits intermediate values. Save trace and Load trace retain them without running the program; older recordings without expression values remain readable but cannot reconstruct them. Additional snapshots count toward the existing 1,000-event limit.

The recorder uses the typed result supplied by the OCaml evaluator. Follow the engine order shown in the trace, rather than assuming left-to-right evaluation: in the constant-expression example the arithmetic results are 3, 9, 8, 8, 16, 48 and 57.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/ocaml-tracer/ocaml-tracer.js"></script>
  ```

import
: ```js
  import "/path/to/components/ocaml-tracer/ocaml-tracer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ocaml-tracer/ocaml-tracer.js";
  ```
:::

<!-- -->
## Examples

Basic usage
: Record factorial 5 and follow the call frames and returned values up to 120.

Subexpressions on one line
: Step through both additions and the multiplication on the same line. The output is 30.

Shared arrays and references
: Follow mutations through shared references: both aliases point to the same array.

Closures
: Inspect count captured by the counter and its mutation from 0 to 2.

Pattern matching
: Follow recursive list matching and inspect the head and tail of each list cell.

Caught exception
: Inspect the Division_by_zero event and continue through its handler.

Uncaught exception
: Inspect the failure and its recorded source position; previous steps remain available.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Record factorial 5 and follow the call frames and returned values up to 120.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Subexpressions on one line
: Record execution, then use Next and Previous to follow the two additions and their multiplication on the same source line. The output is 30; consecutive snapshots with unchanged highlighted source and visible state are grouped, including after Save trace and Load trace.

Shared arrays and references
: Follow mutations through shared references: both aliases point to the same array.

Closures
: Inspect count captured by the counter and its mutation from 0 to 2.

Pattern matching
: Follow recursive list matching and inspect the head and tail of each list cell.

Caught exception
: Inspect the Division_by_zero event and continue through its handler.

Uncaught exception
: Inspect the failure and its recorded source position; previous steps remain available.

Replay a saved trace
: Browse the saved factorial recording without starting OCaml. Load trace and Save trace let you reopen and save the complete JSON recording.

Nested calls and a separate query
: Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

Constant expressions and intermediate values
: Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again. Follow the order reported by the OCaml engine: it differs from the JavaScript and Scheme examples.
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
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
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
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit Js_of_ocaml https://ocsigen.org/js_of_ocaml/
@summary OCaml compilation and execution with observation hooks.
-->

- [Js_of_ocaml](https://ocsigen.org/js_of_ocaml/) : OCaml compilation and execution with observation hooks.
<!-- tp-docgen:dependencies:end -->
