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
  <script type="tp/python">
    x = 6 * 7
    print(x)
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
  <script type="tp/javascript">
    const x = 6 * 7;
    console.log(x)
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

Set `logo="logo-tp"` to display an icon at the left of the exported HTML toolbar, at the same height as its buttons. The value is a `tp-icon` name. By default, the icon of this notebook type is displayed. Set `logo=""` to hide it.

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
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
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
@tp-dependency tp-javascript-viewer
@summary Compact JavaScript code viewer and runner.
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
@tp-dependency tp-prolog-viewer
@summary Compact Prolog code viewer and runner.
-->
<!--
@tp-dependency tp-python-viewer
@summary Compact Python code viewer and runner.
-->
<!--
@tp-dependency tp-restructuredtext-viewer
@summary Interactive reStructuredText viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-sql-viewer
@summary Compact SQL code viewer and runner.
-->
<!--
@tp-dependency tp-typescript-viewer
@summary Compact TypeScript code viewer and runner.
-->

- [`<tp-asciidoc-viewer>`](#/components/asciidoc-viewer/index.md) : Interactive AsciiDoc viewer with editable source and parser outputs.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-javascript-viewer>`](#/components/javascript-viewer/index.md) : Compact JavaScript code viewer and runner.
- [`<tp-latex>`](#/components/latex/index.md) : Renders LaTeX documents with interactive components, MathJax formulas and TikZ figures.
- [`<tp-latex-viewer>`](#/components/latex-viewer/index.md) : Editable LaTeX documents with rendered HTML and generated source views.
- [`<tp-markdown-viewer>`](#/components/markdown-viewer/index.md) : Interactive Markdown viewer with editable source and parser outputs.
- [`<tp-prolog-viewer>`](#/components/prolog-viewer/index.md) : Compact Prolog code viewer and runner.
- [`<tp-python-viewer>`](#/components/python-viewer/index.md) : Compact Python code viewer and runner.
- [`<tp-restructuredtext-viewer>`](#/components/restructuredtext-viewer/index.md) : Interactive reStructuredText viewer with editable source and parser outputs.
- [`<tp-sql-viewer>`](#/components/sql-viewer/index.md) : Compact SQL code viewer and runner.
- [`<tp-typescript-viewer>`](#/components/typescript-viewer/index.md) : Compact TypeScript code viewer and runner.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
