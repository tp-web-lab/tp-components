# <tp-icon name="list-table" library="components" size="1.25em"></tp-icon> List table

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-list-table>` element implements the List table functionality: creates an HTML table from ordered or unordered lists while preserving cell content.

<tp-list-table heading>
  <ul>
    <li><ul><li>Country</li><li>Capital</li></ul></li>
    <li><ul><li>Estonia</li><li>Tallinn</li></ul></li>
    <li><ul><li>Latvia</li><li>Riga</li></ul></li>
    <li><ul><li>Lithuania</li><li>Vilnius</li></ul></li>
  </ul>
</tp-list-table>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Table | Read and select the cell content. Wide tables can be scrolled horizontally. |
| Embedded controls | Use the controls normally; conversion preserves their content and event listeners. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Table | No table-specific keyboard shortcut. Embedded links and controls retain their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Supply one `ul` or `ol`. Each direct list item represents a row; a nested `ul` or `ol` supplies its cells. Mix ordered and unordered lists freely. A simple list produces one column. Cell content, including images and existing `tp-*` controls, is moved into the table without cloning. Keep each row limited to its cell list. The list is captured at initialization; recreate the component to replace its source structure.

Add the boolean `heading` attribute to use the first row as column headings (`th scope="col"` in `thead`). Without it, all rows contain data cells. Boolean attributes are true when present and false when absent. Missing cells in shorter rows are padded with empty cells. Both components reuse the library’s native table styles.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the country and capital data converted from nested lists. Each outer item is a row and each inner item is a cell.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Single column
: Compare a simple ordered list with its one-column table. The first item becomes the heading.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

Change `heading` to update the header row.

### API

<!-- tp-docgen:api TpListTable -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>heading</code> | <code>boolean</code> | <code>false</code> | Uses the first row as column headings. |
  [Attributes of `<tp-list-table>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpListTable`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-list-table>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-list-table>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_list-table.TpListTable.html)
<!-- tp-docgen:typedoc:end -->




































































































































### Imports

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



<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-list-table>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
