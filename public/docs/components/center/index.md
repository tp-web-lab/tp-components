# <tp-icon name="center" library="components" size="1.25em"></tp-icon> Center

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-center>` element implements the <tp-icon name="center" library="components" size="1.25em"></tp-icon> Center functionality: centers content within a configurable maximum inline size.

<tp-center intrinsic="">
      <tp-box>Centered content</tp-box>
    </tp-center>

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

Wrap intrinsically sized content in `<tp-center intrinsic>` to center it within the available inline space.

```html
<tp-center intrinsic>
  <tp-box>Centered content</tp-box>
</tp-center>
```

Use `max-inline-size` to constrain and center a wider region. Use `center-text` to center inline text inside that region.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the available area and observe how the content remains centered.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Constrained region
: Compare the same text in two visibly outlined containers with centered regions limited to 18rem and 36rem. The narrower region wraps onto more lines; resize the preview to see both regions adapt to the available width.
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
<!-- tp-docgen:api TpCenter -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>center-text</code> | <code>boolean</code> | <code>false</code> | Centers inline text content with `text-align: center`. |
  | <code>intrinsic</code> | <code>boolean</code> | <code>false</code> | Sizes children intrinsically by centering them in a column flex layout. |
  | <code>max-inline-size</code> | <code>string</code> | <code>&quot;60ch&quot;</code> | Maximum inline size applied to the centered container. When absent, uses the --tp-center-width CSS default. |
  | <code>padding-inline</code> | <code>string</code> | <code>&quot;0px&quot;</code> | Symmetric inline padding applied to the centered container. |
  [Attributes of `<tp-center>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCenter`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-center>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-center-width</code> | <code>60ch</code> | Default maximum inline size when `max-inline-size` is not set. |
  [CSS properties of `<tp-center>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_center.TpCenter.html)
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
  <script type="module" src="/path/to/components/center/center.js"></script>
  ```

import
: ```js
  import "/path/to/components/center/center.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/center/center.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-center>` are loaded automatically by this component if they have not already been loaded by another component.

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
