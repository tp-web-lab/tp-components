# <tp-icon name="html-viewer" library="components" size="1.25em"></tp-icon> HTML viewer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-html-viewer>` element implements the <tp-icon name="html-viewer" library="components" size="1.25em"></tp-icon> HTML viewer functionality: interactive HTML viewer with editable source, live rendering, and DOM inspection.

<tp-html-viewer>
  <script type="tp/html">
<h2>Hello, HTML!</h2>
<p>This preview renders <strong>HTML content</strong>.</p>
  </script>
</tp-html-viewer>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Code | The viewer initially displays the result. **Code** shows or hides the source editor; edit the source there, then use **Run** to update the result. **Reset** restores the initial source. |
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
  <tp-html-viewer></tp-html-viewer>
  ```

internal script
: ```html
  <tp-html-viewer>
    <script type="tp/html">
      <h2>Live HTML</h2>
      <p>Edit this source and select <strong>Run</strong>.</p>
    </script>
  </tp-html-viewer>
  ```
  The internal script may use `type="tp/html"` (recommended) or its viewer-specific alias
  `type="tp/html-viewer"`.

  Consecutive `div[role="example"]` elements become independently selectable examples. Use the
  `label` attribute to define the selector label.

  ```html
  <tp-html-viewer>
    <script type="tp/html">
      <div role="example" label="Paragraph">
        <p>A paragraph with <strong>strong text</strong>.</p>
      </div>

      <div role="example" label="Button">
        <button type="button">Continue</button>
      </div>
    </script>
  </tp-html-viewer>
  ```

external file
: ```html
  <tp-html-viewer src="./example.html"></tp-html-viewer>
  ```
  Relative URLs inside the loaded document are resolved from the external file directory.
:::

#### Lite viewer

Add `lite` for a compact viewer that processes only the first example and initially displays
only its rendered HTML. Its single toolbar toggles the code and output panes independently and
provides Reset and Run commands.

```html
<tp-html-viewer lite>
  <script type="tp/html"><p>Hello <strong>HTML</strong>.</p></script>
</tp-html-viewer>
```

<tp-html-viewer lite>
  <script type="tp/html"><p>Hello <strong>HTML</strong>.</p></script>
</tp-html-viewer>

#### Manually imported components

Add `no-loader` when an executable example imports every dependency itself or defines a tutorial-only `tp-*` element in its script. This prevents the viewer from asking `tp-loader` to locate a production component module for that local tag.

```html
<tp-html-viewer allow-script no-loader>
  <!-- The example script imports or defines every component it uses. -->
</tp-html-viewer>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied html example and open the source panel to compare it with the code.

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
<!-- tp-docgen:api TpHtmlViewer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>allow-script</code> | <code>boolean</code> | <code>false</code> | Allows executable scripts in the rendered example. |
  | <code>lite</code> | <code>boolean</code> | <code>false</code> | Uses the compact single-example viewer with rendered HTML output. |
  | <code>no-loader</code> | <code>boolean</code> | <code>false</code> | Disables automatic tp-loader injection when the example manages its own imports. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the HTML file to load into the viewer. |
  [Attributes of `<tp-html-viewer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>setSource</code> | <code>setSource(source: string, baseHref: string \| null = null, resetSource = source): void</code> | Sets the HTML source from code. |
  [Public methods of `TpHtmlViewer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-html-viewer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-html-viewer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_html-viewer.TpHtmlViewer.html)
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
  <script type="module" src="/path/to/components/html-viewer/html-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/html-viewer/html-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/html-viewer/html-viewer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-html-viewer>` are loaded automatically by this component if they have not already been loaded by another component.

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
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-object-tree>`](../object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
