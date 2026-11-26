### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reference | Hover or click to read its content in a tooltip. |
| Move into the tooltip | Keep the preview open to follow links or select text. |
| Scroll a long preview | Read the remaining note or bibliographic content without closing it. |
| Leave the reference and its preview | Close after a short delay, unless keyboard focus remains inside. |

A reference with `silent` has no visible control or keyboard stop; index lists can still link to its location.

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focus a reference to open its tooltip, then focus the preview or its links. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Show the focused reference tooltip. |
| <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> / <kbd>PageUp</kbd> / <kbd>PageDown</kbd> | Scroll a focused long preview. |
| <kbd>Escape</kbd> | Close the tooltip. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
