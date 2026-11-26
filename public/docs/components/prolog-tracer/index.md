<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog-tracer" library="components" size="1.25em"></tp-icon> Prolog tracer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog-tracer>` element records and replays Prolog execution with the explored resolution tree and backtracking.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-prolog-tracer src="/docs/components/prolog-tracer/examples/family.pl" query="ancestor(ann, Who)."></tp-prolog-tracer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog-tracer" src="/docs/components/prolog-tracer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

Provide `src`, `value` or an inline `<script type="tp/prolog">` for the program and `query` for the initial goal. Loading source does not execute it. Edit source opens the program editor; the editable Query field supplies the current goal when recording. An optional `filename` overrides the source filename.

### Resolution tree

Record resolution runs the query in an isolated SWI-Prolog Worker, requesting all solutions. The recorder uses [prolog_trace_interception/4](https://www.swi-prolog.org/pldoc/man?predicate=prolog_trace_interception%2F4), rather than reimplementing Prolog evaluation. Start at the query root, then use Next to reveal each native debugger event. Previous reconstructs the earlier tree. Selecting a node returns to its creation event.

| Port | Meaning |
| --- | --- |
| call | Enter a goal. |
| unify | Select a clause and unify its head. The node shows the source line when available. |
| exit | The goal succeeds with its current bindings. |
| redo | Backtrack to another attempt; the previous attempt remains visible and dimmed. |
| fail | No further solution for this goal. |
| exception | An exception is raised or propagated. |
| cut_call / cut_exit | Enter or leave a cut, when reported by the engine. |

This is the explored **goal/clause-attempt tree**, derived from the debugger's call frames. It is not the complete abstract SLD tree of every possible resolvent. It retains visited alternatives, including failed attempts, but does not invent clauses skipped by indexing or branches pruned by a cut. Built-in goals appear when SWI exposes their ports; their internal implementation is not expanded. Goal text displays bindings at the selected event. Solutions appear as their events are reached. Program output is displayed at the end of the recording.

### Source lines

Source displays line numbers and highlights the location associated with the current event. Unification highlights the selected clause head; calls, exits and failures use the calling subgoal's source position when SWI-Prolog provides it. Next and Previous update the highlight, including when replaying a saved trace. The source panel scrolls to keep the active line visible.

The query root, solution events and events without a location in the loaded program have no highlighted line. Older recordings without subgoal positions use their recorded clause line.

### Saving and replaying

The toolbar shows the source filename in its center and starts in light theme; Theme switches between light and dark.

Open the closed **Trace JSON** section below Source and Solutions/Output to inspect the complete recording directly. Save trace opens Save as for that same JSON recording. Load trace or `trace="recording.json"` replays it without starting Prolog; `trace` takes precedence over source attributes. `getCode()` returns the recording JSON string. `goTo(index)` selects a zero-based event; `goTo(-1)` returns to the query root. `record()`, `stop()`, `refresh()` and `toggleSource()` mirror the controls.

### Limits

Recording is limited to 2,000 debugger events (plus a possible terminal exception) and 30 seconds including engine loading. Reaching the event limit retains the partial tree for inspection. Stop recording terminates its Worker. The recorder disables last-call optimization to retain parent frames and therefore does not measure normal execution performance. Interactive input and DOM access are not supported in the isolated Worker. Programs that replace debugger hooks or change tracing settings can disrupt recording. Infinite searches require a bound or may reach the recording limit. A JSON recording is a Prolog event stream, not the variables/heap format of the other tracers.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog-tracer/prolog-tracer.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-tracer/prolog-tracer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-tracer/prolog-tracer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Record ancestor(ann, Who), then follow the three solutions, failed branches and successive clause attempts.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Recursion
: Record factorial(4, F) and follow the recursive goals and returned value 24.

Failure
: Follow both likes goals and see why no shared drink is found.

Cut
: Compare the single red solution with the pruned alternatives after the cut.

Exception
: Follow the arithmetic exception and its propagation through the call frames.

Replay a saved trace
: Explore a saved ancestor recording without starting SWI-Prolog. Save trace and Load trace preserve the complete event stream.
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
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
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
@credit SWI-Prolog https://www.swi-prolog.org/
@summary Native debugger interception through the pinned swipl-wasm runtime.
-->

- [SWI-Prolog](https://www.swi-prolog.org/) : Native debugger interception through the pinned swipl-wasm runtime.
<!-- tp-docgen:dependencies:end -->
