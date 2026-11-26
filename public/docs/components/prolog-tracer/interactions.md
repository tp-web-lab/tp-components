### User interactions

#### Mouse interactions

| Action | Result |
| --- | --- |
| :tp-icon:{name="code" size="2em"} Edit source | Show or hide the program editor. |
| :tp-icon:{name="file-import" size="2em"} Load trace | Open a saved Prolog JSON recording without executing it. |
| :tp-icon:{name="file-upload" size="2em"} Save trace | Save the complete recording with a filename of your choice. |
| :tp-icon:{name="play" size="2em"} Record resolution | Record the current program and query in a fresh engine. |
| :tp-icon:{name="stop" size="2em"} Stop recording | Terminate the recording Worker. |
| :tp-icon:{name="chevron-left-first" size="2em"} First step | Return to the query root. |
| :tp-icon:{name="chevron-left" size="2em"} Previous step | Restore the preceding event and tree. |
| :tp-icon:{name="chevron-right" size="2em"} Next step | Reveal the next debugger event. |
| :tp-icon:{name="chevron-right-last" size="2em"} Last step | Show the complete explored tree and solutions. |
| <!-- button --> Trace JSON | Expand or collapse the complete JSON recording. |
| Select a tree node | Return to the event that created this attempt. |
| Scroll the tree | Explore branches outside the visible area. |
| :tp-icon:{name="palette-swatch" size="2em"} Color | Change the brand color. |
| :tp-icon:{name="theme-light-dark" size="2em"} Theme | Change the theme. |
| :tp-icon:{name="fullscreen" size="2em"} Fullscreen | Enter or leave fullscreen. |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Return</kbd> or <kbd>Shift</kbd>+<kbd>Return</kbd> in Query | Record the current program and query. |
| <kbd>Return</kbd> or <kbd>Space</kbd> on a tree node | Return to that attempt's creation event. |
| <kbd>Tab</kbd> | Move between controls and tree nodes. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open contextual help for the component under the pointer, falling back to focus; Shift may be needed to type ?. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Open the component viewer. |
