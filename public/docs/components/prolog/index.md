<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog" library="components" size="1.25em"></tp-icon> Prolog

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog>` element provides an interactive Prolog interpreter.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-prolog>
  <script type="tp/prolog">
    color(red).
    color(green).
    color(blue).
  </script>
</tp-prolog>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog" src="/docs/components/prolog/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

`mode="default"` (the default) and `mode="lite"` show the normal interface. `mode="simple"` opens the source editor and hides the interpreter header, welcome and engine information. The query buttons and Libraries dropdown remain available, including Next solution, All solutions and Accept. The query and output remain available: use Return or Shift+Return to reload changed source before executing. Changing mode preserves the source, query and session.

The Run button, <kbd>Return</kbd> and <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field reload the program if its source has changed, then execute the current query. An unchanged program keeps its existing session. A changed program starts a fresh session, so previous runtime state is discarded; the query text is retained. A source-loading error is shown without executing the query. A successful reload displays “> Program reloaded.” before the query; unchanged source produces no reload message.

The engine banner appears only on the first interpreter of this language opened in the page. Reset, a source reload and other instances do not repeat it. Reloading the page allows it to appear again.

Set `query` to prefill the query field, for example `<tp-prolog query="member(X, [a, b])."></tp-prolog>`. Run retains the entered query so it can be rerun or edited directly. The query field provides copy and clear buttons to copy its current value or empty it. In library examples, the introductory Query field is read-only and also provides a copy button. Accept also retains it; Reset restores the initial query. The library examples prefill their demonstration query so it can be run directly; only examples that need an explicit import ask you to use the libraries menu first.

The **Libraries** dropdown, opened with the SWI-Prolog icon below the query field, loads SWI-Prolog libraries with `use_module`. Select several libraries successively; a check before each name identifies a loaded library, including libraries loaded by the source or a manual query. Loading a library closes any pending query but preserves the query field. Clear keeps the libraries; Reset and a source reload start a fresh session. The menu includes aggregate, apply, assoc, clpfd, clpq, clpr, dcg/basics, dif, dom, lists, ordsets, pairs, plunit, random, wasm and when. CLP(Q) and CLP(R) cannot be imported together; reset before switching between them.

### Automatic library loading

SWI-Prolog can load an indexed library when an undefined predicate is first called; this does not mean that every library is loaded at startup. See the [SWI-Prolog autoloading documentation](https://www.swi-prolog.org/pldoc/man?section=autoload). The following behavior was verified with the documented examples in SWI-Prolog 10.1.21 / swipl-wasm 8.3.1:

| Libraries | Action needed for these examples |
| --- | --- |
| `aggregate`, `apply`, `assoc`, `dif`, `dom`, `lists`, `ordsets`, `pairs`, `random`, `when` | Click Run directly. The required predicates are autoloadable; some libraries may already be loaded by the runtime or another dependency. |
| `wasm` | Click Run directly; the runtime provides it at initialization. |
| `plunit` | Click Run directly; the example source imports it before declaring the test suite. |
| `clpfd` | Select it in the dropdown before Run, so operators such as `ins` and `#<` are defined when reading the query. |
| `clpq`, `clpr` | Select the intended solver in the dropdown before Run; the `{}/1` constraint predicate is not autoloaded in these examples. Use separate sessions for the two solvers. |
| `dcg/basics` | Select it in the dropdown before Run; the example's `integer//1` grammar rule is not autoloaded in this distribution. |

These instructions concern the predicates and syntax used by each example, not every possible use of these libraries. The dropdown remains available for explicit loading and shows checks for libraries loaded automatically as well.

### Toolbar

The toolbar displays the native Prolog language icon and name on the left. Color, theme and fullscreen controls on the right apply to this interpreter only. The icon buttons below the prompt run a query, request another solution, display all remaining solutions, accept an answer, clear the transcript or reset the session; hover or focus them to identify each command.

### Source file and editor

The toolbar shows the source filename: `filename` on the interpreter, then the basename of `src`, then `filename` on its inline Prolog script, or `program.pl` by default. Use **Edit source** in the toolbar to show or hide a `tp-code-editor` with Prolog highlighting, line numbers and its own toolbar.

