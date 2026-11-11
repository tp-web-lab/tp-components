<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="sql-notebook" library="components" size="1.25em"></tp-icon> SQL Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-sql-notebook>` element combines written explanations and executable SQL code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-sql-notebook>
    <script type="tp/markdown"># Interactive SQL

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
    <script type="tp/sql" filename="tables.sql">CREATE TABLE language (name TEXT);
INSERT INTO language VALUES ('SQL');</script>
    <script type="tp/sql" filename="query.sql">SELECT * FROM language;</script>
  </tp-sql-notebook>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-sql-notebook" src="/docs/components/sql-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-sql-notebook></tp-sql-notebook>
  ```

inline scripts
: ```html
  <tp-sql-notebook>
    <script type="tp/sql" filename="tables.sql">CREATE TABLE item (name TEXT);</script>
    <script type="tp/sql" filename="query.sql">SELECT * FROM item;</script>
  </tp-sql-notebook>
  ```

external file
: ```html
  <tp-sql-notebook src="./notebook.json"></tp-sql-notebook>
  ```

repository
: ```html
  <tp-sql-notebook repository="./notebook/"></tp-sql-notebook>
  ```
:::

### Authoring

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive SQL viewers. Consecutive SQL scripts form one cell, so `tables.sql` and `query.sql` remain editable together.

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
  <script type="module" src="/path/to/components/sql-notebook/sql-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/sql-notebook/sql-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/sql-notebook/sql-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the sql notebook cells and inspect their outputs.

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
