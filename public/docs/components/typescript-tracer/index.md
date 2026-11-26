<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="typescript-tracer" library="components" size="1.25em"></tp-icon> TypeScript tracer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-typescript-tracer>` element records and replays TypeScript execution with variables, call frames and object references.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-typescript-tracer src="/docs/components/typescript-tracer/examples/nested-arrays.ts"></tp-typescript-tracer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-typescript-tracer" src="/docs/components/typescript-tracer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Expression-level stepping

The Source panel highlights the evaluated subexpression, including expressions sharing a line. Next and Previous skip consecutive snapshots when the highlighted source, variables, call stack, objects and output are unchanged. Calls, mutations, results and errors remain visible; errors and the execution limit are never merged away.

Expression values are recorded without evaluating them twice. Short-circuit branches that do not execute are not highlighted. Statement events precede execution; expression events follow evaluation. Calls, returns and exceptions retain their own snapshots. Internal operand stacks are not displayed. Positions refer to the original TypeScript source before type erasure.

Saved traces retain these positions and grouped-step counts. Loading a trace applies the same grouping without running the program again. Older recordings without expression positions keep line highlighting. The recording limit counts internal events, before grouping.

### Initial content

Use `src` for a TypeScript file, `value` for a source string, or an inline `<script type="tp/typescript">`. Inline source is dedented. Loading a program fills the editor without executing it. The `trace` attribute takes precedence and loads a saved JSON recording.

```html
<tp-typescript-tracer>
  <script type="tp/typescript">
    const answer = 6 * 7;
    console.log(answer);
  </script>
</tp-typescript-tracer>
```

### Recording and navigation

Record execution runs the current editor source in a fresh Worker. Statement and expression events follow the evaluation order; function calls, returns and exceptions have separate events. Source and Output share the first column. Variables and Call stack are stacked in the second column; Objects occupy the third.

Variables in the temporal dead zone are hidden: `shared` appears only after its declaration executes, followed by `rows`. A variable initialized to `undefined` remains visible. Function declarations and `var` bindings are initialized when their scope is entered, following TypeScript semantics. The same rule applies to local and captured variables, and navigation back to an earlier step hides variables that were not initialized yet.

Each array or object has a stable identifier during a recording. Shared references point to the same object, including cycles. Arrays use vertical arrow departures and reserve space below their box; attributes and variables use horizontal departures. Hover a dot to highlight its arrow. Rows use alternating soft brand backgrounds, and errors use the danger color.

Edit source opens the initially hidden editor. The toolbar shows the source filename; `filename` overrides it. First, Previous, Next and Last browse snapshots without executing the program again. Stop recording terminates the Worker.

### Functions, classes and closures

Calls show parameters, local variables, `this` when applicable and return values. Class instances show their own enumerable attributes. Two variables referencing one instance point to one object box. Property getters are not evaluated merely to draw a snapshot.

The **Class and shared instance** example uses `Counter`, a constructor and an instance method. The **Inheritance and super** example adds `StepCounter extends Counter`, calls `super(value)` and overrides `increment()` while calling `super.increment()`. Class boxes list their base class; a derived constructor shows `this` only after `super()` completes.

Functions retain their lexical environment. The Independent closures example shows two separate captured `count` variables after `makeCounter` has returned. Captured environments remain visible while a reachable function refers to them.

A single base class is displayed as `super: Counter`; click the class name to scroll to its object box. Hovering or focusing the link highlights that box. Multiple Python bases are listed under `Bases`. If a saved trace omits the base class, or contains several classes with the same name, its name remains plain text rather than linking to an uncertain target.

### Exceptions

An exception event displays its type and message in the danger color. A `catch` handler can continue execution, including a `finally` block. An uncaught exception ends the recording; its earlier steps remain available for inspection.

### Saving and reloading

Save trace opens the common Save as interface and saves the entire recording, including its original source. Load trace or the `trace` attribute replays JSON without creating an execution Worker. Unexecuted editor changes do not replace the recorded source.

The JSON contains `version: 1`, `language: "typescript"`, `code` and `trace`. Python and JavaScript recordings belong in their respective tracers; incompatible or invalid files leave the current recording available. [Download the sample recording](examples/nested-arrays.trace.json).

### JavaScript API

`refresh()` reloads source or trace. `record()` records the current editor contents; `stop()` terminates recording. `toggleSource()` shows or hides the editor. `goTo(index)` selects a zero-based step. `getCode()` returns the complete recording as a JSON string, and `saveAs()` saves it. Wait for recording to finish before retrieving its complete JSON.

### Supported scope and limits

The recorder instruments the original TypeScript syntax tree, then erases types with the TypeScript compiler and executes JavaScript in a Worker. Event line numbers refer to the original TypeScript, not generated JavaScript. Type-only declarations do not create runtime variables or steps. Transpilation reports syntax errors; it does not perform static type checking. Scripts run in strict mode. It supports type annotations, interfaces, type aliases, generics, type assertions, `satisfies`, non-null assertions, access modifiers and constructor parameter properties, as well as declarations, ordinary functions and arrow functions, branches, loops, recursion, plain objects, arrays, public classes, closures and exceptions. Built-in operations execute normally, but their internal implementation is not stepped through. Console messages appear in Output.

Enums, namespaces, decorators, TSX, DOM access, modules, asynchronous functions, promises, timers, generators, dynamic code evaluation, private fields, static initialization blocks and labeled statements are outside this initial implementation. Unsupported constructs produce an explicit error. This is a teaching tool for synchronous scripts, not a general browser debugger.

Object inspection shows own enumerable properties; accessors are marked without being invoked. Specialized objects such as Map, Set, Date and typed arrays do not yet have dedicated memory diagrams. Function source text and native call internals are not traced.

Limits are 20,000 source characters, 1,000 events plus a final limit notification, 300 objects per snapshot and 200 entries per object or array. Oversized collections are truncated in the diagram. Execution times out after 10 seconds; loading source or JSON after 30 seconds. Imported JSON is limited to 10 MB. Recordings can be saved and replayed without loading the TypeScript recorder.

### Semantic navigation

**Step over** skips the internal steps of an invocation. On a Call step, it advances past that call; before a call, it stays in the current invocation until the called function returns. **Step out** advances until the current invocation returns to its caller. Recursive calls are identified separately, even when their names are identical. Retained closure environments are not active calls. A jump stops at an exception or recording-limit notification rather than silently hiding it.

**Start at query** jumps to the first step of the explicitly supplied `query`. It does not rerun the program. The source initialization remains available through First and Previous. Interpreters provide the current source and query automatically when opening their trace drawer. A standalone tracer can also use `query` with its `src`, `value` or embedded script.

These commands only change the displayed position: they do not delete or filter snapshots, returned values or output. Previous can revisit a skipped step; Save trace retains the same complete recording. Ordinary Next retains its existing grouping of consecutive states without visible changes. Calls and returns remain distinct navigation boundaries.

Saved recordings with a query contain `source`, `query` and their combined `code`. Older recordings without this metadata keep normal navigation; Start at query is disabled because the boundary cannot be reliably guessed. Step out is disabled outside an identifiable call frame. Scheme tail calls are followed through their continuation; they do not create an artificial return to the caller.

The corresponding public methods are `stepOver()`, `stepOut()` and `startQuery()`. They perform the same actions as the buttons and leave the recording unchanged.

### Expression values

After an observed expression finishes, Source highlights its original text and shows its **Expression value** below. Temporary objects remain inspectable through the same reference links as variables. Values are recorded once from the real evaluation: operands, calls and side effects are not repeated, and short-circuit branches stay unevaluated.

Previous revisits intermediate values. Save trace and Load trace retain them without running the program; older recordings without expression values remain readable but cannot reconstruct them. Additional snapshots count toward the existing 1,000-event limit.

Arithmetic, comparisons, logical and conditional expressions, updates and synchronous calls expose their results. Optional-chain results do not have a separate expression-value step. Type-only syntax is not executed.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/typescript-tracer/typescript-tracer.js"></script>
  ```

