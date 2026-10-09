# <tp-icon name="csv-table" library="components" size="1.25em"></tp-icon> CSV table

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-csv-table>` element implements the CSV table functionality: creates an HTML table from CSV text or a CSV file.

<tp-csv-table heading>
  <script type="tp/csv-table">
    Country,Capital
    Estonia,Tallinn
    Latvia,Riga
    Lithuania,Vilnius
  </script>
</tp-csv-table>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Table | Read and select the cell content. Wide tables can be scrolled horizontally. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Table | No table-specific keyboard shortcut. Embedded links and controls retain their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Supply CSV with `src`, an inert `tp/csv-table`, `tp/csv` or `tp/txt` script, or direct text. A nonempty `src` takes precedence over inline content. The shared [TpDeclarativeTextSource](../../../api/classes/utilities_declarative-text-source.TpDeclarativeTextSource.html) preserves the original source across updates. `separator` defaults to a comma and accepts one character; write `separator="\t"` for tabs. Quoted fields may contain separators and newlines; double a quote to escape it. Empty physical lines are ignored. Cell values are plain text: HTML in CSV is never executed. Empty, malformed or unavailable sources display a warning.

Add the boolean `heading` attribute to use the first row as column headings (`th scope="col"` in `thead`). Without it, all rows contain data cells. Boolean attributes are true when present and false when absent. Missing cells in shorter rows are padded with empty cells. Both components reuse the library’s native table styles.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the country and capital data converted from CSV. The first record supplies the column headings.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Quoted fields
: Read semicolon-separated records containing a separator, escaped quotes and a newline inside quoted cells.
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

Change `heading` to update the header row. Changing `src` or `separator` renders the preserved source again. Updates are asynchronous; obsolete requests are cancelled.

### API

<!-- tp-docgen:api TpCsvTable -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>heading</code> | <code>boolean</code> | <code>false</code> | Uses the first row as column headings. |
  | <code>separator</code> | <code>string</code> | <code>&quot;,&quot;</code> | One-character field separator; use \t for a tab. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | CSV file URL; takes precedence over inline source. |
  [Attributes of `<tp-csv-table>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCsvTable`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-csv-table>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-csv-table>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_csv-table.TpCsvTable.html)
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
  <script type="module" src="/path/to/components/csv-table/csv-table.js"></script>
  ```

import
: ```js
  import "/path/to/components/csv-table/csv-table.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/csv-table/csv-table.js";
  ```
:::



<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-csv-table>` are loaded automatically by this component if they have not already been loaded by another component.

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
