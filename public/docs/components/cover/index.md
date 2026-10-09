# <tp-icon name="cover" library="components" size="1.25em"></tp-icon> Cover

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-cover>` element implements the <tp-icon name="cover" library="components" size="1.25em"></tp-icon> Cover functionality: creates a vertical cover layout with an optional centered heading element.

<tp-box>
  <tp-cover min-height="16rem" heading="h2">
    <p>A short introduction</p>
    <h2>A heading centered in the cover</h2>
    <p>Supporting information stays below.</p>
  </tp-cover>
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

Use `<tp-cover>` as shown below.

```html
<tp-cover></tp-cover>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the cover and inspect the centered heading between its introductory and supporting content.

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
<!-- tp-docgen:api TpCover -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>gap</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Gap between direct children. When absent, uses the --tp-cover-gap CSS default. |
  | <code>heading</code> | <code>string</code> | <code>&quot;&quot;</code> | Simple CSS selector (for example h2, .hero or #title) identifying a direct child to center vertically in the available space, not the heading text. Empty by default: no child is selected for centering. |
  | <code>min-height</code> | <code>string</code> | <code>&quot;100vh&quot;</code> | Minimum block size of the cover. When absent, uses the --tp-cover-min-height CSS default. |
  | <code>padding</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Padding applied inside the cover. When absent, uses the --tp-cover-padding CSS default. |
  [Attributes of `<tp-cover>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCover`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-cover>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-cover-gap</code> | <code>1rem</code> | Default gap between direct children. |
  | <code>&#45;&#45;tp-cover-min-height</code> | <code>100vh</code> | Default minimum block size. |
  | <code>&#45;&#45;tp-cover-padding</code> | <code>1rem</code> | Default inner padding. |
  [CSS properties of `<tp-cover>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_cover_cover.TpCover.html)
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
  <script type="module" src="/path/to/components/cover/cover.js"></script>
  ```

import
: ```js
  import "/path/to/components/cover/cover.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/cover/cover.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-cover>` are loaded automatically by this component if they have not already been loaded by another component.

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
