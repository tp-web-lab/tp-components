### User interactions

Use F1 while the editor is focused to show or hide its toolbar. Mod means ⌘ on macOS and Ctrl elsewhere; Shift and Alt are shown as ⇧ and ⌥ on macOS.

In read-only mode, the palette omits editing commands: Undo, Redo, Cut, Paste, Indent, Dedent, Replace, Toggle line comment and Toggle block comment. Reading, selection, copying and navigation remain available.

#### Mouse interactions

| Control or gesture | Result | Shortcut |
| --- | --- | --- |
| Editor text | Click to place the cursor; drag to select text. Editing does not execute the code. |  |
| Numbered comment marker, when linked to tp-code-comment | Hover to read its formatted explanation in a tooltip. |  |
| Keyboard button | Open or close the command palette listed below. | Mod Shift P |
| Copy code button | Copy the entire editor content, unlike Copy in the palette, which copies the selection. | — |
| Theme button | Choose light, dark or automatic appearance for this editor. | — |
| Fullscreen button | Enter or leave fullscreen for this editor. | — |
| Language badge / line and column | Display the current language and cursor position; these are indicators, not buttons. |  |
| Palette: Undo | Reverts the last editor change. | Mod Z |
| Palette: Redo | Reapplies the last reverted editor change. | Mod Shift Z |
| Palette: Copy | Copies the current selection. | Mod C |
| Palette: Cut | Cuts the current selection. | Mod X |
| Palette: Paste | Pastes clipboard text at the current selection. | Mod V |
| Palette: Select all | Selects the whole editor content. | Mod A |
| Palette: Fold code | Folds the current foldable code block. | Mod Alt ↓ |
| Palette: Unfold code | Unfolds the current folded code block. | Mod Alt ↑ |
| Palette: Toggle gutters | Shows or hides the fold gutter. | Mod Alt G |
| Palette: Toggle line numbers | Shows or hides line numbers. | Mod Alt L |
| Palette: Indent | Indents the current line or selection. | Tab |
| Palette: Dedent | Dedents the current line or selection. | Shift Tab |
| Palette: Search | Opens the search panel. | Mod F |
| Palette: Replace | Opens search and runs replace-next. | Mod Alt F |
| Palette: Go to line | Opens the go-to-line prompt. | Mod G |
| Palette: Toggle line comment | Toggles line comments for the current line or selection. | Mod Alt C |
| Palette: Toggle block comment | Toggles block comments for the current selection. | Mod Alt B |
| Palette: Toggle Command Palette | Opens or closes the command palette. | Mod Shift P |
| Palette: Toggle toolbar | Opens or closes the toolbar. | F1 |
| Clipboard permission | Paste may require browser permission. Read-only content cannot be edited. |  |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Typing and cursor movement | Edit text and move the insertion point in the focused editor. Editing is unavailable in read-only mode. |
| <kbd>Mod</kbd>+<kbd>Z</kbd> | Reverts the last editor change. |
| <kbd>Mod</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Reapplies the last reverted editor change. |
| <kbd>Mod</kbd>+<kbd>C</kbd> | Copies the current selection. |
| <kbd>Mod</kbd>+<kbd>X</kbd> | Cuts the current selection. |
| <kbd>Mod</kbd>+<kbd>V</kbd> | Pastes clipboard text at the current selection. |
| <kbd>Mod</kbd>+<kbd>A</kbd> | Selects the whole editor content. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>↓</kbd> | Folds the current foldable code block. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>↑</kbd> | Unfolds the current folded code block. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> | Shows or hides the fold gutter. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd> | Shows or hides line numbers. |
| Focus in readonly mode | The code remains keyboard-focusable for reading, selection and scrolling. |
| <kbd>Tab</kbd> | Indents the current line or selection. |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | Dedents the current line or selection. |
| <kbd>Mod</kbd>+<kbd>F</kbd> | Opens the search panel. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> | Open the search and replacement panel. |
| <kbd>Mod</kbd>+<kbd>G</kbd> | Opens the go-to-line prompt. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd> | Toggles line comments for the current line or selection. |
| <kbd>Mod</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> | Toggles block comments for the current selection. |
| <kbd>Mod</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> | Opens or closes the command palette. |
| <kbd>F1</kbd> | Opens or closes the toolbar. |
| <kbd>Up</kbd> / <kbd>Down</kbd> in the open palette | Move between commands. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> in the open palette | Activate the focused command. |
| <kbd>Escape</kbd> in the open palette | Close the palette. |
| Focus a numbered comment marker / <kbd>Escape</kbd> | Show its explanation / close the tooltip without changing the code. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
