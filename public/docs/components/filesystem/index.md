# <tp-icon name="filesystem" library="components" size="1.25em"></tp-icon> Filesystem

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-filesystem>` element implements the <tp-icon name="filesystem" library="components" size="1.25em"></tp-icon> Filesystem functionality: in-memory file system with a file tree UI.

<tp-box data-intro-action="filesystem" data-allow-script>
  <p>Expand the folders and select a file in this in-memory example.</p>
  <tp-filesystem></tp-filesystem>
  <p data-demo-status role="status">Select a file to see its path.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Use the file browser to navigate folders and select files. |
| Using the component | File access may require permission from the browser. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Use `<tp-filesystem>` as shown below.

```html
<tp-filesystem></tp-filesystem>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand folders and select a file to display its path in the in-memory file system.
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
<!-- tp-docgen:api TpFilesystem -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-filesystem>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addFile</code> | <code>addFile(file: TpFile): void</code> | Adds a copied file record and refreshes the tree; a duplicate normalized path is ignored. |
  | <code>closeFile</code> | <code>closeFile(path: string): void</code> | Removes path from the open files; if it was active, activates another open file or clears the active path. |
  | <code>deleteFile</code> | <code>deleteFile(path: string): void</code> | Deletes an existing writable file and clears its open/dirty state; missing or readonly files are unchanged. |
  | <code>getActivePath</code> | <code>getActivePath(): string \| null</code> | Returns the active file path, or null when no file is active. |
  | <code>getDirtyPaths</code> | <code>getDirtyPaths(): string[]</code> | Returns a new array of paths currently marked as modified. |
  | <code>getFiles</code> | <code>getFiles(): TpFile[]</code> | Returns copies of all in-memory file records; modifying the returned array does not update the component. |
  | <code>getState</code> | <code>getState(): TpFilesystemState</code> | Returns a snapshot of copied files and the current active, open and dirty paths. |
  | <code>moveFile</code> | <code>moveFile(oldPath: string, newPath: string): void</code> | Renames oldPath to newPath using renameFile(), then emits a move notification with the normalized paths. |
  | <code>openFile</code> | <code>openFile(path: string, emitEvent = true): void</code> | Marks an existing file as open and active. Set emitEvent to false to suppress open/active notifications. |
  | <code>readFile</code> | <code>readFile(path: string): string \| null</code> | Returns the content of the normalized file path, or null when no file exists at that path. |
  | <code>renameFile</code> | <code>renameFile(oldPath: string, newPath: string): void</code> | Changes the normalized path of a writable file and updates its tracked states. Missing, readonly or unchanged source paths are ignored. |
  | <code>setActivePath</code> | <code>setActivePath(path: string \| null, emitEvent = true): void</code> | Sets an existing file as active, or clears it with null. Set emitEvent to false to suppress the active-file notification. |
  | <code>setDirtyPaths</code> | <code>setDirtyPaths(paths: readonly string[]): void</code> | Replaces the set of modified-file paths and refreshes the tree; unknown paths are discarded. |
  | <code>setFiles</code> | <code>setFiles(files: readonly TpFile[]): void</code> | Replaces the in-memory files with copies, removes states for missing files, refreshes the tree and emits a change event. |
  | <code>setState</code> | <code>setState(state: TpFilesystemState): void</code> | Replaces files and active, open and dirty paths together; removes paths that no longer exist, refreshes the tree and emits change. |
  | <code>writeFile</code> | <code>writeFile(path: string, content: string): void</code> | Replaces an existing writable file content, marks it dirty and emits write/change events. Missing and readonly files are unchanged. |
  [Public methods of `TpFilesystem`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-filesystem-active</code> | <code>&#123; path: string &#125;</code> | Emitted when the active file changes. |
  | <code>tp-filesystem-add</code> | <code>&#123; path: string &#125;</code> | Emitted when a file is added. |
  | <code>tp-filesystem-change</code> | <code>&#123; files: TpFile[] &#125;</code> | Emitted when the file list changes. |
  | <code>tp-filesystem-delete</code> | <code>&#123; path: string &#125;</code> | Emitted when a file is deleted. |
  | <code>tp-filesystem-move</code> | <code>&#123; oldPath: string; newPath: string &#125;</code> | Emitted when a file is moved. |
  | <code>tp-filesystem-open</code> | <code>&#123; path: string &#125;</code> | Emitted when a file is opened. |
  | <code>tp-filesystem-rename</code> | <code>&#123; oldPath: string; newPath: string &#125;</code> | Emitted when a file or directory is renamed. |
  | <code>tp-filesystem-write</code> | <code>&#123; path: string; content: string &#125;</code> | Emitted when file content is written. |
  [Events emitted by `<tp-filesystem>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-font-family</code> | <code>system-ui, sans-serif</code> | Font family used by the file system. |
  | <code>&#45;&#45;tp-font-size</code> | <code>1rem</code> | Font size used by the file system. |
  | <code>&#45;&#45;tp-line-height</code> | <code>1.5</code> | Line height used by the file system. |
  [CSS properties of `<tp-filesystem>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_filesystem.TpFilesystem.html)
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
  <script type="module" src="/path/to/components/filesystem/filesystem.js"></script>
  ```

import
: ```js
  import "/path/to/components/filesystem/filesystem.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/filesystem/filesystem.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-filesystem>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-file-tree
@summary Displays an interactive file and folder tree.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-file-tree>`](../file-tree/index.md) : Displays an interactive file and folder tree.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
