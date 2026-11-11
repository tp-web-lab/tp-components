<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="csv-table" library="components" size="1.25em"></tp-icon> CSV table

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-csv-table>` element creates an HTML table from CSV text or a CSV file.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-csv-table heading="">
  <script type="tp/csv-table">
    Country,Capital
    Estonia,Tallinn
    Latvia,Riga
    Lithuania,Vilnius
  </script>
</tp-csv-table>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-csv-table" src="/docs/components/csv-table/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-csv-table></tp-csv-table>
  ```

internal script
: ```html
  <tp-csv-table heading="">
    <script type="tp/csv-table">
      Country,Capital
      Estonia,Tallinn
      Latvia,Riga
      Lithuania,Vilnius
    </script>
  </tp-csv-table>
  ```

external file
: ```html
  <tp-csv-table src="/docs/components/csv-table/examples/initial-content.csv"></tp-csv-table>
  ```
:::

### Authoring

Supply CSV with `src`, an inert `tp/csv-table`, `tp/csv` or `tp/txt` script, or direct text. A nonempty `src` takes precedence over inline content. The shared [TpDeclarativeTextSource](../../../api/classes/utilities_declarative-text-source.TpDeclarativeTextSource.html) preserves the original source across updates. `separator` defaults to a comma and accepts one character; write `separator="\t"` for tabs. Quoted fields may contain separators and newlines; double a quote to escape it. Empty physical lines are ignored. Cell values are plain text: HTML in CSV is never executed. Empty, malformed or unavailable sources display a warning.

Add the boolean `heading` attribute to use the first row as column headings (`th scope="col"` in `thead`). Without it, all rows contain data cells. Boolean attributes are true when present and false when absent. Missing cells in shorter rows are padded with empty cells. Both components reuse the library’s native table styles.

### Programming notes

Change `heading` to update the header row. Changing `src` or `separator` renders the preserved source again. Updates are asynchronous; obsolete requests are cancelled.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the country and capital data converted from CSV. The first record supplies the column headings.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Quoted fields
: Read semicolon-separated records containing a separator, escaped quotes and a newline inside quoted cells.
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
