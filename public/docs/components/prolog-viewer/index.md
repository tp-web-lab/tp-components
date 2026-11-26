<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog-viewer" library="components" size="1.25em"></tp-icon> Prolog Viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog-viewer>` element displays and runs one Prolog example in a compact interface.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-prolog-viewer src="/docs/components/_shared/intro-projects/prolog.json"></tp-prolog-viewer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog-viewer" src="/docs/components/prolog-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

Engine versions and documentation links are displayed only in the Prolog interpreter, once per page.

### Initial content

::: tp-tabs
no content
: ```html
  <tp-prolog-viewer></tp-prolog-viewer>
  ```
  Without explicit content, the viewer opens two empty editors: `program.pl` and `query.pl`.

script without filename
: ```html
  <tp-prolog-viewer>
    <script type="tp/prolog">
      parent(ada, byron).
      parent(byron, charles).

      grandparent(Grandparent, Grandchild) :-
        parent(Grandparent, Parent),
        parent(Parent, Grandchild).
    </script>
  </tp-prolog-viewer>
  ```
  A single script without `filename` initializes `program.pl`; the viewer creates an empty `query.pl` editor so the user can enter a query.

scripts with filename
: ```html
  <tp-prolog-viewer>
    <script type="tp/prolog" filename="program.pl">
      parent(ada, byron).
      parent(byron, charles).

      grandparent(Grandparent, Grandchild) :-
        parent(Grandparent, Parent),
        parent(Parent, Grandchild).
    </script>
    <script type="tp/prolog" filename="query.pl">
      grandparent(ada, Grandchild).
    </script>
  </tp-prolog-viewer>
  ```
  Internal scripts may use `type="tp/prolog"` (recommended) or `type="tp/prolog-viewer"`.
  Use `filename="program.pl"` and `filename="query.pl"` to initialize the two editors. Their content is dedented before it is added to the project.

external project
: ```html
  <tp-prolog-viewer src="./example.json"></tp-prolog-viewer>
  ```
  The `src` file describes the complete project, including its entry point and files.

  `example.json`:

  ```json
  {
    "name": "Prolog viewer example",
    "entry": "/program.pl",
    "query": "/query.pl",
    "files": [
      {
        "path": "/program.pl",
        "language": "prolog",
        "content": "parent(ada, byron).\nparent(byron, charles).\n\ngrandparent(Grandparent, Grandchild) :-\n  parent(Grandparent, Parent),\n  parent(Parent, Grandchild)."
      },
      {
        "path": "/query.pl",
        "language": "prolog",
        "content": "grandparent(ada, Grandchild)."
      }
    ]
  }
  ```

project directory
: ```html
  <tp-prolog-viewer repository="./example/"></tp-prolog-viewer>
  ```
  The `repository` directory contains the project metadata and files.

  `.files.json`:

  ```json
  {
    "files": [
      "program.pl",
      "query.pl"
    ]
  }
  ```

  `project.json`:

  ```json
  {
    "name": "Prolog repository example",
    "entry": "/program.pl",
    "query": "/query.pl"
  }
  ```

  `program.pl`:

  ```prolog
  parent(ada, byron).
  parent(byron, charles).

  grandparent(Grandparent, Grandchild) :-
    parent(Grandparent, Parent),
    parent(Parent, Grandchild).
  ```

  `query.pl`:

  ```prolog
  grandparent(ada, Grandchild).
  ```
:::

The Prolog viewer displays `program.pl` and `query.pl` in two labeled editors. Edit either file, then use **Run** to execute the current query against the current program.

### Authoring

The `src` attribute accepts either a JSON project or a single prolog source file (`.pl`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-prolog-viewer src="/docs/components/_shared/single-source/example.pl"></tp-prolog-viewer>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files display an error in the output. Existing JSON sources, including extensionless URLs, remain supported.

### SWI-Prolog runtime

Prolog runs on demand with SWI-Prolog WASM (distribution `swipl-wasm` 8.3.1). Execution uses the same runtime in viewers, playgrounds, notebooks, questions and exported HTML notebooks. Prolog source files retain their modules and relative `use_module`/`include` paths.

Use `library(clpfd)` for integer constraints, including `ins`, `#=` and `labeling/2`; `library(clpq)` and `library(clpr)` provide rational and real constraints. Unlabelled answers retain their residual constraints. Programs written for the previous runtime should replace `library(clpz)` with `library(clpfd)`.

`library(wasm)` provides direct JavaScript and DOM access through `:=/2`. `library(dom)` provides HTML creation and event bindings; its DOM is the execution iframe's document. This is SWI-Prolog's native DOM library, not the former TP DOM simulation. For Tau-style predicates such as `get_by_id/2` and `set_html/2`, use `library(dialect/tau/dom)` where supported. See the [SWI-Prolog WASM manual](https://www.swi-prolog.org/pldoc/man?section=wasm-version).

Tests can use [PlUnit](https://www.swi-prolog.org/pldoc/package/plunit.html): load `library(plunit)`, declare a suite with `begin_tests/1` and `end_tests/1`, and write `test/1` or `test/2` clauses. The test command runs `run_tests/0` and reports success or failure. Existing TP `:- test(Name, Goal[, Expected]).` directives remain supported in files without a PlUnit suite.

### Presentation mode

Set `mode="default"` for the standard viewer, `mode="lite"` for the compact presentation, or `mode="simple"` for only the source editor and rendered output. Simple mode always shows both panes, hides the viewer toolbar and uses <kbd>Shift</kbd>+<kbd>Enter</kbd> to run the edited source. The panes adapt to the available width.

The historical boolean `lite` attribute remains an alias for `mode="lite"` when `mode` is absent. An explicit `mode` takes precedence; unsupported values use `default`. Changing the mode preserves the current editable source.

Programming viewers already use a compact toolbar, so `lite` retains their standard controls. In all three modes, messages and errors appear directly in the output.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog-viewer/prolog-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-viewer/prolog-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-viewer/prolog-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied prolog example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

src
: Inspect the output produced by loading the external source file.

script without filename
: Inspect the output produced from the embedded source script.

scripts with filename
: Inspect the output produced from embedded scripts with explicit filenames.

error
: Run the intentionally failing example and inspect the reported error.

Single source file
: Load the standalone prolog file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.

Compare presentation modes
: Compare the three modes and use <kbd>Shift</kbd>+<kbd>Return</kbd> to display messages and errors directly in the output, without a separate console.
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
@tp-dependency tp-prolog-playground
@summary Prolog playground component.
-->

- [`<tp-prolog-playground>`](#/components/prolog-playground/index.md) : Prolog playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
