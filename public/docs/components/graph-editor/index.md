# <tp-icon name="graph-editor" library="components" size="1.25em"></tp-icon> Graph editor

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-editor>` element implements the <tp-icon name="graph-editor" library="components" size="1.25em"></tp-icon> Graph editor functionality: edits and animates domain-specific graphs.

<tp-graph-editor grid="" grid-size="20" message="Graph message area" src="/docs/components/graph-editor/examples/graph-example.json"></tp-graph-editor>

## Usage

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

### Author directives

The editor deliberately separates four concerns:

- the serializable graph document;
- palettes that describe available shapes;
- SVG renderers that control their appearance;
- simulators that compute animated state transitions.

This separation allows the same editor to support Petri nets, logic circuits, query trees, geometric optics diagrams, state machines, and other domains without putting their semantics into the core component.

#### Initial graph content

::: tp-tabs
no content
: ```html
  <tp-graph-editor></tp-graph-editor>
  ```

internal script
: ```html
  <tp-graph-editor>
    <script type="tp/graph">{"nodes":[],"edges":[]}</script>
  </tp-graph-editor>
  ```

external file
: ```html
  <tp-graph-editor src="./graph.json"></tp-graph-editor>
  ```

JavaScript API
: Assign a graph document to the `value` property.
:::

#### Empty editor

Add `grid` to display a dotted grid and snap node positions to it. `grid-size` is expressed in graph units.

```html
<tp-graph-editor grid grid-size="20"></tp-graph-editor>
```

The generic palette contains circular nodes and four link modes: no arrow, a forward arrow, a backward arrow, or arrows at both endpoints. `backward` reverses the visible arrow without exchanging `source` and `target`. Select a link mode before dragging from a node port. Parallel links are automatically rendered as separate Bézier curves. A link whose source and target are the same node is rendered as two circular arcs through an external apex, so the loop stays outside the node. Its endpoints always use two distinct ports, and additional self-links use progressively larger radii. Older self-links without ports are normalized automatically.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect and edit the supplied graph using the editor tools.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpGraphEditor -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>grid</code> | <code>boolean</code> | <code>false</code> | Displays and uses the snapping grid. |
  | <code>grid-size</code> | <code>number</code> | <code>20</code> | Grid spacing in graph units. |
  | <code>message</code> | <code>string</code> | <code>&quot;&quot;</code> | Status message displayed by the graph editor. |
  | <code>ports-visible</code> | <code>boolean</code> | <code>false</code> | Keeps attachment plots visible instead of showing them only on hover. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents graph editing while keeping navigation available. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a tp/graph JSON document loaded at initialization. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-graph-editor>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = &quot;edge&quot;, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = this.activeEdgeDirection, routing: TpGraphEdgeRouting = this.activeEdgeRouting): TpGraphEdge</code> | Connects existing source and target node IDs using the requested type, ports, direction and routing. Rejects invalid connections, records the change and returns a detached edge copy. |
  | <code>addMeasurement</code> | <code>addMeasurement(edgeId: string, position = 0.5, label?: string): TpGraphMeasurement</code> | Adds a measurement marker to edgeId at a position clamped to 0..1 along the edge; returns its detached record. Throws for an unknown edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds a node of type at graph coordinates point, snapped to the grid. Uses label or the palette default, records the change and returns a detached copy of the node. |
  | <code>animateTransition</code> | <code>animateTransition(transition: TpGraphTransition): Promise&lt;void&gt;</code> | Applies node and edge patches to existing IDs, animates their appearance for transition.duration milliseconds (300 by default), then records the change. Resolves after that duration. |
  | <code>copy</code> | <code>copy(): boolean</code> | Copies the selected graph elements and connecting edges into the editor-local clipboard. Returns false when nothing is selected; does not use the system clipboard. |
  | <code>cut</code> | <code>cut(): boolean</code> | Copies the selection into the editor-local clipboard, then removes it and connected edges as an undoable change. Returns false when readonly or nothing is selected. |
  | <code>exportJson</code> | <code>exportJson(pretty = true): string</code> | Returns the graph serialized as JSON; pretty uses two-space indentation, while false produces compact JSON. |
  | <code>exportSvg</code> | <code>exportSvg(): string</code> | Returns a standalone SVG of the graph with resolved styles and content bounds; throws when the canvas is not ready. |
  | <code>importJson</code> | <code>importJson(source: string): void</code> | Parses and validates a JSON graph, replaces the current graph and emits tp-graph-import. Invalid JSON or graph data throws before replacement. |
  | <code>moveMeasurement</code> | <code>moveMeasurement(id: string, position: number): void</code> | Moves the marker identified by id to a relative edge position clamped to 0..1; throws when the marker is unknown. |
  | <code>paste</code> | <code>paste(): string \| null</code> | Duplicates the editor-local clipboard with new IDs and an offset, then selects the copies. Returns the first pasted ID, or null when readonly or no clipboard content is available. |
  | <code>reconnectEdge</code> | <code>reconnectEdge(edgeId: string, endpoint: &quot;source&quot; \| &quot;target&quot;, nodeId: string, port: TpGraphPort): TpGraphEdge</code> | Moves the source or target endpoint of edgeId to nodeId and port after connection validation; returns a detached copy of the updated edge. |
  | <code>redo</code> | <code>redo(): boolean</code> | Restores the next undone graph snapshot and returns true; returns false when redo history is empty. |
  | <code>registerPalette</code> | <code>registerPalette(palette: TpGraphPalette): void</code> | Registers or replaces a shape palette by its ID and refreshes the palette UI. Requires a nonempty ID and at least one shape. |
  | <code>registerSimulator</code> | <code>registerSimulator(name: string, simulator: TpGraphSimulator): void</code> | Registers or replaces the simulator function associated with name for subsequent step(name) calls. |
  | <code>removeElement</code> | <code>removeElement(id: string): void</code> | Removes the node, edge or measurement identified by id; removing a node also removes its connected edges. Updates selection and records an undoable change. |
  | <code>resetZoom</code> | <code>resetZoom(): void</code> | Restores magnification to 1 (100%) without changing graph data. |
  | <code>setCommentColor</code> | <code>setCommentColor(id: string, color: TpGraphCommentColor): void</code> | Changes the color of a comment node and records the change; throws for an unknown comment or unsupported color. |
  | <code>setEdgeDirection</code> | <code>setEdgeDirection(edgeId: string, direction: TpGraphEdgeDirection): void</code> | Changes an existing edge direction and the default for new edges; throws for an unknown edge or a direction unsupported by this editor. |
  | <code>setEdgeOrthogonal</code> | <code>setEdgeOrthogonal(edgeId: string, elbows: 1 \| 2 \| 3, departure: &quot;horizontal&quot; \| &quot;vertical&quot;, turns: &quot;alternating&quot; \| &quot;same&quot; = &quot;alternating&quot;): void</code> | Uses orthogonal routing with 1, 2 or 3 elbows and a horizontal or vertical departure. The turns choice applies to two elbows; throws for an unknown edge. |
  | <code>setEdgeRouting</code> | <code>setEdgeRouting(edgeId: string, routing: TpGraphEdgeRouting): void</code> | Changes an existing edge routing mode and the default for new edges; throws for an unknown edge. |
  | <code>setElementLabel</code> | <code>setElementLabel(id: string, label: string): void</code> | Sets the trimmed label of a node, edge or measurement by ID; empty clears the label. Throws for an unknown element. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Validates and clones the supplied graph, clears selection and rerenders it. After initialization, a changed graph is recorded in undo history; invalid graphs throw before replacement. |
  | <code>setTitle</code> | <code>setTitle(title: string): void</code> | Trims and stores the graph title, then records an undoable change; an empty string removes visible title text. |
  | <code>setZoom</code> | <code>setZoom(value: number): void</code> | Sets a positive finite magnification factor, clamped to the supported zoom range. A value of 1 means 100%; invalid inputs throw TypeError. |
  | <code>step</code> | <code>step(simulatorName: string): Promise&lt;void&gt;</code> | Runs the simulator registered as simulatorName on a graph snapshot, awaits its animated transition and emits tp-graph-simulation-step. Throws for an unknown simulator. |
  | <code>undo</code> | <code>undo(): boolean</code> | Restores the preceding graph snapshot and returns true; returns false when undo history is empty. |
  | <code>unregisterPalette</code> | <code>unregisterPalette(id: string): void</code> | Removes the palette with the supplied ID and selects a remaining shape if needed; does not remove existing graph nodes. |
  | <code>zoomIn</code> | <code>zoomIn(): void</code> | Increases magnification by the configured zoom factor, up to the supported maximum. |
  | <code>zoomOut</code> | <code>zoomOut(): void</code> | Decreases magnification by the configured zoom factor, down to the supported minimum. |
  [Public methods of `TpGraphEditor`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-graph-change</code> | <code>&#123; reason: string; graph: TpGraphDocument &#125;</code> | Emitted after a recorded graph mutation, JSON edit, undo or redo. reason identifies the operation and graph contains the resulting snapshot. |
  | <code>tp-graph-error</code> | <code>&#123; error: unknown; operation: &quot;load-src&quot; \| &quot;reconnect-edge&quot; \| &quot;add-edge&quot;; src?: string &#125;</code> | Emitted when loading src or creating/reconnecting an edge fails. operation identifies the failed action; src is included only for load-src. |
  | <code>tp-graph-export</code> | <code>&#123; graph: TpGraphDocument &#125;</code> | Emitted after the graph export has been saved; graph contains the exported graph snapshot. |
  | <code>tp-graph-import</code> | <code>&#123; graph: TpGraphDocument &#125;</code> | Emitted after importJSON validates and installs a graph; graph contains the imported snapshot. |
  | <code>tp-graph-selection-change</code> | <code>&#123; id: string \| null; ids: string[] &#125;</code> | Emitted when the selection is synchronized. id is the primary selection or null, and ids lists all selected element identifiers. |
  | <code>tp-graph-simulation-step</code> | <code>&#123; simulator: string; graph: TpGraphDocument &#125;</code> | Emitted after a registered simulator step and its transition animation complete; simulator is its registered name and graph is the resulting snapshot. |
  [Events emitted by `<tp-graph-editor>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-editor>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-editor.TpGraphEditor.html)
<!-- tp-docgen:typedoc:end -->






























































































































































































































































































### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/graph-editor/graph-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-editor/graph-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-editor/graph-editor.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-editor>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-accordion
@summary Collapsible multi-panels element.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-save-image
@summary Downloads an anchored image as SVG, PNG or WebP.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-accordion>`](../accordion/index.md) : Collapsible multi-panels element.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-save-image>`](../save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
