<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="list-table" library="components" size="1.25em"></tp-icon> List table

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-list-table>` element displays structured list content as a table.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-list-table heading="">
  <ul>
    <li><ul><li>Country</li><li>Capital</li></ul></li>
    <li><ul><li>Estonia</li><li>Tallinn</li></ul></li>
    <li><ul><li>Latvia</li><li>Riga</li></ul></li>
    <li><ul><li>Lithuania</li><li>Vilnius</li></ul></li>
  </ul>
</tp-list-table>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-list-table" src="/docs/components/list-table/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Supply one `ul` or `ol`. Each direct list item represents a row; a nested `ul` or `ol` supplies its cells. Mix ordered and unordered lists freely. A simple list produces one column. Cell content, including images and existing `tp-*` controls, is moved into the table without cloning. Keep each row limited to its cell list. The list is captured at initialization; recreate the component to replace its source structure.

Add the boolean `heading` attribute to use the first row as column headings (`th scope="col"` in `thead`). Without it, all rows contain data cells. Boolean attributes are true when present and false when absent. Missing cells in shorter rows are padded with empty cells. Both components reuse the library’s native table styles.

### Programming notes

Change `heading` to update the header row.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/list-table/list-table.js"></script>
  ```

import
: ```js
  import "/path/to/components/list-table/list-table.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/list-table/list-table.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the country and capital data converted from nested lists. Each outer item is a row and each inner item is a cell.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Single column
: Compare a simple ordered list with its one-column table. The first item becomes the heading.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
