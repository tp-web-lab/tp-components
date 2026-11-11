### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Slope slider | Set the straight slope between −20% and +20%. |
| Clear slope | Restore a flat line (0%). |
| Drag either point horizontally | Spend movement effort along the route. Release and grab again to continue; the point does not jump to the pointer. Mouse, pen and touch are supported. |
| Stage profile | Select one of the available profiles; restart the stage point. A single supplied profile is shown as a label. |
| Grid | Show or hide the cycling-stage grid, with distance in kilometres and absolute elevation in metres. Graduations adapt to the selected or edited profile. |
| Restart | Return that route's point to 10% of the route. |
| Profile code disclosure | Expand or collapse the profile editor and its point-unit / slope-limit legend. |
| Profile files → Load (.json) | Choose a local JSON file, validate it and replace the collection; invalid files leave the current profiles unchanged. |
| Profile files → Save / Save as (.json) | Save the selected profile’s current editor text. Save reuses its destination; Save as chooses another one. Browsers without direct file access download the file. |
| F1 toolbar button | Show or hide the code editor toolbar. |
| Profile code editor | Edit the selected profile JSON; changes remain a draft until applied. |
| Play (Apply profile) | Validate and apply the selected profile, or replace the collection when the JSON contains multiple profiles; reset the point to 10%. Invalid JSON or a slope beyond ±20% keeps the curve and draft unchanged. |
| Refresh (Restore original profile) | Restore the selected profile and its code as originally loaded, discarding its edits. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focus the slope slider, clear button, points, profile choices and restart buttons. |
| <kbd>Left</kbd> / <kbd>Right</kbd> on a point | Move left / right with slope-dependent effort. Holding a key repeats the movement. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> on the slope slider | Adjust the slope. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> on profile choices | Select another stage. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on Grid | Show or hide the distance and elevation grid (hidden initially). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a button | Clear the slope, restart a route, apply the edited profile or restore its original code and curve. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on Profile code | Expand or collapse the editor. |
| <kbd>F1</kbd> in the code editor | Show or hide its toolbar. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a file-menu command | Load, save or save as JSON. |
| Typing / <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> in the code editor | Edit JSON and move the caret without moving the route point. |
| <kbd>Escape</kbd> | <kbd>End</kbd> a drag at the current position. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
