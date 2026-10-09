# <tp-icon name="toolbar" library="components" size="1.25em"></tp-icon> Toolbar

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-toolbar>` element implements the <tp-icon name="toolbar" library="components" size="1.25em"></tp-icon> Toolbar functionality: sticky, zoned toolbar for tp-* components.

<tp-box padding="0">
<tp-toolbar>
  <tp-icon section="start" name="home" aria-label="Home"></tp-icon>
  <tp-icon section="start" name="menu" aria-label="Menu"></tp-icon>
  <span section="center">Document</span>
  <tp-icon section="end" name="github" aria-label="GitHub"></tp-icon>
  <tp-icon section="end" name="settings" aria-label="Settings"></tp-icon>
  <tp-icon section="end" name="help" aria-label="Help"></tp-icon>
</tp-toolbar>
  <tp-box border-width="0" style="min-block-size: 5rem; display: grid; place-items: center">Document area</tp-box>
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

Assign children with `section="start"`, `section="center"`, or `section="end"`. Use `orientation` and `placement` to control the toolbar edge.

Use `top` or `bottom` with a horizontal toolbar, and `start` or `end` with a vertical toolbar. `placement` sets the sticky edge; the parent layout must place the toolbar on that side of the content. The Attributes example supplies this layout with a grid.

```html
<tp-toolbar style="inline-size: auto; min-inline-size: 0">
  <tp-icon section="start" name="home" aria-label="Home"></tp-icon>
  <tp-icon section="start" name="menu" aria-label="Menu"></tp-icon>
  <span section="center">Document</span>
  <tp-icon section="end" name="github" aria-label="GitHub"></tp-icon>
  <tp-icon section="end" name="settings" aria-label="Settings"></tp-icon>
  <tp-icon section="end" name="help" aria-label="Help"></tp-icon>
</tp-toolbar>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the document toolbar and the placement of its controls.

Attributes
: Choose horizontal with top or bottom, or vertical with start or end, and compare the toolbar around the document area. The example grid places the toolbar at the chosen edge; placement controls its sticky edge.
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
<!-- tp-docgen:api TpToolbar -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>orientation</code> | <code>string</code> | <code>&quot;horizontal&quot;</code> | `horizontal` (default) or `vertical`. |
  | <code>placement</code> | <code>string</code> | <code>&quot;top (horizontal) / start (vertical)&quot;</code> | `top` (default for horizontal) \| `bottom` \| `start` \| `end`. |
  [Attributes of `<tp-toolbar>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addButtonToSection</code> | <code>addButtonToSection(button: HTMLElement, section: string): void</code> | Adds button to section. |
  [Public methods of `TpToolbar`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-toolbar>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-toolbar-gap</code> | <code>0.25rem</code> | Controls the gap. |
  | <code>&#45;&#45;tp-toolbar-padding</code> | <code>0.25rem 0.5rem</code> | Controls the padding. |
  | <code>&#45;&#45;tp-toolbar-section-gap</code> | <code>0.25rem</code> | Controls the section gap. |
  | <code>&#45;&#45;tp-toolbar-size</code> | <code>3rem</code> | Controls the size. |
  | <code>&#45;&#45;tp-toolbar-z-index</code> | <code>100</code> | Controls the z index. |
  [CSS properties of `<tp-toolbar>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_toolbar.TpToolbar.html)
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
  <script type="module" src="/path/to/components/toolbar/toolbar.js"></script>
  ```

import
: ```js
  import "/path/to/components/toolbar/toolbar.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/toolbar/toolbar.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-toolbar>` are loaded automatically by this component if they have not already been loaded by another component.

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
