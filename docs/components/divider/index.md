# <tp-icon name="divider" library="components" size="1.25em"></tp-icon> Divider

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-divider>` element implements the <tp-icon name="divider" library="components" size="1.25em"></tp-icon> Divider functionality: visual separator.

<tp-box>
      <p>Primary content group.</p>
      <tp-divider></tp-divider>
      <p>Secondary content group.</p>
    </tp-box>

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

<p>Below the divider.</p>
</tp-box>

`<tp-divider>` draws a horizontal or vertical line. It is useful in menus,
dropdowns, toolbars, and compact layouts where a real separator is preferable
to an empty list item or decorative text.

Use the default horizontal divider between blocks:

```html
<p>First group</p>
<tp-divider></tp-divider>
<p>Second group</p>
```

Use `orientation="vertical"` between inline controls:

```html
<tp-toolbar>
  <tp-icon-button name="copy" label="Copy"></tp-icon-button>
  <tp-divider orientation="vertical"></tp-divider>
  <tp-icon-button name="paste" label="Paste"></tp-icon-button>
</tp-toolbar>
```

The divider exposes CSS properties for its color, thickness, and margins.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the horizontal separation between two content groups.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Custom style
: Inspect a divider with customized visual styling.

Dropdown menu
: Open the dropdown to inspect the divider separating menu actions.
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
<!-- tp-docgen:api TpDivider -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>orientation</code> | <code>string</code> | <code>&quot;horizontal&quot;</code> | Divider orientation (`horizontal` or `vertical`). |
  [Attributes of `<tp-divider>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpDivider`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-divider>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-divider-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft, #d1d5db)</code> | Divider line color. |
  | <code>&#45;&#45;tp-divider-margin-block</code> | <code>0.125rem</code> | Block margin around the divider. |
  | <code>&#45;&#45;tp-divider-margin-inline</code> | <code>0</code> | Inline margin around the divider. |
  | <code>&#45;&#45;tp-divider-thickness</code> | <code>1px</code> | Divider line thickness. |
  [CSS properties of `<tp-divider>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_divider.TpDivider.html)
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
  <script type="module" src="/path/to/components/divider/divider.js"></script>
  ```

import
: ```js
  import "/path/to/components/divider/divider.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/divider/divider.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-divider>` are loaded automatically by this component if they have not already been loaded by another component.

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
