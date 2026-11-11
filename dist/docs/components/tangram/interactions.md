### User interactions

The header shows the game icon and name on the left. Rounded controls appear on the right, in this order: Reset, Undo, Redo, Help, chronometer, Color, Theme and Fullscreen. Additional game commands remain below the header.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| :tp-icon:{name="refresh"} Reset | Restarts the arrangement and resets the timer. |
| :tp-icon:{name="undo"} Undo | Takes back the last move. |
| :tp-icon:{name="redo"} Redo | Replays the next undone move. Disabled when there is no recorded continuation. |
| :tp-icon:{name="help"} Help | Opens the dropdown of assistance actions specific to this game. |
| Help → Show all incorrect pieces / Hide incorrect pieces | Mark pieces that are not entirely inside the silhouette with a red dashed outline. Valid alternative dissections are accepted. |
| Help → Clear the incorrect pieces | Close any solution or piece preview, then return incorrect pieces around the silhouette, preserving their orientation and leaving correct pieces in place. Undo restores the previous arrangement. |
| Help → Show the piece | Reveal the selected piece’s position in the supplied solution without moving it. Select a piece first. |
| Help → Show the solution / Hide the solution | Show an isolated preview of the seven solution pieces, each used once. Playing pieces are temporarily hidden to avoid mixing the two arrangements. Hide the solution to resume the unchanged game. |
| Help → Rules of the game | Opens a drawer with the rules of this game. |
| Chronometer | Displays elapsed play time; starts with play and pauses on completion. Reset clears it. |
| :tp-icon:{name="palette-swatch"} Color | Changes the brand color of this game only. |
| :tp-icon:{name="sun"} :tp-icon:{name="moon"} Theme | Changes the light, dark or automatic theme of this game only. |
| :tp-icon:{name="fullscreen"} :tp-icon:{name="fullscreen-exit"} Fullscreen | Enters or leaves fullscreen for this game. |
| Drag a piece (mouse, pen or touch) | Place the piece anywhere, including incorrect positions and outside the silhouette. Only overlaps with other playing pieces are refused. Nearby vertices snap when this causes no overlap; the view expands if needed to keep every piece visible. |
| Select a piece | Show rotation and flip icons beside that piece. |
| Click outside the piece and its local controls | Close the local controls without moving or deselecting the piece. Select a piece again to reopen them. |
| :tp-icon:{name="rotate-right"} Rotate −45° / Rotate +45° | Rotate the selected piece around its center. Only rotations that overlap another playing piece are refused. |
| :tp-icon:{name="card-flip"} Flip | Reflect the selected parallelogram; available only for that piece. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focus toolbar buttons and individual pieces. Focusing a piece selects it. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a toolbar button | Activate the button. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> on a piece | Move by 0.05 units; <kbd>Shift</kbd> increases the step to 0.5 units. |
| <kbd>R</kbd> / <kbd>Shift</kbd>+<kbd>R</kbd> on a piece | Rotate by +45° / −45°. |
| <kbd>F</kbd> on the parallelogram | Reflect it. |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Undo / redo. <kbd>Command</kbd> is also supported. |
| <kbd>Arrow Up</kbd> / <kbd>Down</kbd>, <kbd>Home</kbd> / <kbd>End</kbd> in the assistance menu | Navigate menu items. <kbd>Enter</kbd> or <kbd>Space</kbd> activates an action; <kbd>Escape</kbd> closes the menu. |
| <kbd>Escape</kbd> | Close the selected piece’s local controls and cancel a drag; the browser also uses <kbd>Escape</kbd> to leave fullscreen. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
