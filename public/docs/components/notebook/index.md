<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="notebook" library="components" size="1.25em"></tp-icon> Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-notebook>` element combines editable markup cells and executable programming-language cells.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-notebook>
  <script type="tp/markdown">
    # Notebook example
    Here is a notebook that combines AsciiDoc, HTML, LaTeX, Markdown and reStructuredText as markup languages, and Python and JavaScript as programming languages.

    ## Calculation
    We perform a simple multiplication in Python to demonstrate the calculation.
  </script>
  <script type="tp/python" query="x">
    x = 6 * 7
  </script>
  <script type="tp/restructuredtext" doctest="">
    .. h2::

       Verification

    We use the doctest blocks in reStructuredText to verify the output of the Python code.

    >>> print(6 * 7)
    42
  </script>
  <script type="tp/html">
    In JavaScript, we would have written the following code:
  </script>
  <script type="tp/javascript" query="x">
    const x = 6 * 7;
  </script>
  <script type="tp/asciidoc">
    == Result
    The result of the multiplication is displayed using Asciidoc and Mathjax:

    latexmath:[x = 6 * 7 = 42]
  </script>
  <script type="tp/latex">
    \section*{LaTeX and TP styles}
    The same result can be written in LaTeX: $6 \times 7 = 42$.

    \begin{itemize}
      \item Ordinary lists use the shared TP styles.
      \item Nested lists keep their hierarchy.
        \begin{itemize}
          \item This is a nested item.
        \end{itemize}
    \end{itemize}

    \wcTpCallout[variant=info,heading=LaTeX inside a component]{
      \textbf{The component controls its appearance.}
      \begin{itemize}
        \item Keep the LaTeX source readable.
        \item Reuse the same TP typography and list styles.
      \end{itemize}
    }
  </script>
</tp-notebook>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-notebook" src="/docs/components/notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Programs and queries

Set `query` on a programming script to prefill its interpreter prompt, or use a code cell's `query` property in a JSON notebook. Existing `query.*` and `*.query.*` files supply the prompt separately from the program. An empty query leaves the program unexecuted, including with Run all. Several source files in a cell are presented as one editable program; after editing this combined program, it is saved as a single source file.

Run or Return reloads a changed program before evaluating its query; unchanged source retains the current session. Successful reloads display “> Program reloaded.”. Source errors prevent query execution. Reset all restores the initially loaded source and query. Definitions remain available to following executed cells of the same language; a source reload in a shared notebook session does not clear definitions belonging to other cells.

### Initial content

::: tp-tabs
no content
: ```html
  <tp-notebook></tp-notebook>
  ```

internal scripts
: ```html
  <tp-notebook>
    <script type="tp/markdown"># Calculation</script>
    <script type="tp/python">print(6 * 7)</script>
  </tp-notebook>
  ```

external file
: ```html
  <tp-notebook src="./notebook.json"></tp-notebook>
  ```

repository
: ```html
  <tp-notebook repository="./notebook/"></tp-notebook>
  ```
:::

Add `readonly` to preserve rendering, execution, and navigation while preventing changes to programming cells.

### Configuration

The markup language menu includes LaTeX (`latex`), rendered by `tp-latex-viewer`. Inline LaTeX cells use `<script type="tp/latex">`; both document fragments and complete documents are supported. This option is also available in the specialized programming notebooks.

### Authoring

The generic `<tp-notebook>` accepts JavaScript, Prolog, Python, SQL, and TypeScript cells in the same notebook and detects each language from its script type. Cells may come from direct `script` children, a JSON `src`, or a `repository` directory. Specialized notebook elements restrict code cells to their own language.

Add `doctest` to a `script[type="tp/restructuredtext"]` cell to execute its standard Python
doctest blocks and display their pass or fail status in the rendered cell.

The exported HTML toolbar stays at the top of the window while scrolling. The clock is visible by default and can be hidden from the Controllers menu. Set `label="My notebook"` to display a title in its center; the default title is the notebook type name (for example, `Generic Notebook` or `Python Notebook`). Set `label=""` to hide it.

Set `logo="logo-tp"` to display a logo in a borderless `tp-button` at the left of the exported HTML toolbar. Its height is fixed at `2em`, and its width preserves the logo’s proportions. The value is a TP icon name or an SVG URL. By default, the icon of this notebook type is displayed. Set `logo=""` to hide it.

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
  <script type="module" src="/path/to/components/notebook/notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/notebook/notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/notebook/notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the notebook cells and inspect their outputs.

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
@tp-dependency tp-asciidoc-viewer
@summary Interactive AsciiDoc viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
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
@tp-dependency tp-html-viewer
@summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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
@tp-dependency tp-javascript
@summary Provides an interactive JavaScript interpreter.
-->
<!--
@tp-dependency tp-latex
@summary Renders LaTeX documents with interactive components, MathJax formulas and TikZ figures.
-->
<!--
@tp-dependency tp-latex-viewer
@summary Editable LaTeX documents with rendered HTML and generated source views.
-->
<!--
@tp-dependency tp-markdown-viewer
@summary Interactive Markdown viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-ocaml
@summary Provides an interactive OCaml interpreter.
-->
<!--
@tp-dependency tp-prolog
@summary Provides an interactive Prolog interpreter.
-->
<!--
@tp-dependency tp-python
@summary Provides an interactive Python interpreter.
-->
<!--
@tp-dependency tp-restructuredtext-viewer
@summary Interactive reStructuredText viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-scheme
@summary Provides an interactive Scheme interpreter.
-->
<!--
@tp-dependency tp-sql-viewer
@summary Compact SQL code viewer and runner.
-->
<!--
@tp-dependency tp-typescript
@summary Provides an interactive TypeScript interpreter.
-->

- [`<tp-asciidoc-viewer>`](#/components/asciidoc-viewer/index.md) : Interactive AsciiDoc viewer with editable source and parser outputs.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-javascript>`](#/components/javascript/index.md) : Provides an interactive JavaScript interpreter.
- [`<tp-latex>`](#/components/latex/index.md) : Renders LaTeX documents with interactive components, MathJax formulas and TikZ figures.
- [`<tp-latex-viewer>`](#/components/latex-viewer/index.md) : Editable LaTeX documents with rendered HTML and generated source views.
- [`<tp-markdown-viewer>`](#/components/markdown-viewer/index.md) : Interactive Markdown viewer with editable source and parser outputs.
- [`<tp-ocaml>`](#/components/ocaml/index.md) : Provides an interactive OCaml interpreter.
- [`<tp-prolog>`](#/components/prolog/index.md) : Provides an interactive Prolog interpreter.
- [`<tp-python>`](#/components/python/index.md) : Provides an interactive Python interpreter.
- [`<tp-restructuredtext-viewer>`](#/components/restructuredtext-viewer/index.md) : Interactive reStructuredText viewer with editable source and parser outputs.
- [`<tp-scheme>`](#/components/scheme/index.md) : Provides an interactive Scheme interpreter.
- [`<tp-sql-viewer>`](#/components/sql-viewer/index.md) : Compact SQL code viewer and runner.
- [`<tp-typescript>`](#/components/typescript/index.md) : Provides an interactive TypeScript interpreter.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
