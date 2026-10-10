# <tp-icon name="turtle" library="components" size="1.25em"></tp-icon> Turtle

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-turtle>` element implements the <tp-icon name="turtle" library="components" size="1.25em"></tp-icon> Turtle functionality: turtle DSL rendering component.

<tp-turtle width="420" height="220" label="A square">
    <script type="tp/turtle">
      turtle x=0 y=0 heading=0 speed=6
      forward 80
      right 90
      forward 80
      right 90
      forward 80
      right 90
      forward 80
    </script>
  </tp-turtle>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | View the drawing and use the available replay and download controls. |
| Replay | Runs the drawing program again. |
| Save SVG | Saves the generated drawing as SVG. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Write the drawing program in `<script type="tp/turtle">` or load it with `src`. The generated SVG can be replayed and downloaded.

#### Initial drawing content

::: tp-tabs
no content
: ```html
  <tp-turtle></tp-turtle>
  ```

internal script
: ```html
  <tp-turtle width="420" height="220" label="A square">
    <script type="tp/turtle">
      turtle x=0 y=0 heading=0 speed=6
      forward 80
      right 90
      forward 80
    </script>
  </tp-turtle>
  ```

external file
: ```html
  <tp-turtle src="./drawing.turtle"></tp-turtle>
  ```
:::

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the drawing produced by the supplied turtle instructions.

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
<!-- tp-docgen:api TpTurtle -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>background</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the background. |
  | <code>download-name</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the download name. |
  | <code>height</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the height. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the label. |
  | <code>replay-label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the replay label. |
  | <code>save-label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the save label. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the src. |
  | <code>width</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the width. |
  [Attributes of `<tp-turtle>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpTurtle`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-turtle>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-turtle>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_turtle.TpTurtle.html)
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
  <script type="module" src="/path/to/components/turtle/turtle.js"></script>
  ```

import
: ```js
  import "/path/to/components/turtle/turtle.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/turtle/turtle.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-turtle>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
