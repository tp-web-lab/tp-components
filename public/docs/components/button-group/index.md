# <tp-icon name="button-group" library="components" size="1.25em"></tp-icon> Button group

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-button-group>` element implements the <tp-icon name="button-group" library="components" size="1.25em"></tp-icon> Button group functionality: aPI documentation summary.

<tp-box data-page-navigation data-allow-script>
  <p>Use the grouped buttons to change the current page.</p>
  <tp-button-group attached aria-label="Page navigation">
    <tp-button data-previous disabled>Previous</tp-button>
    <tp-button data-next>Next</tp-button>
  </tp-button-group>
  <p data-page-status role="status">Page 1 of 5</p>
  <script src="/docs/components/button-group/examples/page-navigation.js"></script>
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

Use `orientation="vertical"` for a column, `attached` to join adjacent controls, and `stretch` to fill the available width.

```html
<tp-button-group attached>
  <tp-button>Previous</tp-button>
  <tp-button variant="primary">Next</tp-button>
</tp-button-group>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use Previous and Next to change the displayed page number.

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
<!-- tp-docgen:api TpButtonGroup -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>attached</code> | <code>boolean</code> | <code>false</code> | Attribute `attached`. |
  | <code>orientation</code> | <code>string</code> | <code>horizontal</code> | Attribute `orientation`. |
  | <code>stretch</code> | <code>boolean</code> | <code>false</code> | Attribute `stretch`. |
  [Attributes of `<tp-button-group>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpButtonGroup`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-button-group>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-button-group-gap</code> | <code>0</code> | Controls the gap. |
  [CSS properties of `<tp-button-group>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_button-group.TpButtonGroup.html)
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
  <script type="module" src="/path/to/components/button-group/button-group.js"></script>
  ```

import
: ```js
  import "/path/to/components/button-group/button-group.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/button-group/button-group.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-button-group>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
