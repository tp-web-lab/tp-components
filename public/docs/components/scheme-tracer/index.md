<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="scheme-tracer" library="components" size="1.25em"></tp-icon> Scheme tracer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-scheme-tracer>` element records and replays Scheme execution with variables, call frames and object references.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-scheme-tracer src="/docs/components/scheme-tracer/examples/recursion.scm"></tp-scheme-tracer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-scheme-tracer" src="/docs/components/scheme-tracer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

Use `src` for a Scheme file, `value` for source text, or an inline `<script type="tp/scheme">`. Sources are dedented and loaded without execution. `trace` takes precedence and opens a saved JSON recording. `filename` overrides the name displayed in the toolbar.

```html
<tp-scheme-tracer>
  <script type="tp/scheme">
    (define (square x) (* x x))
    (square 7)
  </script>
</tp-scheme-tracer>
```

### Recording and navigation

Record execution runs the current editor source in a fresh Worker. The editor is initially hidden; Edit source opens it. Source and Output share the first column, Variables and Call stack the second, and Objects the third. First, Previous, Next and Last navigate recorded snapshots without executing Scheme again. Stop recording terminates the Worker.

Non-void top-level expression results appear in Output, together with explicit `display`, `write` and `newline` output, as in an interpreter. Errors retain the failing call and use the danger color. A step is captured before evaluating a source expression; several expressions may share one source line. When original source positions are available, the exact sub-expression is highlighted, including when several expressions share a line or one expression spans several lines. For `(+ (* 3 5) (- 10 6))`, the highlight distinguishes `(* 3 5)` and `(- 10 6)` before displaying `19`.

Consecutive steps with the same highlighted expression, variables, objects, call stack and output are grouped. An internal event-name change alone does not require another click. Calls, returns, mutations, output and errors remain separate whenever they change the displayed state. The compact recording is saved as JSON; grouped snapshots retain a `grouped_steps` count. Replaying an older recording also groups identical consecutive states, but retains whole-line highlighting if exact source positions were not recorded. Internally generated expressions without an original source position also fall back to line highlighting.

Grouping changes presentation, not Scheme execution or safety limits: the recorder still counts up to 1,000 raw events before grouping and 100,000 internal operations. It does not skip repeated loop iterations when their state or evaluated expression changes.

### Program and query

The optional `query` attribute separates program loading from query evaluation. With `query` present, the program is still executed and recorded, but its returned values are not echoed. Explicit `display`, `write` and `newline` output remains visible. The query's results are then displayed. An empty query loads the program without echoing its returned values. Without this attribute, each top-level result is displayed as before.

For example, `<tp-scheme-tracer value="(+ 1 2) (define x 40)" query="(+ x 2)"></tp-scheme-tracer>` displays `42`, without the setup result `3`. A trace opened from `tp-scheme` automatically uses the current program and query separately. Saved recordings preserve this distinction for replay and re-recording.

Reader primitives such as `read` may be stored in a primitive table or passed as values. Calling them remains unsupported, including calls through aliases, `apply` or callbacks. User-defined procedures named `read` are ordinary Scheme procedures. The recorder distinguishes the event-count limit from its 100,000 internal-operation limit; exceeding either yields an incomplete trace.

### Procedures and environments

Ordinary recursive calls show their parameters and return values. Proper tail calls replace the current frame instead of growing the active stack; the earlier calls remain accessible in the recorded steps. Local bindings are visible in their lexical scope. A closure retains its defining environment after the creating procedure returns. Captured bindings remain live: `set!` changes the original binding rather than copying its value.

### Pairs, vectors and mutation

Each pair has its own object box with `car` and `cdr` references. Shared tails and cycles point to the same object, including after `set-car!` and `set-cdr!`. Vectors show indexed elements; `vector-set!` preserves object identity. The empty list is shown as `()`, booleans as `#t` and `#f`, and symbols without string quotes. Exact numbers retain their Scheme representation, including fractions and large integers.

