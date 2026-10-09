# <tp-icon name="tooltip" library="components" size="1.25em"></tp-icon> Tooltip

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-tooltip>` element implements the <tp-icon name="tooltip" library="components" size="1.25em"></tp-icon> Tooltip functionality: displays anchored tooltip content.

<tp-box data-intro-action="tooltip" data-allow-script>
  <tp-button id="intro-tooltip-trigger" data-demo-trigger>Hover or focus for help</tp-button>
  <tp-tooltip anchor="#intro-tooltip-trigger">This help also appears when the trigger receives keyboard focus.</tp-tooltip>
  <p data-demo-status role="status">Try the tooltip using its trigger.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Hover over the associated control | Show its explanation. The tooltip is not an actionable control. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus the associated control to show its explanation. |
| Escape | Closes the tooltip. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-tooltip>` as shown below.

```html
<tp-tooltip></tp-tooltip>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover over or focus the trigger to reveal the contextual help.

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
<!-- tp-docgen:api TpTooltip -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the anchor element. |
  | <code>offset</code> | <code>string</code> | <code>&quot;8px&quot;</code> | Distance between the anchor and the tooltip. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Opens the tooltip. |
  | <code>outside-click</code> | <code>boolean</code> | <code>false</code> | Keeps outside-click state in the emitted toggle detail. |
  | <code>placement</code> | <code>TpTooltipPlacement</code> | <code>&quot;top&quot;</code> | Tooltip placement relative to the anchor. |
  [Attributes of `<tp-tooltip>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpTooltip`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-tooltip-toggle</code> | <code>&#123; backdrop: boolean; open: boolean; outsideClick: boolean; anchor: string; placement: &quot;top&quot; \| &quot;end&quot; \| &quot;bottom&quot; \| &quot;start&quot; &#125;</code> | Emitted when the tooltip open state changes. |
  [Events emitted by `<tp-tooltip>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-tooltip>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_tooltip.TpTooltip.html)
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
  <script type="module" src="/path/to/components/tooltip/tooltip.js"></script>
  ```

import
: ```js
  import "/path/to/components/tooltip/tooltip.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tooltip/tooltip.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-tooltip>` are loaded automatically by this component if they have not already been loaded by another component.

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
