### User interactions

Help lists only this component’s own commands. Functional subcomponents expose their internal commands through their own <kbd>Ctrl</kbd>+<kbd>?</kbd> help.

The user-help button legend groups commands by their location in the component and describes their effect briefly. Detailed gestures and keyboard behavior remain in the interaction tables below.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Pointer over a component | Identifies the component whose help opens with <kbd>Ctrl</kbd>+<kbd>?</kbd>. This also works for non-focusable content such as boxes. |

| User help | Show the selected component’s independent preview and interaction instructions. |
| Author help | Show the selected component’s author documentation in the same drawer. |
| Developer help | Show the selected component’s TypeDoc class reference in the same drawer. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between help-view buttons and other drawer controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a help-view button | Display that view for the selected component. |
