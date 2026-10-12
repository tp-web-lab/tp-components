# <tp-icon name="notebook" library="components" size="1.25em"></tp-icon> Notebook

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-notebook>` element implements the <tp-icon name="notebook" library="components" size="1.25em"></tp-icon> Notebook functionality: combines editable markup cells and executable programming-language cells.

<tp-notebook>
  <script type="tp/markdown">
    # Notebook example
    Here is a notebook that combines Asciidoc, HTML, Markdown and reStructuredText as markup languages, and Python and JavaScript as programming languages.

    ## Calculation
    We perform a simple multiplication in Python to demonstrate the calculation.
  </script>
  <script type="tp/python">
    x = 6 * 7
    print(x)
  </script>
  <script type="tp/restructuredtext" doctest>
    .. h2::

       Verification

    We use the doctest blocks in reStructuredText to verify the output of the Python code.

    >>> print(6 * 7)
    42
  </script>
  <script type="tp/html">
    In JavaScript, we would have written the following code:
  </script>
  <script type="tp/javascript">
    const x = 6 * 7;
    console.log(x)
  </script>
  <script type="tp/asciidoc">
    == Result
    The result of the multiplication is displayed using Asciidoc and Mathjax:

    latexmath:[x = 6 * 7 = 42]
  </script>
</tp-notebook>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Edit the notebook's blocks and run programming cells to see their results. |
| Using the component | In editor mode, select a block to move, duplicate or delete it. |
| Using the component | Preview displays the document; Export HTML saves an HTML version. |
| Using the component | In editor mode, select a block to move, duplicate, or delete it. |
| Using the component | The Markup dropdown adds markup blocks, while the generic notebook's Language dropdown adds programming blocks. |
| Using the component | In a language-specific notebook, this dropdown is replaced by a button showing the language icon, its name, and a plus sign. |
| Using the component | Markup blocks use their lite viewers, and programming blocks retain their complete interactive viewers. |
| Using the component | The `Files` dropdown next to the title loads notebook JSON, imports a previously exported HTML document, and provides `Save`, `Save as…`, and `Export HTML`. |
| Using the component | The `eye-outline` toggle replaces the cells with the final document directly inside the notebook; its icon becomes `pencil` to return to the cell editor. |
| Using the component | Preview and exported HTML turn markup blocks into rendered HTML, preserve interactive programming blocks, and remove the notebook editing controls. |
| Using the component | Exported HTML keeps non-executable notebook metadata so it can be imported again for editing. |
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

The generic `<tp-notebook>` accepts JavaScript, Prolog, Python, SQL, and TypeScript cells in the same notebook and detects each language from its script type. Cells may come from direct `script` children, a JSON `src`, or a `repository` directory. Specialized notebook elements restrict code cells to their own language.

Add `doctest` to a `script[type="tp/restructuredtext"]` cell to execute its standard Python
doctest blocks and display their pass or fail status in the rendered cell.

#### Initial notebook content

::: tp-tabs
no content
: ```html
  <tp-notebook></tp-notebook>
  ```

internal scripts
: ```html
  <tp-notebook>
    <script type="tp/markdown"># Calculation</script>
    <script type="tp/python">print(6 * 7)</script>
  </tp-notebook>
  ```

external file
: ```html
  <tp-notebook src="./notebook.json"></tp-notebook>
  ```

repository
: ```html
  <tp-notebook repository="./notebook/"></tp-notebook>
  ```
:::

Add `readonly` to preserve rendering, execution, and navigation while preventing changes to programming cells.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the notebook cells and inspect their outputs.

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
<!-- tp-docgen:api TpNotebook -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>language</code> | <code>string</code> | <code>&quot;javascript&quot;</code> | Programming language enforced by a specialized notebook. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Makes all notebook editors read-only and disables structural changes. |
  | <code>repository</code> | <code>string</code> | <code>&quot;&quot;</code> | Directory containing project.json and .files.json. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON notebook file. |
  [Attributes of `<tp-notebook>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpNotebook`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-notebook-change</code> | <code>&#123; cells: number &#125;</code> | Emitted after the cell collection changes. |
  | <code>tp-notebook-load</code> | <code>&#123; source: &quot;inline&quot; \| &quot;src&quot; \| &quot;repository&quot; \| &quot;file&quot;; cells: number &#125;</code> | Emitted after inline, src, or repository cells are loaded. |
  [Events emitted by `<tp-notebook>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-notebook>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_notebook.TpNotebook.html)
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
  <script type="module" src="/path/to/components/notebook/notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/notebook/notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/notebook/notebook.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-notebook>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-asciidoc-viewer
@summary Interactive AsciiDoc viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-html-viewer
@summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-javascript-viewer
@summary Compact JavaScript code viewer and runner.
-->
<!--
@tp-dependency tp-markdown-viewer
@summary Interactive Markdown viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-prolog-viewer
@summary Compact Prolog code viewer and runner.
-->
<!--
@tp-dependency tp-python-viewer
@summary Compact Python code viewer and runner.
-->
<!--
@tp-dependency tp-restructuredtext-viewer
@summary Interactive reStructuredText viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-sql-viewer
@summary Compact SQL code viewer and runner.
-->
<!--
@tp-dependency tp-typescript-viewer
@summary Compact TypeScript code viewer and runner.
-->

- [`<tp-asciidoc-viewer>`](../asciidoc-viewer/index.md) : Interactive AsciiDoc viewer with editable source and parser outputs.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-html-viewer>`](../html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-javascript-viewer>`](../javascript-viewer/index.md) : Compact JavaScript code viewer and runner.
- [`<tp-markdown-viewer>`](../markdown-viewer/index.md) : Interactive Markdown viewer with editable source and parser outputs.
- [`<tp-prolog-viewer>`](../prolog-viewer/index.md) : Compact Prolog code viewer and runner.
- [`<tp-python-viewer>`](../python-viewer/index.md) : Compact Python code viewer and runner.
- [`<tp-restructuredtext-viewer>`](../restructuredtext-viewer/index.md) : Interactive reStructuredText viewer with editable source and parser outputs.
- [`<tp-sql-viewer>`](../sql-viewer/index.md) : Compact SQL code viewer and runner.
- [`<tp-typescript-viewer>`](../typescript-viewer/index.md) : Compact TypeScript code viewer and runner.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
