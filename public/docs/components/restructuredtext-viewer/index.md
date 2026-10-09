# <tp-icon name="restructuredtext-viewer" library="components" size="1.25em"></tp-icon> reStructuredText viewer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-restructuredtext-viewer>` element implements the <tp-icon name="restructuredtext-viewer" library="components" size="1.25em"></tp-icon> reStructuredText viewer functionality: interactive reStructuredText viewer with editable source and parser outputs.

<tp-restructuredtext-viewer>
        <script type="tp/restructuredtext">
          Live reStructuredText
          =====================

          Edit this source and select **Run**.

          * First item
          * Second item
        </script>
      </tp-restructuredtext-viewer>

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
  <tp-restructuredtext-viewer></tp-restructuredtext-viewer>
  ```

internal script
: ```html
  <tp-restructuredtext-viewer>
    <script type="tp/restructuredtext">
      Live reStructuredText
      =====================

      Edit this source and select **Run**.

      * First item
      * Second item
    </script>
  </tp-restructuredtext-viewer>
  ```
  The internal script may use `type="tp/restructuredtext"` (recommended) or
  `type="tp/restructuredtext-viewer"`. It prevents the browser from
  interpreting the source as HTML before the component is initialized.

  Consecutive `.. example:: Label` directives become independently selectable examples. The
  directive argument is used as the selector label and its content becomes the editable source.

  ```html
  <tp-restructuredtext-viewer>
    <script type="tp/restructuredtext">
      .. example:: Paragraph and list

         A paragraph with **strong text** and *emphasis*.

         * Alpha
         * Beta

      .. example:: Table

         ================  =================
         Language          Purpose
         ================  =================
         reStructuredText  Technical writing
         HTML              Web documents
         ================  =================
    </script>
  </tp-restructuredtext-viewer>
  ```

external file
: ```html
  <tp-restructuredtext-viewer src="./example.rst"></tp-restructuredtext-viewer>
  ```
  Relative URLs are resolved from the current documentation source.

  The **src** attribute also accepts a comma-separated list of files. Each file becomes a
  selectable example and its file name is used as the label.

  ```html
  <tp-restructuredtext-viewer
    src="./introduction.rst, ./tables.rst"
  ></tp-restructuredtext-viewer>
  ```
:::

#### Lite viewer

Add `lite` for a compact viewer that processes only the first example and initially displays
only its rendered HTML. Its single toolbar toggles the code and output panes independently and
provides Reset and Run commands.

```html
<tp-restructuredtext-viewer lite>
  <script type="tp/restructuredtext">
    Hello **reStructuredText**.
  </script>
</tp-restructuredtext-viewer>
```

<tp-restructuredtext-viewer lite>
  <script type="tp/restructuredtext">
    Hello **reStructuredText**.
  </script>
</tp-restructuredtext-viewer>

#### Python doctests

Add `doctest` to execute standard Python doctest blocks in the rendered panel. The check remains
opt-in because it executes the Python prompts contained in the reStructuredText source.

```html
<tp-restructuredtext-viewer lite doctest>
  <script type="tp/restructuredtext">
    >>> print(6 * 7)
    42
  </script>
</tp-restructuredtext-viewer>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied restructuredtext example and open the source panel to compare it with the code.

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
<!-- tp-docgen:api TpRestructuredTextViewer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>doctest</code> | <code>boolean</code> | <code>false</code> | Runs standard Python doctest blocks in rendered output. |
  | <code>lite</code> | <code>boolean</code> | <code>false</code> | Uses the compact single-example viewer with rendered HTML output. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated URLs of external reStructuredText example files. |
  [Attributes of `<tp-restructuredtext-viewer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpRestructuredTextViewer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-restructuredtext-viewer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-restructuredtext-viewer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_restructuredtext-viewer.TpRestructuredTextViewer.html)
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
  <script type="module" src="/path/to/components/restructuredtext-viewer/restructuredtext-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/restructuredtext-viewer/restructuredtext-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/restructuredtext-viewer/restructuredtext-viewer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-restructuredtext-viewer>` are loaded automatically by this component if they have not already been loaded by another component.

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
@tp-dependency tp-object-tree
@summary Specialized tree for inspecting JavaScript values.
-->
<!--
@tp-dependency tp-restructuredtext
@summary reStructuredText rendering component.
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
- [`<tp-object-tree>`](../object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-restructuredtext>`](../restructuredtext/index.md) : reStructuredText rendering component.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.

### External

<!--
@credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
@summary reStructuredText parsing and rendering.
-->

- [tp-restructuredtext](https://www.npmjs.com/package/@tp/tp-restructuredtext) : reStructuredText parsing and rendering.
<!-- tp-docgen:dependencies:end -->
