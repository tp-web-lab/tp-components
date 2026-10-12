# <tp-icon name="typescript-notebook" library="components" size="1.25em"></tp-icon> TypeScript Notebook

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-typescript-notebook>` element implements the <tp-icon name="typescript-notebook" library="components" size="1.25em"></tp-icon> TypeScript Notebook functionality: interactive notebook combining markup and executable code cells.

<tp-typescript-notebook>
    <script type="tp/markdown"># Interactive TypeScript

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
    <script type="tp/typescript">const language: string = 'TypeScript';
console.log(`Hello from ${language}`);</script>
  </tp-typescript-notebook>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Edit the notebook's blocks and run programming cells to see their results. |
| Using the component | In editor mode, select a block to move, duplicate or delete it. |
| Using the component | Preview displays the document; Export HTML saves an HTML version. |
| :tp-icon:{name="file-settings" size="1.25em"} Files | Loads, saves, imports, or exports a notebook. |
| :tp-icon:{name="plus-box-outline" size="1.25em"} Markup + | Adds a markup cell in the selected language. |
| :tp-icon:{name="plus-box-outline" size="1.25em"} Language + | Adds a programming cell; specialized notebooks use their fixed language. |
| :tp-icon:{name="arrow-up" size="1.25em"} :tp-icon:{name="arrow-down" size="1.25em"} Move up / Move down | Moves the selected cell. |
| :tp-icon:{name="content-copy" size="1.25em"} Duplicate | Duplicates the selected cell. |
| :tp-icon:{name="delete-outline" size="1.25em"} Delete | Deletes the selected cell. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the toolbar of the selected cell's code editor. |
| :tp-icon:{name="refresh" size="1.25em"} Reset | Restores the initially loaded notebook. |
| :tp-icon:{name="eye-outline" size="1.25em"} :tp-icon:{name="pencil" size="1.25em"} Preview / Edit | Toggles between the final rendered document and the cell editor. |
| :tp-icon:{name="play-all" size="1.25em"} Run all cells | Executes every programming cell in document order. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive TypeScript viewers.

#### Initial notebook content

::: tp-tabs
no content
: ```html
  <tp-typescript-notebook></tp-typescript-notebook>
  ```

inline scripts
: ```html
  <tp-typescript-notebook>
    <script type="tp/markdown"># TypeScript</script>
    <script type="tp/typescript">const message: string = 'Hello'; console.log(message);</script>
  </tp-typescript-notebook>
  ```

external file
: ```html
  <tp-typescript-notebook src="./notebook.json"></tp-typescript-notebook>
  ```

repository
: ```html
  <tp-typescript-notebook repository="./notebook/"></tp-typescript-notebook>
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the typescript notebook cells and inspect their outputs.
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
<!-- tp-docgen:api TpTypescriptNotebook -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-typescript-notebook>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpTypescriptNotebook`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-typescript-notebook>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-typescript-notebook>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_typescript-notebook.TpTypescriptNotebook.html)
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
  <script type="module" src="/path/to/components/typescript-notebook/typescript-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/typescript-notebook/typescript-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typescript-notebook/typescript-notebook.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-typescript-notebook>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-notebook
@summary Interactive notebook combining markup and executable code cells.
-->

- [`<tp-notebook>`](../notebook/index.md) : Interactive notebook combining markup and executable code cells.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
