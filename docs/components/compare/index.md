# <tp-icon name="compare" library="components" size="1.25em"></tp-icon> Compare

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-compare>` element implements the <tp-icon name="compare" library="components" size="1.25em"></tp-icon> Compare functionality: before-and-after comparison component.

<tp-compare position="50%" before-label="Before" after-label="After" style="height: 12rem;">
  <tp-box slot="before" style="height: 100%; background: var(--tp-neutral-100);">Before: the original design</tp-box>
  <tp-box slot="after" style="height: 100%; background: var(--tp-brand-100);">After: the updated design</tp-box>
</tp-compare>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag | Drag the comparison handle to reveal more of either image or panel. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus the comparison handle. |
| Arrow keys | Moves the separator by 1%, or by 10% while Shift is held. |
| Home / End | Moves the separator to its minimum or maximum position. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Provide two overlapping children marked with `slot="before"` and `slot="after"`. The handle updates the percentage in `position`.

```html
<tp-compare position="50%" before-label="Before" after-label="After" style="height: 12rem">
  <div slot="before" style="width:100%;height:100%;background:#88b1a1"></div>
  <div slot="after" style="width:100%;height:100%;background:#e08d79"></div>
</tp-compare>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move the comparison handle to reveal more of the before or after content.

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
<!-- tp-docgen:api TpCompare -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>after-label</code> | <code>string</code> | <code>&#39;&#39;</code> | Optional label for the after layer. |
  | <code>before-label</code> | <code>string</code> | <code>&#39;&#39;</code> | Optional label for the before layer. |
  | <code>orientation</code> | <code>TpCompareOrientation</code> | <code>&#39;horizontal&#39;</code> | Comparator orientation.<br><br>- `horizontal` : séparation gauche / droite<br>- `vertical` : séparation haut / bas |
  | <code>position</code> | <code>string</code> | <code>&#39;&#39;</code> | Separator position as a percentage. |
  | <code>storage-key</code> | <code>string</code> | <code>&#39;&#39;</code> | Local persistence key for the position. |
  [Attributes of `<tp-compare>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Resets the position to its initial value. |
  [Public methods of `TpCompare`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-compare>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-compare-divider-size</code> | <code>2px</code> | Controls the divider size. |
  | <code>&#45;&#45;tp-compare-handle-size</code> | <code>2.5rem</code> | Controls the handle size. |
  | <code>&#45;&#45;tp-compare-position</code> | <code>50%</code> | Controls the position. |
  [CSS properties of `<tp-compare>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_compare.TpCompare.html)
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
  <script type="module" src="/path/to/components/compare/compare.js"></script>
  ```

import
: ```js
  import "/path/to/components/compare/compare.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/compare/compare.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-compare>` are loaded automatically by this component if they have not already been loaded by another component.

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