The Edit source button sits immediately before the vertical divider preceding the color, theme and fullscreen controls.

Edit the program and choose **Run** to consult the changed source in a fresh session and execute the query. Hiding the editor keeps the draft; editing alone does not alter the running session. **Reset** restores the original authored program in both the interpreter and the editor. The editor's save command uses the displayed filename.

### Queries and session state

Enter `color(X).` at the `?-` prompt. Use **Next solution** or enter `;` to request another answer. **All solutions** can run the entered query directly and display all its answers, without first using Run. With an unchanged or empty prompt, it displays the remaining answers of the current query without restarting it; **Accept** or <kbd>Escape</kbd> can stop this enumeration. **Accept**, an empty prompt or `.` closes the current search. A new query also closes any unfinished search. `false.` means no further solution exists; errors are shown in the transcript and the prompt remains usable.

The initial greeting shows `tp-prolog - enter a query ending with a full stop.`, followed by `Engine: SWI-Prolog 10.1.21 · WASM: swipl-wasm 8.3.1` on the next line. These identify the Prolog engine and the pinned npm WASM distribution, respectively. Each name links to its documentation: the [SWI-Prolog manual](https://www.swi-prolog.org/pldoc/refman/) and the [swipl-wasm GitHub repository](https://github.com/SWI-Prolog/npm-swipl-wasm), opening in a new tab.

The interpreter loads [SWI-Prolog WASM](https://www.swi-prolog.org/pldoc/man?section=wasm-version) on the first query. Each component has its own session. For example, `assertz(likes(ada, prolog)).` followed by `likes(ada, X).` demonstrates persistent facts. **Clear** only clears the transcript; **Reset** discards changes, restores the initial program and displays the welcome message again, without repeating the Engine/WASM links.

### Initial program

Set `src` to load an external `.pl` file, provide facts, rules and directives in a child `<script type="tp/prolog">`, or set `value` to the program. Precedence is `src`, then `value`, then the script. Relative URLs use the containing document’s source location. Changing the source takes effect after Reset.

Inline scripts use the shared `getCodeFromScript` loader and its `dedent` normalization, so HTML indentation is removed while relative Prolog indentation is preserved. External files use `getCodeFromFile`; their content is preserved as authored. The editor and interpreter share the same resolved source. Files are fetched on first use, and Reset restores the loaded original; loading errors appear in the transcript and can be retried.

Scripts and files are consulted as programs, not automatically executed as queries.

`library(clpfd)`, `library(clpq)`, `library(clpr)` and PlUnit are available. Import a library in the initial program or submit `use_module(library(clpfd)).`. Define PlUnit suites in the program, then submit `run_tests.`. The native libraries operate on the containing document:

- [`library(wasm)`](https://www.swi-prolog.org/pldoc/man?section=wasm-js-call) provides JavaScript access with `:=`, including `document.querySelector(...)`.
- [`library(dom)`](https://www.swi-prolog.org/pldoc/man?section=dom) adds HTML construction with `append_html/2` and `html//1`, and event handlers with `bind/4` and `bind_async/4`. SWI-Prolog autoloads it when these predicates are first called, so loading **dom** from the Libraries menu is optional. The menu reflects its loaded state after execution.

### Execution limits

This prompt evaluates one query at a time and displays one solution at a time. Each answer is limited to one million Prolog inferences to prevent an unbounded search; the prompt reports a resource error if the limit is reached. It is a browser query interpreter, not an operating-system terminal: interactive standard input and a terminal debugger are not provided. The runtime needs network access on first load.

### Execution tracing

Add `tracer` to show Trace execution. It opens `tp-prolog-tracer` in a drawer initially 75% wide, recording the current editor source and query in an independent SWI-Prolog engine. The existing interpreter session and its pending solutions are unchanged. In simple mode the button is beside the query; Next solution and All solutions remain available.

Closing the drawer stops recording. Reopen it after editing the program or query to create a new trace. Removing `tracer` removes the command and closes the drawer. See the [Prolog tracer](components/prolog-tracer/index.md) for the supported recording environment and limits.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog/prolog.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog/prolog.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog/prolog.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter color(X). and use Next solution or ; to enumerate red, green and blue. Assert a new fact and query it again to observe the persistent session.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Integer constraints
: Enter digit(X). to inspect its residual constraint, then digit(X), labeling([], [X]). to enumerate 1, 2 and 3. Accept the current answer before submitting another query.

External Prolog file
: Open colors.pl with Edit source, then run color(X). or warm(X). Apply an edit to test the modified program; Reset restores the loaded file.

DOM elements and click events
: Click Run, then click the generated button to update the paragraph from Prolog. The dom library loads automatically on first use; inspect its check in the libraries menu, or load it explicitly there before running the query.

Library aggregate: Aggregate values
: Click Run directly without loading a library from the menu (expected: `Total = 100`). Totals the two salaries.

Library apply: Map a predicate
: Click Run directly without loading a library from the menu (expected: `Doubles = [2,4,6]`). Applies double/2 to every list item.

Library assoc: Key-value associations
: Click Run directly without loading a library from the menu (expected: `Score = 42`). Builds an association tree and retrieves a value by key.

Library clpfd: Finite-domain constraints
: Select **clpfd** in the SWI-Prolog libraries menu, then click Run (expected: `A = 1, B = 2`). Use Next solution to obtain A = 1, B = 3, then A = 2, B = 3.

Library clpq: Exact rational constraints
: Select **clpq** in the SWI-Prolog libraries menu, then click Run (expected: `X = 1r2`). Solves an exact rational equation; 1r2 means one half. Use this independent interpreter rather than loading clpr in the same session.

Library clpr: Real-number constraints
: Select **clpr** in the SWI-Prolog libraries menu, then click Run (expected: `X = 1.5`). Solves a real-number equation. Use this independent interpreter rather than loading clpq in the same session.

Library dcg/basics: Parse an integer
: Select **dcg/basics** in the SWI-Prolog libraries menu, then click Run (expected: `Number = 42`). Parses text with the integer//1 grammar rule.

Library dif: Disequality constraints
: Click Run directly without loading a library from the menu (expected: `X = green`). Excludes red before X is known. Next solution produces X = blue.

Library lists: Reverse a list
: Click Run directly without loading a library from the menu (expected: `Cities = [paris,lyon,nice], Return = [nice,lyon,paris]`). Reverses the route using reverse/2.

Library ordsets: Union of ordered sets
: Click Run directly without loading a library from the menu (expected: `Colors = [blue,green,red]`). Combines sorted sets without duplicating red.

Library pairs: Group values by key
: Click Run directly without loading a library from the menu (expected: `Groups = [fruit-[apple,pear],vegetable-[carrot]]`). Groups consecutive pairs with the same key.

Library plunit: Unit tests
: Click Run to execute the two tests; the source already imports plunit. Both tests pass. Change the expected 4 to 5 in the source, click Run to see a failing test.

Library random: Roll a die
: Click Run directly without loading a library from the menu (expected: `Die = an integer from 1 to 6`). Run the query several times; results may repeat.

Library wasm: Call JavaScript
: Click Run directly without loading a library from the menu (expected: `Maximum = 7`). Calls JavaScript Math.max through the := operator. The runtime already loads wasm; its check appears after initialization.

Library when: Delay a goal
: Click Run directly without loading a library from the menu (expected: `X = 21, Y = 42`). Delays the multiplication until X has a value.

Presentation modes and automatic reload
: In each mode, run answer(X). to obtain X = 10, select Next solution for X = 20, then All solutions for X = 30. All solutions can also run the query directly. Change answer(10). to answer(100). and Run again to verify automatic reloading. The solution buttons remain visible in simple mode.

Execution trace drawer
: With tracer enabled, open Trace execution to follow ancestor(ann, Who) in a drawer initially 75% wide. Edit the source or query and reopen it; the independent recording preserves the interpreter session and its pending solutions.
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
@tp-dependency tp-dropdown
@summary Dropdown menu component.
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
@tp-dependency tp-menu
@summary Accessible menu component.
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
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit SWI-Prolog WASM https://www.swi-prolog.org/
@summary Prolog execution in the browser.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [SWI-Prolog WASM](https://www.swi-prolog.org/) : Prolog execution in the browser.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
