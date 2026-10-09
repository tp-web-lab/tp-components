# <tp-icon name="markdown-viewer" library="components" size="1.25em"></tp-icon> Markdown viewer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markdown-viewer>` element implements the <tp-icon name="markdown-viewer" library="components" size="1.25em"></tp-icon> Markdown viewer functionality: interactive Markdown viewer with editable source and parser outputs.

<tp-markdown-viewer>
      <script type="tp/markdown">
        # Live Markdown

        Edit this source and select **Run**.
      </script>
    </tp-markdown-viewer>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Code | The viewer initially displays the result. **Code** shows or hides the source editor; edit the source there, then use **Run** to update the result. **Reset** restores the initial source. |
| HTML | In the output toolbar, **HTML**, **Generated HTML** (the code icon) and **Tree** switch between the rendered page, the parser's generated HTML in a read-only editor, and its syntax tree. |
| Using the component | This is separate from the source-editor toggle and is not available in lite mode. |
| :tp-icon:{name="code" size="1.25em"} Code | Shows or hides the source editor. |
| :tp-icon:{name="keyboard-f1" size="1.25em"} Editor toolbar | Shows or hides the toolbar of every visible code editor. |
| :tp-icon:{name="eye-outline" size="1.25em"} Render | Shows or hides the rendered output. |
| :tp-icon:{name="refresh" size="1.25em"} Reset | Restores the initially loaded content. |
| :tp-icon:{name="play" size="1.25em"} Run | Renders the current source. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

#### Initial viewer content

::: tp-tabs
no content
: ```html
  <tp-markdown-viewer></tp-markdown-viewer>
  ```

internal script
: ```html
  <tp-markdown-viewer>
    <script type="tp/markdown">
      # Live Markdown

      Edit this source and select **Run**.

      - First item
      - Second item
    </script>
  </tp-markdown-viewer>
  ```
  The internal script may use `type="tp/markdown"` (recommended) or
  `type="tp/markdown-viewer"`.

  Consecutive fenced `example` blocks become independently selectable examples. Use `label` to
  define the selector label.

  ````html
  <tp-markdown-viewer>
    <script type="tp/markdown">
      ``` example {label="Paragraph and list"}
      A paragraph with **strong text** and *emphasis*.

      - Alpha
      - Beta
      ```

      ``` example {label="Table"}
      | Language | Purpose |
      | --- | --- |
      | Markdown | Technical writing |
      | HTML | Web documents |
      ```
    </script>
  </tp-markdown-viewer>
  ````

external file
: ```html
  <tp-markdown-viewer src="./example.md"></tp-markdown-viewer>
  ```
  Relative URLs are resolved from the current documentation source.

  The **src** attribute also accepts a comma-separated list of files. Each file becomes a
  selectable example and its file name is used as the label.

  ```html
  <tp-markdown-viewer src="./introduction.md, ./tables.md"></tp-markdown-viewer>
  ```
:::

#### Lite viewer

Add `lite` for a compact viewer that processes only the first example and initially displays
only its rendered HTML. Its single toolbar toggles the code and output panes independently and
provides Reset and Run commands.

```html
<tp-markdown-viewer lite>
  <script type="tp/markdown">
    Hello **Markdown**.
  </script>
</tp-markdown-viewer>
```

<tp-markdown-viewer lite>
  <script type="tp/markdown">
    Hello **Markdown**.
  </script>
</tp-markdown-viewer>

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied markdown example and open the source panel to compare it with the code.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Multiple examples
: Switch between the named examples and compare their source and rendered output.
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
<!-- tp-docgen:api TpMarkdownViewer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>lite</code> | <code>boolean</code> | <code>false</code> | Uses the compact single-example viewer with rendered HTML output. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated URLs of external Markdown example files. |
  [Attributes of `<tp-markdown-viewer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMarkdownViewer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-markdown-viewer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-markdown-viewer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_markdown-viewer.TpMarkdownViewer.html)
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
  <script type="module" src="/path/to/components/markdown-viewer/markdown-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/markdown-viewer/markdown-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markdown-viewer/markdown-viewer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markdown-viewer>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-object-tree
@summary Specialized tree for inspecting JavaScript values.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-html-viewer>`](../html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-object-tree>`](../object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
