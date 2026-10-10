# <tp-icon name="python-viewer" library="components" size="1.25em"></tp-icon> Python Viewer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-python-viewer>` element implements the <tp-icon name="python-viewer" library="components" size="1.25em"></tp-icon> Python Viewer functionality: displays and runs one Python example in a compact interface.

<tp-python-viewer src="/docs/components/_shared/intro-projects/python.json"></tp-python-viewer>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Code | The viewer initially displays the result. **Code** shows or hides the source editor; edit the source there, then use **Run** to update the result. **Reset** restores the initial source. |
| :tp-icon:{name="code" size="1.25em"} Code | Shows or hides the source editor. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the toolbar of every visible code editor. |
| :tp-icon:{name="eye-outline" size="1.25em"} Render | Shows or hides the rendered result. |
| :tp-icon:{name="terminal" size="1.25em"} Console | Shows or hides the console; output opens it automatically. |
| :tp-icon:{name="refresh" size="1.25em"} Reset | Restores the initially loaded project. |
| :tp-icon:{name="play" size="1.25em"} Run | Executes the current project. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The `src` attribute accepts either a JSON project or a single python source file (`.py`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-python-viewer src="/docs/components/_shared/single-source/example.py"></tp-python-viewer>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files produce a console error. Existing JSON sources, including extensionless URLs, remain supported.

#### Initial viewer content

::: tp-tabs
no content
: ```html
  <tp-python-viewer></tp-python-viewer>
  ```
  Without explicit content, the viewer opens its default Python example.

internal script
: ```html
  <tp-python-viewer>
    <script type="tp/python">
      message = "Hello Python"
      print(message)
    </script>
  </tp-python-viewer>
  ```
  The internal script may use `type="tp/python"` (recommended) or
  `type="tp/python-viewer"`. Its content is dedented before it replaces the project's main file.

external project
: ```html
  <tp-python-viewer src="./example.json"></tp-python-viewer>
  ```
  The `src` file describes the complete project, including its entry point and files.

project directory
: ```html
  <tp-python-viewer repository="./example/"></tp-python-viewer>
  ```
  The `repository` directory contains the project metadata and files.
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied python example and open the source panel to compare it with the code.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

src
: Inspect the output produced by loading the external source file.

script
: Inspect the output produced from the embedded source script.

matplotlib
: Run the Python example and inspect the plot produced by Matplotlib.

error
: Run the intentionally failing example and inspect the reported error.

Single source file
: Load the standalone python file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
<!-- tp-docgen:api TpPythonViewer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>repository</code> | <code>string</code> | <code>&quot;&quot;</code> | Directory containing a project to load. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON project or python source file to load. |
  [Attributes of `<tp-python-viewer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpPythonViewer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-playground-repository-load</code> | <code>&#123; repository: string; project: TpProject &#125;</code> | Emitted after a project configured with `repository` has loaded. |
  | <code>tp-playground-src-load</code> | <code>&#123; src: string; project: TpProject &#125;</code> | Emitted after a project configured with `src` has loaded. |
  [Events emitted by `<tp-python-viewer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-python-viewer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_python-viewer.TpPythonViewer.html)
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
  <script type="module" src="/path/to/components/python-viewer/python-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/python-viewer/python-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/python-viewer/python-viewer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-python-viewer>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-python-playground
@summary Python playground component.
-->

- [`<tp-python-playground>`](../python-playground/index.md) : Python playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
