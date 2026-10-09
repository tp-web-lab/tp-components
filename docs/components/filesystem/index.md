# <tp-icon name="filesystem" library="components" size="1.25em"></tp-icon> Filesystem

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-filesystem>` element implements the <tp-icon name="filesystem" library="components" size="1.25em"></tp-icon> Filesystem functionality: in-memory file system with a file tree UI.

<tp-box data-intro-action="filesystem" data-allow-script>
  <p>Expand the folders and select a file in this in-memory example.</p>
  <tp-filesystem></tp-filesystem>
  <p data-demo-status role="status">Select a file to see its path.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
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
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

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
  | None. |  |  |  |
  [Attributes of `<tp-filesystem>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addFile</code> | <code>addFile(file: TpFile): void</code> | Adds a file. |
  | <code>closeFile</code> | <code>closeFile(path: string): void</code> | Closes an open file. |
  | <code>deleteFile</code> | <code>deleteFile(path: string): void</code> | Deletes a file. |
  | <code>getActivePath</code> | <code>getActivePath(): string \| null</code> | Returns the active file path. |
  | <code>getDirtyPaths</code> | <code>getDirtyPaths(): string[]</code> | Returns dirty file paths. |
  | <code>getFiles</code> | <code>getFiles(): TpFile[]</code> | Returns all files. |
  | <code>getState</code> | <code>getState(): TpFilesystemState</code> | Returns the full file system state. |
  | <code>moveFile</code> | <code>moveFile(oldPath: string, newPath: string): void</code> | Moves a file. |
  | <code>openFile</code> | <code>openFile(path: string, emitEvent = true): void</code> | Opens a file and makes it active. |
  | <code>readFile</code> | <code>readFile(path: string): string \| null</code> | Reads a file. |
  | <code>renameFile</code> | <code>renameFile(oldPath: string, newPath: string): void</code> | Renames a file. |
  | <code>setActivePath</code> | <code>setActivePath(path: string \| null, emitEvent = true): void</code> | Sets the active file path. |
  | <code>setDirtyPaths</code> | <code>setDirtyPaths(paths: readonly string[]): void</code> | Replaces dirty file paths. |
  | <code>setFiles</code> | <code>setFiles(files: readonly TpFile[]): void</code> | Replaces all files. |
  | <code>setState</code> | <code>setState(state: TpFilesystemState): void</code> | Replaces the full file system state. |
  | <code>writeFile</code> | <code>writeFile(path: string, content: string): void</code> | Writes file content. |
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
[More details…](/tp-components/api/classes/components_filesystem.TpFilesystem.html)
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
