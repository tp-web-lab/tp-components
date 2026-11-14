### User interactions

#### Mouse interactions

| Control or gesture | Result | Shortcut |
| --- | --- | --- |
| Drag a column boundary in the first row | Resize that column; Undo restores its previous width. | |
| Double-click a column boundary | Restore a width of 160 pixels. | |
| Right-click a cell | Open its context menu and select its row and column. | |
| Cell menu → :tp-icon:{name="table-row-plus-before"} Insert row before / :tp-icon:{name="table-row-plus-after"} Insert row after | Insert a text row on the chosen side of the cell. | — |
| Cell menu → :tp-icon:{name="table-column-plus-before"} Insert column before / :tp-icon:{name="table-column-plus-after"} Insert column after | Insert a text column on the chosen side of the cell. | — |
| Cell menu → :tp-icon:{name="table-row-remove"} Delete row / :tp-icon:{name="table-column-remove"} Delete column | Remove the cell’s row or column, preserving at least one of each. | — |
| Cell menu → :tp-icon:{name="format-align-left"} Align left / :tp-icon:{name="format-align-center"} Align center / :tp-icon:{name="format-align-right"} Align right | Align the selected column; the current alignment is checked. | — |
| Cell menu → :tp-icon:{name="symbol"} Cell type → tp-textfield / tp-numberfield / tp-datefield / tp-timefield / tp-mathfield | Choose the cell’s editor; incompatible values are cleared and can be restored with Undo. | — |
| <kbd>Shift</kbd>+click another cell | Select a rectangular area from the current cell; existing merged regions are included in full. | |
| :tp-icon:{name="table-merge-cells"} Merge cells (+/− or cell menu) | Merge the selected rectangle, showing its upper-left cell and preserving all covered contents. Unavailable for a single cell or across the heading boundary. | |
| :tp-icon:{name="table-split-cell"} Split cell (+/− or cell menu) | Separate the selected merged cell and reveal its preserved contents and field types. | |
| Click a cell | Select its row and column, and edit its text. | |
| :tp-icon:{name="refresh"} Reset | Restore the initial table; Undo can reverse the reset. | — |
| :tp-icon:{name="undo"} Undo | Restore the preceding table state. | — |
| :tp-icon:{name="redo"} Redo | Reapply an undone edit. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-settings"} Insert table | When no table exists, choose its dimensions in the grid to create it. Disabled while a table exists. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-remove"} Delete table | Remove the complete table; Undo restores it. Disabled when no table exists. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-row-plus-before"} Insert row before | Insert an empty row before the selected row. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-row-plus-after"} Insert row after | Insert an empty row after the selected row. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-column-plus-before"} Insert column before | Insert an empty column before the selected column. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-column-plus-after"} Insert column after | Insert an empty column after the selected column. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-row-remove"} Delete row | Remove the selected row; keep at least one row. | — |
| :tp-icon:{name="plus-minus"} Insert or delete → :tp-icon:{name="table-column-remove"} Delete column | Remove the selected column; keep at least one column. | — |
| Caption | Edit the table caption. | |
| Heading | Check to use the first row as column headings; uncheck to use it as ordinary data. | |
| Cell type (field symbol) → tp-textfield / tp-numberfield / tp-datefield / tp-timefield / tp-mathfield | Change the selected cell’s editor; Undo restores its previous value and type. | — |
| :tp-icon:{name="format-align-left"} Column alignment → :tp-icon:{name="format-align-left"} Left / :tp-icon:{name="format-align-center"} Center / :tp-icon:{name="format-align-right"} Right | Align the selected column to the left, center or right. | |
| tp-asciidoc / html / tp-latex / tp-markdown / tp-restructuredtext | Select a markup language; each language has its own Code and Render tabs. | |
| :tp-icon:{name="screen" library="components"} Screen preview (Render tab) | Preview only the rendered table at phone, tablet, laptop or desktop dimensions, with the editor’s color and theme. | — |
| Code / Render | Switch between the generated source and its rendered table in the selected language. | |
| :tp-icon:{name="copy"} Copy code (Code tab) | Copy the displayed source; if clipboard access is unavailable, select and copy the source manually. | — |
| :tp-icon:{name="file-upload"} Save as (code panels) | Choose a filename and save the displayed format. In XLSX, save the complete workbook. Cancel to save nothing. | — |
| Spreadsheet | Expand or collapse the CSV, JSON and XLSX source tabs; initially closed. | |
| csv / json / xlsx | Inspect the current table as CSV, JSON or worksheet XML. | |
| :tp-icon:{name="image-download"} Save image → SVG / PNG / WebP | Save the complete table and its caption as an image in the current colors. | — |
| :tp-icon:{name="palette-swatch"} Color | Change the brand color within the editor. | — |
| :tp-icon:{name="theme-light-dark"} Theme | Change the editor's light, dark or automatic theme. | — |
| :tp-icon:{name="fullscreen"} Fullscreen | Enter or leave fullscreen for the editor. | — |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>←</kbd> / <kbd>→</kbd> on a column boundary | Adjust the column width by 8 pixels. |
| <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd> / <kbd>→</kbd> / <kbd>↑</kbd> / <kbd>↓</kbd> in a cell | Extend the rectangular selection. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between cells and controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate a focused button. |
| <kbd>↑</kbd> / <kbd>↓</kbd> in a menu | Move between table commands, cell types or alignments; <kbd>Enter</kbd> selects the focused item. |
| <kbd>Shift</kbd>+<kbd>F10</kbd> / <kbd>Context Menu</kbd> | Open the focused cell’s context menu. |
| <kbd>→</kbd> / <kbd>←</kbd> in the cell menu | Open or close the Cell type submenu. |
| <kbd>←</kbd> / <kbd>→</kbd> on a tab | Select the preceding or following tab in the same group. |
| <kbd>Escape</kbd> | Close an open dropdown. |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Cmd</kbd>+<kbd>Z</kbd> | Undo a table edit. |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> / <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> | Redo a table edit. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component; <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component in the containing hierarchy and open its User help. |
