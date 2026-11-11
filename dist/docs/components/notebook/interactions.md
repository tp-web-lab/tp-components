### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Edit mode opens the source editors for markup and programming cells. Use Preview to read the rendered notebook; returning to edit mode reopens the editors. |
| Using the component | In editor mode, select a block to move, duplicate or delete it. |
| Using the component | Preview displays the document; Export HTML saves an HTML version. |
| Using the component | In editor mode, select a block to move, duplicate, or delete it. |
| Using the component | Click the current language name to choose a language; the check marks the current choice. Choosing a language does not add a cell. |
| Using the component | In a language-specific notebook, this dropdown is replaced by a button showing the language icon, its name, and a plus sign. |
| Using the component | Markup blocks use their lite viewers, and programming blocks retain their complete interactive viewers. |
| Using the component | The `Files` dropdown next to the title loads notebook JSON, imports a previously exported HTML document, and provides `Save`, `Save as…`, and `Export HTML`. |
| Using the component | The `eye-outline` toggle replaces the cells with the final document directly inside the notebook; its icon becomes `pencil` to return to the cell editor. |
| Using the component | Preview and exported HTML turn markup blocks into rendered HTML, preserve interactive programming blocks, and remove the notebook editing controls. |
| Using the component | Exported HTML keeps non-executable notebook metadata so it can be imported again for editing. |
| :tp-icon:{name="file-settings" size="1.25em"} Files | Loads, saves, imports, or exports a notebook. HTML export includes rendered markup, TP styles and readable programming sources; interactive components still require access to their runtime. |
| Markup language name | Opens the language list; choosing an entry updates the current language without adding a cell. |
| :tp-icon:{name="plus" size="1.25em"} Markup + | Adds a markup cell in the selected language. |
| Programming language name (generic notebook) | Opens the programming language list with a check beside the current choice. |
| :tp-icon:{name="plus" size="1.25em"} Language + | Adds a programming cell; specialized notebooks use their fixed language. |
| :tp-icon:{name="arrow-up" size="1.25em"} :tp-icon:{name="arrow-down" size="1.25em"} Move up / Move down | Moves the selected cell. |
| :tp-icon:{name="content-copy" size="1.25em"} Duplicate | Duplicates the selected cell. |
| :tp-icon:{name="delete-outline" size="1.25em"} Delete | Deletes the selected cell. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the toolbar of the selected cell's code editor. |
| :tp-icon:{name="refresh" size="1.25em"} Reset | Restores the initially loaded notebook. |
| :tp-icon:{name="eye-outline" size="1.25em"} :tp-icon:{name="pencil" size="1.25em"} Preview / Edit | Toggles between the final rendered document and the cell editor. |
| :tp-icon:{name="play-all" size="1.25em"} Run all cells | Executes every programming cell in document order, in both edit and preview modes, including read-only notebooks. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
