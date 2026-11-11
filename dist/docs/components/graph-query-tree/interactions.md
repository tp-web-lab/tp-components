### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Select | Select a node to edit its relevant properties in the lower toolbar. |
| Table | Relations expose **Table** and **Alias**. |
| Select | Selection, projection, aggregation, sort, and join nodes expose their expression. |
| Group by | Aggregation also exposes **Group by**, while joins offer inner, left, right, and full variants. |
| Using the component | The generated SQL uses nested derived tables so that every relational operator remains visible in the translation. |
| Using the component | For binary operators, the left and right operands are determined by their horizontal positions in the graph. |
| Using the component | An incomplete tree displays a precise message instead of SQL. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
