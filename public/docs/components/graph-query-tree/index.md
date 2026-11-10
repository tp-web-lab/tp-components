<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="graph-query-tree" library="components" size="1.25em"></tp-icon> Relational query trees

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-graph-query-tree>` element edits relational algebra trees and generates equivalent SQL.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-graph-query-tree grid="" grid-size="20" message="Select an operator to edit its relational expression." src="/docs/components/graph-query-tree/examples/employees-departments.json"></tp-graph-query-tree>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-graph-query-tree" src="/docs/components/graph-query-tree/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-graph-query-tree>` as shown below.

```html
<tp-graph-query-tree grid grid-size="20" message="Select an operator to edit its relational expression." src="/docs/components/graph-query-tree/examples/employees-departments.json"></tp-graph-query-tree>
```

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/graph-query-tree/graph-query-tree.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-query-tree/graph-query-tree.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-query-tree/graph-query-tree.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied query tree and try the simulator’s available controls.

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
@tp-dependency tp-graph-editor
@summary Extensible interactive graph editor.
-->

- [`<tp-graph-editor>`](#/components/graph-editor/index.md) : Extensible interactive graph editor.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