import
: ```js
  import "/path/to/components/typescript-tracer/typescript-tracer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typescript-tracer/typescript-tracer.js";
  ```
:::

<!-- -->
## Examples

### Interactive examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Record the nested arrays, follow the two arrows to shared and observe push(5) updating the shared object.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Subexpressions on one line
: Record execution, then use Next and Previous to follow the two additions and their multiplication on the same source line. The output is 30; consecutive snapshots with unchanged highlighted source and visible state are grouped, including after Save trace and Load trace.

Recursion
: Record factorial(5), inspect the five call frames and follow return values up to 120.

Independent closures
: Follow count in the two captured makeCounter environments. The first counter returns 1 then 2; the second returns 1.

Class and shared instance
: Follow this.value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, true.

Inheritance and super
: Follow StepCounter extending Counter, the super(value) constructor call and the overridden increment method calling super.increment(). Inspect the same instance through both classes; the output is 5, 7, true.

Caught exception
: Follow the exception from divide into catch, then continue through finally. The error event uses the danger color and execution continues.

Uncaught exception
: Inspect the TypeError and its call stack. Recording ends at the error; previous steps remain available.

Loop and local variables
: Step through the loop to inspect n and the growing squares array. The final output contains 1, 4, 9 and 16.

Replay a saved trace
: Navigate the nested-arrays recording without executing the program. Save trace and Load trace let you save and reopen the complete JSON recording.

Nested calls and a separate query
: Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

Constant expressions and intermediate values
: Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again.
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
@credit TypeScript https://www.typescriptlang.org/
@summary TypeScript parsing and transpilation for synchronous execution tracing.
-->

- [TypeScript](https://www.typescriptlang.org/) : TypeScript parsing and transpilation for synchronous execution tracing.
<!-- tp-docgen:dependencies:end -->
