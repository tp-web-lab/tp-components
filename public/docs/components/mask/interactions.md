### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Mask message | Read the replacement message. The hidden target cannot be clicked. |
| Using the component | There is no built-in dismiss button or component-specific pointer gesture. Author-provided controls may change its state. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Skip the hidden target. Any interactive content supplied in the message remains reachable. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
