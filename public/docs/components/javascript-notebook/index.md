# <tp-icon name="javascript-notebook" library="components" size="1.25em"></tp-icon> JavaScript Notebook

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-javascript-notebook>` element implements the <tp-icon name="javascript-notebook" library="components" size="1.25em"></tp-icon> JavaScript Notebook functionality: interactive notebook combining markup and executable code cells.

<tp-javascript-notebook>
    <script type="tp/markdown"># Interactive JavaScript

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.</script>
    <script type="tp/javascript">console.log('Hello from JavaScript');</script>
  </tp-javascript-notebook>

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

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive JavaScript viewers.

#### Initial notebook content

::: tp-tabs
no content
: ```html
  <tp-javascript-notebook></tp-javascript-notebook>
  ```

inline scripts
: ```html
  <tp-javascript-notebook>
    <script type="tp/markdown"># JavaScript</script>
    <script type="tp/javascript">console.log('Hello');</script>
  </tp-javascript-notebook>
  ```

external file
: ```html
  <tp-javascript-notebook src="./notebook.json"></tp-javascript-notebook>
  ```

repository
: ```html
  <tp-javascript-notebook repository="./notebook/"></tp-javascript-notebook>
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the javascript notebook cells and inspect their outputs.
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
<!-- tp-docgen:api TpJavascriptNotebook -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-javascript-notebook>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpJavascriptNotebook`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-javascript-notebook>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-javascript-notebook>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_javascript-notebook_javascript-notebook.TpJavascriptNotebook.html)
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
  <script type="module" src="/path/to/components/javascript-notebook/javascript-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/javascript-notebook/javascript-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/javascript-notebook/javascript-notebook.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-javascript-notebook>` are loaded automatically by this component if they have not already been loaded by another component.

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
