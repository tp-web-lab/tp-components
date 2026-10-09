# <tp-icon name="dragdrop" library="components" size="1.25em"></tp-icon> Drag and drop

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-dragdrop>` element implements the <tp-icon name="dragdrop" library="components" size="1.25em"></tp-icon> Drag and drop functionality: provides a generic drag-and-drop controller.

<tp-box id="dragdrop-board" data-dragdrop-demo data-allow-script>
  <p>Drag a task to <strong>To do</strong> or <strong>Done</strong>, including an empty column. The Move button sends a task to the other column without dragging.</p>
  <p>Keyboard: focus a card, press Enter, use the arrow keys to choose another card, then press Enter to drop before or after it. Escape cancels.</p>
  <tp-grid min-width="16rem" gap="1rem">
    <tp-box data-zone="To do" role="group" aria-label="To do" style="min-height: 12rem;">
      <h3>To do</h3>
      <tp-stack gap="0.5rem" data-tasks>
        <tp-box data-task aria-label="Write the introduction"><p>Write the introduction</p><tp-button data-move size="s" aria-label="Move Write the introduction to the other column">Move</tp-button></tp-box>
        <tp-box data-task aria-label="Review the examples"><p>Review the examples</p><tp-button data-move size="s" aria-label="Move Review the examples to the other column">Move</tp-button></tp-box>
      </tp-stack>
    </tp-box>
    <tp-box data-zone="Done" role="group" aria-label="Done" style="min-height: 12rem;">
      <h3>Done</h3>
      <tp-stack gap="0.5rem" data-tasks>
        <tp-box data-task aria-label="Choose a title"><p>Choose a title</p><tp-button data-move size="s" aria-label="Move Choose a title to the other column">Move</tp-button></tp-box>
      </tp-stack>
    </tp-box>
  </tp-grid>
  <p data-demo-status role="status" aria-live="polite">Move a task to change its column.</p>
  <tp-dragdrop root="#dragdrop-board" items="[data-task]"></tp-dragdrop>
  <script src="/tp-components/docs/components/dragdrop/examples/task-board.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag an item | Move it to another accepting area, including an empty column. |
| Drop near an item edge | Insert before or after that item. |
| Move button in the example | Move the card to the other column without dragging; also usable on touch devices. |
| Status message | Confirms the new location. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space on an item | Grab the item; press again to drop it. |
| Arrow keys while grabbed | Choose the target item. |
| Escape | Cancel dragging. |
| Enter / Space on Move | Move the card to the other column, including when it is empty. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `root` to the CSS selector of an existing root element and `items` to the draggable-item selector within it. Both are required to enable interaction. The component is an invisible controller: put visible content in the root, not inside `tp-dragdrop`. `handle` optionally restricts where a drag can start.

Listen for `tp-dragdrop-drop` and use its `source`, `target` and `position` to update your content. The controller deliberately does not move nodes itself. The introductory board uses the same [example script](examples/task-board.js) in all four languages. That script also accepts drops on empty columns and implements the Move buttons; these are example behaviors, not additional component attributes. Give each board a unique root ID when placing several boards in the same document.

The documentation marks this trusted example with `data-allow-script` so its external script is executed when Markdown content is inserted dynamically. Only enable script execution for content you trust.

```html
<ol id="sortable-list"><li>First item</li><li>Second item</li><li>Third item</li></ol>
<tp-dragdrop root="#sortable-list" items="li"></tp-dragdrop>
```

This minimal declaration only enables drag events; add a drop handler to actually reorder the list, as in Basic usage.

## Examples

**Basic usage** moves tasks between two columns. **Sortable list** reorders entries within a single numbered list, using drag and drop, the keyboard, or Up and Down buttons. **Reset order** restores the initial sequence. The [sorting script](examples/sortable-list.js) moves the existing list entries in response to the controller's events; it never nests one entry inside another.

While sorting, an outline highlights the entry after which the selected item will be inserted, with a thick line along its bottom edge. For insertion at the very beginning, the first entry is highlighted along its top edge instead. This preview remains visible until the destination changes, the item is dropped, or the move is cancelled. The status also describes the insertion point.

**Tree drag and drop** demonstrates how [`tp-tree`](../tree/index.md) uses an internal `tp-dragdrop` controller: move files between folders, reorder siblings, or move a complete subtree. Enable `draggable` on the tree; do not attach a second controller to the same nodes. The tree retains its hierarchy rules, drop markers, permissions, and `tp-tree-node-move-request` event. Unlike the first two examples, this integration preserves the tree's keyboard behavior and does not provide a keyboard grab/drop workflow.

For component integrations, the programmatic `adapter` property accepts a local root and callbacks for item resolution, drag permissions, drop position, and transferred text. In this mode, the owning component manages item attributes, focus, keyboard interactions, and DOM mutations; standalone controllers retain their existing selector-based and keyboard behavior.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move tasks between To do and Done, including an empty column, by dragging or using the Move buttons.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Sortable list
: Reorder the publishing steps by dragging or using the Up and Down buttons, and observe the insertion indicator.

Tree drag and drop
: Move files and folders within the tree and observe the highlighted destination; this example uses tp-dragdrop through tp-tree.
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
<!-- tp-docgen:api TpDragdrop -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>handle</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional CSS selector for a drag handle. |
  | <code>items</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector for draggable items and drop targets within the root. |
  | <code>root</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector for the observed root. Required to enable interaction. |
  [Attributes of `<tp-dragdrop>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpDragdrop`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-dragdrop-drop</code> | <code>&#123; source: &quot;api&quot; \| &quot;script&quot; \| &quot;src&quot; \| &quot;value&quot;; target: unknown; position: unknown &#125;</code> | Emitted when an item is dropped; consumers decide how to move it. |
  | <code>tp-dragdrop-end</code> | <code>void</code> | Emitted when a drag ends or a keyboard drag is cancelled. |
  | <code>tp-dragdrop-over</code> | <code>&#123; source: &quot;api&quot; \| &quot;script&quot; \| &quot;src&quot; \| &quot;value&quot;; target: unknown; position: unknown &#125;</code> | Emitted when the drop target or position changes. |
  | <code>tp-dragdrop-start</code> | <code>&#123; source: &quot;api&quot; \| &quot;script&quot; \| &quot;src&quot; \| &quot;value&quot; &#125;</code> | Emitted when a drag starts. |
  [Events emitted by `<tp-dragdrop>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-dragdrop>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_dragdrop.TpDragdrop.html)
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
  <script type="module" src="/path/to/components/dragdrop/dragdrop.js"></script>
  ```

import
: ```js
  import "/path/to/components/dragdrop/dragdrop.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dragdrop/dragdrop.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-dragdrop>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
