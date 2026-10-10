# <tp-icon name="spreadsheet-editor" library="components" size="1.25em"></tp-icon> Spreadsheet editor

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-spreadsheet-editor>` element provides an editable spreadsheet with Excel-style formulas, file import and export, cell selection and resizable columns.

<tp-spreadsheet-editor src="/docs/components/spreadsheet-editor/examples/budget.csv"></tp-spreadsheet-editor>

## Usage

Set `src` to a CSV, JSON or XLSX URL to load initial data. Relative URLs resolve against the document base URL; the filename extension selects the format (query strings and fragments are ignored). The first XLSX worksheet is used, including formulas. A successful load replaces `value` and adjusts the grid dimensions. Changing `src` loads a new file; removing it cancels pending loading and keeps the current data. Failed loads keep the current data and emit `tp-spreadsheet-editor-error` with `{ src, error }`. Successful loads emit the same `tp-spreadsheet-editor-import` event as the File menu.

```html
<tp-spreadsheet-editor src="data/budget.xlsx"></tp-spreadsheet-editor>
```

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Click a cell | Select the active cell and edit its content. The formula bar displays its raw value or formula. |
| Shift + click a cell | Select the rectangle from the selection anchor to the clicked cell. A plain click starts a new selection. |
| Clear selected cells | Clear selected values and formulas while preserving formatting. Undo restores the operation in one step. |
| Drag the right edge of a column heading | Resize the column, with a minimum of 48 pixels and no upper limit. Wide sheets scroll horizontally; widths survive cell edits and formatting changes. |
| Double-click a column resize handle | Restore the default width of 112 pixels. |
| File → Import | Load a CSV, JSON or XLSX file. |
| File → Export CSV / JSON / XLSX — formulas | Save the sheet with its raw formulas. |
| File → Export CSV / JSON / XLSX — values | Save calculated results without changing formulas in the open sheet. |
| Formula picker | Choose a function and replace the selected parameters in the formula bar. |
| Format | Set General, Number, Currency, Percent or Date display for the active cell. |
| Cell style | Toggle Bold, Italic, Underline or Strikethrough for the active cell. |
| Clear formatting | Remove number and text formatting from the active cell. |
| Table | Insert a row or column before or after the active cell, or delete its row or column. At least one row and column remain. |
| Undo / Redo | Undo or redo cell edits, grouped clearing and structural changes. |
| Copy / Cut / Paste | Use the system clipboard with the active cell. Copying shifts relative formula references when pasted; cutting preserves the formula. These actions operate on one cell, even when a range is selected. |
| Search / Close search | Highlight matching cells, or clear the search and hide its field. |
| Fullscreen | Toggle fullscreen for this spreadsheet. |
| Color / Theme | Change the spreadsheet's local brand color or theme. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Left / Right on a focused column resize handle | Decrease / increase column width by 8 pixels. Reach handles with Tab. |
| Ctrl/Cmd+C / X / V in a cell | Copy, cut or paste the active cell. Copying shifts relative formula references when pasted; cutting preserves them. |
| Shift + Arrow keys | Extend or shrink the rectangular selection. |
| Delete / Backspace with multiple cells selected | Clear the selected cells in one undoable operation. With one cell selected, edit its text normally. |
| Escape | Collapse the selection to the focused cell. |
| Typing in a selected cell | Edit its value or enter a formula beginning with =. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

#### Initial spreadsheet content

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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit spreadsheet cells and inspect how the sheet presents the supplied data.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpSpreadsheetEditor -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>columns</code> | <code>number</code> | <code>10</code> | Number of columns (`10` by default). |
  | <code>rows</code> | <code>number</code> | <code>20</code> | Number of rows (`20` by default). |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | CSV, JSON or XLSX file URL loaded on connection and whenever it changes. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON-encoded two-dimensional array of raw cell values. |
  [Attributes of `<tp-spreadsheet-editor>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>deleteColumn</code> | <code>deleteColumn(): void</code> | Deletes column. |
  | <code>deleteRow</code> | <code>deleteRow(): void</code> | Deletes row. |
  | <code>exportFile</code> | <code>exportFile(format: TpSpreadsheetFileFormat, filename = &quot;spreadsheet&quot;, mode: TpSpreadsheetExportMode = &quot;formulas&quot;): void</code> | Exports file. |
  | <code>getData</code> | <code>getData(): string[][]</code> | Returns data. |
  | <code>importFile</code> | <code>importFile(file: File): Promise&lt;void&gt;</code> | Imports file. |
  | <code>insertColumn</code> | <code>insertColumn(position: &quot;before&quot; \| &quot;after&quot; = &quot;after&quot;): void</code> | Inserts column. |
  | <code>insertRow</code> | <code>insertRow(position: &quot;before&quot; \| &quot;after&quot; = &quot;after&quot;): void</code> | Inserts row. |
  | <code>setData</code> | <code>setData(value: readonly (readonly unknown[])[]): void</code> | Sets data. |
  [Public methods of `TpSpreadsheetEditor`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-spreadsheet-editor-clipboard-error</code> | <code>&#123; command: unknown &#125;</code> | Emitted when spreadsheet editor clipboard error occurs. |
  | <code>tp-spreadsheet-editor-error</code> | <code>&#123; src: unknown; error: unknown &#125;</code> | Emitted when loading src fails; detail contains src and error. |
  | <code>tp-spreadsheet-editor-export</code> | <code>&#123; format: unknown; filename: string &#125;</code> | Emitted after a file is exported. |
  | <code>tp-spreadsheet-editor-import</code> | <code>&#123; format: unknown; file: unknown &#125;</code> | Emitted after a file is imported. |
  | <code>tp-spreadsheet-editor-input</code> | <code>&#123; cell: unknown; raw: unknown; value: string &#125;</code> | Emitted whenever a cell changes. |
  | <code>tp-spreadsheet-editor-structure</code> | <code>&#123; action: unknown; index: unknown; rows: unknown; columns: unknown &#125;</code> | Emitted after rows or columns change. |
  [Events emitted by `<tp-spreadsheet-editor>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-spreadsheet-editor>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_spreadsheet-editor.TpSpreadsheetEditor.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-spreadsheet-editor>` are loaded automatically by this component if they have not already been loaded by another component.

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
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-formula-picker
@summary Selects an Excel-compatible Formula.js function.  *
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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-formula-picker>`](../formula-picker/index.md) : Selects an Excel-compatible Formula.js function. *
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-menu>`](../menu/index.md) : Accessible menu component.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,

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
