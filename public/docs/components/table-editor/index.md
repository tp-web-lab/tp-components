<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="table-editor" library="components" size="1.25em"></tp-icon> Table editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-table-editor>` element builds and edits tables and exports them as markup, spreadsheet data or images.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-table-editor caption="Workshop schedule">
  <table>
    <thead><tr><th>Session</th><th>Duration (min)</th><th>Date</th><th>Formula</th></tr></thead>
    <tbody>
      <tr><td>Introduction</td><td data-type="number">20</td><td data-type="date">2026-11-14</td><td data-type="math">x^2 + y^2</td></tr>
      <tr><td>Practice</td><td data-type="number">40</td><td data-type="date">2026-11-15</td><td data-type="math">E = mc^2</td></tr>
    </tbody>
  </table>
</tp-table-editor>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-table-editor" src="/docs/components/table-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
empty grid
: ```html
  <tp-table-editor rows="4" columns="3"></tp-table-editor>
  ```

element content
: ```html
  <tp-table-editor>
    <table><tr><th>Item</th><th>Count</th></tr><tr><td>Books</td><td>3</td></tr></table>
  </tp-table-editor>
  ```

JavaScript data
: ```javascript
  const editor = document.createElement("tp-table-editor");
  editor.setData([["Item", "Count"], ["Books", "3"]]);
  document.body.append(editor);
  ```
:::

### Table structure

The toolbar keeps the title on the left and the editing commands on the right: Reset, Undo, Redo, then the **Insert or delete** dropdown (`plus-minus`), **Column alignment**, **Cell type** and **Save image**. Its entries insert a row or column before or after the selection, or delete the selected row or column. A vertical divider separates these commands from Color, Theme and Fullscreen.

The grid contains 1–100 rows and 1–30 columns. Select a cell before inserting or deleting a row or column: insertion takes place immediately after the selected cell. The **Heading** checkbox selects whether the first row contains column headings. It is checked by default unless `no-header` is present. An initial HTML table supplies its text, caption and first-row alignment; a `caption` attribute takes precedence over its caption. Cells store strings edited through text, number, date, time or math fields. They do not evaluate spreadsheet formulas or contain nested rich text. An initial HTML table may use `rowspan` and `colspan`; merged cells cannot cross the heading/body boundary.

The **+/−** menu starts with **Insert table** and **Delete table**. Delete the current table to enable the 6 × 6 size picker, then select a cell to create a new table with that number of rows and columns. Only one table can exist at a time. Undo and Redo also restore table creation and deletion.

Changing `rows` or `columns` resizes the grid and preserves the overlapping cells. Undo can restore removed values. `readonly` prevents interactive edits while still allowing format selection, copying and downloading.

Column widths are automatic until resized. Drag the trailing edge of a first-row cell to resize its column; double-click that edge to restore a width of 160 pixels. The minimum width is 128 pixels. Manual widths are preserved through edits, column insertion or deletion, undo and redo. They are available in `getData().columnWidths` and apply to the editing grid; exports retain their native layout. The table scrolls horizontally when wider than its container. Read-only tables cannot be resized.

The alignment icon opens a dropdown with **Left**, **Center** and **Right**, each shown with its `format-align-*` icon. The button follows the selected column’s alignment. Columns align left by default; a column containing numerical fields in its data rows aligns right automatically. An explicit alignment from the menu or the initial table takes precedence and is preserved when field types change.

### Merged cells

Click the first cell, then <kbd>Shift</kbd>+click the opposite corner to select a rectangle. Choose **Merge cells** in the **+/−** dropdown or the cell context menu. **Split cell** separates the merged cell under the pointer or the selected merged cell. The selection expands to include any existing merged cells it intersects. A merge cannot cross the heading/body boundary. With a cell focused, <kbd>Alt</kbd>+<kbd>Shift</kbd>+an arrow key extends the selection without editing its text.

Only the upper-left cell is displayed and edited while merged. Covered values, field types and mathematical notations remain stored and reappear after splitting; edits to the visible cell are retained. Undo/Redo restores both data and merges. Insertions inside a merged area extend it; deletions shrink it, and deleting its upper-left row or column removes that cell's value just like an ordinary deletion. Changing dimensions clips merges to the remaining grid. Enabling Heading separates a merge that would cross into the first data row. Reset restores the initial merges.

`mergeCells(startRow, startColumn, endRow, endColumn)` uses inclusive zero-based coordinates and returns whether the merge was applied. With no arguments it merges the current selection. `splitCell(row, column)` separates the region containing that cell; with no arguments it uses the selected cell. `getData().merges` contains `{ row, column, rowspan, colspan }` records alongside the complete underlying `cells` matrix. `setData(cells)` replaces the grid and clears its merges.

```javascript
const editor = document.querySelector("tp-table-editor");
editor.mergeCells(1, 0, 2, 1); // Two rows and two columns below the heading.
editor.splitCell(1, 0);       // Reveal the covered values and field types again.
```

### Cell types and context menu

Right-click any cell, or use <kbd>Shift</kbd>+<kbd>F10</kbd> while its field has focus. The context menu inserts a row or column **before** or **after** that cell, deletes its row or column, offers **Align left**, **Align center** and **Align right**, and provides a **Cell type** submenu. Dividers separate insertion, deletion, alignment and field types:

| Type | Editor | Stored value |
| --- | --- | --- |
| `text` | `tp-textfield` | Literal text; the default. |
| `number` | `tp-numberfield` | A numeric string. |
| `date` | `tp-datefield` | An ISO date, such as `2026-11-14`. |
| `time` | `tp-timefield` | A time, such as `09:30`. |
| `math` | `tp-mathfield` | Mathematical source, initially in LaTeX notation. |

The circular field-symbol button, to the right of **Column alignment**, opens the cell type menu for the selected cell. Its symbol follows the selected field type, which is checked in the menu. Each entry shows the field symbol between the check and the component name. Empty cells accept every type. A type change preserves compatible values. An incompatible value is cleared so the new field can be edited immediately; Undo restores both the original value and type. Types follow their cells through insertion, deletion, resizing, undo and redo. Newly inserted cells use text fields. The context menu is unavailable in read-only mode.

Set `data-type="number"` (or another type from the table) on an initial `td` or `th` to choose its editor. Invalid type names or incompatible initial values fall back to a text field. In JavaScript, `setCellType(row, column, type)` and `getCellType(row, column)` use zero-based indexes. `setCellType` returns `true` after applying the type; incompatible values are cleared with an undoable edit. `getData().cellTypes`, when present, contains the field types; `setData(cells)` starts with text fields. `addRow("before")` and `addColumn("before")` insert before the selected cell; their default is `"after"`.

Math cells export as formulas: `tp-math` in HTML and Markdown, `latexmath:[...]` or `asciimath:[...]` in AsciiDoc, and the `:math:` or `:asciimath:` role in reStructuredText. LaTeX expressions use `\( ... \)` (or `\[ ... \]` when the source already uses display delimiters). AsciiMath in a LaTeX export uses `\wcTpMath` with its literal source. The notation selected in the math field is preserved through structural edits, undo and redo; authored math cells can set `data-math-mode="asciimath"`. Spreadsheet exports still use text cells and images show mathematical source text.

### Export formats

| Format | Table syntax | Notes |
| --- | --- | --- |
| HTML | `table`, `thead`, `tbody`, `th`, `td` | Caption, alignment, `rowspan` and `colspan` are preserved. Cell text is escaped. |
| Markdown | Pipe table | A headerless table receives an empty heading row; captions use `[caption]` below the table. MultiMarkdown uses repeated pipes for column spans and `^^` for row spans. |
| AsciiDoc | `|===` table | Caption, headings and alignment are preserved; `columns.rows+` expresses merged cells. |
| reStructuredText | `list-table`, or a grid table for merges | Caption and headings are preserved; column alignment is not represented. A header-only table receives an empty body row. |
| LaTeX | `tabular`, or `\wcTable` for merges | Ordinary tables use `tabular` and `\caption`. Merged tables use the `tp-latex` commands `\wcTable`, `\wcTr`, `\wcTh` and `\wcTd` with span attributes. |

Markup exports preserve the visible table. Covered contents remain in the editor but are omitted from markup and images. Merged LaTeX tables use `tp-latex` element commands because its `tabular` parser does not support row or column spanning commands. Ordinary cell values are escaped as literal text; math cells use the formula syntax described above. `getMarkup(format)` returns the source; `getData()` returns a copy of the cells, field types, mathematical notations, caption, header flag and alignments. `setData(cells)` replaces the grid and pads shorter rows. The `tp-table-editor-change` event supplies `{ data, markup }` after edits, undo, redo and reset.

### Spreadsheet and image exports

The **tp-asciidoc**, **html**, **tp-latex**, **tp-markdown** and **tp-restructuredtext** tabs select the markup language. Each contains **Code** and **Render** tabs. **Code** shows the generated source with syntax highlighting on a dark background and a **Save as** button. **Render** previews the table and updates after edits; its **Screen preview** button opens the table alone at selectable device sizes with the editor’s color and theme. Renderers load when their preview is opened.

Below these tabs, the **Spreadsheet** disclosure is closed by default. Open it to inspect **csv**, **json** or **xlsx**. The XLSX tab displays `xl/worksheets/sheet1.xml`, extracted from the generated workbook; its save button downloads the complete `.xlsx` file, not the XML alone. Spreadsheet sources load on demand and reflect the current table.

Each code panel has its own save button. It opens the native save dialog when available; otherwise, it asks for a filename before downloading. Cancelling saves nothing. The copy button appears when hovering over the source. The toolbar’s **Save image** control uses `tp-save-image` and offers SVG, PNG and WebP.

CSV, JSON and XLSX contain all cell strings, including the heading row. JSON is an array of row arrays. XLSX uses one worksheet named **Table**, with text cells rather than formulas or inferred numbers; leading zeros are preserved. XLSX preserves merge ranges and the underlying cell strings. CSV and JSON remain plain rectangular grids containing all values, including covered cells. These data formats omit the caption and visual formatting. `download()` and `downloadSpreadsheet("csv" | "json" | "xlsx")` perform the same Save as operations from JavaScript and return promises.

Images include the caption below the table, column alignment and the current colors. Column widths are calculated to fit the text; exports contain the complete table, including columns outside the scrollable area. `exportSvg()` returns the standalone SVG source. Raster formats use the same drawing through `tp-save-image`.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/table-editor/table-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/table-editor/table-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/table-editor/table-editor.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the workshop schedule, insert a row or column, then export markup, spreadsheet data or an image.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Typed cells
: Edit numbers, dates, times and mathematical source with their TP fields. Right-click a cell to change its type or insert a row or column before or after it.

Empty table
: Fill the empty four-row, three-column grid, then inspect the generated markup.

Headerless table
: Export ordinary data without column headings. Switch to Markdown to observe the empty heading row required by pipe tables.

Read-only exports
: Export markup, spreadsheet data or images from a table whose contents cannot be edited interactively.
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
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-checkbox-list
@summary Transforms a list into a group of checkboxes.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-contextmenu
@summary Accessible context menu built from a nested list.
-->
<!--
@tp-dependency tp-datefield
@summary Native date field with labels, constraints, picker access, and clearing.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-mathfield
@summary Mathematical expression field with live LaTeX or AsciiMath rendering.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-numberfield
@summary Numeric field with an optional native range slider.
-->
<!--
@tp-dependency tp-save-image
@summary Downloads an anchored image as SVG, PNG or WebP.
-->
<!--
@tp-dependency tp-screen
@summary Responsive page preview in selectable device viewports.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-timefield
@summary Native time field with labels, constraints, picker access, and clearing.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-checkbox-list>`](#/components/checkbox-list/index.md) : Transforms a list into a group of checkboxes.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-contextmenu>`](#/components/contextmenu/index.md) : Accessible context menu built from a nested list.
- [`<tp-datefield>`](#/components/datefield/index.md) : Native date field with labels, constraints, picker access, and clearing.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-mathfield>`](#/components/mathfield/index.md) : Mathematical expression field with live LaTeX or AsciiMath rendering.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-numberfield>`](#/components/numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-save-image>`](#/components/save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.
- [`<tp-screen>`](#/components/screen/index.md) : Responsive page preview in selectable device viewports.
- [`<tp-tabs>`](#/components/tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-timefield>`](#/components/timefield/index.md) : Native time field with labels, constraints, picker access, and clearing.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit SheetJS https://sheetjs.com/
@summary XLSX workbook import and export.
-->

- [SheetJS](https://sheetjs.com/) : XLSX workbook import and export.

### See also

- [`<tp-prose-editor>`](#/components/prose-editor/index.md) : Edits tables as part of rich-text documents.
- [`<tp-spreadsheet-editor>`](#/components/spreadsheet-editor/index.md) : Edits spreadsheet data and formulas.
<!-- tp-docgen:dependencies:end -->
