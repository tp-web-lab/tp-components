### User interactions

#### Mouse interactions

| Control | Result |
| --- | --- |
| Personal annotations | Open the annotation manager. |
| + | Keep the editor open and select an element in the document. The pointer becomes a crosshair and hovered paragraphs, headings and other selectable content receive a dotted outline. Selecting a target opens the note fields in the same panel. |
| Annotation language | In the header before Close, choose AsciiDoc, HTML, Markdown, reStructuredText or Plain text (default). Each menu entry has an icon and the selected entry has a check. The tp-icon-button trigger shows only the current language icon; the full name remains available in the menu and accessible description. Language and color settings are enabled while editing a note. |
| Annotation text | Write the source; the clear button empties the field. |
| Heading, color, opacity and rotation | Customize the note before saving. The tp-color palette button is in the header, between the language trigger and Close. The choice affects only this draft until Save, not the document's colors. Cancel discards it and Reset appearance defaults restores yellow. |
| Save / Cancel | Save locally or discard draft changes. |
| Pin | Open or fold a note; drag it to move its attachment within the selected document container. A drop outside this area restores the previous attachment. |
| Pencil / Delete | Edit or delete the chosen saved note. |
| Reattach | Choose a new target, including when the original target has disappeared. |

A post-it can only be repositioned inside the element selected as the editor's document container (`for` or `setTarget`). Its pin must be dropped on content inside that container, not elsewhere on the page. It may move between paragraphs within this area; the expanded note itself can overlap its edges.

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Navigate editor controls and document targets during selection. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate a focused button. <kbd>Enter</kbd> selects a focused document target. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> in the language dropdown | Navigate language choices; <kbd>Enter</kbd> selects one. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> on a pin or header | Move the note by 10 pixels, or 1 pixel with <kbd>Shift</kbd>. |
| <kbd>Escape</kbd> | Cancel target selection while keeping the editor open, or close the language dropdown. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the hovered or focused component. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
