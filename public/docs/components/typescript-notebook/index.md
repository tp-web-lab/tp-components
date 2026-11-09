<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="typescript-notebook" library="components" size="1.25em"></tp-icon> TypeScript Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-typescript-notebook>` element combines written explanations and executable TypeScript code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-typescript-notebook>
    <script type="tp/markdown"># Interactive TypeScript

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
    <script type="tp/typescript">const language: string = 'TypeScript';
console.log(`Hello from ${language}`);</script>
  </tp-typescript-notebook>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-typescript-notebook" src="/docs/components/typescript-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-typescript-notebook></tp-typescript-notebook>
  ```

inline scripts
: ```html
  <tp-typescript-notebook>
    <script type="tp/markdown"># TypeScript</script>
    <script type="tp/typescript">const message: string = 'Hello'; console.log(message);</script>
  </tp-typescript-notebook>
  ```

external file
: ```html
  <tp-typescript-notebook src="./notebook.json"></tp-typescript-notebook>
  ```

repository
: ```html
  <tp-typescript-notebook repository="./notebook/"></tp-typescript-notebook>
  ```
:::

### Authoring

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive TypeScript viewers.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/typescript-notebook/typescript-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/typescript-notebook/typescript-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typescript-notebook/typescript-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the typescript notebook cells and inspect their outputs.
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
