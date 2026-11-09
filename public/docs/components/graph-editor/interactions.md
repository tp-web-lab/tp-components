### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag | Drag a shape from the palette onto the canvas to create a node. |
| Select | Select and move nodes, connect their ports, and select links to edit them. |
| Using the component | Use the toolbar for undo, redo, zoom, import and export. |
| Using the component | The `language-json` toolbar button shows or hides a source editor below the palette and canvas. |
| Graph JSON | Synchronization is explicit: after editing the JSON, use the `sync` button at the end of the **Graph JSON** header to apply it to the graph. |
| Using the component | If the code has not been edited, the same button copies the current graph into the code editor. |
| Using the component | Invalid JSON leaves the canvas unchanged and displays a validation message. |
| Drag | Drag a shape from the palette and drop it on the canvas to create a node. |
| Click | Clicking an empty part of the canvas only clears the selection. |
| Drag | Drag a node by its body to move it. |
| Using the component | When an existing link is selected, choosing another link mode in the palette changes that link immediately. |
| Using the component | Without a selected link, the choice applies to the next link created. |
| Hover | Hover or select a node to reveal its four attachment ports. |
| Drag | Drag from the exact source port to the exact target port to create an edge. |
| Using the component | A dashed preview follows the pointer, but releasing it over the node body does not create a connection. |
| Hover | Hover or select an edge to reveal a handle at each endpoint. |
| Drag | Drag either handle onto the exact destination port to reconnect that endpoint. |
| Using the component | Domain rules are applied again, so an invalid endpoint is rejected without changing the edge. |
| Drag | Drag the body of an edge to move the complete segment. |
| Using the component | This disconnects both endpoints. |
| Using the component | The endpoint handles can then reconnect the floating edge wherever needed. |
| Measurement | Drag **Measurement** from the annotation palette and drop its small square directly on a link. |
| Using the component | The point remains attached while nodes and bends move. |
| Drag | Drag the square along the link to reposition it, then double-click it to give it a name. |
| Using the component | Removing a node also removes its incident edges. |
| Cut | The **Cut** button provides the equivalent toolbar action while retaining the element in the editor clipboard. |
| Copy | Use **Copy**, **Cut**, and **Paste** on the selected element. |
| Undo | A pasted node is offset from its source, with a larger offset for each consecutive paste. **Undo** and **Redo** navigate up to 100 graph changes. |
| :tp-icon:{name="arrow-expand-vertical" size="1.25em"} :tp-icon:{name="arrow-collapse-vertical" size="1.25em"} Expand / Collapse | Expands or collapses every palette group. |
| :tp-icon:{name="undo" size="1.25em"} :tp-icon:{name="redo" size="1.25em"} Undo / Redo | Navigates graph changes. |
| :tp-icon:{name="select" size="1.25em"} Select area | Toggles rectangular multi-selection. |
| :tp-icon:{name="content-copy" size="1.25em"} :tp-icon:{name="content-cut" size="1.25em"} :tp-icon:{name="content-paste" size="1.25em"} Copy / Cut / Paste | Copies, removes, or pastes selected graph elements. |
| :tp-icon:{name="text-short" size="1.25em"} :tp-icon:{name="format-title" size="1.25em"} Label / Graph title | Edits the selected label or document title. |
| :tp-icon:{name="magnify-minus-outline" size="1.25em"} :tp-icon:{name="magnify-plus-outline" size="1.25em"} Zoom out / Zoom in | Changes the canvas scale. |
| :tp-icon:{name="grid" size="1.25em"} Grid | Shows or hides the snapping grid. |
| :tp-icon:{name="file-upload" size="1.25em"} :tp-icon:{name="file-download" size="1.25em"} Import / Export | Loads or downloads the graph as JSON. |
| :tp-icon:{name="language-json" size="1.25em"} Graph JSON | Shows or hides the JSON editor. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the JSON code editor toolbar. |
| :tp-icon:{name="sync" size="1.25em"} Synchronize | Applies edited JSON or copies the graph into the JSON editor. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | Remove the selected node, edge or measurement point. |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>C</kbd> | Copy the selected element. |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>X</kbd> | Cut the selected element. |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>V</kbd> | Paste the copied or cut element. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
