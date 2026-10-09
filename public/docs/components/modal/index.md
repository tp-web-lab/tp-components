# <tp-icon name="modal" library="components" size="1.25em"></tp-icon> Modal

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-modal>` element implements the <tp-icon name="modal" library="components" size="1.25em"></tp-icon> Modal functionality: displays modal content above the page.

<tp-box data-intro-action="modal" data-allow-script>
  <tp-button id="intro-modal-trigger" data-demo-trigger>Open the modal</tp-button>
  <tp-modal backdrop outside-click aria-label="Example modal"><p>This panel contains additional information.</p><tp-button data-demo-close>Close</tp-button></tp-modal>
  <p data-demo-status role="status">Try the modal using its trigger.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
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
| Tab | Moves to the next focusable control and wraps inside the modal. |
| Shift+Tab | Moves to the previous focusable control and wraps inside the modal. |
| Escape | Closes the modal. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-modal>` as shown below.

```html
<tp-modal></tp-modal>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the modal from its trigger and close it after inspecting its content.

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
<!-- tp-docgen:api TpModal -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>backdrop</code> | <code>boolean</code> | <code>false</code> | Displays a backdrop behind the modal. |
  | <code>breakout</code> | <code>boolean</code> | <code>false</code> | Allows the modal to ignore the default containment constraints. |
  | <code>fixed</code> | <code>boolean</code> | <code>false</code> | Positions the modal relative to the viewport. |
  | <code>margin</code> | <code>string</code> | <code>&quot;&quot;</code> | Margin used when the modal is contained by the viewport. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Opens the modal. |
  | <code>outside-click</code> | <code>boolean</code> | <code>false</code> | Closes the modal when the user clicks outside it. |
  [Attributes of `<tp-modal>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpModal`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-modal-toggle</code> | <code>&#123; backdrop: boolean; open: boolean; outsideClick: boolean; breakout: boolean; fixed: boolean &#125;</code> | Emitted when the modal open state changes. |
  [Events emitted by `<tp-modal>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-modal-margin</code> | <code>0px</code> | Margin used by the contained modal layout. |
  [CSS properties of `<tp-modal>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_modal.TpModal.html)
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
  <script type="module" src="/path/to/components/modal/modal.js"></script>
  ```

import
: ```js
  import "/path/to/components/modal/modal.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/modal/modal.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-modal>` are loaded automatically by this component if they have not already been loaded by another component.

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
