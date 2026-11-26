<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog-notebook" library="components" size="1.25em"></tp-icon> Prolog Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog-notebook>` element combines written explanations and executable Prolog code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-prolog-notebook>
      <script type="tp/markdown">
        # Family relations

        Select **Run all cells** to execute the program. Edit the program directly in each cell; its query is prefilled.
      </script>
      <script type="tp/prolog" filename="program.pl">
        parent(ada, byron).
        parent(byron, charles).

        grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
      </script>
      <script type="tp/prolog" filename="query.pl">
        grandparent(ada, Grandchild).
      </script>
  </tp-prolog-notebook>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog-notebook" src="/docs/components/prolog-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

Engine versions and documentation links are displayed only in the Prolog interpreter, once per page. This information also appears in the exported standalone HTML notebook.

### Programs and queries

Set `query` on a programming script to prefill its interpreter prompt, or use a code cell's `query` property in a JSON notebook. Existing `query.*` and `*.query.*` files supply the prompt separately from the program. An empty query leaves the program unexecuted, including with Run all. Several source files in a cell are presented as one editable program; after editing this combined program, it is saved as a single source file.

Run or Return reloads a changed program before evaluating its query; unchanged source retains the current session. Successful reloads display “> Program reloaded.”. Source errors prevent query execution. Reset all restores the initially loaded source and query. Definitions remain available to following executed cells of the same language; a source reload in a shared notebook session does not clear definitions belonging to other cells.

### Initial content

::: tp-tabs
no content
: ```html
  <tp-prolog-notebook></tp-prolog-notebook>
  ```

inline scripts
: ```html
  <tp-prolog-notebook>
    <script type="tp/markdown"># Family relations</script>
    <script type="tp/prolog" filename="program.pl">
      parent(ada, byron).
    </script>
    <script type="tp/prolog" filename="query.pl">
      parent(ada, X).
    </script>
  </tp-prolog-notebook>
  ```

external file
: ```html
  <tp-prolog-notebook src="./notebook.json"></tp-prolog-notebook>
  ```

  ```json
  {
    "name": "Family relations",
    "cells": [
      { "type": "markup", "language": "markdown", "content": "# Family relations" },
      {
        "type": "code",
        "language": "prolog",
        "files": [
          { "filename": "program.pl", "content": "parent(ada, byron)." },
          { "filename": "query.pl", "content": "parent(ada, X)." }
        ]
      }
    ]
  }
  ```

repository
: ```html
  <tp-prolog-notebook repository="./notebook/"></tp-prolog-notebook>
  ```

  The directory contains `project.json`, `.files.json`, and the files referenced by the cells. In `project.json`, a cell `content` or file `content` may contain a repository path instead of inline content.
:::

The same interface is available as `<tp-javascript-notebook>`, `<tp-typescript-notebook>`, `<tp-python-notebook>`, and `<tp-sql-notebook>`.

### Authoring

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive Prolog viewers.

The exported HTML toolbar stays at the top of the window while scrolling. The clock is visible by default and can be hidden from the Controllers menu. Set `label="My notebook"` to display a title in its center; the default title is the notebook type name (for example, `Generic Notebook` or `Python Notebook`). Set `label=""` to hide it.

Set `logo="logo-tp"` to display a logo in a borderless `tp-button` at the left of the exported HTML toolbar. Its height is fixed at `2em`, and its width preserves the logo’s proportions. The value is a TP icon name or an SVG URL. By default, the icon of this notebook type is displayed. Set `logo=""` to hide it.

### SWI-Prolog runtime

Prolog runs on demand with SWI-Prolog WASM (distribution `swipl-wasm` 8.3.1). Execution uses the same runtime in viewers, playgrounds, notebooks, questions and exported HTML notebooks. Prolog source files retain their modules and relative `use_module`/`include` paths.

Use `library(clpfd)` for integer constraints, including `ins`, `#=` and `labeling/2`; `library(clpq)` and `library(clpr)` provide rational and real constraints. Unlabelled answers retain their residual constraints. Programs written for the previous runtime should replace `library(clpz)` with `library(clpfd)`.

`library(wasm)` provides direct JavaScript and DOM access through `:=/2`. `library(dom)` provides HTML creation and event bindings; its DOM is the execution iframe's document. This is SWI-Prolog's native DOM library, not the former TP DOM simulation. For Tau-style predicates such as `get_by_id/2` and `set_html/2`, use `library(dialect/tau/dom)` where supported. See the [SWI-Prolog WASM manual](https://www.swi-prolog.org/pldoc/man?section=wasm-version).

Tests can use [PlUnit](https://www.swi-prolog.org/pldoc/package/plunit.html): load `library(plunit)`, declare a suite with `begin_tests/1` and `end_tests/1`, and write `test/1` or `test/2` clauses. In a notebook query cell, call `run_tests.` explicitly. In playgrounds and question components, the test command runs `run_tests/0` and reports success or failure. Existing TP `:- test(Name, Goal[, Expected]).` directives remain supported in files without a PlUnit suite.

### Cell presentation and execution

Programming cells use the corresponding interpreter in `mode="simple"`: the source editor, transcript and query field remain visible, without an interpreter header. Prolog retains its query buttons and Libraries dropdown so that Next solution, All solutions and Accept remain accessible; the other interpreters hide their query buttons. A nonempty query is required; a program alone is not executed. Press <kbd>Return</kbd> in the query field or <kbd>Shift</kbd>+<kbd>Return</kbd> in the cell to reload changed source and execute the query. Run all processes cells in document order. SQL retains its specialized viewer.

The HTML export uses the same simple interpreters, mandatory queries and automatic source reloading. Edited source and query text are preserved when saving or exporting. Markup cells remain rendered document content.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog-notebook/prolog-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-notebook/prolog-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-notebook/prolog-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the prolog notebook cells and inspect their outputs.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Constraints and PlUnit
: Run all cells to enumerate the two CLP(FD) solutions and execute three PlUnit tests. Export the notebook as HTML and run it again to verify the same results; change a test expectation to observe a failure.

Messages, errors and HTML export
: Run each cell with <kbd>Shift</kbd>+<kbd>Return</kbd> to see its message or error directly in the output. Export HTML and repeat the same actions; these interpreters have a required prefilled query and no separate console.

Program queries and automatic reload
: Run the prefilled query to obtain 10. Change 10 to 20 in the program and press Return in the query field or Shift+Return in the editor. A successful reload displays “> Program reloaded.” before the query. Export HTML and repeat the change: the source and query remain editable. Clear the query to verify that no program is executed without one.

Multiple solutions and HTML export
: Run answer(X). for X = 10, select Next solution for X = 20, then All solutions for the remaining answer X = 30. After the query finishes, Clear and All solutions display all three answers directly. Export HTML and repeat the same steps in the standalone notebook; Prolog keeps these controls in simple mode.
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
@tp-dependency tp-notebook
@summary Interactive notebook combining markup and executable code cells.
-->

- [`<tp-notebook>`](#/components/notebook/index.md) : Interactive notebook combining markup and executable code cells.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
