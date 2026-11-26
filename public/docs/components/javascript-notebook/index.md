<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="javascript-notebook" library="components" size="1.25em"></tp-icon> JavaScript Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-javascript-notebook>` element combines written explanations and executable JavaScript code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-javascript-notebook>
    <script type="tp/markdown"># Interactive JavaScript

Select **Run all cells** to execute the program. Edit the program directly in each cell; its query is prefilled.</script>
    <script type="tp/javascript" query="message">const message = 'Hello from JavaScript';</script>
  </tp-javascript-notebook>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-javascript-notebook" src="/docs/components/javascript-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Programs and queries

Set `query` on a programming script to prefill its interpreter prompt, or use a code cell's `query` property in a JSON notebook. Existing `query.*` and `*.query.*` files supply the prompt separately from the program. An empty query leaves the program unexecuted, including with Run all. Several source files in a cell are presented as one editable program; after editing this combined program, it is saved as a single source file.

Run or Return reloads a changed program before evaluating its query; unchanged source retains the current session. Successful reloads display “> Program reloaded.”. Source errors prevent query execution. Reset all restores the initially loaded source and query. Definitions remain available to following executed cells of the same language; a source reload in a shared notebook session does not clear definitions belonging to other cells.

### Initial content

::: tp-tabs
no content
: ```html
  <tp-javascript-notebook></tp-javascript-notebook>
  ```

inline scripts
: ```html
  <tp-javascript-notebook>
    <script type="tp/markdown"># JavaScript</script>
    <script type="tp/javascript">console.log('Hello');</script>
  </tp-javascript-notebook>
  ```

external file
: ```html
  <tp-javascript-notebook src="./notebook.json"></tp-javascript-notebook>
  ```

repository
: ```html
  <tp-javascript-notebook repository="./notebook/"></tp-javascript-notebook>
  ```
:::

### Authoring

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive JavaScript viewers.

The exported HTML toolbar stays at the top of the window while scrolling. The clock is visible by default and can be hidden from the Controllers menu. Set `label="My notebook"` to display a title in its center; the default title is the notebook type name (for example, `Generic Notebook` or `Python Notebook`). Set `label=""` to hide it.

Set `logo="logo-tp"` to display a logo in a borderless `tp-button` at the left of the exported HTML toolbar. Its height is fixed at `2em`, and its width preserves the logo’s proportions. The value is a TP icon name or an SVG URL. By default, the icon of this notebook type is displayed. Set `logo=""` to hide it.

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
  <script type="module" src="/path/to/components/javascript-notebook/javascript-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/javascript-notebook/javascript-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/javascript-notebook/javascript-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the javascript notebook cells and inspect their outputs.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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
