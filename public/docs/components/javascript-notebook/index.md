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
<tp-javascript-notebook>
    <script type="tp/markdown"># Interactive JavaScript

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
    <script type="tp/javascript">console.log('Hello from JavaScript');</script>
  </tp-javascript-notebook>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-javascript-notebook" src="/docs/components/javascript-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

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
