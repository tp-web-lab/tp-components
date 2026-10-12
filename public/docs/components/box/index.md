# <tp-icon name="box" library="components" size="1.25em"></tp-icon> Box

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-box>` element implements the <tp-icon name="box" library="components" size="1.25em"></tp-icon> Box functionality: wraps content in a configurable bordered box.

<tp-box>
  The custom HTML element <code>&lt;tp-box&gt;</code> wraps its content in various ways.
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

To border a fragment of HTML, simply wrap it in the `<tp-box>` element.

``` html
<p>Here is a paragraph.</p>

<tp-box>
  <p>Here is a paragraph enclosed within the <code>tp-box</code> element.</p>
</tp-box>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the box encloses its content with spacing and a border.

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
<!-- tp-docgen:api TpBox -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>border-radius</code> | <code>string</code> | <code>&quot;0px&quot;</code> | Border radius applied to the box. When absent, uses --tp-box-border-radius with a 0px fallback. |
  | <code>border-width</code> | <code>string</code> | <code>&quot;1px&quot;</code> | Border width applied to the box. When absent, uses --tp-box-border-width with a 1px fallback. |
  | <code>invert</code> | <code>boolean</code> | <code>false</code> | Uses an inverted surface with contrasting text. |
  | <code>padding</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Padding applied inside the box. When absent, uses --tp-box-padding with a 1rem fallback. |
  [Attributes of `<tp-box>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpBox`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-box>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-box-background</code> | <code>white</code> | Default box background. |
  | <code>&#45;&#45;tp-box-border-radius</code> | <code>0px</code> | Default border radius. |
  | <code>&#45;&#45;tp-box-border-width</code> | <code>1px</code> | Default border width. |
  | <code>&#45;&#45;tp-box-color</code> | <code>var(&#45;&#45;tp-neutral-900)</code> | Default box text color. |
  | <code>&#45;&#45;tp-box-padding</code> | <code>1rem</code> | Default inner padding. |
  [CSS properties of `<tp-box>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_box.TpBox.html)
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
  <script type="module" src="/path/to/components/box/box.js"></script>
  ```

import
: ```js
  import "/path/to/components/box/box.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/box/box.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-box>` are loaded automatically by this component if they have not already been loaded by another component.

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
