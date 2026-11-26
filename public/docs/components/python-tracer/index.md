<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="python-tracer" library="components" size="1.25em"></tp-icon> Python tracer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-python-tracer>` element records and replays Python execution with variables, call frames and object references.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-python-tracer src="/docs/components/python-tracer/examples/students.py"></tp-python-tracer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-python-tracer" src="/docs/components/python-tracer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Expression-level stepping

The Source panel highlights the evaluated subexpression, including expressions sharing a line. Next and Previous skip consecutive snapshots when the highlighted source, variables, call stack, objects and output are unchanged. Calls, mutations, results and errors remain visible; errors and the execution limit are never merged away.

Python uses the executed instruction’s source position: the highlight identifies the operation about to execute. Compiler-folded constants may appear as a single expression. Internal operand stacks are not displayed.

Saved traces retain these positions and grouped-step counts. Loading a trace applies the same grouping without running the program again. Older recordings without expression positions keep line highlighting. The recording limit counts internal events, before grouping.

### Initial content

Use `src` for a complete Python file, `value` for a source string, or an inline `<script type="tp/python">`. Inline scripts are dedented while preserving Python indentation. Loading source fills the editor without executing it.

A nonempty `trace` loads a complete JSON recording and displays its first step. It takes precedence over `src`, `value` and the inline script; the source URL is not fetched. URLs resolve using the containing document's source location, as for other TP components. Changing an input attribute refreshes the content; removing `trace` falls back to the source.

### Toolbar and filename

The toolbar follows the interpreter layout: the native Python icon and title at the start, the loaded filename in the center, and Edit source, Load trace and Save trace before the divider and the color, theme and fullscreen controls. The editor starts hidden to avoid displaying the code twice. Edit source opens or hides it without discarding code or snapshots. Recording remains available while the editor is hidden. Record execution and Stop recording appear on the navigation row, to the left of First, Previous, Next and Last, separated by an inline vertical `tp-divider`.

The center label uses the basename of the loaded Python or JSON file (including local Load trace files), or `program.py` for inline code. Set `filename` to override this label. Changing only `filename` preserves the current editor and recording. The Python editor retains a `.py` filename when replaying a JSON file.

### Recording and navigation

Each recording uses a fresh Pyodide Worker. The recorded source, output, global variables, call frames and heap objects are displayed together. Instruction events are captured **before** execution; call and return events have their own labels. Output accumulates up to the selected step.

Arrows connect references to objects; shared references point to the same object. Hover or focus a reference dot to highlight its connection. Source and Output share the first column; Variables and Call stack are stacked in the second column, followed by Objects in the third column. Variable and attribute rows and sequence items have alternating soft brand backgrounds. The layout follows the component width, including inside a drawer: narrower containers place Source/Output above the memory columns, then stack the memory columns on small screens. All panel headings use the same size, and the reference arrows follow the rearrangement. First, Previous, Next and Last browse existing snapshots without running Python. Stop terminates the recording Worker.

### Classes and instances

Instances show their class name and attributes as named values. Object-valued attributes use the same reference dots and arrows as variables, including shared references and cycles. Class cards show their bases by name and their attributes, including references to methods. A custom `__str__` representation is displayed above the attributes rather than replacing them.

In the Counter example, `counter` and `alias` refer to one instance: its `value` changes from 3 to 4, and the output is `4`, `4`, then `True`. The linked Nodes example shows two instances referring to one another through `next`, with `alias` sharing the first instance.

The **Inheritance and super** example defines `StepCounter(Counter)`. Its constructor calls `super().__init__`, and its overridden `increment` method calls `super().increment()`. Follow `self` through the calls to see the same instance acquire `value` and `step`; its value changes from 3 to 5, then 7. The subclass card lists `Counter` as its base class.

Attributes come from the tracer's `__dict__` snapshot; property evaluation and attributes stored only in `__slots__` are not included. The Trace JSON panel still provides the full serialized snapshot for inspection.

A single base class is displayed as `super: Counter`; click the class name to scroll to its object box. Hovering or focusing the link highlights that box. Multiple Python bases are listed under `Bases`. If a saved trace omits the base class, or contains several classes with the same name, its name remains plain text rather than linking to an uncertain target.

### Exceptions and closures

An exception event shows its type and message in the danger color next to the current line. With `try/except`, recording continues through the handler and `finally` block. An uncaught exception ends execution; its recorded steps remain available for navigation.

A closure retains the frame containing its captured variables after the enclosing function returns. In **Closure with nonlocal**, inspect `count` in the retained `make_counter` frame: successive calls to `next_value` change it from 0 to 1, then 2. The variable belongs to that parent environment rather than the inner function's local variables.

Anonymous functions appear as lambda frames. Their return value is shown in the active frame, independently of the display name; captured parent frames remain visible.

Floating-point values retain their full Python precision in the recording and during replay. Small values are not rounded to zero. Existing recordings that already contain rounded values cannot recover the lost digits.

### Saving and reloading

Save trace saves **all** snapshots and their recorded source, regardless of the selected step. It uses the common Save as interface: the browser's file picker where supported, otherwise a filename prompt and download. Unexecuted editor changes are not substituted for the source associated with the recording.

Load trace opens a local JSON file. The `trace` attribute loads the same file by URL. Neither operation starts Python or loads Pyodide. Invalid files leave the previous trace available and display an error. Cancelling Save as leaves the trace unchanged.

A complete recording contains `version: 1`, `code` (Python source) and `trace` (the ordered array of snapshots). Unversioned `{code, trace}` recordings are also accepted. The expandable Trace JSON panel shows only the selected snapshot, not a complete file. [Download the complete sample recording](examples/students.trace.json).

### JavaScript API

`refresh()` reloads the declared input. `record()` records the editor contents; `stop()` terminates that Worker. `toggleSource()` opens or hides the editor. `goTo(index)` selects a zero-based snapshot, clamped to the available range. `getCode()` returns the complete recording as a JSON string, and `saveAs()` opens Save as. Wait for recording or trace loading to complete before exporting; Save trace remains disabled until snapshots are available.

### Runtime and limits

Recording loads Pyodide 0.29.3 from jsDelivr. Replaying a saved trace requires neither the Python runtime nor the original .py file. The tracer is adapted from Online Python Tutor (Philip J. Guo); its Python sources are bundled locally with the [MIT notice](/licenses/python-tracer/LICENSE.txt) and [provenance](/licenses/python-tracer/UPSTREAM.md). No request is sent to pythontutor.com and no external visualizer or advertising is embedded.

Limits are 20,000 source characters, 1,000 events plus a final limit notification, and a 10 MB imported JSON file. Source/trace loading times out after 30 seconds; Python initialization after 60 seconds and execution after 10 seconds. A new recording can be started after a timeout. Arbitrary packages, DOM integration and asynchronous execution are outside the supported tracing model. The Worker isolates execution from the interface but is not a security sandbox for hostile programs.

### Semantic navigation

**Step over** skips the internal steps of an invocation. On a Call step, it advances past that call; before a call, it stays in the current invocation until the called function returns. **Step out** advances until the current invocation returns to its caller. Recursive calls are identified separately, even when their names are identical. Retained closure environments are not active calls. A jump stops at an exception or recording-limit notification rather than silently hiding it.

**Start at query** jumps to the first step of the explicitly supplied `query`. It does not rerun the program. The source initialization remains available through First and Previous. Interpreters provide the current source and query automatically when opening their trace drawer. A standalone tracer can also use `query` with its `src`, `value` or embedded script.

These commands only change the displayed position: they do not delete or filter snapshots, returned values or output. Previous can revisit a skipped step; Save trace retains the same complete recording. Ordinary Next retains its existing grouping of consecutive states without visible changes. Calls and returns remain distinct navigation boundaries.

Saved recordings with a query contain `source`, `query` and their combined `code`. Older recordings without this metadata keep normal navigation; Start at query is disabled because the boundary cannot be reliably guessed. Step out is disabled outside an identifiable call frame. Scheme tail calls are followed through their continuation; they do not create an artificial return to the caller.

The corresponding public methods are `stepOver()`, `stepOut()` and `startQuery()`. They perform the same actions as the buttons and leave the recording unchanged.

### Expression values

Arithmetic and unary operations, comparisons, Boolean expressions and conditional expressions are instrumented before Python compiles the program. This makes constant calculations visible too: the Source panel highlights the evaluated sub-expression and displays its **Expression value** immediately below. Operands are not evaluated again; short-circuit branches remain unevaluated. Referenced objects use the same object links as variables.

Previous revisits intermediate values, and saved JSON retains them for replay. Older recordings without these values remain readable but cannot reconstruct them. Type annotations and structural pattern literals are not instrumented. Function calls retain their existing call/return steps. The additional snapshots count toward the existing 1,000-event recording limit; this is an execution aid, not a timing profiler.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/python-tracer/python-tracer.js"></script>
  ```

