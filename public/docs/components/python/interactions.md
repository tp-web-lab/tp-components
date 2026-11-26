### User interactions

#### Mouse interactions

| Action | Result |
| --- | --- |
| :tp-icon:{name="code" size="2em"} Edit source | Show or hide the source editor. |
| :tp-icon:{name="python-tracer" library="components"} Trace execution | When enabled, record the current program and query in a separate Python tracer drawer, initially 75% wide. |
| :tp-icon:{name="play" size="2em"} Run | Reload changed source, then execute the query and display its result. Keep the session when the source is unchanged. |
| :tp-icon:{name="delete-outline" size="2em"} Clear | Clear the transcript while retaining session variables. |
| :tp-icon:{name="refresh" size="2em"} Reset | Restore the original program and initial command. |
| :tp-icon:{name="palette" size="2em"} Color | Choose this interpreter's brand color. |
| :tp-icon:{name="theme-light-dark" size="2em"} Theme | Change this interpreter's theme. |
| :tp-icon:{name="fullscreen" size="2em"} Fullscreen | Enter or leave fullscreen. |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> | Recall previous commands or restore the current draft. |
| <kbd>Tab</kbd> | Move between controls. |
| <kbd>Return</kbd> or <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field | Reload the program if its source changed, then run the current query. Keep the session if unchanged; retain the query text. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open contextual help for the component under the pointer, falling back to the focused component; Shift may be needed to type ?. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Open the component viewer. |
