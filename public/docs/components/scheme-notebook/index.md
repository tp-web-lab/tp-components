<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="scheme-notebook" library="components" size="1.25em"></tp-icon> Scheme Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-scheme-notebook>` element combines written explanations and executable Scheme code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-scheme-notebook>
  <script type="tp/markdown"># Scheme functions

Run all cells in order. The second cell uses the function defined by the first.</script>
  <script type="tp/scheme" filename="functions.scm" query="(square 3)">
    (define (square x) (* x x))
  </script>
  <script type="tp/markdown">## Use the function

This cell uses the definition from the preceding cell.</script>
  <script type="tp/scheme" filename="example.scm" query="(square 7)">
  </script>
</tp-scheme-notebook>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-scheme-notebook" src="/docs/components/scheme-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

### Cells and exported notebooks

Combine `<script type="tp/markdown">` explanation cells and `<script type="tp/scheme">` code cells, optionally with `filename`. Run all cells in order: definitions persist across Scheme cells within this notebook, while separate notebooks use separate sessions. Reset notebook starts a fresh scope and restores initial code.

The exported HTML preserves the Scheme cells and their shared execution scope, with the usual fixed toolbar, logo, label, Reset all, Run all and controllers. LIPS and the component modules are loaded online. Run all after opening the exported document to execute the examples again.

### LIPS execution

Scheme runs with [LIPS](https://lips.js.org/docs/intro), pinned to `1.0.0-beta.23.1`, including its standard library. The first execution downloads the runtime and standard library. Run trusted code only: Scheme can access JavaScript and the DOM. A synchronous infinite loop can block the page.

`display` and `newline` produce output; the last result uses Scheme notation, including lists and exact rational numbers. Exceptions are reported without preventing subsequent executions. The implementation aims at R7RS compatibility through LIPS; this is not a native operating-system Scheme installation.

Use `document` to access the containing interpreter page or the current project preview. JavaScript methods can be called with dot notation, and a Scheme `lambda` can handle a DOM event. The interface uses light DOM and shared TP components.

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
  <script type="module" src="/path/to/components/scheme-notebook/scheme-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/scheme-notebook/scheme-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/scheme-notebook/scheme-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the scheme notebook cells and inspect their outputs.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Shared state and HTML export
: Run all cells to initialize and increment count, then rerun the last cell to obtain 2. Export HTML and repeat the actions; Reset all restores the initial sources and session.

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
