<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="spreadsheet-editor" library="components" size="1.25em"></tp-icon> Spreadsheet editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-spreadsheet-editor>` element provides an editable spreadsheet with Excel-style formulas, file import and export, cell selection and resizable columns.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-spreadsheet-editor src="/docs/components/spreadsheet-editor/examples/budget.csv"></tp-spreadsheet-editor>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-spreadsheet-editor" src="/docs/components/spreadsheet-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-spreadsheet-editor></tp-spreadsheet-editor>
  ```

`src` attribute
: ```html
  <tp-spreadsheet-editor src="/docs/components/spreadsheet-editor/examples/budget.csv"></tp-spreadsheet-editor>
  ```

`value` attribute
: ```html
  <tp-spreadsheet-editor value='[[1,2,"=SUM(A1:B1)"]]'></tp-spreadsheet-editor>
  ```

imported file
: Use **File → Import** to load a CSV, JSON, or XLSX document.
:::

JSON imports accept a two-dimensional array or `{ "data": [[...]] }`. XLSX imports use the first worksheet and preserve formulas. Exported values retain formula error messages.

Cell values beginning with `=` are formulas. Cell references support relative (`B2`), absolute (`$B$2`) and mixed (`$B2`, `B$2`) notation, including ranges such as `=SUM($B$2:B$4)`. Dollar signs are preserved when importing or exporting formulas. Copying a cell with the toolbar or Ctrl/Cmd+C and pasting with the toolbar or Ctrl/Cmd+V shifts relative references by the source-to-destination offset. Absolute row or column markers remain fixed. Cutting moves the formula without shifting references. Clipboard text without a matching cell copied in the current page is pasted unchanged. A shifted reference before the first row or column becomes `#REF!`. References, ranges, arithmetic, comparisons, text concatenation and Formula.js functions are supported.

```html
<tp-spreadsheet-editor rows="20" columns="10" value='[[1,2,"=SUM(A1:B1)"]]'></tp-spreadsheet-editor>
```

Examples include `=A1*B1`, `=SUM(A1:A10)`, `=AVERAGE(B1:B5)`, `=IF(A1>10,"Yes","No")`, and `="Total: "&SUM(C1:C5)`.

Formula.js implements most, but not every, Microsoft Excel function. Date functions return JavaScript dates and may differ from Excel serial-date arithmetic.

Use `editor.exportFile("xlsx", "report", "values")` to export calculated values programmatically. The third argument defaults to `"formulas"`. JSON retains numbers and booleans; dates use ISO strings in CSV/JSON and date cells in XLSX.

### Configuration

Set `src` to a CSV, JSON or XLSX URL to load initial data. Relative URLs resolve against the document base URL; the filename extension selects the format (query strings and fragments are ignored). The first XLSX worksheet is used, including formulas. A successful load replaces `value` and adjusts the grid dimensions. Changing `src` loads a new file; removing it cancels pending loading and keeps the current data. Failed loads keep the current data and emit `tp-spreadsheet-editor-error` with `{ src, error }`. Successful loads emit the same `tp-spreadsheet-editor-import` event as the File menu.

```html
<tp-spreadsheet-editor src="data/budget.xlsx"></tp-spreadsheet-editor>
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
  <script type="module" src="/path/to/components/spreadsheet-editor/spreadsheet-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/spreadsheet-editor/spreadsheet-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/spreadsheet-editor/spreadsheet-editor.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit spreadsheet cells and inspect how the sheet presents the supplied data.

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
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-formula-picker
@summary Component `<tp-formula-picker>`.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-formula-picker>`](#/components/formula-picker/index.md) : Component `<tp-formula-picker>`.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit Formula.js https://formulajs.info/
@summary Excel-compatible formula functions.
-->
<!--
@credit SheetJS https://sheetjs.com/
@summary XLSX workbook import and export.
-->

- [Formula.js](https://formulajs.info/) : Excel-compatible formula functions.
- [SheetJS](https://sheetjs.com/) : XLSX workbook import and export.
<!-- tp-docgen:dependencies:end -->
