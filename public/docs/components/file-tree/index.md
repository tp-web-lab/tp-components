# <tp-icon name="file-tree" library="components" size="1.25em"></tp-icon> File Tree

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-file-tree>` element implements the <tp-icon name="file-tree" library="components" size="1.25em"></tp-icon> File Tree functionality: arbre spécialisé pour fichiers et dossiers.

<tp-box data-intro-action="file-tree" data-allow-script>
  <p>Expand the folders and select a file in this in-memory example.</p>
  <tp-file-tree></tp-file-tree>
  <p data-demo-status role="status">Select a file to see its path.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

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
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Use `<tp-file-tree>` as shown below.

```html
<tp-file-tree></tp-file-tree>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand folders and select a file to display its path in the in-memory file tree.
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
<!-- tp-docgen:api TpFileTree -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-file-tree>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>beginRenamePath</code> | <code>beginRenamePath(path: string): void</code> | Starts inline renaming for the tree item matching path; does nothing for an empty or missing path. |
  | <code>collapseAll</code> | <code>collapseAll(): void</code> | Collapses every directory in the displayed tree; has no effect before the internal tree is created. |
  | <code>expandAll</code> | <code>expandAll(): void</code> | Expands every directory in the displayed tree; has no effect before the internal tree is created. |
  | <code>getNodes</code> | <code>getNodes(): TpFileTreeNode[]</code> | Returns a detached, recursively sorted copy of the root nodes, with directories before files. |
  | <code>setActivePath</code> | <code>setActivePath(path: string \| null): void</code> | Sets the active-file path; null clears the active marker without changing selection. |
  | <code>setDirtyPaths</code> | <code>setDirtyPaths(paths: readonly string[]): void</code> | Replaces the set of file paths marked as modified; an empty array removes every modified marker. |
  | <code>setNodes</code> | <code>setNodes(nodes: readonly TpFileTreeNode[]): void</code> | Replaces the root nodes with a recursively sorted copy while retaining selected, active, open and dirty paths. |
  | <code>setOpenPaths</code> | <code>setOpenPaths(paths: readonly string[]): void</code> | Replaces the set of file paths marked as open; does not change the active or selected path. |
  | <code>setSelectedPath</code> | <code>setSelectedPath(path: string \| null): void</code> | Sets the highlighted selected path; null clears selection. Retains the active path and file states. |
  | <code>setState</code> | <code>setState(state: TpFileTreeState): void</code> | Replaces the displayed nodes and selected, active, open and dirty paths together; rerenders the tree and expands its directories. |
  [Public methods of `TpFileTree`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-file-tree-active</code> | <code>&#123; path: string &#125;</code> | Emitted when selecting a file makes it active; path identifies the file. Selecting an already active file can emit it again. |
  | <code>tp-file-tree-add-request</code> | <code>&#123; path: string \| null; kind: &quot;file&quot; \| &quot;directory&quot; &#125;</code> | Requests creation of a file or directory; path is the target path, or null for the root, and kind specifies the entry type. The consumer performs the creation. |
  | <code>tp-file-tree-clone-request</code> | <code>&#123; path: string &#125;</code> | Requests duplication of the entry at path; the consumer performs the copy. |
  | <code>tp-file-tree-copy-request</code> | <code>&#123; path: string &#125;</code> | Requests copying the selected path to the clipboard; the consumer performs the copy. |
  | <code>tp-file-tree-delete-request</code> | <code>&#123; path: string &#125;</code> | Requests deletion of the entry at path; the consumer performs the deletion. |
  | <code>tp-file-tree-global-action</code> | <code>&#123; actionId: &quot;expand-all&quot; \| &quot;collapse-all&quot; \| &quot;toggle-guides&quot; &#125;</code> | Emitted when a global context-menu action is chosen; actionId contains its identifier. |
  | <code>tp-file-tree-move-request</code> | <code>&#123; sourcePath: string; destinationPath: string \| null; position: &quot;inside&quot; \| &quot;before&quot; \| &quot;after&quot; &#125;</code> | Requests moving sourcePath relative to destinationPath at position; a null destination denotes the root. The consumer performs the move. |
  | <code>tp-file-tree-open</code> | <code>&#123; path: string &#125;</code> | Emitted when a file is selected for opening; path identifies the file. Selecting an already open file can emit it again. |
  | <code>tp-file-tree-rename-request</code> | <code>&#123; path: string; newName: string &#125;</code> | Requests renaming the entry at path to newName; the consumer performs the rename. |
  | <code>tp-file-tree-select</code> | <code>&#123; path: string &#125;</code> | Emitted after a file or directory row is selected; path identifies the selected entry. |
  [Events emitted by `<tp-file-tree>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-file-tree-active-color</code> | <code>inherit</code> | Text color of the active file row. |
  | <code>&#45;&#45;tp-file-tree-dirty-color</code> | <code>#d97706</code> | Color of the dot marking a file with unsaved changes. |
  | <code>&#45;&#45;tp-file-tree-icon-size</code> | <code>1rem</code> | Width and height of file and directory icons. |
  | <code>&#45;&#45;tp-file-tree-open-color</code> | <code>inherit</code> | Text color of rows whose paths are marked as open. |
  | <code>&#45;&#45;tp-file-tree-selected-bg</code> | <code>color-mix(in srgb, currentColor 8%, transparent)</code> | Background color of the selected path row. |
  [CSS properties of `<tp-file-tree>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_file-tree.TpFileTree.html)
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
  <script type="module" src="/path/to/components/file-tree/file-tree.js"></script>
  ```

import
: ```js
  import "/path/to/components/file-tree/file-tree.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/file-tree/file-tree.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-file-tree>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-tree>`](../tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
