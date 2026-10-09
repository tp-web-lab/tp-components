# <tp-icon name="tree" library="components" size="1.25em"></tp-icon> Tree

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-tree>` element implements the <tp-icon name="tree" library="components" size="1.25em"></tp-icon> Tree functionality: interactive hierarchical tree.

<tp-tree selectable guides level="2">
  <ul>
    <li>Project
      <ul>
        <li>Documentation
          <ul><li>Getting started</li><li>Examples</li></ul>
        </li>
        <li>Source code</li>
        <li>README.md</li>
      </ul>
    </li>
  </ul>
</tp-tree>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Expand or collapse branches to inspect nested items. |
| Select | Select available links or entries to use the actions provided by the surrounding page. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `draggable` to enable node reordering. The tree creates an internal [`tp-dragdrop`](../dragdrop/index.md) controller automatically; do not add another controller to its nodes. The tree continues to manage hierarchy constraints, node permissions, drop markers, and the `tp-tree-node-move-request` event. This integration does not add keyboard grab/drop interactions.

Use `<tp-tree>` as shown below.

```html
<tp-tree></tp-tree>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand and collapse the project folders and navigate the tree entries.

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
<!-- tp-docgen:api TpTree -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>draggable</code> | <code>boolean</code> | <code>false</code> | Enables node drag and drop. |
  | <code>editable</code> | <code>boolean</code> | <code>false</code> | Enables node editing actions. |
  | <code>guides</code> | <code>boolean</code> | <code>false</code> | Shows hierarchy guide lines. |
  | <code>level</code> | <code>number</code> | <code>1</code> | Initial expansion depth. |
  | <code>selectable</code> | <code>boolean</code> | <code>false</code> | Enables node selection. |
  [Attributes of `<tp-tree>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>beginRename</code> | <code>beginRename(node: HTMLLIElement): void</code> | Starts inline rename for a tree node. |
  | <code>closeContextMenu</code> | <code>closeContextMenu(): void</code> | Closes the current context menu. |
  | <code>collapseAll</code> | <code>collapseAll(): void</code> | Collapses every tree item that has children. |
  | <code>collapseNode</code> | <code>collapseNode(item: HTMLLIElement): void</code> | Collapses a tree item that has children. |
  | <code>expandAll</code> | <code>expandAll(): void</code> | Expands every tree item that has children. |
  | <code>expandNode</code> | <code>expandNode(item: HTMLLIElement): void</code> | Expands a tree item that has children. |
  | <code>getSelectedItem</code> | <code>getSelectedItem(): HTMLLIElement \| null</code> | Returns the selected tree item. |
  | <code>openGlobalContextMenuAt</code> | <code>openGlobalContextMenuAt(x: number, y: number): void</code> | Opens the global context menu at viewport coordinates. |
  | <code>openNodeContextMenuAt</code> | <code>openNodeContextMenuAt(node: HTMLLIElement, x: number, y: number): void</code> | Opens the context menu for a tree node at viewport coordinates. |
  | <code>setContextMenuConfig</code> | <code>setContextMenuConfig(config: TpTreeContextMenuConfig \| null): void</code> | Sets the context menu configuration. |
  | <code>sortAll</code> | <code>sortAll(): void</code> | Sorts every subtree alphabetically. |
  | <code>sortNodeChildren</code> | <code>sortNodeChildren(item: HTMLLIElement): void</code> | Sorts the direct children of a tree item alphabetically. |
  | <code>toggleGuides</code> | <code>toggleGuides(): void</code> | Toggles hierarchy guide lines. |
  [Public methods of `TpTree`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-tree-context-action</code> | <code>&#123; actionId: string; scope: &quot;global&quot; \| &quot;node&quot;; target: TpTreeNodeTarget \| null &#125;</code> | Emitted when a context menu action is selected. |
  | <code>tp-tree-context-close</code> | <code>&#123; scope: &quot;global&quot; \| &quot;node&quot; \| null &#125;</code> | Emitted when a context menu closes. |
  | <code>tp-tree-context-open</code> | <code>&#123; scope: &quot;global&quot; \| &quot;node&quot;; target: TpTreeNodeTarget \| null &#125;</code> | Emitted when a context menu opens. |
  | <code>tp-tree-node-add-request</code> | <code>&#123; target: TpTreeNodeTarget \| null; position: &quot;inside&quot; \| &quot;before&quot; \| &quot;after&quot;; actionId: &quot;add-leaf&quot; \| &quot;add-node&quot; &#125;</code> | Emitted when a node add action is requested. |
  | <code>tp-tree-node-clone-request</code> | <code>&#123; target: TpTreeNodeTarget &#125;</code> | Emitted when a node clone action is requested. |
  | <code>tp-tree-node-delete-request</code> | <code>&#123; target: TpTreeNodeTarget &#125;</code> | Emitted when a node delete action is requested. |
  | <code>tp-tree-node-move-request</code> | <code>&#123; source: TpTreeNodeTarget; destination: TpTreeNodeTarget \| null; position: &quot;inside&quot; \| &quot;before&quot; \| &quot;after&quot; &#125;</code> | Emitted when a node move is requested. |
  | <code>tp-tree-node-rename-request</code> | <code>&#123; target: TpTreeNodeTarget; oldLabel: string; newLabel: string &#125;</code> | Emitted when a node rename is requested. |
  | <code>tp-tree-select</code> | <code>&#123; target: TpTreeNodeTarget &#125;</code> | Emitted when a node is selected. |
  [Events emitted by `<tp-tree>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-tree-guide-inline-start</code> | <code>calc(-0.8rem + 1px)</code> | Inline position of guide lines. |
  | <code>&#45;&#45;tp-tree-guide-midline</code> | <code>calc( var(&#45;&#45;tp-tree-row-padding-block, 0.125rem) + var(&#45;&#45;tp-tree-toggle-half-size, 0.5rem) )</code> | Block position of guide midlines. |
  | <code>&#45;&#45;tp-tree-row-padding-block</code> | <code>0.125rem</code> | Vertical padding for each tree row. |
  | <code>&#45;&#45;tp-tree-toggle-half-size</code> | <code>0.5rem</code> | Half toggle size used by guide alignment. |
  | <code>&#45;&#45;tp-tree-toggle-size</code> | <code>1rem</code> | Toggle icon button size. |
  [CSS properties of `<tp-tree>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_tree.TpTree.html)
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
  <script type="module" src="/path/to/components/tree/tree.js"></script>
  ```

import
: ```js
  import "/path/to/components/tree/tree.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tree/tree.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-tree>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-dragdrop
@summary Generic drag-and-drop controller for content.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-dragdrop>`](../dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
