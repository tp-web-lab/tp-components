### User interactions

The header shows the game icon and name on the left. Rounded controls appear on the right, in this order: Reset, Undo, Redo, Help, chronometer, Color, Theme and Fullscreen. Additional game commands remain below the header.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| :tp-icon:{name="refresh"} Reset | Restores the loaded position or puzzle and resets the timer. |
| :tp-icon:{name="undo"} Undo | Takes back the last move. |
| :tp-icon:{name="redo"} Redo | Replays the next undone move. Disabled when there is no recorded continuation. |
| :tp-icon:{name="help"} Help | Opens the dropdown of assistance actions specific to this game. |
| Help → Highlight legal pits | Marks pits that can be sown, including feeding restrictions. |
| Help → Play one random legal move | Pauses and replays the next recorded turn, or chooses a random legal turn at the end of history. |
| Help → Rules of the game | Opens a drawer with the rules of this game. |
| Chronometer | Displays elapsed play time; starts with play and pauses on completion. Reset clears it. |
| :tp-icon:{name="palette-swatch"} Color | Changes the brand color of this game only. |
| :tp-icon:{name="sun"} :tp-icon:{name="moon"} Theme | Changes the light, dark or automatic theme of this game only. |
| :tp-icon:{name="fullscreen"} :tp-icon:{name="fullscreen-exit"} Fullscreen | Enters or leaves fullscreen for this game. |
| Click or tap a legal pit | Sows all of its seeds and applies captures. Available only for the active side when human input is enabled; feeding the opponent is compulsory when possible. |
| Start | Loads four seeds in each of the twelve pits, resets both scores and gives South the turn. |
| Flip | Displays the other player at the bottom without changing the active side. |
| Play vs random | Plays the side currently at the bottom against random legal replies. Enables human input. |
| Random vs random | Plays random legal moves for both sides, one turn every two seconds by default. |
| Stop | Stops automatic play without discarding the board or history. |
| Clear | Removes all seeds, resets both scores and stops play. |
| :tp-icon:{name="chevron-left-first"} Back to beginning | Pauses and restores the loaded beginning, keeping recorded moves for replay. |
| :tp-icon:{name="previous"} Previous move | Pauses and takes back one complete turn, restoring seeds and scores. |
| :tp-icon:{name="next"} Play one move | Pauses and replays one recorded turn, or plays a random legal move if no recording remains. |
| :tp-icon:{name="play"} Play to end | Replays recorded turns and continues randomly until the game ends or Pause is pressed. |
| :tp-icon:{name="pause"} Pause | Stops playback without losing the current position or recorded continuation. |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between the toolbar, board and playback controls. The board has one tab stop. |
| <kbd>←</kbd> / <kbd>→</kbd> / <kbd>↑</kbd> / <kbd>↓</kbd> | Moves focus between pits in the displayed direction, without wrapping at edges. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Sows the focused legal pit when human input is enabled, or activates a focused toolbar button. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Opens User help for the component under the pointer, falling back to focus. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Opens contextual component documentation. |