import
: ```js
  import "/path/to/components/python-tracer/python-tracer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/python-tracer/python-tracer.js";
  ```
:::

<!-- -->
## Examples

### Interactive examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Load the Students Python program, record execution and navigate its variables and shared object references.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Subexpressions on one line
: Record execution, then use Next and Previous to follow the two additions and their multiplication on the same source line. The output is 30; consecutive snapshots with unchanged highlighted source and visible state are grouped, including after Save trace and Load trace.

Inline Python
: Record factorial(5) from an inline script and compare the recursive call frames.

Replay a saved trace
: Navigate a saved Students recording without starting Python or fetching its source file.

Save and reload
: Save the full trace under a chosen filename, reload that JSON and navigate to the final output. The trace attribute takes precedence over src.

Class and shared instance
: Record Counter, follow value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, True.

Inheritance and super
: Follow StepCounter inheriting from Counter, super().__init__(value) and the overridden increment method calling super().increment(). Inspect self referring to the same instance in both classes; the output is 5, 7, True.

References between instances
: Record two linked Node instances. Inspect their next attributes, the two reciprocal arrows and alias pointing to the first node; the output is 2.

Caught exception
: Record execution, then step through the exception and its handler. Output continues with caught and done.

Uncaught exception
: Record execution and follow the exception from fail to the caller. The final event displays ValueError: test error; earlier steps remain available.

Closure with nonlocal
: Record execution and follow count from 0 to 1 to 2 in the retained make_counter frame. The two calls share the same captured variable and print 1 then 2.

Nested lists and shared references
: Record execution and inspect the three arrows from rows: the first and third point to the same shared list. Step through append(5) to see both references reflect the change, while the middle list stays unchanged.

Nested calls and a separate query
: Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

Constant expressions and intermediate values
: Record execution and use Next to follow the highlighted operations and their Expression value: 8, 8, 16, 48, 3, 9, then 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running Python again.
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
@credit Online Python Tutor https://github.com/sineagles/OnlinePythonTutor
@summary Local Python tracing engine adapted under the MIT license.
-->
<!--
@credit Pyodide https://pyodide.org/
@summary Python execution in the browser.
-->

- [Online Python Tutor](https://github.com/sineagles/OnlinePythonTutor) : Local Python tracing engine adapted under the MIT license.
- [Pyodide](https://pyodide.org/) : Python execution in the browser.
<!-- tp-docgen:dependencies:end -->
