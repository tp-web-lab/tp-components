### User interactions

The query buttons and Libraries dropdown remain available in all three modes, including simple mode and notebook cells.

#### Mouse interactions

| Action | Result |
| --- | --- |
| :tp-icon:{name="code" size="2em"} Edit source | Opens or hides the Prolog source editor below the toolbar. |
| :tp-icon:{name="prolog-tracer" library="components" size="2em"} Trace execution | When enabled, record the current program and query in a drawer initially 75% wide, without changing the interpreter session. |
| :tp-icon:{name="play" size="2em"} Run | Reload changed source, then execute the query and display its result. Keep the session when the source is unchanged. |
| :tp-icon:{name="next" size="2em"} Next solution ; | Requests the next solution of the current query. |
| :tp-icon:{name="play-all" size="2em"} All solutions | Runs the entered query and displays all its solutions; with an unchanged or empty prompt, displays the remaining solutions of the current query. Accept or Escape stops enumeration. |
| :tp-icon:{name="check" size="2em"} Accept . | Accepts the current answer and discards further solutions, keeping the query in the field. |
| :tp-icon:{name="delete-outline" size="2em"} Clear | Clears the transcript without changing the program or history. |
| :tp-icon:{name="file_type_swiprolog" library="languages" size="2em"} Libraries | Opens the library menu below the query field. Selecting a library runs use_module; a check marks loaded libraries. |
| :tp-icon:{name="refresh" size="2em"} Reset | Discards asserted facts and history and restores the initial program. |

Color, theme and fullscreen are provided by the toolbar controllers and apply only to this interpreter. Their own contextual help describes their commands.

#### Keyboard interactions

| Key | Action |
| --- | --- |
| <kbd>;</kbd>, then <kbd>Enter</kbd> | Requests the next solution. |
| <kbd>.</kbd>, then <kbd>Enter</kbd>, or <kbd>Escape</kbd> | Accepts the current answer. |
| <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> | Recalls queries and restores the unfinished draft in the prompt; moves between library choices in the open menu. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> in Libraries | Opens the menu or loads the focused available library. |
| <kbd>Return</kbd> or <kbd>Shift</kbd>+<kbd>Return</kbd> in the query field | Reload the program if its source changed, then run the current query. Keep the session if unchanged; retain the query text. An empty prompt accepts the current answer. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open contextual help for the component under the pointer or with focus; <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component in the containing hierarchy and open its User help. |
