### User interactions

#### Mouse interactions

| Control or gesture | Result | Shortcut |
| --- | --- | --- |
| :tp-icon:{name="code"} Edit source | Show or hide the JavaScript editor without changing the recording. | — |
| :tp-icon:{name="play"} Record execution | Record the editor source in a fresh JavaScript session. | — |
| :tp-icon:{name="stop"} Stop recording | Terminate the active recording Worker. | — |
| :tp-icon:{name="file-import"} Load trace | Open a saved JSON recording without executing JavaScript. | — |
| :tp-icon:{name="file-upload"} Save trace | Choose a filename and save all snapshots and their source. | — |
| :tp-icon:{name="chevron-left-first"} First step | Display the first recorded step. | — |
| :tp-icon:{name="chevron-left"} Previous step | Display the preceding recorded step. | — |
| :tp-icon:{name="chevron-right"} Next step | Display the following recorded step. | — |
| :tp-icon:{name="arrow-right"} Step over | Advance past an invocation without visiting its internal steps. Stop at an exception or recording limit. | — |
| :tp-icon:{name="arrow-up"} Step out | Advance until the current invocation returns to its caller. Disabled outside a function. | — |
| :tp-icon:{name="play"} Start at query | Jump to the first recorded query step, keeping initialization available through Previous and First. Disabled without a recorded query boundary. | — |
| :tp-icon:{name="chevron-right-last"} Last step | Display the final recorded step. | — |
| Hover a reference dot | Highlight the object's reference arrow. | — |
| Click a reference dot | Scroll to its object. | — |
| Hover or focus a base-class link | Highlight the base class object box. | — |
| Click a base-class link | Scroll to the base class object box. | — |
| Scroll the memory diagram horizontally | Reveal objects and arrows outside the visible area. | — |
| Trace JSON <!-- button --> | Expand or collapse the current snapshot's JSON. | — |

#### Keyboard interactions

| Key | Result |
| --- | --- |
| <kbd>Tab</kbd> | Focus commands and object references; a focused reference highlights its arrow. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused command. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component; <kbd>Shift</kbd> may be needed to type ?. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component in the containing hierarchy and open its User help. |
