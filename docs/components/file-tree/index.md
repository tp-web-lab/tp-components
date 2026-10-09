# <tp-icon name="file-tree" library="components" size="1.25em"></tp-icon> File Tree

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-file-tree>` element implements the <tp-icon name="file-tree" library="components" size="1.25em"></tp-icon> File Tree functionality: arbre spécialisé pour fichiers et dossiers.

<tp-box data-intro-action="file-tree" data-allow-script>
  <p>Expand the folders and select a file in this in-memory example.</p>
  <tp-file-tree></tp-file-tree>
  <p data-demo-status role="status">Select a file to see its path.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
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
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

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
  | None. |  |  |  |
  [Attributes of `<tp-file-tree>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>beginRenamePath</code> | <code>beginRenamePath(path: string): void</code> | Démarre le renommage d’un chemin. |
  | <code>collapseAll</code> | <code>collapseAll(): void</code> | Ferme tous les nœuds. |
  | <code>expandAll</code> | <code>expandAll(): void</code> | Ouvre tous les nœuds. |
  | <code>getNodes</code> | <code>getNodes(): TpFileTreeNode[]</code> | Retourne une copie triée des nœuds racine. |
  | <code>setActivePath</code> | <code>setActivePath(path: string \| null): void</code> | Met à jour l’état actif logique. |
  | <code>setDirtyPaths</code> | <code>setDirtyPaths(paths: readonly string[]): void</code> | Met à jour l’état dirty des fichiers. |
  | <code>setNodes</code> | <code>setNodes(nodes: readonly TpFileTreeNode[]): void</code> | Charge une nouvelle liste de nœuds racine. |
  | <code>setOpenPaths</code> | <code>setOpenPaths(paths: readonly string[]): void</code> | Met à jour l’état logique des chemins ouverts. |
  | <code>setSelectedPath</code> | <code>setSelectedPath(path: string \| null): void</code> | Met à jour la sélection logique. |
  | <code>setState</code> | <code>setState(state: TpFileTreeState): void</code> | Synchronise en une fois les nœuds et états visuels. |
  [Public methods of `TpFileTree`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-file-tree-active</code> | <code>&#123; path: string &#125;</code> | Émis lorsqu’un fichier devient actif. |
  | <code>tp-file-tree-add-request</code> | <code>&#123; path: string \| null; kind: &quot;file&quot; \| &quot;directory&quot; &#125;</code> | Émis lorsqu’un ajout de fichier ou dossier est demandé. |
  | <code>tp-file-tree-clone-request</code> | <code>&#123; path: string &#125;</code> | Émis lorsqu’un clonage est demandé. |
  | <code>tp-file-tree-copy-request</code> | <code>&#123; path: string &#125;</code> | Émis lorsqu’une copie de chemin est demandée. |
  | <code>tp-file-tree-delete-request</code> | <code>&#123; path: string &#125;</code> | Émis lorsqu’une suppression est demandée. |
  | <code>tp-file-tree-global-action</code> | <code>&#123; action: string &#125;</code> | Émis lorsqu’une action globale est choisie. |
  | <code>tp-file-tree-move-request</code> | <code>&#123; sourcePath: string; destinationPath: string \| null; position: &quot;inside&quot; \| &quot;before&quot; \| &quot;after&quot; &#125;</code> | Émis lorsqu’un déplacement est demandé. |
  | <code>tp-file-tree-open</code> | <code>&#123; path: string &#125;</code> | Émis lorsqu’un fichier est ouvert. |
  | <code>tp-file-tree-rename-request</code> | <code>&#123; path: string; newName: string &#125;</code> | Émis lorsqu’un renommage est demandé. |
  | <code>tp-file-tree-select</code> | <code>&#123; path: string &#125;</code> | Émis lorsqu’un chemin est sélectionné. |
  [Events emitted by `<tp-file-tree>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-file-tree-active-color</code> | <code>inherit</code> | Couleur du fichier actif. |
  | <code>&#45;&#45;tp-file-tree-dirty-color</code> | <code>#d97706</code> | Couleur du marqueur dirty. |
  | <code>&#45;&#45;tp-file-tree-icon-size</code> | <code>1rem</code> | Taille des icônes de fichiers. |
  | <code>&#45;&#45;tp-file-tree-open-color</code> | <code>inherit</code> | Couleur des fichiers ouverts. |
  | <code>&#45;&#45;tp-file-tree-selected-bg</code> | <code>color-mix(in srgb, currentColor 8%, transparent)</code> | Couleur de fond du chemin sélectionné. |
  [CSS properties of `<tp-file-tree>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_file-tree.TpFileTree.html)
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
