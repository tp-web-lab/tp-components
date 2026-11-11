### User interactions

The header shows the game icon and name on the left. Rounded controls appear on the right, in this order: Reset, Undo, Redo, Help, chronometer, Color, Theme and Fullscreen. Additional game commands remain below the header.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| :tp-icon:{name="refresh"} Reset | Restores the loaded position or puzzle and resets the timer. |
| :tp-icon:{name="undo"} Undo | Takes back the last move. |
| :tp-icon:{name="redo"} Redo | Replays the next undone move. Disabled when there is no recorded continuation. |
| :tp-icon:{name="help"} Help | Opens the dropdown of assistance actions specific to this game. |
| Help → Highlight all legal destinations | Marks the final landing squares of complete legal capture sequences or moves. |
| Help → Play one random legal move | Pauses and replays the next recorded turn, or chooses a random legal turn at the end of history. |
| Help → Rules of the game | Opens a drawer with the rules of this game. |
| Chronometer | Displays elapsed play time; starts with play and pauses on completion. Reset clears it. |
| :tp-icon:{name="palette-swatch"} Color | Changes the brand color of this game only. |
| :tp-icon:{name="sun"} :tp-icon:{name="moon"} Theme | Changes the light, dark or automatic theme of this game only. |
| :tp-icon:{name="fullscreen"} :tp-icon:{name="fullscreen-exit"} Fullscreen | Enters or leaves fullscreen for this game. |
| Click a movable piece, then a marked square | Plays that legal move for the active side when human moves are enabled. If a capture ends on its origin, selecting that square plays the sequence; otherwise click the selected piece again to cancel. |
| Drag a movable piece | Moves it to a legal destination with mouse, pen or touch. An illegal drop leaves the position unchanged. |
| Choose capture path | Selects the full sequence when several legal capture routes share a destination. |
| :tp-icon:{name="chevron-left-first"} Back to beginning | Pauses and returns to the loaded starting position while keeping recorded moves for replay. |
| :tp-icon:{name="previous"} Previous move | Pauses and takes back one move, restoring every captured piece. |
| :tp-icon:{name="next"} Play one move | Pauses and replays the next recorded move, or chooses one random legal move if no recorded move remains. |
| :tp-icon:{name="play"} Play to end | Replays recorded moves and continues with random legal moves every two seconds until the game ends or Pause is pressed. |
| :tp-icon:{name="pause"} Pause | Pauses automatic play without discarding recorded moves. |
| Start | Loads the classical starting position with twenty men per side. |
| Flip | Displays the other side at the bottom without changing the turn. |
| Play vs random | Plays the side currently at the bottom against random legal replies. Enables human moves. |
| Random vs random | Automatically plays random legal moves for both sides. |
| Stop | Stops automatic play and preserves the current board. |
| Clear | Removes all pieces and stops automatic play. |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between the toolbar, board and available capture-path choices. |
| Arrow keys | Moves focus to the next playable square in the displayed direction, without wrapping across board edges. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Selects a piece or plays to the focused legal square when human moves are enabled; activates a focused toolbar or capture-path button. |
| <kbd>Escape</kbd> | Cancels a selection, drag or pending capture-path choice without playing a move. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Opens User help for the component under the pointer, falling back to focus. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Opens contextual component documentation. |
