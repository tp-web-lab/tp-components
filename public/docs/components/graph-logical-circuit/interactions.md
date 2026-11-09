### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Click | Click an input to toggle it and immediately propagate the new signal through the circuit. |
| Using the component | Inputs, outputs, and gates use `success` when their value is `true` and `danger` when it is `false`. |
| Using the component | Outputs can also be clicked to inspect or override their displayed state; the next evaluation restores the value computed from their incoming wire. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Toggles the focused input or output terminal. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
