# <tp-icon name="popover" library="components" size="1.25em"></tp-icon> Popover

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-popover>` element implements the <tp-icon name="popover" library="components" size="1.25em"></tp-icon> Popover functionality: displays anchored popover content.

<tp-box data-intro-action="popover" data-allow-script>
  <tp-button id="intro-popover-trigger" data-demo-trigger>Show more information</tp-button>
  <tp-popover anchor="#intro-popover-trigger" outside-click><p>This panel contains additional information.</p><tp-button data-demo-close>Close</tp-button></tp-popover>
  <p data-demo-status role="status">Try the popover using its trigger.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Activate the page's trigger to open the panel. |
| Using the component | Use its controls or links, then close it with the available dismissal control. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Escape | Dismiss the panel when its settings allow it. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-popover>` as shown below.

```html
<tp-popover></tp-popover>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the information popover from its trigger, then close it.

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
<!-- tp-docgen:api TpPopover -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the anchor element. |
  | <code>backdrop</code> | <code>boolean</code> | <code>false</code> | Displays a transparent backdrop behind the popover. |
  | <code>offset</code> | <code>string</code> | <code>&quot;8px&quot;</code> | Distance between the anchor and the popover. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Opens the popover. |
  | <code>outside-click</code> | <code>boolean</code> | <code>false</code> | Closes the popover when the user clicks outside it. |
  | <code>placement</code> | <code>TpPopoverPlacement</code> | <code>&quot;bottom&quot;</code> | Popover placement relative to the anchor. |
  [Attributes of `<tp-popover>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>toggle</code> | <code>toggle(): void</code> | Toggles the popover. |
  [Public methods of `TpPopover`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-popover-toggle</code> | <code>&#123; backdrop: boolean; open: boolean; outsideClick: boolean; anchor: string; placement: &quot;top&quot; \| &quot;end&quot; \| &quot;bottom&quot; \| &quot;start&quot; &#125;</code> | Emitted when the popover open state changes. |
  [Events emitted by `<tp-popover>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-popover>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_popover.TpPopover.html)
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
  <script type="module" src="/path/to/components/popover/popover.js"></script>
  ```

import
: ```js
  import "/path/to/components/popover/popover.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/popover/popover.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-popover>` are loaded automatically by this component if they have not already been loaded by another component.

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
