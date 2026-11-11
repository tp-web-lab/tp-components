### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Hover a numbered icon in the code | Show its explanation in a tooltip, preserving the list item's formatting. |
| Numbered icons in the explanation list | Match each explanation to the code marker with the same number. |
| Editing the linked code | Update the markers as the source changes; the annotation list does not change the source text. |
| Copy or save in the linked editor | Keep the original comments, including literal numbered markers. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Escape</kbd>, then <kbd>Tab</kbd> from the editor | Leave code indentation mode and focus a numbered marker. Its explanation opens as on hover; <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> move between focusable controls. |
| <kbd>Escape</kbd> while a tooltip is open | Close the tooltip without changing the source. |
| Typing in the linked editor | Edit code using the editor's normal keyboard behavior. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
