# <tp-icon name="badge" library="components" size="1.25em"></tp-icon> Badge

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-badge>` element implements the <tp-icon name="badge" library="components" size="1.25em"></tp-icon> Badge functionality: compact status label. 

<p>
  Build status: <tp-badge variant="success" pulse>Ready</tp-badge>
  <tp-badge outlined><tp-icon name="file_type_vite" library="languages"></tp-icon> Vite<tp-divider orientation="vertical"></tp-divider>8.1.5</tp-badge>
</p>

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

Use `<tp-badge>` for short metadata, statuses, counters, or labels that should stay visually compact.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Observe the pulsing build status and the outlined Vite version badge, which combines an icon, text and a vertical divider.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

With icon
: Inspect how an inline icon accompanies the badge text.
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
<!-- tp-docgen:api TpBadge -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>outlined</code> | <code>boolean</code> | <code>false</code> | Removes the filled background and uses the accent color for the border and text. |
  | <code>pill</code> | <code>boolean</code> | <code>false</code> | Uses a fully rounded badge shape. |
  | <code>pulse</code> | <code>boolean</code> | <code>false</code> | Makes the badge pulse to attract attention. |
  | <code>size</code> | <code>TpSizeType</code> | <code>m</code> | Badge size (`xxs`, `xs`, `s`, `m`, `l`, `xl`, or `xxl`). |
  | <code>variant</code> | <code>TpVariantType</code> | <code>neutral</code> | Visual variant (`success`, `danger`, `warning`, `info`, `neutral`, or `brand`). |
  [Attributes of `<tp-badge>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpBadge`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-badge>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-badge-accent</code> | <code>var(&#45;&#45;tp-brand-text-colorful)</code> | Accent color. |
  | <code>&#45;&#45;tp-badge-background</code> | <code>transparent</code> | Background color. |
  | <code>&#45;&#45;tp-badge-border-color</code> | <code>var(&#45;&#45;tp-badge-accent)</code> | Border color. |
  | <code>&#45;&#45;tp-badge-font-size</code> | <code>1.125em</code> | Font size. |
  | <code>&#45;&#45;tp-badge-foreground</code> | <code>var(&#45;&#45;tp-badge-accent)</code> | Text color. |
  | <code>&#45;&#45;tp-badge-padding-block</code> | <code>0.6em</code> | Block padding. |
  | <code>&#45;&#45;tp-badge-padding-inline</code> | <code>1em</code> | Inline padding. |
  | <code>&#45;&#45;tp-badge-radius</code> | <code>999em</code> | Border radius. |
  [CSS properties of `<tp-badge>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_badge.TpBadge.html)
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
  <script type="module" src="/path/to/components/badge/badge.js"></script>
  ```

import
: ```js
  import "/path/to/components/badge/badge.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/badge/badge.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-badge>` are loaded automatically by this component if they have not already been loaded by another component.

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
