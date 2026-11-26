<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ocaml-notebook" library="components" size="1.25em"></tp-icon> OCaml Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ocaml-notebook>` element combines written explanations and executable OCaml code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-ocaml-notebook>
  <script type="tp/markdown"># OCaml functions

Run all cells in order. The second cell uses the function defined by the first.</script>
  <script type="tp/ocaml" filename="functions.ml" query="square 3;;">
    let square x = x * x;;
  </script>
  <script type="tp/markdown">## Use the function

This cell uses the definition from the preceding cell.</script>
  <script type="tp/ocaml" filename="example.ml" query="square 7;;">
  </script>
</tp-ocaml-notebook>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ocaml-notebook" src="/docs/components/ocaml-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

Execution displays expression values without OCaml toplevel declarations or type prefixes: `square 7;;` displays `49`. Explicit printed messages and errors are preserved. This presentation also applies to executable cells in exported HTML notebooks. The OCaml interpreter and playground retain their typed toplevel output; the playground displays it directly in the output without a separate console.

### Cells and exported notebooks

Combine `<script type="tp/markdown">` explanation cells and `<script type="tp/ocaml">` code cells, optionally with `filename`. Run all cells in order: definitions persist across OCaml cells within this notebook, while separate notebooks use separate sessions. Reset notebook starts a fresh scope and restores initial code.

The exported HTML preserves the OCaml cells and their shared execution scope, with the usual fixed toolbar, logo, label, Reset all, Run all and controllers. The exported file loads the component modules and the bundled OCaml runtime from the same library location; it does not embed them in the HTML. Run all after opening the exported document to execute the examples again.

### OCaml execution

The engine is an OCaml 5.5.2 toplevel compiled with [Js_of_ocaml 6.5.0](https://ocsigen.org/js_of_ocaml/). The runtime and standard library are distributed with tp-components and loaded on demand; a CDN is not required. Sessions are independent, except for cells in the same notebook. When rebundling the library into an application, copy the distributed `runtimes/ocaml` directory into the application’s public assets at the deployment root. Keep its license and source files alongside the runtime.

Expressions display their value and inferred type. `print_endline` and `Printf.printf` write to the output. Type errors and exceptions do not discard earlier definitions. Use `;;` to separate successive toplevel phrases. Sources can also use ordinary `.ml` file syntax.

Browser bindings are available through `Js_of_ocaml`. Use `Tp_dom.document ()` and `Tp_dom.window ()` to access the containing interpreter page or the active project/cell preview. Standard OCaml calls such as `Dom.appendChild` and `Dom_html.addEventListener` work without preprocessing. PPX syntax such as `##` is not enabled. This browser runtime does not install arbitrary opam packages or provide operating-system processes. Run trusted code: browser bindings can modify the page, and a synchronous infinite loop can block it.

### Cell presentation and execution

Programming cells use the corresponding interpreter in `mode="simple"`: the source editor, transcript and query field remain visible, without an interpreter header or query buttons. A nonempty query is required; a program alone is not executed. Press <kbd>Return</kbd> in the query field or <kbd>Shift</kbd>+<kbd>Return</kbd> in the cell to reload changed source and execute the query. Run all processes cells in document order. SQL retains its specialized viewer.

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
  <script type="module" src="/path/to/components/ocaml-notebook/ocaml-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/ocaml-notebook/ocaml-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ocaml-notebook/ocaml-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the ocaml notebook cells and inspect their outputs.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Shared state and HTML export
: Run all cells to obtain 1, then rerun the last cell to obtain 2. Export HTML to repeat the actions outside the documentation; Reset all creates a fresh session.

Messages, errors and HTML export
: Run each cell with <kbd>Shift</kbd>+<kbd>Return</kbd> to see its message or error directly in the output. Export HTML and repeat the same actions; these interpreters have a required prefilled query and no separate console.

Program queries and automatic reload
: Run the prefilled query to obtain 10. Change 10 to 20 in the program and press Return in the query field or Shift+Return in the editor. A successful reload displays “> Program reloaded.” before the query. Export HTML and repeat the change: the source and query remain editable. Clear the query to verify that no program is executed without one.
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
