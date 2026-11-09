<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="python-notebook" library="components" size="1.25em"></tp-icon> Python Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-python-notebook>` element combines written explanations and executable Python code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-python-notebook>
    <script type="tp/markdown"># Interactive Python

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
    <script type="tp/python">print("Hello from Python")</script>
  </tp-python-notebook>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-python-notebook" src="/docs/components/python-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-python-notebook></tp-python-notebook>
  ```

inline scripts
: ```html
  <tp-python-notebook>
    <script type="tp/markdown"># Python</script>
    <script type="tp/python">print("Hello")</script>
  </tp-python-notebook>
  ```

external file
: ```html
  <tp-python-notebook src="./notebook.json"></tp-python-notebook>
  ```

repository
: ```html
  <tp-python-notebook repository="./notebook/"></tp-python-notebook>
  ```
:::

### Authoring

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive Python viewers.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/python-notebook/python-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/python-notebook/python-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/python-notebook/python-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the python notebook cells and inspect their outputs.
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
