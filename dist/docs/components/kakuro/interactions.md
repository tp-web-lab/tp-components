### User interactions

The header shows the game icon and name on the left. Rounded controls appear on the right, in this order: Reset, Undo, Redo, Help, chronometer, Color, Theme and Fullscreen. Additional game commands remain below the header.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| :tp-icon:{name="refresh"} Reset | Restores the loaded position or puzzle and resets the timer. |
| :tp-icon:{name="undo"} Undo | Takes back the last move. |
| :tp-icon:{name="redo"} Redo | Replays the next undone move. Disabled when there is no recorded continuation. |
| :tp-icon:{name="help"} Help | Opens the dropdown of assistance actions specific to this game. |
| Help → Check | Shows or hides conflicting entries. |
| Help → Reveal cell | Reveals the selected cell, or the first empty cell. |
| Help → Reveal solution | Fills the solution. |
| Help → Rules of the game | Opens a drawer with the rules of this game. |
| Chronometer | Displays elapsed play time; starts with play and pauses on completion. Reset clears it. |
| :tp-icon:{name="palette-swatch"} Color | Changes the brand color of this game only. |
| :tp-icon:{name="sun"} :tp-icon:{name="moon"} Theme | Changes the light, dark or automatic theme of this game only. |
| :tp-icon:{name="fullscreen"} :tp-icon:{name="fullscreen-exit"} Fullscreen | Enters or leaves fullscreen for this game. |
| Select a white cell | Selects the cell and highlights its across and down runs. Fixed digits remain read-only. |
| Game / Note | Shows the current entry mode. Game enters a cell value; Note adds or removes a candidate digit. Click to switch modes. |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through controls and white cells. |
| Arrow keys | Moves to the next white cell in the chosen direction, skipping blocked cells. |
| <kbd>1</kbd>–<kbd>9</kbd> | Enters a digit or toggles a note in the selected editable cell. |
| <kbd>Backspace</kbd> / <kbd>Delete</kbd> / <kbd>0</kbd> | Clears the selected editable cell and its notes. |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd> | Undoes or redoes a move while a cell is focused. <kbd>Command</kbd> is also accepted; <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> redoes. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused action button. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Opens User help for the component under the pointer, falling back to focus. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Opens contextual component documentation. |
