# <tp-icon name="prolog-viewer" library="components" size="1.25em"></tp-icon> Prolog Viewer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-prolog-viewer>` element implements the <tp-icon name="prolog-viewer" library="components" size="1.25em"></tp-icon> Prolog Viewer functionality: displays and runs one Prolog example in a compact interface.

<tp-prolog-viewer src="/docs/components/_shared/intro-projects/prolog.json"></tp-prolog-viewer>

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

The `src` attribute accepts either a JSON project or a single prolog source file (`.pl`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-prolog-viewer src="/docs/components/_shared/single-source/example.pl"></tp-prolog-viewer>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files produce a console error. Existing JSON sources, including extensionless URLs, remain supported.

#### Initial viewer content

::: tp-tabs
no content
: ```html
  <tp-prolog-viewer></tp-prolog-viewer>
  ```
  Without explicit content, the viewer opens two empty editors: `program.pl` and `query.pl`.

script without filename
: ```html
  <tp-prolog-viewer>
    <script type="tp/prolog">
      parent(ada, byron).
      parent(byron, charles).

      grandparent(Grandparent, Grandchild) :-
        parent(Grandparent, Parent),
        parent(Parent, Grandchild).
    </script>
  </tp-prolog-viewer>
  ```
  A single script without `filename` initializes `program.pl`; the viewer creates an empty `query.pl` editor so the user can enter a query.

scripts with filename
: ```html
  <tp-prolog-viewer>
    <script type="tp/prolog" filename="program.pl">
      parent(ada, byron).
      parent(byron, charles).

      grandparent(Grandparent, Grandchild) :-
        parent(Grandparent, Parent),
        parent(Parent, Grandchild).
    </script>
    <script type="tp/prolog" filename="query.pl">
      grandparent(ada, Grandchild).
    </script>
  </tp-prolog-viewer>
  ```
  Internal scripts may use `type="tp/prolog"` (recommended) or `type="tp/prolog-viewer"`.
  Use `filename="program.pl"` and `filename="query.pl"` to initialize the two editors. Their content is dedented before it is added to the project.

external project
: ```html
  <tp-prolog-viewer src="./example.json"></tp-prolog-viewer>
  ```
  The `src` file describes the complete project, including its entry point and files.

  `example.json`:

  ```json
  {
    "name": "Prolog viewer example",
    "entry": "/program.pl",
    "query": "/query.pl",
    "files": [
      {
        "path": "/program.pl",
        "language": "prolog",
        "content": "parent(ada, byron).\nparent(byron, charles).\n\ngrandparent(Grandparent, Grandchild) :-\n  parent(Grandparent, Parent),\n  parent(Parent, Grandchild)."
      },
      {
        "path": "/query.pl",
        "language": "prolog",
        "content": "grandparent(ada, Grandchild)."
      }
    ]
  }
  ```

project directory
: ```html
  <tp-prolog-viewer repository="./example/"></tp-prolog-viewer>
  ```
  The `repository` directory contains the project metadata and files.

  `.files.json`:

  ```json
  {
    "files": [
      "program.pl",
      "query.pl"
    ]
  }
  ```

  `project.json`:

  ```json
  {
    "name": "Prolog repository example",
    "entry": "/program.pl",
    "query": "/query.pl"
  }
  ```

  `program.pl`:

  ```prolog
  parent(ada, byron).
  parent(byron, charles).

  grandparent(Grandparent, Grandchild) :-
    parent(Grandparent, Parent),
    parent(Parent, Grandchild).
  ```

  `query.pl`:

  ```prolog
  grandparent(ada, Grandchild).
  ```
:::

The Prolog viewer displays `program.pl` and `query.pl` in two labeled editors. Edit either file, then use **Run** to execute the current query against the current program.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied prolog example and open the source panel to compare it with the code.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

src
: Inspect the output produced by loading the external source file.

script without filename
: Inspect the output produced from the embedded source script.

scripts with filename
: Inspect the output produced from embedded scripts with explicit filenames.

error
: Run the intentionally failing example and inspect the reported error.

Single source file
: Load the standalone prolog file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
<!-- tp-docgen:api TpPrologViewer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>repository</code> | <code>string</code> | <code>&quot;&quot;</code> | Directory containing a project to load. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | JSON project or prolog source file to load. |
  [Attributes of `<tp-prolog-viewer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpPrologViewer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-playground-repository-load</code> | <code>&#123; repository: string; project: TpProject &#125;</code> | Emitted after a project configured with `repository` has loaded. |
  | <code>tp-playground-src-load</code> | <code>&#123; src: string; project: TpProject &#125;</code> | Emitted after a project configured with `src` has loaded. |
  [Events emitted by `<tp-prolog-viewer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-prolog-viewer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_prolog-viewer.TpPrologViewer.html)
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
  <script type="module" src="/path/to/components/prolog-viewer/prolog-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-viewer/prolog-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-viewer/prolog-viewer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-prolog-viewer>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-file-tree
@summary Displays an interactive file and folder tree.
-->
<!--
@tp-dependency tp-prolog-playground
@summary Prolog playground component.
-->

- [`<tp-file-tree>`](../file-tree/index.md) : Displays an interactive file and folder tree.
- [`<tp-prolog-playground>`](../prolog-playground/index.md) : Prolog playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
