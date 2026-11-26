### User interactions

The user-help button legend groups commands by their location in the component and describes their effect briefly. Detailed gestures and keyboard behavior remain in the interaction tables below.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Question title | Expand or collapse the question. Questions start collapsed; answers are retained when collapsed. |
| :tp-icon:{name="input" size="2em"} Input button | Show or hide the answer form without losing answers. At least one panel stays visible. |
| :tp-icon:{name="output" size="2em"} Output button | Show or hide the output without losing feedback or the solution. Highlighted buttons indicate visible panels. |
| <!-- button --> Start | Reveal the timed question and begin its countdown. |
| <!-- button --> Continue | Reveal the question again after the time limit, keeping existing answers. |
| <!-- button --> Explain the solution | Copy a pedagogical prompt and request an explanation when ai-api is enabled and AI is configured. |
| <!-- button --> Submit | Check the completed answer form. |
| Feedback tab | Read feedback, or the message indicating that none is available. |
| Solution tab | Read the solution, or the message indicating that none is available. For timed questions, it becomes accessible only after Continue. |
| :tp-icon:{name="refresh" size="2em"} Reset response | Reset response. |
| :tp-icon:{name="play-arrow" size="2em"} Submit response | Submit response. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the question title | Expand or collapse the question. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused button. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> in Output tabs | Move between Feedback and Solution. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on Explain the solution | Copy the prompt and request an explanation when ai-api is enabled and AI is configured. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
