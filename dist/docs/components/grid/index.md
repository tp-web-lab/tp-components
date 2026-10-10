# <tp-icon name="grid" library="components" size="1.25em"></tp-icon> Grid

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-grid>` element implements the <tp-icon name="grid" library="components" size="1.25em"></tp-icon> Grid functionality: creates an auto-fit responsive grid with configurable minimum column width and gap.

<tp-grid min-width="12rem" gap="1rem">
  <tp-box>First column</tp-box>
  <tp-box>Second column</tp-box>
  <tp-box>Third column</tp-box>
</tp-grid>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component organizes or presents content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `tp-grid` for a responsive collection of cards or panels with equal-width columns aligned across rows. It creates as many columns as fit, using `min-width` (default `250px`) as the minimum column width and distributing the remaining space equally. Columns can shrink below this minimum when the container itself is narrower. The default `gap` is `1rem`.

Unlike `tp-grid`, `tp-cluster` arranges items in a wrapping flex row: items normally keep their content-based widths, and each row is laid out independently. Use `tp-cluster` for buttons, tags or other differently sized items; use `tp-grid` when consistent columns matter.

```html
<tp-grid></tp-grid>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example and observe the arrangement of its three columns.

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
<!-- tp-docgen:api TpGrid -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>gap</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Gap between grid cells. When absent, uses the --tp-grid-gap CSS default. |
  | <code>min-width</code> | <code>string</code> | <code>&quot;250px&quot;</code> | Minimum column width used by the responsive grid template, limited to the available container width. When absent, uses the --tp-grid-min-width CSS default. |
  [Attributes of `<tp-grid>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpGrid`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-grid>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-grid-gap</code> | <code>1rem</code> | Default gap between grid cells. |
  | <code>&#45;&#45;tp-grid-min-width</code> | <code>250px</code> | Default minimum column width. |
  [CSS properties of `<tp-grid>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_grid.TpGrid.html)
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
  <script type="module" src="/path/to/components/grid/grid.js"></script>
  ```

import
: ```js
  import "/path/to/components/grid/grid.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/grid/grid.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-grid>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