Hover a reference to highlight its arrow. Pair fields use horizontal arrow departures; vector elements use vertical departures with space below the box. Rows use alternating soft brand backgrounds.

### Saving and reloading

Save trace opens Save as and stores every snapshot with the original Scheme source. Load trace and the `trace` attribute replay that JSON without loading the evaluator. Unexecuted editor changes do not replace the recorded source. The format contains `version: 1`, `language: "scheme"`, `code` and `trace`. Invalid files or recordings from another language leave the current recording available.

[Download the example recording](examples/recursion.trace.json).

### JavaScript API

`refresh()` reloads the source or saved trace. `record()` records the editor contents; `stop()` terminates recording. `toggleSource()` opens or closes the editor. `goTo(index)` selects a zero-based snapshot, `getCode()` returns the complete JSON recording, and `saveAs()` saves it. Wait for recording to finish before retrieving the complete JSON.

### Supported scope and limits

The tracer uses a local copy of [LIPS 1.0.0-beta.23.1](https://github.com/jcubic/lips), the version used by `tp-scheme`. Small observation hooks inspect its existing evaluator; user expressions are not rewritten. The engine and standard library load only when recording, without a connection to a third-party execution service.

The initial scope covers synchronous SICP-style programs: definitions, lambdas, lexical binding, conditions, arithmetic, recursive and higher-order procedures, lists, pairs, vectors, closures and mutation. Built-in operations and standard-library implementation details are not expanded into source steps. Tests compare the examples with LIPS evaluation without observation.

User-defined macros, continuations, multiple values, dynamic evaluation, external file loading, interactive input, DOM/JavaScript interoperability and asynchronous operations are outside this initial scope. Recognized unsupported operations produce an explicit error. This is not a full Scheme debugger or a security sandbox.

Limits are 20,000 source characters, 1,000 snapshots plus a limit notification, 300 objects per snapshot, 200 vector elements and 100,000 output characters. Collections beyond these limits are truncated in the diagram. Execution stops after 10 seconds; source or trace loading after 30 seconds. Imported JSON is limited to 10 MB.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/scheme-tracer/scheme-tracer.js"></script>
  ```

import
: ```js
  import "/path/to/components/scheme-tracer/scheme-tracer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/scheme-tracer/scheme-tracer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Record factorial(5), inspect its five call frames and follow return values up to 120.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Subexpressions on one line
: Record execution and use Next and Previous to follow the two additions and their multiplication on one line. Setting x to its existing value adds no visible state change: these identical internal snapshots are grouped; the final output is 30, including after saving and reloading the trace.

Tail recursion
: Record sum-iter with 50 iterations. The result is 1275, and tail calls replace the active frame instead of growing the call stack.

Independent closures
: Follow the separate count bindings captured by first and second. set! updates their retained environments; the output is 1, 2 and 11.

Shared pairs and mutation
: Compare shared and independent lists. set-car! changes both references to shared, while the separately constructed lists remain unchanged.

Cyclic pair
: Follow the cdr arrow back to the same pair after set-cdr!. set-car! updates that same object through the cycle.

Vectors and aliases
: Inspect the shared vector and its alias. vector-set! changes element 1 to 99 without creating a new vector.

Higher-order procedures
: Step through map callbacks, first with square and then with a lambda capturing factor. The results are (1 4 9 16) and (3 6 9).

Error and call stack
: Pass a number to car. Inspect the error, its source line and the active first-item call; previous steps remain available.

Replay a saved trace
: Replay factorial from JSON without loading LIPS or executing Scheme. Save trace and Load trace save and reopen the complete recording.
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
@credit LIPS https://lips.js.org/
@summary Pinned LIPS Scheme evaluator with observation hooks, loaded only when recording.
-->

- [LIPS](https://lips.js.org/) : Pinned LIPS Scheme evaluator with observation hooks, loaded only when recording.
<!-- tp-docgen:dependencies:end -->
